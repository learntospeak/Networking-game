const { test, expect } = require("@playwright/test");
const fs = require("fs");
const {
  attachSmokeData,
  createSmokeReport,
  gotoAndStabilize,
  observePage,
  pushCheck,
  readText
} = require("./smoke-helpers");

test("Terminal track refresh: static shell uses neutral loading labels", async ({}, testInfo) => {
  const report = createSmokeReport("Terminal Track Static Fallback", "/terminal-coach.html");
  const html = fs.readFileSync("terminal-coach.html", "utf8");

  const staticFallbacksAreNeutral = [
    /id="terminalPageTitle"[^>]*>Terminal Coach</.test(html),
    /id="terminalPageKicker"[^>]*>Terminal Learning</.test(html),
    /id="terminalPageIntro"[^>]*>Loading the selected terminal lab\.</.test(html),
    /id="mobileEnvironmentBadge"[^>]*>Terminal Learning</.test(html),
    /id="mobileScenarioTitle"[^>]*>Loading selected lab</.test(html),
    !/id="terminalPageTitle"[^>]*>Linux Terminal Coach</.test(html),
    !/id="mobileEnvironmentBadge"[^>]*>Linux Terminal Learning</.test(html),
    !/id="mobileScenarioTitle"[^>]*>Log Triage on a Linux Host</.test(html)
  ];

  const ok = staticFallbacksAreNeutral.every(Boolean);
  pushCheck(report, "static terminal fallback labels are neutral", ok, "no Linux-only labels before JS applies the selected track");

  await attachSmokeData(testInfo, report);
  expect(ok).toBeTruthy();
});

test("Terminal track refresh: Windows selection survives a reload without query string", async ({ page }, testInfo) => {
  const report = createSmokeReport("Terminal Track Refresh", "/terminal-coach.html");
  observePage(page, report);

  await gotoAndStabilize(page, "/terminal-coach.html?track=windows&mode=beginner");
  await expect(page.locator("#terminalPageTitle")).toContainText("Windows Terminal Coach");
  await expect(page.locator("body")).toHaveAttribute("data-environment-category", "windows");

  await gotoAndStabilize(page, "/terminal-coach.html");

  const pageTitle = await readText(page, "#terminalPageTitle");
  const mobileTrack = await readText(page, "#mobileEnvironmentBadge");
  const bodyCategory = await page.locator("body").getAttribute("data-environment-category");

  pushCheck(report, "Windows title remains after queryless reload", /Windows Terminal Coach/i.test(pageTitle), pageTitle);
  pushCheck(report, "Windows environment remains after queryless reload", bodyCategory === "windows", bodyCategory || "");
  pushCheck(report, "mobile track label is not Linux after queryless reload", !/Linux/i.test(mobileTrack), mobileTrack);
  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));

  await attachSmokeData(testInfo, report);
  expect(report.checks.every((check) => check.ok)).toBeTruthy();
});
