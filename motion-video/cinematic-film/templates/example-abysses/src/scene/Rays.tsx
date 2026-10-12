import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { FPS, depthAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { mulberry32 } from "../lib/math";
import { SwimSprite } from "./SwimSprite";

// Rayons de soleil (plans additifs) accrochés à la surface, visibles jusqu'à ~600 m
export const Rays: React.FC<{ frame: number; surface?: boolean }> = ({ frame, surface = true }) => {
  const built = useMemo(() => {
    const rnd = mulberry32(31);
    const group = new THREE.Group();
    const items: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; tilt: number; k: number; ph: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const w = 0.8 + rnd() * 3.2;
      const geo = new THREE.PlaneGeometry(w, 90, 1, 1);
      geo.translate(0, -45, 0);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uI: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        // max(0,…) obligatoire : pow d'une base négative = NaN, et un NaN contamine tout le bloom
        fragmentShader: `varying vec2 vUv; uniform float uI; void main(){ float a = pow(max(0.0, 1.0 - abs(vUv.x*2.0-1.0)), 1.8) * pow(max(0.0, vUv.y), 1.4); gl_FragColor = vec4(vec3(0.75, 0.95, 1.0) * a * uI, a * uI); }`,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      const tilt = (rnd() - 0.5) * 0.5;
      mesh.position.set(rnd() * 56 - 28, 14, -12 + rnd() * 10);
      mesh.rotation.z = tilt;
      group.add(mesh);
      items.push({ mesh, mat, tilt, k: 0.5 + rnd() * 0.8, ph: rnd() * 6.28 });
    }
    return { group, items };
  }, []);

  useLayoutEffect(() => {
    const t = frame / FPS;
    const env = envAt(depthAt(frame));
    for (const it of built.items) {
      it.mat.uniforms.uI.value = env.sun * 0.16 * it.k * (0.55 + 0.45 * Math.sin(t * 0.45 + it.ph));
      it.mesh.rotation.z = it.tilt + 0.05 * Math.sin(t * 0.22 + it.ph);
    }
    built.group.visible = env.sun > 0.001;
  });

  const env = envAt(depthAt(frame));
  return (
    <>
      <primitive object={built.group} />
      {/* dessous de la surface */}
      {surface && <SwimSprite id="surface" frame={frame} width={80} x={2} y={4} z={-9} mode="static" unlit opacity={0.85 * Math.min(1, env.sun)} depthWrite={false} visible={env.sun > 0.001} />}
    </>
  );
};
