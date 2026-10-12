#!/usr/bin/env python3
"""Regenerate references/DESIGN.md + assets/* from references/variables-export.json.

Faithful 1:1 — documents all 1804 variables and asserts the exact count.
Run from anywhere:  python3 scripts/generate-tokens.py
"""
import json, math, os

HERE = os.path.dirname(os.path.abspath(__file__))   # .../scripts
SKILL_DIR = os.path.dirname(HERE)                    # skill root
SRC = os.path.join(SKILL_DIR, "references", "variables-export.json")
OUT = os.path.join(SKILL_DIR, "references", "DESIGN.md")
ASSET_CSS = os.path.join(SKILL_DIR, "assets", "globals.css")
ASSET_UTILS = os.path.join(SKILL_DIR, "assets", "lib", "utils.ts")
ASSET_CJSON = os.path.join(SKILL_DIR, "assets", "components.json")

d = json.load(open(SRC))
vars_all = d["variables"]

# ---------- helpers ----------
def fmtnum(x):
    if isinstance(x, str):
        return x
    if abs(x - round(x)) < 1e-9:
        return str(int(round(x)))
    return f"{round(x, 4):g}"

def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def oklch(r, g, b, a=1.0):
    R, G, B = lin(r * 255), lin(g * 255), lin(b * 255)
    l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B
    m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B
    s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B
    l_, m_, s_ = l ** (1/3), m ** (1/3), s ** (1/3)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    A = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    Bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.sqrt(A * A + Bb * Bb)
    H = math.degrees(math.atan2(Bb, A)) % 360
    Ls = f"{round(L, 3):g}"
    if C <= 0.0005:
        base = f"{Ls} 0 0"
    else:
        base = f"{Ls} {round(C, 3):g} {round(H, 1):g}"
    if a < 0.999:
        return f"oklch({base} / {round(a * 100):g}%)"
    return f"oklch({base})"

def cell(var, mode):
    val = var["valuesByMode"][mode]["value"]
    if var["resolvedType"] == "COLOR":
        return oklch(val["r"], val["g"], val["b"], val.get("a", 1))
    return fmtnum(val)

# index variables by collection (preserve file order)
by_coll = {}
for v in vars_all:
    by_coll.setdefault(v["collectionName"], []).append(v)

coll_meta = {c["name"]: c for c in d["collections"]}
written = 0  # count of variable rows emitted
out = []
def w(s=""):
    out.append(s)

# ---------- header ----------
w("# DESIGN.md — Design Tokens (Source of Truth)")
w()
w("Design system for a **Next.js (App Router) + shadcn/ui + Tailwind CSS v4** project.")
w("Every value here is extracted 1:1 from **`variables-export.json`** (Figma export `lazyyysync-variables-v1`).")
w("All **1,804 variables across 16 collections** — nothing added, nothing dropped, nothing altered except color format converted to OKLCH.")
w()
w("> **Golden rule:** use only the tokens defined here — **never hardcode** raw color/spacing/radius values (e.g. `bg-white`, `bg-blue-600`, `p-[13px]`).")
w("> The theme is **blue-primary**: `--primary` is blue (blue-600), not neutral; charts are a monochromatic blue ramp.")
w()
w("## Principles")
w("1. **Token-first** — every value comes from a CSS variable / Tailwind token in this file, never a literal.")
w("2. **CSS-first config (Tailwind v4)** — the theme lives in `app/globals.css` via `@theme inline`; there is no `tailwind.config` for colors.")
w("3. **OKLCH** — all colors are written as `oklch()` (converted from the RGB in the export; minor rounding — the authoritative source is Figma).")
w("4. **Surface/foreground pairing** — always pair a surface with its matching foreground to guarantee contrast.")
w("5. **Light ↔ Dark** — theme tokens carry both mode values; design once, support both modes.")
w()
w("---")
w()

