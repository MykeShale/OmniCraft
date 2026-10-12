// Planche-contact des assets bruts (public/assets/raw) sur fond bleu, pour vérifier style, orientation, marges.
// Usage : node scripts/contact-sheet.mjs [--grid id ...]   (--grid : version quadrillée 64 px pour relever des coordonnées)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = "public/assets/raw";
const args = process.argv.slice(2);
const grids = [];
for (let i = 0; i < args.length; i++) if (args[i] === "--grid" && args[i + 1]) grids.push(args[++i]);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
const T = 300, COLS = 6, rows = Math.max(1, Math.ceil(files.length / COLS));
const tiles = [];
for (let i = 0; i < files.length; i++) {
  const buf = await sharp(path.join(dir, files[i])).resize(T, T, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const label = Buffer.from(`<svg width="${T}" height="24"><rect width="${T}" height="24" fill="rgba(0,0,0,0.6)"/><text x="6" y="17" font-family="Arial" font-size="15" fill="#fff">${files[i].replace(".png", "")}</text></svg>`);
  tiles.push({ input: buf, left: (i % COLS) * T, top: Math.floor(i / COLS) * T }, { input: label, left: (i % COLS) * T, top: Math.floor(i / COLS) * T });
}
fs.mkdirSync("public/assets", { recursive: true });
await sharp({ create: { width: COLS * T, height: rows * T, channels: 4, background: { r: 30, g: 90, b: 140, alpha: 1 } } }).composite(tiles).png().toFile("public/assets/contact-sheet.png");
console.log("planche :", files.length, "assets -> public/assets/contact-sheet.png");
for (const id of grids) {
  const f = path.join(dir, id + ".png");
  if (!fs.existsSync(f)) { console.log("grid: asset introuvable", id); continue; }
  const m = await sharp(f).metadata();
  let g = `<svg width="${m.width}" height="${m.height}">`;
  for (let x = 0; x < m.width; x += 64) g += `<line x1="${x}" y1="0" x2="${x}" y2="${m.height}" stroke="${x % 256 === 0 ? "#ff0" : "rgba(255,255,0,0.35)"}" stroke-width="1"/><text x="${x + 2}" y="12" font-size="12" fill="#ff0">${x}</text>`;
  for (let y = 0; y < m.height; y += 64) g += `<line x1="0" y1="${y}" x2="${m.width}" y2="${y}" stroke="${y % 256 === 0 ? "#ff0" : "rgba(255,255,0,0.35)"}" stroke-width="1"/><text x="2" y="${y + 12}" font-size="12" fill="#ff0">${y}</text>`;
  g += "</svg>";
  await sharp({ create: { width: m.width, height: m.height, channels: 4, background: { r: 30, g: 90, b: 140, alpha: 1 } } }).composite([{ input: f }, { input: Buffer.from(g) }]).png().toFile(`public/assets/grid-${id}.png`);
  console.log("grille ->", `public/assets/grid-${id}.png`);
}
