import React from 'react';
import { SwitchStatus } from '../types';
import { Cpu, Terminal, CheckCircle2, ShieldAlert, Radio, Clock, Code, Activity } from 'lucide-react';

interface AgentControlViewProps {
  switchStatus: SwitchStatus | null;
  onSelectTab: (tab: string) => void;
}

export const AgentControlView: React.FC<AgentControlViewProps> = ({
  switchStatus,
  onSelectTab,
}) => {
  const isConnected = switchStatus?.connected ?? false;

  const agents = [
    {
      id: 'agent-devops-codex',
      name: 'DevOps Engineer',
      provider: 'OpenAI Codex (Official Supported Agent)',
      harness: 'codex-agent-v1',
      model: switchStatus?.codex_model || 'code-davinci-002',
      status: isConnected ? 'connected' : 'disconnected',
      role: 'Investigates CI/CD pipeline build failures, repository diffs, containerization layers, and kernel cgroup exit codes.',
      capabilities: [
        'CI/CD Pipeline Log Inspection',
        'Kernel Exit Code 137 / 139 Diagnosis',
        'Dockerfile & Cgroup Memory Profiling',
        'Automated Patch Formulation',
      ],
      assignedRoom: '#incident-triage',
      latency: '240ms',
      lastTask: 'Triage payments-api deployment build #402',
      lastFinding: 'Diagnosed OOMKilled 137: JVM heap (-Xmx256m) exceeded 128Mi cgroup memory limit.',
    },
    {
      id: 'agent-k8s-engineer',
      name: 'Kubernetes Engineer',
      provider: 'Switch Agent Protocol (Custom Harness)',
      harness: 'custom-k8s-evaluator',
      model: 'k8s-manifest-v1',
      status: isConnected ? 'connected' : 'disconnected',
      role: 'Reviews Kubernetes manifests, Pod specs, resource limits, startup/liveness/readiness probes, and ingress configurations.',
      capabilities: [
        'Kubernetes YAML Manifest Validation',
        'Liveness & Readiness Probe Timing',
        'Ingress Canary Weight & Target Port Audit',
        'K8s Schema API apps/v1 Compliance',
      ],
      assignedRoom: '#incident-triage',
      latency: '180ms',
      lastTask: 'Audit payments-api-deployment.yaml probe specifications',
      lastFinding: 'Detected initialDelaySeconds=3s killing Spring Boot before application context wiring.',
    },
    {
      id: 'agent-incident-coordinator',
      name: 'Incident Coordinator',
      provider: 'Switch Agent Protocol (Synthesis Engine)',
      harness: 'incident-synthesis-v1',
      model: 'incident-coordinator-v1',
      status: isConnected ? 'connected' : 'disconnected',
      role: 'Orchestrates multi-agent consensus, assigns severity (P1–P4), generates unified remediation patches, and broadcasts to Mattermost.',
      capabilities: [
        'Agent Finding Aggregation & Deduplication',
        'Severity Matrix Classification (P1-P4)',
        'Consolidated Post-Mortem Compilation',
        'Mattermost Webhook Broadcast Relay',
      ],
      assignedRoom: '#incident-triage',
      latency: '310ms',
      lastTask: 'Compile P2 Deployment Degradation post-mortem',
      lastFinding: 'Assembled Pull Request #148 and broadcasted resolution to Mattermost #devops-alerts.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            AI Agent Control Center
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Coordinated via Switch Room: #incident-triage</span>
            <span aria-hidden="true">·</span>
            <span>Switch Protocol v1.0</span>
            <span aria-hidden="true">·</span>
            <span>3 Registered AI Teammates</span>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('room')}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
        >
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Monitor Switch Room Activity</span>
        </button>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const isAgentConnected = agent.status === 'connected';

          return (
            <div
              key={agent.id}
              className={`p-5 rounded-lg border flex flex-col justify-between transition-all ${
                isAgentConnected
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-80'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-white font-display">
                      {agent.name}
                    </h2>
                    <div className="text-xs text-cyan-400 font-mono mt-0.5">
                      {agent.provider}
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                      isAgentConnected
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isAgentConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>

                {/* Role Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {agent.role}
                </p>

                {/* Capabilities */}
                <div className="mb-4">
                  <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider font-mono">
                    Registered Capabilities
                  </div>
                  <div className="space-y-1.5">
                    {agent.capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications & Room info */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
                  <div className="flex justify-between">
                    <span>Harness:</span>
                    <span className="text-slate-300">{agent.harness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Room:</span>
                    <span className="text-cyan-400">{agent.assignedRoom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Latency:</span>
                    <span className="text-slate-300">{agent.latency}</span>
                  </div>
                </div>
              </div>

              {/* Latest Task & Result */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                  <span className="font-semibold text-slate-300">Latest Completed Task</span>
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded text-xs space-y-1 font-mono">
                  <div className="text-slate-400 text-[11px] truncate">
                    &gt; {agent.lastTask}
                  </div>
                  <div className="text-slate-200 text-xs font-sans">
                    {agent.lastFinding}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Protocol Compliance Callout */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start gap-3 text-xs text-slate-400">
        <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold font-display">
            Official Switch Agent Protocol Verification:
          </strong>{' '}
          All three agents register with the Switch room coordinator via RFC-compliant JSON event envelopes (`room.agent_joined`, `task.dispatch`, `room.message`). When the Switch room is disconnected, agent execution is safely suspended to maintain strict audit integrity.
        </div>
      </div>
    </div>
  );
};
