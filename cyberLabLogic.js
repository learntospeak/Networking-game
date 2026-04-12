const cyberData = window.CYBER_LAB_DATA;

const els = {
  modeTabs: Array.from(document.querySelectorAll(".mode-tab-btn")),
  modeBadge: document.getElementById("modeBadge"),
  progressBadge: document.getElementById("progressBadge"),
  stepMiniBadge: document.getElementById("stepMiniBadge"),
  taskEyebrow: document.getElementById("taskEyebrow"),
  taskTitle: document.getElementById("taskTitle"),
  taskPrompt: document.getElementById("taskPrompt"),
  taskContext: document.getElementById("taskContext"),
  hintText: document.getElementById("hintText"),
  choiceOptions: document.getElementById("choiceOptions"),
  feedbackBadge: document.getElementById("feedbackBadge"),
  feedbackText: document.getElementById("feedbackText"),
  whyText: document.getElementById("whyText"),
  hintBtn: document.getElementById("hintBtn"),
  nextTaskBtn: document.getElementById("nextTaskBtn"),
  resetModeBtn: document.getElementById("resetModeBtn"),
  sectionGrid: document.getElementById("sectionGrid"),
  sectionName: document.getElementById("sectionName"),
  sectionCopy: document.getElementById("sectionCopy"),
  focusText: document.getElementById("focusText"),
  referenceTitle: document.getElementById("referenceTitle"),
  referenceDescription: document.getElementById("referenceDescription"),
  referenceList: document.getElementById("referenceList")
};

const state = {
  mode: "scenario",
  scenarioIndex: 0,
  commandIndex: 0,
  flagIndex: 0,
  workflowIndex: 0,
  workflowStepIndex: 0,
  locked: false
};

const modeMeta = {
  scenario: {
    label: "Scenario Mode",
    title: "Choose the next practical move",
    focus: "Read the situation, identify the next useful action, and avoid skipping from recon straight to exploitation."
  },
  command: {
    label: "Command Mode",
    title: "Select the correct command",
    focus: "Use the exact command that matches the task instead of a broad tool family or a later-stage step."
  },
  flag: {
    label: "Flag Mode",
    title: "Choose the right flag",
    focus: "Flags matter because they control scope, output, scan method, and connection behavior in real labs."
  },
  workflow: {
    label: "Workflow Mode",
    title: "Follow the engagement flow",
    focus: "Keep the order disciplined: discovery, confirmation, exploit preparation, then access handling."
  }
};

function formatLevel(level) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function getSection(sectionId) {
  return cyberData.sectionCards.find((card) => card.id === sectionId);
}

function getCurrentWorkflow() {
  return cyberData.workflows[state.workflowIndex];
}

function getCurrentItem() {
  if (state.mode === "scenario") return cyberData.scenarioQuestions[state.scenarioIndex];
  if (state.mode === "command") return cyberData.commandQuestions[state.commandIndex];
  if (state.mode === "flag") return cyberData.flagQuestions[state.flagIndex];
  return getCurrentWorkflow().steps[state.workflowStepIndex];
}

function updateModeTabs() {
  els.modeTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function clearHint() {
  els.hintText.textContent = "";
}

function showHint() {
  els.hintText.textContent = getCurrentItem().hint;
}

function setFeedback(type, text, why) {
  els.feedbackBadge.className = `feedback-badge ${type}`;
  els.feedbackBadge.textContent =
    type === "good" ? "Correct" : type === "bad" ? "Incorrect" : "Awaiting answer";
  els.feedbackText.textContent = text;
  els.whyText.textContent = why;
}

function resetFeedback() {
  setFeedback(
    "idle",
    "Pick the next useful action and the lab will explain why it fits.",
    "Strong lab work is sequencing. You move from discovery to confirmation to exploitation, not straight to random commands."
  );
}

function getProgressText() {
  if (state.mode === "scenario") {
    return `Scenario ${state.scenarioIndex + 1} of ${cyberData.scenarioQuestions.length}`;
  }

  if (state.mode === "command") {
    return `Command ${state.commandIndex + 1} of ${cyberData.commandQuestions.length}`;
  }

  if (state.mode === "flag") {
    return `Flag ${state.flagIndex + 1} of ${cyberData.flagQuestions.length}`;
  }

  return `Workflow ${state.workflowIndex + 1} of ${cyberData.workflows.length}`;
}

function getBadgeText() {
  if (state.mode !== "workflow") {
    return formatLevel(getCurrentItem().level);
  }

  const workflow = getCurrentWorkflow();
  return `Step ${state.workflowStepIndex + 1} of ${workflow.steps.length}`;
}

function getNextButtonText() {
  if (state.mode === "scenario") return "Next Scenario";
  if (state.mode === "command") return "Next Command";
  if (state.mode === "flag") return "Next Flag";

  const workflow = getCurrentWorkflow();
  return state.workflowStepIndex === workflow.steps.length - 1 ? "Next Workflow" : "Next Step";
}

function renderSectionGrid(activeSectionId) {
  els.sectionGrid.innerHTML = "";

  cyberData.sectionCards.forEach((card) => {
    const article = document.createElement("article");
    article.className = `section-card${card.id === activeSectionId ? " active" : ""}`;
    article.innerHTML = `
      <p class="section-order">${card.order}</p>
      <h3>${card.title}</h3>
      <p>${card.copy}</p>
    `;
    els.sectionGrid.appendChild(article);
  });
}

function renderReferenceList(item) {
  els.referenceList.innerHTML = "";

  if (state.mode === "workflow") {
    const workflow = getCurrentWorkflow();
    els.referenceTitle.textContent = workflow.name;
    els.referenceDescription.textContent = workflow.description;

    workflow.steps.forEach((step, index) => {
      const li = document.createElement("li");
      li.className = index === state.workflowStepIndex ? "active" : "";
      li.innerHTML = `<strong>Step ${index + 1}</strong>${step.question}`;
      els.referenceList.appendChild(li);
    });

    return;
  }

  els.referenceTitle.textContent = "Mode Focus";
  els.referenceDescription.textContent = modeMeta[state.mode].focus;

  const items = [
    { title: "Section", text: getSection(item.section).title },
    { title: "Level", text: formatLevel(item.level) },
    { title: "Current Goal", text: item.context }
  ];

  items.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.title}</strong>${entry.text}`;
    els.referenceList.appendChild(li);
  });
}

function isCommandStyle(option) {
  return (
    state.mode !== "scenario" ||
    option.includes("nmap") ||
    option.includes("nc ") ||
    option.includes("ssh ") ||
    option.includes("telnet ") ||
    option.includes("msf") ||
    option.includes("MAIL FROM") ||
    option.includes("RCPT TO") ||
    option === "DATA" ||
    option === "QUIT" ||
    option === "EHLO lab.local"
  );
}

function renderOptions(item) {
  els.choiceOptions.innerHTML = "";

  item.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-option${isCommandStyle(option) ? " command-style" : ""}`;
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(option, button));
    els.choiceOptions.appendChild(button);
  });
}

