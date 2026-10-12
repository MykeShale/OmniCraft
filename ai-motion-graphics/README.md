# AI Motion Graphics — Claude Code Skill

A Claude Code skill that guides you through producing AI-generated motion graphics videos end-to-end: from a beat sheet CSV through asset generation, voiceover, music, and final assembly with Remotion.

## What it does

- Reads a CSV beat sheet and scaffolds your entire project (folders, Remotion config, style config)
- Locks a visual style once, then generates consistent scenes using that style
- Generates stills, video clips, voiceover, and music via Higgsfield CLI
- Assembles everything into a final video with Remotion
- Guides iteration and prompt refinement when things need fixing

Comes with a **Vox documentary collage** style preset built in, or define your own custom style.

## Install

```bash
mkdir -p ~/.claude/skills/ai-motion-graphics
curl -sL https://raw.githubusercontent.com/docusphere/claude-skill-motion-graphics/main/SKILL.md \
  -o ~/.claude/skills/ai-motion-graphics/SKILL.md
```

Or clone and copy:

```bash
git clone https://github.com/docusphere/claude-skill-motion-graphics.git
cp claude-skill-motion-graphics/SKILL.md ~/.claude/skills/ai-motion-graphics/SKILL.md
```

## Prerequisites

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Higgsfield CLI](https://www.higgsfield.ai/) (Pro plan required)
- [Remotion](https://www.remotion.dev/)
- Node.js 18+
- FFmpeg / ffprobe

```bash
npm install -D @higgsfield/cli
npx higgsfield auth login
```

## Usage

In Claude Code:

```
/ai-motion-graphics my-project
```

The skill walks you through:

1. **Setup** — Create a Google Sheet with your beats, export as CSV, place at `docs/beats.csv`
2. **Style** — Pick the Vox preset or describe your own visual style
3. **Generate** — Stills, clips, VO, and music scene by scene
4. **Assemble** — Remotion stitches everything together
5. **Iterate** — Guided fixes for common issues (morphing, camera, TTS pacing)

### CSV columns

Your Google Sheet / CSV needs these columns:

| Column | Description |
|--------|-------------|
| Scene | Sequential number (1, 2, 3...) |
| Beat Label | Short name (e.g., "The Deal") |
| VO Script | Narration line |
| VO Length | Target duration in seconds |
| Clip Duration | Video clip length (>= VO length) |
| SHOT | Visual description |
| MOTION | Animation / camera description |
| TEXT ON SCREEN | Bold headline text |
| AUDIO | Sound design cues |
| Source | GENERATE or REUSE |
| Status | Tracking (empty, done) |

### Jump to a phase

```
/ai-motion-graphics --phase generate
/ai-motion-graphics --phase assemble
/ai-motion-graphics --phase iterate
```

## License

MIT
