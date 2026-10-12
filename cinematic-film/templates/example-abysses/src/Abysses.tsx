import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { FPS, TL } from "./lib/camera";
import { clamp } from "./lib/math";
import { ALL_TEXTURE_IDS, useTexturesReady } from "./lib/textures";
import { World } from "./scene/World";
import { Hud } from "./hud/Hud";

export type AbyssesProps = { handle: string; musicVolume: number; sfxVolume: number; voiceVolume: number; fx: boolean; preserve: boolean; fxLevel: number; hide: string };
export const abyssesDefaults: AbyssesProps = { handle: "@minosdevs", musicVolume: 0.5, sfxVolume: 0.8, voiceVolume: 1, fx: true, preserve: false, fxLevel: 4, hide: "" };

// amplitude de la voix (0..1) pour animer la moustache ; ready = toutes les pistes décodées
const useMouth = (frame: number) => {
  // hooks appelés dans un ordre fixe : un par réplique
  const datas = TL.beats.map((b) => useAudioData(staticFile(b.voSrc)));
  const ready = datas.every(Boolean);
  const idx = TL.beats.findIndex((b) => frame >= b.start && frame < b.end + 3);
  if (idx < 0) return { mouth: 0, ready };
  const data = datas[idx];
  if (!data) return { mouth: 0, ready };
  const b = TL.beats[idx];
  const sample = (f: number) => {
    const v = visualizeAudio({ fps: FPS, frame: Math.max(0, f - b.start), audioData: data, numberOfSamples: 32, smoothing: true });
    let s = 0;
    for (let i = 1; i < 12; i++) s += v[i];
    return s / 11;
  };
  const a = sample(frame) * 0.6 + sample(frame - 1) * 0.4;
  return { mouth: clamp((a - 0.06) * 4.2, 0, 1), ready };
};

export const Abysses: React.FC<AbyssesProps> = ({ handle, musicVolume, sfxVolume, voiceVolume, fx, preserve, fxLevel, hide }) => {
  const frame = useCurrentFrame();
  const { mouth, ready: audioReady } = useMouth(frame);
  const texReady = useTexturesReady(ALL_TEXTURE_IDS);
  // le canvas n'est monté qu'une fois tout chargé : en rendu headless, seule la première frame est dessinée
  const ready = audioReady && texReady;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ready && (
        <ThreeCanvas width={1920} height={1080} dpr={1} gl={{ antialias: true, powerPreference: "high-performance", alpha: false, preserveDrawingBuffer: preserve }} camera={{ fov: 40, near: 0.5, far: 260, position: [0, 0, 30] }}>
          <World frame={frame} mouth={mouth} fx={fx} fxLevel={fxLevel} hide={hide} />
        </ThreeCanvas>
      )}
      <Hud frame={frame} handle={handle} />
      <Audio src={staticFile("audio/music.wav")} volume={musicVolume} />
      <Audio src={staticFile("audio/sfx.wav")} volume={sfxVolume} />
      {TL.beats.map((b) => (
        <Sequence key={b.id} from={b.start} durationInFrames={b.dur + 12} name={b.id}>
          <Audio src={staticFile(b.voSrc)} volume={voiceVolume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
