import { readFile } from "node:fs/promises";

const SOURCE = "https://raw.githubusercontent.com/aadimind/backend/main/contracts/api-v1.json";
const LOCAL = new URL("../contracts/api-v1.json", import.meta.url);

const canonical = JSON.stringify(await (await fetch(SOURCE)).json());
const local = JSON.stringify(JSON.parse(await readFile(LOCAL, "utf8")));

if (canonical !== local) {
  console.error("API contract drift detected: public_frontend snapshot differs from aadimind/backend.");
  process.exit(1);
}

console.log("API contract snapshot is aligned with aadimind/backend.");
