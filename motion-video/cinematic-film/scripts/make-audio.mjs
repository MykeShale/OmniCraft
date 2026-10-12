// Musique + bruitages synthétisés (libres de droits), calés sur src/timeline.json.
// Sorties : public/audio/music.wav et public/audio/sfx.wav (48 kHz stéréo 16 bits)
// Config : scripts/audio.json (toutes les clés sont optionnelles)
// {
//   "mood": "dark-ambient" | "wonder" | "epic" | "tension",   // caractère du drone / de la nappe
//   "root": 36.71,                    // fondamentale en Hz (D1 = 36.71, C1 = 32.70, E1 = 41.20)
//   "pingsAtBeats": true,             // petit ping sonar/cloche au début de chaque réplique
//   "pulseFrom": "04-midnight",       // réplique à partir de laquelle une pulsation sub apparaît (null = jamais)
//   "heartbeatFrom": "07-hadal",      // battement de cœur qui accélère jusqu'au noir (null = jamais)
//   "creaksFrom": "06-titanic",       // craquements/grondements aléatoires (null = jamais)
//   "riserBefore": "blackout",        // montée de tension coupée net sur cet événement
//   "impacts": [ { "event": "impact", "level": 0.55 }, { "event": "landing", "type": "whump", "level": 0.5 } ],
//   "finalPing": "blackout",          // ping long après le noir
//   "openingBubbles": true            // bulles/tintements d'ouverture
// }
// La « tension » (0..1) suit l'avancement dans les répliques : le drone se filtre, la pulsation accélère, etc.
import fs from "node:fs";

const tl = JSON.parse(fs.readFileSync("src/timeline.json", "utf8"));
const cfg = fs.existsSync("scripts/audio.json") ? JSON.parse(fs.readFileSync("scripts/audio.json", "utf8")) : {};
const FPS = tl.fps, SR = 48000;
const DUR = tl.durationInFrames / FPS + 1.5, N = Math.ceil(DUR * SR);
const s = (f) => f / FPS;
const ev = tl.events;
const beat = (id) => tl.beats.find((b) => b.id === id);
const evT = (id) => (ev[id] === undefined ? null : s(ev[id]));
const endT = evT(cfg.riserBefore || "blackout") ?? DUR - 1.5;
const mood = cfg.mood || "dark-ambient";

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(2024);
const anchors = tl.beats.map((b, i) => ({ t: s(b.start + b.dur * 0.35), k: tl.beats.length > 1 ? i / (tl.beats.length - 1) : 1 }));
function tension(t) {
  if (t <= anchors[0].t) return 0;
  for (let i = 1; i < anchors.length; i++) if (t <= anchors[i].t) { const a = anchors[i - 1], b = anchors[i]; const k = (t - a.t) / (b.t - a.t); return a.k + (b.k - a.k) * (k * k * (3 - 2 * k)); }
  return 1;
}
class Track {
  constructor() { this.L = new Float32Array(N); this.R = new Float32Array(N); }
  add(i, v, pan = 0) { if (i < 0 || i >= N) return; const l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4); this.L[i] += v * l; this.R[i] += v * r; }
}
const music = new Track(), sfx = new Track();
const TAU = Math.PI * 2;
const root = cfg.root || 36.71;

