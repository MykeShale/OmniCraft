// Génère la voix off (une réplique = un wav) avec gpt-4o-mini-tts.
// Usage : node scripts/gen-vo.mjs [voice] [outDir]     (voix : ash, onyx, cedar, marin, coral, sage, nova…)
// Lit scripts/vo-script.json : { voice: { instructions }, lines: [{ id, text }] }
import fs from "node:fs";
import path from "node:path";
import { openaiKey } from "./openai-key.mjs";

const script = JSON.parse(fs.readFileSync(path.join("scripts", "vo-script.json"), "utf8"));
const voice = process.argv[2] || script.voice?.voice || "ash";
const outDir = process.argv[3] || path.join("public", "audio", "vo", voice);
fs.mkdirSync(outDir, { recursive: true });
const key = openaiKey();
const instructions = script.voice?.instructions || "Narrateur documentaire, voix posée et claire, rythme soutenu sans traîner.";

async function gen(line) {
  const r = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ model: script.voice?.model || "gpt-4o-mini-tts", voice, input: line.text, instructions, response_format: "wav" }),
  });
  if (r.status !== 200) throw new Error(line.id + " http " + r.status + " " + (await r.text()).slice(0, 300));
  const out = path.join(outDir, line.id + ".wav");
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  return out;
}
const results = await Promise.all(script.lines.map((l) => gen(l)));
console.log(voice, "->", results.length, "fichiers dans", outDir);
