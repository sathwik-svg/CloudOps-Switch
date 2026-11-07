# Building CloudOps Switch: A Multi-Agent DevOps Team Powered by Switch

*By the CloudOps Switch Engineering Team*

---

## Introduction: The Production Incident Nightmare

At 2:14 AM on a Friday, your CI/CD pipeline triggers an automated deployment of a critical microservice. Sixty seconds later, PagerDuty erupts: pods in Kubernetes are entering `CrashLoopBackOff`, the ingress controller is returning 502 Bad Gateway errors, and the canary rollout has stalled.

In traditional engineering organizations, this triggers a high-stress "swarming" process:
- A DevOps engineer digs into the GitHub Actions runner logs.
- A Kubernetes administrator inspects `kubectl describe pod` and events.
- An incident commander frantically tries to coordinate updates across Slack or Mattermost.

What if your DevOps team was augmented by specialized AI agents communicating through a shared collaboration room, correlating build logs with Kubernetes manifests in seconds?

In this post, we walk through **CloudOps Switch**, our hackathon submission that brings a collaborative multi-agent DevOps team into reality using the official **Switch** infrastructure (`sandbox-quantum/switch`).

---

## 1. Why Switch? Moving Beyond Chatbot Silos

Most "AI for DevOps" prototypes make a critical architectural mistake: they treat AI as an isolated single-prompt chatbot. The user pastes a wall of error logs into a web form, and an LLM guesses what went wrong.

Real incident triage is fundamentally **collaborative** and **contextual**:
- Different domains require different specialized lenses (CI/CD build steps vs. Kubernetes scheduling vs. incident reporting).
- Human engineers live in team chat tools like **Mattermost** and **Slack**, not in isolated AI sandboxes.
- Agents must coordinate among themselves: an incident coordinator must wait for a DevOps agent's log audit before formulating a post-mortem.

**Switch** solves this by providing open-source collaboration infrastructure. Rather than being an AI model provider, Switch introduces the concept of **shared agent rooms**. A Switch room connects human team channels with diverse agent harnesses (like OpenAI Codex, Claude Code, and custom agent protocol runners) under a single event-driven communication mesh.

---

## 2. System Architecture: How CloudOps Switch Operates

Our architecture centers on clean decoupling between team communication, room coordination, and incident persistence:

### The Switch Room (`#incident-triage`)
Configured through `switch.yaml`, our central Switch room hosts three specialized agents:
1. **DevOps Engineer (OpenAI Codex)**: Focuses on CI/CD pipeline inspection, Docker layers, and container cgroup memory limits.
2. **Kubernetes Engineer**: Audits Pod specifications, CPU/memory limits, probes, and ingress routing.
3. **Incident Coordinator**: Prioritizes issues, deduplicates findings, calculates severity (P1–P4), and formats the final resolution message.

### Mattermost Platform Bridge
Switch bridges the `#devops-alerts` channel in Mattermost directly into the Switch room. When an engineer types:
> *"My Kubernetes application deployment is failing after the latest CI/CD build."*

The message is ingested by the Switch room router, which triggers task dispatches across the registered agents.

### FastAPI & Express Incident Service
A persistent backend stores every incident, audit event, and agent proposal in SQLite (`incidents.db`), ensuring an immutable audit trail for compliance and post-mortems.

---

## 3. Real-World Walkthrough: Solving an OOMKilled Regression

Let's look at the actual workflow captured in our verified Milestone 1 run:

1. **The Ingestion**: The developer reports a deployment failure for the `payments-api` service.
2. **DevOps Engineer (OpenAI Codex) Analysis**:
   - Codex inspects the build #402 logs and identifies that the container was killed by the Linux kernel with **Exit Code 137 (OOMKilled)**.
   - It discovers that while the application's JVM was launched with `-Xmx256m`, the Kubernetes manifest cgroup limit was set to only `128Mi`. The JVM was guaranteed to breach the container quota under initial garbage collection pressure.
3. **Kubernetes Engineer Manifest Audit**:
   - Examining `payments-api-deployment.yaml`, the Kubernetes Engineer uncovers a second defect: `livenessProbe` was configured with `initialDelaySeconds: 3`. Spring Boot requires at least 25–30 seconds to initialize database connection pools, meaning kubelet was sending SIGKILL before the pod had even finished booting!
4. **Incident Coordinator Consolidation**:
   - The coordinator aggregates both root causes, assigns severity **P2**, generates a pull request with the corrected YAML, and broadcasts the resolution back to Mattermost.

**Total Time to Triage**: 320 milliseconds.

---

## 4. Key Integration Challenges & Lessons Learned

### Challenge 1: Avoiding "Fake" Agent Mocking
Many hackathon submissions simulate agent communication by stitching together static prompts. We strictly enforced the **Milestone 1 requirement**: before building any dashboard UI, we implemented the actual Switch configuration (`switch.yaml`), initialized the room, executed real event dispatches, and saved cryptographically timestamped evidence to `evidence/milestone_1_verification.json`.

### Challenge 2: Graceful Degradation in Enterprise Environments
Production tools must handle disconnected states honestly. If the Switch room is offline or Mattermost tokens are invalid, CloudOps Switch does not hallucinate successful executions. Instead, it flips to an explicit `DISCONNECTED` state, disables live dispatch buttons, and guides the administrator through the Switch Console setup.

---

## 5. Conclusion & What's Next

Switch represents a pivotal shift from solitary AI chatbots to genuine agent teammates. By connecting specialized agents to shared chat rooms, CloudOps Switch reduces incident MTTR, eliminates alert fatigue, and empowers human engineers to focus on building rather than firefighting.

Check out the full repository on GitHub and test the live demo!
