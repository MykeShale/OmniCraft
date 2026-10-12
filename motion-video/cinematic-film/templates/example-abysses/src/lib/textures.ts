import { useEffect, useState } from "react";
import * as THREE from "three";
import { continueRender, delayRender, staticFile } from "remotion";
import metaRaw from "../../public/assets/meta.json";

export type AssetMeta = {
  w: number; h: number; ox: number; oy: number; srcW: number; srcH: number;
  porthole?: { cx: number; cy: number; r: number };
  lamp?: { x: number; y: number };
  neck?: { x: number; y: number };
  eyes?: { x: number; y: number }[];
};
export const META = metaRaw as Record<string, AssetMeta>;
export const aspect = (id: string) => META[id].w / META[id].h;
export const ALL_TEXTURE_IDS = Object.keys(META).filter((k) => k !== "soft");

const pending = new Map<string, Promise<THREE.Texture>>();
const loaded = new Map<string, THREE.Texture>();

export function loadTex(id: string): Promise<THREE.Texture> {
  if (loaded.has(id)) return Promise.resolve(loaded.get(id)!);
  if (!pending.has(id)) {
    pending.set(
      id,
      new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
          staticFile(`assets/${id}.png`),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 4;
            t.generateMipmaps = true;
            t.minFilter = THREE.LinearMipmapLinearFilter;
            t.magFilter = THREE.LinearFilter;
            loaded.set(id, t);
            resolve(t);
          },
          undefined,
          reject,
        );
      }),
    );
  }
  return pending.get(id)!;
}

/** Précharge toutes les textures en bloquant le rendu Remotion ; vrai quand tout est prêt */
export function useTexturesReady(ids: string[]): boolean {
  const [ready, setReady] = useState(() => ids.every((id) => loaded.has(id)));
  useEffect(() => {
    if (ready) return;
    let alive = true;
    const handle = delayRender("préchargement des textures", { timeoutInMilliseconds: 120000 });
    Promise.all(ids.map(loadTex))
      .then(() => { if (alive) setReady(true); continueRender(handle); })
      .catch((e) => { console.error("textures", e); continueRender(handle); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return ready;
}

/** Texture d'un asset : synchrone si préchargée, sinon chargement bloquant */
export function useTex(id: string): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(() => loaded.get(id) ?? null);
  useEffect(() => {
    if (tex) return;
    let alive = true;
    const handle = delayRender(`texture ${id}`, { timeoutInMilliseconds: 60000 });
    loadTex(id)
      .then((t) => { if (alive) setTex(t); continueRender(handle); })
      .catch((e) => { console.error("texture", id, e); continueRender(handle); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return tex;
}

/** texture procédurale : disque doux (particules, halos) */
let softTex: THREE.Texture | null = null;
export function getSoftTexture() {
  if (softTex) return softTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  softTex = new THREE.CanvasTexture(c);
  softTex.colorSpace = THREE.SRGBColorSpace;
  return softTex;
}