// ---------- MUSIQUE ----------
{
  const ph = Array.from({ length: 16 }, () => rnd() * TAU);
  const f1 = root, f2 = mood === "wonder" ? root * 1.5 : mood === "epic" ? root * 2 : root * 1.498;
  const shimmerNotes = mood === "wonder" ? [root * 16, root * 24, root * 20] : [root * 16, root * 24, root * 20.16];
  for (let i = 0; i < N; i++) {
    const t = i / SR, d = tension(t);
    const cutoff = mood === "epic" ? 7 - 2 * d : 7 - 5.5 * d;
    const lfo = 0.75 + 0.25 * Math.sin(TAU * 0.045 * t);
    let v = 0;
    for (let k = 1; k <= 7; k++) {
      const w = Math.max(0, Math.min(1, cutoff - k + 1)) / k;
      if (w <= 0) continue;
      v += w * Math.sin(TAU * f1 * k * t + ph[k]) * 0.9;
      v += w * Math.sin(TAU * (f2 * k + 0.35) * t + ph[k + 8]) * 0.55;
    }
    // nappe claire : présente au début (dark/tension), tout du long (wonder/epic)
    const sh = mood === "wonder" || mood === "epic" ? 0.6 + 0.4 * (1 - d) : Math.max(0, 1 - d * 3.2);
    if (sh > 0) {
      const trem = 0.6 + 0.4 * Math.sin(TAU * 0.31 * t);
      v += sh * trem * 0.16 * (Math.sin(TAU * shimmerNotes[0] * t) + 0.7 * Math.sin(TAU * shimmerNotes[1] * t + 1.1) + 0.5 * Math.sin(TAU * shimmerNotes[2] * t + 2.3));
    }
    const fadeIn = Math.min(1, t / 3);
    const after = t > endT ? 0.25 : 1;
    music.add(i, v * 0.11 * lfo * fadeIn * after, 0.15 * Math.sin(TAU * 0.02 * t));
  }
  // pulsation sub qui accélère avec la tension
  const pulseFrom = cfg.pulseFrom === undefined ? tl.beats[Math.floor(tl.beats.length * 0.4)]?.id : cfg.pulseFrom;
  if (pulseFrom && beat(pulseFrom)) {
    let t = s(beat(pulseFrom).start);
    while (t < endT) {
      const d = tension(t), period = 2.2 - 1.1 * d, i0 = Math.floor(t * SR);
      for (let j = 0; j < SR * 1.2; j++) { const tt = j / SR; music.add(i0 + j, 0.32 * Math.min(1, tt / 0.12) * Math.exp(-tt * 2.6) * Math.sin(TAU * (root * 1.25) * tt) * (0.5 + 0.5 * d)); }
      t += period;
    }
  }
  // battement de cœur
  if (cfg.heartbeatFrom && beat(cfg.heartbeatFrom)) {
    const t0 = s(beat(cfg.heartbeatFrom).start);
    let t = t0;
    while (t < endT) {
      const k = (t - t0) / Math.max(1, endT - t0), bpm = 58 + 30 * k;
      for (const [off, amp] of [[0, 1], [0.27, 0.72]]) {
        const i0 = Math.floor((t + off) * SR);
        for (let j = 0; j < SR * 0.35; j++) { const tt = j / SR; music.add(i0 + j, 0.42 * amp * Math.exp(-tt * 14) * (tt < 0.004 ? tt / 0.004 : 1) * Math.sin(TAU * 54 * tt) * (0.35 + 0.65 * k)); }
      }
      t += 60 / bpm;
    }
  }
  // montée de tension coupée net
  if (cfg.riserBefore !== null && evT(cfg.riserBefore || "blackout") !== null) {
    const tEnd = evT(cfg.riserBefore || "blackout"), t0 = tEnd - 6.5;
    let lp = 0;
    for (let i = Math.floor(t0 * SR); i < Math.floor(tEnd * SR); i++) {
      const t = i / SR, k = (t - t0) / (tEnd - t0), n = rnd() * 2 - 1;
      lp += (n - lp) * (0.02 + 0.3 * k * k);
      music.add(i, (lp * 0.5 + Math.sin(TAU * (55 + 300 * k * k) * t) * 0.25) * 0.4 * k * k);
    }
  }
}

