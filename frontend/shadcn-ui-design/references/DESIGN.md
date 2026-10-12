# DESIGN.md — Design Tokens (Source of Truth)

Design system for a **Next.js (App Router) + shadcn/ui + Tailwind CSS v4** project.
Every value here is extracted 1:1 from **`variables-export.json`** (Figma export `lazyyysync-variables-v1`).
All **1,804 variables across 16 collections** — nothing added, nothing dropped, nothing altered except color format converted to OKLCH.

> **Golden rule:** use only the tokens defined here — **never hardcode** raw color/spacing/radius values (e.g. `bg-white`, `bg-blue-600`, `p-[13px]`).
> The theme is **blue-primary**: `--primary` is blue (blue-600), not neutral; charts are a monochromatic blue ramp.

## Principles
1. **Token-first** — every value comes from a CSS variable / Tailwind token in this file, never a literal.
2. **CSS-first config (Tailwind v4)** — the theme lives in `app/globals.css` via `@theme inline`; there is no `tailwind.config` for colors.
3. **OKLCH** — all colors are written as `oklch()` (converted from the RGB in the export; minor rounding — the authoritative source is Figma).
4. **Surface/foreground pairing** — always pair a surface with its matching foreground to guarantee contrast.
5. **Light ↔ Dark** — theme tokens carry both mode values; design once, support both modes.

---

## §A · shadcn/ui theme — 35 tokens (light + dark)

The `shadcn/ui` collection has 4 modes in the export: **light mode, dark mode, primary, secondary**.
This section maps only **light + dark** (what `app/globals.css` actually uses) — the `primary`/`secondary` modes are optional brand themes that exist in the export but are not mapped here.

| token | utility | :root (light) | .dark |
| --- | --- | --- | --- |
| `--background` | `background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | `card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` |
| `--card-foreground` | `card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | `popover` | `oklch(1 0 0)` | `oklch(0.269 0 0)` |
| `--popover-foreground` | `popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `primary` | `oklch(0.546 0.215 262.9)` | `oklch(0.546 0.215 262.9)` |
| `--primary-foreground` | `primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--secondary` | `secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--secondary-foreground` | `secondary-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | `muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | `muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.715 0 0)` |
| `--accent` | `accent` | `oklch(0.97 0 0)` | `oklch(0.371 0 0)` |
| `--accent-foreground` | `accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | `destructive` | `oklch(0.577 0.215 27.3)` | `oklch(0.711 0.166 22.2)` |
| `--border` | `border` | `oklch(0.922 0 0)` | `oklch(0.371 0 0)` |
| `--input` | `input` | `oklch(0.922 0 0)` | `oklch(0.205 0 0)` |
| `--ring` | `ring` | `oklch(0.623 0.188 259.8)` | `oklch(0.623 0.188 259.8)` |
| `--chart-1` | `chart-1` | `oklch(0.734 0.121 243.1)` | `oklch(0.734 0.121 243.1)` |
| `--chart-2` | `chart-2` | `oklch(0.649 0.193 251.8)` | `oklch(0.649 0.193 251.8)` |
| `--chart-3` | `chart-3` | `oklch(0.622 0.183 251.7)` | `oklch(0.622 0.183 251.7)` |
| `--chart-4` | `chart-4` | `oklch(0.556 0.162 252.2)` | `oklch(0.556 0.162 252.2)` |
| `--chart-5` | `chart-5` | `oklch(0.324 0.096 258.8)` | `oklch(0.324 0.096 258.8)` |
| `--sidebar` | `sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--sidebar-foreground` | `sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-primary` | `sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.622 0.183 251.7)` |
| `--sidebar-primary-foreground` | `sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-accent` | `sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--sidebar-accent-foreground` | `sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--sidebar-border` | `sidebar-border` | `oklch(0.87 0 0)` | `oklch(1 0 0 / 80%)` |
| `--sidebar-ring` | `sidebar-ring` | `oklch(0.556 0 0)` | `oklch(0.556 0 0)` |
| `--background-color` | `background-color` | `oklch(0 0 0 / 30%)` | `oklch(0 0 0 / 30%)` |
| `--semantic-background` | `semantic-background` | `oklch(0.551 0.023 264.4)` | `oklch(0.373 0.031 259.7)` |
| `--semantic-border` | `semantic-border` | `oklch(0.446 0.026 256.8)` | `oklch(0.446 0.026 256.8)` |
| `--semantic-foreground` | `semantic-foreground` | `oklch(1 0 0)` | `oklch(1 0 0)` |

### globals.css

