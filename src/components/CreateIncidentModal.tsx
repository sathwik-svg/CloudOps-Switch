import React, { useState } from 'react';
import { X, Play, FileText, Check } from 'lucide-react';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (data: {
    title: string;
    severity: string;
    service: string;
    cluster: string;
    description: string;
    logs?: string;
    manifest?: string;
  }) => Promise<void>;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onCreateIncident,
}) => {
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('P2');
  const [service, setService] = useState('payments-api');
  const [cluster, setCluster] = useState('k8s-prod-us-east-1');
  const [description, setDescription] = useState('');
  const [logs, setLogs] = useState('');
  const [manifest, setManifest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleApplyTemplate = (type: 'oom' | 'ingress' | 'iam') => {
    if (type === 'oom') {
      setTitle('Kubernetes application deployment failing after CI/CD build #403');
      setSeverity('P2');
      setService('orders-service');
      setDescription('Pod crashing with Exit Code 137 immediately following deployment of build #403 image.');
      setLogs(`2026-11-07 14:40:02 [INFO] Initializing orders-service...
2026-11-07 14:40:12 [WARN] Memory footprint reaches limit.
2026-11-07 14:40:15 [FATAL] OOMKilled by kernel enforcer (134217728 bytes = 128Mi limit exceeded). Exit code 137.`);
      setManifest(`apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-service
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: orders
        image: registry.internal/orders:v1.2.0
        resources:
          limits:
            memory: "128Mi"
          requests:
            memory: "64Mi"`);
    } else if (type === 'ingress') {
      setTitle('Checkout canary rollout returning 502 Bad Gateway to ingress controller');
      setSeverity('P3');
      setService('checkout-service');
      setDescription('Ingress controller fails to route traffic to checkout canary pod.');
      setLogs(`2026-11-07 15:10:00 [ERROR] NGINX ingress controller: upstream connection refused on port 8081.`);
      setManifest(`apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: checkout-canary
spec:
  rules:
  - http:
      paths:
      - path: /checkout
        backend:
          service:
            name: checkout-canary
            port:
              number: 8081`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreateIncident({
        title,
        severity,
        service,
        cluster,
        description,
        logs,
        manifest,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 text-xs text-slate-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white font-display">
            Create New DevOps Incident
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Pre-fill Scenario:</span>
          <button
            type="button"
            onClick={() => handleApplyTemplate('oom')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs transition-colors"
          >
            K8s OOMKilled #403
          </button>
          <button
            type="button"
            onClick={() => handleApplyTemplate('ingress')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs transition-colors"
          >
            Ingress 502 Port Mismatch
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Incident Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kubernetes application deployment failing after CI/CD build"
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="P1">P1 - Critical Outage</option>
                <option value="P2">P2 - Deployment Degradation</option>
                <option value="P3">P3 - Minor Warning</option>
                <option value="P4">P4 - Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Affected Service
              </label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Cluster
              </label>
              <input
                type="text"
                value={cluster}
                onChange={(e) => setCluster(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Incident Description
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context regarding the failure observed by developers..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Build & Container Logs (Optional)
            </label>
            <textarea
              rows={3}
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder="Paste raw CI/CD build output or container runtime logs..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Kubernetes YAML Manifest (Optional)
            </label>
            <textarea
              rows={4}
              value={manifest}
              onChange={(e) => setManifest(e.target.value)}
              placeholder="Paste deployment.yaml or service.yaml..."
              className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded font-semibold text-xs transition-colors"
            >
              {isSubmitting ? 'Filing Incident...' : 'Save & Publish to Switch Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
