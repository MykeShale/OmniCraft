import React from "react";
import { Composition } from "remotion";
import { Film, filmDefaults } from "./Film";
import { FPS, TL } from "./lib/camera";

export const Root: React.FC = () => (
  <Composition id="Film" component={Film} durationInFrames={TL.durationInFrames} fps={FPS} width={TL.width} height={TL.height} defaultProps={filmDefaults} />
);
