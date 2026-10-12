import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { CAMERA } from "../film.config";
import { FPS, camPos, progressAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { mulberry32 } from "../lib/math";

/** Rayons de lumière volumétriques (plans additifs) venant du haut, visibles tant que env.sun > 0.
 *  Ancrés au point de départ (y = top) : quand la caméra descend ils s'éloignent, quand elle avance ils la suivent. */
export const Rays: React.FC<{ frame: number; top?: number; color?: [number, number, number] }> = ({ frame, top = 14, color = [0.75, 0.95, 1.0] }) => {
  const built = useMemo(() => {
    const rnd = mulberry32(31);
    const group = new THREE.Group();
    const items: { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; tilt: number; k: number; ph: number; x: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const w = 0.8 + rnd() * 3.2;
      const geo = new THREE.PlaneGeometry(w, 90, 1, 1);
      geo.translate(0, -45, 0);
      const mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { uI: { value: 0 }, uColor: { value: new THREE.Vector3(...color) } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        // max(0,…) : pow d'une base négative = NaN, et un NaN contamine tout le bloom
        fragmentShader: `varying vec2 vUv; uniform float uI; uniform vec3 uColor; void main(){ float a = pow(max(0.0, 1.0 - abs(vUv.x*2.0-1.0)), 1.8) * pow(max(0.0, vUv.y), 1.4); gl_FragColor = vec4(uColor * a * uI, a * uI); }`,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.frustumCulled = false;
      const tilt = (rnd() - 0.5) * 0.5, x = rnd() * 56 - 28;
      mesh.position.set(x, top, -12 + rnd() * 10);
      mesh.rotation.z = tilt;
      group.add(mesh);
      items.push({ mesh, mat, tilt, k: 0.5 + rnd() * 0.8, ph: rnd() * 6.28, x });
    }
    return { group, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const t = frame / FPS;
    const env = envAt(progressAt(frame));
    const c = camPos(frame);
    for (const it of built.items) {
      it.mat.uniforms.uI.value = env.sun * 0.16 * it.k * (0.55 + 0.45 * Math.sin(t * 0.45 + it.ph));
      it.mesh.rotation.z = it.tilt + 0.05 * Math.sin(t * 0.22 + it.ph);
      it.mesh.position.x = it.x + (CAMERA.axis === "x" ? c.x : 0);
      it.mesh.position.y = top + (CAMERA.axis === "y" ? 0 : c.y);
    }
    built.group.visible = env.sun > 0.001;
  });

  return <primitive object={built.group} />;
};
