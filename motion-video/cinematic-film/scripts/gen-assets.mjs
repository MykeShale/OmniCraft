// Génère les assets peints (PNG transparents) avec gpt-image-2.5 d'après scripts/assets.json.
// Usage : node scripts/gen-assets.mjs [id ...] [--force]     (reprend là où ça s'est arrêté ; --force regénère)
// assets.json : { "styleSuffix": "...", "assets": [ { "id", "model", "size", "quality", "prompt" } ] }
//   model   : gpt-image-2.5-sunburst (détail max, ~30 s) | gpt-image-2.5-flare (~12 s) | gpt-image-2
//   size    : 1024x1024 | 1536x1024 (large) | 1024x1536 (haut)
//   quality : low | medium | high
import fs from "node:fs";
import path from "node:path";
import { openaiKey } from "./openai-key.mjs";

const key = openaiKey();
const manifest = JSON.parse(fs.readFileSync("scripts/assets.json", "utf8"));
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const outDir = "public/assets/raw";
fs.mkdirSync(outDir, { recursive: true });
const queue = manifest.assets.filter((a) => (only.length ? only.includes(a.id) : true));

async function gen(a) {
  const out = path.join(outDir, a.id + ".png");
  if (!force && fs.existsSync(out)) return console.log("skip", a.id);
  const t0 = Date.now();
  for (let attempt = 1; attempt <= 3; attempt++) {
    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model: a.model || "gpt-image-2.5-flare", prompt: a.prompt + (manifest.styleSuffix || ""), size: a.size || "1024x1024", quality: a.quality || "medium", background: "transparent", output_format: "png", n: 1 }),
    });
    const j = await r.json();
    if (j.data) {
      fs.writeFileSync(out, Buffer.from(j.data[0].b64_json, "base64"));
      return console.log("ok", a.id, ((Date.now() - t0) / 1000).toFixed(0) + "s");
    }
    console.log("retry", a.id, attempt, r.status, JSON.stringify(j).slice(0, 200));
    await new Promise((res) => setTimeout(res, 3000 * attempt));
  }
  console.log("FAILED", a.id);
}
const CONC = 4;
let i = 0;
await Promise.all(Array.from({ length: CONC }, async () => { while (i < queue.length) await gen(queue[i++]); }));
console.log("done ->", outDir);
