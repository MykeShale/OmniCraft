import { lerp } from "./math";

type Key = { d: number; bg: string; near: number; far: number; ambient: number; sun: number; spot: number; snow: number; plankton: number; temp: number };

// couleurs de l'eau, brouillard, lumières et particules selon la profondeur (m)
const KEYS: Key[] = [
  { d: 0, bg: "#2aa4cb", near: 24, far: 115, ambient: 1.6, sun: 2.0, spot: 0.0, snow: 0.12, plankton: 0, temp: 22 },
  { d: 93, bg: "#1a87b1", near: 24, far: 100, ambient: 1.25, sun: 1.5, spot: 0.0, snow: 0.18, plankton: 0, temp: 18 },
  { d: 330, bg: "#0d5684", near: 24, far: 88, ambient: 0.8, sun: 0.75, spot: 0.3, snow: 0.3, plankton: 0, temp: 11 },
  { d: 828, bg: "#062f4d", near: 25, far: 74, ambient: 0.34, sun: 0.18, spot: 0.75, snow: 0.5, plankton: 0.35, temp: 6 },
  { d: 1000, bg: "#03192d", near: 26, far: 64, ambient: 0.15, sun: 0.0, spot: 1.0, snow: 0.7, plankton: 1.0, temp: 4.5 },
  { d: 2000, bg: "#020e1c", near: 26, far: 60, ambient: 0.09, sun: 0.0, spot: 1.0, snow: 0.85, plankton: 0.8, temp: 3 },
  { d: 3800, bg: "#02070e", near: 26, far: 58, ambient: 0.065, sun: 0.0, spot: 1.0, snow: 1.0, plankton: 0.5, temp: 1.8 },
  { d: 6000, bg: "#010409", near: 26, far: 56, ambient: 0.045, sun: 0.0, spot: 1.0, snow: 1.0, plankton: 0.3, temp: 1.6 },
  { d: 10935, bg: "#000204", near: 26, far: 54, ambient: 0.035, sun: 0.0, spot: 1.0, snow: 0.9, plankton: 0.2, temp: 2.3 },
];

const hex = (h: string) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const S = (d: number) => Math.sqrt(Math.max(0, d)); // échelle perceptuelle

export type Env = { bg: [number, number, number]; near: number; far: number; ambient: number; sun: number; spot: number; snow: number; plankton: number; temp: number };

export function envAt(depth: number): Env {
  const s = S(depth);
  let i = 1;
  while (i < KEYS.length - 1 && s > S(KEYS[i].d)) i++;
  const a = KEYS[i - 1], b = KEYS[i];
  const t = Math.min(1, Math.max(0, (s - S(a.d)) / (S(b.d) - S(a.d))));
  const ca = hex(a.bg), cb = hex(b.bg);
  return {
    bg: [lerp(ca[0], cb[0], t), lerp(ca[1], cb[1], t), lerp(ca[2], cb[2], t)],
    near: lerp(a.near, b.near, t), far: lerp(a.far, b.far, t),
    ambient: lerp(a.ambient, b.ambient, t), sun: lerp(a.sun, b.sun, t), spot: lerp(a.spot, b.spot, t),
    snow: lerp(a.snow, b.snow, t), plankton: lerp(a.plankton, b.plankton, t), temp: lerp(a.temp, b.temp, t),
  };
}

export const lightPercent = (depth: number) => 100 * Math.exp(-depth / 45);
export const pressureAtm = (depth: number) => 1 + depth / 10;
