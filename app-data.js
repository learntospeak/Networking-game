(function () {
  // The current app is front-end only, so auth and progress both live in browser storage.
  // These helpers keep the storage shape stable so a future backend can replace the CRUD calls
  // without forcing every lab page to redesign its own progress model.
  const AUTH_STORAGE_KEY = "netlab-local-auth-v1";
  const PROGRESS_STORAGE_KEY = "netlab-progress-v1";
  const GUEST_PROFILE_ID = "guest";
  const LOCAL_AUTH_NOTE = "Local-only profile scaffolding. Profiles and progress stay in this browser until a real backend is added.";

  const SECTION_DEFS = {
    "subnetting-lab": {
      label: "Subnetting Lab",
      href: "./subnetting-lab.html"
    },
    "linux-terminal": {
      label: "Linux Terminal Lab",
      href: "./terminal-coach.html?track=linux"
    },
    "windows-terminal": {
      label: "Windows Terminal Lab",
      href: "./terminal-coach.html?track=windows"
    },
    "cisco-cli": {
      label: "Cisco CLI Lab",
      href: "./cisco-cli-lab.html"
    },
    "web-http-lab": {
      label: "Web & HTTP Lab",
      href: "./web-http-lab.html"
    },
    "cyber-challenge": {
      label: "Cyber Challenge Mode",
      href: "./challenge-mode.html"
    },
    "protocol-lab": {
      label: "Protocol Lab",
      href: "./protocol-merge.html"
    }
  };

  function clone(value) {
    if (value === undefined || value === null) {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }

  function loadJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function saveJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function normalizeAuthStore(store) {
    return {
      version: 1,
      mode: "local-mock",
      currentProfileId: typeof store?.currentProfileId === "string" ? store.currentProfileId : "",
      profiles: Array.isArray(store?.profiles) ? store.profiles : []
    };
  }

  function normalizeProgressStore(store) {
    return {
      version: 1,
      byProfile: store?.byProfile && typeof store.byProfile === "object" ? store.byProfile : {}
    };
  }

  function readAuthStore() {
    return normalizeAuthStore(loadJson(AUTH_STORAGE_KEY, {}));
  }

  function writeAuthStore(store) {
    saveJson(AUTH_STORAGE_KEY, normalizeAuthStore(store));
  }

  function readProgressStore() {
    return normalizeProgressStore(loadJson(PROGRESS_STORAGE_KEY, {}));
  }

  function writeProgressStore(store) {
    saveJson(PROGRESS_STORAGE_KEY, normalizeProgressStore(store));
  }

  function guestProfile() {
    return {
      id: GUEST_PROFILE_ID,
      username: "Guest",
      email: "",
      label: "Guest Mode",
      authType: "local-mock",
      isGuest: true
    };
  }

  function sanitizeProfile(profile) {
    if (!profile) {
      return guestProfile();
    }

    return {
      id: profile.id,
      username: profile.username,
      email: profile.email || "",
      label: profile.username,
      authType: profile.authType || "local-mock",
      isGuest: false
    };
  }

  function getActiveProfile() {
    const store = readAuthStore();
    const profile = store.profiles.find(function (item) {
      return item.id === store.currentProfileId;
    });

    return profile ? sanitizeProfile(profile) : guestProfile();
  }

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function ensureProfileBucket(store, profileId) {
    if (!store.byProfile[profileId]) {
      store.byProfile[profileId] = {
        lastActiveSectionId: "",
        lastUpdatedAt: 0,
        sections: {}
      };
    }

    return store.byProfile[profileId];
  }

  function getActiveBucket(store) {
    const profile = getActiveProfile();
    return ensureProfileBucket(store, profile.id);
  }

  function normaliseNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function normaliseProgressRecord(sectionId, payload) {
    const section = SECTION_DEFS[sectionId] || {};
    return {
      sectionId: sectionId,
      sectionLabel: payload.sectionLabel || section.label || sectionId,
      href: payload.href || section.href || "./index.html",
      currentItemId: payload.currentItemId || "",
      currentItemLabel: payload.currentItemLabel || "Not started",
      completedCount: normaliseNumber(payload.completedCount),
      totalCount: Number.isFinite(Number(payload.totalCount)) ? Number(payload.totalCount) : null,
      summaryText: payload.summaryText || "",
      updatedAt: normaliseNumber(payload.updatedAt) || Date.now(),
      state: clone(payload.state || null)
    };
  }

  async function hashPassword(password) {
    // This is only a local profile gate for a static app. Real authentication still needs a backend.
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("This browser does not support local password hashing.");
    }

    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map(function (value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }

  function findProfileByIdentifier(store, identifier) {
    const needle = String(identifier || "").trim().toLowerCase();
    return store.profiles.find(function (profile) {
      return String(profile.username || "").trim().toLowerCase() === needle
        || String(profile.email || "").trim().toLowerCase() === needle;
    });
  }

  async function signUpLocalProfile(payload) {
    const username = String(payload?.username || "").trim();
    const email = String(payload?.email || "").trim();
    const password = String(payload?.password || "");
    const store = readAuthStore();

    if (!username) {
      return { ok: false, error: "Enter a username." };
    }

    if (!email) {
      return { ok: false, error: "Enter an email address." };
    }

    if (password.length < 6) {
      return { ok: false, error: "Use at least 6 characters for the local profile password." };
    }

    if (findProfileByIdentifier(store, username)) {
      return { ok: false, error: "That username is already in use on this browser." };
    }

    if (findProfileByIdentifier(store, email)) {
      return { ok: false, error: "That email is already in use on this browser." };
    }

    const profile = {
      id: "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      username: username,
      email: email,
      passwordHash: await hashPassword(password),
      authType: "local-mock",
      createdAt: Date.now()
    };

    store.profiles.push(profile);
    store.currentProfileId = profile.id;
    writeAuthStore(store);
    emit("netlab:authchange", { profile: sanitizeProfile(profile) });

    return { ok: true, profile: sanitizeProfile(profile) };
  }

  async function logInLocalProfile(payload) {
    const identifier = String(payload?.identifier || "").trim();
    const password = String(payload?.password || "");
    const store = readAuthStore();

    if (!identifier || !password) {
      return { ok: false, error: "Enter both your username/email and password." };
    }

    const profile = findProfileByIdentifier(store, identifier);
    if (!profile) {
      return { ok: false, error: "No local profile matches that username or email." };
    }

    const passwordHash = await hashPassword(password);
    if (profile.passwordHash !== passwordHash) {
      return { ok: false, error: "The password does not match this local profile." };
    }

    store.currentProfileId = profile.id;
    writeAuthStore(store);
    emit("netlab:authchange", { profile: sanitizeProfile(profile) });

    return { ok: true, profile: sanitizeProfile(profile) };
  }

  function logOutLocalProfile() {
    const store = readAuthStore();
    store.currentProfileId = "";
    writeAuthStore(store);
    emit("netlab:authchange", { profile: guestProfile() });
    return { ok: true };
  }

  function saveSectionProgress(sectionId, payload) {
    const store = readProgressStore();
    const bucket = getActiveBucket(store);
    const record = normaliseProgressRecord(sectionId, payload || {});

    // Progress is keyed by the active local profile so guest work and signed-in local profiles stay separate.
    bucket.sections[sectionId] = record;
    bucket.lastActiveSectionId = sectionId;
    bucket.lastUpdatedAt = record.updatedAt;
    writeProgressStore(store);
    emit("netlab:progresschange", { sectionId: sectionId, record: clone(record) });
    return clone(record);
  }

  function getSectionProgress(sectionId) {
    const store = readProgressStore();
    const bucket = getActiveBucket(store);
    return clone(bucket.sections[sectionId] || null);
  }

  function getAllSectionProgress() {
    const store = readProgressStore();
    const bucket = getActiveBucket(store);
    return clone(bucket.sections || {});
  }

  function getLastActiveProgress() {
    const sections = Object.values(getAllSectionProgress());
    if (!sections.length) {
      return null;
    }

    return sections
      .slice()
      .sort(function (left, right) {
        return normaliseNumber(right.updatedAt) - normaliseNumber(left.updatedAt);
      })[0] || null;
  }

  function recomputeLastActive(bucket) {
    const records = Object.values(bucket.sections || {});
    if (!records.length) {
      bucket.lastActiveSectionId = "";
      bucket.lastUpdatedAt = 0;
      return;
    }

    const latest = records.slice().sort(function (left, right) {
      return normaliseNumber(right.updatedAt) - normaliseNumber(left.updatedAt);
    })[0];

    bucket.lastActiveSectionId = latest.sectionId;
    bucket.lastUpdatedAt = latest.updatedAt;
  }

  function resetSectionProgress(sectionId) {
    const store = readProgressStore();
    const bucket = getActiveBucket(store);

    delete bucket.sections[sectionId];
    recomputeLastActive(bucket);
    writeProgressStore(store);
    emit("netlab:progresschange", { sectionId: sectionId, record: null });
  }

  function clearActiveProfileProgress() {
    const store = readProgressStore();
    const bucket = getActiveBucket(store);
    bucket.sections = {};
    bucket.lastActiveSectionId = "";
    bucket.lastUpdatedAt = 0;
    writeProgressStore(store);
    emit("netlab:progresschange", { sectionId: null, record: null });
  }

  function getSectionDefinition(sectionId) {
    return clone(SECTION_DEFS[sectionId] || null);
  }

  function buildSectionUrl(sectionId, action) {
    const section = SECTION_DEFS[sectionId] || {};
    const url = new URL(section.href || "./index.html", window.location.href);

    url.searchParams.delete("resume");
    url.searchParams.delete("start");

    if (action === "resume") {
      url.searchParams.set("resume", "1");
    } else if (action === "start") {
      url.searchParams.set("start", "1");
    }

    return url.href;
  }

  function getLaunchAction() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("resume") === "1") {
      return "resume";
    }

    if (params.get("start") === "1") {
      return "start";
    }

    return "";
  }

  function clearLaunchAction() {
    const url = new URL(window.location.href);
    url.searchParams.delete("resume");
    url.searchParams.delete("start");
    window.history.replaceState({}, "", url.href);
  }

  window.NetlabApp = {
    LOCAL_AUTH_NOTE: LOCAL_AUTH_NOTE,
    SECTION_DEFS: clone(SECTION_DEFS),
    getActiveProfile: getActiveProfile,
    signUpLocalProfile: signUpLocalProfile,
    logInLocalProfile: logInLocalProfile,
    logOutLocalProfile: logOutLocalProfile,
    saveSectionProgress: saveSectionProgress,
    getSectionProgress: getSectionProgress,
    getAllSectionProgress: getAllSectionProgress,
    getLastActiveProgress: getLastActiveProgress,
    resetSectionProgress: resetSectionProgress,
    clearActiveProfileProgress: clearActiveProfileProgress,
    getSectionDefinition: getSectionDefinition,
    buildSectionUrl: buildSectionUrl,
    getLaunchAction: getLaunchAction,
    clearLaunchAction: clearLaunchAction,
    clone: clone
  };
})();