function renderCurrentItem() {
  const item = getCurrentItem();
  const section = getSection(item.section);

  state.locked = false;
  clearHint();
  resetFeedback();
  els.nextTaskBtn.hidden = true;
  els.nextTaskBtn.textContent = getNextButtonText();

  els.modeBadge.textContent = modeMeta[state.mode].label;
  els.progressBadge.textContent = getProgressText();
  els.stepMiniBadge.textContent = getBadgeText();
  els.taskEyebrow.textContent = `${modeMeta[state.mode].label} / ${section.title}`;
  els.taskTitle.textContent = state.mode === "workflow" ? getCurrentWorkflow().name : modeMeta[state.mode].title;
  els.taskPrompt.textContent = item.question;
  els.taskContext.textContent = item.context;
  els.sectionName.textContent = section.title;
  els.sectionCopy.textContent = section.copy;
  els.focusText.textContent = modeMeta[state.mode].focus;

  renderSectionGrid(item.section);
  renderReferenceList(item);
  renderOptions(item);
}

function handleAnswer(selected, clickedButton) {
  if (state.locked) return;

  state.locked = true;
  const item = getCurrentItem();
  const correct = selected === item.correct;
  const buttons = Array.from(els.choiceOptions.querySelectorAll("button"));

  buttons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === item.correct) {
      button.classList.add("correct-btn");
    }
  });

  if (correct) {
    setFeedback("good", `Correct. ${item.correct}`, item.explanation);
  } else {
    clickedButton.classList.add("wrong-btn");
    setFeedback("bad", `Incorrect. Correct answer: ${item.correct}`, item.explanation);
  }

  els.nextTaskBtn.hidden = false;
}

function advanceMode() {
  if (state.mode === "scenario") {
    state.scenarioIndex = (state.scenarioIndex + 1) % cyberData.scenarioQuestions.length;
    return;
  }

  if (state.mode === "command") {
    state.commandIndex = (state.commandIndex + 1) % cyberData.commandQuestions.length;
    return;
  }

  if (state.mode === "flag") {
    state.flagIndex = (state.flagIndex + 1) % cyberData.flagQuestions.length;
    return;
  }

  const workflow = getCurrentWorkflow();

  if (state.workflowStepIndex < workflow.steps.length - 1) {
    state.workflowStepIndex += 1;
    return;
  }

  state.workflowIndex = (state.workflowIndex + 1) % cyberData.workflows.length;
  state.workflowStepIndex = 0;
}

function resetMode() {
  if (state.mode === "scenario") state.scenarioIndex = 0;
  if (state.mode === "command") state.commandIndex = 0;
  if (state.mode === "flag") state.flagIndex = 0;
  if (state.mode === "workflow") {
    state.workflowIndex = 0;
    state.workflowStepIndex = 0;
  }

  renderCurrentItem();
}

function setMode(mode) {
  state.mode = mode;
  if (mode === "workflow") {
    state.workflowIndex = 0;
    state.workflowStepIndex = 0;
  }
  renderCurrentItem();
  updateModeTabs();
}

function bindEvents() {
  els.modeTabs.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  els.hintBtn.addEventListener("click", showHint);
  els.nextTaskBtn.addEventListener("click", () => {
    advanceMode();
    renderCurrentItem();
  });
  els.resetModeBtn.addEventListener("click", resetMode);
}

bindEvents();
updateModeTabs();
renderCurrentItem();
