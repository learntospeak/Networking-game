const { expect } = require("@playwright/test");

const INVALID_OUTPUT_PATTERNS = [
  /command not found/i,
  /not recognized/i,
  /not available in this training shell/i,
  /syntax of the command is incorrect/i,
  /missing destination/i,
  /missing operand/i,
  /insufficient parameters/i,
  /invalid number of parameters/i,
  /no such directory/i,
  /unsupported .*command/i,
  /unable to resolve/i,
  /interface not found/i,
  /^% /i
];

function createSmokeReport(pageName, url) {
  return {
    page: pageName,
    url,
    checks: [],
    warnings: [],
    commandResults: [],
    consoleErrors: [],
    pageErrors: [],
    requestFailures: []
  };
}

function pushCheck(report, name, ok, details = "") {
  report.checks.push({ name, ok: Boolean(ok), details: details || "" });
}

function pushWarning(report, message) {
  report.warnings.push(String(message));
}

async function attachSmokeData(testInfo, report) {
  await testInfo.attach("smoke-report-data", {
    body: Buffer.from(JSON.stringify(report, null, 2), "utf8"),
    contentType: "application/json"
  });
}

function observePage(page, report) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      report.consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    report.pageErrors.push(error.message || String(error));
  });

  page.on("response", (response) => {
    const status = response.status();
    const url = response.url();
    if (status >= 400 && !/favicon\.ico$/i.test(url)) {
      report.requestFailures.push(`${status} ${url}`);
    }
  });
}

async function gotoAndStabilize(page, path) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});
}

async function dismissTicketBriefingIfPresent(page) {
  const beginnerStartButton = page.locator("#beginnerOnboardingStartBtn");
  if (await beginnerStartButton.isVisible().catch(() => false)) {
    await beginnerStartButton.click();
    await page.waitForTimeout(150);
  }

  const startButton = page.locator("#ticketBriefingStartBtn");
  if (await startButton.isVisible().catch(() => false)) {
    await startButton.click();
    await page.waitForTimeout(150);
  }
}

async function dismissTaskCompleteIfPresent(page) {
  const continueButton = page.locator("#taskCompleteCloseBtn");
  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click();
    await page.waitForTimeout(150);
  }
}

async function checkNoHorizontalOverflow(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    return {
      scrollWidth: root.scrollWidth,
      innerWidth: window.innerWidth,
      hasOverflow: root.scrollWidth > window.innerWidth + 2
    };
  });
}

async function readText(page, selector) {
  return (await page.locator(selector).textContent()) || "";
}

async function getTerminalSnapshot(page) {
  return page.evaluate(() => {
    const lines = Array.from(document.querySelectorAll("#terminalOutput .terminal-line")).map((node) => ({
      text: node.textContent || "",
      type: node.className || ""
    }));

    return {
      lineCount: lines.length,
      lines,
      scenarioTitle: document.querySelector("#scenarioTitle")?.textContent || "",
      stepBadge: document.querySelector("#stepCountBadge")?.textContent || "",
      prompt: document.querySelector("#terminalPrompt")?.textContent || ""
    };
  });
}

function classifyTerminalAcceptance(command, lines) {
  const textLines = lines.map((line) => String(line.text || "").trim()).filter(Boolean);
  const hasTypedErrorLine = lines.some((line) => /error/i.test(String(line.type || "")));
  const hasPatternError = textLines.some((text) => INVALID_OUTPUT_PATTERNS.some((pattern) => pattern.test(text)));

  return !(hasTypedErrorLine || hasPatternError);
}

async function waitForTerminalMutation(page, previousCount, command) {
  const trimmed = String(command).trim().toLowerCase();

  if (trimmed === "clear") {
    await page.waitForTimeout(200);
    return;
  }

  await page.waitForFunction(
    ({ count }) => {
      return document.querySelectorAll("#terminalOutput .terminal-line").length > count;
    },
    { count: previousCount },
    { timeout: 8_000 }
  );
}

