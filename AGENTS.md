# OmniCraft — Universal Agent Specification & Runtime Directives

Welcome to **OmniCraft**. This repository contains a production-grade library of 100+ specialized engineering skills and flagship master orchestrators.

---

## 🎯 Universal Orchestrator Protocol

Whenever you are tasked with designing, architecting, implementing, or auditing software, you MUST route execution through the appropriate master orchestrator before writing ad-hoc code:

### 1. Mobile App UI/UX & Web Frontend
* **Primary Orchestrator**: [`orchestrators/frontend-master/SKILL.md`](./orchestrators/frontend-master/SKILL.md)
* **Trigger**: Any request involving mobile app screens (Expo, React Native, SwiftUI, Flutter), dashboards, web interfaces, design systems, or styling.
* **Dispatch Pipeline**:
  - **Phase A (Research & Hierarchy)**: Dispatches [`mobile/mobile-app-ui-design`](./mobile/mobile-app-ui-design) and [`mobile/appllama-app-design-skill`](./mobile/appllama-app-design-skill) for Apple HIG / Android ergonomics and category benchmarks.
  - **Phase B (Native Assembly & Motion)**: Dispatches [`mobile/expo-ui`](./mobile/expo-ui), [`mobile/expo-native-ui`](./mobile/expo-native-ui), [`mobile/expo-animation`](./mobile/expo-animation), [`mobile/react-native-skills`](./mobile/react-native-skills), and [`frontend/shadcn-ui`](./frontend/shadcn-ui).
  - **Phase C (Quality & Accessibility Gate)**: Enforces WCAG 2.2 AA and 48×48dp touch targets via [`qa-security/a11y-audit`](./qa-security/a11y-audit).

### 2. Backend, APIs, Security & Databases
* **Primary Orchestrator**: [`orchestrators/backend-master/SKILL.md`](./orchestrators/backend-master/SKILL.md)
* **Trigger**: Any request involving APIs, server architectures, microservices, databases, migrations, or security.
* **Dispatch Pipeline**:
  - **Phase 1 (Boundaries & ADRs)**: Dispatches [`backend/architecture-designer`](./backend/architecture-designer) and [`backend/microservices-architect`](./backend/microservices-architect).
  - **Phase 2 (Contract-First APIs)**: Dispatches [`backend/api-designer`](./backend/api-designer) for OpenAPI / Zod specifications.
  - **Phase 3 (Database Integrity)**: Dispatches [`backend/postgres-pro`](./backend/postgres-pro) and [`backend/database-optimizer`](./backend/database-optimizer).
  - **Phase 4 (Zero-Trust Security)**: Dispatches [`qa-security/secure-code-guardian`](./qa-security/secure-code-guardian).
  - **Phase 5 (TDD Verification Gate)**: Dispatches [`qa-security/test-driven-development`](./qa-security/test-driven-development) and [`qa-security/test-master`](./qa-security/test-master).

### 3. Full-Stack Applications from Scratch
* **Primary Orchestrator**: [`orchestrators/fullstack-master/SKILL.md`](./orchestrators/fullstack-master/SKILL.md)
* **Workflow**: Freezes data contracts first, coordinates `backend-master` and `frontend-master` in parallel, and executes a self-healing compiler loop until verification passes.

---

## 🧭 Domain Catalog Lookup

* **`orchestrators/`**: Flagship autonomous master orchestrators.
* **`mobile/`**: 27 native mobile skills (Expo, EAS, Appllama, React Native, Apple HIG).
* **`frontend/`**: Web UI/UX, DTCG tokens, typography scales, shadcn components.
* **`backend/`**: System architecture, databases, query optimization, API design.
* **`qa-security/`**: TDD, code review, OWASP Top 10 security, accessibility audits.
* **`devops-cloud/`**: SRE, Prometheus/Grafana monitoring, Vercel deployments.
* **`motion-video/`**: Remotion React video, three.js cameras, sound design.

---

## 🛡️ Non-Negotiable Engineering Rules
1. **Evidence First**: Never report a feature or fix as complete without executing the test suite or build command and verifying exit code 0.
2. **Zero Slop**: Strictly reject unstyled default fonts, generic purple-blue gradients, and web-like mobile widgets.
3. **Touch Ergonomics**: All mobile touch targets must be at least 48×48dp with safe area inset handling.
