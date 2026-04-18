(function () {
  const { StateManager, CoachEngine, ScenarioEngine, CommandsData } = window;
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
    linuxTrackLink: document.getElementById("linuxTrackLink"),
    windowsTrackLink: document.getElementById("windowsTrackLink"),
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
    mobileContextCollapsed: false
  };

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
    return Boolean(
      isMobileTerminalLayout()
      && els.terminalInlineInputSlot
      && els.terminalDockInputMount
      && els.terminalForm
    );
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
      return;
    }

    document.body.classList.toggle("terminal-mobile-active", Boolean(active));
    document.body.classList.toggle("terminal-mobile-context-collapsed", session.mobileContextCollapsed);
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

    if (!isMobileTerminalLayout()) {
      document.body.classList.remove("terminal-mobile-active", "terminal-mobile-keyboard-open");
      document.body.style.removeProperty("--terminal-mobile-viewport-height");
      document.body.style.removeProperty("--terminal-visual-keyboard-offset");
      document.body.style.removeProperty("--terminal-mobile-dock-space");
      return;
    }

    session.mobileViewportRaf = window.requestAnimationFrame(() => {
      session.mobileViewportRaf = 0;
      // visualViewport gives the keyboard-safe visible area on Android/iOS so the fixed dock can stay above the IME.
      const { visibleHeight, keyboardOffset } = mobileViewportMetrics();
      const inputActive = document.activeElement === els.terminalInput;

      document.body.style.setProperty("--terminal-mobile-viewport-height", `${visibleHeight}px`);
      document.body.style.setProperty("--terminal-visual-keyboard-offset", `${keyboardOffset}px`);
      document.body.classList.toggle("terminal-mobile-keyboard-open", inputActive && keyboardOffset > 0);
      measureTerminalDockSpace();
    });
  }

  function revealActiveTerminalInput() {
    if (!isMobileTerminalLayout() || !els.terminalInput || document.activeElement !== els.terminalInput) {
      return;
    }

    const panel = els.terminalPanel;
    const focusTarget = els.terminalForm || els.terminalInput;
    const inlineMobileInput = usesInlineMobileInput();
    if (!panel) return;

    // Keep the terminal feed on its own scroller so mobile layout changes do not hide the newest output.
    scrollTerminal();
    syncMobileViewportMetrics();

    const { visibleHeight, offsetTop } = mobileViewportMetrics();
    const safeTop = offsetTop + 10;
    const safeBottom = offsetTop + visibleHeight - 14;
    const panelRect = panel.getBoundingClientRect();
    const focusRect = focusTarget.getBoundingClientRect();

    if (panelRect.top < safeTop || panelRect.bottom > safeBottom) {
      // Use the nearest edge so the browser keeps the terminal stable instead of snapping the viewport back to the panel start.
      panel.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    }

    if (focusRect.top < safeTop || focusRect.bottom > safeBottom) {
      // Scroll the live input row itself into view so repeated taps keep the current prompt visible without large page jumps.
      focusTarget.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
    }

    if (inlineMobileInput) {
      return;
    }

    const dockRect = (els.terminalMobileDock || focusTarget).getBoundingClientRect();
    const promptRect = (els.terminalPrompt || focusTarget).getBoundingClientRect();

    if (dockRect.bottom > safeBottom) {
      window.scrollBy({ top: dockRect.bottom - safeBottom + 12, behavior: "auto" });
    } else if (promptRect.top < safeTop) {
      window.scrollBy({ top: promptRect.top - safeTop - 8, behavior: "auto" });
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

    return scenario?.shell === "cmd" ? "windows" : "linux";
  }

  function scenarioEnvironmentLabel(scenario = currentScenario()) {
    if (scenario?.environmentLabel) {
      return scenario.environmentLabel;
    }

    const category = scenarioEnvironmentCategory(scenario);
    if (category === "windows") return "Windows Terminal Learning";
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

  function scrollTerminal() {
    if (!els.terminalOutput) return;
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
    if (document.activeElement === els.terminalInput) {
      scheduleMobileTerminalReveal(0);
    }
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
    syncMobileViewportMetrics();
    if (focus && els.terminalInput && !isMobileTerminalLayout()) {
      els.terminalInput.focus();
    }
  }

  function previewScenario(index) {
    loadScenario(index, { announce: false, transition: false, focus: false });
  }

  function markScenarioComplete() {
    session.completedScenarioIds.add(currentScenario().id);
    session.scenarioCompleted = true;
    printLine("Scenario complete. You reached the objective with live command input.", "success");
    renderPanel();
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
      return;
    }
    if (currentStep().context) {
      printLine(`Context: ${currentStep().context}`, "dim");
    }
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

  function executeHostname() {
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
    if (!targetValue) return errorResult("ping: missing destination", "syntax_error");
    const target = resolveNetworkTarget(targetValue);
    if (!target || !target.reachable) {
      return StateManager.isWindowsState(session.state)
        ? errorResult(`Ping request could not find host ${targetValue}.`)
        : errorResult(`PING ${targetValue}: host unreachable`);
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

    if (windowsShell) {
      return !linuxOnly.has(command);
    }

    return !windowsOnly.has(command);
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

    const handleViewportResize = () => {
      syncMobileViewportMetrics();
      if (document.activeElement === els.terminalInput) {
        scheduleMobileTerminalReveal(48);
      }
    };

    const handleViewportScroll = () => {
      // visualViewport scroll also fires during manual page drags on mobile; only refresh the measurements here so the browser
      // does not keep forcing the viewport back to the prompt while the user is trying to inspect recent terminal output.
      syncMobileViewportMetrics();
    };

    window.addEventListener("resize", handleViewportResize);
    window.addEventListener("orientationchange", handleViewportResize);

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportScroll);
    }
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

  bindEvents();
  syncTerminalInputPlacement();
  setMobileContextCollapsed(false);
  syncMobileViewportMetrics();
  if (pageConfig.autoStart === false) {
    previewScenario(0);
  } else {
    loadScenario(0);
  }
})();
