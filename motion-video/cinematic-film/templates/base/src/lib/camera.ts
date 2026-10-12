// Caméra continue + timeline. À adapter dans src/film.config.ts (CAMERA, SHAKES), pas ici.
import { noise2D } from "@remotion/noise";
import raw from "../timeline.json";
import { CAMERA, SHAKES } from "../film.config";
import { clamp, monotone, smoothstep } from "./math";

export type Beat = {
  id: string; value: number; text: string; label: string; sub: string; zone: string;
  voSrc: string; start: number; dur: number; end: number; gapAfter: number;
};
export type Timeline = {
  fps: number; width: number; height: number; durationInFrames: number; intro: number; outro: number;
  beats: Beat[]; events: Record<string, number>;
};

export const TL = raw as unknown as Timeline;
export const FPS = TL.fps;
export const EV = TL.events;
/** frame d'un événement, ou début d'une réplique si l'id est celui d'une réplique */
export const at = (id: string | null | undefined): number | undefined => {
  if (!id) return undefined;
  if (EV[id] !== undefined) return EV[id];
  return TL.beats.find((b) => b.id === id)?.start;
};
export const W = TL.width, H = TL.height;
export const beat = (id: string): Beat => { const b = TL.beats.find((x) => x.id === id); if (!b) throw new Error("beat inconnu " + id); return b; };
export const beatIndex = (id: string) => TL.beats.findIndex((b) => b.id === id);
export const anchorFrame = (b: Beat) => b.start + Math.round(b.dur * CAMERA.anchorAt);
export const CAM_Z = CAMERA.distance, FOV = CAMERA.fov, ASPECT = W / H;

// ---- distance parcourue le long de l'axe : vitesse constante, rampe au départ, arrêt optionnel sur un événement
const N = TL.durationInFrames;
const stopFrame = at(CAMERA.stopEvent) ?? Infinity;
const table = new Float64Array(N + 2);
{
  let d = 0;
  for (let f = 0; f <= N + 1; f++) {
    table[f] = d;
    const rampOut = Number.isFinite(stopFrame) ? 1 - smoothstep(stopFrame - CAMERA.rampOut, stopFrame, f) : 1;
    const v = (CAMERA.speed / FPS) * smoothstep(0, CAMERA.rampIn, f) * rampOut;
    d += v;
  }
}
/** distance parcourue (unités monde) à la frame f */
export const travel = (f: number) => {
  const i = clamp(f, 0, N), i0 = Math.floor(i), t = i - i0;
  return table[i0] * (1 - t) + table[Math.min(i0 + 1, N + 1)] * t;
};
/** position de la caméra (sans secousses) */
export const camPos = (f: number) => {
  const d = travel(f) * CAMERA.dir;
  return { x: CAMERA.axis === "x" ? d : 0, y: CAMERA.axis === "y" ? d : 0, z: CAMERA.axis === "z" ? d : 0 };
};
/** coordonnée le long de l'axe de déplacement (pratique pour placer les objets) */
export const camAxis = (f: number) => travel(f) * CAMERA.dir;
export const anchorAxis = (id: string) => camAxis(anchorFrame(beat(id)));
/** position monde d'un point "à côté de la caméra" à la frame de la réplique : (u, v) = décalages perpendiculaires */
export const anchorPos = (id: string, u = 0, v = 0, z = 0) => {
  const a = anchorAxis(id);
  if (CAMERA.axis === "y") return { x: u, y: a + v, z };
  if (CAMERA.axis === "x") return { x: a + u, y: v, z };
  return { x: u, y: v, z: a + z };
};

// ---- valeur affichée (profondeur, année, altitude, km…) : cubique monotone entre les paliers
const keys: [number, number][] = [[0, TL.beats[0]?.value ?? 0]];
for (const b of TL.beats) {
  const f = CAMERA.stopEvent && b.id === CAMERA.stopBeat ? stopFrame : anchorFrame(b);
  if (f > keys[keys.length - 1][0]) keys.push([f, b.value]);
}
const valueFn = keys.length > 1 ? monotone(keys.map((k) => k[0]), keys.map((k) => k[1])) : () => keys[0][1];
export const valueAt = (f: number) => valueFn(f);
/** avancement 0..1 dans le film (pour l'environnement) */
const pKeys = TL.beats.map((b, i) => [anchorFrame(b), TL.beats.length > 1 ? i / (TL.beats.length - 1) : 1] as [number, number]);
const progressFn = pKeys.length > 1 ? monotone([0, ...pKeys.map((k) => k[0])], [0, ...pKeys.map((k) => k[1])]) : () => 0;
export const progressAt = (f: number) => clamp(progressFn(f), 0, 1);

// ---- secousses (chocs déclarés dans film.config + grondement optionnel)
export const shakeAt = (f: number) => {
  let x = 0, y = 0, r = 0;
  for (const e of SHAKES) {
    const f0 = at(e.event); if (f0 === undefined) continue;
    const t = (f - f0) / FPS; if (t < 0) continue;
    const k = Math.exp(-t * e.decay) * e.amp;
    x += k * Math.sin(t * e.freq * 6.283) * 0.6;
    y += k * Math.sin(t * e.freq * 6.283 * 1.31 + 1) * 0.8;
    r += k * 0.02 * Math.sin(t * e.freq * 5);
  }
  if (CAMERA.rumble) {
    const { from, to, amp } = CAMERA.rumble;
    const f0 = at(from) ?? 0, f1 = at(to) ?? Infinity;
    const k = smoothstep(f0, f0 + 120, f) * (f < f1 ? 1 : 0) * amp;
    x += k * noise2D("rx", f * 0.37, 0);
    y += k * noise2D("ry", f * 0.37, 0);
  }
  return { x, y, r };
};

// ---- projection monde -> écran (étiquettes DOM ancrées dans la 3D)
export function project(x: number, y: number, z: number, f: number) {
  const c = camPos(f), sh = shakeAt(f);
  const xv = x - (c.x + sh.x), yv = y - (c.y + sh.y), zv = c.z + CAM_Z - z;
  const t = Math.tan((FOV / 2) * (Math.PI / 180));
  const nx = xv / zv / (t * ASPECT), ny = yv / zv / t;
  return { sx: (nx * 0.5 + 0.5) * W, sy: (0.5 - ny * 0.5) * H, scale: 1 / zv, behind: zv <= 0.5 };
}

/** fenêtre 0..1 avec fondu d'entrée/sortie */
export const window01 = (f: number, from: number, to: number, fadeIn = 15, fadeOut = 15) =>
  smoothstep(from, from + fadeIn, f) * (1 - smoothstep(to - fadeOut, to, f));
