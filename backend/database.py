"""
SQLite Persistence Layer for CloudOps Switch
Stores persistent incident history, agent findings, Switch room messages, and configuration.
"""

import sqlite3
import os
import json
import uuid
import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "incidents.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        status TEXT NOT NULL,
        source TEXT NOT NULL,
        service TEXT NOT NULL,
        cluster TEXT NOT NULL,
        description TEXT NOT NULL,
        logs TEXT,
        manifest TEXT,
        findings_json TEXT,
        root_cause TEXT,
        resolution_summary TEXT,
        created_at TEXT NOT NULL,
        resolved_at TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS switch_events (
        id TEXT PRIMARY KEY,
        incident_id TEXT,
        room_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        sender TEXT NOT NULL,
        sender_type TEXT NOT NULL,
        text TEXT NOT NULL,
        metadata_json TEXT,
        timestamp TEXT NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS switch_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed initial verified incident if empty
    cursor.execute("SELECT COUNT(*) as count FROM incidents")
    row = cursor.fetchone()
    if row["count"] == 0:
        seed_initial_verified_data(conn)

    conn.close()

def seed_initial_verified_data(conn):
    cursor = conn.cursor()
    now = datetime.datetime.utcnow().isoformat() + "Z"

    initial_findings = [
        {
            "agent_id": "agent-devops-codex",
            "agent_name": "DevOps Engineer (OpenAI Codex)",
            "status": "SUCCESS",
            "summary": "Container OOMKilled cgroup violation (Exit Code 137)",
            "details": "JVM heap limit (-Xmx256m) exceeded Kubernetes container memory limit (128Mi). Recommended increasing container memory limit to 512Mi.",
            "remediation_patch": "resources:\n  limits:\n    memory: 512Mi\n  requests:\n    memory: 256Mi",
            "timestamp": now
        },
        {
            "agent_id": "agent-k8s-engineer",
            "agent_name": "Kubernetes Engineer",
            "status": "SUCCESS",
            "summary": "Premature liveness probe & missing readiness probe",
            "details": "Liveness probe initialDelaySeconds (3s) insufficient for Spring Boot initialization. Added startupProbe and configured readinessProbe with 15s initial delay.",
            "remediation_patch": "startupProbe:\n  httpGet:\n    path: /actuator/health/liveness\n    port: 8080\n  failureThreshold: 30\n  periodSeconds: 10",
            "timestamp": now
        },
        {
            "agent_id": "agent-incident-coordinator",
            "agent_name": "Incident Coordinator",
            "status": "SUCCESS",
            "summary": "Consolidated P2 Deployment Degradation post-mortem",
            "details": "Root causes verified across build logs and k8s manifest. Pull Request #148 prepared with corrected probe timeouts and memory limits. Broadcasted resolution to Mattermost #devops-alerts.",
            "remediation_patch": "git commit -m 'fix(k8s): resolve OOMKilled limits and startup probe timeouts'",
            "timestamp": now
        }
    ]

    cursor.execute("""
    INSERT INTO incidents (
        id, title, severity, status, source, service, cluster, description,
        logs, manifest, findings_json, root_cause, resolution_summary, created_at, resolved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "INC-2026-001",
        "Kubernetes application deployment failing after CI/CD build #402",
        "P2",
        "RESOLVED",
        "Mattermost #devops-alerts",
        "payments-api",
        "k8s-prod-us-east-1",
        "Pod entering CrashLoopBackOff with Exit Code 137 immediately following deployment of build #402 image.",
        "2026-11-07 14:02:11 [INFO] Starting payments-api service...\n2026-11-07 14:02:18 [WARN] JVM heap memory reaching threshold: 245MB/256MB\n2026-11-07 14:02:24 [ERROR] Killing process 1 (java): OOMKilled cgroup memory limit exceeded (134217728 bytes).",
        "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: payments-api\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: payments\n        image: registry.internal/payments:v2.4.1\n        resources:\n          limits:\n            memory: 128Mi\n          requests:\n            memory: 64Mi",
        json.dumps(initial_findings),
        "Memory cgroup limit (128Mi) lower than JVM allocation (256m) combined with premature liveness probe termination.",
        "Adjusted container memory limit to 512Mi and configured startupProbe to prevent premature health probe failure.",
        now,
        now
    ))

    # Also record room messages
    cursor.execute("""
    INSERT INTO switch_events (id, incident_id, room_id, event_type, sender, sender_type, text, metadata_json, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "evt-001",
        "INC-2026-001",
        "room-incident-triage",
        "room.message",
        "@alex.developer (Mattermost #devops-alerts)",
        "bridge",
        "My Kubernetes application deployment is failing after the latest CI/CD build.",
        json.dumps({"channel": "devops-alerts"}),
        now
    ))

    cursor.execute("""
    INSERT INTO switch_events (id, incident_id, room_id, event_type, sender, sender_type, text, metadata_json, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "evt-002",
        "INC-2026-001",
        "room-incident-triage",
        "room.message",
        "DevOps Engineer (OpenAI Codex)",
        "agent",
        "Identified container OOMKilled exit code 137. JVM heap parameter -Xmx256m exceeds container memory limit (128Mi). Recommended increasing limit to 512Mi.",
        json.dumps({"agent_id": "agent-devops-codex"}),
        now
    ))

    cursor.execute("""
    INSERT INTO switch_events (id, incident_id, room_id, event_type, sender, sender_type, text, metadata_json, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "evt-003",
        "INC-2026-001",
        "room-incident-triage",
        "room.message",
        "Incident Coordinator",
        "agent",
        "Consolidated findings. Remediation PR #148 generated with aligned cgroup memory and startupProbe. Alerted #devops-alerts on Mattermost.",
        json.dumps({"agent_id": "agent-incident-coordinator"}),
        now
    ))

    # Initial settings
    cursor.execute("INSERT OR REPLACE INTO switch_settings (key, value) VALUES ('switch_connected', 'true')")
    cursor.execute("INSERT OR REPLACE INTO switch_settings (key, value) VALUES ('mattermost_url', 'https://mattermost.internal.cloudops.net')")
    cursor.execute("INSERT OR REPLACE INTO switch_settings (key, value) VALUES ('codex_model', 'code-davinci-002')")

    conn.commit()

# Initialize DB on module load
init_db()
