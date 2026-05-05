const { test, expect } = require("@playwright/test");
const {
  attachSmokeData,
  assertVisible,
  checkNoHorizontalOverflow,
  computeSubnetAnswer,
  createSmokeReport,
  gotoAndStabilize,
  getVisibleSubnetAnswers,
  observePage,
  pushCheck,
  pushWarning,
  readText,
  runTerminalCommand,
  runWalkthroughDemo,
  clickSubnetAnswer
} = require("./smoke-helpers");

async function finalizeTerminalReport(page, report, testInfo) {
  pushCheck(report, "terminal output present", await page.locator("#terminalOutput").isVisible(), "#terminalOutput visible");
  pushCheck(report, "terminal input present", await page.locator("#terminalInput").isVisible(), "#terminalInput visible");
  pushCheck(report, "scenario title present", Boolean((await readText(page, "#scenarioTitle")).trim()), await readText(page, "#scenarioTitle"));
  pushCheck(report, "scenario objective present", Boolean((await readText(page, "#scenarioObjective")).trim()), await readText(page, "#scenarioObjective"));
  pushCheck(report, "hint button present", await page.locator("#hintBtn").isVisible(), "#hintBtn visible");
  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));
  await attachSmokeData(testInfo, report);
}

function recordInvalidCommandOutcome(report, context, result) {
  const ok = !result.accepted && !result.progressed;
  pushCheck(report, `${context}: invalid command handled`, ok, `${result.command} -> ${result.notes}`);
  if (!ok) {
    pushWarning(report, `${context}: "${result.command}" was treated as valid or partially valid.`);
  }
}

async function runTerminalTrackTest(page, report, commands, options = {}) {
  await assertVisible(page, "#terminalOutput");
  await assertVisible(page, "#terminalInput");
  await assertVisible(page, "#scenarioTitle");
  await assertVisible(page, "#scenarioObjective");

  for (const command of commands) {
    const result = await runTerminalCommand(page, command, options);
    report.commandResults.push(result);
    expect.soft(result.delta.length > 0 || command.trim().toLowerCase() === "clear").toBeTruthy();
    expect.soft(await page.locator("#terminalInput").isVisible()).toBeTruthy();
  }
}

test("Terminal functional smoke: Linux track", async ({ page }, testInfo) => {
  const report = createSmokeReport("Linux Terminal Lab", "/terminal-coach.html?track=linux");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  pushCheck(report, "first Linux visual guide appears", await page.locator("#beginnerVisualGuideCard").isVisible().catch(() => false), "#beginnerVisualGuideCard visible");

  await runTerminalTrackTest(page, report, [
    "pwd",
    "ls",
    "ls -la",
    "cd /home",
    "clear",
    "whoami",
    "ip addr",
    "ping 192.168.1.1"
  ], { resetBefore: true });

  const variationCases = [
    "PWD",
    "  pwd  ",
    "ls   -la",
    "IP ADDR"
  ];
  for (const command of variationCases) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
  }

  const invalidCases = [
    "asdfgh",
    "ping",
    "cd fakefolder"
  ];
  for (const command of invalidCases) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
    recordInvalidCommandOutcome(report, "Linux", result);
  }

  for (const baseline of ["pwd", "ls -la", "ip addr"]) {
    const accepted = report.commandResults.filter((item) => item.command === baseline).some((item) => item.accepted);
    const variations = report.commandResults.filter((item) => item.command !== baseline && item.command.trim().toLowerCase().replace(/\s+/g, " ") === baseline.toLowerCase());
    if (accepted && variations.some((item) => !item.accepted)) {
      pushWarning(report, `Possible strict matching on Linux command variants for "${baseline}".`);
    }
  }

  await finalizeTerminalReport(page, report, testInfo);
});

