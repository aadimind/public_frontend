import { test, expect } from "@playwright/test";

test("public SPA serves its shell and safe navigation baseline", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("#root")).toBeVisible();
  await expect(page).toHaveTitle(/Micromath/i);

  await page.goto("/does-not-exist");
  await expect(page.locator("#root")).toBeVisible();
});
