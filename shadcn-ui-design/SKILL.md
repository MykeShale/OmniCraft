---
name: shadcn-ui-design
description: Build and edit UI in a Next.js (App Router) + shadcn/ui + Tailwind CSS v4 project using this project's real design tokens (blue-primary theme, extracted from Figma). Use whenever adding or editing a component, building a page, styling, theming, scaffolding shadcn, or wiring dark mode in this project.
---

# shadcn/ui + Tailwind v4 — Build Skill

Governs every UI change in this project so it stays consistent with the real design tokens
(`references/DESIGN.md` — all 1,804 variables, blue-primary theme).

**Always treat `references/DESIGN.md` as the source of truth for tokens / colors / spacing.**
It is large — read §A first; load the deeper sections (§B–§P) only when you need a specific value.

Stack: **Next.js (App Router) · shadcn/ui · Tailwind v4 (CSS-first) · blue-primary theme (`--primary` = blue-600) · TypeScript**

## Files in this skill

| Path | What it is |
| --- | --- |
| `references/DESIGN.md` | Full token reference — §A theme (light+dark) · §B–§C color primitives · §D radius · §E typography · §F–§L spacing/sizing · §M–§N borders/strokes · §O opacity · §P raw |
| `references/variables-export.json` | The Figma token source of truth (1,804 vars) |
| `assets/globals.css` | Ready-to-use `app/globals.css` (theme tokens + `@theme inline`) |
| `assets/components.json` | shadcn config (baseColor neutral, CSS variables, `@/*` aliases) |
| `assets/lib/utils.ts` | The `cn()` helper → copy to `lib/utils.ts` |
| `scripts/generate-tokens.py` | Regenerates `DESIGN.md` + all assets from the export |

## Non-negotiable rules

1. **Semantic tokens only** — `bg-background`, `text-muted-foreground`, `border-border`, `bg-primary text-primary-foreground`. Never `bg-white` / `text-black` / `text-zinc-500` / `bg-blue-600` / `bg-[#...]`. The theme is blue → use `bg-primary`, not `bg-blue-*`.
2. **Add components via the CLI only** — `npx shadcn@latest add <name>`; don't hand-write primitives.
3. **Don't fork `components/ui/*`** — customize from outside with `className` + `cn()`. If you must edit one, make the smallest change and comment it.
4. **Always pair surface/foreground** — on a `card` surface use `text-card-foreground`, not a bare `text-foreground`.
5. **Tailwind v4 = CSS-first** — the theme lives in `app/globals.css` via `@theme inline`; there is no `tailwind.config` for colors.
6. **Don't strip a11y** — keep the `focus-visible` ring, `aria-*`, and `Label htmlFor` the primitives ship with.

## Setup a new project

```bash
npx create-next-app@latest .          # TypeScript, App Router, Tailwind, alias @/*
npx shadcn@latest init                # baseColor = Neutral, CSS variables = yes
```

Then wire this skill's tokens instead of shadcn's defaults:

```bash
cp .claude/skills/shadcn-ui-design/assets/globals.css     app/globals.css
cp .claude/skills/shadcn-ui-design/assets/components.json  components.json
cp .claude/skills/shadcn-ui-design/assets/lib/utils.ts     lib/utils.ts
```

Install deps used by the tokens/helpers: `npm i tailwindcss @tailwindcss/postcss tw-animate-css clsx tailwind-merge` (and `next-themes` for dark mode).

**Dark mode:** wrap `app/layout.tsx` in a `next-themes` `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) and add `suppressHydrationWarning` on `<html>`. The `.dark` token values are already in `assets/globals.css`.

## Build workflow

1. **Reach for an existing primitive first** — `npx shadcn@latest add button card dialog input form table dropdown-menu`. If a shadcn MCP server is connected, use `search_items_in_registries` / `get_add_command_for_items` instead of guessing names.
2. **Compose from primitives** — import from `@/components/ui/*`; lay out with flex/grid + `gap-*`; pull radius/spacing/font from `references/DESIGN.md` (radius §D · typography §E · spacing §F–§L); secondary text → `text-muted-foreground`, cards → `bg-card text-card-foreground`.
3. **Custom components** — put them in `components/` (not `components/ui/`), accept `className` and merge with `cn()`, use tokens only (dark mode then works automatically), use `cva` for variants, and cover every state: hover / focus-visible / disabled / invalid / loading.

```tsx
import { cn } from "@/lib/utils"

export function Stat({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground p-6 shadow-sm", className)}
      {...props}
    />
  )
}
```

## Cheat sheet

| Need | Use |
| --- | --- |
| Page surface + text | `bg-background text-foreground` |
| Card / panel | `bg-card text-card-foreground` |
| Primary button (blue) | `bg-primary text-primary-foreground` |
| Secondary / help text | `text-muted-foreground` |
| Hover in a list | `hover:bg-accent hover:text-accent-foreground` |
| Border / input border | `border-border` / `border-input` |
| Focus | `focus-visible:ring-2 ring-ring ring-offset-2` |
| Delete / danger | `bg-destructive text-white` |
| Standard radius | `rounded-lg` (card/dialog), `rounded-md` (input/button) |

## Before calling it done

- [ ] No hardcoded colors — `grep -rnE "(bg|text|border)-(white|black|zinc|gray|slate|neutral|blue)-|#[0-9a-fA-F]{3,6}|bg-\[" app components` returns nothing.
- [ ] Every surface pairs its own `*-foreground`; interactive elements have hover + focus-visible + disabled.
- [ ] Works in both light and dark; responsive mobile-first (`sm`/`md`/`lg`).
- [ ] a11y: labels bound to inputs, icon buttons have `aria-label`, errors aren't color-only.
- [ ] Components added via the CLI; lint/typecheck pass (`npm run lint`, `tsc --noEmit`).

## Maintaining tokens

The tokens are generated, not hand-edited. To change them, update the Figma export
(`references/variables-export.json`) and regenerate everything:

```bash
python3 .claude/skills/shadcn-ui-design/scripts/generate-tokens.py
```

This rewrites `references/DESIGN.md` and all three assets, and asserts the variable count is exactly 1,804 (fails loudly otherwise). Never hand-edit `DESIGN.md` or `globals.css` color values.

## References

- shadcn/ui: https://ui.shadcn.com/docs · Tailwind v4 setup: https://ui.shadcn.com/docs/tailwind-v4 · Theming: https://ui.shadcn.com/docs/theming
