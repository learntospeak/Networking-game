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

  await expect(page.locator("#watchWalkthroughBtn")).toBeVisible();
  const walkthroughResult = await runWalkthroughDemo(page, { resetBefore: true });
  pushCheck(report, "walkthrough button present", true, "#watchWalkthroughBtn visible");
  pushCheck(report, "walkthrough appends demo output", walkthroughResult.walkthroughVisible, walkthroughResult.delta.map((line) => line.text).slice(-8).join(" | "));
  pushCheck(report, "walkthrough does not advance step", !walkthroughResult.progressed, `${walkthroughResult.before.stepBadge} -> ${walkthroughResult.after.stepBadge}`);
  pushCheck(report, "walkthrough does not complete scenario", !walkthroughResult.completed, walkthroughResult.delta.map((line) => line.text).slice(-8).join(" | "));
  pushCheck(report, "terminal input remains enabled after walkthrough", await page.locator("#terminalInput").isEnabled(), "terminal input enabled");

  await runTerminalTrackTest(page, report, [
    "dir",
    "cd",
    "ipconfig",
    "ipconfig /all",
    "ping 192.168.1.1",
    "tracert 8.8.8.8",
    "netstat -an",
    "whoami",
    "hostname"
  ], { resetBefore: true });

  for (const command of ["IPCONFIG /ALL", "  ipconfig /all  ", "ipconfig   /all"]) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
  }

  for (const command of ["asdfgh", "ipconfig nonsense", "ping"]) {
    const result = await runTerminalCommand(page, command, { resetBefore: true });
    report.commandResults.push(result);
    recordInvalidCommandOutcome(report, "Windows", result);
  }

  const ipconfigVariants = report.commandResults.filter((item) => /ipconfig/i.test(item.command));
  if (ipconfigVariants.some((item) => item.command === "ipconfig /all" && item.accepted) && ipconfigVariants.some((item) => item.command !== "ipconfig /all" && !item.accepted)) {
    pushWarning(report, "Possible strict matching on Windows ipconfig variations.");
  }

  await finalizeTerminalReport(page, report, testInfo);
});

test("Terminal functional smoke: Cisco CLI track", async ({ page }, testInfo) => {
  const report = createSmokeReport("Cisco CLI Lab", "/cisco-cli-lab.html");
  observePage(page, report);
  await gotoAndStabilize(page, report.url);

  await assertVisible(page, "#terminalInput");
  await assertVisible(page, "#scenarioTitle");

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
    await page.locator("#resetScenarioBtn").click();
    await page.waitForTimeout(250);
    await runTerminalCommand(page, "enable");
    await runTerminalCommand(page, "configure terminal");
    const result = await runTerminalCommand(page, command);
    report.commandResults.push(result);
  }

  await page.locator("#resetScenarioBtn").click();
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
