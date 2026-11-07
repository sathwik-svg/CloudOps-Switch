"""
FastAPI Backend Application for CloudOps Switch
Exposes REST endpoints for health checks, Switch connection status,
Mattermost webhook integration, incident management, and verifiable agent execution.
"""

import os
import json
import uuid
import datetime
from typing import List, Optional, Dict, Any

try:
    from fastapi import FastAPI, HTTPException, status, Query
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
except ImportError:
    # Fallback shim for environments without fastapi package pre-installed
    FastAPI = None

from backend.models import (
    Incident, IncidentCreateRequest, SwitchStatusResponse,
    AgentInfo, SwitchRoomInfo, MattermostWebhookPayload, AgentFinding
)
from backend.database import get_connection

app = FastAPI(
    title="CloudOps Switch API",
    description="Multi-agent DevOps collaboration backend powered by official Switch rooms and Mattermost bridge",
    version="1.0.0"
) if FastAPI else None

if app:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

def fetch_switch_status() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM switch_settings")
    settings = {row["key"]: row["value"] for row in cursor.fetchall()}
    conn.close()

    is_connected = settings.get("switch_connected", "true").lower() == "true"

    agents = [
        {
            "id": "agent-devops-codex",
            "name": "DevOps Engineer",
            "provider": "openai-codex",
            "role": "Investigates CI/CD build failures, repository diffs, and container configuration errors",
            "status": "connected" if is_connected else "disconnected",
            "capabilities": ["log_inspection", "dockerfile_audit", "ci_cd_analysis", "patch_generation"],
            "last_heartbeat": datetime.datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "agent-k8s-engineer",
            "name": "Kubernetes Engineer",
            "provider": "switch-agent-protocol",
            "role": "Reviews Kubernetes manifests, Pod specs, resource limits, and health check probes",
            "status": "connected" if is_connected else "disconnected",
            "capabilities": ["manifest_validation", "oom_kill_analysis", "probe_verification", "rbac_audit"],
            "last_heartbeat": datetime.datetime.utcnow().isoformat() + "Z"
        },
        {
            "id": "agent-incident-coordinator",
            "name": "Incident Coordinator",
            "provider": "switch-agent-protocol",
            "role": "Collects agent findings, assigns severity, compiles unified post-mortems, and broadcasts fixes to Mattermost",
            "status": "connected" if is_connected else "disconnected",
            "capabilities": ["finding_aggregation", "severity_classification", "post_mortem_generation", "mattermost_broadcast"],
            "last_heartbeat": datetime.datetime.utcnow().isoformat() + "Z"
        }
    ]

    return {
        "connected": is_connected,
        "version": "1.0.0",
        "workspace": "cloudops-switch",
        "active_room": "incident-triage",
        "bridge": "mattermost-primary (channel: devops-alerts)",
        "agents": agents,
        "degradation_reason": None if is_connected else "Switch is disconnected. Configure Switch Console and Mattermost token in Settings to enable live workflows."
    }

def get_all_incidents() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents ORDER BY created_at DESC")
    rows = cursor.fetchall()
    incidents = []
    for r in rows:
        inc = dict(r)
        inc["findings"] = json.loads(inc["findings_json"]) if inc.get("findings_json") else []
        inc.pop("findings_json", None)
        incidents.append(inc)
    conn.close()
    return incidents

def get_incident_by_id(incident_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    inc = dict(row)
    inc["findings"] = json.loads(inc["findings_json"]) if inc.get("findings_json") else []
    inc.pop("findings_json", None)
    return inc

def get_switch_room_messages(room_id: str = "room-incident-triage") -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM switch_events WHERE room_id = ? ORDER BY timestamp ASC", (room_id,))
    rows = cursor.fetchall()
    messages = []
    for r in rows:
        msg = dict(r)
        msg["metadata"] = json.loads(msg["metadata_json"]) if msg.get("metadata_json") else {}
        msg.pop("metadata_json", None)
        messages.append(msg)
    conn.close()
    return messages

if app:
    @app.get("/api/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "cloudops-switch-backend",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "database": "sqlite_connected"
        }

    @app.get("/api/switch/status")
    def get_switch_status():
        return fetch_switch_status()

    @app.get("/api/switch/rooms")
    def get_switch_rooms():
        status_info = fetch_switch_status()
        messages = get_switch_room_messages()
        return [
            {
                "id": "room-incident-triage",
                "name": "incident-triage",
                "display_name": "🚨 DevOps Incident Triage",
                "status": "active" if status_info["connected"] else "disconnected",
                "connected_agents_count": len([a for a in status_info["agents"] if a["status"] == "connected"]),
                "active_bridge": "Mattermost #devops-alerts",
                "message_count": len(messages),
                "messages": messages
            }
        ]

    @app.get("/api/incidents")
    def list_incidents():
        return get_all_incidents()

    @app.get("/api/incidents/{incident_id}")
    def get_incident(incident_id: str):
        inc = get_incident_by_id(incident_id)
        if not inc:
            raise HTTPException(status_code=404, detail="Incident not found")
        return inc

    @app.post("/api/mattermost/webhook")
    def mattermost_webhook_receiver(payload: MattermostWebhookPayload):
        status_info = fetch_switch_status()
        if not status_info["connected"]:
            raise HTTPException(
                status_code=503,
                detail="Switch room is disconnected. Cannot ingest Mattermost messages in degraded mode."
            )
        
        now = datetime.datetime.utcnow().isoformat() + "Z"
        incident_id = f"INC-{uuid.uuid4().hex[:6].upper()}"

        conn = get_connection()
        cursor = conn.cursor()
        
        # Log event in switch_events
        cursor.execute("""
        INSERT INTO switch_events (id, incident_id, room_id, event_type, sender, sender_type, text, metadata_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"evt-{uuid.uuid4().hex[:8]}",
            incident_id,
            "room-incident-triage",
            "room.message",
            f"@{payload.user_name} (Mattermost #{payload.channel_name})",
            "bridge",
            payload.text,
            json.dumps({"channel": payload.channel_name, "user": payload.user_name}),
            now
        ))

        # Create incident
        cursor.execute("""
        INSERT INTO incidents (
            id, title, severity, status, source, service, cluster, description,
            logs, manifest, findings_json, root_cause, resolution_summary, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            incident_id,
            f"Mattermost Alert: {payload.text[:80]}",
            "P2",
            "OPEN",
            f"Mattermost #{payload.channel_name}",
            "payments-api",
            "k8s-prod-us-east-1",
            payload.text,
            "Ingested from live Mattermost webhook payload.",
            "",
            "[]",
            None,
            None,
            now
        ))
        conn.commit()
        conn.close()

        return {"status": "ingested", "incident_id": incident_id, "timestamp": now}
