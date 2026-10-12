// Chorégraphie partagée entre la scène 3D et les étiquettes HUD : trajectoires des créatures,
// positions des monuments, fenêtres de visibilité.
import { noise2D } from "@remotion/noise";
import { EV, FLOOR_Y, FPS, anchorY, beat, camY } from "./camera";
import { clamp, easeInOut, easeOut, lerp } from "./math";
import { aspect } from "./textures";

export type Pose = { x: number; y: number; z: number; rot: number; visible: boolean; k: number };

/** interpolation d'un segment de trajectoire entre deux instants (frames) */
export function seg(frame: number, f0: number, f1: number, a: [number, number, number], b: [number, number, number], ease: (t: number) => number = (t) => t, margin = 40): Pose {
  const k = ease(clamp((frame - f0) / (f1 - f0), 0, 1));
  return { x: lerp(a[0], b[0], k), y: lerp(a[1], b[1], k), z: lerp(a[2], b[2], k), rot: 0, visible: frame > f0 - margin && frame < f1 + margin, k };
}

const t = (f: number) => f / FPS;

// ---- créatures qui suivent la caméra (y relatif à camY)
export function anglerPose(frame: number): Pose {
  const b = beat("04-midnight");
  const f0 = b.start + 15, f1 = b.start + 190, f2 = b.end + 10, f3 = b.end + 150;
  const cy = camY(frame);
  if (frame < f2) {
    const p = seg(frame, f0, f1, [36, -3, -3], [-0.8, 1.7, 2.2], easeOut);
    return { ...p, y: cy + p.y + 0.25 * Math.sin(t(frame) * 1.3), rot: 0.06 * Math.sin(t(frame) * 0.8) - 0.05 * (1 - p.k) };
  }
  const p = seg(frame, f2, f3, [-0.8, 1.7, 2.2], [40, 6, -6], easeInOut);
  return { ...p, y: cy + p.y, rot: 0.12 * p.k };
}

export function squidPose(frame: number): Pose {
  const b = beat("05-whale");
  const f0 = b.start + 40, f1 = b.start + 330;
  const p = seg(frame, f0, f1, [-48, -9, 0.5], [44, 6, 5.5]);
  const cy = camY(frame);
  return { ...p, y: cy + p.y + 0.6 * Math.sin(t(frame) * 0.9), rot: 0.18 + 0.05 * Math.sin(t(frame) * 1.1) };
}

export function whalePose(frame: number): Pose {
  const f0 = EV.whalePass, f1 = EV.whalePass + 340;
  const p = seg(frame, f0, f1, [46, 8, -17], [-52, -3, -15]);
  const cy = camY(frame);
  return { ...p, y: cy + p.y, rot: -0.12 };
}

export function snailPose(frame: number): Pose {
  const b7 = beat("07-hadal"), b8 = beat("08-bottom");
  const cy = camY(frame);
  const f0 = b7.start + 80, f1 = b7.end + 30, f2 = b8.start + 40, f3 = b8.start + 200;
  if (frame < f2) {
    const p = seg(frame, f0, f1, [28, -7, -3], [1.2, -0.8, 1.6], easeOut);
    return { ...p, y: cy + p.y + 0.18 * Math.sin(t(frame) * 1.6), rot: 0.05 * Math.sin(t(frame) * 1.2) };
  }
  const p = seg(frame, f2, f3, [1.2, -0.8, 1.6], [34, 9, -5], easeInOut);
  return { ...p, y: cy + p.y, rot: -0.15 * p.k };
}

export function turtlePose(frame: number): Pose {
  const a0 = anchorY("00-surface");
  const p = seg(frame, 15, 470, [32, a0 - 1, -3], [-38, a0 - 7, -7]);
  return { ...p, y: p.y + 0.5 * Math.sin(t(frame) * 0.7), rot: 0.12 + 0.05 * Math.sin(t(frame) * 0.5) };
}

export function bagPose(frame: number): Pose {
  const x = 3.2 + 0.7 * noise2D("bagx", t(frame) * 0.25, 0);
  const y = FLOOR_Y + 3.0 + 0.5 * noise2D("bagy", t(frame) * 0.3, 1);
  return { x, y, z: 1.6, rot: 0.25 * noise2D("bagr", t(frame) * 0.2, 2), visible: frame > EV.landing - 260, k: 0 };
}

// ---- monuments et décors (fixes dans le monde)
export type Landmark = {
  id: string; tex: string; x: number; y: number; z: number; height?: number; width?: number; rot?: number; flip?: boolean;
  opacity?: number; emissive?: number; label?: string; labelAt?: [number, number]; from: number; to: number;
};

export function landmarks(): Landmark[] {
  const b1 = beat("01-liberty"), b2 = beat("02-eiffel"), b3 = beat("03-burj"), b6 = beat("06-titanic"), b8 = beat("08-bottom");
  return [
    { id: "statue", tex: "statue", x: 9.5, y: anchorY("01-liberty") - 0.5, z: -6, height: 15, label: "93 m · Statue de la Liberté", labelAt: [0.22, 0.47], from: b1.start - 20, to: b1.end + 25 },
    { id: "eiffel", tex: "eiffel", x: 11, y: anchorY("02-eiffel") + 0.5, z: -8, height: 21, rot: Math.PI, label: "330 m · Tour Eiffel, tête en bas", labelAt: [-0.3, 0.44], from: b2.start - 20, to: b2.end + 25 },
    { id: "burj", tex: "burj", x: 10.5, y: anchorY("03-burj") - 1.5, z: -10, height: 27, label: "828 m · Burj Khalifa", labelAt: [0.02, 0.47], from: b3.start - 20, to: b3.end + 25 },
    { id: "titanic", tex: "titanic", x: 6.5, y: anchorY("06-titanic") - 3, z: -7, width: 30, label: "3 803 m · épave du Titanic", labelAt: [-0.4, 0.18], from: b6.start - 20, to: b6.end + 25 },
    { id: "everest", tex: "everest", x: 13, y: camY(b8.start + 70) + 3, z: -15, width: 36, rot: Math.PI, opacity: 0.55, emissive: 0.12, label: "8 849 m · l'Everest, retourné", labelAt: [0.0, -0.42], from: b8.start - 10, to: b8.start + 200 },
  ];
}

/** point d'ancrage (monde) d'une étiquette de monument */
export function landmarkAnchor(l: Landmark) {
  const asp = aspect(l.tex);
  const w = l.width ?? (l.height ?? 10) * asp;
  const h = l.height ?? w / asp;
  const [u, v] = l.labelAt ?? [0, 0.45];
  const r = l.rot ?? 0;
  const lx = u * w * (l.flip ? -1 : 1), ly = v * h;
  return { x: l.x + lx * Math.cos(r) - ly * Math.sin(r), y: l.y + lx * Math.sin(r) + ly * Math.cos(r), z: l.z, w, h };
}
