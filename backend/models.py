"""
Pydantic Data Models for CloudOps Switch FastAPI Service
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AgentInfo(BaseModel):
    id: str
    name: str
    provider: str
    role: str
    status: str  # "connected", "disconnected", "running", "failed"
    capabilities: List[str]
    last_heartbeat: Optional[str] = None

class SwitchRoomInfo(BaseModel):
    id: str
    name: str
    display_name: str
    status: str
    connected_agents_count: int
    active_bridge: str

class SwitchStatusResponse(BaseModel):
    connected: bool
    version: str
    workspace: str
    active_room: str
    bridge: str
    agents: List[AgentInfo]
    degradation_reason: Optional[str] = None

class IncidentCreateRequest(BaseModel):
    title: str
    severity: str = "P2"
    source: str = "Mattermost"
    description: str
    service: str = "payments-api"
    cluster: str = "k8s-prod-us-east-1"
    logs: Optional[str] = None
    manifest: Optional[str] = None

class AgentFinding(BaseModel):
    agent_id: str
    agent_name: str
    status: str
    summary: str
    details: str
    remediation_patch: Optional[str] = None
    timestamp: str

class Incident(BaseModel):
    id: str
    title: str
    severity: str
    status: str  # "OPEN", "INVESTIGATING", "RESOLVED"
    source: str
    service: str
    cluster: str
    description: str
    logs: Optional[str] = None
    manifest: Optional[str] = None
    findings: List[AgentFinding] = []
    root_cause: Optional[str] = None
    resolution_summary: Optional[str] = None
    created_at: str
    resolved_at: Optional[str] = None

class MattermostWebhookPayload(BaseModel):
    channel_name: str = "devops-alerts"
    user_name: str = "developer"
    text: str
    trigger_word: Optional[str] = None
