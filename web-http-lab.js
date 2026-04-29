const els = {
  stepKicker: document.getElementById("httpStepKicker"),
  screenTitle: document.getElementById("httpScreenTitle"),
  screenMeta: document.getElementById("httpScreenMeta"),
  screenVisual: document.getElementById("httpScreenVisual"),
  screenActions: document.getElementById("httpScreenActions"),
  actionFeedback: document.getElementById("httpActionFeedback"),
  answerGrid: document.getElementById("httpAnswerGrid"),
  backBtn: document.getElementById("httpBackBtn"),
  nextBtn: document.getElementById("httpNextBtn")
};

const STEP_COUNT = 6;

const ICONS = {
  browser: "fa-window-maximize",
  server: "fa-server",
  response: "fa-file-lines",
  devtools: "fa-magnifying-glass"
};

const screens = [
  {
    id: "step-1-overview",
    step: 1,
    title: "Browser to Server Flow",
    meta: "Big picture",
    type: "overview"
  },
  {
    id: "step-2-request-line",
    step: 2,
    title: "Build the Request",
    meta: "Reveal 1 of 3",
    type: "request",
    contextLead: "The browser starts building the message it will send to the server.",
    contextItems: [
      {
        label: "GET /profile",
        copy: "This asks for the /profile page."
      }
    ],
    lines: [
      { text: "GET /profile", tone: "request" }
    ]
  },
  {
    id: "step-2-host-line",
    step: 2,
    title: "Build the Request",
    meta: "Reveal 2 of 3",
    type: "request",
    contextLead: "Now the browser adds which website should handle the request.",
    contextItems: [
      {
        label: "GET /profile",
        copy: "This asks for the /profile page."
      },
      {
        label: "Host: learn.lab",
        copy: "This tells the server which site the request is for."
      }
    ],
    lines: [
      { text: "GET /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" }
    ]
  },
  {
    id: "step-2-cookie-line",
    step: 2,
    title: "Build the Request",
    meta: "Reveal 3 of 3",
    type: "request",
    contextLead: "The browser also sends session information so the site knows which user is making the request.",
    contextItems: [
      {
        label: "GET /profile",
        copy: "This asks for the /profile page."
      },
      {
        label: "Host: learn.lab",
        copy: "This tells the server which site should answer."
      },
      {
        label: "Cookie: session=your-session",
        copy: "This carries your session so the response matches your account."
      }
    ],
    lines: [
      { text: "GET /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Cookie: session=your-session", tone: "cookie" }
    ]
  },
  {
    id: "step-3-send-request",
    step: 3,
    title: "Send the Request",
    meta: "Browser sends it",
    type: "transit",
    contextLead: "The browser sends the finished request across the network toward the server.",
    contextItems: [
      {
        label: "Browser",
        copy: "It has built the request and is sending it out."
      },
      {
        label: "GET /profile",
        copy: "This request is now in transit."
      },
      {
        label: "Server",
        copy: "It has not received the request yet."
      }
    ],
    direction: "down",
    packetTone: "request",
    packetLabel: "GET /profile",
    packetPosition: "from-browser",
    browserCopy: "Sends the request",
    serverCopy: "Waiting for it",
    browserActive: true,
    serverActive: false
  },
  {
    id: "step-3-server-receive",
    step: 3,
    title: "Send the Request",
    meta: "Server receives it",
    type: "transit",
    contextLead: "The request reaches the server so it can read it and decide what data to send back.",
    contextItems: [
      {
        label: "Server",
        copy: "It can now process the request."
      },
      {
        label: "GET /profile",
        copy: "The server now knows which page the browser wants."
      },
      {
        label: "Next",
        copy: "The server prepares a response for that request."
      }
    ],
    direction: "down",
    packetTone: "request",
    packetLabel: "GET /profile",
    packetPosition: "to-server",
    browserCopy: "Request sent",
    serverCopy: "Receives the request",
    browserActive: false,
    serverActive: true
  },
  {
    id: "step-3-response-return",
    step: 3,
    title: "Receive the Response",
    meta: "Response comes back",
    type: "transit",
    contextLead: "After processing the request, the server sends data back to the browser.",
    contextItems: [
      {
        label: "Server",
        copy: "It sends the response back to the browser."
      },
      {
        label: "200 OK",
        copy: "This shows the request worked and data is returning."
      },
      {
        label: "Browser",
        copy: "It receives the response and can show the page."
      }
    ],
    direction: "up",
    packetTone: "response",
    packetLabel: "200 OK",
    packetPosition: "to-browser",
    browserCopy: "Receives data",
    serverCopy: "Sends response",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-4-http-https",
    step: 4,
    title: "HTTP vs HTTPS",
    meta: "Visible vs encrypted",
    type: "compare"
  },
  {
    id: "step-5-visibility",
    step: 5,
    title: "What You Can See",
    meta: "Your browser, your session",
    type: "visibility"
  },
  {
    id: "step-6-quiz-1",
    step: 6,
    title: "Quick Check",
    meta: "Question 1 of 3",
    type: "quiz",
    question: "Which line adds the website name to the request?",
    answers: [
      "GET /profile",
      "Host: learn.lab",
      "200 OK"
    ],
    correctIndex: 1
  },
  {
    id: "step-6-quiz-2",
    step: 6,
    title: "Quick Check",
    meta: "Question 2 of 3",
    type: "quiz",
    question: "With plain HTTP, what is true in transit?",
    answers: [
      "It is visible in transit",
      "It is encrypted in transit",
      "It never leaves the browser"
    ],
    correctIndex: 0
  },
  {
    id: "step-6-quiz-3",
    step: 6,
    title: "Quick Check",
    meta: "Question 3 of 3",
    type: "quiz",
    question: "Seeing another user's data in your session means:",
    answers: [
      "That is normal",
      "That is a vulnerability",
      "DevTools created it"
    ],
    correctIndex: 1
  }
];

