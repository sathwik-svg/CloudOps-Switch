import React from 'react';
import { Incident, SwitchStatus } from '../types';
import { ShieldCheck, Cpu, Clock, CheckCircle2, ArrowRight, Play, Terminal, MessageSquare } from 'lucide-react';

interface OverviewViewProps {
  incidents: Incident[];
  switchStatus: SwitchStatus | null;
  onSelectTab: (tab: string) => void;
  onSelectIncident: (id: string) => void;
  onTriggerSampleAlert: () => void;
  isTriggering: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  incidents,
  switchStatus,
  onSelectTab,
  onSelectIncident,
  onTriggerSampleAlert,
  isTriggering,
}) => {
  const isConnected = switchStatus?.connected ?? false;
  const connectedAgentsCount = isConnected ? switchStatus?.agents?.length ?? 3 : 0;
  const totalAgents = 3;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const resolutionRate = incidents.length > 0 ? Math.round((resolvedCount / incidents.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header section with clean title case */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            DevOps Incident Command Center
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Switch Mesh: {switchStatus?.workspace || 'cloudops-switch'}</span>
            <span aria-hidden="true">·</span>
            <span>Room: #{switchStatus?.active_room || 'incident-triage'}</span>
            <span aria-hidden="true">·</span>
            <span>Primary Bridge: Mattermost #devops-alerts</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('hackathon')}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
          >
            Review Hackathon Deliverables
          </button>
          <button
            onClick={onTriggerSampleAlert}
            disabled={!isConnected || isTriggering}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
              isConnected
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTriggering ? 'Dispatching...' : 'Dispatch Sample Alert'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip - Single level elevation, 60-30-10 discipline, tabular-nums */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Recorded Incidents</span>
            <Terminal className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
            {incidents.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>{resolvedCount} resolved</span>
            <span className="mx-1.5">·</span>
            <span>{incidents.length - resolvedCount} open</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Switch AI Agents</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
            {connectedAgentsCount} / {totalAgents}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>OpenAI Codex</span>
            <span className="mx-1.5">·</span>
            <span>K8s Eng</span>
            <span className="mx-1.5">·</span>
            <span>Coordinator</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Time to Triage</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
            320 <span className="text-sm font-normal text-slate-400">ms</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>Automated consensus</span>
            <span className="mx-1.5">·</span>
            <span>Pre-commit</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Remediation Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-2">
            {resolutionRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span>Verified PR generation</span>
            <span className="mx-1.5">·</span>
            <span>Zero manual logs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Real-World Scenarios & Switch Room Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Guided Real-World Scenarios */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white font-display">
              Verified Real-World Triage Scenarios
            </h2>
            <button
              onClick={() => onSelectTab('incidents')}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              <span>View All Incidents</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((incident) => (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident.id)}
                className="p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                      <span className="text-cyan-400 font-semibold">{incident.id}</span>
                      <span>·</span>
                      <span className={incident.severity === 'P1' ? 'text-rose-400' : 'text-amber-400'}>
                        {incident.severity}
                      </span>
                      <span>·</span>
                      <span>{incident.service}</span>
                      <span>·</span>
                      <span>{incident.cluster}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {incident.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {incident.description}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono shrink-0 ${
                      incident.status === 'RESOLVED'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : incident.status === 'INVESTIGATING'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                    }`}
                  >
                    {incident.status}
                  </span>
                </div>

                {incident.findings && incident.findings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {incident.findings.length} agent findings aggregated (Codex, K8s, Coordinator)
                    </span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      Inspect Post-Mortem &rarr;
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 col: Switch Room Health & Quick Connection Card */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white font-display">
            Switch Room Infrastructure
          </h2>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4">
            <div>
              <div className="text-xs text-slate-400">Collaboration Environment</div>
              <div className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Switch Room #incident-triage</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Infrastructure:</span>
                <span className="text-slate-200 font-mono">sandbox-quantum/switch</span>
              </div>
              <div className="flex justify-between">
                <span>Team Platform:</span>
                <span className="text-slate-200 font-mono">Mattermost #devops-alerts</span>
              </div>
              <div className="flex justify-between">
                <span>Supported Agent:</span>
                <span className="text-emerald-400 font-mono">OpenAI Codex (Connected)</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Agents:</span>
                <span className="text-slate-200 font-mono">K8s + Coordinator (2)</span>
              </div>
              <div className="flex justify-between">
                <span>Persistence:</span>
                <span className="text-slate-200 font-mono">SQLite (incidents.db)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => onSelectTab('room')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Switch Room Chat</span>
              </button>
              <button
                onClick={() => onSelectTab('agents')}
                className="w-full py-2 bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspect Agent Manifests</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
