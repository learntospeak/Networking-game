(function () {
  const SupabaseConfig = window.NetlabSupabase;
  const LEGACY_PROGRESS_STORAGE_KEY = "netlab-progress-v1";
  const GUEST_PROGRESS_STORAGE_KEY = "netlab-guest-progress-v2";
  const GUEST_PROFILE_ID = "guest";
  const LOCAL_AUTH_NOTE = "Signed-in accounts sync progress with Supabase. If you stay in guest mode, progress remains on this browser only.";

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

  const runtime = {
    ready: false,
    initPromise: null,
    session: null,
    profile: guestProfile(),
    progressBucket: emptyBucket(),
    rowIdsBySection: {},
    authSubscription: null
  };

  function emptyBucket() {
    return {
      lastActiveSectionId: "",
      lastUpdatedAt: 0,
      sections: {}
    };
  }

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

  function emit(name, detail) {
    window.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  function guestProfile() {
    return {
      id: GUEST_PROFILE_ID,
      username: "Guest",
      email: "",
      label: "Guest Mode",
      authType: "guest-local",
      isGuest: true
    };
  }

  function buildProfileFromUser(user) {
    if (!user) {
      return guestProfile();
    }

    const metadata = user.user_metadata || {};
    const email = String(user.email || "").trim();
    const preferredLabel = String(metadata.display_name || metadata.username || "").trim();
    const fallbackLabel = email.includes("@") ? email.split("@")[0] : "Learner";

    return {
      id: user.id,
      username: preferredLabel || fallbackLabel,
      email: email,
      label: preferredLabel || email || fallbackLabel,
      authType: "supabase",
      isGuest: false
    };
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
      currentItemLabel: payload.currentItemLabel || payload.currentItem || "Not started",
      completedCount: normaliseNumber(payload.completedCount),
      totalCount: Number.isFinite(Number(payload.totalCount)) ? Number(payload.totalCount) : null,
      summaryText: payload.summaryText || "",
      updatedAt: normaliseNumber(payload.updatedAt) || Date.now(),
      state: clone(payload.state || null)
    };
  }

  function normalizeGuestProgressStore(store) {
    return {
      version: 2,
      lastActiveSectionId: typeof store?.lastActiveSectionId === "string" ? store.lastActiveSectionId : "",
      lastUpdatedAt: normaliseNumber(store?.lastUpdatedAt),
      sections: store?.sections && typeof store.sections === "object" ? store.sections : {}
    };
  }

  function readLegacyGuestBucket() {
    const legacy = loadJson(LEGACY_PROGRESS_STORAGE_KEY, {});
    const guestBucket = legacy?.byProfile?.[GUEST_PROFILE_ID];
    return guestBucket && typeof guestBucket === "object" ? guestBucket : null;
  }

  function readGuestProgressStore() {
    const modernStore = loadJson(GUEST_PROGRESS_STORAGE_KEY, null);
    if (modernStore) {
      return normalizeGuestProgressStore(modernStore);
    }

    const legacyGuest = readLegacyGuestBucket();
    if (legacyGuest) {
      const migrated = normalizeGuestProgressStore(legacyGuest);
      saveGuestProgressStore(migrated);
      return migrated;
    }

    return normalizeGuestProgressStore({});
  }

  function saveGuestProgressStore(store) {
    saveJson(GUEST_PROGRESS_STORAGE_KEY, normalizeGuestProgressStore(store));
  }

  function hydrateBucket(records, rowIdsBySection) {
    runtime.progressBucket = emptyBucket();
    runtime.rowIdsBySection = rowIdsBySection ? clone(rowIdsBySection) : {};

    records.forEach(function (record) {
      runtime.progressBucket.sections[record.sectionId] = clone(record);
    });

    recomputeLastActive(runtime.progressBucket);
  }

  function hydrateGuestProgress() {
    const store = readGuestProgressStore();
    const records = Object.keys(store.sections || {}).map(function (sectionId) {
      return normaliseProgressRecord(sectionId, store.sections[sectionId] || {});
    });

    hydrateBucket(records, {});
  }

  function persistGuestProgress() {
    saveGuestProgressStore({
      lastActiveSectionId: runtime.progressBucket.lastActiveSectionId,
      lastUpdatedAt: runtime.progressBucket.lastUpdatedAt,
      sections: runtime.progressBucket.sections
    });
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

  function cacheProgressRecord(sectionId, record) {
    runtime.progressBucket.sections[sectionId] = clone(record);
    runtime.progressBucket.lastActiveSectionId = sectionId;
    runtime.progressBucket.lastUpdatedAt = record.updatedAt;
    if (runtime.profile.isGuest) {
      persistGuestProgress();
    }
  }

  function removeCachedProgress(sectionId) {
    delete runtime.progressBucket.sections[sectionId];
    delete runtime.rowIdsBySection[sectionId];
    recomputeLastActive(runtime.progressBucket);
    if (runtime.profile.isGuest) {
      persistGuestProgress();
    }
  }

  function clearCachedProgress() {
    runtime.progressBucket = emptyBucket();
    runtime.rowIdsBySection = {};
    if (runtime.profile.isGuest) {
      persistGuestProgress();
    }
  }

  function getSupabaseClient() {
    return SupabaseConfig && SupabaseConfig.client ? SupabaseConfig.client : null;
  }

  function getActiveProfile() {
    return clone(runtime.profile);
  }

  function getProgressStorageLabel(profile) {
    if (profile && !profile.isGuest) {
      return "Supabase cloud sync";
    }

    return "Guest browser storage";
  }

  function getProfileStorageNote(profile) {
    if (profile && !profile.isGuest) {
      return "Progress is saved to Supabase for this signed-in account.";
    }

    return "Guest progress stays on this browser until you sign in.";
  }

  function normaliseRemoteProgressRow(row) {
    const payload = row?.progress_data && typeof row.progress_data === "object" ? row.progress_data : {};

    return normaliseProgressRecord(row.section_id, {
      sectionLabel: row.section_label,
      href: payload.href,
      currentItemId: payload.currentItemId,
      currentItemLabel: payload.currentItemLabel || row.current_item,
      currentItem: row.current_item,
      completedCount: row.completed_count,
      totalCount: payload.totalCount,
      summaryText: payload.summaryText,
      updatedAt: payload.updatedAt || Date.parse(row.updated_at || "") || Date.now(),
      state: payload.state
    });
  }

  async function loadCloudProgress(userId) {
    const supabase = getSupabaseClient();
    if (!supabase || !userId) {
      hydrateGuestProgress();
      return;
    }

    const { data, error } = await supabase
      .from("user_progress")
      .select("id, user_id, section_id, section_label, current_item, completed_count, progress_data, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      throw error;
    }

    const rowIds = {};
    const records = Array.isArray(data) ? data.map(function (row) {
      rowIds[row.section_id] = row.id;
      return normaliseRemoteProgressRow(row);
    }) : [];

    hydrateBucket(records, rowIds);
  }

  async function updateRuntimeFromSession(session) {
    const supabase = getSupabaseClient();

    if (!supabase || !session?.user) {
      runtime.session = null;
      runtime.profile = guestProfile();
      hydrateGuestProgress();
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw error;
    }

    const user = data?.user || session.user;
    runtime.session = session;
    runtime.profile = buildProfileFromUser(user);
    await loadCloudProgress(user.id);
  }

  function scheduleAuthRefresh(session) {
    window.setTimeout(async function () {
      try {
        await updateRuntimeFromSession(session);
        emit("netlab:authchange", { profile: getActiveProfile() });
        emit("netlab:progresschange", { sectionId: null, record: null });
      } catch (error) {
        console.error("Failed to refresh auth state from Supabase.", error);
      }
    }, 0);
  }

  async function initialise() {
    if (runtime.ready) {
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      runtime.profile = guestProfile();
      hydrateGuestProgress();
      runtime.ready = true;
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    await updateRuntimeFromSession(data?.session || null);

    if (!runtime.authSubscription) {
      runtime.authSubscription = supabase.auth.onAuthStateChange(function (_event, session) {
        scheduleAuthRefresh(session);
      });
    }

    runtime.ready = true;
  }

  function whenReady() {
    if (!runtime.initPromise) {
      runtime.initPromise = initialise().catch(function (error) {
        console.error("NetlabApp failed to initialise.", error);
        runtime.profile = guestProfile();
        hydrateGuestProgress();
        runtime.ready = true;
      });
    }

    return runtime.initPromise;
  }

  function getSectionProgress(sectionId) {
    return clone(runtime.progressBucket.sections[sectionId] || null);
  }

  function getAllSectionProgress() {
    return clone(runtime.progressBucket.sections || {});
  }

  function getLastActiveProgress() {
    const sections = Object.values(runtime.progressBucket.sections || {});
    if (!sections.length) {
      return null;
    }

    return clone(sections.slice().sort(function (left, right) {
      return normaliseNumber(right.updatedAt) - normaliseNumber(left.updatedAt);
    })[0] || null);
  }

  async function saveProgressToCloud(sectionId, record) {
    const supabase = getSupabaseClient();
    if (!supabase || runtime.profile.isGuest) {
      return;
    }

    const payload = {
      user_id: runtime.profile.id,
      section_id: sectionId,
      section_label: record.sectionLabel,
      current_item: record.currentItemLabel,
      completed_count: record.completedCount,
      progress_data: {
        href: record.href,
        currentItemId: record.currentItemId,
        currentItemLabel: record.currentItemLabel,
        totalCount: record.totalCount,
        summaryText: record.summaryText,
        state: record.state,
        updatedAt: record.updatedAt
      },
      updated_at: new Date(record.updatedAt).toISOString()
    };

    const rowId = runtime.rowIdsBySection[sectionId];

    if (rowId) {
      const { error } = await supabase
        .from("user_progress")
        .update(payload)
        .eq("id", rowId)
        .eq("user_id", runtime.profile.id);

      if (!error) {
        return;
      }
    }

    const { data, error } = await supabase
      .from("user_progress")
      .insert(payload)
      .select("id, section_id")
      .single();

    if (error) {
      throw error;
    }

    if (data?.id) {
      runtime.rowIdsBySection[sectionId] = data.id;
    }
  }

  function saveSectionProgress(sectionId, payload) {
    const record = normaliseProgressRecord(sectionId, payload || {});
    cacheProgressRecord(sectionId, record);
    emit("netlab:progresschange", { sectionId: sectionId, record: clone(record) });

    if (!runtime.profile.isGuest) {
      saveProgressToCloud(sectionId, record).catch(function (error) {
        console.error("Failed to save Supabase progress.", error);
      });
    }

    return clone(record);
  }

  async function deleteCloudSectionProgress(sectionId) {
    const supabase = getSupabaseClient();
    if (!supabase || runtime.profile.isGuest) {
      return;
    }

    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", runtime.profile.id)
      .eq("section_id", sectionId);

    if (error) {
      throw error;
    }
  }

  function resetSectionProgress(sectionId) {
    removeCachedProgress(sectionId);
    emit("netlab:progresschange", { sectionId: sectionId, record: null });

    if (!runtime.profile.isGuest) {
      deleteCloudSectionProgress(sectionId).catch(function (error) {
        console.error("Failed to reset Supabase progress for section.", error);
      });
    }
  }

  async function clearCloudProgress() {
    const supabase = getSupabaseClient();
    if (!supabase || runtime.profile.isGuest) {
      return;
    }

    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", runtime.profile.id);

    if (error) {
      throw error;
    }
  }

  function clearActiveProfileProgress() {
    clearCachedProgress();
    emit("netlab:progresschange", { sectionId: null, record: null });

    if (!runtime.profile.isGuest) {
      clearCloudProgress().catch(function (error) {
        console.error("Failed to clear Supabase progress for account.", error);
      });
    }
  }

  async function signUpProfile(payload) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not available in this build." };
    }

    const username = String(payload?.username || "").trim();
    const email = String(payload?.email || "").trim();
    const password = String(payload?.password || "");

    if (!email) {
      return { ok: false, error: "Enter an email address." };
    }

    if (password.length < 6) {
      return { ok: false, error: "Use at least 6 characters for the password." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: username ? { display_name: username } : {}
      }
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const pendingConfirmation = !data?.session;
    if (!pendingConfirmation && data?.session) {
      await updateRuntimeFromSession(data.session);
      emit("netlab:authchange", { profile: getActiveProfile() });
      emit("netlab:progresschange", { sectionId: null, record: null });
    }

    return {
      ok: true,
      pendingConfirmation: pendingConfirmation,
      message: pendingConfirmation
        ? "Account created. Check your email for the confirmation link before logging in."
        : "Account created and signed in.",
      profile: getActiveProfile()
    };
  }

  async function logInProfile(payload) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { ok: false, error: "Supabase is not available in this build." };
    }

    const email = String(payload?.email || "").trim();
    const password = String(payload?.password || "");

    if (!email || !password) {
      return { ok: false, error: "Enter both your email and password." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    await updateRuntimeFromSession(data?.session || null);
    emit("netlab:authchange", { profile: getActiveProfile() });
    emit("netlab:progresschange", { sectionId: null, record: null });

    return { ok: true, profile: getActiveProfile() };
  }

  async function logOutProfile() {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { ok: false, error: error.message };
      }
    }

    runtime.session = null;
    runtime.profile = guestProfile();
    hydrateGuestProgress();
    emit("netlab:authchange", { profile: getActiveProfile() });
    emit("netlab:progresschange", { sectionId: null, record: null });
    return { ok: true };
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
    whenReady: whenReady,
    isReady: function () {
      return runtime.ready;
    },
    getActiveProfile: getActiveProfile,
    getProgressStorageLabel: function () {
      return getProgressStorageLabel(runtime.profile);
    },
    getProfileStorageNote: function () {
      return getProfileStorageNote(runtime.profile);
    },
    signUpProfile: signUpProfile,
    logInProfile: logInProfile,
    logOutProfile: logOutProfile,
    // Aliases kept so existing UI code can be migrated incrementally without breaking older calls.
    signUpLocalProfile: signUpProfile,
    logInLocalProfile: logInProfile,
    logOutLocalProfile: logOutProfile,
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