const quizState = new Map();

let currentIndex = 0;

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getQuizState(screenId) {
  if (!quizState.has(screenId)) {
    quizState.set(screenId, {
      solved: false,
      wrongSelections: []
    });
  }

  return quizState.get(screenId);
}

function renderFlowNode({ tone, title, copy, active = false, muted = false, compact = false }) {
  const classes = [
    "http-flow-node",
    `is-${tone}`
  ];

  if (active) {
    classes.push("is-active");
  }

  if (muted) {
    classes.push("is-muted");
  }

  if (compact) {
    classes.push("http-transit-node");
  }

  return `
    <article class="${classes.join(" ")}">
      <div class="http-node-icon" aria-hidden="true">
        <i class="fa-solid ${ICONS[tone]}"></i>
      </div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(copy)}</p>
    </article>
  `;
}

function renderOverviewVisual() {
  return `
    <div class="http-visual-frame">
      <div class="http-sequence" role="img" aria-label="Browser sends a request, server sends a response, and DevTools can inspect it">
        ${renderFlowNode({ tone: "browser", title: "Browser", copy: "You open a website" })}
        <div class="http-sequence-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        ${renderFlowNode({ tone: "server", title: "Server", copy: "Processes your request" })}
        <div class="http-sequence-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        ${renderFlowNode({ tone: "response", title: "Response", copy: "Sends data back" })}
        <div class="http-sequence-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </div>
        ${renderFlowNode({ tone: "devtools", title: "DevTools", copy: "You can inspect this" })}
      </div>
    </div>
  `;
}