# ---------- §A shadcn/ui theme (light + dark only) ----------
SH_ORDER = ["background","foreground","card","card-foreground","popover","popover-foreground",
    "primary","primary-foreground","secondary","secondary-foreground","muted","muted-foreground",
    "accent","accent-foreground","destructive","border","input","ring",
    "chart-1","chart-2","chart-3","chart-4","chart-5",
    "sidebar","sidebar-foreground","sidebar-primary","sidebar-primary-foreground",
    "sidebar-accent","sidebar-accent-foreground","sidebar-border","sidebar-ring",
    "background-color","semantic-background","semantic-border","semantic-foreground"]
sh = {v["name"]: v for v in by_coll["shadcn/ui"]}
assert set(sh) == set(SH_ORDER), set(sh) ^ set(SH_ORDER)

w("## §A · shadcn/ui theme — 35 tokens (light + dark)")
w()
w("The `shadcn/ui` collection has 4 modes in the export: **light mode, dark mode, primary, secondary**.")
w("This section maps only **light + dark** (what `app/globals.css` actually uses) — the `primary`/`secondary` modes are optional brand themes that exist in the export but are not mapped here.")
w()
w("| token | utility | :root (light) | .dark |")
w("| --- | --- | --- | --- |")
for name in SH_ORDER:
    v = sh[name]
    util = f"`{name}`"
    w(f"| `--{name}` | {util} | `{cell(v,'light mode')}` | `{cell(v,'dark mode')}` |")
    written += 1
w()
# build the globals.css content once, reuse for DESIGN.md §A and assets/globals.css
css = []
css.append('@import "tailwindcss";')
css.append('@import "tw-animate-css";')
css.append("")
css.append("@custom-variant dark (&:is(.dark *));")
css.append("")
css.append(":root {")
for name in SH_ORDER:
    css.append(f"  --{name}: {cell(sh[name],'light mode')};")
css.append("}")
css.append("")
css.append(".dark {")
for name in SH_ORDER:
    css.append(f"  --{name}: {cell(sh[name],'dark mode')};")
css.append("}")
css.append("")
css.append("@theme inline {")
for name in SH_ORDER:
    css.append(f"  --color-{name}: var(--{name});")
css.append("}")
css.append("")
css.append("@layer base {")
css.append("  * { @apply border-border outline-ring/50; }")
css.append("  body { @apply bg-background text-foreground; }")
css.append("}")
GLOBALS_CSS = "\n".join(css) + "\n"

w("### globals.css")
w()
w("The block below is also written verbatim to **`assets/globals.css`** — copy it to `app/globals.css`.")
w()
w("```css")
for line in css:
    w(line)
w("```")
w()
w("---")
w()

# ---------- generic table emitter for a collection ----------
def emit_collection(coll_name, title, intro=None):
    global written
    vs = by_coll[coll_name]
    meta = coll_meta[coll_name]
    modes = meta["modes"]
    w(f"## {title}")
    w()
    w(f"Collection `{coll_name}` — **{len(vs)} variables**" + (f" · {len(modes)} modes" if len(modes) > 1 else ""))
    if intro:
        w()
        w(intro)
    w()
    if len(modes) > 1:
        header = "| token | " + " | ".join(m["name"] for m in modes) + " |"
        sep = "| --- |" + " --- |" * len(modes)
        w(header); w(sep)
        for v in vs:
            cells = " | ".join(f"`{cell(v, m['name'])}`" for m in modes)
            w(f"| `{v['name']}` | {cells} |")
            written += 1
    else:
        mode = modes[0]["name"]
        # two-column layout to keep tall numeric tables compact
        w("| token | value | token | value |")
        w("| --- | --- | --- | --- |")
        rows = vs
        half = (len(rows) + 1) // 2
        left, right = rows[:half], rows[half:]
        for i in range(half):
            lv = left[i]
            lcell = f"| `{lv['name']}` | `{cell(lv, mode)}` "
            if i < len(right):
                rv = right[i]
                rcell = f"| `{rv['name']}` | `{cell(rv, mode)}` |"
            else:
                rcell = "| | |"
            w(lcell + rcell)
        written += len(vs)
    w()
    w("---")
    w()

# §B color primitives
emit_collection("tw/colors", "§B · Color primitives — `tw/colors`",
    "Tailwind color palette (single mode) — the primitives behind the theme tokens.")
