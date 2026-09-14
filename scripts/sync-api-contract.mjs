import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const LOCAL = new URL("../contracts/api-v1.json", import.meta.url);
const LOCAL_TYPES = new URL("../contracts/api-v1.types.ts", import.meta.url);
const SIBLING = fileURLToPath(new URL("../../backend/contracts/api-v1.json", import.meta.url));
const SIBLING_TYPES = fileURLToPath(new URL("../../backend/contracts/api-v1.types.ts", import.meta.url));
const SOURCE = "https://raw.githubusercontent.com/aadimind/backend/main/contracts/api-v1.json";
const SOURCE_TYPES = "https://raw.githubusercontent.com/aadimind/backend/main/contracts/api-v1.types.ts";

let contract;
let types;
try {
  contract = JSON.parse(await readFile(SIBLING, "utf8"));
  types = await readFile(SIBLING_TYPES, "utf8");
} catch {
  const response = await fetch(SOURCE);
  if (!response.ok) throw new Error(`Canonical backend contract fetch failed: HTTP ${response.status}`);
  contract = await response.json();
  const typeResponse = await fetch(SOURCE_TYPES);
  if (!typeResponse.ok) throw new Error(`Canonical backend generated types fetch failed: HTTP ${typeResponse.status}`);
  types = await typeResponse.text();
}
await writeFile(LOCAL, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
await writeFile(LOCAL_TYPES, types.endsWith("\n") ? types : `${types}\n`, "utf8");
console.log("API contract and generated types synchronized.");
