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
  /*
    "headers-useful-fields": {
      title: "Restore the Signed-In Ticket View",
      prompt:
        "The helpdesk request lost some important headers. Restore the signed-in ticket view and send the request until ticket 142 loads again.",
      successCondition:
        "Send GET /tickets/142 with Host: helpdesk.spruce.lab, a valid session cookie, and a browser identity.",
      idleFeedback:
        "The portal still does not have enough metadata to return the signed-in ticket view.",
      editorNote:
        "Host, Cookie, and User-Agent are not abstract labels here. They directly affect routing, state, and client identity.",
      responseGuide:
        "Wrong Host breaks routing. Missing session cookie redirects to login. Restoring Host, Cookie, and User-Agent returns 200 OK with the signed-in page.",
      focusFields: ["Host", "Cookie", "User-Agent"],
      hints: [
        "Start with the Host header. The site should be helpdesk.spruce.lab.",
        "The signed-in request also needs the session cookie value sp-41ac2.",
        "Add a non-empty User-Agent so the request carries browser identity too."
      ],
      editableHeaders: ["Host", "User-Agent", "Cookie", "Accept"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/tickets/142",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "support.spruce.lab" },
            { name: "User-Agent", value: "" },
            { name: "Cookie", value: "theme=forest" },
            { name: "Accept", value: "text/html" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        const hasSession = context.cookies.session === "sp-41ac2";
        const hasUserAgent = Boolean(context.userAgent.trim());

        if (context.host !== "helpdesk.spruce.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              421,
              "Misdirected Request",
              "This request did not target helpdesk.spruce.lab."
            ),
            browser: {
              note: "The site routing still points at the wrong host."
            },
            feedback:
              "Fix the Host header first. The request should target helpdesk.spruce.lab.",
            hintText: "Start with the destination site before repairing the rest of the headers."
          });
        }

        if (!hasSession) {
          return buildLabResult({
            response: redirectResponse("/login", [
              { name: "Set-Cookie", value: "last_route=%2Ftickets%2F142; Path=/; HttpOnly" }
            ]),
            browser: {
              title: "Spruce Helpdesk",
              note: "Without the signed-in session cookie, the portal redirects to login."
            },
            session: {
              state: "Login required",
              id: "No active session",
              note: "The browser is missing session=sp-41ac2."
            },
            cookies: [
              { name: "theme", value: "forest", scope: "helpdesk.spruce.lab", purpose: "Preference" },
              { name: "last_route", value: "/tickets/142", scope: "helpdesk.spruce.lab", purpose: "Return after login" }
            ],
            feedback:
              "The path is right, but the signed-in Cookie header is still missing the session value the portal expects.",
            hintText: "Restore session=sp-41ac2 in the Cookie header."
          });
        }

        if (!hasUserAgent) {
          return buildLabResult({
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" },
              { name: "Set-Cookie", value: "last_ticket=142; Path=/; HttpOnly" },
              { name: "Cache-Control", value: "private, max-age=60" }
            ], [
              "<html>",
              "  <h1>Ticket #142</h1>",
              "  <p>Status: awaiting review</p>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Spruce Helpdesk",
              note: "The ticket loads, but the request still lacks browser identity."
            },
            cookies: [
              { name: "theme", value: "forest", scope: "helpdesk.spruce.lab", purpose: "Preference" },
              { name: "session", value: "sp-41ac2", scope: "helpdesk.spruce.lab", purpose: "Signed-in state" },
              { name: "last_ticket", value: "142", scope: "helpdesk.spruce.lab", purpose: "Recent ticket shortcut" }
            ],
            session: {
              state: "Signed in",
              id: "sp-41ac2",
              note: "The server can see the signed-in session again."
            },
            cache: {
              status: "Private cache allowed",
              note: "The page can be cached privately once the request is correct."
            },
            feedback:
              "You restored the signed-in view, but add a User-Agent too so the request carries browser identity.",
            hintText: "Add any non-empty User-Agent value to finish the step."
          });
        }

        return buildLabResult({
          success: true,
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" },
            { name: "Set-Cookie", value: "last_ticket=142; Path=/; HttpOnly" },
            { name: "Cache-Control", value: "private, max-age=60" }
          ], [
            "<html>",
            "  <h1>Ticket #142</h1>",
            "  <p>Status: awaiting review</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Spruce Helpdesk",
            note: "The signed-in helpdesk ticket view is back."
          },
          cookies: [
            { name: "theme", value: "forest", scope: "helpdesk.spruce.lab", purpose: "Preference" },
            { name: "session", value: "sp-41ac2", scope: "helpdesk.spruce.lab", purpose: "Signed-in state" },
            { name: "last_ticket", value: "142", scope: "helpdesk.spruce.lab", purpose: "Recent ticket shortcut" }
          ],
          session: {
            state: "Signed in",
            id: "sp-41ac2",
            note: "The browser restored valid state and identified itself properly."
          },
          cache: {
            status: "Private cache allowed",
            note: "Cache-Control now tells the browser it may privately cache this page for 60 seconds."
          },
          feedback:
            "Good. Host, Cookie, and User-Agent now work together to restore the signed-in ticket view.",
          explanation:
            "Host identifies the destination site, Cookie carries stored state, and User-Agent identifies the client. Seeing them affect the response makes header analysis much more practical."
        });
      }
    },
    "headers-meaning": {
      title: "Ask for JSON Instead of HTML",
      prompt:
        "Use the request editor to ask the helpdesk for JSON. Then compare the Accept header you sent with the Content-Type the server returns.",
      successCondition:
        "Send GET /tickets/142 with Accept: application/json and the valid session cookie.",
      idleFeedback:
        "The portal is still returning HTML. Ask for JSON and send the request again.",
      editorNote:
        "This step turns header meaning into something visible: request Accept changes what response Content-Type comes back.",
      responseGuide:
        "HTML requests return text/html. Asking for JSON returns application/json.",
      focusFields: ["Accept", "Content-Type", "Cookie"],
      hints: [
        "Keep the valid session cookie so the portal stays signed in.",
        "The request header that asks for JSON is Accept.",
        "Set Accept to application/json and send again."
      ],
      editableHeaders: ["Host", "Cookie", "User-Agent", "Accept"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
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
        };
      },
      simulate: function (context) {
        if (context.host !== "helpdesk.spruce.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              421,
              "Misdirected Request",
              "The helpdesk only responds on helpdesk.spruce.lab."
            ),
            feedback:
              "Restore the Host header before experimenting with Accept.",
            hintText: "The request still needs helpdesk.spruce.lab as the host."
          });
        }

        if (context.cookies.session !== "sp-41ac2") {
          return buildLabResult({
            response: redirectResponse("/login"),
            session: {
              state: "Login required",
              id: "No active session",
              note: "The signed-in session cookie is missing or wrong."
            },
            feedback:
              "The server cannot demonstrate the signed-in response format until the session cookie is restored.",
            hintText: "Put session=sp-41ac2 back into the Cookie header."
          });
        }

        if (includesText(getHeaderValue(context.request.headers, "Accept"), "application/json")) {
          return buildLabResult({
            success: true,
            response: jsonResponse(200, "OK", [
              { name: "Cache-Control", value: "private, max-age=60" }
            ], {
              ticket: 142,
              status: "awaiting review",
              assignee: "Morgan"
            }),
            browser: {
              title: "Spruce Helpdesk API View",
              note: "The portal returned JSON because the request asked for JSON."
            },
            feedback:
              "Good. Accept asked for JSON, and the server replied with Content-Type: application/json.",
            explanation:
              "Accept is the client saying what it would like back. Content-Type is the server telling you what it actually sent."
          });
        }

        return buildLabResult({
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" },
            { name: "Cache-Control", value: "private, max-age=60" }
          ], [
            "<html>",
            "  <h1>Ticket #142</h1>",
            "  <p>Status: awaiting review</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Spruce Helpdesk",
            note: "The portal is still returning HTML because the request still asks for HTML."
          },
          feedback:
            "You are still getting HTML. Change Accept to application/json and send again.",
          hintText: "This step is about Accept on the request and Content-Type on the response."
        });
      }
    },
    "cookie-store-then-send": {
      title: "Send the Stored Session Cookie",
      prompt:
        "The portal already issued PHPSESSID on the previous response. Add it to the next dashboard request and send it so the server recognises the session.",
      successCondition:
        "Send GET /dashboard with Cookie: PHPSESSID=pl-8841aa.",
      idleFeedback:
        "The dashboard request is still missing the stored session cookie from the previous response.",
      editorNote:
        "The cookie jar already shows the value you need. This step is about moving it into the next request.",
      responseGuide:
        "No session cookie redirects to login. The correct PHPSESSID returns 200 OK.",
      focusFields: ["Cookie", "Path"],
      hints: [
        "The request should go to /dashboard.",
        "The browser already stored the session value pl-8841aa.",
        "Send it back as PHPSESSID=pl-8841aa in the Cookie header."
      ],
      editableHeaders: ["Host", "Cookie", "User-Agent"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/dashboard",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "portal.fable.lab" },
            { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" },
            { name: "Cookie", value: "" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.host !== "portal.fable.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The Fable portal expects portal.fable.lab as the host."
            ),
            feedback:
              "Restore the Host header before you work on the cookie.",
            hintText: "Use portal.fable.lab as the host."
          });
        }

        if (context.pathname !== "/dashboard") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The next signed-in page should be /dashboard."
            ),
            feedback:
              "Keep the next request pointed at /dashboard while you restore the cookie.",
            hintText: "The path should be /dashboard."
          });
        }

        if (context.cookies.PHPSESSID !== "pl-8841aa") {
          return buildLabResult({
            response: redirectResponse("/login"),
            browser: {
              title: "Fable Member Portal",
              note: "Without the session cookie, the portal treats the request like a fresh visit."
            },
            session: {
              state: "Login required",
              id: "No active session",
              note: "The portal still expects PHPSESSID=pl-8841aa."
            },
            feedback:
              "The server still does not see the stored session cookie. Add PHPSESSID=pl-8841aa to the Cookie header.",
            hintText: "Send the exact value from the cookie jar back in the Cookie header."
          });
        }

        return buildLabResult({
          success: true,
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" }
          ], [
            "<html>",
            "  <h1>Member Dashboard</h1>",
            "  <p>Session recognised.</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Fable Member Portal",
            note: "The dashboard loaded after the browser sent the stored session cookie back."
          },
          session: {
            state: "Session recognised",
            id: "pl-8841aa",
            note: "The server can look up member state using the session identifier."
          },
          feedback:
            "Good. The portal recognised the stored session once you sent PHPSESSID back in the Cookie header.",
          explanation:
            "This is the browser cookie loop in practice: Set-Cookie on one response leads to Cookie on the next matching request."
        });
      }
    },
    "cookie-inspect-session-name": {
      title: "Repair the Session Cookie Name",
      prompt:
        "The browser is sending the right value under the wrong cookie name. Fix the Cookie header and send the request until the dashboard loads.",
      successCondition:
        "Send the session value back as PHPSESSID=pl-8841aa in the Cookie header.",
      idleFeedback:
        "The cookie value is present, but the server still cannot recognise it under the wrong name.",
      editorNote:
        "This step shows that cookie names matter too. The server is looking for a specific session cookie name.",
      responseGuide:
        "session=pl-8841aa does not restore the session. PHPSESSID=pl-8841aa does.",
      focusFields: ["Cookie"],
      hints: [
        "The value pl-8841aa is fine. The problem is the cookie name.",
        "The portal uses PHPSESSID as the session cookie name.",
        "Send PHPSESSID=pl-8841aa in the Cookie header."
      ],
      editableHeaders: ["Host", "Cookie", "User-Agent"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/dashboard",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "portal.fable.lab" },
            { name: "Cookie", value: "session=pl-8841aa; theme=violet" },
            { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.cookies.PHPSESSID !== "pl-8841aa") {
          return buildLabResult({
            response: errorHtmlResponse(
              403,
              "Forbidden",
              "The portal did not receive the expected session cookie name."
            ),
            browser: {
              title: "Fable Member Portal",
              note: "The cookie value is present, but still under the wrong cookie name."
            },
            session: {
              state: "Session not recognised",
              id: "pl-8841aa under wrong name",
              note: "The browser needs PHPSESSID, not session, for this portal."
            },
            feedback:
              "The value is there, but the cookie name is still wrong. Replace session= with PHPSESSID=.",
            hintText: "Only the cookie name needs to change. Keep the same value."
          });
        }

        return buildLabResult({
          success: true,
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" }
          ], [
            "<html>",
            "  <h1>Member Dashboard</h1>",
            "  <p>Session recognised.</p>",
            "</html>"
          ].join("\n")),
          session: {
            state: "Session recognised",
            id: "pl-8841aa",
            note: "The server can now match the correct cookie name to the session record."
          },
          feedback:
            "Good. Changing the cookie name to PHPSESSID restored the session.",
          explanation:
            "A session cookie is not just any value in any cookie slot. The server expects a specific cookie name and value pattern."
        });
      }
    },
    "cookie-vs-preference": {
      title: "Remove a Preference Cookie Safely",
      prompt:
        "Trim a non-session cookie from the request and send it again. The dashboard should stay signed in, but one preference should reset.",
      successCondition:
        "Keep PHPSESSID in the Cookie header while removing at least one preference cookie such as theme or lang.",
      idleFeedback:
        "The request still includes every cookie, so you have not shown the difference between session state and preference state yet.",
      editorNote:
        "This step helps beginners see that not every cookie has the same impact. The session cookie matters more than the preference cookies here.",
      responseGuide:
        "Removing PHPSESSID breaks the session. Removing theme or lang only changes preferences.",
      focusFields: ["Cookie"],
      hints: [
        "Keep PHPSESSID or the signed-in state will disappear.",
        "Try removing theme or lang from the Cookie header.",
        "The goal is to keep the session alive while resetting a preference."
      ],
      editableHeaders: ["Host", "Cookie"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/dashboard",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "portal.fable.lab" },
            { name: "Cookie", value: "PHPSESSID=pl-8841aa; theme=violet; lang=en" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        const hasSession = context.cookies.PHPSESSID === "pl-8841aa";
        const hasTheme = Object.prototype.hasOwnProperty.call(context.cookies, "theme");
        const hasLang = Object.prototype.hasOwnProperty.call(context.cookies, "lang");

        if (!hasSession) {
          return buildLabResult({
            response: redirectResponse("/login"),
            session: {
              state: "Login required",
              id: "No active session",
              note: "Removing PHPSESSID removed the main session identifier."
            },
            feedback:
              "That removed the session itself. Keep PHPSESSID and remove a preference cookie instead.",
            hintText: "Leave PHPSESSID alone and trim theme or lang."
          });
        }

        if (hasTheme && hasLang) {
          return buildLabResult({
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Member Dashboard</h1>",
              "  <p>Theme: violet</p>",
              "  <p>Language: en</p>",
              "</html>"
            ].join("\n")),
            session: {
              state: "Session recognised",
              id: "pl-8841aa",
              note: "The session is fine, but every preference cookie is still present."
            },
            feedback:
              "The session still works, but you have not removed any preference cookie yet.",
            hintText: "Remove theme or lang while keeping PHPSESSID."
          });
        }

        const themeValue = hasTheme ? context.cookies.theme : "default";
        const langValue = hasLang ? context.cookies.lang : "default";

        return buildLabResult({
          success: true,
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" }
          ], [
            "<html>",
            "  <h1>Member Dashboard</h1>",
            "  <p>Theme: " + escapeHtml(themeValue) + "</p>",
            "  <p>Language: " + escapeHtml(langValue) + "</p>",
            "</html>"
          ].join("\n")),
          session: {
            state: "Session recognised",
            id: "pl-8841aa",
            note: "The signed-in session survived because PHPSESSID stayed in the request."
          },
          feedback:
            "Good. The session stayed valid because PHPSESSID remained, even though a preference cookie was removed.",
          explanation:
            "This is why not every cookie has the same security impact. Preference cookies change presentation, while the session cookie points to server-side state."
        });
      }
    },
    "session-rotation-after-login": {
      title: "Trigger Session Rotation",
      prompt:
        "The login request is almost ready, but the body is incomplete. Fix the login request and send it so the server rotates the session token.",
      successCondition:
        "Send POST /login with the guest session cookie and both username and password fields.",
      idleFeedback:
        "The server cannot rotate the session yet because the login request is still incomplete.",
      editorNote:
        "This step links request body fields to a Set-Cookie response, which makes session rotation easier to understand.",
      responseGuide:
        "Incomplete login returns 400. A valid login returns 302 and a fresh authenticated session cookie.",
      focusFields: ["Method", "Path", "Cookie", "Body"],
      hints: [
        "Keep the request on POST /login.",
        "The request should still carry the old guest token session=guest-31aa.",
        "Add both username and password fields to the body."
      ],
      editableHeaders: ["Host", "Cookie", "Content-Type"],
      methodOptions: ["POST", "GET"],
      showQuery: false,
      showBody: true,
      buildInitialRequest: function () {
        return {
          method: "POST",
          path: "/login",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "ops.beacon.lab" },
            { name: "Cookie", value: "session=guest-31aa" },
            { name: "Content-Type", value: "application/x-www-form-urlencoded" }
          ],
          body: "username=maya"
        };
      },
      simulate: function (context) {
        if (context.request.method !== "POST") {
          return buildLabResult({
            response: methodNotAllowedResponse(["POST"]),
            feedback:
              "Keep this on POST. The server expects a login submission, not a page fetch.",
            hintText: "Leave the method as POST."
          });
        }

        if (context.pathname !== "/login") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The login flow only starts on /login."
            ),
            feedback:
              "The login request needs to stay on /login before rotation can happen.",
            hintText: "Use /login as the path."
          });
        }

        if (context.cookies.session !== "guest-31aa") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The request no longer carries the guest session token the server planned to rotate."
            ),
            feedback:
              "Put session=guest-31aa back first so the server can replace it with a fresh authenticated token.",
            hintText: "This step starts with the old guest session cookie."
          });
        }

        if (!includesText(context.contentType, "application/x-www-form-urlencoded")) {
          return buildLabResult({
            response: errorHtmlResponse(
              415,
              "Unsupported Media Type",
              "The login form body needs a URL-encoded format."
            ),
            feedback:
              "The server still needs application/x-www-form-urlencoded on this login request.",
            hintText: "Use application/x-www-form-urlencoded for the login body."
          });
        }

        if (!context.bodyParams.username || !context.bodyParams.password) {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The login body needs both username and password fields."
            ),
            feedback:
              "The login request is still incomplete. Add both username and password fields before sending it again.",
            hintText: "Try username=maya&password=demo-lab-value."
          });
        }

        return buildLabResult({
          success: true,
          response: redirectResponse("/dashboard", [
            { name: "Set-Cookie", value: "session=auth-93c7d1; Path=/; HttpOnly; Secure" }
          ]),
          browser: {
            title: "Beacon Ops Dashboard",
            note: "The server rotated the guest session into a fresh authenticated session."
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
          feedback:
            "Good. The successful login returns a new authenticated session token instead of reusing the guest one.",
          explanation:
            "Session rotation after login is a defensive pattern. The server changes the identifier when trust changes so the old guest token is no longer the one that represents authenticated state."
        });
      }
    },
    "session-reuse-observation": {
      title: "Restore the Valid Session",
      prompt:
        "This dashboard request is still using the old guest token. Replace it with the authenticated token and send the request again.",
      successCondition:
        "Send GET /dashboard with Cookie: session=auth-93c7d1.",
      idleFeedback:
        "The old guest token only returns the login redirect. Swap in the rotated authenticated token and try again.",
      editorNote:
        "The key lesson is that the server cares about the token value, not just the cookie name.",
      responseGuide:
        "Old guest token redirects to /login. The authenticated token returns 200 OK.",
      focusFields: ["Cookie"],
      hints: [
        "The cookie name stays session.",
        "Only the value should change from guest-31aa to auth-93c7d1.",
        "Send session=auth-93c7d1 back to the server."
      ],
      editableHeaders: ["Host", "Cookie"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/dashboard",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "ops.beacon.lab" },
            { name: "Cookie", value: "session=guest-31aa" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.cookies.session === "auth-93c7d1") {
          return buildLabResult({
            success: true,
            response: htmlResponse(200, "OK", [
              { name: "Cache-Control", value: "no-store" },
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Dashboard</h1>",
              "  <p>Authenticated operator workspace.</p>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Beacon Ops Dashboard",
              note: "The dashboard loads once the browser sends the authenticated token."
            },
            session: {
              state: "Authenticated",
              id: "auth-93c7d1",
              note: "The server maps this specific value to authenticated state."
            },
            cache: {
              status: "no-store",
              note: "Sensitive authenticated pages often avoid browser caching."
            },
            feedback:
              "Good. Replacing the guest token with the authenticated token restores the dashboard.",
            explanation:
              "This is the practical version of the lesson: the server responds differently because the cookie value changed from an old guest token to the valid authenticated one."
          });
        }

        return buildLabResult({
          response: redirectResponse("/login", [
            { name: "Cache-Control", value: "no-store" }
          ]),
          browser: {
            title: "Beacon Ops Dashboard",
            note: "The old guest token still sends the browser back to login."
          },
          session: {
            state: "Guest state returned",
            id: context.cookies.session || "missing",
            note: "The server is still using the older, weaker session value."
          },
          cache: {
            status: "no-store",
            note: "Sensitive redirects often avoid caching."
          },
          feedback:
            "The request is still using the old guest token, so the server redirects back to /login.",
          hintText: "Replace guest-31aa with auth-93c7d1 in the Cookie header."
        });
      }
    },
    "request-modify-parameter": {
      title: "Change a Safe Query Parameter",
      prompt:
        "The portal is loading a compact view. Change the view parameter in the request, press Send Request, and watch the response expand.",
      successCondition:
        "Send GET /announcements?view=full with the valid session cookie still present.",
      idleFeedback:
        "The current request still asks for the compact training view.",
      editorNote:
        "This is a safe request editing exercise. You are only toggling a fictional training view on the same endpoint.",
      responseGuide:
        "view=compact returns the short list. view=full returns the expanded training list.",
      focusFields: ["Path", "Query parameters", "Cookie"],
      hints: [
        "Keep the request on /announcements.",
        "The view parameter is the only part that needs to change first.",
        "Switch view=compact to view=full."
      ],
      editableHeaders: ["Host", "Cookie", "X-Lab-Mode"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/announcements?view=compact",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "reports.nova.lab" },
            { name: "Cookie", value: "session=nr-2040" },
            { name: "X-Lab-Mode", value: "summary" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.host !== "reports.nova.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The reports lab expects requests for reports.nova.lab."
            ),
            feedback:
              "Restore the Host header before testing the request changes.",
            hintText: "Use reports.nova.lab as the host."
          });
        }

        if (context.cookies.session !== "nr-2040") {
          return buildLabResult({
            response: errorHtmlResponse(
              403,
              "Forbidden",
              "The reports portal only shows this content to the active training session."
            ),
            session: {
              state: "Session missing",
              id: "No active session",
              note: "The request still needs session=nr-2040."
            },
            feedback:
              "Keep the safe request editing focused on the view parameter. The valid session cookie still needs to stay in place.",
            hintText: "Restore session=nr-2040 before replaying the request."
          });
        }

        if (context.pathname !== "/announcements") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The lab toggles live on /announcements."
            ),
            feedback:
              "Keep the request on /announcements. Only the view parameter should change first.",
            hintText: "Put the path back on /announcements."
          });
        }

        if (context.query.view === "full") {
          return buildLabResult({
            success: true,
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Announcements</h1>",
              "  <ul>",
              "    <li>Maintenance window Thursday</li>",
              "    <li>Proxy lab opens tomorrow</li>",
              "    <li>Session workshop notes published</li>",
              "    <li>Archive review reminder</li>",
              "  </ul>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Nova Reports",
              note: "The full training view loads once the request asks for view=full."
            },
            feedback:
              "Good. Changing the query parameter changed the response without leaving the same endpoint.",
            explanation:
              "This is a low-risk way to practice request editing. The client-controlled view parameter changes what the server returns, but only inside a fictional training view."
          });
        }

        return buildLabResult({
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" }
          ], [
            "<html>",
            "  <h1>Announcements</h1>",
            "  <p>Compact view: 2 short items shown.</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Nova Reports",
            note: "The compact training view is still active."
          },
          feedback:
            "The request still asks for the compact view. Change the query parameter to view=full and send it again.",
          hintText: "The path is already correct. Only the view parameter still needs to change."
        });
      }
    },
    "request-modify-header": {
      title: "Adjust a Safe Custom Header",
      prompt:
        "The training portal also respects a fictional display header. Change X-Lab-Mode, send the request, and watch the response reveal more detail.",
      successCondition:
        "Send GET /announcements?view=full with X-Lab-Mode: detail and the same valid session cookie.",
      idleFeedback:
        "The request is still using summary lab mode, so the detailed analyst notes stay hidden.",
      editorNote:
        "This header is fictional and safe. It exists only to teach how client-controlled headers can influence a server response.",
      responseGuide:
        "X-Lab-Mode: summary returns a short view. X-Lab-Mode: detail returns the expanded analyst notes.",
      focusFields: ["X-Lab-Mode", "Cookie"],
      hints: [
        "The view parameter can stay on view=full in this step.",
        "Only the X-Lab-Mode header value needs to change now.",
        "Switch summary to detail."
      ],
      editableHeaders: ["Host", "Cookie", "X-Lab-Mode"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/announcements?view=full",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "reports.nova.lab" },
            { name: "Cookie", value: "session=nr-2040" },
            { name: "X-Lab-Mode", value: "summary" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.cookies.session !== "nr-2040") {
          return buildLabResult({
            response: errorHtmlResponse(
              403,
              "Forbidden",
              "The reports portal only shows this content to the active training session."
            ),
            feedback:
              "Keep the valid session cookie in place while you experiment with the safe training header.",
            hintText: "Restore session=nr-2040 before changing X-Lab-Mode."
          });
        }

        if (context.pathname !== "/announcements" || context.query.view !== "full") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The detailed lab mode expects the full announcements route first."
            ),
            feedback:
              "This step assumes the request is already on /announcements?view=full. Put that back first.",
            hintText: "Keep the path on /announcements?view=full while you edit the header."
          });
        }

        if (normalizeText(getHeaderValue(context.request.headers, "X-Lab-Mode")) === "detail") {
          return buildLabResult({
            success: true,
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Announcements</h1>",
              "  <p>Detail lab mode active.</p>",
              "  <pre>Analyst notes: review session workshop checklist and proxy capture exercises.</pre>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Nova Reports",
              note: "Detailed analyst notes are now visible."
            },
            feedback:
              "Good. The edited header changed the training response from summary mode to detail mode.",
            explanation:
              "This fictional header lets beginners safely see how a client-controlled header can influence a response without turning the lesson into a real-world misuse pattern."
          });
        }

        return buildLabResult({
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" }
          ], [
            "<html>",
            "  <h1>Announcements</h1>",
            "  <p>Summary lab mode active. Expand the mode to reveal analyst notes.</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Nova Reports",
            note: "Summary lab mode is still active."
          },
          feedback:
            "The request still uses summary mode. Change X-Lab-Mode to detail and send it again.",
          hintText: "Only the X-Lab-Mode value should change in this step."
        });
      }
    },
    "spider-hidden-linked-content": {
      title: "Request a Quietly Exposed Support Page",
      prompt:
        "Use the crawl clues to request one of the deeper support resources. Change the path and send it until you reach one of the quietly exposed pages.",
      successCondition:
        "Send GET /support/archive or /support/checklists/session-hygiene on docs.hollowtree.lab.",
      idleFeedback:
        "The current request is still too shallow. Use the discoverability tree to move deeper into the support area.",
      editorNote:
        "The tree is your map. The goal is not guessing wildly, but following the reachable structure the crawl has already revealed.",
      responseGuide:
        "Linked deeper support paths return 200 OK. Unknown guesses return 404.",
      focusFields: ["Path"],
      hints: [
        "Start from the support section shown in the crawl tree.",
        "The two deeper paths are /support/archive and /support/checklists/session-hygiene.",
        "Request one of those linked deeper resources."
      ],
      editableHeaders: ["Host", "User-Agent"],
      methodOptions: ["GET"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/support",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "docs.hollowtree.lab" },
            { name: "User-Agent", value: "LabSpider/1.0 (Training Crawl)" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.host !== "docs.hollowtree.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The Hollowtree docs site expects docs.hollowtree.lab."
            ),
            feedback:
              "Restore the Host header before using the crawl tree.",
            hintText: "Use docs.hollowtree.lab as the host."
          });
        }

        if (context.pathname === "/support/archive") {
          return buildLabResult({
            success: true,
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Support Archive</h1>",
              "  <p>Older articles remain linked and reachable.</p>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Hollowtree Docs",
              note: "The support archive was reachable because the crawl had already revealed it."
            },
            discoverability: {
              summary: "The crawl tree exposed /support/archive as a reachable support page.",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "checklist", label: "/support/checklists/session-hygiene", depth: 2, type: "page" }
              ]
            },
            feedback:
              "Good. You followed the crawl clues to a deeper linked page instead of guessing blindly.",
            explanation:
              "Discoverability is usually about following visible structure. The crawl tree made this page reachable, so requesting it is an inventory exercise rather than a blind guess."
          });
        }

        if (context.pathname === "/support/checklists/session-hygiene") {
          return buildLabResult({
            success: true,
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <h1>Session Hygiene Checklist</h1>",
              "  <p>Rotate session IDs after login and review linked archives regularly.</p>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Hollowtree Docs",
              note: "A deeper linked checklist page loaded from the crawl results."
            },
            discoverability: {
              summary: "The crawl tree exposed /support/checklists/session-hygiene as another reachable support page.",
              tree: [
                { id: "root", label: "/", depth: 0, type: "page" },
                { id: "support", label: "/support", depth: 1, type: "page" },
                { id: "archive", label: "/support/archive", depth: 2, type: "page" },
                { id: "checklist", label: "/support/checklists/session-hygiene", depth: 2, type: "page" }
              ]
            },
            feedback:
              "Good. That deeper checklist page was discoverable because it stayed linked under /support.",
            explanation:
              "Linked deeper content is still part of the site surface. That is why discoverability is a visibility and inventory topic for defenders."
          });
        }

        if (context.pathname === "/support") {
          return buildLabResult({
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <a href=\"/support/archive\">Support Archive</a>",
              "  <a href=\"/support/checklists/session-hygiene\">Session Hygiene Checklist</a>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Hollowtree Docs",
              note: "The support page still shows the deeper linked resources."
            },
            feedback:
              "You are still on the support index. Follow one of the deeper links shown in the crawl tree.",
            hintText: "Try /support/archive or /support/checklists/session-hygiene."
          });
        }

        return buildLabResult({
          response: errorHtmlResponse(
            404,
            "Not Found",
            "That path does not appear in the linked support crawl tree."
          ),
          browser: {
            title: "Hollowtree Docs",
            note: "This guess is outside the linked paths the crawl revealed."
          },
          feedback:
            "That path is not one of the linked support resources shown in the discoverability tree.",
          hintText: "Use one of the depth-2 paths already visible in the tree."
        });
      }
    }
  };

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
    fieldValues: {},
    requestDraft: null,
    requestDirty: false,
    lastSentRequest: null,
    liveExplanation: "",
    resumePromptVisible: false,
    visualFlowStep: 0,
    visualMode: "get",
    visualExplainKey: "get"
  };

  const els = {};
  let savedProgressRecord = null;
  const uiState = {
    focusStepId: "",
    focusExplainKey: "",
    taskFeedbackKey: "",
    diagramExplainKey: "",
    flowStep: -1
  };
  let labAudioContext = null;

  document.addEventListener("DOMContentLoaded", function () {
    init().catch(function (error) {
      console.error("Web & HTTP Lab failed to initialise.", error);
      bindElements();
      renderMissingData();
    });
  });

  async function init() {
    if (NetlabApp?.whenReady) {
      await NetlabApp.whenReady();
    }

    const launchAction = NetlabApp?.getLaunchAction() || "";
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
    if (!savedProgressRecord || launchAction !== "resume" || !restoreSavedProgress(savedProgressRecord.state)) {
      if (launchAction) {
        NetlabApp?.clearLaunchAction();
      }
      resetStepRuntime();
    }
    render();
    if (!savedProgressRecord) {
      persistProgress();
    }
  }

  function cacheElements() {
    els.labStatus = document.getElementById("labStatus");
    els.completedCount = document.getElementById("completedCount");
    els.lessonList = document.getElementById("lessonList");
    els.curriculumMeta = document.getElementById("curriculumMeta");
    els.lessonCategory = document.getElementById("lessonCategory");
    els.lessonDifficulty = document.getElementById("lessonDifficulty");
    els.lessonStepBadge = document.getElementById("lessonStepBadge");
    els.lessonTitle = document.getElementById("lessonTitle");
    els.lessonIntro = document.getElementById("lessonIntro");
    els.lessonCompletion = document.getElementById("lessonCompletion");
    els.objectiveList = document.getElementById("objectiveList");
    els.recommendedNextLesson = document.getElementById("recommendedNextLesson");
    els.lessonExplanation = document.getElementById("lessonExplanation");
    els.focusLessonStage = document.getElementById("focusLessonStage");
    els.focusStepCount = document.getElementById("focusStepCount");
    els.focusStepTitle = document.getElementById("focusStepTitle");
    els.focusStageStatus = document.getElementById("focusStageStatus");
    els.focusVisual = document.getElementById("focusVisual");
    els.focusStepCopy = document.getElementById("focusStepCopy");
    els.focusInteractive = document.getElementById("focusInteractive");
    els.focusRestartBtn = document.getElementById("focusRestartBtn");

    els.browserUrl = document.getElementById("browserUrl");
    els.browserTitle = document.getElementById("browserTitle");
    els.browserNote = document.getElementById("browserNote");
    els.browserChipRow = document.getElementById("browserChipRow");
    els.flowDiagram = document.getElementById("flowDiagram");
    els.requestDiagram = document.getElementById("requestDiagram");

    els.requestBadge = document.getElementById("requestBadge");
    els.requestWorkbench = document.getElementById("requestWorkbench");
    els.requestWorkbenchNote = document.getElementById("requestWorkbenchNote");
    els.requestFocusFields = document.getElementById("requestFocusFields");
    els.requestEditorFields = document.getElementById("requestEditorFields");
    els.requestPreviewNote = document.getElementById("requestPreviewNote");
    els.sendRequestBtn = document.getElementById("sendRequestBtn");
    els.resetRequestBtn = document.getElementById("resetRequestBtn");
    els.requestRaw = document.getElementById("requestRaw");
    els.responseBadge = document.getElementById("responseBadge");
    els.responseSummary = document.getElementById("responseSummary");
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
    els.appSectionShell = document.getElementById("appSectionShell");
  }

  function bindStaticEvents() {
    els.hintBtn.addEventListener("click", showHint);
    els.nextBtn.addEventListener("click", advanceProgress);
    els.sendRequestBtn.addEventListener("click", sendCurrentRequest);
    els.resetRequestBtn.addEventListener("click", resetCurrentRequestDraft);
    if (els.focusRestartBtn) {
      els.focusRestartBtn.addEventListener("click", restartCurrentLesson);
    }

    window.addEventListener("netlab:authchange", function () {
      savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
      state.resumePromptVisible = Boolean(savedProgressRecord);
      render();
    });

    window.addEventListener("netlab:progresschange", function () {
      savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
      state.resumePromptVisible = Boolean(savedProgressRecord && NetlabApp.getLaunchAction() !== "resume");
      renderSectionShell();
    });

    window.addEventListener("netlab:profilemetachange", function () {
      renderSectionShell();
    });
  }

  function animateElements(targets, className) {
    targets.forEach(function (element) {
      if (!element) {
        return;
      }

      element.classList.remove(className);
      void element.offsetWidth;
      element.classList.add(className);

      if (element._netlabMotionTimer) {
        window.clearTimeout(element._netlabMotionTimer);
      }

      element._netlabMotionTimer = window.setTimeout(function () {
        element.classList.remove(className);
        element._netlabMotionTimer = 0;
      }, 520);
    });
  }

  function runFocusStepEnterMotion() {
    animateElements([
      els.focusVisual,
      els.focusStepCopy,
      els.focusInteractive
    ], "http-motion-enter");
  }

  function runFocusSelectionMotion(tone) {
    animateElements([
      els.focusVisual,
      els.focusStepCopy,
      els.focusInteractive
    ], "http-motion-swap");

    animateElements([
      els.focusStageStatus
    ], tone === "warning" ? "http-motion-warning" : "http-motion-success");
  }

  function runTaskFeedbackMotion(tone) {
    animateElements([
      els.taskState,
      els.feedbackText,
      els.stepExplanation
    ], tone === "warning" ? "http-motion-warning" : "http-motion-success");
  }

  function runDiagramMotion() {
    animateElements([
      els.flowDiagram && els.flowDiagram.querySelector(".http-flow-track"),
      els.flowDiagram && els.flowDiagram.querySelector(".http-flow-stage-copy"),
      els.requestDiagram && els.requestDiagram.querySelector(".http-explainer-card")
    ], "http-motion-swap");
  }

  function runWorkspaceResultMotion(tone) {
    animateElements([
      els.requestBadge,
      els.requestRaw,
      els.responseBadge,
      els.responseSummary,
      els.responseRaw
    ], tone === "warning" ? "http-motion-warning" : "http-motion-success");
  }

  function successAudioContext() {
    if (!window.AudioContext && !window.webkitAudioContext) {
      return null;
    }

    if (!labAudioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      labAudioContext = new AudioCtor();
    }

    return labAudioContext;
  }

  function playStepSuccessSound() {
    if (!NetlabApp?.isSoundEnabled || !NetlabApp.isSoundEnabled()) {
      return;
    }

    const context = successAudioContext();
    if (!context) {
      return;
    }

    if (context.state === "suspended" && typeof context.resume === "function") {
      context.resume().catch(function () {
        return null;
      });
    }

    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.connect(context.destination);

    const notes = [
      { frequency: 659.25, start: 0, duration: 0.05 },
      { frequency: 783.99, start: 0.06, duration: 0.07 }
    ];

    notes.forEach(function (note) {
      const oscillator = context.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
      oscillator.connect(gain);
      oscillator.start(now + note.start);
      oscillator.stop(now + note.start + note.duration);
    });

    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  }

  function hydrateProgress() {
    if (NetlabApp && NetlabApp.getLaunchAction() === "start") {
      NetlabApp.resetSectionProgress(SECTION_ID);
      NetlabApp.clearLaunchAction();
    }

    savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
    const savedState = savedProgressRecord?.state || {};

    state.completedLessons = savedState.completedLessons && typeof savedState.completedLessons === "object"
      ? savedState.completedLessons
      : {};
    state.resumePromptVisible = Boolean(savedProgressRecord && NetlabApp?.getLaunchAction() !== "resume");

    if (NetlabApp?.getLaunchAction() !== "resume") {
      state.lessonIndex = 0;
      state.stepIndex = 0;
    }
  }

  function persistProgress() {
    if (!NetlabApp) {
      return;
    }

    // The shared progress layer stores enough step state to reopen the request workbench where the learner left it.
    const payload = {
      sectionLabel: "Web & HTTP Lab",
      currentItemId: currentStep() ? currentStep().id : "",
      currentItemLabel: currentLesson()
        ? currentLesson().title + " - Step " + (state.stepIndex + 1)
        : "Not started",
      completedCount: Object.keys(state.completedLessons).length,
      totalCount: state.lessons.length,
      summaryText: state.stepSolved ? "Current step complete" : "Current step in progress",
      state: {
        lessonId: currentLesson() ? currentLesson().id : "",
        stepIndex: state.stepIndex,
        completedLessons: state.completedLessons,
        currentWorkspace: state.currentWorkspace,
        feedbackTone: state.feedbackTone,
        feedbackText: state.feedbackText,
        hintText: state.hintText,
        stepSolved: state.stepSolved,
        hintIndex: state.hintIndex,
        selectedOptionId: state.selectedOptionId,
        selectedOptionIds: Array.from(state.selectedOptionIds),
        fieldValues: state.fieldValues,
        requestDraft: state.requestDraft,
        requestDirty: state.requestDirty,
        lastSentRequest: state.lastSentRequest,
        liveExplanation: state.liveExplanation,
        visualFlowStep: state.visualFlowStep,
        visualMode: state.visualMode,
        visualExplainKey: state.visualExplainKey
      }
    };

    savedProgressRecord = NetlabApp.saveSectionProgress(SECTION_ID, payload);
    renderSectionShell();
  }

  function currentLesson() {
    return state.lessons[state.lessonIndex] || null;
  }

  function currentStep() {
    const lesson = currentLesson();
    return lesson && lesson.interactiveSteps ? lesson.interactiveSteps[state.stepIndex] || null : null;
  }

  function currentRequestLab() {
    const step = currentStep();
    if (!step || isFocusedLesson()) {
      return null;
    }

    return REQUEST_LABS[step.id] || null;
  }

  function awardLessonCompletionIfNeeded(lesson, alreadyCompleted) {
    if (alreadyCompleted || !lesson || !NetlabApp?.awardCoins) {
      return;
    }

    NetlabApp.awardCoins({
      key: `web-lesson-complete:${lesson.id}`,
      coins: NetlabApp.coinsForDifficulty(lesson.difficulty, 5),
      title: "Lesson Complete",
      message: lesson.title
    });
  }

  function resetStepRuntime() {
    const step = currentStep();
    const requestLab = currentRequestLab();

    state.currentWorkspace = cloneData(step ? step.workspace : null);
    state.feedbackTone = "idle";
    state.feedbackText = requestLab ? (requestLab.idleFeedback || DEFAULT_FEEDBACK) : "Inspect the request, response, and state panels before answering.";
    state.hintText = "Hints will appear here when needed.";
    state.stepSolved = false;
    state.hintIndex = 0;
    state.selectedOptionId = "";
    state.selectedOptionIds = new Set();
    state.fieldValues = {};
    state.requestDraft = null;
    state.requestDirty = false;
    state.lastSentRequest = null;
    state.liveExplanation = "";
    state.visualMode = normalizeVisualMode("", step);
    state.visualFlowStep = 0;
    state.visualExplainKey = step ? defaultFocusExplainKey(step) : defaultVisualExplainKey(state.visualMode);

    if (!step) {
      return;
    }

    if (step.interaction && Array.isArray(step.interaction.fields)) {
      step.interaction.fields.forEach(function (field) {
        state.fieldValues[field.id] = field.initialValue || "";
      });
    }

    if (requestLab) {
      initializeRequestLab(step, requestLab);
    }
  }

  function restoreSavedProgress(savedState) {
    if (!savedState) {
      return false;
    }

    const lessonIndex = findLessonIndex(savedState.lessonId);
    if (lessonIndex < 0) {
      return false;
    }

    state.lessonIndex = lessonIndex;
    state.stepIndex = Math.max(0, Math.min(Number(savedState.stepIndex) || 0, currentLesson().interactiveSteps.length - 1));
    state.completedLessons = savedState.completedLessons && typeof savedState.completedLessons === "object"
      ? savedState.completedLessons
      : {};
    state.currentWorkspace = cloneData(savedState.currentWorkspace);
    state.feedbackTone = savedState.feedbackTone || "idle";
    state.feedbackText = savedState.feedbackText || DEFAULT_FEEDBACK;
    state.hintText = savedState.hintText || "Hints will appear here when needed.";
    state.stepSolved = Boolean(savedState.stepSolved);
    state.hintIndex = Number(savedState.hintIndex) || 0;
    state.selectedOptionId = savedState.selectedOptionId || "";
    state.selectedOptionIds = new Set(Array.isArray(savedState.selectedOptionIds) ? savedState.selectedOptionIds : []);
    state.fieldValues = savedState.fieldValues && typeof savedState.fieldValues === "object"
      ? savedState.fieldValues
      : {};
    state.requestDraft = cloneData(savedState.requestDraft);
    state.requestDirty = Boolean(savedState.requestDirty);
    state.lastSentRequest = cloneData(savedState.lastSentRequest);
    state.liveExplanation = savedState.liveExplanation || "";
    state.visualFlowStep = clampVisualFlowStep(savedState.visualFlowStep);
    state.visualMode = normalizeVisualMode(savedState.visualMode, currentStep());
    state.visualExplainKey = savedState.visualExplainKey || defaultFocusExplainKey(currentStep());
    state.resumePromptVisible = false;

    if (!state.currentWorkspace) {
      resetStepRuntime();
    }

    NetlabApp?.clearLaunchAction();
    return true;
  }

  function initializeRequestLab(step, requestLab) {
    const seedRequest = requestLab.buildInitialRequest
      ? requestLab.buildInitialRequest(cloneData(step.workspace.request), cloneData(step.workspace), step)
      : cloneData(step.workspace.request);

    state.requestDraft = draftFromRequest(seedRequest);
    applyRequestResultToWorkspace(
      requestLab.simulate(createRequestLabContext(step, requestLab)),
      step
    );
    state.lastSentRequest = cloneData(state.currentWorkspace.request);
    state.requestDirty = false;
    state.feedbackText = requestLab.idleFeedback || DEFAULT_FEEDBACK;
    state.hintText = "Use Show Hint if you want a smaller clue before you send the request.";
  }

  function render() {
    renderSectionShell();
    syncFocusLessonMode();
    renderLessonList();
    renderOverview();
    renderFocusLessonStage();
    renderWorkspace();
    renderDiagrams();
    renderTask();
    renderInteraction();
  }

  function renderSectionShell() {
    if (!els.appSectionShell || !NetlabApp) {
      return;
    }

    const profile = NetlabApp.getActiveProfile();
    const completion = Object.keys(state.completedLessons).length + " / " + state.lessons.length;
    const lastSaved = savedProgressRecord || NetlabApp.getSectionProgress(SECTION_ID);
    const showResume = Boolean(lastSaved && state.resumePromptVisible);
    const accountHref = typeof NetlabApp.buildHubUrl === "function"
      ? (profile.isGuest ? NetlabApp.buildHubUrl({ auth: "login" }) : NetlabApp.buildHubUrl())
      : "./index.html#hubAccountPanel";
    const accountLabel = profile.isGuest ? "Sign In to Sync" : "Manage Account";

    els.appSectionShell.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Progress</p>",
      "    <h2>Resume Web &amp; HTTP Lab</h2>",
      "    <p class=\"app-shell-copy\">" + escapeHtml(showResume
        ? "Saved progress found for the active profile. Resume your last lesson or restart the lab from the beginning."
        : "Current profile: " + profile.label + ". Progress can reopen this lab at the last lesson and step.") + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">Profile: " + escapeHtml(profile.label) + "</span>",
      "  <span class=\"status-badge\">Completed: " + escapeHtml(completion) + "</span>",
      "  <span class=\"status-badge\">Coins: " + escapeHtml(NetlabApp.getCoinsTotal()) + "</span>",
      "  <span class=\"status-badge\">Last active: " + escapeHtml(lastSaved ? lastSaved.currentItemLabel : currentLesson().title) + "</span>",
      "</div>",
      "<div class=\"app-shell-actions\">",
      (showResume ? "  <button id=\"resumeSectionBtn\" class=\"app-action-btn\" type=\"button\">Resume</button>" : ""),
      "  <a class=\"app-action-link\" href=\"" + escapeHtml(accountHref) + "\">" + escapeHtml(accountLabel) + "</a>",
      "  <button id=\"startOverSectionBtn\" class=\"app-action-btn\" type=\"button\">Start Over</button>",
      "  <button id=\"toggleSoundBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
      "  <button id=\"resetProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
      "</div>",
      "<p class=\"app-shell-note\">Reset Progress clears all saved web lab progress for the current profile. " + escapeHtml(NetlabApp.getProfileStorageNote()) + "</p>"
    ].join("");

    const resumeBtn = document.getElementById("resumeSectionBtn");
    const startOverBtn = document.getElementById("startOverSectionBtn");
    const toggleSoundBtn = document.getElementById("toggleSoundBtn");
    const resetProgressBtn = document.getElementById("resetProgressBtn");

    if (resumeBtn && lastSaved) {
      resumeBtn.addEventListener("click", function () {
        restoreSavedProgress(lastSaved.state);
        render();
      });
    }

    if (startOverBtn) {
      startOverBtn.addEventListener("click", function () {
        window.location.href = NetlabApp.buildSectionUrl(SECTION_ID, "start");
      });
    }

    if (toggleSoundBtn) {
      toggleSoundBtn.addEventListener("click", function () {
        NetlabApp.setSoundEnabled(!NetlabApp.isSoundEnabled());
        renderSectionShell();
      });
    }

    if (resetProgressBtn) {
      resetProgressBtn.addEventListener("click", function () {
        if (!window.confirm("Clear all saved progress for the current profile?")) {
          return;
        }

        NetlabApp.clearActiveProfileProgress();
        window.location.href = NetlabApp.buildSectionUrl(SECTION_ID, "start");
      });
    }
  }

  function syncFocusLessonMode() {
    const focusMode = isFocusedLesson();
    document.body.classList.toggle("http-focus-mode", focusMode);
    if (els.focusLessonStage) {
      els.focusLessonStage.hidden = !focusMode;
    }
  }

  function renderMissingData() {
    els.labStatus.textContent = "Unavailable";
    els.labStatus.className = "http-status bad";
    els.lessonList.innerHTML = "<div class=\"http-empty-state\">The Web &amp; HTTP Lab data file did not load.</div>";
    els.interactionBody.innerHTML = "<div class=\"http-empty-state\">Refresh the page and try again.</div>";
    if (els.flowDiagram) {
      els.flowDiagram.innerHTML = "<div class=\"http-empty-state\">The visual flow will appear once the lesson data loads.</div>";
    }
    if (els.requestDiagram) {
      els.requestDiagram.innerHTML = "<div class=\"http-empty-state\">The request anatomy diagram will appear once a lesson is available.</div>";
    }
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

    els.labStatus.textContent = statusText;
    els.labStatus.className = "http-status " + (state.stepSolved || state.completedLessons[lesson.id] ? "good" : "idle");

    els.lessonList.innerHTML = "";

    state.lessons.forEach(function (item, index) {
      const card = document.createElement("article");
      const isActive = index === state.lessonIndex;
      const isComplete = Boolean(state.completedLessons[item.id]);
      const isLocked = index > unlockedLessonIndex();
      card.className = "http-path-card";

      if (isActive) {
        card.classList.add("is-active");
      }

      if (isComplete) {
        card.classList.add("is-complete");
      }

      if (isLocked) {
        card.classList.add("is-locked");
      }

      card.innerHTML =
        "<span class=\"http-path-step\">Lesson " + (index + 1) + "</span>" +
        "<span class=\"http-path-title\">" + escapeHtml(item.title) + "</span>" +
        "<span class=\"http-path-copy\">" + escapeHtml(shortScenario(item.scenarioIntro)) + "</span>" +
        "<span class=\"http-path-lock\">" + escapeHtml(pathStatusLabel(item, index)) + "</span>";

      els.lessonList.appendChild(card);
    });
  }

  function renderOverview() {
    const lesson = currentLesson();
    const step = currentStep();
    const requestLab = currentRequestLab();
    const recommended = nextLessonFor(lesson);

    els.lessonCategory.textContent = lesson.category;
    els.lessonDifficulty.textContent = lesson.difficulty;
    els.lessonStepBadge.textContent = "Step " + (state.stepIndex + 1) + " of " + lesson.interactiveSteps.length;
    els.lessonTitle.textContent = lesson.title;
    els.lessonIntro.textContent = compactStepIntro(lesson, step, requestLab);
    els.lessonExplanation.textContent = compactConceptText(lesson, step, requestLab);
    els.recommendedNextLesson.textContent = recommended
      ? "Finish this lesson to unlock " + recommended.title + "."
      : "You are on the final lesson in this path.";
    if (els.curriculumMeta) {
      els.curriculumMeta.textContent = "Lesson " + (state.lessonIndex + 1) + " of " + state.lessons.length + " | Step " + (state.stepIndex + 1) + " of " + lesson.interactiveSteps.length;
    }

    const completionText = state.completedLessons[lesson.id]
      ? "Lesson complete"
      : step && state.stepSolved && state.stepIndex === lesson.interactiveSteps.length - 1
        ? "Ready for next lesson"
        : lesson.interactiveSteps.length + " guided steps";

    els.lessonCompletion.textContent = completionText;
    els.lessonCompletion.className = "http-completion-pill " + (state.completedLessons[lesson.id] ? "complete" : "pending");

    els.objectiveList.innerHTML = "";
    focusItemsFor(lesson, step, requestLab).forEach(function (objective) {
      const item = document.createElement("span");
      item.className = "http-chip";
      item.textContent = objective;
      els.objectiveList.appendChild(item);
    });
  }

  function renderFocusLessonStage() {
    if (!isFocusedLesson() || !els.focusLessonStage) {
      return;
    }

    const step = currentStep();
    const interaction = step && step.interaction ? step.interaction : {};
    const selectedKey = validFocusExplainKey(step, state.visualExplainKey)
      ? state.visualExplainKey
      : defaultFocusExplainKey(step);
    const stepChanged = uiState.focusStepId !== step.id;
    const explainChanged = uiState.focusExplainKey !== selectedKey;

    state.visualExplainKey = selectedKey;
    els.focusStepCount.textContent = "Step " + (state.stepIndex + 1) + " of " + currentLesson().interactiveSteps.length;
    els.focusStepTitle.textContent = step.title;
    els.focusStageStatus.textContent = state.stepSolved
      ? (state.stepIndex === currentLesson().interactiveSteps.length - 1 ? "Nice - lesson complete" : "Nice - step complete")
      : state.feedbackTone === "warning"
        ? "Close - try again"
        : interaction.type === "focus-discover"
          ? step.prompt
          : "Current step";
    els.focusStageStatus.className = "http-completion-pill " + (state.stepSolved ? "complete" : "pending");
    els.focusVisual.innerHTML = buildFocusVisual(step, selectedKey);
    els.focusStepCopy.textContent = focusExplanationText(step, selectedKey);
    renderFocusInteraction(step, interaction);
    bindFocusLessonInteractions(step, interaction);

    if (stepChanged) {
      runFocusStepEnterMotion();
    } else if (explainChanged) {
      runFocusSelectionMotion(state.feedbackTone === "warning" ? "warning" : "success");
    }

    uiState.focusStepId = step.id;
    uiState.focusExplainKey = selectedKey;
  }

  function renderFocusInteraction(step, interaction) {
    els.focusInteractive.innerHTML = "";
    const feedbackClass = state.feedbackTone === "warning" ? " is-warning" : " is-success";
    const feedbackMarkup = state.feedbackText
      ? "<p class=\"http-focus-feedback" + feedbackClass + "\" role=\"status\" aria-live=\"polite\">" + escapeHtml(truncateText(state.feedbackText, 76)) + "</p>"
      : "";

    if (state.stepSolved) {
      els.focusInteractive.innerHTML =
        "<button id=\"focusAdvanceBtn\" type=\"button\" class=\"http-focus-next\">" + escapeHtml(nextButtonLabel()) + "</button>" +
        feedbackMarkup;
      return;
    }

    if (interaction.type === "focus-continue") {
      els.focusInteractive.innerHTML =
        "<button id=\"focusContinueBtn\" type=\"button\" class=\"http-focus-next\">" + escapeHtml(interaction.buttonLabel || "Next") + "</button>";
      return;
    }

    if (interaction.type === "focus-discover") {
      els.focusInteractive.innerHTML =
        "<button type=\"button\" class=\"http-focus-next\" disabled>" + escapeHtml(interaction.buttonLabel || "Next") + "</button>" +
        (state.feedbackTone === "warning" ? feedbackMarkup : "");
      return;
    }

    if (interaction.type === "single-choice") {
      const selectedId = state.selectedOptionId || "";
      const choiceMarkup = (interaction.options || []).map(function (option) {
        const selectedClass = selectedId === option.id ? " is-selected" : "";
        return "<button type=\"button\" class=\"http-focus-choice" + selectedClass + "\" data-focus-choice=\"" + escapeHtml(option.id) + "\">" + escapeHtml(option.label) + "</button>";
      }).join("");

      els.focusInteractive.innerHTML =
        "<div class=\"http-focus-choice-grid\">" + choiceMarkup + "</div>" +
        ((state.feedbackTone === "warning" || state.stepSolved) ? feedbackMarkup : "");
    }
  }

  function bindFocusLessonInteractions(step, interaction) {
    els.focusVisual.querySelectorAll("[data-focus-explainer]").forEach(function (button) {
      button.addEventListener("click", function () {
        const selectedKey = button.getAttribute("data-focus-explainer") || defaultFocusExplainKey(step);
        state.visualExplainKey = selectedKey;

        if (interaction.type === "focus-discover" && normalizeText(interaction.targetKey) === normalizeText(selectedKey)) {
          markSuccess(step, step.feedback);
          return;
        }

        if (interaction.type === "focus-discover") {
          state.feedbackTone = "warning";
          state.feedbackText = focusMissFeedback(step, selectedKey);
          persistProgress();
          renderFocusLessonStage();
          renderTask();
          runFocusSelectionMotion("warning");
          runTaskFeedbackMotion("warning");
          return;
        }

        renderFocusLessonStage();
      });
    });

    els.focusVisual.querySelectorAll("[data-focus-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.visualMode = normalizeVisualMode(button.getAttribute("data-focus-mode"), currentStep());
        state.visualExplainKey = defaultFocusExplainKey(step);

        if (interaction.type === "focus-discover" && normalizeText(interaction.targetKey) === normalizeText(state.visualExplainKey)) {
          markSuccess(step, step.feedback);
          return;
        }

        state.feedbackTone = "warning";
        state.feedbackText = focusMissFeedback(step, state.visualExplainKey);
        persistProgress();
        renderFocusLessonStage();
        renderTask();
        runFocusSelectionMotion("warning");
        runTaskFeedbackMotion("warning");
      });
    });

    const continueBtn = document.getElementById("focusContinueBtn");
    if (continueBtn) {
      continueBtn.addEventListener("click", function () {
        advanceFocusLessonStep();
      });
    }

    const advanceBtn = document.getElementById("focusAdvanceBtn");
    if (advanceBtn) {
      advanceBtn.addEventListener("click", function () {
        advanceProgress();
      });
    }

    els.focusInteractive.querySelectorAll("[data-focus-choice]").forEach(function (button) {
      button.addEventListener("click", function () {
        const optionId = button.getAttribute("data-focus-choice");
        const option = (interaction.options || []).find(function (item) {
          return item.id === optionId;
        });

        if (!option) {
          return;
        }

        state.selectedOptionId = optionId;

        if (!option.correct) {
          markIncorrect(option.explanation || interaction.feedbackIncorrect || "Try again.");
          renderFocusLessonStage();
          return;
        }

        markSuccess(step, step.feedback);
      });
    });
  }

  function advanceFocusLessonStep() {
    if (state.stepIndex < currentLesson().interactiveSteps.length - 1) {
      state.stepIndex += 1;
      resetStepRuntime();
      persistProgress();
      render();
      return;
    }

    state.stepSolved = true;
    persistProgress();
    render();
  }

  function buildFocusVisual(step, selectedKey) {
    const focusVisual = step.focusVisual || {};

    if (focusVisual.type === "packet-journey") {
      return buildPacketJourneyVisual(step, selectedKey);
    }

    if (focusVisual.type === "flow") {
      return buildFocusFlowVisualAscii(focusVisual);
    }

    if (focusVisual.type === "terms") {
      return buildFocusTermsVisual(focusVisual, selectedKey);
    }

    if (focusVisual.type === "response") {
      return buildFocusResponseVisual(step.workspace && step.workspace.response, selectedKey, focusVisual);
    }

    if (focusVisual.type === "compare") {
      return buildFocusCompareVisual(step, selectedKey);
    }

    return buildFocusRequestVisual(step.workspace && step.workspace.request, selectedKey, focusVisual);
  }

  function buildFocusFlowVisual(focusVisual) {
    const labels = ["Browser", "Request", "Server", "Response"];
    const activeIndex = Math.max(0, Math.min(Number(focusVisual.stageIndex) || 0, labels.length - 1));
    const parts = ["<div class=\"http-focus-flow\">"];

    labels.forEach(function (label, index) {
      if (index > 0) {
        parts.push(
          "<div class=\"http-focus-flow-arrow" + (index === activeIndex ? " is-active" : "") + "\">→</div>"
        );
      }

      parts.push(
        "<div class=\"http-focus-flow-node" + (index === activeIndex ? " is-active" : "") + "\">" + escapeHtml(label) + "</div>"
      );
    });

    parts.push("</div>");
    return parts.join("");
  }

  function buildFocusFlowVisualAscii(focusVisual) {
    const labels = Array.isArray(focusVisual.labels) && focusVisual.labels.length
      ? focusVisual.labels
      : ["Browser", "Request", "Server", "Response"];
    const activeIndex = Math.max(0, Math.min(Number(focusVisual.stageIndex) || 0, labels.length - 1));
    const parts = ["<div class=\"http-focus-flow\">"];

    labels.forEach(function (label, index) {
      if (index > 0) {
        const arrowClass = index < activeIndex
          ? " is-complete"
          : index === activeIndex
            ? " is-active"
            : "";
        parts.push(
          "<div class=\"http-focus-flow-arrow" + arrowClass + "\">&rarr;</div>"
        );
      }

      const nodeClass = index < activeIndex
        ? " is-complete"
        : index === activeIndex
          ? " is-active"
          : "";
      parts.push(
        "<div class=\"http-focus-flow-node" + nodeClass + "\">" + escapeHtml(label) + "</div>"
      );
    });

    parts.push("</div>");
    return parts.join("");
  }

  function buildFocusTermsVisual(focusVisual, selectedKey) {
    const items = Array.isArray(focusVisual.items) ? focusVisual.items : [];
    const interactiveParts = new Set(Array.isArray(focusVisual.interactiveParts)
      ? focusVisual.interactiveParts
      : items.map(function (item) { return item.key; }));
    const parts = ["<div class=\"http-focus-request-line\">"];

    if (items.length) {
      parts.push("<div class=\"http-focus-line-row\">");
      items.forEach(function (item) {
        parts.push(buildFocusToken(
          item.label || "",
          item.key || "",
          selectedKey,
          interactiveParts.has(item.key),
          item.variant === "header" ? "header" : "term"
        ));
      });
      parts.push("</div>");
    }

    parts.push("</div>");
    return parts.join("");
  }

  function buildFocusRequestVisual(request, selectedKey, focusVisual) {
    if (!request) {
      return "<div class=\"http-empty-state\">No request loaded.</div>";
    }

    const lineParts = resolveFocusRequestLineParts(request, focusVisual);
    const headerParts = resolveFocusRequestHeaderParts(request, focusVisual);
    const interactiveParts = new Set(Array.isArray(focusVisual.interactiveParts)
      ? focusVisual.interactiveParts
      : []);
    lineParts.concat(headerParts).forEach(function (partName) {
      interactiveParts.add(partName);
    });
    const parts = ["<div class=\"http-focus-request-line\">"];

    if (lineParts.length) {
      parts.push("<div class=\"http-focus-line-row\">");
      lineParts.forEach(function (partName) {
        parts.push(buildFocusRequestPart(request, partName, selectedKey, interactiveParts.has(partName)));
      });
      parts.push("</div>");
    }

    if (headerParts.length) {
      parts.push("<div class=\"http-focus-header-list\">");
      headerParts.forEach(function (partName) {
        parts.push(buildFocusHeaderPart(request, partName, selectedKey, interactiveParts.has(partName)));
      });
      parts.push("</div>");
    }

    parts.push("</div>");
    return parts.join("");
  }

  function buildFocusResponseVisual(response, selectedKey, focusVisual) {
    if (!response) {
      return "<div class=\"http-empty-state\">No response loaded.</div>";
    }

    const lineParts = Array.isArray(focusVisual.lineParts)
      ? focusVisual.lineParts
      : ["status"];
    const headerParts = resolveFocusResponseHeaderParts(response, focusVisual);
    const interactiveParts = new Set(Array.isArray(focusVisual.interactiveParts)
      ? focusVisual.interactiveParts
      : []);
    lineParts.concat(headerParts).forEach(function (partName) {
      interactiveParts.add(partName);
    });
    const parts = ["<div class=\"http-focus-request-line\">"];

    if (lineParts.length) {
      const tokens = [];
      lineParts.forEach(function (partName) {
        if (partName === "status") {
          tokens.push(buildFocusToken((String(response.statusCode || "") + " " + String(response.statusText || "OK")).trim(), "response-code", selectedKey, interactiveParts.has(partName), "term"));
        }
      });

      if (tokens.length) {
        parts.push("<div class=\"http-focus-line-row\">");
        parts.push(tokens.join(""));
        parts.push("</div>");
      }
    }

    if (headerParts.length) {
      parts.push("<div class=\"http-focus-header-list\">");
      headerParts.forEach(function (partName) {
        parts.push(buildFocusResponseHeaderPart(response, partName, selectedKey, interactiveParts.has(partName)));
      });
      parts.push("</div>");
    }

    parts.push("</div>");
    return parts.join("");
  }

  function buildFocusCompareVisual(step, selectedKey) {
    const focusVisual = step && step.focusVisual ? step.focusVisual : {};
    const options = Array.isArray(focusVisual.options) && focusVisual.options.length
      ? focusVisual.options
      : [
        {
          key: "get",
          label: "GET /profile",
          title: "GET",
          copy: "Ask for a page or data.",
          resultStatus: "200 OK",
          resultCopy: "Nice - that request will work.",
          resultTone: "success"
        },
        {
          key: "post",
          label: "POST /login",
          title: "POST",
          copy: "Send or submit data.",
          resultStatus: "405 Method Not Allowed",
          resultCopy: "Close - that would send data, not fetch it.",
          resultTone: "warning"
        }
      ];
    const activeKey = selectedKey || focusVisual.defaultExplainKey || String(options[0].key || "get");
    const activeOption = options.find(function (option) {
      return normalizeText(option.key) === normalizeText(activeKey);
    }) || options[0];

    return [
      "<div class=\"http-focus-compare\">",
      "<div class=\"http-focus-line-row\">",
      options.map(function (option) {
        const isActive = normalizeText(activeOption.key) === normalizeText(option.key);
        return "<button type=\"button\" class=\"http-focus-term" + (isActive ? " is-active" : "") + "\" data-focus-explainer=\"" + escapeHtml(option.key) + "\">" + escapeHtml(option.label || option.title || option.key) + "</button>";
      }).join(""),
      "</div>",
      "<div class=\"http-focus-compare-grid\">",
      options.map(function (option) {
        const isActive = normalizeText(activeOption.key) === normalizeText(option.key);
        return "<div class=\"http-focus-compare-card" + (isActive ? " is-active" : "") + "\">" +
          "<p class=\"http-focus-compare-title\">" + escapeHtml(option.title || option.key) + "</p>" +
          "<p class=\"http-focus-compare-copy\">" + escapeHtml(option.copy || "") + "</p>" +
          "</div>";
      }).join(""),
      "</div>",
      "<div class=\"http-focus-result is-" + escapeHtml(activeOption.resultTone || "success") + "\" role=\"status\" aria-live=\"polite\">" +
      "<span class=\"http-focus-result-status\">" + escapeHtml(activeOption.resultStatus || "") + "</span>" +
      "<span class=\"http-focus-result-copy\">" + escapeHtml(activeOption.resultCopy || activeOption.copy || "") + "</span>" +
      "</div>",
      "</div>"
    ].join("");
  }

  function buildPacketJourneyVisual(step, selectedKey) {
    const focusVisual = step && step.focusVisual ? step.focusVisual : {};
    const request = step && step.workspace ? step.workspace.request : null;
    const response = step && step.workspace ? step.workspace.response : null;
    const stage = String(focusVisual.stage || "url");
    const url = focusVisual.url || (step && step.workspace && step.workspace.browser ? step.workspace.browser.url : "") || composeLabUrl(request || {
      headers: [],
      path: "/"
    }, "https://example.com/");
    const nodes = Array.isArray(focusVisual.nodes) && focusVisual.nodes.length
      ? focusVisual.nodes
      : ["Browser", "Router", "Internet", "Server"];
    const requestLines = Array.isArray(focusVisual.requestLines) && focusVisual.requestLines.length
      ? focusVisual.requestLines
      : packetJourneyRequestLines(request);
    const responseLines = Array.isArray(focusVisual.responseLines) && focusVisual.responseLines.length
      ? focusVisual.responseLines
      : packetJourneyResponseLines(response);
    const urlKey = focusVisual.urlKey || "url";
    const requestCardKey = focusVisual.requestCardKey || "request-card";
    const requestPacketKey = focusVisual.requestPacketKey || "request-packet";
    const responsePacketKey = focusVisual.responsePacketKey || "response-packet";

    if (Array.isArray(focusVisual.comparePackets) && focusVisual.comparePackets.length) {
      return buildPacketJourneyCompareVisual(focusVisual, selectedKey, nodes, url, requestLines);
    }

    const showRequestCard = stage !== "url";
    const showPacketChip = stage !== "url";
    const showResponseState = stage === "server" || stage === "return";
    const packetTone = showResponseState ? "response" : "request";
    const packetKey = showResponseState ? responsePacketKey : requestPacketKey;
    const packetLabel = showResponseState
      ? (focusVisual.responseLabel || "HTTP Response")
      : (focusVisual.packetLabel || "HTTP Request");
    const packetLines = showResponseState ? responseLines : requestLines;
    const packetSecure = Boolean(!showResponseState && focusVisual.secure);
    const packetFromHop = clampJourneyHop(
      Object.prototype.hasOwnProperty.call(focusVisual, "packetFromHop")
        ? focusVisual.packetFromHop
        : (stage === "return" ? nodes.length - 1 : 0),
      nodes.length
    );
    const packetToHop = clampJourneyHop(
      Object.prototype.hasOwnProperty.call(focusVisual, "packetToHop")
        ? focusVisual.packetToHop
        : (stage === "journey" || stage === "server" ? nodes.length - 1 : stage === "return" ? 0 : packetFromHop),
      nodes.length
    );

    return [
      "<div class=\"http-packet-journey is-stage-" + escapeHtml(stage) + "\">",
      buildPacketJourneyBrowserBar(url, focusVisual.addressSecure !== false, selectedKey, urlKey),
      showRequestCard
        ? buildPacketJourneyPayloadCard({
          label: showResponseState ? (focusVisual.responseFrameLabel || "200 OK") : (focusVisual.requestFrameLabel || "HTTP Request"),
          key: showResponseState ? responsePacketKey : requestCardKey,
          lines: packetLines,
          selectedKey: selectedKey,
          tone: packetTone,
          secure: packetSecure,
          stateClass: showResponseState ? "is-response" : "is-request"
        })
        : "",
      buildPacketJourneyTrack({
        nodes: nodes,
        label: packetLabel,
        key: packetKey,
        selectedKey: selectedKey,
        tone: packetTone,
        secure: packetSecure,
        showPacket: showPacketChip,
        fromHop: packetFromHop,
        toHop: packetToHop,
        activeHop: packetToHop
      }),
      "<div class=\"http-packet-journey-status-grid\">",
      buildPacketJourneyStatusCard(
        "Browser",
        stage === "return" ? (focusVisual.loadedTitle || "Page Loaded") : (focusVisual.browserStatus || "Ready"),
        stage === "return" ? "Render page" : "Open tab",
        stage === "return" ? "success" : "browser",
        stage === "url" || stage === "return"
      ),
      buildPacketJourneyStatusCard(
        "Server",
        showResponseState ? (focusVisual.serverStatus || "200 OK") : (focusVisual.serverStatus || "Waiting"),
        stage === "server" ? "Process request" : "Receive traffic",
        showResponseState ? "success" : "server",
        stage === "server" || stage === "journey"
      ),
      "</div>",
      buildPacketJourneyPagePreview({
        active: stage === "return",
        title: focusVisual.loadedTitle || extractHtmlHeading(response && response.body) || "Profile",
        copy: focusVisual.loadedCopy || "Page ready"
      }),
      "</div>"
    ].join("");
  }

  function buildPacketJourneyCompareVisual(focusVisual, selectedKey, nodes, url, requestLines) {
    const variants = focusVisual.comparePackets || [];

    return [
      "<div class=\"http-packet-journey is-stage-compare\">",
      "<div class=\"http-packet-journey-compare-grid\">",
      variants.map(function (variant) {
        const key = variant.key || "packet";
        const isSecure = Boolean(variant.secure);
        const isSelected = selectedKey === key;
        return [
          "<button type=\"button\" class=\"http-packet-journey-compare-card" + (isSelected ? " is-selected" : "") + "\" data-focus-explainer=\"" + escapeHtml(key) + "\">",
          buildPacketJourneyBrowserBar(variant.url || url, variant.addressSecure !== false, selectedKey, key, true, true),
          buildPacketJourneyPayloadCard({
            label: variant.label || variant.title || "Packet",
            key: key,
            lines: Array.isArray(variant.lines) && variant.lines.length ? variant.lines : requestLines,
            selectedKey: selectedKey,
            tone: isSecure ? "secure" : "request",
            secure: isSecure,
            stateClass: isSecure ? "is-secure" : "is-request",
            nested: true,
            passive: true
          }),
          buildPacketJourneyTrack({
            nodes: Array.isArray(variant.nodes) && variant.nodes.length ? variant.nodes : nodes,
            label: variant.packetLabel || (variant.title || "Packet"),
            key: key,
            selectedKey: selectedKey,
            tone: isSecure ? "secure" : "request",
            secure: isSecure,
            showPacket: true,
            fromHop: 0,
            toHop: (Array.isArray(variant.nodes) && variant.nodes.length ? variant.nodes.length : nodes.length) - 1,
            activeHop: (Array.isArray(variant.nodes) && variant.nodes.length ? variant.nodes.length : nodes.length) - 1,
            compact: true,
            passive: true
          }),
          "</button>"
        ].join("");
      }).join(""),
      "</div>",
      "</div>"
    ].join("");
  }

  function buildPacketJourneyBrowserBar(url, secure, selectedKey, key, nested, passive) {
    const activeClass = selectedKey === key ? " is-selected" : "";
    const nestedClass = nested ? " is-compact" : "";
    const tagName = passive ? "div" : "button";
    const attributes = passive
      ? ""
      : " type=\"button\" data-focus-explainer=\"" + escapeHtml(key) + "\"";

    return [
      "<" + tagName + " class=\"http-journey-browser-bar" + activeClass + nestedClass + "\"" + attributes + ">",
      "<span class=\"http-journey-browser-dot\"></span>",
      "<span class=\"http-journey-browser-dot\"></span>",
      "<span class=\"http-journey-browser-dot\"></span>",
      "<span class=\"http-journey-address-pill" + (secure ? " is-secure" : "") + "\">",
      secure ? "<span class=\"http-journey-lock\" aria-hidden=\"true\"></span>" : "",
      "<span class=\"http-journey-address-text\">" + escapeHtml(url) + "</span>",
      "<span class=\"http-journey-caret\" aria-hidden=\"true\"></span>",
      "</span>",
      "</" + tagName + ">"
    ].join("");
  }

  function buildPacketJourneyPayloadCard(options) {
    const key = options.key || "packet";
    const selectedKey = options.selectedKey || "";
    const tone = options.tone || "request";
    const activeClass = selectedKey === key ? " is-selected" : "";
    const nestedClass = options.nested ? " is-nested" : "";
    const stateClass = options.stateClass ? " " + options.stateClass : "";
    const secureClass = options.secure ? " is-secure" : "";
    const lines = Array.isArray(options.lines) ? options.lines : [];
    const tagName = options.passive ? "div" : "button";
    const attributes = options.passive
      ? ""
      : " type=\"button\" data-focus-explainer=\"" + escapeHtml(key) + "\"";

    return [
      "<" + tagName + " class=\"http-journey-payload-card" + activeClass + nestedClass + stateClass + secureClass + "\"" + attributes + ">",
      "<div class=\"http-journey-payload-head\">",
      "<span class=\"http-journey-payload-label\">" + escapeHtml(options.label || "Packet") + "</span>",
      options.secure ? "<span class=\"http-journey-payload-badge\">Encrypted</span>" : "<span class=\"http-journey-payload-badge\">" + escapeHtml(tone === "response" ? "Return" : "Readable") + "</span>",
      "</div>",
      "<div class=\"http-journey-payload-body\">",
      lines.map(function (line) {
        return "<span class=\"http-journey-payload-line\">" + escapeHtml(line) + "</span>";
      }).join(""),
      "</div>",
      "</" + tagName + ">"
    ].join("");
  }

  function buildPacketJourneyTrack(options) {
    const nodes = Array.isArray(options.nodes) && options.nodes.length ? options.nodes : ["Browser", "Router", "Internet", "Server"];
    const fromHop = clampJourneyHop(options.fromHop, nodes.length);
    const toHop = clampJourneyHop(options.toHop, nodes.length);
    const activeHop = clampJourneyHop(options.activeHop, nodes.length);
    const route = packetJourneyRoute(fromHop, toHop);
    const startPercent = packetJourneyProgress(fromHop, nodes.length);
    const endPercent = packetJourneyProgress(toHop, nodes.length);
    const compactClass = options.compact ? " is-compact" : "";
    const toneClass = options.tone ? " is-" + escapeHtml(options.tone) : " is-request";
    const secureClass = options.secure ? " is-secure" : "";
    const selectedClass = options.selectedKey === options.key ? " is-selected" : "";
    const tagName = options.passive ? "div" : "button";
    const attributes = options.passive
      ? ""
      : " type=\"button\" data-focus-explainer=\"" + escapeHtml(options.key || "packet") + "\"";

    return [
      "<div class=\"http-journey-track-shell" + compactClass + "\" style=\"--packet-start:" + escapeHtml(String(startPercent)) + "%; --packet-end:" + escapeHtml(String(endPercent)) + "%;\">",
      "<div class=\"http-journey-track\" style=\"grid-template-columns:repeat(" + escapeHtml(String(nodes.length)) + ", minmax(0, 1fr));\">",
      nodes.map(function (label, index) {
        const stateClass = index === activeHop
          ? " is-active"
          : route.indexOf(index) >= 0
            ? " is-travel"
            : "";
        return "<div class=\"http-journey-node" + stateClass + "\" style=\"--journey-delay:" + escapeHtml(String(Math.abs(index - fromHop) * 120)) + "ms;\">" + escapeHtml(label) + "</div>";
      }).join(""),
      options.showPacket
        ? "<" + tagName + " class=\"http-journey-packet-chip" + toneClass + secureClass + selectedClass + "\"" + attributes + ">" +
          (options.secure ? "<span class=\"http-journey-lock\" aria-hidden=\"true\"></span>" : "") +
          "<span>" + escapeHtml(options.label || "Packet") + "</span>" +
          "</" + tagName + ">"
        : "",
      "</div>",
      "</div>"
    ].join("");
  }

  function buildPacketJourneyStatusCard(title, status, copy, tone, active) {
    return [
      "<div class=\"http-journey-status-card is-" + escapeHtml(tone || "browser") + (active ? " is-active" : "") + "\">",
      "<span class=\"http-journey-status-title\">" + escapeHtml(title) + "</span>",
      "<span class=\"http-journey-status-main\">" + escapeHtml(status) + "</span>",
      "<span class=\"http-journey-status-copy\">" + escapeHtml(copy) + "</span>",
      "</div>"
    ].join("");
  }

  function buildPacketJourneyPagePreview(options) {
    return [
      "<div class=\"http-journey-page-preview" + (options.active ? " is-active" : "") + "\">",
      "<div class=\"http-journey-page-head\"></div>",
      "<div class=\"http-journey-page-body\">",
      "<span class=\"http-journey-page-title\">" + escapeHtml(options.title || "Page") + "</span>",
      "<span class=\"http-journey-page-copy\">" + escapeHtml(options.copy || "Loaded") + "</span>",
      "</div>",
      "</div>"
    ].join("");
  }

  function packetJourneyRequestLines(request) {
    if (!request) {
      return ["GET / HTTP/1.1"];
    }

    const lines = [
      (String(request.method || "GET") + " " + String(request.path || "/") + " " + String(request.version || "HTTP/1.1")).trim()
    ];

    ["Host", "Cookie", "User-Agent", "Content-Type"].forEach(function (headerName) {
      const value = getHeaderValue(request.headers || [], headerName);
      if (value) {
        lines.push(headerName + ": " + value);
      }
    });

    return lines;
  }

  function packetJourneyResponseLines(response) {
    if (!response) {
      return ["HTTP/1.1 200 OK"];
    }

    const lines = [
      ("HTTP/1.1 " + String(response.statusCode || 200) + " " + String(response.statusText || "OK")).trim()
    ];

    ["Content-Type", "Set-Cookie", "Cache-Control"].forEach(function (headerName) {
      const value = getHeaderValue(response.headers || [], headerName);
      if (value) {
        lines.push(headerName + ": " + value);
      }
    });

    return lines;
  }

  function clampJourneyHop(value, count) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 0;
    }

    return Math.max(0, Math.min(Math.floor(numeric), Math.max(0, count - 1)));
  }

  function packetJourneyProgress(index, count) {
    if (count <= 1) {
      return 0;
    }

    return (index / (count - 1)) * 100;
  }

  function packetJourneyRoute(fromHop, toHop) {
    const direction = fromHop <= toHop ? 1 : -1;
    const route = [];

    for (let index = fromHop; direction > 0 ? index <= toHop : index >= toHop; index += direction) {
      route.push(index);
    }

    return route;
  }

  function extractHtmlHeading(body) {
    const source = String(body || "");
    const match = source.match(/<h1>([^<]+)<\/h1>/i);
    return match ? match[1].trim() : "";
  }

  function resolveFocusRequestLineParts(request, focusVisual) {
    const parts = Array.isArray(focusVisual.lineParts)
      ? focusVisual.lineParts.slice()
      : ["method", "path"];

    if (!request) {
      return parts;
    }

    if (parts.indexOf("method") >= 0 && parts.indexOf("path") < 0 && request.path) {
      parts.push("path");
    }

    if (parts.indexOf("path") >= 0 && parts.indexOf("method") < 0 && request.method) {
      parts.unshift("method");
    }

    return Array.from(new Set(parts));
  }

  function resolveFocusRequestHeaderParts(request, focusVisual) {
    const parts = Array.isArray(focusVisual.headerParts)
      ? focusVisual.headerParts.slice()
      : ["host"];

    if (!request) {
      return parts;
    }

    if (!parts.length && getHeaderValue(request.headers || [], "Host")) {
      parts.push("host");
    }

    return Array.from(new Set(parts));
  }

  function resolveFocusResponseHeaderParts(response, focusVisual) {
    const parts = Array.isArray(focusVisual.headerParts)
      ? focusVisual.headerParts.slice()
      : [];

    if (!response) {
      return parts;
    }

    if (!parts.length && getHeaderValue(response.headers || [], "Content-Type")) {
      parts.push("content-type");
    }

    return Array.from(new Set(parts));
  }

  function buildFocusTerm(label, key, selectedKey) {
    return buildFocusToken(label, key, selectedKey, true, "term");
  }

  function buildFocusHeader(name, value, key, selectedKey) {
    return buildFocusToken(name + ": " + value, key, selectedKey, true, "header");
  }

  function buildFocusRequestPart(request, partName, selectedKey, interactive) {
    const pathParts = splitPath(request.path || "/");

    switch (partName) {
      case "method":
        return buildFocusToken(request.method || "GET", methodExplainKey(request.method), selectedKey, interactive, "term");
      case "path":
        return buildFocusToken(pathParts.pathname || "/", "path", selectedKey, interactive, "term");
      case "http-version":
        return buildFocusToken(request.version || "HTTP/1.1", "http-version", selectedKey, interactive, "term");
      default:
        return "";
    }
  }

  function buildFocusHeaderPart(request, partName, selectedKey, interactive) {
    switch (partName) {
      case "host":
        return buildFocusToken("Host: " + (getHeaderValue(request.headers || [], "Host") || "example.com"), "host", selectedKey, interactive, "header");
      case "user-agent":
        return buildFocusToken("User-Agent: " + (getHeaderValue(request.headers || [], "User-Agent") || "Chrome"), "user-agent", selectedKey, interactive, "header");
      case "cookie":
        return buildFocusToken("Cookie: " + (getHeaderValue(request.headers || [], "Cookie") || "session=demo"), "cookie", selectedKey, interactive, "header");
      case "content-type":
        return buildFocusToken("Content-Type: " + (getHeaderValue(request.headers || [], "Content-Type") || "text/html"), "content-type", selectedKey, interactive, "header");
      default:
        return "";
    }
  }

  function buildFocusResponseHeaderPart(response, partName, selectedKey, interactive) {
    switch (partName) {
      case "content-type":
        return buildFocusToken("Content-Type: " + (getHeaderValue(response.headers || [], "Content-Type") || "text/html"), "content-type", selectedKey, interactive, "header");
      case "set-cookie":
        return buildFocusToken("Set-Cookie: " + (getHeaderValue(response.headers || [], "Set-Cookie") || "session=demo"), "set-cookie", selectedKey, interactive, "header");
      case "cache-control":
        return buildFocusToken("Cache-Control: " + (getHeaderValue(response.headers || [], "Cache-Control") || "private, max-age=60"), "cache-control", selectedKey, interactive, "header");
      default:
        return "";
    }
  }

  function buildFocusToken(label, key, selectedKey, interactive, variant) {
    const baseClass = variant === "header" ? "http-focus-header" : "http-focus-term";
    const activeClass = selectedKey === key ? " is-active" : "";

    if (interactive) {
      return "<button type=\"button\" class=\"" + baseClass + activeClass + "\" data-focus-explainer=\"" + escapeHtml(key) + "\">" + escapeHtml(label) + "</button>";
    }

    return "<div class=\"" + baseClass + " http-focus-static" + activeClass + "\">" + escapeHtml(label) + "</div>";
  }

  function focusExplanationText(step, selectedKey) {
    const focusVisual = step.focusVisual || {};
    const stepMap = step && step.focusExplain ? step.focusExplain : null;

    if (focusVisual.type === "compare") {
      if (stepMap && stepMap[selectedKey]) {
        return stepMap[selectedKey];
      }

      const option = Array.isArray(focusVisual.options)
        ? focusVisual.options.find(function (item) { return item.key === selectedKey; })
        : null;

      return option && option.copy ? option.copy : "Choose the option that matches this step.";
    }

    if (stepMap && stepMap[selectedKey]) {
      return stepMap[selectedKey];
    }

    return focusExplanationForKey(selectedKey);
  }

  function defaultFocusExplainKey(step) {
    const focusVisual = step.focusVisual || {};
    if (focusVisual.defaultExplainKey) {
      return focusVisual.defaultExplainKey;
    }

    if (focusVisual.type === "flow") {
      return "flow";
    }

    if (focusVisual.type === "packet-journey") {
      const packetKeys = focusKeysForStep(step);
      return packetKeys.length ? packetKeys[0] : "url";
    }

    if (focusVisual.type === "response") {
      return "response-code";
    }

    if (focusVisual.type === "terms") {
      return Array.isArray(focusVisual.items) && focusVisual.items.length
        ? String(focusVisual.items[0].key || "get")
        : "get";
    }

    return "get";
  }

  function validFocusExplainKey(step, key) {
    const focusVisual = step.focusVisual || {};
    const allowed = focusKeysForStep(step);
    if (!focusVisual.type) {
      return false;
    }

    return allowed.indexOf(key) >= 0;
  }

  function focusKeysForStep(step) {
    const focusVisual = step.focusVisual || {};
    const keys = [];
    const request = step && step.workspace ? step.workspace.request : null;

    if (focusVisual.type === "flow") {
      return ["flow"];
    }

    if (focusVisual.type === "packet-journey") {
      if (Array.isArray(focusVisual.comparePackets) && focusVisual.comparePackets.length) {
        return focusVisual.comparePackets.map(function (packet) { return packet.key; }).filter(Boolean);
      }

      if (Array.isArray(focusVisual.interactiveParts) && focusVisual.interactiveParts.length) {
        return focusVisual.interactiveParts.slice();
      }

      return ["url", "request-card", "request-packet", "response-packet"];
    }

    if (focusVisual.type === "response") {
      (focusVisual.lineParts || ["status"]).forEach(function (partName) {
        if (partName === "status") {
          keys.push("response-code");
        }
      });

      (focusVisual.headerParts || []).forEach(function (partName) {
        if (partName === "content-type") {
          keys.push("content-type");
        } else if (partName === "set-cookie") {
          keys.push("set-cookie");
        } else if (partName === "cache-control") {
          keys.push("cache-control");
        }
      });

      return Array.from(new Set(keys));
    }

    if (focusVisual.type === "compare") {
      return Array.isArray(focusVisual.options) && focusVisual.options.length
        ? focusVisual.options.map(function (option) { return option.key; }).filter(Boolean)
        : ["get", "post"];
    }

    if (focusVisual.type === "terms") {
      return Array.isArray(focusVisual.items)
        ? focusVisual.items.map(function (item) { return item.key; }).filter(Boolean)
        : [];
    }

    (focusVisual.lineParts || ["method", "path"]).forEach(function (partName) {
      if (partName === "method") {
        keys.push(methodExplainKey(request && request.method));
      } else if (partName === "path") {
        keys.push("path");
      } else if (partName === "http-version") {
        keys.push("http-version");
      }
    });

    (focusVisual.headerParts || ["host"]).forEach(function (partName) {
      if (partName === "host") {
        keys.push("host");
      } else if (partName === "user-agent") {
        keys.push("user-agent");
      } else if (partName === "cookie") {
        keys.push("cookie");
      } else if (partName === "content-type") {
        keys.push("content-type");
      }
    });

    return Array.from(new Set(keys));
  }

  function focusExplanationForKey(key) {
    switch (key) {
      case "get":
        return "GET = ask for data.";
      case "post":
        return "POST = send data.";
      case "path":
        return "This is the page you want.";
      case "http-version":
        return "This is the HTTP version.";
      case "host":
        return "Host = which website.";
      case "user-agent":
        return "User-Agent = which browser.";
      case "cookie":
        return "Cookie = saved login info.";
      case "content-type":
        return "Content-Type = what kind of content.";
      case "set-cookie":
        return "Set-Cookie = save a new cookie.";
      case "cache-control":
        return "Cache-Control = reuse rules.";
      case "response-code":
        return "200 = it worked.";
      case "url":
        return "The browser starts with a web address.";
      case "request-card":
        return "The browser turns the URL into a request.";
      case "request-packet":
        return "That request travels as a packet.";
      case "response-packet":
        return "The server sends back a response packet.";
      case "https-packet":
        return "HTTPS hides the request while it travels.";
      case "http-packet":
        return "HTTP leaves the request readable on the path.";
      case "flow":
      default:
        return "Your browser asks a server for a page.";
    }
  }

  function focusMissFeedback(step, selectedKey) {
    const customMap = step && step.focusWrong ? step.focusWrong : null;
    if (customMap && customMap[selectedKey]) {
      return customMap[selectedKey];
    }

    switch (normalizeText(selectedKey)) {
      case "get":
        return "Close - GET is the action word.";
      case "post":
        return "Close - that would send data, not fetch it.";
      case "path":
        return "Close - that is the page name, not the action.";
      case "host":
        return "Close - that tells the request where to go.";
      case "cookie":
        return "Close - that is saved browser state.";
      case "content-type":
        return "Close - that describes the content format.";
      case "response-code":
        return "Close - that is the server result, not the request part.";
      case "off":
        return "Close - that would let the request pass straight through.";
      case "view-compact":
        return "Close - that keeps the smaller view.";
      case "http-packet":
        return "Close - that packet stays readable on the path.";
      case "url":
        return "Close - that is where the trip starts.";
      default:
        return "Close - that part does something different.";
    }
  }

  function shortScenario(text) {
    return truncateText(text, 92);
  }

  function truncateText(text, maxLength) {
    const source = String(text || "").replace(/\s+/g, " ").trim();

    if (!source) {
      return "";
    }

    if (source.length <= maxLength) {
      return source;
    }

    return source.slice(0, maxLength - 3).trimEnd() + "...";
  }

  function compactStepIntro(lesson, step, requestLab) {
    const lead = requestLab && requestLab.title ? requestLab.title : step.title;
    const body = requestLab && requestLab.prompt ? requestLab.prompt : lesson.scenarioIntro;
    return truncateText(lead + ". " + body, 170);
  }

  function compactConceptText(lesson, step, requestLab) {
    const concept = state.liveExplanation || step.explanation || lesson.explanation || lesson.scenarioIntro;
    const prefix = requestLab ? "Change the request, then watch what the server does. " : "";
    return truncateText(prefix + concept, 170);
  }

  function compactTaskPrompt(prompt) {
    return truncateText(prompt, 150);
  }

  function focusItemsFor(lesson, step, requestLab) {
    if (requestLab && Array.isArray(requestLab.focusFields) && requestLab.focusFields.length) {
      return requestLab.focusFields.slice(0, 4);
    }

    const interactionType = step && step.interaction ? step.interaction.type : "";
    const focus = [];

    if (interactionType === "field-check") {
      focus.push("Read the request line", "Check the response line");
    } else if (interactionType === "single-choice" || interactionType === "multi-select") {
      focus.push("Compare the visible evidence", "Pick the safest answer");
    } else if (interactionType === "proxy-control") {
      focus.push("Browser", "Proxy", "Server");
    } else if (interactionType === "spider-select") {
      focus.push("Discoverable pages", "Visible crawl clues");
    }

    if (lesson && Array.isArray(lesson.learningObjectives)) {
      lesson.learningObjectives.slice(0, 2).forEach(function (item) {
        focus.push(truncateText(item, 38));
      });
    }

    return uniqueNames(focus).slice(0, 4);
  }

  function unlockedLessonIndex() {
    const firstIncompleteIndex = state.lessons.findIndex(function (lesson) {
      return !state.completedLessons[lesson.id];
    });

    if (firstIncompleteIndex === -1) {
      return state.lessons.length - 1;
    }

    return Math.max(state.lessonIndex, firstIncompleteIndex);
  }

  function pathStatusLabel(lesson, index) {
    if (state.completedLessons[lesson.id]) {
      return "Completed";
    }

    if (index === state.lessonIndex) {
      return state.stepSolved && state.stepIndex === lesson.interactiveSteps.length - 1
        ? "Ready to unlock next"
        : "Current lesson";
    }

    if (index > unlockedLessonIndex()) {
      return "Locked until previous lesson is done";
    }

    return "Up next";
  }

  function renderDiagrams() {
    if (!els.flowDiagram || !els.requestDiagram) {
      return;
    }

    const scene = currentDiagramScene();
    const diagramChanged = uiState.diagramExplainKey !== (state.visualExplainKey || defaultVisualExplainKey(state.visualMode))
      || uiState.flowStep !== state.visualFlowStep;
    els.flowDiagram.innerHTML = buildFlowDiagram(scene);
    els.requestDiagram.innerHTML = buildRequestDiagram(scene);
    bindDiagramInteractions();

    if (diagramChanged) {
      runDiagramMotion();
    }

    uiState.diagramExplainKey = state.visualExplainKey || defaultVisualExplainKey(state.visualMode);
    uiState.flowStep = state.visualFlowStep;
  }

  function currentDiagramScene() {
    const workspace = state.currentWorkspace || {};
    const requestLab = currentRequestLab();

    // Lesson one stays visual-first by swapping in a teaching scene instead of the heavier request editor flow.
    if (isVisualBasicsLesson()) {
      return buildBasicsVisualScene(requestLab);
    }

    const request = requestLab && state.requestDraft
      ? requestFromDraft(state.requestDraft)
      : (workspace.request || null);

    return {
      request: request,
      response: workspace.response || null,
      browser: workspace.browser || {},
      proxy: normalizeProxyState(workspace.proxy || {}),
      cookies: Array.isArray(workspace.cookies) ? workspace.cookies : [],
      requestLab: requestLab,
      lesson: currentLesson(),
      step: currentStep(),
      isVisualBasics: false,
      visualMode: normalizeVisualMode(request ? request.method : "", currentStep())
    };
  }

  function isVisualBasicsLesson() {
    const lesson = currentLesson();
    return Boolean(lesson && lesson.id === "http-request-basics");
  }

  function isFocusedLesson() {
    const lesson = currentLesson();
    return Boolean(lesson);
  }

  function buildBasicsVisualScene(requestLab) {
    const lesson = state.lessons.find(function (item) {
      return item.id === "http-request-basics";
    });
    const stepId = state.visualMode === "post" ? "http-basics-post" : "http-basics-get";
    const step = lesson && Array.isArray(lesson.interactiveSteps)
      ? lesson.interactiveSteps.find(function (item) { return item.id === stepId; }) || lesson.interactiveSteps[0]
      : currentStep();
    const workspace = cloneData(step && step.workspace ? step.workspace : {});
    const request = cloneData(workspace.request || null);

    if (request && !getHeaderValue(request.headers, "User-Agent")) {
      setHeaderValue(request.headers, "User-Agent", "LabBrowser/5.1 (Student Edition)");
    }

    return {
      request: request,
      response: cloneData(workspace.response || null),
      browser: cloneData(workspace.browser || {}),
      proxy: normalizeProxyState(workspace.proxy || {}),
      cookies: Array.isArray(workspace.cookies) ? cloneData(workspace.cookies) : [],
      requestLab: requestLab,
      lesson: currentLesson(),
      step: currentStep(),
      isVisualBasics: true,
      visualMode: state.visualMode
    };
  }

  function normalizeProxyState(proxy) {
    return {
      status: proxy && proxy.status ? proxy.status : "Pass-through",
      note: proxy && proxy.note ? proxy.note : "The proxy can inspect traffic, or simply forward it untouched.",
      requestPaused: Boolean(proxy && proxy.requestPaused)
    };
  }

  function normalizeVisualMode(value, step) {
    const normalized = normalizeText(value);

    if (normalized === "get" || normalized === "post") {
      return normalized;
    }

    if (step && includesText(step.id, "post")) {
      return "post";
    }

    if (step && step.workspace && step.workspace.request && normalizeText(step.workspace.request.method) === "post") {
      return "post";
    }

    return "get";
  }

  function defaultVisualExplainKey(mode) {
    return normalizeText(mode) === "post" ? "post" : "get";
  }

  function clampVisualFlowStep(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return 0;
    }

    return Math.max(0, Math.min(Math.floor(numeric), 5));
  }

  function buildFlowDiagram(scene) {
    if (!scene.request) {
      return "<div class=\"http-empty-state\">Load a step to see the browser to server flow.</div>";
    }

    const stages = flowStagesForScene(scene);
    const arrows = flowArrowLabelsForScene(scene);
    const activeStageIndex = Math.max(0, Math.min(state.visualFlowStep, stages.length - 1));
    const currentStage = stages[activeStageIndex];

    const parts = [
      "<div class=\"http-visual-toolbar\">",
      scene.isVisualBasics ? buildVisualModeToggle(scene.visualMode) : "<div class=\"http-visual-mode-label\">Current example: " + escapeHtml(scene.request.method || "HTTP") + "</div>",
      "<div class=\"http-visual-controls\">",
      "<span class=\"http-chip\">Flow step " + (activeStageIndex + 1) + " of " + stages.length + "</span>",
      "<button type=\"button\" class=\"http-mini-action\" data-http-flow-action=\"next\"" + (activeStageIndex >= stages.length - 1 ? " disabled" : "") + ">Next Step</button>",
      "<button type=\"button\" class=\"http-mini-action\" data-http-flow-action=\"replay\">Replay Flow</button>",
      "<button type=\"button\" class=\"http-mini-action\" data-http-flow-action=\"reset\">Reset View</button>",
      "</div>",
      "</div>",
      "<div class=\"http-flow-track\">"
    ];

    stages.forEach(function (stage, index) {
      if (index > 0) {
        const arrowStateClass = index - 1 < activeStageIndex
          ? (index - 1 === activeStageIndex - 1 ? " is-active" : " is-complete")
          : "";
        parts.push(
          "<div class=\"http-flow-stage-arrow" + arrowStateClass + "\">" +
          "<span class=\"http-flow-stage-arrow-label\">" + escapeHtml(arrows[index - 1]) + "</span>" +
          "</div>"
        );
      }

      const nodeStateClass = index < activeStageIndex
        ? " is-complete"
        : index === activeStageIndex
          ? " is-active"
          : "";

      parts.push(
        "<article class=\"http-flow-stage " + escapeHtml(stage.accentClass) + nodeStateClass + "\">" +
        "<p class=\"http-flow-stage-title\">" + escapeHtml(stage.label) + "</p>" +
        "<p class=\"http-flow-stage-chip\">" + escapeHtml(stage.chip) + "</p>" +
        "</article>"
      );
    });

    parts.push("</div>");
    parts.push(
      "<div class=\"http-flow-stage-copy\">" +
      "<p class=\"http-mini-label\">Right now</p>" +
      "<p class=\"http-mini-copy\">" + escapeHtml(currentStage.copy) + "</p>" +
      "</div>"
    );

    return parts.join("");
  }

  function flowStagesForScene(scene) {
    const request = scene.request;
    const response = scene.response;
    const method = request && request.method ? request.method : "GET";

    return [
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
  */
  {
    id: "step-3-request-travel",
    step: 3,
    title: "Send the Request",
    meta: "Request leaves the browser",
    type: "transit",
    contextLead: "Once the browser finishes building the request, it sends that message across the network toward the server.",
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
