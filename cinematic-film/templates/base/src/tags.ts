// Étiquettes ancrées dans la 3D (ligne de rappel + texte), affichées par le HUD.
// Chaque tag : point monde (x,y,z), fenêtre de frames, décalage écran (dx,dy) du texte.
import { anchorPos, beat } from "./lib/camera";

export type Tag = { key: string; text: string; x: number; y: number; z: number; from: number; to: number; dx?: number; dy?: number };

export function tagsAt(frame: number): Tag[] {
  void frame;
  const b = beat("01-step");
  const p = anchorPos("01-step", 10, 5, -6); // ex. : sommet du monument placé dans Story.tsx
  return [
    { key: "landmark", text: "exemple · étiquette ancrée", x: p.x, y: p.y, z: p.z, from: b.start - 20, to: b.end + 25, dx: 70, dy: -60 },
  ];
}
