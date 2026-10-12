// Post-traitement des assets bruts -> public/assets/*.png + public/assets/meta.json
// - perce le hublot magenta du bathyscaphe et mesure le cercle
// - découpe le professeur en pièces alignées (corps sans tête, tête, moustache, sourcils)
// - fondus alpha sur les décors (surface, fond, œil, paroi)
// - rogne les marges transparentes des autres assets
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const RAW = "public/assets/raw";
const OUT = "public/assets";
const meta = {};

async function load(id) {
  const { data, info } = await sharp(path.join(RAW, id + ".png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
function png(data, w, h) {
  return sharp(data, { raw: { width: w, height: h, channels: 4 } }).png({ compressionLevel: 8 });
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

async function trimSave(id, img, pad = 6, outId = id) {
  const { data, w, h } = img;
  let minx = w, miny = h, maxx = -1, maxy = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[(y * w + x) * 4 + 3] > 10) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
  }
  minx = Math.max(0, minx - pad); miny = Math.max(0, miny - pad); maxx = Math.min(w - 1, maxx + pad); maxy = Math.min(h - 1, maxy + pad);
  const cw = maxx - minx + 1, ch = maxy - miny + 1;
  await png(data, w, h).extract({ left: minx, top: miny, width: cw, height: ch }).toFile(path.join(OUT, outId + ".png"));
  meta[outId] = { w: cw, h: ch, ox: minx, oy: miny, srcW: w, srcH: h };
  return { minx, miny, cw, ch };
}

// --- bathysphère : chroma key magenta -> alpha 0, cercle du hublot
{
  const img = await load("bathysphere");
  const { data, w, h } = img;
  let sx = 0, sy = 0, n = 0, minx = w, maxx = 0, miny = h, maxy = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const mag = r > 120 && b > 120 && g < 110 && r - g > 70 && b - g > 70;
    if (mag) { data[i + 3] = 0; sx += x; sy += y; n++; if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
  }
  // érode d'un pixel le bord du trou (frange magenta)
  const a = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = data[i * 4 + 3];
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    if (a[i] > 0 && (a[i - 1] === 0 || a[i + 1] === 0 || a[i - w] === 0 || a[i + w] === 0)) {
      // pixel de bord : s'il tire vers le magenta, on le rend transparent
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      if (r - g > 40 && b - g > 40) data[i * 4 + 3] = 0;
    }
  }
  const cx = sx / n, cy = sy / n, radius = ((maxx - minx) + (maxy - miny)) / 4;
  const t = await trimSave("bathysphere", img, 4);
  meta.bathysphere.porthole = { cx: cx - t.minx, cy: cy - t.miny, r: radius };
  // position de la lampe (mesurée sur la grille) : centre ~ (850, 200) dans l'image 1024
  meta.bathysphere.lamp = { x: 850 - t.minx, y: 200 - t.miny };
  console.log("bathysphere porthole", meta.bathysphere.porthole, "lamp", meta.bathysphere.lamp);
}

// --- professeur : pièces alignées dans le repère 1024x1024 de l'image source
{
  const img = await load("professor");
  const { data, w, h } = img;
  const cut = (id, x0, y0, x1, y1) => {
    const cw = x1 - x0, ch = y1 - y0;
    const buf = Buffer.alloc(cw * ch * 4);
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const si = ((y + y0) * w + (x + x0)) * 4, di = (y * cw + x) * 4;
      buf[di] = data[si]; buf[di + 1] = data[si + 1]; buf[di + 2] = data[si + 2]; buf[di + 3] = data[si + 3];
    }
    meta[id] = { w: cw, h: ch, ox: x0, oy: y0, srcW: w, srcH: h };
    return png(buf, cw, ch).toFile(path.join(OUT, id + ".png"));
  };
  // tête (cheveux, visage, menton + haut du cou pour recouvrir la jointure)
  await cut("professor-head", 96, 0, 840, 650);
  await cut("professor-mustache", 352, 500, 660, 640);
  await cut("professor-brow-l", 326, 310, 484, 392);
  await cut("professor-brow-r", 496, 310, 672, 392);
  // corps : on efface la zone de la tête (au-dessus du menton) avec un fondu doux
  const body = Buffer.from(data);
  for (let y = 0; y < 600; y++) for (let x = 96; x < 840; x++) {
    const i = (y * w + x) * 4;
    const k = smooth(560, 600, y); // 0 au-dessus de 560, 1 à 600
    body[i + 3] = Math.round(body[i + 3] * k);
  }
  await png(body, w, h).toFile(path.join(OUT, "professor-body.png"));
  meta["professor-body"] = { w, h, ox: 0, oy: 0, srcW: w, srcH: h, neck: { x: 470, y: 655 }, eyes: [{ x: 418, y: 420 }, { x: 566, y: 412 }] };
}

// --- décors avec fondus
{
  const fade = async (id, fn) => {
    const img = await load(id);
    const { data, w, h } = img;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; data[i + 3] = Math.round(data[i + 3] * fn(x / w, y / h)); }
    await trimSave(id, img, 2);
  };
  await fade("surface", (u, v) => 1 - smooth(0.45, 1.0, v));
  await fade("seafloor", (u, v) => smooth(0.05, 0.5, v));
  await fade("rock-wall", (u, v) => (1 - smooth(0.0, 0.3, 1 - u) * 0) * (1 - smooth(0.9, 1.0, v)) * smooth(0.0, 0.08, v));
  await fade("eye", (u, v) => { const dx = (u - 0.5) * 2, dy = (v - 0.5) * 2.4; const r = Math.sqrt(dx * dx + dy * dy); return 1 - smooth(0.62, 1.0, r); });
}

// --- le reste : rognage simple
for (const id of ["professor-hand", "fish-small", "turtle", "jellyfish", "lanternfish", "anglerfish", "squid", "whale", "snailfish", "amphipod", "statue", "eiffel", "burj", "titanic", "everest", "plastic-bag", "bubble", "rock-bottom"]) {
  await trimSave(id, await load(id), 4);
}

// --- sprite doux pour les particules
{
  const S = 64;
  const svg = Buffer.from(`<svg width="${S}" height="${S}"><defs><radialGradient id="g"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="url(#g)"/></svg>`);
  await sharp(svg).png().toFile(path.join(OUT, "soft.png"));
  meta.soft = { w: S, h: S, ox: 0, oy: 0, srcW: S, srcH: S };
}

fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify(meta, null, 2));
console.log("assets:", Object.keys(meta).length);
