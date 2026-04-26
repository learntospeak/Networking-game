(function () {
  window.WebHttpFlowData = {
    scenarios: [
      {
        id: "http-page",
        name: "HTTP Page Request",
        label: "HTTP Flow",
        note: "Readable page request",
        subtitle: "Ask the server for /profile with a plain HTTP request.",
        summary:
          "HTTP works like another network request. The browser asks for /profile, the request crosses the path in readable form, the server returns 200 OK, and the browser loads the page.",
        devices: {
          pc: { label: "Browser", meta: "User opens http://learn.lab/profile", icon: "fa-desktop" },
          switch: { label: "Switch", meta: "Local forwarding path", icon: "fa-network-wired" },
          router: { label: "Router", meta: "Path to the web server", icon: "fa-route" },
          server: { label: "Web Server", meta: "Returns the profile page", icon: "fa-server" }
        },
        steps: [
          {
            prompt: "A user opens http://learn.lab/profile. What happens first?",
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
