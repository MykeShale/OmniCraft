// Synthèse de la musique (dark ambient) et des bruitages, calés sur src/timeline.json.
// Sorties : public/audio/music.wav et public/audio/sfx.wav (48 kHz stéréo 16 bits)
import fs from "node:fs";

const tl = JSON.parse(fs.readFileSync("src/timeline.json", "utf8"));
const FPS = tl.fps, SR = 48000;
const DUR = tl.durationInFrames / FPS + 1.5;
const N = Math.ceil(DUR * SR);
const beat = (id) => tl.beats.find((b) => b.id === id);
const s = (f) => f / FPS; // frame -> secondes
const ev = tl.events;

// PRNG déterministe
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = mulberry32(2024);

// profondeur à l'instant t (interpolation entre les ancres des beats)
const anchors = tl.beats.map((b) => ({ t: s(b.start + b.dur * 0.35), d: b.depth }));
function depthAt(t) {
  if (t <= anchors[0].t) return 0;
  for (let i = 1; i < anchors.length; i++) if (t <= anchors[i].t) { const a = anchors[i - 1], b = anchors[i]; const k = (t - a.t) / (b.t - a.t); return a.d + (b.d - a.d) * (k * k * (3 - 2 * k)); }
  return anchors[anchors.length - 1].d;
}
const norm = (d) => Math.min(1, Math.sqrt(d / 10935)); // 0..1 perceptuel

class Track {
  constructor() { this.L = new Float32Array(N); this.R = new Float32Array(N); }
  add(i, v, pan = 0) { if (i < 0 || i >= N) return; const l = Math.cos((pan + 1) * Math.PI / 4), r = Math.sin((pan + 1) * Math.PI / 4); this.L[i] += v * l; this.R[i] += v * r; }
}
const music = new Track(), sfx = new Track();
const TAU = Math.PI * 2;

// ---------- MUSIQUE ----------
{
  // drone : deux voix (D1 et A1) riches en partiels, filtrées de plus en plus avec la profondeur
  const f1 = 36.71, f2 = 55.0;
  const ph = Array.from({ length: 16 }, () => rnd() * TAU);
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const d = norm(depthAt(t));
    const cutoff = 7 - 5.5 * d; // nombre de partiels audibles
    const lfo = 0.75 + 0.25 * Math.sin(TAU * 0.045 * t) ;
    let v = 0;
    for (let k = 1; k <= 7; k++) {
      const w = Math.max(0, Math.min(1, cutoff - k + 1)) / k;
      if (w <= 0) continue;
      v += w * Math.sin(TAU * f1 * k * t + ph[k]) * 0.9;
      v += w * Math.sin(TAU * (f2 * k + 0.35) * t + ph[k + 8]) * 0.55;
    }
    // shimmer clair en surface (D5, A5, F#5) qui s'éteint vers 300 m
    const sh = Math.max(0, 1 - depthAt(t) / 320);
    if (sh > 0) {
      const trem = 0.6 + 0.4 * Math.sin(TAU * 0.31 * t);
      v += sh * trem * 0.16 * (Math.sin(TAU * 587.33 * t) + 0.7 * Math.sin(TAU * 880 * t + 1.1) + 0.5 * Math.sin(TAU * 739.99 * t + 2.3));
    }
    const fadeIn = Math.min(1, t / 3);
    const endFade = t > s(ev.blackout) ? 0.25 : 1;
    music.add(i, v * 0.11 * lfo * fadeIn * endFade, 0.15 * Math.sin(TAU * 0.02 * t));
  }
  // pulsation sub à partir de la zone de minuit, plus rapide en zone hadale
  {
    let t = s(beat("04-midnight").start);
    const tEnd = s(ev.blackout);
    while (t < tEnd) {
      const d = norm(depthAt(t));
      const period = 2.2 - 1.1 * d;
      const i0 = Math.floor(t * SR);
      for (let j = 0; j < SR * 1.2; j++) {
        const tt = j / SR;
        const env = Math.min(1, tt / 0.12) * Math.exp(-tt * 2.6);
        music.add(i0 + j, 0.32 * env * Math.sin(TAU * 46 * tt) * (0.5 + 0.5 * d));
      }
      t += period;
    }
  }
  // battement de cœur en zone hadale, qui accélère
  {
    const t0 = s(beat("07-hadal").start), tEnd = s(ev.blackout);
    let t = t0;
    while (t < tEnd) {
      const k = (t - t0) / (tEnd - t0);
      const bpm = 58 + 30 * k;
      for (const [off, amp] of [[0, 1], [0.27, 0.72]]) {
        const i0 = Math.floor((t + off) * SR);
        for (let j = 0; j < SR * 0.35; j++) {
          const tt = j / SR;
          const env = Math.exp(-tt * 14) * (tt < 0.004 ? tt / 0.004 : 1);
          music.add(i0 + j, 0.42 * amp * env * Math.sin(TAU * 54 * tt) * (0.35 + 0.65 * k));
        }
      }
      t += 60 / bpm;
    }
  }
  // montée de tension avant le noir : bruit filtré + sinus qui grimpe, coupé net
  {
    const tEnd = s(ev.blackout), t0 = tEnd - 6.5;
    let lp = 0;
    for (let i = Math.floor(t0 * SR); i < Math.floor(tEnd * SR); i++) {
      const t = i / SR, k = (t - t0) / (tEnd - t0);
      const n = rnd() * 2 - 1;
      lp += (n - lp) * (0.02 + 0.3 * k * k);
      const sine = Math.sin(TAU * (55 + 300 * k * k) * t);
      music.add(i, (lp * 0.5 + sine * 0.25) * 0.4 * k * k, 0);
    }
  }
}

