(function () {
  const NetlabApp = window.NetlabApp;

  if (!NetlabApp) {
    return;
  }

  const view = {
    authMode: "",
    error: "",
    busy: false
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    els.accountPanel = document.getElementById("hubAccountPanel");
    els.resumePanel = document.getElementById("hubResumePanel");
    els.cardProgressSlots = Array.from(document.querySelectorAll("[data-progress-slot]"));

    renderAll();
    bindGlobalEvents();
  }

  function bindGlobalEvents() {
    window.addEventListener("netlab:authchange", renderAll);
    window.addEventListener("netlab:progresschange", renderAll);
  }

  function renderAll() {
    renderAccountPanel();
    renderResumePanel();
    renderCardProgress();
  }

  function renderAccountPanel() {
    if (!els.accountPanel) {
      return;
    }

    const profile = NetlabApp.getActiveProfile();
    const isGuest = profile.isGuest;

    els.accountPanel.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Account</p>",
      "    <h2>Progress Profile</h2>",
      "    <p class=\"app-shell-copy\">Use guest mode or create a local browser profile so progress can be kept in separate buckets until a real backend exists.</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">" + escapeHtml(isGuest ? "Profile: Guest Mode" : "Profile: " + profile.username) + "</span>",
      "  <span class=\"status-badge\">" + escapeHtml(isGuest ? "Local browser storage" : "Local-only sign-in scaffold") + "</span>",
      "</div>",
      "<p class=\"app-shell-note\">" + escapeHtml(NetlabApp.LOCAL_AUTH_NOTE) + "</p>",
      renderAuthActions(profile),
      view.authMode === "signup" ? renderSignUpForm() : "",
      view.authMode === "login" ? renderLogInForm() : "",
      view.error ? "<p class=\"app-shell-error\">" + escapeHtml(view.error) + "</p>" : ""
    ].join("");

    bindAccountActions();
  }

  function renderAuthActions(profile) {
    if (profile.isGuest) {
      return [
        "<div class=\"app-shell-actions\">",
        "  <button id=\"signUpBtn\" class=\"app-action-btn\" type=\"button\">Sign Up</button>",
        "  <button id=\"logInBtn\" class=\"app-action-btn\" type=\"button\">Log In</button>",
        "</div>"
      ].join("");
    }

    return [
      "<div class=\"app-shell-actions\">",
      "  <button id=\"logOutBtn\" class=\"app-action-btn\" type=\"button\">Log Out</button>",
      "</div>"
    ].join("");
  }

  function renderSignUpForm() {
    return [
      "<form id=\"signUpForm\" class=\"app-auth-form\">",
      "  <label class=\"app-form-field\">",
      "    <span>Username</span>",
      "    <input id=\"signUpUsername\" class=\"app-shell-input\" type=\"text\" autocomplete=\"username\">",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Email</span>",
      "    <input id=\"signUpEmail\" class=\"app-shell-input\" type=\"email\" autocomplete=\"email\">",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Password</span>",
      "    <input id=\"signUpPassword\" class=\"app-shell-input\" type=\"password\" autocomplete=\"new-password\">",
      "  </label>",
      "  <div class=\"app-shell-actions\">",
      "    <button class=\"app-action-btn\" type=\"submit\">Create Local Profile</button>",
      "    <button id=\"cancelAuthBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Cancel</button>",
      "  </div>",
      "</form>"
    ].join("");
  }

  function renderLogInForm() {
    return [
      "<form id=\"logInForm\" class=\"app-auth-form\">",
      "  <label class=\"app-form-field\">",
      "    <span>Username or Email</span>",
      "    <input id=\"logInIdentifier\" class=\"app-shell-input\" type=\"text\" autocomplete=\"username\">",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Password</span>",
      "    <input id=\"logInPassword\" class=\"app-shell-input\" type=\"password\" autocomplete=\"current-password\">",
      "  </label>",
      "  <div class=\"app-shell-actions\">",
      "    <button class=\"app-action-btn\" type=\"submit\">Log In</button>",
      "    <button id=\"cancelAuthBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Cancel</button>",
      "  </div>",
      "</form>"
    ].join("");
  }

  function bindAccountActions() {
    const signUpBtn = document.getElementById("signUpBtn");
    const logInBtn = document.getElementById("logInBtn");
    const logOutBtn = document.getElementById("logOutBtn");
    const cancelAuthBtn = document.getElementById("cancelAuthBtn");
    const signUpForm = document.getElementById("signUpForm");
    const logInForm = document.getElementById("logInForm");

    if (signUpBtn) {
      signUpBtn.addEventListener("click", function () {
        view.authMode = "signup";
        view.error = "";
        renderAccountPanel();
      });
    }

    if (logInBtn) {
      logInBtn.addEventListener("click", function () {
        view.authMode = "login";
        view.error = "";
        renderAccountPanel();
      });
    }

    if (logOutBtn) {
      logOutBtn.addEventListener("click", function () {
        NetlabApp.logOutLocalProfile();
        view.authMode = "";
        view.error = "";
        renderAll();
      });
    }

    if (cancelAuthBtn) {
      cancelAuthBtn.addEventListener("click", function () {
        view.authMode = "";
        view.error = "";
        renderAccountPanel();
      });
    }

    if (signUpForm) {
      signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        view.error = "";
        const result = await NetlabApp.signUpLocalProfile({
          username: document.getElementById("signUpUsername").value,
          email: document.getElementById("signUpEmail").value,
          password: document.getElementById("signUpPassword").value
        });

        if (!result.ok) {
          view.error = result.error;
          renderAccountPanel();
          return;
        }

        view.authMode = "";
        renderAll();
      });
    }

    if (logInForm) {
      logInForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        view.error = "";
        const result = await NetlabApp.logInLocalProfile({
          identifier: document.getElementById("logInIdentifier").value,
          password: document.getElementById("logInPassword").value
        });

        if (!result.ok) {
          view.error = result.error;
          renderAccountPanel();
          return;
        }

        view.authMode = "";
        renderAll();
      });
    }
  }

  function renderResumePanel() {
    if (!els.resumePanel) {
      return;
    }

    const profile = NetlabApp.getActiveProfile();
    const lastProgress = NetlabApp.getLastActiveProgress();

    if (!lastProgress) {
      els.resumePanel.innerHTML = [
        "<div class=\"app-shell-head\">",
        "  <div>",
        "    <p class=\"app-shell-kicker\">Resume</p>",
        "    <h2>Pick Up Later</h2>",
        "    <p class=\"app-shell-copy\">Saved progress will appear here for " + escapeHtml(profile.label) + " once you start working through a lab.</p>",
        "  </div>",
        "</div>",
        "<div class=\"app-shell-actions\">",
        "  <button id=\"resetActiveProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
        "</div>",
        "<p class=\"app-shell-note\">Reset Progress clears all saved lab progress for the current profile in this browser.</p>"
      ].join("");

      bindResetOnly();
      return;
    }

    const completion = formatCompletion(lastProgress);
    els.resumePanel.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Resume</p>",
      "    <h2>Continue Your Last Lab</h2>",
      "    <p class=\"app-shell-copy\">Last worked on: " + escapeHtml(lastProgress.sectionLabel + " - " + lastProgress.currentItemLabel) + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">" + escapeHtml(completion) + "</span>",
      (lastProgress.summaryText ? "  <span class=\"status-badge\">" + escapeHtml(lastProgress.summaryText) + "</span>" : ""),
      "</div>",
      "<div class=\"app-shell-actions\">",
      "  <a class=\"app-action-link\" href=\"" + escapeHtml(NetlabApp.buildSectionUrl(lastProgress.sectionId, "resume")) + "\">Resume Where You Left Off</a>",
      "  <button id=\"startOverLastBtn\" class=\"app-action-btn\" type=\"button\">Start Over</button>",
      "  <button id=\"resetActiveProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
      "</div>",
      "<p class=\"app-shell-note\">Progress is stored for " + escapeHtml(profile.label) + " in this browser only.</p>"
    ].join("");

    const startOverBtn = document.getElementById("startOverLastBtn");
    if (startOverBtn) {
      startOverBtn.addEventListener("click", function () {
        NetlabApp.resetSectionProgress(lastProgress.sectionId);
        window.location.href = NetlabApp.buildSectionUrl(lastProgress.sectionId, "start");
      });
    }

    bindResetOnly();
  }

  function bindResetOnly() {
    const resetBtn = document.getElementById("resetActiveProgressBtn");
    if (!resetBtn) {
      return;
    }

    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Clear all saved progress for the current profile on this browser?")) {
        return;
      }

      NetlabApp.clearActiveProfileProgress();
      renderAll();
    });
  }

  function renderCardProgress() {
    const progressMap = NetlabApp.getAllSectionProgress();
    const lastProgress = NetlabApp.getLastActiveProgress();

    els.cardProgressSlots.forEach(function (slot) {
      const sectionId = slot.dataset.progressSlot;
      const progress = progressMap[sectionId];
      const parentCard = slot.closest(".learning-path-card");

      if (parentCard) {
        parentCard.classList.toggle("is-last-active", Boolean(lastProgress && lastProgress.sectionId === sectionId));
      }

      if (!progress) {
        slot.textContent = "No saved progress yet.";
        return;
      }

      const parts = ["Last worked on: " + progress.currentItemLabel];
      parts.push(formatCompletion(progress));
      if (progress.summaryText) {
        parts.push(progress.summaryText);
      }

      slot.textContent = parts.join(" | ");
    });
  }

  function formatCompletion(progress) {
    if (progress.totalCount) {
      return "Completed: " + progress.completedCount + "/" + progress.totalCount;
    }

    return "Completed: " + progress.completedCount;
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
