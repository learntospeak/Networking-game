(function () {
  const NetlabApp = window.NetlabApp;
  const SECTION_ID = "web-http-lab";
  const DEFAULT_FEEDBACK = "Use the request editor and Send Request to test the next step.";

  // Step-specific simulators let the lab stay modular while turning selected lessons into send-and-observe exercises.
  const REQUEST_LABS = {
    "http-basics-get": {
      title: "Fix the Featured Products Request",
      prompt:
        "The request is reaching the catalog, but not the featured list. Adjust the request and press Send Request until the featured products page loads.",
      successCondition:
        "Send GET /products?featured=1 with Host: catalog.orbit.lab.",
      idleFeedback:
        "The current request still asks for the wrong product view. Fix the query string, then send it again.",
      editorNote:
        "Focus on the request line first. The path is close, but the query string still controls which catalog view the server returns.",
      responseGuide:
        "Wrong method returns 405. Wrong path returns 404. GET /products?featured=1 returns 200 OK with the featured list.",
      focusFields: ["Method", "Path", "Query parameters", "Host"],
      hints: [
        "This is a page fetch, so leave the method as GET.",
        "The path should stay on /products.",
        "Set the featured query parameter to 1."
      ],
      editableHeaders: ["Host", "User-Agent", "Accept"],
      methodOptions: ["GET", "POST"],
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/products?featured=0",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "catalog.orbit.lab" },
            { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" },
            { name: "Accept", value: "text/html" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.request.method !== "GET") {
          return buildLabResult({
            response: methodNotAllowedResponse(["GET"]),
            browser: {
              note: "The server only exposes this route as a simple GET page."
            },
            feedback:
              "Switch back to GET. You are retrieving a page, not submitting data.",
            hintText: "Keep the method as GET, then check the path and query string."
          });
        }

        if (context.host !== "catalog.orbit.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The request did not identify catalog.orbit.lab as the target host."
            ),
            feedback:
              "The request still needs Host: catalog.orbit.lab so the server knows which site you want.",
            hintText: "Restore the Host header before changing anything else."
          });
        }

        if (context.pathname !== "/products") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The Orbit catalog does not serve this path."
            ),
            feedback:
              "The catalog page lives at /products. Bring the path back there first.",
            hintText: "Use /products as the path, then refine the query string."
          });
        }

        if (context.query.featured !== "1") {
          return buildLabResult({
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" },
              { name: "Cache-Control", value: "max-age=120" },
              { name: "Server", value: "OrbitLab/2.4" }
            ], [
              "<html>",
              "  <h1>Product Catalog</h1>",
              "  <p>Standard listing loaded. Featured items are not filtered yet.</p>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Orbit Catalog",
              note: "The request reached the catalog, but not the featured view yet."
            },
            cache: {
              status: "Fresh copy allowed",
              note: "This page can still be cached briefly, but it is the wrong view."
            },
            feedback:
              "Closer. The server answered, but you are still on the standard listing. Set featured=1 in the query string.",
            hintText: "The path is right. Only the query string still needs work."
          });
        }

        return buildLabResult({
          success: true,
          response: htmlResponse(200, "OK", [
            { name: "Content-Type", value: "text/html; charset=utf-8" },
            { name: "Cache-Control", value: "max-age=120" },
            { name: "Server", value: "OrbitLab/2.4" }
          ], [
            "<html>",
            "  <h1>Featured Products</h1>",
            "  <p>Orbit mug, field notebook, blue cable wrap.</p>",
            "</html>"
          ].join("\n")),
          browser: {
            title: "Orbit Catalog",
            note: "Featured products loaded after fixing the query string."
          },
          cache: {
            status: "Fresh copy allowed",
            note: "Cache-Control: max-age=120 allows the browser to reuse this page briefly."
          },
          feedback:
            "Good. The corrected GET request now loads the featured products page.",
          explanation:
            "GET asks for data, the path identifies the resource, and the query string refines which view of that resource the browser wants."
        });
      }
    },
    "http-basics-post-choice": {
      title: "Submit the Feedback Form",
      prompt:
        "The browser is still loading the feedback form. Turn the request into a real submission, then send it so the server creates a new feedback item.",
      successCondition:
        "Send POST /feedback with Content-Type application/x-www-form-urlencoded and both rating and comment fields.",
      idleFeedback:
        "This draft only loads the form page. Change it into a POST submission and send it.",
      editorNote:
        "This is where method, path, Content-Type, and body all start working together.",
      responseGuide:
        "GET /feedback/form only loads the form. POST /feedback with a valid form body returns 201 Created.",
      focusFields: ["Method", "Path", "Content-Type", "Body"],
      hints: [
        "The form page uses GET, but the submission should not.",
        "Send the form to /feedback, not /feedback/form.",
        "Use application/x-www-form-urlencoded and include both rating and comment."
      ],
      editableHeaders: ["Host", "Content-Type", "User-Agent"],
      methodOptions: ["GET", "POST"],
      showQuery: false,
      showBody: true,
      buildInitialRequest: function () {
        return {
          method: "GET",
          path: "/feedback/form",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "catalog.orbit.lab" },
            { name: "User-Agent", value: "LabBrowser/5.1 (Student Edition)" },
            { name: "Content-Type", value: "application/x-www-form-urlencoded" }
          ],
          body: ""
        };
      },
      simulate: function (context) {
        if (context.host !== "catalog.orbit.lab") {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The feedback service expects requests for catalog.orbit.lab."
            ),
            feedback:
              "The request still needs Host: catalog.orbit.lab before the server can process it.",
            hintText: "Restore the Host header first."
          });
        }

        if (context.request.method === "GET" && context.pathname === "/feedback/form") {
          return buildLabResult({
            response: htmlResponse(200, "OK", [
              { name: "Content-Type", value: "text/html; charset=utf-8" }
            ], [
              "<html>",
              "  <form action=\"/feedback\" method=\"post\">",
              "    <input name=\"rating\">",
              "    <textarea name=\"comment\"></textarea>",
              "  </form>",
              "</html>"
            ].join("\n")),
            browser: {
              title: "Orbit Feedback Form",
              note: "The browser is still loading the form, not submitting it."
            },
            feedback:
              "This only loads the form page. Change the method and target path so the browser submits the form instead.",
            hintText: "Switch to POST and send the form to /feedback."
          });
        }

        if (context.request.method !== "POST") {
          return buildLabResult({
            response: methodNotAllowedResponse(["POST"]),
            feedback:
              "Use POST here. This step is about sending form data to the server.",
            hintText: "POST is the common method for a form submission."
          });
        }

        if (context.pathname !== "/feedback") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The server only accepts feedback submissions on /feedback."
            ),
            feedback:
              "The submission endpoint should be /feedback, not " + context.pathname + ".",
            hintText: "Change the path to /feedback."
          });
        }

        if (!includesText(context.contentType, "application/x-www-form-urlencoded")) {
          return buildLabResult({
            response: errorHtmlResponse(
              415,
              "Unsupported Media Type",
              "The server expected a traditional form submission body."
            ),
            feedback:
              "The server still cannot parse the body. Use Content-Type: application/x-www-form-urlencoded.",
            hintText:
              "Traditional HTML form submissions usually use application/x-www-form-urlencoded."
          });
        }

        if (!context.bodyParams.rating || !context.bodyParams.comment) {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The rating or comment field is missing from the submitted form."
            ),
            feedback:
              "The submission still needs both rating and comment fields in the body.",
            hintText: "Try a body like rating=5&comment=clear+and+helpful."
          });
        }

        return buildLabResult({
          success: true,
          response: jsonResponse(201, "Created", [
            { name: "Location", value: "/feedback/418" }
          ], {
            message: "Feedback saved",
            id: 418,
            status: "queued"
          }),
          browser: {
            title: "Orbit Feedback Submit",
            note: "The server accepted the form submission and created a new feedback item."
          },
          cache: {
            status: "Do not reuse the POST body",
            note: "Browsers treat a form submission differently from a cached page view."
          },
          feedback:
            "Good. Changing the request into a POST submission produced 201 Created.",
          explanation:
            "POST is used here because the browser is sending form data in the request body instead of just asking for a page."
        });
      }
    },
    "http-basics-post-read": {
      title: "Repair the Broken POST",
      prompt:
        "This request is aimed at the right endpoint, but the server cannot parse it yet. Fix the body format and send it again.",
      successCondition:
        "Send POST /feedback with Content-Type application/x-www-form-urlencoded and both rating and comment fields.",
      idleFeedback:
        "The request is reaching /feedback, but the server still rejects the body format.",
      editorNote:
        "The endpoint is already correct. This step is really about Content-Type and the request body format.",
      responseGuide:
        "Unsupported body format returns 415. A valid form body returns 201 Created.",
      focusFields: ["Content-Type", "Body"],
      hints: [
        "Keep the request on POST /feedback.",
        "The body should be URL encoded rather than plain text lines.",
        "Try rating=5&comment=clear+and+helpful with application/x-www-form-urlencoded."
      ],
      editableHeaders: ["Host", "Content-Type"],
      methodOptions: ["POST", "GET"],
      showQuery: false,
      showBody: true,
      buildInitialRequest: function () {
        return {
          method: "POST",
          path: "/feedback",
          version: "HTTP/1.1",
          headers: [
            { name: "Host", value: "catalog.orbit.lab" },
            { name: "Content-Type", value: "text/plain" }
          ],
          body: "rating=5\ncomment=clear and helpful"
        };
      },
      simulate: function (context) {
        if (context.request.method !== "POST") {
          return buildLabResult({
            response: methodNotAllowedResponse(["POST"]),
            feedback:
              "Leave the request as POST. The server expects a form submission here.",
            hintText: "This endpoint should still use POST."
          });
        }

        if (context.pathname !== "/feedback") {
          return buildLabResult({
            response: errorHtmlResponse(
              404,
              "Not Found",
              "The feedback endpoint still needs /feedback as the path."
            ),
            feedback:
              "The path is part of the problem now. Put the request back on /feedback.",
            hintText: "Restore the path to /feedback before testing the body again."
          });
        }

        if (!includesText(context.contentType, "application/x-www-form-urlencoded")) {
          return buildLabResult({
            response: errorHtmlResponse(
              415,
              "Unsupported Media Type",
              "The server expected application/x-www-form-urlencoded."
            ),
            feedback:
              "The Content-Type still tells the server the wrong thing about the body.",
            hintText: "Use application/x-www-form-urlencoded."
          });
        }

        if (!context.bodyParams.rating || !context.bodyParams.comment) {
          return buildLabResult({
            response: errorHtmlResponse(
              400,
              "Bad Request",
              "The body reached the right endpoint, but the required fields are missing."
            ),
            feedback:
              "The body format is better, but the server still needs both rating and comment fields.",
            hintText: "Use a body like rating=5&comment=clear+and+helpful."
          });
        }

        return buildLabResult({
          success: true,
          response: jsonResponse(201, "Created", [
            { name: "Location", value: "/feedback/418" }
          ], {
            message: "Feedback saved",
            id: 418,
            status: "queued"
          }),
          browser: {
            title: "Orbit Feedback Submit",
            note: "The server can parse the repaired body format now."
          },
          cache: {
            status: "Do not reuse the POST body",
            note: "A valid POST was accepted and created a new record."
          },
          feedback:
            "Good. The repaired Content-Type and body format now produce 201 Created.",
          explanation:
            "The server needs the body format and the Content-Type header to agree so it knows how to parse the submitted fields."
        });
      }
    },
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
    resumePromptVisible: false
  };

  const els = {};
  let savedProgressRecord = null;

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
        liveExplanation: state.liveExplanation
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
    return step ? REQUEST_LABS[step.id] || null : null;
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
    renderLessonList();
    renderOverview();
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

    const workspace = state.currentWorkspace || {};
    const request = currentRequestLab() && state.requestDraft
      ? requestFromDraft(state.requestDraft)
      : (workspace.request || null);
    const response = workspace.response || null;
    const proxy = workspace.proxy || {};
    const cookies = Array.isArray(workspace.cookies) ? workspace.cookies : [];

    els.flowDiagram.innerHTML = buildFlowDiagram(request, response, proxy);
    els.requestDiagram.innerHTML = buildRequestDiagram(request, cookies, currentRequestLab());
  }

  function buildFlowDiagram(request, response, proxy) {
    if (!request) {
      return "<div class=\"http-empty-state\">Load a step to see the browser to server flow.</div>";
    }

    const showProxy = shouldShowProxy(proxy);
    const route = [
      "<div class=\"http-diagram-lane\">",
      buildFlowNode("Browser", truncateText(composeLabUrl(request, state.currentWorkspace?.browser?.url || "https://example.lab/"), 40), "is-browser"),
      "<div class=\"http-flow-arrow\">" + escapeHtml(truncateText(request.method + " " + request.path, 28)) + "</div>"
    ];

    if (showProxy) {
      route.push(buildFlowNode("Proxy", truncateText(proxy.status || "Interception", 28), "is-proxy"));
      route.push("<div class=\"http-flow-arrow\">" + escapeHtml(proxy.requestPaused ? "Held here" : "Forwarded") + "</div>");
    }

    route.push(buildFlowNode("Server", getHeaderValue(request.headers, "Host") || "target host", "is-server"));
    route.push("</div>");

    const responseText = response
      ? response.statusCode + " " + response.statusText
      : (proxy.requestPaused ? "No response yet" : "Waiting for send");

    route.push(
      "<div class=\"http-diagram-lane\">" +
      "<div class=\"http-flow-arrow\">" + escapeHtml(responseText) + "</div>" +
      buildFlowNode("Response", truncateText(responseSummaryText(currentRequestLab(), response, proxy), 48), "is-browser") +
      "</div>"
    );

    route.push("<p class=\"http-flow-caption\">" + escapeHtml(flowCaption(request, response, proxy)) + "</p>");
    return route.join("");
  }

  function buildFlowNode(label, copy, className) {
    return (
      "<div class=\"http-flow-node " + escapeHtml(className || "") + "\">" +
      "<span class=\"http-flow-node-label\">" + escapeHtml(label) + "</span>" +
      "<span class=\"http-flow-node-copy\">" + escapeHtml(copy || "") + "</span>" +
      "</div>"
    );
  }

  function buildRequestDiagram(request, cookies, requestLab) {
    if (!request) {
      return "<div class=\"http-empty-state\">The request anatomy appears once a step loads a request.</div>";
    }

    const pathParts = splitPath(request.path);
    const focusFields = requestLab && Array.isArray(requestLab.focusFields) ? requestLab.focusFields : [];
    const cookieHeader = getHeaderValue(request.headers, "Cookie");
    const contentType = getHeaderValue(request.headers, "Content-Type");
    const requestBody = String(request.body || "").trim();

    return [
      "<div class=\"http-request-line-diagram\">",
      buildRequestSegment(request.method || "GET", isFocusFieldHighlighted("Method", focusFields)),
      buildRequestSegment(pathParts.pathname || "/", isFocusFieldHighlighted("Path", focusFields) || isFocusFieldHighlighted("Query parameters", focusFields)),
      buildRequestSegment(pathParts.queryString ? "?" + pathParts.queryString : "No query", isFocusFieldHighlighted("Query parameters", focusFields)),
      buildRequestSegment(request.version || "HTTP/1.1", false),
      "</div>",
      "<div class=\"http-request-detail-grid\">",
      buildRequestDetailCard("Host header", getHeaderValue(request.headers, "Host") || "Not set", isFocusFieldHighlighted("Host", focusFields)),
      buildRequestDetailCard("Cookie header", cookieHeader || (cookies.length ? "Cookies available" : "No Cookie header"), isFocusFieldHighlighted("Cookie", focusFields)),
      buildRequestDetailCard("Content-Type", contentType || "No body type", isFocusFieldHighlighted("Content-Type", focusFields)),
      buildRequestDetailCard("Body", requestBody || "No request body", isFocusFieldHighlighted("Body", focusFields)),
      "</div>",
      "<p class=\"http-flow-caption\">" + escapeHtml(requestAnatomyCaption(request, requestLab, cookies)) + "</p>"
    ].join("");
  }

  function buildRequestSegment(value, isHighlight) {
    return "<span class=\"http-request-segment" + (isHighlight ? " is-highlight" : "") + "\">" + escapeHtml(value) + "</span>";
  }

  function buildRequestDetailCard(label, value, isHighlight) {
    return (
      "<article class=\"http-request-detail-card" + (isHighlight ? " is-highlight" : "") + "\">" +
      "<p class=\"http-request-detail-title\">" + escapeHtml(label) + "</p>" +
      "<p class=\"http-request-detail-copy\">" + escapeHtml(truncateText(value, 80)) + "</p>" +
      "</article>"
    );
  }

  function shouldShowProxy(proxy) {
    const status = normalizeText(proxy && proxy.status ? proxy.status : "");
    return Boolean(status && status !== "pass-through");
  }

  function isFocusFieldHighlighted(fieldName, focusFields) {
    return (focusFields || []).some(function (field) {
      const normalized = normalizeText(field);
      const target = normalizeText(fieldName);
      return normalized === target || normalized.indexOf(target) >= 0 || target.indexOf(normalized) >= 0;
    });
  }

  function flowCaption(request, response, proxy) {
    if (state.requestDirty) {
      return "You changed the request draft. Press Send Request to update the server response.";
    }

    if (proxy.requestPaused) {
      return "The request is paused at the proxy, so the server has not answered yet.";
    }

    if (!response) {
      return "The browser is ready, but the current step has not sent a request yet.";
    }

    return "The browser sent " + request.method + " " + request.path + " and the server replied with " + response.statusCode + " " + response.statusText + ".";
  }

  function requestAnatomyCaption(request, requestLab, cookies) {
    if (requestLab && Array.isArray(requestLab.focusFields) && requestLab.focusFields.length) {
      return "This step mainly cares about " + requestLab.focusFields.slice(0, 3).join(", ") + ".";
    }

    if (cookies.length) {
      return "Cookies ride inside the Cookie header, so the browser can carry state between requests.";
    }

    return "Read the method first, then the path, then the headers that give the server more context.";
  }

  function renderWorkspace() {
    const workspace = state.currentWorkspace || {};
    const requestLab = currentRequestLab();
    const request = requestLab && state.requestDraft ? requestFromDraft(state.requestDraft) : (workspace.request || null);
    const response = workspace.response || null;
    const browser = workspace.browser || {};
    const cookies = Array.isArray(workspace.cookies) ? workspace.cookies : [];
    const session = workspace.session || {};
    const cache = workspace.cache || {};
    const proxy = workspace.proxy || {};
    const discovery = workspace.discoverability || {};

    els.browserUrl.textContent = request ? composeLabUrl(request, browser.url || "https://example.lab/") : (browser.url || "https://example.lab/");
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

    renderRequestWorkbench(requestLab);
    renderRequestPreview(request, requestLab);

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

    els.responseSummary.textContent = responseSummaryText(requestLab, response, proxy);

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

  function renderRequestWorkbench(requestLab) {
    if (!requestLab || !state.requestDraft) {
      els.requestWorkbench.hidden = true;
      els.requestEditorFields.innerHTML = "";
      els.requestFocusFields.innerHTML = "";
      els.sendRequestBtn.disabled = true;
      els.resetRequestBtn.disabled = true;
      return;
    }

    els.requestWorkbench.hidden = false;
    els.sendRequestBtn.disabled = false;
    els.resetRequestBtn.disabled = false;
    els.sendRequestBtn.textContent = requestLab.sendLabel || "Send Request";
    els.requestWorkbenchNote.textContent = requestLab.editorNote;
    els.requestFocusFields.innerHTML = (requestLab.focusFields || [])
      .map(function (item) {
        return "<span class=\"http-chip\">" + escapeHtml(item) + "</span>";
      })
      .join("");

    els.requestEditorFields.innerHTML = "";

    const startLineSection = document.createElement("section");
    startLineSection.className = "http-request-section";
    startLineSection.appendChild(buildSectionHead("Request line", "Edit the method, path, and query string here."));

    const startLineGrid = document.createElement("div");
    startLineGrid.className = "http-request-field-grid";

    startLineGrid.appendChild(buildMethodField(requestLab));
    startLineGrid.appendChild(buildTextField("Path", state.requestDraft.pathname, function (value) {
      state.requestDraft.pathname = normalisePath(value);
      markRequestDraftChanged();
    }));

    if (requestLab.showQuery !== false) {
      const queryField = buildTextField("Query parameters", state.requestDraft.queryString, function (value) {
        state.requestDraft.queryString = normaliseQueryString(value);
        markRequestDraftChanged();
      }, "featured=1", true);
      startLineGrid.appendChild(queryField);
    }

    startLineSection.appendChild(startLineGrid);
    els.requestEditorFields.appendChild(startLineSection);

    const editableHeaders = uniqueNames(
      (requestLab.editableHeaders || []).concat((state.requestDraft.headers || []).map(function (header) {
        return header.name;
      }))
    );

    if (editableHeaders.length) {
      const headerSection = document.createElement("section");
      headerSection.className = "http-request-section";
      headerSection.appendChild(buildSectionHead("Headers", "Only the important beginner-friendly headers are editable in this lab."));

      const headerGrid = document.createElement("div");
      headerGrid.className = "http-request-field-grid";

      editableHeaders.forEach(function (headerName) {
        const field = buildTextField("Header: " + headerName, getHeaderValueFromDraft(state.requestDraft, headerName), function (value) {
          setDraftHeader(state.requestDraft, headerName, value);
          markRequestDraftChanged();
        }, headerName === "Cookie" ? "session=value" : "");
        headerGrid.appendChild(field);
      });

      headerSection.appendChild(headerGrid);
      els.requestEditorFields.appendChild(headerSection);
    }

    if (requestLab.showBody || state.requestDraft.method === "POST" || String(state.requestDraft.body || "").trim()) {
      const bodySection = document.createElement("section");
      bodySection.className = "http-request-section";
      bodySection.appendChild(buildSectionHead("Body", "Use a small training-safe request body when the method needs one."));
      bodySection.appendChild(buildTextAreaField("Request body", state.requestDraft.body, function (value) {
        state.requestDraft.body = value;
        markRequestDraftChanged();
      }, "rating=5&comment=clear+and+helpful"));
      els.requestEditorFields.appendChild(bodySection);
    }
  }

  function renderRequestPreview(request, requestLab) {
    els.requestBadge.textContent = request ? request.method + " " + request.path : "No request";
    els.requestBadge.className = "http-surface-pill good";
    els.requestPreviewNote.textContent = requestLab
      ? (state.requestDirty
        ? "Draft changed. Press Send Request to generate a new response."
        : "This preview matches the last sent request.")
      : "The request preview reflects the current lesson state.";
    els.requestRaw.textContent = request ? formatRequest(request) : "No request loaded yet.";
  }

  function renderCookies(cookies) {
    if (!cookies.length) {
      els.cookiesList.innerHTML = "<div class=\"http-empty-state\">No cookies are attached to this step.</div>";
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
    const requestLab = currentRequestLab();

    els.stepTitle.textContent = requestLab && requestLab.title ? requestLab.title : step.title;
    els.stepMeta.textContent = "Lesson " + (state.lessonIndex + 1) + " of " + state.lessons.length + " | Step " + (state.stepIndex + 1) + " of " + lesson.interactiveSteps.length;
    els.stepPrompt.textContent = compactTaskPrompt(requestLab && requestLab.prompt ? requestLab.prompt : step.prompt);
    els.successCondition.textContent = truncateText(requestLab && requestLab.successCondition ? requestLab.successCondition : step.successCondition, 130);
    els.feedbackText.textContent = truncateText(state.feedbackText, 150);
    els.stepExplanation.textContent = truncateText(state.liveExplanation || (state.stepSolved ? step.explanation : lesson.explanation), 150);
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
    const requestLab = currentRequestLab();

    if (requestLab) {
      renderRequestLabGuidance(step, requestLab);
      return;
    }

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

  function renderRequestLabGuidance(step, requestLab) {
    els.answerTitle.textContent = requestLab.title || step.title;
    els.answerSubtitle.textContent = "Change the request, press Send, then compare the result.";
    els.interactionBody.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "http-lab-guidance";

    const intro = document.createElement("p");
    intro.className = "http-answer-copy";
    intro.textContent = truncateText(requestLab.editorNote, 140);
    wrapper.appendChild(intro);

    if (requestLab.responseGuide) {
      wrapper.appendChild(buildGuidanceCallout("Response logic", truncateText(requestLab.responseGuide, 140)));
    }

    if (requestLab.focusFields && requestLab.focusFields.length) {
      const fieldsCallout = document.createElement("div");
      fieldsCallout.className = "http-callout";
      fieldsCallout.innerHTML =
        "<p class=\"http-mini-label\">Important fields</p>" +
        "<div class=\"http-summary-chips\">" +
        requestLab.focusFields.map(function (item) {
          return "<span class=\"http-chip\">" + escapeHtml(item) + "</span>";
        }).join("") +
        "</div>";
      wrapper.appendChild(fieldsCallout);
    }

    wrapper.appendChild(buildGuidanceCallout("Current goal", requestLab.successCondition || step.successCondition));

    if (state.requestDirty) {
      wrapper.appendChild(buildGuidanceCallout("Draft status", "The request draft changed. Send it to see a new response."));
    }

    els.interactionBody.appendChild(wrapper);
  }

  function renderFieldInteraction(step, interaction) {
    const wrapper = document.createElement("div");
    wrapper.className = "http-input-grid";

    const intro = document.createElement("p");
    intro.className = "http-answer-copy";
    intro.textContent = interaction.type === "request-editor"
      ? "Edit the safe training field below, then replay the request."
      : "Use the visible request and response details to fill the blanks.";
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
      ? "Select every option that matches the evidence, then submit."
      : "Choose the best answer for this step, then submit.";
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

  function buildMethodField(requestLab) {
    const group = document.createElement("div");
    group.className = "http-field-group";

    const label = document.createElement("label");
    label.textContent = "HTTP method";

    const select = document.createElement("select");
    const methods = requestLab.methodOptions && requestLab.methodOptions.length
      ? requestLab.methodOptions
      : ["GET", "POST"];

    methods.forEach(function (method) {
      const option = document.createElement("option");
      option.value = method;
      option.textContent = method;
      option.selected = state.requestDraft.method === method;
      select.appendChild(option);
    });

    if (methods.length === 1) {
      select.disabled = true;
    }

    select.addEventListener("change", function (event) {
      state.requestDraft.method = event.target.value;
      markRequestDraftChanged();
      renderWorkspace();
      renderInteraction();
    });

    group.appendChild(label);
    group.appendChild(select);
    return group;
  }

  function buildTextField(labelText, value, onInput, placeholder, fullWidth) {
    const group = document.createElement("div");
    group.className = "http-field-group" + (fullWidth ? " http-field-group-full" : "");

    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = placeholder || "";
    input.value = value || "";
    input.addEventListener("input", function (event) {
      onInput(event.target.value);
      syncRequestDraftPreview();
    });

    group.appendChild(label);
    group.appendChild(input);
    return group;
  }

  function buildTextAreaField(labelText, value, onInput, placeholder) {
    const group = document.createElement("div");
    group.className = "http-field-group";

    const label = document.createElement("label");
    label.textContent = labelText;

    const input = document.createElement("textarea");
    input.placeholder = placeholder || "";
    input.value = value || "";
    input.addEventListener("input", function (event) {
      onInput(event.target.value);
      syncRequestDraftPreview();
    });

    group.appendChild(label);
    group.appendChild(input);
    return group;
  }

  function buildSectionHead(title, copy) {
    const head = document.createElement("div");
    head.className = "http-request-section-head";
    head.innerHTML =
      "<p class=\"http-request-section-title\">" + escapeHtml(title) + "</p>" +
      "<p class=\"http-mini-copy\">" + escapeHtml(copy) + "</p>";
    return head;
  }

  function buildGuidanceCallout(label, copy) {
    const callout = document.createElement("div");
    callout.className = "http-callout";
    callout.innerHTML =
      "<p class=\"http-mini-label\">" + escapeHtml(label) + "</p>" +
      "<p class=\"http-mini-copy\">" + escapeHtml(copy) + "</p>";
    return callout;
  }

  function sendCurrentRequest() {
    const requestLab = currentRequestLab();
    const step = currentStep();

    if (!requestLab || !step) {
      return;
    }

    const result = requestLab.simulate(createRequestLabContext(step, requestLab));
    const wasSolved = state.stepSolved;

    applyRequestResultToWorkspace(result, step);
    state.lastSentRequest = cloneData(state.currentWorkspace.request);
    state.requestDirty = false;
    state.liveExplanation = result.explanation || "";

    if (result.success) {
      state.feedbackTone = "success";
      state.feedbackText = result.feedback || step.feedback;
      state.hintText = result.hintText || completedHint(step, requestLab);

      if (!wasSolved) {
        state.stepSolved = true;
        if (state.stepIndex === currentLesson().interactiveSteps.length - 1) {
          const lesson = currentLesson();
          const alreadyCompleted = Boolean(state.completedLessons[lesson.id]);
          state.completedLessons[lesson.id] = true;
          awardLessonCompletionIfNeeded(lesson, alreadyCompleted);
        }
        persistProgress();
      }
    } else {
      state.feedbackTone = "warning";
      state.feedbackText = result.feedback || "That request still needs more work.";
      if (result.hintText) {
        state.hintText = result.hintText;
      }
      if (!wasSolved) {
        state.stepSolved = false;
      }
    }

    render();
  }

  function resetCurrentRequestDraft() {
    if (!currentRequestLab()) {
      return;
    }

    resetStepRuntime();
    persistProgress();
    render();
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
    persistProgress();
    renderTask();
  }

  function markSuccess(step, message) {
    state.stepSolved = true;
    state.feedbackTone = "success";
    state.feedbackText = message;
    state.hintText = completedHint(step, currentRequestLab());
    state.liveExplanation = "";

    if (step.workspaceAfterSuccess) {
      state.currentWorkspace = cloneData(step.workspaceAfterSuccess);
    }

    const lesson = currentLesson();
    if (state.stepIndex === lesson.interactiveSteps.length - 1) {
      const alreadyCompleted = Boolean(state.completedLessons[lesson.id]);
      state.completedLessons[lesson.id] = true;
      awardLessonCompletionIfNeeded(lesson, alreadyCompleted);
    }

    persistProgress();
    render();
  }

  function showHint() {
    const step = currentStep();
    const hints = activeHints(step, currentRequestLab());

    if (!hints.length) {
      state.hintText = "No hints are configured for this step.";
      renderTask();
      return;
    }

    const nextHintIndex = Math.min(state.hintIndex, hints.length - 1);
    state.hintText = hints[nextHintIndex];
    state.hintIndex = Math.min(state.hintIndex + 1, hints.length);
    persistProgress();
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
    persistProgress();
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
    return nextLesson ? "Next Lesson" : "Replay Lesson";
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

  function completedHint(step, requestLab) {
    if (requestLab && requestLab.completedHint) {
      return requestLab.completedHint;
    }

    const hints = activeHints(step, requestLab);
    if (state.stepIndex === currentLesson().interactiveSteps.length - 1) {
      return "Lesson complete. Continue when you are ready for the next lesson.";
    }

    if (hints.length) {
      return hints[hints.length - 1];
    }

    return "Step complete. Continue when you are ready.";
  }

  function activeHints(step, requestLab) {
    if (requestLab && Array.isArray(requestLab.hints) && requestLab.hints.length) {
      return requestLab.hints;
    }

    return Array.isArray(step.hints) ? step.hints : [];
  }

  function responseSummaryText(requestLab, response, proxy) {
    if (!requestLab) {
      return response
        ? "The response panel shows the current lesson state."
        : proxy.requestPaused
          ? "The response is empty because the proxy is holding the request."
          : "No response is shown for this step.";
    }

    if (state.requestDirty) {
      return "The request draft changed. Press Send Request to generate a new response.";
    }

    if (!response) {
      return proxy.requestPaused
        ? "The request is still paused at the proxy, so no response exists yet."
        : "No response has been generated for the current draft yet.";
    }

    return "This response came from the last request you sent from the workbench.";
  }

  function createRequestLabContext(step, requestLab) {
    const request = requestFromDraft(state.requestDraft);

    return {
      step: step,
      requestLab: requestLab,
      request: request,
      pathname: splitPath(request.path).pathname,
      queryString: splitPath(request.path).queryString,
      query: parseParameterString(splitPath(request.path).queryString),
      host: getHeaderValue(request.headers, "Host"),
      contentType: getHeaderValue(request.headers, "Content-Type"),
      userAgent: getHeaderValue(request.headers, "User-Agent"),
      cookies: parseCookieHeader(getHeaderValue(request.headers, "Cookie")),
      bodyParams: parseRequestBody(request.body, getHeaderValue(request.headers, "Content-Type")),
      workspace: cloneData(state.currentWorkspace),
      baseWorkspace: cloneData(step.workspace),
      lastSentRequest: cloneData(state.lastSentRequest)
    };
  }

  function applyRequestResultToWorkspace(result, step) {
    // Each simulator returns only the parts of workspace state it changed, so merge onto the current lesson view.
    const nextWorkspace = cloneData(state.currentWorkspace || step.workspace || {});
    const request = result.request ? cloneData(result.request) : requestFromDraft(state.requestDraft);

    nextWorkspace.request = request;
    nextWorkspace.browser = mergeObjects(nextWorkspace.browser, result.browser || {});
    nextWorkspace.browser.url = nextWorkspace.browser.url || composeLabUrl(request, step.workspace && step.workspace.browser && step.workspace.browser.url);

    if (Object.prototype.hasOwnProperty.call(result, "response")) {
      nextWorkspace.response = cloneData(result.response);
    }

    if (Object.prototype.hasOwnProperty.call(result, "cookies")) {
      nextWorkspace.cookies = cloneData(result.cookies);
    }

    if (Object.prototype.hasOwnProperty.call(result, "session")) {
      nextWorkspace.session = cloneData(result.session);
    }

    if (Object.prototype.hasOwnProperty.call(result, "cache")) {
      nextWorkspace.cache = cloneData(result.cache);
    }

    if (Object.prototype.hasOwnProperty.call(result, "proxy")) {
      nextWorkspace.proxy = cloneData(result.proxy);
    }

    if (Object.prototype.hasOwnProperty.call(result, "discoverability")) {
      nextWorkspace.discoverability = cloneData(result.discoverability);
    }

    state.currentWorkspace = nextWorkspace;
  }

  function markRequestDraftChanged() {
    state.requestDirty = true;
  }

  function syncRequestDraftPreview() {
    renderRequestPreview(requestFromDraft(state.requestDraft), currentRequestLab());
    els.browserUrl.textContent = composeLabUrl(
      requestFromDraft(state.requestDraft),
      state.currentWorkspace && state.currentWorkspace.browser && state.currentWorkspace.browser.url
        ? state.currentWorkspace.browser.url
        : "https://example.lab/"
    );
    els.responseSummary.textContent = responseSummaryText(currentRequestLab(), state.currentWorkspace && state.currentWorkspace.response, state.currentWorkspace && state.currentWorkspace.proxy ? state.currentWorkspace.proxy : {});
    renderDiagrams();
  }

  function draftFromRequest(request) {
    const pathParts = splitPath(request.path || "/");
    return {
      method: request.method || "GET",
      pathname: pathParts.pathname,
      queryString: pathParts.queryString,
      version: request.version || "HTTP/1.1",
      headers: cloneData(request.headers || []),
      body: request.body || ""
    };
  }

  function requestFromDraft(draft) {
    const path = buildPath(draft.pathname, draft.queryString);
    const headers = normaliseHeaders(cloneData(draft.headers || []), draft.method, draft.body);
    return {
      method: draft.method || "GET",
      path: path,
      version: draft.version || "HTTP/1.1",
      headers: headers,
      body: draft.body || ""
    };
  }

  function buildPath(pathname, queryString) {
    const safePath = normalisePath(pathname);
    const safeQuery = normaliseQueryString(queryString);
    return safeQuery ? safePath + "?" + safeQuery : safePath;
  }

  function splitPath(path) {
    const source = String(path || "/");
    const separatorIndex = source.indexOf("?");
    if (separatorIndex === -1) {
      return {
        pathname: normalisePath(source),
        queryString: ""
      };
    }

    return {
      pathname: normalisePath(source.slice(0, separatorIndex)),
      queryString: normaliseQueryString(source.slice(separatorIndex + 1))
    };
  }

  function normalisePath(pathname) {
    const raw = String(pathname || "").trim();
    if (!raw) {
      return "/";
    }

    return raw.startsWith("/") ? raw : "/" + raw;
  }

  function normaliseQueryString(queryString) {
    const raw = String(queryString || "").trim();
    if (!raw) {
      return "";
    }

    return raw.replace(/^\?+/, "");
  }

  function normaliseHeaders(headers, method, body) {
    const cleaned = headers
      .filter(function (header) {
        return header && String(header.name || "").trim();
      })
      .map(function (header) {
        return {
          name: String(header.name).trim(),
          value: String(header.value || "").trim()
        };
      })
      .filter(function (header) {
        return header.value !== "";
      });

    if (body && method === "POST") {
      setHeaderValue(cleaned, "Content-Length", String(body.length));
    } else {
      removeHeader(cleaned, "Content-Length");
    }

    return cleaned;
  }

  function getHeaderValue(headers, name) {
    const header = (headers || []).find(function (entry) {
      return normalizeText(entry.name) === normalizeText(name);
    });

    return header ? String(header.value || "") : "";
  }

  function getHeaderValueFromDraft(draft, name) {
    return getHeaderValue(draft.headers || [], name);
  }

  function setDraftHeader(draft, name, value) {
    setHeaderValue(draft.headers, name, value);
  }

  function setHeaderValue(headers, name, value) {
    const existing = (headers || []).find(function (header) {
      return normalizeText(header.name) === normalizeText(name);
    });

    if (!String(value || "").trim()) {
      removeHeader(headers, name);
      return;
    }

    if (existing) {
      existing.value = value;
      return;
    }

    headers.push({ name: name, value: value });
  }

  function removeHeader(headers, name) {
    const index = (headers || []).findIndex(function (header) {
      return normalizeText(header.name) === normalizeText(name);
    });

    if (index >= 0) {
      headers.splice(index, 1);
    }
  }

  function parseCookieHeader(cookieHeader) {
    const cookies = {};
    const source = String(cookieHeader || "").trim();

    if (!source) {
      return cookies;
    }

    source.split(";").forEach(function (part) {
      const segments = part.split("=");
      const name = segments.shift();
      if (!name) {
        return;
      }

      cookies[name.trim()] = segments.join("=").trim();
    });

    return cookies;
  }

  function parseParameterString(input) {
    const params = {};
    const search = String(input || "");
    const searchParams = new URLSearchParams(search);
    searchParams.forEach(function (value, key) {
      params[key] = value;
    });
    return params;
  }

  function parseRequestBody(body, contentType) {
    if (!includesText(contentType, "application/x-www-form-urlencoded")) {
      return {};
    }

    return parseParameterString(body);
  }

  function composeLabUrl(request, fallbackUrl) {
    const host = getHeaderValue(request.headers, "Host") || hostFromUrl(fallbackUrl) || "example.lab";
    const origin = originFromUrl(fallbackUrl) || "https://";
    return origin + host + request.path;
  }

  function hostFromUrl(url) {
    try {
      return new URL(url).host;
    } catch (error) {
      return "";
    }
  }

  function originFromUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.protocol + "//";
    } catch (error) {
      return "https://";
    }
  }

  function buildLabResult(result) {
    return result;
  }

  function htmlResponse(statusCode, statusText, headers, body) {
    return {
      statusCode: statusCode,
      statusText: statusText,
      headers: headers,
      body: body
    };
  }

  function jsonResponse(statusCode, statusText, headers, data) {
    return {
      statusCode: statusCode,
      statusText: statusText,
      headers: [{ name: "Content-Type", value: "application/json" }].concat(headers || []),
      body: JSON.stringify(data, null, 2)
    };
  }

  function redirectResponse(location, extraHeaders) {
    return {
      statusCode: 302,
      statusText: "Found",
      headers: [{ name: "Location", value: location }].concat(extraHeaders || []),
      body: ""
    };
  }

  function errorHtmlResponse(statusCode, statusText, message) {
    return {
      statusCode: statusCode,
      statusText: statusText,
      headers: [
        { name: "Content-Type", value: "text/html; charset=utf-8" }
      ],
      body: [
        "<html>",
        "  <h1>" + statusCode + " " + statusText + "</h1>",
        "  <p>" + message + "</p>",
        "</html>"
      ].join("\n")
    };
  }

  function methodNotAllowedResponse(allowedMethods) {
    return {
      statusCode: 405,
      statusText: "Method Not Allowed",
      headers: [
        { name: "Allow", value: allowedMethods.join(", ") },
        { name: "Content-Type", value: "text/html; charset=utf-8" }
      ],
      body: [
        "<html>",
        "  <h1>405 Method Not Allowed</h1>",
        "  <p>This route expects " + allowedMethods.join(" or ") + ".</p>",
        "</html>"
      ].join("\n")
    };
  }

  function mergeObjects(base, override) {
    return Object.assign({}, base || {}, override || {});
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

  function uniqueNames(values) {
    const seen = new Set();
    return values.filter(function (value) {
      const normalised = normalizeText(value);
      if (!normalised || seen.has(normalised)) {
        return false;
      }
      seen.add(normalised);
      return true;
    });
  }

  function includesText(source, target) {
    return normalizeText(source).indexOf(normalizeText(target)) >= 0;
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
