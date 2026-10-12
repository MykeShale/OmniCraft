import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { EV, FPS, at, camPos, progressAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { mulberry32 } from "../lib/math";
import { META, getSoftTexture, useTex } from "../lib/textures";

/** Particules d'ambiance qui suivent la caméra :
 *  - dust   : poussière/neige/plancton qui tombe lentement (densité env.dust)
 *  - sparks : étincelles scintillantes additives (densité env.sparks)
 *  - emitter: bulles/braises/étincelles qui montent depuis un point (ex. le narrateur)
 *  - burst  : nuage soulevé sur un événement (atterrissage, impact) */
type Props = {
  frame: number;
  emitter?: ((f: number) => { x: number; y: number; z: number }) | null;
  burstEvent?: string | null;
  burstOrigin?: (f: number) => { x: number; y: number; z: number };
  colors?: { dust?: number; sparks?: number; burst?: number; emit?: number };
  emitterTexture?: string; // id d'asset (ex. "bubble"), sinon disque doux
};

function makePoints(count: number, size: number, color: number, map: THREE.Texture, additive: boolean, vertexColors = false) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  if (vertexColors) geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new THREE.PointsMaterial({ size, map, color, transparent: true, depthWrite: false, sizeAttenuation: true, vertexColors, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  return { pts, mat, pos, col: vertexColors ? (geo.getAttribute("color") as THREE.BufferAttribute) : null, geo };
}
const wrap = (v: number, span: number) => ((v % span) + span) % span;

export const Particles: React.FC<Props> = ({ frame, emitter = null, burstEvent = "landing", burstOrigin, colors = {}, emitterTexture = "bubble" }) => {
  const hasEmitTex = !!META[emitterTexture];
  const emitTex = useTex(hasEmitTex ? emitterTexture : "soft");
  const soft = useMemo(() => getSoftTexture(), []);

  const sys = useMemo(() => {
    const rnd = mulberry32(77);
    const dustA = makePoints(1500, 0.15, colors.dust ?? 0xdcefff, soft, false);
    const dustB = makePoints(260, 0.34, colors.dust ?? 0xe6f3ff, soft, false);
    const sparks = makePoints(380, 0.13, 0xffffff, soft, true, true);
    const burst = makePoints(280, 0.38, colors.burst ?? 0xc9bda6, soft, false);
    const seeds = {
      dustA: Array.from({ length: 1500 }, () => ({ x: rnd() * 56, y: rnd() * 32, z: rnd() * 25, fall: 0.22 + rnd() * 0.35, ph: rnd() * 6.28 })),
      dustB: Array.from({ length: 260 }, () => ({ x: rnd() * 60, y: rnd() * 32, z: rnd() * 8, fall: 0.3 + rnd() * 0.4, ph: rnd() * 6.28 })),
      sparks: Array.from({ length: 380 }, () => ({ x: rnd() * 56, y: rnd() * 32, z: rnd() * 17, f: 0.6 + rnd() * 2.2, ph: rnd() * 6.28, hue: rnd() })),
      burst: Array.from({ length: 280 }, () => { const a = rnd() * Math.PI, sp = 0.8 + rnd() * 3.2; return { dx: Math.cos(a) * sp, dy: Math.sin(a) * sp * 0.6 + 0.3, dz: (rnd() - 0.5) * 2, ph: rnd() * 6.28 }; }),
      emit: Array.from({ length: 70 }, () => ({ off: rnd() * 5.5, ph: rnd() * 6.28, dx: rnd() * 0.6 - 0.3, sz: rnd() })),
    };
    return { dustA, dustB, sparks, burst, seeds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soft]);
  const emitSys = useMemo(() => (emitTex ? { near: makePoints(24, 0.52, colors.emit ?? 0xffffff, emitTex, false), far: makePoints(46, 0.26, colors.emit ?? 0xffffff, emitTex, false) } : null), [emitTex, colors.emit]);
  const sparkColor = useMemo(() => new THREE.Color(colors.sparks ?? 0x7fe9ff), [colors.sparks]);

  useLayoutEffect(() => {
    const tt = frame / FPS;
    const c = camPos(frame);
    const env = envAt(progressAt(frame));
    const dead = frame >= (EV.blackout ?? Infinity) ? 0 : 1;
    const { seeds } = sys;
    // boîte qui suit la caméra : x ±28, y ±16, z de -17 à +8 (repli sur chaque axe)
    const place = (p: Float32Array, i: number, x: number, y: number, z: number) => {
      p[i * 3] = c.x + wrap(x - c.x + 28, 56) - 28;
      p[i * 3 + 1] = c.y + wrap(y - c.y + 16, 32) - 16;
      p[i * 3 + 2] = c.z + wrap(z - c.z + 17, 25) - 17;
    };
    for (const [s2, sd] of [[sys.dustA, seeds.dustA], [sys.dustB, seeds.dustB]] as const) {
      for (let i = 0; i < sd.length; i++) { const s = sd[i]; place(s2.pos, i, s.x + 0.35 * Math.sin(tt * 0.35 + s.ph), s.y - s.fall * tt, s.z - 17 + (s2 === sys.dustB ? 17.5 : 0)); }
      s2.geo.getAttribute("position").needsUpdate = true;
    }
    sys.dustA.mat.opacity = 0.55 * env.dust * dead;
    sys.dustB.mat.opacity = 0.35 * env.dust * dead;
    {
      const col = sys.sparks.col!;
      for (let i = 0; i < seeds.sparks.length; i++) {
        const s = seeds.sparks[i];
        place(sys.sparks.pos, i, s.x + 0.6 * Math.sin(tt * 0.2 + s.ph), s.y - 0.12 * tt, s.z - 13);
        const tw = Math.pow(0.5 + 0.5 * Math.sin(tt * s.f + s.ph), 5);
        col.setXYZ(i, tw * sparkColor.r * (0.7 + 0.3 * s.hue), tw * sparkColor.g, tw * sparkColor.b);
      }
      sys.sparks.geo.getAttribute("position").needsUpdate = true;
      col.needsUpdate = true;
      sys.sparks.mat.opacity = 0.95 * env.sparks * dead;
    }
    {
      const f0 = at(burstEvent), age = f0 === undefined ? -1 : (frame - f0) / FPS;
      const o = burstOrigin ? burstOrigin(frame) : { x: c.x, y: c.y - 5, z: c.z - 1 };
      const p = sys.burst.pos;
      for (let i = 0; i < seeds.burst.length; i++) {
        const s = seeds.burst[i];
        if (age < 0) { p[i * 3 + 1] = -99999; continue; }
        const k = (1 - Math.exp(-age * 1.3)) / 1.3;
        p[i * 3] = o.x + s.dx * k + 0.2 * Math.sin(age * 2 + s.ph);
        p[i * 3 + 1] = o.y + 0.3 + s.dy * k - 0.12 * age * age;
        p[i * 3 + 2] = o.z - 0.8 + s.dz * k;
      }
      sys.burst.geo.getAttribute("position").needsUpdate = true;
      sys.burst.mat.opacity = age < 0 ? 0 : 0.75 * Math.exp(-age * 0.45) * dead;
    }
    if (emitSys && emitter) {
      const LIFE = 5.5, RISE = 2.6;
      let ni = 0, fi = 0;
      for (let i = 0; i < seeds.emit.length; i++) {
        const s = seeds.emit[i];
        const age = wrap(tt + s.off, LIFE), spawnFrame = frame - age * FPS;
        const near = s.sz > 0.66, sB = near ? emitSys.near : emitSys.far, idx = near ? ni++ : fi++;
        if (idx * 3 + 2 >= sB.pos.length) continue;
        if (spawnFrame < 5) { sB.pos[idx * 3 + 1] = -99999; continue; }
        const e = emitter(spawnFrame);
        sB.pos[idx * 3] = e.x + s.dx + 0.3 * Math.sin(age * 2.4 + s.ph);
        sB.pos[idx * 3 + 1] = e.y + age * RISE * (0.7 + 0.6 * s.sz);
        sB.pos[idx * 3 + 2] = e.z + (near ? 0.8 : -0.3);
      }
      emitSys.near.geo.getAttribute("position").needsUpdate = true;
      emitSys.far.geo.getAttribute("position").needsUpdate = true;
      emitSys.near.mat.opacity = 0.75 * dead;
      emitSys.far.mat.opacity = 0.65 * dead;
    }
  });

  return (
    <>
      <primitive object={sys.dustA.pts} />
      <primitive object={sys.dustB.pts} />
      <primitive object={sys.sparks.pts} />
      <primitive object={sys.burst.pts} />
      {emitSys && emitter && <primitive object={emitSys.near.pts} />}
      {emitSys && emitter && <primitive object={emitSys.far.pts} />}
    </>
  );
};