emit_collection("rdx/colors", "§C · Color primitives — `rdx/colors` (light + dark)",
    "Radix color scales — primitives for state / elevation.")

# radius
emit_collection("border-radius", "§D · Border radius — `border-radius`",
    "Values in px (these match Tailwind v4's default radius scale).")

# typography
emit_collection("font", "§E · Typography — `font`",
    "family · size (px) · weight · leading (px) · tracking · style")

# spacing & sizing
emit_collection("space", "§F · Spacing — `space`")
emit_collection("padding", "§G · Padding — `padding`")
emit_collection("margin", "§H · Margin — `margin`")
emit_collection("gap", "§I · Gap — `gap`")
emit_collection("height", "§J · Height — `height`")
emit_collection("max-height", "§K · Max-height — `max-height`")
emit_collection("max-width", "§L · Max-width — `max-width`")

# borders & strokes
emit_collection("border-width", "§M · Border width — `border-width`")
emit_collection("stroke-width", "§N · Stroke width — `stroke-width`", "Icon stroke thickness (lucide default = 1.5).")

# opacity
emit_collection("opacity", "§O · Opacity — `opacity`")

# raw tokens
emit_collection("tokens", "§P · Raw tokens — `tokens`", "Base numeric values used internally by the system.")

# ---------- footer: Do/Don't + a11y ----------
w("## Usage (Do / Don't)")
w()
w("**Do**")
w("- Use the semantic tokens from §A: `bg-background`, `text-muted-foreground`, `bg-primary text-primary-foreground`, `border-border`.")
w("- Always pair surface/foreground (on a `card` surface use `text-card-foreground`).")
w("- Add components via the CLI: `npx shadcn@latest add <name>`, then override with `className` + `cn()`.")
w("- Keep the `focus-visible` ring (blue, from `--ring`) and the `aria-*` attributes the primitives ship with.")
w()
w("**Don't**")
w("- ❌ Hardcode colors: `bg-white`, `text-black`, `bg-blue-600`, `bg-[#2563eb]` → use `bg-primary`.")
w("- ❌ Use spacing/radius values outside this token set (e.g. `p-[13px]`, `rounded-[7px]`).")
w("- ❌ Add a new token that isn't in `variables-export.json` without updating the export first.")
w()
w("## Accessibility")
w("- Contrast meets WCAG AA (using the §A token pairs → passes by default).")
w("- Every control is keyboard-reachable and has a `focus-visible` ring.")
w("- Icon-only buttons have an `aria-label`; form fields bind `<Label htmlFor>`; errors are conveyed with `aria-invalid` + text, not color alone.")
w("- Respect `prefers-reduced-motion`.")
w()
w(f"<!-- generated from variables-export.json · total variables documented: {written} -->")

# ---------- assert exact count ----------
assert written == 1804, f"EXPECTED 1804 variables, got {written}"
assert written == len(vars_all), f"mismatch with source: {written} vs {len(vars_all)}"

open(OUT, "w").write("\n".join(out) + "\n")
print(f"OK — wrote {OUT} with exactly {written} variables documented")

# ---------- assets (scaffolded from the same tokens) ----------
open(ASSET_CSS, "w").write(GLOBALS_CSS)
print(f"OK — wrote {ASSET_CSS}")

UTILS_TS = '''import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
'''
open(ASSET_UTILS, "w").write(UTILS_TS)
print(f"OK — wrote {ASSET_UTILS}")

COMPONENTS_JSON = {
    "$schema": "https://ui.shadcn.com/schema.json",
    "style": "new-york",
    "rsc": True,
    "tsx": True,
    "tailwind": {
        "config": "",
        "css": "app/globals.css",
        "baseColor": "neutral",
        "cssVariables": True,
        "prefix": "",
    },
    "iconLibrary": "lucide",
    "aliases": {
        "components": "@/components",
        "utils": "@/lib/utils",
        "ui": "@/components/ui",
        "lib": "@/lib",
        "hooks": "@/hooks",
    },
}
open(ASSET_CJSON, "w").write(json.dumps(COMPONENTS_JSON, indent=2) + "\n")
print(f"OK — wrote {ASSET_CJSON}")
