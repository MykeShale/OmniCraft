import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { FPS } from "../lib/camera";
import { aspect, useTex } from "../lib/textures";

export type SwimMode = "fish" | "jelly" | "squid" | "static";
const MODE_IDX: Record<SwimMode, number> = { fish: 0, jelly: 1, squid: 2, static: 3 };

// Déformation de nage injectée dans le vertex shader (repère local du plan)
const SWIM_GLSL = /* glsl */ `
{
  float u = clamp(transformed.x / uSize.x + 0.5, 0.0, 1.0);
  float v = clamp(transformed.y / uSize.y + 0.5, 0.0, 1.0);
  if (uMode < 0.5) {
    // poisson : tête à gauche (u=0), l'onde grandit vers la queue
    float k = u * u;
    float w = sin(u * uFreq * 6.28318 - uTime + uPhase);
    transformed.y += w * uAmp * k;
    transformed.x += w * uAmp * 0.12 * k;
    transformed.z += w * uAmp * 0.35 * k;
  } else if (uMode < 1.5) {
    // méduse : cloche en haut (v=1) qui pulse, tentacules qui ondulent
    float bell = smoothstep(0.5, 0.8, v);
    float pulse = sin(uTime + uPhase);
    transformed.x *= 1.0 + 0.09 * pulse * bell;
    transformed.y += 0.012 * uSize.y * pulse * bell;
    float tent = 1.0 - smoothstep(0.0, 0.62, v);
    transformed.x += sin(v * 7.0 - uTime * 0.7 + uPhase) * uAmp * tent;
    transformed.x += sin(v * 15.0 + uTime * 0.4 + uPhase * 2.0) * uAmp * 0.3 * tent;
  } else if (uMode < 2.5) {
    // calmar : tête à gauche, tentacules souples à droite
    float k = pow(u, 2.4);
    transformed.y += sin(u * uFreq * 6.28318 - uTime + uPhase) * uAmp * k;
    transformed.y += sin(u * 13.0 - uTime * 1.6) * uAmp * 0.28 * k;
    transformed.x += sin(u * 9.0 - uTime * 1.1) * uAmp * 0.15 * k;
  }
}
`;

export type SwimSpriteProps = {
  id: string;
  frame: number;
  width: number;
  x: number; y: number; z: number;
  rot?: number;
  flip?: boolean;
  mode?: SwimMode;
  amp?: number; freq?: number; speed?: number; phase?: number;
  emissive?: number;
  opacity?: number;
  unlit?: boolean;
  scaleY?: number;
  depthWrite?: boolean;
  renderOrder?: number;
  visible?: boolean;
  tint?: string;
  noFog?: boolean;
};

export const SwimSprite: React.FC<SwimSpriteProps> = (p) => {
  const tex = useTex(p.id);
  const mode = p.mode ?? "fish";
  const unlit = p.unlit ?? false;
  const depthWrite = p.depthWrite ?? true;

  const built = useMemo(() => {
    if (!tex) return null;
    const w = p.width, h = w / aspect(p.id);
    const segs = mode === "static" ? 1 : 40;
    const geo = new THREE.PlaneGeometry(w, h, segs, mode === "static" ? 1 : 24);
    const uniforms = {
      uTime: { value: 0 }, uAmp: { value: p.amp ?? 0.3 }, uFreq: { value: p.freq ?? 1.2 },
      uPhase: { value: p.phase ?? 0 }, uMode: { value: MODE_IDX[mode] }, uSize: { value: new THREE.Vector2(w, h) },
    };
    const common = { map: tex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide, depthWrite };
    const mat = unlit
      ? new THREE.MeshBasicMaterial({ ...common })
      : new THREE.MeshStandardMaterial({ ...common, roughness: 0.92, metalness: 0, emissive: new THREE.Color(0xffffff), emissiveMap: tex, emissiveIntensity: p.emissive ?? 0 });
    if (p.tint) mat.color = new THREE.Color(p.tint);
    if (p.noFog) mat.fog = false;
    if (mode !== "static") {
      mat.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, uniforms);
        sh.vertexShader = sh.vertexShader
          .replace("#include <common>", "#include <common>\nuniform float uTime, uAmp, uFreq, uPhase, uMode; uniform vec2 uSize;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\n" + SWIM_GLSL);
      };
      mat.customProgramCacheKey = () => "swim-" + (unlit ? "b" : "s");
    }
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    return { mesh, mat, uniforms };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, p.id, p.width, mode, unlit, depthWrite, p.tint, p.noFog]);

  useLayoutEffect(() => {
    if (!built) return;
    const { mesh, mat, uniforms } = built;
    mesh.position.set(p.x, p.y, p.z);
    mesh.rotation.z = p.rot ?? 0;
    mesh.scale.set(p.flip ? -1 : 1, p.scaleY ?? 1, 1);
    mesh.visible = p.visible ?? true;
    mesh.renderOrder = p.renderOrder ?? 0;
    uniforms.uTime.value = (p.frame / FPS) * (p.speed ?? 2.5);
    uniforms.uAmp.value = p.amp ?? 0.3;
    uniforms.uFreq.value = p.freq ?? 1.2;
    uniforms.uPhase.value = p.phase ?? 0;
    mat.opacity = p.opacity ?? 1;
    if (mat instanceof THREE.MeshStandardMaterial) mat.emissiveIntensity = p.emissive ?? 0;
  });

  return built ? <primitive object={built.mesh} /> : null;
};
