import React from "react";
import { EV, FPS, anchorPos, at, beat, camAxis } from "../lib/camera";
import { easeOut, smoothstep } from "../lib/math";
import { META } from "../lib/textures";
import { Sprite3D } from "./Sprite3D";

// ====================================================================================
// LA MISE EN SCÈNE DU FILM : c'est ce fichier qu'on écrit pour chaque sujet.
// Règles qui font le "wow" (voir references/wow.md) :
//  - tout est placé dans le monde (anchorPos) et c'est la caméra qui avance : jamais de "slide" d'écran
//  - une créature/un personnage = Sprite3D avec un mode de déformation, jamais un PNG qui glisse
//  - les objets éloignés en z négatif (brouillard réel), les proches en z > 0 (parallaxe)
//  - les trajectoires suivent la caméra (camAxis) quand un sujet doit rester à l'écran plusieurs secondes
// ====================================================================================

const has = (id: string) => !!META[id];

/** exemple de trajectoire : approche un point près de la caméra puis repart */
export function heroPose(frame: number) {
  const b = beat(TL_IDS.approach);
  const f0 = b.start + 15, f1 = b.start + 190, f2 = b.end + 10, f3 = b.end + 150;
  const a = camAxis(frame);
  if (frame < f2) {
    const k = easeOut(Math.min(1, Math.max(0, (frame - f0) / (f1 - f0))));
    return { x: 36 + (-0.8 - 36) * k, y: a + -3 + 4.7 * k + 0.25 * Math.sin(frame / FPS * 1.3), z: -3 + 5.2 * k, rot: -0.05 * (1 - k), visible: frame > f0 - 40 };
  }
  const k = smoothstep(f2, f3, frame);
  return { x: -0.8 + 40.8 * k, y: a + 1.7 + 4.3 * k, z: 2.2 - 8.2 * k, rot: 0.12 * k, visible: frame < f3 + 40 };
}
const TL_IDS = { approach: "01-step" };

export const Story: React.FC<{ frame: number }> = ({ frame }) => {
  const t = frame / FPS;
  const hero = has("hero") ? heroPose(frame) : null;
  const landmark = anchorPos("01-step", 10, -0.5, -6); // à droite de la caméra, un peu bas, en retrait
  const stop = at("landing");
  const eyeK = stop === undefined ? 0 : easeOut((frame - (at("eyeOpen") ?? Infinity)) / 55);

  return (
    <>
      {/* un monument/décor fixe dans le monde, centré à l'écran pendant sa réplique */}
      {has("landmark") && <Sprite3D id="landmark" frame={frame} width={12} x={landmark.x} y={landmark.y} z={landmark.z} mode="static" />}
      {/* une créature qui approche le narrateur puis repart, avec une lumière attachée */}
      {hero && <Sprite3D id="hero" frame={frame} width={7} x={hero.x} y={hero.y} z={hero.z} rot={hero.rot} mode="fish" amp={0.2} freq={0.9} speed={2.2} emissive={0.15} visible={hero.visible} />}
      {hero && hero.visible && <pointLight position={[hero.x - 2.4, hero.y + 1.6, hero.z + 0.3]} color="#7fe9ff" intensity={12} distance={11} decay={1.8} />}
      {/* révélation finale : quelque chose d'énorme, sans brouillard, qui s'ouvre avant le noir */}
      {has("reveal") && eyeK > 0 && frame < (EV.blackout ?? Infinity) && (
        <Sprite3D id="reveal" frame={frame} width={46} x={5} y={camAxis(frame) + 1.5} z={-22 + 4 * eyeK} mode="static" scaleY={0.04 + 0.96 * eyeK} opacity={smoothstep(0, 0.4, eyeK) * 0.95} emissive={0.7} depthWrite={false} noFog />
      )}
      {void t}
    </>
  );
};
