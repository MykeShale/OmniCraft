---
name: ai-motion-graphics
description: "Use when the user wants to create an AI-generated motion graphics video from a beat sheet, produce explainer videos, generate scene-by-scene video content, or set up a motion graphics project pipeline. Covers setup, style locking, asset generation, VO, music, and Remotion assembly."
disable-model-invocation: true
argument-hint: "[project-name] [--csv path/to/beats.csv] [--phase setup|style|generate|vo|music|assemble|iterate] [--style vox|custom]"
---

# /ai-motion-graphics — AI Motion Graphics Pipeline

Guides the full production of an AI-generated motion graphics video: from a CSV beat sheet through asset generation, voiceover, music, and final assembly with Remotion.

## Prerequisites

Before starting, ensure:
```bash
npm install -D @higgsfield/cli        # local dev dependency
npx higgsfield auth login             # needs Higgsfield Pro
node --version                        # 18+ required
ffprobe -version                      # needed for duration measurement
```

---

## Phase 0: Setup & Scaffold

### Step 1: Beat Sheet CSV

Ask the user to create a Google Sheet (or any spreadsheet) with these columns:

```
Scene | Beat Label | VO Script | VO Length | Clip Duration | SHOT | MOTION | TEXT ON SCREEN | SFX | IMG PROMPT | VID PROMPT
```

**Column definitions:**
- **Scene** — sequential number (1, 2, 3...)
- **Beat Label** — short name (e.g., "The Deal", "The Price")
- **VO Script** — narration line for this beat
- **VO Length** — target VO duration in seconds (~140-155 wpm for documentary pace)
- **Clip Duration** — video clip length, must be >= VO Length, from model's allowed set (4/6/8s for Gemini Omni)
- **SHOT** — visual description: subject, environment, composition, depth layers, camera move
- **MOTION** — element animation details: what moves, entrances, exits, landing state
- **TEXT ON SCREEN** — bold headline caps to display (few words only — models garble long text)
- **SFX** — sound design cues (paper pops, stamps, ticks — NOT music or VO)
- **IMG PROMPT** — auto-assembled image prompt (formula: STYLE_IMAGE + SHOT + TEXT ON SCREEN)
- **VID PROMPT** — auto-assembled video prompt (formula: STYLE_VIDEO + ACTION + TEXT + SFX + AVOID)

Tell the user: **"Export your Google Sheet as CSV and save it to `docs/beats.csv` in your project root."**

### Step 2: Style Configuration

Ask the user to choose their visual style:

**Option A: Vox Documentary Collage (built-in preset)**

STYLE_IMAGE:
```
Use the attached style sheet for materials only — aged-print collage textures, halftone black-and-white cutout people with rough keylines and offset accent strokes, giant stat numbers, print grain. Do NOT copy the sheet's layout or its flatness: every clip is a deep 3D paper diorama — cutouts are physical layers separated in real space, strong shallow depth of field, foreground elements crossing close to the lens. The camera is an actor: it flies between layers, orbits, dives, whips, racks focus — one committed cinematic move per clip. Backgrounds change per clip, always within the sheet's palette. ALERT WASH means the entire frame floods to the hot accent tone in one beat. Motion: springs with overshoot, staggered entrances, ticking counters. Audio: sound design only — paper pops, whooshes, stamps, ticks. No music. No voice-over.
```

STYLE_VIDEO:
```
STYLE: hand-cut documentary paper-collage animation — aged newsprint diorama with layers at visibly different depths, true parallax on every camera move, black-and-white halftone photo cutouts with rough white keylines and offset hot-red marker strokes, desaturated archival palette with one hot signal red accent, condensed bold headline caps, print grain, torn paper edges, flat matte paper surfaces, never glossy CG 3D. Match the look of the attached frame exactly and keep it consistent through the whole shot.
```

AVOID:
```
no flat single-plane composition, no static locked-off camera, no glossy plastic CG (depth stays papercraft), no full-color midground portraits (people stay halftone black-and-white), no warped or gibberish text, no invented logos, no watermarks, no music, no soundtrack, no voice-over, no narration, no lyrics
```

**Option B: Custom Style**

Ask the user to describe their desired visual style in natural language. Then generate three locked blocks from their description:

1. **STYLE_IMAGE** — drives still generation. Must describe: materials/textures, composition rules, depth/layering, camera behavior, motion style, audio style.
2. **STYLE_VIDEO** — drives video generation. Must describe: animation style, consistency instruction ("match the attached frame exactly"), key visual rules.
3. **AVOID** — negative prompts. Must include: composition failures to prevent, style drift guards, media to exclude (no music/VO baked in).

Present the blocks to the user for approval before proceeding. These blocks are LOCKED for the entire project — only SHOT/SFX change per scene.

### Step 3: Voice Selection

Ask the user to choose a voice for narration. Provide the Higgsfield TTS options:
- **ElevenLabs variant** — requires a voice_id and voice_type (preset or cloned)
- If the user has a preferred ElevenLabs voice, get the voice_id
- Default suggestion: a cinematic narrator voice appropriate for the content

