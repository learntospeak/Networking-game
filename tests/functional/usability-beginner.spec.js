const { test, expect } = require("@playwright/test");
const {
  addLabHealth,
  attachSmokeData,
  checkNoHorizontalOverflow,
  createSmokeReport,
  dismissTaskCompleteIfPresent,
  dismissTicketBriefingIfPresent,
  getTerminalSnapshot,
  gotoAndStabilize,
  observePage,
  pushCheck,
  readText,
  resetTerminalScenario,
  runTerminalCommand,
  runWalkthroughDemo
} = require("./smoke-helpers");

async function openBeginnerLab(page, report) {
  observePage(page, report);
  await gotoAndStabilize(page, "/terminal-coach.html?track=windows&mode=beginner");
  await dismissTicketBriefingIfPresent(page);
}

async function visibleTextLength(page, selectors) {
  return page.evaluate((items) => items
    .map((selector) => {
      const node = document.querySelector(selector);
      if (!node || node.closest("[hidden]") || node.hidden) return "";
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return "";
      return node.textContent || "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .length, selectors);
}

async function repeatedHelperCounts(page) {
  return page.evaluate(() => {
    const isVisible = (node) => {
      if (!node || node.closest("[hidden]") || node.hidden) return false;
      let current = node;
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        const style = window.getComputedStyle(current);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
        current = current.parentElement;
      }
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };
    const selectors = [
      "#beginnerModeSummary",
      "#beginnerTaskHelpText",
      "#beginnerHelpStripText",
      "#coachSignal",
      "#mobileCoachSignal",
      "#terminalOutput .terminal-line.coach"
    ];
    const counts = {};
    document.querySelectorAll(selectors.join(",")).forEach((node) => {
      if (!isVisible(node)) return;
      const text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      counts[text] = (counts[text] || 0) + 1;
    });
    return counts;
  });
}

test("Beginner usability: Windows lab starts usable and not noisy", async ({ page }, testInfo) => {
  const report = createSmokeReport("Beginner Windows Usability", "/terminal-coach.html?track=windows&mode=beginner");
  addLabHealth(report, { pagesTested: ["windows beginner terminal"] });
  await openBeginnerLab(page, report);

  await expect(page.locator("#terminalInput")).toBeVisible();
  await expect(page.locator("#terminalInput")).toBeEnabled();
  await expect(page.locator("#runCommandBtn")).toBeVisible();
  await expect(page.locator("#commandSheetBtn")).toBeVisible();
  await expect(page.locator("#hintBtn")).toBeVisible();
  await expect(page.locator("#watchWalkthroughBtn")).toBeVisible();

  const taskText = `${await readText(page, "#beginnerCurrentTaskText")} ${await readText(page, "#stepObjective")}`.trim();
  pushCheck(report, "current problem/task visible", /list|use|run|move|display|review|confirm/i.test(taskText), taskText);
  expect(taskText.length).toBeGreaterThan(0);

  const blockingModalVisible = await page.locator("#ticketBriefingOverlay, #beginnerOnboardingOverlay, #walkthroughOverlay, #taskCompleteOverlay")
    .evaluateAll((nodes) => nodes.some((node) => !node.hidden && window.getComputedStyle(node).display !== "none"));
  pushCheck(report, "no blocking modal visible after start", !blockingModalVisible, String(blockingModalVisible));
  if (blockingModalVisible) addLabHealth(report, { modalBlockingFailures: ["beginner start has blocking modal"] });
  expect(blockingModalVisible).toBeFalsy();

  const helpTextLength = await visibleTextLength(page, [
    "#beginnerModeSummary",
    "#beginnerCurrentTaskText",
    "#beginnerTaskHelpText",
    "#beginnerLabCard",
    "#beginnerVisualGuideCard",
    "#coachSignal"
  ]);
  pushCheck(report, "visible beginner instruction text under 700 chars", helpTextLength < 700, String(helpTextLength));
  if (helpTextLength >= 700) addLabHealth(report, { textNoiseFailures: [`beginner visible help text ${helpTextLength} chars`] });
  expect(helpTextLength).toBeLessThan(700);

  const helperMessages = await page.locator("#terminalOutput .terminal-line.coach, #coachSignal, #beginnerTaskHelpText").evaluateAll((nodes) =>
    nodes.map((node) => (node.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean));
  const longMessages = helperMessages.filter((text) => text.length > 250);
  pushCheck(report, "single coach/helper messages under 250 chars", longMessages.length === 0, longMessages.join(" | "));
  if (longMessages.length) addLabHealth(report, { textNoiseFailures: longMessages.map((text) => `helper over 250 chars: ${text.slice(0, 60)}`) });
  expect(longMessages).toEqual([]);

  const repeats = await repeatedHelperCounts(page);
  const excessiveRepeats = Object.entries(repeats).filter(([, count]) => count > 2);
  pushCheck(report, "repeated helper text appears at most twice", excessiveRepeats.length === 0, JSON.stringify(excessiveRepeats));
  if (excessiveRepeats.length) addLabHealth(report, { textNoiseFailures: excessiveRepeats.map(([text]) => `repeated helper: ${text.slice(0, 60)}`) });
  expect(excessiveRepeats).toEqual([]);

  await attachSmokeData(testInfo, report);
});

test("Beginner usability: tiny wins keep the terminal flowing", async ({ page }, testInfo) => {
  const report = createSmokeReport("Beginner Tiny Wins", "/terminal-coach.html?track=windows&mode=beginner");
  addLabHealth(report, { pagesTested: ["incident folder triage"], commandsTested: ["dir"] });
  await openBeginnerLab(page, report);
  await resetTerminalScenario(page);

  const result = await runTerminalCommand(page, "dir");
  await page.waitForTimeout(150);
  report.commandResults.push(result);
  const currentTask = await readText(page, "#beginnerCurrentTaskText");
  const taskAdvanced = /Move into the Incidents folder/i.test(currentTask);
  pushCheck(report, "dir completes first beginner task", taskAdvanced && result.accepted, `${currentTask} | ${result.notes}`);
  pushCheck(report, "no large task complete modal appears", !(await page.locator("#taskCompleteCard").isVisible().catch(() => false)) && !(await page.locator("#taskCompleteOverlay").isVisible().catch(() => false)), result.notes);
  pushCheck(report, "tiny wins feedback updates", /Win: you found what is here/i.test(result.notes), result.notes);
  pushCheck(report, "input remains usable after tiny win", await page.locator("#terminalInput").isEnabled(), "terminal input enabled");
  pushCheck(report, "no continue click required", !(await page.getByRole("button", { name: /continue/i }).isVisible().catch(() => false)), "no continue button");
  pushCheck(report, "terminal feedback is short", result.notes.length < 250, result.notes);

  expect(taskAdvanced).toBeTruthy();
  expect(result.notes.length).toBeLessThan(250);
  await attachSmokeData(testInfo, report);
});

test("Beginner usability: walkthrough is stepwise and non-mutating", async ({ page }, testInfo) => {
  const report = createSmokeReport("Beginner Walkthrough Usability", "/terminal-coach.html?track=windows&mode=beginner");
  addLabHealth(report, { pagesTested: ["incident folder triage walkthrough"] });
  await openBeginnerLab(page, report);

  const result = await runWalkthroughDemo(page, { resetBefore: true });
  pushCheck(report, "only step 1 is shown first", result.firstStepVisible, `${result.firstCounter} ${result.firstTitle}`);
  pushCheck(report, "next shows step 2", result.secondStepVisible, `${result.secondCounter} ${result.secondTitle}`);
  pushCheck(report, "real task step does not advance", !result.progressed, `${result.before.stepBadge} -> ${result.after.stepBadge}`);
  pushCheck(report, "try it yourself closes walkthrough", result.walkthroughVisible && await page.locator("#walkthroughCard").isHidden(), "walkthrough hidden");
  pushCheck(report, "input usable after walkthrough", result.inputEnabledAfterTry, "terminal input enabled");

  expect(result.firstStepVisible).toBeTruthy();
  expect(result.secondStepVisible).toBeTruthy();
  expect(result.progressed).toBeFalsy();
  expect(result.inputEnabledAfterTry).toBeTruthy();
  await attachSmokeData(testInfo, report);
});

test("Beginner usability: folder visual guide follows Incident Folder Triage", async ({ page }, testInfo) => {
  const report = createSmokeReport("Beginner Visual Guide", "/terminal-coach.html?track=windows&mode=beginner");
  addLabHealth(report, { pagesTested: ["incident folder triage visual guide"], commandsTested: ["dir", "cd Incidents", "cd notes"] });
  await openBeginnerLab(page, report);
  await resetTerminalScenario(page);

  await expect(page.locator("#beginnerVisualGuideCard")).toBeVisible();
  pushCheck(report, "visual guide appears", true, await readText(page, "#beginnerVisualGuideCard"));
  pushCheck(report, "current path starts at C:\\Lab", /C:\\Lab/i.test(await readText(page, "#beginnerVisualCurrentPath")), await readText(page, "#beginnerVisualCurrentPath"));

  const dirRoot = await runTerminalCommand(page, "dir");
  report.commandResults.push(dirRoot);
  pushCheck(report, "Incidents appears after dir", /Incidents/i.test(await readText(page, "#beginnerFolderGuideMap")), await readText(page, "#beginnerFolderGuideMap"));

  const cdIncidents = await runTerminalCommand(page, "cd Incidents");
  report.commandResults.push(cdIncidents);
  pushCheck(report, "you are here moves into Incidents", /C:\\Lab\\Incidents/i.test(await readText(page, "#beginnerVisualCurrentPath")) && /you are here/i.test(await readText(page, "#beginnerFolderGuideMap")), await readText(page, "#beginnerVisualCurrentPath"));

  const dirIncidents = await runTerminalCommand(page, "dir");
  report.commandResults.push(dirIncidents);
  pushCheck(report, "notes appears after dir in Incidents", /notes/i.test(await readText(page, "#beginnerFolderGuideMap")), await readText(page, "#beginnerFolderGuideMap"));

  const cdNotes = await runTerminalCommand(page, "cd notes");
  report.commandResults.push(cdNotes);
  pushCheck(report, "current path updates into notes", /C:\\Lab\\Incidents\\notes/i.test(await readText(page, "#beginnerVisualCurrentPath")), await readText(page, "#beginnerVisualCurrentPath"));

  await attachSmokeData(testInfo, report);
});
