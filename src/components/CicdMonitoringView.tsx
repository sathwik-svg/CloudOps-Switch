import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Terminal, AlertOctagon, RotateCw, Play } from 'lucide-react';

export const CicdMonitoringView: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState('run-402');
  const [filterQuery, setFilterQuery] = useState('');

  const pipelineStages = [
    { name: 'Git Checkout', status: 'SUCCESS', duration: '2.4s' },
    { name: 'Gradle Compile', status: 'SUCCESS', duration: '48.1s' },
    { name: 'Unit & Integration Tests', status: 'SUCCESS', duration: '32.6s' },
    { name: 'Docker Build & Push', status: 'SUCCESS', duration: '18.9s' },
    { name: 'Kubernetes Helm Canary Deploy', status: 'FAILED', duration: '14.2s' },
    { name: 'Automated Health Probes', status: 'SKIPPED', duration: '0.0s' },
  ];

  const buildHistory = [
    {
      id: 'run-402',
      branch: 'main',
      commit: 'f93d18e (feat: upgrade spring boot 3.2.4)',
      service: 'payments-api',
      status: 'FAILED',
      time: '10 mins ago',
      error: 'Exit Code 137: OOMKilled (128Mi cgroup limit breached)',
    },
    {
      id: 'run-401',
      branch: 'main',
      commit: '7b204ca (fix: update database query timeout)',
      service: 'payments-api',
      status: 'SUCCESS',
      time: '2 hours ago',
      error: null,
    },
    {
      id: 'run-400',
      branch: 'feature/auth-refresh',
      commit: '3a119de (feat: refresh token endpoint)',
      service: 'auth-service',
      status: 'SUCCESS',
      time: '5 hours ago',
      error: null,
    },
  ];

  const rawLogs = `[00:00:01] INFO  [runner] Spawning build container on k8s-runner-worker-09...
[00:00:03] INFO  [git] Checking out branch main @ f93d18e5
[00:00:06] INFO  [gradle] Starting Gradle Daemon 8.5...
[00:00:32] INFO  [test] 142 tests completed, 0 failures, 0 skipped.
[00:00:54] INFO  [docker] Built image registry.internal/payments:v2.4.1 (digest sha256:d8a2...3f)
[00:01:05] INFO  [helm] Upgrading release payments-api in namespace production...
[00:01:10] INFO  [k8s] Created Pod payments-api-7b89d4948-4h7zk in Pending state
[00:01:12] INFO  [k8s] Successfully assigned production/payments-api-7b89d4948-4h7zk to node-pool-prod-3
[00:01:14] INFO  [k8s] Pulling image registry.internal/payments:v2.4.1 (cached)
[00:01:15] INFO  [k8s] Started container payments
[00:01:18] INFO  [app] Starting PaymentsApplication v2.4.1 using Java 21 on payments-api-7b89d4948-4h7zk
[00:01:21] INFO  [app] Initializing HikariCP connection pool...
[00:01:24] WARN  [jvm] JVM memory heap footprint: 245MB / 256MB max.
[00:01:28] FATAL [kernel] Process killed by kernel: cgroup memory limit exceeded (134217728 bytes allocated vs 134217728 bytes limit).
[00:01:29] ERROR [k8s] Container payments failed with Exit Code 137 (OOMKilled)
[00:01:29] ERROR [k8s] Pod payments-api-7b89d4948-4h7zk entering CrashLoopBackOff.
[00:01:30] FATAL [helm] Canary deployment timed out waiting for condition: 1 of 3 pods ready.`;

  const filteredLogs = rawLogs
    .split('\n')
    .filter((line) => line.toLowerCase().includes(filterQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            CI/CD Pipeline Failure Diagnostics
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Repository: internal/payments-service</span>
            <span aria-hidden="true">·</span>
            <span>Cluster: k8s-prod-us-east-1</span>
            <span aria-hidden="true">·</span>
            <span>Active Run: #402 (payments-api)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Audited by:</span>
          <span className="font-mono text-cyan-400">DevOps Engineer (OpenAI Codex)</span>
        </div>
      </div>

      {/* Pipeline Stage Visualizer */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
        <div className="text-xs font-semibold text-slate-400 mb-3 font-mono uppercase tracking-wider">
          Pipeline Execution Graph — Run #402
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className={`p-3 rounded border text-xs ${
                stage.status === 'SUCCESS'
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                  : stage.status === 'FAILED'
                  ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                  : 'bg-slate-950/30 border-slate-800/50 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[11px] text-slate-500">0{idx + 1}</span>
                {stage.status === 'SUCCESS' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : stage.status === 'FAILED' ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="font-medium text-slate-200 truncate">{stage.name}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">{stage.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Split: Build History & Log Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Build History */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-white font-display">
            Build Execution History
          </h2>
          <div className="space-y-3">
            {buildHistory.map((run) => (
              <div
                key={run.id}
                onClick={() => setSelectedRun(run.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedRun === run.id
                    ? 'bg-slate-900 border-cyan-500/80'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-200">{run.id}</span>
                  <span
                    className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                      run.status === 'SUCCESS'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">{run.commit}</div>
                <div className="text-slate-500 text-[11px] mt-1">{run.time}</div>
                {run.error && (
                  <div className="mt-2 text-rose-300 font-mono text-[11px] bg-rose-950/40 p-1.5 rounded border border-rose-900/60">
                    {run.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Build Logs Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Container Runtime & Kernel Logs</span>
            </h2>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search logs (e.g. 'OOMKilled', 'FATAL')..."
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto max-h-[420px] space-y-1">
            {filteredLogs.map((line, idx) => {
              const isFatal = line.includes('FATAL') || line.includes('ERROR');
              const isWarn = line.includes('WARN');
              return (
                <div
                  key={idx}
                  className={`leading-relaxed whitespace-pre-wrap ${
                    isFatal ? 'text-rose-400 bg-rose-950/30 px-1 py-0.5 rounded font-semibold' : isWarn ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  {line}
                </div>
              );
            })}
          </div>

          {/* Codex Agent Diagnosis Box */}
          <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold font-mono">
              <AlertOctagon className="w-4 h-4 text-cyan-400" />
              <span>DevOps Engineer (OpenAI Codex) Diagnosis</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              The container was terminated by kernel cgroup enforcer with Exit Code 137. The container limit in <code className="text-cyan-300">deployment.yaml</code> is restricted to <code className="text-cyan-300">128Mi</code>, whereas the Spring Boot JVM initializes with a heap allocation of <code className="text-cyan-300">256MB</code>. Increasing cgroup memory limit to 512Mi will resolve this fault.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
