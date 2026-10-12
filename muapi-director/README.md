<div align="center">

<h1 align="center">Vox AI Motion Graphics Generator</h1>
<h3 align="center">Turn any topic into a finished Vox-style paper-collage explainer video</h3>

<p align="center">
  <img src="https://img.shields.io/badge/🐍Python-3.10+-00d9ff?style=for-the-badge&logo=python&logoColor=white&labelColor=1a1a2e">
  <img src="https://img.shields.io/badge/🎬ffmpeg-Powered-ff6b6b?style=for-the-badge&logo=ffmpeg&logoColor=white&labelColor=1a1a2e">
  <img src="https://img.shields.io/badge/License-MIT-4ecdc4?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=1a1a2e">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Agent_Skill-Claude_Code_·_Codex-7c3aed?style=for-the-badge&logoColor=white&labelColor=1a1a2e">
  <img src="https://img.shields.io/badge/One_Key-Setup-FFC107?style=for-the-badge&logoColor=white&labelColor=1a1a2e">
</p>

</div>

---

<p align="center">
  <a href="https://www.youtube.com/watch?v=chK_pnV1wqQ">
    <img src="https://i.ytimg.com/vi/chK_pnV1wqQ/maxresdefault.jpg" alt="Vox AI Motion Graphics Generator video" width="640">
  </a>
</p>

<p align="center">
  <a href="https://www.youtube.com/watch?v=chK_pnV1wqQ"><b>📺 Watch the Vox AI Motion Graphics Generator in action →</b></a>
</p>

### 🚨 The problem with making explainer videos today:
- ❌ **Fragmented workflow** — separate tools for scripting, image gen, animation, voice-over, music, and captions
- ❌ **No narrative structure** — raw text-to-video models don't understand story arcs, hooks, or pacing
- ❌ **Inconsistent look** — the collage aesthetic drifts from shot to shot
- ❌ **Hours of manual editing** — stitching, ducking music, and burning captions by hand

### 💡 The solution:
🎬 **Screenwriter**, **Collage Artist**, **Animator**, and **Editor** — all in one automated pipeline.

Type one topic. The agent writes the story beats, renders each beat as a torn-paper collage poster, animates it, adds a narrator voice-over, music, and burned-in captions — then stitches everything into a finished `final.mp4`. You stay in control with just **two approval gates**: the story beat map and the visual theme.

---

<p align="center">
  <a href="https://github.com/Anil-matcha/awesome-generative-ai-apps">
    <img src="https://img.shields.io/badge/Part%20of-Awesome%20Generative%20AI%20Apps-FFD700?style=for-the-badge&logo=github&logoColor=black" alt="Awesome Generative AI Apps">
  </a>
</p>

