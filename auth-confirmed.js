(function () {
  const NetlabApp = window.NetlabApp;

  const els = {};

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    els.kicker = document.getElementById("authConfirmKicker");
    els.title = document.getElementById("authConfirmTitle");
    els.copy = document.getElementById("authConfirmCopy");
    els.badges = document.getElementById("authConfirmBadges");
    els.banner = document.getElementById("authConfirmBanner");

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorDescription = hashParams.get("error_description");
    const confirmationType = hashParams.get("type");

    if (NetlabApp?.whenReady) {
      await NetlabApp.whenReady();
    }

    const profile = NetlabApp?.getActiveProfile ? NetlabApp.getActiveProfile() : null;
    const signedIn = Boolean(profile && !profile.isGuest);

    if (errorDescription) {
      renderState({
        kicker: "Account",
        title: "Confirmation Problem",
        copy: "The confirmation link returned an error. You can close this tab and try again from the original app.",
        badges: ["Email confirmation"],
        bannerTone: "error",
        bannerText: errorDescription
      });
      clearHash();
      return;
    }

    if (signedIn || confirmationType === "signup") {
      renderState({
        kicker: "Account",
        title: "Email Confirmed",
        copy: signedIn && profile.email
          ? "Your email for " + profile.email + " has been confirmed. You can close this tab and return to the app."
          : "Your email confirmation link was accepted. You can close this tab and return to the app.",
        badges: signedIn && profile.email ? [profile.email, "Confirmation complete"] : ["Confirmation complete"],
        bannerTone: "success",
        bannerText: "Confirmation finished. Go back to the original app tab and log in with your email address if needed."
      });
      clearHash();
      return;
    }

    renderState({
      kicker: "Account",
      title: "Confirmation Page Ready",
      copy: "This page is set up for Supabase email confirmation links. After confirming your email, close this tab and return to the app.",
      badges: ["Return to App"],
      bannerTone: "info",
      bannerText: "If you opened this page manually, go back to the app and use the confirmation email link instead."
    });
  }

  function renderState(config) {
    if (els.kicker) {
      els.kicker.textContent = config.kicker;
    }
    if (els.title) {
      els.title.textContent = config.title;
    }
    if (els.copy) {
      els.copy.textContent = config.copy;
    }
    if (els.badges) {
      els.badges.innerHTML = (config.badges || []).map(function (badge, index) {
        return "<span class=\"status-badge" + (index === 0 ? " status-badge-blue" : "") + "\">" + escapeHtml(badge) + "</span>";
      }).join("");
    }
    if (els.banner) {
      els.banner.className = "app-shell-banner app-shell-banner-" + (config.bannerTone || "info");
      els.banner.textContent = config.bannerText;
      els.banner.hidden = !config.bannerText;
    }
  }

  function clearHash() {
    if (!window.location.hash) {
      return;
    }

    const url = new URL(window.location.href);
    url.hash = "";
    window.history.replaceState({}, "", url.href);
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
