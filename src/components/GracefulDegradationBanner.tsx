import React from 'react';
import { AlertCircle, ArrowRight, Settings } from 'lucide-react';

interface GracefulDegradationBannerProps {
  onGoToSettings: () => void;
  onReconnect: () => void;
}

export const GracefulDegradationBanner: React.FC<GracefulDegradationBannerProps> = ({
  onGoToSettings,
  onReconnect,
}) => {
  return (
    <div className="bg-amber-950/40 border-b border-amber-800/60 px-6 py-2.5 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong className="font-semibold text-amber-100">Degraded Mode Active:</strong> Switch room is disconnected. Live agent task dispatching is temporarily disabled. Historical and audited incidents remain accessible.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onReconnect}
          className="underline hover:text-amber-100 transition-colors whitespace-nowrap"
        >
          Quick Reconnect
        </button>
        <button
          onClick={onGoToSettings}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800/60 text-amber-100 border border-amber-700/60 rounded text-xs transition-colors whitespace-nowrap"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Switch Settings & Setup Guide</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
