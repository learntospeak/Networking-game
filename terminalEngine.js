(function () {
  const { StateManager, CoachEngine, ScenarioEngine } = window;

  if (!StateManager || !CoachEngine || !ScenarioEngine) {
    return;
  }

  const els = {
    scenarioCountBadge: document.getElementById("scenarioCountBadge"),
    stepCountBadge: document.getElementById("stepCountBadge"),
    shellBadge: document.getElementById("shellBadge"),
    scenarioCategory: document.getElementById("scenarioCategory"),
    scenarioTitle: document.getElementById("scenarioTitle"),
    scenarioLevel: document.getElementById("scenarioLevel"),
    scenarioObjective: document.getElementById("scenarioObjective"),
    scenarioFlex: document.getElementById("scenarioFlex"),
    stepObjective: document.getElementById("stepObjective"),
    coachSignal: document.getElementById("coachSignal"),
    hintLadder: document.getElementById("hintLadder"),
    progressSummary: document.getElementById("progressSummary"),
    terminalOutput: document.getElementById("terminalOutput"),
    terminalForm: document.getElementById("terminalForm"),
    terminalPrompt: document.getElementById("terminalPrompt"),
    terminalInput: document.getElementById("terminalInput"),
    hintBtn: document.getElementById("hintBtn"),
    resetScenarioBtn: document.getElementById("resetScenarioBtn"),
    nextScenarioBtn: document.getElementById("nextScenarioBtn")
  };

  const session = {
    scenarioIndex: 0,
    stepIndex: 0,
    state: null,
    completedScenarioIds: new Set(),
    attemptsForStep: 0,
    hintLevel: -1,
    commandHistory: [],
    historyIndex: 0,
    scenarioCompleted: false
  };

  function currentScenario() {
    return ScenarioEngine.scenarios[session.scenarioIndex];
  }

  function currentStep() {
    return currentScenario().steps[session.stepIndex];
  }

  function totalScenarios() {
    return ScenarioEngine.scenarios.length;
  }

  function scrollTerminal() {
    els.terminalOutput.scrollTop = els.terminalOutput.scrollHeight;
  }

  function printLine(text, type = "system") {
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    els.terminalOutput.appendChild(line);
    scrollTerminal();
  }

  function printLines(lines, type = "system") {
    const values = Array.isArray(lines) ? lines : [lines];
    values.forEach((value) => {
      if (value === null || value === undefined || value === "") return;
      printLine(String(value), type);
    });
  }

  function clearTerminal() {
    els.terminalOutput.innerHTML = "";
  }

  function updatePrompt() {
    els.terminalPrompt.textContent = StateManager.getPrompt(session.state);
  }

  function shellLabel() {
    if (session.state.metasploit.active) return "Metasploit";
    if (session.state.activeConnection) {
      if (session.state.activeConnection.type === "smtp") return "SMTP Session";
      if (session.state.activeConnection.type === "shell") return "Remote Shell";
      return "Connection";
    }

    return StateManager.isWindowsState(session.state) ? "Windows CMD" : "Linux";
  }

  function renderHintLadder() {
    const items = Array.from(els.hintLadder.querySelectorAll("li"));
    items.forEach((item, index) => {
      item.classList.toggle("active", index <= session.hintLevel);
    });
  }

  function renderPanel() {
    const scenario = currentScenario();
    const step = currentStep();

    els.scenarioCountBadge.textContent = `Scenario ${session.scenarioIndex + 1} / ${totalScenarios()}`;
    els.stepCountBadge.textContent = `Task ${session.stepIndex + 1} / ${scenario.steps.length}`;
    els.shellBadge.textContent = shellLabel();

    els.scenarioCategory.textContent = scenario.category;
    els.scenarioTitle.textContent = scenario.title;
    els.scenarioLevel.textContent = scenario.level;
    els.scenarioObjective.textContent = scenario.objective;
    els.scenarioFlex.textContent = `Allowed flexibility: ${scenario.allowedFlexibility || "Use any valid workflow that reaches the objective."}`;
    els.stepObjective.textContent = step.objective;
    els.progressSummary.textContent = `${session.completedScenarioIds.size} scenarios completed in this session.`;

    if (session.scenarioCompleted) {
      els.coachSignal.textContent = "Scenario complete. Move to the next scenario or reset this one and run it cleaner.";
    } else if (session.attemptsForStep > 0) {
      els.coachSignal.textContent = "Stay on the current objective. Use the output you already produced before you widen the workflow.";
    } else {
      els.coachSignal.textContent = "Work from evidence. Good operators confirm context before they act.";
    }

    renderHintLadder();
    updatePrompt();
  }

  function announceScenario() {
    const scenario = currentScenario();
    const step = currentStep();

    printLine(`[${scenario.category}] ${scenario.title}`, "system");
    printLine(`Objective: ${scenario.objective}`, "dim");
    printLine(`Environment: ${shellLabel()} shell`, "dim");
    printLine(`Current task: ${step.objective}`, "coach");
  }

  function resetScenarioState() {
    session.state = StateManager.createState(currentScenario().environment);
    session.stepIndex = 0;
    session.attemptsForStep = 0;
    session.hintLevel = -1;
    session.scenarioCompleted = false;
  }

  function loadScenario(index) {
    session.scenarioIndex = ((index % totalScenarios()) + totalScenarios()) % totalScenarios();
    resetScenarioState();
    clearTerminal();
    announceScenario();
    renderPanel();
    els.terminalInput.focus();
  }

  function markScenarioComplete() {
    session.completedScenarioIds.add(currentScenario().id);
    session.scenarioCompleted = true;
    printLine("Scenario complete. You reached the objective with live command input.", "success");
    renderPanel();
  }

  function advanceStep() {
    const scenario = currentScenario();

    if (session.stepIndex >= scenario.steps.length - 1) {
      markScenarioComplete();
      return;
    }

    session.stepIndex += 1;
    session.attemptsForStep = 0;
    session.hintLevel = -1;
    printLine(`Next task: ${currentStep().objective}`, "coach");
    renderPanel();
  }

  function pushHistory(command) {
    if (!command) return;
    if (session.commandHistory[session.commandHistory.length - 1] !== command) {
      session.commandHistory.push(command);
    }
    session.historyIndex = session.commandHistory.length;
  }

  function recallHistory(direction) {
    if (!session.commandHistory.length) return;

    session.historyIndex += direction;
    if (session.historyIndex < 0) session.historyIndex = 0;
    if (session.historyIndex > session.commandHistory.length) {
      session.historyIndex = session.commandHistory.length;
    }

    if (session.historyIndex === session.commandHistory.length) {
      els.terminalInput.value = "";
      return;
    }

    els.terminalInput.value = session.commandHistory[session.historyIndex];
  }

  function splitOutsideQuotes(input, delimiter) {
    const result = [];
    let current = "";
    let quote = null;

    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];

      if ((char === "'" || char === "\"") && input[index - 1] !== "\\") {
        if (quote === char) {
          quote = null;
        } else if (!quote) {
          quote = char;
        }

        current += char;
        continue;
      }

      if (!quote && char === delimiter) {
        result.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    if (current.trim() || delimiter !== " ") {
      result.push(current.trim());
    }

    return result.filter(Boolean);
  }

  function tokenize(input) {
    const tokens = [];
    let current = "";
    let quote = null;

    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];

      if ((char === "'" || char === "\"") && input[index - 1] !== "\\") {
        if (quote === char) {
          quote = null;
        } else if (!quote) {
          quote = char;
        } else {
          current += char;
        }
        continue;
      }

      if (!quote && /\s/.test(char)) {
        if (current) {
          tokens.push(current);
          current = "";
        }
        continue;
      }

      current += char;
    }

    if (current) {
      tokens.push(current);
    }

    return tokens;
  }

  function expandFlags(token) {
    if (!token) return [];
    if (token.startsWith("--")) return [token];
    if (token.startsWith("/") && /^\/[A-Za-z0-9?]+$/.test(token)) return [token.toUpperCase()];
    if (!token.startsWith("-") || token.length === 1) return [];
    if (/^-[0-9]+$/.test(token)) return [token];
    if (token.length === 2) return [token];
    return token
      .slice(1)
      .split("")
      .map((flag) => `-${flag}`);
  }

  function parseSegment(rawSegment) {
    const tokens = tokenize(rawSegment);
    const redirectIndex = tokens.findIndex((token) => token === ">" || token === ">>");
    let redirect = null;
    let workingTokens = tokens;

    if (redirectIndex !== -1) {
      redirect = {
        append: tokens[redirectIndex] === ">>",
        path: tokens[redirectIndex + 1] || ""
      };
      workingTokens = tokens.slice(0, redirectIndex);
    }

    const command = (workingTokens[0] || "").toLowerCase();
    const flags = [];
    const flagsExpanded = [];
    const args = [];

    workingTokens.slice(1).forEach((token) => {
      if (token.startsWith("--")) {
        flags.push(token);
        flagsExpanded.push(token);
        return;
      }

      if (token.startsWith("-") && token.length > 1 && !/^-?\d+(\.\d+)?$/.test(token)) {
        flags.push(token);
        flagsExpanded.push(...expandFlags(token));
        return;
      }

      if (/^\/[A-Za-z0-9?]+$/.test(token)) {
        flags.push(token.toUpperCase());
        flagsExpanded.push(token.toUpperCase());
        return;
      }

      args.push(token);
    });

    return {
      raw: rawSegment.trim(),
      tokens: workingTokens,
      command,
      flags,
      flagsExpanded,
      args,
      redirect
    };
  }

  function parseInput(rawInput) {
    const pipeline = splitOutsideQuotes(rawInput.trim(), "|").map(parseSegment);

    return {
      raw: rawInput.trim(),
      pipeline,
      primary: pipeline[0] || null,
      pipelineCommands: pipeline.map((segment) => segment.command).filter(Boolean)
    };
  }

  function hasFlag(parsed, ...values) {
    return values.some((value) => parsed.flags.includes(value) || parsed.flagsExpanded.includes(value));
  }

  function firstValueAfter(parsed, flagNames) {
    const names = Array.isArray(flagNames) ? flagNames : [flagNames];

    for (let index = 0; index < parsed.tokens.length; index += 1) {
      if (names.includes(parsed.tokens[index]) || names.includes(parsed.tokens[index].toUpperCase())) {
        return parsed.tokens[index + 1] || "";
      }
    }

    return "";
  }

  function formatDirectoryListing(path, children) {
    const prefix = StateManager.isWindowsState(session.state)
      ? ` Directory of ${StateManager.displayPath(session.state, path)}`
      : "";

    const values = children.map((node) => {
      if (node.type === "dir") return `${node.name}/`;
      return node.name;
    });

    if (!values.length) {
      return prefix ? [prefix, "", "File Not Found"] : [""];
    }

    return prefix ? [prefix, "", ...values] : [values.join("  ")];
  }

  function formatProcessList(processes) {
    if (StateManager.isWindowsState(session.state)) {
      return [
        "Image Name                     PID Session Name        Session#    Mem Usage",
        "========================= ======== ================ =========== ===========",
        ...processes.map((process) => `${process.name.padEnd(25)} ${String(process.pid).padStart(7)} Console                    1 ${String(process.memory || "24").padStart(10)} K`)
      ];
    }

    return [
      "  PID USER       %CPU %MEM COMMAND",
      ...processes.map((process) => `${String(process.pid).padStart(5)} ${String(process.user || "student").padEnd(10)} ${(process.cpu || "0.0").padStart(4)} ${(process.memory || "0.1").padStart(4)} ${process.command || process.name}`)
    ];
  }

  function filterLines(lines, pattern) {
    if (!pattern) return lines;
    const regex = new RegExp(pattern, "i");
    return lines.filter((line) => regex.test(line));
  }

  function buildDownloadedFile(url, outputName) {
    const filename = outputName || url.split("/").pop() || "downloaded-file";

    if (filename === "python-nmap.tar.gz") {
      return {
        path: filename,
        content: "",
        downloaded: true,
        archiveEntries: [
          { path: "python-nmap-0.7.1", type: "dir" },
          { path: "python-nmap-0.7.1/example.py", content: "import nmap\nprint('example ready')\n" },
          { path: "python-nmap-0.7.1/setup.py", content: "from setuptools import setup\n" }
        ]
      };
    }

    if (filename === "bundle.tar.gz") {
      return {
        path: filename,
        content: "",
        downloaded: true,
        archiveEntries: [
          { path: "bundle", type: "dir" },
          { path: "bundle/config.ini", content: "mode=lab\nport=8443\n" }
        ]
      };
    }

    return {
      path: filename,
      content: `Downloaded from ${url}\n`,
      downloaded: true
    };
  }

  function parsePortList(value) {
    if (!value) return null;
    return value.split(",").map((item) => Number(item.trim())).filter((item) => Number.isInteger(item));
  }

  function targetListFromArgs(parsed) {
    const fromFile = firstValueAfter(parsed, ["-iL"]);
    if (fromFile) {
      const file = StateManager.readFile(session.state, fromFile);
      if (!file.ok) return { error: file.error };

      return file.content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((entry) => StateManager.findTarget(session.state, entry) || { ip: entry, reachable: false, ports: [] });
    }

    const targets = parsed.args
      .filter((arg) => !arg.startsWith("-"))
      .map((arg) => StateManager.findTarget(session.state, arg) || { ip: arg, hostname: arg, reachable: false, ports: [] });

    return targets;
  }

  function okResult(stdout = [], extra = {}) {
    return {
      status: "ok",
      stdout: Array.isArray(stdout) ? stdout : [stdout],
      stderr: [],
      ...extra
    };
  }

  function errorResult(message, status = "runtime_error") {
    return {
      status,
      stdout: [],
      stderr: [message]
    };
  }

  function executePwd() {
    return okResult(StateManager.displayPath(session.state, session.state.cwd));
  }

  function executeLs(parsed) {
    const target = parsed.args[0] || session.state.cwd;
    const node = StateManager.getNode(session.state, target);
    if (!node) return errorResult("ls: cannot access target: No such file or directory");
    if (node.type === "file") return okResult(node.name);

    const includeHidden = hasFlag(parsed, "-a");
    const children = StateManager.listChildren(session.state, target, includeHidden);
    return okResult(formatDirectoryListing(node.path, children));
  }

  function executeDir(parsed) {
    const target = parsed.args[0] || session.state.cwd;
    const node = StateManager.getNode(session.state, target);
    if (!node) return errorResult("File Not Found");
    if (node.type === "file") return okResult([` Directory of ${StateManager.displayPath(session.state, session.state.cwd)}`, "", node.name]);

    const includeHidden = hasFlag(parsed, "/A", "/AH");
    const children = StateManager.listChildren(session.state, target, includeHidden);
    return okResult(formatDirectoryListing(node.path, children));
  }

  function executeCd(parsed) {
    const target = parsed.args[0] || session.state.home;
    const changed = StateManager.changeDirectory(session.state, target);
    if (!changed.ok) return errorResult(changed.error);
    return okResult(StateManager.displayPath(session.state, session.state.cwd));
  }

  function executeMkdir(parsed) {
    if (!parsed.args.length) return errorResult("mkdir: missing operand", "syntax_error");
    parsed.args.forEach((arg) => StateManager.mkdir(session.state, arg));
    return okResult(parsed.args.map((arg) => `created directory ${arg}`));
  }

  function executeTouch(parsed) {
    if (!parsed.args.length) return errorResult("touch: missing file operand", "syntax_error");
    parsed.args.forEach((arg) => StateManager.touch(session.state, arg));
    return okResult([]);
  }

  function readTextSource(commandName, parsed, pipedInput) {
    if (pipedInput.length) return { ok: true, lines: pipedInput };
    const filename = parsed.args[parsed.args.length - 1];
    if (!filename) return { ok: false, error: `${commandName}: missing file operand`, status: "syntax_error" };
    const file = StateManager.readFile(session.state, filename);
    if (!file.ok) return { ok: false, error: file.error, status: "runtime_error" };
    return { ok: true, lines: file.content.split(/\r?\n/) };
  }

  function executeCat(parsed) {
    if (!parsed.args.length) return errorResult("cat: missing file operand", "syntax_error");
    const outputs = [];
    for (const arg of parsed.args) {
      const file = StateManager.readFile(session.state, arg);
      if (!file.ok) return errorResult(file.error);
      outputs.push(file.content.replace(/\n$/, ""));
    }
    return okResult(outputs);
  }

  function executeType(parsed) {
    return executeCat(parsed);
  }

  function executeEcho(parsed) {
    const text = parsed.args.join(" ");
    if (parsed.redirect && parsed.redirect.path) {
      const written = StateManager.writeFile(session.state, parsed.redirect.path, `${text}\n`, parsed.redirect.append);
      if (!written.ok) return errorResult(written.error);
      return okResult(`saved output to ${parsed.redirect.path}`);
    }
    return okResult(text);
  }

  function executeGrep(parsed, pipedInput) {
    const pattern = parsed.args[0];
    if (!pattern) return errorResult("grep: missing search pattern", "syntax_error");
    const source = readTextSource("grep", parsed, pipedInput);
    if (!source.ok) return errorResult(source.error, source.status);
    return okResult(filterLines(source.lines, pattern));
  }

  function executeFindstr(parsed, pipedInput) {
    const pattern = parsed.args[0];
    if (!pattern) return errorResult("FINDSTR: missing search string", "syntax_error");
    const source = readTextSource("findstr", parsed, pipedInput);
    if (!source.ok) return errorResult(source.error, source.status);
    return okResult(filterLines(source.lines, pattern));
  }

  function executeCp(parsed) {
    if (parsed.args.length < 2) return errorResult("cp: missing file operand", "syntax_error");
    const copied = StateManager.copyPath(session.state, parsed.args[0], parsed.args[1]);
    if (!copied.ok) return errorResult(copied.error);
    return okResult(`copied ${parsed.args[0]} -> ${parsed.args[1]}`);
  }

  function executeMv(parsed) {
    if (parsed.args.length < 2) return errorResult("mv: missing file operand", "syntax_error");
    const moved = StateManager.movePath(session.state, parsed.args[0], parsed.args[1]);
    if (!moved.ok) return errorResult(moved.error);
    return okResult(`moved ${parsed.args[0]} -> ${parsed.args[1]}`);
  }

  function executeRm(parsed) {
    if (!parsed.args.length) return errorResult("rm: missing operand", "syntax_error");
    const recursive = hasFlag(parsed, "-r", "-f");
    const removed = StateManager.removePath(session.state, parsed.args[0], recursive);
    if (!removed.ok) return errorResult(removed.error);
    return okResult([]);
  }

  function executeTar(parsed) {
    if (!hasFlag(parsed, "-x")) {
      return errorResult("tar: this trainer currently supports extraction workflows only", "wrong_context");
    }

    const archivePath = parsed.args[0];
    if (!archivePath) return errorResult("tar: missing archive file", "syntax_error");
    const extracted = StateManager.extractArchive(session.state, archivePath);
    if (!extracted.ok) return errorResult(extracted.error);

    const archiveNode = StateManager.getNode(session.state, archivePath);
    const extractedEntries = (archiveNode.archiveEntries || []).map((entry) => entry.path);
    return okResult(extractedEntries.length ? extractedEntries : `extracted ${archivePath}`);
  }

  function executeWget(parsed) {
    const url = parsed.args[0];
    if (!url) return errorResult("wget: missing URL", "syntax_error");
    const outputName = firstValueAfter(parsed, ["-O"]);
    const fileDef = buildDownloadedFile(url, outputName);
    StateManager.writeFile(session.state, fileDef.path, fileDef.content || "");
    const node = StateManager.getNode(session.state, fileDef.path);
    node.archiveEntries = fileDef.archiveEntries || [];
    node.downloaded = true;

    return okResult([
      `--2026-04-13--  ${url}`,
      `Saving to: '${fileDef.path}'`,
      `${fileDef.path} saved`
    ]);
  }

  function executePs() {
    return okResult(formatProcessList(StateManager.listProcesses(session.state)));
  }

  function executeTasklist() {
    return okResult(formatProcessList(StateManager.listProcesses(session.state)));
  }

  function executeKill(parsed) {
    const pid = parsed.args.find((arg) => /^\d+$/.test(arg));
    if (!pid) return errorResult("kill: usage requires a PID", "syntax_error");
    const killed = StateManager.killProcess(session.state, pid);
    if (!killed.ok) return errorResult(killed.error);
    return okResult(`terminated process ${pid}`);
  }

  function executeTaskkill(parsed) {
    const pid = firstValueAfter(parsed, ["/PID"]);
    if (!pid) return errorResult("ERROR: The /PID option requires a process id.", "syntax_error");
    const killed = StateManager.killProcess(session.state, pid);
    if (!killed.ok) return errorResult(killed.error);
    return okResult(`SUCCESS: Sent termination signal to PID ${pid}.`);
  }

  function executePing(parsed) {
    const targetValue = parsed.args[0];
    if (!targetValue) return errorResult("ping: missing destination", "syntax_error");
    const target = StateManager.findTarget(session.state, targetValue) || { ip: targetValue, reachable: false };
    if (!target.reachable) return errorResult(`PING ${targetValue}: host unreachable`);

    return okResult([
      `PING ${target.ip} (${target.ip}) 56(84) bytes of data.`,
      `64 bytes from ${target.ip}: icmp_seq=1 ttl=64 time=0.34 ms`,
      `64 bytes from ${target.ip}: icmp_seq=2 ttl=64 time=0.31 ms`,
      `64 bytes from ${target.ip}: icmp_seq=3 ttl=64 time=0.29 ms`,
      "",
      `--- ${target.ip} ping statistics ---`,
      "3 packets transmitted, 3 received, 0% packet loss"
    ]);
  }

  function buildNmapOutput(target, parsed) {
    if (!target.reachable) {
      return [`Nmap scan report for ${target.ip}`, "Host seems down."];
    }

    const requestedPorts = parsePortList(firstValueAfter(parsed, ["-p"]));
    const topPorts = Number(firstValueAfter(parsed, ["--top-ports"])) || null;
    const udp = hasFlag(parsed, "-sU");
    const portPool = requestedPorts
      ? target.ports.filter((port) => requestedPorts.includes(port.port))
      : topPorts
        ? target.ports.slice(0, topPorts)
        : target.ports.filter((port) => (udp ? port.proto === "udp" : port.proto === "tcp"));

    const filtered = portPool.filter((port) => (udp ? port.proto === "udp" : port.proto === "tcp"));

    const lines = [
      `Nmap scan report for ${target.hostname || target.ip} (${target.ip})`,
      "Host is up (0.0021s latency).",
      ""
    ];

    if (hasFlag(parsed, "-O")) {
      lines.push(`OS details: ${target.os || "Linux"}`);
      lines.push("");
    }

    lines.push("PORT     STATE SERVICE");
    filtered.forEach((port) => {
      const base = `${String(port.port).padEnd(7)}/${port.proto.padEnd(3)} open  ${port.service}`;
      lines.push(hasFlag(parsed, "-sV") ? `${base}  ${port.version}` : base);
    });

    if (!filtered.length) {
      lines.push("No matching ports found.");
    }

    return lines;
  }

  function executeNmap(parsed) {
    const targets = targetListFromArgs(parsed);
    if (targets.error) return errorResult(targets.error);
    if (!targets.length) return errorResult("nmap: missing target specification", "syntax_error");

    const excludeValue = firstValueAfter(parsed, ["--exclude"]);
    const excludeTargets = excludeValue ? excludeValue.split(",").map((item) => item.trim()) : [];
    const activeTargets = targets.filter((target) => !excludeTargets.includes(target.ip) && !excludeTargets.includes(target.hostname));

    const output = [];
    activeTargets.forEach((target, index) => {
      if (index > 0) output.push("");
      output.push(...buildNmapOutput(target, parsed));
      StateManager.recordDiscovery(session.state, {
        type: "scan",
        target: target.ip,
        flags: parsed.flags.slice()
      });
    });

    const normalOutputFile = firstValueAfter(parsed, ["-oN"]);
    const xmlOutputFile = firstValueAfter(parsed, ["-oX"]);
    const allOutputBase = firstValueAfter(parsed, ["-oA"]);

    if (normalOutputFile) {
      StateManager.writeFile(session.state, normalOutputFile, `${output.join("\n")}\n`);
    }

    if (xmlOutputFile) {
      const xml = `<nmaprun>${activeTargets.map((target) => `<host><address addr="${target.ip}" /><status state="up" /></host>`).join("")}</nmaprun>\n`;
      StateManager.writeFile(session.state, xmlOutputFile, xml);
    }

    if (allOutputBase) {
      StateManager.writeFile(session.state, `${allOutputBase}.nmap`, `${output.join("\n")}\n`);
      StateManager.writeFile(session.state, `${allOutputBase}.xml`, `<nmaprun>${activeTargets.map((target) => `<host><address addr="${target.ip}" /></host>`).join("")}</nmaprun>\n`);
      StateManager.writeFile(session.state, `${allOutputBase}.gnmap`, `Host: ${activeTargets.map((target) => target.ip).join(" ")}\n`);
    }

    return okResult(output);
  }

  function executeSearchsploit(parsed) {
    const query = parsed.args.join(" ").toLowerCase();
    if (!query) return errorResult("searchsploit: missing search term", "syntax_error");

    const results = {
      "vsftpd 2.3.4": [
        "vsftpd 2.3.4 - Backdoor Command Execution | unix/remote/49757.py",
        "vsftpd 2.3.4 - Metasploit Module           | unix/remote/17491.rb"
      ],
      samba: [
        "Samba 3.0.20 < 3.0.25rc3 - Username map script Command Execution | linux/remote/16320.rb",
        "Samba trans2open overflow                                            | linux/remote/16861.c"
      ]
    };

    const matched = Object.keys(results).find((key) => query.includes(key));
    return okResult(results[matched || "samba"]);
  }

  function executePython(parsed) {
    const targetPath = parsed.args[0];
    if (!targetPath) return errorResult("python: missing script operand", "syntax_error");
    const file = StateManager.readFile(session.state, targetPath);
    if (!file.ok) return errorResult(file.error);

    const printMatches = [...file.content.matchAll(/print\((["'`])(.*?)\1\)/g)].map((match) => match[2]);
    const output = printMatches.length ? printMatches : [`executed ${targetPath}`];
    return okResult(output);
  }

  function resolveServiceFromConnection(target, port) {
    return target.ports.find((entry) => String(entry.port) === String(port));
  }

  function executeNetcat(parsed) {
    if (hasFlag(parsed, "-l")) {
      const port = parsed.args.find((arg) => /^\d+$/.test(arg));
      if (!port) return errorResult("nc: listener requires a port", "syntax_error");

      StateManager.openListener(session.state, {
        port: Number(port),
        protocol: "tcp",
        outputFile: parsed.redirect ? parsed.redirect.path : null
      });

      if (parsed.redirect && parsed.redirect.path) {
        StateManager.writeFile(session.state, parsed.redirect.path, "", false);
      }

      return okResult([
        `listening on [any] ${port} ...`,
        parsed.redirect && parsed.redirect.path ? `listener output redirected to ${parsed.redirect.path}` : null
      ]);
    }

    const [targetValue, port] = parsed.args;
    if (!targetValue || !port) return errorResult("nc: connection requires a target and port", "syntax_error");

    const target = StateManager.findTarget(session.state, targetValue);
    if (!target || !target.reachable) return errorResult(`nc: connect to ${targetValue}:${port} failed`);
    const service = resolveServiceFromConnection(target, port);
    if (!service) return errorResult(`nc: connection to ${target.ip}:${port} refused`);

    if (String(service.port) === "25") {
      session.state.activeConnection = {
        type: "smtp",
        target: target.ip,
        port: service.port,
        stage: "banner"
      };
      return okResult(service.banner || `220 ${target.hostname} ESMTP ready`);
    }

    if (String(service.port) === "4444") {
      session.state.activeConnection = {
        type: "shell",
        target: target.ip,
        port: service.port
      };
      return okResult("Connected to remote shell. Type `exit` to close the session.");
    }

    session.state.activeConnection = {
      type: "raw",
      target: target.ip,
      port: service.port
    };

    return okResult(service.banner || `Connected to ${target.ip}:${service.port}`);
  }

  function executeTelnet(parsed) {
    const [targetValue, port] = parsed.args;
    if (!targetValue || !port) return errorResult("telnet: usage requires target and port", "syntax_error");
    const target = StateManager.findTarget(session.state, targetValue);
    if (!target || !target.reachable) return errorResult(`telnet: unable to connect to ${targetValue}`);
    const service = resolveServiceFromConnection(target, port);
    if (!service) return errorResult(`telnet: connection refused by ${target.ip}:${port}`);

    session.state.activeConnection = {
      type: String(port) === "23" ? "shell" : "raw",
      target: target.ip,
      port: service.port
    };
    return okResult(service.banner || `Connected to ${target.ip}`);
  }

  function executeActiveConnection(parsed) {
    const connection = session.state.activeConnection;
    const raw = parsed.raw;

    if (connection.type === "smtp" && /^QUIT$/i.test(raw)) {
      session.state.activeConnection = null;
      return okResult("221 2.0.0 Bye");
    }

    if (/^exit$/i.test(raw) || /^quit$/i.test(raw)) {
      session.state.activeConnection = null;
      return okResult("connection closed");
    }

    if (connection.type === "smtp") {
      if (/^EHLO\s+/i.test(raw)) {
        connection.stage = "ehlo";
        return okResult([
          "250-metasploitable2 Hello lab.local",
          "250-PIPELINING",
          "250 HELP"
        ]);
      }

      if (/^MAIL FROM:/i.test(raw)) {
        connection.stage = "mail";
        return okResult("250 2.1.0 Ok");
      }

      if (/^RCPT TO:/i.test(raw)) {
        connection.stage = "rcpt";
        return okResult("250 2.1.5 Ok");
      }

      if (/^DATA$/i.test(raw)) {
        connection.stage = "data";
        return okResult("354 End data with <CR><LF>.<CR><LF>");
      }

      return errorResult("SMTP session active. Use SMTP verbs such as EHLO, MAIL FROM, RCPT TO, DATA, or QUIT.", "wrong_context");
    }

    if (connection.type === "shell") {
      return okResult("remote shell command accepted");
    }

    return errorResult("Connection is open, but this command does not apply to the current session.", "wrong_context");
  }

  function executeMetasploit(parsed) {
    const raw = parsed.raw;

    if (/^exit$/i.test(raw)) {
      session.state.metasploit.active = false;
      session.state.metasploit.currentModule = null;
      session.state.metasploit.options = {};
      return okResult("leaving Metasploit");
    }

    if (/^back$/i.test(raw)) {
      session.state.metasploit.currentModule = null;
      session.state.metasploit.options = {};
      return okResult("module context cleared");
    }

    if (/^show options$/i.test(raw)) {
      const moduleName = session.state.metasploit.currentModule || "<no module selected>";
      const options = session.state.metasploit.options;
      return okResult([
        `Module: ${moduleName}`,
        `RHOSTS: ${options.RHOSTS || "<unset>"}`
      ]);
    }

    if (parsed.command === "search") {
      const query = parsed.args.join(" ").toLowerCase();
      if (!query) return errorResult("msf: search requires a term", "syntax_error");
      if (query.includes("vsftpd")) {
        return okResult("exploit/unix/ftp/vsftpd_234_backdoor");
      }
      if (query.includes("samba")) {
        return okResult("exploit/multi/samba/usermap_script");
      }
      return okResult("No results found.");
    }

    if (parsed.command === "use") {
      const moduleName = parsed.args[0];
      if (!moduleName) return errorResult("msf: use requires a module path", "syntax_error");
      session.state.metasploit.currentModule = moduleName;
      return okResult(`module loaded: ${moduleName}`);
    }

    if (parsed.command === "set") {
      const key = (parsed.args[0] || "").toUpperCase();
      const value = parsed.args[1];
      if (!key || !value) return errorResult("msf: set requires an option and value", "syntax_error");
      session.state.metasploit.options[key] = value;
      return okResult(`${key} => ${value}`);
    }

    if (parsed.command === "run" || parsed.command === "exploit") {
      if (!session.state.metasploit.currentModule) {
        return errorResult("msf: no module selected", "wrong_context");
      }

      if (!session.state.metasploit.options.RHOSTS) {
        return errorResult("msf: RHOSTS is not set", "wrong_context");
      }

      session.state.activeConnection = {
        type: "shell",
        target: session.state.metasploit.options.RHOSTS,
        port: 6200
      };
      return okResult([
        "[*] Exploit completed, but no session was created.",
        "[*] Command shell session 1 opened."
      ]);
    }

    return errorResult("Metasploit command not supported in this training build.", "invalid_command");
  }

  function executeMsfconsole() {
    session.state.metasploit.active = true;
    session.state.metasploit.currentModule = null;
    session.state.metasploit.options = {};
    return okResult([
      "Metasploit Framework 6.0",
      "Type `search`, `use`, `set`, `run`, `show options`, or `exit`."
    ]);
  }

  function executeCommand(parsed, pipedInput = []) {
    if (!parsed.command) return okResult([]);

    if (session.state.activeConnection) {
      return executeActiveConnection(parsed);
    }

    if (session.state.metasploit.active && parsed.command !== "msfconsole") {
      return executeMetasploit(parsed);
    }

    switch (parsed.command) {
      case "pwd":
        return executePwd(parsed);
      case "ls":
        return executeLs(parsed);
      case "dir":
        return executeDir(parsed);
      case "cd":
        return executeCd(parsed);
      case "mkdir":
        return executeMkdir(parsed);
      case "touch":
        return executeTouch(parsed);
      case "cat":
        return executeCat(parsed);
      case "type":
        return executeType(parsed);
      case "echo":
        return executeEcho(parsed);
      case "grep":
        return executeGrep(parsed, pipedInput);
      case "findstr":
        return executeFindstr(parsed, pipedInput);
      case "cp":
        return executeCp(parsed);
      case "mv":
        return executeMv(parsed);
      case "rm":
        return executeRm(parsed);
      case "tar":
        return executeTar(parsed);
      case "wget":
        return executeWget(parsed);
      case "ps":
        return executePs(parsed);
      case "tasklist":
        return executeTasklist(parsed);
      case "kill":
        return executeKill(parsed);
      case "taskkill":
        return executeTaskkill(parsed);
      case "ping":
        return executePing(parsed);
      case "nmap":
        return executeNmap(parsed);
      case "searchsploit":
        return executeSearchsploit(parsed);
      case "python":
        return executePython(parsed);
      case "nc":
        return executeNetcat(parsed);
      case "telnet":
        return executeTelnet(parsed);
      case "msfconsole":
        return executeMsfconsole(parsed);
      default:
        return errorResult(`${parsed.command}: command not found`, "invalid_command");
    }
  }

  function inferGenericPartial(step, execution) {
    const objective = step.objective.toLowerCase();
    const command = execution.primary.command;
    const flags = execution.primary.flagsExpanded || [];

    if (command === "nmap") {
      if (/version/.test(objective) && !flags.includes("-sV")) {
        return {
          classification: "inefficient",
          feedback: "Close, but this scan still needs service version detection.",
          coach: "You are in the right tool family. Add the flag that makes Nmap identify the service version."
        };
      }

      if ((/\bos\b/.test(objective) || /operating system/.test(objective)) && !flags.includes("-O")) {
        return {
          classification: "inefficient",
          feedback: "Close, but this does not collect OS evidence yet.",
          coach: "Keep the scan, but add the operating system fingerprinting flag."
        };
      }

      if (/port\s+\d+/.test(objective) && !flags.includes("-p")) {
        return {
          classification: "inefficient",
          feedback: "Close, but the task calls for a targeted port check.",
          coach: "Stay with Nmap, but narrow the scan to the specific port the task mentions."
        };
      }
    }

    if (command === "nc") {
      if (/listener/.test(objective) && !flags.includes("-l")) {
        return {
          classification: "inefficient",
          feedback: "Close, but this task needs a listening socket, not an outbound connection.",
          coach: "Netcat is the right tool. Switch it into listener mode and bind to the requested port."
        };
      }

      if (/connect/.test(objective) && flags.includes("-l")) {
        return {
          classification: "inefficient",
          feedback: "Close, but this step is about connecting to the service, not waiting for it.",
          coach: "Keep Netcat, but remove the listener flags and point it at the target service."
        };
      }
    }

    if ((command === "ps" || command === "tasklist") && /(kill|terminate|stop)/.test(objective)) {
      return {
        classification: "inefficient",
        feedback: "You gathered context, but the task now requires action.",
        coach: "Use the process list you already have and move to the command that actually stops the process."
      };
    }

    if ((command === "cat" || command === "type") && /filter|isolate/.test(objective)) {
      return {
        classification: "inefficient",
        feedback: "Reading the file is useful, but the current task is to narrow the output.",
        coach: "Use the appropriate text filter now so the signal stands out from the full file."
      };
    }

    return null;
  }

  function executeInput(rawInput) {
    const parsedInput = parseInput(rawInput);
    if (!parsedInput.primary) {
      return {
        raw: rawInput,
        primary: { command: "", flagsExpanded: [], args: [] },
        pipelineCommands: [],
        mode: shellLabel(),
        status: "ok",
        stdout: [],
        stderr: []
      };
    }

    let pipeData = [];
    let result = okResult([]);

    for (let index = 0; index < parsedInput.pipeline.length; index += 1) {
      const parsed = parsedInput.pipeline[index];
      result = executeCommand(parsed, pipeData);
      if (result.status !== "ok") break;
      pipeData = result.stdout;
    }

    const finalSegment = parsedInput.pipeline[parsedInput.pipeline.length - 1];
    if (result.status === "ok" && finalSegment.redirect && finalSegment.redirect.path && finalSegment.command !== "echo" && finalSegment.command !== "nc") {
      const written = StateManager.writeFile(
        session.state,
        finalSegment.redirect.path,
        `${result.stdout.join("\n")}\n`,
        finalSegment.redirect.append
      );
      if (!written.ok) {
        result = errorResult(written.error);
      } else {
        result.stdout = [`saved output to ${finalSegment.redirect.path}`];
      }
    }

    return {
      raw: rawInput,
      primary: parsedInput.primary,
      command: parsedInput.primary,
      pipelineCommands: parsedInput.pipelineCommands,
      mode: shellLabel(),
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr
    };
  }

  function presentExecution(execution) {
    if (execution.stdout.length) {
      printLines(execution.stdout, "system");
    }

    if (execution.stderr.length) {
      printLines(execution.stderr, "error");
    }
  }

  function evaluateCurrentStep(execution) {
    const step = currentStep();
    session.attemptsForStep += 1;

    const evaluation = CoachEngine.evaluateAttempt(
      step,
      execution,
      session.state,
      session.attemptsForStep
    );

    if (!evaluation.success) {
      const genericPartial = inferGenericPartial(step, execution);
      if (genericPartial) {
        evaluation.classification = genericPartial.classification;
        evaluation.feedback = genericPartial.feedback;
        evaluation.coach = genericPartial.coach;
      }
    }

    if (evaluation.success) {
      printLine(evaluation.feedback, "success");
      printLine(evaluation.coach, "coach");
      advanceStep();
      return;
    }

    session.hintLevel = Math.max(session.hintLevel, CoachEngine.getHintTierFromAttempts(session.attemptsForStep));
    printLine(evaluation.feedback, evaluation.classification === "invalid_command" ? "error" : "coach");
    printLine(evaluation.coach, "dim");
    if (evaluation.hint) {
      printLine(`Hint: ${evaluation.hint}`, "coach");
    }
    renderPanel();
  }

  function runSubmittedCommand(event) {
    event.preventDefault();
    const rawInput = els.terminalInput.value.trim();
    if (!rawInput) return;

    printLine(`${StateManager.getPrompt(session.state)} ${rawInput}`, "command");
    pushHistory(rawInput);
    els.terminalInput.value = "";

    const execution = executeInput(rawInput);
    presentExecution(execution);
    updatePrompt();

    if (!session.scenarioCompleted) {
      evaluateCurrentStep(execution);
    }

    renderPanel();
  }

  function showHint() {
    if (session.scenarioCompleted) {
      printLine("This scenario is already complete. Move on or reset it for a cleaner run.", "coach");
      return;
    }

    session.hintLevel = Math.min(2, session.hintLevel + 1);
    const hint = CoachEngine.getHint(currentStep(), session.hintLevel);
    printLine(`Hint ${session.hintLevel + 1}: ${hint}`, "coach");
    renderPanel();
  }

  function resetScenario() {
    loadScenario(session.scenarioIndex);
  }

  function nextScenario() {
    loadScenario(session.scenarioIndex + 1);
  }

  function bindEvents() {
    els.terminalForm.addEventListener("submit", runSubmittedCommand);
    els.hintBtn.addEventListener("click", showHint);
    els.resetScenarioBtn.addEventListener("click", resetScenario);
    els.nextScenarioBtn.addEventListener("click", nextScenario);

    els.terminalInput.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        recallHistory(-1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        recallHistory(1);
      }
    });
  }

  bindEvents();
  loadScenario(0);
})();
