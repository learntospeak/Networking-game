(function () {
  const NetlabApp = window.NetlabApp;

  if (!NetlabApp) {
    return;
  }

  const view = {
    authMode: "",
    error: "",
    notice: "",
    busy: false
  };

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    els.accountPanel = document.getElementById("hubAccountPanel");
    els.resumePanel = document.getElementById("hubResumePanel");
    els.cardProgressSlots = Array.from(document.querySelectorAll("[data-progress-slot]"));

    renderLoadingState();
    bindGlobalEvents();
    await NetlabApp.whenReady();
    renderAll();
  }

  function bindGlobalEvents() {
    window.addEventListener("netlab:authchange", renderAll);
    window.addEventListener("netlab:progresschange", renderAll);
  }

  function renderLoadingState() {
    if (els.accountPanel) {
      els.accountPanel.innerHTML = [
        "<div class=\"app-shell-head\">",
        "  <div>",
        "    <p class=\"app-shell-kicker\">Account</p>",
        "    <h2>Progress Profile</h2>",
        "    <p class=\"app-shell-copy\">Connecting to the account and progress service...</p>",
        "  </div>",
        "</div>"
      ].join("");
    }

    if (els.resumePanel) {
      els.resumePanel.innerHTML = [
        "<div class=\"app-shell-head\">",
        "  <div>",
        "    <p class=\"app-shell-kicker\">Resume</p>",
        "    <h2>Pick Up Later</h2>",
        "    <p class=\"app-shell-copy\">Loading saved progress...</p>",
        "  </div>",
        "</div>"
      ].join("");
    }
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
      "    <p class=\"app-shell-copy\">Use guest mode for browser-only progress, or sign in with Supabase email/password so progress follows your account.</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">" + escapeHtml(isGuest ? "Profile: Guest Mode" : "Profile: " + profile.label) + "</span>",
      "  <span class=\"status-badge\">" + escapeHtml(NetlabApp.getProgressStorageLabel()) + "</span>",
      (!isGuest && profile.email ? "  <span class=\"status-badge\">" + escapeHtml(profile.email) + "</span>" : ""),
      "</div>",
      "<p class=\"app-shell-note\">" + escapeHtml(NetlabApp.LOCAL_AUTH_NOTE) + "</p>",
      renderAuthActions(profile),
      view.authMode === "signup" ? renderSignUpForm() : "",
      view.authMode === "login" ? renderLogInForm() : "",
      view.notice ? "<p class=\"app-shell-note\">" + escapeHtml(view.notice) + "</p>" : "",
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
      "    <span>Display Name</span>",
      "    <input id=\"signUpUsername\" class=\"app-shell-input\" type=\"text\" autocomplete=\"nickname\">",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Email</span>",
      "    <input id=\"signUpEmail\" class=\"app-shell-input\" type=\"email\" autocomplete=\"email\" required>",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Password</span>",
      "    <input id=\"signUpPassword\" class=\"app-shell-input\" type=\"password\" autocomplete=\"new-password\" required>",
      "  </label>",
      "  <div class=\"app-shell-actions\">",
      "    <button class=\"app-action-btn\" type=\"submit\"" + (view.busy ? " disabled" : "") + ">Create Account</button>",
      "    <button id=\"cancelAuthBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Cancel</button>",
      "  </div>",
      "</form>"
    ].join("");
  }

  function renderLogInForm() {
    return [
      "<form id=\"logInForm\" class=\"app-auth-form\">",
      "  <label class=\"app-form-field\">",
      "    <span>Email</span>",
      "    <input id=\"logInEmail\" class=\"app-shell-input\" type=\"email\" autocomplete=\"email\" required>",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Password</span>",
      "    <input id=\"logInPassword\" class=\"app-shell-input\" type=\"password\" autocomplete=\"current-password\" required>",
      "  </label>",
      "  <div class=\"app-shell-actions\">",
      "    <button class=\"app-action-btn\" type=\"submit\"" + (view.busy ? " disabled" : "") + ">Log In</button>",
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
        view.notice = "";
        renderAccountPanel();
      });
    }

    if (logInBtn) {
      logInBtn.addEventListener("click", function () {
        view.authMode = "login";
        view.error = "";
        view.notice = "";
        renderAccountPanel();
      });
    }

    if (logOutBtn) {
      logOutBtn.addEventListener("click", async function () {
        view.busy = true;
        view.error = "";
        view.notice = "";
        renderAccountPanel();
        const result = await NetlabApp.logOutProfile();
        view.busy = false;

        if (!result.ok) {
          view.error = result.error || "Unable to log out right now.";
        } else {
          view.authMode = "";
          view.notice = "Signed out. Guest progress is now active on this browser.";
        }

        renderAll();
      });
    }

    if (cancelAuthBtn) {
      cancelAuthBtn.addEventListener("click", function () {
        view.authMode = "";
        view.error = "";
        view.notice = "";
        renderAccountPanel();
      });
    }

    if (signUpForm) {
      signUpForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        view.busy = true;
        view.error = "";
        view.notice = "";
        renderAccountPanel();

        const result = await NetlabApp.signUpProfile({
          username: document.getElementById("signUpUsername").value,
          email: document.getElementById("signUpEmail").value,
          password: document.getElementById("signUpPassword").value
        });

        view.busy = false;

        if (!result.ok) {
          view.error = result.error;
          renderAccountPanel();
          return;
        }

        view.notice = result.message || "Account created.";
        view.authMode = result.pendingConfirmation ? "login" : "";
        renderAll();
      });
    }

    if (logInForm) {
      logInForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        view.busy = true;
        view.error = "";
        view.notice = "";
        renderAccountPanel();

        const result = await NetlabApp.logInProfile({
          email: document.getElementById("logInEmail").value,
          password: document.getElementById("logInPassword").value
        });

        view.busy = false;

        if (!result.ok) {
          view.error = result.error;
          renderAccountPanel();
          return;
        }

        view.authMode = "";
        view.notice = "Signed in. Progress will now sync for this account.";
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
        "<p class=\"app-shell-note\">" + escapeHtml(NetlabApp.getProfileStorageNote()) + "</p>"
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
      "<p class=\"app-shell-note\">" + escapeHtml(NetlabApp.getProfileStorageNote()) + "</p>"
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
      if (!window.confirm("Clear all saved progress for the current profile?")) {
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
