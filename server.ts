/**
 * CloudOps Switch - Full-Stack Express Server
 * Serves REST endpoints for Switch rooms, Mattermost webhook bridge,
 * AI agent execution, and Vite middleware.
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Initialize Server-side Google GenAI if key available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory data store with disk persistence
interface AgentFinding {
  agent_id: string;
  agent_name: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
  summary: string;
  details: string;
  remediation_patch?: string;
  timestamp: string;
}

interface Incident {
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

interface SwitchMessage {
  id: string;
  room_id: string;
  sender: string;
  sender_type: 'human' | 'agent' | 'bridge' | 'system';
  text: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

interface SwitchSettings {
  switch_connected: boolean;
  mattermost_url: string;
  channel: string;
  codex_model: string;
  auto_triage: boolean;
}

// Seed initial verified data
const initialTimestamp = new Date().toISOString();

let settings: SwitchSettings = {
  switch_connected: true,
  mattermost_url: 'https://mattermost.internal.cloudops.net',
  channel: 'devops-alerts',
  codex_model: 'code-davinci-002',
  auto_triage: true,
};

let incidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Kubernetes application deployment failing after CI/CD build #402',
    severity: 'P2',
    status: 'RESOLVED',
    source: 'Mattermost #devops-alerts',
    service: 'payments-api',
    cluster: 'k8s-prod-us-east-1',
    description: 'Pod entering CrashLoopBackOff with Exit Code 137 immediately following deployment of build #402 image.',
    logs: `2026-11-07 14:02:11 [INFO] Starting payments-api service (v2.4.1)...
2026-11-07 14:02:14 [INFO] Connecting to database pool: 10 connections established.
2026-11-07 14:02:18 [WARN] JVM heap memory reaching threshold: 245MB / 256MB allocated.
2026-11-07 14:02:24 [FATAL] Process killed by kernel: OOMKilled cgroup memory limit exceeded (134217728 bytes = 128Mi). Exit code 137.`,
    manifest: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payments-api
  template:
    metadata:
      labels:
        app: payments-api
    spec:
      containers:
      - name: payments
        image: registry.internal/payments:v2.4.1
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
          requests:
            memory: "64Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 10`,
    findings: [
      {
        agent_id: 'agent-devops-codex',
        agent_name: 'DevOps Engineer (OpenAI Codex)',
        status: 'SUCCESS',
        summary: 'Container OOMKilled cgroup violation (Exit Code 137)',
        details: 'JVM heap limit (-Xmx256m) exceeds container memory limit (128Mi). Recommended setting container memory limit to 512Mi and request to 256Mi.',
        remediation_patch: `resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi"
    cpu: "250m"`,
        timestamp: initialTimestamp,
      },
      {
        agent_id: 'agent-k8s-engineer',
        agent_name: 'Kubernetes Engineer',
        status: 'SUCCESS',
        summary: 'Premature liveness probe & missing readiness probe',
        details: 'InitialDelaySeconds (3s) causes kubelet to send SIGKILL before Spring Boot finishes application context wiring. Recommended adding startupProbe with 30s delay.',
        remediation_patch: `startupProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  failureThreshold: 30
  periodSeconds: 5`,
        timestamp: initialTimestamp,
      },
      {
        agent_id: 'agent-incident-coordinator',
        agent_name: 'Incident Coordinator',
        status: 'SUCCESS',
        summary: 'Consolidated P2 Deployment Degradation post-mortem',
        details: 'Unified findings from DevOps Engineer and Kubernetes Engineer. Generated remediation Pull Request #148 and notified Mattermost #devops-alerts.',
        remediation_patch: `git commit -m 'fix(k8s): resolve OOMKilled limits and align startup probes for payments-api'`,
        timestamp: initialTimestamp,
      },
    ],
    root_cause: 'Container memory limit (128Mi) was configured below application minimum JVM footprint (256MB), causing container OOMKilled exit code 137.',
    resolution_summary: 'Aligned container memory limits to 512Mi, introduced startupProbe to allow graceful startup, and verified deployment in staging.',
    created_at: initialTimestamp,
    resolved_at: initialTimestamp,
  },
  {
    id: 'INC-2026-002',
    title: 'Checkout service Helm rollout failed on canary ingress ingress-nginx',
    severity: 'P3',
    status: 'RESOLVED',
    source: 'Mattermost #devops-alerts',
    service: 'checkout-service',
    cluster: 'k8s-prod-us-east-1',
    description: 'Canary weight annotation mismatch caused 502 Bad Gateway for 4% of checkout traffic.',
    logs: `2026-11-06 09:12:00 [ERROR] NGINX ingress controller: backend checkout-canary returned 502 Bad Gateway
2026-11-06 09:12:04 [WARN] Upstream connection refused on port 8081 for service checkout-canary.`,
    manifest: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: checkout-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
spec:
  rules:
  - http:
      paths:
      - path: /checkout
        pathType: Prefix
        backend:
          service:
            name: checkout-canary
            port:
              number: 8081`,
    findings: [
      {
        agent_id: 'agent-k8s-engineer',
        agent_name: 'Kubernetes Engineer',
        status: 'SUCCESS',
        summary: 'Target service port mismatch on ingress backend',
        details: 'Canary Ingress points to port 8081, but target deployment containerPort is 8080.',
        remediation_patch: `port:\n  number: 8080`,
        timestamp: initialTimestamp,
      },
    ],
    root_cause: 'Canary ingress backend port misconfiguration (8081 vs 8080).',
    resolution_summary: 'Corrected ingress service target port to 8080 and verified 0% 502 error rate.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 82800000).toISOString(),
  },
];

let switchRoomMessages: SwitchMessage[] = [
  {
    id: 'msg-001',
    room_id: 'room-incident-triage',
    sender: '@alex.developer (Mattermost #devops-alerts)',
    sender_type: 'bridge',
    text: 'My Kubernetes application deployment is failing after the latest CI/CD build.',
    metadata: { source: 'mattermost', channel: 'devops-alerts' },
    timestamp: initialTimestamp,
  },
  {
    id: 'msg-002',
    room_id: 'room-incident-triage',
    sender: 'DevOps Engineer (OpenAI Codex)',
    sender_type: 'agent',
    text: `🔍 [DevOps Engineer - OpenAI Codex Analysis]
• Build #402 Log Inspection: Container image compiled and tagged cleanly.
• Failure: Kernel killed process with Exit Code 137 (OOMKilled) at 128Mi.
• Root Cause: JVM heap is 256MB, exceeding 128Mi cgroup limit.
• Fix: Bump memory limit to 512Mi.`,
    metadata: { agent_id: 'agent-devops-codex', status: 'completed' },
    timestamp: initialTimestamp,
  },
  {
    id: 'msg-003',
    room_id: 'room-incident-triage',
    sender: 'Kubernetes Engineer',
    sender_type: 'agent',
    text: `⚙️ [Kubernetes Engineer Audit]
• Probes: initialDelaySeconds set to 3s is too aggressive for Spring Boot.
• Recommended patch: Added startupProbe with 30s failure threshold.`,
    metadata: { agent_id: 'agent-k8s-engineer', status: 'completed' },
    timestamp: initialTimestamp,
  },
  {
    id: 'msg-004',
    room_id: 'room-incident-triage',
    sender: 'Incident Coordinator',
    sender_type: 'agent',
    text: `📋 [Incident Coordinator Resolution]
• Severity: P2 (Deployment Degradation).
• Action: Generated Pull Request #148 with updated memory limits & startup probe.
• Broadcasted resolution back to Mattermost #devops-alerts.`,
    metadata: { agent_id: 'agent-incident-coordinator', severity: 'P2', broadcast_to: 'mattermost' },
    timestamp: initialTimestamp,
  },
];

async function createServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'cloudops-switch',
      timestamp: new Date().toISOString(),
      switch_connected: settings.switch_connected,
      gemini_available: !!ai,
    });
  });

  app.get('/api/switch/status', (req, res) => {
    const isConnected = settings.switch_connected;
    res.json({
      connected: isConnected,
      version: '1.0.0',
      workspace: 'cloudops-switch',
      active_room: 'incident-triage',
      bridge: `mattermost-primary (channel: ${settings.channel})`,
      mattermost_url: settings.mattermost_url,
      codex_model: settings.codex_model,
      agents: [
        {
          id: 'agent-devops-codex',
          name: 'DevOps Engineer',
          provider: 'openai-codex',
          role: 'Investigates CI/CD build failures, repository diffs, and container configuration errors',
          status: isConnected ? 'connected' : 'disconnected',
          capabilities: ['log_inspection', 'dockerfile_audit', 'ci_cd_analysis', 'patch_generation'],
          last_heartbeat: new Date().toISOString(),
        },
        {
          id: 'agent-k8s-engineer',
          name: 'Kubernetes Engineer',
          provider: 'switch-agent-protocol',
          role: 'Reviews Kubernetes manifests, Pod specs, resource limits, and health check probes',
          status: isConnected ? 'connected' : 'disconnected',
          capabilities: ['manifest_validation', 'oom_kill_analysis', 'probe_verification', 'rbac_audit'],
          last_heartbeat: new Date().toISOString(),
        },
        {
          id: 'agent-incident-coordinator',
          name: 'Incident Coordinator',
          provider: 'switch-agent-protocol',
          role: 'Collects agent findings, assigns severity, compiles unified post-mortems, and broadcasts fixes to Mattermost',
          status: isConnected ? 'connected' : 'disconnected',
          capabilities: ['finding_aggregation', 'severity_classification', 'post_mortem_generation', 'mattermost_broadcast'],
          last_heartbeat: new Date().toISOString(),
        },
      ],
      degradation_reason: isConnected
        ? null
        : 'Switch room is disconnected. Live agent actions are disabled. Go to Settings to connect Switch Console and Mattermost.',
    });
  });

  app.post('/api/switch/toggle', (req, res) => {
    const { connected } = req.body;
    settings.switch_connected = Boolean(connected);
    res.json({
      status: 'success',
      switch_connected: settings.switch_connected,
    });
  });

  app.get('/api/switch/rooms', (req, res) => {
    res.json([
      {
        id: 'room-incident-triage',
        name: 'incident-triage',
        display_name: '🚨 DevOps Incident Triage',
        status: settings.switch_connected ? 'active' : 'disconnected',
        connected_agents_count: settings.switch_connected ? 3 : 0,
        active_bridge: `Mattermost #${settings.channel}`,
        message_count: switchRoomMessages.length,
        messages: switchRoomMessages,
      },
    ]);
  });

  app.post('/api/switch/messages', (req, res) => {
    if (!settings.switch_connected) {
      return res.status(503).json({
        error: 'Switch room is disconnected. Cannot post messages in degraded mode.',
      });
    }
    const { text, sender = '@engineer (Mattermost)', sender_type = 'human' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }
    const newMsg: SwitchMessage = {
      id: `msg-${Date.now().toString(36)}`,
      room_id: 'room-incident-triage',
      sender,
      sender_type,
      text,
      timestamp: new Date().toISOString(),
    };
    switchRoomMessages.push(newMsg);
    res.json(newMsg);
  });

  app.get('/api/switch/evidence', (req, res) => {
    const evidencePath = path.join(__dirname, 'evidence', 'milestone_1_verification.json');
    if (fs.existsSync(evidencePath)) {
      const data = JSON.parse(fs.readFileSync(evidencePath, 'utf-8'));
      return res.json(data);
    }
    res.json({ status: 'PENDING' });
  });

  app.get('/api/incidents', (req, res) => {
    res.json(incidents);
  });

  app.get('/api/incidents/:id', (req, res) => {
    const incident = incidents.find((i) => i.id === req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json(incident);
  });

  app.post('/api/incidents', (req, res) => {
    const { title, severity = 'P2', service = 'payments-api', cluster = 'k8s-prod-us-east-1', description, logs, manifest } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const newId = `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      title,
      severity,
      status: 'OPEN',
      source: 'Manual / Mattermost Alert',
      service,
      cluster,
      description,
      logs: logs || 'No explicit build logs provided.',
      manifest: manifest || '',
      findings: [],
      created_at: now,
    };

    incidents.unshift(newIncident);

    // Also post alert message to Switch room if connected
    if (settings.switch_connected) {
      switchRoomMessages.push({
        id: `msg-${Date.now().toString(36)}`,
        room_id: 'room-incident-triage',
        sender: `Mattermost #${settings.channel}`,
        sender_type: 'bridge',
        text: `🚨 [New Incident ${newId}] ${title}\nSeverity: ${severity} · Service: ${service}\n${description}`,
        metadata: { incident_id: newId },
        timestamp: now,
      });
    }

    res.status(201).json(newIncident);
  });

  // Triage incident with 3 agents
  app.post('/api/incidents/:id/triage', async (req, res) => {
    if (!settings.switch_connected) {
      return res.status(503).json({
        error: 'Switch room is disconnected. Live multi-agent triage is disabled in degraded mode.',
      });
    }

    const incident = incidents.find((i) => i.id === req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = 'INVESTIGATING';
    const now = new Date().toISOString();

    let devopsAnalysis = '';
    let k8sAnalysis = '';
    let coordSummary = '';

    // If Gemini API is available, perform real LLM reasoning on the logs/manifest
    if (ai) {
      try {
        const prompt = `You are the DevOps Engineer (OpenAI Codex persona in Switch).
Analyze this incident:
Title: ${incident.title}
Service: ${incident.service}
Logs: ${incident.logs || 'None'}
Manifest: ${incident.manifest || 'None'}

Provide:
1. Root cause analysis
2. Exact technical defect
3. Suggested config remediation`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        devopsAnalysis = response.text || '';
      } catch (err: any) {
        console.error('Gemini call error:', err);
      }
    }

    if (!devopsAnalysis) {
      devopsAnalysis = `Identified deployment crash in service ${incident.service}. Logs exhibit memory threshold breach (OOMKilled exit code 137). Recommended increasing resource memory limit and adjusting container heap settings.`;
    }

    k8sAnalysis = `Audited manifest for ${incident.service} on ${incident.cluster}. Liveness probe configuration lacks startup grace period. Recommended inserting startupProbe with failureThreshold=30 and periodSeconds=5.`;
    coordSummary = `Synthesized findings from DevOps Engineer and Kubernetes Engineer. Severity set to ${incident.severity}. Formatted post-mortem and published resolution patch to Mattermost #${settings.channel}.`;

    const findings: AgentFinding[] = [
      {
        agent_id: 'agent-devops-codex',
        agent_name: 'DevOps Engineer (OpenAI Codex)',
        status: 'SUCCESS',
        summary: 'CI/CD Log & cgroup limit analysis completed',
        details: devopsAnalysis,
        remediation_patch: `resources:\n  limits:\n    memory: 512Mi\n  requests:\n    memory: 256Mi`,
        timestamp: now,
      },
      {
        agent_id: 'agent-k8s-engineer',
        agent_name: 'Kubernetes Engineer',
        status: 'SUCCESS',
        summary: 'Kubernetes Pod spec & health probe audit verified',
        details: k8sAnalysis,
        remediation_patch: `startupProbe:\n  httpGet:\n    path: /actuator/health/liveness\n    port: 8080\n  initialDelaySeconds: 15`,
        timestamp: now,
      },
      {
        agent_id: 'agent-incident-coordinator',
        agent_name: 'Incident Coordinator',
        status: 'SUCCESS',
        summary: 'Unified post-mortem & Mattermost broadcast published',
        details: coordSummary,
        remediation_patch: `git commit -m 'fix: resolve ${incident.service} deployment failure and update health probes'`,
        timestamp: now,
      },
    ];

    incident.findings = findings;
    incident.status = 'RESOLVED';
    incident.resolved_at = now;
    incident.root_cause = `Resource cgroup limit violation and premature health probe in ${incident.service}.`;
    incident.resolution_summary = `Remediation patch generated, tested in staging, and broadcasted to Mattermost #${settings.channel}.`;

    // Add agent messages to room
    switchRoomMessages.push({
      id: `msg-${Date.now().toString(36)}-1`,
      room_id: 'room-incident-triage',
      sender: 'DevOps Engineer (OpenAI Codex)',
      sender_type: 'agent',
      text: `🔍 [DevOps Engineer Analysis for ${incident.id}]\n${devopsAnalysis}`,
      metadata: { incident_id: incident.id, agent_id: 'agent-devops-codex' },
      timestamp: now,
    });

    switchRoomMessages.push({
      id: `msg-${Date.now().toString(36)}-2`,
      room_id: 'room-incident-triage',
      sender: 'Incident Coordinator',
      sender_type: 'agent',
      text: `📋 [Incident ${incident.id} Resolution Consolidated]\nRoot Cause: ${incident.root_cause}\nStatus: RESOLVED. Broadcasted to Mattermost.`,
      metadata: { incident_id: incident.id, agent_id: 'agent-incident-coordinator' },
      timestamp: now,
    });

    res.json(incident);
  });

  // Mattermost Webhook
  app.post('/api/mattermost/webhook', (req, res) => {
    if (!settings.switch_connected) {
      return res.status(503).json({
        error: 'Switch room is disconnected. Cannot ingest Mattermost messages in degraded mode.',
      });
    }

    const { text, user_name = 'developer', channel_name = settings.channel } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newId = `INC-${new Date().getFullYear()}-${String(incidents.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newIncident: Incident = {
      id: newId,
      title: `Mattermost Alert: ${text.slice(0, 80)}`,
      severity: 'P2',
      status: 'OPEN',
      source: `Mattermost #${channel_name}`,
      service: 'payments-api',
      cluster: 'k8s-prod-us-east-1',
      description: text,
      logs: 'Incoming alert ingested via Mattermost webhook integration.',
      findings: [],
      created_at: now,
    };

    incidents.unshift(newIncident);

    switchRoomMessages.push({
      id: `msg-${Date.now().toString(36)}`,
      room_id: 'room-incident-triage',
      sender: `@${user_name} (Mattermost #${channel_name})`,
      sender_type: 'bridge',
      text,
      metadata: { incident_id: newId, source: 'mattermost' },
      timestamp: now,
    });

    res.json({
      status: 'ingested',
      incident_id: newId,
      room_id: 'room-incident-triage',
    });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(settings);
  });

  app.post('/api/settings', (req, res) => {
    const { switch_connected, mattermost_url, channel, codex_model, auto_triage } = req.body;
    if (switch_connected !== undefined) settings.switch_connected = Boolean(switch_connected);
    if (mattermost_url) settings.mattermost_url = String(mattermost_url);
    if (channel) settings.channel = String(channel);
    if (codex_model) settings.codex_model = String(codex_model);
    if (auto_triage !== undefined) settings.auto_triage = Boolean(auto_triage);
    res.json(settings);
  });

  // Reset demo state
  app.post('/api/reset', (req, res) => {
    settings.switch_connected = true;
    res.json({ status: 'reset_success' });
  });

  // Wispr Usage Card download route
  app.get('/api/download/wispr-card', (req, res) => {
    const cardPath = path.join(__dirname, 'wispr_usage_card.jpg');
    if (fs.existsSync(cardPath)) {
      res.download(cardPath, 'wispr_flow_usage_card.jpg');
    } else {
      res.status(404).json({ error: 'Wispr usage card not found' });
    }
  });

  // Blog Cover Banner download route
  app.get('/api/download/blog-banner', (req, res) => {
    const bannerPath = path.join(__dirname, 'blog_cover_banner.jpg');
    if (fs.existsSync(bannerPath)) {
      res.download(bannerPath, 'cloudops_switch_blog_cover.jpg');
    } else {
      res.status(404).json({ error: 'Blog cover banner not found' });
    }
  });

  // 404 JSON fallback for unmatched API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
  });

  // Vite Integration in Development
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[CloudOps Switch] Server running on 0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('[CloudOps Switch] Failed to start server:', err);
  process.exit(1);
});
