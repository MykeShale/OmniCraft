# GitHub Copilot Custom Instructions for OmniCraft

OmniCraft is a structured, production-grade engineering repository covering Mobile (iOS/Android), Web UI/UX, and Distributed Backend Architectures.

When writing or reviewing code:
- Mobile Development: Follow Apple HIG standards and native component conventions outlined in `mobile/appllama-app-design-skill/SKILL.md` and `mobile/mobile-app-ui-design/SKILL.md`. Use safe-area insets and minimum 48x48dp touch targets.
- Web Development: Follow token-driven CSS/Tailwind practices and semantic HTML outlined in `orchestrators/frontend-master/SKILL.md` and `frontend/shadcn-ui`.
- Backend & APIs: Enforce contract-first OpenAPI/Zod validation, parameterized SQL, and error schemas outlined in `orchestrators/backend-master/SKILL.md`.
- Quality Assurance: Ensure all newly added code includes automated unit or integration tests (`qa-security/test-driven-development/SKILL.md`).