The block below is also written verbatim to **`assets/globals.css`** — copy it to `app/globals.css`.

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.546 0.215 262.9);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.145 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.215 27.3);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.623 0.188 259.8);
  --chart-1: oklch(0.734 0.121 243.1);
  --chart-2: oklch(0.649 0.193 251.8);
  --chart-3: oklch(0.622 0.183 251.7);
  --chart-4: oklch(0.556 0.162 252.2);
  --chart-5: oklch(0.324 0.096 258.8);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.87 0 0);
  --sidebar-ring: oklch(0.556 0 0);
  --background-color: oklch(0 0 0 / 30%);
  --semantic-background: oklch(0.551 0.023 264.4);
  --semantic-border: oklch(0.446 0.026 256.8);
  --semantic-foreground: oklch(1 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.546 0.215 262.9);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.715 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.711 0.166 22.2);
  --border: oklch(0.371 0 0);
  --input: oklch(0.205 0 0);
  --ring: oklch(0.623 0.188 259.8);
  --chart-1: oklch(0.734 0.121 243.1);
  --chart-2: oklch(0.649 0.193 251.8);
  --chart-3: oklch(0.622 0.183 251.7);
  --chart-4: oklch(0.556 0.162 252.2);
  --chart-5: oklch(0.324 0.096 258.8);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.622 0.183 251.7);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 80%);
  --sidebar-ring: oklch(0.556 0 0);
  --background-color: oklch(0 0 0 / 30%);
  --semantic-background: oklch(0.373 0.031 259.7);
  --semantic-border: oklch(0.446 0.026 256.8);
  --semantic-foreground: oklch(1 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-background-color: var(--background-color);
  --color-semantic-background: var(--semantic-background);
  --color-semantic-border: var(--semantic-border);
  --color-semantic-foreground: var(--semantic-foreground);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
}
```

---

## §B · Color primitives — `tw/colors`

Collection `tw/colors` — **244 variables**

Tailwind color palette (single mode) — the primitives behind the theme tokens.

| token | value | token | value |
| --- | --- | --- | --- |
| `slate/50` | `oklch(0.984 0.003 247.9)` | `cyan/100` | `oklch(0.956 0.044 203.4)` |
| `slate/100` | `oklch(0.968 0.007 247.9)` | `cyan/200` | `oklch(0.917 0.077 205)` |
| `slate/200` | `oklch(0.929 0.013 255.5)` | `cyan/300` | `oklch(0.865 0.115 207.1)` |
| `slate/300` | `oklch(0.869 0.02 252.9)` | `cyan/400` | `oklch(0.797 0.134 211.5)` |
| `slate/400` | `oklch(0.711 0.035 256.8)` | `cyan/500` | `oklch(0.715 0.126 215.2)` |
| `slate/500` | `oklch(0.554 0.041 257.4)` | `cyan/600` | `oklch(0.609 0.111 221.7)` |
| `slate/600` | `oklch(0.446 0.037 257.3)` | `cyan/700` | `oklch(0.52 0.094 223.1)` |
| `slate/700` | `oklch(0.372 0.039 257.3)` | `cyan/800` | `oklch(0.45 0.077 224.3)` |
| `slate/800` | `oklch(0.279 0.037 260)` | `cyan/900` | `oklch(0.398 0.066 227.4)` |
| `slate/900` | `oklch(0.208 0.04 265.8)` | `cyan/950` | `oklch(0.302 0.054 229.7)` |
| `slate/950` | `oklch(0.129 0.041 264.7)` | `sky/50` | `oklch(0.977 0.012 236.6)` |
| `gray/50` | `oklch(0.985 0.002 247.8)` | `sky/100` | `oklch(0.951 0.025 236.8)` |
| `gray/100` | `oklch(0.967 0.003 264.5)` | `sky/200` | `oklch(0.901 0.055 230.9)` |
| `gray/300` | `oklch(0.872 0.009 258.3)` | `sky/300` | `oklch(0.828 0.101 230.3)` |
| `gray/200` | `oklch(0.928 0.006 264.5)` | `sky/400` | `oklch(0.754 0.139 232.7)` |
| `gray/400` | `oklch(0.714 0.019 261.3)` | `sky/500` | `oklch(0.685 0.148 237.3)` |
| `gray/500` | `oklch(0.551 0.023 264.4)` | `sky/600` | `oklch(0.588 0.139 242)` |
| `gray/600` | `oklch(0.446 0.026 256.8)` | `sky/700` | `oklch(0.5 0.119 242.7)` |
| `gray/700` | `oklch(0.373 0.031 259.7)` | `sky/800` | `oklch(0.443 0.1 240.8)` |
| `gray/800` | `oklch(0.278 0.03 256.8)` | `sky/900` | `oklch(0.391 0.085 240.9)` |
| `gray/900` | `oklch(0.21 0.032 264.7)` | `sky/950` | `oklch(0.293 0.063 243.2)` |
| `gray/950` | `oklch(0.13 0.027 261.7)` | `indigo/50` | `oklch(0.962 0.018 272.3)` |
| `zinc/50` | `oklch(0.985 0 0)` | `indigo/100` | `oklch(0.93 0.033 272.8)` |
| `zinc/100` | `oklch(0.967 0.001 286.4)` | `indigo/200` | `oklch(0.87 0.062 274)` |
| `zinc/200` | `oklch(0.92 0.004 286.3)` | `indigo/300` | `oklch(0.785 0.104 274.7)` |
| `zinc/300` | `oklch(0.871 0.005 286.3)` | `indigo/400` | `oklch(0.68 0.158 276.9)` |
| `zinc/400` | `oklch(0.712 0.013 286.1)` | `indigo/500` | `oklch(0.585 0.204 277.1)` |
| `zinc/500` | `oklch(0.552 0.014 285.9)` | `indigo/600` | `oklch(0.511 0.23 277)` |
| `zinc/600` | `oklch(0.442 0.015 285.8)` | `indigo/700` | `oklch(0.457 0.215 277)` |
| `zinc/700` | `oklch(0.37 0.012 285.8)` | `indigo/800` | `oklch(0.398 0.177 277.4)` |
| `zinc/800` | `oklch(0.274 0.005 286)` | `indigo/900` | `oklch(0.359 0.135 278.7)` |
| `zinc/900` | `oklch(0.21 0.006 285.9)` | `indigo/950` | `oklch(0.257 0.086 281.3)` |
| `zinc/950` | `oklch(0.141 0.004 285.8)` | `violet/50` | `oklch(0.969 0.016 293.8)` |
| `neutral/50` | `oklch(0.985 0 0)` | `violet/100` | `oklch(0.943 0.028 294.6)` |
| `neutral/100` | `oklch(0.97 0 0)` | `violet/200` | `oklch(0.894 0.055 293.3)` |
| `neutral/200` | `oklch(0.922 0 0)` | `violet/300` | `oklch(0.811 0.101 293.6)` |
| `neutral/300` | `oklch(0.87 0 0)` | `violet/400` | `oklch(0.709 0.159 293.5)` |
| `neutral/400` | `oklch(0.715 0 0)` | `violet/500` | `oklch(0.606 0.219 292.7)` |
| `neutral/500` | `oklch(0.556 0 0)` | `violet/600` | `oklch(0.541 0.247 293)` |
| `neutral/600` | `oklch(0.439 0 0)` | `violet/700` | `oklch(0.491 0.241 292.6)` |
| `neutral/700` | `oklch(0.371 0 0)` | `violet/800` | `oklch(0.432 0.211 292.8)` |
| `neutral/800` | `oklch(0.269 0 0)` | `violet/900` | `oklch(0.38 0.178 293.7)` |
| `neutral/900` | `oklch(0.205 0 0)` | `violet/950` | `oklch(0.283 0.135 291.1)` |
| `neutral/950` | `oklch(0.145 0 0)` | `purple/50` | `oklch(0.977 0.014 308.3)` |
| `stone/50` | `oklch(0.985 0.001 106.4)` | `purple/100` | `oklch(0.946 0.033 307.2)` |
| `stone/100` | `oklch(0.97 0.001 106.4)` | `purple/200` | `oklch(0.902 0.06 306.7)` |
| `stone/200` | `oklch(0.923 0.003 48.7)` | `purple/300` | `oklch(0.827 0.108 306.4)` |
| `stone/300` | `oklch(0.869 0.004 56.4)` | `purple/400` | `oklch(0.722 0.177 305.5)` |
| `stone/400` | `oklch(0.716 0.009 56.3)` | `purple/500` | `oklch(0.627 0.233 303.9)` |
| `stone/500` | `oklch(0.553 0.012 58.1)` | `purple/600` | `oklch(0.558 0.252 302.3)` |
| `stone/600` | `oklch(0.444 0.01 73.6)` | `purple/700` | `oklch(0.496 0.237 301.9)` |
| `stone/700` | `oklch(0.374 0.009 67.6)` | `purple/800` | `oklch(0.438 0.198 303.7)` |
| `stone/800` | `oklch(0.268 0.006 34.3)` | `purple/900` | `oklch(0.381 0.166 305)` |
| `stone/900` | `oklch(0.216 0.006 56)` | `purple/950` | `oklch(0.291 0.143 302.7)` |
| `stone/950` | `oklch(0.147 0.004 49.2)` | `fuchsia/50` | `oklch(0.977 0.017 320.1)` |
| `red/50` | `oklch(0.971 0.013 17.4)` | `fuchsia/100` | `oklch(0.952 0.036 318.9)` |
| `red/100` | `oklch(0.936 0.031 17.7)` | `fuchsia/200` | `oklch(0.903 0.073 319.6)` |
| `red/200` | `oklch(0.885 0.059 18.3)` | `fuchsia/300` | `oklch(0.833 0.132 321.4)` |
| `red/300` | `oklch(0.808 0.103 19.6)` | `fuchsia/400` | `oklch(0.748 0.207 322.2)` |
| `red/400` | `oklch(0.711 0.166 22.2)` | `fuchsia/500` | `oklch(0.667 0.259 322.1)` |
| `red/500` | `oklch(0.637 0.208 25.3)` | `fuchsia/600` | `oklch(0.591 0.257 322.9)` |
| `red/600` | `oklch(0.577 0.215 27.3)` | `fuchsia/700` | `oklch(0.518 0.226 323.9)` |
| `red/700` | `oklch(0.505 0.19 27.5)` | `fuchsia/800` | `oklch(0.452 0.192 324.6)` |
| `red/800` | `oklch(0.444 0.161 26.9)` | `fuchsia/900` | `oklch(0.401 0.16 325.6)` |
| `red/900` | `oklch(0.396 0.133 25.7)` | `fuchsia/950` | `oklch(0.293 0.131 325.7)` |
| `red/950` | `oklch(0.258 0.089 26)` | `pink/50` | `oklch(0.971 0.014 343.2)` |
| `orange/50` | `oklch(0.98 0.016 73.7)` | `pink/100` | `oklch(0.948 0.028 342.3)` |
| `orange/100` | `oklch(0.954 0.037 75.2)` | `pink/200` | `oklch(0.899 0.059 343.2)` |
| `orange/200` | `oklch(0.901 0.073 70.7)` | `pink/300` | `oklch(0.823 0.11 346)` |
| `orange/300` | `oklch(0.837 0.117 66.3)` | `pink/400` | `oklch(0.725 0.175 349.8)` |
| `orange/400` | `oklch(0.758 0.159 55.9)` | `pink/500` | `oklch(0.656 0.212 354.3)` |
| `orange/500` | `oklch(0.705 0.187 47.6)` | `pink/600` | `oklch(0.592 0.218 0.6)` |
| `orange/600` | `oklch(0.646 0.194 41.1)` | `pink/700` | `oklch(0.525 0.199 4)` |
| `orange/700` | `oklch(0.553 0.174 38.4)` | `pink/800` | `oklch(0.459 0.17 3.8)` |
| `orange/800` | `oklch(0.47 0.143 37.3)` | `pink/900` | `oklch(0.408 0.144 2.4)` |
| `orange/900` | `oklch(0.408 0.116 38.2)` | `pink/950` | `oklch(0.284 0.105 3.9)` |
| `orange/950` | `oklch(0.266 0.076 36.3)` | `rose/50` | `oklch(0.969 0.015 12.4)` |
| `amber/50` | `oklch(0.987 0.021 95.3)` | `rose/100` | `oklch(0.941 0.03 12.6)` |
| `amber/100` | `oklch(0.962 0.058 95.6)` | `rose/200` | `oklch(0.892 0.056 10)` |
| `amber/200` | `oklch(0.924 0.115 95.7)` | `rose/300` | `oklch(0.81 0.106 11.6)` |
| `amber/300` | `oklch(0.879 0.153 91.6)` | `rose/400` | `oklch(0.719 0.169 13.4)` |
| `amber/400` | `oklch(0.837 0.164 84.4)` | `rose/500` | `oklch(0.645 0.215 16.4)` |
| `amber/500` | `oklch(0.769 0.165 70.1)` | `rose/600` | `oklch(0.586 0.222 17.6)` |
| `amber/600` | `oklch(0.666 0.157 58.3)` | `rose/700` | `oklch(0.514 0.198 16.9)` |
| `amber/700` | `oklch(0.555 0.146 49)` | `rose/800` | `oklch(0.455 0.171 13.7)` |
| `amber/800` | `oklch(0.473 0.125 46.2)` | `rose/900` | `oklch(0.41 0.15 10.3)` |
| `amber/900` | `oklch(0.414 0.105 45.9)` | `rose/950` | `oklch(0.271 0.101 12.1)` |
| `amber/950` | `oklch(0.279 0.074 45.6)` | `lime/50` | `oklch(0.986 0.031 120.8)` |
| `green/50` | `oklch(0.982 0.018 155.8)` | `lime/100` | `oklch(0.967 0.066 122.3)` |
| `green/100` | `oklch(0.962 0.043 156.7)` | `lime/200` | `oklch(0.938 0.122 124.3)` |
| `green/200` | `oklch(0.925 0.081 156)` | `lime/300` | `oklch(0.897 0.179 126.7)` |
| `green/300` | `oklch(0.871 0.136 154.4)` | `lime/400` | `oklch(0.849 0.207 128.8)` |
| `green/400` | `oklch(0.8 0.182 151.7)` | `lime/500` | `oklch(0.768 0.204 130.8)` |
| `green/500` | `oklch(0.723 0.192 149.6)` | `lime/600` | `oklch(0.648 0.175 131.7)` |
| `green/600` | `oklch(0.627 0.17 149.2)` | `lime/700` | `oklch(0.532 0.141 131.6)` |
| `green/700` | `oklch(0.527 0.137 150.1)` | `lime/800` | `oklch(0.453 0.113 130.9)` |
| `green/800` | `oklch(0.448 0.108 151.3)` | `lime/900` | `oklch(0.405 0.096 131.1)` |
| `green/900` | `oklch(0.393 0.09 152.5)` | `lime/950` | `oklch(0.274 0.069 132.1)` |
| `green/950` | `oklch(0.266 0.063 152.9)` | `yellow/50` | `oklch(0.987 0.026 102.2)` |
| `emerald/50` | `oklch(0.979 0.021 166.1)` | `yellow/100` | `oklch(0.973 0.069 103.2)` |
| `emerald/100` | `oklch(0.95 0.051 163.1)` | `yellow/200` | `oklch(0.945 0.124 101.5)` |
| `emerald/200` | `oklch(0.905 0.089 164.2)` | `yellow/300` | `oklch(0.905 0.166 98.1)` |
| `emerald/300` | `oklch(0.845 0.13 165)` | `yellow/400` | `oklch(0.861 0.173 91.9)` |
| `emerald/400` | `oklch(0.773 0.153 163.2)` | `yellow/500` | `oklch(0.795 0.162 86)` |
| `emerald/500` | `oklch(0.696 0.149 162.5)` | `yellow/600` | `oklch(0.681 0.142 75.8)` |
| `emerald/600` | `oklch(0.596 0.127 163.2)` | `yellow/700` | `oklch(0.554 0.121 66.4)` |
| `emerald/700` | `oklch(0.508 0.105 165.6)` | `yellow/800` | `oklch(0.476 0.103 61.9)` |
| `emerald/800` | `oklch(0.432 0.086 166.9)` | `yellow/900` | `oklch(0.421 0.09 57.7)` |
| `emerald/900` | `oklch(0.378 0.073 168.9)` | `yellow/950` | `oklch(0.286 0.064 53.8)` |
| `emerald/950` | `oklch(0.262 0.049 172.6)` | `blue/50` | `oklch(0.97 0.014 254.6)` |
| `teal/50` | `oklch(0.984 0.014 180.7)` | `blue/100` | `oklch(0.932 0.032 255.6)` |
| `teal/100` | `oklch(0.953 0.05 180.8)` | `blue/200` | `oklch(0.882 0.057 254.1)` |
| `teal/200` | `oklch(0.91 0.093 180.4)` | `blue/300` | `oklch(0.809 0.096 251.8)` |
| `teal/300` | `oklch(0.855 0.125 181.1)` | `blue/400` | `oklch(0.714 0.143 254.6)` |
| `teal/400` | `oklch(0.785 0.133 181.9)` | `blue/500` | `oklch(0.623 0.188 259.8)` |
| `teal/500` | `oklch(0.704 0.123 182.5)` | `blue/600` | `oklch(0.546 0.215 262.9)` |
| `teal/600` | `oklch(0.6 0.104 184.7)` | `blue/700` | `oklch(0.488 0.217 264.4)` |
| `teal/700` | `oklch(0.511 0.086 186.4)` | `blue/800` | `oklch(0.424 0.181 265.6)` |
| `teal/800` | `oklch(0.437 0.071 188.2)` | `blue/900` | `oklch(0.379 0.138 265.5)` |
| `teal/900` | `oklch(0.386 0.059 188.4)` | `blue/950` | `oklch(0.282 0.087 267.9)` |
| `teal/950` | `oklch(0.277 0.045 192.5)` | `white` | `oklch(1 0 0)` |
| `cyan/50` | `oklch(0.984 0.019 200.9)` | `black` | `oklch(0 0 0)` |

---

## §C · Color primitives — `rdx/colors` (light + dark)

Collection `rdx/colors` — **396 variables** · 2 modes

Radix color scales — primitives for state / elevation.

| token | light mode | dark mode |
| --- | --- | --- |
| `gray/1` | `oklch(0.991 0 0)` | `oklch(0.178 0 0)` |
| `gray/2` | `oklch(0.982 0 0)` | `oklch(0.213 0 0)` |
| `gray/3` | `oklch(0.955 0 0)` | `oklch(0.252 0 0)` |
| `gray/4` | `oklch(0.931 0 0)` | `oklch(0.285 0 0)` |
| `gray/5` | `oklch(0.907 0 0)` | `oklch(0.313 0 0)` |
| `gray/6` | `oklch(0.885 0 0)` | `oklch(0.348 0 0)` |
| `gray/7` | `oklch(0.851 0 0)` | `oklch(0.402 0 0)` |
| `gray/8` | `oklch(0.792 0 0)` | `oklch(0.489 0 0)` |
| `gray/9` | `oklch(0.643 0 0)` | `oklch(0.538 0 0)` |
| `gray/10` | `oklch(0.61 0 0)` | `oklch(0.583 0 0)` |
| `gray/11` | `oklch(0.503 0 0)` | `oklch(0.77 0 0)` |
| `gray/12` | `oklch(0.244 0 0)` | `oklch(0.949 0 0)` |
| `mauve/1` | `oklch(0.992 0.002 325.6)` | `oklch(0.18 0.004 308.2)` |
| `mauve/2` | `oklch(0.983 0.003 308.4)` | `oklch(0.215 0.004 308.2)` |
| `mauve/3` | `oklch(0.956 0.006 317.8)` | `oklch(0.254 0.006 301.1)` |
| `mauve/4` | `oklch(0.932 0.007 312.3)` | `oklch(0.285 0.008 308.2)` |
| `mauve/5` | `oklch(0.909 0.01 311.2)` | `oklch(0.313 0.009 303.9)` |
| `mauve/6` | `oklch(0.887 0.011 303.1)` | `oklch(0.35 0.011 308.1)` |
| `mauve/7` | `oklch(0.854 0.014 299.8)` | `oklch(0.402 0.012 298.9)` |
| `mauve/8` | `oklch(0.795 0.018 293)` | `oklch(0.492 0.016 299.5)` |
| `mauve/9` | `oklch(0.646 0.019 292.9)` | `oklch(0.54 0.017 294.2)` |
| `mauve/10` | `oklch(0.612 0.018 293.5)` | `oklch(0.585 0.017 294.2)` |
| `mauve/11` | `oklch(0.505 0.016 295)` | `oklch(0.769 0.014 299.7)` |
| `mauve/12` | `oklch(0.245 0.013 298.5)` | `oklch(0.95 0.003 286.3)` |
| `slate/1` | `oklch(0.991 0.001 286.4)` | `oklch(0.179 0.004 286)` |
| `slate/2` | `oklch(0.983 0.003 286.4)` | `oklch(0.213 0.004 264.5)` |
| `slate/3` | `oklch(0.956 0.004 286.3)` | `oklch(0.252 0.006 271.2)` |
| `slate/4` | `oklch(0.932 0.005 286.3)` | `oklch(0.283 0.007 248.1)` |
| `slate/5` | `oklch(0.91 0.007 277.2)` | `oklch(0.312 0.008 255.6)` |
| `slate/6` | `oklch(0.887 0.01 286.2)` | `oklch(0.347 0.01 254)` |
| `slate/7` | `oklch(0.853 0.011 280.4)` | `oklch(0.399 0.012 252.9)` |
| `slate/8` | `oklch(0.794 0.016 277.8)` | `oklch(0.489 0.016 251.7)` |
| `slate/9` | `oklch(0.645 0.016 277.7)` | `oklch(0.537 0.015 262.3)` |
| `slate/10` | `oklch(0.611 0.015 272.6)` | `oklch(0.583 0.015 266.6)` |
| `slate/11` | `oklch(0.502 0.014 264.4)` | `oklch(0.769 0.01 258.3)` |
| `slate/12` | `oklch(0.241 0.01 248.2)` | `oklch(0.949 0.003 264.5)` |
| `sage/1` | `oklch(0.992 0.002 165.1)` | `oklch(0.18 0.004 164.6)` |
| `sage/2` | `oklch(0.98 0.002 165.1)` | `oklch(0.211 0.004 164.7)` |
| `sage/3` | `oklch(0.954 0.023 286)` | `oklch(0.249 0.003 164.8)` |
| `sage/4` | `oklch(0.931 0.003 174.5)` | `oklch(0.282 0.005 174.1)` |
| `sage/5` | `oklch(0.91 0.004 157.2)` | `oklch(0.31 0.005 174.2)` |
| `sage/6` | `oklch(0.886 0.004 174.5)` | `oklch(0.348 0.006 164.7)` |
| `sage/7` | `oklch(0.851 0.005 165)` | `oklch(0.4 0.007 170.1)` |
| `sage/8` | `oklch(0.791 0.005 165)` | `oklch(0.489 0.01 168.4)` |
| `sage/9` | `oklch(0.639 0.01 171.6)` | `oklch(0.533 0.017 170.5)` |
| `sage/10` | `oklch(0.606 0.01 171.6)` | `oklch(0.766 0.01 171.7)` |
| `sage/11` | `oklch(0.501 0.008 174.1)` | `oklch(0.766 0.01 171.7)` |
| `sage/12` | `oklch(0.24 0.012 167.6)` | `oklch(0.947 0.003 165.1)` |
| `olive/1` | `oklch(0.993 0.002 145.6)` | `oklch(0.18 0.004 128.7)` |
| `olive/2` | `oklch(0.983 0.003 145.5)` | `oklch(0.212 0.004 128.7)` |
| `olive/3` | `oklch(0.956 0.003 145.5)` | `oklch(0.25 0.004 128.6)` |
| `olive/4` | `oklch(0.932 0.003 145.5)` | `oklch(0.282 0.006 134.9)` |
| `olive/5` | `oklch(0.91 0.005 145.5)` | `oklch(0.31 0.006 134.9)` |
| `olive/6` | `oklch(0.885 0.005 145.5)` | `oklch(0.345 0.007 128.7)` |
| `olive/7` | `oklch(0.851 0.005 145.5)` | `oklch(0.397 0.009 132.5)` |
| `olive/8` | `oklch(0.792 0.006 137.8)` | `oklch(0.489 0.013 141.2)` |
| `olive/9` | `oklch(0.64 0.012 136.6)` | `oklch(0.535 0.018 139.4)` |
| `olive/10` | `oklch(0.607 0.012 136.6)` | `oklch(0.581 0.016 138.7)` |
| `olive/11` | `oklch(0.5 0.011 140.5)` | `oklch(0.766 0.013 137.8)` |
| `olive/12` | `oklch(0.242 0.011 139.4)` | `oklch(0.947 0.003 145.5)` |
| `sand/1` | `oklch(0.994 0.001 106.4)` | `oklch(0.177 0.002 106.6)` |
| `sand/2` | `oklch(0.982 0.001 106.4)` | `oklch(0.213 0.002 106.6)` |
| `sand/3` | `oklch(0.956 0.002 67.8)` | `oklch(0.252 0.002 106.5)` |
| `sand/4` | `oklch(0.931 0.003 84.6)` | `oklch(0.284 0.004 106.6)` |
| `sand/5` | `oklch(0.91 0.004 91.4)` | `oklch(0.312 0.005 106.7)` |
| `sand/6` | `oklch(0.885 0.004 91.5)` | `oklch(0.348 0.005 91.5)` |
| `sand/7` | `oklch(0.851 0.006 95.1)` | `oklch(0.401 0.007 95.2)` |
| `sand/8` | `oklch(0.791 0.008 98.9)` | `oklch(0.489 0.008 88.7)` |
| `sand/9` | `oklch(0.641 0.01 106.7)` | `oklch(0.534 0.011 93.7)` |
| `sand/10` | `oklch(0.605 0.009 106.7)` | `oklch(0.582 0.011 100.1)` |
| `sand/11` | `oklch(0.498 0.008 106.7)` | `oklch(0.767 0.009 91.5)` |
| `sand/12` | `oklch(0.243 0.008 95.4)` | `oklch(0.949 0.003 106.5)` |
| `tomato/1` | `oklch(0.993 0.003 17.2)` | `oklch(0.187 0.012 18.3)` |
| `tomato/2` | `oklch(0.984 0.008 27.2)` | `oklch(0.208 0.017 31.4)` |
| `tomato/3` | `oklch(0.954 0.021 31.8)` | `oklch(0.255 0.055 26.8)` |
| `tomato/4` | `oklch(0.921 0.041 34.8)` | `oklch(0.29 0.087 27.8)` |
| `tomato/5` | `oklch(0.889 0.059 32.6)` | `oklch(0.331 0.098 28.6)` |
| `tomato/6` | `oklch(0.853 0.077 32.6)` | `oklch(0.38 0.1 29.9)` |
| `tomato/7` | `oklch(0.802 0.095 32.2)` | `oklch(0.446 0.106 31.6)` |
| `tomato/8` | `oklch(0.741 0.118 32.3)` | `oklch(0.538 0.129 33.4)` |
| `tomato/9` | `oklch(0.627 0.194 33.3)` | `oklch(0.627 0.194 33.3)` |
| `tomato/10` | `oklch(0.603 0.195 33.2)` | `oklch(0.664 0.179 34.1)` |
| `tomato/11` | `oklch(0.566 0.198 32.7)` | `oklch(0.779 0.131 34.9)` |
| `tomato/12` | `oklch(0.346 0.08 30.4)` | `oklch(0.899 0.046 31.2)` |
| `red/1` | `oklch(0.993 0.003 17.2)` | `oklch(0.188 0.013 18.4)` |
| `red/2` | `oklch(0.982 0.009 17.3)` | `oklch(0.205 0.022 14.1)` |
| `red/3` | `oklch(0.955 0.021 13.9)` | `oklch(0.251 0.065 12.7)` |
| `red/4` | `oklch(0.922 0.04 16)` | `oklch(0.289 0.095 14.3)` |
| `red/5` | `oklch(0.892 0.057 16.9)` | `oklch(0.332 0.107 15.5)` |
| `red/6` | `oklch(0.857 0.074 17.7)` | `oklch(0.381 0.111 16.8)` |
| `red/7` | `oklch(0.807 0.089 18.3)` | `oklch(0.45 0.121 18.8)` |
| `red/8` | `oklch(0.744 0.113 18.8)` | `oklch(0.544 0.146 21.8)` |
| `red/9` | `oklch(0.626 0.193 23)` | `oklch(0.626 0.193 23)` |
| `red/10` | `oklch(0.599 0.195 24)` | `oklch(0.663 0.177 22.9)` |
| `red/11` | `oklch(0.557 0.197 25.2)` | `oklch(0.78 0.128 22.1)` |
| `red/12` | `oklch(0.339 0.109 16.6)` | `oklch(0.902 0.053 6.5)` |
| `ruby/1` | `oklch(0.994 0.003 354.7)` | `oklch(0.189 0.014 1.9)` |
| `ruby/2` | `oklch(0.983 0.009 8.5)` | `oklch(0.208 0.015 3.6)` |
| `ruby/3` | `oklch(0.954 0.022 7.2)` | `oklch(0.254 0.061 6)` |
| `ruby/4` | `oklch(0.925 0.039 8.1)` | `oklch(0.293 0.089 6.1)` |
| `ruby/5` | `oklch(0.896 0.056 7.3)` | `oklch(0.334 0.1 6.5)` |
| `ruby/6` | `oklch(0.858 0.066 8)` | `oklch(0.382 0.106 7.1)` |
| `ruby/7` | `oklch(0.811 0.08 7.2)` | `oklch(0.448 0.116 9.1)` |
| `ruby/8` | `oklch(0.749 0.102 6.5)` | `oklch(0.543 0.145 11.3)` |
| `ruby/9` | `oklch(0.628 0.195 13.2)` | `oklch(0.628 0.195 13.2)` |
| `ruby/10` | `oklch(0.601 0.197 13.5)` | `oklch(0.664 0.18 13.6)` |
| `ruby/11` | `oklch(0.549 0.199 13.9)` | `oklch(0.781 0.129 15.1)` |
| `ruby/12` | `oklch(0.341 0.11 10)` | `oklch(0.906 0.053 355.7)` |
| `crimson/1` | `oklch(0.994 0.003 354.7)` | `oklch(0.189 0.014 354.2)` |
| `crimson/2` | `oklch(0.982 0.008 357.8)` | `oklch(0.206 0.023 354.5)` |
| `crimson/3` | `oklch(0.954 0.026 356.3)` | `oklch(0.255 0.06 353.5)` |
| `crimson/4` | `oklch(0.926 0.04 356.4)` | `oklch(0.293 0.093 354.3)` |
| `crimson/5` | `oklch(0.893 0.053 355.8)` | `oklch(0.332 0.105 354.5)` |
| `crimson/6` | `oklch(0.854 0.065 355.2)` | `oklch(0.383 0.108 355.9)` |
| `crimson/7` | `oklch(0.809 0.078 354.9)` | `oklch(0.45 0.121 357.1)` |
| `crimson/8` | `oklch(0.749 0.1 354)` | `oklch(0.543 0.148 358.7)` |
| `crimson/9` | `oklch(0.634 0.213 1.3)` | `oklch(0.634 0.213 1.3)` |
| `crimson/10` | `oklch(0.607 0.211 2.2)` | `oklch(0.663 0.197 1.8)` |
| `crimson/11` | `oklch(0.552 0.207 4.5)` | `oklch(0.782 0.134 4.7)` |
| `crimson/12` | `oklch(0.341 0.113 356.9)` | `oklch(0.909 0.054 346.6)` |
| `pink/1` | `oklch(0.994 0.004 337.3)` | `oklch(0.191 0.017 335.3)` |
| `pink/2` | `oklch(0.983 0.009 341.8)` | `oklch(0.208 0.032 337)` |
| `pink/3` | `oklch(0.954 0.028 342.3)` | `oklch(0.262 0.063 337.6)` |
| `pink/4` | `oklch(0.926 0.042 340.6)` | `oklch(0.299 0.098 339.4)` |
| `pink/5` | `oklch(0.893 0.055 340.4)` | `oklch(0.338 0.105 341.2)` |
| `pink/6` | `oklch(0.856 0.067 340.7)` | `oklch(0.388 0.107 341.4)` |
| `pink/7` | `oklch(0.81 0.083 341.9)` | `oklch(0.458 0.12 342.9)` |
| `pink/8` | `oklch(0.751 0.107 341.5)` | `oklch(0.546 0.145 344)` |
| `pink/9` | `oklch(0.617 0.208 346)` | `oklch(0.617 0.208 346)` |
| `pink/10` | `oklch(0.596 0.207 346.7)` | `oklch(0.649 0.197 346)` |
| `pink/11` | `oklch(0.558 0.207 347.3)` | `oklch(0.785 0.155 347)` |
| `pink/12` | `oklch(0.35 0.129 345.4)` | `oklch(0.905 0.059 343.2)` |
| `plum/1` | `oklch(0.993 0.004 314.8)` | `oklch(0.19 0.018 326.2)` |
| `plum/2` | `oklch(0.982 0.01 325.7)` | `oklch(0.21 0.032 326.6)` |
| `plum/3` | `oklch(0.957 0.027 325.8)` | `oklch(0.267 0.061 327.1)` |
| `plum/4` | `oklch(0.929 0.044 324.8)` | `oklch(0.307 0.087 325.6)` |
| `plum/5` | `oklch(0.899 0.058 325.1)` | `oklch(0.344 0.097 325)` |
| `plum/6` | `oklch(0.861 0.071 323.9)` | `oklch(0.389 0.097 325)` |
| `plum/7` | `oklch(0.809 0.092 323.3)` | `oklch(0.456 0.107 323.2)` |
| `plum/8` | `oklch(0.741 0.12 322.2)` | `oklch(0.545 0.128 321.9)` |
| `plum/9` | `oklch(0.579 0.188 322.1)` | `oklch(0.579 0.188 322.1)` |
| `plum/10` | `oklch(0.552 0.181 322.2)` | `oklch(0.616 0.182 322.3)` |
| `plum/11` | `oklch(0.522 0.173 321.9)` | `oklch(0.786 0.154 322.2)` |
| `plum/12` | `oklch(0.338 0.125 321.4)` | `oklch(0.906 0.055 326)` |
| `purple/1` | `oklch(0.993 0.003 325.6)` | `oklch(0.911 0.049 311)` |
| `purple/2` | `oklch(0.981 0.01 311.2)` | `oklch(0.781 0.145 307.7)` |
| `purple/3` | `oklch(0.959 0.025 311.7)` | `oklch(0.596 0.177 306.5)` |
| `purple/4` | `oklch(0.933 0.039 312.7)` | `oklch(0.556 0.183 305.9)` |
| `purple/5` | `oklch(0.901 0.053 311.2)` | `oklch(0.541 0.133 307.6)` |
| `purple/6` | `oklch(0.859 0.072 311.1)` | `oklch(0.449 0.108 308.6)` |
| `purple/7` | `oklch(0.804 0.092 309.7)` | `oklch(0.389 0.096 309.5)` |
| `purple/8` | `oklch(0.733 0.123 308)` | `oklch(0.345 0.092 310.5)` |
| `purple/9` | `oklch(0.556 0.183 305.9)` | `oklch(0.309 0.082 310.8)` |
| `purple/10` | `oklch(0.525 0.175 305.4)` | `oklch(0.268 0.061 312.6)` |
| `purple/11` | `oklch(0.517 0.173 305.9)` | `oklch(0.214 0.03 313.1)` |
| `purple/12` | `oklch(0.322 0.11 303.8)` | `oklch(0.191 0.022 315.6)` |
| `violet/1` | `oklch(0.992 0.003 308.4)` | `oklch(0.191 0.026 290.8)` |
| `iris/1` | `oklch(0.995 0.003 286.4)` | `oklch(0.192 0.022 284.1)` |
| `iris/2` | `oklch(0.981 0.009 286.2)` | `oklch(0.209 0.029 286.6)` |
| `iris/3` | `oklch(0.961 0.017 282.5)` | `oklch(0.272 0.069 278.5)` |
| `iris/4` | `oklch(0.934 0.032 283.9)` | `oklch(0.318 0.102 276)` |
| `iris/5` | `oklch(0.904 0.048 282.8)` | `oklch(0.357 0.11 277.3)` |
| `iris/6` | `oklch(0.863 0.069 283)` | `oklch(0.4 0.112 279.5)` |
| `iris/7` | `oklch(0.809 0.087 282.8)` | `oklch(0.448 0.12 280.4)` |
| `iris/8` | `oklch(0.729 0.118 281.4)` | `oklch(0.507 0.138 280.8)` |
| `iris/9` | `oklch(0.54 0.184 278.3)` | `oklch(0.54 0.184 278.3)` |
| `iris/10` | `oklch(0.509 0.187 277.4)` | `oklch(0.587 0.172 281.3)` |
| `iris/11` | `oklch(0.511 0.174 279.8)` | `oklch(0.774 0.122 287.5)` |
| `iris/12` | `oklch(0.314 0.099 277.6)` | `oklch(0.914 0.042 287)` |
| `indigo/1` | `oklch(0.994 0.001 286.4)` | `oklch(0.191 0.025 276.5)` |
| `indigo/2` | `oklch(0.982 0.008 271.3)` | `oklch(0.209 0.03 274.8)` |
| `indigo/3` | `oklch(0.961 0.017 267.8)` | `oklch(0.272 0.071 268)` |
| `indigo/4` | `oklch(0.935 0.031 269.8)` | `oklch(0.318 0.095 267.2)` |
| `indigo/5` | `oklch(0.902 0.047 269.6)` | `oklch(0.362 0.104 267)` |
| `indigo/6` | `oklch(0.862 0.068 271.1)` | `oklch(0.403 0.111 268.8)` |
| `indigo/7` | `oklch(0.806 0.088 271.4)` | `oklch(0.449 0.12 268.9)` |
| `indigo/8` | `oklch(0.731 0.112 270.4)` | `oklch(0.502 0.137 268.3)` |
| `indigo/9` | `oklch(0.544 0.191 267)` | `oklch(0.544 0.191 267)` |
| `indigo/10` | `oklch(0.511 0.195 266.6)` | `oklch(0.589 0.176 269.3)` |
| `indigo/11` | `oklch(0.509 0.172 267.2)` | `oklch(0.776 0.114 273)` |
| `indigo/12` | `oklch(0.313 0.086 268.6)` | `oklch(0.911 0.043 269.6)` |
| `blue/1` | `oklch(0.993 0.003 247.9)` | `oklch(0.194 0.025 256.5)` |
| `blue/2` | `oklch(0.982 0.009 242.8)` | `oklch(0.213 0.03 261.3)` |
| `blue/3` | `oklch(0.96 0.02 238.7)` | `oklch(0.274 0.066 253.9)` |
| `blue/4` | `oklch(0.938 0.035 234.8)` | `oklch(0.32 0.097 252.3)` |
| `blue/5` | `oklch(0.905 0.051 240.3)` | `oklch(0.367 0.106 250.7)` |
| `blue/6` | `oklch(0.863 0.068 243.3)` | `oklch(0.416 0.113 252)` |
| `blue/7` | `oklch(0.81 0.089 243.1)` | `oklch(0.474 0.122 253.1)` |
| `blue/8` | `oklch(0.734 0.121 243.1)` | `oklch(0.541 0.14 253.2)` |
| `blue/9` | `oklch(0.649 0.193 251.8)` | `oklch(0.649 0.193 251.8)` |
| `blue/10` | `oklch(0.622 0.183 251.7)` | `oklch(0.688 0.169 251.4)` |
| `blue/11` | `oklch(0.556 0.162 252.2)` | `oklch(0.764 0.126 249.5)` |
| `blue/12` | `oklch(0.324 0.096 258.8)` | `oklch(0.907 0.051 238.4)` |
| `cyan/1` | `oklch(0.992 0.003 219.5)` | `oklch(0.192 0.018 222.8)` |
| `cyan/2` | `oklch(0.979 0.009 205.9)` | `oklch(0.214 0.019 227.9)` |
| `cyan/3` | `oklch(0.959 0.026 202.6)` | `oklch(0.273 0.043 220.4)` |
| `cyan/4` | `oklch(0.932 0.041 206)` | `oklch(0.316 0.059 223.7)` |
| `cyan/5` | `oklch(0.9 0.054 206.4)` | `oklch(0.363 0.068 223.7)` |
| `cyan/6` | `oklch(0.858 0.066 208.1)` | `oklch(0.414 0.075 221.5)` |
| `cyan/7` | `oklch(0.804 0.082 209.7)` | `oklch(0.478 0.083 221.6)` |
| `cyan/8` | `oklch(0.728 0.11 211.9)` | `oklch(0.557 0.099 221.1)` |
| `cyan/9` | `oklch(0.66 0.122 221.7)` | `oklch(0.66 0.122 221.7)` |
| `cyan/10` | `oklch(0.627 0.114 221.5)` | `oklch(0.699 0.119 218.9)` |
| `cyan/11` | `oklch(0.547 0.097 220.8)` | `oklch(0.785 0.116 213.8)` |
| `cyan/12` | `oklch(0.331 0.053 218.8)` | `oklch(0.91 0.057 211.5)` |
| `teal/1` | `oklch(0.994 0.004 179.7)` | `oklch(0.187 0.012 186.7)` |
| `teal/2` | `oklch(0.982 0.009 179.6)` | `oklch(0.216 0.016 189)` |
| `teal/3` | `oklch(0.96 0.026 181.9)` | `oklch(0.273 0.038 186.8)` |
| `teal/4` | `oklch(0.934 0.042 179.8)` | `oklch(0.318 0.054 187.3)` |
| `teal/5` | `oklch(0.9 0.053 181.5)` | `oklch(0.363 0.06 186.6)` |
| `teal/6` | `oklch(0.856 0.064 181.2)` | `oklch(0.414 0.066 184.7)` |
| `teal/7` | `oklch(0.796 0.076 183)` | `oklch(0.473 0.074 185)` |
| `teal/8` | `oklch(0.721 0.097 183.3)` | `oklch(0.537 0.086 183.5)` |
| `teal/9` | `oklch(0.649 0.114 182)` | `oklch(0.649 0.114 182)` |
| `teal/10` | `oklch(0.619 0.109 181.3)` | `oklch(0.688 0.123 180.3)` |
| `teal/11` | `oklch(0.552 0.101 178.8)` | `oklch(0.789 0.147 175.7)` |
| `teal/12` | `oklch(0.327 0.051 185)` | `oklch(0.905 0.072 175.1)` |
| `jade/1` | `oklch(0.994 0.003 174.5)` | `oklch(0.186 0.014 169.8)` |
| `jade/2` | `oklch(0.982 0.009 161.4)` | `oklch(0.215 0.017 168.2)` |
| `jade/3` | `oklch(0.961 0.022 160.2)` | `oklch(0.274 0.043 165.2)` |
| `jade/4` | `oklch(0.935 0.034 163.2)` | `oklch(0.316 0.057 167.6)` |
| `jade/5` | `oklch(0.902 0.047 165.1)` | `oklch(0.361 0.064 168.2)` |
| `jade/6` | `oklch(0.86 0.06 166.2)` | `oklch(0.413 0.069 169.6)` |
| `jade/7` | `oklch(0.8 0.076 169.9)` | `oklch(0.468 0.076 170.3)` |
| `jade/8` | `oklch(0.721 0.103 173.1)` | `oklch(0.537 0.087 172.2)` |
| `jade/9` | `oklch(0.642 0.115 170.7)` | `oklch(0.642 0.115 170.7)` |
| `jade/10` | `oklch(0.613 0.11 170.9)` | `oklch(0.678 0.126 169.6)` |
| `jade/11` | `oklch(0.547 0.098 170)` | `oklch(0.785 0.156 167.1)` |
| `jade/12` | `oklch(0.325 0.041 170.1)` | `oklch(0.903 0.078 166.9)` |
| `green/1` | `oklch(0.994 0.004 157.2)` | `oklch(0.187 0.012 167)` |
| `green/2` | `oklch(0.981 0.01 155.1)` | `oklch(0.212 0.015 165.9)` |
| `green/3` | `oklch(0.958 0.022 155.9)` | `oklch(0.272 0.04 162.2)` |
| `green/4` | `oklch(0.934 0.037 156.4)` | `oklch(0.317 0.057 161.8)` |
| `green/5` | `oklch(0.899 0.049 157.2)` | `oklch(0.365 0.066 161.2)` |
| `green/6` | `oklch(0.856 0.064 158.2)` | `oklch(0.412 0.072 160.9)` |
| `green/7` | `oklch(0.798 0.083 159.1)` | `oklch(0.467 0.082 160.2)` |
| `green/8` | `oklch(0.716 0.113 160.3)` | `oklch(0.528 0.096 159.4)` |
| `green/9` | `oklch(0.641 0.133 157.7)` | `oklch(0.641 0.133 157.7)` |
| `green/10` | `oklch(0.611 0.127 158.2)` | `oklch(0.675 0.141 157.7)` |
| `green/11` | `oklch(0.543 0.112 159.5)` | `oklch(0.779 0.165 157.3)` |
| `green/12` | `oklch(0.322 0.048 164.5)` | `oklch(0.905 0.083 158.2)` |
| `grass/1` | `oklch(0.994 0.005 145.5)` | `oklch(0.187 0.013 159.7)` |
| `grass/2` | `oklch(0.982 0.01 145.5)` | `oklch(0.21 0.013 149.9)` |
| `grass/3` | `oklch(0.96 0.022 145.4)` | `oklch(0.267 0.03 150.2)` |
| `grass/4` | `oklch(0.935 0.038 146.5)` | `oklch(0.319 0.053 150.3)` |
| `grass/5` | `oklch(0.9 0.052 146)` | `oklch(0.367 0.062 149.9)` |
| `grass/6` | `oklch(0.856 0.071 146.8)` | `oklch(0.416 0.072 149.3)` |
| `grass/7` | `oklch(0.798 0.094 147.3)` | `oklch(0.468 0.083 149)` |
| `grass/8` | `oklch(0.717 0.131 148.1)` | `oklch(0.523 0.097 148.3)` |
| `grass/9` | `oklch(0.651 0.147 147.4)` | `oklch(0.651 0.147 147.4)` |
| `grass/10` | `oklch(0.615 0.142 147.2)` | `oklch(0.689 0.145 147.8)` |
| `grass/11` | `oklch(0.526 0.129 147.2)` | `oklch(0.78 0.142 148.5)` |
| `grass/12` | `oklch(0.327 0.053 148.6)` | `oklch(0.911 0.078 144.9)` |
| `bronze/1` | `oklch(0.992 0.001 17.2)` | `oklch(0.181 0.005 39.3)` |
| `bronze/2` | `oklch(0.98 0.007 39.5)` | `oklch(0.216 0.006 56)` |
| `bronze/3` | `oklch(0.952 0.011 39.4)` | `oklch(0.256 0.007 48.4)` |
| `bronze/4` | `oklch(0.926 0.014 46.2)` | `oklch(0.29 0.01 48.3)` |
| `bronze/5` | `oklch(0.895 0.018 44.8)` | `oklch(0.329 0.013 41.7)` |
| `bronze/6` | `oklch(0.861 0.023 45.6)` | `oklch(0.374 0.017 41)` |
| `bronze/7` | `oklch(0.812 0.029 42.6)` | `oklch(0.429 0.021 40.6)` |
| `bronze/8` | `oklch(0.742 0.039 41.2)` | `oklch(0.499 0.024 45)` |
| `bronze/9` | `oklch(0.627 0.046 44.2)` | `oklch(0.627 0.046 44.2)` |
| `bronze/10` | `oklch(0.588 0.046 40.9)` | `oklch(0.668 0.046 43.5)` |
| `bronze/11` | `oklch(0.511 0.044 38.6)` | `oklch(0.792 0.043 44.3)` |
| `bronze/12` | `oklch(0.329 0.029 35.2)` | `oklch(0.915 0.017 50.4)` |
| `violet/2` | `oklch(0.983 0.009 299.2)` | `oklch(0.211 0.032 300.9)` |
| `violet/3` | `oklch(0.962 0.019 299.1)` | `oklch(0.271 0.065 294.4)` |
| `violet/4` | `oklch(0.932 0.037 297.5)` | `oklch(0.312 0.093 292.1)` |
| `violet/5` | `oklch(0.904 0.052 295)` | `oklch(0.349 0.099 291.3)` |
| `violet/6` | `oklch(0.864 0.072 293.7)` | `oklch(0.389 0.102 292.1)` |
| `violet/7` | `oklch(0.806 0.09 293.6)` | `oklch(0.445 0.11 292)` |
| `violet/8` | `oklch(0.73 0.119 292.6)` | `oklch(0.518 0.131 290.3)` |
| `violet/9` | `oklch(0.542 0.179 288)` | `oklch(0.542 0.179 288)` |
| `violet/10` | `oklch(0.511 0.177 287.7)` | `oklch(0.589 0.169 289.4)` |
| `violet/11` | `oklch(0.508 0.159 288.6)` | `oklch(0.778 0.125 293.2)` |
| `violet/12` | `oklch(0.313 0.097 286.6)` | `oklch(0.912 0.045 292.4)` |
| `gold/1` | `oklch(0.994 0.001 106.4)` | `oklch(0.182 0.002 106.6)` |
| `gold/2` | `oklch(0.981 0.009 100)` | `oklch(0.218 0.006 91.6)` |
| `gold/3` | `oklch(0.954 0.012 96.4)` | `oklch(0.256 0.007 95.4)` |
| `gold/4` | `oklch(0.925 0.015 90.2)` | `oklch(0.289 0.009 88.8)` |
| `gold/5` | `oklch(0.895 0.018 89.4)` | `oklch(0.33 0.013 87.6)` |
| `gold/6` | `oklch(0.859 0.025 85.8)` | `oklch(0.373 0.013 81.7)` |
| `gold/7` | `oklch(0.811 0.033 84.6)` | `oklch(0.43 0.016 82.4)` |
| `gold/8` | `oklch(0.739 0.042 79.4)` | `oklch(0.499 0.021 81.3)` |
| `gold/9` | `oklch(0.62 0.049 77.7)` | `oklch(0.62 0.049 77.7)` |
| `gold/10` | `oklch(0.589 0.046 78.6)` | `oklch(0.663 0.047 78.3)` |
| `gold/11` | `oklch(0.504 0.039 78.3)` | `oklch(0.794 0.041 77.1)` |
| `gold/12` | `oklch(0.332 0.019 80.5)` | `oklch(0.915 0.014 78.3)` |
| `brown/1` | `oklch(0.995 0.002 67.8)` | `oklch(0.178 0.004 84.6)` |
| `brown/2` | `oklch(0.984 0.005 67.8)` | `oklch(0.213 0.007 48.4)` |
| `brown/3` | `oklch(0.953 0.013 63.9)` | `oklch(0.254 0.013 51.6)` |
| `brown/4` | `oklch(0.925 0.02 65.1)` | `oklch(0.289 0.018 59.9)` |
| `brown/5` | `oklch(0.898 0.029 65.7)` | `oklch(0.325 0.024 56.4)` |
| `brown/6` | `oklch(0.862 0.039 66)` | `oklch(0.371 0.032 59)` |
| `brown/7` | `oklch(0.815 0.054 64.2)` | `oklch(0.429 0.041 57.8)` |
| `brown/8` | `oklch(0.746 0.072 62.1)` | `oklch(0.509 0.053 62)` |
| `brown/9` | `oklch(0.633 0.078 61)` | `oklch(0.633 0.078 61)` |
| `brown/10` | `oklch(0.597 0.072 59.1)` | `oklch(0.673 0.074 61.1)` |
| `brown/11` | `oklch(0.512 0.058 55.5)` | `oklch(0.798 0.063 62.7)` |
| `brown/12` | `oklch(0.331 0.018 45.9)` | `oklch(0.917 0.036 75.5)` |
| `orange/1` | `oklch(0.992 0.003 48.7)` | `oklch(0.187 0.011 60.7)` |
| `orange/2` | `oklch(0.98 0.016 73.7)` | `oklch(0.208 0.019 62.7)` |
| `orange/3` | `oklch(0.958 0.037 79.1)` | `oklch(0.258 0.045 60.8)` |
| `orange/4` | `oklch(0.92 0.065 74.4)` | `oklch(0.294 0.071 56.7)` |
| `orange/5` | `oklch(0.888 0.088 71.3)` | `oklch(0.334 0.083 54.4)` |
| `orange/6` | `oklch(0.854 0.107 66)` | `oklch(0.385 0.087 55)` |
| `orange/7` | `oklch(0.806 0.112 60)` | `oklch(0.452 0.095 52.7)` |
| `orange/8` | `oklch(0.745 0.132 54.7)` | `oklch(0.541 0.116 50)` |
| `orange/9` | `oklch(0.691 0.191 45)` | `oklch(0.691 0.191 45)` |
| `orange/10` | `oklch(0.662 0.195 43.5)` | `oklch(0.733 0.182 50.9)` |
| `orange/11` | `oklch(0.585 0.174 42.7)` | `oklch(0.789 0.143 56.2)` |
| `orange/12` | `oklch(0.35 0.069 40.8)` | `oklch(0.925 0.052 66.2)` |
| `amber/1` | `oklch(0.994 0.003 84.6)` | `oklch(0.185 0.013 77.8)` |
| `amber/2` | `oklch(0.986 0.024 99.1)` | `oklch(0.212 0.018 82)` |
| `amber/3` | `oklch(0.97 0.068 100.4)` | `oklch(0.258 0.044 74.5)` |
| `amber/4` | `oklch(0.945 0.103 97.9)` | `oklch(0.296 0.063 73.9)` |
| `amber/5` | `oklch(0.918 0.133 98.2)` | `oklch(0.336 0.072 72.9)` |
| `amber/6` | `oklch(0.88 0.123 93.4)` | `oklch(0.386 0.078 75.3)` |
| `amber/7` | `oklch(0.827 0.122 86.7)` | `oklch(0.454 0.082 75)` |
| `amber/8` | `oklch(0.758 0.14 76.7)` | `oklch(0.536 0.096 73.4)` |
| `amber/9` | `oklch(0.854 0.157 84.1)` | `oklch(0.854 0.157 84.1)` |
| `amber/10` | `oklch(0.831 0.168 80.8)` | `oklch(0.885 0.181 94.8)` |
| `amber/11` | `oklch(0.571 0.129 63.9)` | `oklch(0.862 0.173 89)` |
| `amber/12` | `oklch(0.352 0.049 54.2)` | `oklch(0.935 0.072 86.1)` |
| `yellow/1` | `oklch(0.993 0.005 106.5)` | `oklch(0.182 0.014 94)` |
| `yellow/2` | `oklch(0.988 0.025 101.9)` | `oklch(0.209 0.017 91.8)` |
| `yellow/3` | `oklch(0.974 0.084 104.2)` | `oklch(0.261 0.047 90.3)` |
| `yellow/4` | `oklch(0.953 0.117 102.1)` | `oklch(0.293 0.06 93.8)` |
| `yellow/5` | `oklch(0.925 0.141 98.1)` | `oklch(0.335 0.068 92.5)` |
| `yellow/6` | `oklch(0.881 0.134 95.3)` | `oklch(0.385 0.078 92.9)` |
| `yellow/7` | `oklch(0.835 0.12 92.8)` | `oklch(0.452 0.081 92)` |
| `yellow/8` | `oklch(0.766 0.137 89.7)` | `oklch(0.535 0.095 89.4)` |
| `yellow/9` | `oklch(0.918 0.184 100.9)` | `oklch(0.918 0.184 100.9)` |
| `yellow/10` | `oklch(0.897 0.185 97.4)` | `oklch(0.971 0.182 109.4)` |
| `yellow/11` | `oklch(0.569 0.119 76.8)` | `oklch(0.9 0.166 101.7)` |
| `yellow/12` | `oklch(0.358 0.046 86.9)` | `oklch(0.942 0.075 101.1)` |
| `lime/1` | `oklch(0.992 0.004 121.6)` | `oklch(0.182 0.014 120.8)` |
| `lime/2` | `oklch(0.982 0.009 119.6)` | `oklch(0.209 0.02 129.6)` |
| `lime/3` | `oklch(0.959 0.043 118.6)` | `oklch(0.266 0.035 132)` |
| `lime/4` | `oklch(0.932 0.068 120.2)` | `oklch(0.316 0.047 131.7)` |
| `lime/5` | `oklch(0.897 0.088 122.1)` | `oklch(0.363 0.057 131)` |
| `lime/6` | `oklch(0.853 0.099 123.3)` | `oklch(0.41 0.068 131.5)` |
| `lime/7` | `oklch(0.795 0.112 125.4)` | `oklch(0.463 0.079 131.1)` |
| `lime/8` | `oklch(0.725 0.135 128.2)` | `oklch(0.524 0.094 130.6)` |
| `lime/9` | `oklch(0.887 0.175 126.1)` | `oklch(0.887 0.175 126.1)` |
| `lime/10` | `oklch(0.859 0.188 126.7)` | `oklch(0.942 0.176 123.8)` |
| `lime/11` | `oklch(0.544 0.111 128.6)` | `oklch(0.868 0.155 124.7)` |
| `lime/12` | `oklch(0.354 0.057 121)` | `oklch(0.946 0.082 122.7)` |
| `mint/1` | `oklch(0.993 0.005 183)` | `oklch(0.189 0.011 196.3)` |
| `mint/2` | `oklch(0.981 0.01 181.4)` | `oklch(0.211 0.017 195.9)` |
| `mint/3` | `oklch(0.96 0.031 178.9)` | `oklch(0.268 0.039 192.4)` |
| `mint/4` | `oklch(0.933 0.048 178.3)` | `oklch(0.315 0.054 191)` |
| `mint/5` | `oklch(0.9 0.061 178.1)` | `oklch(0.359 0.062 190)` |
| `mint/6` | `oklch(0.857 0.072 178.2)` | `oklch(0.411 0.066 186.2)` |
| `mint/7` | `oklch(0.797 0.084 178.2)` | `oklch(0.47 0.073 183.5)` |
| `mint/8` | `oklch(0.722 0.106 177.8)` | `oklch(0.541 0.085 179.2)` |
| `mint/9` | `oklch(0.87 0.1 178)` | `oklch(0.87 0.1 178)` |
| `mint/10` | `oklch(0.84 0.099 178.4)` | `oklch(0.916 0.079 180)` |
| `mint/11` | `oklch(0.512 0.096 175.6)` | `oklch(0.795 0.118 176.5)` |
| `mint/12` | `oklch(0.35 0.051 181.3)` | `oklch(0.931 0.057 168.3)` |
| `sky/1` | `oklch(0.994 0.005 211)` | `oklch(0.19 0.025 259.2)` |
| `black/1` | `oklch(0 0 0 / 5%)` | `oklch(0 0 0 / 5%)` |
| `black/2` | `oklch(0 0 0 / 10%)` | `oklch(0 0 0 / 10%)` |
| `black/3` | `oklch(0 0 0 / 15%)` | `oklch(0 0 0 / 15%)` |
| `black/4` | `oklch(0 0 0 / 20%)` | `oklch(0 0 0 / 20%)` |
| `black/5` | `oklch(0 0 0 / 30%)` | `oklch(0 0 0 / 30%)` |
| `black/6` | `oklch(0 0 0 / 40%)` | `oklch(0 0 0 / 40%)` |
| `black/7` | `oklch(0 0 0 / 50%)` | `oklch(0 0 0 / 50%)` |
| `black/8` | `oklch(0 0 0 / 60%)` | `oklch(0 0 0 / 60%)` |
| `black/9` | `oklch(0 0 0 / 70%)` | `oklch(0 0 0 / 70%)` |
| `black/10` | `oklch(0 0 0 / 80%)` | `oklch(0 0 0 / 80%)` |
| `black/11` | `oklch(0 0 0 / 90%)` | `oklch(0 0 0 / 90%)` |
| `black/12` | `oklch(0 0 0 / 95%)` | `oklch(0 0 0 / 95%)` |
| `white/1` | `oklch(1 0 0 / 5%)` | `oklch(1 0 0 / 5%)` |
| `white/2` | `oklch(1 0 0 / 10%)` | `oklch(1 0 0 / 10%)` |
| `white/3` | `oklch(1 0 0 / 15%)` | `oklch(1 0 0 / 15%)` |
| `white/4` | `oklch(1 0 0 / 20%)` | `oklch(1 0 0 / 20%)` |
| `white/5` | `oklch(1 0 0 / 30%)` | `oklch(1 0 0 / 30%)` |
| `white/6` | `oklch(1 0 0 / 40%)` | `oklch(1 0 0 / 40%)` |
| `white/7` | `oklch(1 0 0 / 50%)` | `oklch(1 0 0 / 50%)` |
| `white/8` | `oklch(1 0 0 / 60%)` | `oklch(1 0 0 / 60%)` |
| `white/9` | `oklch(1 0 0 / 70%)` | `oklch(1 0 0 / 70%)` |
| `white/10` | `oklch(1 0 0 / 80%)` | `oklch(1 0 0 / 80%)` |
| `white/11` | `oklch(1 0 0 / 90%)` | `oklch(1 0 0 / 90%)` |
| `white/12` | `oklch(1 0 0 / 95%)` | `oklch(1 0 0 / 95%)` |
| `sky/2` | `oklch(0.979 0.01 219.6)` | `oklch(0.216 0.029 257.5)` |
| `sky/3` | `oklch(0.96 0.024 219.7)` | `oklch(0.271 0.054 251.3)` |
| `sky/4` | `oklch(0.936 0.035 219.2)` | `oklch(0.321 0.07 248.7)` |
| `sky/5` | `oklch(0.903 0.047 220.6)` | `oklch(0.373 0.078 244.9)` |
| `sky/6` | `oklch(0.86 0.057 223.6)` | `oklch(0.426 0.088 243.9)` |
| `sky/7` | `oklch(0.806 0.072 225.5)` | `oklch(0.488 0.098 240.8)` |
| `sky/8` | `oklch(0.728 0.096 228.4)` | `oklch(0.557 0.115 237.4)` |
| `sky/9` | `oklch(0.861 0.103 217.8)` | `oklch(0.861 0.103 217.8)` |
| `sky/10` | `oklch(0.838 0.104 219.4)` | `oklch(0.908 0.073 214.5)` |
| `sky/11` | `oklch(0.525 0.108 232.5)` | `oklch(0.793 0.099 231.6)` |
| `sky/12` | `oklch(0.351 0.057 242.4)` | `oklch(0.934 0.053 214.3)` |

---

## §D · Border radius — `border-radius`

Collection `border-radius` — **150 variables**

Values in px (these match Tailwind v4's default radius scale).

| token | value | token | value |
| --- | --- | --- | --- |
| `rounded-xs` | `2` | `rounded-ss-2xl` | `16` |
| `rounded-sm` | `4` | `rounded-ss-3xl` | `24` |
| `rounded-md` | `6` | `rounded-ss-4xl` | `32` |
| `rounded-lg` | `8` | `rounded-ss-none` | `0` |
| `rounded-xl` | `12` | `rounded-ss-full` | `9999` |
| `rounded-2xl` | `16` | `rounded-se-xs` | `2` |
| `rounded-3xl` | `24` | `rounded-se-sm` | `4` |
| `rounded-4xl` | `32` | `rounded-se-md` | `6` |
| `rounded-none` | `0` | `rounded-se-lg` | `8` |
| `rounded-full` | `9999` | `rounded-se-xl` | `12` |
| `rounded-s-xs` | `2` | `rounded-se-2xl` | `16` |
| `rounded-s-sm` | `4` | `rounded-se-3xl` | `24` |
| `rounded-s-md` | `6` | `rounded-se-4xl` | `32` |
| `rounded-s-lg` | `8` | `rounded-se-none` | `0` |
| `rounded-s-xl` | `12` | `rounded-se-full` | `9999` |
| `rounded-s-2xl` | `16` | `rounded-ee-xs` | `2` |
| `rounded-s-3xl` | `24` | `rounded-ee-sm` | `4` |
| `rounded-s-4xl` | `32` | `rounded-ee-md` | `6` |
| `rounded-s-none` | `0` | `rounded-ee-lg` | `8` |
| `rounded-s-full` | `9999` | `rounded-ee-xl` | `12` |
| `rounded-e-xs` | `2` | `rounded-ee-2xl` | `16` |
| `rounded-e-sm` | `4` | `rounded-ee-3xl` | `24` |
| `rounded-e-md` | `6` | `rounded-ee-4xl` | `32` |
| `rounded-e-lg` | `8` | `rounded-ee-none` | `0` |
| `rounded-e-xl` | `12` | `rounded-ee-full` | `9999` |
| `rounded-e-2xl` | `16` | `rounded-es-xs` | `2` |
| `rounded-e-3xl` | `24` | `rounded-es-sm` | `4` |
| `rounded-e-4xl` | `32` | `rounded-es-md` | `6` |
| `rounded-e-none` | `0` | `rounded-es-lg` | `8` |
| `rounded-e-full` | `9999` | `rounded-es-xl` | `12` |
| `rounded-t-xs` | `2` | `rounded-es-2xl` | `16` |
| `rounded-t-sm` | `4` | `rounded-es-3xl` | `24` |
| `rounded-t-md` | `6` | `rounded-es-4xl` | `32` |
| `rounded-t-lg` | `8` | `rounded-es-none` | `0` |
| `rounded-t-xl` | `12` | `rounded-es-full` | `9999` |
| `rounded-t-2xl` | `16` | `rounded-tl-xs` | `0` |
| `rounded-t-3xl` | `24` | `rounded-tl-sm` | `4` |
| `rounded-t-4xl` | `32` | `rounded-tl-md` | `6` |
| `rounded-t-none` | `0` | `rounded-tl-lg` | `8` |
| `rounded-t-full` | `9999` | `rounded-tl-xl` | `12` |
| `rounded-r-xs` | `2` | `rounded-tl-2xl` | `16` |
| `rounded-r-sm` | `4` | `rounded-tl-3xl` | `24` |
| `rounded-r-md` | `6` | `rounded-tl-4xl` | `32` |
| `rounded-r-lg` | `8` | `rounded-tl-none` | `0` |
| `rounded-r-xl` | `12` | `rounded-tl-full` | `9999` |
| `rounded-r-2xl` | `16` | `rounded-tr-xs` | `2` |
| `rounded-r-3xl` | `24` | `rounded-tr-sm` | `4` |
| `rounded-r-4xl` | `32` | `rounded-tr-md` | `6` |
| `rounded-r-none` | `0` | `rounded-tr-lg` | `8` |
| `rounded-r-full` | `9999` | `rounded-tr-xl` | `12` |
| `rounded-b-xs` | `2` | `rounded-tr-2xl` | `16` |
| `rounded-b-sm` | `4` | `rounded-tr-3xl` | `24` |
| `rounded-b-md` | `6` | `rounded-tr-4xl` | `32` |
| `rounded-b-lg` | `8` | `rounded-tr-none` | `0` |
| `rounded-b-xl` | `12` | `rounded-tr-full` | `9999` |
| `rounded-b-2xl` | `16` | `rounded-br-xs` | `2` |
| `rounded-b-3xl` | `24` | `rounded-br-sm` | `4` |
| `rounded-b-4xl` | `32` | `rounded-br-md` | `6` |
| `rounded-b-none` | `0` | `rounded-br-lg` | `8` |
| `rounded-b-full` | `9999` | `rounded-br-xl` | `12` |
| `rounded-1-xs` | `2` | `rounded-br-2xl` | `16` |
| `rounded-1-sm` | `4` | `rounded-br-3xl` | `24` |
| `rounded-1-md` | `6` | `rounded-br-4xl` | `32` |
| `rounded-1-lg` | `8` | `rounded-br-none` | `0` |
| `rounded-1-xl` | `12` | `rounded-br-full` | `9999` |
| `rounded-1-2xl` | `16` | `rounded-bl-xs` | `2` |
| `rounded-1-3xl` | `24` | `rounded-bl-sm` | `4` |
| `rounded-1-4xl` | `32` | `rounded-bl-md` | `6` |
| `rounded-1-none` | `0` | `rounded-bl-lg` | `8` |
| `rounded-1-full` | `9999` | `rounded-bl-xl` | `12` |
| `rounded-ss-xs` | `2` | `rounded-bl-2xl` | `16` |
| `rounded-ss-sm` | `4` | `rounded-bl-3xl` | `24` |
| `rounded-ss-md` | `6` | `rounded-bl-4xl` | `32` |
| `rounded-ss-lg` | `8` | `rounded-bl-none` | `0` |
| `rounded-ss-xl` | `12` | `rounded-bl-full` | `9999` |

---

## §E · Typography — `font`

Collection `font` — **45 variables**

family · size (px) · weight · leading (px) · tracking · style

| token | value | token | value |
| --- | --- | --- | --- |
| `family/sans` | `Inter` | `weight/bold` | `700` |
| `family/mono` | `Geist Mono` | `weight/extrabold` | `800` |
| `size/xs` | `12` | `weight/black` | `900` |
| `style/italic` | `italic` | `leading/3` | `12` |
| `size/sm` | `14` | `leading/4` | `16` |
| `style/not-italic` | `normal` | `leading/5` | `20` |
| `size/base` | `16` | `leading/6` | `24` |
| `size/lg` | `18` | `leading/7` | `28` |
| `size/xl` | `20` | `leading/8` | `32` |
| `size/2xl` | `24` | `leading/9` | `36` |
| `size/3xl` | `30` | `leading/10` | `40` |
| `size/4xl` | `36` | `leading/12` | `48` |
| `size/5xl` | `48` | `leading/15` | `60` |
| `size/6xl` | `60` | `leading/18` | `72` |
| `size/7xl` | `72` | `leading/24` | `96` |
| `size/8xl` | `96` | `leading/32` | `128` |
| `size/9xl` | `128` | `tracking/tighter` | `-0.8` |
| `weight/thin` | `100` | `tracking/tight` | `-0.4` |
| `weight/extralight` | `200` | `tracking/normal` | `0` |
| `weight/light` | `300` | `tracking/wide` | `0.4` |
| `weight/normal` | `400` | `tracking/wider` | `0.8` |
| `weight/medium` | `500` | `tracking/widest` | `1.6` |
| `weight/semibold` | `600` | | |

---

## §F · Spacing — `space`

Collection `space` — **68 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `space-x-0` | `0` | `space-x-14` | `56` |
| `space-y-0` | `0` | `space-y-14` | `56` |
| `space-x-0,5` | `2` | `space-x-16` | `64` |
| `space-y-0,5` | `2` | `space-y-16` | `64` |
| `space-x-1` | `4` | `space-x-20` | `80` |
| `space-y-1` | `4` | `space-y-20` | `80` |
| `space-x-1,5` | `6` | `space-x-24` | `96` |
| `space-y-1,5` | `6` | `space-y-24` | `96` |
| `space-x-2` | `8` | `space-x-28` | `112` |
| `space-y-2` | `8` | `space-y-28` | `112` |
| `space-x-2,5` | `10` | `space-x-32` | `128` |
| `space-y-2,5` | `10` | `space-y-32` | `128` |
| `space-x-3` | `12` | `space-x-36` | `144` |
| `space-y-3` | `12` | `space-y-36` | `144` |
| `space-x-3,5` | `14` | `space-x-40` | `160` |
| `space-y-3,5` | `14` | `space-y-40` | `160` |
| `space-x-4` | `16` | `space-x-44` | `176` |
| `space-y-4` | `16` | `space-y-44` | `176` |
| `space-x-5` | `20` | `space-x-48` | `192` |
| `space-y-5` | `20` | `space-y-48` | `192` |
| `space-x-6` | `24` | `space-x-52` | `208` |
| `space-y-6` | `24` | `space-y-52` | `208` |
| `space-x-7` | `28` | `space-x-56` | `224` |
| `space-y-7` | `28` | `space-y-56` | `224` |
| `space-x-8` | `32` | `space-x-60` | `240` |
| `space-y-8` | `32` | `space-y-60` | `240` |
| `space-x-9` | `36` | `space-x-64` | `256` |
| `space-y-9` | `36` | `space-y-64` | `256` |
| `space-x-10` | `40` | `space-x-72` | `288` |
| `space-y-10` | `40` | `space-y-72` | `288` |
| `space-x-11` | `44` | `space-x-80` | `320` |
| `space-y-11` | `44` | `space-y-80` | `320` |
| `space-x-12` | `48` | `space-x-96` | `384` |
| `space-y-12` | `48` | `space-y-96` | `384` |

---

## §G · Padding — `padding`

Collection `padding` — **245 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `p-0` | `0` | `pl-12` | `48` |
| `px-0` | `0` | `pt-12` | `48` |
| `py-0` | `0` | `pb-12` | `48` |
| `pr-0` | `0` | `p-14` | `56` |
| `pl-0` | `0` | `px-14` | `56` |
| `pt-0` | `0` | `py-14` | `56` |
| `pb-0` | `0` | `pr-14` | `56` |
| `p-px` | `1` | `pl-14` | `56` |
| `px-px` | `1` | `pt-14` | `56` |
| `py-px` | `1` | `pb-14` | `56` |
| `pt-px` | `1` | `p-16` | `64` |
| `pr-px` | `1` | `px-16` | `64` |
| `pl-px` | `1` | `py-16` | `64` |
| `pb-px` | `1` | `pr-16` | `64` |
| `p-0,5` | `2` | `pt-16` | `64` |
| `px-0,5` | `2` | `pl-16` | `64` |
| `py-0,5` | `2` | `pb-16` | `64` |
| `pr-0,5` | `2` | `p-20` | `80` |
| `pl-0,5` | `2` | `px-20` | `80` |
| `pt-0,5` | `2` | `py-20` | `80` |
| `pb-0,5` | `2` | `pr-20` | `80` |
| `p-1` | `4` | `pl-20` | `80` |
| `px-1` | `4` | `pt-20` | `80` |
| `py-1` | `4` | `pb-20` | `80` |
| `pr-1` | `4` | `p-24` | `96` |
| `pl-1` | `4` | `px-24` | `96` |
| `pt-1` | `4` | `py-24` | `96` |
| `pb-1` | `4` | `pr-24` | `96` |
| `p-1,5` | `6` | `pl-24` | `96` |
| `px-1,5` | `6` | `pt-24` | `96` |
| `py-1,5` | `6` | `pb-24` | `96` |
| `pr-1,5` | `6` | `p-28` | `112` |
| `pl-1,15` | `6` | `px-28` | `112` |
| `pt-1,5` | `6` | `py-28` | `112` |
| `pb-1,5` | `6` | `pr-28` | `112` |
| `p-2` | `8` | `pl-28` | `112` |
| `px-2` | `8` | `pt-28` | `112` |
| `py-2` | `8` | `pb-28` | `112` |
| `pr-2` | `8` | `p-32` | `128` |
| `pl-2` | `8` | `px-32` | `128` |
| `pt-2` | `8` | `py-32` | `128` |
| `pb-2` | `8` | `pr-32` | `128` |
| `p-2,5` | `10` | `pl-32` | `128` |
| `px-2,5` | `10` | `pt-32` | `128` |
| `py-2,5` | `10` | `pb-32` | `128` |
| `pr-2,5` | `10` | `p-36` | `144` |
| `pl-2,5` | `10` | `px-36` | `144` |
| `pt-2,5` | `10` | `py-36` | `144` |
| `pb-2,5` | `10` | `pr-36` | `144` |
| `p-3` | `12` | `pl-36` | `144` |
| `px-3` | `12` | `pt-36` | `144` |
| `py-3` | `12` | `pb-36` | `144` |
| `pr-3` | `12` | `p-40` | `160` |
| `pl-3` | `12` | `px-40` | `160` |
| `pt-3` | `12` | `py-40` | `160` |
| `pb-3` | `12` | `pr-40` | `160` |
| `p-3,5` | `14` | `pl-40` | `160` |
| `px-3,5` | `14` | `pt-40` | `160` |
| `py-3,5` | `14` | `pb-40` | `160` |
| `pr-3,5` | `14` | `p-44` | `176` |
| `pl-3,5` | `14` | `px-44` | `176` |
| `pt-3,5` | `14` | `py-44` | `176` |
| `pb-3,5` | `14` | `pr-44` | `176` |
| `p-4` | `16` | `pl-44` | `176` |
| `px-4` | `16` | `pt-44` | `176` |
| `py-4` | `16` | `pb-44` | `176` |
| `pr-4` | `16` | `p-48` | `192` |
| `pl-4` | `16` | `px-48` | `192` |
| `pt-4` | `16` | `py-48` | `192` |
| `pb-4` | `16` | `pr-48` | `192` |
| `p-5` | `20` | `pl-48` | `192` |
| `px-5` | `20` | `pt-48` | `192` |
| `py-5` | `20` | `pb-48` | `192` |
| `pr-5` | `20` | `p-52` | `208` |
| `pl-5` | `20` | `px-52` | `208` |
| `pt-5` | `20` | `py-52` | `208` |
| `pb-5` | `20` | `pr-52` | `208` |
| `p-6` | `24` | `pl-52` | `208` |
| `px-6` | `24` | `pt-52` | `208` |
| `py-6` | `24` | `pb-52` | `208` |
| `pr-6` | `24` | `p-56` | `224` |
| `pl-6` | `24` | `px-56` | `224` |
| `pt-6` | `24` | `py-56` | `224` |
| `pb-6` | `24` | `pr-56` | `224` |
| `p-7` | `28` | `pl-56` | `224` |
| `px-7` | `28` | `pt-56` | `224` |
| `py-7` | `28` | `pb-56` | `224` |
| `pr-7` | `28` | `p-60` | `240` |
| `pl-7` | `28` | `px-60` | `240` |
| `pt-7` | `28` | `py-60` | `240` |
| `pb-7` | `28` | `pr-60` | `240` |
| `p-8` | `32` | `pl-60` | `240` |
| `px-8` | `32` | `pt-60` | `240` |
| `py-8` | `32` | `pb-60` | `240` |
| `pr-8` | `32` | `p-64` | `256` |
| `pl-8` | `32` | `px-64` | `256` |
| `pt-8` | `32` | `py-64` | `256` |
| `pb-8` | `32` | `pr-64` | `256` |
| `p-9` | `36` | `pl-64` | `256` |
| `px-9` | `36` | `pt-64` | `256` |
| `py-9` | `36` | `pb-64` | `256` |
| `pr-9` | `36` | `p-72` | `288` |
| `pl-9` | `36` | `px-72` | `288` |
| `pt-9` | `36` | `py-72` | `288` |
| `pb-9` | `36` | `pr-72` | `288` |
| `p-10` | `40` | `pl-72` | `288` |
| `px-10` | `40` | `pt-72` | `288` |
| `py-10` | `40` | `pb-72` | `288` |
| `pr-10` | `40` | `p-80` | `320` |
| `pl-10` | `40` | `px-80` | `320` |
| `pt-10` | `40` | `py-80` | `320` |
| `pb-10` | `40` | `pr-80` | `320` |
| `p-11` | `44` | `pl-80` | `320` |
| `px-11` | `44` | `pt-80` | `320` |
| `py-11` | `44` | `pb-80` | `320` |
| `pr-11` | `44` | `p-96` | `384` |
| `pl-11` | `44` | `px-96` | `384` |
| `pt-11` | `44` | `py-96` | `384` |
| `pb-11` | `44` | `pr-96` | `384` |
| `p-12` | `48` | `pl-96` | `384` |
| `px-12` | `48` | `pt-96` | `384` |
| `py-12` | `48` | `pb-96` | `384` |
| `pr-12` | `48` | | |

---

## §H · Margin — `margin`

Collection `margin` — **245 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `m-0` | `0` | `ml-12` | `48` |
| `mx-0` | `0` | `mt-12` | `48` |
| `my-0` | `0` | `mb-12` | `48` |
| `mr-0` | `0` | `m-14` | `56` |
| `ml-0` | `0` | `mx-14` | `56` |
| `mt-0` | `0` | `my-14` | `56` |
| `mb-0` | `0` | `mr-14` | `56` |
| `m-px` | `1` | `ml-14` | `56` |
| `mx-px` | `1` | `mt-14` | `56` |
| `my-px` | `1` | `mb-14` | `56` |
| `mr-px` | `1` | `m-16` | `64` |
| `ml-px` | `1` | `mx-16` | `64` |
| `mt-px` | `1` | `my-16` | `64` |
| `mb-px` | `1` | `mr-16` | `64` |
| `m-0,5` | `2` | `ml-16` | `64` |
| `mx-0,5` | `2` | `mt-16` | `64` |
| `my-0,5` | `2` | `mb-16` | `64` |
| `mr-0,5` | `2` | `m-20` | `80` |
| `ml-0,5` | `2` | `mx-20` | `80` |
| `mt-0,5` | `2` | `my-20` | `80` |
| `mb-0,5` | `2` | `mr-20` | `80` |
| `m-1` | `4` | `ml-20` | `80` |
| `mx-1` | `4` | `mt-20` | `80` |
| `my-1` | `4` | `mb-20` | `80` |
| `mr-1` | `4` | `m-24` | `96` |
| `ml-1` | `4` | `mx-24` | `96` |
| `mt-1` | `4` | `my-24` | `96` |
| `mb-1` | `4` | `mr-24` | `96` |
| `m-1,5` | `6` | `ml-24` | `96` |
| `mx-1,5` | `6` | `mt-24` | `96` |
| `my-1,5` | `6` | `mb-24` | `96` |
| `mr-1,5` | `6` | `m-28` | `112` |
| `ml-1,5` | `6` | `mx-28` | `112` |
| `mt-1,5` | `6` | `my-28` | `112` |
| `mb-1,5` | `6` | `mr-28` | `112` |
| `m-2` | `8` | `ml-28` | `112` |
| `mx-2` | `8` | `mt-28` | `112` |
| `my-2` | `8` | `mb-28` | `112` |
| `mr-2` | `8` | `m-32` | `128` |
| `ml-2` | `8` | `mx-32` | `128` |
| `mt-2` | `8` | `my-32` | `128` |
| `mb-2` | `8` | `mr-32` | `128` |
| `m-2,5` | `10` | `ml-32` | `128` |
| `mx-2,5` | `10` | `mt-32` | `128` |
| `my-2,5` | `10` | `mb-32` | `128` |
| `mr-2,5` | `10` | `m-36` | `144` |
| `ml-2,5` | `10` | `mx-36` | `144` |
| `mt-2,5` | `10` | `my-36` | `144` |
| `mb-2,5` | `10` | `mr-36` | `144` |
| `m-3` | `12` | `ml-36` | `144` |
| `mx-3` | `12` | `mt-36` | `144` |
| `my-3` | `12` | `mb-36` | `144` |
| `mr-3` | `12` | `m-40` | `160` |
| `ml-3` | `12` | `mx-40` | `160` |
| `mt-3` | `12` | `my-40` | `160` |
| `mb-3` | `12` | `mr-40` | `160` |
| `m-3,5` | `14` | `ml-40` | `160` |
| `mx-3,5` | `14` | `mt-40` | `160` |
| `my-3,5` | `14` | `mb-40` | `160` |
| `mr-3,5` | `14` | `m-44` | `176` |
| `ml-3,5` | `14` | `mx-44` | `176` |
| `mt-3,5` | `14` | `my-44` | `176` |
| `mb-3,5` | `14` | `mr-44` | `176` |
| `m-4` | `16` | `ml-44` | `176` |
| `mx-4` | `16` | `mt-44` | `176` |
| `my-4` | `16` | `mb-44` | `176` |
| `mr-4` | `16` | `m-48` | `192` |
| `ml-4` | `16` | `mx-48` | `192` |
| `mt-4` | `16` | `my-48` | `192` |
| `mb-4` | `16` | `mr-48` | `192` |
| `m-5` | `20` | `ml-48` | `192` |
| `mx-5` | `20` | `mt-48` | `192` |
| `my-5` | `20` | `mb-48` | `192` |
| `mr-5` | `20` | `m-52` | `208` |
| `ml-5` | `20` | `mx-52` | `208` |
| `mt-5` | `20` | `my-52` | `208` |
| `mb-5` | `20` | `mr-52` | `208` |
| `m-6` | `24` | `ml-52` | `208` |
| `mx-6` | `24` | `mt-52` | `208` |
| `my-6` | `24` | `mb-52` | `208` |
| `mr-6` | `24` | `m-56` | `224` |
| `ml-6` | `24` | `mx-56` | `224` |
| `mt-6` | `24` | `my-56` | `224` |
| `mb-6` | `24` | `mr-56` | `224` |
| `m-7` | `28` | `ml-56` | `224` |
| `mx-7` | `28` | `mt-56` | `224` |
| `my-7` | `28` | `mb-56` | `224` |
| `mr-7` | `28` | `m-60` | `240` |
| `ml-7` | `28` | `mx-60` | `240` |
| `mt-7` | `28` | `my-60` | `240` |
| `mb-7` | `28` | `mr-60` | `240` |
| `m-8` | `32` | `ml-60` | `240` |
| `mx-8` | `32` | `mt-60` | `240` |
| `my-8` | `32` | `mb-60` | `240` |
| `mr-8` | `32` | `m-64` | `256` |
| `ml-8` | `32` | `mx-64` | `256` |
| `mt-8` | `32` | `my-64` | `256` |
| `mb-8` | `32` | `mr-64` | `256` |
| `m-9` | `36` | `ml-64` | `256` |
| `mx-9` | `36` | `mt-64` | `256` |
| `my-9` | `36` | `mb-64` | `256` |
| `mr-9` | `36` | `m-72` | `288` |
| `ml-9` | `36` | `mx-72` | `288` |
| `mt-9` | `36` | `my-72` | `288` |
| `mb-9` | `36` | `mr-72` | `288` |
| `m-10` | `40` | `ml-72` | `288` |
| `mx-10` | `40` | `mt-72` | `288` |
| `my-10` | `40` | `mb-72` | `288` |
| `mr-10` | `40` | `m-80` | `320` |
| `ml-10` | `40` | `mx-80` | `320` |
| `mt-10` | `40` | `my-80` | `320` |
| `mb-10` | `40` | `mr-80` | `320` |
| `m-11` | `44` | `ml-80` | `320` |
| `mx-11` | `44` | `mt-80` | `320` |
| `my-11` | `44` | `mb-80` | `320` |
| `mr-11` | `44` | `m-96` | `384` |
| `ml-11` | `44` | `mx-96` | `384` |
| `mt-11` | `44` | `my-96` | `384` |
| `mb-11` | `44` | `mr-96` | `384` |
| `m-12` | `48` | `ml-96` | `384` |
| `mx-12` | `48` | `mt-96` | `384` |
| `my-12` | `48` | `mb-96` | `384` |
| `mr-12` | `48` | | |

---

## §I · Gap — `gap`

Collection `gap` — **102 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `gap-0` | `0` | `gap-14` | `56` |
| `gap-x-0` | `0` | `gap-x-14` | `56` |
| `gap-y-0` | `0` | `gap-y-14` | `56` |
| `gap-0,5` | `2` | `gap-16` | `64` |
| `gap-x-0,5` | `2` | `gap-x-16` | `64` |
| `gap-y-0,5` | `2` | `gap-y-16` | `64` |
| `gap-1` | `4` | `gap-20` | `80` |
| `gap-x-1` | `4` | `gap-x-20` | `80` |
| `gap-y-1` | `4` | `gap-y-20` | `80` |
| `gap-1,5` | `6` | `gap-24` | `96` |
| `gap-x-1,5` | `6` | `gap-x-24` | `96` |
| `gap-y-1,5` | `6` | `gap-y-24` | `96` |
| `gap-2` | `8` | `gap-28` | `112` |
| `gap-x-2` | `8` | `gap-x-28` | `112` |
| `gap-y-2` | `8` | `gap-y-28` | `112` |
| `gap-2,5` | `10` | `gap-32` | `128` |
| `gap-x-2,5` | `10` | `gap-x-32` | `128` |
| `gap-y-2,5` | `10` | `gap-y-32` | `128` |
| `gap-3` | `12` | `gap-36` | `144` |
| `gap-x-3` | `12` | `gap-x-36` | `144` |
| `gap-y-3` | `12` | `gap-y-36` | `144` |
| `gap-3,5` | `14` | `gap-40` | `160` |
| `gap-x-3,5` | `14` | `gap-x-40` | `160` |
| `gap-y-3,5` | `14` | `gap-y-40` | `160` |
| `gap-4` | `16` | `gap-44` | `176` |
| `gap-x-4` | `16` | `gap-x-44` | `176` |
| `gap-y-4` | `16` | `gap-y-44` | `176` |
| `gap-5` | `20` | `gap-48` | `192` |
| `gap-x-5` | `20` | `gap-x-48` | `192` |
| `gap-y-5` | `20` | `gap-y-48` | `192` |
| `gap-6` | `24` | `gap-52` | `208` |
| `gap-x-6` | `24` | `gap-x-52` | `208` |
| `gap-y-6` | `24` | `gap-y-52` | `208` |
| `gap-7` | `28` | `gap-56` | `224` |
| `gap-x-7` | `28` | `gap-x-56` | `224` |
| `gap-y-7` | `28` | `gap-y-56` | `224` |
| `gap-8` | `32` | `gap-60` | `240` |
| `gap-x-8` | `32` | `gap-x-60` | `240` |
| `gap-y-8` | `32` | `gap-y-60` | `240` |
| `gap-9` | `36` | `gap-64` | `256` |
| `gap-x-9` | `36` | `gap-x-64` | `256` |
| `gap-y-9` | `36` | `gap-y-64` | `256` |
| `gap-10` | `40` | `gap-72` | `288` |
| `gap-x-10` | `40` | `gap-x-72` | `288` |
| `gap-y-10` | `40` | `gap-y-72` | `288` |
| `gap-11` | `44` | `gap-80` | `320` |
| `gap-x-11` | `44` | `gap-x-80` | `320` |
| `gap-y-11` | `44` | `gap-y-80` | `320` |
| `gap-12` | `48` | `gap-96` | `384` |
| `gap-x-12` | `48` | `gap-x-96` | `384` |
| `gap-y-12` | `48` | `gap-y-96` | `384` |

---

## §J · Height — `height`

Collection `height` — **24 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `h-0` | `0` | `h-8` | `32` |
| `h-px` | `1` | `h-9` | `36` |
| `h-0,5` | `2` | `h-10` | `40` |
| `h-1` | `4` | `h-12` | `48` |
| `h-2` | `8` | `h-14` | `56` |
| `h-2,5` | `10` | `h-16` | `64` |
| `h-3` | `12` | `h-18` | `72` |
| `h-3,5` | `14` | `h-20` | `80` |
| `h-4` | `16` | `h-24` | `96` |
| `h-5` | `20` | `h-48` | `192` |
| `h-6` | `24` | `h-72` | `288` |
| `h-7` | `28` | `h-96` | `384` |

---

## §K · Max-height — `max-height`

Collection `max-height` — **35 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `max-h-0` | `0` | `max-h-14` | `56` |
| `max-h-px` | `1` | `max-h-16` | `64` |
| `max-h-0,5` | `2` | `max-h-20` | `80` |
| `max-h-1` | `4` | `max-h-24` | `96` |
| `max-h-1,5` | `6` | `max-h-28` | `112` |
| `max-h-2` | `8` | `max-h-32` | `128` |
| `max-h-2,5` | `10` | `max-h-36` | `144` |
| `max-h-3` | `12` | `max-h-40` | `160` |
| `max-h-3,5` | `14` | `max-h-44` | `176` |
| `max-h-4` | `16` | `max-h-48` | `192` |
| `max-h-5` | `20` | `max-h-52` | `208` |
| `max-h-6` | `24` | `max-h-56` | `224` |
| `max-h-7` | `28` | `max-h-60` | `240` |
| `max-h-8` | `32` | `max-h-64` | `256` |
| `max-h-9` | `36` | `max-h-72` | `288` |
| `max-h-10` | `40` | `max-h-80` | `320` |
| `max-h-11` | `44` | `max-h-96` | `384` |
| `max-h-12` | `48` | | |

---

## §L · Max-width — `max-width`

Collection `max-width` — **51 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `max-w-0` | `0` | `max-w-48` | `192` |
| `max-w-px` | `1` | `max-w-52` | `208` |
| `max-w-0,5` | `2` | `max-w-56` | `224` |
| `max-w-1` | `4` | `max-w-60` | `240` |
| `max-w-1,5` | `6` | `max-w-64` | `256` |
| `max-w-2` | `8` | `max-w-72` | `288` |
| `max-w-2,5` | `10` | `max-w-80` | `320` |
| `max-w-3` | `12` | `max-w-96` | `384` |
| `max-w-4` | `16` | `max-w-xs` | `320` |
| `max-w-5` | `20` | `max-w-sm` | `384` |
| `max-w-6` | `24` | `max-w-md` | `448` |
| `max-w-7` | `28` | `max-w-lg` | `512` |
| `max-w-8` | `32` | `max-w-xl` | `576` |
| `max-w-9` | `36` | `max-w-2xl` | `672` |
| `max-w-10` | `40` | `max-w-3xl` | `768` |
| `max-w-11` | `44` | `max-w-4xl` | `896` |
| `max-w-12` | `48` | `max-w-5xl` | `1024` |
| `max-w-14` | `56` | `max-w-6xl` | `1152` |
| `max-w-16` | `64` | `max-w-7xl` | `1280` |
| `max-w-20` | `80` | `max-w-none` | `0` |
| `max-w-24` | `96` | `max-w-screen-sm` | `640` |
| `max-w-28` | `112` | `max-w-screen-md` | `768` |
| `max-w-32` | `128` | `max-w-screen-lg` | `1024` |
| `max-w-36` | `144` | `max-w-screen-xl` | `1280` |
| `max-w-40` | `160` | `max-w-screen-2xl` | `1536` |
| `max-w-44` | `176` | | |

---

## §M · Border width — `border-width`

Collection `border-width` — **45 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `border-0` | `0` | `border-e-4` | `4` |
| `border` | `1` | `border-e-8` | `8` |
| `border-2` | `2` | `border-t-0` | `0` |
| `border-4` | `4` | `border-t` | `1` |
| `border-8` | `8` | `border-t-2` | `2` |
| `border-x-0` | `0` | `border-t-4` | `4` |
| `border-x` | `1` | `border-t-8` | `8` |
| `border-x-2` | `2` | `border-r-0` | `0` |
| `border-x-4` | `4` | `border-r` | `1` |
| `border-x-8` | `8` | `border-r-2` | `2` |
| `border-y-0` | `0` | `border-r-4` | `4` |
| `border-y` | `1` | `border-r-8` | `8` |
| `border-y-2` | `2` | `border-b-0` | `0` |
| `border-y-4` | `4` | `border-b` | `1` |
| `border-y-8` | `8` | `border-b-2` | `2` |
| `border-s-0` | `0` | `border-b-4` | `4` |
| `border-s` | `1` | `border-b-8` | `8` |
| `border-s-2` | `2` | `border-l-0` | `0` |
| `border-s-4` | `4` | `border-l` | `1` |
| `border-s-8` | `8` | `border-l-2` | `2` |
| `border-e-0` | `0` | `border-l-4` | `4` |
| `border-e` | `1` | `border-l-8` | `8` |
| `border-e-2` | `2` | | |

---

## §N · Stroke width — `stroke-width`

Collection `stroke-width` — **11 variables**

Icon stroke thickness (lucide default = 1.5).

| token | value | token | value |
| --- | --- | --- | --- |
| `stroke-0,5` | `0.5` | `stroke-2` | `2` |
| `stroke-0,75` | `0.75` | `stroke-2,25` | `2.25` |
| `stroke-1` | `1` | `stroke-2,5` | `2.5` |
| `stroke-1,25` | `1.25` | `stroke-2,75` | `2.75` |
| `stroke-1,5` | `1.5` | `stroke-3` | `3` |
| `stroke-1,75` | `1.75` | | |

---

## §O · Opacity — `opacity`

Collection `opacity` — **21 variables**

| token | value | token | value |
| --- | --- | --- | --- |
| `opacity-0` | `0` | `opacity-55` | `55` |
| `opacity-5` | `5` | `opacity-60` | `60` |
| `opacity-10` | `10` | `opacity-65` | `65` |
| `opacity-15` | `15` | `opacity-70` | `70` |
| `opacity-20` | `20` | `opacity-75` | `75` |
| `opacity-25` | `25` | `opacity-80` | `80` |
| `opacity-30` | `30` | `opacity-85` | `85` |
| `opacity-35` | `35` | `opacity-90` | `90` |
| `opacity-40` | `40` | `opacity-95` | `95` |
| `opacity-45` | `45` | `opacity-100` | `100` |
| `opacity-50` | `50` | | |

---

## §P · Raw tokens — `tokens`

Collection `tokens` — **87 variables**

Base numeric values used internally by the system.

| token | value | token | value |
| --- | --- | --- | --- |
| `-0,8` | `-0.8` | `65` | `65` |
| `-0,4` | `-0.4` | `70` | `70` |
| `0` | `0` | `72` | `72` |
| `0,4` | `0.4` | `75` | `75` |
| `0,5` | `0.5` | `80` | `80` |
| `0,75` | `0.75` | `85` | `85` |
| `0,8` | `0.8` | `90` | `90` |
| `1` | `1` | `95` | `95` |
| `1,25` | `1.25` | `96` | `96` |
| `1,5` | `1.5` | `100` | `100` |
| `1,6` | `1.6` | `112` | `112` |
| `1,75` | `1.75` | `128` | `128` |
| `2` | `2` | `144` | `144` |
| `2,25` | `2.25` | `160` | `160` |
| `2,5` | `2.5` | `176` | `176` |
| `2,75` | `2.75` | `192` | `192` |
| `3` | `3` | `200` | `200` |
| `4` | `4` | `208` | `208` |
| `5` | `5` | `224` | `224` |
| `6` | `6` | `240` | `240` |
| `8` | `8` | `256` | `256` |
| `10` | `10` | `288` | `288` |
| `12` | `12` | `300` | `300` |
| `14` | `14` | `320` | `320` |
| `15` | `15` | `384` | `384` |
| `16` | `16` | `400` | `400` |
| `18` | `18` | `448` | `448` |
| `20` | `20` | `500` | `500` |
| `24` | `24` | `512` | `512` |
| `25` | `25` | `576` | `576` |
| `28` | `28` | `600` | `600` |
| `30` | `30` | `640` | `640` |
| `32` | `32` | `672` | `672` |
| `35` | `35` | `700` | `700` |
| `36` | `36` | `768` | `768` |
| `40` | `40` | `800` | `800` |
| `44` | `44` | `896` | `896` |
| `45` | `45` | `900` | `900` |
| `48` | `48` | `1024` | `1024` |
| `50` | `50` | `1152` | `1152` |
| `55` | `55` | `1280` | `1280` |
| `56` | `56` | `1536` | `1536` |
| `60` | `60` | `9999` | `9999` |
| `64` | `64` | | |

---

## Usage (Do / Don't)

**Do**
- Use the semantic tokens from §A: `bg-background`, `text-muted-foreground`, `bg-primary text-primary-foreground`, `border-border`.
- Always pair surface/foreground (on a `card` surface use `text-card-foreground`).
- Add components via the CLI: `npx shadcn@latest add <name>`, then override with `className` + `cn()`.
- Keep the `focus-visible` ring (blue, from `--ring`) and the `aria-*` attributes the primitives ship with.

**Don't**
- ❌ Hardcode colors: `bg-white`, `text-black`, `bg-blue-600`, `bg-[#2563eb]` → use `bg-primary`.
- ❌ Use spacing/radius values outside this token set (e.g. `p-[13px]`, `rounded-[7px]`).
- ❌ Add a new token that isn't in `variables-export.json` without updating the export first.

## Accessibility
- Contrast meets WCAG AA (using the §A token pairs → passes by default).
- Every control is keyboard-reachable and has a `focus-visible` ring.
- Icon-only buttons have an `aria-label`; form fields bind `<Label htmlFor>`; errors are conveyed with `aria-invalid` + text, not color alone.
- Respect `prefers-reduced-motion`.

<!-- generated from variables-export.json · total variables documented: 1804 -->
