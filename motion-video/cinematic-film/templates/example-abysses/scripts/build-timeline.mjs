// Construit la timeline à partir des durées réelles de la voix off.
// - accélère légèrement la voix (atempo, timbre inchangé), normalise, exporte public/audio/vo/final/<id>.wav
// - écrit src/timeline.json (keyframes de descente + fenêtres de texte)
// Usage: node scripts/build-timeline.mjs [voice=ash] [speed=1.08]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const voice = process.argv[2] || "ash";
const speed = Number(process.argv[3] || 1.08);
const FPS = 30;
const lines = JSON.parse(fs.readFileSync("scripts/vo-script.json", "utf8"));

const META = {
  "00-surface": { label: "SURFACE", sub: "11 km sous vos pieds", zone: "sunlight" },
  "01-liberty": { label: "STATUE DE LA LIBERTÉ", sub: "93 m · pression ×10", zone: "sunlight" },
  "02-eiffel": { label: "TOUR EIFFEL", sub: "330 m · record de plongée : 332 m", zone: "twilight" },
  "03-burj": { label: "BURJ KHALIFA", sub: "828 m · dernière lueur", zone: "twilight" },
  "04-midnight": { label: "ZONE DE MINUIT", sub: "1 000 m · 90 % des espèces produisent leur lumière", zone: "midnight" },
  "05-whale": { label: "CACHALOT · CALMAR GÉANT", sub: "2 000 m · jamais filmé", zone: "midnight" },
  "06-titanic": { label: "TITANIC", sub: "3 800 m · neige marine", zone: "abyss" },
  "07-hadal": { label: "ZONE HADALE", sub: "6 000 m · pression ×600 · poisson à 8 336 m", zone: "hadal" },
  "08-bottom": { label: "CHALLENGER DEEP", sub: "10 935 m · 1 100 kg sur chaque cm²", zone: "hadal" },
  "09-end": { label: "", sub: "moins de 5 % explorés", zone: "hadal" },
};
// frames de respiration après chaque ligne
const GAP_AFTER = { "00-surface": 20, "04-midnight": 20, "05-whale": 30, "07-hadal": 20, "08-bottom": 30, "09-end": 0 };
const INTRO = 50; // frames avant la première ligne
const OUTRO = 110; // frames après la dernière ligne (œil, noir, titre)

const inDir = path.join("public", "audio", "vo", voice);
const outDir = path.join("public", "audio", "vo", "final");
fs.mkdirSync(outDir, { recursive: true });

function duration(file) {
  return Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim());
}

let cursor = INTRO;
const beats = [];
for (const line of lines) {
  const src = path.join(inDir, line.id + ".wav");
  const dst = path.join(outDir, line.id + ".wav");
  // trim silences aux extrémités, accélère, normalise à -16 LUFS approx (loudnorm simple passe), 48 kHz
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, "-af",
    `silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,atempo=${speed},loudnorm=I=-16:TP=-1.5:LRA=9`,
    "-ar", "48000", "-ac", "1", dst]);
  const dur = duration(dst);
  const durF = Math.ceil(dur * FPS);
  const gap = GAP_AFTER[line.id] ?? 15;
  const meta = META[line.id];
  beats.push({
    id: line.id,
    depth: line.depth,
    text: line.text,
    label: meta.label,
    sub: meta.sub,
    zone: meta.zone,
    voSrc: `audio/vo/final/${line.id}.wav`,
    start: cursor,
    dur: durF,
    end: cursor + durF,
    gapAfter: gap,
  });
  cursor += durF + gap;
}
const durationInFrames = cursor + OUTRO;

const b = (id) => beats.find((x) => x.id === id);
const blackout = b("09-end").end + 15;
const events = {
  whalePass: b("05-whale").start - 20,
  squidBrush: b("05-whale").start + 175,
  landing: b("08-bottom").start + 270,
  eyeOpen: b("09-end").start + 105,
  blackout,
  title: blackout + 45,
};
const timeline = { fps: FPS, width: 1920, height: 1080, voice, speed, intro: INTRO, outro: OUTRO, durationInFrames, beats, events };
fs.mkdirSync("src", { recursive: true });
fs.writeFileSync(path.join("src", "timeline.json"), JSON.stringify(timeline, null, 2));
console.log(`voice=${voice} speed=${speed} -> ${durationInFrames} frames = ${(durationInFrames / FPS).toFixed(1)} s`);
for (const b of beats) console.log(`  ${b.id.padEnd(12)} ${String(b.depth).padStart(6)} m  start ${String(b.start).padStart(5)}  dur ${String(b.dur).padStart(4)} (${(b.dur / FPS).toFixed(1)} s)`);
