import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { EV, FLOOR_Y, FPS, bathyPose, camY, depthAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { mulberry32, smoothstep } from "../lib/math";
import { getSoftTexture, useTex } from "../lib/textures";

function makePoints(count: number, size: number, color: number, map: THREE.Texture, additive: boolean, vertexColors = false) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  if (vertexColors) geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new THREE.PointsMaterial({ size, map, color, transparent: true, depthWrite: false, sizeAttenuation: true, vertexColors, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending, opacity: 1 });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return { pts, mat, pos, col: vertexColors ? (geo.getAttribute("color") as THREE.BufferAttribute) : null, geo };
}
const wrap = (v: number, span: number) => ((v % span) + span) % span;

export const Particles: React.FC<{ frame: number }> = ({ frame }) => {
  const bubbleTex = useTex("bubble");
  const soft = useMemo(() => getSoftTexture(), []);

  const sys = useMemo(() => {
    const rnd = mulberry32(77);
    const snowA = makePoints(1500, 0.15, 0xdcefff, soft, false);
    const snowB = makePoints(260, 0.34, 0xe6f3ff, soft, false);
    const plank = makePoints(380, 0.13, 0xffffff, soft, true, true);
    const sedi = makePoints(280, 0.38, 0xc9bda6, soft, false);
    const seeds = {
      snowA: Array.from({ length: 1500 }, () => ({ x: rnd() * 56 - 28, y: rnd() * 32, z: rnd() * 18 - 17, fall: 0.22 + rnd() * 0.35, ph: rnd() * 6.28 })),
      snowB: Array.from({ length: 260 }, () => ({ x: rnd() * 60 - 30, y: rnd() * 32, z: rnd() * 8 + 0.5, fall: 0.3 + rnd() * 0.4, ph: rnd() * 6.28 })),
      plank: Array.from({ length: 380 }, () => ({ x: rnd() * 56 - 28, y: rnd() * 32, z: rnd() * 16 - 13, f: 0.6 + rnd() * 2.2, ph: rnd() * 6.28, hue: rnd() })),
      sedi: Array.from({ length: 280 }, () => { const a = rnd() * Math.PI, sp = 0.8 + rnd() * 3.2; return { dx: Math.cos(a) * sp, dy: Math.sin(a) * sp * 0.6 + 0.3, dz: (rnd() - 0.5) * 2, ph: rnd() * 6.28 }; }),
      bub: Array.from({ length: 70 }, () => ({ off: rnd() * 5.5, ph: rnd() * 6.28, dx: rnd() * 0.6 - 0.3, sz: rnd() })),
    };
    return { snowA, snowB, plank, sedi, seeds };
  }, [soft]);

  const bubbles = useMemo(() => {
    if (!bubbleTex) return null;
    return { near: makePoints(24, 0.52, 0xffffff, bubbleTex, false), far: makePoints(46, 0.26, 0xffffff, bubbleTex, false) };
  }, [bubbleTex]);

  useLayoutEffect(() => {
    const tt = frame / FPS;
    const cy = camY(frame);
    const env = envAt(depthAt(frame));
    const dead = frame >= EV.blackout ? 0 : 1;
    const { seeds } = sys;
    // neige marine : deux couches (loin + proche), monte à l'écran quand on descend
    for (const [sys2, sd] of [[sys.snowA, seeds.snowA], [sys.snowB, seeds.snowB]] as const) {
      const p = sys2.pos;
      for (let i = 0; i < sd.length; i++) {
        const s = sd[i];
        p[i * 3] = s.x + 0.35 * Math.sin(tt * 0.35 + s.ph);
        p[i * 3 + 1] = cy + wrap(s.y - s.fall * tt - cy, 32) - 16;
        p[i * 3 + 2] = s.z;
      }
      sys2.geo.getAttribute("position").needsUpdate = true;
    }
    sys.snowA.mat.opacity = 0.55 * env.snow * dead;
    sys.snowB.mat.opacity = 0.35 * env.snow * dead;
    // plancton bioluminescent : scintille (couleur par point)
    {
      const p = sys.plank.pos, c = sys.plank.col!;
      for (let i = 0; i < seeds.plank.length; i++) {
        const s = seeds.plank[i];
        p[i * 3] = s.x + 0.6 * Math.sin(tt * 0.2 + s.ph);
        p[i * 3 + 1] = cy + wrap(s.y - 0.12 * tt - cy, 32) - 16;
        p[i * 3 + 2] = s.z;
        const tw = Math.pow(0.5 + 0.5 * Math.sin(tt * s.f + s.ph), 5);
        c.setXYZ(i, tw * (0.35 + 0.3 * s.hue), tw * 0.9, tw);
      }
      sys.plank.geo.getAttribute("position").needsUpdate = true;
      c.needsUpdate = true;
      sys.plank.mat.opacity = 0.95 * env.plankton * dead;
    }
    // sédiment soulevé à l'atterrissage
    {
      const age = (frame - EV.landing) / FPS;
      const bp = bathyPose(frame);
      const p = sys.sedi.pos;
      for (let i = 0; i < seeds.sedi.length; i++) {
        const s = seeds.sedi[i];
        if (age < 0) { p[i * 3 + 1] = -9999; continue; }
        const k = (1 - Math.exp(-age * 1.3)) / 1.3;
        p[i * 3] = bp.x + s.dx * k + 0.2 * Math.sin(age * 2 + s.ph);
        p[i * 3 + 1] = FLOOR_Y + 0.3 + s.dy * k - 0.12 * age * age;
        p[i * 3 + 2] = bp.z - 0.8 + s.dz * k;
      }
      sys.sedi.geo.getAttribute("position").needsUpdate = true;
      sys.sedi.mat.opacity = age < 0 ? 0 : 0.75 * Math.exp(-age * 0.45) * dead;
    }
    // bulles : émises par le bathyscaphe, remontent
    if (bubbles) {
      const LIFE = 5.5, RISE = 2.6;
      let ni = 0, fi = 0;
      for (let i = 0; i < seeds.bub.length; i++) {
        const s = seeds.bub[i];
        const age = wrap(tt + s.off, LIFE);
        const spawnFrame = frame - age * FPS;
        const near = s.sz > 0.66;
        const sysB = near ? bubbles.near : bubbles.far;
        const idx = near ? ni++ : fi++;
        if (idx * 3 + 2 >= sysB.pos.length) continue;
        if (spawnFrame < 5) { sysB.pos[idx * 3 + 1] = -9999; continue; }
        const bp = bathyPose(spawnFrame);
        const emitter = s.ph < 3 ? [-4.2, -0.4] : [1.2, 2.3]; // hélice ou lampe
        sysB.pos[idx * 3] = bp.x + emitter[0] + s.dx + 0.3 * Math.sin(age * 2.4 + s.ph);
        sysB.pos[idx * 3 + 1] = bp.y + emitter[1] + age * RISE * (0.7 + 0.6 * s.sz);
        sysB.pos[idx * 3 + 2] = bp.z + 0.4 + (near ? 0.8 : -0.3);
      }
      bubbles.near.geo.getAttribute("position").needsUpdate = true;
      bubbles.far.geo.getAttribute("position").needsUpdate = true;
      const vis = (0.75 - 0.35 * smoothstep(EV.landing, EV.landing + 60, frame)) * dead;
      bubbles.near.mat.opacity = vis;
      bubbles.far.mat.opacity = vis * 0.85;
    }
  });

  return (
    <>
      <primitive object={sys.snowA.pts} />
      <primitive object={sys.snowB.pts} />
      <primitive object={sys.plank.pts} />
      <primitive object={sys.sedi.pts} />
      {bubbles && <primitive object={bubbles.near.pts} />}
      {bubbles && <primitive object={bubbles.far.pts} />}
    </>
  );
};