// ---------- BRUITAGES ----------
function ping(track, t0, level, pan = 0, freq = 1080) {
  const echoes = [[0, 1], [0.21, 0.55], [0.44, 0.32], [0.7, 0.18], [1.0, 0.1]];
  for (const [dt, g] of echoes) {
    const i0 = Math.floor((t0 + dt) * SR);
    for (let j = 0; j < SR * 2.2; j++) {
      const tt = j / SR;
      const env = (tt < 0.01 ? tt / 0.01 : 1) * (tt < 0.09 ? 1 : Math.exp(-(tt - 0.09) * 2.2));
      track.add(i0 + j, level * g * env * Math.sin(TAU * freq * tt) * (0.7 + 0.3 * Math.sin(TAU * 6 * tt)), pan);
    }
  }
}
function thump(track, t0, level, freq = 42) {
  const i0 = Math.floor(t0 * SR);
  for (let j = 0; j < SR * 1.4; j++) {
    const tt = j / SR;
    const n = (rnd() * 2 - 1) * Math.exp(-tt * 30) * 0.5;
    const body = Math.sin(TAU * freq * tt * (1 + Math.exp(-tt * 8) * 0.6)) * Math.exp(-tt * 3.2);
    track.add(i0 + j, level * (body + n));
  }
}
function creak(track, t0, level, pan) {
  const dur = 0.5 + rnd() * 0.7, fA = 180 + rnd() * 160, fB = fA * (0.45 + rnd() * 0.2);
  const i0 = Math.floor(t0 * SR);
  let phase = 0, am = 0;
  for (let j = 0; j < SR * dur; j++) {
    const tt = j / SR, k = tt / dur;
    const f = fA + (fB - fA) * k + 9 * Math.sin(TAU * 11 * tt);
    phase += TAU * f / SR;
    am += ((rnd() * 2 - 1) - am) * 0.08;
    const env = Math.sin(Math.PI * k) ** 0.6;
    const v = Math.sin(phase) * (0.6 + 0.4 * am) + 0.25 * Math.sin(phase * 2.01);
    track.add(i0 + j, level * env * v, pan);
  }
}
function whaleClicks(track, t0) {
  for (let c = 0; c < 11; c++) {
    const t = t0 + c * (0.42 + rnd() * 0.06);
    const i0 = Math.floor(t * SR), pan = 0.8 - c * 0.15;
    for (let j = 0; j < SR * 0.05; j++) {
      const tt = j / SR;
      const v = (rnd() * 2 - 1) * Math.exp(-tt * 400) * 0.8 + Math.sin(TAU * 620 * tt) * Math.exp(-tt * 120) * 0.6;
      track.add(i0 + j, 0.32 * v, pan);
    }
  }
  // râle grave qui glisse (calmar / cachalot lointain)
  const i0 = Math.floor((t0 + 3.2) * SR);
  let phase = 0;
  for (let j = 0; j < SR * 3.4; j++) {
    const tt = j / SR, k = tt / 3.4;
    const f = 150 - 70 * k + 4 * Math.sin(TAU * 5.5 * tt);
    phase += TAU * f / SR;
    const env = Math.sin(Math.PI * k) ** 1.5;
    track.add(i0 + j, 0.13 * env * (Math.sin(phase) + 0.4 * Math.sin(phase * 2 + 0.5)), -0.5);
  }
}
function bubbles(track, t0, count, spread) {
  for (let b = 0; b < count; b++) {
    const t = t0 + rnd() * spread, f = 1400 + rnd() * 2600, dur = 0.018 + rnd() * 0.03, pan = rnd() * 0.8 - 0.4;
    const i0 = Math.floor(t * SR);
    for (let j = 0; j < SR * dur; j++) {
      const tt = j / SR, k = tt / dur;
      track.add(i0 + j, 0.05 * Math.sin(Math.PI * k) * Math.sin(TAU * f * (1 + 0.4 * k) * tt), pan);
    }
  }
}
function whump(track, t0, level) {
  const i0 = Math.floor(t0 * SR);
  let lp = 0;
  for (let j = 0; j < SR * 0.9; j++) {
    const tt = j / SR;
    lp += ((rnd() * 2 - 1) - lp) * 0.06;
    track.add(i0 + j, level * lp * Math.exp(-tt * 4) * (tt < 0.02 ? tt / 0.02 : 1));
  }
}