test("Terminal functional smoke: Windows CMD track", async ({ page }, testInfo) => {
  const report = createSmokeReport("Windows CMD Lab", "/terminal-coach.html?track=windows");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  pushCheck(report, "terminal page does not embed full roadmap", await page.locator("#beginnerRoadmapPanel").count() === 0, "#beginnerRoadmapPanel absent");
  pushCheck(report, "roadmap link exists", await page.locator('a[href*="beginner-roadmap.html"]').first().isVisible().catch(() => false), "View Roadmap link visible");
  pushCheck(report, "current beginner lab card exists", await page.locator("#beginnerLabCard").isVisible(), "#beginnerLabCard visible");
  pushCheck(report, "current lab level text visible", /Level/i.test((await readText(page, "#beginnerLabCurrentLevel")).trim()), await readText(page, "#beginnerLabCurrentLevel"));

  if (await page.locator("#beginnerOnboardingStartBtn").isVisible().catch(() => false)) {
    await page.locator("#beginnerOnboardingStartBtn").click();
    await page.waitForTimeout(150);
  }

  pushCheck(report, "beginner ticket simplified", await page.locator("#ticketBriefingBeginnerBlock").isVisible().catch(() => false), "#ticketBriefingBeginnerBlock visible");
  pushCheck(report, "advanced beginner ticket fields hidden by default", !(await page.locator("#ticketBriefingKnownFactsBlock").isVisible().catch(() => false)), "#ticketBriefingKnownFactsBlock hidden");
  pushCheck(report, "beginner ticket visual guide visible", await page.locator("#ticketBriefingVisualBlock").isVisible().catch(() => false), "#ticketBriefingVisualBlock visible");

  if (await page.locator("#ticketBriefingStartBtn").isVisible().catch(() => false)) {
    await page.locator("#ticketBriefingStartBtn").click();
    await page.waitForTimeout(150);
  }

  pushCheck(report, "ask coach button appears", await page.locator("#needHelpBtn").isVisible().catch(() => false) && /Ask Coach/i.test(await page.locator("#needHelpBtn").innerText()), "#needHelpBtn visible");
  const helpCommand = await runTerminalCommand(page, "cd notes");
  report.commandResults.push(helpCommand);
  await page.evaluate(() => {
    Object.keys(window.localStorage || {})
      .filter((key) => key.startsWith("netlab:ai-coach-usage") || key === "netlab:ai-coach-local-faults")
      .forEach((key) => window.localStorage.removeItem(key));
  });
  const aiExplain = await runTerminalCommand(page, "ask explain this like I'm 8");
  report.commandResults.push(aiExplain);
  pushCheck(report, "terminal-native ai coach answers inline", /\[AI Coach\]/i.test(aiExplain.notes) && /computer detective|clues/i.test(aiExplain.notes), aiExplain.notes);
  const aiOutput = await runTerminalCommand(page, "ask explain the output");
  report.commandResults.push(aiOutput);
  pushCheck(report, "terminal-native ai coach uses last output", /cd notes/i.test(aiOutput.notes) && /output/i.test(aiOutput.notes), aiOutput.notes);
  const aiNext = await runTerminalCommand(page, "ask what should I try next");
  report.commandResults.push(aiNext);
  pushCheck(report, "terminal-native ai coach tracks free usage", /current task|next/i.test(aiNext.notes), aiNext.notes);
  const aiLimit = await runTerminalCommand(page, "ask give me a hint without the answer");
  report.commandResults.push(aiLimit);
  pushCheck(report, "free user gets 3 ai uses per day", /3 free AI helps today|Upgrade/i.test(aiLimit.notes), aiLimit.notes);
  const usageSnapshot = await page.evaluate(() => {
    const key = Object.keys(window.localStorage || {}).find((item) => item.startsWith("netlab:ai-coach-usage"));
    return key ? JSON.parse(window.localStorage.getItem(key)) : null;
  });
  pushCheck(report, "ai usage record stores user date count plan", usageSnapshot?.count === 3 && usageSnapshot?.plan === "free" && Boolean(usageSnapshot?.userId) && Boolean(usageSnapshot?.date), JSON.stringify(usageSnapshot));
  await page.evaluate(() => {
    window.__smokeOriginalGetActiveProfile = window.NetlabApp.getActiveProfile;
    window.NetlabApp.getActiveProfile = () => ({ id: "paid-smoke", label: "Paid Smoke", isGuest: false, plan: "paid", isPaid: true, isAdmin: false });
  });
  const paidAsk = await runTerminalCommand(page, "ask what should I try next");
  report.commandResults.push(paidAsk);
  pushCheck(report, "paid user gets unlimited ai uses", !/3 free AI helps today/i.test(paidAsk.notes) && /\[AI Coach\]/i.test(paidAsk.notes), paidAsk.notes);
  await page.evaluate(() => {
    window.NetlabApp.getActiveProfile = () => ({ id: "admin-smoke", label: "Admin Smoke", isGuest: false, plan: "admin", isPaid: true, isAdmin: true });
    window.__smokeOriginalSupabaseClient = window.NetlabSupabase?.client || null;
    if (window.NetlabSupabase) {
      window.NetlabSupabase.client = null;
    }
  });
  const adminLog = await runTerminalCommand(page, "ask admin log fault smoke test fault");
  report.commandResults.push(adminLog);
  pushCheck(report, "admin user can log a fault", /Logged locally|saved to Supabase/i.test(adminLog.notes), adminLog.notes);
  const localFaultCount = await page.evaluate(() => JSON.parse(window.localStorage.getItem("netlab:ai-coach-local-faults") || "[]").length);
  pushCheck(report, "admin fault stored locally when backend unavailable", localFaultCount > 0, String(localFaultCount));
  await page.evaluate(() => {
    if (window.__smokeOriginalGetActiveProfile) {
      window.NetlabApp.getActiveProfile = window.__smokeOriginalGetActiveProfile;
    }
    if (window.NetlabSupabase) {
      window.NetlabSupabase.client = window.__smokeOriginalSupabaseClient;
    }
  });
  const nonAdmin = await runTerminalCommand(page, "ask admin log bug should not work");
  report.commandResults.push(nonAdmin);
  pushCheck(report, "non-admin cannot use admin commands", /not available/i.test(nonAdmin.notes), nonAdmin.notes);
  await page.locator("#needHelpBtn").click();
  await expect(page.locator("#helpAssistantCard")).toBeVisible();
  pushCheck(report, "ask coach panel opens", await page.locator("#helpAssistantCard").isVisible().catch(() => false), "#helpAssistantCard visible");
  pushCheck(report, "report problem is secondary", await page.locator("#reportProblemBtn").isVisible().catch(() => false) && !(await page.locator("#helpReportOutput").isVisible().catch(() => false)), "Report button visible, report output hidden");
  await page.locator("#helpUserNote").fill("I typed cd notes and it failed.");
  await page.locator("#generateHelpReportBtn").click();
  const coachText = await readText(page, "#coachMessages");
  pushCheck(report, "ask coach produces fallback response", /checking what folders exist|current folder|Command Help/i.test(coachText), coachText);
  await page.locator("#reportProblemBtn").click();
  await expect(page.locator("#helpReportOutput")).toBeVisible();
  const helpReport = await page.locator("#helpReportOutput").inputValue();
  pushCheck(report, "copy report button exists", await page.locator("#copyHelpReportBtn").isVisible().catch(() => false), "#copyHelpReportBtn visible");
  pushCheck(report, "report includes current scenario/task/last command", /Incident Folder Triage/i.test(helpReport) && /List the current folder contents/i.test(helpReport) && /cd notes/i.test(helpReport), helpReport);
  await page.locator("#helpAssistantCloseBtn").click();
  await expect(page.locator("#helpAssistantCard")).toBeHidden();

  pushCheck(report, "side visual guide visible", await page.locator("#beginnerVisualGuideCard").isVisible().catch(() => false), "#beginnerVisualGuideCard visible");

  await expect(page.locator("#watchWalkthroughBtn")).toBeVisible();
  const walkthroughResult = await runWalkthroughDemo(page, { resetBefore: true });
  pushCheck(report, "walkthrough button present", true, "#watchWalkthroughBtn visible");
  pushCheck(report, "walkthrough opens", walkthroughResult.walkthroughVisible, `${walkthroughResult.firstCounter} | ${walkthroughResult.firstTitle}`);
  pushCheck(report, "walkthrough shows only step 1 first", walkthroughResult.firstStepVisible, `${walkthroughResult.firstCounter} | ${walkthroughResult.firstTitle} | ${walkthroughResult.firstGoal}`);
  pushCheck(report, "walkthrough next shows step 2", walkthroughResult.secondStepVisible, `${walkthroughResult.secondCounter} | ${walkthroughResult.secondTitle} | ${walkthroughResult.secondGoal}`);
  pushCheck(report, "walkthrough visual guide visible", walkthroughResult.walkthroughVisualVisible && /Incidents/i.test(walkthroughResult.walkthroughVisualText), walkthroughResult.walkthroughVisualText);
  pushCheck(report, "walkthrough does not advance step", !walkthroughResult.progressed, `${walkthroughResult.before.stepBadge} -> ${walkthroughResult.after.stepBadge}`);
  pushCheck(report, "walkthrough does not complete scenario", !walkthroughResult.completed, walkthroughResult.delta.map((line) => line.text).slice(-8).join(" | "));
  pushCheck(report, "terminal input remains enabled after walkthrough", walkthroughResult.inputEnabledAfterTry, "terminal input enabled");

  const dirRoot = await runTerminalCommand(page, "dir", { resetBefore: true });
  report.commandResults.push(dirRoot);
  pushCheck(report, "no big task complete popup for beginner task", !(await page.locator("#taskCompleteCard").isVisible().catch(() => false)) && !(await page.locator("#taskCompleteOverlay").isVisible().catch(() => false)), `card=${await page.locator("#taskCompleteCard").isVisible().catch(() => false)} overlay=${await page.locator("#taskCompleteOverlay").isVisible().catch(() => false)}`);
  pushCheck(report, "single relevant reward appears in terminal output", /Win: you found what is here/i.test(dirRoot.notes), dirRoot.notes);
  pushCheck(report, "terminal input stays enabled after task completion", await page.locator("#terminalInput").isEnabled(), "terminal input enabled");
  pushCheck(report, "folder map reveals Incidents after dir", /Incidents/i.test((await readText(page, "#beginnerFolderGuideMap")).trim()), await readText(page, "#beginnerFolderGuideMap"));
  pushCheck(report, "dir updates folder visual guide", /Incidents/i.test((await readText(page, "#beginnerFolderGuideMap")).trim()), await readText(page, "#beginnerFolderGuideMap"));

  const directJump = await runTerminalCommand(page, "cd Incidents\\notes");
  report.commandResults.push(directJump);
  pushCheck(report, "direct jump into notes advances beginner task", /List the notes folder contents/i.test((await readText(page, "#beginnerCurrentTaskText")).trim()) || /List the notes folder contents/i.test((await readText(page, "#stepObjective")).trim()), `${await readText(page, "#beginnerCurrentTaskText")} | ${await readText(page, "#stepObjective")}`);
  pushCheck(report, "direct jump into notes updates current path", /C:\\Lab\\Incidents\\notes/i.test((await readText(page, "#beginnerVisualCurrentPath")).trim()), await readText(page, "#beginnerVisualCurrentPath"));

  const dirRootAgain = await runTerminalCommand(page, "dir", { resetBefore: true });
  report.commandResults.push(dirRootAgain);
  const cdIncidents = await runTerminalCommand(page, "cd Incidents");
  report.commandResults.push(cdIncidents);
  pushCheck(report, "folder map current path updates after cd Incidents", /C:\\Lab\\Incidents/i.test((await readText(page, "#beginnerVisualCurrentPath")).trim()), await readText(page, "#beginnerVisualCurrentPath"));
  pushCheck(report, "cd updates current location", /C:\\Lab\\Incidents/i.test((await readText(page, "#beginnerVisualCurrentPath")).trim()), await readText(page, "#beginnerVisualCurrentPath"));
  pushCheck(report, "single reward matches completed move", /Win: moved into Incidents/i.test(cdIncidents.notes), cdIncidents.notes);

  const dirIncidents = await runTerminalCommand(page, "dir");
  report.commandResults.push(dirIncidents);
  pushCheck(report, "folder map reveals notes after dir in Incidents", /notes/i.test((await readText(page, "#beginnerFolderGuideMap")).trim()), await readText(page, "#beginnerFolderGuideMap"));

  const cdNotes = await runTerminalCommand(page, "cd notes");
  report.commandResults.push(cdNotes);
  pushCheck(report, "folder map current path updates after cd notes", /C:\\Lab\\Incidents\\notes/i.test((await readText(page, "#beginnerVisualCurrentPath")).trim()), await readText(page, "#beginnerVisualCurrentPath"));
  pushCheck(report, "single reward matches opened notes", /Win: opened notes/i.test(cdNotes.notes), cdNotes.notes);

  const dirNotes = await runTerminalCommand(page, "dir");
  report.commandResults.push(dirNotes);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
  pushCheck(report, "terminal progress shell is removed after reload", await page.locator("#appSectionShell").count() === 0 && await page.locator("#beginnerRoadmapPanel").count() === 0, "progress shell absent");
  if (await page.locator("#resumeSectionBtn").isVisible().catch(() => false)) {
    await page.locator("#resumeSectionBtn").click();
    await page.waitForTimeout(200);
    pushCheck(report, "resume restores current task context", /Level/i.test((await readText(page, "#beginnerLabCurrentLevel")).trim()), `${await readText(page, "#beginnerLabCurrentLevel")} | ${await readText(page, "#beginnerLabCurrentTask")}`);
  }

  for (const command of ["DIR", "  dir  ", "cd   Incidents"]) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
  }

  for (const command of ["asdfgh", "cd nowhere", "type mystery.txt"]) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
    recordInvalidCommandOutcome(report, "Windows", result);
  }

  await finalizeTerminalReport(page, report, testInfo);
});

