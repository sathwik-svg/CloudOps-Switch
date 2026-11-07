import React, { useState } from 'react';
import { ShieldCheck, Code, Check, Copy, AlertTriangle, Layers, Cpu } from 'lucide-react';

export const InfraIntelView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'k8s' | 'diff' | 'probes'>('diff');

  const beforeManifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: payments
        image: registry.internal/payments:v2.4.1
        resources:
          # DEFECT 1: 128Mi limit violates 256MB JVM heap requirement
          limits:
            memory: "128Mi"
            cpu: "500m"
          requests:
            memory: "64Mi"
            cpu: "250m"
        # DEFECT 2: 3s delay causes kubelet to SIGKILL before context boots
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 3
          periodSeconds: 10`;

  const afterManifest = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
  namespace: production
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: payments
        image: registry.internal/payments:v2.4.1
        resources:
          # REMEDIATION: Increased memory limit to 512Mi (headroom for 256MB JVM)
          limits:
            memory: "512Mi"
            cpu: "500m"
          requests:
            memory: "256Mi"
            cpu: "250m"
        # REMEDIATION: Added startupProbe with 30s failure threshold
        startupProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          failureThreshold: 30
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5`;

  const handleCopy = () => {
    navigator.clipboard.writeText(afterManifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Infrastructure Intelligence & Kubernetes Audit
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Cluster: k8s-prod-us-east-1</span>
            <span aria-hidden="true">·</span>
            <span>Target: Deployment/payments-api</span>
            <span aria-hidden="true">·</span>
            <span>Evaluator: Kubernetes Engineer Agent</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Remediated YAML' : 'Copy Remediated YAML'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('diff')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'diff'
              ? 'bg-slate-800 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Before vs. Remediated YAML Diff
        </button>
        <button
          onClick={() => setActiveTab('probes')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'probes'
              ? 'bg-slate-800 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Health Probe Lifecycle Analysis
        </button>
        <button
          onClick={() => setActiveTab('k8s')}
          className={`px-3 py-1.5 rounded transition-colors ${
            activeTab === 'k8s'
              ? 'bg-slate-800 text-cyan-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Memory Cgroup vs JVM Heap Visualizer
        </button>
      </div>

      {/* Tab Content: Diff View */}
      {activeTab === 'diff' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original Defective Manifest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-rose-400 font-mono">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Original (Failed in CI/CD Run #402)</span>
              </span>
              <span>128Mi Limit · 3s Probe Delay</span>
            </div>
            <pre className="p-4 bg-slate-950 border border-rose-900/50 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {beforeManifest}
            </pre>
          </div>

          {/* Right: Remediated Manifest */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Remediated by Kubernetes Engineer</span>
              </span>
              <span>512Mi Limit · startupProbe Added</span>
            </div>
            <pre className="p-4 bg-slate-950 border border-emerald-900/50 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {afterManifest}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: Probes */}
      {activeTab === 'probes' && (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white font-display">
            Kubernetes Probe Timing Diagnostics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="font-semibold text-rose-400 mb-1">Defect Detected</div>
              <div className="text-slate-400 leading-relaxed">
                <code className="text-slate-200">initialDelaySeconds: 3</code> on livenessProbe. The Spring Boot application takes 18 seconds to initialize connection pools. Kubelet sent SIGKILL on second failed ping.
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="font-semibold text-emerald-400 mb-1">Applied Fix: startupProbe</div>
              <div className="text-slate-400 leading-relaxed">
                Inserted <code className="text-slate-200">startupProbe</code> with <code className="text-slate-200">failureThreshold: 30</code> and <code className="text-slate-200">periodSeconds: 5</code> (giving up to 150s startup window without killing).
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded">
              <div className="font-semibold text-cyan-400 mb-1">Traffic Protection: readinessProbe</div>
              <div className="text-slate-400 leading-relaxed">
                Added <code className="text-slate-200">readinessProbe</code> pointing to <code className="text-slate-200">/actuator/health/readiness</code> to ensure no customer traffic arrives before JVM warm-up.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Memory vs Heap */}
      {activeTab === 'k8s' && (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-4 text-xs">
          <h2 className="text-sm font-semibold text-white font-display">
            Container Cgroup vs. JVM Heap Allocation
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Original Cgroup Limit: 128Mi</span>
                <span className="text-rose-400 font-mono">100% Breached &rarr; OOMKilled</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>JVM Max Heap: 256MB</span>
                <span className="text-amber-400 font-mono">Exceeds 128Mi container boundary</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-3/4" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Remediated Cgroup Limit: 512Mi</span>
                <span className="text-emerald-400 font-mono">Nominal Operating Buffer (50% headroom)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-1/2" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
