(function () {
  const SupabaseConfig = window.NetlabSupabase;
  const LEGACY_PROGRESS_STORAGE_KEY = "netlab-progress-v1";
  const GUEST_PROGRESS_STORAGE_KEY = "netlab-guest-progress-v2";
  const GUEST_PROFILE_ID = "guest";
  // The app only has one Supabase table today, so lightweight account-wide reward/settings data lives in a reserved row.
  const META_SECTION_ID = "__profile_meta__";
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
      href: "./terminal-coach.html?track=windows&mode=beginner"
    },
    "cisco-cli": {
      label: "Cisco CLI Lab",
      href: "./cisco-cli-lab.html"
    },
    "web-http-lab": {
      label: "HTTP Reference Lab",
      href: "./web-http-lab.html"
    },
    "cyber-challenge": {
      label: "Cyber Challenge Mode",
      href: "./challenge-mode.html"
    },
    "protocol-lab": {
      label: "ARP Reference",
      href: "./protocol-merge.html"
    }
  };

  const runtime = {
    ready: false,
    initPromise: null,
    session: null,
    profile: guestProfile(),
    profileState: defaultProfileState(),
    progressBucket: emptyBucket(),
    rowIdsBySection: {},
    authSubscription: null,
    rewardToastTimer: 0,
    progressPulseTimer: 0
  };

  function emptyBucket() {
    return {
      lastActiveSectionId: "",
      lastUpdatedAt: 0,
      sections: {}
    };
  }

  function defaultProfileState() {
    return {
      coins: 0,
      rewardClaims: {},
      preferences: {
        soundEnabled: true
      }
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
    const appMetadata = user.app_metadata || {};
    const email = String(user.email || "").trim();
    const emailKey = email.toLowerCase();
    const preferredLabel = String(metadata.display_name || metadata.username || "").trim();
    const fallbackLabel = email.includes("@") ? email.split("@")[0] : "Learner";
    const rawPlan = String(metadata.plan || metadata.subscription_plan || appMetadata.plan || appMetadata.subscription_plan || "").trim().toLowerCase();
    // TODO: Replace this temporary tester allowlist with canonical Supabase subscription data.
    const paidTesterEmails = new Set(["mexecute41@hotmail.com"]);
    const roles = []
      .concat(metadata.roles || [])
      .concat(appMetadata.roles || [])
      .concat(metadata.role || "")
      .concat(appMetadata.role || "")
      .map((role) => String(role || "").trim().toLowerCase())
      .filter(Boolean);
    const isAdmin = Boolean(metadata.is_admin || metadata.admin || appMetadata.is_admin || appMetadata.admin || roles.includes("admin"));
    const isPaid = Boolean(isAdmin || paidTesterEmails.has(emailKey) || ["paid", "pro", "premium", "subscriber", "subscribed"].includes(rawPlan) || metadata.is_paid || appMetadata.is_paid);

    return {
      id: user.id,
      username: preferredLabel || fallbackLabel,
      email: email,
      label: preferredLabel || email || fallbackLabel,
      authType: "supabase",
      isGuest: false,
      plan: isAdmin ? "admin" : isPaid ? "paid" : "free",
      isPaid: isPaid,
      isAdmin: isAdmin
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
      version: 3,
      lastActiveSectionId: typeof store?.lastActiveSectionId === "string" ? store.lastActiveSectionId : "",
      lastUpdatedAt: normaliseNumber(store?.lastUpdatedAt),
      sections: store?.sections && typeof store.sections === "object" ? store.sections : {},
      profileState: normalizeProfileState(store?.profileState)
    };
  }

  function normalizeProfileState(state) {
    const fallback = defaultProfileState();
    const rewardClaims = state?.rewardClaims && typeof state.rewardClaims === "object" ? state.rewardClaims : {};
    const soundEnabled = typeof state?.preferences?.soundEnabled === "boolean"
      ? state.preferences.soundEnabled
      : fallback.preferences.soundEnabled;

    return {
      coins: Math.max(0, normaliseNumber(state?.coins)),
      rewardClaims: clone(rewardClaims) || {},
      preferences: {
        soundEnabled: soundEnabled
      }
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
    runtime.profileState = normalizeProfileState(store.profileState);
    const records = Object.keys(store.sections || {}).map(function (sectionId) {
      return normaliseProgressRecord(sectionId, store.sections[sectionId] || {});
    });

    hydrateBucket(records, {});
  }

  function persistGuestProgress() {
    saveGuestProgressStore({
      lastActiveSectionId: runtime.progressBucket.lastActiveSectionId,
      lastUpdatedAt: runtime.progressBucket.lastUpdatedAt,
      sections: runtime.progressBucket.sections,
      profileState: runtime.profileState
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
    runtime.profileState = defaultProfileState();
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

  function buildEmailConfirmationUrl() {
    return new URL("./auth-confirmed.html", window.location.href).href;
  }

  function getProfileState() {
    return clone(runtime.profileState);
  }

  function getCoinsTotal() {
    return normaliseNumber(runtime.profileState?.coins);
  }

  function isSoundEnabled() {
    return Boolean(runtime.profileState?.preferences?.soundEnabled !== false);
  }

  function getDashboardStats() {
    const progressMap = runtime.progressBucket.sections || {};
    const records = Object.values(progressMap);
    const completedSections = records.filter(function (record) {
      return record.totalCount && record.completedCount >= record.totalCount;
    }).length;
    const startedSections = records.filter(function (record) {
      return record.completedCount > 0 || record.currentItemLabel !== "Not started";
    }).length;
    const completedItems = records.reduce(function (sum, record) {
      return sum + normaliseNumber(record.completedCount);
    }, 0);

    return {
      coins: getCoinsTotal(),
      completedSections: completedSections,
      startedSections: startedSections,
      completedItems: completedItems
    };
  }

  function soundContext() {
    if (!window.AudioContext && !window.webkitAudioContext) {
      return null;
    }

    if (!runtime.audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      runtime.audioContext = new AudioCtor();
    }

    return runtime.audioContext;
  }

  function resumeAudioContext(context) {
    if (!context) {
      return;
    }

    if (context.state === "suspended" && typeof context.resume === "function") {
      context.resume().catch(function () {
        return null;
      });
    }
  }

  function scheduleTone(context, now, note) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + (note.start || 0);
    const duration = Math.max(0.03, Number(note.duration) || 0.08);
    const peak = Math.max(0.008, Number(note.volume) || 0.03);

    oscillator.type = note.type || "sine";
    oscillator.frequency.setValueAtTime(Number(note.frequency) || 440, start);
    if (Number.isFinite(Number(note.endFrequency))) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, Number(note.endFrequency)), start + duration);
    }

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.014, duration / 2));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function playUiSound(kind) {
    if (!isSoundEnabled()) {
      return;
    }

    const context = soundContext();
    if (!context) {
      return;
    }

    resumeAudioContext(context);
    const now = context.currentTime;
    const sequence = {
      step: [
        { frequency: 440, duration: 0.06, volume: 0.02, type: "triangle" }
      ],
      section: [
        { frequency: 523.25, duration: 0.08, volume: 0.026, type: "triangle" },
        { frequency: 659.25, start: 0.09, duration: 0.11, volume: 0.03, type: "triangle" }
      ],
      lab: [
        { frequency: 523.25, duration: 0.07, volume: 0.028, type: "triangle" },
        { frequency: 659.25, start: 0.08, duration: 0.09, volume: 0.03, type: "triangle" },
        { frequency: 783.99, start: 0.18, duration: 0.13, volume: 0.034, type: "triangle" }
      ],
      incorrect: [
        { frequency: 246.94, endFrequency: 196, duration: 0.09, volume: 0.016, type: "sine" }
      ]
    }[String(kind || "").trim().toLowerCase()] || [
      { frequency: 440, duration: 0.06, volume: 0.02, type: "triangle" }
    ];

    sequence.forEach(function (note) {
      scheduleTone(context, now, note);
    });
  }

  function playSuccessSound() {
    playUiSound("section");
  }

  function ensureProgressPulse() {
    if (typeof document === "undefined" || !document.body) {
      return null;
    }

    let toast = document.getElementById("netlabProgressPulse");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "netlabProgressPulse";
      toast.className = "micro-progress-toast";
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    return toast;
  }

  function showProgressPulse(payload) {
    const toast = ensureProgressPulse();
    if (!toast) {
      return null;
    }

    const tone = ["step", "section", "lab", "error"].includes(String(payload?.tone || ""))
      ? String(payload.tone)
      : "step";
    const label = String(payload?.label || (tone === "error" ? "Try Again" : "Step Complete")).trim();
    const coins = Math.max(0, normaliseNumber(payload?.coins));

    toast.className = "micro-progress-toast is-" + tone;
    toast.innerHTML = [
      "<span class=\"micro-progress-toast-label\">" + escapeHtml(label) + "</span>",
      coins ? "<span class=\"micro-progress-toast-coins\">+" + escapeHtml(String(coins)) + " coins</span>" : ""
    ].join("");
    toast.classList.add("is-visible");

    if (runtime.progressPulseTimer) {
      window.clearTimeout(runtime.progressPulseTimer);
    }

    runtime.progressPulseTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      runtime.progressPulseTimer = 0;
    }, Math.max(900, normaliseNumber(payload?.duration) || 1500));

    if (payload?.sound !== false) {
      playUiSound(payload?.soundKind || tone);
    }

    return {
      label: label,
      coins: coins,
      tone: tone
    };
  }

  function grantProgressReward(payload) {
    const reward = awardCoins({
      key: payload?.key,
      coins: payload?.coins,
      title: payload?.title || payload?.label || "Progress Reward",
      message: payload?.message || "Progress recorded.",
      firstTimeOnly: payload?.firstTimeOnly,
      toast: payload?.toast,
      sound: false
    });

    if (reward || payload?.showWhenUnawarded !== false) {
      showProgressPulse({
        label: payload?.label || "Step Complete",
        coins: reward ? reward.coins : 0,
        tone: payload?.tone || "step",
        duration: payload?.duration,
        sound: payload?.sound !== false,
        soundKind: payload?.soundKind
      });
    }

    return reward;
  }

  function ensureRewardToast() {
    if (typeof document === "undefined" || !document.body) {
      return null;
    }

    let toast = document.getElementById("netlabRewardToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "netlabRewardToast";
      toast.className = "reward-toast";
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }

    return toast;
  }

  function showRewardToast(reward) {
    const toast = ensureRewardToast();
    if (!toast || !reward) {
      return;
    }

    toast.innerHTML = [
      "<p class=\"reward-toast-kicker\">" + escapeHtml(reward.title || "Complete") + "</p>",
      "<div class=\"reward-toast-row\">",
      "  <strong class=\"reward-toast-coins\">+" + escapeHtml(String(reward.coins || 0)) + " Coins</strong>",
      "  <span class=\"reward-toast-message\">" + escapeHtml(reward.message || "Progress recorded.") + "</span>",
      "</div>"
    ].join("");
    toast.classList.add("is-visible");

    if (runtime.rewardToastTimer) {
      window.clearTimeout(runtime.rewardToastTimer);
    }

    runtime.rewardToastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      runtime.rewardToastTimer = 0;
    }, 2400);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

  function extractProfileStateFromRow(row) {
    const payload = row?.progress_data && typeof row.progress_data === "object" ? row.progress_data : {};
    return normalizeProfileState(payload.profileState || payload);
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
    runtime.profileState = defaultProfileState();
    const records = [];

    if (Array.isArray(data)) {
      data.forEach(function (row) {
        rowIds[row.section_id] = row.id;

        if (row.section_id === META_SECTION_ID) {
          runtime.profileState = extractProfileStateFromRow(row);
          return;
        }

        records.push(normaliseRemoteProgressRow(row));
      });
    }

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

  async function saveProfileStateToCloud() {
    const supabase = getSupabaseClient();
    if (!supabase || runtime.profile.isGuest) {
      return;
    }

    const payload = {
      user_id: runtime.profile.id,
      section_id: META_SECTION_ID,
      section_label: "Profile Meta",
      current_item: "Coins: " + getCoinsTotal(),
      completed_count: 0,
      progress_data: {
        profileState: runtime.profileState,
        updatedAt: Date.now()
      },
      updated_at: new Date().toISOString()
    };

    const rowId = runtime.rowIdsBySection[META_SECTION_ID];

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
      runtime.rowIdsBySection[META_SECTION_ID] = data.id;
    }
  }

  function persistProfileState(reason, detail) {
    if (runtime.profile.isGuest) {
      persistGuestProgress();
    } else {
      saveProfileStateToCloud().catch(function (error) {
        console.error("Failed to save Supabase profile state.", error);
      });
    }

    emit("netlab:profilemetachange", {
      reason: reason || "profile-state",
      profileState: getProfileState(),
      detail: clone(detail || null)
    });
  }

  function setSoundEnabled(enabled) {
    runtime.profileState.preferences.soundEnabled = Boolean(enabled);
    persistProfileState("sound-toggle", {
      soundEnabled: runtime.profileState.preferences.soundEnabled
    });
    return isSoundEnabled();
  }

  function coinsForDifficulty(value, floor) {
    const difficulty = String(value || "").trim().toLowerCase();
    let amount = 5;

    if (difficulty.includes("medium") || difficulty.includes("intermediate")) {
      amount = 10;
    } else if (difficulty.includes("hard") || difficulty.includes("advanced") || difficulty.includes("challenge")) {
      amount = 20;
    }

    if (Number.isFinite(Number(floor))) {
      amount = Math.max(amount, Number(floor));
    }

    return amount;
  }

  function awardCoins(payload) {
    const rewardKey = String(payload?.key || "").trim();
    const coins = Math.max(0, normaliseNumber(payload?.coins));
    const firstTimeOnly = payload?.firstTimeOnly !== false;

    if (!rewardKey || !coins) {
      return null;
    }

    // Reward claims prevent easy farming by default; a completion only pays out once per profile unless a caller opts out.
    if (firstTimeOnly && runtime.profileState.rewardClaims[rewardKey]) {
      return null;
    }

    runtime.profileState.coins += coins;
    runtime.profileState.rewardClaims[rewardKey] = {
      coins: coins,
      grantedAt: Date.now(),
      title: payload?.title || "",
      message: payload?.message || ""
    };

    const reward = {
      key: rewardKey,
      coins: coins,
      title: payload?.title || "Progress Reward",
      message: payload?.message || "Progress recorded.",
      totalCoins: runtime.profileState.coins
    };

    persistProfileState("reward-granted", reward);
    if (payload?.toast !== false) {
      showRewardToast(reward);
    }
    if (payload?.sound !== false) {
      playUiSound(payload?.soundKind || "section");
    }
    return clone(reward);
  }

  function maybeAwardSectionMilestone(sectionId, record) {
    if (!record || !record.totalCount || record.completedCount < record.totalCount) {
      return null;
    }

    return grantProgressReward({
      key: "section-milestone:" + sectionId + ":complete-all",
      coins: 20,
      title: "Lab Complete",
      label: "Lab Complete",
      tone: "lab",
      message: record.sectionLabel + " fully completed.",
      toast: false,
      showWhenUnawarded: false
    });
  }

  function saveSectionProgress(sectionId, payload) {
    const record = normaliseProgressRecord(sectionId, payload || {});
    cacheProgressRecord(sectionId, record);
    maybeAwardSectionMilestone(sectionId, record);
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
    emit("netlab:profilemetachange", {
      reason: "progress-reset",
      profileState: getProfileState(),
      detail: null
    });

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
        data: username ? { display_name: username } : {},
        emailRedirectTo: buildEmailConfirmationUrl()
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

  function buildHubUrl(options) {
    const url = new URL("./index.html", window.location.href);
    const authMode = String(options?.auth || "").toLowerCase();

    url.searchParams.delete("auth");
    if (authMode === "login" || authMode === "signup") {
      url.searchParams.set("auth", authMode);
    }

    url.hash = "hubAccountPanel";
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
    getProfileState: getProfileState,
    getCoinsTotal: getCoinsTotal,
    getDashboardStats: getDashboardStats,
    getProgressStorageLabel: function () {
      return getProgressStorageLabel(runtime.profile);
    },
    getProfileStorageNote: function () {
      return getProfileStorageNote(runtime.profile);
    },
    isSoundEnabled: isSoundEnabled,
    setSoundEnabled: setSoundEnabled,
    playUiSound: playUiSound,
    awardCoins: awardCoins,
    grantProgressReward: grantProgressReward,
    showProgressPulse: showProgressPulse,
    coinsForDifficulty: coinsForDifficulty,
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
    buildHubUrl: buildHubUrl,
    getLaunchAction: getLaunchAction,
    clearLaunchAction: clearLaunchAction,
    clone: clone
  };
})();
