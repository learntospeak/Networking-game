const { test, expect } = require("@playwright/test");
const {
  addLabHealth,
  attachSmokeData,
  createSmokeReport,
  dismissTicketBriefingIfPresent,
  gotoAndStabilize,
  observePage,
  pushCheck,
  pushWarning,
  readText,
  resetTerminalScenario,
  runTerminalCommand
} = require("./smoke-helpers");

async function openWindowsBeginner(page, report) {
  observePage(page, report);
  await gotoAndStabilize(page, "/terminal-coach.html?track=windows&mode=standard");
  await dismissTicketBriefingIfPresent(page);
}

async function loadScenarioById(page, id) {
  await page.evaluate((scenarioId) => window.TerminalEngine?.loadScenarioById?.(scenarioId), id);
  await page.waitForTimeout(250);
  await dismissTicketBriefingIfPresent(page);
}

async function assertCommandRuns(page, report, command, expectedPattern, options = {}) {
  const result = await runTerminalCommand(page, command, options);
  report.commandResults.push(result);
  const text = result.delta.map((line) => line.text).join("\n");
  const expected = expectedPattern ? expectedPattern.test(text) : result.delta.length > 0;
  const helperMessages = result.delta
    .filter((line) => /coach|hint|walkthrough/i.test(String(line.type || "")))
    .map((line) => String(line.text || "").trim())
    .filter(Boolean);
  const shortFeedback = helperMessages.every((message) => message.length <= 250);

  pushCheck(report, `${command} does not error unexpectedly`, result.accepted, result.notes);
  pushCheck(report, `${command} updates terminal output`, result.delta.length > 0, result.notes);
  pushCheck(report, `${command} output matches expectation`, expected, text.slice(0, 500));
  pushCheck(report, `${command} leaves input usable`, await page.locator("#terminalInput").isEnabled(), "terminal input enabled");
  pushCheck(report, `${command} ${options.exploration ? "exploration feedback" : "helper feedback"} stays short`, !options.exploration || shortFeedback, helperMessages.join(" | "));
  addLabHealth(report, { commandsTested: [command] });

  if (result.accepted) {
    addLabHealth(report, { acceptedVariations: [command] });
  } else if (options.reasonableAlternative) {
    addLabHealth(report, { rejectedReasonableAlternatives: [command] });
    pushWarning(report, `Reasonable alternative rejected: ${command}`);
  }

  expect(result.accepted).toBeTruthy();
  expect(expected).toBeTruthy();
  if (options.exploration) {
    expect(shortFeedback).toBeTruthy();
  }
  return result;
}

async function taughtText(page) {
  return page.evaluate(() => [
    "#commandFamilyIntroCard",
    "#beginnerVisualGuideCard",
    "#walkthroughCard",
    "#commandSheet"
  ].map((selector) => document.querySelector(selector)?.textContent || "").join(" ").toLowerCase());
}

test("Command variants: Windows command families run with useful output", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  const report = createSmokeReport("Windows Command Variants", "/terminal-coach.html?track=windows&mode=standard");
  addLabHealth(report, { pagesTested: ["windows command families"] });
  await openWindowsBeginner(page, report);

  await loadScenarioById(page, "win-ipconfig-and-getmac-audit");
  await assertCommandRuns(page, report, "ipconfig", /IPv4 Address|Default Gateway/i, { resetBefore: true });
  await assertCommandRuns(page, report, "ipconfig /all", /DNS Servers|Physical Address/i, { resetBefore: true });
  await assertCommandRuns(page, report, "ipconfig /displaydns", /Record Name|fileserver/i, { resetBefore: true });
  await assertCommandRuns(page, report, "ipconfig /flushdns", /Successfully flushed/i, { resetBefore: true });

  await loadScenarioById(page, "win-netstat-connection-audit");
  await assertCommandRuns(page, report, "netstat", /Proto|TCP/i, { resetBefore: true });
  await assertCommandRuns(page, report, "netstat -a", /LISTENING|Proto/i, { resetBefore: true });
  await assertCommandRuns(page, report, "netstat -ano", /PID|LISTENING/i, { resetBefore: true });
  await assertCommandRuns(page, report, "netstat -aon", /PID|LISTENING/i, { resetBefore: true, reasonableAlternative: true });

  await loadScenarioById(page, "win-arp-and-route-review");
  await assertCommandRuns(page, report, "route print", /IPv4 Route Table|Network Destination/i, { resetBefore: true });
  await assertCommandRuns(page, report, "netstat -r", /IPv4 Route Table|Network Destination/i, { resetBefore: true, reasonableAlternative: true });
  await assertCommandRuns(page, report, "arp -a", /Interface|dynamic/i, { resetBefore: true });

  await loadScenarioById(page, "win-nslookup-fileserver");
  await assertCommandRuns(page, report, "nslookup fileserver", /Name:\s+fileserver|192\.168\.56\.20/i, { resetBefore: true });

  await loadScenarioById(page, "win-ipconfig-and-getmac-audit");
  await assertCommandRuns(page, report, "nslookup web-lab", /Name:\s+web-lab|192\.168\.56\.10/i, { resetBefore: true, exploration: true });

  await loadScenarioById(page, "win-ping-fileserver");
  await assertCommandRuns(page, report, "tracert fileserver", /Tracing route|Trace complete|192\.168\.56\.20/i, { resetBefore: true, exploration: true });
  await assertCommandRuns(page, report, "tracert -d fileserver", /Tracing route|Trace complete|192\.168\.56\.20/i, { resetBefore: true, reasonableAlternative: true, exploration: true });

  await attachSmokeData(testInfo, report);
});

