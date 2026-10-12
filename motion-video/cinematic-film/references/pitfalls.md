# Pièges rencontrés (tous vérifiés en produisant Abysses)

## Rendu headless Remotion + three.js
- **Une seule frame three.js est dessinée par image rendue.** `@remotion/three` appelle `advance()` une fois
  dans un effet après le commit React. Tout ce qui arrive ensuite (texture chargée puis `setState`, passes
  de post-prod ajoutées dans un second commit) n'est jamais redessiné. Symptômes : canvas noir, sprites
  absents, alors que le Studio (boucle continue) affiche tout.
  Parades intégrées au socle : `Effects.tsx` construit l'`EffectComposer` de `postprocessing` de façon
  impérative (passes créées de manière synchrone) au lieu du wrapper `@react-three/postprocessing` ;
  `Film.tsx` précharge toutes les textures (`useTexturesReady`) et les pistes audio avant de monter le
  canvas ; `Readvance` redessine si un commit tardif survient.
- **Ne jamais mettre `setState` dans une boucle de rendu 3D.** Tout ce qui dépend de la frame se calcule
  dans `useLayoutEffect` (positions, uniformes) à partir de `frame`, sans état React.
- Vérifier avec `node scripts/stills.mjs <frames> --sheet` (rendu réel headless), pas seulement dans le
  Studio : le Studio cache exactement les bugs ci-dessus.

## Shaders
- `pow(x, k)` avec x légèrement négatif (bords de plans, `1.0 - abs(...)`) donne NaN, et le bloom
  (chaîne de mipmaps) propage le NaN en **gros bloc noir à bord net**. Toujours `pow(max(0.0, x), k)`.
- Les matériaux additifs (rayons, cônes) doivent avoir `depthWrite: false` et `transparent: true`.
- Un `MeshStandardMaterial` sur un plan est éclairé par la SpotLight ; un `MeshBasicMaterial` (unlit) ne
  l'est pas : utiliser `unlit` seulement pour ce qui est déjà « lumineux » (surface, portrait dans la cabine).

## Assets gpt-image
- `background: "transparent"` marche, mais la visionneuse d'images affiche le RGB sans alpha : un fond
  sombre « fantôme » apparaît alors que l'alpha est propre. Vérifier l'alpha en composant sur un fond uni
  (ffmpeg `overlay` sur `color=c=0x1e6fa0`) avant de conclure.
- Pour percer un hublot/une fenêtre : demander un disque « solid flat pure magenta (RGB 255, 0, 255) » et
  le chroma-keyer (`process.json` → `chroma`). Le modèle respecte très bien la consigne.
- Les modèles dessinent parfois le sujet dans l'autre sens (baleine tête à droite) : `flip` au lieu de
  regénérer. Vérifier l'orientation sur la planche-contact.
- Prévoir des marges dans le prompt (« margin around the subject ») sinon les nageoires touchent le bord.
- `gpt-image-2.5-sunburst` : plus détaillé, ~30 s ; `gpt-image-2.5-flare` : ~12 s, suffisant pour les
  éléments secondaires. `quality: high` seulement pour les héros.

## Voix TTS
- `gpt-4o-mini-tts` : les `instructions` pilotent le ton (âge, mystère, rythme). Générer une phrase test
  avec 3 voix (ash, onyx, cedar) et laisser choisir. Les durées varient de ±10 % selon la voix : la
  timeline se reconstruit en une commande.
- Écrire les nombres en toutes lettres dans `vo-script.json` (« dix mille neuf cent trente-cinq mètres ») :
  la lecture est plus naturelle et prévisible.
- Nettoyer les silences et normaliser (`build-timeline.mjs` le fait) : sinon les gaps sont irréguliers.

## Outillage
- L'outil Bash casse sur les heredocs contenant `#` et sur les heredocs en arrière-plan : écrire les
  fichiers avec l'outil Write.
- `preview_start` lit le `launch.json` du dossier de session : changer de dossier avant, ou lancer le
  Studio autrement pour un projet frère.
- Le rendu final : `npx remotion render Film out/film.mp4 --gl=angle --concurrency=4` ; ~2 800 frames 1080p
  avec bloom ≈ 10 min. Avec `--gl=swangle` (logiciel) ça marche aussi mais 2 à 3 fois plus lent.
- Le rendu ne s'écoute pas : mesurer `ffmpeg -af volumedetect` (viser moyenne −16 à −20 dB, crête < −0,5 dB)
  et le dire à l'utilisateur.
