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
          prompt: "Tap Intercept ON.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Intercept ON."],
          successCondition: "Tap the intercept switch.",
          feedback: "Good. The next request will stop there.",
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
            type: "terms",
            items: [
              { label: "Intercept ON", key: "intercept-on", variant: "term" }
            ],
            interactiveParts: ["intercept-on"],
            defaultExplainKey: "intercept-on"
          },
          focusExplain: {
            "intercept-on": "ON = next request stops here."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "intercept-on"
          }
        },
        {
          id: "proxy-request-paused",
          title: "Paused",
          prompt: "Tap Request paused.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Request paused."],
          successCondition: "Tap the paused state.",
          feedback: "Right. The server has not seen it yet.",
          explanation: "Paused = server has not seen it.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "Request stopped at the proxy"
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
              note: "The session is ready, but the request is paused."
            },
            cache: {
              status: "Waiting",
              note: "No response yet."
            },
            proxy: {
              status: "Request captured",
              note: "The request is still waiting at the proxy.",
              interceptEnabled: true,
              requestPaused: true
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "Request paused", key: "request-paused", variant: "term" }
            ],
            interactiveParts: ["request-paused"],
            defaultExplainKey: "request-paused"
          },
          focusExplain: {
            "request-paused": "Paused = server has not seen it."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "request-paused"
          }
        },
        {
          id: "proxy-forward",
          title: "Forward",
          prompt: "Tap Forward.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Forward."],
          successCondition: "Tap the forward control.",
          feedback: "Good. Now the request can continue.",
          explanation: "Forward = let it go to server.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "Paused request"
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
              note: "One request is waiting at the proxy."
            },
            cache: {
              status: "Waiting",
              note: "No response yet."
            },
            proxy: {
              status: "Ready to forward",
              note: "Forward sends the paused request on.",
              interceptEnabled: true,
              requestPaused: true
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "Forward", key: "forward", variant: "term" }
            ],
            interactiveParts: ["forward"],
            defaultExplainKey: "forward"
          },
          focusExplain: {
            "forward": "Forward = let it go to server."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "forward"
          }
        },
        {
          id: "proxy-response",
          title: "200 OK",
          prompt: "Tap 200 OK.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap 200 OK."],
          successCondition: "Tap the response code.",
          feedback: "Good. The server answered after forward.",
          explanation: "After forward, the server can answer.",
          workspace: {
            browser: {
              title: "Lumen Proxy Playground",
              url: "https://proxy.lumen.lab/account",
              note: "Response returned"
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
              body: "<html>\n  <h1>Account</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "lu-2001", scope: "proxy.lumen.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "lu-2001",
              note: "The request finally reached the server."
            },
            cache: {
              status: "private, no-store",
              note: "A response now exists."
            },
            proxy: {
              status: "Forwarded",
              note: "The paused request moved on to the server.",
              interceptEnabled: true,
              requestPaused: false
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
            "response-code": "After forward, the server can answer."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "response-code"
          }
        }
      ]
    },    {
      id: "request-modification-challenge",
      title: "Safe Request Changes",
      category: "Safe Request Editing",
      difficulty: "Beginner",
      learningObjectives: [
        "See one safe view change in the path.",
        "See one safe lab header change.",
        "Keep the rule: safe lab fields only."
      ],
      scenarioIntro:
        "Two safe lab changes. Nothing else.",
      explanation:
        "Change a view. Change a lab header.",
      recommendedNextLesson: "spidering-discoverability",
      interactiveSteps: [
        {
          id: "request-path",
          title: "Path",
          prompt: "Tap the path.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap the path."],
          successCondition: "Tap the path.",
          feedback: "Good. The path carries the view choice.",
          explanation: "The path can carry the view choice.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=compact",
              note: "Compact view"
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
              body: "<html>\n  <h1>Announcements</h1>\n  <p>Compact view.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session stays the same in this lesson."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the path."
            },
            proxy: {
              status: "Lab replay",
              note: "The app is showing one safe request change."
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
            lineParts: ["path"],
            headerParts: [],
            interactiveParts: ["path"]
          },
          focusExplain: {
            "path": "The path can carry the view choice."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "path"
          }
        },
        {
          id: "request-view-full",
          title: "view=full",
          prompt: "Tap view=full.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap view=full."],
          successCondition: "Tap the full view choice.",
          feedback: "Right. full means a bigger view.",
          explanation: "full = bigger view.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Full view"
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
              body: "<html>\n  <h1>Announcements</h1>\n  <p>Full view.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The same session stays in place."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the view change."
            },
            proxy: {
              status: "Lab replay",
              note: "The app is showing one safe request change."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "view=full", key: "view-full", variant: "term" }
            ],
            interactiveParts: ["view-full"],
            defaultExplainKey: "view-full"
          },
          focusExplain: {
            "view-full": "full = bigger view."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "view-full"
          }
        },
        {
          id: "request-lab-mode",
          title: "X-Lab-Mode",
          prompt: "Tap X-Lab-Mode.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap X-Lab-Mode."],
          successCondition: "Tap the lab header.",
          feedback: "Good. detail adds more lab notes.",
          explanation: "detail = more lab notes.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Detail mode"
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
              body: "<html>\n  <h1>Announcements</h1>\n  <p>Detail mode.</p>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session still does not change."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows the lab header."
            },
            proxy: {
              status: "Lab replay",
              note: "The app is showing one safe request change."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "X-Lab-Mode: detail", key: "lab-mode", variant: "header" }
            ],
            interactiveParts: ["lab-mode"],
            defaultExplainKey: "lab-mode"
          },
          focusExplain: {
            "lab-mode": "detail = more lab notes."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "lab-mode"
          }
        },
        {
          id: "request-safe-rule",
          title: "Safe Rule",
          prompt: "Tap the safe rule.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap the safe rule."],
          successCondition: "Tap the safe rule.",
          feedback: "Right. Only the lab fields change here.",
          explanation: "Only change safe lab fields here.",
          workspace: {
            browser: {
              title: "Nova Reports",
              url: "https://reports.nova.lab/announcements?view=full",
              note: "Safe lab rule"
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
              body: "<html>\n  <h1>Announcements</h1>\n</html>"
            },
            cookies: [
              { name: "session", value: "nr-2040", scope: "reports.nova.lab", purpose: "Lab session" }
            ],
            session: {
              state: "Signed in",
              id: "nr-2040",
              note: "The session stays valid. Only lab fields changed."
            },
            cache: {
              status: "Not the focus",
              note: "This step keeps one simple rule."
            },
            proxy: {
              status: "Lab replay",
              note: "The changes stay inside safe training controls."
            },
            discoverability: {
              summary: "Not used in this step.",
              tree: []
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "Safe lab fields only", key: "safe-lab-fields", variant: "term" }
            ],
            interactiveParts: ["safe-lab-fields"],
            defaultExplainKey: "safe-lab-fields"
          },
          focusExplain: {
            "safe-lab-fields": "Only change safe lab fields here."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "safe-lab-fields"
          }
        }
      ]
    },
    {
      id: "spidering-discoverability",
      title: "Finding Linked Pages",
      category: "Discoverability",
      difficulty: "Beginner",
      learningObjectives: [
        "See that a crawler follows links.",
        "Notice pages and files can both be found.",
        "Keep one rule: review linked content."
      ],
      scenarioIntro:
        "A crawler follows links.",
      explanation:
        "Visible links become discoverable.",
      recommendedNextLesson: "http-request-basics",
      interactiveSteps: [
        {
          id: "spider-support-link",
          title: "/support",
          prompt: "Tap /support.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap /support."],
          successCondition: "Tap the visible link.",
          feedback: "Good. Visible links are easy to find.",
          explanation: "Visible link = easy to find.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/",
              note: "Crawler starts at the home page"
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
              body: "<html>\n  <a href=\"/support\">Support</a>\n  <script src=\"/assets/app.js\"></script>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example does not need a login."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows one visible link."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Home page links",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "appjs", label: "/assets/app.js", depth: 1, type: "file" }
              ]
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "/support", key: "link-support", variant: "term" }
            ],
            interactiveParts: ["link-support"],
            defaultExplainKey: "link-support"
          },
          focusExplain: {
            "link-support": "Visible link = easy to find."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "link-support"
          }
        },
        {
          id: "spider-file-link",
          title: "/assets/app.js",
          prompt: "Tap /assets/app.js.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap /assets/app.js."],
          successCondition: "Tap the linked file.",
          feedback: "Right. Files can be linked too.",
          explanation: "Files can be linked too.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/",
              note: "Home page file link"
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
              body: "<html>\n  <a href=\"/support\">Support</a>\n  <script src=\"/assets/app.js\"></script>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example does not need a login."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows one linked file."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Home page links",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "appjs", label: "/assets/app.js", depth: 1, type: "file" }
              ]
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "/assets/app.js", key: "file-appjs", variant: "term" }
            ],
            interactiveParts: ["file-appjs"],
            defaultExplainKey: "file-appjs"
          },
          focusExplain: {
            "file-appjs": "Files can be linked too."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "file-appjs"
          }
        },
        {
          id: "spider-deeper-link",
          title: "/support/archive",
          prompt: "Tap /support/archive.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap /support/archive."],
          successCondition: "Tap the deeper link.",
          feedback: "Good. Deeper links can still be found.",
          explanation: "Deeper links can still be found.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/support",
              note: "Crawler follows a support link"
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
              body: "<html>\n  <a href=\"/support/archive\">Support Archive</a>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example does not need a login."
            },
            cache: {
              status: "Not the focus",
              note: "This step only shows one deeper link."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Support links",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "appjs", label: "/assets/app.js", depth: 1, type: "file" }
              ]
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "/support/archive", key: "link-archive", variant: "term" }
            ],
            interactiveParts: ["link-archive"],
            defaultExplainKey: "link-archive"
          },
          focusExplain: {
            "link-archive": "Deeper links can still be found."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "link-archive"
          }
        },
        {
          id: "spider-review-rule",
          title: "Review Links",
          prompt: "Tap Review linked pages.",
          acceptedAnswers: [],
          acceptedActions: [],
          hints: ["Tap Review linked pages."],
          successCondition: "Tap the review rule.",
          feedback: "Right. Linked pages are part of the visible surface.",
          explanation: "Linked pages are part of the visible surface.",
          workspace: {
            browser: {
              title: "Hollowtree Docs",
              url: "https://docs.hollowtree.lab/support/archive",
              note: "Review rule"
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
              body: "<html>\n  <h1>Support Archive</h1>\n</html>"
            },
            cookies: [],
            session: {
              state: "Anonymous",
              id: "No active session",
              note: "This crawl example does not need a login."
            },
            cache: {
              status: "Not the focus",
              note: "This step keeps one simple rule."
            },
            proxy: {
              status: "Observation only",
              note: "No interception is active during this lesson."
            },
            discoverability: {
              summary: "Linked content",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "appjs", label: "/assets/app.js", depth: 1, type: "file" }
              ]
            }
          },
          focusVisual: {
            type: "terms",
            items: [
              { label: "Review linked pages", key: "review-links", variant: "term" }
            ],
            interactiveParts: ["review-links"],
            defaultExplainKey: "review-links"
          },
          focusExplain: {
            "review-links": "Linked pages are part of the visible surface."
          },
          interaction: {
            type: "focus-discover",
            buttonLabel: "Next",
            targetKey: "review-links"
          }
        }
      ]
    }
  ];

  window.WebHttpLabData = {
    lessons
  };
})();