test("Beginner roadmap page smoke", async ({ page }, testInfo) => {
  const report = createSmokeReport("Beginner Roadmap", "/beginner-roadmap.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  pushCheck(report, "beginner-roadmap page exists", await page.locator("#roadmapLevels").isVisible().catch(() => false), "#roadmapLevels visible");
  const roadmapText = await readText(page, "#roadmapLevels");
  pushCheck(report, "roadmap page shows levels", /Level 1/i.test(roadmapText) && /Level 10/i.test(roadmapText), roadmapText.slice(0, 500));
  pushCheck(report, "roadmap links back to terminal lab", await page.locator('a[href*="terminal-coach.html?track=windows"]').first().isVisible().catch(() => false), "terminal lab link visible");
  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));
  await attachSmokeData(testInfo, report);
});

test("Terminal functional smoke: Cisco CLI track", async ({ page }, testInfo) => {
  const report = createSmokeReport("Cisco CLI Lab", "/cisco-cli-lab.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  await assertVisible(page, "#terminalInput");
  await assertVisible(page, "#scenarioTitle");
  pushCheck(report, "unsupported Cisco visual guide hidden", !(await page.locator("#beginnerVisualGuideCard").isVisible().catch(() => false)), "#beginnerVisualGuideCard hidden or absent");

  const sequence = [
    "enable",
    "show ip interface brief",
    "configure terminal",
    "interface fa0/0",
    "no shutdown",
    "exit",
    "show running-config"
  ];

  for (const command of sequence) {
    const result = await runTerminalCommand(page, command, { resetBefore: command === "enable" });
    report.commandResults.push(result);
    expect.soft(result.delta.length > 0).toBeTruthy();
  }

  for (const command of ["interface   fa0/0", "INTERFACE FA0/0", "interface fastethernet0/0"]) {
    await page.evaluate(() => document.getElementById("resetScenarioBtn")?.click());
    await page.waitForTimeout(250);
    await runTerminalCommand(page, "enable");
    await runTerminalCommand(page, "configure terminal");
    const result = await runTerminalCommand(page, command);
    report.commandResults.push(result);
  }

  await page.evaluate(() => document.getElementById("resetScenarioBtn")?.click());
  await page.waitForTimeout(250);
  for (const command of ["show fake command", "asdfgh"]) {
    const result = await runTerminalCommand(page, command);
    report.commandResults.push(result);
    recordInvalidCommandOutcome(report, "Cisco", result);
  }

  const shortForm = report.commandResults.find((item) => item.command === "interface fa0/0");
  const longForm = report.commandResults.find((item) => item.command === "interface fastethernet0/0");
  if (shortForm?.accepted && longForm && !longForm.accepted) {
    pushWarning(report, "Cisco interface matching may be too strict: short form accepted while long form was rejected.");
  }

  await finalizeTerminalReport(page, report, testInfo);
});

test("Terminal functional smoke: Challenge Mode", async ({ page }, testInfo) => {
  const report = createSmokeReport("Challenge Mode", "/challenge-mode.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  await assertVisible(page, "#challengeCardGrid");
  await assertVisible(page, "#startChallengeBtn");
  await page.locator("#startChallengeBtn").click();
  await page.waitForTimeout(300);

  await runTerminalTrackTest(page, report, [
    "pwd",
    "ls",
    "ip addr",
    "ping 192.168.1.1"
  ], { ensureChallengeStarted: true, resetBefore: true });

  for (const command of ["asdfgh", "ping"]) {
    const result = await runTerminalCommand(page, command, { ensureChallengeStarted: true, resetBefore: true });
    report.commandResults.push(result);
    recordInvalidCommandOutcome(report, "Challenge", result);
  }

  await finalizeTerminalReport(page, report, testInfo);
});

test("Functional smoke: Subnetting practice, reference, and exam", async ({ page }, testInfo) => {
  const report = createSmokeReport("Subnetting Lab", "/subnetting-lab.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  await assertVisible(page, '[data-mode="cidrToMask"]');
  await assertVisible(page, "#referencePanelDisclosure summary");
  await assertVisible(page, "#examModeBtn");

  pushCheck(report, "practice mode controls present", await page.locator('[data-mode="cidrToMask"]').isVisible(), "Practice mode button visible");
  pushCheck(report, "reference mode controls present", await page.locator("#referencePanelDisclosure summary").isVisible(), "Reference disclosure visible");
  pushCheck(report, "exam button present", await page.locator("#examModeBtn").isVisible(), "Exam button visible");

  const modeCases = [
    { button: '[data-mode="cidrToMask"]', label: "Subnet Mask" },
    { button: '[data-mode="cidrToHosts"]', label: "Hosts" },
    { button: '[data-mode="networkAddress"]', label: "Network Address" }
  ];

  for (const modeCase of modeCases) {
    await page.locator(modeCase.button).click();
    const question = (await readText(page, "#question")).trim();
    const answers = await getVisibleSubnetAnswers(page);
    const computedAnswer = computeSubnetAnswer(question);
    pushCheck(report, `${modeCase.label} generated question`, Boolean(question) && !/Select a mode/i.test(question), question);
    pushCheck(report, `${modeCase.label} generated answers`, answers.length > 0, answers.join(" | "));

    if (computedAnswer) {
      const clicked = await clickSubnetAnswer(page, computedAnswer);
      pushCheck(report, `${modeCase.label} deterministic answer available`, clicked, computedAnswer);
      expect.soft(clicked).toBeTruthy();
      await expect.soft(page.locator("#feedback")).toHaveText(/Correct|Wrong/);
      await expect.soft(page.locator("#nextBtn")).toBeVisible();
    } else {
      pushWarning(report, `No deterministic solver implemented for question: ${question}`);
      await page.locator("#answers button").first().click();
      await expect.soft(page.locator("#feedback")).toHaveText(/Correct|Wrong/);
    }
  }

  await page.locator('[data-mode="cidrToMask"]').click();
  const wrongChoice = page.locator("#answers button").last();
  await wrongChoice.click();
  await expect.soft(page.locator("#feedback")).toHaveText(/Correct|Wrong/);
  pushCheck(report, "wrong subnet answer feedback appears", /Correct|Wrong/.test((await readText(page, "#feedback")).trim()), await readText(page, "#feedback"));

  await page.locator("#referencePanelDisclosure summary").click();
  await expect.soft(page.locator('[data-reference-card="cidrMasks"]')).toBeVisible();
  await page.locator('[data-reference-card="cidrMasks"]').click();
  await expect.soft(page.locator("#referenceModal")).toBeVisible();
  pushCheck(report, "reference modal opens", await page.locator("#referenceModal").isVisible(), "CIDR reference modal visible");
  await page.locator("#referenceModalCloseBtn").click();

  await page.locator("#examModeBtn").click();
  await expect.soft(page.locator("#examStatus")).toContainText(/Question 1 of/i);
  pushCheck(report, "exam mode starts", /Question 1 of/i.test((await readText(page, "#examStatus")).trim()), await readText(page, "#examStatus"));
  await page.locator("#answers button").first().click();
  await expect.soft(page.locator("#feedback")).toHaveText(/Correct|Wrong/);
  await page.locator("#nextBtn").click();
  pushCheck(report, "exam advances after answer", /Question 2 of/i.test((await readText(page, "#examStatus")).trim()), await readText(page, "#examStatus"));

  pushWarning(report, "Blank, letters, and malformed subnet entry are not directly testable in the current subnetting UI because answers are button-based, not free-text.");
  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));
  await attachSmokeData(testInfo, report);
});

test("Functional smoke: HTTP step flow and quick checks", async ({ page }, testInfo) => {
  const report = createSmokeReport("Web & HTTP Lab", "/web-http-lab.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  await assertVisible(page, "#httpScreenTitle");
  await assertVisible(page, "#httpNextBtn");

  const title1 = (await readText(page, "#httpScreenTitle")).trim();
  await page.locator("#httpNextBtn").click();
  const title2 = (await readText(page, "#httpScreenTitle")).trim();
  pushCheck(report, "next changes screen content", title1 !== title2, `${title1} -> ${title2}`);

  await page.locator("#httpBackBtn").click();
  const title3 = (await readText(page, "#httpScreenTitle")).trim();
  pushCheck(report, "back returns to previous content", title3 === title1, `${title3}`);

  let quickCheckReached = false;
  for (let index = 0; index < 12; index += 1) {
    if (await page.locator("#httpAnswerGrid").isVisible()) {
      quickCheckReached = true;
      break;
    }

    await page.locator("#httpNextBtn").click();
    await page.waitForTimeout(100);
  }

  await expect.soft(page.locator("#httpAnswerGrid")).toBeVisible();
  pushCheck(report, "quick check answer grid appears", quickCheckReached || await page.locator("#httpAnswerGrid").isVisible(), `Reached quiz at ${(await readText(page, "#httpScreenMeta")).trim()}`);

  if (await page.locator("#httpAnswerGrid").isVisible()) {
    await page.getByRole("button", { name: "GET /profile" }).click();
    await expect.soft(page.locator("#httpActionFeedback")).toContainText(/Not quite|Correct/);
    pushCheck(report, "wrong quick check answer gives feedback", /Not quite|Correct/.test((await readText(page, "#httpActionFeedback")).trim()), await readText(page, "#httpActionFeedback"));

    await page.getByRole("button", { name: "Host: learn.lab" }).click();
    await expect.soft(page.locator("#httpActionFeedback")).toContainText(/Correct/);
    await expect.soft(page.locator("#httpNextBtn")).toBeEnabled();
    pushCheck(report, "correct quick check answer unlocks next", /Correct/.test((await readText(page, "#httpActionFeedback")).trim()), await readText(page, "#httpActionFeedback"));

    await page.locator("#httpNextBtn").click();
    await expect.soft(page.locator("#httpAnswerGrid")).toBeVisible();
    await page.getByRole("button", { name: "It is encrypted in transit" }).click();
    await expect.soft(page.locator("#httpActionFeedback")).toContainText(/Not quite/);
    await page.getByRole("button", { name: "It is visible in transit" }).click();
    await expect.soft(page.locator("#httpActionFeedback")).toContainText(/Correct/);
    pushCheck(report, "second quick check can be answered", /Correct/.test((await readText(page, "#httpActionFeedback")).trim()), await readText(page, "#httpActionFeedback"));
  }

  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));
  await attachSmokeData(testInfo, report);
});

