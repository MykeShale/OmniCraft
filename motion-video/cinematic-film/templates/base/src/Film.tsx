import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { HUD } from "./film.config";
import { FPS, TL } from "./lib/camera";
import { clamp } from "./lib/math";
import { ALL_TEXTURE_IDS, useTexturesReady } from "./lib/textures";
import { World } from "./scene/World";
import { Hud } from "./hud/Hud";

export type FilmProps = { handle: string; musicVolume: number; sfxVolume: number; voiceVolume: number; fx: boolean; fxLevel: number };
export const filmDefaults: FilmProps = { handle: HUD.handle, musicVolume: 0.5, sfxVolume: 0.8, voiceVolume: 1, fx: true, fxLevel: 4 };

// wav silencieux (public/silence.wav, 10 ms) pour garder un nombre de hooks constant quand une réplique n'a pas encore de voix
const SILENCE = staticFile("silence.wav");

// amplitude de la voix (0..1) pour la bouche du narrateur ; ready = toutes les pistes décodées
const useMouth = (frame: number) => {
  const datas = TL.beats.map((b) => useAudioData(b.voSrc ? staticFile(b.voSrc) : SILENCE));
  const ready = datas.every(Boolean);
  const idx = TL.beats.findIndex((b) => frame >= b.start && frame < b.end + 3);
  if (idx < 0 || !datas[idx] || !TL.beats[idx].voSrc) return { mouth: 0, ready };
  const b = TL.beats[idx], data = datas[idx]!;
  const sample = (f: number) => {
    const v = visualizeAudio({ fps: FPS, frame: Math.max(0, f - b.start), audioData: data, numberOfSamples: 32, smoothing: true });
    let s = 0;
    for (let i = 1; i < 12; i++) s += v[i];
    return s / 11;
  };
  const a = sample(frame) * 0.6 + sample(frame - 1) * 0.4;
  return { mouth: clamp((a - 0.06) * 4.2, 0, 1), ready };
};

export const Film: React.FC<FilmProps> = ({ handle, musicVolume, sfxVolume, voiceVolume, fx, fxLevel }) => {
  const frame = useCurrentFrame();
  const { mouth, ready: audioReady } = useMouth(frame);
  const texReady = useTexturesReady(ALL_TEXTURE_IDS);
  // le canvas n'est monté qu'une fois tout chargé : en rendu headless, seule la première frame est dessinée
  const ready = audioReady && texReady;
  const hasMusic = TL.beats.some((b) => b.voSrc); // pas d'audio tant que la voix n'est pas générée
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ready && (
        <ThreeCanvas width={TL.width} height={TL.height} dpr={1} gl={{ antialias: true, powerPreference: "high-performance", alpha: false }} camera={{ fov: 40, near: 0.5, far: 260, position: [0, 0, 30] }}>
          <World frame={frame} mouth={mouth} fx={fx} fxLevel={fxLevel} />
        </ThreeCanvas>
      )}
      <Hud frame={frame} handle={handle} />
      {hasMusic && <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />}
      {hasMusic && <Audio src={staticFile("audio/sfx.wav")} volume={sfxVolume} />}
      {TL.beats.filter((b) => b.voSrc).map((b) => (
        <Sequence key={b.id} from={b.start} durationInFrames={b.dur + 12} name={b.id}>
          <Audio src={staticFile(b.voSrc)} volume={voiceVolume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