### Step 4: Scaffold the Project

Read `docs/beats.csv` and auto-create the entire folder structure:

```
project/
├── docs/
│   └── beats.csv                      # User's beat sheet (already placed)
├── config/
│   └── style.json                     # STYLE_IMAGE, STYLE_VIDEO, AVOID, voice config
├── assets/
│   └── style-sheet/                   # Master reference board goes here
├── scenes/                            # One folder per beat
│   └── scene-NN-slug/                 # e.g., scene-01-the-deal
│       └── (still.png, clip.mp4, vo.mp3 will go here)
├── audio/                             # Music track(s)
├── remotion/
│   ├── scenes.ts                      # Scene configuration (generated)
│   └── Composition.tsx                # Main composition (generated)
└── public/                            # Symlinks for Remotion staticFile()
    ├── scenes -> ../scenes
    └── audio -> ../audio
```

For each row in the CSV:
1. Slugify the Beat Label (lowercase, hyphens)
2. Create `scenes/scene-{NN}-{slug}/`
3. Generate `remotion/scenes.ts` with placeholder entries (voDuration set to VO Length from CSV)
4. Generate `remotion/Composition.tsx` with the standard assembly pattern
5. Create symlinks in `public/`

Save style config to `config/style.json`:
```json
{
  "STYLE_IMAGE": "...",
  "STYLE_VIDEO": "...",
  "AVOID": "...",
  "voice": {
    "voice_id": "...",
    "voice_type": "preset",
    "variant": "elevenlabs"
  },
  "models": {
    "image": "nano_banana_pro",
    "video": "gemini_omni",
    "video_fallback": "seedance_2_0",
    "tts": "text2speech_v2",
    "music": "sonilo_music"
  }
}
```

---

## Phase 1: Style Sheet Generation

Generate the master reference board image. This is attached to EVERY generation as the visual source of truth.

```bash
npx higgsfield generate create nano_banana_pro \
  --prompt "<STYLE_IMAGE block appended with: Generate a master style sheet reference board showing the visual language — palette, textures, type specimens, component examples, mini-scene examples.>" \
  --aspect_ratio "16:9" \
  --resolution "2k" \
  --wait --wait-timeout 10m
```

Download to `assets/style-sheet/style-sheet.png`. Show to user for approval. Iterate until clean. Do NOT proceed until the style sheet is approved — everything inherits its quality.

---

## Phase 2: Test One Scene End-to-End

Pick the most visually complex beat. Generate its still and clip to validate the prompt shape.

### Generate still
```bash
npx higgsfield generate create <image_model> \
  --prompt "<STYLE_IMAGE>\n\nSHOT:\n<SHOT from CSV>\n\nTEXT ON SCREEN: <TEXT from CSV>" \
  --image-references assets/style-sheet/style-sheet.png \
  --aspect_ratio "16:9" \
  --resolution "2k" \
  --wait --wait-timeout 10m
```

### Generate clip
```bash
npx higgsfield generate create <video_model> \
  --prompt "<STYLE_VIDEO>\n\nACTION: <MOTION from CSV>\n\nTEXT ON SCREEN: <TEXT>\n\nSFX: <SFX from CSV>\n\nAVOID: <AVOID block>" \
  --image-references scenes/scene-NN/still.png \
  --aspect_ratio "16:9" \
  --resolution "720p" \
  --duration "<clip_duration>" \
  --wait --wait-timeout 15m
```

Show results to user. If style doesn't hold, tune SHOT/MOTION wording only — NEVER edit STYLE or AVOID. Once one scene is approved, lock the prompt shape.

**Model notes:**
- **Gemini Omni** uses `--image-references` for the still
- **Seedance 2.0** uses `--start-image` instead, and supports `--generate_audio true/false`
- If Gemini Omni's content filter blocks a scene (faces, manipulation imagery), switch to Seedance

---

## Phase 3: Batch Generate All Assets

Process scenes in order. Batch in groups of 3 (Higgsfield Pro concurrency limit).

### 3.1 Stills (all scenes with Source=GENERATE)
For each new scene, generate still using the locked prompt structure. Save as `scenes/scene-NN-slug/still.png`.

### 3.2 Clips (all scenes)
For each scene, generate clip from its still. Save as `scenes/scene-NN-slug/clip.mp4`.

For scenes with Source=REUSE, copy or reference the existing clip path. Do not regenerate.

### 3.3 Voiceover (all scenes)
```bash
npx higgsfield generate create text2speech_v2 \
  --prompt "<VO Script from CSV>" \
  --voice_id "<from config>" \
  --voice_type "<from config>" \
  --variant "<from config>" \
  --wait --wait-timeout 5m
```

Save as `scenes/scene-NN-slug/vo.mp3`.

