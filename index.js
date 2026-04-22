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
    els.quickStats = document.getElementById("hubQuickStats");
    els.cardProgressSlots = Array.from(document.querySelectorAll("[data-progress-slot]"));

    renderLoadingState();
    bindGlobalEvents();
    await NetlabApp.whenReady();
    renderAll();
  }

  function bindGlobalEvents() {
    window.addEventListener("netlab:authchange", renderAll);
    window.addEventListener("netlab:progresschange", renderAll);
    window.addEventListener("netlab:profilemetachange", renderAll);
  }

  function renderLoadingState() {
    if (els.accountPanel) {
      els.accountPanel.innerHTML = [
        "<p class=\"hub-account-label\">Account</p>",
        "<p class=\"hub-account-copy\">Checking session...</p>"
      ].join("");
    }

    if (els.resumePanel) {
      els.resumePanel.hidden = true;
      els.resumePanel.innerHTML = "";
    }
  }

  function renderAll() {
    renderQuickStats();
    renderAccountPanel();
    renderResumePanel();
    renderCardProgress();
  }

  function renderQuickStats() {
    if (!els.quickStats) {
      return;
    }

    const stats = NetlabApp.getDashboardStats();
    els.quickStats.innerHTML = [
      renderHeroStat("Coins", stats.coins),
      renderHeroStat("Labs Started", stats.startedSections),
      renderHeroStat("Items Complete", stats.completedItems)
    ].join("");
  }

  function renderHeroStat(label, value) {
    return [
      "<div class=\"hub-hero-stat\">",
      "  <span class=\"hub-hero-stat-value\">" + escapeHtml(String(value)) + "</span>",
      "  <span class=\"hub-hero-stat-label\">" + escapeHtml(label) + "</span>",
      "</div>"
    ].join("");
  }

  function renderAccountPanel() {
    if (!els.accountPanel) {
      return;
    }

    const profile = NetlabApp.getActiveProfile();
    const isGuest = profile.isGuest;

    els.accountPanel.innerHTML = [
      "<div class=\"hub-account-head\">",
      "  <div>",
      "    <p class=\"hub-account-label\">Account</p>",
      "    <h2 class=\"hub-account-title\">" + escapeHtml(isGuest ? "Guest Mode" : profile.label) + "</h2>",
      "    <p class=\"hub-account-copy\">" + escapeHtml(isGuest
        ? "You can use the app without an account. Sign in to save your progress across devices."
        : (profile.email || "Signed in. Progress sync is active for this account.")) + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges hub-account-badges\">",
      "  <span class=\"status-badge status-badge-blue\">" + escapeHtml(isGuest ? "No account required" : "Cloud sync active") + "</span>",
      "  <span class=\"status-badge\">" + escapeHtml(NetlabApp.getProgressStorageLabel()) + "</span>",
      "  <span class=\"status-badge\">" + escapeHtml("Coins: " + NetlabApp.getCoinsTotal()) + "</span>",
      "</div>",
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
        "<div class=\"app-shell-actions hub-account-actions\">",
        "  <button id=\"logInBtn\" class=\"app-action-btn hub-account-btn\" type=\"button\">Sign In</button>",
        "  <button id=\"signUpBtn\" class=\"app-action-btn app-action-btn-muted hub-account-btn\" type=\"button\">Sign Up</button>",
        "  <button id=\"soundToggleBtn\" class=\"app-action-btn app-action-btn-muted hub-account-btn\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
        "</div>"
      ].join("");
    }

    return [
      "<div class=\"app-shell-actions hub-account-actions\">",
      "  <button id=\"logOutBtn\" class=\"app-action-btn hub-account-btn\" type=\"button\">Log Out</button>",
      "  <button id=\"soundToggleBtn\" class=\"app-action-btn app-action-btn-muted hub-account-btn\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
      "</div>"
    ].join("");
  }

  function renderSignUpForm() {
    return [
      "<form id=\"signUpForm\" class=\"app-auth-form hub-account-form\">",
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
      "  <div class=\"app-shell-actions hub-account-actions\">",
      "    <button class=\"app-action-btn hub-account-btn\" type=\"submit\"" + (view.busy ? " disabled" : "") + ">Create Account</button>",
      "    <button id=\"cancelAuthBtn\" class=\"app-action-btn app-action-btn-muted hub-account-btn\" type=\"button\">Cancel</button>",
      "  </div>",
      "</form>"
    ].join("");
  }

  function renderLogInForm() {
    return [
      "<form id=\"logInForm\" class=\"app-auth-form hub-account-form\">",
      "  <label class=\"app-form-field\">",
      "    <span>Email</span>",
      "    <input id=\"logInEmail\" class=\"app-shell-input\" type=\"email\" autocomplete=\"email\" required>",
      "  </label>",
      "  <label class=\"app-form-field\">",
      "    <span>Password</span>",
      "    <input id=\"logInPassword\" class=\"app-shell-input\" type=\"password\" autocomplete=\"current-password\" required>",
      "  </label>",
      "  <div class=\"app-shell-actions hub-account-actions\">",
      "    <button class=\"app-action-btn hub-account-btn\" type=\"submit\"" + (view.busy ? " disabled" : "") + ">Log In</button>",
      "    <button id=\"cancelAuthBtn\" class=\"app-action-btn app-action-btn-muted hub-account-btn\" type=\"button\">Cancel</button>",
      "  </div>",
      "</form>"
    ].join("");
  }

  function bindAccountActions() {
    const signUpBtn = document.getElementById("signUpBtn");
    const logInBtn = document.getElementById("logInBtn");
    const logOutBtn = document.getElementById("logOutBtn");
    const soundToggleBtn = document.getElementById("soundToggleBtn");
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
          view.notice = "Signed out. Guest mode is active again.";
        }

        renderAll();
      });
    }

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener("click", function () {
        NetlabApp.setSoundEnabled(!NetlabApp.isSoundEnabled());
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
        const payload = {
          username: document.getElementById("signUpUsername").value,
          email: document.getElementById("signUpEmail").value,
          password: document.getElementById("signUpPassword").value
        };
        view.busy = true;
        view.error = "";
        view.notice = "";
        renderAccountPanel();

        const result = await NetlabApp.signUpProfile(payload);

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
        const payload = {
          email: document.getElementById("logInEmail").value,
          password: document.getElementById("logInPassword").value
        };
        view.busy = true;
        view.error = "";
        view.notice = "";
        renderAccountPanel();

        const result = await NetlabApp.logInProfile(payload);

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
      els.resumePanel.hidden = true;
      els.resumePanel.innerHTML = "";
      return;
    }

    els.resumePanel.hidden = false;
    const completion = formatCompletion(lastProgress);
    els.resumePanel.innerHTML = [
      "<div class=\"app-shell-head\">",
      "  <div>",
      "    <p class=\"app-shell-kicker\">Continue</p>",
      "    <h2>Continue Where You Left Off</h2>",
      "    <p class=\"app-shell-copy\">Last worked on: " + escapeHtml(lastProgress.sectionLabel + " - " + lastProgress.currentItemLabel) + "</p>",
      "  </div>",
      "</div>",
      "<div class=\"app-shell-badges\">",
      "  <span class=\"status-badge status-badge-blue\">" + escapeHtml(completion) + "</span>",
      "  <span class=\"status-badge\">" + escapeHtml(profile.label) + "</span>",
      (lastProgress.summaryText ? "  <span class=\"status-badge\">" + escapeHtml(lastProgress.summaryText) + "</span>" : ""),
      "</div>",
      "<div class=\"app-shell-actions\">",
      "  <a class=\"app-action-link\" href=\"" + escapeHtml(NetlabApp.buildSectionUrl(lastProgress.sectionId, "resume")) + "\">Resume</a>",
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
