import React from "react";
import { Composition } from "remotion";
import { Abysses, abyssesDefaults } from "./Abysses";
import { FPS, TL } from "./lib/camera";

export const Root: React.FC = () => (
  <Composition
    id="Abysses"
    component={Abysses}
    durationInFrames={TL.durationInFrames}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={abyssesDefaults}
  />
);
