import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useCurrentFrame, useRemotionEnvironment } from "remotion";
import { CAM_Z, EV, FOV, camY, depthAt, shakeAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { smoothstep } from "../lib/math";
import { Bathysphere } from "./Bathysphere";
import { Creatures } from "./Creatures";
import { Effects } from "./Effects";
import { Landmarks } from "./Landmarks";
import { Particles } from "./Particles";
import { Rays } from "./Rays";

type Props = { frame: number; mouth: number; fx?: boolean; fxLevel?: number; hide?: string };

// Filet de sécurité en rendu headless : si un commit React survient après la frame déjà dessinée
// (état arrivé tard), on redessine la scène pour que la capture reflète l'état final.
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

export const World: React.FC<Props> = ({ frame, mouth, fx = true, fxLevel = 4, hide = "" }) => {
  const H = (k: string) => !hide.split(",").includes(k);
  const { camera, scene } = useThree();
  const stuff = useMemo(() => {
    const amb = new THREE.AmbientLight(0xbfe0ff, 1);
    const sun = new THREE.DirectionalLight(0xe6f7ff, 1);
    sun.target = new THREE.Object3D();
    const fog = new THREE.Fog(0x000000, 20, 80);
    const bgColor = new THREE.Color();
    // dégradé de fond (plus clair en haut) qui suit la caméra
    const bgMat = new THREE.ShaderMaterial({
      depthWrite: false, depthTest: false, fog: false,
      uniforms: { uTop: { value: new THREE.Color() }, uBottom: { value: new THREE.Color() } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vUv; uniform vec3 uTop, uBottom; void main(){ float k = smoothstep(0.0, 1.0, vUv.y); gl_FragColor = vec4(mix(uBottom, uTop, k), 1.0); }`,
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(220, 120), bgMat);
    bg.renderOrder = -10;
    bg.frustumCulled = false;
    return { amb, sun, fog, bgColor, bg, bgMat };
  }, []);

  useLayoutEffect(() => {
    const cy = camY(frame);
    const sh = shakeAt(frame);
    const env = envAt(depthAt(frame));
    const dead = frame >= EV.blackout ? 0 : 1;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(sh.x, cy + sh.y, CAM_Z);
    cam.lookAt(sh.x, cy + sh.y, 0);
    cam.rotation.z += sh.r;
    cam.fov = FOV;
    cam.near = 0.5;
    cam.far = 260;
    cam.updateProjectionMatrix();

    const { amb, sun, fog, bgColor, bg, bgMat } = stuff;
    bgColor.setRGB(env.bg[0] * dead, env.bg[1] * dead, env.bg[2] * dead);
    scene.background = bgColor;
    fog.color.copy(bgColor);
    fog.near = env.near;
    fog.far = env.far;
    scene.fog = fog;
    amb.intensity = env.ambient * dead;
    sun.intensity = env.sun * dead;
    sun.position.set(sh.x + 12, cy + 50, 14);
    sun.target.position.set(sh.x, cy, 0);
    sun.target.updateMatrixWorld(true);
    // fond dégradé : un peu plus clair au-dessus, plus sombre en dessous ; s'assombrit avec la profondeur
    const light = 1.25 + 0.35 * env.sun;
    (bgMat.uniforms.uTop.value as THREE.Color).setRGB(env.bg[0] * light * dead, env.bg[1] * light * dead, env.bg[2] * light * dead);
    (bgMat.uniforms.uBottom.value as THREE.Color).setRGB(env.bg[0] * 0.45 * dead, env.bg[1] * 0.45 * dead, env.bg[2] * 0.5 * dead);
    bg.position.set(sh.x, cy + sh.y - 6 * (1 - smoothstep(0, 400, frame)), -95);
  });

  return (
    <>
      {H("bg") && <primitive object={stuff.bg} />}
      <primitive object={stuff.amb} />
      <primitive object={stuff.sun} />
      <primitive object={stuff.sun.target} />
      {H("rays") && <Rays frame={frame} surface={H("surface")} />}
      {H("landmarks") && <Landmarks frame={frame} />}
      {H("creatures") && <Creatures frame={frame} />}
      {H("bathy") && <Bathysphere frame={frame} mouth={mouth} />}
      {H("particles") && <Particles frame={frame} />}
      {fx && <Effects level={fxLevel} />}
      <Readvance />
    </>
  );
};
