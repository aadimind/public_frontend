import { writeFile } from "node:fs/promises";

const SOURCE = "https://raw.githubusercontent.com/aadimind/backend/main/contracts/api-v1.json";
const LOCAL = new URL("../contracts/api-v1.json", import.meta.url);
const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`Failed to fetch canonical API contract: HTTP ${response.status}`);
const contract = await response.json();
await writeFile(LOCAL, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
console.log("API contract synchronized from aadimind/backend.");