test("Command variants: alternate solutions complete matching objectives", async ({ page }, testInfo) => {
  const report = createSmokeReport("Windows Multiple Solutions", "/terminal-coach.html?track=windows&mode=standard");
  addLabHealth(report, { pagesTested: ["windows alternate solution paths"] });
  await openWindowsBeginner(page, report);

  await loadScenarioById(page, "win-netstat-connection-audit");
  await runTerminalCommand(page, "netstat", { resetBefore: true });
  await runTerminalCommand(page, "netstat -a");
  const netstatAlt = await runTerminalCommand(page, "netstat -aon");
  await page.waitForTimeout(150);
  const netstatTask = await readText(page, "#stepObjective");
  report.commandResults.push(netstatAlt);
  pushCheck(report, "netstat -aon completes PID objective", netstatAlt.accepted && /Filter the PID view/i.test(netstatTask), `${netstatTask} | ${netstatAlt.notes}`);
  addLabHealth(report, { commandsTested: ["netstat -aon"], acceptedVariations: netstatAlt.accepted ? ["netstat -aon"] : [], rejectedReasonableAlternatives: netstatAlt.accepted ? [] : ["netstat -aon"] });
  expect(netstatAlt.accepted && /Filter the PID view/i.test(netstatTask)).toBeTruthy();

  await loadScenarioById(page, "win-arp-and-route-review");
  await runTerminalCommand(page, "arp -a", { resetBefore: true });
  await runTerminalCommand(page, "arp -d");
  const routeAlt = await runTerminalCommand(page, "netstat -r");
  await page.waitForTimeout(150);
  const routeTask = await readText(page, "#stepObjective");
  report.commandResults.push(routeAlt);
  pushCheck(report, "netstat -r completes route-table objective", routeAlt.accepted && /IPv4 routes/i.test(routeTask), `${routeTask} | ${routeAlt.notes}`);
  addLabHealth(report, { commandsTested: ["netstat -r"], acceptedVariations: routeAlt.accepted ? ["netstat -r"] : [], rejectedReasonableAlternatives: routeAlt.accepted ? [] : ["netstat -r"] });
  expect(routeAlt.accepted && /IPv4 routes/i.test(routeTask)).toBeTruthy();

  await loadScenarioById(page, "win-ipconfig-and-getmac-audit");
  await runTerminalCommand(page, "ipconfig", { resetBefore: true });
  const dnsDetail = await runTerminalCommand(page, "ipconfig /all");
  await page.waitForTimeout(150);
  const ipconfigTask = await readText(page, "#stepObjective");
  report.commandResults.push(dnsDetail);
  pushCheck(report, "ipconfig /all satisfies DNS-server lookup task", dnsDetail.accepted && /saved DNS answers/i.test(ipconfigTask) && /DNS/i.test(dnsDetail.notes), `${ipconfigTask} | ${dnsDetail.notes}`);
  addLabHealth(report, { commandsTested: ["ipconfig /all"], acceptedVariations: dnsDetail.accepted ? ["ipconfig /all"] : [], rejectedReasonableAlternatives: dnsDetail.accepted ? [] : ["ipconfig /all"] });
  expect(dnsDetail.accepted && /saved DNS answers/i.test(ipconfigTask)).toBeTruthy();

  await attachSmokeData(testInfo, report);
});

test("Command variants: beginner variations are taught before tested", async ({ page }, testInfo) => {
  const report = createSmokeReport("Windows Taught Before Tested", "/terminal-coach.html?track=windows&mode=standard");
  addLabHealth(report, { pagesTested: ["command family intro coverage"] });
  await openWindowsBeginner(page, report);

  await loadScenarioById(page, "win-ipconfig-and-getmac-audit");
  let taught = await taughtText(page);
  pushCheck(report, "ipconfig /all is visible before task asks for it", /ipconfig \/all/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("ipconfig /all");
  await runTerminalCommand(page, "ipconfig", { resetBefore: true });
  taught = await taughtText(page);
  pushCheck(report, "displaydns is visible before task asks for it", /displaydns/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("displaydns");
  await runTerminalCommand(page, "ipconfig /all");
  taught = await taughtText(page);
  pushCheck(report, "flushdns is visible before task asks for it", /flushdns/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("flushdns");

  await loadScenarioById(page, "win-netstat-connection-audit");
  taught = await taughtText(page);
  pushCheck(report, "netstat -ano is visible before PID task", /netstat -ano/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("netstat -ano");

  await loadScenarioById(page, "win-arp-and-route-review");
  taught = await taughtText(page);
  pushCheck(report, "arp -a is visible before ARP task", /arp -a/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("arp -a");
  await runTerminalCommand(page, "arp -a", { resetBefore: true });
  await runTerminalCommand(page, "arp -d");
  taught = await taughtText(page);
  pushCheck(report, "route print is visible before route task", /route print/.test(taught), taught.slice(0, 500));
  expect(taught).toContain("route print");

  await attachSmokeData(testInfo, report);
});
