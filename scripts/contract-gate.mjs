import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const localPath = new URL("../contracts/api-v1.json", import.meta.url);
const siblingBackend = fileURLToPath(new URL("../../backend/contracts/api-v1.json", import.meta.url));
const siblingAdmin = fileURLToPath(new URL("../../admin_frontend/contracts/api-v1.json", import.meta.url));

const normalize = (value) => JSON.stringify(JSON.parse(value));
const local = normalize(await readFile(localPath, "utf8"));

for (const [name, path] of [["backend", siblingBackend], ["admin_frontend", siblingAdmin]]) {
  const sibling = normalize(await readFile(path, "utf8"));
  if (local !== sibling) throw new Error(`API contract drift detected between public_frontend and ${name}`);
}

console.log("Local cross-repository API contract gate passed.");
