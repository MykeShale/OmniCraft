// Scaffold d'un projet de film cinématique Remotion + three.js.
// Usage : node <skill>/scripts/setup.mjs <dossier> --name "Titre" [--w 1920 --h 1080] [--port 3012]
// - package.json + dépendances (versions éprouvées), tsconfig, remotion.config, launch.json
// - copie templates/base (socle générique) et les scripts du pipeline dans <dossier>/scripts
// - écrit des fichiers de config vides à remplir : scripts/vo-script.json, assets.json, process.json, audio.json
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skill = path.resolve(here, "..");
const args = process.argv.slice(2);
const dir = path.resolve(args.find((a) => !a.startsWith("--")) || "film-video");
const opt = (k, d) => { const i = args.indexOf("--" + k); return i >= 0 ? args[i + 1] : d; };
const name = opt("name", "Film"), W = Number(opt("w", 1920)), H = Number(opt("h", 1080)), port = Number(opt("port", 3012));

fs.mkdirSync(dir, { recursive: true });
const pkg = {
  name: path.basename(dir).toLowerCase().replace(/[^a-z0-9-]/g, "-"),
  private: true, type: "commonjs",
  scripts: { studio: `remotion studio --port ${port}`, render: "remotion render Film out/film.mp4 --gl=angle --codec=h264 --crf=17", typecheck: "tsc --noEmit", stills: "node scripts/stills.mjs --sheet" },
  dependencies: {
    "@react-three/fiber": "^9.8.1", "@remotion/cli": "4.0.529", "@remotion/google-fonts": "4.0.529", "@remotion/media-utils": "4.0.529",
    "@remotion/noise": "4.0.529", "@remotion/paths": "4.0.529", "@remotion/three": "4.0.529", "@remotion/bundler": "4.0.529", "@remotion/renderer": "4.0.529",
    postprocessing: "^6.39.5", react: "^19.3.0", "react-dom": "^19.3.0", remotion: "4.0.529", three: "^0.186.1",
  },
  devDependencies: { "@types/react": "^19.3.0", "@types/react-dom": "^19.3.0", "@types/three": "^0.186.0", sharp: "^0.35.5", typescript: "^5.9.0" },
};
fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2));

// copie récursive du socle
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else if (!fs.existsSync(d)) fs.copyFileSync(s, d);
  }
}
copyDir(path.join(skill, "templates", "base"), dir);
fs.mkdirSync(path.join(dir, "scripts"), { recursive: true });
for (const f of ["gen-assets.mjs", "process-assets.mjs", "contact-sheet.mjs", "gen-vo.mjs", "build-timeline.mjs", "make-audio.mjs", "stills.mjs", "openai-key.mjs"]) {
  fs.copyFileSync(path.join(skill, "scripts", f), path.join(dir, "scripts", f));
}
fs.mkdirSync(path.join(dir, "public", "assets", "raw"), { recursive: true });
fs.mkdirSync(path.join(dir, "public", "audio"), { recursive: true });
fs.mkdirSync(path.join(dir, "out"), { recursive: true });

// launch.json avec le bon port
const lj = path.join(dir, ".claude", "launch.json");
fs.mkdirSync(path.dirname(lj), { recursive: true });
fs.writeFileSync(lj, JSON.stringify({ version: "0.0.1", configurations: [{ name: "studio", runtimeExecutable: "npx", runtimeArgs: ["remotion", "studio", "--port", String(port)], port }] }, null, 2));

