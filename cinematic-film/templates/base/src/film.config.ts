// ====================================================================================
// Réglages du film : c'est ICI qu'on adapte le socle au sujet (caméra, ambiance, HUD).
// ====================================================================================

/** Déplacement continu de la caméra le long d'un axe (un seul plan-séquence) */
export const CAMERA = {
  axis: "y" as "x" | "y" | "z",   // "y" = descente/montée, "x" = travelling latéral, "z" = avancée
  dir: -1,                        // -1 : vers le bas / la gauche / le fond ; +1 : l'inverse
  speed: 2.3,                     // unités monde par seconde (1 unité ≈ 50 px à z = 0)
  rampIn: 80,                     // frames d'accélération au départ
  stopEvent: "landing" as string | null, // événement où la caméra s'arrête (null = jamais)
  stopBeat: "08-bottom",          // réplique dont la valeur est atteinte à l'arrêt (compteur)
  rampOut: 130,                   // frames de décélération avant l'arrêt
  anchorAt: 0.3,                  // 0..1 : moment de la réplique où son sujet est centré à l'écran
  distance: 30,                   // recul de la caméra (z) par rapport au plan z = 0
  fov: 40,
  rumble: { from: "07-hadal", to: "blackout", amp: 0.045 } as { from: string; to: string; amp: number } | null, // ids d'événement ou de réplique
};

/** Narrateur : portrait découpé en pièces (process.json -> parts) et véhicule optionnel avec un trou chroma-key */
export const NARRATOR = {
  portrait: "narrator",                  // id de l'asset portrait (pièces : narrator-body, -head, -mouth, -brow-l, -brow-r)
  vehicle: "vehicle" as string | null,   // asset avec un hublot magenta percé (meta.hole) ; null = portrait seul, sans cadre
  hand: "narrator-hand" as string | null,// asset optionnel : main qui monte pour "expliquer" au début des répliques
  width: 9.6,                            // largeur (unités monde) du véhicule, ou du portrait s'il n'y a pas de véhicule
  align: { x: 478, y: 430 },             // point de l'image portrait (px) aligné sur le centre du hublot
  headScale: 2.1,                        // hauteur de la tête ≈ headScale × rayon du hublot
  offset: { u: -8.8, v: 0.7, z: 3 },     // position par rapport à la caméra (u = horizontal, v = vertical)
  lamp: true,                            // projecteur (cônes volumétriques + vraie SpotLight) accroché au véhicule
  lampDir: -0.36,                        // inclinaison du faisceau (radians, négatif = vers le bas à droite)
  settleOn: "landing" as string | null,  // événement où le narrateur se pose (fin du flottement)
  handAtBeats: true,
  reactions: [
    { at: "04-midnight", from: 110, to: 150, kind: "recoil" },  // recule (tête en arrière, sourcils)
    { at: "impact", kind: "jolt" },                            // sursaut
    { at: "eyeOpen", kind: "lookUp" },                          // lève les yeux, sourcils hauts
  ] as { at: string; from?: number; to?: number; kind: "recoil" | "jolt" | "lookUp" }[],
};

/** Chocs caméra sur des événements de la timeline */
export const SHAKES: { event: string; amp: number; freq: number; decay: number }[] = [
  { event: "impact", amp: 0.5, freq: 10, decay: 2.0 },
  { event: "landing", amp: 0.32, freq: 6, decay: 2.4 },
];

/** Ambiance selon l'avancement p (0 = début, 1 = fin). Couleurs de fond, brouillard linéaire (near/far),
 *  lumières (ambient, sun = lumière directionnelle du haut, spot = projecteur du narrateur), densité des particules. */
export const ENV_KEYS = [
  { p: 0.0, bg: "#2aa4cb", near: 24, far: 115, ambient: 1.6, sun: 2.0, spot: 0.0, dust: 0.12, sparks: 0.0 },
  { p: 0.25, bg: "#0d5684", near: 24, far: 88, ambient: 0.8, sun: 0.75, spot: 0.3, dust: 0.3, sparks: 0.0 },
  { p: 0.45, bg: "#03192d", near: 26, far: 64, ambient: 0.15, sun: 0.0, spot: 1.0, dust: 0.7, sparks: 1.0 },
  { p: 0.7, bg: "#02070e", near: 26, far: 58, ambient: 0.065, sun: 0.0, spot: 1.0, dust: 1.0, sparks: 0.5 },
  { p: 1.0, bg: "#000204", near: 26, far: 54, ambient: 0.035, sun: 0.0, spot: 1.0, dust: 0.9, sparks: 0.2 },
];

/** HUD : compteur principal + relevés. `format` reçoit la valeur interpolée de la timeline (beats[].value). */
export const HUD = {
  counter: { label: "PROFONDEUR", unit: "m", format: (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") },
  readouts: (v: number, p: number): { label: string; value: string; color?: string; blink?: boolean }[] => [
    { label: "PRESSION", value: `×${Math.round(1 + v / 10)}`, color: v >= 6000 ? "#ff9a86" : undefined, blink: v >= 6000 },
    { label: "LUMIÈRE", value: `${(100 * Math.exp(-v / 45)).toFixed(v > 200 ? 2 : 0)} %` },
    { label: "AVANCÉE", value: `${Math.round(p * 100)} %` },
  ],
  /** règle graduée à droite : null pour la désactiver. scale : valeur -> position (échelle log ici) */
  ruler: {
    scale: (v: number) => Math.log10(1 + v / 30),
    pxPerUnit: 640,
    marks: [{ v: 10 }, { v: 100, label: "exemple" }, { v: 1000, label: "autre repère" }, { v: 10000 }],
  } as { scale: (v: number) => number; pxPerUnit: number; marks: { v: number; label?: string; shift?: number }[] } | null,
  title: "TITRE", tagline: "la phrase finale", handle: "@compte",
  accent: "#a9e4ff",
};
