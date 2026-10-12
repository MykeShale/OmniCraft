# CLAUDE.md — Claude Code & Claude Desktop Instructions for OmniCraft

Welcome, Claude. You have access to **OmniCraft**, an enterprise repository of 100+ specialized engineering skills and flagship master orchestrators.

---

## ⚡ How Claude Must Execute Tasks

Do not generate ad-hoc or uncoordinated code. Always follow the OmniCraft Orchestrated Pipeline:

### When Handling Mobile Apps (Expo / React Native / iOS / Android)
1. Read and activate [`orchestrators/frontend-master/SKILL.md`](./orchestrators/frontend-master/SKILL.md).
2. Consult [`mobile/mobile-app-ui-design/SKILL.md`](./mobile/mobile-app-ui-design/SKILL.md) and [`mobile/appllama-app-design-skill/SKILL.md`](./mobile/appllama-app-design-skill/SKILL.md) for layout hierarchy, Apple HIG conventions, and thumb-reach zones.
3. Use native platform controls via [`mobile/expo-ui`](./mobile/expo-ui) and [`mobile/expo-native-ui`](./mobile/expo-native-ui).
4. Implement fluid 60/120fps motion using Reanimated springs via [`mobile/expo-animation`](./mobile/expo-animation).
5. Ensure touch targets >= 48×48dp and safe area padding via `useSafeAreaInsets`.

### When Handling Modern Web / SaaS Interfaces
1. Activate [`orchestrators/frontend-master/SKILL.md`](./orchestrators/frontend-master/SKILL.md).
2. Reject generic AI defaults (no unstyled Inter, no plain purple gradients, no oversized cards).
3. Use token-driven primitives from [`frontend/shadcn-ui`](./frontend/shadcn-ui) and [`frontend/ui-ux-pro-max`](./frontend/ui-ux-pro-max).
4. Verify WCAG 2.2 AA contrast compliance using [`qa-security/a11y-audit`](./qa-security/a11y-audit).

### When Handling Backend, APIs, Security & Databases
1. Read and activate [`orchestrators/backend-master/SKILL.md`](./orchestrators/backend-master/SKILL.md).
2. Model APIs contract-first using OpenAPI / Zod specifications ([`backend/api-designer`](./backend/api-designer)).
3. Guarantee database integrity with safe expand-contract migrations and strict constraints ([`backend/postgres-pro`](./backend/postgres-pro), [`backend/database-optimizer`](./backend/database-optimizer)).
4. Defend against OWASP Top 10 with parameterized queries and zero-trust auth ([`qa-security/secure-code-guardian`](./qa-security/secure-code-guardian)).
5. Verify changes with TDD unit/integration tests ([`qa-security/test-driven-development`](./qa-security/test-driven-development)).

---

## 🧭 Repository Structure Reference
- `orchestrators/`: Master Orchestrators (`frontend-master`, `backend-master`, `fullstack-master`).
- `mobile/`: Native Mobile UI/UX & Expo Ecosystem (27 skills).
- `frontend/`: Design Tokens, Typography & Web UI Systems (26 skills).
- `backend/`: Architecture, System Design & Databases (6 skills).
- `qa-security/`: TDD, QA Automation & Zero-Trust Security (11 skills).
- `devops-cloud/`: SRE, Telemetry & Cloud Deployments (6 skills).
- `motion-video/`: Remotion Video, Three.js & Audio FX (23 skills).
- `skills.json`: Runtime index mapping all 7 category directories.