test("Mobile smoke: terminal, subnetting, and HTTP controls remain usable", async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();
  const report = createSmokeReport("Mobile Functional Pass", "multi-page");
  observePage(page, report);

  await gotoAndStabilize(page, "/terminal-coach.html?track=linux");
  await assertVisible(page, "#terminalInput");
  let overflow = await checkNoHorizontalOverflow(page);
  pushCheck(report, "linux mobile no horizontal overflow", !overflow.hasOverflow, JSON.stringify(overflow));
  let terminalResult = await runTerminalCommand(page, "pwd", { resetBefore: true });
  report.commandResults.push(terminalResult);
  pushCheck(report, "linux mobile terminal command works", terminalResult.delta.length > 0, terminalResult.notes);
  pushCheck(report, "linux mobile terminal input visible", await page.locator("#terminalInput").isVisible(), "#terminalInput visible");
  pushCheck(report, "mobile ask coach control present", await page.locator("#needHelpBtn").count() === 1, "#needHelpBtn present");
  if (await page.locator("#needHelpBtn").isVisible().catch(() => false)) {
    await page.locator("#needHelpBtn").click();
    pushCheck(report, "mobile ask coach panel opens", await page.locator("#helpAssistantCard").isVisible().catch(() => false), "#helpAssistantCard visible");
    await page.locator("#helpAssistantCloseBtn").click();
  }
  const jumpTopVisible = await page.locator("#terminalJumpTopBtn").isVisible();
  const jumpLatestVisible = await page.locator("#terminalJumpLatestBtn").isVisible();
  pushCheck(report, "mobile terminal history controls render predictably", jumpTopVisible === jumpLatestVisible, `top=${jumpTopVisible} latest=${jumpLatestVisible}`);
  if (jumpTopVisible && jumpLatestVisible) {
    await page.locator("#terminalJumpTopBtn").click();
    await page.locator("#terminalJumpLatestBtn").click();
    pushCheck(report, "mobile terminal history controls tappable", true, "Top and Latest clicked");
  } else {
    pushWarning(report, "Mobile terminal history controls were present in the DOM but not visible during the smoke pass.");
  }

  await gotoAndStabilize(page, "/subnetting-lab.html");
  overflow = await checkNoHorizontalOverflow(page);
  pushCheck(report, "subnetting mobile no horizontal overflow", !overflow.hasOverflow, JSON.stringify(overflow));
  await page.locator('[data-mode="cidrToMask"]').click();
  await expect.soft(page.locator("#answers button").first()).toBeVisible();
  await page.locator("#answers button").first().click();
  pushCheck(report, "subnetting mobile controls usable", /Correct|Wrong/.test((await readText(page, "#feedback")).trim()), await readText(page, "#feedback"));

  await gotoAndStabilize(page, "/web-http-lab.html");
  overflow = await checkNoHorizontalOverflow(page);
  pushCheck(report, "http mobile no horizontal overflow", !overflow.hasOverflow, JSON.stringify(overflow));
  const mobileTitle1 = (await readText(page, "#httpScreenTitle")).trim();
  await page.locator("#httpNextBtn").click();
  const mobileTitle2 = (await readText(page, "#httpScreenTitle")).trim();
  pushCheck(report, "http mobile next button usable", mobileTitle1 !== mobileTitle2, `${mobileTitle1} -> ${mobileTitle2}`);
  pushCheck(report, "http mobile back button usable", await page.locator("#httpBackBtn").isVisible(), "#httpBackBtn visible");

  pushCheck(report, "request failures absent", report.requestFailures.length === 0, report.requestFailures.join(" | "));
  pushCheck(report, "console errors absent", report.consoleErrors.length === 0, report.consoleErrors.join(" | "));
  pushCheck(report, "page errors absent", report.pageErrors.length === 0, report.pageErrors.join(" | "));
  await attachSmokeData(testInfo, report);
  await context.close();
});
