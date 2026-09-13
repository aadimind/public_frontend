import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const sitemapPath = join(root, "public", "sitemap.xml");

if (!existsSync(sitemapPath)) {
  console.warn("[sync-sitemap] no sitemap.xml found, skipping");
  process.exit(0);
}

const siteUrlEnv = process.env.VITE_SITE_URL;
const original = readFileSync(sitemapPath, "utf8");

// Only substitute when VITE_SITE_URL is explicitly provided. Otherwise leave the
// placeholders in place so the committed sitemap stays a template.
if (!siteUrlEnv) {
  console.log("[sync-sitemap] VITE_SITE_URL not set, leaving sitemap as template");
  process.exit(0);
}

const siteUrl = siteUrlEnv.replace(/\/$/, "");
const replaced = original.replace(/__SITE_URL__/g, siteUrl);

if (replaced !== original) {
  writeFileSync(sitemapPath, replaced, "utf8");
  console.log(`[sync-sitemap] sitemap.xml updated with site URL ${siteUrl}`);
}