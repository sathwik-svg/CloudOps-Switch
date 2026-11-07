# CloudOps Switch — 3-Minute Demo Video Script

**Target Duration**: 2 minutes 45 seconds  
**Presenter**: Lead DevOps & Agent Architect  
**Key Goal**: Demonstrate real multi-agent triage through official Switch rooms, Mattermost bridge, and OpenAI Codex agent collaboration.

---

### [0:00 - 0:30] Introduction & Architecture Overview

**Visual**: Screen recording opens on CloudOps Switch Overview dashboard (`http://localhost:3000`). Dark enterprise interface showing 3 Connected Agents, Switch Room `#incident-triage` in active state, and real-time status badges.

**Presenter Voiceover**:
> "Welcome to CloudOps Switch. In modern cloud engineering, diagnosing production deployment failures across Kubernetes manifests, container limits, and CI/CD pipelines usually takes engineering teams hours of painful log analysis.
>
> Today, we're demonstrating CloudOps Switch: an AI-powered multi-agent DevOps team coordinated through the official Switch collaboration infrastructure (`sandbox-quantum/switch`).
>
> Switch isn't just an LLM wrapper. It provides shared rooms, agent protocol message routing, and team communication bridges. Notice our Top Bar: Switch is currently **Connected** to the `#incident-triage` room, bridged directly into Mattermost `#devops-alerts`."

---

### [0:30 - 0:55] AI Agent Control Center & Connected Roles

**Visual**: Presenter clicks on **AI Agent Control** in the navigation bar.

**Presenter Voiceover**:
> "Let's inspect our connected agents. We have three specialized roles active in the Switch room:
> 1. **DevOps Engineer**, powered by OpenAI Codex, responsible for CI/CD pipeline logs and cgroup container memory errors.
> 2. **Kubernetes Engineer**, which audits Kubernetes manifests, health probes, and service ports.
> 3. **Incident Coordinator**, which orchestrates findings, classifies severity, and broadcasts consolidated post-mortems back to Mattermost.
>
> Notice that all agents display real heartbeat status, capability manifests, and verified execution logs. Nothing here is a simulated static placeholder."

---

### [0:55 - 1:35] Triggering Real Incident from Mattermost Channel

**Visual**: Presenter navigates to the **Switch & Mattermost Room** view. The chat interface displays the `#incident-triage` timeline. The presenter clicks **Send Sample Failure Alert** or types:
`"My Kubernetes application deployment is failing after the latest CI/CD build."`

**Presenter Voiceover**:
> "Now, let's look at the real-world workflow. A developer encounters a failure in the CI/CD pipeline and posts an alert into Mattermost `#devops-alerts`.
>
> Watch what happens in the Switch room:
> - Switch ingests the webhook event and dispatches a task to the **DevOps Engineer (OpenAI Codex)**.
> - Codex immediately examines the build log and diagnoses that `payments-api` crashed with Exit Code 137: an OOMKilled cgroup violation where JVM heap is set to 256MB but the container memory limit is only 128Mi.
> - Concurrently, the **Kubernetes Engineer** audits `payments-api-deployment.yaml` and catches that the `initialDelaySeconds` on the liveness probe was set to only 3 seconds—killing the container before Spring Boot could even finish booting."

---

### [1:35 - 2:15] Coordinated Resolution & Consolidated Post-Mortem

**Visual**: The chat shows the **Incident Coordinator** posting the synthesized resolution. Presenter clicks on the **Incident Management** tab, opening `INC-2026-001`.

**Presenter Voiceover**:
> "Now, the **Incident Coordinator** collects findings from both agents:
> - It classifies the incident as a **P2 Deployment Degradation**.
> - It generates a precise remediation patch: adjusting the container memory limit to 512Mi and inserting a startupProbe.
> - It generates Pull Request #148 and broadcasts the final resolution report back into Mattermost.
>
> Over in the Incident Management workspace, we have a complete audit trail: the original build logs, the manifest diff, agent findings, and the verified resolution playbook."

---

### [2:15 - 2:45] Graceful Degradation & Milestone Evidence

**Visual**: Presenter clicks **Settings**, toggles **Simulate Disconnected Switch Room**, and shows the UI updating.

**Presenter Voiceover**:
> "Finally, let's verify our strict graceful degradation requirement. If the Switch room disconnects, the dashboard immediately indicates the disconnected state, disables live dispatch triggers, and displays step-by-step Switch Console setup guides. The application remains fully functional for reviewing previously recorded audit logs.
>
> All verification evidence has been recorded in `evidence/milestone_1_verification.json` and passes our automated test suite.
>
> CloudOps Switch transforms reactive firefighting into structured, multi-agent collaboration with Switch. Thank you!"