// ---------- BRUITAGES ----------
function ping(track, t0, level, pan = 0, freq = 1080) {
  for (const [dt, g] of [[0, 1], [0.21, 0.55], [0.44, 0.32], [0.7, 0.18], [1.0, 0.1]]) {
    const i0 = Math.floor((t0 + dt) * SR);
    for (let j = 0; j < SR * 2.2; j++) { const tt = j / SR; const env = (tt < 0.01 ? tt / 0.01 : 1) * (tt < 0.09 ? 1 : Math.exp(-(tt - 0.09) * 2.2)); track.add(i0 + j, level * g * env * Math.sin(TAU * freq * tt) * (0.7 + 0.3 * Math.sin(TAU * 6 * tt)), pan); }
  }
}
function thump(track, t0, level, freq = 42) {
  const i0 = Math.floor(t0 * SR);
  for (let j = 0; j < SR * 1.4; j++) { const tt = j / SR; track.add(i0 + j, level * (Math.sin(TAU * freq * tt * (1 + Math.exp(-tt * 8) * 0.6)) * Math.exp(-tt * 3.2) + (rnd() * 2 - 1) * Math.exp(-tt * 30) * 0.5)); }
}
function creak(track, t0, level, pan) {
  const dur = 0.5 + rnd() * 0.7, fA = 180 + rnd() * 160, fB = fA * (0.45 + rnd() * 0.2), i0 = Math.floor(t0 * SR);
  let phase = 0, am = 0;
  for (let j = 0; j < SR * dur; j++) {
    const tt = j / SR, k = tt / dur;
    phase += TAU * (fA + (fB - fA) * k + 9 * Math.sin(TAU * 11 * tt)) / SR;
    am += ((rnd() * 2 - 1) - am) * 0.08;
    track.add(i0 + j, level * Math.sin(Math.PI * k) ** 0.6 * (Math.sin(phase) * (0.6 + 0.4 * am) + 0.25 * Math.sin(phase * 2.01)), pan);
  }
}
function whump(track, t0, level) {
  const i0 = Math.floor(t0 * SR); let lp = 0;
  for (let j = 0; j < SR * 0.9; j++) { const tt = j / SR; lp += ((rnd() * 2 - 1) - lp) * 0.06; track.add(i0 + j, level * lp * Math.exp(-tt * 4) * (tt < 0.02 ? tt / 0.02 : 1)); }
}
function bubbles(track, t0, count, spread) {
  for (let b = 0; b < count; b++) {
    const t = t0 + rnd() * spread, f = 1400 + rnd() * 2600, dur = 0.018 + rnd() * 0.03, pan = rnd() * 0.8 - 0.4, i0 = Math.floor(t * SR);
    for (let j = 0; j < SR * dur; j++) { const tt = j / SR, k = tt / dur; track.add(i0 + j, 0.05 * Math.sin(Math.PI * k) * Math.sin(TAU * f * (1 + 0.4 * k) * tt), pan); }
  }
}
function swell(track, t0, t1, level, freq = 28) {
  const i0 = Math.floor(t0 * SR), len = t1 - t0;
  for (let j = 0; j < SR * len; j++) { const tt = j / SR, k = tt / len; track.add(i0 + j, level * k * Math.sin(TAU * (freq + 6 * k) * tt)); }
}

if (cfg.openingBubbles !== false) { ping(sfx, 0.6, 0.28, 0.2); bubbles(sfx, 0.3, 70, 4.5); }
if (cfg.pingsAtBeats !== false) for (const b of tl.beats.slice(1, -1)) ping(sfx, s(b.start) - 0.35, 0.09, -0.3 + rnd() * 0.6, 980 + rnd() * 200);
for (const imp of cfg.impacts || []) {
  const t = evT(imp.event); if (t === null) continue;
  if (imp.type === "whump") { whump(sfx, t, imp.level ?? 0.5); bubbles(sfx, t + 0.2, 20, 1.5); }
  else { thump(sfx, t, imp.level ?? 0.55); creak(sfx, t + 0.35, 0.3, 0.3); bubbles(sfx, t + 0.1, 25, 1.2); }
}
if (cfg.creaksFrom && beat(cfg.creaksFrom)) {
  let t = s(beat(cfg.creaksFrom).start) + 2;
  while (t < endT - 7) { const d = tension(t); creak(sfx, t, 0.08 + 0.22 * d, rnd() * 1.4 - 0.7); t += 4.5 + rnd() * 5 * (1 - d * 0.5); }
}
if (cfg.swell) { const a = evT(cfg.swell.from), b = evT(cfg.swell.to); if (a !== null && b !== null) swell(sfx, a, b, cfg.swell.level ?? 0.28); }
if (cfg.finalPing !== null) { const t = evT(cfg.finalPing || "blackout"); if (t !== null) { ping(sfx, t + 0.7, 0.42, 0, 1040); ping(sfx, t + 3.4, 0.14, 0.4, 1040); } }

// ---------- MASTER ----------
function write(file, tr, gain) {
  let peak = 0;
  for (let i = 0; i < N; i++) { tr.L[i] = Math.tanh(tr.L[i] * gain); tr.R[i] = Math.tanh(tr.R[i] * gain); peak = Math.max(peak, Math.abs(tr.L[i]), Math.abs(tr.R[i])); }
  const g = peak > 0 ? 0.89 / peak : 1, buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(tr.L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(tr.R[i] * g * 32767), 46 + i * 4); }
  fs.writeFileSync(file, buf);
  console.log(file, (N / SR).toFixed(1) + "s", "peak", peak.toFixed(2));
}
fs.mkdirSync("public/audio", { recursive: true });
write("public/audio/music.wav", music, 1.6);
write("public/audio/sfx.wav", sfx, 1.2);
