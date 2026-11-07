# CloudOps Switch — AI-Powered Multi-Agent DevOps Team

> **Enterprise-grade multi-agent DevOps collaboration platform powered by the official Switch infrastructure (`sandbox-quantum/switch`), Switch Rooms, and Mattermost.**

[![CI/CD Pipeline](https://github.com/sathwik-svg/CloudOps-Switch/actions/workflows/ci.yml/badge.svg)](https://github.com/sathwik-svg/CloudOps-Switch/actions)
[![Switch Protocol](https://img.shields.io/badge/Switch%20Protocol-v1.0-06b6d4.svg)](https://github.com/sandbox-quantum/switch)
[![Team Bridge](https://img.shields.io/badge/ChatOps-Mattermost-5c6ac4.svg)](https://mattermost.com)
[![Supported Agent](https://img.shields.io/badge/AI%20Agent-OpenAI%20Codex-10b981.svg)](https://openai.com)
[![Frontend](https://img.shields.io/badge/React%2019-Tailwind%20v4-38bdf8.svg)](https://react.dev)
[![Backend](https://img.shields.io/badge/Node.js%20%2F%20FastAPI-SQLite3-f59e0b.svg)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 📌 Table of Contents
- [1. Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
- [2. System Architecture](#2-system-architecture)
- [3. Core Technologies Used](#3-core-technologies-used)
- [4. AI Agent Team & Defined Responsibilities](#4-ai-agent-team--defined-responsibilities)
- [5. Switch Integration & Room Coordination](#5-switch-integration--room-coordination)
- [6. Real-World Demonstration Workflow](#6-real-world-demonstration-workflow)
- [7. Tested Functionality vs. Credentialed Integrations](#7-tested-functionality-vs-credentialed-integrations)
- [8. Installation & Quickstart](#8-installation--quickstart)
- [9. Docker & Container Deployment](#9-docker--container-deployment)
- [10. Automated Testing & Verification](#10-automated-testing--verification)
- [11. Graceful Degradation Model](#11-graceful-degradation-model)
- [12. Hackathon Deliverables Summary](#12-hackathon-deliverables-summary)

---

## 1. Executive Summary & Problem Statement

Production outages in Kubernetes environments rarely stem from a single, isolated bug. They occur at the complex intersections of **CI/CD build scripts**, **container runtime cgroups**, **JVM heap sizing**, and **Kubernetes orchestration probes**. 

When a microservice enters `CrashLoopBackOff`, on-call engineers spend critical hours:
1. Excavating thousands of lines of GitHub Actions / Jenkins build logs.
2. Decoding cryptic Linux kernel signals (e.g. Exit Code `137 OOMKilled`).
3. Manually auditing `deployment.yaml` for missing or misconfigured probes.
4. Manually updating incident tickets and coordinating with developers across chat channels.

**CloudOps Switch** transforms chaotic firefighting into a structured, automated multi-agent workflow. Rather than using an isolated single-prompt chatbot, CloudOps Switch leverages the official **Switch** collaboration infrastructure (`sandbox-quantum/switch`) to host specialized AI teammates in a shared room. Developers report issues in **Mattermost**, the agents analyze the failure concurrently, reach consensus, and broadcast an actionable post-mortem with an automated Git pull request patch back to the team.

---

## 2. System Architecture

Switch acts as the central collaboration infrastructure and event bus—**not** an LLM wrapper.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Mattermost Team Channel                         │
│                    (e.g., #devops-alerts, #triage)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Webhook / Bot API
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Switch Coordination Engine                       │
│                         (sandbox-quantum/switch)                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Switch Room: #incident-triage                │  │
│  │                                                                  │  │
│  │   ┌───────────────────────────┐     ┌────────────────────────┐   │  │
│  │   │   DevOps Engineer Agent   │     │  Kubernetes Engineer   │   │  │
│  │   │       (OpenAI Codex)      │     │         Agent          │   │  │
│  │   └─────────────┬─────────────┘     └───────────┬────────────┘   │  │
│  │                 │                               │                │  │
│  │                 └───────────────┬───────────────┘                │  │
│  │                                 ▼                                │  │
│  │                 ┌───────────────────────────────┐                │  │
│  │                 │      Incident Coordinator     │                │  │
│  │                 └───────────────┬───────────────┘                │  │
│  └─────────────────────────────────┼────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ Switch Agent Protocol Events
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    FastAPI & Express Full-Stack Server                 │
│  ┌─────────────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
│  │ /api/switch/events      │  │ /api/incidents  │  │ /api/health    │  │
│  └─────────────┬───────────┘  └────────┬────────┘  └───────┬────────┘  │
│                │                       │                   │           │
│                ▼                       ▼                   ▼           │
│         SQLite Storage (incidents.db: events, tasks, audit records)    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      CloudOps Switch Dashboard (React)                 │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │ Overview & Status │  │ Agent Control Hub │  │ Switch Room View  │  │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘  │
│   ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐  │
│   │ CI/CD & K8s Audit │  │ Incident Manager  │  │ Hackathon Deliver │  │
│   └───────────────────┘  └───────────────────┘  └───────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Core Technologies Used

### Multi-Agent Orchestration & Protocol
- **Switch Protocol v1.0 (`sandbox-quantum/switch`)**: Central open-source collaboration infrastructure managing rooms, event routing, and agent lifecycle.
- **OpenAI Codex Agent Harness (`codex-agent-v1`)**: Official supported agent harness for repository log parsing, diff inspection, and patch generation.
- **Switch Custom Agent Protocol**: Event-driven protocol envelopes (`room.agent_joined`, `task.dispatch`, `room.message`, `task.complete`).
- **Google GenAI SDK (`@google/genai`)**: Server-side LLM inference (`gemini-3.8-flash`) for deep semantic log reasoning and automated remediation patch generation.

### Communication & ChatOps
- **Mattermost Platform Bridge**: Bidirectional webhook connector linking Mattermost `#devops-alerts` channels directly into the Switch room event stream.
- **Switch Room Message Bus**: Correlation ID tracking, thread message aggregation, and bot dispatching.

### Backend & Persistence
- **Node.js & Express**: Full-stack dev & production runtime hosting REST endpoints, WebSocket/SSE events, and Vite middleware on port 3000.
- **Python 3.10 & FastAPI**: Standalone microservice (`backend/main.py`) providing Pydantic data models and compliance verification.
- **SQLite3 (`incidents.db`)**: Persistent storage for incident lifecycle, agent findings, audit logs, and configuration state.
- **Pydantic v2**: High-performance schema validation for incoming webhook payloads and incident records.

### Frontend & UI Architecture
- **React 19**: Modern functional component architecture with hooks and clean state isolation.
- **TypeScript 5.x**: Strict end-to-end type safety across agent payloads, manifests, and UI state.
- **Vite 8**: Next-generation bundler with optimized HMR and instant asset compilation.
- **Tailwind CSS v4**: Theme tokens, `@custom-variant dark`, and 60-30-10 color discipline (`#080c14` dark canvas).
- **Lucide React**: Clean, accessible iconography strictly decoupled from decorative fluff.
- **Plus Jakarta Sans, DM Sans & JetBrains Mono**: Distinctive typography pairing with monospace tabular numerals for metrics and logs.

### DevOps & Containerization
- **Docker**: Multi-stage Alpine Linux container build (`Dockerfile`) minimizing attack surface and image footprint.
- **Docker Compose (`docker-compose.yml`)**: Single-command container orchestration with built-in healthcheck probes.
- **GitHub Actions CI/CD (`.github/workflows/ci.yml`)**: Automated testing, linting, and build verification on push and pull requests.

---

## 4. AI Agent Team & Defined Responsibilities

| Agent | Harness / Engine | Core Responsibilities |
| :--- | :--- | :--- |
| **DevOps Engineer** | `openai-codex` (`codex-agent-v1`) | Inspects CI/CD build logs, parses containerization steps, diagnoses kernel exit codes (`137 OOMKilled`), and audits Dockerfile layers. |
| **Kubernetes Engineer** | `switch-agent-protocol` | Audits Kubernetes manifests (`apps/v1`), detects missing `startupProbe` / premature `livenessProbe` delays, and verifies ingress canary routing. |
| **Incident Coordinator** | `switch-agent-protocol` | Orchestrates room findings, assigns incident severity (`P1`–`P4`), generates consolidated post-mortems, and broadcasts the resolution back to Mattermost. |

---

## 5. Switch Integration & Room Coordination

The system configuration is authored in `switch.yaml` following official Switch standards:

```yaml
version: "1.0"
workspace:
  name: "cloudops-switch"
  displayName: "CloudOps Switch"

rooms:
  - id: "room-incident-triage"
    name: "incident-triage"
    displayName: "🚨 DevOps Incident Triage"
    integrations:
      - "mattermost-primary"

integrations:
  - id: "mattermost-primary"
    type: "mattermost"
    enabled: true
    config:
      serverUrl: "${MATTERMOST_URL:-https://mattermost.internal.cloudops.net}"
      channel: "devops-alerts"

agents:
  - id: "agent-devops-codex"
    name: "DevOps Engineer"
    provider: "openai-codex"
    harness: "codex-agent-v1"
  - id: "agent-k8s-engineer"
    name: "Kubernetes Engineer"
    provider: "switch-agent-protocol"
  - id: "agent-incident-coordinator"
    name: "Incident Coordinator"
    provider: "switch-agent-protocol"
```

---

## 6. Real-World Demonstration Workflow

### Scenario: Kubernetes Deployment OOMKilled Regression

1. **User Alert Ingestion**:
   A developer reports a failure in Mattermost:
   > *"My Kubernetes application deployment is failing after the latest CI/CD build."*
2. **Switch Task Routing**:
   The Switch room router captures the alert and dispatches concurrent tasks to the DevOps Engineer and Kubernetes Engineer.
3. **DevOps Engineer (OpenAI Codex) Analysis**:
   - Inspects build #402 logs: container image compiled successfully.
   - Detects kernel termination with Exit Code `137 OOMKilled`.
   - Flags defect: `limits.memory: 128Mi` in `deployment.yaml` violates the JVM's `-Xmx256m` heap allocation.
4. **Kubernetes Engineer Manifest Audit**:
   - Discovers `livenessProbe.initialDelaySeconds: 3`, terminating Spring Boot before HikariCP database pools initialize.
   - Recommends adding `startupProbe` with a 30-second failure threshold.
5. **Incident Coordinator Consolidation**:
   - Classifies incident as **P2 - Deployment Degradation**.
   - Compiles remediation patch with updated limits (`512Mi`) and probes.
   - Broadcasts the final post-mortem and PR #148 back into Mattermost `#devops-alerts`.

---

## 7. Tested Functionality vs. Credentialed Integrations

| Feature | Tested & Verified | Credential-Dependent | Notes |
| :--- | :---: | :---: | :--- |
| **Switch Room Protocol Engine** | ✅ | — | Verified via `switch/switch_engine.py` |
| **Milestone 1 Automated Workflow** | ✅ | — | Evidence recorded in `evidence/milestone_1_verification.json` |
| **SQLite Incident Database** | ✅ | — | Verified with `tests/test_switch_verification.py` |
| **Mattermost Ingestion Bridge** | ✅ | — | Ingests live payloads via `/api/mattermost/webhook` |
| **OpenAI Codex Agent Harness** | ✅ | — | Verified deterministic and live LLM triage |
| **Graceful Degradation Toggle** | ✅ | — | Verified: Disconnect safely disables live dispatches |
| **External Mattermost Server** | — | 🔑 | Requires setting `MATTERMOST_URL` and bot token in Settings |
| **Live OpenAI Codex / Gemini API** | — | 🔑 | Uses `GEMINI_API_KEY` or `OPENAI_API_KEY` for live generative reasoning |

---

## 8. Installation & Quickstart

### Prerequisites
- Node.js 20+
- Python 3.10+
- Git

### Steps
```bash
# 1. Clone repository
git clone https://github.com/sathwik-svg/CloudOps-Switch.git
cd CloudOps-Switch

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Run the full-stack development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 9. Docker & Container Deployment

### Run with Docker Compose
```bash
docker-compose up --build
```

### Standalone Docker Build
```bash
docker build -t cloudops-switch:latest .
docker run -p 3000:3000 -e PORT=3000 cloudops-switch:latest
```

---

## 10. Automated Testing & Verification

Run the automated Switch protocol and SQLite persistence test suite:
```bash
python3 tests/test_switch_verification.py
```
Output:
```
....
----------------------------------------------------------------------
Ran 4 tests in 0.002s

OK
```

Execute the Milestone 1 verification script:
```bash
python3 switch/switch_engine.py "My Kubernetes application deployment is failing after the latest CI/CD build."
```

---

## 11. Graceful Degradation Model

If Switch is disconnected or credentials are unconfigured:
1. The dashboard status indicator immediately flips to `DISCONNECTED` (rose/gray).
2. Live dispatch action buttons are safely disabled to prevent phantom runs.
3. An explicit top banner provides a step-by-step setup guide for the Switch Console.
4. Historical and audited incidents remain 100% accessible in offline audit mode.

---

## 12. Hackathon Deliverables Summary

- **Deliverable 1: Public GitHub Repository**: `https://github.com/sathwik-svg/CloudOps-Switch` (Dockerfile, docker-compose, CI workflow, unit tests).
- **Deliverable 2: Professional README**: This file (`README.md`).
- **Deliverable 3: 3-Minute Demo Video Script**: [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md).
- **Deliverable 4: Technical Blog Post**: [`BLOG_POST.md`](BLOG_POST.md).
- **Deliverable 5: Hackathon Submission Form Answers**: [`HACKATHON_SUBMISSION.md`](HACKATHON_SUBMISSION.md).
- **Interactive Hackathon Hub**: Accessible live in the application UI under the **Hackathon Hub** navigation tab.
