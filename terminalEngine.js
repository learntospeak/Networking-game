(function () {
  const { StateManager, CoachEngine, ScenarioEngine, CommandsData } = window;
  const NetlabApp = window.NetlabApp;
  const pageConfig = window.TerminalCoachConfig || {};

  if (!StateManager || !CoachEngine || !ScenarioEngine) {
    return;
  }

  const els = {
    terminalShell: document.querySelector(".terminal-shell"),
    terminalLayout: document.querySelector(".terminal-layout"),
    terminalPanel: document.querySelector(".terminal-panel"),
    terminalMobileDock: document.querySelector(".terminal-mobile-dock"),
    pageKicker: document.getElementById("terminalPageKicker"),
    pageTitle: document.getElementById("terminalPageTitle"),
    pageIntro: document.getElementById("terminalPageIntro"),
    appSectionShell: document.getElementById("appSectionShell"),
    linuxTrackLink: document.getElementById("linuxTrackLink"),
    windowsTrackLink: document.getElementById("windowsTrackLink"),
    ciscoTrackLink: document.getElementById("ciscoTrackLink"),
    challengeTrackLink: document.getElementById("challengeTrackLink"),
    scenarioCountBadge: document.getElementById("scenarioCountBadge"),
    stepCountBadge: document.getElementById("stepCountBadge"),
    environmentBadge: document.getElementById("environmentBadge"),
    shellBadge: document.getElementById("shellBadge"),
    currentLayerBadge: document.getElementById("currentLayerBadge"),
    scenarioCategory: document.getElementById("scenarioCategory"),
    scenarioTitle: document.getElementById("scenarioTitle"),
    scenarioLevel: document.getElementById("scenarioLevel"),
    scenarioEnvironmentBadge: document.getElementById("scenarioEnvironmentBadge"),
    scenarioObjective: document.getElementById("scenarioObjective"),
    scenarioFlex: document.getElementById("scenarioFlex"),
    environmentSummary: document.getElementById("environmentSummary"),
    machineContextList: document.getElementById("machineContextList") || document.getElementById("challengeContextList"),
    stepObjective: document.getElementById("stepObjective"),
    coachSignal: document.getElementById("coachSignal"),
    hintLadder: document.getElementById("hintLadder"),
    progressSummary: document.getElementById("progressSummary"),
    layerTransitionBanner: document.getElementById("layerTransitionBanner"),
    mobileEnvironmentBadge: document.getElementById("mobileEnvironmentBadge"),
    mobileLayerBadge: document.getElementById("mobileLayerBadge"),
    mobileScenarioTitle: document.getElementById("mobileScenarioTitle"),
    mobileStepObjective: document.getElementById("mobileStepObjective"),
    mobileMachineContext: document.getElementById("mobileMachineContext"),
    mobileCoachSignal: document.getElementById("mobileCoachSignal"),
    mobileContextToggleBtn: document.getElementById("mobileContextToggleBtn"),
    terminalOutput: document.getElementById("terminalOutput"),
    terminalJumpTopBtn: document.getElementById("terminalJumpTopBtn"),
    terminalJumpLatestBtn: document.getElementById("terminalJumpLatestBtn"),
    terminalInlineInputSlot: document.getElementById("terminalInlineInputSlot"),
    terminalDockInputMount: document.getElementById("terminalDockInputMount"),
    terminalForm: document.getElementById("terminalForm"),
    terminalPrompt: document.getElementById("terminalPrompt"),
    terminalInput: document.getElementById("terminalInput"),
    hintBtn: document.getElementById("hintBtn"),
    previousScenarioBtn: document.getElementById("previousScenarioBtn"),
    resetScenarioBtn: document.getElementById("resetScenarioBtn"),
    nextScenarioBtn: document.getElementById("nextScenarioBtn")
  };

  const session = {
    scenarioIndex: 0,
    scenarios: [],
    stepIndex: 0,
    state: null,
    completedScenarioIds: new Set(),
    attemptsForStep: 0,
    hintLevel: -1,
    commandHistory: [],
    historyIndex: 0,
    scenarioCompleted: false,
    scenarioStarted: false,
    currentLayer: null,
    layerTransitionTimer: null,
    mobileViewportRaf: 0,
    mobileDockRaf: 0,
    mobileRevealRaf: 0,
    mobileRevealTimer: 0,
    mobileBlurTimer: 0,
    mobileStableViewportHeight: 0,
    mobileLayoutLocked: false,
    mobileContextCollapsed: false,
    terminalEntries: [],
    resumePromptVisible: false,
    outputPinnedToLatest: true
  };
  let savedProgressRecord = null;

  function cancelScheduledFrame(id) {
    if (id) {
      window.cancelAnimationFrame(id);
    }
    return 0;
  }

  function cancelScheduledTimeout(id) {
    if (id) {
      window.clearTimeout(id);
    }
    return 0;
  }

  function isMobileTerminalLayout() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function usesInlineMobileInput() {
    return false;
  }

  function isCiscoState() {
    return typeof StateManager.isCiscoState === "function" && StateManager.isCiscoState(session.state);
  }

  function syncTerminalInputPlacement() {
    const inlineMobileInput = usesInlineMobileInput();
    document.body.classList.toggle("terminal-mobile-inline-input", inlineMobileInput);

    if (!els.terminalForm) {
      return;
    }

    const target = inlineMobileInput ? els.terminalInlineInputSlot : els.terminalDockInputMount;
    if (target && els.terminalForm.parentElement !== target) {
      target.appendChild(els.terminalForm);
    }
  }

  function mobileViewportMetrics() {
    const visualViewport = window.visualViewport;
    const layoutHeight = Math.max(window.innerHeight || 0, document.documentElement?.clientHeight || 0);

    if (!visualViewport) {
      return {
        visibleHeight: layoutHeight,
        keyboardOffset: 0,
        offsetTop: 0
      };
    }

    return {
      visibleHeight: Math.round(visualViewport.height),
      keyboardOffset: Math.max(0, Math.round(layoutHeight - (visualViewport.height + visualViewport.offsetTop))),
      offsetTop: Math.max(0, Math.round(visualViewport.offsetTop || 0))
    };
  }

  function syncMobileInputState(active) {
    if (!isMobileTerminalLayout()) {
      document.body.classList.remove("terminal-mobile-active", "terminal-mobile-keyboard-open", "terminal-mobile-context-collapsed", "terminal-mobile-inline-input");
      session.mobileLayoutLocked = false;
      return;
    }

    if (active) {
      session.mobileLayoutLocked = true;
    }

    const layoutActive = session.mobileLayoutLocked || Boolean(active);

    document.body.classList.toggle("terminal-mobile-active", layoutActive);
    document.body.classList.toggle("terminal-mobile-context-collapsed", layoutActive && session.mobileContextCollapsed);
    if (!active) {
      document.body.classList.remove("terminal-mobile-keyboard-open");
    }
  }

  function measureTerminalDockSpace() {
    session.mobileDockRaf = cancelScheduledFrame(session.mobileDockRaf);

    if (!isMobileTerminalLayout() || !els.terminalMobileDock || usesInlineMobileInput()) {
      document.body.style.setProperty("--terminal-mobile-dock-space", "0px");
      return;
    }

    if (document.body.classList.contains("terminal-mobile-active")) {
      document.body.style.setProperty("--terminal-mobile-dock-space", "0px");
      return;
    }

    session.mobileDockRaf = window.requestAnimationFrame(() => {
      session.mobileDockRaf = 0;
      const dockHeight = Math.ceil(els.terminalMobileDock.getBoundingClientRect().height || 0);
      const { keyboardOffset } = mobileViewportMetrics();
      const reservedSpace = Math.max(0, dockHeight + keyboardOffset + 18);
      document.body.style.setProperty("--terminal-mobile-dock-space", `${reservedSpace}px`);
    });
  }

  function syncMobileViewportMetrics() {
    session.mobileViewportRaf = cancelScheduledFrame(session.mobileViewportRaf);
    syncTerminalInputPlacement();
    const inputActive = document.activeElement === els.terminalInput;
    syncMobileInputState(inputActive);

    if (!isMobileTerminalLayout()) {
      document.body.classList.remove("terminal-mobile-active", "terminal-mobile-keyboard-open");
      document.body.style.removeProperty("--terminal-mobile-viewport-height");
      document.body.style.removeProperty("--terminal-visual-keyboard-offset");
      document.body.style.removeProperty("--terminal-mobile-dock-space");
      session.mobileStableViewportHeight = 0;
      return;
    }

    session.mobileViewportRaf = window.requestAnimationFrame(() => {
      session.mobileViewportRaf = 0;
      // visualViewport gives the keyboard-safe visible area on Android/iOS, but we keep the terminal in one stable layout
      // once the learner starts using it so browser chrome changes do not keep reflowing the page.
      const { visibleHeight, keyboardOffset } = mobileViewportMetrics();
      const activeInput = document.activeElement === els.terminalInput;
      // Mobile browser chrome also changes the visual viewport while scrolling.
      // Treat only a larger viewport loss as a real keyboard-open state so the terminal does not keep shrinking and expanding.
      const keyboardOpen = activeInput && keyboardOffset > 120;

      if (
        !session.mobileStableViewportHeight
        || visibleHeight > session.mobileStableViewportHeight
        || visibleHeight < session.mobileStableViewportHeight * 0.75
      ) {
        session.mobileStableViewportHeight = visibleHeight;
      }

      const stableViewportHeight = keyboardOpen
        ? visibleHeight
        : (session.mobileStableViewportHeight || visibleHeight);

      document.body.style.setProperty("--terminal-mobile-viewport-height", `${stableViewportHeight}px`);
      document.body.style.setProperty("--terminal-visual-keyboard-offset", "0px");
      document.body.classList.toggle("terminal-mobile-keyboard-open", keyboardOpen);
      syncMobileInputState(activeInput);
      measureTerminalDockSpace();
    });
  }

  function revealActiveTerminalInput() {
    if (!isMobileTerminalLayout() || !els.terminalInput || document.activeElement !== els.terminalInput) {
      return;
    }

    const focusTarget = els.terminalForm || els.terminalInput;

    // Keep the terminal feed stable while the learner reviews history, but still follow the latest output when they are already at the end.
    if (session.outputPinnedToLatest) {
      scrollTerminal(true);
    }
    syncMobileViewportMetrics();

    if (els.terminalMobileDock && document.body.classList.contains("terminal-mobile-active")) {
      els.terminalMobileDock.scrollTop = els.terminalMobileDock.scrollHeight;
    }

    if (focusTarget && typeof focusTarget.scrollIntoView === "function") {
      // Keep scrolling inside the terminal container instead of moving the page viewport.
      focusTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    }
  }

  function setMobileContextCollapsed(collapsed) {
    session.mobileContextCollapsed = Boolean(collapsed);
    document.body.classList.toggle("terminal-mobile-context-collapsed", session.mobileContextCollapsed);

    if (els.mobileContextToggleBtn) {
      els.mobileContextToggleBtn.textContent = session.mobileContextCollapsed ? "Show Context" : "Hide Context";
      els.mobileContextToggleBtn.setAttribute("aria-expanded", String(!session.mobileContextCollapsed));
    }

    // The compact dock changes the reserved terminal space, so recalculate before the next mobile reveal.
    measureTerminalDockSpace();
  }

  function scheduleMobileTerminalReveal(delay = 72) {
    session.mobileRevealRaf = cancelScheduledFrame(session.mobileRevealRaf);
    session.mobileRevealTimer = cancelScheduledTimeout(session.mobileRevealTimer);

    if (!isMobileTerminalLayout()) {
      return;
    }

    const runReveal = () => {
      session.mobileRevealRaf = window.requestAnimationFrame(() => {
        session.mobileRevealRaf = 0;
        revealActiveTerminalInput();
      });
    };

    if (delay <= 0) {
      runReveal();
      return;
    }

    session.mobileRevealTimer = window.setTimeout(() => {
      session.mobileRevealTimer = 0;
      runReveal();
    }, delay);
  }

  function configuredScenarioPool() {
    const source = Array.isArray(ScenarioEngine.scenarios) ? ScenarioEngine.scenarios : [];
    let filtered = source;

    if (typeof pageConfig.scenarioFilter === "function") {
      filtered = source.filter((scenario) => pageConfig.scenarioFilter(scenario));
    } else if (pageConfig.mode === "challenge") {
      filtered = source.filter((scenario) => scenario.mode === "challenge");
    }

    return filtered.length ? filtered : source;
  }

  session.scenarios = configuredScenarioPool();

  function currentSectionId() {
    if (pageConfig.sectionId) {
      return pageConfig.sectionId;
    }

    if (pageConfig.mode === "challenge") {
      return "cyber-challenge";
    }

    if (pageConfig.environmentCategory === "windows") {
      return "windows-terminal";
    }

    if (pageConfig.environmentCategory === "cisco") {
      return "cisco-cli";
    }

    return "linux-terminal";
  }

  function sectionLabel() {
    return pageConfig.pageKicker || pageConfig.pageTitle || scenarioEnvironmentLabel(currentScenario());
  }

  function currentScenario() {
    return session.scenarios[session.scenarioIndex];
  }

  function currentStep() {
    return currentScenario().steps[session.stepIndex];
  }

  function totalScenarios() {
    return session.scenarios.length;
  }

  function scenarioUsesChallengePresentation(scenario = currentScenario()) {
    return Boolean(pageConfig.mode === "challenge" || scenario?.mode === "challenge" || scenario?.hiddenSteps);
  }

  function scenarioEnvironmentCategory(scenario = currentScenario()) {
    if (scenario?.environmentCategory) {
      return scenario.environmentCategory;
    }

    if (pageConfig.environmentCategory) {
      return pageConfig.environmentCategory;
    }

    if (scenarioUsesChallengePresentation(scenario)) {
      return "cyber";
    }

    if (scenario?.shell === "cmd") return "windows";
    if (scenario?.shell === "cisco") return "cisco";
    return "linux";
  }

  function scenarioEnvironmentLabel(scenario = currentScenario()) {
    if (scenario?.environmentLabel) {
      return scenario.environmentLabel;
    }

    const category = scenarioEnvironmentCategory(scenario);
    if (category === "windows") return "Windows Terminal Learning";
    if (category === "cisco") return "Cisco CLI Lab";
    if (category === "cyber") return "Cyber Challenge Mode";
    return "Linux Terminal Learning";
  }

  function scenarioMachineContexts(scenario = currentScenario()) {
    return Array.isArray(scenario?.machineContexts) ? scenario.machineContexts : [];
  }

  function formatMachineContext(context) {
    return [context?.label, context?.role, context?.detail].filter(Boolean).join(" | ");
  }

  function machineContextSummary(scenario = currentScenario()) {
    const contexts = scenarioMachineContexts(scenario);
    if (!contexts.length) return "";

    return contexts.map(formatMachineContext).join(" || ");
  }

  function primaryMachineContextText(scenario = currentScenario()) {
    return formatMachineContext(scenarioMachineContexts(scenario)[0] || {});
  }

  function environmentSummaryText(scenario = currentScenario()) {
    const label = scenarioEnvironmentLabel(scenario);

    if (scenarioEnvironmentCategory(scenario) === "cyber") {
      return `${label} keeps command input on the Analyst Box. Remote machines and application evidence are listed separately so the active shell stays obvious.`;
    }

    if (scenarioEnvironmentCategory(scenario) === "cisco") {
      return `${label} keeps you inside Cisco exec and configuration modes so router prompts, interface context, and routing changes stay explicit.`;
    }

    const shellText = scenario?.shell === "cmd" ? "Windows CMD" : "Linux terminal";
    return `${label} keeps commands inside one ${shellText} unless the lesson explicitly says otherwise.`;
  }

  function hintContextLabel(scenario = currentScenario()) {
    return scenarioMachineContexts(scenario)[0]?.label || scenarioEnvironmentLabel(scenario);
  }

  function syncTrackLinks(activeCategory) {
    [
      [els.linuxTrackLink, activeCategory === "linux"],
      [els.windowsTrackLink, activeCategory === "windows"],
      [els.ciscoTrackLink, activeCategory === "cisco"],
      [els.challengeTrackLink, activeCategory === "cyber"]
    ].forEach(([element, active]) => {
      if (!element) return;
      element.classList.toggle("is-active", active);
      element.setAttribute("aria-current", active ? "page" : "false");
    });
  }

  function syncPageIdentity(scenario = currentScenario()) {
    const activeCategory = scenarioEnvironmentCategory(scenario);

    document.body.dataset.environmentCategory = activeCategory;
    syncTrackLinks(activeCategory);

    if (els.pageKicker && pageConfig.pageKicker) {
      els.pageKicker.textContent = pageConfig.pageKicker;
    }

    if (els.pageTitle && pageConfig.pageTitle) {
      els.pageTitle.textContent = pageConfig.pageTitle;
    }

    if (els.pageIntro && pageConfig.pageIntro) {
      els.pageIntro.textContent = pageConfig.pageIntro;
    }
  }

  function renderMachineContexts(scenario = currentScenario()) {
    if (!els.machineContextList) return;

    const contexts = scenarioMachineContexts(scenario);
    els.machineContextList.innerHTML = "";

    contexts.forEach((context) => {
      const li = document.createElement("li");
      li.className = "machine-context-item";

      const title = document.createElement("strong");
      title.className = "machine-context-label";
      title.textContent = context.label || "Machine Context";
      li.appendChild(title);

      const metaText = [context.role, context.detail].filter(Boolean).join(" | ");
      if (metaText) {
        const meta = document.createElement("span");
        meta.className = "machine-context-meta";
        meta.textContent = metaText;
        li.appendChild(meta);
      }

      els.machineContextList.appendChild(li);
    });
  }

  function scenarioObjectiveText(scenario = currentScenario()) {
    if (scenarioUsesChallengePresentation(scenario)) {
      return scenario.challengeObjective || scenario.objective;
    }

    return scenario.objective;
  }

  function challengeTaskText(scenario = currentScenario()) {
    return pageConfig.challengeTaskText
      || scenario.challengeTaskText
      || "Investigate the environment, reason from the evidence, and decide the next move.";
  }

  function scenarioLayerList(scenario = currentScenario()) {
    if (Array.isArray(scenario?.layers) && scenario.layers.length) {
      return scenario.layers;
    }

    return [scenario?.layer || "application"];
  }

  function scenarioLayerText(scenario = currentScenario()) {
    return scenarioLayerList(scenario).map((layer) => String(layer || "").toUpperCase()).join(" + ");
  }

  function scenarioKnownTargets(scenario = currentScenario()) {
    const targets = Array.isArray(scenario?.environment?.targets) ? scenario.environment.targets : [];
    const unique = [];
    const seen = new Set();

    targets.forEach((target) => {
      if (!target || !target.ip) return;
      const label = target.hostname
        ? `${target.hostname} (${target.ip})`
        : target.ip;

      if (seen.has(label)) return;
      seen.add(label);
      unique.push(label);
    });

    return unique;
  }

  function allowedApproachText(scenario = currentScenario()) {
    if (scenarioUsesChallengePresentation(scenario) && Array.isArray(scenario.allowedApproaches) && scenario.allowedApproaches.length) {
      return `Allowed approaches: ${scenario.allowedApproaches.join(" | ")}`;
    }

    return `Allowed flexibility: ${scenario.allowedFlexibility || "Use any valid workflow that reaches the objective."}`;
  }

  function getCommandReference(rawInput) {
    if (!CommandsData || typeof CommandsData.lookupForInput !== "function") {
      return null;
    }

    if (isCiscoState()) {
      const reference = CommandsData.lookupForInput(rawInput, ["Cisco CLI"]);
      return reference?.category === "Cisco CLI" ? reference : null;
    }

    const windowsShell = StateManager.isWindowsState(session.state);
    const preferredCategories = windowsShell
      ? ["Windows CMD"]
      : ["Linux", "Nmap", "Netcat", "Metasploit"];
    const reference = CommandsData.lookupForInput(rawInput, preferredCategories);
    if (!reference) return null;

    if (windowsShell && reference.category === "Linux") {
      return null;
    }

    if (!windowsShell && reference.category === "Windows CMD") {
      return null;
    }

    return reference;
  }

  function terminalDistanceFromLatest() {
    if (!els.terminalOutput) {
      return 0;
    }

    return Math.max(0, els.terminalOutput.scrollHeight - els.terminalOutput.clientHeight - els.terminalOutput.scrollTop);
  }

  function syncTerminalHistoryState(forcePinned = null) {
    if (!els.terminalOutput) {
      return;
    }

    if (forcePinned === true) {
      session.outputPinnedToLatest = true;
    } else if (forcePinned === false) {
      session.outputPinnedToLatest = false;
    } else {
      session.outputPinnedToLatest = terminalDistanceFromLatest() <= 56;
    }

    if (els.terminalJumpTopBtn) {
      els.terminalJumpTopBtn.disabled = els.terminalOutput.scrollTop <= 6;
    }

    if (els.terminalJumpLatestBtn) {
      els.terminalJumpLatestBtn.disabled = session.outputPinnedToLatest;
    }
  }

  function scrollTerminal(force = false) {
    if (!els.terminalOutput) return;

    if (!force && !session.outputPinnedToLatest) {
      syncTerminalHistoryState();
      return;
    }

    els.terminalOutput.scrollTop = els.terminalOutput.scrollHeight;
    syncTerminalHistoryState(true);
  }

  function jumpTerminalHistoryTop() {
    if (!els.terminalOutput) {
      return;
    }

    syncTerminalHistoryState(false);
    els.terminalOutput.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpTerminalHistoryLatest() {
    if (!els.terminalOutput) {
      return;
    }

    syncTerminalHistoryState(true);
    els.terminalOutput.scrollTo({ top: els.terminalOutput.scrollHeight, behavior: "smooth" });
    if (document.activeElement === els.terminalInput) {
      scheduleMobileTerminalReveal(0);
    }
  }

  function appendTerminalNode(node) {
    if (!els.terminalOutput) return;
    els.terminalOutput.appendChild(node);
  }

  function recordTerminalEntry(text, type) {
    session.terminalEntries.push({
      text: String(text),
      type: type
    });
  }

  function focusTerminalInputAtEnd() {
    if (!els.terminalInput) return;
    const valueLength = els.terminalInput.value.length;
    scrollTerminal(true);
    syncMobileInputState(true);
    els.terminalInput.focus({ preventScroll: true });
    if (typeof els.terminalInput.setSelectionRange === "function") {
      els.terminalInput.setSelectionRange(valueLength, valueLength);
    }
    scheduleMobileTerminalReveal(0);
  }

  function shouldIgnoreTerminalTap(target) {
    return Boolean(target?.closest("button, a, input, textarea, select, label"));
  }

  function printLine(text, type = "system") {
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = text;
    recordTerminalEntry(text, type);
    appendTerminalNode(line);
    scrollTerminal();
  }

  function printLines(lines, type = "system") {
    const values = Array.isArray(lines) ? lines : [lines];
    values.forEach((value) => {
      if (value === null || value === undefined || value === "") return;
      printLine(String(value), type);
    });
  }

  function clearTerminal(resetEntries = true) {
    els.terminalOutput.innerHTML = "";
    if (resetEntries) {
      session.terminalEntries = [];
    }
    syncTerminalHistoryState(true);
  }

  function restoreTerminalEntries(entries) {
    clearTerminal(false);
    session.terminalEntries = [];

    (entries || []).forEach((entry) => {
      if (!entry || entry.text === undefined || entry.text === null) {
        return;
      }

      const line = document.createElement("div");
      line.className = `terminal-line ${entry.type || "system"}`;
      line.textContent = String(entry.text);
      session.terminalEntries.push({
        text: String(entry.text),
        type: entry.type || "system"
      });
      appendTerminalNode(line);
    });

    scrollTerminal(true);
  }

  function getLayerLabel(layer = session.currentLayer) {
    return String(layer || "application").toUpperCase();
  }

  function getPromptLabel() {
    return `[${getLayerLabel()}] ${StateManager.getPrompt(session.state)}`;
  }

  function syncLayerElement(element, layer, text) {
    if (!element) return;
    element.dataset.layer = layer;
    if (text !== undefined) {
      element.textContent = text;
    }
  }

  function setCurrentLayer(layer) {
    const normalizedLayer = ["network", "application", "exploitation"].includes(layer) ? layer : "application";
    session.currentLayer = normalizedLayer;
    if (session.state) {
      session.state.currentLayer = normalizedLayer;
    }
    document.body.dataset.layer = normalizedLayer;

    syncLayerElement(els.currentLayerBadge, normalizedLayer, `${getLayerLabel(normalizedLayer)} Layer`);
    syncLayerElement(els.mobileLayerBadge, normalizedLayer, `Layer: ${getLayerLabel(normalizedLayer)}`);
    syncLayerElement(els.layerTransitionBanner, normalizedLayer);
  }

  function syncScenarioLayerBadges(scenario) {
    const layers = scenarioLayerText(scenario);
    const primaryLayer = scenarioLayerList(scenario)[0] || scenario.layer || "application";

    syncLayerElement(
      els.currentLayerBadge,
      primaryLayer,
      `${layers} ${scenarioLayerList(scenario).length > 1 ? "Layers" : "Layer"}`
    );
    syncLayerElement(els.mobileLayerBadge, primaryLayer, `Layer: ${layers}`);
  }

  function showLayerTransition(previousLayer, nextLayer) {
    if (!els.layerTransitionBanner) return;

    if (session.layerTransitionTimer) {
      window.clearTimeout(session.layerTransitionTimer);
      session.layerTransitionTimer = null;
    }

    if (!previousLayer || previousLayer === nextLayer) {
      els.layerTransitionBanner.hidden = true;
      els.layerTransitionBanner.textContent = "";
      return;
    }

    syncLayerElement(
      els.layerTransitionBanner,
      nextLayer,
      `Transitioning from ${getLayerLabel(previousLayer)} -> ${getLayerLabel(nextLayer)} layer`
    );
    els.layerTransitionBanner.hidden = false;
    session.layerTransitionTimer = window.setTimeout(() => {
      els.layerTransitionBanner.hidden = true;
    }, 2200);
  }

  function updatePrompt() {
    els.terminalPrompt.textContent = getPromptLabel();
  }

  function shellLabel() {
    if (session.state.metasploit.active) return "Metasploit";
    if (session.state.activeConnection) {
      if (session.state.activeConnection.type === "smtp") return "SMTP Session";
      if (session.state.activeConnection.type === "shell") return "Remote Shell";
      return "Connection";
    }

    if (isCiscoState()) return "Cisco IOS CLI";
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
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const environmentLabel = scenarioEnvironmentLabel(scenario);

    els.scenarioCountBadge.textContent = challengePresentation
      ? `Challenge ${session.scenarioIndex + 1} / ${totalScenarios()}`
      : `Scenario ${session.scenarioIndex + 1} / ${totalScenarios()}`;
    els.stepCountBadge.textContent = challengePresentation
      ? "Challenge Active"
      : `Task ${session.stepIndex + 1} / ${scenario.steps.length}`;
    if (els.environmentBadge) {
      els.environmentBadge.textContent = environmentLabel;
    }
    els.shellBadge.textContent = shellLabel();
    setCurrentLayer(scenario.layer || "application");
    syncScenarioLayerBadges(scenario);
    syncPageIdentity(scenario);

    els.scenarioCategory.textContent = scenario.category;
    els.scenarioTitle.textContent = scenario.title;
    els.scenarioLevel.textContent = challengePresentation ? (scenario.difficulty || scenario.level) : scenario.level;
    if (els.scenarioEnvironmentBadge) {
      els.scenarioEnvironmentBadge.textContent = environmentLabel;
    }
    els.scenarioObjective.textContent = scenarioObjectiveText(scenario);
    els.scenarioFlex.textContent = allowedApproachText(scenario);
    if (els.environmentSummary) {
      els.environmentSummary.textContent = environmentSummaryText(scenario);
    }
    renderMachineContexts(scenario);
    els.stepObjective.textContent = challengePresentation ? challengeTaskText(scenario) : step.objective;
    els.progressSummary.textContent = `${session.completedScenarioIds.size} ${challengePresentation ? "challenges" : "scenarios"} completed in this session.`;
    if (els.mobileEnvironmentBadge) {
      els.mobileEnvironmentBadge.textContent = environmentLabel;
    }
    els.mobileScenarioTitle.textContent = challengePresentation
      ? `${scenario.title} - Challenge ${session.scenarioIndex + 1}/${totalScenarios()}`
      : `${scenario.title} - Task ${session.stepIndex + 1}/${scenario.steps.length}`;
    els.mobileStepObjective.textContent = challengePresentation ? challengeTaskText(scenario) : step.objective;
    if (els.mobileMachineContext) {
      els.mobileMachineContext.textContent = primaryMachineContextText(scenario);
    }

    if (session.scenarioCompleted) {
      els.coachSignal.textContent = "Scenario complete. Move to the next scenario or reset this one and run it cleaner.";
    } else if (challengePresentation && session.attemptsForStep > 0) {
      els.coachSignal.textContent = "Minimal guidance is active. Use the evidence you already created before widening the workflow.";
    } else if (challengePresentation) {
      els.coachSignal.textContent = pageConfig.challengeIntroSignal || "Minimal guidance is active. Investigate, reason, and decide your own next move.";
    } else if (session.attemptsForStep > 0) {
      els.coachSignal.textContent = "Stay on the current objective. Use the output you already produced before you widen the workflow.";
    } else if (step.context) {
      els.coachSignal.textContent = step.context;
    } else {
      els.coachSignal.textContent = "Work from evidence. Good operators confirm context before they act.";
    }

    els.mobileCoachSignal.textContent = els.coachSignal.textContent;

    renderHintLadder();
    updatePrompt();
    renderSectionShell();
    if (document.activeElement === els.terminalInput) {
      scheduleMobileTerminalReveal(0);
    }
  }

  function buildProgressSnapshot() {
    const scenario = currentScenario();
    const step = currentStep();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);

    // Terminal tracks are stateful, so resume stores both the selected scenario and the mutated shell state.
    return {
      scenarioId: scenario.id,
      scenarioIndex: session.scenarioIndex,
      stepIndex: session.stepIndex,
      completedScenarioIds: Array.from(session.completedScenarioIds),
      attemptsForStep: session.attemptsForStep,
      hintLevel: session.hintLevel,
      commandHistory: session.commandHistory.slice(),
      historyIndex: session.historyIndex,
      scenarioCompleted: session.scenarioCompleted,
      scenarioStarted: session.scenarioStarted,
      currentLayer: session.currentLayer,
      mobileContextCollapsed: session.mobileContextCollapsed,
      terminalEntries: NetlabApp ? NetlabApp.clone(session.terminalEntries) : session.terminalEntries.slice(),
      runtimeState: StateManager.clone(session.state),
      currentItemLabel: challengePresentation
        ? scenario.title
        : `${scenario.title} - ${step.objective}`
    };
  }

  function persistSectionProgress() {
    if (!NetlabApp || !session.scenarios.length) {
      return;
    }

    const scenario = currentScenario();
    const step = currentStep();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const summaryText = challengePresentation
      ? `${session.completedScenarioIds.size}/${totalScenarios()} challenges completed`
      : `${session.completedScenarioIds.size}/${totalScenarios()} scenarios completed`;

    savedProgressRecord = NetlabApp.saveSectionProgress(currentSectionId(), {
      sectionLabel: sectionLabel(),
      currentItemId: scenario.id,
      currentItemLabel: challengePresentation
        ? scenario.title
        : `${scenario.title} - ${step.objective}`,
      completedCount: session.completedScenarioIds.size,
      totalCount: totalScenarios(),
      summaryText: summaryText,
      state: buildProgressSnapshot()
    });

    session.resumePromptVisible = false;
  }

  function restoreSavedProgress(record) {
    const snapshot = record?.state;
    if (!snapshot) {
      return false;
    }

    const scenarioIndex = session.scenarios.findIndex((scenario) => scenario.id === snapshot.scenarioId);
    if (scenarioIndex < 0) {
      return false;
    }

    session.scenarioIndex = scenarioIndex;
    session.stepIndex = Math.max(0, Math.min(Number(snapshot.stepIndex) || 0, currentScenario().steps.length - 1));
    session.completedScenarioIds = new Set(Array.isArray(snapshot.completedScenarioIds) ? snapshot.completedScenarioIds : []);
    session.attemptsForStep = Number(snapshot.attemptsForStep) || 0;
    session.hintLevel = Number.isFinite(Number(snapshot.hintLevel)) ? Number(snapshot.hintLevel) : -1;
    session.commandHistory = Array.isArray(snapshot.commandHistory) ? snapshot.commandHistory : [];
    session.historyIndex = Number(snapshot.historyIndex) || session.commandHistory.length;
    session.scenarioCompleted = Boolean(snapshot.scenarioCompleted);
    session.scenarioStarted = Boolean(snapshot.scenarioStarted);
    session.currentLayer = snapshot.currentLayer || currentScenario().layer || "application";
    session.mobileContextCollapsed = Boolean(snapshot.mobileContextCollapsed);
    session.state = snapshot.runtimeState ? StateManager.clone(snapshot.runtimeState) : StateManager.createState(currentScenario().environment);

    restoreTerminalEntries(snapshot.terminalEntries || []);
    if (!session.terminalEntries.length) {
      if (session.scenarioStarted) {
        announceScenario();
      } else if (pageConfig.initialMessage) {
        printLine(pageConfig.initialMessage, "coach");
      }
    }

    setMobileContextCollapsed(session.mobileContextCollapsed);
    setCurrentLayer(session.currentLayer);
    renderPanel();
    document.dispatchEvent(new CustomEvent("terminalcoach:scenariochange", {
      detail: {
        scenario: currentScenario(),
        index: session.scenarioIndex,
        total: totalScenarios(),
        mode: pageConfig.mode || currentScenario().mode || "lesson",
        started: session.scenarioStarted
      }
    }));
    NetlabApp.clearLaunchAction();
    session.resumePromptVisible = false;
    savedProgressRecord = record;
    return true;
  }

  function renderSectionShell() {
    if (!els.appSectionShell || !NetlabApp || !session.scenarios.length) {
      return;
    }

    const profile = NetlabApp.getActiveProfile();
    const activeScenario = currentScenario();
    const activeStep = currentStep();
    const record = savedProgressRecord || NetlabApp.getSectionProgress(currentSectionId());
    const showResume = Boolean(record && session.resumePromptVisible);
    const completionText = record && showResume
      ? `${record.completedCount}/${record.totalCount || totalScenarios()}`
      : `${session.completedScenarioIds.size}/${totalScenarios()}`;
    const lastItem = record?.currentItemLabel || (scenarioUsesChallengePresentation(activeScenario) ? activeScenario.title : `${activeScenario.title} - ${activeStep.objective}`);
    const accountHref = typeof NetlabApp.buildHubUrl === "function"
      ? (profile.isGuest ? NetlabApp.buildHubUrl({ auth: "login" }) : NetlabApp.buildHubUrl())
      : "./index.html#hubAccountPanel";
    const accountLabel = profile.isGuest ? "Sign In to Sync" : "Manage Account";

    els.appSectionShell.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Progress</p>",
      "    <h2>Resume " + escapeHtml(sectionLabel()) + "</h2>",
      "    <p class=\"app-shell-copy\">" + escapeHtml(showResume
        ? "Saved progress is available for this section. Resume the last scenario or restart the track from the beginning."
        : "Profile: " + profile.label + ". This section saves its current scenario, completed items, and live terminal state so you can return to it later.") + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">Profile: " + escapeHtml(profile.label) + "</span>",
      "  <span class=\"status-badge\">Completed: " + escapeHtml(completionText) + "</span>",
      "  <span class=\"status-badge\">Coins: " + escapeHtml(NetlabApp.getCoinsTotal()) + "</span>",
      "  <span class=\"status-badge\">Last active: " + escapeHtml(lastItem) + "</span>",
      "</div>",
      "<div class=\"app-shell-actions\">",
      (showResume ? "  <button id=\"resumeSectionBtn\" class=\"app-action-btn\" type=\"button\">Resume</button>" : ""),
      "  <a class=\"app-action-link\" href=\"" + escapeHtml(accountHref) + "\">" + escapeHtml(accountLabel) + "</a>",
      "  <button id=\"startOverSectionBtn\" class=\"app-action-btn\" type=\"button\">Start Over</button>",
      "  <button id=\"toggleSoundBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
      "  <button id=\"resetProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
      "</div>",
      "<p class=\"app-shell-note\">Reset Progress clears all saved lab progress for the current profile. " + escapeHtml(NetlabApp.getProfileStorageNote()) + "</p>"
    ].join("");

    const resumeBtn = document.getElementById("resumeSectionBtn");
    const startOverBtn = document.getElementById("startOverSectionBtn");
    const toggleSoundBtn = document.getElementById("toggleSoundBtn");
    const resetProgressBtn = document.getElementById("resetProgressBtn");

    if (resumeBtn && record) {
      resumeBtn.addEventListener("click", () => {
        restoreSavedProgress(record);
      });
    }

    if (startOverBtn) {
      startOverBtn.addEventListener("click", () => {
        window.location.href = NetlabApp.buildSectionUrl(currentSectionId(), "start");
      });
    }

    if (toggleSoundBtn) {
      toggleSoundBtn.addEventListener("click", () => {
        NetlabApp.setSoundEnabled(!NetlabApp.isSoundEnabled());
        renderSectionShell();
      });
    }

    if (resetProgressBtn) {
      resetProgressBtn.addEventListener("click", () => {
        if (!window.confirm("Clear all saved progress for the current profile?")) {
          return;
        }

        NetlabApp.clearActiveProfileProgress();
        window.location.href = NetlabApp.buildSectionUrl(currentSectionId(), "start");
      });
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function announceScenario() {
    const scenario = currentScenario();
    const step = currentStep();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const machineSummary = machineContextSummary(scenario);

    printLine(`[${challengePresentation ? "Challenge" : scenario.category}] ${scenario.title}`, "system");
    printLine(`Track: ${scenarioEnvironmentLabel(scenario)}`, "dim");
    printLine(`Layer: ${scenarioLayerText(scenario)}`, "dim");
    printLine(`Objective: ${scenarioObjectiveText(scenario)}`, "dim");
    printLine(`Environment: ${shellLabel()} shell`, "dim");
    if (machineSummary) {
      printLine(`Machine context: ${machineSummary}`, "dim");
    }
    if (scenario.scenarioIntro) {
      printLine(`Context: ${scenario.scenarioIntro}`, "dim");
    }
    if (challengePresentation) {
      const knownTargets = scenarioKnownTargets(scenario);
      if (knownTargets.length) {
        printLine(`Known targets: ${knownTargets.join(" | ")}`, "dim");
      }
    }
    if (challengePresentation && Array.isArray(scenario.successConditions) && scenario.successConditions.length) {
      printLine(`Success signals: ${scenario.successConditions.join(" | ")}`, "dim");
      printLine("Minimal guidance is active. Work from evidence and decide your own sequence.", "coach");
      return;
    }
    if (step.context) {
      printLine(`Context: ${step.context}`, "dim");
    }
    printLine(`Current task: ${step.objective}`, "coach");
  }

  function resetScenarioState() {
    session.state = StateManager.createState(currentScenario().environment);
    setCurrentLayer(currentScenario().layer || "application");
    session.stepIndex = 0;
    session.attemptsForStep = 0;
    session.hintLevel = -1;
    session.scenarioCompleted = false;
  }

  function loadScenario(index, options = {}) {
    const announce = options.announce !== false;
    const transition = options.transition !== false;
    const focus = options.focus !== false;
    const persist = options.persist !== false;
    const previousLayer = session.currentLayer;
    session.scenarioIndex = ((index % totalScenarios()) + totalScenarios()) % totalScenarios();
    resetScenarioState();
    session.scenarioStarted = announce;
    clearTerminal();
    if (transition) {
      showLayerTransition(previousLayer, session.currentLayer);
    } else if (els.layerTransitionBanner) {
      els.layerTransitionBanner.hidden = true;
      els.layerTransitionBanner.textContent = "";
    }
    if (announce) {
      announceScenario();
    } else if (pageConfig.initialMessage) {
      printLine(pageConfig.initialMessage, "coach");
    }
    renderPanel();
    document.dispatchEvent(new CustomEvent("terminalcoach:scenariochange", {
      detail: {
        scenario: currentScenario(),
        index: session.scenarioIndex,
        total: totalScenarios(),
        mode: pageConfig.mode || currentScenario().mode || "lesson",
        started: session.scenarioStarted
      }
    }));
    if (persist) {
      persistSectionProgress();
    }
    syncMobileViewportMetrics();
    if (focus && els.terminalInput && !isMobileTerminalLayout()) {
      els.terminalInput.focus();
    }
  }

  function previewScenario(index) {
    loadScenario(index, { announce: false, transition: false, focus: false, persist: false });
  }

  function markScenarioComplete() {
    const scenario = currentScenario();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const firstCompletion = !session.completedScenarioIds.has(scenario.id);

    session.completedScenarioIds.add(scenario.id);
    session.scenarioCompleted = true;
    printLine("Scenario complete. You reached the objective with live command input.", "success");
    if (firstCompletion && NetlabApp?.awardCoins) {
      NetlabApp.awardCoins({
        key: `scenario-complete:${currentSectionId()}:${scenario.id}`,
        coins: NetlabApp.coinsForDifficulty(scenario.difficulty, challengePresentation ? 10 : 5),
        title: challengePresentation ? "Challenge Complete" : "Lesson Complete",
        message: scenario.title
      });
    }
    renderPanel();
    persistSectionProgress();
  }

  function advanceStep(count = 1) {
    const scenario = currentScenario();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const skipCount = Math.max(1, Number(count) || 1);

    for (let index = 0; index < skipCount; index += 1) {
      if (session.stepIndex >= scenario.steps.length - 1) {
        markScenarioComplete();
        return;
      }

      session.stepIndex += 1;
    }

    session.attemptsForStep = 0;
    session.hintLevel = -1;
    if (skipCount > 1) {
      printLine("You already collected the deeper evidence, so the coach skipped the redundant intermediate task.", "success");
    }
    if (challengePresentation) {
      printLine("Progress recorded. Keep investigating and let the evidence drive the next move.", "coach");
      renderPanel();
      persistSectionProgress();
      return;
    }
    if (currentStep().context) {
      printLine(`Context: ${currentStep().context}`, "dim");
    }
    printLine(`Next task: ${currentStep().objective}`, "coach");
    renderPanel();
    persistSectionProgress();
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
    const windowsShell = StateManager.isWindowsState(session.state);

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

      if (windowsShell && /^\/[A-Za-z0-9?]+$/.test(token)) {
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
      ...processes.map((process) => {
        const descriptor = process.command && process.command !== process.name
          ? `${process.name} | ${process.command}`
          : (process.command || process.name);
        return `${String(process.pid).padStart(5)} ${String(process.user || "student").padEnd(10)} ${(process.cpu || "0.0").padStart(4)} ${(process.memory || "0.1").padStart(4)} ${descriptor}`;
      })
    ];
  }

  function filterLines(lines, pattern) {
    if (!pattern) return lines;
    const regex = new RegExp(pattern, "i");
    return lines.filter((line) => regex.test(line));
  }

  function normalizeTextLines(lines) {
    return lines
      .flatMap((line) => String(line).split(/\r?\n/))
      .filter((line) => line !== "");
  }

  function expandWindowsEnvText(text) {
    if (!StateManager.isWindowsState(session.state)) return String(text || "");

    return String(text || "").replace(/%([^%]+)%/g, (_, name) => {
      const keys = Object.keys(session.state.envVars || {});
      const matchedKey = keys.find((key) => key.toUpperCase() === String(name || "").trim().toUpperCase());
      return matchedKey ? String(session.state.envVars[matchedKey]) : `%${name}%`;
    });
  }

  function treeLinesForPath(path, showFiles = false, prefix = "") {
    const children = StateManager.listChildren(session.state, path, true)
      .filter((child) => showFiles || child.type === "dir");
    const lines = [];

    children.forEach((child, index) => {
      const last = index === children.length - 1;
      const connector = last ? "\\---" : "+---";
      lines.push(`${prefix}${connector}${child.name}`);

      if (child.type === "dir") {
        const nextPrefix = `${prefix}${last ? "    " : "|   "}`;
        lines.push(...treeLinesForPath(child.path, showFiles, nextPrefix));
      }
    });

    return lines;
  }

  function parseAttributeMutations(tokens = []) {
    const mutations = [];

    tokens.forEach((token) => {
      const match = String(token || "").match(/^([+-])([A-Za-z])$/);
      if (!match) return;
      mutations.push({ enabled: match[1] === "+", code: match[2].toUpperCase() });
    });

    return mutations;
  }

  function nodeAttributeCodes(node) {
    const codes = new Set((node?.attributes || []).map((value) => String(value).toUpperCase()));
    if (node?.hidden) codes.add("H");
    if (node?.type === "dir") codes.add("D");
    if (node?.type === "file" && !codes.has("A")) codes.add("A");
    return Array.from(codes);
  }

  function setNodeAttribute(node, code, enabled) {
    const normalized = String(code || "").toUpperCase();
    const current = new Set((node.attributes || []).map((value) => String(value).toUpperCase()));

    if (enabled) current.add(normalized);
    else current.delete(normalized);

    node.attributes = Array.from(current);
    if (normalized === "H") {
      node.hidden = enabled;
    }
  }

  function resolveNetworkTarget(value) {
    const normalized = String(value || "").trim();
    if (!normalized) return null;

    const knownTarget = StateManager.findTarget(session.state, normalized);
    if (knownTarget) return knownTarget;

    const dnsRecord = (session.state.dnsRecords || []).find((record) => String(record.hostname).toLowerCase() === normalized.toLowerCase());
    if (dnsRecord) {
      return StateManager.findTarget(session.state, dnsRecord.address) || {
        ip: dnsRecord.address,
        hostname: dnsRecord.hostname,
        reachable: true,
        ports: []
      };
    }

    if ((session.state.networkAdapters || []).some((adapter) => adapter.ipv4 === normalized)) {
      return {
        ip: normalized,
        hostname: session.state.host,
        reachable: true,
        ports: []
      };
    }

    return {
      ip: normalized,
      hostname: normalized,
      reachable: false,
      ports: []
    };
  }

  function findServiceRecord(name) {
    const normalized = String(name || "").trim().toLowerCase();
    return (session.state.services || []).find((service) => {
      const serviceName = String(service.name || "").toLowerCase();
      const displayName = String(service.displayName || "").toLowerCase();
      return serviceName === normalized || displayName === normalized;
    }) || null;
  }

  function findUserRecord(name) {
    return (session.state.localUsers || []).find((user) => String(user.username || "").toLowerCase() === String(name || "").trim().toLowerCase()) || null;
  }

  function findGroupRecord(name) {
    return (session.state.localGroups || []).find((group) => String(group.name || "").toLowerCase() === String(name || "").trim().toLowerCase()) || null;
  }

  function findShareRecord(name) {
    return (session.state.shares || []).find((share) => String(share.name || "").toLowerCase() === String(name || "").trim().toLowerCase()) || null;
  }

  function findScheduledTask(name) {
    return (session.state.scheduledTasks || []).find((task) => String(task.name || "").toLowerCase() === String(name || "").trim().toLowerCase()) || null;
  }

  function formatWindowsPing(target) {
    return [
      `Pinging ${target.hostname || target.ip} [${target.ip}] with 32 bytes of data:`,
      `Reply from ${target.ip}: bytes=32 time<1ms TTL=128`,
      `Reply from ${target.ip}: bytes=32 time<1ms TTL=128`,
      `Reply from ${target.ip}: bytes=32 time<1ms TTL=128`,
      `Reply from ${target.ip}: bytes=32 time<1ms TTL=128`,
      "",
      `Ping statistics for ${target.ip}:`,
      "    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),"
    ];
  }

  function ciscoRouterState() {
    return session.state.router || {};
  }

  function ciscoInterfaces() {
    return Array.isArray(ciscoRouterState().interfaces) ? ciscoRouterState().interfaces : [];
  }

  function normalizeCiscoInterfaceName(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    const lowered = raw.toLowerCase();

    if (lowered.startsWith("gigabitethernet")) {
      return `GigabitEthernet${raw.slice("gigabitethernet".length)}`;
    }

    if (lowered.startsWith("gi")) {
      return `GigabitEthernet${raw.slice(2)}`;
    }

    if (lowered.startsWith("g")) {
      return `GigabitEthernet${raw.slice(1)}`;
    }

    if (lowered.startsWith("loopback")) {
      return `Loopback${raw.slice("loopback".length)}`;
    }

    if (lowered.startsWith("lo")) {
      return `Loopback${raw.slice(2)}`;
    }

    return raw;
  }

  function findCiscoInterface(name) {
    const normalized = normalizeCiscoInterfaceName(name).toLowerCase();
    return ciscoInterfaces().find((iface) => {
      const aliases = [iface.name, ...(iface.aliases || [])]
        .map((value) => normalizeCiscoInterfaceName(value).toLowerCase());
      return aliases.includes(normalized);
    }) || null;
  }

  function ciscoSelectedInterface() {
    return findCiscoInterface(ciscoRouterState().selectedInterface);
  }

  function ciscoInterfaceStatus(iface) {
    return iface?.adminUp ? "up" : "administratively down";
  }

  function ciscoInterfaceProtocol(iface) {
    return iface?.adminUp && iface?.lineProtocol ? "up" : "down";
  }

  function ipv4ToInt(ip) {
    const octets = String(ip || "").split(".").map((value) => Number(value));
    if (octets.length !== 4 || octets.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
      return null;
    }

    return ((octets[0] << 24) >>> 0)
      + ((octets[1] << 16) >>> 0)
      + ((octets[2] << 8) >>> 0)
      + (octets[3] >>> 0);
  }

  function intToIpv4(value) {
    return [
      (value >>> 24) & 255,
      (value >>> 16) & 255,
      (value >>> 8) & 255,
      value & 255
    ].join(".");
  }

  function maskToPrefix(mask) {
    const binary = String(mask || "")
      .split(".")
      .map((value) => Number(value).toString(2).padStart(8, "0"))
      .join("");
    return binary.split("").filter((bit) => bit === "1").length;
  }

  function networkAddressFor(ip, mask) {
    const ipInt = ipv4ToInt(ip);
    const maskInt = ipv4ToInt(mask);
    if (ipInt === null || maskInt === null) return null;
    return intToIpv4(ipInt & maskInt);
  }

  function snapshotCiscoRunningConfig() {
    const router = ciscoRouterState();
    return {
      hostname: router.hostname || session.state.host || "Router",
      interfaces: ciscoInterfaces().map((iface) => ({ ...iface })),
      staticRoutes: (router.staticRoutes || []).map((route) => ({ ...route }))
    };
  }

  function saveCiscoRunningConfig() {
    session.state.router.startupConfig = snapshotCiscoRunningConfig();
    session.state.router.configDirty = false;
  }

  function markCiscoConfigDirty() {
    if (!isCiscoState()) return;
    session.state.router.configDirty = true;
  }

  function setCiscoMode(mode, selectedInterface = null) {
    if (!isCiscoState()) return;
    session.state.router.mode = mode;
    session.state.router.selectedInterface = selectedInterface;
  }

  function requireCiscoMode(allowedModes, guidance) {
    const currentMode = String(ciscoRouterState().mode || "user-exec");
    if (allowedModes.includes(currentMode)) {
      return null;
    }

    return errorResult(guidance, "wrong_context");
  }

  function formatCiscoInterfaceBriefOutput() {
    return [
      "Interface              IP-Address      OK? Method Status                Protocol",
      ...ciscoInterfaces().map((iface) => {
        const ipText = iface.ipAddress || "unassigned";
        return `${String(iface.name).padEnd(22)} ${String(ipText).padEnd(15)} YES manual ${String(ciscoInterfaceStatus(iface)).padEnd(21)} ${ciscoInterfaceProtocol(iface)}`;
      })
    ];
  }

  function formatCiscoInterfaceDetailOutput(iface) {
    if (!iface) {
      return ["% Interface not found"];
    }

    return [
      `${iface.name} is ${ciscoInterfaceStatus(iface)}, line protocol is ${ciscoInterfaceProtocol(iface)}`,
      `  Description: ${iface.description || "not set"}`,
      `  Internet address is ${iface.ipAddress ? `${iface.ipAddress}/${maskToPrefix(iface.subnetMask)}` : "unassigned"}`,
      "  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,",
      "     reliability 255/255, txload 1/255, rxload 1/255"
    ];
  }

  function buildCiscoConfigLines(snapshot) {
    const config = snapshot || snapshotCiscoRunningConfig();
    const lines = [
      "Building configuration...",
      "",
      "Current configuration : 612 bytes",
      "!",
      `hostname ${config.hostname || "Router"}`
    ];

    (config.interfaces || []).forEach((iface) => {
      lines.push(`interface ${iface.name}`);
      if (iface.description) {
        lines.push(` description ${iface.description}`);
      }
      if (iface.ipAddress && iface.subnetMask) {
        lines.push(` ip address ${iface.ipAddress} ${iface.subnetMask}`);
      }
      lines.push(iface.adminUp ? " no shutdown" : " shutdown");
      lines.push("!");
    });

    (config.staticRoutes || []).forEach((route) => {
      lines.push(`ip route ${route.network} ${route.mask} ${route.nextHop}`);
    });

    lines.push("end");
    return lines;
  }

  function formatCiscoVersionOutput() {
    const router = ciscoRouterState();
    return [
      router.version || "Cisco IOS Software, 1900 Software (C1900-UNIVERSALK9-M), Version 15.4(3)M",
      `${router.model || "Cisco 1941/K9"} processor with 491520K/32768K bytes of memory.`,
      `${router.model || "Cisco 1941/K9"} uptime is ${router.uptime || "2 weeks, 4 days, 1 hour, 12 minutes"}`,
      `System image file is "${router.image || "flash:c1900-universalk9-mz.SPA.154-3.M.bin"}"`,
      `Processor board ID ${router.serialNumber || "FTX0001ABCD"}`,
      `Configuration register is ${router.configRegister || "0x2102"}`
    ];
  }

  function formatCiscoRouteOutput() {
    const router = ciscoRouterState();
    const lines = [
      "Codes: C - connected, S - static",
      "",
      "Gateway of last resort is 198.51.100.2 to network 0.0.0.0",
      ""
    ];

    ciscoInterfaces()
      .filter((iface) => iface.adminUp && iface.lineProtocol && iface.ipAddress && iface.subnetMask)
      .forEach((iface) => {
        const network = networkAddressFor(iface.ipAddress, iface.subnetMask);
        const prefix = maskToPrefix(iface.subnetMask);
        if (!network) return;
        lines.push(`C    ${network}/${prefix} is directly connected, ${iface.name}`);
      });

    (router.staticRoutes || []).forEach((route) => {
      const prefix = maskToPrefix(route.mask);
      const code = route.network === "0.0.0.0" && route.mask === "0.0.0.0" ? "S*" : "S";
      lines.push(`${code}   ${route.network}/${prefix} [1/0] via ${route.nextHop}`);
    });

    return lines;
  }

  function formatIpconfigOutput(showAll = false) {
    const adapters = session.state.networkAdapters || [];
    const lines = [];

    adapters.forEach((adapter) => {
      lines.push("");
      lines.push(`Ethernet adapter ${adapter.name}:`);
      lines.push("");
      if (showAll) {
        lines.push(`   Description . . . . . . . . . . . : ${adapter.description}`);
        lines.push(`   Physical Address. . . . . . . . . : ${adapter.mac}`);
        lines.push(`   DHCP Enabled. . . . . . . . . . . : ${adapter.dhcpEnabled ? "Yes" : "No"}`);
      }
      lines.push(`   IPv4 Address. . . . . . . . . . . : ${adapter.ipv4}`);
      lines.push(`   Subnet Mask . . . . . . . . . . . : ${adapter.subnetMask}`);
      lines.push(`   Default Gateway . . . . . . . . . : ${adapter.gateway}`);
      if (showAll) {
        lines.push(`   DNS Servers . . . . . . . . . . . : ${(adapter.dns || []).join(", ")}`);
      }
    });

    return lines.length ? lines : ["Windows IP Configuration"];
  }

  function formatNetstatOutput(includePid = false) {
    const lines = [
      includePid
        ? "  Proto  Local Address          Foreign Address        State           PID"
        : "  Proto  Local Address          Foreign Address        State"
    ];

    (session.state.networkConnections || []).forEach((connection) => {
      const stateText = connection.proto === "UDP" ? "" : String(connection.state || "").padEnd(13);
      const base = [
        String(connection.proto).padEnd(6),
        String(connection.localAddress).padEnd(22),
        String(connection.foreignAddress).padEnd(22),
        stateText
      ];

      if (includePid) {
        base.push(String(connection.pid || ""));
      }

      lines.push(base.join(" ").trimEnd());
    });

    return lines;
  }

  function formatArpOutput() {
    const groups = new Map();

    (session.state.arpCache || []).forEach((entry) => {
      const key = entry.interface || "Interface";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
    });

    const lines = [];
    groups.forEach((entries, iface) => {
      lines.push(`Interface: ${iface} --- 0x6`);
      lines.push("  Internet Address      Physical Address      Type");
      entries.forEach((entry) => {
        lines.push(`  ${String(entry.ip).padEnd(21)} ${String(entry.mac).padEnd(21)} ${entry.type}`);
      });
      lines.push("");
    });

    return lines;
  }

  function formatRoutePrintOutput() {
    return [
      "=========================================================================",
      "Interface List",
      " 11...00 0c 29 5e 11 22 ......Intel(R) 82574L Gigabit Network Connection",
      "=========================================================================",
      "IPv4 Route Table",
      "=========================================================================",
      "Active Routes:",
      "Network Destination        Netmask          Gateway       Interface  Metric",
      ...(session.state.routeTable || []).map((route) =>
        `${String(route.network).padEnd(26)} ${String(route.netmask).padEnd(16)} ${String(route.gateway).padEnd(15)} ${String(route.interface).padEnd(11)} ${route.metric}`),
      "========================================================================="
    ];
  }

  function formatSystemInfoOutput() {
    const info = session.state.systemInfo || {};
    return [
      `Host Name:                 ${info.hostName || session.state.host}`,
      `OS Name:                   ${info.osName || "Microsoft Windows 10"}`,
      `OS Version:                ${info.osVersion || "10.0.19045"}`,
      `OS Manufacturer:           ${info.osManufacturer || "Microsoft Corporation"}`,
      `System Model:              ${info.systemModel || "Virtual Machine"}`,
      `System Type:               ${info.systemType || "x64-based PC"}`,
      `BIOS Version:              ${info.biosVersion || "Unknown"}`,
      `System Boot Time:          ${info.bootTime || "Unknown"}`,
      `Hotfix(s):                 ${info.hotfixCount || 0} Hotfix(s) Installed.`
    ];
  }

  function formatServiceQueryOutput(service) {
    return [
      `SERVICE_NAME: ${service.name}`,
      `        TYPE               : 10  WIN32_OWN_PROCESS`,
      `        STATE              : ${service.status === "RUNNING" ? "4  RUNNING" : "1  STOPPED"}`,
      `        WIN32_EXIT_CODE    : 0  (0x0)`,
      `        SERVICE_EXIT_CODE  : 0  (0x0)`,
      `        CHECKPOINT         : 0x0`,
      `        WAIT_HINT          : 0x0`
    ];
  }

  function formatWmicProcessOutput() {
    return [
      "Caption                ProcessId",
      "=====================  =========",
      ...StateManager.listProcesses(session.state).map((process) => `${String(process.name).padEnd(21)} ${process.pid}`)
    ];
  }

  function formatDriverQueryOutput() {
    return [
      "Module Name  Display Name                              Start Mode  State",
      "===========  ========================================  ==========  =======",
      ...(session.state.drivers || []).map((driver) =>
        `${String(driver.moduleName).padEnd(11)} ${String(driver.displayName).padEnd(40)} ${String(driver.startMode).padEnd(10)} ${driver.state}`)
    ];
  }

  function formatQueryUserOutput() {
    return [
      " USERNAME              SESSIONNAME        ID  STATE   IDLE TIME  LOGON TIME",
      ...(session.state.userSessions || []).map((entry) =>
        `${String(entry.username).padEnd(21)} ${String(entry.sessionName).padEnd(18)} ${String(entry.id).padStart(2)}  ${String(entry.state).padEnd(7)} ${String(entry.idleTime).padEnd(10)} ${entry.logonTime}`)
    ];
  }

  function formatNetUserOutput(user) {
    return [
      `User name                    ${user.username}`,
      `Full Name                    ${user.fullName || ""}`,
      `Account active               ${user.enabled ? "Yes" : "No"}`,
      `Last logon                   ${user.lastLogon || "Never"}`,
      `Local Group Memberships      ${(user.groups || []).join(", ") || "None"}`
    ];
  }

  function formatLocalGroupOutput(group) {
    return [
      `Alias name     ${group.name}`,
      "Members",
      "-------------------------",
      ...((group.members || []).length ? group.members : ["No members"])
    ];
  }

  function formatNetShareOutput(shares) {
    return [
      "Share name   Resource                        Remark",
      "----------   ------------------------------  --------------------",
      ...shares.map((share) =>
        `${String(share.name).padEnd(11)} ${String(share.path).padEnd(30)} ${share.remark || ""}`)
    ];
  }

  function formatMappedShares() {
    const mapped = session.state.mappedShares || [];
    if (!mapped.length) {
      return ["There are no entries in the list."];
    }

    return [
      "Status       Local     Remote",
      "-----------  -------   -------------------------",
      ...mapped.map((entry) => `OK           ${String(entry.drive).padEnd(8)} ${entry.unc}`)
    ];
  }

  function formatSchtasksOutput(tasks) {
    return [
      "TaskName                         Next Run Time         Status",
      "===============================  ====================  ========",
      ...tasks.map((task) => `${String(task.name).padEnd(31)} ${String(task.nextRunTime).padEnd(20)} ${task.status}`)
    ];
  }

  function formatFcOutput(leftPath, rightPath, leftLines, rightLines) {
    if (leftLines.join("\n") === rightLines.join("\n")) {
      return ["FC: no differences encountered"];
    }

    const lines = [`Comparing files ${leftPath} and ${rightPath}`];
    const max = Math.max(leftLines.length, rightLines.length);

    for (let index = 0; index < max; index += 1) {
      if (leftLines[index] === rightLines[index]) continue;
      lines.push(`***** ${leftPath}`);
      lines.push(leftLines[index] || "");
      lines.push(`***** ${rightPath}`);
      lines.push(rightLines[index] || "");
    }

    return lines;
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

    if (filename === "toolkit.tar.gz") {
      return {
        path: filename,
        content: "",
        downloaded: true,
        archiveEntries: [
          { path: "toolkit", type: "dir" },
          { path: "toolkit/README.md", content: "Toolkit bundle for lab validation\n" },
          { path: "toolkit/scanner.conf", content: "threads=8\nmode=quick\n" }
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

  function hasValidPortListSyntax(value) {
    if (!value) return true;
    return /^\d+(,\d+)*$/.test(value.trim());
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
    for (const arg of parsed.args) {
      const created = StateManager.mkdir(session.state, arg);
      if (!created.ok) return errorResult(`mkdir: ${created.error}`);
    }
    return okResult(parsed.args.map((arg) => `created directory ${arg}`));
  }

  function executeTouch(parsed) {
    if (!parsed.args.length) return errorResult("touch: missing file operand", "syntax_error");
    parsed.args.forEach((arg) => StateManager.touch(session.state, arg));
    return okResult([]);
  }

  function readTextSource(commandName, parsed, pipedInput) {
    if (pipedInput.length) return { ok: true, lines: normalizeTextLines(pipedInput) };
    const filename = parsed.args[parsed.args.length - 1];
    if (!filename) return { ok: false, error: `${commandName}: missing file operand`, status: "syntax_error" };
    const file = StateManager.readFile(session.state, filename);
    if (!file.ok) return { ok: false, error: file.error, status: "runtime_error" };
    return { ok: true, lines: normalizeTextLines(file.content.split(/\r?\n/)) };
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
    const text = expandWindowsEnvText(parsed.args.join(" "));
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

  function executeFind(parsed, pipedInput) {
    const pattern = parsed.args[0];
    if (!pattern) return errorResult("FIND: missing search string", "syntax_error");
    const source = readTextSource("find", parsed, pipedInput);
    if (!source.ok) return errorResult(source.error, source.status);
    return okResult(filterLines(source.lines, pattern.replace(/^"|"$/g, "")));
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

  function executeTree(parsed) {
    const target = parsed.args[0] || session.state.cwd;
    const node = StateManager.getNode(session.state, target);
    if (!node) return errorResult("Path not found");
    if (node.type === "file") return okResult(StateManager.displayPath(session.state, node.path));

    const showFiles = hasFlag(parsed, "/F");
    const lines = [StateManager.displayPath(session.state, node.path), ...treeLinesForPath(node.path, showFiles)];
    return okResult(lines);
  }

  function executeRmdir(parsed) {
    if (!parsed.args.length) return errorResult("The syntax of the command is incorrect.", "syntax_error");
    const recursive = hasFlag(parsed, "/S");
    const removed = StateManager.removePath(session.state, parsed.args[0], recursive);
    if (!removed.ok) return errorResult(removed.error);
    return okResult([]);
  }

  function executeCopy(parsed) {
    if (isCiscoState()) {
      return executeCiscoCopy(parsed);
    }
    if (parsed.args.length < 2) return errorResult("The syntax of the command is incorrect.", "syntax_error");
    const copied = StateManager.copyPath(session.state, parsed.args[0], parsed.args[1]);
    if (!copied.ok) return errorResult(copied.error);
    return okResult("        1 file(s) copied.");
  }

  function executeXcopy(parsed) {
    if (parsed.args.length < 2) return errorResult("Invalid number of parameters", "syntax_error");
    const copied = StateManager.copyPath(session.state, parsed.args[0], parsed.args[1]);
    if (!copied.ok) return errorResult(copied.error);
    return okResult("1 File(s) copied");
  }

  function executeMove(parsed) {
    if (parsed.args.length < 2) return errorResult("The syntax of the command is incorrect.", "syntax_error");
    const moved = StateManager.movePath(session.state, parsed.args[0], parsed.args[1]);
    if (!moved.ok) return errorResult(moved.error);
    return okResult("        1 file(s) moved.");
  }

  function executeDel(parsed) {
    if (!parsed.args.length) return errorResult("The syntax of the command is incorrect.", "syntax_error");
    const removed = StateManager.removePath(session.state, parsed.args[0], false);
    if (!removed.ok) return errorResult(removed.error);
    return okResult([]);
  }

  function executeRen(parsed) {
    if (parsed.args.length < 2) return errorResult("The syntax of the command is incorrect.", "syntax_error");
    const source = StateManager.getNode(session.state, parsed.args[0]);
    if (!source) return errorResult("The system cannot find the file specified.");
    const sourcePath = StateManager.normalizePath(session.state, parsed.args[0]);
    const parent = sourcePath.includes("/") ? sourcePath.slice(0, sourcePath.lastIndexOf("/")) : session.state.cwd;
    const destination = `${parent}/${parsed.args[1]}`;
    const moved = StateManager.movePath(session.state, sourcePath, destination);
    if (!moved.ok) return errorResult(moved.error);
    return okResult([]);
  }

  function executeMore(parsed, pipedInput) {
    const source = readTextSource("more", parsed, pipedInput);
    if (!source.ok) return errorResult(source.error, source.status);
    return okResult(source.lines);
  }

  function executeAttrib(parsed) {
    const mutations = parseAttributeMutations(parsed.tokens.slice(1));
    const targets = parsed.args.filter((arg) => !/^[+-][A-Za-z]$/.test(arg));
    const target = targets[0] || session.state.cwd;
    const node = StateManager.getNode(session.state, target);
    if (!node) return errorResult("File not found");

    if (mutations.length) {
      mutations.forEach((mutation) => setNodeAttribute(node, mutation.code, mutation.enabled));
      return okResult(StateManager.displayPath(session.state, node.path));
    }

    if (node.type === "dir") {
      return okResult(StateManager.listChildren(session.state, node.path, true).map((child) =>
        `${nodeAttributeCodes(child).join(" ").padEnd(8)} ${StateManager.displayPath(session.state, child.path)}`));
    }

    return okResult(`${nodeAttributeCodes(node).join(" ").padEnd(8)} ${StateManager.displayPath(session.state, node.path)}`);
  }

  function executeHostname(parsed) {
    if (isCiscoState()) {
      return executeCiscoHostname(parsed);
    }
    return okResult((session.state.systemInfo || {}).hostName || session.state.host);
  }

  function executeWhoami() {
    const domain = session.state.envVars?.USERDOMAIN || "LAB";
    return okResult(`${domain}\\${session.state.user}`);
  }

  function executeSysteminfo() {
    return okResult(formatSystemInfoOutput());
  }

  function executeSet(parsed) {
    const expression = parsed.args.join(" ");
    if (!expression) {
      return okResult(Object.keys(session.state.envVars || {})
        .sort((left, right) => left.localeCompare(right))
        .map((key) => `${key}=${session.state.envVars[key]}`));
    }

    if (expression.includes("=")) {
      const [rawKey, ...valueParts] = expression.split("=");
      const key = rawKey.trim();
      session.state.envVars[key] = valueParts.join("=");
      return okResult(`${key}=${session.state.envVars[key]}`);
    }

    const prefix = expression.trim().toUpperCase();
    return okResult(Object.keys(session.state.envVars || {})
      .filter((key) => key.toUpperCase().startsWith(prefix))
      .sort((left, right) => left.localeCompare(right))
      .map((key) => `${key}=${session.state.envVars[key]}`));
  }

  function executeVer() {
    return okResult(`Microsoft Windows [Version ${(session.state.systemInfo || {}).osVersion || "10.0.19045"}]`);
  }

  function executeDate(parsed) {
    if (parsed.args.length) {
      session.state.currentDate = parsed.args.join(" ");
    }
    return okResult(`The current date is: ${session.state.currentDate}`);
  }

  function executeTime(parsed) {
    if (parsed.args.length) {
      session.state.currentTime = parsed.args.join(" ");
    }
    return okResult(`The current time is: ${session.state.currentTime}`);
  }

  function executeCls() {
    return okResult([], { clearScreen: true });
  }

  function executePrompt(parsed) {
    if (parsed.args.length) {
      session.state.promptTemplate = parsed.args.join(" ");
      return okResult([]);
    }
    return okResult(StateManager.getPrompt(session.state));
  }

  function executeCiscoEnable() {
    if (!isCiscoState()) {
      return errorResult("That command is not available in this training shell.", "invalid_command");
    }

    if (ciscoRouterState().mode === "user-exec") {
      setCiscoMode("privileged-exec");
    }

    return okResult([]);
  }

  function executeCiscoDisable() {
    if (!isCiscoState()) {
      return errorResult("That command is not available in this training shell.", "invalid_command");
    }

    if (ciscoRouterState().mode !== "privileged-exec") {
      return errorResult("% disable is only available from privileged EXEC mode.", "wrong_context");
    }

    setCiscoMode("user-exec");
    return okResult([]);
  }

  function executeCiscoConfigure(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["privileged-exec"], "% Enter privileged EXEC mode with `enable` before entering configuration mode.");
    if (modeError) return modeError;

    if (String(parsed.args.join(" ")).toLowerCase() !== "terminal") {
      return errorResult("% configure terminal is the supported form in this trainer.", "syntax_error");
    }

    setCiscoMode("global-config");
    return okResult(["Enter configuration commands, one per line. End with CNTL/Z."]);
  }

  function executeCiscoExit() {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");

    switch (ciscoRouterState().mode) {
      case "interface-config":
        setCiscoMode("global-config");
        return okResult([]);
      case "global-config":
        setCiscoMode("privileged-exec");
        return okResult([]);
      case "privileged-exec":
        setCiscoMode("user-exec");
        return okResult([]);
      default:
        return errorResult("% Nothing to exit from in the current Cisco mode.", "wrong_context");
    }
  }

  function executeCiscoEnd() {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["global-config", "interface-config"], "% end is useful after you have entered configuration mode.");
    if (modeError) return modeError;
    setCiscoMode("privileged-exec");
    return okResult([]);
  }

  function executeCiscoShow(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const subcommand = String(parsed.args.join(" ")).trim().toLowerCase();

    if (subcommand === "version") {
      const modeError = requireCiscoMode(["user-exec", "privileged-exec"], "% show version is available from EXEC mode.");
      if (modeError) return modeError;
      return okResult(formatCiscoVersionOutput());
    }

    if (subcommand === "ip interface brief") {
      const modeError = requireCiscoMode(["user-exec", "privileged-exec"], "% Leave configuration mode before using show ip interface brief in this trainer.");
      if (modeError) return modeError;
      return okResult(formatCiscoInterfaceBriefOutput());
    }

    if (subcommand.startsWith("interfaces")) {
      const modeError = requireCiscoMode(["user-exec", "privileged-exec"], "% Leave configuration mode before using show interfaces in this trainer.");
      if (modeError) return modeError;
      const ifaceName = parsed.args.slice(1).join(" ");
      return okResult(formatCiscoInterfaceDetailOutput(ifaceName ? findCiscoInterface(ifaceName) : ciscoInterfaces()[0]));
    }

    if (subcommand === "running-config") {
      const modeError = requireCiscoMode(["privileged-exec"], "% show running-config requires privileged EXEC mode.");
      if (modeError) return modeError;
      return okResult(buildCiscoConfigLines(snapshotCiscoRunningConfig()));
    }

    if (subcommand === "startup-config") {
      const modeError = requireCiscoMode(["privileged-exec"], "% show startup-config requires privileged EXEC mode.");
      if (modeError) return modeError;
      const startup = ciscoRouterState().startupConfig;
      return okResult(startup ? buildCiscoConfigLines(startup) : ["startup-config is not present"]);
    }

    if (subcommand === "ip route") {
      const modeError = requireCiscoMode(["privileged-exec"], "% show ip route requires privileged EXEC mode.");
      if (modeError) return modeError;
      return okResult(formatCiscoRouteOutput());
    }

    return errorResult("% Unsupported show command in this trainer.", "wrong_context");
  }

  function executeCiscoHostname(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["global-config"], "% hostname is only valid in global configuration mode.");
    if (modeError) return modeError;

    const nextHostname = String(parsed.args[0] || "").trim();
    if (!nextHostname) return errorResult("% hostname requires a device name.", "syntax_error");

    session.state.router.hostname = nextHostname;
    session.state.host = nextHostname;
    markCiscoConfigDirty();
    return okResult([]);
  }

  function executeCiscoInterface(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["global-config"], "% interface is only valid from global configuration mode.");
    if (modeError) return modeError;

    const iface = findCiscoInterface(parsed.args.join(" "));
    if (!iface) return errorResult("% Interface not found in this trainer.", "runtime_error");

    setCiscoMode("interface-config", iface.name);
    return okResult([]);
  }

  function executeCiscoDescription(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["interface-config"], "% description is only valid in interface configuration mode.");
    if (modeError) return modeError;
    const iface = ciscoSelectedInterface();
    if (!iface) return errorResult("% No interface selected.", "wrong_context");

    const description = parsed.args.join(" ").trim();
    if (!description) return errorResult("% description requires text after the command.", "syntax_error");

    iface.description = description;
    markCiscoConfigDirty();
    return okResult([]);
  }

  function executeCiscoIp(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const action = String(parsed.args[0] || "").toLowerCase();

    if (action === "address") {
      const modeError = requireCiscoMode(["interface-config"], "% ip address is only valid in interface configuration mode.");
      if (modeError) return modeError;
      const iface = ciscoSelectedInterface();
      if (!iface) return errorResult("% No interface selected.", "wrong_context");

      const ipAddress = parsed.args[1];
      const subnetMask = parsed.args[2];
      if (!ipAddress || !subnetMask) {
        return errorResult("% ip address requires an IPv4 address and subnet mask.", "syntax_error");
      }

      iface.ipAddress = ipAddress;
      iface.subnetMask = subnetMask;
      iface.lineProtocol = Boolean(iface.adminUp);
      markCiscoConfigDirty();
      return okResult([]);
    }

    if (action === "route") {
      const modeError = requireCiscoMode(["global-config"], "% ip route is only valid in global configuration mode.");
      if (modeError) return modeError;
      const network = parsed.args[1];
      const mask = parsed.args[2];
      const nextHop = parsed.args[3];
      if (!network || !mask || !nextHop) {
        return errorResult("% ip route requires destination network, mask, and next-hop.", "syntax_error");
      }

      session.state.router.staticRoutes = (session.state.router.staticRoutes || []).filter((route) => !(route.network === network && route.mask === mask));
      session.state.router.staticRoutes.push({ network, mask, nextHop });
      markCiscoConfigDirty();
      return okResult([]);
    }

    return errorResult("% Unsupported ip subcommand in this trainer.", "wrong_context");
  }

  function executeCiscoNo(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const subcommand = String(parsed.args[0] || "").toLowerCase();
    if (subcommand !== "shutdown") {
      return errorResult("% Unsupported no subcommand in this trainer.", "wrong_context");
    }

    const modeError = requireCiscoMode(["interface-config"], "% no shutdown is only valid in interface configuration mode.");
    if (modeError) return modeError;
    const iface = ciscoSelectedInterface();
    if (!iface) return errorResult("% No interface selected.", "wrong_context");

    iface.adminUp = true;
    iface.lineProtocol = true;
    markCiscoConfigDirty();
    return okResult([`${iface.name} changed state to up`]);
  }

  function executeCiscoShutdown() {
    if (!isCiscoState()) return executeShutdown();
    const modeError = requireCiscoMode(["interface-config"], "% shutdown is only valid in interface configuration mode.");
    if (modeError) return modeError;
    const iface = ciscoSelectedInterface();
    if (!iface) return errorResult("% No interface selected.", "wrong_context");

    iface.adminUp = false;
    iface.lineProtocol = false;
    markCiscoConfigDirty();
    return okResult([`${iface.name} changed state to administratively down`]);
  }

  function executeCiscoWrite(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["privileged-exec"], "% write memory requires privileged EXEC mode.");
    if (modeError) return modeError;
    if (String(parsed.args.join(" ")).toLowerCase() !== "memory") {
      return errorResult("% write memory is the supported write command in this trainer.", "syntax_error");
    }

    saveCiscoRunningConfig();
    return okResult(["Building configuration...", "[OK]"]);
  }

  function executeCiscoCopy(parsed) {
    if (!isCiscoState()) return errorResult("That command is not available in this training shell.", "invalid_command");
    const modeError = requireCiscoMode(["privileged-exec"], "% copy running-config startup-config requires privileged EXEC mode.");
    if (modeError) return modeError;
    if (String(parsed.args.join(" ")).toLowerCase() !== "running-config startup-config") {
      return errorResult("% copy running-config startup-config is the supported save form in this trainer.", "syntax_error");
    }

    saveCiscoRunningConfig();
    return okResult(["Destination filename [startup-config]?", "", "Building configuration...", "[OK]"]);
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
    const imageName = firstValueAfter(parsed, ["/IM"]);
    let targetPid = pid;

    if (!targetPid && imageName) {
      targetPid = (StateManager.listProcesses(session.state).find((process) => String(process.name).toLowerCase() === String(imageName).toLowerCase()) || {}).pid;
    }

    if (!targetPid) return errorResult("ERROR: The /PID option requires a process id.", "syntax_error");
    const killed = StateManager.killProcess(session.state, targetPid);
    if (!killed.ok) return errorResult(killed.error);
    return okResult(`SUCCESS: Sent termination signal to PID ${targetPid}.`);
  }

  function executePing(parsed) {
    const targetValue = parsed.args[0];
    if (!targetValue) return errorResult(isCiscoState() ? "% ping requires a destination." : "ping: missing destination", "syntax_error");
    const target = resolveNetworkTarget(targetValue);
    if (!target || !target.reachable) {
      if (isCiscoState()) {
        return errorResult(`% Unrecognized host or address, or protocol not running.`, "runtime_error");
      }
      return StateManager.isWindowsState(session.state)
        ? errorResult(`Ping request could not find host ${targetValue}.`)
        : errorResult(`PING ${targetValue}: host unreachable`);
    }

    if (isCiscoState()) {
      return okResult([
        `Type escape sequence to abort.`,
        `Sending 5, 100-byte ICMP Echos to ${target.ip}, timeout is 2 seconds:`,
        "!!!!!",
        "Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms"
      ]);
    }

    if (StateManager.isWindowsState(session.state)) {
      return okResult(formatWindowsPing(target));
    }

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

  function executeTracert(parsed) {
    const targetValue = parsed.args[0];
    if (!targetValue) return errorResult("Unable to resolve target system name.", "syntax_error");
    const target = resolveNetworkTarget(targetValue);
    if (!target || !target.reachable) return errorResult(`Unable to resolve target system name ${targetValue}.`);
    return okResult([
      `Tracing route to ${target.hostname || target.ip} [${target.ip}]`,
      "over a maximum of 30 hops:",
      "",
      "  1    <1 ms    <1 ms    <1 ms  192.168.56.1",
      `  2    <1 ms    <1 ms    <1 ms  ${target.ip}`,
      "",
      "Trace complete."
    ]);
  }

  function executeTraceroute(parsed) {
    const targetValue = parsed.args[0];
    if (!targetValue) return errorResult("% traceroute requires a destination.", "syntax_error");
    const target = resolveNetworkTarget(targetValue);
    if (!target || !target.reachable) return errorResult(`% Unrecognized host or address, or protocol not running.`, "runtime_error");
    return okResult([
      `Type escape sequence to abort.`,
      `Tracing the route to ${target.hostname || target.ip} [${target.ip}]`,
      "",
      "  1  198.51.100.2  1 msec  1 msec  1 msec",
      `  2  ${target.ip}  2 msec  2 msec  2 msec`
    ]);
  }

  function executePathping(parsed) {
    const targetValue = parsed.args[0];
    if (!targetValue) return errorResult("Unable to resolve target system name.", "syntax_error");
    const target = resolveNetworkTarget(targetValue);
    if (!target || !target.reachable) return errorResult(`Unable to resolve target system name ${targetValue}.`);
    return okResult([
      `Tracing route to ${target.hostname || target.ip} [${target.ip}]`,
      "  0  LAB-WIN [192.168.56.25]",
      "  1  192.168.56.1",
      `  2  ${target.ip}`,
      "",
      "Computing statistics for 50 seconds...",
      "Source to Here   This Node/Link",
      "Hop  RTT    Lost/Sent = Pct  Lost/Sent = Pct  Address",
      `  2    1ms     0/ 100 =  0%     0/ 100 =  0%  ${target.ip}`
    ]);
  }

  function executeNslookup(parsed) {
    const query = parsed.args[0];
    if (!query) return errorResult("*** Can't find server address", "syntax_error");
    const adapter = (session.state.networkAdapters || [])[0] || {};
    const server = (adapter.dns || [])[0] || adapter.gateway || "192.168.56.1";
    const target = resolveNetworkTarget(query);
    const resolved = target?.reachable ? target.ip : null;

    if (!resolved) {
      return okResult([
        `Server:  ${server}`,
        `Address: ${server}`,
        "",
        `*** ${server} can't find ${query}: Non-existent domain`
      ]);
    }

    return okResult([
      `Server:  ${server}`,
      `Address: ${server}`,
      "",
      `Name:    ${target.hostname || query}`,
      `Address: ${resolved}`
    ]);
  }

  function executeIpconfig(parsed) {
    return okResult(formatIpconfigOutput(hasFlag(parsed, "/ALL")));
  }

  function executeNetstat(parsed) {
    return okResult(formatNetstatOutput(hasFlag(parsed, "-o", "-O")));
  }

  function executeArp() {
    return okResult(formatArpOutput());
  }

  function executeRoute(parsed) {
    if (String(parsed.args[0] || "").toLowerCase() !== "print") {
      return errorResult("The syntax of this command is:\nROUTE [-f] [-p] [command [destination] [MASK netmask] [gateway] [METRIC metric]]", "syntax_error");
    }
    return okResult(formatRoutePrintOutput());
  }

  function executeGetmac() {
    return okResult((session.state.networkAdapters || []).map((adapter) =>
      `${String(adapter.mac).padEnd(20)} ${adapter.name}`));
  }

  function executeSc(parsed) {
    const action = String(parsed.args[0] || "").toLowerCase();
    if (action !== "query") return errorResult("[SC] Unsupported action in this trainer.", "wrong_context");
    const serviceName = parsed.args.slice(1).join(" ").trim();

    if (!serviceName) {
      return okResult((session.state.services || []).flatMap((service) => [
        `SERVICE_NAME: ${service.name}`,
        `        STATE              : ${service.status === "RUNNING" ? "4  RUNNING" : "1  STOPPED"}`,
        ""
      ]));
    }

    const service = findServiceRecord(serviceName);
    if (!service) return errorResult(`[SC] OpenService FAILED 1060:\nThe specified service does not exist as an installed service.`);
    return okResult(formatServiceQueryOutput(service));
  }

  function executeNet(parsed) {
    const action = String(parsed.args[0] || "").toLowerCase();
    const subject = parsed.args.slice(1).join(" ").trim();

    if (action === "start") {
      if (!subject) {
        return okResult((session.state.services || [])
          .filter((service) => service.status === "RUNNING")
          .map((service) => service.displayName || service.name));
      }

      const service = findServiceRecord(subject);
      if (!service) return errorResult(`The service name is invalid.`);
      service.status = "RUNNING";
      return okResult(`The ${service.displayName || service.name} service was started successfully.`);
    }

    if (action === "stop") {
      const service = findServiceRecord(subject);
      if (!service) return errorResult(`The service name is invalid.`);
      service.status = "STOPPED";
      return okResult(`The ${service.displayName || service.name} service was stopped successfully.`);
    }

    if (action === "user") {
      if (!subject) {
        return okResult((session.state.localUsers || []).map((user) => user.username));
      }
      const user = findUserRecord(subject);
      if (!user) return errorResult("The user name could not be found.");
      return okResult(formatNetUserOutput(user));
    }

    if (action === "localgroup") {
      if (!subject) {
        return okResult((session.state.localGroups || []).map((group) => group.name));
      }
      const group = findGroupRecord(subject);
      if (!group) return errorResult("There is no such global user or group.");
      return okResult(formatLocalGroupOutput(group));
    }

    if (action === "use") {
      if (!subject) {
        return okResult(formatMappedShares());
      }

      const [drive, unc] = parsed.args.slice(1);
      if (!drive || !unc) return errorResult("The syntax of this command is:\nNET USE [devicename] [\\\\computer\\share]");
      session.state.mappedShares = (session.state.mappedShares || []).filter((entry) => String(entry.drive).toUpperCase() !== String(drive).toUpperCase());
      session.state.mappedShares.push({ drive, unc });
      return okResult([
        "The command completed successfully.",
        `${drive} is now connected to ${unc}`
      ]);
    }

    if (action === "share") {
      if (!subject) {
        return okResult(formatNetShareOutput(session.state.shares || []));
      }
      const share = findShareRecord(subject);
      if (!share) return errorResult("The share name could not be found.");
      return okResult(formatNetShareOutput([share]));
    }

    return errorResult("That NET subcommand is not available in this training build.", "wrong_context");
  }

  function executeWmic(parsed) {
    const query = parsed.args.join(" ").trim().toLowerCase();
    if (query !== "process list brief") return errorResult("WMIC: unsupported alias in this trainer.", "wrong_context");
    return okResult(formatWmicProcessOutput());
  }

  function executeDriverquery() {
    return okResult(formatDriverQueryOutput());
  }

  function executeQuery(parsed) {
    const subject = String(parsed.args[0] || "").toLowerCase();
    if (subject !== "user") return errorResult("QUERY: unsupported object in this trainer.", "wrong_context");
    return okResult(formatQueryUserOutput());
  }

  function executeWhere(parsed) {
    const pattern = String(parsed.args[0] || "").trim();
    if (!pattern) return errorResult("INFO: Could not find files for the given pattern(s).", "syntax_error");
    const basePattern = pattern.toLowerCase().replace(/\.exe$/i, "");
    const matches = (session.state.pathExecutables || []).filter((entry) => {
      const name = String(entry).split("\\").pop().toLowerCase().replace(/\.exe$/i, "");
      return name === basePattern || name.includes(basePattern.replace(/\*/g, ""));
    });
    if (!matches.length) return errorResult("INFO: Could not find files for the given pattern(s).");
    return okResult(matches);
  }

  function executeFc(parsed) {
    if (parsed.args.length < 2) return errorResult("FC: insufficient parameters", "syntax_error");
    const left = StateManager.readFile(session.state, parsed.args[0]);
    if (!left.ok) return errorResult(left.error);
    const right = StateManager.readFile(session.state, parsed.args[1]);
    if (!right.ok) return errorResult(right.error);
    return okResult(formatFcOutput(parsed.args[0], parsed.args[1], normalizeTextLines(left.content.split(/\r?\n/)), normalizeTextLines(right.content.split(/\r?\n/))));
  }

  function executeShutdown(parsed) {
    if (isCiscoState()) {
      return executeCiscoShutdown(parsed);
    }
    if (hasFlag(parsed, "/A")) {
      session.state.pendingShutdown = null;
      return okResult("Shutdown cancelled.");
    }

    const kind = hasFlag(parsed, "/R") ? "restart" : "shutdown";
    const timeoutValue = Number(firstValueAfter(parsed, ["/T"])) || 0;
    session.state.pendingShutdown = { kind, timeout: timeoutValue };
    return okResult(`Shutdown scheduled: ${kind} in ${timeoutValue} second(s).`);
  }

  function executeSchtasks(parsed) {
    if (!parsed.args.length || hasFlag(parsed, "/QUERY")) {
      const taskName = firstValueAfter(parsed, ["/TN"]);
      if (taskName) {
        const task = findScheduledTask(taskName);
        if (!task) return errorResult("ERROR: The system cannot find the file specified.");
        return okResult(formatSchtasksOutput([task]));
      }
      return okResult(formatSchtasksOutput(session.state.scheduledTasks || []));
    }

    return errorResult("SCHTASKS: unsupported action in this trainer.", "wrong_context");
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
    const requestedPortValue = firstValueAfter(parsed, ["-p"]);
    if (!hasValidPortListSyntax(requestedPortValue)) {
      return errorResult(`nmap: illegal port specification: ${requestedPortValue}`, "syntax_error");
    }

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
      if (/^(EHLO|HELO)\s+/i.test(raw)) {
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

  function commandAllowedInCurrentShell(command) {
    if (!command) return true;

    if (isCiscoState()) {
      const ciscoCommands = new Set([
        "enable", "disable", "configure", "exit", "end", "write", "copy", "show",
        "hostname", "interface", "ip", "no", "shutdown", "description", "ping", "traceroute"
      ]);
      return ciscoCommands.has(command);
    }

    const windowsShell = StateManager.isWindowsState(session.state);
    if (!windowsShell && session.state.metasploit.active && command === "set") {
      return true;
    }

    const windowsOnly = new Set([
      "dir", "type", "find", "findstr", "tree", "rmdir", "rd", "copy", "xcopy", "move", "del", "erase", "ren", "rename", "more", "attrib",
      "hostname", "whoami", "systeminfo", "set", "ver", "date", "time", "cls", "prompt",
      "ipconfig", "tracert", "pathping", "nslookup", "netstat", "arp", "route", "getmac",
      "tasklist", "taskkill", "sc", "net", "wmic", "driverquery", "query", "where", "fc", "shutdown", "schtasks"
    ]);
    const linuxOnly = new Set(["pwd", "ls", "touch", "cat", "grep", "cp", "mv", "rm", "ps", "kill", "wget", "searchsploit"]);
    const ciscoOnly = new Set(["enable", "disable", "configure", "show", "end", "write", "interface", "ip", "no", "description", "traceroute"]);

    if (windowsShell) {
      return !linuxOnly.has(command) && !ciscoOnly.has(command);
    }

    return !windowsOnly.has(command) && !ciscoOnly.has(command);
  }

  function executeCommand(parsed, pipedInput = []) {
    if (!parsed.command) return okResult([]);

    if (!commandAllowedInCurrentShell(parsed.command)) {
      return errorResult("That command is not available in this training shell.", "invalid_command");
    }

    if (session.state.activeConnection) {
      return executeActiveConnection(parsed);
    }

    if (session.state.metasploit.active && parsed.command !== "msfconsole") {
      return executeMetasploit(parsed);
    }

    switch (parsed.command) {
      case "enable":
        return executeCiscoEnable(parsed);
      case "disable":
        return executeCiscoDisable(parsed);
      case "configure":
        return executeCiscoConfigure(parsed);
      case "exit":
        return executeCiscoExit(parsed);
      case "end":
        return executeCiscoEnd(parsed);
      case "show":
        return executeCiscoShow(parsed);
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
      case "find":
        return executeFind(parsed, pipedInput);
      case "grep":
        return executeGrep(parsed, pipedInput);
      case "findstr":
        return executeFindstr(parsed, pipedInput);
      case "tree":
        return executeTree(parsed);
      case "cp":
        return executeCp(parsed);
      case "copy":
        return executeCopy(parsed);
      case "xcopy":
        return executeXcopy(parsed);
      case "mv":
        return executeMv(parsed);
      case "move":
        return executeMove(parsed);
      case "rm":
        return executeRm(parsed);
      case "rmdir":
      case "rd":
        return executeRmdir(parsed);
      case "del":
      case "erase":
        return executeDel(parsed);
      case "ren":
      case "rename":
        return executeRen(parsed);
      case "more":
        return executeMore(parsed, pipedInput);
      case "attrib":
        return executeAttrib(parsed);
      case "hostname":
        return executeHostname(parsed);
      case "whoami":
        return executeWhoami(parsed);
      case "systeminfo":
        return executeSysteminfo(parsed);
      case "set":
        return executeSet(parsed);
      case "ver":
        return executeVer(parsed);
      case "date":
        return executeDate(parsed);
      case "time":
        return executeTime(parsed);
      case "cls":
        return executeCls(parsed);
      case "prompt":
        return executePrompt(parsed);
      case "write":
        return executeCiscoWrite(parsed);
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
      case "tracert":
        return executeTracert(parsed);
      case "traceroute":
        return executeTraceroute(parsed);
      case "pathping":
        return executePathping(parsed);
      case "nslookup":
        return executeNslookup(parsed);
      case "ipconfig":
        return executeIpconfig(parsed);
      case "netstat":
        return executeNetstat(parsed);
      case "arp":
        return executeArp(parsed);
      case "route":
        return executeRoute(parsed);
      case "getmac":
        return executeGetmac(parsed);
      case "sc":
        return executeSc(parsed);
      case "net":
        return executeNet(parsed);
      case "wmic":
        return executeWmic(parsed);
      case "driverquery":
        return executeDriverquery(parsed);
      case "query":
        return executeQuery(parsed);
      case "where":
        return executeWhere(parsed);
      case "fc":
        return executeFc(parsed);
      case "shutdown":
        return executeShutdown(parsed);
      case "interface":
        return executeCiscoInterface(parsed);
      case "ip":
        return executeCiscoIp(parsed);
      case "no":
        return executeCiscoNo(parsed);
      case "description":
        return executeCiscoDescription(parsed);
      case "schtasks":
        return executeSchtasks(parsed);
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
        stderr: [],
        clearScreen: false
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
      stderr: result.stderr,
      clearScreen: Boolean(result.clearScreen)
    };
  }

  function presentExecution(execution) {
    if (execution.clearScreen) {
      clearTerminal();
    }

    if (execution.stdout.length) {
      printLines(execution.stdout, "system");
    }

    if (execution.stderr.length) {
      printLines(execution.stderr, "error");
    }
  }

  function evaluateCurrentStep(execution) {
    const step = currentStep();

    const evaluation = CoachEngine.evaluateAttempt(
      step,
      execution,
      session.state,
      session.attemptsForStep + 1
    );

    if (!evaluation.success && evaluation.countsAsAttempt !== false) {
      session.attemptsForStep += 1;
    }

    if (!evaluation.success && evaluation.classification !== "exploration") {
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
      if (step.whyThisMatters) {
        printLine(`Why this matters: ${step.whyThisMatters}`, "dim");
      }
      advanceStep(evaluation.advanceBy || 1);
      return;
    }

    if (evaluation.countsAsAttempt !== false) {
      session.hintLevel = Math.max(session.hintLevel, CoachEngine.getHintTierFromAttempts(session.attemptsForStep));
    }

    printLine(
      evaluation.feedback,
      evaluation.classification === "invalid_command" ? "error" : evaluation.classification === "exploration" ? "system" : "coach"
    );
    printLine(evaluation.coach, "dim");
    if (evaluation.hint) {
      printLine(`Hint [${hintContextLabel()}]: ${evaluation.hint}`, "coach");
    }
    if (execution.status === "syntax_error" || execution.status === "invalid_command") {
      const reference = getCommandReference(execution.raw);
      if (reference) {
        printLine(`Reference: ${reference.command} -> ${reference.meaning}`, "dim");
      }
    }
    renderPanel();
  }

  function runSubmittedCommand(event) {
    event.preventDefault();
    const rawInput = els.terminalInput.value.trim();
    if (!rawInput) return;

    if (!session.scenarioStarted) {
      els.terminalInput.value = "";
      printLine("Start the selected challenge before issuing commands.", "coach");
      renderPanel();
      return;
    }

    syncTerminalHistoryState(true);
    printLine(`${getPromptLabel()} ${rawInput}`, "command");
    pushHistory(rawInput);
    els.terminalInput.value = "";

    const execution = executeInput(rawInput);
    presentExecution(execution);
    updatePrompt();

    if (!session.scenarioCompleted) {
      evaluateCurrentStep(execution);
    }

    renderPanel();
    persistSectionProgress();
    if (document.activeElement === els.terminalInput) {
      scheduleMobileTerminalReveal(0);
    }
  }

  function showHint() {
    if (!session.scenarioStarted) {
      printLine("Start the selected challenge before requesting hints.", "coach");
      return;
    }

    if (session.scenarioCompleted) {
      printLine("This scenario is already complete. Move on or reset it for a cleaner run.", "coach");
      return;
    }

    if (scenarioUsesChallengePresentation()) {
      const nextHintLevel = Math.min(2, session.hintLevel + 1);
      const requiredAttempts = Array.isArray(pageConfig.challengeHintAttempts)
        ? (pageConfig.challengeHintAttempts[nextHintLevel] ?? (nextHintLevel + 1))
        : (nextHintLevel + 1);

      if (session.attemptsForStep < requiredAttempts) {
        printLine(
          `Challenge hints unlock after ${requiredAttempts} unsuccessful attempt${requiredAttempts === 1 ? "" : "s"}. Keep investigating first.`,
          "coach"
        );
        renderPanel();
        return;
      }
    }

    session.hintLevel = Math.min(2, session.hintLevel + 1);
    const hint = CoachEngine.getHint(currentStep(), session.hintLevel, session.state);
    printLine(`Hint ${session.hintLevel + 1} [${hintContextLabel()}]: ${hint}`, "coach");
    renderPanel();
    persistSectionProgress();
  }

  function resetScenario() {
    if (!session.scenarioStarted && pageConfig.autoStart === false) {
      previewScenario(session.scenarioIndex);
      return;
    }

    loadScenario(session.scenarioIndex);
  }

  function nextScenario() {
    loadScenario(session.scenarioIndex + 1);
  }

  function previousScenario() {
    loadScenario(session.scenarioIndex - 1);
  }

  function bindEvents() {
    if (els.terminalForm) {
      els.terminalForm.addEventListener("submit", runSubmittedCommand);
    }
    if (els.hintBtn) {
      els.hintBtn.addEventListener("click", showHint);
    }
    if (els.previousScenarioBtn) {
      els.previousScenarioBtn.addEventListener("click", previousScenario);
    }
    if (els.resetScenarioBtn) {
      els.resetScenarioBtn.addEventListener("click", resetScenario);
    }
    if (els.nextScenarioBtn) {
      els.nextScenarioBtn.addEventListener("click", nextScenario);
    }
    if (els.mobileContextToggleBtn) {
      els.mobileContextToggleBtn.addEventListener("click", () => {
        setMobileContextCollapsed(!session.mobileContextCollapsed);
        if (document.activeElement === els.terminalInput) {
          scheduleMobileTerminalReveal(0);
        }
      });
    }

    if (els.terminalInput) {
      els.terminalInput.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          recallHistory(-1);
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          recallHistory(1);
        }
      });

      els.terminalInput.addEventListener("focus", () => {
        session.mobileBlurTimer = cancelScheduledTimeout(session.mobileBlurTimer);
        syncMobileInputState(true);
        syncMobileViewportMetrics();
        scheduleMobileTerminalReveal();
      });

      els.terminalInput.addEventListener("click", () => {
        if (!isMobileTerminalLayout()) return;
        syncMobileInputState(true);
        scheduleMobileTerminalReveal(0);
      });

      els.terminalInput.addEventListener("blur", () => {
        session.mobileBlurTimer = cancelScheduledTimeout(session.mobileBlurTimer);
        session.mobileBlurTimer = window.setTimeout(() => {
          session.mobileBlurTimer = 0;
          if (document.activeElement !== els.terminalInput) {
            syncMobileInputState(false);
            syncMobileViewportMetrics();
          }
        }, 140);
      });
    }

    if (els.terminalOutput) {
      els.terminalOutput.addEventListener("scroll", () => {
        syncTerminalHistoryState();
      }, { passive: true });

      els.terminalOutput.addEventListener("click", (event) => {
        if (!usesInlineMobileInput() || shouldIgnoreTerminalTap(event.target)) {
          return;
        }
        focusTerminalInputAtEnd();
      });
    }

    if (els.terminalJumpTopBtn) {
      els.terminalJumpTopBtn.addEventListener("click", jumpTerminalHistoryTop);
    }

    if (els.terminalJumpLatestBtn) {
      els.terminalJumpLatestBtn.addEventListener("click", jumpTerminalHistoryLatest);
    }

    const handleViewportResize = () => {
      syncMobileViewportMetrics();
      if (document.activeElement === els.terminalInput) {
        scheduleMobileTerminalReveal(48);
      }
    };

    const handleViewportScroll = () => {
      // Ignore passive viewport drags while the learner is reviewing terminal history.
      // We only need live viewport-sync here when the prompt is focused and the keyboard is actually involved.
      if (document.activeElement === els.terminalInput && document.body.classList.contains("terminal-mobile-keyboard-open")) {
        syncMobileViewportMetrics();
      }
    };

    window.addEventListener("resize", handleViewportResize);
    window.addEventListener("orientationchange", handleViewportResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportScroll);
    }

    window.addEventListener("netlab:authchange", () => {
      savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(currentSectionId()) : null;
      session.resumePromptVisible = Boolean(savedProgressRecord);
      renderSectionShell();
    });

    window.addEventListener("netlab:progresschange", () => {
      savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(currentSectionId()) : null;
      if (!savedProgressRecord) {
        session.resumePromptVisible = false;
      }
      renderSectionShell();
    });

    window.addEventListener("netlab:profilemetachange", () => {
      renderSectionShell();
    });
  }

  function loadScenarioById(id) {
    const index = session.scenarios.findIndex((scenario) => scenario.id === id);
    if (index === -1) return false;
    loadScenario(index);
    return true;
  }

  function previewScenarioById(id) {
    const index = session.scenarios.findIndex((scenario) => scenario.id === id);
    if (index === -1) return false;
    previewScenario(index);
    return true;
  }

  window.TerminalEngine = {
    getScenarios: () => session.scenarios.slice(),
    getCurrentScenario: () => currentScenario(),
    loadScenario,
    loadScenarioById,
    previewScenario,
    previewScenarioById,
    resetScenario,
    nextScenario,
    previousScenario
  };

  async function bootTerminalEngine() {
    bindEvents();
    syncTerminalInputPlacement();
    setMobileContextCollapsed(false);
    syncMobileViewportMetrics();
    syncTerminalHistoryState(true);

    if (NetlabApp?.whenReady) {
      await NetlabApp.whenReady();
    }

    if (NetlabApp?.getLaunchAction() === "start") {
      NetlabApp.resetSectionProgress(currentSectionId());
      NetlabApp.clearLaunchAction();
    }
    savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(currentSectionId()) : null;
    session.resumePromptVisible = Boolean(savedProgressRecord && NetlabApp?.getLaunchAction() !== "resume");

    if (NetlabApp?.getLaunchAction() === "resume" && savedProgressRecord && restoreSavedProgress(savedProgressRecord)) {
      return;
    }

    if (NetlabApp?.getLaunchAction()) {
      NetlabApp.clearLaunchAction();
    }

    if (pageConfig.autoStart === false) {
      previewScenario(0);
    } else {
      loadScenario(0, { persist: false });
    }

    if (!savedProgressRecord) {
      persistSectionProgress();
    }
  }

  bootTerminalEngine();
})();
