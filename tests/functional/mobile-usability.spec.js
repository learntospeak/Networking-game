const { test, expect } = require("@playwright/test");
const {
  addLabHealth,
  attachSmokeData,
  checkNoHorizontalOverflow,
  createSmokeReport,
  dismissTicketBriefingIfPresent,
  gotoAndStabilize,
  observePage,
  pushCheck,
  readText,
  runTerminalCommand,
  runWalkthroughDemo
} = require("./smoke-helpers");

async function controlVisibleOrReachable(page, selector, menuText) {
  if (await page.locator(selector).isVisible().catch(() => false)) {
    return true;
  }

  const menuButton = page.locator(".terminal-mobile-menu-btn");
  if (await menuButton.isVisible().catch(() => false)) {
    await menuButton.click();
    await page.waitForTimeout(150);
    const found = await page.getByText(menuText, { exact: false }).first().isVisible().catch(() => false);
    await page.keyboard.press("Escape").catch(() => {});
    await page.locator(".terminal-mobile-menu-overlay").click({ position: { x: 5, y: 5 } }).catch(() => {});
    return found;
  }

  return false;
}

test("Mobile usability: beginner terminal remains usable at 390px", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const report = createSmokeReport("Mobile Beginner Usability", "/terminal-coach.html?track=windows&mode=beginner");
  addLabHealth(report, { pagesTested: ["mobile windows beginner terminal"] });
  observePage(page, report);

  await gotoAndStabilize(page, report.url);
  await dismissTicketBriefingIfPresent(page);

  const overflow = await checkNoHorizontalOverflow(page);
  pushCheck(report, "no horizontal overflow", !overflow.hasOverflow, JSON.stringify(overflow));
  if (overflow.hasOverflow) addLabHealth(report, { mobileFailures: ["horizontal overflow at 390px"] });
  expect(overflow.hasOverflow).toBeFalsy();

  await expect(page.locator("#terminalInput")).toBeVisible();
  await expect(page.locator("#terminalInput")).toBeEnabled();
  pushCheck(report, "terminal input visible", true, "terminal input visible");

  const commandHelpReachable = await controlVisibleOrReachable(page, "#commandSheetBtn", "Command Help");
  const hintReachable = await controlVisibleOrReachable(page, "#hintBtn", "Hint");
  const walkthroughReachable = await controlVisibleOrReachable(page, "#watchWalkthroughBtn", "Walkthrough");
  pushCheck(report, "Command Help reachable", commandHelpReachable, "Command Help");
  pushCheck(report, "Hint reachable", hintReachable, "Hint");
  pushCheck(report, "Walkthrough reachable", walkthroughReachable, "Walkthrough");
  if (!commandHelpReachable || !hintReachable || !walkthroughReachable) {
    addLabHealth(report, { mobileFailures: ["beginner controls not reachable"] });
  }
  expect(commandHelpReachable && hintReachable && walkthroughReachable).toBeTruthy();

  const dirResult = await runTerminalCommand(page, "dir", { resetBefore: true });
  report.commandResults.push(dirResult);
  addLabHealth(report, { commandsTested: ["dir"] });
  const inputCovered = await page.evaluate(() => {
    const input = document.querySelector("#terminalInput")?.getBoundingClientRect();
    const blockers = ["#taskCompleteCard", "#taskCompleteOverlay", "#walkthroughCard", "#walkthroughOverlay"]
      .map((selector) => document.querySelector(selector))
      .filter((node) => node && !node.hidden && window.getComputedStyle(node).display !== "none")
      .map((node) => node.getBoundingClientRect());
    if (!input) return true;
    return blockers.some((rect) => !(rect.right < input.left || rect.left > input.right || rect.bottom < input.top || rect.top > input.bottom));
  });
  pushCheck(report, "Tiny Wins does not cover input", !inputCovered, dirResult.notes);
  if (inputCovered) addLabHealth(report, { mobileFailures: ["tiny win covers terminal input"] });
  expect(inputCovered).toBeFalsy();

  const outputScrolls = await page.locator("#terminalOutput").evaluate((node) => {
    const style = window.getComputedStyle(node);
    const before = node.scrollTop;
    node.scrollTop = node.scrollHeight;
    return /auto|scroll/i.test(style.overflowY) && node.scrollTop >= before;
  });
  pushCheck(report, "terminal output container scrolls", outputScrolls, await readText(page, "#terminalOutput"));
  if (!outputScrolls) addLabHealth(report, { mobileFailures: ["terminal output did not scroll"] });
  expect(outputScrolls).toBeTruthy();

  const walkthrough = await runWalkthroughDemo(page, { resetBefore: true });
  pushCheck(report, "input usable after opening/closing walkthrough", walkthrough.inputEnabledAfterTry && await page.locator("#terminalInput").isVisible(), "terminal input usable");
  if (!walkthrough.inputEnabledAfterTry) addLabHealth(report, { mobileFailures: ["input unusable after walkthrough"] });
  expect(walkthrough.inputEnabledAfterTry).toBeTruthy();

  await attachSmokeData(testInfo, report);
  await context.close();
});
