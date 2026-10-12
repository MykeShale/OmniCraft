# Prompts gpt-image pour des assets qui s'assemblent

Le principe : un **suffixe de style unique** ajouté à tous les prompts (dans `assets.json` → `styleSuffix`)
garantit que les vingt assets ont l'air peints par la même main. Ne pas mettre de couleur de fond, de
décor ni d'ambiance dans les prompts : le fond, le brouillard et la lumière viennent de la 3D.

## Suffixe de style (référence)
```
Painterly cinematic digital illustration with visible textured brushwork, matte finish, rich detail,
dramatic rim light from top-left, no text, no watermark. Isolated on a fully transparent background
(PNG alpha): absolutely no backdrop, no gradient, no vignette, no fog, no ambient glow or halo outside
the subject silhouette. The whole subject is visible with margin around it.
```
Variantes : « ink and watercolor », « gouache », « 1950s science textbook illustration », « dark fantasy
concept art », « clean vector illustration, flat shading » (moins cinématique). Garder « rim light from
top-left » quel que soit le style : c'est ce qui accroche la lumière 3D de manière cohérente.

## Le narrateur (portrait riggable)
```
Bust portrait (head and shoulders) of <personnage>, facing the viewer directly, leaning slightly
forward with <émotion>, mouth closed <et caché sous une moustache si possible>, no hands visible.
Lit by warm <amber> light from below-left, cool <blue> rim light from above-right.
```
- Une bouche cachée (moustache, écharpe, masque) rend la synchro labiale triviale : la pièce s'étire sur
  la voix. Sinon la pièce « mouth » est découpée autour de la bouche fermée et l'étirement fonctionne aussi.
- Sans mains : la main est un asset séparé (`<id>-hand`) qui monte depuis le bas du cadre.
- Après génération : ouvrir `public/assets/grid-<id>.png` (contact-sheet.mjs avec `--grid <id>`) et
  relever les rectangles tête / bouche / sourcils et les points cou / yeux pour `process.json`.

## Le véhicule / cadre du narrateur
```
<véhicule> seen from the side, slightly three-quarter, with one large round window in the center facing
the viewer. The window glass is a solid flat pure magenta disc (RGB 255, 0, 255), perfectly uniform, no
reflections, nothing visible inside. A small spotlight lamp mounted on the top-front, <détails>.
```
Le disque magenta est percé par `process.json` → `chroma: "magenta"` ; la lampe est déclarée dans `points`.

## Créatures / personnages mobiles
```
A <espèce>, full body side view facing left, <détails anatomiques>, <élément lumineux si besoin>.
```
- Toujours « side view facing left » : le shader suppose la tête à gauche, la queue à droite. Si le modèle
  inverse, `flip` dans Sprite3D.
- Les longues choses souples (tentacules, capes, queues) doivent être à droite de l'image.
- Formats : 1024x1024 pour les créatures compactes, 1536x1024 pour les longues (baleine, calmar, train),
  1024x1536 pour les hautes (méduse, tour, personnage debout).

## Monuments / références d'échelle
```
The <monument>, the entire structure visible from base to top, seen from a slightly low angle, <matière>.
```
Ils sont posés en `static` ; l'échelle relative est suggérée par le cadrage (chacun remplit ~60–80 % de la
hauteur), pas par des proportions réelles impossibles à montrer.

## Décors avec fondu
Sol, plafond, parois : demander « occupying the lower/upper half of the image, the other half empty », puis
`process.json` → `fade: "top"|"bottom"|"left"|"right"|"radial"`. Le modèle peint souvent la moitié « vide »
quand même : c'est le fondu qui règle le problème.

## Révélation finale
```
A colossal <chose> emerging from absolute darkness, seen from the front, only <la partie visible> visible,
the surrounding <matière> fades softly into full transparency at the edges of the image.
```
Posée en `noFog` avec `scaleY` qui s'ouvre (0,04 → 1) et `emissive` 0,7 : elle « s'ouvre » dans le noir.
