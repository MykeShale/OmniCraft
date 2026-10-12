# ⚡ Master Skills

An orchestrator and autonomous agent skills repository for Antigravity & LLM coding environments, powered by specialized workflows for end-to-end software engineering.

---

## 🎯 Flagship Master Orchestrators

### 1. `frontend-master`
* **Role**: Master UI/UX Architect & Frontend Orchestrator.
* **Pipeline**:
  1. **Phase A: Design Direction & Creative Brief** — Identifies palette, typography, visual weight contrasts, rejects generic AI styles.
  2. **Phase B: Architecture & Component Assembly** — Implements accessible, token-driven primitives (Tailwind CSS, shadcn/Radix), full state coverage (loading skeletons, empty states, error banners), and high-density KPI dashboard structures.
  3. **Phase C: Polish, Accessibility & Quality Gates** — WCAG 2.2 AA compliance, zero hardcoded tokens, responsive breakpoints, type cleanliness.
* **Orchestrates**: `ui-ux-pro-max`, `impeccable`, `distinctive-frontend`, `shadcn-ui`, `build-dashboard`, `a11y-audit`.

### 2. `backend-master`
* **Role**: Principal Backend Architect, Database Engineer, Security Specialist, and Systems QA Lead.
* **Pipeline**:
  1. **Phase 1: Architecture & System Boundaries** — Modular monolith vs. distributed topology, data consistency models, Architectural Decision Records (ADRs).
  2. **Phase 2: API Design & Data Contracts** — Contract-first design (OpenAPI/Zod), idempotent mutations, cursor-based pagination, strict validation.
  3. **Phase 3: Database Engineering & Data Integrity** — Zero-downtime expand-contract migrations, indexing strategies (B-tree, GIN), N+1 prevention, foreign key & check invariants.
  4. **Phase 4: Security Hardening & Zero-Trust Architecture** — OWASP Top 10 defenses, parameterized SQL, row-level security / tenant isolation, Argon2id/bcrypt hashing.
  5. **Phase 5: TDD & Production Reliability** — Red-Green-Refactor test suites, structured JSON logging with trace/request correlation, health/readiness probes, graceful teardowns.
* **Orchestrates**: `architecture-designer`, `api-designer`, `database-optimizer`, `postgres-pro`, `secure-code-guardian`, `test-driven-development`, `test-master`, `sre-engineer`, `code-reviewer`.

### 3. `fullstack-master`
* **Role**: Autonomous End-to-End System Compiler.
* **Workflow**: Integrates `backend-master` and `frontend-master` into a 5-phase self-healing autonomous pipeline to deliver fully integrated, tested, and running full-stack applications.

---

## 📂 Repository Structure

Each skill folder follows the Antigravity specification:
- `<skill_name>/SKILL.md`: Main instructions with YAML frontmatter (`name`, `description`) and structured execution phases.
- Supporting scripts, references, and assets where applicable.

---

## 🚀 Usage

Place this directory in your global Antigravity customizations path:
```
~/.gemini/config/skills/
```
Antigravity automatically discovers all skills and dynamically invokes them based on context and task requirements.