async function resetTerminalScenario(page) {
  const reset = page.locator("#resetScenarioBtn");
  if (await reset.count()) {
    await dismissTicketBriefingIfPresent(page);
    await dismissTaskCompleteIfPresent(page);
    if (await reset.isVisible()) {
      await reset.click();
    } else {
      await page.evaluate(() => document.getElementById("resetScenarioBtn")?.click());
    }
    await page.waitForTimeout(250);
    await dismissTicketBriefingIfPresent(page);
    await dismissTaskCompleteIfPresent(page);
  }
}

async function startChallengeIfNeeded(page) {
  const startButton = page.locator("#startChallengeBtn");
  if (await startButton.isVisible()) {
    await dismissTaskCompleteIfPresent(page);
    await startButton.click();
    await page.waitForTimeout(250);
    await dismissTicketBriefingIfPresent(page);
    await dismissTaskCompleteIfPresent(page);
  }
}

async function runTerminalCommand(page, command, options = {}) {
  if (options.resetBefore) {
    await resetTerminalScenario(page);
  }

  if (options.ensureChallengeStarted) {
    await startChallengeIfNeeded(page);
  }

  await dismissTicketBriefingIfPresent(page);
  await dismissTaskCompleteIfPresent(page);

  const before = await getTerminalSnapshot(page);
  const input = page.locator("#terminalInput");
  await input.click();
  await input.fill(command);
  await input.press("Enter");
  await waitForTerminalMutation(page, before.lineCount, command);
  const after = await getTerminalSnapshot(page);
  const delta = after.lines.slice(before.lineCount);
  const accepted = classifyTerminalAcceptance(command, delta);
  const progressed = after.stepBadge !== before.stepBadge || after.scenarioTitle !== before.scenarioTitle || delta.some((line) => /scenario complete/i.test(line.text));

  return {
    command,
    accepted,
    progressed,
    before,
    after,
    delta,
    notes: delta.map((line) => line.text).slice(-4).join(" | ")
  };
}

async function runWalkthroughDemo(page, options = {}) {
  if (options.resetBefore) {
    await resetTerminalScenario(page);
  }

  if (options.ensureChallengeStarted) {
    await startChallengeIfNeeded(page);
  }

  await dismissTicketBriefingIfPresent(page);
  await dismissTaskCompleteIfPresent(page);

  const before = await getTerminalSnapshot(page);
  const walkthroughButton = page.locator("#watchWalkthroughBtn");
  await expect(walkthroughButton).toBeVisible();
  await expect(walkthroughButton).toBeEnabled();
  await walkthroughButton.click();
  await expect(page.locator("#walkthroughCard")).toBeVisible();
  await page.waitForTimeout(150);
  const firstCounter = ((await page.locator("#walkthroughStepCounter").textContent()) || "").trim();
  const firstTitle = ((await page.locator("#walkthroughTitle").textContent()) || "").trim();
  const firstGoal = ((await page.locator("#walkthroughGoal").textContent()) || "").trim();
  const walkthroughVisualVisible = await page.locator("#walkthroughVisualBlock").isVisible().catch(() => false);
  const walkthroughVisualText = ((await page.locator("#walkthroughFolderGuideMap").textContent().catch(() => "")) || "").trim();
  await page.locator("#walkthroughNextBtn").click();
  await page.waitForTimeout(150);
  const secondCounter = ((await page.locator("#walkthroughStepCounter").textContent()) || "").trim();
  const secondTitle = ((await page.locator("#walkthroughTitle").textContent()) || "").trim();
  const secondGoal = ((await page.locator("#walkthroughGoal").textContent()) || "").trim();
  await page.locator("#walkthroughTryBtn").scrollIntoViewIfNeeded();
  await page.locator("#walkthroughTryBtn").click();
  await expect(page.locator("#walkthroughCard")).toBeHidden();
  const after = await getTerminalSnapshot(page);
  const delta = after.lines.slice(before.lineCount);

  return {
    before,
    after,
    delta,
    progressed: after.stepBadge !== before.stepBadge || after.scenarioTitle !== before.scenarioTitle || delta.some((line) => /scenario complete/i.test(line.text)),
    completed: delta.some((line) => /\[task complete\]|\[review\]|\[mission complete\]/i.test(line.text)),
    walkthroughVisible: true,
    firstStepVisible: /Step 1/i.test(firstCounter) || /Step 1/i.test(firstTitle),
    secondStepVisible: /Step 2/i.test(secondCounter) || /Step 2/i.test(secondTitle),
    firstCounter,
    firstTitle,
    firstGoal,
    walkthroughVisualVisible,
    walkthroughVisualText,
    secondCounter,
    secondTitle,
    secondGoal,
    inputEnabledAfterTry: await page.locator("#terminalInput").isEnabled()
  };
}

