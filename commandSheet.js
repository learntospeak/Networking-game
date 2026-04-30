(function () {
  const { CommandsData } = window;
  const pageConfig = window.TerminalCoachConfig || {};

  if (!CommandsData) {
    return;
  }

  const els = {
    panel: document.getElementById("commandSheet"),
    overlay: document.getElementById("commandSheetOverlay"),
    search: document.getElementById("commandSheetSearch"),
    tabs: document.getElementById("commandSheetTabs"),
    count: document.getElementById("commandSheetCount"),
    results: document.getElementById("commandSheetResults"),
    closeBtn: document.getElementById("commandSheetCloseBtn"),
    clearBtn: document.getElementById("commandSheetClearBtn"),
    openButtons: Array.from(document.querySelectorAll("[data-open-command-sheet]"))
  };

  if (!els.panel || !els.overlay || !els.search || !els.tabs || !els.count || !els.results) {
    return;
  }

  const availableCategories = Array.isArray(pageConfig.commandSheetCategories) && pageConfig.commandSheetCategories.length
    ? pageConfig.commandSheetCategories.filter((category) => CommandsData.categories.includes(category))
    : CommandsData.categories.slice();

  const defaultCategory = availableCategories.includes(pageConfig.commandSheetDefaultCategory)
    ? pageConfig.commandSheetDefaultCategory
    : (availableCategories.includes("All") ? "All" : availableCategories[0]);

  const state = {
    query: "",
    category: defaultCategory,
    expanded: new Set(),
    activeTrigger: null,
    openedFromTerminalInput: false
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function entryId(item) {
    return item.id || `${item.category}-${item.command}`.replace(/\s+/g, "-").toLowerCase();
  }

  function isOpen() {
    return document.body.classList.contains("command-sheet-open");
  }

  function renderTabs() {
    els.tabs.hidden = availableCategories.length <= 1;
    els.tabs.innerHTML = availableCategories
      .map((category) => {
        const active = category === state.category;
        return `
          <button
            class="command-sheet-tab${active ? " active" : ""}"
            type="button"
            role="tab"
            aria-selected="${active ? "true" : "false"}"
            data-category="${escapeHtml(category)}"
          >${escapeHtml(category)}</button>
        `;
      })
      .join("");
  }

  function renderResults() {
    const results = CommandsData.searchEntries(state.query, state.category);
    els.count.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
      els.results.innerHTML = `
        <div class="command-sheet-empty">
          <h3>No matching commands</h3>
          <p>Try a different command name, flag, or keyword.</p>
        </div>
      `;
      return;
    }

    els.results.innerHTML = results
      .map((item) => {
        const id = entryId(item);
        const expanded = state.expanded.has(id);
        const flags = (item.flags || [])
          .map((flag) => {
            if (typeof flag === "string") {
              return `<li><code>${escapeHtml(flag)}</code></li>`;
            }

            return `<li><code>${escapeHtml(flag.name)}</code><span>${escapeHtml(flag.meaning)}</span></li>`;
          })
          .join("");

        const related = (item.related || [])
          .map((value) => `<li><code>${escapeHtml(value)}</code></li>`)
          .join("");

        return `
          <article class="command-card${expanded ? " expanded" : ""}" data-entry-id="${escapeHtml(id)}">
            <div class="command-card-head">
              <div class="command-card-copyblock">
                <p class="command-card-category">${escapeHtml(item.category)}</p>
                <h3 class="command-card-command"><code>${escapeHtml(item.command)}</code></h3>
                <p class="command-card-meaning">${escapeHtml(item.meaning)}</p>
              </div>

              <div class="command-card-actions">
                <button class="command-card-copy" type="button" data-copy="${escapeHtml(item.example || item.command)}">Copy</button>
                <button class="command-card-toggle" type="button" data-toggle="${escapeHtml(id)}" aria-expanded="${expanded ? "true" : "false"}">
                  ${expanded ? "Less" : "More"}
                </button>
              </div>
            </div>

            <div class="command-card-example">
              <span>Example</span>
              <code>${escapeHtml(item.example || item.command)}</code>
            </div>

            <div class="command-card-detail"${expanded ? "" : " hidden"}>
              ${flags ? `
                <section>
                  <h4>Common Flags</h4>
                  <ul class="command-chip-list">${flags}</ul>
                </section>
              ` : ""}
              ${related ? `
                <section>
                  <h4>Related</h4>
                  <ul class="command-related-list">${related}</ul>
                </section>
              ` : ""}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function syncState() {
    renderTabs();
    renderResults();
  }

  function openSheet(prefillQuery = "") {
    state.activeTrigger = document.activeElement;
    state.openedFromTerminalInput = state.activeTrigger?.id === "terminalInput";
    document.body.classList.add("command-sheet-open");
    els.overlay.hidden = false;
    els.panel.setAttribute("aria-hidden", "false");
    els.openButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
    document.dispatchEvent(new CustomEvent("terminalcoach:commandsheet", {
      detail: {
        open: true,
        openedFromTerminalInput: state.openedFromTerminalInput
      }
    }));

    if (prefillQuery && !state.query) {
      state.query = prefillQuery;
      els.search.value = prefillQuery;
    }

    syncState();
    window.requestAnimationFrame(() => {
      els.search.focus();
      els.search.select();
    });
  }

  function closeSheet() {
    document.body.classList.remove("command-sheet-open");
    els.panel.setAttribute("aria-hidden", "true");
    els.overlay.hidden = true;
    els.openButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    document.dispatchEvent(new CustomEvent("terminalcoach:commandsheet", {
      detail: {
        open: false,
        openedFromTerminalInput: state.openedFromTerminalInput
      }
    }));

    if (state.activeTrigger && typeof state.activeTrigger.focus === "function") {
      state.activeTrigger.focus();
    }
  }

  function copyText(value, button) {
    const text = value || "";

    const markCopied = () => {
      const previous = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = previous;
      }, 1200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {});
      return;
    }

    const input = document.createElement("textarea");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    markCopied();
  }

  function bindEvents() {
    els.openButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const terminalInput = document.getElementById("terminalInput");
        const prefill = terminalInput ? terminalInput.value.trim() : "";
        openSheet(prefill);
      });
    });

    els.closeBtn.addEventListener("click", closeSheet);
    els.overlay.addEventListener("click", closeSheet);

    els.clearBtn.addEventListener("click", () => {
      state.query = "";
      state.category = defaultCategory;
      els.search.value = "";
      syncState();
      els.search.focus();
    });

    els.search.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderResults();
    });

    els.tabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      state.category = button.dataset.category;
      syncState();
    });

    els.results.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-copy]");
      if (copyButton) {
        copyText(copyButton.dataset.copy, copyButton);
        return;
      }

      const toggleButton = event.target.closest("[data-toggle]");
      if (toggleButton) {
        const id = toggleButton.dataset.toggle;
        if (state.expanded.has(id)) {
          state.expanded.delete(id);
        } else {
          state.expanded.add(id);
        }
        renderResults();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        closeSheet();
      }
    });
  }

  syncState();
  bindEvents();
})();
