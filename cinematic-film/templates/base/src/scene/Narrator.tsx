import React, { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { noise2D } from "@remotion/noise";
import { NARRATOR } from "../film.config";
import { EV, FPS, TL, at, camPos, progressAt, shakeAt } from "../lib/camera";
import { envAt } from "../lib/env";
import { clamp, easeOut, smoothstep } from "../lib/math";
import { META, getSoftTexture, useTex } from "../lib/textures";

/** Le narrateur : portrait découpé (corps, tête pivotante, bouche synchronisée sur la voix, sourcils, main),
 *  vu à travers le hublot d'un véhicule (optionnel) avec projecteur. Tout est piloté par NARRATOR (film.config). */

// pose du narrateur : accroché à la caméra, flotte, se pose sur settleOn
export const narratorPose = (f: number) => {
  const t = f / FPS, c = camPos(f);
  const settleF = at(NARRATOR.settleOn);
  const settled = settleF === undefined ? 0 : smoothstep(settleF - 20, settleF + 40, f);
  const bob = (1 - settled) * 0.32 * noise2D("bob", t * 0.22, 0);
  const since = settleF === undefined ? 0 : Math.max(0, f - settleF);
  const landDrop = settled * 0.45 - 0.3 * Math.exp(-since / 14) * Math.cos(since * 0.42) * settled;
  const sh = shakeAt(f);
  return {
    x: c.x + NARRATOR.offset.u + 0.22 * noise2D("bx", t * 0.17, 0) * (1 - settled),
    y: c.y + NARRATOR.offset.v + bob - landDrop,
    z: c.z + NARRATOR.offset.z,
    rot: 0.035 * noise2D("br", t * 0.2, 0) * (1 - settled) + sh.r * 0.6,
    settled,
  };
};

// matériau non éclairé masqué par un disque (le hublot), en coordonnées monde
function maskedBasic(tex: THREE.Texture, mask: { c: THREE.Vector3; r: number } | null) {
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.03, depthWrite: false });
  if (!mask) return mat;
  const uniforms = { uMaskC: { value: mask.c }, uMaskR: { value: mask.r } };
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, uniforms);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying vec3 vWp;").replace("#include <project_vertex>", "#include <project_vertex>\nvWp = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec3 vWp; uniform vec3 uMaskC; uniform float uMaskR;").replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (distance(vWp.xy, uMaskC.xy) > uMaskR) discard;");
  };
  mat.customProgramCacheKey = () => "masked-basic";
  return mat;
}
function makeCone(length: number, halfAngle: number, color: string) {
  const geo = new THREE.PlaneGeometry(length, 2 * length * Math.tan(halfAngle), 24, 8);
  geo.translate(length / 2, 0, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uI: { value: 0 }, uColor: { value: new THREE.Color(color) }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; uniform float uTime; void main(){ vUv = uv; vec3 p = position; p.y *= uv.x; p.y += sin(uTime*0.8 + uv.x*3.0)*0.15*uv.x; gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uI; uniform vec3 uColor; uniform float uTime;
      void main(){ float a = pow(max(0.0, 1.0 - vUv.x), 1.6) * pow(max(0.0, 1.0 - abs(vUv.y*2.0-1.0)), 1.4); a *= 0.85 + 0.15*sin(vUv.x*40.0 - uTime*2.0); gl_FragColor = vec4(uColor * a * uI, a * uI); }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return { mesh, mat };
}

type Props = { frame: number; mouth: number };

export const Narrator: React.FC<Props> = ({ frame, mouth }) => {
  const P = NARRATOR.portrait;
  const hasVehicle = !!(NARRATOR.vehicle && META[NARRATOR.vehicle]);
  const hasHand = !!(NARRATOR.hand && META[NARRATOR.hand]);
  const ids = { body: `${P}-body`, head: `${P}-head`, mouth: `${P}-mouth`, bl: `${P}-brow-l`, br: `${P}-brow-r` };
  const texVehicle = useTex(hasVehicle ? NARRATOR.vehicle! : "soft");
  const texBody = useTex(ids.body), texHead = useTex(ids.head), texMouth = useTex(ids.mouth), texBL = useTex(ids.bl), texBR = useTex(ids.br);
  const texHand = useTex(hasHand ? NARRATOR.hand! : "soft");
  const ready = texVehicle && texBody && texHead && texMouth && texBL && texBR && texHand && META[ids.body] && META[ids.head];

  const rig = useMemo(() => {
    if (!ready) return null;
    const group = new THREE.Group();
    const soft = getSoftTexture();
    // --- repère : centre du hublot (pc), rayon (pr) ; sans véhicule, un cercle virtuel au centre du portrait
    let pc = new THREE.Vector3(0, 0, 0), pr = NARRATOR.width * 0.35, lamp: THREE.Vector3 | null = null, mask: { c: THREE.Vector3; r: number } | null = null;
    let bodyMesh: THREE.Mesh | null = null;
    if (hasVehicle) {
      const m = META[NARRATOR.vehicle!];
      const px = NARRATOR.width / m.w, BH = m.h * px;
      const hole = m.hole ?? { cx: m.w / 2, cy: m.h / 2, r: m.w * 0.2 };
      pc = new THREE.Vector3((hole.cx / m.w - 0.5) * NARRATOR.width, (0.5 - hole.cy / m.h) * BH, 0);
      pr = hole.r * px;
      mask = { c: new THREE.Vector3(), r: pr * 0.985 };
      const lp = (m.points?.lamp as number[] | undefined) ?? [m.w * 0.8, m.h * 0.2];
      lamp = new THREE.Vector3((lp[0] / m.w - 0.5) * NARRATOR.width, (0.5 - lp[1] / m.h) * BH, 0.05);
      bodyMesh = new THREE.Mesh(new THREE.PlaneGeometry(NARRATOR.width, BH), new THREE.MeshStandardMaterial({ map: texVehicle!, transparent: true, alphaTest: 0.04, roughness: 0.55, metalness: 0.35, emissive: new THREE.Color(0xffffff), emissiveMap: texVehicle!, emissiveIntensity: 0.12 }));
      bodyMesh.frustumCulled = false;
      const cabin = new THREE.Mesh(new THREE.CircleGeometry(pr * 1.02, 48), new THREE.MeshBasicMaterial({ color: 0x120c06 }));
      cabin.position.set(pc.x, pc.y, -0.5);
      group.add(cabin);
    }
    // --- portrait en pièces, alignées dans le repère de l'image source
    const PX = NARRATOR.align.x, PY = NARRATOR.align.y;
    const headH = META[ids.head].h;
    const s = (NARRATOR.headScale * pr) / headH; // unités par pixel du portrait
    const part = (id: string, tex: THREE.Texture, z: number) => {
      const pm = META[id];
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(pm.w * s, pm.h * s), maskedBasic(tex, mask));
      mesh.position.set(pc.x + (pm.ox + pm.w / 2 - PX) * s, pc.y - (pm.oy + pm.h / 2 - PY) * s, z);
      mesh.frustumCulled = false;
      return mesh;
    };
    group.add(part(ids.body, texBody!, -0.32));
    const neck = (META[ids.body].points?.neck as number[] | undefined) ?? [PX, PY + headH * 0.35];
    const headPivot = new THREE.Group();
    headPivot.position.set(pc.x + (neck[0] - PX) * s, pc.y - (neck[1] - PY) * s, -0.3);
    const head = part(ids.head, texHead!, 0); head.position.sub(headPivot.position).setZ(0); headPivot.add(head);
    const mouthM = part(ids.mouth, texMouth!, 0); mouthM.position.sub(headPivot.position).setZ(0.02); headPivot.add(mouthM);
    const browL = part(ids.bl, texBL!, 0); browL.position.sub(headPivot.position).setZ(0.02); headPivot.add(browL);
    const browR = part(ids.br, texBR!, 0); browR.position.sub(headPivot.position).setZ(0.02); headPivot.add(browR);
    group.add(headPivot);
    // reflets de lunettes / yeux
    const eyes = (META[ids.body].points?.eyes as number[][] | undefined) ?? [];
    const glints = eyes.map((e) => {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(pr * 0.5, pr * 0.14), new THREE.MeshBasicMaterial({ map: soft, color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      g.position.set((e[0] - PX) * s + pc.x - headPivot.position.x, -(e[1] - PY) * s + pc.y - headPivot.position.y, 0.05);
      g.rotation.z = -0.5;
      headPivot.add(g);
      return g;
    });
    // main
    let hand: THREE.Mesh | null = null, handRest = 0;
    if (hasHand) {
      const hm = META[NARRATOR.hand!];
      const handH = pr * 1.25, handW = handH * (hm.w / hm.h);
      hand = new THREE.Mesh(new THREE.PlaneGeometry(handW, handH), maskedBasic(texHand!, mask));
      handRest = pc.y - pr * 1.4;
      hand.position.set(pc.x - pr * 0.55, handRest, -0.25);
      hand.frustumCulled = false;
      group.add(hand);
    }
    // vitre
    const glass = new THREE.Mesh(new THREE.CircleGeometry(pr, 48), new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending }));
    glass.position.set(pc.x, pc.y, -0.1);
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(pr * 2.2, pr * 0.35), new THREE.MeshBasicMaterial({ map: soft, color: 0xcfeaff, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }));
    streak.position.set(pc.x, pc.y, -0.08); streak.rotation.z = -0.7;
    if (hasVehicle) { group.add(glass, streak, bodyMesh!); }
    // projecteur
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ map: soft, color: 0xffd9a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const coneA = makeCone(42, 0.30, "#ffd8a6"), coneB = makeCone(30, 0.14, "#fff1d6");
    const coneGroup = new THREE.Group();
    coneGroup.rotation.z = NARRATOR.lampDir;
    coneGroup.add(coneA.mesh, coneB.mesh);
    if (lamp && NARRATOR.lamp) { halo.position.copy(lamp).setZ(0.2); coneGroup.position.copy(lamp).setZ(0.1); group.add(halo, coneGroup); }
    const spot = new THREE.SpotLight(0xffe2b8, 0, 90, 0.5, 0.7, 1.4);
    spot.target = new THREE.Object3D();
    const interior = new THREE.PointLight(0xffb060, 0, 7, 2);
    interior.position.copy(pc).setZ(1.2);
    group.add(interior);
    return { group, pc, pr, lamp, headPivot, mouthM, browL, browR, hand, handRest, halo, coneA, coneB, spot, interior, mask, glints, glass, streak, s, mouthRest: mouthM.position.clone(), blRest: browL.position.clone(), brRest: browR.position.clone() };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, texVehicle, texBody, texHead, texMouth, texBL, texBR, texHand]);

  useLayoutEffect(() => {
    if (!rig) return;
    const t = frame / FPS;
    const pose = narratorPose(frame);
    const env = envAt(progressAt(frame));
    rig.group.position.set(pose.x, pose.y, pose.z);
    rig.group.rotation.z = pose.rot;
    rig.group.updateMatrixWorld(true);
    if (rig.mask) rig.mask.c.copy(rig.pc.clone().applyMatrix4(rig.group.matrixWorld));

    // --- réactions scriptées
    let recoil = 0, jolt = 0, lookUp = 0;
    for (const r of NARRATOR.reactions) {
      const f0 = at(r.at); if (f0 === undefined) continue;
      if (r.kind === "recoil") recoil = Math.max(recoil, smoothstep(f0 + (r.from ?? 0), f0 + (r.from ?? 0) + 40, frame) * (1 - smoothstep(f0 + (r.to ?? 120), f0 + (r.to ?? 120) + 40, frame)));
      if (r.kind === "jolt") jolt = Math.max(jolt, frame >= f0 ? Math.exp(-(frame - f0) / 18) : 0);
      if (r.kind === "lookUp") lookUp = Math.max(lookUp, smoothstep(f0, f0 + 40, frame));
    }
    const nod = 0.045 * noise2D("nod", t * 0.35, 0) + 0.02 * Math.sin(t * 1.7);
    rig.headPivot.rotation.z = nod + recoil * 0.09 - jolt * 0.12 * Math.sin(frame * 0.9) + lookUp * 0.06;
    rig.headPivot.scale.setScalar(1 + recoil * 0.02);
    // bouche : la pièce s'étire vers le bas et descend avec l'amplitude de la voix
    const m = clamp(mouth, 0, 1), stretch = 1 + m * 0.42;
    rig.mouthM.scale.y = stretch;
    const mh = META[ids.mouth].h * rig.s;
    rig.mouthM.position.y = rig.mouthRest.y - (stretch - 1) * mh * 0.5 - m * 0.04;
    const emph = m * 0.8 + recoil * 1.2 + jolt * 1.4 + lookUp * 1.1 + 0.25 * Math.max(0, noise2D("brow", t * 0.9, 0));
    const lift = clamp(emph, 0, 1.6) * 0.09;
    rig.browL.position.y = rig.blRest.y + lift; rig.browR.position.y = rig.brRest.y + lift * 1.1;
    rig.browL.rotation.z = lift * 0.6; rig.browR.rotation.z = -lift * 0.6;
    // main qui monte au début des répliques
    if (rig.hand) {
      let up = 0;
      if (NARRATOR.handAtBeats) for (const b of TL.beats.slice(1, -1)) up = Math.max(up, easeOut(smoothstep(b.start + 12, b.start + 40, frame) * (1 - smoothstep(b.start + 95, b.start + 130, frame))));
      rig.hand.position.y = rig.handRest + up * rig.pr * 1.05;
      rig.hand.rotation.z = -0.15 + up * 0.06 * Math.sin(t * 6.0) + up * 0.1;
    }
    for (let i = 0; i < rig.glints.length; i++) {
      const cyc = ((t + i * 1.3) % 9.5) / 9.5, win = cyc < 0.16 ? Math.sin((cyc / 0.16) * Math.PI) : 0;
      (rig.glints[i].material as THREE.MeshBasicMaterial).opacity = 0.55 * win * (0.4 + 0.6 * env.spot);
    }
    (rig.glass.material as THREE.MeshBasicMaterial).opacity = 0.05 + 0.12 * env.sun;
    (rig.streak.material as THREE.MeshBasicMaterial).opacity = 0.10 + 0.25 * env.sun;
    rig.streak.rotation.z = -0.7 + 0.08 * Math.sin(t * 0.4);
    // --- projecteur : s'allume avec env.spot, vacille avant le noir, s'éteint au noir
    const black = EV.blackout ?? Infinity, flickFrom = at("eyeOpen") ?? black - 90;
    const flicker = frame > flickFrom ? 0.65 + 0.35 * (noise2D("fl", frame * 0.9, 0) > 0.25 ? 1 : 0) * (0.5 + 0.5 * noise2D("fl2", frame * 0.3, 1)) : 1;
    const dead = frame >= black ? 0 : 1;
    const spotI = env.spot * flicker * dead * (1 - smoothstep(black - 8, black, frame)) * (NARRATOR.lamp ? 1 : 0);
    (rig.halo.material as THREE.MeshBasicMaterial).opacity = 0.9 * spotI;
    rig.halo.scale.setScalar(1 + 0.08 * Math.sin(t * 9));
    rig.coneA.mat.uniforms.uI.value = 0.55 * spotI * (1 - 0.5 * env.sun);
    rig.coneB.mat.uniforms.uI.value = 0.45 * spotI;
    rig.coneA.mat.uniforms.uTime.value = t; rig.coneB.mat.uniforms.uTime.value = t;
    if (rig.lamp) {
      const lw = rig.lamp.clone().applyMatrix4(rig.group.matrixWorld);
      rig.spot.position.copy(lw).setZ(lw.z + 1.5);
      const d = NARRATOR.lampDir;
      rig.spot.target.position.set(lw.x + 30 * Math.cos(d), lw.y + 30 * Math.sin(d), lw.z - 12);
      rig.spot.target.updateMatrixWorld(true);
      rig.spot.intensity = 1800 * spotI;
    }
    rig.interior.intensity = 2.5 * dead;
  });

  if (!rig) return null;
  return (
    <>
      <primitive object={rig.group} />
      <primitive object={rig.spot} />
      <primitive object={rig.spot.target} />
    </>
  );
};