async function assertVisible(page, selector) {
  await expect(page.locator(selector)).toBeVisible();
}

function subnetMaskFromPrefix(prefix) {
  const masks = {
    24: "255.255.255.0",
    25: "255.255.255.128",
    26: "255.255.255.192",
    27: "255.255.255.224",
    28: "255.255.255.240",
    29: "255.255.255.248",
    30: "255.255.255.252"
  };

  return masks[prefix] || "";
}

function usableHosts(prefix) {
  return Math.max(0, (2 ** (32 - prefix)) - 2);
}

function formatCidr(prefix) {
  return `/${prefix}`;
}

function computeSubnetAnswer(questionText) {
  const text = String(questionText || "").trim();

  let match = text.match(/usable hosts are available with \/(\d+)\?/i);
  if (match) {
    return String(usableHosts(Number(match[1])));
  }

  match = text.match(/subnet mask for \/(\d+)\?/i);
  if (match) {
    return subnetMaskFromPrefix(Number(match[1]));
  }

  match = text.match(/network bits are needed for (\d+) usable hosts\?/i);
  if (match) {
    const needed = Number(match[1]);
    for (let prefix = 30; prefix >= 24; prefix -= 1) {
      if (usableHosts(prefix) === needed) {
        return formatCidr(prefix);
      }
    }
  }

  match = text.match(/You need (\d+) usable hosts\. Which subnet should you use\?/i);
  if (match) {
    const required = Number(match[1]);
    for (let prefix = 30; prefix >= 24; prefix -= 1) {
      if (usableHosts(prefix) >= required) {
        return formatCidr(prefix);
      }
    }
  }

  match = text.match(/IP:\s*(\d+\.\d+\.\d+\.)(\d+)\s*\/(\d+)\s*-> What is the network address\?/i);
  if (match) {
    const base = match[1];
    const host = Number(match[2]);
    const prefix = Number(match[3]);
    const block = 2 ** (32 - prefix);
    const network = Math.floor(host / block) * block;
    return `${base}${network}`;
  }

  match = text.match(/IP:\s*(\d+\.\d+\.\d+\.)(\d+)\s*\/(\d+)\s*-> What is the broadcast address\?/i);
  if (match) {
    const base = match[1];
    const host = Number(match[2]);
    const prefix = Number(match[3]);
    const block = 2 ** (32 - prefix);
    const network = Math.floor(host / block) * block;
    return `${base}${network + block - 1}`;
  }

  match = text.match(/IP:\s*(\d+\.\d+\.\d+\.)(\d+)\s*\/(\d+)\s*-> What is the usable range\?/i);
  if (match) {
    const base = match[1];
    const host = Number(match[2]);
    const prefix = Number(match[3]);
    const block = 2 ** (32 - prefix);
    const network = Math.floor(host / block) * block;
    return `${base}${network + 1} - ${base}${network + block - 2}`;
  }

  return "";
}

async function clickSubnetAnswer(page, answerText) {
  const buttons = page.locator("#answers button");
  const count = await buttons.count();
  for (let index = 0; index < count; index += 1) {
    const text = ((await buttons.nth(index).textContent()) || "").trim();
    if (text === String(answerText).trim()) {
      await buttons.nth(index).click();
      return true;
    }
  }
  return false;
}

async function getVisibleSubnetAnswers(page) {
  return page.locator("#answers button").evaluateAll((nodes) => nodes.map((node) => (node.textContent || "").trim()));
}

module.exports = {
  attachSmokeData,
  assertVisible,
  checkNoHorizontalOverflow,
  computeSubnetAnswer,
  createSmokeReport,
  gotoAndStabilize,
  getTerminalSnapshot,
  getVisibleSubnetAnswers,
  observePage,
  pushCheck,
  pushWarning,
  readText,
  runTerminalCommand,
  runWalkthroughDemo,
  clickSubnetAnswer
};
