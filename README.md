# OmniCraft ⚡

[![Antigravity](https://img.shields.io/badge/Antigravity-v2.0-blue?style=for-the-badge&logo=google)](https://github.com/MykeShale/OmniCraft)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Supported-7c3aed?style=for-the-badge&logo=anthropic)](https://github.com/MykeShale/OmniCraft)
[![Cursor AI](https://img.shields.io/badge/Cursor_AI-Compatible-000000?style=for-the-badge)](https://github.com/MykeShale/OmniCraft)
[![GitHub Copilot](https://img.shields.io/badge/GitHub_Copilot-Ready-181717?style=for-the-badge&logo=github)](https://github.com/MykeShale/OmniCraft)
[![OpenHands & Cline](https://img.shields.io/badge/OpenHands_|_Cline-AGENTS.md-10b981?style=for-the-badge)](https://github.com/MykeShale/OmniCraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](LICENSE)

> **Universal multi-agent engineering & skills framework for all AI coding assistants.**  
> Equips **Google Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, **GitHub Copilot**, and **autonomous agents** with 100+ benchmark-grade engineering skills across native mobile, responsive web, and distributed backend architectures.

---

## 🌐 Universal AI Runtime Support

OmniCraft is designed from the ground up to be **tool-agnostic and universally pluggable**. Whether you develop using terminal agents, IDE extensions, or web AI assistants, OmniCraft automatically activates:

| AI Runtime / Assistant | Compatibility Adapter | How It Works |
| :--- | :--- | :--- |
| **Google Antigravity & Gemini** | [`skills.json`](./skills.json) | Discovered in `~/.gemini/config/skills/` or `.agents/skills/`. Dynamically triggers skills via progressive disclosure. |
| **Anthropic Claude Code & Claude Desktop** | [`CLAUDE.md`](./CLAUDE.md) | Claude automatically reads `CLAUDE.md` from the project root and routes execution through the master orchestrators. |
| **Cursor IDE (Agent Mode & Composer)** | [`.cursorrules`](./.cursorrules) | Cursor automatically ingests `.cursorrules` to enforce Apple HIG mobile rules, TDD gates, and token design standards. |
| **GitHub Copilot & VS Code** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | Injected into GitHub Copilot chat and inline completions to maintain consistent architectural invariants. |
| **Windsurf Cascade (Codeium)** | [`.cursorrules`](./.cursorrules) & [`AGENTS.md`](./AGENTS.md) | Cascade automatically reads project rules and follows the structured engineering lifecycles. |
| **OpenHands, Cline & Roo Code** | [`AGENTS.md`](./AGENTS.md) | Autonomous agents recognize `AGENTS.md` as the authoritative system specification for task decomposition. |

---

## 🗂️ Clean 7-Domain Architecture

OmniCraft organizes 100+ specialized engineering capabilities into 7 clean domain directories:

```text
OmniCraft/
├── 📁 orchestrators/     # Flagship Autonomous Master Orchestrators & Compilers
├── 📁 mobile/            # Native Mobile UI/UX, Expo, React Native & App Store Deployments
├── 📁 frontend/          # Modern Web SaaS, Design Systems, Tokens & Typography
├── 📁 backend/           # System Architecture, API Contracts & Database Engineering
├── 📁 qa-security/       # TDD Pipelines, Security Hardening & Zero-Trust Auditing
├── 📁 devops-cloud/      # SRE Reliability, Observability & Cloud Performance
├── 📁 motion-video/      # Programmatic Video, Continuous Cameras & Audio FX
├── 📄 AGENTS.md          # Universal Agent Standard (OpenHands, Cline, Aider)
├── 📄 CLAUDE.md          # Anthropic Claude Code & Desktop Configuration
├── 📄 .cursorrules       # Cursor AI Agent & Composer Directives
├── 📄 skills.json        # Antigravity & LLM Discovery Manifest
├── 📄 README.md          # Architecture & Documentation
└── 📄 LICENSE            # MIT License
```

---

## 🧭 Domain Directory Map

| Domain Folder | Scope & Standards | Included Skills |
| :--- | :--- | :--- |
| [📁 `orchestrators/`](./orchestrators) | **Master Orchestrators & Compilers**: Directs and executes full-stack pipelines, freezes intent contracts, and coordinates sub-skills. | `frontend-master`, `backend-master`, `fullstack-master`, `writing-plans`, `executing-plans` |
| [📁 `mobile/`](./mobile) | **Mobile UI/UX & Native Platforms**: Apple HIG fidelity, Expo Router navigation, native bottom sheets, touch targets (>= 48dp), and Reanimated motion physics. | `mobile-app-ui-design`, `appllama-app-design-skill`, `appllama-usage`, `expo-ui`, `expo-native-ui`, `expo-router`, `expo-animation`, `expo-design-system`, `react-native-skills`, `eas-*` (27 skills) |
| [📁 `frontend/`](./frontend) | **Web UI/UX & Design Systems**: Anti-slop typography, 79 visual styles, 192 product palettes, DTCG design tokens, and shadcn primitives. | `ui-ux-pro-max`, `distinctive-frontend`, `impeccable`, `shadcn-ui`, `design-tokens`, `brandkit`, `build-dashboard`, `react-best-practices` (26 skills) |
| [📁 `backend/`](./backend) | **Architecture & Data Engineering**: Formal ADRs, modular monoliths, contract-first OpenAPI schemas, and zero-downtime DB migrations. | `architecture-designer`, `microservices-architect`, `api-designer`, `postgres-pro`, `sql-pro`, `database-optimizer` (6 skills) |
| [📁 `qa-security/`](./qa-security) | **Quality, TDD & Security**: Red-Green-Refactor test suites, OWASP Top 10 defense, zero-trust auth, and automated WCAG 2.2 AA gates. | `test-driven-development`, `test-master`, `secure-code-guardian`, `security-reviewer`, `code-reviewer`, `a11y-audit`, `systematic-debugging` (11 skills) |
| [📁 `devops-cloud/`](./devops-cloud) | **Cloud & Production Reliability**: Prometheus/Grafana metrics, SLI/SLO budgets, structured JSON logging, and Vercel cloud scaling. | `sre-engineer`, `monitoring-expert`, `performance`, `deploy-to-vercel`, `vercel-optimize`, `vercel-cli-with-tokens` (6 skills) |
| [📁 `motion-video/`](./motion-video) | **Motion Graphics & Media**: Programmatic canvas video generation, continuous 3D camera paths, and procedural sound design. | `motion-design`, `motion-graphics`, `cinematic-camera`, `cinematic-film`, `sound-design`, `web-sims`, `remotion-*` (23 skills) |

---

## 🏛️ System Architecture: The Orchestration Flow

```mermaid
graph TD
    User([User Request / Intent]) --> Router{OmniCraft Router}
    
    Router -->|Full Platform / System| FSM[fullstack-master]
    Router -->|Mobile & Web UI/UX| FEM[frontend-master]
    Router -->|APIs / DB / Security| BEM[backend-master]
    
    FSM -->|Decomposes & Coordinates| FEM
    FSM -->|Decomposes & Coordinates| BEM
    
    subgraph "Omni UI/UX Pipeline (Mobile & Web)"
        FEM --> FEM_A[Phase A: Benchmarking & Palette Brief]
        FEM --> FEM_B[Phase B: Platform Primitives & Native Motion]
        FEM --> FEM_C[Phase C: A11y & Device Interaction Gates]
        
        FEM_A -.-> MOB_UX[mobile: mobile-app-ui-design & appllama]
        FEM_A -.-> UX1[frontend: ui-ux-pro-max]
        FEM_B -.-> EXPO[mobile: expo-ui & react-native-skills]
        FEM_B -.-> WEB[frontend: shadcn-ui & design-tokens]
        FEM_C -.-> A11Y[qa-security: a11y-audit]
    end
    
    subgraph "Backend Resilience Pipeline"
        BEM --> BEM_1[Phase 1: Architecture Boundaries & ADRs]
        BEM --> BEM_2[Phase 2: Contract-First API Design]
        BEM --> BEM_3[Phase 3: Database & Migration Engineering]
        BEM --> BEM_4[Phase 4: Zero-Trust Security Hardening]
        BEM --> BEM_5[Phase 5: TDD & Production Reliability]
        
        BEM_1 -.-> ARCH[backend: architecture-designer]
        BEM_2 -.-> API[backend: api-designer]
        BEM_3 -.-> DB[backend: postgres-pro & database-optimizer]
        BEM_4 -.-> SEC[qa-security: secure-code-guardian]
        BEM_5 -.-> TDD[qa-security: test-driven-development]
    end
```

---

## 🚀 Quickstart: Setup for Any AI Assistant

### 1. Claude Code (Anthropic CLI)
Run inside any project or your global workspace:
```bash
git clone https://github.com/MykeShale/OmniCraft.git .omnicraft
# Add reference to your CLAUDE.md:
echo "@.omnicraft/CLAUDE.md" >> CLAUDE.md
```

### 2. Cursor IDE & Windsurf
Clone into your project repository or home folder:
```bash
git clone https://github.com/MykeShale/OmniCraft.git .cursor/omnicraft
```
Cursor immediately ingests `.cursorrules` from the repository root.

### 3. Google Antigravity
Clone globally or into your project:
```bash
# Windows (PowerShell)
git clone https://github.com/MykeShale/OmniCraft.git "$env:USERPROFILE\.gemini\config\skills"

# macOS / Linux
git clone https://github.com/MykeShale/OmniCraft.git ~/.gemini/config/skills
```

### 4. OpenHands, Cline & Roo Code
Place OmniCraft in your workspace root. Agents automatically ingest [`AGENTS.md`](./AGENTS.md).

---

## 🛡️ Engineering Guarantees

1. **Evidence Before Assertions**: Real verification output (passing test runs, clean builds, zero lint warnings) required before declaring work complete.
2. **Zero Hardcoded Design Values**: All visual properties derive from semantic design tokens, ensuring cohesive theming.
3. **Contract-First Stability**: Backends freeze database schemas, validation models, and error responses before business logic is written.
4. **Inclusive Accessibility**: UIs strictly enforce WCAG 2.2 AA contrast ratios, mobile touch targets (>= 48dp), and accessible ARIA/keyboard navigation.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">
  <sub>Crafted for universal autonomous engineering across all AI runtimes by <b>Myke Shale</b>.</sub>
</div>