function renderRequestVisual(screen) {
  const lines = screen.lines.map((line) => `
    <div class="http-request-line is-${line.tone}">${escapeHtml(line.text)}</div>
  `).join("");
  const contextItems = (screen.contextItems || []).map((item) => `
    <li class="http-request-context-item">
      <span class="http-request-context-label">${escapeHtml(item.label)}</span>
      <span class="http-request-context-copy">${escapeHtml(item.copy)}</span>
    </li>
  `).join("");

  return `
    <div class="http-visual-frame">
      <div class="http-request-stack">
        <div class="http-request-card" role="img" aria-label="HTTP request being built one line at a time">
          <div class="http-request-toolbar" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="http-request-body">
            ${lines}
          </div>
        </div>

        <div class="http-request-context">
          <p class="http-request-context-lead">${escapeHtml(screen.contextLead || "")}</p>
          <ul class="http-request-context-list">
            ${contextItems}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderTransitVisual(screen) {
  const contextItems = (screen.contextItems || []).map((item) => `
    <li class="http-transit-context-item">
      <span class="http-transit-context-label">${escapeHtml(item.label)}</span>
      <span class="http-transit-context-copy">${escapeHtml(item.copy)}</span>
    </li>
  `).join("");

  return `
    <div class="http-visual-frame">
      <div class="http-transit-stack">
        <div class="http-transit-visual" role="img" aria-label="${escapeHtml(screen.title)}">
          ${renderFlowNode({
            tone: "browser",
            title: "Browser",
            copy: screen.browserCopy,
            active: screen.browserActive,
            muted: !screen.browserActive,
            compact: true
          })}
          <div class="http-transit-rail is-${screen.direction}">
            <div class="http-transit-arrow">
              <i class="fa-solid fa-arrow-${screen.direction}" aria-hidden="true"></i>
            </div>
            <div class="http-packet is-${screen.packetTone} ${screen.packetPosition}">
              ${escapeHtml(screen.packetLabel)}
            </div>
          </div>
          ${renderFlowNode({
            tone: "server",
            title: "Server",
            copy: screen.serverCopy,
            active: screen.serverActive,
            muted: !screen.serverActive,
            compact: true
          })}
        </div>

        <div class="http-transit-context">
          <p class="http-transit-context-lead">${escapeHtml(screen.contextLead || "")}</p>
          <ul class="http-transit-context-list">
            ${contextItems}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderCompareVisual() {
  return `
    <div class="http-visual-frame">
      <div class="http-compare-list" role="img" aria-label="HTTP is visible in transit while HTTPS is encrypted in transit">
        <article class="http-compare-row is-http">
          <div class="http-compare-icon" aria-hidden="true">
            <i class="fa-solid fa-eye"></i>
          </div>
          <div>
            <p class="http-compare-label">HTTP</p>
            <p class="http-compare-copy">Visible in transit</p>
          </div>
        </article>
        <article class="http-compare-row is-https">
          <div class="http-compare-icon" aria-hidden="true">
            <i class="fa-solid fa-lock"></i>
          </div>
          <div>
            <p class="http-compare-label">HTTPS</p>
            <p class="http-compare-copy">Encrypted in transit</p>
          </div>
        </article>
      </div>
    </div>
  `;
}

function renderVisibilityVisual() {
  return `
    <div class="http-visual-frame">
      <div class="http-visibility-card" role="img" aria-label="You can inspect what your browser receives, but only for your own session">
        <div class="http-visibility-icon" aria-hidden="true">
          <i class="fa-solid fa-eye"></i>
        </div>
        <ul class="http-visibility-list">
          <li>You can inspect data your browser receives.</li>
          <li>You only see your own session.</li>
          <li>Other users' data means a vulnerability.</li>
        </ul>
      </div>
    </div>
  `;
}

function renderQuizVisual(screen) {
  return `
    <div class="http-visual-frame">
      <div class="http-quiz-card">
        <div class="http-quiz-icon" aria-hidden="true">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <p class="http-quiz-question">${escapeHtml(screen.question)}</p>
      </div>
    </div>
  `;
}

function renderVisual(screen) {
  if (screen.type === "overview") {
    return renderOverviewVisual();
  }

  if (screen.type === "request") {
    return renderRequestVisual(screen);
  }

  if (screen.type === "transit") {
    return renderTransitVisual(screen);
  }

  if (screen.type === "compare") {
    return renderCompareVisual();
  }

  if (screen.type === "visibility") {
    return renderVisibilityVisual();
  }

  return renderQuizVisual(screen);
}

function renderQuizActions(screen) {
  const state = getQuizState(screen.id);
  els.answerGrid.hidden = false;
  els.answerGrid.innerHTML = "";

  screen.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "http-answer-btn";
    button.textContent = answer;
    button.addEventListener("click", () => handleQuizAnswer(index));
    const wasWrong = state.wrongSelections.includes(index);

    if (wasWrong) {
      button.classList.add("wrong-btn");
      button.disabled = true;
    }

    if (state.solved && index === screen.correctIndex) {
      button.classList.add("correct-btn");
      button.disabled = true;
    } else if (state.solved) {
      button.disabled = true;
    }

    els.answerGrid.appendChild(button);
  });

  els.actionFeedback.hidden = false;
  els.actionFeedback.className = "http-action-feedback";

  if (state.solved) {
    els.actionFeedback.classList.add("good");
    els.actionFeedback.textContent = "Correct.";
  } else if (state.wrongSelections.length) {
    els.actionFeedback.classList.add("bad");
    els.actionFeedback.textContent = "Not quite. Try again.";
  } else {
    els.actionFeedback.textContent = "Choose one answer.";
  }

  els.nextBtn.disabled = !state.solved;
  els.nextBtn.textContent = currentIndex === screens.length - 1 ? "Restart" : "Next";
}

function renderStandardActions() {
  els.actionFeedback.hidden = true;
  els.actionFeedback.textContent = "";
  els.answerGrid.hidden = true;
  els.answerGrid.innerHTML = "";
  els.nextBtn.disabled = false;
  els.nextBtn.textContent = currentIndex === screens.length - 1 ? "Restart" : "Next";
}

function renderActions(screen) {
  els.backBtn.disabled = currentIndex === 0;

  if (screen.type === "quiz") {
    renderQuizActions(screen);
    return;
  }

  renderStandardActions();
}

function renderScreen({ scroll = false } = {}) {
  const screen = screens[currentIndex];

  els.stepKicker.textContent = `Step ${screen.step} of ${STEP_COUNT}`;
  els.screenTitle.textContent = screen.title;
  els.screenMeta.textContent = screen.meta;
  els.screenVisual.innerHTML = renderVisual(screen);
  renderActions(screen);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function goBack() {
  if (currentIndex === 0) {
    return;
  }

  currentIndex -= 1;
  renderScreen({ scroll: true });
}

function resetFlow() {
  quizState.clear();
  currentIndex = 0;
  renderScreen({ scroll: true });
}

function goNext() {
  const screen = screens[currentIndex];

  if (screen.type === "quiz") {
    const state = getQuizState(screen.id);
    if (!state.solved) {
      return;
    }
  }

  if (currentIndex === screens.length - 1) {
    resetFlow();
    return;
  }

  currentIndex += 1;
  renderScreen({ scroll: true });
}

function handleQuizAnswer(answerIndex) {
  const screen = screens[currentIndex];

  if (screen.type !== "quiz") {
    return;
  }

  const state = getQuizState(screen.id);

  if (state.solved) {
    return;
  }

  if (answerIndex === screen.correctIndex) {
    state.solved = true;
  } else if (!state.wrongSelections.includes(answerIndex)) {
    state.wrongSelections.push(answerIndex);
  }

  renderScreen();
}

els.backBtn.addEventListener("click", goBack);
els.nextBtn.addEventListener("click", goNext);

renderScreen();
