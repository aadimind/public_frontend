import { readFile } from "node:fs/promises";

const LOCAL = new URL("../contracts/api-v1.json", import.meta.url);
const contract = JSON.parse(await readFile(LOCAL, "utf8"));

if (contract.contractVersion !== "1.0.0" || contract.sourceOfTruth !== "aadimind/backend" || typeof contract.resources !== "object" || typeof contract.authTransport !== "object") {
  console.error("Invalid canonical API contract snapshot.");
  process.exit(1);
}

console.log("API contract snapshot is valid.");
