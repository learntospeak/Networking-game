(function () {
  const lessons = [
    {
      id: "http-request-basics",
      title: "HTTP Request Basics",
      category: "HTTP Fundamentals",
      difficulty: "Beginner",
      learningObjectives: [
        "See a browser ask for a page.",
        "Read one request part at a time.",
        "Read the server result."
      ],
      scenarioIntro:
        "One request. One part at a time.",
      explanation:
        "Watch the visual. Tap the right part.",
      recommendedNextLesson: "inspecting-headers-responses",
      interactiveSteps: [
        {
          id: "http-basics-flow",
          title: "Browser to Server",
          prompt: "Watch the flow.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Start with the browser."],
          successCondition: "See the basic browser to server path.",
          feedback: "Good. The browser starts the request.",
          explanation: "Your browser asks a server for a page.",
          workspace: {
            browser: {
              title: "Example Profile",
              url: "https://example.com/profile",
              note: "Starting point"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "example.com" },
                { name: "Cookie", value: "session=abc123" }
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
            cookies: [
              { name: "session", value: "abc123", scope: "example.com", purpose: "Saved session" }
            ],
            session: {
              state: "Signed in",
              id: "abc123",
              note: "The session already exists."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The path is clear."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "flow",
            labels: ["Browser", "Request", "Server", "Response"],
            stageIndex: 0,
            defaultExplainKey: "flow"
          },
          focusExplain: {
            "flow": "Your browser asks a server for a page."
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
          successCondition: "Tap GET in the request line.",
          feedback: "Nice - GET asks for data.",
          explanation: "GET = ask for data.",
          workspace: {
            browser: {
              title: "Example Profile",
              url: "https://example.com/profile",
              note: "Request built"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "example.com" },
                { name: "Cookie", value: "session=abc123" }
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
            cookies: [
              { name: "session", value: "abc123", scope: "example.com", purpose: "Saved session" }
            ],
            session: {
              state: "Signed in",
              id: "abc123",
              note: "Saved session."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The path is clear."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            lineParts: ["method", "path"],
            headerParts: [],
            defaultExplainKey: "get"
          },
          focusExplain: {
            "get": "GET = ask for data."
          },
          focusWrong: {
            "path": "Close - /profile is the page name."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "get"
          }
        },
        {
          id: "http-basics-path",
          title: "/profile",
          prompt: "Tap /profile.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap /profile."],
          successCondition: "Tap the page path in the request line.",
          feedback: "Nice - /profile is the page.",
          explanation: "This is the page you want.",
          workspace: {
            browser: {
              title: "Example Profile",
              url: "https://example.com/profile",
              note: "Packet ready"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "example.com" },
                { name: "Cookie", value: "session=abc123" }
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
            cookies: [
              { name: "session", value: "abc123", scope: "example.com", purpose: "Saved session" }
            ],
            session: {
              state: "Signed in",
              id: "abc123",
              note: "Saved session."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The path is clear."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            lineParts: ["method", "path"],
            headerParts: [],
            defaultExplainKey: "path"
          },
          focusExplain: {
            "path": "This is the page you want."
          },
          focusWrong: {
            "get": "Close - GET is the action word."
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
          successCondition: "Tap the Host header.",
          feedback: "Nice - Host points to the site.",
          explanation: "Host = which website.",
          workspace: {
            browser: {
              title: "Example Profile",
              url: "https://example.com/profile",
              note: "Packet in transit"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "example.com" },
                { name: "Cookie", value: "session=abc123" }
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
            cookies: [
              { name: "session", value: "abc123", scope: "example.com", purpose: "Saved session" }
            ],
            session: {
              state: "Signed in",
              id: "abc123",
              note: "Saved session."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The path is clear."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            lineParts: ["method", "path"],
            headerParts: ["host"],
            defaultExplainKey: "host"
          },
          focusExplain: {
            "host": "Host = which website."
          },
          focusWrong: {
            "get": "Close - GET is the action word.",
            "path": "Close - /profile is the page name."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "host"
          }
        },
        {
          id: "http-basics-response",
          title: "200 OK",
          prompt: "Tap 200 OK.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap 200 OK."],
          successCondition: "Tap the response status.",
          feedback: "Nice - 200 means it worked.",
          explanation: "200 = it worked.",
          workspace: {
            browser: {
              title: "Example Profile",
              url: "https://example.com/profile",
              note: "Server answered"
            },
            request: {
              method: "GET",
              path: "/profile",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "example.com" },
                { name: "Cookie", value: "session=abc123" }
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
            cookies: [
              { name: "session", value: "abc123", scope: "example.com", purpose: "Saved session" }
            ],
            session: {
              state: "Signed in",
              id: "abc123",
              note: "Saved session."
            },
            cache: {
              status: "Not shown",
              note: "Cache is not the focus here."
            },
            proxy: {
              status: "Pass-through",
              note: "The path is clear."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "response",
            lineParts: ["status"],
            headerParts: [],
            defaultExplainKey: "response-code"
          },
          focusExplain: {
            "response-code": "200 = it worked."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "response-code"
          }
        }
      ]
    },
    {
      id: "inspecting-headers-responses",
      title: "HTTP Headers",
      category: "Headers & Metadata",
      difficulty: "Beginner",
      learningObjectives: [
        "See what the main headers tell you.",
        "Read Host, Cookie, User-Agent, Content-Type, Set-Cookie, and Cache-Control one at a time.",
        "Tap one header, then move to the next step."
      ],
      scenarioIntro:
        "Small headers. One meaning at a time.",
      explanation:
        "Look at one header. Read one short meaning.",
      recommendedNextLesson: "cookies-session-basics",
      interactiveSteps: [
        {
          id: "headers-host",
          title: "Host",
          prompt: "Tap Host.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Host."],
          successCondition: "Tap the website name.",
          feedback: "Good. Host means which website.",
          explanation: "Host = which website.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          id: "headers-cookie",
          title: "Cookie",
          prompt: "Tap Cookie.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Cookie."],
          successCondition: "Tap the saved state header.",
          feedback: "Good. Cookie means saved login info.",
          explanation: "Cookie = saved login info.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "cookie",
            lineParts: [],
            headerParts: ["cookie"],
            interactiveParts: ["cookie"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "cookie"
          }
        },
        {
          id: "headers-user-agent",
          title: "User-Agent",
          prompt: "Tap User-Agent.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap User-Agent."],
          successCondition: "Tap the browser identity header.",
          feedback: "Right. User-Agent means which browser.",
          explanation: "User-Agent = which browser.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "user-agent",
            lineParts: [],
            headerParts: ["user-agent"],
            interactiveParts: ["user-agent"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "user-agent"
          }
        },
        {
          id: "headers-content-type",
          title: "Content-Type",
          prompt: "Tap Content-Type.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Content-Type."],
          successCondition: "Tap the body type header.",
          feedback: "Good. Content-Type means what kind of content.",
          explanation: "Content-Type = what kind of content.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          focusVisual: {
            type: "response",
            mode: "get",
            defaultExplainKey: "content-type",
            lineParts: [],
            headerParts: ["content-type"],
            interactiveParts: ["content-type"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "content-type"
          }
        },
        {
          id: "headers-set-cookie",
          title: "Set-Cookie",
          prompt: "Tap Set-Cookie.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Set-Cookie."],
          successCondition: "Tap the new cookie header.",
          feedback: "Right. Set-Cookie tells the browser to save one.",
          explanation: "Set-Cookie = save a new cookie.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          focusVisual: {
            type: "response",
            mode: "get",
            defaultExplainKey: "set-cookie",
            lineParts: [],
            headerParts: ["set-cookie"],
            interactiveParts: ["set-cookie"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "set-cookie"
          }
        },
        {
          id: "headers-cache-control",
          title: "Cache-Control",
          prompt: "Tap Cache-Control.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Cache-Control."],
          successCondition: "Tap the cache rule header.",
          feedback: "Good. Cache-Control means reuse rules.",
          explanation: "Cache-Control = reuse rules.",
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
                { name: "Cookie", value: "theme=forest; session=sp-41ac2" },
                { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
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
          focusVisual: {
            type: "response",
            mode: "get",
            defaultExplainKey: "cache-control",
            lineParts: [],
            headerParts: ["cache-control"],
            interactiveParts: ["cache-control"]
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "cache-control"
          }
        }
      ]
    },
    {
      id: "cookies-session-basics",
      title: "Cookies and Sessions",
      category: "Cookies & State",
      difficulty: "Beginner",
      learningObjectives: [
        "See one cookie come in and go back out.",
        "Learn what a session cookie looks like.",
        "Tell a session cookie from a preference cookie."
      ],
      scenarioIntro:
        "One cookie arrives. One cookie goes back.",
      explanation:
        "Watch the cookie loop first.",
      recommendedNextLesson: "session-handling-risk",
      interactiveSteps: [
        {
          id: "cookie-set-cookie",
          title: "Set-Cookie",
          prompt: "Tap Set-Cookie.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Set-Cookie."],
          successCondition: "Tap the cookie instruction.",
          feedback: "Good. The server says save this cookie.",
          explanation: "Set-Cookie = save this cookie.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/welcome",
              note: "First page load"
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
          focusVisual: {
            type: "response",
            mode: "get",
            defaultExplainKey: "set-cookie",
            lineParts: [],
            headerParts: ["set-cookie"],
            interactiveParts: ["set-cookie"]
          },
          focusExplain: {
            "set-cookie": "Set-Cookie = save this cookie."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "set-cookie"
          }
        },
        {
          id: "cookie-send-back",
          title: "Cookie",
          prompt: "Tap Cookie.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Cookie."],
          successCondition: "Tap the cookie header.",
          feedback: "Good. The browser sends it back.",
          explanation: "Cookie = browser sends it back.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/dashboard",
              note: "Next request"
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
          focusVisual: {
            type: "request",
            mode: "get",
            defaultExplainKey: "cookie",
            lineParts: [],
            headerParts: ["cookie"],
            interactiveParts: ["cookie"]
          },
          focusExplain: {
            "cookie": "Cookie = browser sends it back."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "cookie"
          }
        },
        {
          id: "cookie-session-id",
          title: "PHPSESSID",
          prompt: "Tap PHPSESSID.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap PHPSESSID."],
          successCondition: "Tap the session cookie.",
          feedback: "Right. This one is the session id.",
          explanation: "PHPSESSID = session id.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/dashboard",
              note: "Stored cookies"
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
          focusVisual: {
            type: "terms",
            items: [
              { label: "PHPSESSID=pl-8841aa", key: "session-cookie", variant: "term" }
            ],
            interactiveParts: ["session-cookie"],
            defaultExplainKey: "session-cookie"
          },
          focusExplain: {
            "session-cookie": "PHPSESSID = session id."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "session-cookie"
          }
        },
        {
          id: "cookie-preference",
          title: "theme",
          prompt: "Tap theme.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap theme."],
          successCondition: "Tap the preference cookie.",
          feedback: "Good. This one is just a setting.",
          explanation: "theme = saved setting.",
          workspace: {
            browser: {
              title: "Fable Member Portal",
              url: "https://portal.fable.lab/dashboard",
              note: "Stored cookies"
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
              note: "The server uses the session id, not the theme value."
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
          focusVisual: {
            type: "terms",
            items: [
              { label: "theme=violet", key: "preference-cookie", variant: "term" }
            ],
            interactiveParts: ["preference-cookie"],
            defaultExplainKey: "preference-cookie"
          },
          focusExplain: {
            "preference-cookie": "theme = saved setting."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "preference-cookie"
          }
        }
      ]
    },

    {
      id: "session-handling-risk",
      title: "Session Rotation",
      category: "Session Security",
      difficulty: "Beginner",
      learningObjectives: [
        "See the token before login and after login.",
        "Notice what an old token does later.",
        "Keep one safe rule: rotate and expire."
      ],
      scenarioIntro:
        "One token before login. One new token after login.",
      explanation:
        "Watch the token change.",
      recommendedNextLesson: "proxy-interception-fundamentals",
      interactiveSteps: [
        {
          id: "session-guest-token",
          title: "Guest Token",
          prompt: "Tap the guest token.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap the guest token."],
          successCondition: "Tap the old token.",
          feedback: "Good. This is the token before login.",
          explanation: "Guest token = before login.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/login",
              note: "Before login"
            },
            request: {
              method: "GET",
              path: "/login",
              version: "HTTP/1.1",
              headers: [
                { name: "Host", value: "ops.beacon.lab" },
                { name: "Cookie", value: "session=guest-31aa" }
              ],
              body: ""
            },
            response: {
              statusCode: 200,
              statusText: "OK",
              headers: [
                { name: "Content-Type", value: "text/html; charset=utf-8" }
              ],
              body: "<html>\n  <h1>Login</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "guest-31aa", scope: "ops.beacon.lab", purpose: "Guest session" }
            ],
            session: {
              state: "Guest",
              id: "guest-31aa",
              note: "The browser starts with a guest session."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the old token."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "session=guest-31aa", key: "guest-token", variant: "term" }
            ],
            interactiveParts: ["guest-token"],
            defaultExplainKey: "guest-token"
          },
          focusExplain: {
            "guest-token": "Guest token = before login."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "guest-token"
          }
        },
        {
          id: "session-auth-token",
          title: "New Token",
          prompt: "Tap the new token.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap the new token."],
          successCondition: "Tap the new token after login.",
          feedback: "Right. Login gets a new token.",
          explanation: "New token = signed-in session.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/login",
              note: "Login finished"
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
              state: "Signed in",
              id: "auth-93c7d1",
              note: "The server issued a new session token."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the new token."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "session=auth-93c7d1", key: "auth-token", variant: "term" }
            ],
            interactiveParts: ["auth-token"],
            defaultExplainKey: "auth-token"
          },
          focusExplain: {
            "auth-token": "New token = signed-in session."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "auth-token"
          }
        },
        {
          id: "session-old-token-fails",
          title: "302 Found",
          prompt: "Tap 302 Found.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap 302 Found."],
          successCondition: "Tap the redirect code.",
          feedback: "Yes. The old token goes back to login.",
          explanation: "302 = back to login.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/dashboard",
              note: "Old token used again"
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
              state: "Guest",
              id: "guest-31aa",
              note: "The server treats the old token as guest state."
            },
            cache: {
              status: "Not the focus",
              note: "This step is about the old token result."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
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
          focusExplain: {
            "response-code": "302 = back to login."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "response-code"
          }
        },
        {
          id: "session-safe-rule",
          title: "Safe Rule",
          prompt: "Tap the safe rule.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap the safe rule."],
          successCondition: "Tap the safe rule.",
          feedback: "Good. Make a new token and end the old one.",
          explanation: "Safe rule: rotate and expire.",
          workspace: {
            browser: {
              title: "Beacon Ops Dashboard",
              url: "https://ops.beacon.lab/dashboard",
              note: "Safe session rule"
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
              body: "<html>\n  <h1>Dashboard</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "auth-93c7d1", scope: "ops.beacon.lab", purpose: "Authenticated session" }
            ],
            session: {
              state: "Signed in",
              id: "auth-93c7d1",
              note: "The new token stays valid. The old one should not."
            },
            cache: {
              status: "Not the focus",
              note: "This step keeps one simple rule."
            },
            proxy: {
              status: "Pass-through",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "Rotate + expire old token", key: "rotate-expire", variant: "term" }
            ],
            interactiveParts: ["rotate-expire"],
            defaultExplainKey: "rotate-expire"
          },
          focusExplain: {
            "rotate-expire": "Safe rule: rotate and expire."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "rotate-expire"
          }
        }
      ]
    },
    {
      id: "proxy-interception-fundamentals",
      title: "Proxy Flow",
      category: "Proxy & Interception",
      difficulty: "Beginner",
      learningObjectives: [
        "See where the proxy sits.",
        "Watch one request pause there.",
        "Forward it and get one response."
      ],
      scenarioIntro:
        "The proxy sits in the middle.",
      explanation:
        "Turn it on. Pause one request. Forward it.",
      recommendedNextLesson: "request-modification-challenge",
      interactiveSteps: [
        {
          id: "proxy-flow",
          title: "Proxy",
          prompt: "Watch the flow.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Follow the middle box."],
          successCondition: "See where the proxy sits.",
          feedback: "Good. The proxy sits between both sides.",
          explanation: "A proxy sits between browser and server.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/profile",
              note: "Simple proxy path"
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
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The lesson starts with a simple page load."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the path."
            },
            proxy: {
              status: "Between both sides",
              note: "The proxy is the middle step.",
              interceptEnabled: false,
              requestPaused: false
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "flow",
            stageIndex: 1,
            labels: ["Browser", "Proxy", "Server", "Response"],
            mode: "get"
          },
          interaction: {
            type: "focus-continue",
            buttonLabel: "Next"
          }
        },
        {
          id: "proxy-intercept-on",
          title: "Intercept ON",
          prompt: "Pick the setting that stops the next request.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Pick the setting that stops the next request."],
          successCondition: "Pick the setting that pauses the next request.",
          feedback: "Nice - the next request will stop here.",
          explanation: "ON = next request stops here.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/profile",
              note: "Ready to pause the next request"
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
              body: "<html>\n  <h1>Profile</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The user is ready to send one request."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the intercept switch."
            },
            proxy: {
              status: "Intercept on",
              note: "The next request will pause at the proxy.",
              interceptEnabled: true,
              requestPaused: false
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "compare",
            defaultExplainKey: "intercept-off",
            options: [
              {
                label: "The browser decides it needs the /profile page",
                correct: true,
                why: "Opening the URL starts a request for a specific page."
              },
              {
                label: "The server sends 200 OK before any request exists",
                correct: false,
                why: "The server only answers after it receives a request."
              },
              {
                label: "The browser waits for the page to appear without making a request",
                correct: false,
                why: "The browser has to start a real web request before any page can load."
              }
            ],
            explanation: "Opening the website starts a page request for /profile.",
            visualAction: {
              mode: "warning",
              trafficLabel: "Browser starts a plain HTTP page request",
              flowIndicator: { label: "Open URL", tone: "warning" }
            }
          },
          {
            prompt: "What request does the browser create for that page?",
            options: [
              {
                label: "GET /profile",
                correct: true,
                why: "GET asks the server to send back the page or resource."
              },
              {
                label: "200 OK",
                correct: false,
                why: "200 OK is a response from the server, not the browser request."
              },
              {
                label: "POST /profile",
                correct: false,
                why: "POST is for sending data to the server. This step is asking for a page."
              }
            ],
            explanation: "The browser builds an HTTP GET request for /profile.",
            visualAction: {
              mode: "warning",
              trafficLabel: "Browser creates GET /profile",
              flowIndicator: { label: "Build GET", tone: "warning" },
              requestLabel: "GET /profile"
            }
          },
          {
            prompt: "After the request is built, what should happen next?",
            options: [
              {
                label: "Send GET /profile across the network to the web server",
                correct: true,
                why: "Once the request exists, it has to travel to the server that can answer it."
              },
              {
                label: "Render the page before the server answers",
                correct: false,
                why: "The browser needs the server response before it can load the page."
              },
              {
                label: "Wait for the server response before sending the request",
                correct: false,
                why: "The request has to travel first before the server can respond."
              }
            ],
            explanation: "The HTTP request now travels across the network path toward the server.",
            visualAction: {
              mode: "warning",
              trafficLabel: "GET /profile travels to the web server",
              flowIndicator: { label: "HTTP Request", tone: "warning" },
              requestLabel: "GET /profile"
            }
          },
          {
            prompt: "The server receives GET /profile. What should it do next?",
            options: [
              {
                label: "Process the request and prepare the page response",
                correct: true,
                why: "The server now has the page request and can build the answer."
              },
              {
                label: "Ask the browser which MAC address it should use",
                correct: false,
                why: "That is not part of the HTTP request flow being taught here."
              },
              {
                label: "Return 404 immediately without checking the page",
                correct: false,
                why: "If the page exists, the correct successful response is not 404."
              }
            ],
            explanation: "The web server handles GET /profile and prepares the page response.",
            visualAction: {
              mode: "warning",
              trafficLabel: "Web server processes GET /profile",
              flowIndicator: { label: "Server Handles GET", tone: "warning" },
              requestLabel: "GET /profile"
            }
          },
          {
            prompt: "What does the server send back if the page exists?",
            options: [
              {
                label: "HTTP/1.1 200 OK",
                correct: true,
                why: "200 OK is the normal success response for a page request that worked."
              },
              {
                label: "GET /profile",
                correct: false,
                why: "That is still the client request, not the server response."
              },
              {
                label: "Who has 192.168.1.20?",
                correct: false,
                why: "That is not an HTTP page response. This step needs the server success reply."
              }
            ],
            explanation: "The server returns 200 OK with the page content.",
            visualAction: {
              mode: "reply",
              trafficLabel: "200 OK returns from the server to the browser",
              flowIndicator: { label: "200 OK", tone: "reply" },
              responseLabel: "200 OK"
            }
          },
          {
            prompt: "Once the browser receives 200 OK, what is the last step?",
            options: [
              {
                label: "Render the /profile page for the user",
                correct: true,
                why: "The browser now has the response and can load the page."
              },
              {
                label: "Send the same GET request forever",
                correct: false,
                why: "The request has already succeeded. The next step is to show the result."
              },
              {
                label: "Discard the page because the path already finished",
                correct: false,
                why: "The whole point of the flow is to get the page back to the browser."
              }
            ],
            explanation: "The browser uses the response body to load the /profile page.",
            visualAction: {
              mode: "reply",
              trafficLabel: "Browser loads the returned page",
              flowIndicator: { label: "Render Page", tone: "reply" },
              pageLabel: "Profile Loaded"
            }
          }
        ]
      },
      {
        id: "https-page",
        name: "HTTPS Page Request",
        label: "HTTPS Flow",
        note: "Locked page request",
        subtitle: "Ask the server for /profile securely with HTTPS.",
        summary:
          "HTTPS follows the same request pattern as HTTP, but the request and response travel inside encrypted traffic. The browser still asks for /profile and still gets 200 OK back.",
        devices: {
          pc: { label: "Browser", meta: "User opens https://learn.lab/profile", icon: "fa-desktop" },
          switch: { label: "Switch", meta: "Local forwarding path", icon: "fa-network-wired" },
          router: { label: "Router", meta: "Path to the web server", icon: "fa-route" },
          server: { label: "Web Server", meta: "Returns the profile page securely", icon: "fa-server" }
        },
        steps: [
          {
            prompt: "A user opens https://learn.lab/profile. What happens first?",
            options: [
              {
                label: "The browser decides it needs the /profile page securely",
                correct: true,
                why: "HTTPS still starts with the browser wanting a specific page."
              },
              {
                label: "The page appears before any request is made",
                correct: false,
                why: "The browser still has to send a request first."
              },
              {
                label: "The browser skips the server and loads the page locally",
                correct: false,
                why: "The page still has to come from the web server."
              }
            ],
            explanation: "Opening the secure URL starts the same page request, but this time it will travel securely.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Browser starts a secure page request",
              flowIndicator: { label: "Open Secure URL", tone: "secure" }
            }
          },
          {
            prompt: "What request is the browser trying to send to the server?",
            options: [
              {
                label: "GET /profile",
                correct: true,
                why: "HTTPS still asks for the page with GET /profile."
              },
              {
                label: "200 OK",
                correct: false,
                why: "That is the server success response, not the browser request."
              },
              {
                label: "DELETE /profile",
                correct: false,
                why: "This flow is asking for a page, not deleting one."
              }
            ],
            explanation: "HTTPS is still asking for the same page. The difference is how the request looks on the path.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Browser prepares the secure GET /profile request",
              flowIndicator: { label: "Build Secure GET", tone: "secure" },
              requestLabel: "GET /profile"
            }
          },
          {
            prompt: "How should that request look while it crosses the network?",
            options: [
              {
                label: "Locked or encrypted instead of readable",
                correct: true,
                why: "HTTPS hides the request contents while it travels."
              },
              {
                label: "Readable as plain GET /profile",
                correct: false,
                why: "That describes HTTP, not HTTPS."
              },
              {
                label: "Broadcast to every device on the LAN",
                correct: false,
                why: "This is a directed web request, not a broadcast teaching step."
              }
            ],
            explanation: "The secure request follows the same path, but the packet stays locked while it travels.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Encrypted request travels to the web server",
              flowIndicator: { label: "Encrypted Request", tone: "secure" },
              requestLabel: "LOCKED GET"
            }
          },
          {
            prompt: "The secure request reaches the server. What should the server do next?",
            options: [
              {
                label: "Process the request and prepare the secure page response",
                correct: true,
                why: "The server still handles the page request and prepares the answer."
              },
              {
                label: "Switch the traffic back to plain HTTP first",
                correct: false,
                why: "That would remove the secure difference the lesson is teaching."
              },
              {
                label: "Ignore the request because it is encrypted",
                correct: false,
                why: "The secure server is expected to handle encrypted web requests."
              }
            ],
            explanation: "The server receives the secure request and prepares the page response.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Web server processes the secure page request",
              flowIndicator: { label: "Server Handles HTTPS", tone: "secure" },
              requestLabel: "LOCKED GET"
            }
          },
          {
            prompt: "What comes back when the request succeeds?",
            options: [
              {
                label: "HTTP/1.1 200 OK",
                correct: true,
                why: "The successful page response is still 200 OK."
              },
              {
                label: "GET /profile",
                correct: false,
                why: "That is the request, not the response."
              },
              {
                label: "A second GET /profile request",
                correct: false,
                why: "That would repeat the request instead of returning the page response."
              }
            ],
            explanation: "The server returns 200 OK securely back across the path.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Secure 200 OK returns to the browser",
              flowIndicator: { label: "Secure 200 OK", tone: "secure" },
              responseLabel: "LOCKED 200"
            }
          },
          {
            prompt: "What is the last step after the browser receives the secure response?",
            options: [
              {
                label: "Render the /profile page for the user",
                correct: true,
                why: "HTTPS still ends with the browser loading the page."
              },
              {
                label: "Turn the response into another GET request",
                correct: false,
                why: "The browser already has the answer it needs."
              },
              {
                label: "Drop the page because it was encrypted",
                correct: false,
                why: "Encryption protects the traffic. It does not stop the browser from loading the page."
              }
            ],
            explanation: "The browser loads the page just like HTTP. The difference was the locked traffic on the path.",
            visualAction: {
              mode: "secure",
              trafficLabel: "Browser loads the secure page response",
              flowIndicator: { label: "Render Secure Page", tone: "secure" },
              pageLabel: "Secure Profile"
            }
          }
        ]
      },
      {
        id: "http-https-compare",
        name: "HTTP vs HTTPS Compare",
        label: "Compare",
        note: "Visible or locked",
        subtitle: "Compare the same page request in HTTP and HTTPS.",
        summary:
          "The core request stays the same in both cases: ask for the page, let it travel, get 200 OK back, and load the result. HTTPS changes how much of that traffic stays visible on the path.",
        devices: {
          pc: { label: "Browser", meta: "Asks for /profile", icon: "fa-desktop" },
          switch: { label: "Switch", meta: "Carries the packet onward", icon: "fa-network-wired" },
          router: { label: "Router", meta: "Continues the path", icon: "fa-route" },
          server: { label: "Web Server", meta: "Answers the same page request", icon: "fa-server" }
        },
        steps: [
          {
            prompt: "Which version leaves GET /profile readable while it travels?",
            options: [
              {
                label: "HTTP",
                correct: true,
                why: "Plain HTTP leaves the request readable on the path."
              },
              {
                label: "HTTPS",
                correct: false,
                why: "HTTPS hides the request inside encrypted traffic."
              },
              {
                label: "Neither of them sends a request",
                correct: false,
                why: "Both still send a real page request to the server."
              }
            ],
            explanation: "HTTP sends the page request in readable form across the path.",
            visualAction: {
              mode: "warning",
              trafficLabel: "HTTP leaves GET /profile visible on the path",
              flowIndicator: { label: "HTTP Visible", tone: "warning" },
              requestLabel: "GET /profile"
            }
          },
          {
            prompt: "Which version keeps the same page request locked while it travels?",
            options: [
              {
                label: "HTTPS",
                correct: true,
                why: "HTTPS wraps the same request inside encrypted traffic."
              },
              {
                label: "HTTP",
                correct: false,
                why: "HTTP is the readable version."
              },
              {
                label: "Neither, because both are readable",
                correct: false,
                why: "Only HTTPS keeps the request locked while it travels."
              }
            ],
            explanation: "HTTPS keeps the page request locked while it crosses the network.",
            visualAction: {
              mode: "secure",
              trafficLabel: "HTTPS keeps the request locked on the path",
              flowIndicator: { label: "HTTPS Locked", tone: "secure" },
              requestLabel: "LOCKED GET"
            }
          },
          {
            prompt: "What stays the same in both flows even though the packet looks different on the path?",
            options: [
              {
                label: "The browser is still asking the server to send back the page",
                correct: true,
                why: "HTTP and HTTPS are both page requests. HTTPS just protects the traffic while it travels."
              },
              {
                label: "Only HTTPS uses a browser and a server",
                correct: false,
                why: "Both flows still use the same browser to server request pattern."
              },
              {
                label: "Only HTTP gets a 200 OK response",
                correct: false,
                why: "HTTPS also gets a 200 OK response when the request succeeds."
              }
            ],
            explanation: "Both flows are still asking for the same page. HTTPS changes how the request is displayed on the path, not the fact that it is a page request.",
            visualAction: {
              mode: "reply",
              trafficLabel: "Both flows still end with the page response returning to the browser",
              flowIndicator: { label: "Same Goal", tone: "reply" },
              responseLabel: "200 OK"
            }
          }
        ]
      }
    ],
    useCases: [
      {
        prompt: "A browser wants the /profile page from a web server. What request should it create?",
        options: ["GET /profile", "200 OK", "POST /profile"],
        answer: "GET /profile",
        why: "GET is the browser asking the server to send back the page."
      },
      {
        prompt: "The server found the page and handled the request successfully. What should come back?",
        options: ["HTTP/1.1 200 OK", "GET /profile", "HTTP/1.1 404 Not Found"],
        answer: "HTTP/1.1 200 OK",
        why: "200 OK is the normal success response after the server handles the page request."
      },
      {
        prompt: "Which version hides the request while it crosses the network?",
        options: ["HTTPS", "HTTP", "Locked Browser Tab"],
        answer: "HTTPS",
        why: "HTTPS protects the request while it travels."
      },
      {
        prompt: "The browser already received the page response. What should happen next?",
        options: ["Render the page", "Repeat GET /profile", "Drop the response"],
        answer: "Render the page",
        why: "Once the response arrives, the browser loads the page for the user."
      }
    ]
  };
})();
