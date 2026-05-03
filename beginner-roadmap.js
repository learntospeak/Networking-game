(function () {
  const sectionId = "windows-terminal";

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function levelNumber(level, index) {
    const match = String(level?.title || "").match(/Level\s+(\d+)/i);
    return match ? Number(match[1]) : index + 1;
  }

  function levelScenarios(level) {
    const ids = Array.isArray(level?.scenarioIds) ? level.scenarioIds : [];
    const scenarios = window.ScenarioEngine?.scenarios || [];
    return ids.map((id) => scenarios.find((scenario) => scenario.id === id)).filter(Boolean);
  }

  function render() {
    const levels = window.ScenarioEngine?.beginnerLabLevels?.windows || [];
    const app = window.NetlabApp;
    const record = app?.getSectionProgress(sectionId);
    const snapshot = record?.state || {};
    const completedScenarioIds = new Set(Array.isArray(snapshot.completedScenarioIds) ? snapshot.completedScenarioIds : []);
    const currentLevelId = snapshot.beginnerLevelId || levels[0]?.id || "";
    const currentScenarioTitle = snapshot.scenarioTitle || record?.currentItemLabel || "Incident Folder Triage";

    const progressTitle = document.getElementById("roadmapProgressTitle");
    const progressText = document.getElementById("roadmapProgressText");
    const resumeBtn = document.getElementById("roadmapResumeBtn");
    const levelMount = document.getElementById("roadmapLevels");

    if (progressTitle) {
      progressTitle.textContent = record ? "Ready to resume" : "Start Level 1";
    }
    if (progressText) {
      progressText.textContent = record
        ? `${snapshot.beginnerLevelTitle || "Beginner Terminal Lab"} · ${currentScenarioTitle} · Task ${(Number(snapshot.stepIndex) || 0) + 1}`
        : "No saved beginner lab progress found on this browser yet.";
    }
    if (resumeBtn && app?.buildSectionUrl) {
      resumeBtn.href = app.buildSectionUrl(sectionId, record ? "resume" : "start");
      resumeBtn.textContent = record ? "Resume Current Level" : "Start Level 1";
    }

    if (!levelMount) {
      return;
    }

    levelMount.innerHTML = levels.map((level, index) => {
      const scenarios = levelScenarios(level);
      const completed = scenarios.filter((scenario) => completedScenarioIds.has(scenario.id)).length;
      const status = completed && completed === scenarios.length ? "Complete" : level.id === currentLevelId && record ? "Current" : "Locked";
      const actionLabel = level.id === currentLevelId && record ? "Resume" : index === 0 && !record ? "Start" : "Open Lab";
      const skills = (Array.isArray(level.skills) ? level.skills : []).slice(0, 3)
        .map((skill) => `<span class="scenario-mini-badge">${escapeHtml(skill)}</span>`)
        .join("");

      return [
        `<article class="roadmap-level-card${level.id === currentLevelId ? " is-current" : ""}">`,
        `  <div class="beginner-level-head">`,
        `    <div>`,
        `      <p class="mission-case-label">Level ${levelNumber(level, index)}</p>`,
        `      <h3>${escapeHtml(level.title || `Level ${index + 1}`)}</h3>`,
        `    </div>`,
        `    <span class="status-badge${status === "Complete" ? " environment-badge" : status === "Current" ? " status-badge-blue" : ""}">${escapeHtml(status)}</span>`,
        `  </div>`,
        `  <p class="mission-case-copy">${escapeHtml(level.description || "")}</p>`,
        `  <p class="mission-case-copy">Problems: ${scenarios.length} · Done: ${completed}/${scenarios.length || 0}</p>`,
        skills ? `  <div class="mission-case-meta">${skills}</div>` : "",
        `  <div class="app-shell-actions"><a class="app-action-link" href="./terminal-coach.html?track=windows&mode=beginner${record ? "&resume=1" : ""}">${actionLabel}</a></div>`,
        `</article>`
      ].join("");
    }).join("");
  }

  function init() {
    if (window.NetlabApp?.whenReady) {
      window.NetlabApp.whenReady().finally(render);
      return;
    }
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