**VO script rules for TTS:**
- ~140-155 wpm for documentary pace
- Periods = hard pause, ellipses (...) = breath pause, commas = slight pause
- Avoid em dashes — use periods or commas instead
- Single-word sentences with periods create excessive pauses — use commas for lists
- Test word count against target duration before generating

After downloading each VO, measure actual duration:
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 scenes/scene-NN-slug/vo.mp3
```

Update `remotion/scenes.ts` with real measured durations (not target durations).

### 3.4 Music
```bash
npx higgsfield generate create sonilo_music \
  --prompt "<music description from user>" \
  --duration <total_video_length_seconds> \
  --wait --wait-timeout 10m
```

Save as `audio/music.m4a`. Duration must cover the full video length.

---

## Phase 4: Remotion Assembly

### scenes.ts pattern
```typescript
export const scenes = [
  {
    id: "scene-01",
    name: "Beat Label",
    clip: "scenes/scene-01-slug/clip.mp4",
    vo: "scenes/scene-01-slug/vo.mp3",
    voDuration: 4.1, // MEASURED duration from ffprobe
    source: "new",   // or "reuse:original-folder"
  },
  // ...
];

export const FPS = 30;
export function secondsToFrames(s: number): number {
  return Math.ceil(s * FPS);
}
export const totalDurationInFrames = scenes.reduce(
  (sum, s) => sum + secondsToFrames(s.voDuration), 0
);
```

### Composition.tsx pattern
Key design rules:
- **No per-scene transitions** — no fade-to-black between scenes (creates blocky feel)
- **One PieceFade** — single 0.5s black fade at very start and end only
- **Music as continuous track** — `<Audio>` at top level with volume fade in/out (0.25 volume)
- **Clip SFX at low volume** — `<OffthreadVideo volume={0.3}>` for subtle baked-in AI sound effects
- **objectFit: "cover"** — prevents letterboxing

Render from **Remotion Studio UI** (not CLI) — CLI has issues with symlinked paths.

---

## Phase 5: Iteration & Polish

### Common prompt fixes

**Elements morphing/changing mid-clip:**
- Add "all elements remain exactly as they are, no morphing, no transforming" to ACTION
- Add "no morphing of any element, no changing details, no transforming" to AVOID
- Reduce motion complexity — less movement = less AI struggle

**Camera reverses direction:**
- Add "one direction only — forward push, no zoom-out, no reversal" to ACTION
- Add "no zoom-out, no camera reversal, no pull-back" to AVOID

**Wrong element animates:**
- Name every element by exact position
- Explicitly list which elements should NOT animate
- Add specific negatives to AVOID

**Style drifts mid-clip:**
- Always include STYLE_VIDEO in video prompt even with reference image
- "Match the look of the attached frame exactly"

**VO quality issues (muffled/unclear):**
- Simply regenerate — TTS quality varies between runs

**VO pacing wrong:**
- Adjust punctuation: periods for hard pauses, ellipses for breaths
- Add "..." between phrases that need separation

### Scene redo workflow
1. Generate new still with refined SHOT prompt
2. Generate new clip from new still
3. Backup old files: `still.png` -> `still-v1.png`, `clip.mp4` -> `clip-v1.mp4`
4. Download new assets as `still.png` / `clip.mp4`
5. No code changes needed if paths haven't changed

### Adding new beats mid-production
1. Write new beat(s) following existing patterns
2. Add row(s) to CSV
3. Create new scene folder(s)
4. Generate still + clip + VO
5. Update `scenes.ts` with new entries
6. Regenerate music if total duration changed
7. Re-render

---

## The Core Rule

**STYLE once, ACTION per clip.** Never edit the locked STYLE or AVOID blocks mid-run. Only change SHOT/MOTION/SFX per scene. That consistency is what makes N clips look like one film.

---

## Movement x Duration Tradeoff

- **Longer clip + simpler movement** = cleanest result
- **Wilder movement + shorter clip** = acceptable (cut to good frames)
- **Wilder movement + longer clip** = expect artifacts

**Generate, then cut.** Expect to regenerate. That's the workflow, not failure.

---

## CLI Quick Reference

| Action | Command |
|--------|---------|
| Image (still) | `npx higgsfield generate create nano_banana_pro --prompt "..." --image-references <style-sheet> --aspect_ratio "16:9" --resolution "2k" --wait` |
| Video (Gemini) | `npx higgsfield generate create gemini_omni --prompt "..." --image-references <still> --aspect_ratio "16:9" --resolution "720p" --duration "8" --wait` |
| Video (Seedance) | `npx higgsfield generate create seedance_2_0 --prompt "..." --start-image <still> --aspect_ratio "16:9" --resolution "720p" --duration "8" --generate_audio true --wait` |
| VO (TTS) | `npx higgsfield generate create text2speech_v2 --prompt "..." --voice_id "<id>" --voice_type "preset" --variant "elevenlabs" --wait` |
| Music | `npx higgsfield generate create sonilo_music --prompt "..." --duration <secs> --wait` |
| Measure duration | `ffprobe -v error -show_entries format=duration -of csv=p=0 <file>` |
