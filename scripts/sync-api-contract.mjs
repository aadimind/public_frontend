import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const LOCAL = new URL("../contracts/api-v1.json", import.meta.url);
const SIBLING = fileURLToPath(new URL("../../backend/contracts/api-v1.json", import.meta.url));
const SOURCE = "https://raw.githubusercontent.com/aadimind/backend/main/contracts/api-v1.json";

let contract;
try {
  contract = JSON.parse(await readFile(SIBLING, "utf8"));
  console.log("API contract synchronized from local aadimind/backend.");
} catch {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`Canonical backend contract is not available locally and remote fetch failed: HTTP ${response.status}`);
  contract = await response.json();
  console.log("API contract synchronized from aadimind/backend.");
}

await writeFile(LOCAL, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
