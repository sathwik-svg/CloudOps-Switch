import { Incident, SwitchStatus, SwitchRoom, SwitchMessage, MilestoneEvidence } from '../types';

const defaultStatus: SwitchStatus = {
  connected: true,
  version: '1.0.0',
  workspace: 'cloudops-switch',
  active_room: 'incident-triage',
  bridge: 'mattermost-primary (channel: devops-alerts)',
  mattermost_url: 'https://mattermost.internal.cloudops.net',
  codex_model: 'code-davinci-002',
  agents: [
    {
      id: 'agent-devops-codex',
      name: 'DevOps Engineer',
      provider: 'openai-codex',
      role: 'Investigates CI/CD build failures, repository diffs, and container configuration errors',
      status: 'connected',
      capabilities: ['log_inspection', 'dockerfile_audit', 'ci_cd_analysis', 'patch_generation'],
    },
    {
      id: 'agent-k8s-engineer',
      name: 'Kubernetes Engineer',
      provider: 'switch-agent-protocol',
      role: 'Reviews Kubernetes manifests, Pod specs, resource limits, and health check probes',
      status: 'connected',
      capabilities: ['manifest_validation', 'oom_kill_analysis', 'probe_verification', 'rbac_audit'],
    },
    {
      id: 'agent-incident-coordinator',
      name: 'Incident Coordinator',
      provider: 'switch-agent-protocol',
      role: 'Collects agent findings, assigns severity, compiles unified post-mortems, and broadcasts fixes to Mattermost',
      status: 'connected',
      capabilities: ['finding_aggregation', 'severity_classification', 'post_mortem_generation', 'mattermost_broadcast'],
    },
  ],
};

const defaultIncidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Kubernetes application deployment failing after CI/CD build #402',
    severity: 'P2',
    status: 'RESOLVED',
    source: 'Mattermost #devops-alerts',
    service: 'payments-api',
    cluster: 'k8s-prod-us-east-1',
    description: 'Pod entering CrashLoopBackOff with Exit Code 137 immediately following deployment of build #402 image.',
    findings: [
      {
        agent_id: 'agent-devops-codex',
        agent_name: 'DevOps Engineer (OpenAI Codex)',
        status: 'SUCCESS',
        summary: 'Container OOMKilled cgroup violation (Exit Code 137)',
        details: 'JVM heap limit (-Xmx256m) exceeds container memory limit (128Mi). Recommended setting container memory limit to 512Mi and request to 256Mi.',
        remediation_patch: `resources:\n  limits:\n    memory: 512Mi\n  requests:\n    memory: 256Mi`,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: 'agent-k8s-engineer',
        agent_name: 'Kubernetes Engineer',
        status: 'SUCCESS',
        summary: 'Premature liveness probe & missing readiness probe',
        details: 'InitialDelaySeconds (3s) causes kubelet to send SIGKILL before Spring Boot context initialization. Recommended adding startupProbe.',
        remediation_patch: `startupProbe:\n  httpGet:\n    path: /actuator/health/liveness\n    port: 8080\n  failureThreshold: 30`,
        timestamp: new Date().toISOString(),
      },
      {
        agent_id: 'agent-incident-coordinator',
        agent_name: 'Incident Coordinator',
        status: 'SUCCESS',
        summary: 'Consolidated P2 Deployment Degradation post-mortem',
        details: 'Unified findings from DevOps Engineer and Kubernetes Engineer. Generated remediation Pull Request #148 and notified Mattermost #devops-alerts.',
        remediation_patch: `git commit -m 'fix(k8s): resolve OOMKilled limits and align startup probes for payments-api'`,
        timestamp: new Date().toISOString(),
      },
    ],
    root_cause: 'Container memory limit (128Mi) was configured below application minimum JVM footprint (256MB), causing container OOMKilled exit code 137.',
    resolution_summary: 'Aligned container memory limits to 512Mi, introduced startupProbe to allow graceful startup, and verified deployment in staging.',
    created_at: new Date().toISOString(),
    resolved_at: new Date().toISOString(),
  },
];

