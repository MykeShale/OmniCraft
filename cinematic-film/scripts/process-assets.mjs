// Post-traitement des assets bruts (public/assets/raw) -> public/assets/*.png + meta.json
// Piloté par scripts/process.json :
// {
//   "trimPad": 4,
//   "ops": {
//     "vehicle":  { "chroma": "magenta", "hole": "porthole", "points": { "lamp": [850, 200] } },
//     "narrator": { "parts": { "head": [96,0,840,650], "mouth": [352,500,660,640], "brow-l": [326,310,484,392], "brow-r": [496,310,672,392] },
//                   "bodyClear": { "box": [96,0,840,600], "featherFrom": 560 }, "points": { "neck": [470,655], "eyes": [[418,420],[566,412]] } },
//     "sky":      { "fade": "bottom", "from": 0.45 },
//     "ground":   { "fade": "top", "to": 0.5 },
//     "eye":      { "fade": "radial", "from": 0.62 }
//   }
// }
// - chroma : les pixels magenta (ou vert) deviennent transparents ; "hole" mesure le disque (centre, rayon) -> meta[id].hole
// - parts : découpes alignées dans le repère de l'image source (pas de rognage) -> <id>-<part>.png ; le corps sans les
//   parties (bodyClear, bord adouci) -> <id>-body.png. Sert au rig du narrateur (tête qui bouge, bouche, sourcils).
// - fade : fondu alpha (top/bottom/left/right/radial)
// - points : coordonnées utiles (dans l'image source) recopiées dans meta, converties au repère rogné quand il y a rognage
// Tous les autres assets sont simplement rognés (marges transparentes) avec trimPad.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = "public/assets/raw", OUT = "public/assets";
const cfg = fs.existsSync("scripts/process.json") ? JSON.parse(fs.readFileSync("scripts/process.json", "utf8")) : { ops: {} };
const PAD = cfg.trimPad ?? 4;
const meta = {};
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

async function load(id) {
  const { data, info } = await sharp(path.join(RAW, id + ".png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
const png = (data, w, h) => sharp(data, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 8 });

async function trimSave(id, img, pad, outId = id) {
  const { data, w, h } = img;
  let minx = w, miny = h, maxx = -1, maxy = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 10) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
  }
  if (maxx < 0) { minx = 0; miny = 0; maxx = w - 1; maxy = h - 1; }
  minx = Math.max(0, minx - pad); miny = Math.max(0, miny - pad); maxx = Math.min(w - 1, maxx + pad); maxy = Math.min(h - 1, maxy + pad);
  const cw = maxx - minx + 1, ch = maxy - miny + 1;
  await png(data, w, h).extract({ left: minx, top: miny, width: cw, height: ch }).toFile(path.join(OUT, outId + ".png"));
  meta[outId] = { w: cw, h: ch, ox: minx, oy: miny, srcW: w, srcH: h };
  return { minx, miny, cw, ch };
}

function chromaKey(img, color) {
  const { data, w, h } = img;
  const isKey = color === "green"
    ? (r, g, b) => g > 120 && r < 110 && b < 110 && g - r > 70 && g - b > 70
    : (r, g, b) => r > 120 && b > 120 && g < 110 && r - g > 70 && b - g > 70;
  let sx = 0, sy = 0, n = 0, minx = w, maxx = 0, miny = h, maxy = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (isKey(data[i], data[i + 1], data[i + 2])) { data[i + 3] = 0; sx += x; sy += y; n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
  }
  // érosion d'un pixel : frange colorée au bord du trou
  const a = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = data[i * 4 + 3];
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (a[i] > 0 && (a[i - 1] === 0 || a[i + 1] === 0 || a[i - w] === 0 || a[i + w] === 0)) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      const fringe = color === "green" ? g - r > 40 && g - b > 40 : r - g > 40 && b - g > 40;
      if (fringe) data[i * 4 + 3] = 0;
    }
  }
  return n ? { cx: sx / n, cy: sy / n, r: ((maxx - minx) + (maxy - miny)) / 4 } : null;
}

const ids = fs.readdirSync(RAW).filter((f) => f.endsWith(".png")).map((f) => f.replace(/\.png$/, ""));
fs.mkdirSync(OUT, { recursive: true });
for (const id of ids) {
  const op = cfg.ops?.[id] || {};
  const img = await load(id);
  const { data, w, h } = img;
  let hole = null;
  if (op.chroma) hole = chromaKey(img, op.chroma);
  if (op.fade) {
    const from = op.from ?? 0.5, to = op.to ?? 1.0;
    const fn = {
      bottom: (u, v) => 1 - smooth(from, to, v),
      top: (u, v) => smooth(from - from, to, v),
      left: (u, v) => smooth(0, to, u),
      right: (u, v) => 1 - smooth(from, to, u),
      radial: (u, v) => { const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2.4; return 1 - smooth(from, to, Math.sqrt(dx * dx + dy * dy)); },
    }[op.fade];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; data[i + 3] = Math.round(data[i + 3] * fn(x / w, y / h)); }
  }
  if (op.parts) {
    // découpes alignées dans le repère source
    for (const [part, [x0, y0, x1, y1]] of Object.entries(op.parts)) {
      const cw = x1 - x0, ch = y1 - y0, buf = Buffer.alloc(cw * ch * 4);
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const si = ((y + y0) * w + (x + x0)) * 4, di = (y * cw + x) * 4;
        buf[di] = data[si]; buf[di + 1] = data[si + 1]; buf[di + 2] = data[si + 2]; buf[di + 3] = data[si + 3];
      }
      const pid = `${id}-${part}`;
      await png(buf, cw, ch).toFile(path.join(OUT, pid + ".png"));
      meta[pid] = { w: cw, h: ch, ox: x0, oy: y0, srcW: w, srcH: h };
    }
    const body = Buffer.from(data);
    if (op.bodyClear) {
      const [bx0, by0, bx1, by1] = op.bodyClear.box, feather = op.bodyClear.featherFrom ?? by1 - 40;
      for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) { const i = (y * w + x) * 4; body[i + 3] = Math.round(body[i + 3] * smooth(feather, by1, y)); }
    }
    await png(body, w, h).toFile(path.join(OUT, `${id}-body.png`));
    meta[`${id}-body`] = { w, h, ox: 0, oy: 0, srcW: w, srcH: h, points: op.points };
    console.log("parts", id, Object.keys(op.parts).join(", "));
    continue;
  }
  const t = await trimSave(id, img, op.noTrim ? 0 : PAD);
  if (hole) meta[id].hole = { cx: hole.cx - t.minx, cy: hole.cy - t.miny, r: hole.r };
  if (op.points) {
    meta[id].points = {};
    for (const [k, v] of Object.entries(op.points)) meta[id].points[k] = Array.isArray(v[0]) ? v.map(([x, y]) => [x - t.minx, y - t.miny]) : [v[0] - t.minx, v[1] - t.miny];
  }
  console.log("ok", id, `${t.cw}x${t.ch}`, hole ? "hole " + JSON.stringify(meta[id].hole) : "");
}
// sprite doux pour les particules
{
  const S = 64;
  const svg = Buffer.from(`<svg width="${S}" height="${S}"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="url(#g)"/></svg>`);
  await sharp(svg).png().toFile(path.join(OUT, "soft.png"));
  meta.soft = { w: S, h: S, ox: 0, oy: 0, srcW: S, srcH: S };
}
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
console.log("assets:", Object.keys(meta).length, "-> public/assets/meta.json");
