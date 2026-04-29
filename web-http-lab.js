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

const STEP_COUNT = 10;
const NetlabApp = window.NetlabApp;
const SECTION_ID = "web-http-lab";

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
    contextLead: "After processing the request, the server sends the response back so the browser can load the page.",
    contextItems: [
      {
        label: "Server",
        copy: "It sends page data back to the browser."
      },
      {
        label: "200 OK",
        copy: "This shows the request worked and the response is on its way."
      },
      {
        label: "Browser",
        copy: "It receives the response and can show the page to the user."
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
    type: "compare",
    contextLead: "Both HTTP and HTTPS move requests between the browser and server, but they protect that traffic differently while it travels.",
    contextItems: [
      {
        label: "HTTP",
        copy: "The request and response are visible in transit."
      },
      {
        label: "HTTPS",
        copy: "The request and response are encrypted in transit."
      },
      {
        label: "Browser",
        copy: "Once the response reaches your browser, you can still inspect your own data there."
      }
    ]
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
  },
  {
    id: "step-7-method-get",
    step: 7,
    title: "Request Methods",
    meta: "Method 1 of 5",
    type: "request",
    contextLead: "GET asks the server to send data back. It is the common method for loading pages and reading information.",
    contextItems: [
      {
        label: "GET /profile",
        copy: "Ask for the existing /profile page."
      },
      {
        label: "Host: learn.lab",
        copy: "Tell the server which site should answer."
      },
      {
        label: "Cookie: session=your-session",
        copy: "Send the user's session with the request."
      }
    ],
    lines: [
      { text: "GET /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Cookie: session=your-session", tone: "cookie" }
    ]
  },
  {
    id: "step-7-method-post",
    step: 7,
    title: "Request Methods",
    meta: "Method 2 of 5",
    type: "request",
    contextLead: "POST sends new data to the server. It is often used for forms, logins, and creating something new.",
    contextItems: [
      {
        label: "POST /login",
        copy: "Send login data to the server."
      },
      {
        label: "Content-Type: application/json",
        copy: "Tell the server what kind of body is being sent."
      },
      {
        label: "Body",
        copy: "Carry the new data inside the request."
      }
    ],
    lines: [
      { text: "POST /login", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Content-Type: application/json", tone: "header" },
      { text: "Body: {\"username\":\"sam\",\"password\":\"****\"}", tone: "body" }
    ]
  },
  {
    id: "step-7-method-put",
    step: 7,
    title: "Request Methods",
    meta: "Method 3 of 5",
    type: "request",
    contextLead: "PUT replaces data at a location. Think of it as sending a full new version of that resource.",
    contextItems: [
      {
        label: "PUT /profile",
        copy: "Target the existing profile resource."
      },
      {
        label: "Body",
        copy: "Send the replacement data for that resource."
      },
      {
        label: "Use case",
        copy: "Update the whole profile record, not just one field."
      }
    ],
    lines: [
      { text: "PUT /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Content-Type: application/json", tone: "header" },
      { text: "Body: {\"displayName\":\"Sam\",\"role\":\"student\"}", tone: "body" }
    ]
  },
  {
    id: "step-7-method-patch",
    step: 7,
    title: "Request Methods",
    meta: "Method 4 of 5",
    type: "request",
    contextLead: "PATCH changes part of existing data. It is used when only one small piece needs updating.",
    contextItems: [
      {
        label: "PATCH /profile",
        copy: "Target the existing profile resource."
      },
      {
        label: "Body",
        copy: "Send only the field that should change."
      },
      {
        label: "Use case",
        copy: "Update one setting without replacing the full record."
      }
    ],
    lines: [
      { text: "PATCH /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Content-Type: application/json", tone: "header" },
      { text: "Body: {\"displayName\":\"Sam\"}", tone: "body" }
    ]
  },
  {
    id: "step-7-method-delete",
    step: 7,
    title: "Request Methods",
    meta: "Method 5 of 5",
    type: "request",
    contextLead: "DELETE asks the server to remove something. It targets a resource that already exists.",
    contextItems: [
      {
        label: "DELETE /post/42",
        copy: "Ask the server to remove post 42."
      },
      {
        label: "Host: learn.lab",
        copy: "Send the request to the right site."
      },
      {
        label: "Result",
        copy: "The server may remove the item or return an error if it does not exist."
      }
    ],
    lines: [
      { text: "DELETE /post/42", tone: "request" },
      { text: "Host: learn.lab", tone: "host" }
    ]
  },
  {
    id: "step-8-status-200",
    step: 8,
    title: "Response Codes",
    meta: "Status 1 of 8",
    type: "transit",
    contextLead: "200 OK means the server handled the request successfully and returned the data.",
    contextItems: [
      {
        label: "200 OK",
        copy: "The request worked."
      },
      {
        label: "Browser",
        copy: "It can use the response and show the page."
      },
      {
        label: "Common use",
        copy: "Loading a normal page or API response."
      }
    ],
    direction: "up",
    packetTone: "response",
    packetLabel: "200 OK",
    packetPosition: "to-browser",
    browserCopy: "Loads the returned data",
    serverCopy: "Sends requested data",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-201",
    step: 8,
    title: "Response Codes",
    meta: "Status 2 of 8",
    type: "transit",
    contextLead: "201 Created means the server successfully created something new.",
    contextItems: [
      {
        label: "201 Created",
        copy: "A new item was made successfully."
      },
      {
        label: "Common use",
        copy: "After a POST request that creates a new record."
      },
      {
        label: "Browser",
        copy: "It may receive details about the new item."
      }
    ],
    direction: "up",
    packetTone: "response",
    packetLabel: "201 Created",
    packetPosition: "to-browser",
    browserCopy: "Receives new item details",
    serverCopy: "Creates new data",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-204",
    step: 8,
    title: "Response Codes",
    meta: "Status 3 of 8",
    type: "transit",
    contextLead: "204 No Content means the request worked, but the server does not need to send a response body back.",
    contextItems: [
      {
        label: "204 No Content",
        copy: "The request succeeded with no page data in the body."
      },
      {
        label: "Common use",
        copy: "After a successful DELETE or small update."
      },
      {
        label: "Browser",
        copy: "It gets success confirmation without extra content."
      }
    ],
    direction: "up",
    packetTone: "response",
    packetLabel: "204 No Content",
    packetPosition: "to-browser",
    browserCopy: "Gets success without extra data",
    serverCopy: "Confirms the action worked",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-301",
    step: 8,
    title: "Response Codes",
    meta: "Status 4 of 8",
    type: "transit",
    contextLead: "301 Moved Permanently tells the browser that the resource now lives at a different address.",
    contextItems: [
      {
        label: "301 Moved Permanently",
        copy: "The browser should go to a new URL."
      },
      {
        label: "Common use",
        copy: "When a page or site address has changed."
      },
      {
        label: "Browser",
        copy: "It usually follows the redirect automatically."
      }
    ],
    direction: "up",
    packetTone: "info",
    packetLabel: "301 Moved",
    packetPosition: "to-browser",
    browserCopy: "Follows the new address",
    serverCopy: "Points to a new URL",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-401",
    step: 8,
    title: "Response Codes",
    meta: "Status 5 of 8",
    type: "transit",
    contextLead: "401 Unauthorized means the request needs valid login credentials before it can continue.",
    contextItems: [
      {
        label: "401 Unauthorized",
        copy: "The browser is not authenticated yet."
      },
      {
        label: "Common use",
        copy: "Trying to access a protected page without logging in."
      },
      {
        label: "Browser",
        copy: "It usually needs to show a login flow."
      }
    ],
    direction: "up",
    packetTone: "warning",
    packetLabel: "401 Unauthorized",
    packetPosition: "to-browser",
    browserCopy: "Needs a valid login",
    serverCopy: "Rejects unauthenticated request",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-403",
    step: 8,
    title: "Response Codes",
    meta: "Status 6 of 8",
    type: "transit",
    contextLead: "403 Forbidden means the server understood the request, but this user is not allowed to access that resource.",
    contextItems: [
      {
        label: "403 Forbidden",
        copy: "The request was understood but blocked."
      },
      {
        label: "Common use",
        copy: "A user is signed in but lacks permission."
      },
      {
        label: "Browser",
        copy: "It may show an access denied page."
      }
    ],
    direction: "up",
    packetTone: "warning",
    packetLabel: "403 Forbidden",
    packetPosition: "to-browser",
    browserCopy: "Is not allowed in",
    serverCopy: "Blocks access",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-404",
    step: 8,
    title: "Response Codes",
    meta: "Status 7 of 8",
    type: "transit",
    contextLead: "404 Not Found means the server could not find the page or resource that was requested.",
    contextItems: [
      {
        label: "404 Not Found",
        copy: "The path does not point to an existing resource."
      },
      {
        label: "Common use",
        copy: "A missing page, file, or API item."
      },
      {
        label: "Browser",
        copy: "It usually shows a missing page message."
      }
    ],
    direction: "up",
    packetTone: "warning",
    packetLabel: "404 Not Found",
    packetPosition: "to-browser",
    browserCopy: "Cannot load that resource",
    serverCopy: "Cannot find that path",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-8-status-500",
    step: 8,
    title: "Response Codes",
    meta: "Status 8 of 8",
    type: "transit",
    contextLead: "500 Server Error means something failed on the server while it was trying to handle the request.",
    contextItems: [
      {
        label: "500 Server Error",
        copy: "The problem happened on the server side."
      },
      {
        label: "Common use",
        copy: "A bug, crash, or unexpected failure while processing."
      },
      {
        label: "Browser",
        copy: "It receives an error instead of the expected data."
      }
    ],
    direction: "up",
    packetTone: "error",
    packetLabel: "500 Server Error",
    packetPosition: "to-browser",
    browserCopy: "Gets an error page",
    serverCopy: "Fails while processing",
    browserActive: true,
    serverActive: true
  },
  {
    id: "step-9-pair-get-200",
    step: 9,
    title: "Method + Response Pairing",
    meta: "Scenario 1 of 5",
    type: "pairing",
    contextLead: "A normal request for an existing page usually comes back with 200 OK.",
    contextItems: [
      {
        label: "GET /profile",
        copy: "Ask for a page that exists."
      },
      {
        label: "200 OK",
        copy: "The server found it and returned the data."
      }
    ],
    lines: [
      { text: "GET /profile", tone: "request" },
      { text: "Host: learn.lab", tone: "host" }
    ],
    statusLabel: "200 OK",
    statusTone: "response",
    statusCopy: "The page data comes back successfully."
  },
  {
    id: "step-9-pair-post-201",
    step: 9,
    title: "Method + Response Pairing",
    meta: "Scenario 2 of 5",
    type: "pairing",
    contextLead: "A POST request that creates a new item often returns 201 Created.",
    contextItems: [
      {
        label: "POST /posts",
        copy: "Send new data to create a post."
      },
      {
        label: "201 Created",
        copy: "The new post was created successfully."
      }
    ],
    lines: [
      { text: "POST /posts", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Body: {\"title\":\"Hello\"}", tone: "body" }
    ],
    statusLabel: "201 Created",
    statusTone: "response",
    statusCopy: "A new resource was made."
  },
  {
    id: "step-9-pair-delete-204",
    step: 9,
    title: "Method + Response Pairing",
    meta: "Scenario 3 of 5",
    type: "pairing",
    contextLead: "A DELETE request often returns 204 No Content when the removal worked and no body needs to come back.",
    contextItems: [
      {
        label: "DELETE /post/42",
        copy: "Ask the server to remove that post."
      },
      {
        label: "204 No Content",
        copy: "The delete worked and there is no page body to return."
      }
    ],
    lines: [
      { text: "DELETE /post/42", tone: "request" },
      { text: "Host: learn.lab", tone: "host" }
    ],
    statusLabel: "204 No Content",
    statusTone: "response",
    statusCopy: "The item was removed successfully."
  },
  {
    id: "step-9-pair-get-404",
    step: 9,
    title: "Method + Response Pairing",
    meta: "Scenario 4 of 5",
    type: "pairing",
    contextLead: "A GET request for something that does not exist often returns 404 Not Found.",
    contextItems: [
      {
        label: "GET /missing-page",
        copy: "Ask for a path that is not there."
      },
      {
        label: "404 Not Found",
        copy: "The server could not find that page."
      }
    ],
    lines: [
      { text: "GET /missing-page", tone: "request" },
      { text: "Host: learn.lab", tone: "host" }
    ],
    statusLabel: "404 Not Found",
    statusTone: "warning",
    statusCopy: "The requested resource does not exist."
  },
  {
    id: "step-9-pair-post-401",
    step: 9,
    title: "Method + Response Pairing",
    meta: "Scenario 5 of 5",
    type: "pairing",
    contextLead: "A POST request to a protected login area may return 401 Unauthorized when valid credentials are missing.",
    contextItems: [
      {
        label: "POST /login",
        copy: "Send login data to try to access the account."
      },
      {
        label: "401 Unauthorized",
        copy: "The request needs valid authentication before it can continue."
      }
    ],
    lines: [
      { text: "POST /login", tone: "request" },
      { text: "Host: learn.lab", tone: "host" },
      { text: "Body: {\"username\":\"sam\"}", tone: "body" }
    ],
    statusLabel: "401 Unauthorized",
    statusTone: "warning",
    statusCopy: "The browser must authenticate first."
  },
  {
    id: "step-10-quiz-1",
    step: 10,
    title: "Methods and Responses Check",
    meta: "Question 1 of 5",
    type: "quiz",
    question: "Which method is usually used to create new data?",
    answers: [
      "GET",
      "POST",
      "DELETE"
    ],
    correctIndex: 1
  },
  {
    id: "step-10-quiz-2",
    step: 10,
    title: "Methods and Responses Check",
    meta: "Question 2 of 5",
    type: "quiz",
    question: "Which method is used to update only part of existing data?",
    answers: [
      "PATCH",
      "GET",
      "301"
    ],
    correctIndex: 0
  },
  {
    id: "step-10-quiz-3",
    step: 10,
    title: "Methods and Responses Check",
    meta: "Question 3 of 5",
    type: "quiz",
    question: "Which response means a new item was created?",
    answers: [
      "404 Not Found",
      "201 Created",
      "401 Unauthorized"
    ],
    correctIndex: 1
  },
  {
    id: "step-10-quiz-4",
    step: 10,
    title: "Methods and Responses Check",
    meta: "Question 4 of 5",
    type: "quiz",
    question: "Which response means the browser needs valid login credentials?",
    answers: [
      "200 OK",
      "204 No Content",
      "401 Unauthorized"
    ],
    correctIndex: 2
  },
  {
    id: "step-10-quiz-5",
    step: 10,
    title: "Methods and Responses Check",
    meta: "Question 5 of 5",
    type: "quiz",
    question: "Which pairing best matches a successful delete?",
    answers: [
      "DELETE /post/42 -> 204 No Content",
      "GET /profile -> 404 Not Found",
      "POST /posts -> 500 Server Error"
    ],
    correctIndex: 0
  }
];

const quizState = new Map();

let currentIndex = 0;
let highestUnlockedIndex = 0;
let highestCompletedCount = 0;

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

function screenRewardCoins(screen) {
  if (!screen) {
    return 1;
  }

  if (screen.type === "quiz" || screen.type === "pairing" || screen.type === "compare" || screen.type === "visibility") {
    return 2;
  }

  return 1;
}

function serializeQuizState() {
  const snapshot = {};

  quizState.forEach(function (value, key) {
    snapshot[key] = {
      solved: Boolean(value?.solved),
      wrongSelections: Array.isArray(value?.wrongSelections) ? value.wrongSelections.slice() : []
    };
  });

  return snapshot;
}

function currentCompletedStepCount() {
  const screen = screens[currentIndex];
  if (!screen) {
    return 0;
  }

  if (currentIndex === screens.length - 1 && screen.type === "quiz" && getQuizState(screen.id).solved) {
    return STEP_COUNT;
  }

  return Math.max(0, Number(screen.step) - 1);
}

function persistedCompletedStepCount() {
  const furthestIndex = Math.max(0, Math.min(screens.length - 1, highestUnlockedIndex));
  const furthestScreen = screens[furthestIndex];
  const furthestCount = furthestScreen
    ? ((furthestIndex === screens.length - 1 && furthestScreen.type === "quiz" && getQuizState(furthestScreen.id).solved)
      ? STEP_COUNT
      : Math.max(0, Number(furthestScreen.step) - 1))
    : 0;

  highestCompletedCount = Math.max(highestCompletedCount, currentCompletedStepCount(), furthestCount);
  return highestCompletedCount;
}

function buildProgressSnapshot() {
  return {
    currentIndex: currentIndex,
    highestUnlockedIndex: highestUnlockedIndex,
    highestCompletedCount: highestCompletedCount,
    quizState: serializeQuizState()
  };
}

function persistHttpProgress() {
  if (!NetlabApp?.saveSectionProgress) {
    return;
  }

  const screen = screens[currentIndex];
  NetlabApp.saveSectionProgress(SECTION_ID, {
    sectionLabel: "Web & HTTP Lab",
    currentItemId: screen.id,
    currentItemLabel: `${screen.title} - ${screen.meta}`,
    completedCount: persistedCompletedStepCount(),
    totalCount: STEP_COUNT,
    summaryText: `Step ${screen.step} of ${STEP_COUNT} | Screen ${currentIndex + 1}/${screens.length}`,
    state: buildProgressSnapshot()
  });
}

function restoreSavedProgress(savedState) {
  if (!savedState) {
    return false;
  }

  const savedIndex = Math.max(0, Math.min(screens.length - 1, Number(savedState.currentIndex) || 0));
  currentIndex = savedIndex;
  highestUnlockedIndex = Math.max(savedIndex, Math.min(screens.length - 1, Number(savedState.highestUnlockedIndex) || savedIndex));
  highestCompletedCount = Math.max(0, Math.min(STEP_COUNT, Number(savedState.highestCompletedCount) || 0));
  quizState.clear();

  const savedQuizState = savedState.quizState && typeof savedState.quizState === "object" ? savedState.quizState : {};
  Object.keys(savedQuizState).forEach(function (screenId) {
    const value = savedQuizState[screenId] || {};
    quizState.set(screenId, {
      solved: Boolean(value.solved),
      wrongSelections: Array.isArray(value.wrongSelections) ? value.wrongSelections.slice() : []
    });
  });

  return true;
}

function celebrateScreenAdvance(completedScreen, nextScreen) {
  if (!completedScreen) {
    return;
  }

  if (!nextScreen) {
    return;
  }

  if (completedScreen.step !== nextScreen.step) {
    if (NetlabApp?.grantProgressReward) {
      NetlabApp.grantProgressReward({
        key: `http-section-complete:${completedScreen.step}`,
        coins: 3,
        title: `HTTP Step ${completedScreen.step}`,
        label: "Section Complete",
        tone: "section",
        message: completedScreen.title
      });
    } else {
      NetlabApp?.showProgressPulse?.({ label: "Section Complete", tone: "section", coins: 3 });
    }
    return;
  }

  if (NetlabApp?.grantProgressReward) {
    NetlabApp.grantProgressReward({
      key: `http-screen-complete:${completedScreen.id}`,
      coins: screenRewardCoins(completedScreen),
      title: "HTTP Step",
      label: "Step Complete",
      tone: "step",
      message: completedScreen.meta
    });
  } else {
    NetlabApp?.showProgressPulse?.({
      label: "Step Complete",
      tone: "step",
      coins: screenRewardCoins(completedScreen)
    });
  }
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

function renderCompareVisual(screen) {
  const contextItems = (screen.contextItems || []).map((item) => `
    <li class="http-compare-context-item">
      <span class="http-compare-context-label">${escapeHtml(item.label)}</span>
      <span class="http-compare-context-copy">${escapeHtml(item.copy)}</span>
    </li>
  `).join("");

  return `
    <div class="http-visual-frame">
      <div class="http-compare-stack">
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

        <div class="http-compare-context">
          <p class="http-compare-context-lead">${escapeHtml(screen.contextLead || "")}</p>
          <ul class="http-compare-context-list">
            ${contextItems}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function renderPairingVisual(screen) {
  const lines = screen.lines.map((line) => `
    <div class="http-request-line is-${line.tone}">${escapeHtml(line.text)}</div>
  `).join("");
  const contextItems = (screen.contextItems || []).map((item) => `
    <li class="http-pairing-context-item">
      <span class="http-pairing-context-label">${escapeHtml(item.label)}</span>
      <span class="http-pairing-context-copy">${escapeHtml(item.copy)}</span>
    </li>
  `).join("");

  return `
    <div class="http-visual-frame">
      <div class="http-pairing-stack">
        <div class="http-pairing-flow" role="img" aria-label="${escapeHtml(screen.title)}">
          <div class="http-request-card">
            <div class="http-request-toolbar" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="http-request-body">
              ${lines}
            </div>
          </div>

          <div class="http-pairing-arrow" aria-hidden="true">
            <i class="fa-solid fa-arrow-down"></i>
          </div>

          <div class="http-status-card">
            <p class="http-status-label">Response</p>
            <div class="http-status-chip is-${screen.statusTone}">${escapeHtml(screen.statusLabel)}</div>
            <p class="http-status-copy">${escapeHtml(screen.statusCopy)}</p>
          </div>
        </div>

        <div class="http-pairing-context">
          <p class="http-pairing-context-lead">${escapeHtml(screen.contextLead || "")}</p>
          <ul class="http-pairing-context-list">
            ${contextItems}
          </ul>
        </div>
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
    return renderCompareVisual(screen);
  }

  if (screen.type === "pairing") {
    return renderPairingVisual(screen);
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

  els.stepKicker.textContent = `Step ${screen.step} of ${STEP_COUNT} | Screen ${currentIndex + 1} / ${screens.length}`;
  els.screenTitle.textContent = screen.title;
  els.screenMeta.textContent = screen.meta;
  els.screenVisual.innerHTML = renderVisual(screen);
  renderActions(screen);

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  persistHttpProgress();
}

function goBack() {
  if (currentIndex === 0) {
    return;
  }

  currentIndex -= 1;
  renderScreen();
}

function resetFlow() {
  quizState.clear();
  currentIndex = 0;
  highestUnlockedIndex = 0;
  renderScreen();
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

  const nextScreen = screens[currentIndex + 1];
  celebrateScreenAdvance(screen, nextScreen);
  currentIndex += 1;
  highestUnlockedIndex = Math.max(highestUnlockedIndex, currentIndex);
  renderScreen();
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
    if (currentIndex === screens.length - 1) {
      if (NetlabApp?.saveSectionProgress) {
        highestUnlockedIndex = Math.max(highestUnlockedIndex, currentIndex);
      }
      persistHttpProgress();
    }
  } else if (!state.wrongSelections.includes(answerIndex)) {
    state.wrongSelections.push(answerIndex);
    NetlabApp?.showProgressPulse?.({ label: "Try Again", tone: "error" });
  }

  renderScreen();
}

async function initHttpLab() {
  if (NetlabApp?.whenReady) {
    await NetlabApp.whenReady();
  }

  const launchAction = NetlabApp?.getLaunchAction?.();
  if (launchAction === "start") {
    NetlabApp?.resetSectionProgress?.(SECTION_ID);
    NetlabApp?.clearLaunchAction?.();
  }

  const savedRecord = NetlabApp?.getSectionProgress?.(SECTION_ID);
  if (launchAction === "resume" && savedRecord?.state) {
    restoreSavedProgress(savedRecord.state);
    NetlabApp?.clearLaunchAction?.();
  } else if (launchAction && launchAction !== "start") {
    NetlabApp?.clearLaunchAction?.();
  }

  renderScreen();
}

els.backBtn.addEventListener("click", goBack);
els.nextBtn.addEventListener("click", goNext);

initHttpLab();