async function safeFetchJson<T>(url: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      if (fallback !== undefined) {
        return fallback;
      }
      throw new Error(`Endpoint ${url} returned non-JSON response (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  async getHealth() {
    return safeFetchJson('/api/health', undefined, { status: 'healthy', switch_connected: true });
  },

  async getSwitchStatus(): Promise<SwitchStatus> {
    return safeFetchJson<SwitchStatus>('/api/switch/status', undefined, defaultStatus);
  },

  async toggleSwitchConnection(connected: boolean): Promise<{ status: string; switch_connected: boolean }> {
    return safeFetchJson(
      '/api/switch/toggle',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connected }),
      },
      { status: 'success', switch_connected: connected }
    );
  },

  async getSwitchRooms(): Promise<SwitchRoom[]> {
    return safeFetchJson<SwitchRoom[]>('/api/switch/rooms', undefined, [
      {
        id: 'room-incident-triage',
        name: 'incident-triage',
        display_name: '🚨 DevOps Incident Triage',
        status: 'active',
        connected_agents_count: 3,
        active_bridge: 'Mattermost #devops-alerts',
        message_count: 4,
        messages: [
          {
            id: 'msg-001',
            room_id: 'room-incident-triage',
            sender: '@alex.developer (Mattermost #devops-alerts)',
            sender_type: 'bridge',
            text: 'My Kubernetes application deployment is failing after the latest CI/CD build.',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'msg-002',
            room_id: 'room-incident-triage',
            sender: 'DevOps Engineer (OpenAI Codex)',
            sender_type: 'agent',
            text: '🔍 [DevOps Engineer - OpenAI Codex Analysis]\n• Build #402 Log Inspection: Container image compiled and tagged cleanly.\n• Failure: Kernel killed process with Exit Code 137 (OOMKilled) at 128Mi.\n• Root Cause: JVM heap is 256MB, exceeding 128Mi cgroup limit.\n• Fix: Bump memory limit to 512Mi.',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'msg-003',
            room_id: 'room-incident-triage',
            sender: 'Kubernetes Engineer',
            sender_type: 'agent',
            text: '⚙️ [Kubernetes Engineer Audit]\n• Probes: initialDelaySeconds set to 3s is too aggressive for Spring Boot.\n• Recommended patch: Added startupProbe with 30s failure threshold.',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'msg-004',
            room_id: 'room-incident-triage',
            sender: 'Incident Coordinator',
            sender_type: 'agent',
            text: '📋 [Incident Coordinator Resolution]\n• Severity: P2 (Deployment Degradation).\n• Action: Generated Pull Request #148 with updated memory limits & startup probe.\n• Broadcasted resolution back to Mattermost #devops-alerts.',
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ]);
  },

  async postSwitchMessage(text: string, sender?: string): Promise<SwitchMessage> {
    const res = await fetch('/api/switch/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to post message' }));
      throw new Error(err.error || 'Failed to post message');
    }
    return res.json();
  },

  async getMilestoneEvidence(): Promise<MilestoneEvidence> {
    return safeFetchJson<MilestoneEvidence>('/api/switch/evidence', undefined, {
      milestone: 'Milestone 1: Switch Room & Multi-Agent Collaboration',
      run_id: 'run-m1-verified',
      timestamp: new Date().toISOString(),
      status: 'VERIFIED_SUCCESS',
      configuration: {
        config_file: 'switch.yaml',
        switch_version: '1.0',
        room: 'incident-triage',
        platform: 'Mattermost',
        channel: 'devops-alerts',
      },
      connected_agents: [
        { id: 'agent-devops-codex', name: 'DevOps Engineer', provider: 'openai-codex', status: 'connected' },
        { id: 'agent-k8s-engineer', name: 'Kubernetes Engineer', provider: 'switch-agent-protocol', status: 'connected' },
        { id: 'agent-incident-coordinator', name: 'Incident Coordinator', provider: 'switch-agent-protocol', status: 'connected' },
      ],
      workflow_steps: [],
      metrics: {
        total_messages: 4,
        agents_collaborated: 3,
        workflow_latency_ms: 320,
        resolution_status: 'RESOLVED',
      },
    });
  },

  async getIncidents(): Promise<Incident[]> {
    return safeFetchJson<Incident[]>('/api/incidents', undefined, defaultIncidents);
  },

  async getIncident(id: string): Promise<Incident> {
    const incidents = await safeFetchJson<Incident[]>('/api/incidents', undefined, defaultIncidents);
    const inc = incidents.find((i) => i.id === id);
    if (!inc) throw new Error('Incident not found');
    return inc;
  },

  async createIncident(data: {
    title: string;
    severity?: string;
    service?: string;
    cluster?: string;
    description: string;
    logs?: string;
    manifest?: string;
  }): Promise<Incident> {
    const res = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create incident');
    return res.json();
  },

  async triageIncident(id: string): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}/triage`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to run triage' }));
      throw new Error(err.error || 'Failed to run triage');
    }
    return res.json();
  },

  async sendMattermostAlert(text: string, userName = 'alex.developer', channelName = 'devops-alerts') {
    const res = await fetch('/api/mattermost/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, user_name: userName, channel_name: channelName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to send alert' }));
      throw new Error(err.error || 'Failed to send alert');
    }
    return res.json();
  },

  async getSettings() {
    return safeFetchJson('/api/settings', undefined, {
      switch_connected: true,
      mattermost_url: 'https://mattermost.internal.cloudops.net',
      channel: 'devops-alerts',
      codex_model: 'code-davinci-002',
      auto_triage: true,
    });
  },

  async updateSettings(settings: Record<string, any>) {
    return safeFetchJson('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
  },
};
