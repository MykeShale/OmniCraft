// Rend des images fixes en headless (bundle unique) + planche-contact : c'est LE test de vérité du rendu.
// Usage : node scripts/stills.mjs [frame ...] [--scale=0.5] [--sheet] [--gl=angle|swangle] [--comp=Film] [--nofx] [--fxlevel=N] [--verbose]
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import sharp from "sharp";

const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split("=")[1];
const scale = Number(opt("scale", "0.5")), gl = opt("gl", "angle"), comp = opt("comp", "Film");
const sheet = args.includes("--sheet");
const logLevel = args.includes("--verbose") ? "verbose" : "warn";
const frames = args.filter((a) => !a.startsWith("--")).map(Number);
const inputProps = {};
if (args.includes("--nofx")) inputProps.fx = false;
if (args.find((a) => a.startsWith("--fxlevel="))) inputProps.fxLevel = Number(opt("fxlevel", "4"));
const suffix = (args.includes("--nofx") ? "-nofx" : "") + (gl !== "angle" ? "-" + gl : "");

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
console.log("bundle ok", ((Date.now() - t0) / 1000).toFixed(0) + "s");
const chromiumOptions = { gl };
const composition = await selectComposition({ serveUrl, id: comp, chromiumOptions, logLevel, inputProps });
if (!frames.length) { const n = composition.durationInFrames; for (let i = 0; i < 12; i++) frames.push(Math.round((n - 1) * (i + 0.5) / 12)); }
fs.mkdirSync("out/stills", { recursive: true });
const outs = [];
for (const frame of frames) {
  const t1 = Date.now();
  const output = `out/stills/f${String(frame).padStart(4, "0")}${suffix}.png`;
  await renderStill({ composition, serveUrl, output, frame, scale, chromiumOptions, logLevel, timeoutInMilliseconds: 120000, inputProps });
  outs.push(output);
  console.log("still", frame, ((Date.now() - t1) / 1000).toFixed(1) + "s");
}
if (sheet) {
  const T = 480, TH = Math.round((T * composition.height) / composition.width), COLS = 3, rows = Math.ceil(outs.length / COLS);
  const tiles = [];
  for (let i = 0; i < outs.length; i++) {
    const buf = await sharp(outs[i]).resize(T, TH).png().toBuffer();
    const label = Buffer.from(`<svg width="${T}" height="22"><rect width="${T}" height="22" fill="rgba(0,0,0,0.55)"/><text x="6" y="16" font-family="Arial" font-size="14" fill="#fff">frame ${frames[i]}</text></svg>`);
    tiles.push({ input: buf, left: (i % COLS) * T, top: Math.floor(i / COLS) * TH }, { input: label, left: (i % COLS) * T, top: Math.floor(i / COLS) * TH });
  }
  await sharp({ create: { width: COLS * T, height: rows * TH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } }).composite(tiles).png().toFile("out/stills/sheet.png");
  console.log("sheet -> out/stills/sheet.png");
}
console.log("total", ((Date.now() - t0) / 1000).toFixed(0) + "s");