// configs à remplir
const w = (f, obj) => { const p = path.join(dir, "scripts", f); if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(obj, null, 2)); };
w("vo-script.json", {
  fps: 30, width: W, height: H, intro: 50, outro: 110, defaultGap: 15,
  voice: { model: "gpt-4o-mini-tts", voice: "ash", speed: 1.06, instructions: "Narrateur : décris ici le personnage, le ton (mystérieux, complice, épique…), le rythme (soutenu, sans traîner), les nombres lus en français naturel." },
  lines: [
    { id: "00-intro", text: "Première réplique : l'accroche.", label: "TITRE DU PALIER", sub: "sous-titre court", value: 0, gapAfter: 20 },
    { id: "01-step", text: "Deuxième réplique.", label: "PALIER 2", sub: "fait marquant", value: 1 },
    { id: "09-end", text: "Dernière réplique : la chute.", label: "", sub: "punchline", value: 2, gapAfter: 0 },
  ],
  events: [
    { id: "impact", line: "01-step", at: "start", offset: 120 },
    { id: "blackout", line: "09-end", at: "end", offset: 15 },
    { id: "title", event: "blackout", offset: 45 },
  ],
});
w("assets.json", {
  styleSuffix: " Painterly cinematic digital illustration with visible textured brushwork, matte finish, rich detail, dramatic rim light from top-left, no text, no watermark. Isolated on a fully transparent background (PNG alpha): absolutely no backdrop, no gradient, no vignette, no fog, no ambient glow or halo outside the subject silhouette. The whole subject is visible with margin around it.",
  assets: [
    { id: "narrator", model: "gpt-image-2.5-sunburst", size: "1024x1024", quality: "high", prompt: "Bust portrait (head and shoulders) of the narrator character, facing the viewer, mouth closed, no hands visible, lit by warm light from below-left and cool rim light from above-right." },
    { id: "vehicle", model: "gpt-image-2.5-sunburst", size: "1024x1024", quality: "high", prompt: "The vehicle or frame the narrator sits in, seen from the side, with one large round window in the center whose glass is a solid flat pure magenta disc (RGB 255, 0, 255), perfectly uniform, no reflections, nothing visible inside." },
  ],
});
w("process.json", {
  trimPad: 4,
  ops: {
    vehicle: { chroma: "magenta", hole: "porthole", points: { lamp: [850, 200] } },
    narrator: { parts: { head: [96, 0, 840, 650], mouth: [352, 500, 660, 640], "brow-l": [326, 310, 484, 392], "brow-r": [496, 310, 672, 392] }, bodyClear: { box: [96, 0, 840, 600], featherFrom: 560 }, points: { neck: [470, 655], eyes: [[418, 420], [566, 412]] } },
  },
});
w("audio.json", { mood: "dark-ambient", root: 36.71, pingsAtBeats: true, pulseFrom: null, heartbeatFrom: null, creaksFrom: null, riserBefore: "blackout", impacts: [{ event: "impact", level: 0.5 }], finalPing: "blackout", openingBubbles: true });

// timeline placeholder pour que le projet compile avant la voix
const tlp = path.join(dir, "src", "timeline.json");
if (!fs.existsSync(tlp)) fs.writeFileSync(tlp, JSON.stringify({ fps: 30, width: W, height: H, durationInFrames: 900, intro: 50, outro: 110, voice: "ash", speed: 1, beats: [
  { id: "00-intro", value: 0, text: "", label: "PALIER", sub: "sous-titre", zone: "", voSrc: "", start: 50, dur: 200, end: 250, gapAfter: 15 },
  { id: "01-step", value: 1, text: "", label: "PALIER 2", sub: "", zone: "", voSrc: "", start: 265, dur: 200, end: 465, gapAfter: 15 },
  { id: "09-end", value: 2, text: "", label: "", sub: "punchline", zone: "", voSrc: "", start: 480, dur: 200, end: 680, gapAfter: 0 },
], events: { impact: 385, blackout: 695, title: 740 } }, null, 2));
// meta.json vide pour que les imports passent avant la génération des assets
const mp = path.join(dir, "public", "assets", "meta.json");
if (!fs.existsSync(mp)) fs.writeFileSync(mp, "{}");

fs.writeFileSync(path.join(dir, "FILM.md"), `# ${name}\n\nProjet généré par le skill cinematic-film. Voir le SKILL.md pour le workflow :\n1. scripts/vo-script.json (répliques, paliers, événements) -> node scripts/gen-vo.mjs ash -> node scripts/build-timeline.mjs ash 1.06\n2. scripts/assets.json -> node scripts/gen-assets.mjs -> node scripts/contact-sheet.mjs -> scripts/process.json -> node scripts/process-assets.mjs\n3. scripts/audio.json -> node scripts/make-audio.mjs\n4. src/film.config.ts + src/scene/Story.tsx : caméra, environnement, chorégraphie\n5. node scripts/stills.mjs --sheet ; npm run render\n`);

console.log("npm install dans", dir, "(2 à 4 minutes)…");
execSync("npm install --no-audit --no-fund", { cwd: dir, stdio: "inherit" });
console.log("OK ->", dir);
