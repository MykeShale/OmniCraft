import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// WebGL (three.js) : angle utilise le GPU, swangle est le repli logiciel
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(4);
Config.setStudioPort(3012);
