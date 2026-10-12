# Exemple complet : « Abysses » (descente 0 → 10 935 m, 94 s)

Le film de référence, produit avec ce pipeline le 2026-09-29. Le code complet est dans
`templates/example-abysses/` (version « avant généralisation » : `camera.ts` y est spécifique à la
profondeur, `Bathysphere.tsx` est l'ancêtre de `Narrator.tsx`). Les planches `example-assets-sheet.png`
(les 24 assets) et `example-stills-sheet.png` (12 images du rendu) montrent le niveau attendu.

## Cadrage validé avec l'utilisateur
- 90 s, 16:9 YouTube/X, français, voix « vieux professeur façon Einstein », mystérieux + éducatif,
  « le moins possible collage », style peint cinématique (pas pixel art).
- Un seul plan-séquence qui descend ; compteur de profondeur permanent ; monuments à leur profondeur ;
  une créature + un fun fact par palier ; révélation (œil colossal) puis noir, ping, titre.

## Les 10 répliques (≈ 155 mots, ash accéléré ×1,08 → 86 s de parole)
| id | valeur | texte |
|---|---|---|
| 00-surface | 0 | Vous flottez. Sous vos pieds : onze kilomètres de vide. Descendons. |
| 01-liberty | 93 | Quatre-vingt-treize mètres. La Statue de la Liberté disparaît. La pression a déjà décuplé. |
| 02-eiffel | 330 | Trois cent trente mètres. La Tour Eiffel, tête en bas. Aucun plongeur n'est jamais descendu plus bas en respirant. |
| 03-burj | 828 | Huit cent vingt-huit mètres. La plus haute tour du monde tiendrait ici. C'est le dernier endroit où l'œil voit encore du bleu. |
| 04-midnight | 1000 | Mille mètres. Zone de minuit. Ici, neuf animaux sur dix fabriquent leur propre lumière. |
| 05-whale | 2000 | Deux mille mètres. Le cachalot vient chasser le calmar géant, en apnée. Ce combat, personne ne l'a jamais filmé. |
| 06-titanic | 3800 | Trois mille huit cents mètres. Le Titanic. Il neige des débris, ici, depuis plus d'un siècle. |
| 07-hadal | 6000 | Six mille mètres. Six cents fois la pression de la surface. Et pourtant, à huit mille trois cents mètres, un poisson nous regarde. |
| 08-bottom | 10935 | L'Everest tiendrait ici, retourné, et il resterait deux kilomètres. Dix mille neuf cent trente-cinq mètres. Le fond. Une voiture, sur l'ongle de votre pouce. |
| 09-end | 10935 | Nous avons exploré moins de cinq pour cent de l'océan. Le reste ne nous a jamais vus. |

Événements : `whalePass` (05 start −20), `squidBrush` (05 start +175, choc caméra + thump), `landing`
(08 start +270, arrêt caméra, nuage de sédiment), `eyeOpen` (09 start +105), `blackout` (09 end +15),
`title` (+45).

## Les 24 assets (assets.json) et leur rôle
Héros (sunburst, high) : bathysphere (hublot magenta), professor (buste, moustache), professor-hand,
jellyfish, anglerfish, squid (1536x1024), whale (1536x1024), titanic, eye.
Secondaires (flare, medium) : fish-small (instancié ×44 + ×24 en bancs), turtle, lanternfish, snailfish,
amphipod, statue / eiffel / burj (1024x1536), everest, plastic-bag, rock-wall (1024x1536, empilé en parois),
seafloor, surface, bubble (texture de particules), rock-bottom. Coût total ≈ 5 $.

## Réglages qui ont compté
- Caméra : 2,3 unités/s, `anchorAt` 0,3, arrêt en 130 frames sur `landing`, distance 30, fov 40.
- Environnement (par profondeur, échelle √) : fond #2aa4cb → #000204 ; brouillard near 24→26, far 115→54 ;
  ambient 1,6→0,035 ; sun 2→0 (éteint à 1 000 m) ; spot 0→1 (allumé dès 330 m).
- Narrateur : largeur 9,6 ; tête = 2,1 × rayon du hublot ; point d'alignement (478, 430) ; bouche = la
  moustache, étirement ×1,42 max ; réactions : recul devant la baudroie, sursaut au frôlement du calmar,
  regard levé quand l'œil s'ouvre.
- Créatures : banc = 44 sprites avec offsets ellipsoïdaux + bruit ; baudroie qui approche à z = 2,2 avec
  une PointLight cyan sur la lanterne ; cachalot à z = −16 (silhouette dans le brouillard) ; calmar qui
  passe DEVANT le hublot (z 0,5 → 5,5) au moment du choc.
- Audio : drone D1 + A1 filtré avec la profondeur, shimmer jusqu'à 320 m, pulsation dès 1 000 m,
  battement de cœur dès 6 000 m (58 → 88 bpm), craquements dès le Titanic, clics d'écholocation du
  cachalot, riser 6,5 s coupé au noir, ping final. Mix final : moyenne −18 dB, crête −0,6 dB.
- HUD : compteur (cubique monotone entre paliers), pression ×(1 + d/10) qui rougit et clignote en zone
  hadale, lumière 100·e^(−d/45) %, température ; règle log (log10(1 + d/30), 640 px/unité) avec 23 repères.

## Ce qui a coûté du temps (pour ne pas le refaire)
Voir `pitfalls.md` : canvas noir en headless (composer impératif + préchargement), bloc noir NaN dans le
bloom, l'œil final invisible parce que mangé par le brouillard (`noFog`), sac plastique et poisson pâle
surexposés par le projecteur (`tint` sombre, `emissive` ≈ 0).
