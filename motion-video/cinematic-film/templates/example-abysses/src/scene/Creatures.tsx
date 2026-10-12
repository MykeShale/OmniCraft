import React, { useMemo } from "react";
import { noise2D } from "@remotion/noise";
import { EV, FPS, anchorY, beat, camY } from "../lib/camera";
import { anglerPose, snailPose, squidPose, turtlePose, whalePose } from "../lib/choreo";
import { mulberry32, smoothstep } from "../lib/math";
import { SwimSprite } from "./SwimSprite";

type Fish = { ox: number; oy: number; oz: number; w: number; sp: number; ph: number; f: number };
function school(seed: number, n: number, spread: [number, number, number], size: [number, number]): Fish[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: n }, () => ({
    ox: (rnd() - 0.5) * 2 * spread[0], oy: (rnd() - 0.5) * 2 * spread[1], oz: (rnd() - 0.5) * 2 * spread[2],
    w: size[0] + rnd() * (size[1] - size[0]), sp: 2.2 + rnd() * 1.6, ph: rnd() * 6.28, f: 0.9 + rnd() * 0.5,
  }));
}

export const Creatures: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  const cy = camY(frame);
  const b2 = beat("02-eiffel"), b3 = beat("03-burj"), b4 = beat("04-midnight"), b7 = beat("07-hadal");

  const schoolA = useMemo(() => school(11, 44, [7, 3, 3], [1.0, 1.7]), []);
  const schoolB = useMemo(() => school(12, 24, [6, 2.5, 3], [0.9, 1.5]), []);
  const lanterns = useMemo(() => {
    const rnd = mulberry32(13);
    return Array.from({ length: 14 }, (_, i) => ({ x0: 30 - rnd() * 60, y: anchorY("03-burj") - 4 - i * 2.1 - rnd() * 2, z: -9 + rnd() * 9, w: 1.4 + rnd() * 0.8, flip: rnd() > 0.5, ph: rnd() * 6.28, sp: 1.8 + rnd() }));
  }, []);
  const amphipods = useMemo(() => {
    const rnd = mulberry32(14);
    return Array.from({ length: 6 }, (_, i) => ({ x: (i % 2 ? 1 : -1) * (13 + rnd() * 5), y: anchorY("07-hadal") + 8 - i * 5.5, z: -3 + rnd() * 3, w: 1.1 + rnd() * 0.6, ph: rnd() * 6.28, flip: i % 2 === 0 }));
  }, []);

  // banc A : traverse de droite à gauche en descendant avec nous (surface -> statue)
  const a0 = anchorY("00-surface"), a1 = anchorY("01-liberty");
  const kA = smoothstep(10, 640, frame);
  const cA = { x: 30 - 66 * kA, y: a0 - 6 + (a1 + 3 - (a0 - 6)) * kA, z: -7 + 3 * kA };
  // banc B : de gauche à droite près de la tour Eiffel
  const a2 = anchorY("02-eiffel");
  const kB = smoothstep(b2.start - 50, b2.end + 70, frame);
  const cB = { x: -34 + 70 * kB, y: a2 - 5 + 9 * kB, z: -9 + 3 * kB };

  const turtle = turtlePose(frame);
  const angler = anglerPose(frame);
  const squid = squidPose(frame);
  const whale = whalePose(frame);
  const snail = snailPose(frame);
  const dead = frame >= EV.blackout;

  // lueur de la baudroie : vacille
  const lureFlick = 0.7 + 0.3 * Math.pow(0.5 + 0.5 * Math.sin(t * 7.3) * Math.sin(t * 2.1), 2);
  const lure = { x: angler.x - 2.4, y: angler.y + 1.6, z: angler.z + 0.3 };

  // méduses : montent lentement dans la zone de minuit
  const a4 = anchorY("04-midnight");
  const jellies = [
    { x: -16, y: a4 - 3, z: -5, w: 5.5, ph: 0 }, { x: 13.5, y: a4 + 4.5, z: -9, w: 4, ph: 1.7 },
    { x: 3.5, y: a4 - 12, z: -2, w: 7.5, ph: 3.1 }, { x: -6, y: a4 + 10, z: -12, w: 3, ph: 4.4 }, { x: 19, y: a4 - 9, z: -14, w: 3.2, ph: 5.2 },
  ];

  return (
    <>
      {/* banc A */}
      {frame < 700 && schoolA.map((f, i) => {
        const wob = noise2D("fa" + i, t * 0.3, 0);
        return <SwimSprite key={"a" + i} id="fish-small" frame={frame} width={f.w} x={cA.x + f.ox + 1.5 * wob} y={cA.y + f.oy + 0.8 * Math.sin(t * 0.8 + f.ph)} z={cA.z + f.oz} rot={-0.15 + 0.12 * wob} amp={0.14} freq={f.f} speed={f.sp * 2.4} phase={f.ph} />;
      })}
      {/* tortue */}
      <SwimSprite id="turtle" frame={frame} width={7} x={turtle.x} y={turtle.y} z={turtle.z} rot={turtle.rot} amp={0.16} freq={0.5} speed={1.5} visible={turtle.visible} />
      {/* banc B */}
      {frame > b2.start - 90 && frame < b2.end + 120 && schoolB.map((f, i) => {
        const wob = noise2D("fb" + i, t * 0.3, 0);
        return <SwimSprite key={"b" + i} id="fish-small" frame={frame} width={f.w} x={cB.x + f.ox + 1.2 * wob} y={cB.y + f.oy + 0.7 * Math.sin(t * 0.9 + f.ph)} z={cB.z + f.oz} rot={0.1 + 0.1 * wob} flip amp={0.14} freq={f.f} speed={f.sp * 2.4} phase={f.ph} />;
      })}
      {/* poissons-lanternes (crépuscule -> minuit) */}
      {frame > b3.start - 60 && frame < b4.end + 140 && lanterns.map((l, i) => (
        <SwimSprite key={"l" + i} id="lanternfish" frame={frame} width={l.w} x={l.x0 + (l.flip ? 1 : -1) * 0.9 * (t - b3.start / FPS) + 0.6 * Math.sin(t * 0.5 + l.ph)} y={l.y + 0.4 * Math.sin(t * 0.7 + l.ph)} z={l.z} flip={l.flip} amp={0.12} freq={1.3} speed={l.sp * 2.6} phase={l.ph} emissive={0.7} />
      ))}
      {/* méduses */}
      {frame > b4.start - 200 && frame < b4.end + 260 && jellies.map((j, i) => (
        <SwimSprite key={"j" + i} id="jellyfish" frame={frame} width={j.w} x={j.x + 0.8 * Math.sin(t * 0.25 + j.ph)} y={j.y + 0.38 * t - 0.38 * (b4.start / FPS)} z={j.z} mode="jelly" amp={0.35} speed={1.5} phase={j.ph} emissive={1.1} depthWrite={false} renderOrder={2} rot={0.08 * Math.sin(t * 0.3 + j.ph)} />
      ))}
      {/* baudroie : approche le hublot puis s'éloigne */}
      <SwimSprite id="anglerfish" frame={frame} width={7} x={angler.x} y={angler.y} z={angler.z} rot={angler.rot} amp={0.2} freq={0.9} speed={2.2} emissive={0.16} visible={angler.visible && !dead} />
      {angler.visible && !dead && <pointLight position={[lure.x, lure.y, lure.z]} color="#7fe9ff" intensity={14 * lureFlick} distance={11} decay={1.8} />}
      {/* cachalot au loin, calmar géant qui frôle la coque */}
      <SwimSprite id="whale" frame={frame} width={40} x={whale.x} y={whale.y} z={whale.z} rot={whale.rot} flip amp={0.55} freq={0.55} speed={1.1} emissive={0.07} visible={whale.visible && !dead} />
      <SwimSprite id="squid" frame={frame} width={27} x={squid.x} y={squid.y} z={squid.z} rot={squid.rot} flip mode="squid" amp={1.0} freq={0.9} speed={2.4} emissive={0.12} visible={squid.visible && !dead} renderOrder={3} />
      {/* zone hadale : poisson-limace et amphipodes */}
      <SwimSprite id="snailfish" frame={frame} width={4.6} x={snail.x} y={snail.y} z={snail.z} rot={snail.rot} amp={0.22} freq={1.1} speed={1.9} emissive={0.03} tint="#7f8d96" visible={snail.visible && !dead} />
      {frame > b7.start - 100 && frame < EV.blackout && amphipods.map((a, i) => (
        <SwimSprite key={"am" + i} id="amphipod" frame={frame} width={a.w} x={a.x + 0.8 * Math.sin(t * 0.6 + a.ph)} y={a.y + 0.5 * Math.sin(t * 0.9 + a.ph)} z={a.z} flip={a.flip} rot={0.3 * Math.sin(t * 0.4 + a.ph)} amp={0.1} freq={2.5} speed={5} emissive={0.08} />
      ))}
      {void cy}
    </>
  );
};
