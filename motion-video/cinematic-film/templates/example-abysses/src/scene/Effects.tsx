import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { BlendFunction, BloomEffect, ChromaticAberrationEffect, EffectComposer, EffectPass, NoiseEffect, RenderPass, ToneMappingEffect, ToneMappingMode, VignetteEffect } from "postprocessing";

// Post-production construite de façon impérative : toutes les passes existent dès le premier rendu,
// ce qui est indispensable en rendu headless (Remotion n'avance qu'une seule frame par image).
// level : 1 = vignette + tone mapping, 2 = + bloom, 3 = + grain, 4 = + aberration chromatique (défaut)
export const Effects: React.FC<{ level?: number }> = ({ level = 4 }) => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const gl2 = gl.getContext() as WebGL2RenderingContext;
    const halfFloatOk = gl.capabilities.isWebGL2 && (gl2.getExtension("EXT_color_buffer_half_float") || gl2.getExtension("EXT_color_buffer_float"));
    const c = new EffectComposer(gl, { frameBufferType: halfFloatOk ? THREE.HalfFloatType : THREE.UnsignedByteType, multisampling: 0 });
    gl.toneMapping = THREE.NoToneMapping; // le tone mapping est fait par l'effet final
    c.addPass(new RenderPass(scene, camera));
    const fx: import("postprocessing").Effect[] = [];
    if (level >= 2) fx.push(new BloomEffect({ intensity: 0.85, luminanceThreshold: 0.6, luminanceSmoothing: 0.32, mipmapBlur: true, radius: 0.72 }));
    if (level >= 4) fx.push(new ChromaticAberrationEffect({ offset: new THREE.Vector2(0.0007, 0.0005), radialModulation: true, modulationOffset: 0.35 }));
    if (level >= 3) {
      const noise = new NoiseEffect({ premultiply: true, blendFunction: BlendFunction.OVERLAY });
      noise.blendMode.opacity.value = 0.08;
      fx.push(noise);
    }
    if (level >= 1) {
      fx.push(new VignetteEffect({ eskil: false, offset: 0.2, darkness: 0.85 }));
      fx.push(new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }));
    }
    if (fx.length) c.addPass(new EffectPass(camera, ...fx));
    return c;
  }, [gl, scene, camera, level]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);
  useEffect(() => () => composer.dispose(), [composer]);

  useFrame(() => {
    composer.render(1 / 30);
  }, 1);

  return null;
};
