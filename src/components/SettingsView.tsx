import React, { useState } from 'react';
import { SwitchStatus } from '../types';
import { Settings, Shield, Radio, Check, RefreshCw, Terminal, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SettingsViewProps {
  switchStatus: SwitchStatus | null;
  onToggleConnection: (connected: boolean) => Promise<void>;
  onUpdateSettings: (settings: Record<string, any>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  switchStatus,
  onToggleConnection,
  onUpdateSettings,
}) => {
  const [mattermostUrl, setMattermostUrl] = useState(
    switchStatus?.mattermost_url || 'https://mattermost.internal.cloudops.net'
  );
  const [channel, setChannel] = useState('devops-alerts');
  const [codexModel, setCodexModel] = useState(switchStatus?.codex_model || 'code-davinci-002');
  const [saved, setSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const isConnected = switchStatus?.connected ?? false;

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggleConnection(!isConnected);
    } finally {
      setIsToggling(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings({
      mattermost_url: mattermostUrl,
      channel,
      codex_model: codexModel,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const switchYamlContent = `# Official Switch Configuration (sandbox-quantum/switch)
version: "1.0"
workspace:
  name: "cloudops-switch"
  displayName: "CloudOps Switch"

rooms:
  - id: "room-incident-triage"
    name: "incident-triage"
    displayName: "🚨 DevOps Incident Triage"
    integrations:
      - "mattermost-primary"

integrations:
  - id: "mattermost-primary"
    type: "mattermost"
    enabled: true
    config:
      serverUrl: "${mattermostUrl}"
      channel: "${channel}"

agents:
  - id: "agent-devops-codex"
    name: "DevOps Engineer"
    provider: "openai-codex"
    harness: "codex-agent-v1"
    config:
      model: "${codexModel}"
  - id: "agent-k8s-engineer"
    name: "Kubernetes Engineer"
    provider: "switch-agent-protocol"
  - id: "agent-incident-coordinator"
    name: "Incident Coordinator"
    provider: "switch-agent-protocol"`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Switch Console & Integration Settings
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Official Switch Configuration (sandbox-quantum/switch)</span>
            <span aria-hidden="true">·</span>
            <span>Mattermost Bridge</span>
            <span aria-hidden="true">·</span>
            <span>OpenAI Codex Harness</span>
          </div>
        </div>

        {/* Live / Degraded Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-colors border ${
              isConnected
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/40'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>
              {isToggling
                ? 'Updating...'
                : isConnected
                ? 'Simulate Disconnected Room (Degraded Mode)'
                : 'Reconnect Switch Room (Live Mode)'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Form & YAML Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Connection Parameters */}
        <form onSubmit={handleSave} className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white font-display flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Communication & Agent Credentials</span>
          </h2>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Mattermost Server Endpoint
            </label>
            <input
              type="text"
              value={mattermostUrl}
              onChange={(e) => setMattermostUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Target Channel Bridge
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Supported Agent Model (OpenAI Codex)
            </label>
            <select
              value={codexModel}
              onChange={(e) => setCodexModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="code-davinci-002">code-davinci-002 (Codex Agent)</option>
              <option value="gpt-4o">gpt-4o (Codex Hybrid)</option>
              <option value="claude-3-5-sonnet">Claude Code (Switch Connector)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded font-semibold transition-colors"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
            </button>
          </div>

          {/* Setup Guide Callout */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-slate-400 space-y-2">
            <div className="font-semibold text-slate-300">How to Connect Official Switch Console:</div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed font-sans">
              <li>Download Switch Console from <code className="text-cyan-400">sandbox-quantum/switch</code>.</li>
              <li>Initialize workspace: <code className="text-slate-200">switch init cloudops-switch</code>.</li>
              <li>Import <code className="text-slate-200">switch.yaml</code> from this project root.</li>
              <li>Add Mattermost bot token into Switch Console secrets vault.</li>
            </ol>
          </div>
        </form>

        {/* Right Col: Live switch.yaml Inspector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>switch.yaml Manifest</span>
            </span>
            <span className="text-slate-500">Official Switch Format</span>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed h-[420px]">
            {switchYamlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
