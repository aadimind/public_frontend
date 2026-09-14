import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/api/client.ts", import.meta.url), "utf8");
if (!source.includes("if (IS_PRODUCTION_BUILD) return false;")) throw new Error("Production mock boundary is not fail-closed");
if (!source.includes("const IS_PRODUCTION_BUILD = NODE_ENV === \"production\";")) throw new Error("Production mode detection is missing");
if (!source.includes('const DEFAULT_API_BASE_URL = "https://api.micromath.in";')) throw new Error("Production API default is missing");
console.log("Production API boundary is fail-closed: mock mode is disabled in production builds.");
