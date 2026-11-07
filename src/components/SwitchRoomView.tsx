import React, { useState } from 'react';
import { SwitchRoom, SwitchStatus } from '../types';
import { MessageSquare, Send, Play, Terminal, ArrowRight, Bot, User, Radio, CheckCircle } from 'lucide-react';

interface SwitchRoomViewProps {
  room: SwitchRoom | null;
  switchStatus: SwitchStatus | null;
  onSendMessage: (text: string) => Promise<void>;
  onTriggerSampleAlert: () => void;
  isTriggering: boolean;
}

export const SwitchRoomView: React.FC<SwitchRoomViewProps> = ({
  room,
  switchStatus,
  onSendMessage,
  onTriggerSampleAlert,
  isTriggering,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const isConnected = switchStatus?.connected ?? false;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending || !isConnected) return;
    try {
      setIsSending(true);
      await onSendMessage(inputText);
      setInputText('');
    } finally {
      setIsSending(false);
    }
  };

  const messages = room?.messages || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Switch Room: #{room?.name || 'incident-triage'}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Bridge: Mattermost #devops-alerts</span>
            <span aria-hidden="true">·</span>
            <span>Room ID: {room?.id || 'room-incident-triage'}</span>
            <span aria-hidden="true">·</span>
            <span>{messages.length} Total Messages</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            <span>{isTriggering ? 'Dispatching...' : 'Dispatch Deployment Alert'}</span>
          </button>
        </div>
      </div>

      {/* Task Routing Diagram Ribbon */}
      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg">
        <div className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase tracking-wider">
          Active Switch Room Event Router Pipeline
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-purple-400" />
            <span>Mattermost Ingestion</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <div className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>Switch Room Coordinator</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <div className="px-2.5 py-1 bg-slate-800 text-emerald-300 rounded border border-emerald-800/60 flex items-center gap-1.5">
            <Bot className="w-3 h-3 text-emerald-400" />
            <span>DevOps Eng (Codex) + K8s Eng</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <div className="px-2.5 py-1 bg-slate-800 text-amber-300 rounded border border-amber-800/60 flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3 text-amber-400" />
            <span>Coordinator Mattermost Broadcast</span>
          </div>
        </div>
      </div>

      {/* Chat Messages Timeline */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg min-h-[460px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No messages recorded in this room yet. Post a message below or dispatch a test alert.
            </div>
          ) : (
            messages.map((msg) => {
              const isAgent = msg.sender_type === 'agent';
              const isBridge = msg.sender_type === 'bridge';

              return (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed transition-all ${
                    isAgent
                      ? 'bg-slate-950/80 border-slate-800 text-slate-200 ml-4'
                      : isBridge
                      ? 'bg-purple-950/20 border-purple-900/40 text-purple-200 mr-4'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                    <div className="flex items-center gap-1.5">
                      {isAgent ? (
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span className="font-semibold text-slate-200">{msg.sender}</span>
                      {msg.metadata?.agent_id && (
                        <span className="text-slate-500">[{msg.metadata.agent_id}]</span>
                      )}
                    </div>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-xs text-slate-300">
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={!isConnected || isSending}
            placeholder={
              isConnected
                ? "Send alert or query to Switch room #incident-triage (e.g. 'Audit k8s memory limits')..."
                : "Switch room is disconnected. Enable connection in Settings to post live messages."
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans disabled:bg-slate-900 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending || !isConnected}
            className={`px-4 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              inputText.trim() && isConnected && !isSending
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
