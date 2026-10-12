import { noise2D } from "@remotion/noise";
import raw from "../timeline.json";
import { clamp, monotone, smoothstep } from "./math";

export type Beat = {
  id: string; depth: number; text: string; label: string; sub: string; zone: string;
  voSrc: string; start: number; dur: number; end: number; gapAfter: number;
};
export type Timeline = {
  fps: number; width: number; height: number; durationInFrames: number; intro: number; outro: number;
  beats: Beat[];
  events: { whalePass: number; squidBrush: number; landing: number; eyeOpen: number; blackout: number; title: number };
};

export const TL = raw as Timeline;
export const FPS = TL.fps;
export const EV = TL.events;
export const beat = (id: string): Beat => TL.beats.find((b) => b.id === id)!;
export const beatIndex = (id: string) => TL.beats.findIndex((b) => b.id === id);

export const W = 1920, H = 1080;
export const CAM_Z = 30, FOV = 40, ASPECT = W / H;

// ---- descente : vitesse constante (unités/s), rampe au départ, arrêt en douceur sur le fond
const SPEED = 2.3;
const N = TL.durationInFrames;
const table = new Float64Array(N + 2);
{
  let y = 0;
  for (let f = 0; f <= N + 1; f++) {
    table[f] = y;
    const v = (SPEED / FPS) * smoothstep(0, 80, f) * (1 - smoothstep(EV.landing - 130, EV.landing, f));
    y -= v;
  }
}
export const camY = (f: number) => {
  const i = clamp(f, 0, N);
  const i0 = Math.floor(i), t = i - i0;
  return table[i0] * (1 - t) + table[Math.min(i0 + 1, N + 1)] * t;
};
export const anchorFrame = (b: Beat) => b.start + Math.round(b.dur * 0.3);
export const anchorY = (id: string) => camY(anchorFrame(beat(id)));
/** hauteur (monde) du haut du sédiment au fond */
export const FLOOR_Y = camY(EV.landing) - 4.9;

// ---- profondeur affichée (mètres) : cubique monotone entre les paliers
const depthKeys: [number, number][] = [[0, 0]];
for (const b of TL.beats) {
  if (b.id === "09-end") continue;
  if (b.id === "08-bottom") depthKeys.push([EV.landing, 10935]);
  else depthKeys.push([anchorFrame(b), b.depth]);
}
const depthFn = monotone(depthKeys.map((k) => k[0]), depthKeys.map((k) => k[1]));
export const depthAt = (f: number) => (f <= 0 ? 0 : f >= EV.landing ? 10935 : depthFn(f));

// ---- secousses caméra (chocs + grondement en zone hadale)
const shakeEvents = [
  { f: EV.squidBrush, amp: 0.5, freq: 10, decay: 2.0 },
  { f: EV.landing, amp: 0.32, freq: 6, decay: 2.4 },
];
export const shakeAt = (f: number) => {
  let x = 0, y = 0, r = 0;
  for (const e of shakeEvents) {
    const t = (f - e.f) / FPS;
    if (t < 0) continue;
    const k = Math.exp(-t * e.decay) * e.amp;
    x += k * Math.sin(t * e.freq * 6.283) * 0.6;
    y += k * Math.sin(t * e.freq * 6.283 * 1.31 + 1) * 0.8;
    r += k * 0.02 * Math.sin(t * e.freq * 5);
  }
  const hadal = beat("07-hadal").start;
  const rumble = smoothstep(hadal, hadal + 120, f) * (f < EV.blackout ? 1 : 0) * 0.045 * (1 + 3 * smoothstep(EV.eyeOpen, EV.blackout, f));
  x += rumble * noise2D("rx", f * 0.37, 0);
  y += rumble * noise2D("ry", f * 0.37, 0);
  return { x, y, r };
};

// ---- pose du bathyscaphe (accroché à la caméra, flotte, se pose au fond)
export const BATHY_X = -8.8, BATHY_Z = 3;
export const bathyPose = (f: number) => {
  const t = f / FPS;
  const settled = smoothstep(EV.landing - 20, EV.landing + 40, f);
  const bob = (1 - settled) * 0.32 * noise2D("bob", t * 0.22, 0);
  const since = Math.max(0, f - EV.landing);
  const landDrop = settled * 0.45 - 0.3 * Math.exp(-since / 14) * Math.cos(since * 0.42) * settled;
  const sh = shakeAt(f);
  return {
    x: BATHY_X + 0.22 * noise2D("bx", t * 0.17, 0) * (1 - settled),
    y: camY(f) + 0.7 + bob - landDrop,
    z: BATHY_Z,
    rot: 0.035 * noise2D("br", t * 0.2, 0) * (1 - settled) + sh.r * 0.6,
  };
};

// ---- projection monde -> écran (pour les étiquettes DOM)
export function project(x: number, y: number, z: number, f: number) {
  const sh = shakeAt(f);
  const cx = sh.x, cy = camY(f) + sh.y;
  const xv = x - cx, yv = y - cy, zv = CAM_Z - z;
  const t = Math.tan((FOV / 2) * (Math.PI / 180));
  const nx = xv / zv / (t * ASPECT), ny = yv / zv / t;
  return { sx: (nx * 0.5 + 0.5) * W, sy: (0.5 - ny * 0.5) * H, scale: 1 / zv, behind: zv <= 0.5 };
}

/** fenêtre 0..1 avec fondu d'entrée/sortie */
export const window01 = (f: number, from: number, to: number, fadeIn = 15, fadeOut = 15) =>
  smoothstep(from, from + fadeIn, f) * (1 - smoothstep(to - fadeOut, to, f));
