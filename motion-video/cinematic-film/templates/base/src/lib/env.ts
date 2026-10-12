import { ENV_KEYS } from "../film.config";
import { lerp } from "./math";

export type Env = { bg: [number, number, number]; near: number; far: number; ambient: number; sun: number; spot: number; dust: number; sparks: number };
const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];

/** ambiance interpolée pour un avancement p ∈ [0,1] (voir ENV_KEYS dans film.config.ts) */
export function envAt(p: number): Env {
  const K = ENV_KEYS;
  let i = 1;
  while (i < K.length - 1 && p > K[i].p) i++;
  const a = K[i - 1], b = K[i];
  const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
  const ca = hex(a.bg), cb = hex(b.bg);
  return {
    bg: [lerp(ca[0], cb[0], t), lerp(ca[1], cb[1], t), lerp(ca[2], cb[2], t)],
    near: lerp(a.near, b.near, t), far: lerp(a.far, b.far, t),
    ambient: lerp(a.ambient, b.ambient, t), sun: lerp(a.sun, b.sun, t), spot: lerp(a.spot, b.spot, t),
    dust: lerp(a.dust, b.dust, t), sparks: lerp(a.sparks, b.sparks, t),
  };
}
