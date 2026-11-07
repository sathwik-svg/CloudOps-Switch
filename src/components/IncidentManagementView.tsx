import React, { useState } from 'react';
import { Incident } from '../types';
import { AlertCircle, CheckCircle2, Clock, GitCommit, Play, Terminal, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

interface IncidentManagementViewProps {
  incidents: Incident[];
  selectedIncidentId: string | null;
  onSelectIncident: (id: string) => void;
  onTriageIncident: (id: string) => Promise<void>;
  isTriaging: boolean;
  switchConnected: boolean;
  onOpenNewIncident: () => void;
}

export const IncidentManagementView: React.FC<IncidentManagementViewProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onTriageIncident,
  isTriaging,
  switchConnected,
  onOpenNewIncident,
}) => {
  const activeIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Incident Management & Triage
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{incidents.length} Total Incidents Tracked</span>
            <span aria-hidden="true">·</span>
            <span>Persistence: SQLite incidents.db</span>
            <span aria-hidden="true">·</span>
            <span>Switch Multi-Agent Consensus</span>
          </div>
        </div>

        <button
          onClick={onOpenNewIncident}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded font-display transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
        >
          + File New Incident
        </button>
      </div>

      {/* Main Split: Incident List on Left, Detail & Findings on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Incident Selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider mb-2">
            Incident Queue
          </div>
          {incidents.map((inc) => {
            const isSelected = activeIncident?.id === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/80 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-200">{inc.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[11px] ${
                        inc.severity === 'P1'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : inc.severity === 'P2'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                      inc.status === 'RESOLVED'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : inc.status === 'INVESTIGATING'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <div className="font-medium text-slate-200 line-clamp-1">{inc.title}</div>
                <div className="text-slate-500 text-[11px] mt-1 font-mono">
                  {inc.service} · {inc.cluster}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Active Incident Detailed Workspace */}
        {activeIncident && (
          <div className="lg:col-span-2 space-y-6">
            {/* Incident Header Card */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                    <span className="text-cyan-400 font-bold">{activeIncident.id}</span>
                    <span>·</span>
                    <span>Severity {activeIncident.severity}</span>
                    <span>·</span>
                    <span>Source: {activeIncident.source}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-display">
                    {activeIncident.title}
                  </h2>
                </div>

                {activeIncident.status !== 'RESOLVED' && (
                  <button
                    onClick={() => onTriageIncident(activeIncident.id)}
                    disabled={isTriaging || !switchConnected}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      switchConnected
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isTriaging ? 'Triaging with Agents...' : 'Run Multi-Agent Triage'}</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {activeIncident.description}
              </div>

              {activeIncident.root_cause && (
                <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded text-xs space-y-1">
                  <div className="text-cyan-300 font-semibold font-mono uppercase tracking-wider text-[11px]">
                    Identified Root Cause
                  </div>
                  <div className="text-slate-200">{activeIncident.root_cause}</div>
                </div>
              )}
            </div>

            {/* Aggregated Agent Findings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white font-display">
                  Coordinated Agent Findings ({activeIncident.findings?.length || 0})
                </h3>
                <span className="text-xs text-slate-500 font-mono">Switch Room Consensus</span>
              </div>

              {(!activeIncident.findings || activeIncident.findings.length === 0) ? (
                <div className="p-8 text-center bg-slate-900/30 border border-slate-800 rounded-lg text-slate-400 text-xs">
                  No agent findings recorded yet. Click &quot;Run Multi-Agent Triage&quot; above to dispatch tasks through the Switch room.
                </div>
              ) : (
                activeIncident.findings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-white">{finding.agent_name}</span>
                        <span className="text-slate-500 font-mono text-[11px]">[{finding.agent_id}]</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400">
                        {finding.status}
                      </span>
                    </div>

                    <div className="font-medium text-slate-200">{finding.summary}</div>
                    <p className="text-slate-400 leading-relaxed">{finding.details}</p>

                    {finding.remediation_patch && (
                      <div className="mt-2 pt-2 border-t border-slate-800">
                        <div className="text-[11px] font-mono text-slate-500 mb-1">
                          Remediation Patch / Command:
                        </div>
                        <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-300 overflow-x-auto">
                          {finding.remediation_patch}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Resolution Post-Mortem & Broadcast Summary */}
            {activeIncident.resolution_summary && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Consolidated Post-Mortem & Broadcast</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeIncident.resolution_summary}
                </p>
                <div className="text-slate-500 text-[11px] font-mono">
                  Resolved At: {new Date(activeIncident.resolved_at || activeIncident.created_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
