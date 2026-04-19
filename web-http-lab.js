(function () {
  const STORAGE_KEY = "web-http-lab-progress-v1";

  const state = {
    lessons: [],
    lessonIndex: 0,
    stepIndex: 0,
    completedLessons: {},
    currentWorkspace: null,
    feedbackTone: "idle",
    feedbackText: "Pick a lesson to begin.",
    hintText: "Hints will appear here when needed.",
    stepSolved: false,
    hintIndex: 0,
    selectedOptionId: "",
    selectedOptionIds: new Set(),
    fieldValues: {}
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    state.lessons = Array.isArray(window.WebHttpLabData && window.WebHttpLabData.lessons)
      ? window.WebHttpLabData.lessons
      : [];

    cacheElements();

    if (!state.lessons.length) {
      renderMissingData();
      return;
    }

    hydrateProgress();
    bindStaticEvents();
    resetStepRuntime();
    render();
  }

  function cacheElements() {
    els.labStatus = document.getElementById("labStatus");
    els.completedCount = document.getElementById("completedCount");
    els.lessonList = document.getElementById("lessonList");
    els.lessonCategory = document.getElementById("lessonCategory");
    els.lessonDifficulty = document.getElementById("lessonDifficulty");
    els.lessonStepBadge = document.getElementById("lessonStepBadge");
    els.lessonTitle = document.getElementById("lessonTitle");
    els.lessonIntro = document.getElementById("lessonIntro");
    els.lessonCompletion = document.getElementById("lessonCompletion");
    els.objectiveList = document.getElementById("objectiveList");
    els.recommendedNextLesson = document.getElementById("recommendedNextLesson");
    els.lessonExplanation = document.getElementById("lessonExplanation");

    els.browserUrl = document.getElementById("browserUrl");
    els.browserTitle = document.getElementById("browserTitle");
    els.browserNote = document.getElementById("browserNote");
    els.browserChipRow = document.getElementById("browserChipRow");

    els.requestBadge = document.getElementById("requestBadge");
    els.requestRaw = document.getElementById("requestRaw");
    els.responseBadge = document.getElementById("responseBadge");
    els.responseRaw = document.getElementById("responseRaw");

    els.cookiesList = document.getElementById("cookiesList");
    els.sessionState = document.getElementById("sessionState");
    els.sessionId = document.getElementById("sessionId");
    els.sessionNote = document.getElementById("sessionNote");
    els.cacheStatus = document.getElementById("cacheStatus");
    els.cacheNote = document.getElementById("cacheNote");
    els.proxyStatus = document.getElementById("proxyStatus");
    els.proxyNote = document.getElementById("proxyNote");
    els.discoverabilitySummary = document.getElementById("discoverabilitySummary");
    els.discoverabilityTree = document.getElementById("discoverabilityTree");

    els.stepTitle = document.getElementById("stepTitle");
    els.stepMeta = document.getElementById("stepMeta");
    els.taskState = document.getElementById("taskState");
    els.stepPrompt = document.getElementById("stepPrompt");
    els.successCondition = document.getElementById("successCondition");
    els.feedbackText = document.getElementById("feedbackText");
    els.stepExplanation = document.getElementById("stepExplanation");
    els.hintText = document.getElementById("hintText");
    els.hintBtn = document.getElementById("hintBtn");
    els.nextBtn = document.getElementById("nextBtn");

    els.answerTitle = document.getElementById("answerTitle");
    els.answerSubtitle = document.getElementById("answerSubtitle");
    els.interactionBody = document.getElementById("interactionBody");
  }

  function bindStaticEvents() {
    els.hintBtn.addEventListener("click", showHint);
    els.nextBtn.addEventListener("click", advanceProgress);
  }

  function hydrateProgress() {
    let saved = {};

    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      saved = {};
    }

    state.completedLessons = saved.completedLessons && typeof saved.completedLessons === "object"
      ? saved.completedLessons
      : {};

    const savedIndex = findLessonIndex(saved.currentLessonId);
    state.lessonIndex = savedIndex >= 0 ? savedIndex : 0;
  }

  function persistProgress() {
    const payload = {
      currentLessonId: currentLesson() ? currentLesson().id : null,
      completedLessons: state.completedLessons
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      // Ignore storage errors so the lab remains usable in stricter browsers.
    }
  }

  function currentLesson() {
    return state.lessons[state.lessonIndex] || null;
  }

  function currentStep() {
    const lesson = currentLesson();
    return lesson && lesson.interactiveSteps ? lesson.interactiveSteps[state.stepIndex] || null : null;
  }

  function resetStepRuntime() {
    const step = currentStep();

    state.currentWorkspace = cloneData(step ? step.workspace : null);
    state.feedbackTone = "idle";
    state.feedbackText = "Inspect the request, response, and state panels before answering.";
    state.hintText = "Hints will appear here when needed.";
    state.stepSolved = false;
    state.hintIndex = 0;
    state.selectedOptionId = "";
    state.selectedOptionIds = new Set();
    state.fieldValues = {};

    if (step && step.interaction && Array.isArray(step.interaction.fields)) {
      step.interaction.fields.forEach(function (field) {
        state.fieldValues[field.id] = field.initialValue || "";
      });
    }
  }

  function render() {
    renderLessonList();
    renderOverview();
    renderWorkspace();
    renderTask();
    renderInteraction();
  }

  function renderMissingData() {
    els.labStatus.textContent = "Unavailable";
    els.labStatus.className = "http-status bad";
    els.lessonList.innerHTML = "<div class=\"http-empty-state\">The Web &amp; HTTP Lab data file did not load.</div>";
    els.interactionBody.innerHTML = "<div class=\"http-empty-state\">Refresh the page and try again.</div>";
  }

  function renderLessonList() {
    const completedCount = state.lessons.filter(function (lesson) {
      return Boolean(state.completedLessons[lesson.id]);
    }).length;

    els.completedCount.textContent = completedCount + " / " + state.lessons.length + " complete";

    const lesson = currentLesson();
    const statusText = state.stepSolved
      ? "Step complete"
      : state.completedLessons[lesson.id]
        ? "Lesson complete"
        : state.stepIndex > 0
          ? "In progress"
          : "Ready";

    const statusClass = state.stepSolved || state.completedLessons[lesson.id] ? "good" : state.stepIndex > 0 ? "idle" : "idle";
    els.labStatus.textContent = statusText;
    els.labStatus.className = "http-status " + statusClass;

    els.lessonList.innerHTML = "";

    state.lessons.forEach(function (item, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "http-lesson-card";

      if (index === state.lessonIndex) {
        button.classList.add("is-active");
      }

      if (state.completedLessons[item.id]) {
        button.classList.add("is-complete");
      }

      const intro = item.scenarioIntro || "";
      const shortCopy = intro.length > 116 ? intro.slice(0, 113).trimEnd() + "..." : intro;

      button.innerHTML =
        "<span class=\"http-lesson-kicker\">" + escapeHtml(item.category) + "</span>" +
        "<span class=\"http-lesson-title\">" + escapeHtml(item.title) + "</span>" +
        "<span class=\"http-lesson-copy\">" + escapeHtml(shortCopy) + "</span>" +
        "<span class=\"http-lesson-meta\">" +
        "<span class=\"http-lesson-chip\">" + escapeHtml(item.difficulty) + "</span>" +
        "<span class=\"http-lesson-chip\">" + item.interactiveSteps.length + " steps</span>" +
        (state.completedLessons[item.id] ? "<span class=\"http-lesson-chip\">Completed</span>" : "") +
        "</span>";

      button.addEventListener("click", function () {
        if (index === state.lessonIndex) {
          return;
        }

        state.lessonIndex = index;
        state.stepIndex = 0;
        resetStepRuntime();
        persistProgress();
        render();
      });

      els.lessonList.appendChild(button);
    });
  }

  function renderOverview() {
    const lesson = currentLesson();
    const step = currentStep();
    const recommended = nextLessonFor(lesson);

    els.lessonCategory.textContent = lesson.category;
    els.lessonDifficulty.textContent = lesson.difficulty;
    els.lessonStepBadge.textContent = "Step " + (state.stepIndex + 1) + " of " + lesson.interactiveSteps.length;
    els.lessonTitle.textContent = lesson.title;
    els.lessonIntro.textContent = lesson.scenarioIntro;
    els.lessonExplanation.textContent = lesson.explanation;
    els.recommendedNextLesson.textContent = recommended ? recommended.title : "No next lesson configured.";

    const completionText = state.completedLessons[lesson.id]
      ? "Lesson complete"
      : step && state.stepSolved && state.stepIndex === lesson.interactiveSteps.length - 1
        ? "Ready for next lesson"
        : lesson.interactiveSteps.length + " guided steps";

    const completionClass = state.completedLessons[lesson.id] ? "http-completion-pill complete" : "http-completion-pill pending";
    els.lessonCompletion.textContent = completionText;
    els.lessonCompletion.className = completionClass;

    els.objectiveList.innerHTML = "";
    lesson.learningObjectives.forEach(function (objective) {
      const item = document.createElement("li");
      item.textContent = objective;
      els.objectiveList.appendChild(item);
    });
  }

  function renderWorkspace() {
    const workspace = state.currentWorkspace || {};
    const request = workspace.request || null;
    const response = workspace.response || null;
    const browser = workspace.browser || {};
    const cookies = Array.isArray(workspace.cookies) ? workspace.cookies : [];
    const session = workspace.session || {};
    const cache = workspace.cache || {};
    const proxy = workspace.proxy || {};
    const discovery = workspace.discoverability || {};

    els.browserUrl.textContent = browser.url || "https://example.lab/";
    els.browserTitle.textContent = browser.title || "Waiting for lesson";
    els.browserNote.textContent = browser.note || "Load a lesson to inspect the browser context.";

    const chips = [
      request ? request.method + " " + request.path : "No request loaded",
      response ? "Status " + response.statusCode : proxy.requestPaused ? "Response pending" : "No response yet",
      cookies.length ? cookies.length + " cookie" + (cookies.length === 1 ? "" : "s") : "No cookies",
      session.state ? "Session: " + session.state : "No session",
      proxy.status ? "Proxy: " + proxy.status : "Proxy ready"
    ];

    els.browserChipRow.innerHTML = chips
      .map(function (chip) {
        return "<span class=\"http-chip\">" + escapeHtml(chip) + "</span>";
      })
      .join("");

    els.requestBadge.textContent = request ? request.method + " " + request.path : "No request";
    els.requestBadge.className = "http-surface-pill good";
    els.requestRaw.textContent = request ? formatRequest(request) : "No request loaded yet.";

    if (response) {
      els.responseBadge.textContent = response.statusCode + " " + response.statusText;
      els.responseBadge.className = "http-surface-pill good";
      els.responseRaw.textContent = formatResponse(response);
    } else {
      els.responseBadge.textContent = proxy.requestPaused ? "Paused at proxy" : "Waiting";
      els.responseBadge.className = "http-surface-pill " + (proxy.requestPaused ? "warning" : "idle");
      els.responseRaw.textContent = proxy.requestPaused
        ? "No response yet.\n\nThe request is currently paused at the proxy, so the server has not generated a response."
        : "No response is shown for this step.";
    }

    renderCookies(cookies);

    els.sessionState.textContent = session.state ? "State: " + session.state : "State: none";
    els.sessionId.textContent = session.id ? "Session ID: " + session.id : "Session ID: none";
    els.sessionNote.textContent = session.note || "No session note for this step.";

    els.cacheStatus.textContent = cache.status || "No cache state";
    els.cacheNote.textContent = cache.note || "No cache note for this step.";

    els.proxyStatus.textContent = proxy.status || "No proxy state";
    els.proxyNote.textContent = proxy.note || "No proxy note for this step.";

    els.discoverabilitySummary.textContent = discovery.summary || "No discoverability notes for this step.";
    renderDiscoverabilityTree(Array.isArray(discovery.tree) ? discovery.tree : []);
  }

  function renderCookies(cookies) {
    if (!cookies.length) {
      els.cookiesList.innerHTML = "<div class=\"http-empty-state\">No cookies are attached to this request.</div>";
      return;
    }

    els.cookiesList.innerHTML = cookies
      .map(function (cookie) {
        return (
          "<article class=\"http-cookie-card\">" +
          "<p class=\"http-cookie-name\">" + escapeHtml(cookie.name) + "=" + escapeHtml(cookie.value) + "</p>" +
          "<p class=\"http-cookie-meta\">Scope: " + escapeHtml(cookie.scope || "n/a") + "</p>" +
          "<p class=\"http-cookie-meta\">Purpose: " + escapeHtml(cookie.purpose || "n/a") + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function renderDiscoverabilityTree(nodes) {
    if (!nodes.length) {
      els.discoverabilityTree.innerHTML = "<div class=\"http-empty-state\">This step does not use a crawl tree.</div>";
      return;
    }

    els.discoverabilityTree.innerHTML = nodes
      .map(function (node) {
        return (
          "<div class=\"http-tree-node\" data-depth=\"" + Number(node.depth || 0) + "\">" +
          "<span class=\"http-tree-pill\">" + escapeHtml(node.type || "node") + "</span>" +
          "<span>" + escapeHtml(node.label || "") + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderTask() {
    const lesson = currentLesson();
    const step = currentStep();

    els.stepTitle.textContent = step.title;
    els.stepMeta.textContent = "Lesson " + (state.lessonIndex + 1) + " of " + state.lessons.length + " • Step " + (state.stepIndex + 1) + " of " + lesson.interactiveSteps.length;
    els.stepPrompt.textContent = step.prompt;
    els.successCondition.textContent = step.successCondition;
    els.feedbackText.textContent = state.feedbackText;
    els.stepExplanation.textContent = state.stepSolved ? step.explanation : lesson.explanation;
    els.hintText.textContent = state.hintText;

    let badgeText = "Waiting for action";
    let badgeClass = "idle";

    if (state.feedbackTone === "warning") {
      badgeText = "Review and retry";
      badgeClass = "warning";
    } else if (state.stepSolved && state.stepIndex === lesson.interactiveSteps.length - 1) {
      badgeText = "Lesson complete";
      badgeClass = "success";
    } else if (state.stepSolved) {
      badgeText = "Step complete";
      badgeClass = "success";
    }

    els.taskState.textContent = badgeText;
    els.taskState.className = "http-feedback-badge " + badgeClass;

    els.hintBtn.textContent = state.hintIndex > 0 ? "Next Hint" : "Show Hint";

    if (state.stepSolved) {
      els.nextBtn.hidden = false;
      els.nextBtn.textContent = nextButtonLabel();
    } else {
      els.nextBtn.hidden = true;
      els.nextBtn.textContent = "Next Step";
    }
  }

  function renderInteraction() {
    const step = currentStep();
    const interaction = step.interaction || {};

    els.answerTitle.textContent = step.title;
    els.answerSubtitle.textContent = interactionSubtitle(interaction.type);
    els.interactionBody.innerHTML = "";

    if (interaction.type === "field-check" || interaction.type === "request-editor") {
      renderFieldInteraction(step, interaction);
      return;
    }

    if (interaction.type === "single-choice") {
      renderChoiceInteraction(step, interaction, false);
      return;
    }

    if (interaction.type === "multi-select" || interaction.type === "spider-select") {
      renderChoiceInteraction(step, interaction, true);
      return;
    }

    if (interaction.type === "proxy-control") {
      renderProxyInteraction(step, interaction);
      return;
    }

    els.interactionBody.innerHTML = "<div class=\"http-empty-state\">This step does not have a supported interaction type yet.</div>";
  }

  function renderFieldInteraction(step, interaction) {
    const wrapper = document.createElement("div");
    wrapper.className = "http-input-grid";

    const intro = document.createElement("p");
    intro.className = "http-answer-copy";
    intro.textContent = interaction.type === "request-editor"
      ? "Edit the safe training field below, then replay the request."
      : "Fill in the missing details from the request and response panels.";
    wrapper.appendChild(intro);

    const form = document.createElement("form");
    form.className = "http-input-grid";

    interaction.fields.forEach(function (field) {
      const group = document.createElement("div");
      group.className = "http-field-group";

      const label = document.createElement("label");
      label.setAttribute("for", "field-" + field.id);
      label.textContent = field.label;

      const input = document.createElement("input");
      input.id = "field-" + field.id;
      input.type = "text";
      input.autocomplete = "off";
      input.spellcheck = false;
      input.placeholder = field.placeholder || "";
      input.value = state.fieldValues[field.id] || "";
      input.addEventListener("input", function (event) {
        state.fieldValues[field.id] = event.target.value;
      });

      group.appendChild(label);
      group.appendChild(input);
      form.appendChild(group);
    });

    const submitRow = document.createElement("div");
    submitRow.className = "http-submit-row";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.textContent = interaction.buttonLabel || "Check";

    submitRow.appendChild(submit);
    form.appendChild(submitRow);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      evaluateFieldInteraction(step, interaction);
    });

    wrapper.appendChild(form);
    els.interactionBody.appendChild(wrapper);
  }

  function renderChoiceInteraction(step, interaction, multiSelect) {
    const wrapper = document.createElement("div");
    wrapper.className = "http-option-grid";

    const intro = document.createElement("p");
    intro.className = "http-answer-copy";
    intro.textContent = multiSelect
      ? "Select every answer that matches the current evidence, then submit the selection."
      : "Choose the best answer for this step, then submit it.";
    wrapper.appendChild(intro);

    const optionGrid = document.createElement("div");
    optionGrid.className = "http-option-grid";

    interaction.options.forEach(function (option) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "http-choice-card";

      const selected = multiSelect
        ? state.selectedOptionIds.has(option.id)
        : state.selectedOptionId === option.id;

      if (selected) {
        button.classList.add("is-selected");
      }

      button.innerHTML =
        "<span class=\"http-choice-title\">" + escapeHtml(option.label) + "</span>" +
        (typeof option.depth === "number"
          ? "<span class=\"http-choice-meta\">Depth " + option.depth + "</span>"
          : "");

      button.addEventListener("click", function () {
        if (multiSelect) {
          if (state.selectedOptionIds.has(option.id)) {
            state.selectedOptionIds.delete(option.id);
          } else {
            state.selectedOptionIds.add(option.id);
          }
        } else {
          state.selectedOptionId = option.id;
        }

        renderInteraction();
      });

      optionGrid.appendChild(button);
    });

    wrapper.appendChild(optionGrid);

    const submitRow = document.createElement("div");
    submitRow.className = "http-submit-row";

    const submit = document.createElement("button");
    submit.type = "button";
    submit.textContent = interaction.buttonLabel || "Submit";
    submit.addEventListener("click", function () {
      evaluateChoiceInteraction(step, interaction, multiSelect);
    });

    submitRow.appendChild(submit);
    wrapper.appendChild(submitRow);
    els.interactionBody.appendChild(wrapper);
  }

  function renderProxyInteraction(step, interaction) {
    const wrapper = document.createElement("div");
    wrapper.className = "http-control-grid";

    const intro = document.createElement("p");
    intro.className = "http-answer-copy";
    intro.textContent = "Use the safe proxy control that matches the lesson goal.";
    wrapper.appendChild(intro);

    interaction.controls.forEach(function (control) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "http-control-btn";
      button.textContent = control.label;
      button.addEventListener("click", function () {
        evaluateProxyControl(step, interaction, control);
      });
      wrapper.appendChild(button);
    });

    els.interactionBody.appendChild(wrapper);
  }

  function evaluateFieldInteraction(step, interaction) {
    const invalidField = interaction.fields.find(function (field) {
      const value = state.fieldValues[field.id] || "";
      return !matchesAnyAnswer(value, field.answers || []);
    });

    if (invalidField) {
      markIncorrect("The value for \"" + invalidField.label + "\" needs another look. " + (interaction.feedbackIncorrect || ""));
      return;
    }

    markSuccess(step, step.feedback);
  }

  function evaluateChoiceInteraction(step, interaction, multiSelect) {
    if (multiSelect) {
      const selected = Array.from(state.selectedOptionIds);

      if (!selected.length) {
        markIncorrect("Select at least one option before submitting.");
        return;
      }

      const correctIds = interaction.options
        .filter(function (option) { return option.correct; })
        .map(function (option) { return option.id; })
        .sort();

      const selectedIds = selected.slice().sort();
      const matches = selectedIds.length === correctIds.length && selectedIds.every(function (id, index) {
        return id === correctIds[index];
      });

      if (!matches) {
        markIncorrect(interaction.feedbackIncorrect || "Review the evidence and refine the selection.");
        return;
      }

      markSuccess(step, step.feedback);
      return;
    }

    if (!state.selectedOptionId) {
      markIncorrect("Choose one option before submitting.");
      return;
    }

    const choice = interaction.options.find(function (option) {
      return option.id === state.selectedOptionId;
    });

    if (!choice) {
      markIncorrect("Choose one option before submitting.");
      return;
    }

    if (!choice.correct) {
      markIncorrect(choice.explanation || interaction.feedbackIncorrect || "That answer does not match the request or response evidence.");
      return;
    }

    markSuccess(step, step.feedback);
  }

  function evaluateProxyControl(step, interaction, control) {
    if (!control.correct) {
      markIncorrect(control.feedback || interaction.feedbackIncorrect || "That control does not match the lesson goal.");
      return;
    }

    markSuccess(step, control.successFeedback || step.feedback);
  }

  function markIncorrect(message) {
    state.feedbackTone = "warning";
    state.feedbackText = message;
    renderTask();
  }

  function markSuccess(step, message) {
    state.stepSolved = true;
    state.feedbackTone = "success";
    state.feedbackText = message;
    state.hintText = completedHint(step);

    if (step.workspaceAfterSuccess) {
      state.currentWorkspace = cloneData(step.workspaceAfterSuccess);
    }

    const lesson = currentLesson();
    if (state.stepIndex === lesson.interactiveSteps.length - 1) {
      state.completedLessons[lesson.id] = true;
    }

    persistProgress();
    render();
  }

  function showHint() {
    const step = currentStep();

    if (!Array.isArray(step.hints) || !step.hints.length) {
      state.hintText = "No hints are configured for this step.";
      renderTask();
      return;
    }

    const nextHintIndex = Math.min(state.hintIndex, step.hints.length - 1);
    state.hintText = step.hints[nextHintIndex];
    state.hintIndex = Math.min(state.hintIndex + 1, step.hints.length);
    renderTask();
  }

  function advanceProgress() {
    if (!state.stepSolved) {
      return;
    }

    const lesson = currentLesson();

    if (state.stepIndex < lesson.interactiveSteps.length - 1) {
      state.stepIndex += 1;
      resetStepRuntime();
      persistProgress();
      render();
      return;
    }

    const nextLesson = nextLessonFor(lesson);
    if (nextLesson) {
      state.lessonIndex = findLessonIndex(nextLesson.id);
      state.stepIndex = 0;
      resetStepRuntime();
      persistProgress();
      render();
      return;
    }

    state.stepIndex = 0;
    resetStepRuntime();
    render();
  }

  function nextLessonFor(lesson) {
    if (!lesson) {
      return null;
    }

    const recommendedIndex = findLessonIndex(lesson.recommendedNextLesson);
    if (recommendedIndex >= 0) {
      return state.lessons[recommendedIndex];
    }

    if (state.lessonIndex < state.lessons.length - 1) {
      return state.lessons[state.lessonIndex + 1];
    }

    return null;
  }

  function nextButtonLabel() {
    const lesson = currentLesson();

    if (state.stepIndex < lesson.interactiveSteps.length - 1) {
      return "Next Step";
    }

    const nextLesson = nextLessonFor(lesson);
    return nextLesson ? "Open Next Lesson" : "Replay Lesson";
  }

  function interactionSubtitle(type) {
    switch (type) {
      case "field-check":
        return "Read the panels and fill in the requested details.";
      case "single-choice":
        return "Pick the single best answer based on the visible traffic.";
      case "multi-select":
        return "Select every correct answer and avoid the distractors.";
      case "spider-select":
        return "Use the crawl tree to decide what is directly discoverable.";
      case "proxy-control":
        return "Use the safe interception controls provided by the lab.";
      case "request-editor":
        return "Adjust a fictional training field and replay the request.";
      default:
        return "Use the answer panel to complete the current step.";
    }
  }

  function completedHint(step) {
    const lesson = currentLesson();

    if (state.stepIndex === lesson.interactiveSteps.length - 1) {
      return "Lesson complete. Open the next lesson when you are ready.";
    }

    if (Array.isArray(step.hints) && step.hints.length) {
      return step.hints[step.hints.length - 1];
    }

    return "Step complete. Continue when you are ready.";
  }

  function matchesAnyAnswer(value, answers) {
    return answers.some(function (answer) {
      return normalizeText(value) === normalizeText(answer);
    });
  }

  function findLessonIndex(lessonId) {
    if (!lessonId) {
      return -1;
    }

    return state.lessons.findIndex(function (lesson) {
      return lesson.id === lessonId;
    });
  }

  function formatRequest(request) {
    const head = request.method + " " + request.path + " " + request.version;
    return formatHttpBlock(head, request.headers || [], request.body || "");
  }

  function formatResponse(response) {
    const head = "HTTP/1.1 " + response.statusCode + " " + response.statusText;
    return formatHttpBlock(head, response.headers || [], response.body || "");
  }

  function formatHttpBlock(firstLine, headers, body) {
    const headerLines = headers.map(function (header) {
      return header.name + ": " + header.value;
    });

    const parts = [firstLine];

    if (headerLines.length) {
      parts.push(headerLines.join("\n"));
    }

    if (body) {
      parts.push(body);
    }

    return parts.join("\n\n");
  }

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function cloneData(value) {
    if (value == null) {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
