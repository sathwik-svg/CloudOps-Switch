# Switch Hackathon Official Submission Form

---

### Project Title
**CloudOps Switch — AI-Powered Multi-Agent DevOps Team**

---

### Tagline / 1-Sentence Summary
An enterprise multi-agent DevOps collaboration platform coordinating OpenAI Codex, Kubernetes, and Incident Coordinator agents inside Switch rooms and Mattermost to diagnose and resolve production deployment failures in seconds.

---

### Project Description
#### Problem Solved
Modern cloud-native deployment failures cut across disparate domains: CI/CD build scripts, Docker cgroups, Kubernetes orchestration manifests, and networking policies. Developers and SREs waste hours manually correlating container exit codes (e.g. `OOMKilled 137`) with obscure YAML configurations while attempting to coordinate updates across team chat channels.

#### Target Users
Site Reliability Engineers (SREs), Platform Engineers, DevOps Teams, and Engineering Leaders managing microservices in Kubernetes.

#### Practical Benefits
1. **Accelerated MTTR**: Shrinks triage time from hours to seconds by concurrently auditing CI/CD logs and Kubernetes manifests.
2. **True Collaborative Consensus**: Employs multiple specialized agents in a shared room rather than a generic single chatbot.
3. **Native Chat Integration**: Engineers triage and interact directly from Mattermost `#devops-alerts` via the Switch bridge without context switching.
4. **Honest Operational Reliability**: Implements strict graceful degradation when disconnected with verifiable audit logs.

---

### Recommended Hackathon Tracks

Based on our concrete implementation, CloudOps Switch directly qualifies for:

1. **Track 1: Best Multi-Agent Team / AI Teammate Infrastructure with Switch**
   - *Qualification*: Utilizes official Switch rooms (`room-incident-triage`) and Switch agent protocol routing to coordinate 3 specialized agents (OpenAI Codex DevOps Engineer, Kubernetes Engineer, and Incident Coordinator).
2. **Track 2: Best Developer Tool / DevOps Automation**
   - *Qualification*: Solves tangible production failure scenarios (Kubernetes OOMKilled cgroup limits, missing health probes, ingress port mismatches) with automated patch generation.
3. **Track 3: Best Communication Bridge Integration (Mattermost / ChatOps)**
   - *Qualification*: Connects Mattermost team channels directly into the Switch room event stream with bidirectional webhook ingestion.

---

### Links

- **GitHub Repository**: `https://github.com/sathwik-svg/CloudOps-Switch.git` *(Public repository)*
- **Demo Video (under 3 min)**: `https://youtu.be/cloudops-switch-demo` *(Demo video URL placeholder)*
- **Live Demo URL**: `https://ais-dev-rx7untwauwra52wxsganm4-981864576343.asia-east1.run.app`

---

### How Did You Use Switch?

Switch serves as the central collaboration infrastructure and room coordinator across our entire system:

1. **Configuration**: Configured via the official `switch.yaml` specification defining workspace `cloudops-switch`, room `incident-triage`, and agent manifests.
2. **Connected Agents**:
   - **OpenAI Codex** as the **DevOps Engineer**: Connected via the Codex agent harness to inspect build logs and container exit codes.
   - **Kubernetes Engineer**: Custom Switch agent protocol harness auditing Pod manifests, resource limits, and health check probes.
   - **Incident Coordinator**: Orchestrating agent findings, assigning severity, and publishing consolidated post-mortems.
3. **Communication Platform**: Mattermost was configured as the primary platform bridge (`mattermost-primary`), routing alerts from `#devops-alerts` into the Switch room.
4. **Real Work Performed**: Agents inspect build logs, detect cgroup memory violations, validate YAML manifests against Kubernetes API specs, and broadcast automated pull requests to the team chat.

---

### What Did You Like About Switch, and What Would You Improve?

#### What We Liked:
- **Room Abstraction Over Model Locking**: Switch's concept of shared collaboration "rooms" provides the missing architectural primitive for multi-agent workflows. Instead of forcing teams into one vendor's model or API, Switch allows an OpenAI Codex agent, a Claude Code agent, and human developers to communicate in the same context thread.
- **Chat Platform Decoupling**: Bridging team communication platforms (like Mattermost, Slack, and Discord) directly into the agent mesh allows AI teammates to meet developers where they already work.
- **Clean Event Protocol**: The Switch agent event schema (`room.agent_joined`, `room.message`, `task.dispatch`) makes it straightforward to build custom enterprise agents.

#### What We Would Improve:
- **Standardized Diagnostic Mock Engine for CI**: While live connections to Mattermost and local agent runners work well, having an official Switch CLI command for end-to-end dry-run verification (e.g. `switch test room --dry-run`) would make automated CI/CD pipeline verification even smoother.
- **Granular Agent Capability Negotiation**: Enhancing the agent protocol to support dynamic capability negotiation (e.g. an agent advertising `can_patch_git=true` or `requires_manifest_read=true`) would streamline dynamic task routing when multiple specialized agents inhabit the same room.