// ouverture : ping + bulles de la mise à l'eau
ping(sfx, 0.6, 0.28, 0.2);
bubbles(sfx, 0.3, 70, 4.5);
// un ping discret au début de chaque palier
for (const b of tl.beats) if (b.id !== "00-surface" && b.id !== "09-end") ping(sfx, s(b.start) - 0.35, 0.09, -0.3 + rnd() * 0.6, 980 + rnd() * 200);
// cachalot : clics d'écholocation puis râle
whaleClicks(sfx, s(beat("05-whale").start) + 1.2);
// le calmar frôle la coque
thump(sfx, s(ev.squidBrush), 0.55);
creak(sfx, s(ev.squidBrush) + 0.35, 0.3, 0.3);
bubbles(sfx, s(ev.squidBrush) + 0.1, 25, 1.2);
// craquements de coque à partir du Titanic, de plus en plus forts
{
  let t = s(beat("06-titanic").start) + 2;
  const tEnd = s(ev.blackout) - 7;
  while (t < tEnd) { const d = norm(depthAt(t)); creak(sfx, t, 0.08 + 0.22 * d, rnd() * 1.4 - 0.7); t += 4.5 + rnd() * 5 * (1 - d * 0.5); }
}
// atterrissage sur le fond
whump(sfx, s(ev.landing), 0.5);
bubbles(sfx, s(ev.landing) + 0.2, 20, 1.5);
// l'œil : un sub très grave qui monte, puis coupure
{
  const i0 = Math.floor(s(ev.eyeOpen) * SR), len = s(ev.blackout) - s(ev.eyeOpen);
  for (let j = 0; j < SR * len; j++) { const tt = j / SR, k = tt / len; sfx.add(i0 + j, 0.28 * k * Math.sin(TAU * (28 + 6 * k) * tt)); }
}
// noir : silence, puis ping final long
ping(sfx, s(ev.blackout) + 0.7, 0.42, 0, 1040);
ping(sfx, s(ev.blackout) + 3.4, 0.14, 0.4, 1040);

// ---------- MASTER ----------
function write(file, tr, gain) {
  let peak = 0;
  for (let i = 0; i < N; i++) { tr.L[i] = Math.tanh(tr.L[i] * gain); tr.R[i] = Math.tanh(tr.R[i] * gain); peak = Math.max(peak, Math.abs(tr.L[i]), Math.abs(tr.R[i])); }
  const g = peak > 0 ? 0.89 / peak : 1;
  const buf = Buffer.alloc(44 + N * 4);
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
