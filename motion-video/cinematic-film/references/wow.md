# Ce qui fait le « wow » (et ce qui fait le « PowerPoint »)

Un film de ce type est jugé en trois secondes : soit ça respire, soit ça a l'air d'images collées. Les six
leviers ci-dessous ont été validés sur le film Abysses (voir `example-stills-sheet.png`). Ils sont classés
par impact : si le temps manque, garder les trois premiers.

## 1. Un seul plan-séquence, la caméra avance, le monde est fixe
La caméra se déplace à vitesse constante le long d'un axe (`CAMERA` dans `film.config.ts`). Tout est posé
dans le monde avec `anchorPos(beatId, u, v, z)` : le sujet d'une réplique est centré à l'écran à
`anchorAt` (30 %) de la réplique, puis il sort du cadre naturellement. Aucune transition, aucun slide,
aucun « fondu entre scènes » : la continuité est ce que le spectateur ressent comme « un vrai voyage ».
Les éléments qui doivent rester à l'écran plusieurs secondes (le narrateur, une créature qui approche) sont
attachés à `camAxis(frame)` avec un décalage.

## 2. Profondeur réelle : brouillard, z, parallaxe
Les objets loin sont en z négatif (jusqu'à −20), les proches en z positif (jusqu'à +6). Le brouillard
linéaire (`near`/`far` dans `ENV_KEYS`) fait le reste : les choses lointaines sont fondues dans la couleur
du fond, les proches sont nettes. Avec la caméra qui avance, la parallaxe apparaît gratuitement. C'est
l'arme n°1 contre l'effet collage : un PNG dans le brouillard n'a plus l'air d'un PNG.
Réglage : à `far` égal à la distance caméra (30) + 24, un objet à z = −15 est fondu à ~60 %.

## 3. Des sprites qui se déforment, jamais des images qui glissent
`Sprite3D` plaque l'asset sur un maillage subdivisé et un vertex shader le déforme : onde de nage
(`fish`, `squid`), pulsation de cloche (`jelly`), drapeau (`flag`), respiration (`breathe`). Une baleine
qui ondule à 0,55 Hz lit comme une baleine ; la même image translatée lit comme un sticker. Ajouter
toujours une dérive lente (bruit de Perlin via `noise2D`) et une petite rotation : rien ne doit être
parfaitement immobile sauf les monuments.

## 4. Une vraie lumière qui révèle
Les créatures et décors utilisent `MeshStandardMaterial` : la `SpotLight` du narrateur les éclaire
physiquement. Dans les zones sombres (ambient ≈ 0,05), on ne voit que ce que le faisceau touche, et les
éléments bioluminescents/émissifs (`emissive` 0,5–1,1) ressortent par le bloom. Le faisceau lui-même est
visible (deux cônes additifs). Le mystère vient de ce qu'on ne voit pas.
Piège : `emissive` sur un asset clair (sac plastique blanc) = tache blanche surexposée ; utiliser `tint`.

## 5. Une passe d'unification : particules, grain, vignette, aberration
`Particles` (poussière/neige qui suit la caméra, étincelles, émetteur de bulles/braises, nuage sur impact)
et `Effects` (bloom, aberration chromatique légère, grain, vignette, tone mapping ACES) sont appliqués à
TOUT. C'est ce qui donne l'impression que les assets ont été peints ensemble : même grain, même vignette,
même halo. Sans cette passe, la 3D la plus propre a l'air « rendu 3D ».

## 6. Le narrateur vivant
Portrait découpé en pièces alignées (`process.json` → parts) : tête qui pivote sur le cou avec du bruit,
bouche (ou moustache !) qui s'étire sur l'amplitude réelle de la voix (`visualizeAudio`), sourcils qui
montent sur l'emphase et sur les événements (`NARRATOR.reactions`), main qui monte au début des
répliques, reflets sur les lunettes. Un narrateur qui réagit à ce qu'il voit (recul devant la créature,
sursaut à l'impact, regard levé à la révélation) transforme une voix off en personnage.

## Le rythme qui tient l'attention
- 60–120 s, 8–12 paliers, ~150–170 mots de voix pour 90 s (la TTS parle ~1,7 mot/s ; accélérer de 6–8 %
  avec `atempo` reste imperceptible).
- Chaque palier = une chose à voir + une chose à savoir (fun fact précis, chiffré, vérifié).
- Tension qui monte : lumière qui baisse, particules qui augmentent, drone qui se filtre, pulsation puis
  battement de cœur, craquements, montée (riser) coupée net → noir → ping → titre.
- Une révélation avant le noir (l'œil, la silhouette, le chiffre qui tombe) : c'est ce que les gens
  commentent.

## Les données qui rendent « éducatif »
- Un compteur principal qui bouge en continu (profondeur, altitude, année, température, distance…), avec
  une interpolation cubique monotone entre paliers : le chiffre est lisible et jamais faux entre deux clés.
- Deux ou trois relevés dérivés (pression, lumière, température) calculés par une formule (`HUD.readouts`) :
  ils donnent de la matière sans une ligne de voix.
- Une règle graduée avec des repères nommés (échelle log si les valeurs s'étalent sur plusieurs ordres).
- Des étiquettes ancrées dans la 3D (`tags.ts`) avec une ligne de rappel : « 3 803 m · épave du Titanic ».
- Vérifier chaque chiffre avant de générer la voix : une erreur factuelle coûte plus cher que tout le reste.
