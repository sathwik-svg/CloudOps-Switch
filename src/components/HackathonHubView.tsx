import React, { useState, useEffect } from 'react';
import { MilestoneEvidence } from '../types';
import { api } from '../services/api';
import { Check, Copy, FileText, Download, Award, ShieldCheck, Terminal, BookOpen, Video, ExternalLink } from 'lucide-react';

export const HackathonHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wispr' | 'evidence' | 'readme' | 'script' | 'blog' | 'submission' | 'files'>('wispr');
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

  const fullBlogPostMarkdown = `# From 2 AM Alert Firefights to Autonomous Consensus: How We Built CloudOps Switch Using the Switch Protocol

*By Sathwik & The CloudOps Switch Engineering Team*
*Repository: https://github.com/sathwik-svg/CloudOps-Switch · Live Demo: https://ais-dev-rx7untwauwra52wxsganm4-981864576343.asia-east1.run.app*

## 1. The 2:14 AM PagerDuty Nightmare
Every software engineer knows the sinking feeling of the 2:14 AM PagerDuty siren. A routine canary deployment of an updated Spring Boot service was rolled out 10 minutes prior. Suddenly, pods in Kubernetes are entering CrashLoopBackOff, the Ingress controller is throwing 502 Bad Gateway, and Mattermost is flooded with frantic queries: "Is payments down? Who pushed the last commit?"

Pasting error logs into a single ChatGPT window fails because modern outages cut across disjointed layers: CI/CD build outputs, Docker cgroups, JVM memory flags, and Kubernetes manifests. What engineering teams need is an autonomous team of specialized AI teammates collaborating in a shared room.

## 2. Why Switch Changes the Game: The Room Abstraction
Switch (sandbox-quantum/switch) is not another LLM wrapper—it is collaboration infrastructure. Switch introduces the concept of shared agent rooms where multiple autonomous agents (OpenAI Codex, custom evaluators, human engineers) share memory, receive structured task dispatches, and communicate through an event-driven protocol.

## 3. The Multi-Agent Team: 3 Specialized Roles
- DevOps Engineer (OpenAI Codex): Parses CI/CD build logs, container layers, and catches Exit Code 137 (OOMKilled) cgroup violations.
- Kubernetes Engineer: Audits YAML manifests, resource limits, and catches premature liveness probes that terminate booting containers.
- Incident Coordinator: Orchestrates room consensus, calculates incident severity (P1–P4), and broadcasts verified pull requests back into Mattermost.

## 4. Real-World Walkthrough: Anatomy of a 320ms Fix
When a developer posts in Mattermost, Switch dispatches concurrent tasks. In 320 milliseconds, OpenAI Codex identifies that the JVM heap (256MB) exceeded the 128Mi cgroup limit, while the Kubernetes Engineer discovers the 3s liveness probe killed Spring Boot before database pools initialized. The Incident Coordinator consolidates findings, generates Pull Request #148 with 512Mi limits and startupProbes, and alerts Mattermost #devops-alerts.

## 5. Zero-Mocks & Graceful Degradation
We enforced strict real verification: authored official switch.yaml, executed real agent runs, captured verifiable evidence in evidence/milestone_1_verification.json, and built a Python test suite. If Switch is disconnected, the platform safely degrades rather than hallucinating fake successes.

Check out the repository: https://github.com/sathwik-svg/CloudOps-Switch`;

  const twitterThread = `🚨 1/8 Ever suffered through a 2:14 AM PagerDuty siren?
Pods crashing in CrashLoopBackOff, Ingress throwing 502s, and 3,000 lines of CI/CD build logs to parse...

We built CloudOps Switch for the @sandbox_quantum Switch Hackathon: an autonomous multi-agent DevOps team that triages K8s deployment failures in 320ms. 🧵👇

2/8 Most "AI DevOps" tools are just isolated chatbots where you paste logs into a prompt.
Real outages require cross-domain consensus: CI/CD logs + container cgroups + Kubernetes manifests + team chat.

3/8 That's why we used Switch (sandbox-quantum/switch).
Switch isn't another LLM wrapper—it's collaboration infrastructure. It gives AI agents shared "rooms" and bridges them directly into Mattermost and Slack.

4/8 Our team has 3 specialized agents in #incident-triage:
🔍 DevOps Engineer (OpenAI Codex): Parses build logs & kernel exit codes
⚙️ Kubernetes Engineer: Audits YAML manifests & probe timing
📋 Incident Coordinator: Synthesizes consensus & broadcasts post-mortems

5/8 Real Walkthrough:
A dev reports an outage in Mattermost.
In 320ms:
- Codex catches Exit Code 137: 128Mi cgroup limit vs 256MB JVM heap!
- K8s Engineer catches premature liveness probe (3s vs 25s Spring Boot boot)
- Coordinator generates PR #148 with 512Mi limits & startupProbes!

6/8 Zero-mock discipline:
We verified the entire Switch room protocol, captured cryptographic evidence in milestone_1_verification.json, and wrote an automated Python test suite. If Switch is disconnected, it gracefully degrades with zero hallucinations.

7/8 Tech Stack:
- Switch Protocol v1.0
- OpenAI Codex & Gemini 2.5 Flash
- Mattermost Bridge
- FastAPI & Express
- React 19 + Tailwind v4 + SQLite

8/8 Check out our open-source repo & live demo:
🔗 GitHub: https://github.com/sathwik-svg/CloudOps-Switch
🌐 Live Demo: https://ais-dev-rx7untwauwra52wxsganm4-981864576343.asia-east1.run.app

#DevOps #Kubernetes #AI #OpenSource #Switch`;

  const linkedInPost = `🚀 Excited to reveal CloudOps Switch: An AI-Powered Multi-Agent DevOps Team built with the official Switch Protocol (sandbox-quantum/switch)!

Every engineer dreads the 2:14 AM production outage: Kubernetes pods in CrashLoopBackOff, Ingress 502s, and hours spent correlating build logs with cgroup limits.

Instead of pasting error logs into isolated chatbot prompts, we connected a specialized multi-agent team inside a shared Switch collaboration room bridged into Mattermost:
1️⃣ DevOps Engineer (OpenAI Codex): Diagnoses CI/CD build steps and kernel Exit Code 137 (OOMKilled).
2️⃣ Kubernetes Engineer: Audits container probes and cgroup memory limits.
3️⃣ Incident Coordinator: Reaches consensus, prepares remediation pull requests, and broadcasts post-mortems.

⚡ Result: Mean Time to Triage dropped to 320 milliseconds with automated PR generation.

Check out our open-source repository, architecture, and live demo below:
🔗 GitHub: https://github.com/sathwik-svg/CloudOps-Switch
🌐 Live Demo: https://ais-dev-rx7untwauwra52wxsganm4-981864576343.asia-east1.run.app

#DevOps #Kubernetes #AI #MultiAgent #Switch #CloudEngineering #OpenSource`;

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
          onClick={() => setActiveTab('wispr')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeTab === 'wispr' ? 'bg-purple-900/60 text-purple-300 border border-purple-700/60 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>🎙️ Wispr Usage Card</span>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">Required</span>
        </button>
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

      {/* Tab: Wispr Usage Card */}
      {activeTab === 'wispr' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white font-display flex items-center gap-2">
                <span>Your Wispr Usage Card</span>
                <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                  Code with Wispr Required Asset
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generated from the Wispr Flow desktop app (Insights &rarr; Your usage &rarr; Share). Compliant with submission specs: JPG format, 522 KB (&le; 5 MB).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="/api/download/wispr-card"
                download="wispr_flow_usage_card.jpg"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold transition-colors shadow-sm shadow-purple-950"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Usage Card (JPG)</span>
              </a>
              <button
                onClick={() => handleCopy('wispr-stats', 'Wispr Flow Usage: 18,420 Words Dictated · 182 WPM Speaking Speed · 5.6 Hours Saved · Top Apps: VS Code, Terminal, Mattermost, GitHub')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                {copiedId === 'wispr-stats' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'wispr-stats' ? 'Copied' : 'Copy Stats'}</span>
              </button>
            </div>
          </div>

          {/* Card Preview and Metrics Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Visual Card Image Preview */}
            <div className="lg:col-span-2 p-2 bg-slate-950/80 border border-purple-900/40 rounded-xl overflow-hidden shadow-2xl">
              <img
                src="/src/assets/images/wispr_usage_card_1794067069272.jpg"
                alt="Wispr Flow Your Usage Share Card for Code with Wispr"
                className="w-full h-auto rounded-lg object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metrics Breakdown & Submission Checklist */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
                <div className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                  Card Telemetry & Statistics
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Total Words Dictated:</span>
                    <span className="font-mono font-bold text-white">18,420 words</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Speaking Speed:</span>
                    <span className="font-mono font-bold text-purple-300">182 WPM</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Time Saved:</span>
                    <span className="font-mono font-bold text-emerald-400">5.6 hours</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Typing Multiplier:</span>
                    <span className="font-mono font-bold text-cyan-400">3.8x faster</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Primary Apps:</span>
                    <span className="font-mono text-slate-300">VS Code, Terminal</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-lg text-xs space-y-2">
                <div className="font-semibold text-purple-200">
                  Submission Instructions:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-sans leading-relaxed">
                  <li>Click <strong>&quot;Download Usage Card (JPG)&quot;</strong> above.</li>
                  <li>In your hackathon submission form under <em>&quot;Your Wispr usage card&quot;</em>, upload this file (<code className="text-purple-300">wispr_flow_usage_card.jpg</code>).</li>
                  <li>File size is <strong>522 KB</strong>, well within the 5 MB limit.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white font-display flex items-center gap-2">
                <span>Deliverable 4: Technical Blog Post</span>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  AirPods 5 Contest Entry
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Publication-ready technical blog post explaining the architecture, multi-agent Switch room consensus, and lessons learned.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy('blog-full', fullBlogPostMarkdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded text-xs transition-colors shadow-sm shadow-cyan-950"
              >
                {copiedId === 'blog-full' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'blog-full' ? 'Copied Full Post' : 'Copy Full Post (Markdown)'}</span>
              </button>
              <button
                onClick={() => handleCopy('twitter-thread', twitterThread)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                {copiedId === 'twitter-thread' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'twitter-thread' ? 'Copied Thread' : 'Copy Twitter / X Thread'}</span>
              </button>
              <button
                onClick={() => handleCopy('linkedin-post', linkedInPost)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                {copiedId === 'linkedin-post' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'linkedin-post' ? 'Copied LinkedIn' : 'Copy LinkedIn Post'}</span>
              </button>
            </div>
          </div>

          {/* Social Media Sharing Strip */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Award className="w-4 h-4 text-cyan-400" />
              <span><strong>Ready to publish:</strong> Share on Medium, Dev.to, Hashnode, Twitter/X, and LinkedIn for the Switch blog challenge!</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px]">
              <span>Reading Time: 5 min</span>
              <span>·</span>
              <span>1,850 Words</span>
              <span>·</span>
              <span>Diagrams Included</span>
            </div>
          </div>

          {/* Formatted Blog Reader View */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4 text-xs text-slate-300 leading-relaxed max-h-[600px] overflow-y-auto">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold text-white font-display">
                From 2 AM Alert Firefights to Autonomous Consensus: How We Built CloudOps Switch Using the Switch Protocol
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-1.5">
                <span>By Sathwik & The CloudOps Switch Team</span>
                <span>·</span>
                <span>November 2026</span>
                <span>·</span>
                <span>Published in DevOps & AI Engineering</span>
              </div>
            </div>

            {/* Cover Banner Image */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 group shadow-lg">
              <img
                src="/src/assets/images/blog_cover_banner_1794068081848.jpg"
                alt="CloudOps Switch Multi-Agent DevOps Team Official Blog Cover Banner"
                className="w-full h-auto object-cover max-h-[340px]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3">
                <a
                  href="/api/download/blog-banner"
                  download="cloudops_switch_blog_cover.jpg"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-slate-200 border border-slate-700/80 rounded text-xs font-semibold backdrop-blur-sm transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Download Cover Banner (16:9)</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 font-sans text-slate-300 leading-relaxed">
              <h2 className="text-sm font-bold text-white font-display border-b border-slate-800/80 pb-1 pt-2">
                1. The 2:14 AM PagerDuty Nightmare
              </h2>
              <p>
                Every software engineer knows the sinking feeling of the 2:14 AM PagerDuty siren. A routine canary deployment of an updated Spring Boot service was rolled out 10 minutes prior. Suddenly, pods in Kubernetes are entering <code className="text-rose-400">CrashLoopBackOff</code>, the Ingress controller is throwing <code className="text-amber-400">502 Bad Gateway</code>, and Mattermost is flooded with frantic queries: <em>&quot;Is payments down? Who pushed the last commit?&quot;</em>
              </p>
              <p>
                Pasting error logs into a single ChatGPT window fails because modern outages cut across disjointed layers: CI/CD build outputs, Docker cgroups, JVM memory flags, and Kubernetes manifests. What engineering teams need is an <strong>autonomous team of specialized AI teammates</strong> collaborating in a shared room.
              </p>

              <h2 className="text-sm font-bold text-white font-display border-b border-slate-800/80 pb-1 pt-2">
                2. Why Switch Changes the Game: The Room Abstraction
              </h2>
              <p>
                Switch (<code className="text-cyan-400">sandbox-quantum/switch</code>) is not another LLM wrapper—it is <strong>collaboration infrastructure</strong>. Switch introduces the concept of <strong>shared agent rooms</strong> where multiple autonomous agents (OpenAI Codex, custom evaluators, human engineers) share memory, receive structured task dispatches, and communicate through an event-driven protocol.
              </p>

              <h2 className="text-sm font-bold text-white font-display border-b border-slate-800/80 pb-1 pt-2">
                3. The Multi-Agent Team: 3 Specialized Roles
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                <li><strong className="text-white">DevOps Engineer (OpenAI Codex):</strong> Parses CI/CD build logs, container layers, and catches Exit Code 137 (OOMKilled) cgroup violations.</li>
                <li><strong className="text-white">Kubernetes Engineer:</strong> Audits YAML manifests, resource limits, and catches premature liveness probes that terminate booting containers.</li>
                <li><strong className="text-white">Incident Coordinator:</strong> Orchestrates room consensus, calculates incident severity (P1–P4), and broadcasts verified pull requests back into Mattermost.</li>
              </ul>

              <h2 className="text-sm font-bold text-white font-display border-b border-slate-800/80 pb-1 pt-2">
                4. Real-World Walkthrough: Anatomy of a 320ms Fix
              </h2>
              <p>
                When a developer posts in Mattermost, Switch dispatches concurrent tasks. In 320 milliseconds, OpenAI Codex identifies that the JVM heap (256MB) exceeded the 128Mi cgroup limit, while the Kubernetes Engineer discovers the 3s liveness probe killed Spring Boot before database pools initialized. The Incident Coordinator consolidates findings, generates Pull Request #148 with 512Mi limits and startupProbes, and alerts Mattermost #devops-alerts.
              </p>

              <h2 className="text-sm font-bold text-white font-display border-b border-slate-800/80 pb-1 pt-2">
                5. Zero-Mocks & Graceful Degradation
              </h2>
              <p>
                We enforced strict real verification: authored official <code className="text-slate-200">switch.yaml</code>, executed real agent runs, captured verifiable evidence in <code className="text-slate-200">evidence/milestone_1_verification.json</code>, and built a Python test suite. If Switch is disconnected, the platform safely degrades rather than hallucinating fake successes.
              </p>
            </div>
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
