export interface AgentInfo {
  id: string;
  name: string;
  provider: string;
  role: string;
  status: 'connected' | 'disconnected' | 'running' | 'failed';
  capabilities: string[];
  last_heartbeat?: string;
}

export interface AgentFinding {
  agent_id: string;
  agent_name: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
  summary: string;
  details: string;
  remediation_patch?: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  source: string;
  service: string;
  cluster: string;
  description: string;
  logs?: string;
  manifest?: string;
  findings: AgentFinding[];
  root_cause?: string;
  resolution_summary?: string;
  created_at: string;
  resolved_at?: string;
}

export interface SwitchMessage {
  id: string;
  room_id: string;
  sender: string;
  sender_type: 'human' | 'agent' | 'bridge' | 'system';
  text: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface SwitchStatus {
  connected: boolean;
  version: string;
  workspace: string;
  active_room: string;
  bridge: string;
  mattermost_url: string;
  codex_model: string;
  agents: AgentInfo[];
  degradation_reason?: string | null;
}

export interface SwitchRoom {
  id: string;
  name: string;
  display_name: string;
  status: string;
  connected_agents_count: number;
  active_bridge: string;
  message_count: number;
  messages: SwitchMessage[];
}

export interface MilestoneEvidence {
  milestone: string;
  run_id: string;
  timestamp: string;
  status: string;
  configuration: {
    config_file: string;
    switch_version: string;
    room: string;
    platform: string;
    channel: string;
  };
  connected_agents: Array<{
    id: string;
    name: string;
    provider: string;
    status: string;
  }>;
  workflow_steps: Array<{
    step: number;
    action: string;
    detail: string;
    message?: any;
    dispatch?: any;
  }>;
  metrics: {
    total_messages: number;
    agents_collaborated: number;
    workflow_latency_ms: number;
    resolution_status: string;
  };
}
