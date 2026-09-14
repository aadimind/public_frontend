import { readFile } from "node:fs/promises";
const contract = JSON.parse(await readFile(new URL("../contracts/api-v1.json", import.meta.url), "utf8"));
if (contract.contractVersion !== "1.0.0" || contract.sourceOfTruth !== "aadimind/backend" || typeof contract.resources !== "object" || typeof contract.authTransport !== "object") throw new Error("Invalid canonical API contract snapshot.");
if (contract.security?.refreshTransport !== "cookie-only" || contract.security?.csrf?.failClosed !== true) throw new Error("Invalid security invariants in API contract snapshot.");
console.log("API contract snapshot is valid.");
