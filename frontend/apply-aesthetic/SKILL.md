---
name: apply-aesthetic
description: Apply a visual direction — an archetype (high-end agency, editorial minimal, brutalist, soft-SaaS, dark-tech) or one of 138 named design systems (apple, linear-app, stripe, vercel, notion, material, shadcn, spotify, tesla…) — by resolving it into the token system. Use when the user wants a specific look/vibe/brand feel, or asks to make a design feel premium/expensive/non-generic.
---

# Skill: Apply Aesthetic
> **In this project, `shadcn-ui-design` is the authority for building/editing UI.** Follow its rules: semantic Tailwind tokens (`bg-primary`, `text-muted-foreground`, `border-border`) — never hardcoded colors or raw Tailwind palette (`bg-blue-600`); add primitives via `npx shadcn@latest add …` (don't fork `components/ui/*`); keep the blue-primary light+dark theme. Use this skill as **guidance only** — any output must conform to `shadcn-ui-design`. Token source of truth: `.claude/skills/_ux-ui-shared/tokens/*.json` → compiled to `app/globals.css`.

Choose and apply a design direction without breaking accessibility.

## Steps
1. **Brief Inference first (mandatory)** — before any tokens, name it: industry/domain, audience & tone, the one mood adjective the result must earn, motion depth, and the layout-family sequence (`.claude/skills/_ux-ui-shared/taste/design-taste.md` → Brief Inference + Variance Mandate). Generating before deciding = slop.
2. Pick a direction in `.claude/skills/_ux-ui-shared/taste/aesthetic-systems.md`:
   - An **archetype** (recipe mapped to our tokens), or
   - A **named library system** — browse with `python3 .claude/skills/_ux-ui-shared/scripts/design_systems.py list` (or `search <term>` / `show <name>`); specs live in `.claude/skills/_ux-ui-shared/design-systems/library/<name>/DESIGN.md`.
3. Apply the **Library Contract** (in `aesthetic-systems.md`): re-point `semantic.*` tokens to the chosen system's color roles; map typography/spacing/radius/shadow/motion to `.claude/skills/_ux-ui-shared/tokens/*.json`.
4. **Verify contrast** of every mapped color pair (`.claude/skills/_ux-ui-shared/scripts/contrast.py` / `a11y-audit`). A brand value that fails must be adjusted — taste never overrides POUR.
5. Add motion per `.claude/skills/_ux-ui-shared/taste/motion-choreography.md`; run the pre-flight aesthetic check in `design-taste.md`.

## Output
Updated/overridden semantic tokens + notes on type/space/motion, then render via `design-code`. Confirm the result passes both the aesthetic check and accessibility.