> 🎨 **[Explore 50+ more open-source AI apps →](https://github.com/Anil-matcha/awesome-generative-ai-apps)**

## 🎥 Demo

https://github.com/user-attachments/assets/3db826d1-3271-4e8a-b4d0-a843013e67c7

> One topic in, a fully narrated & captioned Vox-style collage video out. ([download the demo](https://raw.githubusercontent.com/Anil-matcha/vox-ai-motion-graphics-generator/main/assets/demo.mp4))

> *"Make me a 15-second Vox-style collage video on the history of coffee."* → a styled `final.mp4`, fully narrated and captioned.

### 📽️ Generated Showcase Videos (Playable Demo Videos)

Below are end-to-end videos generated using the pipeline:

<div align="center">

https://github.com/user-attachments/assets/d9b3e85b-2f4a-4c64-9692-747f085dfd28

<b>▶ "History of Coffee (Ethiopia 850 AD)" · 5s (B-roll Film)</b>

<br/><br/>

https://github.com/user-attachments/assets/6628b678-78ff-481a-bc39-d7098ec1f2fe

<b>▶ "Cold Brew Product Ad" · 5s (C-roll Film)</b>

</div>

<br/>

| Mode | Film Title | Topic / Subject | Playable Video Link | Keyframe Poster | Motion Model | Narration Voice |
|---|---|---|---|---|---|---|
| **B-roll** | **☕ History of Coffee** | *Ethiopia 850 AD* | [Play Video](https://github.com/user-attachments/assets/d9b3e85b-2f4a-4c64-9692-747f085dfd28) (`out/demo/final.mp4`) | `out/demo/keyframes/kf_1a.jpg` | `veo3.1-image-to-video` | MiniMax TTS (`Q19bea09caa6IRAeW7`) |
| **C-roll** | **🍾 Cold Brew Product Ad** | *Artisanal Cold Brew Bottle* | [Play Video](https://github.com/user-attachments/assets/6628b678-78ff-481a-bc39-d7098ec1f2fe) (`out/demo-croll/final.mp4`) | `out/demo-croll/keyframes/kf_1.jpg` | `veo3.1-image-to-video` | MiniMax TTS (`Q19bea09caa6IRAeW7`) |

> 🎬 **Generated Assets Summary:**
> - ☕ **B-roll (History of Coffee):**
>   - 📹 **Video:** [Play Video](https://github.com/user-attachments/assets/d9b3e85b-2f4a-4c64-9692-747f085dfd28) (`out/demo/final.mp4`) \| 🖼️ **Poster:** `out/demo/keyframes/kf_1a.jpg` \| 📹 **Clip:** `out/demo/clips/clip_1a.mp4` \| 🎙️ **Voice:** `out/demo/audio/narr_1.mp3` \| 🎵 **BGM:** `out/demo/audio/bgm.mp3`
> - 🍾 **C-roll (Cold Brew Product Anchor):**
>   - 📹 **Video:** [Play Video](https://github.com/user-attachments/assets/6628b678-78ff-481a-bc39-d7098ec1f2fe) (`out/demo-croll/final.mp4`) \| 📸 **Anchor Photo:** `out/demo-croll/anchor_photo.jpg` \| 🖼️ **Poster:** `out/demo-croll/keyframes/kf_1.jpg` \| 📹 **Clip:** `out/demo-croll/clips/clip_1.mp4` \| 🎙️ **Voice:** `out/demo-croll/audio/narr_1.mp3` \| 🎵 **BGM:** `out/demo-croll/audio/bgm.mp3`

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🎨 The Look](#-the-look)
- [🔄 How It Works](#-how-it-works)
- [🧩 Models](#-models)
- [🚀 Quick Start](#-quick-start)
- [🛠️ Project Structure](#️-project-structure)
- [🔗 Related Projects](#-related-projects)

---

## ✨ Key Features

- **3 Input Modalities (A-roll, B-roll, C-roll)**:
  - **B-roll (Topic → Film)** — a single one-line prompt produces a complete, captioned, narrated video
  - **A-roll (Talking-Head Video → Collage)** — segment a presenter video with ASR (`openai-whisper`) and re-style into paper-collage while keeping real face, gestures, and lip-sync
  - **C-roll (Single Photo / Product → Anchored Collage)** — cut out a selfie or product shot as a photographic sticker and build animated collage posters around it
- **Authentic Vox collage aesthetic** — torn paper, cutouts, tape, halftone dots, newspaper clippings, bold flat color, big headlines
- **Story-first** — picks a narrative arc (timeline, problem-agitate-solution, how-it-works…) and writes a hook-led beat map before generating anything
- **Style bake-off** — renders the same beat in 3–4 themes so you pick the look before committing
- **Living-poster motion** — animates each collage keyframe into dynamic motion with Google Veo 3.1
- **Voice + music + captions** — narration (TTS or voice cloning), background music ducked under the voice, and burned-in captions, all automated
- **Two human gates, everything else automated** — approve the beat map, pick the theme; the pipeline handles the rest
- **Agent-native** — a self-contained skill any coding agent (Claude Code, Codex, Antigravity, …) can read and run
- **One API key + ffmpeg** — no cluster of accounts to wire up

---

## 🎨 The Look

The aesthetic is the modern editorial **paper-collage** popularized by Vox explainers and creators like Stav Zilber and rom1trs: hand-cut paper cutouts, torn edges, tape, halftone dots, newspaper clippings, bold flat colors per beat, and big cutout headlines — brought to life with dynamic motion, a narrator voice-over, music, and burned-in captions.

The collage look is born in the **image** step (each beat is a finished collage *poster*), and the **motion** is added after — so the DNA of the style is locked in before anything moves.

---

## 🔄 How It Works

A single topic, video, or photo flows through the pipeline driven by `beats.json` under `out/<project>/`:

```
topic / video / photo
  │
  ├─ 1. Beat Map        Pick a narrative arc → write beats.json          ◀── GATE 1: approve the beat map
  ├─ 2. Style Bake-Off  Render the same beat in 3–4 themes               ◀── GATE 2: pick the look
  ├─ 3. Keyframes       One collage poster per beat (nano-banana-2 / flux-dev)
  ├─ 4. Motion          Animate each poster into a clip (veo3.1-image-to-video)
  ├─ 5. Voice & Music   Narration (minimax-speech-2.6) + BGM (suno-create-music)
  ├─ 6. Assemble        Stitch clips, duck music, burn captions (ffmpeg)
  └─ final.mp4
```

### 3 Modalities:
- **B-roll (Topic → Film):** Topic in → script → keyframe posters → Veo 3.1 motion → TTS narration + Suno music → `final.mp4`.
- **A-roll (Talking-Head → Collage):** Presenter video in → Whisper ASR beat segmentation → video-edit restyling → audio remuxing → `final.mp4`.
- **C-roll (Photo / Product → Collage):** Product photo in → photographic sticker cutout → anchored collage posters → Veo 3.1 motion → cloned voice → `final.mp4`.

---

## 🧩 Models

| Pipeline Job | Model Endpoint |
| :--- | :--- |
| **Keyframes / Collage Posters** | `nano-banana-2` / `flux-dev` |
| **Motion / Animation** | `veo3.1-image-to-video` / `veo3.1-fast-image-to-video` / `runway-image-to-video` |
| **Re-style Talking-Head (A-roll)** | `gemini-omni-video-edit` / `veo3.1-image-to-video` |
| **Anchor Photo in Collage (C-roll)** | `nano-banana-2` / `flux-dev` |
| **Narration (TTS)** | `minimax-speech-2.6-turbo` |
| **Voice Cloning (C-roll)** | `minimax-voice-clone` |
| **Background Music** | `suno-create-music` |
| **Audio Transcription (A-roll ASR)** | `openai-whisper` |
| **Background Removal** | `remove-background` |

---

## 🚀 Quick Start

**1. Install local dependencies**
- **ffmpeg** + **ffprobe** (`brew install ffmpeg` on macOS / `choco install ffmpeg` on Windows)
- **Python 3** with **Pillow** (`pip install pillow`)

**2. Configure environment keys**
```bash
export MUAPI_API_KEY="your-api-key"     # image / video / voice / music models — key from muapi.ai
export OPENAI_API_KEY="your-openai-key"  # story planning & ASR
```

**3. Run Pipeline via Agent or CLI:**

#### Mode 1: B-roll (Topic → Film)
Ask your coding agent:
> *"Make me a 15-second Vox-style collage video introducing the history of coffee."*

Or run CLI scripts manually:
```bash
python scripts/style_bakeoff.py out/my-topic american-retro,swiss-modern,punk-zine
python scripts/keyframes.py out/my-topic
python scripts/clips.py out/my-topic
python scripts/audio.py out/my-topic
python scripts/assemble.py out/my-topic
```

#### Mode 2: A-roll (Talking-Head Video → Collage)
```bash
python scripts/asr_beats.py out/my-aroll source_presentation.mp4
python scripts/aroll_clips.py out/my-aroll
python scripts/aroll_assemble.py out/my-aroll
```

#### Mode 3: C-roll (Single Photo / Product → Anchored Collage)
```bash
python scripts/croll_keyframes.py out/my-croll
python scripts/clips.py out/my-croll
python scripts/audio.py out/my-croll
python scripts/assemble.py out/my-croll
```

---

## 🛠️ Project Structure

```
.
├── SKILL.md            # full agent workflow + approval gates
├── AGENTS.md           # entry point for coding agents (Claude Code, Codex, Antigravity)
├── README.zh.md        # Chinese documentation
├── scripts/            # one script per pipeline stage
│   ├── muapi_client.py    # MuAPI client wrapper
│   ├── provider.py        # task queue & status polling
│   ├── style_bakeoff.py   # multi-theme style candidates
│   ├── keyframes.py       # B-roll collage poster generator
│   ├── clips.py           # B-roll video animator (Veo 3.1)
│   ├── audio.py           # TTS narration & Suno music generator
│   ├── text_overlay.py    # subtitle captions & watermark generator
│   ├── assemble.py        # ffmpeg video assembly, ducking & composition
│   ├── asr_beats.py       # A-roll Whisper ASR beat cutter
│   ├── aroll_clips.py     # A-roll talking-head video restyler
│   ├── aroll_assemble.py  # A-roll clip & audio remuxer
│   └── croll_keyframes.py # C-roll photo sticker anchor generator
├── references/         # prompt guide, beat/story library, voices
└── examples/           # sample beats.json
```

This is an **agent skill** — Claude Code auto-loads it from `SKILL.md`; Codex and other agents follow `SKILL.md` via `AGENTS.md`. Just ask for a *"vox video"* or a *"collage video."*

---

## 🔗 Related Projects

- [Open-AI-Micro-Drama-Generator](https://github.com/Anil-matcha/Open-AI-Micro-Drama-Generator) — agentic AI micro-drama video generator
- [AI-B-roll](https://github.com/Anil-matcha/AI-B-roll) — auto-generate AI b-roll for your videos
- [Text-To-Video-AI](https://github.com/SamurAIGPT/Text-To-Video-AI) — generate full videos from text
- [AI-Youtube-Shorts-Generator](https://github.com/SamurAIGPT/AI-Youtube-Shorts-Generator) — auto-clip long videos into viral vertical shorts
- [awesome-ai-video-models](https://github.com/Anil-matcha/awesome-ai-video-models) — compare AI video models by API, price & speed

---

<div align="center">

⭐ **Star this repo if it helped you** — and [explore 50+ more open-source AI apps →](https://github.com/Anil-matcha/awesome-generative-ai-apps)

</div>
