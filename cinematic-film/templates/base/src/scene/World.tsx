import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useRemotionEnvironment } from "remotion";
import { NARRATOR } from "../film.config";
import { CAM_Z, EV, FOV, camPos, progressAt, shakeAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { META } from "../lib/textures";
import { Effects } from "./Effects";
import { Narrator, narratorPose } from "./Narrator";
import { Particles } from "./Particles";
import { Rays } from "./Rays";
import { Story } from "./Story";

type Props = { frame: number; mouth: number; fx?: boolean; fxLevel?: number };

// Filet de sécurité en rendu headless : si un commit React survient après la frame déjà dessinée, on redessine.
const Readvance: React.FC = () => {
  const advance = useThree((s) => s.advance);
  const frame = useCurrentFrame();
  const { isRendering } = useRemotionEnvironment();
  const last = useRef(-1);
  useEffect(() => {
    if (!isRendering) return;
    if (last.current !== frame) { last.current = frame; return; }
    advance(performance.now());
  });
  return null;
};

export const World: React.FC<Props> = ({ frame, mouth, fx = true, fxLevel = 4 }) => {
  const { camera, scene } = useThree();
  const stuff = useMemo(() => {
    const amb = new THREE.AmbientLight(0xbfe0ff, 1);
    const sun = new THREE.DirectionalLight(0xe6f7ff, 1);
    sun.target = new THREE.Object3D();
    const fog = new THREE.Fog(0x000000, 20, 80);
    const bgColor = new THREE.Color();
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false, depthTest: false, fog: false,
      uniforms: { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform vec3 uTop, uBottom; void main(){ gl_FragColor = vec4(mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y)), 1.0); }`,
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(220, 120), bgMat);
    bg.renderOrder = -10;
    bg.frustumCulled = false;
    return { amb, sun, fog, bgColor, bg, bgMat };
  }, []);

  useLayoutEffect(() => {
    const c = camPos(frame), sh = shakeAt(frame);
    const env = envAt(progressAt(frame));
    const dead = frame >= (EV.blackout ?? Infinity) ? 0 : 1;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(c.x + sh.x, c.y + sh.y, c.z + CAM_Z);
    cam.lookAt(c.x + sh.x, c.y + sh.y, c.z);
    cam.rotation.z += sh.r;
    cam.fov = FOV; cam.near = 0.5; cam.far = 260;
    cam.updateProjectionMatrix();
    const { amb, sun, fog, bgColor, bg, bgMat } = stuff;
    bgColor.setRGB(env.bg[0] * dead, env.bg[1] * dead, env.bg[2] * dead);
    scene.background = bgColor;
    fog.color.copy(bgColor); fog.near = env.near; fog.far = env.far; scene.fog = fog;
    amb.intensity = env.ambient * dead;
    sun.intensity = env.sun * dead;
    sun.position.set(c.x + sh.x + 12, c.y + 50, c.z + 14);
    sun.target.position.set(c.x + sh.x, c.y, c.z);
    sun.target.updateMatrixWorld(true);
    const light = 1.25 + 0.35 * env.sun;
    (bgMat.uniforms.uTop.value as THREE.Color).setRGB(env.bg[0] * light * dead, env.bg[1] * light * dead, env.bg[2] * light * dead);
    (bgMat.uniforms.uBottom.value as THREE.Color).setRGB(env.bg[0] * 0.45 * dead, env.bg[1] * 0.45 * dead, env.bg[2] * 0.5 * dead);
    bg.position.set(c.x + sh.x, c.y + sh.y, c.z - 95);
  });

  const hasNarrator = !!META[`${NARRATOR.portrait}-head`];
  const emitter = hasNarrator ? (f: number) => { const p = narratorPose(f); return { x: p.x - NARRATOR.width * 0.44, y: p.y - 0.4, z: p.z + 0.4 }; } : null;

  return (
    <>
      <primitive object={stuff.bg} />
      <primitive object={stuff.amb} />
      <primitive object={stuff.sun} />
      <primitive object={stuff.sun.target} />
      <Rays frame={frame} />
      <Story frame={frame} />
      {hasNarrator && <Narrator frame={frame} mouth={mouth} />}
      <Particles frame={frame} emitter={emitter} burstOrigin={hasNarrator ? (f) => { const p = narratorPose(f); return { x: p.x, y: p.y - NARRATOR.width * 0.5, z: p.z - 0.5 }; } : undefined} />
      {fx && <Effects level={fxLevel} />}
      <Readvance />
    </>
  );
};
