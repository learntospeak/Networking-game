window.TerminalCoachConfig = {
  mode: "challenge",
  environmentCategory: "cyber",
  autoStart: false,
  challengeTaskText: "Investigate the environment, reason from the evidence, and decide the next move.",
  challengeIntroSignal: "Minimal guidance is active. Investigate, reason, and solve the task.",
  challengeHintAttempts: [1, 3, 5],
  initialMessage: "Select a challenge card and press Start Challenge to begin.",
  commandSheetDefaultCategory: "Linux",
  commandSheetCategories: ["Linux", "Nmap", "Netcat", "Metasploit"],
  scenarioFilter: (scenario) => scenario.mode === "challenge"
};

(() => {
  function formatLayerName(layer) {
    return String(layer || "").toUpperCase();
  }

  function renderList(target, items) {
    if (!target) return;
    target.innerHTML = "";

    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      target.appendChild(li);
    });
  }

  function formatMachineContexts(scenario) {
    return (scenario?.machineContexts || []).map((context) => {
      const parts = [context.label, context.role, context.detail].filter(Boolean);
      return parts.join(" | ");
    });
  }

  function initChallengeMode() {
    const engine = window.TerminalEngine;
    if (!engine) return;

    const els = {
      grid: document.getElementById("challengeCardGrid"),
      status: document.getElementById("challengeSelectorStatus"),
      startBtn: document.getElementById("startChallengeBtn"),
      difficultyMeta: document.getElementById("challengeDifficultyMeta"),
      layersMeta: document.getElementById("challengeLayersMeta"),
      successList: document.getElementById("challengeSuccessList"),
      contextList: document.getElementById("challengeContextList"),
      approachList: document.getElementById("challengeApproachList"),
      environmentSummary: document.getElementById("environmentSummary")
    };

    const scenarios = engine.getScenarios();
    let selectedId = engine.getCurrentScenario()?.id || scenarios[0]?.id || null;

    function currentSelection() {
      return scenarios.find((scenario) => scenario.id === selectedId) || scenarios[0] || null;
    }

    function syncCardState(activeId) {
      Array.from(els.grid.querySelectorAll(".challenge-card")).forEach((card) => {
        card.classList.toggle("active", card.dataset.scenarioId === activeId);
      });
    }

    function updateDetailPanels(scenario) {
      if (!scenario) return;

      const layerText = (scenario.layers || [scenario.layer || "application"])
        .map(formatLayerName)
        .join(" + ");

      if (els.difficultyMeta) {
        els.difficultyMeta.textContent = `Difficulty: ${scenario.difficulty || scenario.level}`;
      }

      if (els.layersMeta) {
        els.layersMeta.textContent = `Layers: ${layerText}`;
      }

      renderList(els.successList, scenario.successConditions);
      renderList(els.contextList, formatMachineContexts(scenario));
      renderList(els.approachList, scenario.allowedApproaches);

      if (els.environmentSummary) {
        const primaryContext = scenario.machineContexts?.[0];
        const primaryLabel = primaryContext?.label || "Analyst Box";
        els.environmentSummary.textContent = `${scenario.environmentLabel || "Cyber Challenge Mode"} keeps command input on ${primaryLabel}. Target machines and application context are listed separately so the shell context stays obvious.`;
      }
    }

    function updateSelectorStatus(scenario, started) {
      if (!els.status || !scenario) return;
      els.status.textContent = `${started ? "Active" : "Selected"}: ${scenario.title}`;
    }

    function renderCards() {
      if (!els.grid) return;
      els.grid.innerHTML = "";

      scenarios.forEach((scenario) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "challenge-card";
        card.dataset.scenarioId = scenario.id;

        const layerText = (scenario.layers || [scenario.layer || "application"])
          .map(formatLayerName)
          .join(" + ");

        card.innerHTML = `
          <div class="challenge-card-header">
            <p class="scenario-category">${scenario.category}</p>
            <h3 class="challenge-card-title">${scenario.title}</h3>
          </div>
          <div class="challenge-meta-row">
            <span class="challenge-mini-badge">${scenario.environmentLabel || "Cyber Challenge Mode"}</span>
            <span class="challenge-mini-badge">${scenario.difficulty || scenario.level}</span>
            <span class="challenge-mini-badge">${layerText}</span>
          </div>
          <p class="challenge-card-copy">${scenario.challengeObjective || scenario.objective}</p>
        `;

        card.addEventListener("click", () => {
          selectedId = scenario.id;
          syncCardState(selectedId);
          updateDetailPanels(scenario);
          updateSelectorStatus(scenario, false);
          engine.previewScenarioById(selectedId);
        });

        els.grid.appendChild(card);
      });

      syncCardState(selectedId);
    }

    if (els.startBtn) {
      els.startBtn.addEventListener("click", () => {
        const scenario = currentSelection();
        if (!scenario) return;
        selectedId = scenario.id;
        engine.loadScenarioById(selectedId);
      });
    }

    document.addEventListener("terminalcoach:scenariochange", (event) => {
      const scenario = event.detail?.scenario;
      const started = Boolean(event.detail?.started);
      if (!scenario) return;

      selectedId = scenario.id;
      syncCardState(selectedId);
      updateDetailPanels(scenario);
      updateSelectorStatus(scenario, started);

      if (els.startBtn) {
        els.startBtn.textContent = started ? "Restart Challenge" : "Start Challenge";
      }
    });

    renderCards();

    const initial = currentSelection();
    if (initial) {
      updateDetailPanels(initial);
      updateSelectorStatus(initial, false);
      if (els.startBtn) {
        els.startBtn.textContent = "Start Challenge";
      }
    }
  }

  window.addEventListener("load", initChallengeMode);
})();
