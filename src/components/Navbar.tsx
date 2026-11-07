import React from 'react';
import { Radio, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  switchConnected: boolean;
  onOpenNewIncident: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  switchConnected,
  onOpenNewIncident,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'agents', label: 'AI Agents' },
    { id: 'room', label: 'Switch Room' },
    { id: 'cicd', label: 'CI/CD Monitor' },
    { id: 'infra', label: 'Infra Intel' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'hackathon', label: 'Hackathon Hub' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand title wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('overview')}
          className="text-left font-display text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
        >
          CloudOps Switch
        </button>
        <span className="text-xs text-slate-500 font-mono tracking-wider">v1.0</span>
      </div>

      {/* Zone 2: Single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap transition-colors py-1 ${
                isActive
                  ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400 -mb-[2px]'
                  : 'hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Switch status badge + 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('settings')}
          title="Click to configure Switch Console and rooms in Settings"
          className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
            switchConnected
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
              : 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/40'
          }`}
        >
          {switchConnected ? (
            <>
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="whitespace-nowrap">Switch: Connected</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="whitespace-nowrap">Switch: Disconnected</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenNewIncident}
          className="px-3.5 py-1.5 text-xs font-medium text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded font-display transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
        >
          + New Incident
        </button>
      </div>
    </header>
  );
};
