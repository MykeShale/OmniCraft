# Abysses — la descente (Remotion + three.js)

Film de ~94 s en 1920×1080 / 30 fps : un professeur façon Einstein, dans un bathyscaphe en laiton, commente
une descente continue de la surface jusqu'au Challenger Deep (10 935 m). Monuments à l'échelle, créatures
riggées en shader, brouillard et projecteur en vraie 3D, bloom, grain, voix française, musique et bruitages
synthétisés (zéro droit d'auteur).

## Commandes

```bash
npm run studio                                  # Studio Remotion (port 3012)
node scripts/stills.mjs 300 1150 2450 --sheet   # images fixes + planche-contact dans out/stills/
npx remotion render Abysses out/abysses.mp4 --gl=angle --codec=h264 --crf=17
```

## Pipeline (tout est régénérable)

| étape | commande | sortie |
|---|---|---|
| assets peints (gpt-image-2.5) | `node scripts/gen-assets.mjs [id] [--force]` | `public/assets/raw/*.png` |
| post-traitement (hublot, pièces du professeur, fondus) | `node scripts/process-assets.mjs` | `public/assets/*.png`, `meta.json` |
| voix off (gpt-4o-mini-tts) | `node scripts/gen-vo.mjs ash` (ou `onyx`, `cedar`) | `public/audio/vo/<voix>/*.wav` |
| timeline (durées réelles, vitesse, événements) | `node scripts/build-timeline.mjs ash 1.08` | `src/timeline.json`, `public/audio/vo/final/` |
| musique + bruitages | `node scripts/make-audio.mjs` | `public/audio/music.wav`, `sfx.wav` |

Changer une réplique : éditer `scripts/vo-script.json`, puis relancer `gen-vo`, `build-timeline`, `make-audio`.
Changer de voix : `gen-vo <voix>` puis `build-timeline <voix> <vitesse>` puis `make-audio`.
La clé OpenAI est lue dans `~/OneDrive/Bureau/dev-infra/credentials.local.env`.

## Structure

- `src/lib/camera.ts` — descente (vitesse constante, arrêt au fond), profondeur affichée, secousses, projection 3D→écran
- `src/lib/env.ts` — couleur de l'eau, brouillard, lumières, particules selon la profondeur
- `src/lib/choreo.ts` — trajectoires des créatures et positions des monuments (partagées 3D + HUD)
- `src/scene/` — `SwimSprite` (plan texturé + shader de nage), `Bathysphere` (coque, professeur riggé : tête, moustache
  synchronisée sur la voix, sourcils, main, projecteur), `Creatures`, `Landmarks`, `Particles`, `Rays`, `Effects`
- `src/hud/Hud.tsx` — compteur, relevés, règle logarithmique, légendes, étiquettes ancrées, noir final, titre
- Props de la composition (Studio) : `handle`, `musicVolume`, `sfxVolume`, `voiceVolume`

## Pièges connus (rendu headless)

- Remotion ne dessine **qu'une seule frame** three.js par image : tout doit être prêt au premier commit.
  D'où le composer construit à la main (`Effects.tsx`), le préchargement des textures et de l'audio avant de
  monter le canvas (`Abysses.tsx`) et le composant `Readvance`.
- Dans les shaders, `pow()` d'une base négative donne NaN, et le bloom propage le NaN en gros bloc noir :
  toujours `pow(max(0.0, x), k)`.
