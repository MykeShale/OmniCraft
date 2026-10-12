import React, { useMemo } from "react";
import { EV, FLOOR_Y, FPS, anchorY, beat, camY } from "../lib/camera";
import { bagPose, landmarks } from "../lib/choreo";
import { easeOut, smoothstep } from "../lib/math";
import { aspect } from "../lib/textures";
import { SwimSprite } from "./SwimSprite";

export const Landmarks: React.FC<{ frame: number }> = ({ frame }) => {
  const list = useMemo(() => landmarks(), []);
  const b7 = beat("07-hadal");
  const t = frame / FPS;

  // parois de la fosse : empilées depuis la zone hadale jusqu'au fond
  const walls = useMemo(() => {
    const top = anchorY("07-hadal") + 26;
    const H = 26;
    const out: { x: number; y: number; z: number; flip: boolean; op: number; key: string }[] = [];
    for (let k = 0; top - k * (H - 1) > FLOOR_Y - H; k++) {
      const y = top - k * (H - 1);
      out.push({ x: -20.5 - (k % 2) * 0.8, y, z: -6, flip: true, op: 1, key: `L${k}` });
      out.push({ x: 21 + (k % 2) * 0.6, y: y - 9, z: -6.5, flip: false, op: 1, key: `R${k}` });
      out.push({ x: -31, y: y + 5, z: -16, flip: true, op: 0.7, key: `FL${k}` });
      out.push({ x: 31.5, y: y - 4, z: -17, flip: false, op: 0.7, key: `FR${k}` });
    }
    return out.map((w) => ({ ...w, h: H }));
  }, []);

  const bag = bagPose(frame);
  // l'œil : s'ouvre après eyeOpen, s'approche, disparaît au noir
  const eyeK = easeOut((frame - EV.eyeOpen) / 55);
  const eyeVisible = frame >= EV.eyeOpen && frame < EV.blackout;
  const eyeY = camY(EV.landing) + 1.5;

  return (
    <>
      {list.map((l) => {
        const asp = aspect(l.tex);
        const w = l.width ?? (l.height ?? 10) * asp;
        const vis = frame > l.from - 80 && frame < l.to + 80;
        return <SwimSprite key={l.id} id={l.tex} frame={frame} width={w} x={l.x} y={l.y} z={l.z} rot={l.rot} flip={l.flip} mode="static" opacity={l.opacity ?? 1} emissive={l.emissive ?? 0} visible={vis} depthWrite={(l.opacity ?? 1) >= 1} />;
      })}
      {/* parois de la fosse (visibles seulement en zone hadale) */}
      {frame > b7.start - 200 && walls.map((w) => (
        <SwimSprite key={w.key} id="rock-wall" frame={frame} width={w.h * aspect("rock-wall")} x={w.x} y={w.y} z={w.z} flip={w.flip} mode="static" opacity={w.op} depthWrite={w.op >= 1} />
      ))}
      {/* fond : sédiment, rochers, sac plastique */}
      {frame > EV.landing - 420 && (
        <>
          <SwimSprite id="seafloor" frame={frame} width={66} x={0} y={FLOOR_Y - (66 / aspect("seafloor")) * 0.46} z={-3} mode="static" depthWrite={false} />
          <SwimSprite id="rock-bottom" frame={frame} width={9} x={-15} y={FLOOR_Y + 1.2} z={-6} mode="static" />
          <SwimSprite id="rock-bottom" frame={frame} width={6.5} x={17} y={FLOOR_Y + 0.9} z={-4} mode="static" flip />
          <SwimSprite id="rock-bottom" frame={frame} width={13} x={26} y={FLOOR_Y + 2.2} z={-13} mode="static" />
          <SwimSprite id="rock-bottom" frame={frame} width={5} x={-3} y={FLOOR_Y + 0.5} z={1} mode="static" flip />
          <SwimSprite id="plastic-bag" frame={frame} width={2.6} x={bag.x} y={bag.y} z={bag.z} rot={bag.rot} mode="jelly" amp={0.12} speed={1.1} visible={bag.visible} emissive={0} tint="#7f93a3" depthWrite={false} />
        </>
      )}
      {/* l'œil dans le noir */}
      {eyeVisible && (
        <SwimSprite id="eye" frame={frame} width={46} x={5} y={eyeY} z={-22 + 4 * eyeK} mode="static" scaleY={0.04 + 0.96 * eyeK} opacity={smoothstep(0, 0.4, eyeK) * 0.95} emissive={0.7} depthWrite={false} noFog />
      )}
      {/* petite lueur cyan qui accompagne l'œil */}
      {eyeVisible && <pointLight position={[5, eyeY, -14 + 4 * eyeK]} color="#6fe3ff" intensity={120 * eyeK} distance={40} decay={1.6} />}
      {/* bruit du temps pour éviter un warning d'inutilisé */}
      {void t}
    </>
  );
};
