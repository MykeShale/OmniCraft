// Construit src/timeline.json à partir des durées réelles de la voix off.
// - nettoie les silences, accélère légèrement (atempo, timbre inchangé), normalise -> public/audio/vo/final/<id>.wav
// - place chaque réplique (start/dur/end), calcule les événements déclarés dans vo-script.json
// Usage : node scripts/build-timeline.mjs [voice=ash] [speed=1.06]
//
// vo-script.json :
// {
//   "fps": 30, "width": 1920, "height": 1080, "intro": 50, "outro": 110, "defaultGap": 15,
//   "voice": { "voice": "ash", "speed": 1.06, "instructions": "..." },
//   "lines": [ { "id": "00-intro", "text": "...", "label": "TITRE AFFICHÉ", "sub": "sous-titre", "value": 0, "gapAfter": 20 } ],
//   "events": [ { "id": "impact", "line": "05-x", "at": "start", "offset": 175 },
//               { "id": "blackout", "line": "09-end", "at": "end", "offset": 15 },
//               { "id": "title", "event": "blackout", "offset": 45 } ]
// }
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const script = JSON.parse(fs.readFileSync(path.join("scripts", "vo-script.json"), "utf8"));
const voice = process.argv[2] || script.voice?.voice || "ash";
const speed = Number(process.argv[3] || script.voice?.speed || 1.06);
const FPS = script.fps || 30;
const INTRO = script.intro ?? 50, OUTRO = script.outro ?? 110, GAP = script.defaultGap ?? 15;

const inDir = path.join("public", "audio", "vo", voice);
const outDir = path.join("public", "audio", "vo", "final");
fs.mkdirSync(outDir, { recursive: true });
const duration = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim());

let cursor = INTRO;
const beats = [];
for (const line of script.lines) {
  const src = path.join(inDir, line.id + ".wav"), dst = path.join(outDir, line.id + ".wav");
  if (!fs.existsSync(src)) throw new Error("voix manquante : " + src + " (lance gen-vo.mjs " + voice + ")");
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", src, "-af",
    `silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,atempo=${speed},loudnorm=I=-16:TP=-1.5:LRA=9`,
    "-ar", "48000", "-ac", "1", dst]);
  const durF = Math.ceil(duration(dst) * FPS);
  beats.push({
    id: line.id, value: line.value ?? beats.length, text: line.text, label: line.label ?? "", sub: line.sub ?? "", zone: line.zone ?? "",
    voSrc: `audio/vo/final/${line.id}.wav`, start: cursor, dur: durF, end: cursor + durF, gapAfter: line.gapAfter ?? GAP,
  });
  cursor += durF + (line.gapAfter ?? GAP);
}
const durationInFrames = cursor + OUTRO;

const b = (id) => { const x = beats.find((y) => y.id === id); if (!x) throw new Error("réplique inconnue : " + id); return x; };
const events = {};
for (const e of script.events || []) {
  let base;
  if (e.event) base = events[e.event];
  else base = e.at === "end" ? b(e.line).end : b(e.line).start;
  if (base === undefined) throw new Error("événement mal défini : " + JSON.stringify(e));
  events[e.id] = base + (e.offset ?? 0);
}
if (events.blackout === undefined) events.blackout = durationInFrames - Math.round(OUTRO * 0.6);
if (events.title === undefined) events.title = events.blackout + 45;

const timeline = { fps: FPS, width: script.width || 1920, height: script.height || 1080, voice, speed, intro: INTRO, outro: OUTRO, durationInFrames, beats, events };
fs.mkdirSync("src", { recursive: true });
fs.writeFileSync(path.join("src", "timeline.json"), JSON.stringify(timeline, null, 2));
console.log(`voice=${voice} speed=${speed} -> ${durationInFrames} frames = ${(durationInFrames / FPS).toFixed(1)} s`);
for (const x of beats) console.log(`  ${x.id.padEnd(14)} start ${String(x.start).padStart(5)}  dur ${String(x.dur).padStart(4)} (${(x.dur / FPS).toFixed(1)} s)  ${x.label}`);
console.log("  events", events);
