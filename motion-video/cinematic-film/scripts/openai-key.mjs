// Clé OpenAI : variable d'environnement OPENAI_API_KEY, sinon le fichier central dev-infra de l'utilisateur.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function openaiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  const candidates = [
    path.join(os.homedir(), "OneDrive", "Bureau", "dev-infra", "credentials.local.env"),
    path.join(os.homedir(), "Desktop", "dev-infra", "credentials.local.env"),
    path.join(os.homedir(), "dev-infra", "credentials.local.env"),
  ];
  for (const f of candidates) {
    if (!fs.existsSync(f)) continue;
    const m = fs.readFileSync(f, "utf8").match(/^OPENAI_API_KEY=(.*)$/m);
    if (m) return m[1].trim().replace(/^"|"$/g, "");
  }
  throw new Error("OPENAI_API_KEY introuvable : exporte la variable ou renseigne dev-infra/credentials.local.env");
}
