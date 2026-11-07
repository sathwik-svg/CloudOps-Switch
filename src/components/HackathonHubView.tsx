import React, { useState, useEffect } from 'react';
import { MilestoneEvidence } from '../types';
import { api } from '../services/api';
import { Check, Copy, FileText, Download, Award, ShieldCheck, Terminal, BookOpen, Video, ExternalLink } from 'lucide-react';

export const HackathonHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'readme' | 'script' | 'blog' | 'submission' | 'files'>('evidence');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<MilestoneEvidence | null>(null);

  useEffect(() => {
    api.getMilestoneEvidence().then(setEvidence).catch(() => {});
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const readmeSnippet = `# CloudOps Switch — AI-Powered Multi-Agent DevOps Team

An enterprise multi-agent DevOps collaboration platform built on the official Switch infrastructure (sandbox-quantum/switch).
It coordinates OpenAI Codex, Kubernetes Engineer, and Incident Coordinator agents inside Switch rooms to triage CI/CD and deployment failures via Mattermost.

Key Highlights:
- Switch rooms as primary collaboration infrastructure
- Mattermost #devops-alerts bridge
- OpenAI Codex agent integration
- SQLite persistent audit records
- Verified Milestone 1 automated workflow`;

  const scriptSnippet = `0:00 - 0:30: Overview dashboard, Switch Room #incident-triage connected state.
0:30 - 0:55: AI Agent Control Center: OpenAI Codex, K8s Engineer, Incident Coordinator.
0:55 - 1:35: Trigger deployment failure alert through Mattermost channel bridge.
1:35 - 2:15: Multi-agent consensus: OOMKilled 137 + initialDelaySeconds probe remediation.
2:15 - 2:45: Graceful degradation testing and Milestone 1 verified evidence audit.`;

  const submissionSnippet = `Project Title: CloudOps Switch — AI-Powered Multi-Agent DevOps Team
Repository: https://github.com/sathwik-svg/CloudOps-Switch.git

Problem Solved: Eliminates manual DevOps firefights by coordinating specialized AI coding agents (OpenAI Codex, K8s Engineer, Incident Coordinator) inside Switch rooms and Mattermost to resolve deployment failures in seconds.

Tracks:
1. Track 1: Best Multi-Agent Team / AI Teammate Infrastructure with Switch
2. Track 2: Best Developer Tool / DevOps Automation
3. Track 3: Best Communication Bridge Integration (Mattermost / ChatOps)

How Did You Use Switch:
Used official switch.yaml specification with workspace cloudops-switch and room #incident-triage. Bridged Mattermost #devops-alerts into the room event stream. Connected OpenAI Codex agent harness for log inspection and custom agent harnesses for K8s audits and post-mortem consolidation.`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            <span>Switch Hackathon Deliverables Hub</span>
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>5 Official Submission Deliverables</span>
            <span aria-hidden="true">·</span>
            <span>Milestone 1 Verified Evidence</span>
            <span aria-hidden="true">·</span>
            <span>Production Public Repository Ready</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded border border-emerald-800/60">
          <ShieldCheck className="w-4 h-4" />
          <span>Milestone 1: Verified Success</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'evidence' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Milestone 1 Evidence (JSON)
        </button>
        <button
          onClick={() => setActiveTab('submission')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'submission' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deliverable 5: Submission Form
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'script' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deliverable 3: Demo Video Script
        </button>
        <button
          onClick={() => setActiveTab('readme')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'readme' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deliverable 2: README.md
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'blog' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deliverable 4: Technical Blog
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'files' ? 'bg-slate-800 text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deliverable 1: Repo & Docker Files
        </button>
      </div>

      {/* Tab: Milestone 1 Evidence */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white font-display">
                Required First Milestone: Verified Switch Workflow Evidence
              </h2>
              <p className="text-xs text-slate-400">
                Generated and verified by running <code className="text-cyan-400">python3 switch/switch_engine.py</code>.
              </p>
            </div>
            <button
              onClick={() => handleCopy('evidence', JSON.stringify(evidence, null, 2))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedId === 'evidence' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'evidence' ? 'Copied JSON' : 'Copy Evidence JSON'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed max-h-[500px]">
            {evidence ? JSON.stringify(evidence, null, 2) : 'Loading evidence artifact from evidence/milestone_1_verification.json...'}
          </pre>
        </div>
      )}

      {/* Tab: Submission Form */}
      {activeTab === 'submission' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display">
              Deliverable 5: Hackathon Submission Form Answers
            </h2>
            <button
              onClick={() => handleCopy('submission', submissionSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedId === 'submission' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'submission' ? 'Copied' : 'Copy Form Answers'}</span>
            </button>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4 text-xs leading-relaxed text-slate-300">
            <div>
              <div className="font-semibold text-white">Project Title</div>
              <div className="text-cyan-400 font-mono text-sm mt-0.5">
                CloudOps Switch — AI-Powered Multi-Agent DevOps Team
              </div>
            </div>

            <div>
              <div className="font-semibold text-white">Project Description</div>
              <p className="text-slate-400 mt-1">
                CloudOps Switch is an enterprise multi-agent DevOps collaboration platform built on the official Switch infrastructure (`sandbox-quantum/switch`). It coordinates OpenAI Codex, Kubernetes Engineer, and Incident Coordinator agents inside Switch rooms to triage CI/CD build failures and Kubernetes deployment regressions via Mattermost.
              </p>
            </div>

            <div>
              <div className="font-semibold text-white">Recommended Tracks</div>
              <ul className="list-disc list-inside text-slate-400 mt-1 space-y-1">
                <li><strong className="text-slate-200">Track 1:</strong> Best Multi-Agent Team / AI Teammate Infrastructure with Switch</li>
                <li><strong className="text-slate-200">Track 2:</strong> Best Developer Tool / DevOps Automation</li>
                <li><strong className="text-slate-200">Track 3:</strong> Best Communication Bridge Integration (Mattermost / ChatOps)</li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-white">How Did You Use Switch?</div>
              <p className="text-slate-400 mt-1">
                Configured official <code className="text-slate-200">switch.yaml</code> manifest with workspace <code className="text-slate-200">cloudops-switch</code>, room <code className="text-slate-200">incident-triage</code>, and Mattermost primary bridge. Connected OpenAI Codex for log parsing, custom agent protocol harnesses for Kubernetes manifest audits, and coordinated incident synthesis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Demo Script */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display">
              Deliverable 3: 3-Minute Demo Video Script (DEMO_SCRIPT.md)
            </h2>
            <button
              onClick={() => handleCopy('script', scriptSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedId === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'script' ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px]">
            {scriptSnippet}
          </pre>
        </div>
      )}

      {/* Tab: README */}
      {activeTab === 'readme' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display">
              Deliverable 2: Professional README.md
            </h2>
            <button
              onClick={() => handleCopy('readme', readmeSnippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedId === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'readme' ? 'Copied' : 'Copy README'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-[460px]">
            {readmeSnippet}
          </pre>
        </div>
      )}

      {/* Tab: Technical Blog */}
      {activeTab === 'blog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white font-display">
              Deliverable 4: Technical Blog Post (BLOG_POST.md)
            </h2>
            <button
              onClick={() => handleCopy('blog', 'Full blog post saved in BLOG_POST.md at repository root.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              {copiedId === 'blog' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'blog' ? 'Copied' : 'Copy Blog Summary'}</span>
            </button>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-2 leading-relaxed">
            <div className="text-white font-semibold text-sm">
              &quot;Building CloudOps Switch: A Multi-Agent DevOps Team Powered by Switch&quot;
            </div>
            <p className="text-slate-400">
              The full publication-ready technical blog post has been written to <code className="text-cyan-400">BLOG_POST.md</code> in the project root. It details the incident triage problem statement, why Switch rooms surpass solitary chatbot silos, real OOMKilled walkthroughs, and lessons learned.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Repo Files & Docker */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white font-display">
            Deliverable 1: Public GitHub Repository Structure & Docker Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Dockerfile (Multi-Stage Build)</span>
              </div>
              <p className="text-slate-400">
                Production-ready multi-stage Alpine Docker container packaging the full-stack server and Vite bundle.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>docker-compose.yml</span>
              </div>
              <p className="text-slate-400">
                Single-command container orchestration definition with environment variables and healthcheck probes.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>.github/workflows/ci.yml</span>
              </div>
              <p className="text-slate-400">
                GitHub Actions pipeline running Python unit tests, Switch verification, ESLint, and production build.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>tests/test_switch_verification.py</span>
              </div>
              <p className="text-slate-400">
                Automated test suite verifying Switch rooms, SQLite tables, and graceful degradation behavior.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
