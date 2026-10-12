import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { noise2D } from "@remotion/noise";
import { EV, FPS, TL, bathyPose, beat, depthAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { clamp, easeOut, smoothstep } from "../lib/math";
import { META, getSoftTexture, useTex } from "../lib/textures";

const BW = 9.6; // largeur (unités monde) du bathyscaphe

// Matériau non éclairé masqué par un cercle (le hublot) en coordonnées monde
function maskedBasic(tex: THREE.Texture, mask: { c: THREE.Vector3; r: number }) {
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.03, depthWrite: false });
  const uniforms = { uMaskC: { value: mask.c }, uMaskR: { value: mask.r } };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWp;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWp; uniform vec3 uMaskC; uniform float uMaskR;")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (distance(vWp.xy, uMaskC.xy) > uMaskR) discard;");
  };
  mat.customProgramCacheKey = () => "masked-basic";
  return { mat, uniforms };
}

// Cône de lumière volumétrique (éventail additif)
function makeCone(length: number, halfAngle: number, color: string) {
  const geo = new THREE.PlaneGeometry(length, 2 * length * Math.tan(halfAngle), 24, 8);
  geo.translate(length / 2, 0, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uI: { value: 0 }, uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; uniform float uTime; void main(){ vUv = uv; vec3 p = position; p.y *= uv.x; p.y += sin(uTime*0.8 + uv.x*3.0)*0.15*uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uI; uniform vec3 uColor; uniform float uTime;
      void main(){ float a = pow(max(0.0, 1.0 - vUv.x), 1.6) * pow(max(0.0, 1.0 - abs(vUv.y*2.0-1.0)), 1.4);
        a *= 0.85 + 0.15*sin(vUv.x*40.0 - uTime*2.0) ; gl_FragColor = vec4(uColor * a * uI, a * uI); }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return { mesh, mat };
}

type Props = { frame: number; mouth: number };

export const Bathysphere: React.FC<Props> = ({ frame, mouth }) => {
  const texBody = useTex("bathysphere");
  const texProf = useTex("professor-body");
  const texHead = useTex("professor-head");
  const texMust = useTex("professor-mustache");
  const texBrowL = useTex("professor-brow-l");
  const texBrowR = useTex("professor-brow-r");
  const texHand = useTex("professor-hand");
  const ready = texBody && texProf && texHead && texMust && texBrowL && texBrowR && texHand;

  const rig = useMemo(() => {
    if (!ready) return null;
    const m = META.bathysphere;
    const px = BW / m.w; // unités par pixel de l'image du bathyscaphe
    const BH = m.h * px;
    const ph = m.porthole!;
    const pc = new THREE.Vector3((ph.cx / m.w - 0.5) * BW, (0.5 - ph.cy / m.h) * BH, 0);
    const pr = ph.r * px;
    const lamp = new THREE.Vector3((m.lamp!.x / m.w - 0.5) * BW, (0.5 - m.lamp!.y / m.h) * BH, 0.05);

    const group = new THREE.Group();

    // --- professeur derrière le hublot
    const PX = 478, PY = 470; // point de l'image du professeur aligné sur le centre du hublot
    const s = (2.75 * pr) / 650; // échelle : la tête (650 px) fait ~1.4 x le diamètre du hublot
    const mask = { c: new THREE.Vector3(), r: pr * 0.985 };
    const parts: Record<string, THREE.Mesh> = {};
    const uniformsList: { uMaskC: { value: THREE.Vector3 } }[] = [];
    const partMesh = (id: string, tex: THREE.Texture, z: number) => {
      const pm = META[id];
      const geo = new THREE.PlaneGeometry(pm.w * s, pm.h * s);
      const { mat, uniforms } = maskedBasic(tex, mask);
      uniformsList.push(uniforms);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pc.x + (pm.ox + pm.w / 2 - PX) * s, pc.y - (pm.oy + pm.h / 2 - PY) * s, z);
      mesh.frustumCulled = false;
      parts[id] = mesh;
      return mesh;
    };
    // fond sombre de la cabine
    const cabin = new THREE.Mesh(new THREE.CircleGeometry(pr * 1.02, 48), new THREE.MeshBasicMaterial({ color: 0x120c06 }));
    cabin.position.set(pc.x, pc.y, -0.5);
    group.add(cabin);
    const body = partMesh("professor-body", texProf!, -0.32);
    group.add(body);
    // pivot du cou pour la tête
    const neck = META["professor-body"].neck!;
    const headPivot = new THREE.Group();
    headPivot.position.set(pc.x + (neck.x - PX) * s, pc.y - (neck.y - PY) * s, -0.3);
    const head = partMesh("professor-head", texHead!, 0);
    head.position.sub(headPivot.position).setZ(0.0);
    headPivot.add(head);
    const must = partMesh("professor-mustache", texMust!, 0);
    must.position.sub(headPivot.position).setZ(0.02);
    headPivot.add(must);
    const browL = partMesh("professor-brow-l", texBrowL!, 0);
    browL.position.sub(headPivot.position).setZ(0.02);
    headPivot.add(browL);
    const browR = partMesh("professor-brow-r", texBrowR!, 0);
    browR.position.sub(headPivot.position).setZ(0.02);
    headPivot.add(browR);
    group.add(headPivot);
    // main qui pointe (asset séparé), monte depuis le bas du hublot
    const hm = META["professor-hand"];
    const handH = pr * 1.25, handW = handH * (hm.w / hm.h);
    const hand = new THREE.Mesh(new THREE.PlaneGeometry(handW, handH), maskedBasic(texHand!, mask).mat);
    (hand.material as THREE.MeshBasicMaterial).onBeforeCompile && uniformsList.push({ uMaskC: { value: mask.c } });
    hand.position.set(pc.x - pr * 0.55, pc.y - pr * 1.4, -0.25);
    hand.frustumCulled = false;
    group.add(hand);
    // reflets sur la vitre
    const glassTex = getSoftTexture();
    const glass = new THREE.Mesh(new THREE.CircleGeometry(pr, 48), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending }));
    glass.position.set(pc.x, pc.y, -0.1);
    group.add(glass);
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(pr * 2.2, pr * 0.35), new THREE.MeshBasicMaterial({ map: glassTex, color: 0xcfeaff, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
    streak.position.set(pc.x, pc.y, -0.08);
    streak.rotation.z = -0.7;
    group.add(streak);
    // reflets sur les lunettes (glissent de temps en temps)
    const eyes = META["professor-body"].eyes!;
    const glints = eyes.map((e) => {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(pr * 0.5, pr * 0.14), new THREE.MeshBasicMaterial({ map: glassTex, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      g.position.set((e.x - PX) * s - headPivot.position.x + pc.x, -(e.y - PY) * s - headPivot.position.y + pc.y, 0.05);
      g.rotation.z = -0.5;
      headPivot.add(g);
      return g;
    });

    // --- coque (devant), hublot percé
    const bodyMesh = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), new THREE.MeshStandardMaterial({ map: texBody!, transparent: true, alphaTest: 0.04, roughness: 0.55, metalness: 0.35, emissive: new THREE.Color(0xffffff), emissiveMap: texBody!, emissiveIntensity: 0.12 }));
    bodyMesh.position.z = 0;
    bodyMesh.frustumCulled = false;
    group.add(bodyMesh);

    // --- lampe : halo + cônes + vraie lumière
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: glassTex, color: 0xffd9a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    halo.position.copy(lamp).setZ(0.2);
    group.add(halo);
    const coneA = makeCone(42, 0.30, "#ffd8a6");
    const coneB = makeCone(30, 0.14, "#fff1d6");
    const coneGroup = new THREE.Group();
    coneGroup.position.copy(lamp).setZ(0.1);
    coneGroup.rotation.z = -0.36;
    coneGroup.add(coneA.mesh, coneB.mesh);
    group.add(coneGroup);
    const spot = new THREE.SpotLight(0xffe2b8, 0, 90, 0.5, 0.7, 1.4);
    spot.target = new THREE.Object3D();
    const interior = new THREE.PointLight(0xffb060, 0, 7, 2);
    interior.position.copy(pc).setZ(1.2);
    group.add(interior);

    // ombre douce sous la sphère quand posée : petite ellipse sombre
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(BW * 0.9, 1.4), new THREE.MeshBasicMaterial({ map: glassTex, color: 0x000000, transparent: true, opacity: 0, depthWrite: false }));
    shadow.position.set(0.2, -BH / 2 + 0.2, -0.6);

    return { group, pc, pr, lamp, headPivot, must, browL, browR, hand, halo, coneA, coneB, spot, interior, mask, uniformsList, glints, glass, streak, shadow, BH, s, handRest: pc.y - pr * 1.4, mustRest: must.position.clone(), browLRest: browL.position.clone(), browRRest: browR.position.clone() };
  }, [ready, texBody, texProf, texHead, texMust, texBrowL, texBrowR, texHand]);

  useLayoutEffect(() => {
    if (!rig) return;
    const t = frame / FPS;
    const pose = bathyPose(frame);
    const env = envAt(depthAt(frame));
    const { group } = rig;
    group.position.set(pose.x, pose.y, pose.z);
    group.rotation.z = pose.rot;
    group.updateMatrixWorld(true);
    // centre monde du hublot pour le masque
    const c = rig.pc.clone().applyMatrix4(group.matrixWorld);
    rig.mask.c.copy(c);

    // --- jeu du professeur
    const b4 = beat("04-midnight"), b9 = beat("09-end");
    // recul devant la baudroie, sursaut au frôlement, regard vers le haut quand l'œil s'ouvre
    const recoil = smoothstep(b4.start + 110, b4.start + 150, frame) * (1 - smoothstep(b4.end + 20, b4.end + 60, frame));
    const jolt = Math.exp(-Math.max(0, frame - EV.squidBrush) / 18) * (frame >= EV.squidBrush ? 1 : 0);
    const lookUp = smoothstep(EV.eyeOpen, EV.eyeOpen + 40, frame);
    const nod = 0.045 * noise2D("nod", t * 0.35, 0) + 0.02 * Math.sin(t * 1.7);
    rig.headPivot.rotation.z = nod + recoil * 0.09 - jolt * 0.12 * Math.sin((frame - EV.squidBrush) * 0.9) + lookUp * 0.06;
    rig.headPivot.position.y = rig.headPivot.position.y; // pivot fixe
    const headLift = recoil * 0.12 + lookUp * 0.2 + jolt * 0.15;
    rig.headPivot.children.forEach((ch) => { /* la tête est déjà positionnée relativement au pivot */ void ch; });
    rig.headPivot.scale.setScalar(1 + recoil * 0.02);
    rig.headPivot.position.z = -0.3 + headLift * 0.001;

    // bouche : la moustache s'étire vers le bas et descend
    const m = clamp(mouth, 0, 1);
    const mustStretch = 1 + m * 0.42;
    rig.must.scale.y = mustStretch;
    const mh = META["professor-mustache"].h * rig.s;
    rig.must.position.y = rig.mustRest.y - (mustStretch - 1) * mh * 0.5 - m * 0.04;
    // sourcils : montent avec l'emphase et les événements
    const emph = m * 0.8 + recoil * 1.2 + jolt * 1.4 + lookUp * 1.1 + 0.25 * Math.max(0, noise2D("brow", t * 0.9, 0));
    const lift = clamp(emph, 0, 1.6) * 0.09;
    rig.browL.position.y = rig.browLRest.y + lift;
    rig.browR.position.y = rig.browRRest.y + lift * 1.1;
    rig.browL.rotation.z = lift * 0.6;
    rig.browR.rotation.z = -lift * 0.6;

    // main : monte au début de chaque réplique (sauf la dernière)
    let handUp = 0;
    for (const bt of TL.beats) {
      if (bt.id === "09-end" || bt.id === "00-surface") continue;
      const a = smoothstep(bt.start + 12, bt.start + 40, frame) * (1 - smoothstep(bt.start + 95, bt.start + 130, frame));
      handUp = Math.max(handUp, easeOut(a));
    }
    const handWave = handUp * 0.06 * Math.sin(t * 6.0);
    rig.hand.position.y = rig.handRest + handUp * rig.pr * 1.05;
    rig.hand.rotation.z = -0.15 + handWave + handUp * 0.1;

    // reflets de lunettes : glissent tous les ~9 s
    for (let i = 0; i < rig.glints.length; i++) {
      const g = rig.glints[i];
      const cyc = ((t + i * 1.3) % 9.5) / 9.5;
      const k = smoothstep(0.0, 0.5, cyc) * (1 - smoothstep(0.5, 1.0, cyc));
      const win = cyc < 0.16 ? Math.sin((cyc / 0.16) * Math.PI) : 0;
      (g.material as THREE.MeshBasicMaterial).opacity = 0.55 * win * (0.4 + 0.6 * env.spot) + 0 * k;
      g.position.x += 0; // position fixe, on anime l'opacité et un léger glissement
      g.position.x = g.position.x;
    }
    // vitre : plus visible en surface (reflets du ciel), discrète au fond
    (rig.glass.material as THREE.MeshBasicMaterial).opacity = 0.05 + 0.12 * env.sun;
    (rig.streak.material as THREE.MeshBasicMaterial).opacity = 0.10 + 0.25 * env.sun;
    rig.streak.rotation.z = -0.7 + 0.08 * Math.sin(t * 0.4);

    // --- lampe : s'allume avec la profondeur, vacille avant le noir, s'éteint au noir
    const flicker = frame > EV.eyeOpen ? 0.65 + 0.35 * (noise2D("fl", frame * 0.9, 0) > 0.25 ? 1 : 0) * (0.5 + 0.5 * noise2D("fl2", frame * 0.3, 1)) : 1;
    const dead = frame >= EV.blackout ? 0 : 1;
    const fadeStart = 1 - smoothstep(EV.blackout - 8, EV.blackout, frame);
    const spotI = env.spot * flicker * dead * fadeStart;
    (rig.halo.material as THREE.MeshBasicMaterial).opacity = 0.9 * spotI;
    rig.halo.scale.setScalar(1 + 0.08 * Math.sin(t * 9));
    rig.coneA.mat.uniforms.uI.value = 0.55 * spotI * (1 - 0.5 * env.sun);
    rig.coneB.mat.uniforms.uI.value = 0.45 * spotI;
    rig.coneA.mat.uniforms.uTime.value = t;
    rig.coneB.mat.uniforms.uTime.value = t;
    // vraie lumière
    const lw = rig.lamp.clone().applyMatrix4(group.matrixWorld);
    rig.spot.position.copy(lw).setZ(lw.z + 1.5);
    rig.spot.target.position.set(lw.x + 30, lw.y - 11, lw.z - 12);
    rig.spot.target.updateMatrixWorld(true);
    rig.spot.intensity = 1800 * spotI;
    rig.interior.intensity = 2.5 * dead;
    (rig.shadow.material as THREE.MeshBasicMaterial).opacity = 0.5 * smoothstep(EV.landing - 20, EV.landing + 30, frame);
  });

  if (!rig) return null;
  return (
    <>
      <primitive object={rig.group} />
      <primitive object={rig.spot} />
      <primitive object={rig.spot.target} />
      <primitive object={rig.shadow} />
    </>
  );
};
