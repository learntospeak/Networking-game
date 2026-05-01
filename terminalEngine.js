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
    terminalHeader: document.querySelector(".terminal-header"),
    terminalMobileDock: document.querySelector(".terminal-mobile-dock"),
    pageKicker: document.getElementById("terminalPageKicker"),
    pageTitle: document.getElementById("terminalPageTitle"),
    pageIntro: document.getElementById("terminalPageIntro"),
    appSectionShell: document.getElementById("appSectionShell"),
    linuxTrackLink: document.getElementById("linuxTrackLink"),
    windowsTrackLink: document.getElementById("windowsTrackLink"),
    ciscoTrackLink: document.getElementById("ciscoTrackLink"),
    challengeTrackLink: document.getElementById("challengeTrackLink"),
    terminalNavLink: document.querySelector(".terminal-nav-link"),
    challengeSelectorPanel: document.querySelector(".challenge-selector-panel"),
    terminalMetaPanel: document.querySelector(".terminal-meta-panel"),
    scenarioPanel: document.querySelector(".scenario-panel"),
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
    scenarioStageTitle: document.getElementById("scenarioStageTitle"),
    scenarioStageBriefing: document.getElementById("scenarioStageBriefing"),
    scenarioFlex: document.getElementById("scenarioFlex"),
    missionCaseFileCard: document.getElementById("missionCaseFileCard"),
    missionCaseTitle: document.getElementById("missionCaseTitle"),
    missionCaseMeta: document.getElementById("missionCaseMeta"),
    missionCaseRole: document.getElementById("missionCaseRole"),
    missionCaseDifficulty: document.getElementById("missionCaseDifficulty"),
    missionCaseEstimatedTime: document.getElementById("missionCaseEstimatedTime"),
    missionCaseType: document.getElementById("missionCaseType"),
    missionBriefingBlock: document.getElementById("missionBriefingBlock"),
    missionBriefingText: document.getElementById("missionBriefingText"),
    missionObjectivesBlock: document.getElementById("missionObjectivesBlock"),
    missionObjectivesList: document.getElementById("missionObjectivesList"),
    missionSuccessBlock: document.getElementById("missionSuccessBlock"),
    missionSuccessList: document.getElementById("missionSuccessList"),
    missionEnvironmentBlock: document.getElementById("missionEnvironmentBlock"),
    missionEnvironmentText: document.getElementById("missionEnvironmentText"),
    missionCurrentStageTitle: document.getElementById("missionCurrentStageTitle"),
    missionCurrentStageBriefing: document.getElementById("missionCurrentStageBriefing"),
    missionStageProgress: document.getElementById("missionStageProgress"),
    missionTotalProgress: document.getElementById("missionTotalProgress"),
    missionReviewCard: document.getElementById("missionReviewCard"),
    missionReviewOverall: document.getElementById("missionReviewOverall"),
    reviewTroubleshootingScore: document.getElementById("reviewTroubleshootingScore"),
    reviewTroubleshootingFeedback: document.getElementById("reviewTroubleshootingFeedback"),
    reviewAccuracyScore: document.getElementById("reviewAccuracyScore"),
    reviewAccuracyFeedback: document.getElementById("reviewAccuracyFeedback"),
    reviewEfficiencyScore: document.getElementById("reviewEfficiencyScore"),
    reviewEfficiencyFeedback: document.getElementById("reviewEfficiencyFeedback"),
    reviewVerificationScore: document.getElementById("reviewVerificationScore"),
    reviewVerificationFeedback: document.getElementById("reviewVerificationFeedback"),
    reviewRiskScore: document.getElementById("reviewRiskScore"),
    reviewRiskFeedback: document.getElementById("reviewRiskFeedback"),
    missionReviewStrengths: document.getElementById("missionReviewStrengths"),
    missionReviewImprovements: document.getElementById("missionReviewImprovements"),
    missionReviewTakeaway: document.getElementById("missionReviewTakeaway"),
    beginnerLabCard: document.getElementById("beginnerLabCard"),
    beginnerLabCurrentLevel: document.getElementById("beginnerLabCurrentLevel"),
    beginnerLabCurrentMission: document.getElementById("beginnerLabCurrentMission"),
    beginnerLabCurrentTask: document.getElementById("beginnerLabCurrentTask"),
    beginnerLabProgressText: document.getElementById("beginnerLabProgressText"),
    currentTaskCard: document.getElementById("currentTaskCard"),
    progressCard: document.getElementById("progressCard"),
    ticketBriefingOverlay: document.getElementById("ticketBriefingOverlay"),
    ticketBriefingCard: document.getElementById("ticketBriefingCard"),
    ticketBriefingTitle: document.getElementById("ticketBriefingTitle"),
    ticketBriefingCloseBtn: document.getElementById("ticketBriefingCloseBtn"),
    ticketBriefingId: document.getElementById("ticketBriefingId"),
    ticketBriefingPriority: document.getElementById("ticketBriefingPriority"),
    ticketBriefingReportedBy: document.getElementById("ticketBriefingReportedBy"),
    ticketBriefingReportedTime: document.getElementById("ticketBriefingReportedTime"),
    ticketBriefingRole: document.getElementById("ticketBriefingRole"),
    ticketBriefingEstimatedTime: document.getElementById("ticketBriefingEstimatedTime"),
    ticketBriefingAffectedBlock: document.getElementById("ticketBriefingAffectedBlock"),
    ticketBriefingAffectedSystem: document.getElementById("ticketBriefingAffectedSystem"),
    ticketBriefingSummaryBlock: document.getElementById("ticketBriefingSummaryBlock"),
    ticketBriefingSummary: document.getElementById("ticketBriefingSummary"),
    ticketBriefingUserReportBlock: document.getElementById("ticketBriefingUserReportBlock"),
    ticketBriefingUserReport: document.getElementById("ticketBriefingUserReport"),
    ticketBriefingSymptomsBlock: document.getElementById("ticketBriefingSymptomsBlock"),
    ticketBriefingSymptoms: document.getElementById("ticketBriefingSymptoms"),
    ticketBriefingKnownFactsBlock: document.getElementById("ticketBriefingKnownFactsBlock"),
    ticketBriefingKnownFacts: document.getElementById("ticketBriefingKnownFacts"),
    ticketBriefingObjectiveBlock: document.getElementById("ticketBriefingObjectiveBlock"),
    ticketBriefingObjective: document.getElementById("ticketBriefingObjective"),
    ticketBriefingConstraintsBlock: document.getElementById("ticketBriefingConstraintsBlock"),
    ticketBriefingConstraints: document.getElementById("ticketBriefingConstraints"),
    ticketBriefingTagsBlock: document.getElementById("ticketBriefingTagsBlock"),
    ticketBriefingTags: document.getElementById("ticketBriefingTags"),
    ticketBriefingEscalationBlock: document.getElementById("ticketBriefingEscalationBlock"),
    ticketBriefingEscalationNote: document.getElementById("ticketBriefingEscalationNote"),
    ticketBriefingEasterEggBlock: document.getElementById("ticketBriefingEasterEggBlock"),
    ticketBriefingEasterEggNote: document.getElementById("ticketBriefingEasterEggNote"),
    ticketBriefingStartBtn: document.getElementById("ticketBriefingStartBtn"),
    environmentSummary: document.getElementById("environmentSummary"),
    machineContextList: document.getElementById("machineContextList") || document.getElementById("challengeContextList"),
    stepObjective: document.getElementById("stepObjective"),
    coachSignal: document.getElementById("coachSignal"),
    hintLadder: document.getElementById("hintLadder"),
    progressSummary: document.getElementById("progressSummary"),
    layerTransitionBanner: document.getElementById("layerTransitionBanner"),
    beginnerModeBanner: document.getElementById("beginnerModeBanner"),
    beginnerModeSummary: document.getElementById("beginnerModeSummary"),
    beginnerGuideBtn: document.getElementById("beginnerGuideBtn"),
    beginnerTaskStrip: document.getElementById("beginnerTaskStrip"),
    beginnerCurrentTaskText: document.getElementById("beginnerCurrentTaskText"),
    beginnerTaskHelpText: document.getElementById("beginnerTaskHelpText"),
    beginnerHelpStrip: document.getElementById("beginnerHelpStrip"),
    beginnerHelpStripText: document.getElementById("beginnerHelpStripText"),
    taskCompleteCard: document.getElementById("taskCompleteCard"),
    taskCompleteOverlay: document.getElementById("taskCompleteOverlay"),
    taskCompleteCloseBtn: document.getElementById("taskCompleteCloseBtn"),
    taskCompleteProof: document.getElementById("taskCompleteProof"),
    taskCompleteWhy: document.getElementById("taskCompleteWhy"),
    taskCompleteNext: document.getElementById("taskCompleteNext"),
    mobileEnvironmentBadge: document.getElementById("mobileEnvironmentBadge"),
    mobileLayerBadge: document.getElementById("mobileLayerBadge"),
    mobileScenarioTitle: document.getElementById("mobileScenarioTitle"),
    mobileStageTitle: document.getElementById("mobileStageTitle"),
    mobileStageBriefing: document.getElementById("mobileStageBriefing"),
    mobileStepObjective: document.getElementById("mobileStepObjective"),
    mobileMachineContext: document.getElementById("mobileMachineContext"),
    mobileCoachSignal: document.getElementById("mobileCoachSignal"),
    mobileContextToggleBtn: document.getElementById("mobileContextToggleBtn"),
    terminalOutput: document.getElementById("terminalOutput"),
    walkthroughOverlay: document.getElementById("walkthroughOverlay"),
    walkthroughCard: document.getElementById("walkthroughCard"),
    walkthroughTitle: document.getElementById("walkthroughTitle"),
    walkthroughStepCounter: document.getElementById("walkthroughStepCounter"),
    walkthroughGoal: document.getElementById("walkthroughGoal"),
    walkthroughCommand: document.getElementById("walkthroughCommand"),
    walkthroughOutput: document.getElementById("walkthroughOutput"),
    walkthroughExplanation: document.getElementById("walkthroughExplanation"),
    walkthroughPrevBtn: document.getElementById("walkthroughPrevBtn"),
    walkthroughNextBtn: document.getElementById("walkthroughNextBtn"),
    walkthroughTryBtn: document.getElementById("walkthroughTryBtn"),
    walkthroughCloseBtn: document.getElementById("walkthroughCloseBtn"),
    terminalJumpTopBtn: document.getElementById("terminalJumpTopBtn"),
    terminalJumpLatestBtn: document.getElementById("terminalJumpLatestBtn"),
    terminalControls: document.querySelector(".terminal-controls"),
    terminalInlineInputSlot: document.getElementById("terminalInlineInputSlot"),
    terminalMobileControlMount: document.getElementById("terminalMobileControlMount"),
    terminalDockInputMount: document.getElementById("terminalDockInputMount"),
    terminalForm: document.getElementById("terminalForm"),
    terminalPrompt: document.getElementById("terminalPrompt"),
    terminalInput: document.getElementById("terminalInput"),
    hintBtn: document.getElementById("hintBtn"),
    watchWalkthroughBtn: document.getElementById("watchWalkthroughBtn"),
    commandSheetBtn: document.getElementById("commandSheetBtn"),
    previousScenarioBtn: document.getElementById("previousScenarioBtn"),
    resetScenarioBtn: document.getElementById("resetScenarioBtn"),
    nextScenarioBtn: document.getElementById("nextScenarioBtn"),
    beginnerOnboardingOverlay: document.getElementById("beginnerOnboardingOverlay"),
    beginnerOnboardingCard: document.getElementById("beginnerOnboardingCard"),
    beginnerOnboardingStartBtn: document.getElementById("beginnerOnboardingStartBtn"),
    beginnerOnboardingWalkthroughBtn: document.getElementById("beginnerOnboardingWalkthroughBtn")
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
    reviewStats: null,
    resumePromptVisible: false,
    outputPinnedToLatest: true,
    debugScenarioKey: "",
    debugStageKey: "",
    debugReviewKey: "",
    ticketBriefingSeen: false,
    ticketBriefingOpen: false,
    beginnerGuideSeen: false,
    beginnerGuideOpen: false,
    taskCompleteOpen: false,
    walkthroughActive: false,
    walkthroughStepIndex: 0,
    walkthroughSteps: [],
    walkthroughTaskIndex: 0,
    walkthroughSource: "",
    walkthroughLevelId: "",
    beginnerRoadmapExpanded: true
  };
  let savedProgressRecord = null;
  const mobilePanelRegistry = [];

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

  function isBeginnerMode() {
    return Boolean(pageConfig.isBeginnerMode);
  }

  function beginnerGuideStorageKey() {
    return pageConfig.beginnerGuideStorageKey || `netlab:beginner-guide:${currentSectionId()}`;
  }

  function readLocalFlag(key) {
    try {
      return window.localStorage?.getItem(key) === "1";
    } catch (error) {
      return false;
    }
  }

  function writeLocalFlag(key, value) {
    try {
      if (!window.localStorage) {
        return;
      }
      if (value) {
        window.localStorage.setItem(key, "1");
      } else {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      // Ignore storage failures in private or restricted browser contexts.
    }
  }

  function mobileDebug(label) {
    if (!window.console || typeof window.console.log !== "function" || !isMobileTerminalLayout()) {
      return;
    }
    window.console.log(`[MobileDebug] ${label}`);
  }

  function usesInlineMobileInput() {
    return !isMobileTerminalLayout();
  }

  function isCiscoState() {
    return typeof StateManager.isCiscoState === "function" && StateManager.isCiscoState(session.state);
  }

  function ensureMobilePanelRegistry() {
    if (mobilePanelRegistry.length) {
      return;
    }

    [
      els.appSectionShell,
      els.challengeSelectorPanel,
      els.terminalMetaPanel,
      els.scenarioPanel
    ].filter(Boolean).forEach((element, index) => {
      if (!element.parentNode) {
        return;
      }

      const placeholder = document.createElement("div");
      placeholder.hidden = true;
      placeholder.className = "terminal-mobile-panel-placeholder";
      placeholder.dataset.mobilePanelKey = String(index);
      element.parentNode.insertBefore(placeholder, element);
      mobilePanelRegistry.push({ element, placeholder });
    });
  }

  function restoreDesktopPanels() {
    mobilePanelRegistry.forEach(({ element, placeholder }) => {
      const parent = placeholder.parentNode;
      if (!parent || element.parentNode === parent) {
        return;
      }

      parent.insertBefore(element, placeholder.nextSibling);
    });
  }

  function syncMobileSwitchLinks() {
    if (!els.mobileSwitchLinks) {
      return;
    }

    els.mobileSwitchLinks.replaceChildren();

    [
      els.linuxTrackLink,
      els.windowsTrackLink,
      els.ciscoTrackLink,
      els.challengeTrackLink
    ].filter(Boolean).forEach((sourceLink) => {
      const clone = sourceLink.cloneNode(true);
      clone.removeAttribute("id");
      clone.classList.add("terminal-mobile-switch-link");
      els.mobileSwitchLinks.appendChild(clone);
    });

    if (els.mobileExitLink && els.terminalNavLink) {
      els.mobileExitLink.href = els.terminalNavLink.href;
      els.mobileExitLink.textContent = "Exit";
    }
  }

  function syncMobileAppBarTitle() {
    if (!els.mobileAppBarTitle) {
      return;
    }

    const activeScenario = session.scenarios?.[session.scenarioIndex];
    const scenarioTitle = typeof activeScenario?.title === "string" ? activeScenario.title.trim() : "";

    els.mobileAppBarTitle.textContent = (
      scenarioTitle
      || els.pageTitle?.textContent
      || pageConfig.pageTitle
      || document.title
      || "Terminal Lab"
    ).trim();
  }

  function shouldPreviewMobileSelection() {
    return !session.scenarioStarted;
  }

  function previewStartMessage(scenario = currentScenario()) {
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    if (isMobileTerminalLayout()) {
      return challengePresentation
        ? "Use the left and right arrows above to choose a challenge, then tap Start."
        : "Use the left and right arrows above to choose a mission, then tap Start.";
    }

    return challengePresentation
      ? "Use Previous and Next to choose a challenge, then start it when you're ready."
      : "Use Previous and Next to choose a mission, then start it when you're ready.";
  }

  function navigateScenarioBy(delta) {
    if (!Number.isFinite(delta) || !delta || !session.scenarios.length) {
      return;
    }

    if (shouldPreviewMobileSelection()) {
      previewScenario(session.scenarioIndex + delta);
      return;
    }

    loadScenario(session.scenarioIndex + delta);
  }

  function startOrRestartScenario() {
    if (!session.scenarios.length) {
      return;
    }

    loadScenario(session.scenarioIndex);
  }

  function syncMobileAppBarActions() {
    if (!els.mobilePrevBtn || !els.mobileNextBtn || !els.mobileHomeBtn || !els.mobileMenuBtn) {
      return;
    }

    const challengeSelectionMode = shouldPreviewMobileSelection();
    const showStartBtn = Boolean(!session.scenarioStarted || pageConfig.autoStart === false);
    const startPreviewMode = !session.scenarioStarted;
    const startLabel = startPreviewMode ? "Start" : "Restart";
    const startTargetLabel = startPreviewMode
      ? (scenarioUsesChallengePresentation(currentScenario()) ? "selected challenge" : "selected mission")
      : (scenarioUsesChallengePresentation(currentScenario()) ? "current challenge" : "current mission");

    els.mobilePrevBtn.setAttribute("aria-label", challengeSelectionMode ? "Previous challenge" : "Previous lesson");
    els.mobileNextBtn.setAttribute("aria-label", challengeSelectionMode ? "Next challenge" : "Next lesson");
    els.mobileHomeBtn.setAttribute("aria-label", "Home");

    if (els.mobileStartBtn) {
      els.mobileStartBtn.hidden = !showStartBtn;
      els.mobileStartBtn.textContent = startLabel;
      els.mobileStartBtn.setAttribute(
        "aria-label",
        `${startLabel} ${startTargetLabel}`
      );
      els.mobileStartBtn.title = `${startLabel} ${startTargetLabel}`;
    }
  }

  function closeMobileMenu(options = {}) {
    const { restoreFocus = false, focusTerminal = false } = options;

    if (!els.mobileMenuOverlay) {
      return;
    }

    document.body.classList.remove("terminal-mobile-menu-open");
    els.mobileMenuOverlay.hidden = true;

    if (els.mobileMenuBtn) {
      els.mobileMenuBtn.setAttribute("aria-expanded", "false");
      if (restoreFocus && isMobileTerminalLayout() && typeof els.mobileMenuBtn.focus === "function") {
        els.mobileMenuBtn.focus();
      }
    }

    if (focusTerminal) {
      window.setTimeout(() => focusTerminalInputAtEnd(), 40);
    }
  }

  function closeMobileInfo(options = {}) {
    const { restoreFocus = false, focusTerminal = false } = options;

    if (!els.mobileInfoOverlay) {
      return;
    }

    document.body.classList.remove("terminal-mobile-info-open");
    els.mobileInfoOverlay.hidden = true;

    if (els.mobileMenuBtn && restoreFocus && isMobileTerminalLayout() && typeof els.mobileMenuBtn.focus === "function") {
      els.mobileMenuBtn.focus();
    }

    if (focusTerminal) {
      window.setTimeout(() => focusTerminalInputAtEnd(), 40);
    }
  }

  function blurTerminalInput() {
    if (!els.terminalInput || document.activeElement !== els.terminalInput) {
      return;
    }

    session.mobileBlurTimer = cancelScheduledTimeout(session.mobileBlurTimer);
    mobileDebug("input blur");
    els.terminalInput.blur();
    syncMobileInputState(false);
  }

  function syncMobilePanelPlacement() {
    ensureMobilePanelRegistry();

    if (!els.mobileInfoScroll) {
      return;
    }

    if (!isMobileTerminalLayout()) {
      restoreDesktopPanels();
      closeMobileMenu();
      closeMobileInfo();
      return;
    }

    mobilePanelRegistry.forEach(({ element }) => {
      if (element.parentNode !== els.mobileInfoScroll) {
        els.mobileInfoScroll.appendChild(element);
      }
    });
  }

  function openMobileMenu() {
    if (!isMobileTerminalLayout()) {
      return;
    }

    ensureMobileShellChrome();
    blurTerminalInput();
    closeMobileInfo();
    syncMobileViewportMetrics();
    document.body.classList.add("terminal-mobile-menu-open");
    els.mobileMenuOverlay.hidden = false;
    els.mobileMenuBtn?.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(() => {
      if (els.mobileMenuCommandsBtn && typeof els.mobileMenuCommandsBtn.focus === "function") {
        els.mobileMenuCommandsBtn.focus();
      }
    });
  }

  function openMobileInfo() {
    if (!isMobileTerminalLayout()) {
      return;
    }

    ensureMobileShellChrome();
    syncMobilePanelPlacement();
    blurTerminalInput();
    closeMobileMenu();
    syncMobileViewportMetrics();
    document.body.classList.add("terminal-mobile-info-open");
    els.mobileInfoOverlay.hidden = false;

    if (els.mobileInfoScroll) {
      els.mobileInfoScroll.scrollTop = 0;
    }

    window.requestAnimationFrame(() => {
      if (els.mobileInfoCloseBtn && typeof els.mobileInfoCloseBtn.focus === "function") {
        els.mobileInfoCloseBtn.focus();
      }
    });
  }

  function ensureMobileShellChrome() {
    if (!els.terminalShell) {
      return;
    }

    if (!els.mobileAppBar) {
      const appBar = document.createElement("div");
      appBar.className = "terminal-mobile-appbar";

      const titleWrap = document.createElement("div");
      titleWrap.className = "terminal-mobile-appbar-copy";

      const title = document.createElement("p");
      title.className = "terminal-mobile-appbar-title";
      titleWrap.appendChild(title);

      const actions = document.createElement("div");
      actions.className = "terminal-mobile-appbar-actions";

      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "terminal-mobile-appbar-btn";
      prevBtn.setAttribute("aria-label", "Previous lesson");
      prevBtn.textContent = "\u2039";

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "terminal-mobile-appbar-btn";
      nextBtn.setAttribute("aria-label", "Next lesson");
      nextBtn.textContent = "\u203a";

      const startBtn = document.createElement("button");
      startBtn.type = "button";
      startBtn.className = "terminal-mobile-appbar-btn";
      startBtn.setAttribute("aria-label", "Start selected challenge");
      startBtn.textContent = "\u25b6";
      startBtn.hidden = true;

      const homeBtn = document.createElement("button");
      homeBtn.type = "button";
      homeBtn.className = "terminal-mobile-appbar-btn";
      homeBtn.setAttribute("aria-label", "Home");
      homeBtn.textContent = "\u2302";

      const menuBtn = document.createElement("button");
      menuBtn.type = "button";
      menuBtn.className = "terminal-mobile-menu-btn";
      menuBtn.setAttribute("aria-label", "Open terminal menu");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "\u2630";

      actions.append(prevBtn, nextBtn, startBtn, homeBtn, menuBtn);
      appBar.append(titleWrap, actions);

      if (els.terminalHeader?.parentNode === els.terminalShell) {
        els.terminalHeader.insertAdjacentElement("afterend", appBar);
      } else {
        els.terminalShell.insertBefore(appBar, els.terminalShell.firstChild);
      }

      els.mobileAppBar = appBar;
      els.mobileAppBarTitle = title;
      els.mobilePrevBtn = prevBtn;
      els.mobileNextBtn = nextBtn;
      els.mobileStartBtn = startBtn;
      els.mobileHomeBtn = homeBtn;
      els.mobileMenuBtn = menuBtn;

      prevBtn.addEventListener("click", () => {
        closeMobileMenu();
        closeMobileInfo();
        navigateScenarioBy(-1);
      });

      nextBtn.addEventListener("click", () => {
        closeMobileMenu();
        closeMobileInfo();
        navigateScenarioBy(1);
      });

      startBtn.addEventListener("click", () => {
        closeMobileMenu();
        closeMobileInfo();
        startOrRestartScenario();
      });

      homeBtn.addEventListener("click", () => {
        const targetHref = els.terminalNavLink?.href || "./index.html";
        window.location.href = targetHref;
      });

      menuBtn.addEventListener("click", () => {
        if (document.body.classList.contains("terminal-mobile-menu-open")) {
          closeMobileMenu({ restoreFocus: false });
          return;
        }

        openMobileMenu();
      });
    }

    if (!els.mobileMenuOverlay) {
      const overlay = document.createElement("div");
      overlay.className = "terminal-mobile-menu-overlay";
      overlay.hidden = true;

      const backdrop = document.createElement("div");
      backdrop.className = "terminal-mobile-overlay-backdrop";

      const panel = document.createElement("section");
      panel.className = "terminal-mobile-menu-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "terminalMobileMenuTitle");

      const head = document.createElement("div");
      head.className = "terminal-mobile-overlay-head";

      const heading = document.createElement("h2");
      heading.id = "terminalMobileMenuTitle";
      heading.textContent = "Menu";

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "terminal-mobile-overlay-close";
      closeBtn.textContent = "Close";

      head.append(heading, closeBtn);

      const body = document.createElement("div");
      body.className = "terminal-mobile-menu-body";

      const actions = document.createElement("div");
      actions.className = "terminal-mobile-menu-actions";

      const commandsBtn = document.createElement("button");
      commandsBtn.type = "button";
      commandsBtn.className = "terminal-mobile-menu-action";
      commandsBtn.textContent = isBeginnerMode() ? "Command Help" : "Commands";

      const infoBtn = document.createElement("button");
      infoBtn.type = "button";
      infoBtn.className = "terminal-mobile-menu-action";
      infoBtn.textContent = isBeginnerMode() ? "Beginner Guide" : "Instructions";

      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "terminal-mobile-menu-action";
      resetBtn.textContent = "Reset";

      actions.append(commandsBtn, infoBtn, resetBtn);

      const switchSection = document.createElement("div");
      switchSection.className = "terminal-mobile-switch-section";

      const switchLabel = document.createElement("p");
      switchLabel.className = "terminal-mobile-switch-label";
      switchLabel.textContent = "Switch Lab";

      const switchLinks = document.createElement("div");
      switchLinks.className = "terminal-mobile-switch-links";

      switchSection.append(switchLabel, switchLinks);

      const exitLink = document.createElement("a");
      exitLink.className = "terminal-mobile-menu-link";
      exitLink.href = "./index.html";
      exitLink.textContent = "Exit";

      body.append(actions, switchSection, exitLink);
      panel.append(head, body);
      overlay.append(backdrop, panel);
      document.body.appendChild(overlay);

      els.mobileMenuOverlay = overlay;
      els.mobileMenuCommandsBtn = commandsBtn;
      els.mobileMenuInfoBtn = infoBtn;
      els.mobileMenuResetBtn = resetBtn;
      els.mobileMenuCloseBtn = closeBtn;
      els.mobileSwitchLinks = switchLinks;
      els.mobileExitLink = exitLink;

      backdrop.addEventListener("click", () => closeMobileMenu({ restoreFocus: true, focusTerminal: isBeginnerMode() }));
      closeBtn.addEventListener("click", () => closeMobileMenu({ restoreFocus: true, focusTerminal: isBeginnerMode() }));
      commandsBtn.addEventListener("click", () => {
        closeMobileMenu();
        blurTerminalInput();
        syncMobileViewportMetrics();
        document.querySelector("[data-open-command-sheet]")?.click();
      });
      infoBtn.addEventListener("click", () => openMobileInfo());
      resetBtn.addEventListener("click", () => {
        closeMobileMenu();
        els.resetScenarioBtn?.click();
      });
    }

    if (!els.mobileInfoOverlay) {
      const overlay = document.createElement("div");
      overlay.className = "terminal-mobile-info-overlay";
      overlay.hidden = true;

      const backdrop = document.createElement("div");
      backdrop.className = "terminal-mobile-overlay-backdrop";

      const panel = document.createElement("section");
      panel.className = "terminal-mobile-info-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "terminalMobileInfoTitle");

      const head = document.createElement("div");
      head.className = "terminal-mobile-overlay-head";

      const heading = document.createElement("h2");
      heading.id = "terminalMobileInfoTitle";
      heading.textContent = isBeginnerMode() ? "Beginner Guide" : "Instructions";

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "terminal-mobile-overlay-close";
      closeBtn.textContent = "Close";

      const scroll = document.createElement("div");
      scroll.className = "terminal-mobile-info-scroll";

      head.append(heading, closeBtn);
      panel.append(head, scroll);
      overlay.append(backdrop, panel);
      document.body.appendChild(overlay);

      els.mobileInfoOverlay = overlay;
      els.mobileInfoCloseBtn = closeBtn;
      els.mobileInfoScroll = scroll;

      backdrop.addEventListener("click", () => closeMobileInfo({ restoreFocus: true, focusTerminal: isBeginnerMode() }));
      closeBtn.addEventListener("click", () => closeMobileInfo({ restoreFocus: true, focusTerminal: isBeginnerMode() }));
    }

    syncMobileAppBarTitle();
    syncMobileAppBarActions();
    syncMobileSwitchLinks();
    syncMobilePanelPlacement();
  }

  function syncTerminalInputPlacement() {
    const inlineMobileInput = usesInlineMobileInput();
    document.body.classList.toggle("terminal-mobile-inline-input", inlineMobileInput);

    if (!els.terminalForm) {
      return;
    }

    if (inlineMobileInput) {
      if (els.terminalInlineInputSlot) {
        [
          els.beginnerTaskStrip,
          els.beginnerHelpStrip,
          els.terminalControls,
          els.terminalForm
        ].filter(Boolean).forEach((node) => {
          if (node.parentElement !== els.terminalInlineInputSlot) {
            els.terminalInlineInputSlot.appendChild(node);
          }
        });
      }
      return;
    }

    if (els.terminalMobileControlMount) {
      [
        els.terminalControls,
        els.beginnerTaskStrip,
        els.beginnerHelpStrip
      ].filter(Boolean).forEach((node) => {
        if (node.parentElement !== els.terminalMobileControlMount) {
          els.terminalMobileControlMount.appendChild(node);
        }
      });
    }

    if (els.terminalDockInputMount && els.terminalForm.parentElement !== els.terminalDockInputMount) {
      els.terminalDockInputMount.appendChild(els.terminalForm);
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
      document.body.classList.remove(
        "terminal-mobile-active",
        "terminal-mobile-keyboard-open",
        "terminal-mobile-context-collapsed",
        "terminal-mobile-inline-input",
        "terminal-mobile-menu-open",
        "terminal-mobile-info-open"
      );
      session.mobileLayoutLocked = false;
      return;
    }

    document.body.classList.add("terminal-mobile-active");
    document.body.classList.toggle("terminal-mobile-context-collapsed", session.mobileContextCollapsed);
    document.body.classList.toggle("terminal-mobile-keyboard-open", Boolean(active));
  }

  function measureTerminalDockSpace() {
    session.mobileDockRaf = cancelScheduledFrame(session.mobileDockRaf);
    document.body.style.setProperty("--terminal-mobile-dock-space", "0px");
  }

  function syncMobileViewportMetrics() {
    session.mobileViewportRaf = cancelScheduledFrame(session.mobileViewportRaf);
    ensureMobileShellChrome();
    syncTerminalInputPlacement();
    syncMobilePanelPlacement();
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
      const { visibleHeight, keyboardOffset } = mobileViewportMetrics();
      const activeInput = document.activeElement === els.terminalInput;
      const baselineViewportHeight = session.mobileStableViewportHeight || visibleHeight;
      const viewportLoss = Math.max(0, baselineViewportHeight - visibleHeight);
      const keyboardOpen = Boolean(activeInput);
      const keyboardViewportActive = keyboardOpen && (keyboardOffset > 48 || viewportLoss > 64 || visibleHeight < baselineViewportHeight - 48);

      if (!session.mobileStableViewportHeight || (!activeInput && visibleHeight >= session.mobileStableViewportHeight)) {
        session.mobileStableViewportHeight = visibleHeight;
      }

      const stableViewportHeight = keyboardViewportActive
        ? visibleHeight
        : (session.mobileStableViewportHeight || visibleHeight);

      document.body.style.setProperty("--terminal-mobile-viewport-height", `${stableViewportHeight}px`);
      document.body.style.setProperty("--terminal-visual-keyboard-offset", "0px");
      syncMobileInputState(activeInput);
      measureTerminalDockSpace();
    });
  }

  function revealActiveTerminalInput() {
    if (!isMobileTerminalLayout() || !els.terminalInput || document.activeElement !== els.terminalInput) {
      return;
    }

    // Keep the terminal feed stable while the learner reviews history, but still follow the latest output when they are already at the end.
    if (session.outputPinnedToLatest) {
      scrollTerminal(true);
    }
    syncMobileViewportMetrics();
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

    if (isBeginnerRoadmapTrack()) {
      const allowedIds = beginnerScenarioIds();
      const beginnerOnly = source.filter((scenario) => allowedIds.includes(scenario.id));
      filtered = beginnerOnly.sort((left, right) => allowedIds.indexOf(left.id) - allowedIds.indexOf(right.id));
    } else if (typeof pageConfig.scenarioFilter === "function") {
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

  function beginnerLevelRoadmap(track = pageConfig.environmentCategory || "windows") {
    const levels = ScenarioEngine?.beginnerLabLevels?.[track];
    return Array.isArray(levels) ? levels.slice() : [];
  }

  function isBeginnerRoadmapTrack() {
    return isBeginnerMode() && currentSectionId() === "windows-terminal";
  }

  function beginnerScenarioIds() {
    const ids = [];
    beginnerLevelRoadmap("windows").forEach((level) => {
      (Array.isArray(level.scenarioIds) ? level.scenarioIds : []).forEach((id) => {
        if (id && !ids.includes(id)) {
          ids.push(id);
        }
      });
    });
    return ids;
  }

  function currentBeginnerLevel() {
    const scenario = currentScenario();
    if (!scenario) {
      return null;
    }
    const levels = beginnerLevelRoadmap("windows");
    return levels.find((level) => level.id === scenario.beginnerLabLevelId || (level.scenarioIds || []).includes(scenario.id)) || null;
  }

  function beginnerLevelIndex(levelId) {
    return beginnerLevelRoadmap("windows").findIndex((level) => level.id === levelId);
  }

  function levelScenarios(level) {
    if (!level) {
      return [];
    }
    const ids = Array.isArray(level.scenarioIds) ? level.scenarioIds : [];
    return ids.map((id) => session.scenarios.find((scenario) => scenario.id === id)).filter(Boolean);
  }

  function completedScenarioCountForLevel(level) {
    return levelScenarios(level).filter((scenario) => session.completedScenarioIds.has(scenario.id)).length;
  }

  function totalTaskCountForLevel(level) {
    return levelScenarios(level).reduce((sum, scenario) => sum + totalStepsForScenario(scenario), 0);
  }

  function levelStatus(level) {
    const scenarios = levelScenarios(level);
    if (!scenarios.length) {
      return "Coming Soon";
    }
    const completed = completedScenarioCountForLevel(level);
    if (completed >= scenarios.length) {
      return "Complete";
    }
    const hasCurrent = scenarios.some((scenario) => scenario.id === currentScenario()?.id);
    if (hasCurrent || completed > 0) {
      return "In Progress";
    }
    return "Not Started";
  }

  function recommendedBeginnerLevel() {
    const levels = beginnerLevelRoadmap("windows");
    return levels.find((level) => levelStatus(level) !== "Complete" && levelScenarios(level).length) || levels.find((level) => levelScenarios(level).length) || null;
  }

  function recommendedBeginnerScenario(level = recommendedBeginnerLevel()) {
    return levelScenarios(level).find((scenario) => !session.completedScenarioIds.has(scenario.id)) || levelScenarios(level)[0] || null;
  }

  function sectionLabel() {
    if (isBeginnerRoadmapTrack()) {
      return "Beginner Terminal Lab";
    }
    return pageConfig.pageKicker || pageConfig.pageTitle || scenarioEnvironmentLabel(currentScenario());
  }

  function currentScenario() {
    return session.scenarios[session.scenarioIndex];
  }

  function currentStep() {
    return currentScenario().steps[session.stepIndex];
  }

  function scenarioStages(scenario = currentScenario()) {
    return Array.isArray(scenario?.stages) ? scenario.stages : [];
  }

  function scenarioHasStages(scenario = currentScenario()) {
    return scenarioStages(scenario).length > 0;
  }

  function scenarioHasMissionCaseData(scenario = currentScenario()) {
    if (!scenario) {
      return false;
    }

    return Boolean(
      scenarioHasStages(scenario)
      || String(scenario.role || "").trim()
      || String(scenario.difficulty || scenario.level || "").trim()
      || String(scenario.estimatedTime || "").trim()
      || String(scenario.scenarioType || "").trim()
      || String(scenario.missionBriefing || "").trim()
      || (Array.isArray(scenario.learningObjectives) && scenario.learningObjectives.length)
      || (Array.isArray(scenario.successCriteria) && scenario.successCriteria.length)
      || String(scenario.environmentNotes || "").trim()
    );
  }

  function totalStepsForScenario(scenario = currentScenario()) {
    return Array.isArray(scenario?.steps) ? scenario.steps.length : 0;
  }

  function currentStageInfo(scenario = currentScenario(), stepIndex = session.stepIndex) {
    const stages = scenarioStages(scenario);
    if (!stages.length) {
      return null;
    }

    let missionOffset = 0;
    for (let index = 0; index < stages.length; index += 1) {
      const stage = stages[index];
      const stageSteps = Array.isArray(stage.steps) ? stage.steps.length : 0;
      if (!stageSteps) {
        continue;
      }

      if (stepIndex < missionOffset + stageSteps) {
        return {
          stage,
          stageIndex: index,
          stageCount: stages.length,
          stageStepIndex: stepIndex - missionOffset,
          stageStepCount: stageSteps,
          missionStepIndex: stepIndex,
          missionStepCount: totalStepsForScenario(scenario)
        };
      }

      missionOffset += stageSteps;
    }

    const lastStage = stages[stages.length - 1];
    return {
      stage: lastStage,
      stageIndex: stages.length - 1,
      stageCount: stages.length,
      stageStepIndex: Math.max(0, (Array.isArray(lastStage.steps) ? lastStage.steps.length : 1) - 1),
      stageStepCount: Array.isArray(lastStage.steps) ? lastStage.steps.length : 1,
      missionStepIndex: Math.max(0, totalStepsForScenario(scenario) - 1),
      missionStepCount: totalStepsForScenario(scenario)
    };
  }

  function visibleStageInfo(scenario = currentScenario(), stepIndex = session.stepIndex) {
    const explicitStageInfo = currentStageInfo(scenario, stepIndex);
    if (explicitStageInfo) {
      return explicitStageInfo;
    }

    const totalSteps = Math.max(1, totalStepsForScenario(scenario));
    const activeStep = scenario?.steps?.[Math.max(0, Math.min(stepIndex, totalSteps - 1))] || currentStep();
    const briefing = String(
      scenarioUsesChallengePresentation(scenario)
        ? (scenario.challengeObjective || activeStep?.objective || scenario?.objective || "")
        : (scenario?.objective || activeStep?.objective || "")
    ).trim();

    return {
      stage: {
        id: "current-task",
        title: "Current Task",
        briefing
      },
      stageIndex: 0,
      stageCount: 1,
      stageStepIndex: Math.max(0, Math.min(stepIndex, totalSteps - 1)),
      stageStepCount: totalSteps,
      missionStepIndex: Math.max(0, Math.min(stepIndex, totalSteps - 1)),
      missionStepCount: totalSteps,
      fallback: true
    };
  }

  function missionProgressText(scenario = currentScenario(), completedStepCount = session.stepIndex) {
    const stageInfo = currentStageInfo(scenario);
    if (!stageInfo) {
      return "";
    }

    return `Mission progress: ${completedStepCount}/${stageInfo.missionStepCount} tasks complete. Current stage: ${stageInfo.stageStepIndex + 1}/${stageInfo.stageStepCount}.`;
  }

  function createReviewStats() {
    return {
      totalSubmitted: 0,
      successfulAccepted: 0,
      partialCommands: 0,
      incorrectCommands: 0,
      explorationCommands: 0,
      repeatedIncorrectCommands: 0,
      riskyActions: [],
      successfulStepObjectives: [],
      submittedCommands: [],
      duplicateWrongTracker: {},
      submittedCommandTracker: {}
    };
  }

  function cloneReviewStats(stats) {
    return JSON.parse(JSON.stringify(stats || createReviewStats()));
  }

  function clampScore(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function verificationKeywords() {
    return /\b(verify|verified|verification|confirm|confirmed|test|tested|resolution|reachable|reachability)\b/i;
  }

  function riskyCommandMatch(rawInput, scenario = currentScenario()) {
    const rules = Array.isArray(scenario?.riskyCommands) ? scenario.riskyCommands : [];
    const raw = String(rawInput || "").trim();

    for (const rule of rules) {
      if (!rule || !rule.pattern) {
        continue;
      }

      if (rule.pattern instanceof RegExp && rule.pattern.test(raw)) {
        return rule;
      }

      if (typeof rule.pattern === "string" && raw.toLowerCase().includes(rule.pattern.toLowerCase())) {
        return rule;
      }
    }

    return null;
  }

  function currentObjectiveReminder(step = currentStep()) {
    return step?.objective
      ? `Current objective: ${step.objective}`
      : "Stay focused on the current objective and use the last output to justify the next move.";
  }

  function recommendedCommandFamily(scenario = currentScenario()) {
    return Array.isArray(scenario?.commandFocus) && scenario.commandFocus.length
      ? scenario.commandFocus.join(", ")
      : "the command family that matches the current objective";
  }

  function commandPanelCategoryLabel(scenario = currentScenario()) {
    if (pageConfig.commandSheetDefaultCategory) {
      return pageConfig.commandSheetDefaultCategory;
    }

    if (scenario?.shell === "cmd") return "Windows CMD";
    if (scenario?.shell === "cisco") return "Cisco CLI";
    return "Linux";
  }

  function commandFamilyLabel(step = currentStep(), scenario = currentScenario()) {
    const suggested = suggestedCommandForStep(step);
    if (suggested) {
      return String(suggested).split(/\s+/)[0];
    }

    const family = Array.isArray(scenario?.commandFocus) && scenario.commandFocus.length
      ? scenario.commandFocus[0]
      : "";

    return family || "the command you need for this task";
  }

  function normalizeDemoOutput(value) {
    if (Array.isArray(value)) {
      return value.map((line) => String(line || "")).filter(Boolean);
    }

    if (value === null || value === undefined || value === "") {
      return [];
    }

    return [String(value)];
  }

  function extractBacktickCommand(text) {
    const match = String(text || "").match(/`([^`]+)`/);
    return match ? match[1].trim() : "";
  }

  function suggestedCommandForStep(step = currentStep()) {
    if (!step) {
      return "";
    }

    if (step.demoCommand) {
      return String(step.demoCommand).trim();
    }

    if (Array.isArray(step.walkthrough) && step.walkthrough.length && step.walkthrough[0]?.command) {
      return String(step.walkthrough[0].command).trim();
    }

    const hinted = (step.hints || []).map(extractBacktickCommand).find(Boolean);
    if (hinted) {
      return hinted;
    }

    const acceptRule = (step.accepts || []).find((rule) => rule && (rule.command || rule.finalCwd));
    if (acceptRule?.finalCwd) {
      return `cd ${acceptRule.finalCwd}`;
    }
    if (acceptRule?.command) {
      return String(acceptRule.command).trim();
    }

    return "";
  }

  function fallbackDemoOutput(command) {
    if (!command) {
      return [];
    }

    const previousState = session.state;
    const cloneState = StateManager.clone(session.state);
    let execution = null;

    try {
      session.state = cloneState;
      execution = executeInput(command);
    } catch (error) {
      execution = null;
    } finally {
      session.state = previousState;
    }

    if (!execution) {
      return [];
    }

    return [...(execution.stdout || []), ...(execution.stderr || [])]
      .map((line) => String(line || ""))
      .filter(Boolean)
      .slice(0, 6);
  }

  function normalizeWalkthroughEntries(entries = []) {
    return (Array.isArray(entries) ? entries : [])
      .map((entry) => {
        if (!entry) {
          return null;
        }

        const command = String(entry.command || entry.demoCommand || "").trim();
        const output = normalizeDemoOutput(entry.output || entry.demoOutput);
        const explanation = String(entry.explanation || entry.demoExplanation || entry.successFeedback || entry.explanationText || "").trim();
        const why = String(entry.why || entry.whyThisMatters || "").trim();
        const nowTry = String(entry.nowTry || entry.nextObjective || "").trim();
        const objective = String(entry.objective || "").trim();
        const whereToLook = String(entry.whereToLook || "").trim();
        const howToThink = String(entry.howToThink || "").trim();
        const title = String(entry.title || "").trim();
        const goal = String(entry.goal || entry.objective || "").trim();
        const prompt = String(entry.prompt || "").trim();

        if (!command && !explanation && !why && !objective && !whereToLook && !howToThink && !title && !goal) {
          return null;
        }

        return {
          title,
          goal,
          prompt,
          command,
          output,
          explanation,
          why,
          nowTry,
          objective,
          whereToLook,
          howToThink
        };
      })
      .filter(Boolean);
  }

  function fallbackWalkthroughEntries(step = currentStep(), scenario = currentScenario()) {
    const objective = String(step?.objective || scenarioObjectiveText(scenario) || "the current task").trim();
    const category = commandPanelCategoryLabel(scenario);
    const commandFamily = commandFamilyLabel(step, scenario);
    const command = suggestedCommandForStep(step);
    const explanation = String(step?.demoExplanation || step?.successFeedback || step?.explanation || "").trim();
    const why = String(step?.whyThisMatters || "").trim();

    const entry = {
      title: "Guided Task Walkthrough",
      goal: objective,
      prompt: getPromptLabel(),
      objective: `Current task: ${objective}`,
      howToThink: "Look at the current task first, then choose a command that proves one thing clearly.",
      whereToLook: `Open ${isBeginnerMode() ? "Command Help" : "Commands"} -> ${category} and look for ${commandFamily}.`,
      command: command || "",
      output: command ? (normalizeDemoOutput(step?.demoOutput).length ? normalizeDemoOutput(step.demoOutput) : fallbackDemoOutput(command)) : [],
      explanation: explanation || "This is a safe demo path for the current task.",
      why: why || (command ? "This command helps you gather the evidence you need before guessing." : "Use the command reference to pick a command that answers the current task."),
      nowTry: command ? `Type ${command} yourself.` : "Open Command Help and choose the command that best fits the task."
    };

    return [entry];
  }

  function walkthroughPayload(scenario = currentScenario(), step = currentStep(), stepIndex = session.stepIndex) {
    const stageInfo = currentStageInfo(scenario, stepIndex);
    const level = currentBeginnerLevel();
    const customStepWalkthrough = normalizeWalkthroughEntries(step?.walkthrough);
    const customStageWalkthrough = normalizeWalkthroughEntries(stageInfo?.stage?.walkthrough);
    const customScenarioWalkthrough = normalizeWalkthroughEntries(scenario?.walkthrough);
    const customLevelWalkthrough = normalizeWalkthroughEntries(level?.walkthrough);
    const customStepDemo = normalizeWalkthroughEntries([
      {
        command: step?.demoCommand,
        output: step?.demoOutput,
        explanation: step?.demoExplanation,
        whyThisMatters: step?.whyThisMatters,
        nextObjective: step?.nextObjective,
        objective: step?.objective
      }
    ]);

    const guidedReplayCandidates = [
      { entries: customStepWalkthrough, source: "step", custom: true, fallback: false },
      { entries: customStageWalkthrough, source: "stage", custom: true, fallback: false },
      { entries: customScenarioWalkthrough, source: "scenario", custom: true, fallback: false },
      { entries: customLevelWalkthrough, source: "level", custom: true, fallback: false }
    ];

    if (isBeginnerMode()) {
      const guidedReplay = guidedReplayCandidates.find((candidate) => candidate.entries.length > 1);
      if (guidedReplay) {
        return guidedReplay;
      }
    }

    if (customStepWalkthrough.length) {
      return { entries: customStepWalkthrough, source: "step", custom: true, fallback: false };
    }

    if (customStageWalkthrough.length) {
      return { entries: customStageWalkthrough, source: "stage", custom: true, fallback: false };
    }

    if (customScenarioWalkthrough.length) {
      return { entries: customScenarioWalkthrough, source: "scenario", custom: true, fallback: false };
    }

    if (customLevelWalkthrough.length) {
      return { entries: customLevelWalkthrough, source: "level", custom: true, fallback: false };
    }

    if (customStepDemo.length) {
      return { entries: customStepDemo, source: "step-demo", custom: true, fallback: false };
    }

    return { entries: fallbackWalkthroughEntries(step, scenario), source: "fallback", custom: false, fallback: true };
  }

  function walkthroughEntriesForScenario(scenario = currentScenario(), startIndex = session.stepIndex) {
    return walkthroughPayload(scenario, scenario?.steps?.[startIndex] || currentStep(), startIndex).entries;
  }

  function walkthroughAvailable(scenario = currentScenario()) {
    return walkthroughPayload(scenario).entries.length > 0;
  }

  function walkthroughPrompt(entry = {}, scenario = currentScenario()) {
    if (entry.prompt) {
      return entry.prompt;
    }

    const category = scenario?.shell;
    if (category === "cmd") return "C:\\Users\\student>";
    if (category === "cisco") return "Router>";
    if (scenarioUsesChallengePresentation(scenario)) return "analyst@lab:~$";
    return "student@lab:~$";
  }

  function closeWalkthrough(options = {}) {
    if (!els.walkthroughCard) {
      return;
    }

    const restoreFocus = options.restoreFocus !== false;
    session.walkthroughActive = false;
    session.walkthroughStepIndex = 0;
    session.walkthroughSteps = [];
    session.walkthroughSource = "";
    els.walkthroughCard.hidden = true;
    els.walkthroughCard.setAttribute("aria-hidden", "true");
    if (els.walkthroughOverlay) {
      els.walkthroughOverlay.hidden = true;
    }
    document.body.classList.remove("walkthrough-open");

    if (restoreFocus) {
      focusTerminalInputAtEnd();
    }
  }

  function renderWalkthroughStep() {
    if (!session.walkthroughActive || !els.walkthroughCard) {
      return;
    }

    const entry = session.walkthroughSteps[session.walkthroughStepIndex];
    if (!entry) {
      closeWalkthrough();
      return;
    }

    const total = session.walkthroughSteps.length;
    const displayIndex = session.walkthroughStepIndex + 1;
    fillText(els.walkthroughTitle, entry.title || `Walkthrough Step ${displayIndex}`, { hideWhenEmpty: false });
    fillText(els.walkthroughStepCounter, `Walkthrough Step ${displayIndex} of ${total}`, { hideWhenEmpty: false });
    fillText(
      els.walkthroughGoal,
      entry.goal || entry.objective || "Follow the demo and compare it with the current task.",
      { hideWhenEmpty: false }
    );
    if (els.walkthroughCommand) {
      const prompt = walkthroughPrompt(entry);
      const commandText = entry.command ? `${prompt} ${entry.command}` : prompt;
      els.walkthroughCommand.textContent = commandText;
    }
    if (els.walkthroughOutput) {
      const outputText = normalizeDemoOutput(entry.output).join("\n") || "No output shown for this step.";
      els.walkthroughOutput.textContent = outputText;
    }
    fillText(
      els.walkthroughExplanation,
      entry.explanation || entry.why || entry.howToThink || "Use this step as a model, then try the same idea yourself.",
      { hideWhenEmpty: false }
    );

    if (els.walkthroughPrevBtn) {
      els.walkthroughPrevBtn.disabled = session.walkthroughStepIndex <= 0;
    }
    if (els.walkthroughNextBtn) {
      const lastStep = session.walkthroughStepIndex >= total - 1;
      els.walkthroughNextBtn.textContent = lastStep ? "Finish Walkthrough" : "Next Walkthrough Step";
    }
  }

  function openWalkthrough(entries, options = {}) {
    if (!els.walkthroughCard || !entries.length) {
      return;
    }

    session.walkthroughActive = true;
    session.walkthroughSteps = entries;
    session.walkthroughStepIndex = Math.max(0, Math.min(Number(options.startIndex) || 0, entries.length - 1));
    session.walkthroughTaskIndex = session.stepIndex;
    session.walkthroughSource = String(options.source || "");
    session.walkthroughLevelId = currentBeginnerLevel()?.id || "";
    els.walkthroughCard.hidden = false;
    els.walkthroughCard.setAttribute("aria-hidden", "false");
    if (els.walkthroughOverlay) {
      els.walkthroughOverlay.hidden = false;
    }
    document.body.classList.add("walkthrough-open");
    renderWalkthroughStep();
    window.setTimeout(() => {
      els.walkthroughNextBtn?.focus({ preventScroll: true });
    }, 0);
  }

  function walkthroughHintText(step = currentStep(), level = session.hintLevel + 1, scenario = currentScenario()) {
    const objective = step?.objective || scenarioObjectiveText(scenario) || "the current task";
    const commandFamily = commandFamilyLabel(step, scenario);
    const category = commandPanelCategoryLabel(scenario);
    const helpLabel = isBeginnerMode() ? "Command Help" : "Commands";
    const command = suggestedCommandForStep(step);
    const coachHint = CoachEngine.getHint(step, Math.max(0, Math.min(2, level)), session.state);

    if (level <= 0) {
      return `You need to prove: ${objective} Open ${helpLabel} -> ${category} and look for ${commandFamily}.`;
    }

    if (level === 1) {
      return `You need to prove: ${objective} Open ${helpLabel} -> ${category} and look for ${commandFamily}.`;
    }

    if (level === 2) {
      return command
        ? `The command you likely need is ${command}.`
        : `Open ${helpLabel} -> ${category}. The command family you need is ${commandFamily}.`;
    }

    if (command) {
      return `Run: ${command}`;
    }

    return coachHint || `Open ${helpLabel} -> ${category} and choose the command that best matches ${objective}.`;
  }

  function progressiveWrongAttemptGuidance(step = currentStep(), attempts = session.attemptsForStep, scenario = currentScenario()) {
    if (attempts <= 1) {
      return isBeginnerMode() ? "Need help? Open Command Help, Hint, or Watch Walkthrough." : "Need help? Open Commands or use Hint.";
    }

    if (attempts === 2) {
      return `Stay with the current task: ${step?.objective || "use the last result to guide the next command."}`;
    }

    if (attempts === 3) {
      return `${isBeginnerMode() ? "Open Command Help" : "Open Commands"} and look for ${recommendedCommandFamily(scenario)}.`;
    }

    return "Use Hint for a stronger nudge, or watch the walkthrough and then try it yourself.";
  }

  function repeatedCommandCoaching(rawInput) {
    const key = String(rawInput || "").trim().toLowerCase();
    const count = session.reviewStats?.submittedCommandTracker?.[key] || 0;
    if (count < 2) {
      return "";
    }

    return "You already ran that check. Unless something changed, try a different command.";
  }

  function shortCoachCopy(text, fallback = "") {
    const normalized = String(text || "").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return fallback;
    }

    const sentenceMatch = normalized.match(/^(.+?[.!?])(\s|$)/);
    const sentence = sentenceMatch ? sentenceMatch[1].trim() : normalized;
    if (sentence.length <= 140) {
      return sentence;
    }
    return `${sentence.slice(0, 137).trimEnd()}...`;
  }

  function fillText(element, value, options = {}) {
    if (!element) {
      return;
    }

    const text = String(value || "").trim();
    element.hidden = options.hideWhenEmpty !== false ? !text : false;
    element.textContent = text;
  }

  function fillBadge(element, label, value) {
    fillText(element, value ? `${label}: ${value}` : "");
  }

  function fillBlock(block, element, value) {
    fillText(element, value || "");
    if (block) {
      block.hidden = !String(value || "").trim();
    }
  }

  function fillListBlock(block, list, items = []) {
    const count = renderListItems(list, items);
    if (block) {
      block.hidden = count === 0;
    }
  }

  function missionDebug(label, details = "") {
    if (!window.console || typeof window.console.log !== "function") {
      return;
    }

    if (details) {
      console.log(`[MissionDebug] ${label}`, details);
      return;
    }

    console.log(`[MissionDebug] ${label}`);
  }

  function renderListItems(target, items = []) {
    if (!target) {
      return 0;
    }

    const values = Array.isArray(items)
      ? items.map((item) => String(item || "").trim()).filter(Boolean)
      : [];

    target.innerHTML = "";
    values.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      target.appendChild(li);
    });
    return values.length;
  }

  function renderMissionCaseFile(scenario = currentScenario(), stageInfo = visibleStageInfo(scenario)) {
    if (!els.missionCaseFileCard) {
      return;
    }

    const shouldShow = scenarioHasMissionCaseData(scenario);
    els.missionCaseFileCard.hidden = !shouldShow;
    if (!shouldShow) {
      return;
    }

    const scenarioKey = `${scenario.id || scenario.title || "scenario"}:${stageInfo?.stage?.id || "nostage"}`;
    if (session.debugScenarioKey !== scenarioKey) {
      missionDebug("Rendering case file");
      session.debugScenarioKey = scenarioKey;
    }

    fillText(els.missionCaseTitle, scenario.title, { hideWhenEmpty: false });

    const role = scenario.role ? `Role: ${scenario.role}` : "";
    const difficulty = scenario.difficulty || scenario.level ? `Difficulty: ${scenario.difficulty || scenario.level}` : "";
    const estimatedTime = scenario.estimatedTime ? `Estimated Time: ${scenario.estimatedTime}` : "";
    const scenarioType = scenario.scenarioType ? `Scenario Type: ${scenario.scenarioType}` : "";

    fillText(els.missionCaseRole, role);
    fillText(els.missionCaseDifficulty, difficulty);
    fillText(els.missionCaseEstimatedTime, estimatedTime);
    fillText(els.missionCaseType, scenarioType);

    if (els.missionCaseMeta) {
      els.missionCaseMeta.hidden = !(role || difficulty || estimatedTime || scenarioType);
    }

    fillText(els.missionBriefingText, scenario.missionBriefing || "");
    if (els.missionBriefingBlock) {
      els.missionBriefingBlock.hidden = !String(scenario.missionBriefing || "").trim();
    }

    const objectiveCount = renderListItems(els.missionObjectivesList, scenario.learningObjectives);
    if (els.missionObjectivesBlock) {
      els.missionObjectivesBlock.hidden = objectiveCount === 0;
    }

    const successCount = renderListItems(els.missionSuccessList, scenario.successCriteria);
    if (els.missionSuccessBlock) {
      els.missionSuccessBlock.hidden = successCount === 0;
    }

    fillText(els.missionEnvironmentText, scenario.environmentNotes || "");
    if (els.missionEnvironmentBlock) {
      els.missionEnvironmentBlock.hidden = !String(scenario.environmentNotes || "").trim();
    }

    fillText(els.missionCurrentStageTitle, stageInfo ? `${stageInfo.stage.title}` : "");
    fillText(els.missionCurrentStageBriefing, stageInfo?.stage?.briefing || "");
    fillText(
      els.missionStageProgress,
      stageInfo ? `Stage ${stageInfo.stageIndex + 1} of ${stageInfo.stageCount} · Task ${stageInfo.stageStepIndex + 1} of ${stageInfo.stageStepCount}` : ""
    );
    fillText(
      els.missionTotalProgress,
      stageInfo ? `Mission ${stageInfo.missionStepIndex + 1} of ${stageInfo.missionStepCount}` : ""
    );
  }

  function renderBeginnerLabCard(scenario = currentScenario(), step = currentStep()) {
    if (!els.beginnerLabCard) {
      return;
    }

    const beginnerTrack = isBeginnerRoadmapTrack();
    const level = currentBeginnerLevel();
    const stageInfo = visibleStageInfo(scenario);
    els.beginnerLabCard.hidden = !(beginnerTrack && level && scenario && step);
    if (els.beginnerLabCard.hidden) {
      return;
    }

    const scenarios = levelScenarios(level);
    const completedMissions = completedScenarioCountForLevel(level);
    const levelIndexNumber = beginnerLevelIndex(level.id) + 1;
    fillText(els.beginnerLabCurrentLevel, `Current Lab Level: ${level.title}`, { hideWhenEmpty: false });
    fillText(els.beginnerLabCurrentMission, `Mission: ${scenario.title}`, { hideWhenEmpty: false });
    fillText(
      els.beginnerLabCurrentTask,
      stageInfo
        ? `Current Task: ${step.objective} · Mission Section ${stageInfo.stageIndex + 1} · Task ${stageInfo.stageStepIndex + 1} of ${stageInfo.stageStepCount}`
        : `Current Task: ${step.objective}`,
      { hideWhenEmpty: false }
    );
    fillText(
      els.beginnerLabProgressText,
      `Level progress: ${completedMissions}/${scenarios.length} missions complete · Level ${levelIndexNumber} of ${beginnerLevelRoadmap("windows").length}`,
      { hideWhenEmpty: false }
    );
  }

  function ticketBriefingPayload(scenario = currentScenario()) {
    if (!scenario) {
      return null;
    }

    const tags = Array.isArray(scenario.tags)
      ? scenario.tags.map((item) => String(item || "").trim()).filter(Boolean)
      : [];

    return {
      title: scenario.ticketTitle || scenario.title || "Assigned Mission",
      ticketId: scenario.ticketId || "",
      priority: scenario.priority || "",
      reportedBy: scenario.reportedBy || "",
      reportedTime: scenario.reportedTime || "",
      role: scenario.role || "",
      estimatedTime: scenario.estimatedTime || "",
      affectedSystem: scenario.affectedSystem || scenario.environmentLabel || scenarioEnvironmentLabel(scenario),
      summary: scenario.summary || scenario.missionBriefing || scenario.scenarioIntro || scenarioObjectiveText(scenario),
      userReport: scenario.userReport || "",
      symptoms: Array.isArray(scenario.symptoms) ? scenario.symptoms : [],
      knownFacts: Array.isArray(scenario.knownFacts) ? scenario.knownFacts : [],
      objective: scenario.objective || scenarioObjectiveText(scenario),
      constraints: Array.isArray(scenario.constraints) ? scenario.constraints : [],
      tags,
      escalationNote: scenario.escalationNote || "",
      easterEggNote: scenario.easterEggNote || ""
    };
  }

  function renderTicketBriefing(scenario = currentScenario()) {
    if (!els.ticketBriefingCard) {
      return;
    }

    const payload = ticketBriefingPayload(scenario);
    if (!payload) {
      return;
    }

    fillText(els.ticketBriefingTitle, payload.title, { hideWhenEmpty: false });
    fillBadge(els.ticketBriefingId, "Ticket", payload.ticketId);
    fillBadge(els.ticketBriefingPriority, "Priority", payload.priority);
    fillBadge(els.ticketBriefingReportedBy, "Reported By", payload.reportedBy);
    fillBadge(els.ticketBriefingReportedTime, "Reported", payload.reportedTime);
    fillBadge(els.ticketBriefingRole, "Role", payload.role);
    fillBadge(els.ticketBriefingEstimatedTime, "Estimated", payload.estimatedTime);
    fillBlock(els.ticketBriefingAffectedBlock, els.ticketBriefingAffectedSystem, payload.affectedSystem);
    fillBlock(els.ticketBriefingSummaryBlock, els.ticketBriefingSummary, payload.summary);
    fillBlock(els.ticketBriefingUserReportBlock, els.ticketBriefingUserReport, payload.userReport);
    fillListBlock(els.ticketBriefingSymptomsBlock, els.ticketBriefingSymptoms, payload.symptoms);
    fillListBlock(els.ticketBriefingKnownFactsBlock, els.ticketBriefingKnownFacts, payload.knownFacts);
    fillBlock(els.ticketBriefingObjectiveBlock, els.ticketBriefingObjective, payload.objective);
    fillListBlock(els.ticketBriefingConstraintsBlock, els.ticketBriefingConstraints, payload.constraints);
    fillBlock(els.ticketBriefingTagsBlock, els.ticketBriefingTags, payload.tags.join(" | "));
    fillBlock(els.ticketBriefingEscalationBlock, els.ticketBriefingEscalationNote, payload.escalationNote);
    fillBlock(els.ticketBriefingEasterEggBlock, els.ticketBriefingEasterEggNote, payload.easterEggNote);
  }

  function clearTaskCompleteCard() {
    if (!els.taskCompleteCard) {
      return;
    }
    session.taskCompleteOpen = false;
    els.taskCompleteCard.hidden = true;
    els.taskCompleteCard.setAttribute("aria-hidden", "true");
    if (els.taskCompleteOverlay) {
      els.taskCompleteOverlay.hidden = true;
    }
    document.body.classList.remove("task-complete-open");
    fillText(els.taskCompleteProof, "");
    fillText(els.taskCompleteWhy, "");
    fillText(els.taskCompleteNext, "");
  }

  function closeTaskCompleteCard(options = {}) {
    if (!els.taskCompleteCard) {
      return;
    }

    const restoreFocus = options.restoreFocus !== false;
    clearTaskCompleteCard();

    if (restoreFocus && !session.ticketBriefingOpen && !session.beginnerGuideOpen) {
      focusTerminalInputAtEnd();
    }
  }

  function renderTaskCompleteCard({ proof = "", why = "", next = "" } = {}) {
    if (!els.taskCompleteCard) {
      return;
    }

    fillText(els.taskCompleteProof, proof || "Good. That command moved the task forward.", { hideWhenEmpty: false });
    fillText(els.taskCompleteWhy, why || "This result gave you evidence for the next decision.", { hideWhenEmpty: false });
    fillText(els.taskCompleteNext, next || "Continue with the current task.", { hideWhenEmpty: false });
    session.taskCompleteOpen = true;
    els.taskCompleteCard.hidden = false;
    els.taskCompleteCard.setAttribute("aria-hidden", "false");
    if (els.taskCompleteOverlay) {
      els.taskCompleteOverlay.hidden = false;
    }
    document.body.classList.add("task-complete-open");
    window.setTimeout(() => {
      els.taskCompleteCloseBtn?.focus({ preventScroll: true });
    }, 0);
  }

  function closeBeginnerGuide(options = {}) {
    if (!els.beginnerOnboardingCard) {
      return;
    }

    const restoreFocus = options.restoreFocus !== false;
    session.beginnerGuideOpen = false;
    els.beginnerOnboardingCard.hidden = true;
    els.beginnerOnboardingCard.setAttribute("aria-hidden", "true");
    if (els.beginnerOnboardingOverlay) {
      els.beginnerOnboardingOverlay.hidden = true;
    }
    document.body.classList.remove("beginner-onboarding-open");

    if (restoreFocus && !session.ticketBriefingOpen) {
      focusTerminalInputAtEnd();
    }
  }

  function openBeginnerGuide(options = {}) {
    if (!isBeginnerMode() || !els.beginnerOnboardingCard) {
      return;
    }

    const force = Boolean(options.force);
    const alreadySeen = readLocalFlag(beginnerGuideStorageKey());
    if (!force && alreadySeen) {
      session.beginnerGuideSeen = true;
      return;
    }

    session.beginnerGuideSeen = true;
    session.beginnerGuideOpen = true;
    writeLocalFlag(beginnerGuideStorageKey(), true);
    els.beginnerOnboardingCard.hidden = false;
    els.beginnerOnboardingCard.setAttribute("aria-hidden", "false");
    if (els.beginnerOnboardingOverlay) {
      els.beginnerOnboardingOverlay.hidden = false;
    }
    document.body.classList.add("beginner-onboarding-open");

    window.setTimeout(() => {
      els.beginnerOnboardingStartBtn?.focus({ preventScroll: true });
    }, 0);
  }

  function closeTicketBriefing(options = {}) {
    if (!els.ticketBriefingCard) {
      return;
    }

    const restoreFocus = options.restoreFocus !== false;
    session.ticketBriefingOpen = false;
    els.ticketBriefingCard.hidden = true;
    els.ticketBriefingCard.setAttribute("aria-hidden", "true");
    if (els.ticketBriefingOverlay) {
      els.ticketBriefingOverlay.hidden = true;
    }
    document.body.classList.remove("ticket-briefing-open");

    if (restoreFocus) {
      focusTerminalInputAtEnd();
    }
  }

  function openTicketBriefing(scenario = currentScenario()) {
    if (!els.ticketBriefingCard) {
      return;
    }

    renderTicketBriefing(scenario);
    session.ticketBriefingSeen = true;
    session.ticketBriefingOpen = true;
    els.ticketBriefingCard.hidden = false;
    els.ticketBriefingCard.setAttribute("aria-hidden", "false");
    if (els.ticketBriefingOverlay) {
      els.ticketBriefingOverlay.hidden = false;
    }
    document.body.classList.add("ticket-briefing-open");
    if (els.ticketBriefingStartBtn) {
      window.setTimeout(() => {
        els.ticketBriefingStartBtn.focus({ preventScroll: true });
      }, 0);
    }
  }

  function categorySummary(score) {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Passed with Coaching Notes";
    return "Needs Practice";
  }

  function renderMissionReview(scenario = currentScenario()) {
    if (!els.missionReviewCard) {
      return;
    }

    const stats = session.reviewStats || createReviewStats();
    const hasScoringData = Boolean(
      stats.totalSubmitted
      || stats.successfulAccepted
      || stats.partialCommands
      || stats.incorrectCommands
      || stats.explorationCommands
      || stats.riskyActions.length
      || stats.successfulStepObjectives.length
    );
    const totalSubmitted = Math.max(1, stats.totalSubmitted);
    const expectedSteps = Math.max(1, totalStepsForScenario(scenario));
    const commandAccuracy = clampScore(((stats.successfulAccepted + (stats.partialCommands * 0.5) + (stats.explorationCommands * 0.35)) / totalSubmitted) * 100);
    const inefficiencyPenalty = Math.max(0, stats.totalSubmitted - expectedSteps) * 6;
    const explorationCredit = Math.min(stats.explorationCommands * 3, 12);
    const efficiency = clampScore(100 - inefficiencyPenalty + explorationCredit);
    const troubleshootingLogic = clampScore(100 - (stats.incorrectCommands * 8) - (stats.repeatedIncorrectCommands * 6) - (stats.partialCommands * 3));

    const verificationConfigured = Boolean(scenario.verificationRequired || (Array.isArray(scenario.verificationSteps) && scenario.verificationSteps.length));
    const verificationObserved = stats.successfulStepObjectives.some((objective) => verificationKeywords().test(objective))
      || (Array.isArray(scenario.verificationSteps) && scenario.verificationSteps.some((item) => stats.submittedCommands.some((command) => command.toLowerCase().includes(String(item).toLowerCase()))));
    const verificationScore = verificationConfigured ? (verificationObserved ? 100 : 55) : null;

    const riskConfigured = Array.isArray(scenario.riskyCommands) && scenario.riskyCommands.length > 0;
    const riskScore = riskConfigured ? clampScore(100 - (stats.riskyActions.length * 30)) : null;

    const scoredValues = hasScoringData ? [troubleshootingLogic, commandAccuracy, efficiency] : [];
    if (verificationScore !== null) scoredValues.push(verificationScore);
    if (riskScore !== null) scoredValues.push(riskScore);
    const overallScore = scoredValues.length
      ? clampScore(scoredValues.reduce((sum, value) => sum + value, 0) / scoredValues.length)
      : null;

    const strengths = [];
    const improvements = [];

    if (troubleshootingLogic >= 75) strengths.push("Followed a mostly logical path through the task.");
    else improvements.push("Reduce repeated or random attempts and let the last result guide the next step.");

    if (commandAccuracy >= 80) strengths.push("Most submitted commands supported the objective.");
    else improvements.push("Tighten command selection so more of your input moves the investigation forward.");

    if (efficiency >= 75) strengths.push("Completed the mission without excessive extra commands.");
    else improvements.push("Trim unnecessary commands once the evidence already points to the next action.");

    if (verificationScore === 100) strengths.push("Verified the outcome before closing the work.");
    else if (verificationScore !== null) improvements.push("Add an explicit verification step before you consider the task resolved.");

    if (riskScore === null) {
      strengths.push("Stayed within the safe boundaries of the training environment.");
    } else if (stats.riskyActions.length === 0) {
      strengths.push("Avoided risky or destructive actions during the mission.");
    } else {
      improvements.push("Pause before using destructive or disruptive commands unless the evidence clearly justifies them.");
    }

    const takeaway = verificationScore === 100
      ? "Strong technicians do not stop at a likely fix. They confirm the result and leave a clear trail of evidence."
      : "Good support and security work is not just about finding an answer. It is about using evidence, choosing safe actions, and proving the result.";

    els.missionReviewCard.hidden = !session.scenarioCompleted;
    if (!session.scenarioCompleted) {
      return;
    }

    const reviewKey = `${scenario.id || scenario.title || "scenario"}:${session.scenarioCompleted}:${stats.totalSubmitted}`;
    if (session.debugReviewKey !== reviewKey) {
      missionDebug("Rendering mission review");
      session.debugReviewKey = reviewKey;
    }

    fillText(els.missionReviewOverall, `Overall: ${overallScore === null ? "Completed" : categorySummary(overallScore)}`, { hideWhenEmpty: false });

    fillText(els.reviewTroubleshootingScore, hasScoringData ? `${troubleshootingLogic}%` : "Completed", { hideWhenEmpty: false });
    fillText(els.reviewTroubleshootingFeedback, hasScoringData ? (troubleshootingLogic >= 75 ? "You followed a mostly logical troubleshooting path." : "Your path reached the objective, but repeated incorrect attempts reduced the diagnostic quality.") : "You completed the assigned mission flow.");

    fillText(els.reviewAccuracyScore, hasScoringData ? `${commandAccuracy}%` : "Not assessed", { hideWhenEmpty: false });
    fillText(els.reviewAccuracyFeedback, hasScoringData ? (commandAccuracy >= 80 ? "Most submitted commands moved the task forward." : "Several submitted commands did not support the current objective.") : "Detailed command-attempt scoring was not available for this completion record.");

    fillText(els.reviewEfficiencyScore, hasScoringData ? `${efficiency}%` : "Not assessed", { hideWhenEmpty: false });
    fillText(els.reviewEfficiencyFeedback, hasScoringData ? (efficiency >= 75 ? "You completed the work with a reasonable command footprint." : "You completed the mission, but extra commands reduced efficiency.") : "Efficiency was not assessed for this completion record.");

    fillText(els.reviewVerificationScore, verificationScore === null ? (session.scenarioCompleted ? "Complete" : "Not assessed") : verificationScore === 100 ? "Complete" : "Needs stronger closure", { hideWhenEmpty: false });
    fillText(els.reviewVerificationFeedback, verificationScore === null ? (session.scenarioCompleted ? "The mission reached a completed state." : "This scenario did not provide enough verification metadata to assess closure.") : verificationScore === 100 ? "You confirmed the result before closing the task." : "The mission ended without a strong verification signal.");

    fillText(els.reviewRiskScore, riskScore === null ? "No risky actions detected" : stats.riskyActions.length ? "Coaching needed" : "Good", { hideWhenEmpty: false });
    fillText(els.reviewRiskFeedback, riskScore === null ? "No risky actions were detected during this mission." : stats.riskyActions.length ? stats.riskyActions.map((entry) => entry.reason).join(" ") : "No risky or destructive actions were detected.");

    renderListItems(els.missionReviewStrengths, strengths);
    renderListItems(els.missionReviewImprovements, improvements.length ? improvements : ["Keep using evidence-led sequencing and verification discipline."]);
    fillText(els.missionReviewTakeaway, takeaway, { hideWhenEmpty: false });
  }

  function renderStageUI(stageInfo = visibleStageInfo(currentScenario()), scenario = currentScenario()) {
    const beginnerTrack = isBeginnerRoadmapTrack();
    const stageTitleText = stageInfo
      ? `${beginnerTrack ? "Current Mission Section" : "Current Stage"}: ${stageInfo.stage.title}`
      : "";
    const stageBriefingText = stageInfo?.stage?.briefing || "";
    const mobileStageTitleText = stageInfo
      ? `${beginnerTrack ? "Mission Section" : "Stage"} ${stageInfo.stageIndex + 1}/${stageInfo.stageCount}: ${stageInfo.stage.title}`
      : "";
    const missionStageTitleText = stageInfo?.stage?.title || "";
    const missionStageProgressText = stageInfo
      ? `${beginnerTrack ? "Mission Section" : "Stage"} ${stageInfo.stageIndex + 1} of ${stageInfo.stageCount} · Task ${stageInfo.stageStepIndex + 1} of ${stageInfo.stageStepCount}`
      : "";
    const missionTotalProgressText = stageInfo
      ? `${beginnerTrack ? "Mission Task" : "Mission"} ${stageInfo.missionStepIndex + 1} of ${stageInfo.missionStepCount}`
      : "";

    if (els.scenarioStageTitle) {
      fillText(els.scenarioStageTitle, stageTitleText);
    }
    if (els.scenarioStageBriefing) {
      fillText(els.scenarioStageBriefing, stageBriefingText);
    }
    if (els.mobileStageTitle) {
      fillText(els.mobileStageTitle, mobileStageTitleText);
    }
    if (els.mobileStageBriefing) {
      fillText(els.mobileStageBriefing, stageBriefingText);
    }
    if (els.missionCurrentStageTitle) {
      fillText(els.missionCurrentStageTitle, missionStageTitleText);
    }
    if (els.missionCurrentStageBriefing) {
      fillText(els.missionCurrentStageBriefing, stageBriefingText);
    }
    if (els.missionStageProgress) {
      fillText(els.missionStageProgress, missionStageProgressText);
    }
    if (els.missionTotalProgress) {
      fillText(els.missionTotalProgress, missionTotalProgressText);
    }

    const stageKey = `${scenario?.id || scenario?.title || "scenario"}:${stageInfo?.stage?.id || "nostage"}:${stageInfo?.stageStepIndex ?? -1}`;
    if (session.debugStageKey !== stageKey) {
      missionDebug("Rendering stage UI", stageInfo?.stage?.title || "none");
      session.debugStageKey = stageKey;
    }
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
    if (
      !els.terminalInput
      || session.ticketBriefingOpen
      || session.beginnerGuideOpen
      || document.body.classList.contains("command-sheet-open")
      || document.body.classList.contains("terminal-mobile-menu-open")
      || document.body.classList.contains("terminal-mobile-info-open")
    ) return;
    const valueLength = els.terminalInput.value.length;
    scrollTerminal(true);
    syncMobileInputState(true);
    mobileDebug("input focus");
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

  function printTaggedLine(label, text, type = "system") {
    if (!text) return;
    printLine(`[${label}] ${text}`, type);
  }

  function printMissionLine(text) {
    printTaggedLine("Mission", text, "mission");
  }

  function printStageLine(text) {
    printTaggedLine("Stage", text, "stage");
  }

  function printCoachLine(text, type = "coach") {
    printTaggedLine("Coach", text, type);
  }

  function printHintLine(text) {
    printTaggedLine("Hint", text, "hint");
  }

  function printReviewLine(text) {
    printTaggedLine("Review", text, "review");
  }

  function printWalkthroughLine(text) {
    printTaggedLine("Walkthrough", text, "walkthrough");
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
    const stageInfo = visibleStageInfo(scenario);
    const beginnerMode = isBeginnerMode();
    const beginnerTrack = isBeginnerRoadmapTrack();
    const level = currentBeginnerLevel();
    const levelNumber = level ? beginnerLevelIndex(level.id) + 1 : 0;

    syncMobileAppBarTitle();
    syncMobileAppBarActions();
    document.body.classList.toggle("terminal-beginner-mode", beginnerMode);
    if (els.mobileMenuCommandsBtn) {
      els.mobileMenuCommandsBtn.textContent = beginnerMode ? "Command Help" : "Commands";
    }
    if (els.mobileMenuInfoBtn) {
      els.mobileMenuInfoBtn.textContent = beginnerMode ? "Beginner Guide" : "Instructions";
    }
    if (els.mobileInfoOverlay?.querySelector("#terminalMobileInfoTitle")) {
      els.mobileInfoOverlay.querySelector("#terminalMobileInfoTitle").textContent = beginnerMode ? "Beginner Guide" : "Instructions";
    }

    els.scenarioCountBadge.textContent = challengePresentation
      ? `Challenge ${session.scenarioIndex + 1} / ${totalScenarios()}`
      : beginnerTrack && level
        ? `Level ${levelNumber} · Mission ${scenario.title}`
        : `Scenario ${session.scenarioIndex + 1} / ${totalScenarios()}`;
    if (challengePresentation) {
      els.stepCountBadge.textContent = stageInfo
        ? `Stage ${stageInfo.stageIndex + 1} / ${stageInfo.stageCount} · Mission ${stageInfo.missionStepIndex + 1} / ${stageInfo.missionStepCount}`
        : "Challenge Active";
    } else {
      els.stepCountBadge.textContent = beginnerTrack && stageInfo
        ? `Mission Section ${stageInfo.stageIndex + 1} / ${stageInfo.stageCount} · Task ${stageInfo.stageStepIndex + 1} / ${stageInfo.stageStepCount}`
        : stageInfo
          ? `Stage ${stageInfo.stageIndex + 1} / ${stageInfo.stageCount} · Task ${stageInfo.stageStepIndex + 1} / ${stageInfo.stageStepCount}`
          : `Task ${session.stepIndex + 1} / ${scenario.steps.length}`;
    }
    if (els.environmentBadge) {
      els.environmentBadge.textContent = environmentLabel;
    }
    els.shellBadge.textContent = shellLabel();
    setCurrentLayer(scenario.layer || "application");
    syncScenarioLayerBadges(scenario);
    syncPageIdentity(scenario);

    els.scenarioCategory.textContent = scenario.category;
    els.scenarioTitle.textContent = scenario.title;
    els.scenarioLevel.textContent = beginnerTrack && level
      ? `${level.title} · ${scenario.level || scenario.difficulty || "Beginner"}`
      : (challengePresentation ? (scenario.difficulty || scenario.level) : scenario.level);
    if (els.scenarioEnvironmentBadge) {
      els.scenarioEnvironmentBadge.textContent = environmentLabel;
    }
    els.scenarioObjective.textContent = scenarioObjectiveText(scenario);
    renderStageUI(stageInfo, scenario);
    els.scenarioFlex.textContent = allowedApproachText(scenario);
    renderBeginnerLabCard(scenario, step);
    renderMissionCaseFile(scenario, stageInfo);
    renderMissionReview(scenario);
    if (els.environmentSummary) {
      els.environmentSummary.textContent = environmentSummaryText(scenario);
    }
    renderMachineContexts(scenario);
    els.stepObjective.textContent = challengePresentation ? challengeTaskText(scenario) : step.objective;
    if (els.beginnerCurrentTaskText) {
      els.beginnerCurrentTaskText.textContent = challengePresentation ? challengeTaskText(scenario) : step.objective;
    }
    if (els.beginnerTaskHelpText) {
      els.beginnerTaskHelpText.textContent = beginnerMode
        ? "Try typing a command. Not sure? Use Command Help."
        : "Try typing a command. Use Hint if you need a stronger nudge.";
    }
    els.progressSummary.textContent = stageInfo
      ? `${beginnerTrack && level ? `${level.title}. ` : ""}${missionProgressText(scenario)} ${session.completedScenarioIds.size} ${challengePresentation ? "challenges" : "scenarios"} completed in this session.`
      : `${session.completedScenarioIds.size} ${challengePresentation ? "challenges" : "scenarios"} completed in this session.`;
    if (els.mobileEnvironmentBadge) {
      els.mobileEnvironmentBadge.textContent = environmentLabel;
    }
    els.mobileScenarioTitle.textContent = challengePresentation
      ? `${scenario.title} - Challenge ${session.scenarioIndex + 1}/${totalScenarios()}`
      : `Mission: ${scenario.title}`;
    if (beginnerTrack && level && els.mobileStageTitle) {
      els.mobileStageTitle.hidden = false;
      els.mobileStageTitle.textContent = `Level ${levelNumber}: ${level.title.replace(/^Level\s+\d+:\s*/i, "")}`;
    }
    if (beginnerTrack && stageInfo && els.mobileStageBriefing) {
      els.mobileStageBriefing.hidden = false;
      els.mobileStageBriefing.textContent = `Mission Section ${stageInfo.stageIndex + 1}: ${stageInfo.stage.title}`;
    }
    els.mobileStepObjective.textContent = challengePresentation ? challengeTaskText(scenario) : step.objective;
    if (els.mobileMachineContext) {
      els.mobileMachineContext.textContent = primaryMachineContextText(scenario);
    }

    if (session.scenarioCompleted) {
      els.coachSignal.textContent = "Scenario complete. Move to the next scenario or reset this one and run it cleaner.";
    } else if (challengePresentation) {
      els.coachSignal.textContent = "Need help? Open Commands or use Hint.";
    } else {
      els.coachSignal.textContent = beginnerMode
        ? "Need help? Open Command Help, Hint, or Watch Walkthrough."
        : "Need help? Open Commands or use Hint.";
    }

    els.mobileCoachSignal.textContent = els.coachSignal.textContent;
    if (els.beginnerModeSummary) {
      els.beginnerModeSummary.textContent = "Read the ticket, then type a command. Need help? Use Command Help, Hint, or Watch Walkthrough.";
    }
    if (els.beginnerHelpStripText) {
      els.beginnerHelpStripText.textContent = "Not sure what to type? Tap Command Help, Hint, or Watch Walkthrough.";
    }
    if (els.commandSheetBtn) {
      els.commandSheetBtn.textContent = beginnerMode ? "Command Help" : "Commands";
    }
    if (els.currentTaskCard) {
      els.currentTaskCard.hidden = beginnerTrack;
    }
    if (els.progressCard) {
      els.progressCard.hidden = beginnerTrack;
    }
    if (els.beginnerTaskStrip) {
      els.beginnerTaskStrip.hidden = !beginnerMode;
    }
    if (els.beginnerHelpStrip) {
      els.beginnerHelpStrip.hidden = !beginnerMode;
    }
    if (els.beginnerModeBanner) {
      els.beginnerModeBanner.hidden = !beginnerMode;
    }

    if (els.watchWalkthroughBtn) {
      const walkthroughReady = walkthroughAvailable(scenario);
      els.watchWalkthroughBtn.disabled = !walkthroughReady || !session.scenarioStarted;
      els.watchWalkthroughBtn.title = !session.scenarioStarted
        ? "Start the scenario first."
        : walkthroughReady
          ? "Watch a short demonstration without changing your progress."
          : "No safe walkthrough is available for this scenario yet.";
    }

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
    const stageInfo = visibleStageInfo(scenario);
    const level = currentBeginnerLevel();

    // Terminal tracks are stateful, so resume stores both the selected scenario and the mutated shell state.
    return {
      track: pageConfig.environmentCategory || scenario.environmentCategory || "",
      mode: pageConfig.uiMode || (isBeginnerMode() ? "beginner" : "standard"),
      scenarioId: scenario.id,
      scenarioIndex: session.scenarioIndex,
      stepIndex: session.stepIndex,
      missionSectionId: stageInfo?.stage?.id || "",
      missionSectionIndex: stageInfo?.stageIndex ?? -1,
      beginnerLevelId: level?.id || scenario.beginnerLabLevelId || "",
      beginnerLevelIndex: level ? beginnerLevelIndex(level.id) : -1,
      beginnerLevelTitle: level?.title || "",
      beginnerCompletedLevelIds: beginnerLevelRoadmap("windows").filter((entry) => levelStatus(entry) === "Complete").map((entry) => entry.id),
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
      reviewStats: NetlabApp ? NetlabApp.clone(session.reviewStats) : cloneReviewStats(session.reviewStats),
      ticketBriefingSeen: session.ticketBriefingSeen,
      walkthroughActive: false,
      runtimeState: StateManager.clone(session.state),
      currentItemLabel: challengePresentation
        ? scenario.title
        : `${level ? `${level.title} - ` : ""}${scenario.title}${stageInfo ? ` - ${stageInfo.stage.title}` : ""} - ${step.objective}`
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
    const stageInfo = currentStageInfo(scenario);
    const level = currentBeginnerLevel();

    savedProgressRecord = NetlabApp.saveSectionProgress(currentSectionId(), {
      sectionLabel: sectionLabel(),
      currentItemId: scenario.id,
      currentItemLabel: challengePresentation
        ? scenario.title
        : `${level ? `${level.title} - ` : ""}${scenario.title}${stageInfo ? ` - ${stageInfo.stage.title}` : ""} - ${step.objective}`,
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
    session.stepIndex = Math.max(0, Math.min(Number(snapshot.stepIndex) || 0, totalStepsForScenario(currentScenario()) - 1));
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
    session.reviewStats = snapshot.reviewStats ? (NetlabApp ? NetlabApp.clone(snapshot.reviewStats) : cloneReviewStats(snapshot.reviewStats)) : createReviewStats();
    session.ticketBriefingSeen = Boolean(snapshot.ticketBriefingSeen);
    session.ticketBriefingOpen = false;
    session.walkthroughActive = false;
    session.walkthroughStepIndex = 0;
    session.walkthroughSteps = [];
    session.walkthroughTaskIndex = Number(snapshot.stepIndex) || 0;
    session.walkthroughLevelId = String(snapshot.beginnerLevelId || "");

    closeTicketBriefing({ restoreFocus: false });
    closeTaskCompleteCard({ restoreFocus: false });
    closeWalkthrough({ restoreFocus: false });
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

  function beginnerResumeHeading(record) {
    const levelTitle = record?.state?.beginnerLevelTitle || currentBeginnerLevel()?.title || "Beginner Terminal Lab";
    return `Resume ${levelTitle}?`;
  }

  function renderBeginnerRoadmapMarkup() {
    const levels = beginnerLevelRoadmap("windows");
    if (!levels.length) {
      return "";
    }

    const recommended = recommendedBeginnerLevel();
    const currentLevel = currentBeginnerLevel();
    const currentLevelTitle = currentLevel?.title || "Level 1: Terminal Orientation";
    const recommendedTitle = recommended?.title || currentLevelTitle;
    const cards = levels.map((level) => {
      const scenarios = levelScenarios(level);
      const missionCount = scenarios.length;
      const taskCount = totalTaskCountForLevel(level);
      const status = levelStatus(level);
      const isCurrent = currentLevel?.id === level.id;
      const isRecommended = recommended?.id === level.id && status !== "Complete";
      const firstScenarioId = scenarios[0]?.id || "";
      const completed = completedScenarioCountForLevel(level);
      const levelIndex = beginnerLevelIndex(level.id) + 1;
      const skills = (Array.isArray(level.skills) ? level.skills : []).slice(0, 5).map((skill) => `<span class="scenario-mini-badge">${escapeHtml(skill)}</span>`).join("");
      const actionButton = missionCount
        ? `<button class="app-action-btn beginner-level-launch-btn" type="button" data-level-id="${escapeHtml(level.id)}" data-scenario-id="${escapeHtml(firstScenarioId)}">${escapeHtml(isCurrent ? "Resume Level" : "Start Level")}</button>`
        : `<button class="app-action-btn app-action-btn-muted" type="button" disabled>Coming Soon</button>`;

      return [
        `<article class="support-card beginner-level-card${isCurrent ? " is-current" : ""}${isRecommended ? " is-recommended" : ""}" data-level-id="${escapeHtml(level.id)}">`,
        `  <div class="beginner-level-head">`,
        `    <div>`,
        `      <p class="mission-case-label">Level ${levelIndex}</p>`,
        `      <h3>${escapeHtml(level.title)}</h3>`,
        `    </div>`,
        `    <span class="status-badge${status === "Complete" ? " environment-badge" : status === "In Progress" ? " status-badge-blue" : ""}">${escapeHtml(status)}</span>`,
        `  </div>`,
        `  <p class="mission-case-copy">${escapeHtml(level.description || "")}</p>`,
        `  <p class="mission-case-copy">Estimated time: ${escapeHtml(level.estimatedTime || "Flexible")}</p>`,
        `  <p class="mission-case-copy">Missions: ${missionCount} · Tasks: ${taskCount} · Completed: ${completed}/${missionCount || 0}</p>`,
        isRecommended ? `  <p class="mission-case-copy beginner-level-recommend">Recommended Next</p>` : "",
        skills ? `  <div class="mission-case-meta">${skills}</div>` : "",
        `  <div class="app-shell-actions beginner-level-actions">${actionButton}</div>`,
        `</article>`
      ].join("");
    }).join("");

    return [
      `<section id="beginnerRoadmapPanel" class="support-card beginner-roadmap-panel">`,
      `  <div class="beginner-roadmap-head">`,
      `    <div>`,
      `      <p class="app-shell-kicker">Beginner Terminal Lab</p>`,
      `      <h3>Level Roadmap</h3>`,
      `      <p class="mission-case-copy">Current level: ${escapeHtml(currentLevelTitle)}. Recommended next: ${escapeHtml(recommendedTitle)}.</p>`,
      `    </div>`,
      `  </div>`,
      `  <details id="beginnerRoadmapDisclosure" class="support-disclosure beginner-roadmap-disclosure">`,
      `    <summary class="support-disclosure-summary">`,
      `      <span class="support-disclosure-title">View Beginner Roadmap</span>`,
      `      <span class="support-disclosure-meta">Choose a level</span>`,
      `    </summary>`,
      `    <div class="support-disclosure-body">`,
      `      <div class="beginner-roadmap-grid">${cards}</div>`,
      `    </div>`,
      `  </details>`,
      `</section>`
    ].join("");
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
    const beginnerTrack = isBeginnerRoadmapTrack();
    const currentLevel = currentBeginnerLevel();
    const recommendedLevel = recommendedBeginnerLevel();
    const resumeHeading = beginnerTrack && showResume
      ? beginnerResumeHeading(record)
      : `Resume ${sectionLabel()}`;
    const completionText = record && showResume
      ? `${record.completedCount}/${record.totalCount || totalScenarios()}`
      : `${session.completedScenarioIds.size}/${totalScenarios()}`;
    const lastItem = record?.currentItemLabel || (scenarioUsesChallengePresentation(activeScenario) ? activeScenario.title : `${activeScenario.title} - ${activeStep.objective}`);
    const accountHref = typeof NetlabApp.buildHubUrl === "function"
      ? (profile.isGuest ? NetlabApp.buildHubUrl({ auth: "login" }) : NetlabApp.buildHubUrl())
      : "./index.html#hubAccountPanel";
    const accountLabel = profile.isGuest ? "Sign In to Sync" : "Manage Account";

    const beginnerBadges = [
      "  <span class=\"status-badge\">Completed: " + escapeHtml(completionText) + "</span>",
      (currentLevel ? "  <span class=\"status-badge status-badge-blue\">" + escapeHtml("Current Level: " + currentLevel.title) + "</span>" : ""),
      (recommendedLevel ? "  <span class=\"status-badge environment-badge\">" + escapeHtml("Recommended Next: " + recommendedLevel.title) + "</span>" : "")
    ].filter(Boolean).join("");
    const standardBadges = [
      "  <span class=\"status-badge status-badge-blue\">Profile: " + escapeHtml(profile.label) + "</span>",
      "  <span class=\"status-badge\">Completed: " + escapeHtml(completionText) + "</span>",
      "  <span class=\"status-badge\">Coins: " + escapeHtml(NetlabApp.getCoinsTotal()) + "</span>",
      "  <span class=\"status-badge\">Last active: " + escapeHtml(lastItem) + "</span>"
    ].join("");

    els.appSectionShell.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Progress</p>",
      "    <h2>" + escapeHtml(resumeHeading) + "</h2>",
      "    <p class=\"app-shell-copy\">" + escapeHtml(showResume
        ? (beginnerTrack
          ? "Saved progress is available for this beginner lab. Resume the exact level, mission, and task you were working on, or choose another level."
          : "Saved progress is available for this section. Resume the last scenario or restart the track from the beginning.")
        : (beginnerTrack
          ? "This beginner lab saves your current level, mission, mission section, and live terminal state so you can return to the right task later."
          : "Profile: " + profile.label + ". This section saves its current scenario, completed items, and live terminal state so you can return to it later.")) + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      beginnerTrack ? beginnerBadges : standardBadges,
      "</div>",
      "<div class=\"app-shell-actions\">",
      (showResume ? "  <button id=\"resumeSectionBtn\" class=\"app-action-btn\" type=\"button\">Resume</button>" : ""),
      "  <a class=\"app-action-link\" href=\"" + escapeHtml(accountHref) + "\">" + escapeHtml(accountLabel) + "</a>",
      "  <button id=\"startOverSectionBtn\" class=\"app-action-btn\" type=\"button\">Start Over</button>",
      (beginnerTrack ? "  <button id=\"chooseLevelBtn\" class=\"app-action-btn\" type=\"button\">Choose Level</button>" : ""),
      "  <button id=\"toggleSoundBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
      "  <button id=\"resetProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
      "</div>",
      "<p class=\"app-shell-note\">" + escapeHtml(beginnerTrack
        ? "Last active: " + lastItem + ". Reset Progress clears all saved lab progress for the current profile. " + NetlabApp.getProfileStorageNote()
        : "Reset Progress clears all saved lab progress for the current profile. " + NetlabApp.getProfileStorageNote()) + "</p>",
      (beginnerTrack ? renderBeginnerRoadmapMarkup() : "")
    ].join("");

    const resumeBtn = document.getElementById("resumeSectionBtn");
    const startOverBtn = document.getElementById("startOverSectionBtn");
    const chooseLevelBtn = document.getElementById("chooseLevelBtn");
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

    if (chooseLevelBtn) {
      chooseLevelBtn.addEventListener("click", () => {
        const roadmapDisclosure = document.getElementById("beginnerRoadmapDisclosure");
        if (roadmapDisclosure) {
          roadmapDisclosure.open = true;
        }
        document.getElementById("beginnerRoadmapPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    els.appSectionShell.querySelectorAll(".beginner-level-launch-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const scenarioId = button.getAttribute("data-scenario-id");
        if (!scenarioId) {
          return;
        }
        loadScenarioById(scenarioId);
      });
    });
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
    const stageInfo = currentStageInfo(scenario);
    const beginnerTrack = isBeginnerRoadmapTrack();
    missionDebug("Loading scenario", scenario.title || scenario.id);
    missionDebug("Scenario has stages", Boolean(scenario.stages?.length));

    if (scenarioHasStages(scenario)) {
      printMissionLine(`Mission started: ${scenario.title}`);
      if (scenario.role) {
        printMissionLine(`Role: ${scenario.role}`);
      }
      printMissionLine(`Objective: ${scenarioObjectiveText(scenario)}`);
      printMissionLine(`Environment: ${shellLabel()} shell`);
    } else {
      printLine(`[${challengePresentation ? "Challenge" : scenario.category}] ${scenario.title}`, "system");
      printLine(`Track: ${scenarioEnvironmentLabel(scenario)}`, "dim");
      printLine(`Layer: ${scenarioLayerText(scenario)}`, "dim");
      printLine(`Objective: ${scenarioObjectiveText(scenario)}`, "dim");
      printLine(`Environment: ${shellLabel()} shell`, "dim");
    }
    if (machineSummary) {
      printLine(`Machine context: ${machineSummary}`, "dim");
    }
    if (scenario.scenarioIntro && !scenarioHasStages(scenario)) {
      printLine(`Context: ${scenario.scenarioIntro}`, "dim");
    }
    if (stageInfo) {
      printStageLine(`${stageInfo.stage.title}: ${stageInfo.stage.briefing || (beginnerTrack ? "Mission section active." : "Stage active.")}`);
      printLine(`--- ${beginnerTrack ? "Mission Section" : "Stage"} ${stageInfo.stageIndex + 1}: ${stageInfo.stage.title} ---`, "stage");
      if (stageInfo.stage.briefing) {
        printStageLine(`Goal: ${stageInfo.stage.briefing}`);
      }
    }
    if (challengePresentation) {
      const knownTargets = scenarioKnownTargets(scenario);
      if (knownTargets.length) {
        printLine(`Known targets: ${knownTargets.join(" | ")}`, "dim");
      }
    }
    if (challengePresentation && Array.isArray(scenario.successConditions) && scenario.successConditions.length) {
      printLine(`Success signals: ${scenario.successConditions.join(" | ")}`, "dim");
      printCoachLine("Need help? Open Commands or use Hint.");
      return;
    }
    printCoachLine(isBeginnerMode() ? "Need help? Open Command Help, Hint, or Watch Walkthrough." : "Need help? Open Commands or use Hint.");
  }

  function resetScenarioState() {
    closeTicketBriefing({ restoreFocus: false });
    closeBeginnerGuide({ restoreFocus: false });
    session.state = StateManager.createState(currentScenario().environment);
    setCurrentLayer(currentScenario().layer || "application");
    session.stepIndex = 0;
    session.attemptsForStep = 0;
    session.hintLevel = -1;
    session.scenarioCompleted = false;
    session.reviewStats = createReviewStats();
    session.ticketBriefingSeen = false;
    session.ticketBriefingOpen = false;
    clearTaskCompleteCard();
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
      if (!announce) {
        printLine(previewStartMessage(currentScenario()), "coach");
      } else {
        printLine(pageConfig.initialMessage, "coach");
      }
    }
    renderPanel();
    if (announce && !session.ticketBriefingSeen) {
      openTicketBriefing(currentScenario());
    }
    if (announce && isBeginnerMode()) {
      openBeginnerGuide();
    }
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
    if (focus && els.terminalInput && !isMobileTerminalLayout() && !session.ticketBriefingOpen) {
      els.terminalInput.focus();
    }
  }

  function previewScenario(index) {
    loadScenario(index, { announce: false, transition: false, focus: false, persist: false });
  }

  function markScenarioComplete() {
    const scenario = currentScenario();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const finalStageInfo = currentStageInfo(scenario);
    const beginnerTrack = isBeginnerRoadmapTrack();
    const firstCompletion = !session.completedScenarioIds.has(scenario.id);
    const completionCoins = NetlabApp?.coinsForDifficulty
      ? NetlabApp.coinsForDifficulty(scenario.difficulty, challengePresentation ? 10 : 5)
      : (challengePresentation ? 10 : 5);

    session.completedScenarioIds.add(scenario.id);
    session.scenarioCompleted = true;
    if (finalStageInfo?.stage?.completionSummary) {
      printStageLine(`${beginnerTrack ? "Section Complete" : "Stage Complete"}: ${finalStageInfo.stage.title}`);
      printStageLine(finalStageInfo.stage.completionSummary);
    }
    if (scenarioHasStages(scenario)) {
      printLine("=== Mission Complete ===", "review");
      printReviewLine("You resolved the incident path and completed the mission objectives.");
      printReviewLine("Open the Mission Review panel to see your performance breakdown.");
    } else {
      printReviewLine("Scenario complete. You reached the objective with live command input.");
    }
    if (firstCompletion && NetlabApp?.grantProgressReward) {
      NetlabApp.grantProgressReward({
        key: `scenario-complete:${currentSectionId()}:${scenario.id}`,
        coins: completionCoins,
        title: challengePresentation ? "Challenge Complete" : "Lesson Complete",
        label: "Section Complete",
        tone: "section",
        message: scenario.title
      });
    } else if (firstCompletion && NetlabApp?.awardCoins) {
      NetlabApp.awardCoins({
        key: `scenario-complete:${currentSectionId()}:${scenario.id}`,
        coins: completionCoins,
        title: challengePresentation ? "Challenge Complete" : "Lesson Complete",
        message: scenario.title
      });
    } else {
      NetlabApp?.showProgressPulse?.({ label: "Section Complete", tone: "section" });
    }
    renderPanel();
    persistSectionProgress();
  }

  function advanceStep(count = 1) {
    const scenario = currentScenario();
    const challengePresentation = scenarioUsesChallengePresentation(scenario);
    const beginnerTrack = isBeginnerRoadmapTrack();
    const skipCount = Math.max(1, Number(count) || 1);
    const completedStepNumber = Math.min(scenario.steps.length, session.stepIndex + skipCount);
    const previousStageInfo = currentStageInfo(scenario);

    for (let index = 0; index < skipCount; index += 1) {
      if (session.stepIndex >= scenario.steps.length - 1) {
        markScenarioComplete();
        return;
      }

      session.stepIndex += 1;
    }

    session.attemptsForStep = 0;
    session.hintLevel = -1;
    if (NetlabApp?.grantProgressReward) {
      NetlabApp.grantProgressReward({
        key: `scenario-step:${currentSectionId()}:${scenario.id}:step-${completedStepNumber}`,
        coins: challengePresentation ? 3 : 2,
        title: challengePresentation ? "Challenge Step" : "Lesson Step",
        label: "Step Complete",
        tone: "step",
        message: `${scenario.title} - Step ${completedStepNumber}`
      });
    } else {
      NetlabApp?.showProgressPulse?.({ label: "Step Complete", tone: "step" });
    }
    if (skipCount > 1) {
      printLine("You already collected the deeper evidence, so the coach skipped the redundant intermediate task.", "success");
    }
    const nextStageInfo = currentStageInfo(scenario);
    if (previousStageInfo && nextStageInfo && previousStageInfo.stage.id !== nextStageInfo.stage.id) {
      if (previousStageInfo.stage.completionSummary) {
        printStageLine(`${beginnerTrack ? "Section Complete" : "Stage Complete"}: ${previousStageInfo.stage.title}`);
        printStageLine(previousStageInfo.stage.completionSummary);
      }
      printLine(`--- ${beginnerTrack ? "Mission Section" : "Stage"} ${nextStageInfo.stageIndex + 1}: ${nextStageInfo.stage.title} ---`, "stage");
      printStageLine(`Next ${beginnerTrack ? "Section" : "Stage"}: ${nextStageInfo.stage.title}`);
      if (nextStageInfo.stage.briefing) {
        printStageLine(`Goal: ${nextStageInfo.stage.briefing}`);
      }
    }
    if (challengePresentation) {
      printCoachLine("Progress recorded. Keep investigating and let the evidence drive the next move.");
      renderPanel();
      persistSectionProgress();
      return;
    }
    if (currentStep().context) {
      printLine(`Context: ${currentStep().context}`, "dim");
    }
    printCoachLine(`Next objective: ${currentStep().objective}`);
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

    if (!session.reviewStats) {
      session.reviewStats = createReviewStats();
    }

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

    const normalizedCommand = String(execution.raw || "").trim().toLowerCase();
    const repeatedCommandMessage = !evaluation.success ? repeatedCommandCoaching(execution.raw) : "";

    if (evaluation.success) {
      session.reviewStats.successfulAccepted += 1;
      session.reviewStats.successfulStepObjectives.push(step.objective);
    } else if (evaluation.source === "exploration" || evaluation.classification === "exploration") {
      session.reviewStats.explorationCommands += 1;
    } else if (evaluation.source === "partial" || evaluation.classification === "inefficient") {
      session.reviewStats.partialCommands += 1;
    } else {
      session.reviewStats.incorrectCommands += 1;
      session.reviewStats.duplicateWrongTracker[normalizedCommand] = (session.reviewStats.duplicateWrongTracker[normalizedCommand] || 0) + 1;
      if (session.reviewStats.duplicateWrongTracker[normalizedCommand] > 1) {
        session.reviewStats.repeatedIncorrectCommands += 1;
      }
    }

    if (evaluation.success) {
      const nextStep = currentScenario().steps?.[session.stepIndex + (evaluation.advanceBy || 1)] || null;
      const proofText = String(step.successFeedback || "Good. That command moved the investigation forward.").trim();
      const explanationText = String(step.explanation || "").trim();
      const whyText = String(step.whyThisMatters || step.completionSummary || "").trim();
      const nextText = String(step.nextObjective || nextStep?.objective || "Continue with the current mission objective.").trim();
      const realWorldText = String(step.realWorldNote || "").trim();

      renderTaskCompleteCard({
        proof: proofText,
        why: [whyText, realWorldText].filter(Boolean).join(" "),
        next: nextText
      });

      if (isBeginnerMode()) {
        printLine("[Task Complete]", "success");
        printCoachLine("Good. That moved the ticket forward.", "success");
        printCoachLine("See Task Complete notes for what you proved.", "dim");
      } else {
        printLine("[Task Complete]", "success");
        printCoachLine(`What you proved: ${proofText}`, "success");
        if (explanationText && explanationText !== proofText) {
          printCoachLine(`Command note: ${explanationText}`, "dim");
        }
        if (whyText) {
          printCoachLine(`Why it matters: ${whyText}`, "dim");
        }
        if (realWorldText) {
          printCoachLine(`Real-world note: ${realWorldText}`, "dim");
        }
        printCoachLine(`Next: ${nextText}`, "dim");
        if (evaluation.coach) {
          printCoachLine(evaluation.coach);
        }
      }
      advanceStep(evaluation.advanceBy || 1);
      return;
    }

    if (evaluation.countsAsAttempt !== false) {
      session.hintLevel = Math.max(session.hintLevel, CoachEngine.getHintTierFromAttempts(session.attemptsForStep));
    }

    if (evaluation.classification !== "exploration") {
      NetlabApp?.showProgressPulse?.({ label: "Try Again", tone: "error" });
    }

    if (evaluation.source === "exploration" || evaluation.classification === "exploration") {
      printCoachLine(isBeginnerMode() ? "Useful context. The task is still open." : "Useful context, but the task is still open.", "system");
      if (evaluation.feedback) {
        printCoachLine(shortCoachCopy(evaluation.feedback, "Keep the current task in mind as you investigate."), "dim");
      }
    } else if (evaluation.source === "partial" || evaluation.classification === "inefficient") {
      printCoachLine("Close. You are in the right area, but not there yet.");
      if (evaluation.feedback) {
        printCoachLine(shortCoachCopy(evaluation.feedback, "Stay with the same command family and narrow the target."), "dim");
      }
    } else {
      printCoachLine(
        isBeginnerMode()
          ? "That command did not answer the current task."
          : "That did not answer the current task yet. Try using the command panel or request a hint.",
        evaluation.classification === "invalid_command" ? "error" : "coach"
      );
      printCoachLine(
        isBeginnerMode()
          ? progressiveWrongAttemptGuidance(step, session.attemptsForStep, currentScenario()).replace("Open Commands", "Open Command Help")
          : progressiveWrongAttemptGuidance(step, session.attemptsForStep, currentScenario()),
        "dim"
      );
    }

    if (repeatedCommandMessage) {
      printCoachLine(repeatedCommandMessage, "dim");
    }

    if (evaluation.hint) {
      printHintLine(`Hint ${Math.max(1, session.hintLevel + 1)} [${hintContextLabel()}]: ${shortCoachCopy(evaluation.hint, evaluation.hint)}`);
    }
    if (execution.status === "syntax_error" || execution.status === "invalid_command") {
      const reference = getCommandReference(execution.raw);
      if (reference) {
        printCoachLine(`Reference: ${reference.command} -> ${reference.meaning}`, "dim");
      }
    }
    renderPanel();
  }

  function runSubmittedCommand(event) {
    event.preventDefault();
    const rawInput = els.terminalInput.value.trim();
    if (!rawInput) return;

    mobileDebug("command submitted");

    if (session.beginnerGuideOpen) {
      closeBeginnerGuide({ restoreFocus: false });
    }

    if (session.ticketBriefingOpen) {
      closeTicketBriefing({ restoreFocus: false });
    }

    if (session.walkthroughActive) {
      closeWalkthrough({ restoreFocus: false });
    }

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

    if (!session.reviewStats) {
      session.reviewStats = createReviewStats();
    }
    session.reviewStats.totalSubmitted += 1;
    session.reviewStats.submittedCommands.push(rawInput);
    const normalizedCommand = rawInput.toLowerCase();
    session.reviewStats.submittedCommandTracker[normalizedCommand] = (session.reviewStats.submittedCommandTracker[normalizedCommand] || 0) + 1;
    const riskyMatch = riskyCommandMatch(rawInput);
    if (riskyMatch) {
      session.reviewStats.riskyActions.push({
        command: rawInput,
        reason: riskyMatch.reason || "Potentially risky command used in the scenario."
      });
    }

    const execution = executeInput(rawInput);
    presentExecution(execution);
    updatePrompt();

    if (!session.scenarioCompleted) {
      evaluateCurrentStep(execution);
    }

    renderPanel();
    persistSectionProgress();
    if (isMobileTerminalLayout() && !session.ticketBriefingOpen && !session.beginnerGuideOpen) {
      window.requestAnimationFrame(() => {
        focusTerminalInputAtEnd();
      });
    } else if (document.activeElement === els.terminalInput) {
      scheduleMobileTerminalReveal(0);
    }
  }

  function runWalkthrough() {
    console.log("[WalkthroughDebug] button clicked");
    if (!session.scenarioStarted) {
      printLine("Start the selected challenge before watching a walkthrough.", "coach");
      return;
    }

    const scenario = currentScenario();
    const step = currentStep();
    const payload = walkthroughPayload(scenario, step, session.stepIndex);
    const entries = payload.entries;
    console.log("[WalkthroughDebug] scenario", scenario?.title || scenario?.id);
    console.log("[WalkthroughDebug] step", step?.objective);
    console.log("[WalkthroughDebug] using custom walkthrough", Boolean(payload.custom));
    console.log("[WalkthroughDebug] using fallback walkthrough", Boolean(payload.fallback));
    if (!entries.length) {
      printCoachLine("No safe walkthrough is available for this scenario yet.");
      return;
    }

    openWalkthrough(entries, { source: payload.source, startIndex: 0 });
    renderPanel();
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
    printHintLine(`Hint ${session.hintLevel + 1} [${hintContextLabel()}]: ${walkthroughHintText(currentStep(), session.hintLevel + 1, currentScenario())}`);
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
    if (!els.terminalForm || !els.terminalInput) {
      console.error("[TerminalDebug] terminal form/input missing");
    } else if (els.terminalForm.offsetParent === null || els.terminalInput.offsetParent === null) {
      console.warn("[TerminalDebug] terminal form may be hidden", {
        formHidden: els.terminalForm.offsetParent === null,
        inputHidden: els.terminalInput.offsetParent === null
      });
    }

    if (els.terminalForm) {
      els.terminalForm.addEventListener("submit", runSubmittedCommand);
    }
    if (els.hintBtn) {
      els.hintBtn.addEventListener("click", showHint);
    }
    if (els.watchWalkthroughBtn) {
      els.watchWalkthroughBtn.addEventListener("click", runWalkthrough);
    } else {
      console.warn("[WalkthroughDebug] no walkthrough button found");
    }
    if (els.walkthroughPrevBtn) {
      els.walkthroughPrevBtn.addEventListener("click", () => {
        if (!session.walkthroughActive) {
          return;
        }
        session.walkthroughStepIndex = Math.max(0, session.walkthroughStepIndex - 1);
        renderWalkthroughStep();
      });
    }
    if (els.walkthroughNextBtn) {
      els.walkthroughNextBtn.addEventListener("click", () => {
        if (!session.walkthroughActive) {
          return;
        }
        if (session.walkthroughStepIndex >= session.walkthroughSteps.length - 1) {
          closeWalkthrough();
          return;
        }
        session.walkthroughStepIndex += 1;
        renderWalkthroughStep();
      });
    }
    if (els.walkthroughTryBtn) {
      els.walkthroughTryBtn.addEventListener("click", () => {
        closeWalkthrough();
      });
    }
    if (els.walkthroughCloseBtn) {
      els.walkthroughCloseBtn.addEventListener("click", () => {
        closeWalkthrough();
      });
    }
    if (els.walkthroughOverlay) {
      els.walkthroughOverlay.addEventListener("click", () => {
        closeWalkthrough();
      });
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
    if (els.ticketBriefingStartBtn) {
      els.ticketBriefingStartBtn.addEventListener("click", () => {
        closeTicketBriefing();
      });
    }
    if (els.ticketBriefingCloseBtn) {
      els.ticketBriefingCloseBtn.addEventListener("click", () => {
        closeTicketBriefing();
      });
    }
    if (els.ticketBriefingOverlay) {
      els.ticketBriefingOverlay.addEventListener("click", () => {
        closeTicketBriefing();
      });
    }
    if (els.beginnerGuideBtn) {
      els.beginnerGuideBtn.addEventListener("click", () => {
        openBeginnerGuide({ force: true });
      });
    }
    if (els.beginnerOnboardingStartBtn) {
      els.beginnerOnboardingStartBtn.addEventListener("click", () => {
        closeBeginnerGuide({ restoreFocus: false });
        if (session.ticketBriefingOpen && els.ticketBriefingStartBtn) {
          els.ticketBriefingStartBtn.focus({ preventScroll: true });
        } else {
          focusTerminalInputAtEnd();
        }
      });
    }
    if (els.beginnerOnboardingWalkthroughBtn) {
      els.beginnerOnboardingWalkthroughBtn.addEventListener("click", () => {
        closeBeginnerGuide({ restoreFocus: false });
        closeTicketBriefing({ restoreFocus: false });
        runWalkthrough();
      });
    }
    if (els.beginnerOnboardingOverlay) {
      els.beginnerOnboardingOverlay.addEventListener("click", () => {
        closeBeginnerGuide();
      });
    }

    if (els.taskCompleteCloseBtn) {
      els.taskCompleteCloseBtn.addEventListener("click", () => {
        closeTaskCompleteCard();
      });
    }

    if (els.taskCompleteOverlay) {
      els.taskCompleteOverlay.addEventListener("click", () => {
        closeTaskCompleteCard();
      });
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
        mobileDebug("input focus");
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
            mobileDebug("input blur");
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

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (session.taskCompleteOpen) {
        closeTaskCompleteCard();
        return;
      }

      if (session.walkthroughActive) {
        closeWalkthrough();
        return;
      }

      if (session.beginnerGuideOpen) {
        closeBeginnerGuide();
        return;
      }

      if (session.ticketBriefingOpen) {
        closeTicketBriefing();
        return;
      }

      if (document.body.classList.contains("terminal-mobile-info-open")) {
        closeMobileInfo({ restoreFocus: true, focusTerminal: isBeginnerMode() });
        return;
      }

      if (document.body.classList.contains("terminal-mobile-menu-open")) {
        closeMobileMenu({ restoreFocus: true, focusTerminal: isBeginnerMode() });
      }
    });

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

    document.addEventListener("terminalcoach:commandsheet", (event) => {
      const opening = Boolean(event.detail?.open);
      mobileDebug(`command sheet ${opening ? "opened" : "closed"}`);
      if (!opening && isBeginnerMode() && isMobileTerminalLayout()) {
        window.setTimeout(() => focusTerminalInputAtEnd(), 60);
      }
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

  function previewSavedProgress(record) {
    const state = record?.state || {};
    const savedScenarioId = String(state.scenarioId || "");
    const fallbackIndex = Number.isInteger(state.scenarioIndex) ? state.scenarioIndex : Number(state.scenarioIndex) || 0;
    const stepIndex = Math.max(0, Number(state.stepIndex) || 0);
    const loaded = savedScenarioId ? previewScenarioById(savedScenarioId) : false;

    if (!loaded) {
      previewScenario(fallbackIndex);
    }

    session.stepIndex = Math.min(stepIndex, Math.max(0, currentScenario().steps.length - 1));
    renderPanel();
    renderSectionShell();
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
    ensureMobileShellChrome();
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

    if (savedProgressRecord && session.resumePromptVisible) {
      previewSavedProgress(savedProgressRecord);
      return;
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
