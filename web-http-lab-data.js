(function () {
  const lessons = [
    {
      id: "http-request-basics",
      title: "HTTP Request Basics",
      category: "HTTP Fundamentals",
      difficulty: "Beginner",
      learningObjectives: [
        "See one browser request from start to finish.",
        "Learn GET, path, Host, 200, and POST one at a time.",
        "Tap one part, then move to the next step."
      ],
      scenarioIntro:
        "One small web request. One idea per step.",
      explanation:
        "Watch the flow. Tap the part. Move on.",
      recommendedNextLesson: "inspecting-headers-responses",
      interactiveSteps: [
        {
          id: "http-basics-flow",
          title: "Browser to Server",
          prompt: "Watch the page load.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Follow the arrows."],
          successCondition: "See the browser send one request and receive one response.",
          feedback: "Good. The browser asked, and the server answered.",
          explanation: "Your browser asks a server for a page.",
          workspace: {
            browser: {
              title: "Sprout Profile",
              url: "https://profile.sprout.lab/profile",
              note: "Simple page load"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "User-Agent", value: "Chrome" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Profile</h1>\n  <p>Welcome back.</p>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "This example only shows the basic request flow."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "flow",
            stageIndex: 1,
            mode: "get"
          },
          interaction: {
            type: "focus-continue",
            buttonLabel: "Next"
          }
        },
        {
          id: "http-basics-get",
          title: "GET",
          prompt: "Tap GET.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap GET."],
          successCondition: "Tap GET to see what it means.",
          feedback: "Good. GET asks for data.",
          explanation: "GET = ask for data.",
          workspace: {
            browser: {
              title: "Sprout Profile",
              url: "https://profile.sprout.lab/profile",
              note: "Simple page load"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "User-Agent", value: "Chrome" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "No login needed here."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "get",
            lineParts: ["method", "path"],
            headerParts: [],
            interactiveParts: ["method"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "get"
          }
        },
        {
          id: "http-basics-path",
          title: "Path",
          prompt: "Tap /profile.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap /profile."],
          successCondition: "Tap the page name in the request.",
          feedback: "Right. /profile is the page name.",
          explanation: "/profile = the page you want.",
          workspace: {
            browser: {
              title: "Sprout Profile",
              url: "https://profile.sprout.lab/profile",
              note: "Simple page load"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "User-Agent", value: "Chrome" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "No login needed here."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "path",
            lineParts: ["method", "path"],
            headerParts: [],
            interactiveParts: ["path"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "path"
          }
        },
        {
          id: "http-basics-host",
          title: "Host",
          prompt: "Tap Host.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Host."],
          successCondition: "Tap the website name in the request.",
          feedback: "Good. Host means which website.",
          explanation: "Host = which website.",
          workspace: {
            browser: {
              title: "Sprout Profile",
              url: "https://profile.sprout.lab/profile",
              note: "Simple page load"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "User-Agent", value: "Chrome" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "No login needed here."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "host",
            lineParts: [],
            headerParts: ["host"],
            interactiveParts: ["host"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "host"
          }
        },
        {
          id: "http-basics-200",
          title: "200 OK",
          prompt: "Tap 200 OK.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap 200 OK."],
          successCondition: "Tap the response status.",
          feedback: "Yes. 200 means it worked.",
          explanation: "200 = it worked.",
          workspace: {
            browser: {
              title: "Sprout Profile",
              url: "https://profile.sprout.lab/profile",
              note: "Simple page load"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "User-Agent", value: "Chrome" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "No login needed here."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "response",
            mode: "get",
            defaultExplainKey: "response-code",
            lineParts: ["status"],
            interactiveParts: ["status"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "response-code"
          }
        },
        {
          id: "http-basics-post",
          title: "POST",
          prompt: "Tap POST.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap POST."],
          successCondition: "Tap POST to see what it means.",
          feedback: "Correct. POST sends data.",
          explanation: "POST = send data.",
          workspace: {
            browser: {
              title: "Sprout Sign In",
              url: "https://profile.sprout.lab/login",
              note: "Simple form submit"
            },
            request: {
              method: "POST",
              path: "/login",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "profile.sprout.lab" },
                { name: "Content-Type", value: "application/x-www-form-urlencoded" }
              ],
              body: "email=maya%40sprout.lab&password=example"
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Set-Cookie", value: "session=ab12" }
              ],
              body: "<html>\n  <h1>Signed in</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Guest",
              id: "No active session",
              note: "This example only compares GET and POST."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The proxy forwards the request."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "request",
            mode: "post",
            defaultExplainKey: "post",
            lineParts: ["method", "path"],
            headerParts: [],
            interactiveParts: ["method"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "post"
          }
        }
      ]
    },
    {
      id: "inspecting-headers-responses",
      title: "Inspecting Headers and Responses",
      category: "Headers & Metadata",
      difficulty: "Beginner",
      learningObjectives: [
        "Spot useful request and response headers during inspection.",
        "Understand what Host, Cookie, User-Agent, Content-Type, and Set-Cookie communicate.",
        "Recognize which response headers influence browser caching."
      ],
      scenarioIntro:
        "You are reviewing a fictional helpdesk portal exchange. The traffic already contains several headers that tell you about the destination site, browser identity, body type, stored state, and cache behavior.",
      explanation:
        "Headers carry metadata. They are often the fastest place to learn who is speaking, what data format is in use, what state the browser is carrying, and what the server wants the browser to remember or cache.",
      recommendedNextLesson: "cookies-session-basics",
      interactiveSteps: [
        {
          id: "headers-useful-fields",
          title: "Pick the Most Useful Headers",
          prompt:
            "Select the pieces of this exchange that are especially useful for understanding the destination site, browser identity, stored state, and how the body should be handled.",
          acceptedAnswers: ["Host", "Cookie", "User-Agent", "Content-Type", "Set-Cookie"],
          acceptedActions: [],
          hints: [
            "Think about identity, destination, state, and body format.",
            "Some useful fields are in the request, and some are in the response.",
            "Host, Cookie, User-Agent, Content-Type, and Set-Cookie are the key ones here."
          ],
          successCondition:
            "Select the headers that reveal destination, browser identity, state, and body handling.",
          feedback:
            "Correct. Those headers give a beginner a lot of visibility into what the browser is doing and what the server expects.",
          explanation:
            "Host shows the requested site, User-Agent identifies the browser, Cookie shows stored state being sent back, Content-Type tells you how a body should be interpreted, and Set-Cookie tells the browser to store a cookie for later requests.",
          workspace: {
            browser: {
              title: "Spruce Helpdesk",
              url: "https://helpdesk.spruce.lab/tickets/142",
              note: "Signed-in helpdesk view"
            },
            request: {
              method: "GET",
              path: "/tickets/142",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "helpdesk.spruce.lab" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" },
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "Accept", value: "text/html" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" },
                { name: "Set-Cookie", value: "last_ticket=142; Path=/; HttpOnly" },
                { name: "Cache-Control", value: "private, max-age=60" }
              ],
              body:
                "<html>\n  <h1>Ticket #142</h1>\n  <p>Status: awaiting review</p>\n</html>"
            },
            cookies: [
              { name: "theme", value: "forest", scope: "helpdesk.spruce.lab", purpose: "Preference" },
              { name: "session", value: "sp-41ac2", scope: "helpdesk.spruce.lab", purpose: "Signed-in state" },
              { name: "last_ticket", value: "142", scope: "helpdesk.spruce.lab", purpose: "Recent ticket shortcut" }
            ],
            session: {
              state: "Signed in",
              id: "sp-41ac2",
              note: "The browser already has a session cookie for the portal."
            },
            cache: {
              status: "Private cache allowed",
              note: "The response can be cached privately by the browser for 60 seconds."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this inspection lesson."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "multi-select",
            buttonLabel: "Check Selection",
            feedbackIncorrect:
              "Review which headers explain destination, client identity, stored cookies, body format, and server-set cookies.",
            options: [
              { id: "host", label: "Host", correct: true },
              { id: "cookie", label: "Cookie", correct: true },
              { id: "user-agent", label: "User-Agent", correct: true },
              { id: "content-type", label: "Content-Type", correct: true },
              { id: "set-cookie", label: "Set-Cookie", correct: true },
              { id: "accept", label: "Accept", correct: false },
              { id: "date", label: "Date", correct: false }
            ]
          }
        },
        {
          id: "headers-meaning",
          title: "Match Headers to Their Jobs",
          prompt:
            "Use the exchange to identify which header names the site, which one carries stored state, which one identifies the browser, which one describes the response body type, and which one tells the browser to store a new cookie.",
          acceptedAnswers: ["Host", "Cookie", "User-Agent", "Content-Type", "Set-Cookie"],
          acceptedActions: [],
          hints: [
            "The answers are header names, not values.",
            "Think site, stored state, browser identity, body type, and new cookie.",
            "The order here is Host, Cookie, User-Agent, Content-Type, Set-Cookie."
          ],
          successCondition:
            "Correctly name the header that serves each role in the exchange.",
          feedback:
            "Correct. You now know how to map common header names to their jobs in a request and response.",
          explanation:
            "Beginners often see many headers at once and do not know where to look first. Mapping common header names to their purpose makes traffic inspection much easier.",
          workspace: {
            browser: {
              title: "Spruce Helpdesk",
              url: "https://helpdesk.spruce.lab/tickets/142",
              note: "Same request and response, now focusing on what each header means"
            },
            request: {
              method: "GET",
              path: "/tickets/142",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "helpdesk.spruce.lab" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" },
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" },
                { name: "Set-Cookie", value: "last_ticket=142; Path=/; HttpOnly" },
                { name: "Cache-Control", value: "private, max-age=60" }
              ],
              body:
                "<html>\n  <h1>Ticket #142</h1>\n  <p>Status: awaiting review</p>\n</html>"
            },
            cookies: [
              { name: "theme", value: "forest", scope: "helpdesk.spruce.lab", purpose: "Preference" },
              { name: "session", value: "sp-41ac2", scope: "helpdesk.spruce.lab", purpose: "Signed-in state" }
            ],
            session: {
              state: "Signed in",
              id: "sp-41ac2",
              note: "A session cookie is already being sent in the request."
            },
            cache: {
              status: "Cache metadata present",
              note: "Cache-Control appears in the response and affects reuse."
            },
            proxy: {
              status: "Pass-through",
              note: "This lesson is about reading metadata rather than intercepting it."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "field-check",
            buttonLabel: "Check Answers",
            feedbackIncorrect:
              "Use the request and response headers to match site, stored state, browser identity, body type, and cookie-setting behavior.",
            fields: [
              {
                id: "siteHeader",
                label: "Header that names the target site",
                placeholder: "Host",
                answers: ["Host"]
              },
              {
                id: "stateHeader",
                label: "Header that carries stored browser state back to the server",
                placeholder: "Cookie",
                answers: ["Cookie"]
              },
              {
                id: "browserHeader",
                label: "Header that identifies the browser",
                placeholder: "User-Agent",
                answers: ["User-Agent"]
              },
              {
                id: "bodyTypeHeader",
                label: "Header that describes the response body type",
                placeholder: "Content-Type",
                answers: ["Content-Type"]
              },
              {
                id: "storeHeader",
                label: "Header that tells the browser to store a new cookie",
                placeholder: "Set-Cookie",
                answers: ["Set-Cookie"]
              }
            ]
          }
        },
        {
          id: "headers-cache-concept",
          title: "Spot a Cache Header",
          prompt:
            "Which response header most directly tells the browser how it may cache this page?",
          acceptedAnswers: ["Cache-Control"],
          acceptedActions: [],
          hints: [
            "Look at the response headers, not the request headers.",
            "This header often uses values like max-age, no-store, or private.",
            "The answer is Cache-Control."
          ],
          successCondition:
            "Identify the response header that gives browser caching instructions.",
          feedback:
            "Correct. Cache-Control is the main caching instruction header in this response.",
          explanation:
            "Browser cache behavior matters because it changes whether the browser reuses a stored copy or asks the server again. Learners do not need every caching detail yet, but they should learn where the decision usually starts.",
          workspace: {
            browser: {
              title: "Spruce Helpdesk",
              url: "https://helpdesk.spruce.lab/tickets/142",
              note: "Focusing on cache-related metadata"
            },
            request: {
              method: "GET",
              path: "/tickets/142",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "helpdesk.spruce.lab" },
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" },
                { name: "Cache-Control", value: "private, max-age=60" },
                { name: "ETag", value: "\"ticket-142-v3\"" }
              ],
              body:
                "<html>\n  <h1>Ticket #142</h1>\n  <p>Status: awaiting review</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "sp-41ac2", scope: "helpdesk.spruce.lab", purpose: "Signed-in state" }
            ],
            session: {
              state: "Signed in",
              id: "sp-41ac2",
              note: "Signed-in traffic often uses private caching rules."
            },
            cache: {
              status: "private, max-age=60",
              note: "The browser may reuse a private copy for 60 seconds before checking again."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is needed for this concept."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Choose the response header that directly contains caching instructions such as max-age or no-store.",
            options: [
              {
                id: "etag",
                label: "ETag",
                correct: false,
                explanation:
                  "ETag can support cache validation, but it is not the main instruction header in this question."
              },
              {
                id: "cache-control",
                label: "Cache-Control",
                correct: true,
                explanation:
                  "Cache-Control is the direct caching instruction header in this response."
              },
              {
                id: "server",
                label: "Server",
                correct: false,
                explanation:
                  "Server identifies the web server software, not browser cache behavior."
              }
            ]
          }
        }
      ]
    },
    {
      id: "cookies-session-basics",
      title: "Cookies and Session Basics",
      category: "Cookies & State",
      difficulty: "Beginner",
      learningObjectives: [
        "See how the browser stores a cookie from one response and sends it in the next request.",
        "Understand what a simple session identifier represents in beginner terms.",
        "Distinguish a session cookie from ordinary preference cookies."
      ],
      scenarioIntro:
        "You are looking at a fictional member portal that sets a session cookie after the first page load. The lab focuses on how the browser stores it and where it appears on the next request.",
      explanation:
        "Cookies help browsers remember information between requests. A session cookie does not magically contain trust by itself; it is just an identifier the server uses to look up state on the server side.",
      recommendedNextLesson: "session-handling-risk",
      interactiveSteps: [
        {
          id: "cookie-store-then-send",
          title: "What Happens After Set-Cookie?",
          prompt:
            "The server sends Set-Cookie: PHPSESSID=pl-8841aa; Path=/; HttpOnly in the response. What should the browser do before the next request to the same site?",
          acceptedAnswers: ["Store the cookie and send it back in a Cookie header on the next matching request"],
          acceptedActions: [],
          hints: [
            "Set-Cookie is an instruction from the server to the browser.",
            "The browser keeps the cookie, then reuses it on later matching requests.",
            "The next request should carry the cookie in a Cookie header."
          ],
          successCondition:
            "Recognize that the browser stores the cookie and sends it back on later matching requests.",
          feedback:
            "Correct. The browser stores the cookie and then includes it in the Cookie header on later matching requests.",
          explanation:
            "This is the core browser-state loop: the server sends Set-Cookie in a response, and the browser sends Cookie in a later request if the scope rules match.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/welcome",
              note: "First page load after opening the portal"
            },
            request: {
              method: "GET",
              path: "/welcome",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "portal.fable.lab" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" },
                { name: "Set-Cookie", value: "PHPSESSID=pl-8841aa; Path=/; HttpOnly" }
              ],
              body:
                "<html>\n  <h1>Welcome</h1>\n  <p>Your member tools are loading.</p>\n</html>"
            },
            cookies: [
              { name: "PHPSESSID", value: "pl-8841aa", scope: "portal.fable.lab", purpose: "Session identifier" }
            ],
            session: {
              state: "Session created",
              id: "pl-8841aa",
              note: "The server has issued a new session identifier."
            },
            cache: {
              status: "Normal page response",
              note: "The main focus here is stored cookie state rather than caching."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Think about the browser's next step after receiving Set-Cookie from the server.",
            options: [
              {
                id: "store-send",
                label: "Store the cookie, then send it in a Cookie header on the next matching request",
                correct: true,
                explanation:
                  "That is the normal browser behavior when a response includes Set-Cookie."
              },
              {
                id: "put-in-body",
                label: "Place the cookie in the next request body instead of a header",
                correct: false,
                explanation:
                  "Cookies are normally sent in the Cookie header, not in the request body."
              },
              {
                id: "ignore",
                label: "Ignore the cookie unless the user manually approves it",
                correct: false,
                explanation:
                  "In this fictional lab, the browser stores the cookie automatically according to normal browser behavior."
              }
            ]
          }
        },
        {
          id: "cookie-inspect-session-name",
          title: "Inspect the Session Cookie",
          prompt:
            "The next request now includes the cookie. Identify the session cookie name and the request header that carries it back to the server.",
          acceptedAnswers: ["PHPSESSID", "Cookie"],
          acceptedActions: [],
          hints: [
            "One answer is the cookie name itself.",
            "The second answer is the request header that transports stored cookies.",
            "The pair is PHPSESSID and Cookie."
          ],
          successCondition:
            "Correctly name the session cookie and the request header that sends it back.",
          feedback:
            "Correct. The cookie name is PHPSESSID, and the browser sends it back in the Cookie header.",
          explanation:
            "The browser does not send Set-Cookie back to the server. Set-Cookie is the server instruction, while Cookie is the browser sending stored state back.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/dashboard",
              note: "Second request after the session cookie was stored"
            },
            request: {
              method: "GET",
              path: "/dashboard",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "portal.fable.lab" },
                { name: "Cookie", value: "PHPSESSID=pl-8841aa; theme=violet" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Member Dashboard</h1>\n  <p>Session recognised.</p>\n</html>"
            },
            cookies: [
              { name: "PHPSESSID", value: "pl-8841aa", scope: "portal.fable.lab", purpose: "Session identifier" },
              { name: "theme", value: "violet", scope: "portal.fable.lab", purpose: "Preference" }
            ],
            session: {
              state: "Session recognised",
              id: "pl-8841aa",
              note: "The server can look up member state using the session identifier."
            },
            cache: {
              status: "Not the focus",
              note: "This step is about where the browser sends stored cookies."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "field-check",
            buttonLabel: "Check Answers",
            feedbackIncorrect:
              "Find the session cookie name in the cookie jar, then look at the request header that carries it back.",
            fields: [
              {
                id: "cookieName",
                label: "Session cookie name",
                placeholder: "PHPSESSID",
                answers: ["PHPSESSID"]
              },
              {
                id: "headerName",
                label: "Request header that carries stored cookies",
                placeholder: "Cookie",
                answers: ["Cookie"]
              }
            ]
          }
        },
        {
          id: "cookie-vs-preference",
          title: "Session Cookie or Preference Cookie?",
          prompt:
            "Select the cookie that most clearly represents session state rather than a simple user preference.",
          acceptedAnswers: ["PHPSESSID"],
          acceptedActions: [],
          hints: [
            "One cookie controls appearance. The other identifies server-side state.",
            "Preference cookies often use readable values such as theme or language.",
            "PHPSESSID is the session identifier in this lab."
          ],
          successCondition:
            "Identify the cookie that represents session state.",
          feedback:
            "Correct. PHPSESSID is the session identifier here, while theme is just a preference cookie.",
          explanation:
            "Not every cookie is equally sensitive. A preference cookie might only change appearance, while a session cookie can point to logged-in state on the server side.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/dashboard",
              note: "Reviewing stored cookies after the dashboard loads"
            },
            request: {
              method: "GET",
              path: "/dashboard",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "portal.fable.lab" },
                { name: "Cookie", value: "PHPSESSID=pl-8841aa; theme=violet; lang=en" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Member Dashboard</h1>\n  <p>Theme: violet</p>\n</html>"
            },
            cookies: [
              { name: "PHPSESSID", value: "pl-8841aa", scope: "portal.fable.lab", purpose: "Session identifier" },
              { name: "theme", value: "violet", scope: "portal.fable.lab", purpose: "Preference" },
              { name: "lang", value: "en", scope: "portal.fable.lab", purpose: "Language choice" }
            ],
            session: {
              state: "Session recognised",
              id: "pl-8841aa",
              note: "The server uses this identifier to find the current member state."
            },
            cache: {
              status: "Not the focus",
              note: "Cookies are the main topic in this step."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Pick the cookie that acts like an identifier for server-side session state rather than a display preference.",
            options: [
              {
                id: "theme",
                label: "theme=violet",
                correct: false,
                explanation:
                  "Theme is a preference cookie. It changes appearance but does not act as the main session identifier."
              },
              {
                id: "phpsessid",
                label: "PHPSESSID=pl-8841aa",
                correct: true,
                explanation:
                  "PHPSESSID is the session identifier in this lab."
              },
              {
                id: "lang",
                label: "lang=en",
                correct: false,
                explanation:
                  "Language is a preference cookie rather than the main session identifier."
              }
            ]
          }
        }
      ]
    },
    {
      id: "session-handling-risk",
      title: "Session Handling and Risk",
      category: "Session Security Concepts",
      difficulty: "Beginner+",
      learningObjectives: [
        "See that authenticated state is tied to a session identifier value.",
        "Observe what happens when a session token changes or an old one is reused.",
        "Understand defensive session practices at a beginner level."
      ],
      scenarioIntro:
        "This fictional operations dashboard rotates the session identifier after login. The lesson stays defensive: learners are observing how state changes and why good session hygiene matters.",
      explanation:
        "A session token is only meaningful because the server ties it to state on the back end. If the token changes, the state lookup can change too. Defenders care because session rotation, invalidation, and secure cookie handling reduce risk.",
      recommendedNextLesson: "proxy-interception-fundamentals",
      interactiveSteps: [
        {
          id: "session-rotation-after-login",
          title: "Notice the Session Rotation",
          prompt:
            "Before login, the browser had session=guest-31aa. After a successful login, the server responds with Set-Cookie: session=auth-93c7d1. What changed?",
          acceptedAnswers: ["The server rotated the session identifier after login"],
          acceptedActions: [],
          hints: [
            "Compare the old and new cookie values.",
            "The identifier changed at the moment authentication state changed.",
            "This is session rotation after login."
          ],
          successCondition:
            "Recognize that the server issued a fresh session identifier when login completed.",
          feedback:
            "Correct. The server rotated the session identifier when the user moved from guest state to authenticated state.",
          explanation:
            "Rotating the session ID after login is a good defensive practice because it reduces the chance that an old guest token stays tied to the new authenticated state.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/login",
              note: "Watching the transition from guest to authenticated session"
            },
            request: {
              method: "POST",
              path: "/login",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "ops.beacon.lab" },
                { name: "Cookie", value: "session=guest-31aa" },
                { name: "Content-Type", value: "application/x-www-form-urlencoded" }
              ],
              body: "username=maya&password=demo-lab-value"
            },
            response: {
              statusCode: 302,
              statusText: "Found",
              headers: [
                { name: "Location", value: "/dashboard" },
                { name: "Set-Cookie", value: "session=auth-93c7d1; Path=/; HttpOnly; Secure" }
              ],
              body: ""
            },
            cookies: [
              { name: "session", value: "auth-93c7d1", scope: "ops.beacon.lab", purpose: "Authenticated session" }
            ],
            session: {
              state: "Authenticated",
              id: "auth-93c7d1",
              note: "The server replaced the guest session with a fresh authenticated token."
            },
            cache: {
              status: "Sensitive route",
              note: "Authentication flows usually need careful caching decisions."
            },
            proxy: {
              status: "Pass-through",
              note: "This step is about state transitions, not interception."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Compare the cookie value before login to the Set-Cookie value after login.",
            options: [
              {
                id: "rotated",
                label: "The server rotated the session identifier after login",
                correct: true,
                explanation:
                  "That is exactly what happened: the guest token was replaced with a fresh authenticated token."
              },
              {
                id: "same-token",
                label: "The login reused the same session identifier without change",
                correct: false,
                explanation:
                  "The value changed from guest-31aa to auth-93c7d1, so the identifier was rotated."
              },
              {
                id: "no-cookie",
                label: "The server stopped using cookies after login",
                correct: false,
                explanation:
                  "The response clearly includes a new Set-Cookie header."
              }
            ]
          }
        },
        {
          id: "session-reuse-observation",
          title: "Observe Old Token Reuse",
          prompt:
            "A later request mistakenly reuses the old guest token session=guest-31aa. The server responds by redirecting the browser back to /login. What does this show?",
          acceptedAnswers: ["State is tied to the session identifier value"],
          acceptedActions: [],
          hints: [
            "The request did not carry the new authenticated token.",
            "The server treats the old token differently from the new one.",
            "State is tied to the session identifier value the server receives."
          ],
          successCondition:
            "Recognize that the server uses the specific token value to decide what session state applies.",
          feedback:
            "Correct. The server looked up a different state because it received a different session identifier.",
          explanation:
            "This beginner-friendly example shows why the token value matters: the server does not just see “a cookie,” it sees a specific identifier and uses that value to find matching state.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/dashboard",
              note: "Comparing an old guest token with the fresh authenticated token"
            },
            request: {
              method: "GET",
              path: "/dashboard",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "ops.beacon.lab" },
                { name: "Cookie", value: "session=guest-31aa" }
              ],
              body: ""
            },
            response: {
              statusCode: 302,
              statusText: "Found",
              headers: [
                { name: "Location", value: "/login" },
                { name: "Cache-Control", value: "no-store" }
              ],
              body: ""
            },
            cookies: [
              { name: "session", value: "guest-31aa", scope: "ops.beacon.lab", purpose: "Old guest session" }
            ],
            session: {
              state: "Guest state returned",
              id: "guest-31aa",
              note: "The server no longer treats this token as the authenticated session."
            },
            cache: {
              status: "no-store",
              note: "Sensitive redirects often avoid caching."
            },
            proxy: {
              status: "Pass-through",
              note: "This step is about server-side state lookup."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Focus on what changed between the guest token and the authenticated token, and how the server responded.",
            options: [
              {
                id: "tied-to-token",
                label: "State is tied to the session identifier value the server receives",
                correct: true,
                explanation:
                  "The server responded differently because it received a different identifier value."
              },
              {
                id: "cookies-random",
                label: "Any cookie value works the same as long as the name is session",
                correct: false,
                explanation:
                  "The response shows the opposite. The specific value matters because the server maps that value to state."
              },
              {
                id: "cache-problem",
                label: "The redirect happened because the browser cache was stale",
                correct: false,
                explanation:
                  "The important clue here is the old guest token, not cache reuse."
              }
            ]
          }
        },
        {
          id: "session-defensive-practice",
          title: "Pick the Defensive Takeaway",
          prompt:
            "Which defensive practice best fits what you observed in this lab?",
          acceptedAnswers: ["Rotate the session ID after login and expire old session tokens"],
          acceptedActions: [],
          hints: [
            "The lab showed a token change at login and different behavior for the old token.",
            "Good defenses reduce the value of stale session identifiers.",
            "Rotate the session ID after login and expire old session tokens."
          ],
          successCondition:
            "Choose the defensive session practice that best matches the lesson.",
          feedback:
            "Correct. Rotating the session ID after login and expiring old tokens are sensible defensive practices.",
          explanation:
            "Beginner learners do not need a full session-management checklist here. The key point is that better session hygiene means changing the identifier when trust changes and invalidating tokens that should no longer work.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/dashboard",
              note: "Reviewing the session-handling lesson outcome"
            },
            request: {
              method: "GET",
              path: "/dashboard",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "ops.beacon.lab" },
                { name: "Cookie", value: "session=auth-93c7d1" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Cache-Control", value: "no-store" },
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Dashboard</h1>\n  <p>Authenticated operator workspace.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "auth-93c7d1", scope: "ops.beacon.lab", purpose: "Authenticated session" }
            ],
            session: {
              state: "Authenticated",
              id: "auth-93c7d1",
              note: "The current valid token is separate from the old guest token."
            },
            cache: {
              status: "no-store",
              note: "Sensitive authenticated pages often avoid browser caching."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is needed for this concept."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Choose the option that reflects better defensive session handling rather than a weaker shortcut.",
            options: [
              {
                id: "rotate-expire",
                label: "Rotate the session ID after login and expire old session tokens",
                correct: true,
                explanation:
                  "That matches the safer pattern demonstrated in the lab."
              },
              {
                id: "reuse-forever",
                label: "Keep one session identifier forever because changing it adds complexity",
                correct: false,
                explanation:
                  "That ignores the value of rotating identifiers when trust changes."
              },
              {
                id: "move-body",
                label: "Move the session identifier into the POST body instead of a cookie",
                correct: false,
                explanation:
                  "That does not address the main lesson about server-side session handling and token rotation."
              }
            ]
          }
        }
      ]
    },
    {
      id: "proxy-interception-fundamentals",
      title: "Proxy Interception Fundamentals",
      category: "Proxy & Interception",
      difficulty: "Beginner+",
      learningObjectives: [
        "Visualize browser traffic passing through a proxy.",
        "Understand what it means for a request to be captured before it reaches the server.",
        "Use simple intercept controls in a safe guided lab context."
      ],
      scenarioIntro:
        "This lesson simulates browser traffic moving through a fictional learning proxy. The goal is to show what happens when interception is off, when it is turned on, and when a captured request is finally forwarded to the server.",
      explanation:
        "A proxy sits between the browser and the server. When interception is enabled, the proxy can hold a request before the server ever sees it. That visibility is useful for learning how requests are built and how server responses depend on what was sent.",
      recommendedNextLesson: "request-modification-challenge",
      interactiveSteps: [
        {
          id: "proxy-enable-intercept",
          title: "Turn Interception On",
          prompt:
            "The learning proxy is currently in pass-through mode. Use the proxy controls to switch interception on before the next request leaves the browser.",
          acceptedAnswers: [],
          acceptedActions: ["Turn Intercept On"],
          hints: [
            "You are not answering with text in this step.",
            "Use the proxy control that pauses new requests before they reach the server.",
            "Turn Intercept On is the correct action."
          ],
          successCondition:
            "Enable interception so the next browser request pauses at the proxy.",
          feedback:
            "Correct. The proxy is now set to capture the next request before it reaches the server.",
          explanation:
            "With interception off, requests flow straight through. With interception on, the proxy can pause the next request so you can inspect it before the server responds.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/profile",
              note: "Browser ready to send the next request"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "proxy.lumen.lab" },
                { name: "Cookie", value: "session=lu-2001" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Profile</h1>\n  <p>Current view loaded from server.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "This lesson uses a simple signed-in fictional lab account."
            },
            cache: {
              status: "Normal browser state",
              note: "The focus here is the proxy path rather than caching."
            },
            proxy: {
              status: "Bypass mode",
              note: "Requests currently flow directly from browser to server.",
              interceptEnabled: false,
              requestPaused: false
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          workspaceAfterSuccess: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/profile",
              note: "Interception enabled for the next request"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "proxy.lumen.lab" },
                { name: "Cookie", value: "session=lu-2001" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Profile</h1>\n  <p>Current view loaded from server.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The user is ready to send a new request through the proxy."
            },
            cache: {
              status: "Normal browser state",
              note: "The focus here is the interception toggle."
            },
            proxy: {
              status: "Intercept on",
              note: "The next outbound request will pause at the proxy before it reaches the server.",
              interceptEnabled: true,
              requestPaused: false
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "proxy-control",
            controls: [
              {
                id: "intercept-on",
                label: "Turn Intercept On",
                correct: true,
                successFeedback:
                  "Interception is now enabled. The next request will pause at the proxy first."
              },
              {
                id: "stay-bypass",
                label: "Leave Proxy in Bypass",
                correct: false,
                feedback:
                  "That would let the request go straight to the server, which is the opposite of the lesson goal."
              }
            ]
          }
        },
        {
          id: "proxy-captured-request",
          title: "Observe a Captured Request",
          prompt:
            "Interception is now on, and the browser tries to fetch /account. The request is captured before it reaches the server. Why is the response panel still empty?",
          acceptedAnswers: ["The request is paused at the proxy and has not reached the server yet"],
          acceptedActions: [],
          hints: [
            "The browser has built the request, but the server has not answered yet.",
            "The proxy is holding the request before it is forwarded.",
            "The request is paused at the proxy and has not reached the server yet."
          ],
          successCondition:
            "Recognize that there is no server response yet because the request is still paused at the proxy.",
          feedback:
            "Correct. The proxy has captured the request before the server received it, so there is no server response yet.",
          explanation:
            "This is the key interception concept: once a request is paused at the proxy, the response panel stays empty because the server has not seen the request yet.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "A new request is being held at the proxy"
            },
            request: {
              method: "GET",
              path: "/account",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "proxy.lumen.lab" },
                { name: "Cookie", value: "session=lu-2001" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
              ],
              body: ""
            },
            response: null,
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The browser still has its session cookie, but the request is not at the server yet."
            },
            cache: {
              status: "Waiting on proxy",
              note: "No new response can be cached because none has been generated yet."
            },
            proxy: {
              status: "Request captured",
              note: "The proxy is holding GET /account before forwarding it to the server.",
              interceptEnabled: true,
              requestPaused: true
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Focus on where the request is right now: browser, proxy, or server.",
            options: [
              {
                id: "paused",
                label: "The request is paused at the proxy and has not reached the server yet",
                correct: true,
                explanation:
                  "That is why the response panel is empty."
              },
              {
                id: "cache",
                label: "The browser cache removed the response on purpose",
                correct: false,
                explanation:
                  "The issue is not the cache. The server has not answered because the request is still paused."
              },
              {
                id: "missing-cookie",
                label: "The browser forgot the session cookie before sending the request",
                correct: false,
                explanation:
                  "The Cookie header is still present. The proxy pause is the reason no response exists yet."
              }
            ]
          }
        },
        {
          id: "proxy-forward-request",
          title: "Forward the Captured Request",
          prompt:
            "The request is paused at the proxy. Use the controls to forward it to the server so the response can come back.",
          acceptedAnswers: [],
          acceptedActions: ["Forward Request"],
          hints: [
            "You are using a control, not entering text.",
            "The request is already captured; the next action is to let it continue.",
            "Forward Request is the correct action."
          ],
          successCondition:
            "Forward the captured request so the server can answer it.",
          feedback:
            "Correct. Once the request was forwarded, the server generated a response and the browser could display it.",
          explanation:
            "Interception teaches an important sequence: browser builds a request, proxy captures it, and only after you forward it does the server generate a response.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "Request paused and waiting at the proxy"
            },
            request: {
              method: "GET",
              path: "/account",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "proxy.lumen.lab" },
                { name: "Cookie", value: "session=lu-2001" }
              ],
              body: ""
            },
            response: null,
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The request is paused before the server sees it."
            },
            cache: {
              status: "Waiting on proxy",
              note: "No new response exists yet."
            },
            proxy: {
              status: "Request captured",
              note: "Forward the request to let the server answer it.",
              interceptEnabled: true,
              requestPaused: true
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          workspaceAfterSuccess: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "Captured request forwarded to the server"
            },
            request: {
              method: "GET",
              path: "/account",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "proxy.lumen.lab" },
                { name: "Cookie", value: "session=lu-2001" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" },
                { name: "Cache-Control", value: "private, no-store" }
              ],
              body:
                "<html>\n  <h1>Account Overview</h1>\n  <p>Proxy lab account page loaded after forwarding.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The same session reached the server once the proxy forwarded the request."
            },
            cache: {
              status: "private, no-store",
              note: "The server responded after the proxy allowed the request through."
            },
            proxy: {
              status: "Forwarded once",
              note: "The captured request has now reached the server and the response returned.",
              interceptEnabled: true,
              requestPaused: false
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "proxy-control",
            controls: [
              {
                id: "forward",
                label: "Forward Request",
                correct: true,
                successFeedback:
                  "The request was forwarded to the server and a response is now visible."
              },
              {
                id: "drop",
                label: "Drop Request",
                correct: false,
                feedback:
                  "Dropping the request would end the exchange instead of teaching the response path."
              }
            ]
          }
        }
      ]
    },
    {
      id: "request-modification-challenge",
      title: "Request Modification Challenge",
      category: "Safe Request Editing",
      difficulty: "Beginner+",
      learningObjectives: [
        "Inspect a request closely enough to spot client-controlled fields.",
        "Modify safe fictional fields such as a query parameter or custom header in a guided lab context.",
        "Understand that request editing is about observation and reasoning in this learning environment."
      ],
      scenarioIntro:
        "This fictional reporting portal exposes harmless lab-only toggles in the request. You will change a view parameter and then a custom header to see how the server response changes in a controlled training environment.",
      explanation:
        "The important lesson is that some request fields are controlled by the client and can influence what the server returns. In this lab those changes are intentionally safe and limited to training-only display behavior.",
      recommendedNextLesson: "spidering-discoverability",
      interactiveSteps: [
        {
          id: "request-modify-parameter",
          title: "Change a Safe Query Parameter",
          prompt:
            "The portal is loading a compact view. Use the request editor to change the view parameter from compact to full, then replay the request.",
          acceptedAnswers: ["/announcements?view=full"],
          acceptedActions: ["Replay Request"],
          hints: [
            "You only need to change the path value in this step.",
            "The request currently uses view=compact.",
            "Change it to /announcements?view=full, then replay."
          ],
          successCondition:
            "Modify the request path so the safe lab view changes from compact to full.",
          feedback:
            "Correct. The modified request changed the response because the server read the client-controlled view parameter.",
          explanation:
            "This is a low-risk training example of request modification. The change does not bypass security; it simply requests a different fictional training view from the same endpoint.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=compact",
              note: "Compact training view loaded"
            },
            request: {
              method: "GET",
              path: "/announcements?view=compact",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "reports.nova.lab" },
                { name: "Cookie", value: "session=nr-2040" },
                { name: "X-Lab-Mode", value: "summary" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Announcements</h1>\n  <p>Compact view: 2 short items shown.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session is already valid. This lesson is about safe request editing."
            },
            cache: {
              status: "Normal browser view",
              note: "This lesson focuses on request parameters and headers."
            },
            proxy: {
              status: "Replay mode",
              note: "Edit the request in the lab and replay it safely."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          workspaceAfterSuccess: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Full training view loaded"
            },
            request: {
              method: "GET",
              path: "/announcements?view=full",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "reports.nova.lab" },
                { name: "Cookie", value: "session=nr-2040" },
                { name: "X-Lab-Mode", value: "summary" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Announcements</h1>\n  <ul>\n    <li>Maintenance window Thursday</li>\n    <li>Proxy lab opens tomorrow</li>\n    <li>Session workshop notes published</li>\n    <li>Archive review reminder</li>\n  </ul>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The same session is still in use; only the requested view changed."
            },
            cache: {
              status: "Replay complete",
              note: "The response changed because the request path changed."
            },
            proxy: {
              status: "Replay complete",
              note: "The edited request reached the server and the new response returned."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "request-editor",
            buttonLabel: "Replay Request",
            feedbackIncorrect:
              "Update the path so the view parameter reads full, then replay the request.",
            fields: [
              {
                id: "path",
                label: "Request path",
                initialValue: "/announcements?view=compact",
                answers: ["/announcements?view=full"]
              }
            ]
          }
        },
        {
          id: "request-modify-header",
          title: "Adjust a Safe Custom Header",
          prompt:
            "The training portal also respects a fictional display header. Change X-Lab-Mode from summary to detail, then replay the request.",
          acceptedAnswers: ["detail"],
          acceptedActions: ["Replay Request"],
          hints: [
            "This step uses a custom lab-only header.",
            "Only the X-Lab-Mode value needs to change.",
            "Change summary to detail and replay the request."
          ],
          successCondition:
            "Modify the safe lab header value and replay the request.",
          feedback:
            "Correct. The response changed because the server read the updated custom header.",
          explanation:
            "This lab uses a fictional header so learners can safely practice the idea that client-supplied headers can influence server behavior without introducing a real-world abuse pattern.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Full view already loaded, but still using summary lab mode"
            },
            request: {
              method: "GET",
              path: "/announcements?view=full",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "reports.nova.lab" },
                { name: "Cookie", value: "session=nr-2040" },
                { name: "X-Lab-Mode", value: "summary" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Announcements</h1>\n  <p>Summary lab mode active. Expand the mode to reveal analyst notes.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session remains the same across the request replay."
            },
            cache: {
              status: "Replay ready",
              note: "The next response depends on the edited request header."
            },
            proxy: {
              status: "Replay mode",
              note: "Use the editor to adjust the custom lab header."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          workspaceAfterSuccess: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Detailed analyst notes now visible"
            },
            request: {
              method: "GET",
              path: "/announcements?view=full",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "reports.nova.lab" },
                { name: "Cookie", value: "session=nr-2040" },
                { name: "X-Lab-Mode", value: "detail" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Announcements</h1>\n  <p>Detail lab mode active.</p>\n  <pre>Analyst notes: review session workshop checklist and proxy capture exercises.</pre>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session still did not change; only the request header changed."
            },
            cache: {
              status: "Replay complete",
              note: "The updated custom header changed the response content."
            },
            proxy: {
              status: "Replay complete",
              note: "The edited request reached the server and returned a different training response."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "request-editor",
            buttonLabel: "Replay Request",
            feedbackIncorrect:
              "Update the X-Lab-Mode value to detail, then replay the request.",
            fields: [
              {
                id: "x-lab-mode",
                label: "Header: X-Lab-Mode",
                initialValue: "summary",
                answers: ["detail"]
              }
            ]
          }
        },
        {
          id: "request-modification-takeaway",
          title: "Pick the Safe Takeaway",
          prompt:
            "Why is this request modification lesson safe for beginners in this app?",
          acceptedAnswers: ["It uses fictional low-risk lab fields to teach observation and reasoning"],
          acceptedActions: [],
          hints: [
            "The lesson changed training-only fields such as view and X-Lab-Mode.",
            "The goal was understanding client-controlled input, not harming a real service.",
            "It uses fictional low-risk lab fields to teach observation and reasoning."
          ],
          successCondition:
            "Choose the learning-focused explanation for why this request-editing lesson is safe.",
          feedback:
            "Correct. The lab teaches how client-controlled fields affect responses without turning the lesson into a real-world abuse workflow.",
          explanation:
            "The important teaching point is that some request fields are client-controlled. In this fictional lab they only toggle safe training views, which keeps the exercise educational and defensive in tone.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Reviewing the lesson takeaway"
            },
            request: {
              method: "GET",
              path: "/announcements?view=full",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "reports.nova.lab" },
                { name: "Cookie", value: "session=nr-2040" },
                { name: "X-Lab-Mode", value: "detail" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Announcements</h1>\n  <p>Detailed training view active.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The request edits in this lab were display-only training toggles."
            },
            cache: {
              status: "Normal browser behavior",
              note: "The focus is the educational takeaway, not the cache."
            },
            proxy: {
              status: "Replay complete",
              note: "The learner has already seen two safe replay examples."
            },
            discoverability: {
              summary: "No crawl tree is displayed in this lesson.",
              tree: []
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Choose the option that matches a fictional, guided, low-risk learning lab rather than a real-world misuse pattern.",
            options: [
              {
                id: "safe-lab",
                label: "It uses fictional low-risk lab fields to teach observation and reasoning",
                correct: true,
                explanation:
                  "That is the intended framing for this lesson."
              },
              {
                id: "attack-playbook",
                label: "It teaches a real-world attack playbook step by step",
                correct: false,
                explanation:
                  "That is specifically what this lesson avoids."
              },
              {
                id: "server-bypass",
                label: "It proves the server can always be bypassed with any client edit",
                correct: false,
                explanation:
                  "The lesson does not make that claim. It teaches observation using fictional safe fields."
              }
            ]
          }
        }
      ]
    },
    {
      id: "spidering-discoverability",
      title: "Spidering and Discoverability",
      category: "Discoverability & Recon Concepts",
      difficulty: "Beginner+",
      learningObjectives: [
        "See how a simple crawl can discover linked pages and files.",
        "Understand that discoverability is about visibility, structure, and inventory, not just guessing.",
        "Connect crawl results to a defensive mindset around exposed content."
      ],
      scenarioIntro:
        "This stretch lesson uses a fictional documentation site. A simple crawler starts at the home page and follows links to build a site map. The goal is to help learners understand discoverability in a beginner-friendly way.",
      explanation:
        "Spidering or crawling is about following links and mapping what a site exposes. That matters for defenders because old pages, hidden references, and forgotten files all increase the content that must be reviewed and maintained safely.",
      recommendedNextLesson: "http-request-basics",
      interactiveSteps: [
        {
          id: "spider-linked-pages",
          title: "Pick the Directly Discoverable Pages",
          prompt:
            "A crawler starts at the fictional site root and follows visible links on the home page. Select the pages and files it should discover from that first pass.",
          acceptedAnswers: ["/courses", "/support", "/assets/app.js", "/guides/http-basics"],
          acceptedActions: [],
          hints: [
            "Only pick resources linked directly from the home page in this first pass.",
            "One of the discoverable items is a JavaScript file rather than a page.",
            "The direct discoveries are /courses, /support, /assets/app.js, and /guides/http-basics."
          ],
          successCondition:
            "Select the pages and files directly reachable from the site's front page.",
          feedback:
            "Correct. A crawler can only discover what it can reach, and visible links are the simplest starting point.",
          explanation:
            "Spidering is often less mysterious than beginners expect. At the start, it is mostly link-following and inventory building rather than guessing.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/",
              note: "Crawler starting from the site root"
            },
            request: {
              method: "GET",
              path: "/",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "docs.hollowtree.lab" },
                { name: "User-Agent", value: "LabSpider/1.0 (Training Crawl)" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <a href=\"/courses\">Courses</a>\n  <a href=\"/support\">Support</a>\n  <a href=\"/guides/http-basics\">HTTP Basics Guide</a>\n  <script src=\"/assets/app.js\"></script>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example does not require a login."
            },
            cache: {
              status: "Normal page fetch",
              note: "The crawler is simply collecting reachable resources."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active in this discoverability lesson."
            },
            discoverability: {
              summary: "Root page links visible to the crawler",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "courses", label: "/courses", depth: 1, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "guide", label: "/guides/http-basics", depth: 1, type: "page" },
                { id: "appjs", label: "/assets/app.js", depth: 1, type: "file" }
              ]
            }
          },
          interaction: {
            type: "spider-select",
            buttonLabel: "Check Discoveries",
            feedbackIncorrect:
              "Only choose resources directly linked from the root response shown in this step.",
            options: [
              { id: "courses", label: "/courses", depth: 1, correct: true },
              { id: "support", label: "/support", depth: 1, correct: true },
              { id: "guides", label: "/guides/http-basics", depth: 1, correct: true },
              { id: "appjs", label: "/assets/app.js", depth: 1, correct: true },
              { id: "drafts", label: "/drafts/old-notes", depth: 2, correct: false },
              { id: "archive", label: "/archive/2019", depth: 2, correct: false }
            ]
          }
        },
        {
          id: "spider-hidden-linked-content",
          title: "Notice a Quietly Exposed Area",
          prompt:
            "A second pass follows links from /support and reveals two less obvious resources. Select the newly discovered paths.",
          acceptedAnswers: ["/support/archive", "/support/checklists/session-hygiene"],
          acceptedActions: [],
          hints: [
            "The site map now shows two deeper support resources.",
            "They are not on the home page, but they are still linked and therefore discoverable.",
            "The newly discovered paths are /support/archive and /support/checklists/session-hygiene."
          ],
          successCondition:
            "Identify the less obvious but still linked resources discovered by the crawl.",
          feedback:
            "Correct. These pages were not prominent, but they were still discoverable because they were linked somewhere in the site.",
          explanation:
            "A page does not need to be on the front page to be discovered. If it is linked in reachable content, a crawler can usually find it.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/support",
              note: "Crawler following links from the support section"
            },
            request: {
              method: "GET",
              path: "/support",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "docs.hollowtree.lab" },
                { name: "User-Agent", value: "LabSpider/1.0 (Training Crawl)" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <a href=\"/support/archive\">Support Archive</a>\n  <a href=\"/support/checklists/session-hygiene\">Session Hygiene Checklist</a>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example is public training content."
            },
            cache: {
              status: "Normal page fetch",
              note: "The crawler is still building a map of reachable content."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active in this discoverability lesson."
            },
            discoverability: {
              summary: "Support section crawl tree",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "checklist", label: "/support/checklists/session-hygiene", depth: 2, type: "page" }
              ]
            }
          },
          interaction: {
            type: "multi-select",
            buttonLabel: "Check Selection",
            feedbackIncorrect:
              "Choose the two resources newly linked from the /support page shown in this step.",
            options: [
              { id: "archive", label: "/support/archive", correct: true },
              { id: "checklist", label: "/support/checklists/session-hygiene", correct: true },
              { id: "appjs", label: "/assets/app.js", correct: false },
              { id: "courses", label: "/courses", correct: false }
            ]
          }
        },
        {
          id: "spider-defender-takeaway",
          title: "Pick the Defender Takeaway",
          prompt:
            "What is the best beginner-friendly defensive takeaway from this crawl lesson?",
          acceptedAnswers: ["Linked content still needs review because discoverable pages expand what the site exposes"],
          acceptedActions: [],
          hints: [
            "The lesson is about inventory and exposure, not exploitation.",
            "Defenders care because forgotten linked content still becomes part of the visible site surface.",
            "Linked content still needs review because discoverable pages expand what the site exposes."
          ],
          successCondition:
            "Choose the defensive discoverability takeaway that best fits the lesson.",
          feedback:
            "Correct. Discoverable content becomes part of the site's visible surface and should be reviewed like any other exposed content.",
          explanation:
            "For defenders, crawl results are a visibility problem and an inventory problem. Pages, files, and archives that remain linked are still part of what the site exposes to visitors and scanners.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/support/archive",
              note: "Reviewing the crawl lesson outcome"
            },
            request: {
              method: "GET",
              path: "/support/archive",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "docs.hollowtree.lab" },
                { name: "User-Agent", value: "LabSpider/1.0 (Training Crawl)" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body:
                "<html>\n  <h1>Support Archive</h1>\n  <p>Older articles remain linked and reachable.</p>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "No login is involved in this crawl example."
            },
            cache: {
              status: "Normal page fetch",
              note: "Caching is not the main teaching point here."
            },
            proxy: {
              status: "Observation only",
              note: "This lesson focuses on visibility and discoverability."
            },
            discoverability: {
              summary: "Expanded crawl tree",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "courses", label: "/courses", depth: 1, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "guide", label: "/guides/http-basics", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "checklist", label: "/support/checklists/session-hygiene", depth: 2, type: "page" }
              ]
            }
          },
          interaction: {
            type: "single-choice",
            buttonLabel: "Submit Choice",
            feedbackIncorrect:
              "Choose the answer that focuses on defensive visibility and content review rather than a misuse workflow.",
            options: [
              {
                id: "defender",
                label: "Linked content still needs review because discoverable pages expand what the site exposes",
                correct: true,
                explanation:
                  "That is the defensive lesson from the crawl."
              },
              {
                id: "guessing-only",
                label: "Spidering is only useful for guessing admin passwords",
                correct: false,
                explanation:
                  "That is not the focus of this beginner-friendly, defensive lesson."
              },
              {
                id: "ignore-archive",
                label: "Archived pages do not matter if they are not on the front page",
                correct: false,
                explanation:
                  "The crawl showed why linked deeper content can still be discovered and should still be reviewed."
              }
            ]
          }
        }
      ]
    }
  ];

  window.WebHttpLabData = {
    lessons
  };
})();
