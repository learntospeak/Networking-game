(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isWindowsState(state) {
    return state.platform === "cmd";
  }

  function getRootPath(state) {
    return isWindowsState(state) ? "C:/" : "/";
  }

  function normalizeInputPath(input) {
    return (input || "").replace(/\\/g, "/").trim();
  }

  function splitPath(path) {
    return path.split("/").filter(Boolean);
  }

  function joinPath(base, part, windows) {
    if (!base.endsWith("/")) {
      return `${base}/${part}`;
    }

    return `${base}${part}`;
  }

  function normalizePath(state, inputPath, basePath) {
    const windows = isWindowsState(state);
    const base = normalizeInputPath(basePath || state.cwd || getRootPath(state));
    const raw = normalizeInputPath(inputPath || "");

    if (!raw || raw === ".") return base;

    if (!windows && raw === "~") {
      return state.home;
    }

    if (!windows && raw.startsWith("~/")) {
      return `${state.home}/${raw.slice(2)}`.replace(/\/+/g, "/");
    }

    let working;

    if (windows) {
      if (/^[A-Za-z]:\//.test(raw)) {
        working = raw;
      } else if (/^[A-Za-z]:$/.test(raw)) {
        working = `${raw}/`;
      } else if (raw.startsWith("/")) {
        working = `${state.drive}${raw}`;
      } else {
        working = joinPath(base, raw, true);
      }
    } else if (raw.startsWith("/")) {
      working = raw;
    } else {
      working = joinPath(base, raw, false);
    }

    const prefix = windows ? `${working.slice(0, 2)}/` : "/";
    const remainder = windows ? working.slice(3) : working.slice(1);
    const parts = splitPath(remainder);
    const resolved = [];

    parts.forEach((part) => {
      if (part === "." || part === "") return;
      if (part === "..") {
        resolved.pop();
        return;
      }
      resolved.push(part);
    });

    if (windows) {
      return `${working.slice(0, 2)}/${resolved.join("/")}`.replace(/\/$/, "") || prefix;
    }

    return `${prefix}${resolved.join("/")}`.replace(/\/$/, "") || "/";
  }

  function displayPath(state, path, forPrompt = false) {
    if (isWindowsState(state)) {
      return path.replace(/\//g, "\\");
    }

    if (forPrompt && path.startsWith(state.home)) {
      const suffix = path.slice(state.home.length);
      return suffix ? `~${suffix}` : "~";
    }

    return path;
  }

  function getNameFromPath(path) {
    const trimmed = path.replace(/\/$/, "");
    const parts = trimmed.split("/");
    return parts[parts.length - 1] || trimmed;
  }

  function ensureDirectory(state, path) {
    const normalized = normalizePath(state, path, getRootPath(state));

    if (state.fs[normalized]) return state.fs[normalized];

    const windows = isWindowsState(state);
    const root = getRootPath(state);

    if (!state.fs[root]) {
      state.fs[root] = {
        type: "dir",
        path: root,
        name: windows ? (state.drive || "C:") : "/",
        hidden: false
      };
    }

    if (normalized === root) {
      return state.fs[root];
    }

    const prefix = windows ? normalized.slice(0, 2) : "";
    const remainder = windows ? normalized.slice(3) : normalized.slice(1);
    const parts = splitPath(remainder);
    let current = root;

    parts.forEach((part, index) => {
      current = windows
        ? `${prefix}/${parts.slice(0, index + 1).join("/")}`
        : `/${parts.slice(0, index + 1).join("/")}`;

      if (!state.fs[current]) {
        state.fs[current] = {
          type: "dir",
          path: current,
          name: getNameFromPath(current),
          hidden: part.startsWith("."),
          createdAt: Date.now()
        };
      }
    });

    return state.fs[normalized];
  }

  function createFile(state, fileDef) {
    const normalized = normalizePath(state, fileDef.path, getRootPath(state));
    const parent = normalized.includes("/")
      ? normalized.slice(0, normalized.lastIndexOf("/")) || getRootPath(state)
      : getRootPath(state);

    ensureDirectory(state, parent);

    state.fs[normalized] = {
      type: "file",
      path: normalized,
      name: getNameFromPath(normalized),
      hidden: Boolean(fileDef.hidden),
      content: fileDef.content || "",
      archiveEntries: clone(fileDef.archiveEntries || []),
      executable: Boolean(fileDef.executable),
      downloaded: Boolean(fileDef.downloaded)
    };

    return state.fs[normalized];
  }

  function listChildren(state, dirPath, includeHidden = false) {
    const normalized = normalizePath(state, dirPath);
    const prefix = normalized === getRootPath(state) ? normalized : `${normalized}/`;

    return Object.values(state.fs)
      .filter((node) => {
        if (node.path === normalized) return false;
        if (!node.path.startsWith(prefix)) return false;
        const relative = node.path.slice(prefix.length);
        if (relative.includes("/")) return false;
        if (!includeHidden && node.hidden) return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function getNode(state, path) {
    return state.fs[normalizePath(state, path)];
  }

  function changeDirectory(state, targetPath) {
    const normalized = normalizePath(state, targetPath);
    const node = state.fs[normalized];

    if (!node) {
      return { ok: false, error: "No such directory" };
    }

    if (node.type !== "dir") {
      return { ok: false, error: "Not a directory" };
    }

    state.cwd = normalized;
    return { ok: true, path: normalized };
  }

  function readFile(state, targetPath) {
    const node = getNode(state, targetPath);

    if (!node) return { ok: false, error: "No such file" };
    if (node.type !== "file") return { ok: false, error: "Path is not a file" };

    return { ok: true, content: node.content, node };
  }

  function writeFile(state, targetPath, content, append = false) {
    const normalized = normalizePath(state, targetPath);
    const existing = state.fs[normalized];

    if (existing && existing.type !== "file") {
      return { ok: false, error: "Path is not a file" };
    }

    if (!existing) {
      createFile(state, { path: normalized, content });
      return { ok: true, node: state.fs[normalized] };
    }

    existing.content = append ? `${existing.content}${content}` : content;
    return { ok: true, node: existing };
  }

  function mkdir(state, targetPath) {
    const normalized = normalizePath(state, targetPath);
    ensureDirectory(state, normalized);
    return { ok: true, path: normalized };
  }

  function touch(state, targetPath) {
    const normalized = normalizePath(state, targetPath);

    if (state.fs[normalized] && state.fs[normalized].type === "dir") {
      return { ok: false, error: "Cannot touch a directory" };
    }

    if (!state.fs[normalized]) {
      createFile(state, { path: normalized, content: "" });
    }

    return { ok: true, path: normalized };
  }

  function collectDescendants(state, sourcePath) {
    const normalized = normalizePath(state, sourcePath);
    const prefix = normalized.endsWith("/") ? normalized : `${normalized}/`;

    return Object.values(state.fs)
      .filter((node) => node.path === normalized || node.path.startsWith(prefix))
      .sort((a, b) => a.path.localeCompare(b.path));
  }

  function removePath(state, targetPath, recursive = false) {
    const normalized = normalizePath(state, targetPath);
    const node = state.fs[normalized];

    if (!node) return { ok: false, error: "No such file or directory" };

    if (node.type === "dir") {
      const children = listChildren(state, normalized, true);
      if (children.length && !recursive) {
        return { ok: false, error: "Directory not empty" };
      }

      collectDescendants(state, normalized).forEach((entry) => {
        delete state.fs[entry.path];
      });
      return { ok: true };
    }

    delete state.fs[normalized];
    return { ok: true };
  }

  function copyPath(state, sourcePath, destPath) {
    const source = getNode(state, sourcePath);
    if (!source) return { ok: false, error: "Source not found" };

    const sourceNormalized = normalizePath(state, sourcePath);
    const destNormalized = normalizePath(state, destPath);

    if (source.type === "file") {
      createFile(state, {
        path: destNormalized,
        content: source.content,
        hidden: source.hidden,
        archiveEntries: source.archiveEntries
      });
      return { ok: true };
    }

    collectDescendants(state, sourceNormalized).forEach((node) => {
      const relative = node.path.slice(sourceNormalized.length).replace(/^\//, "");
      const target = relative ? `${destNormalized}/${relative}` : destNormalized;
      if (node.type === "dir") {
        ensureDirectory(state, target);
      } else {
        createFile(state, {
          path: target,
          content: node.content,
          hidden: node.hidden,
          archiveEntries: node.archiveEntries
        });
      }
    });

    return { ok: true };
  }

  function movePath(state, sourcePath, destPath) {
    const copied = copyPath(state, sourcePath, destPath);
    if (!copied.ok) return copied;
    return removePath(state, sourcePath, true);
  }

  function listProcesses(state) {
    return [...state.processes].sort((a, b) => a.pid - b.pid);
  }

  function killProcess(state, pid) {
    const index = state.processes.findIndex((process) => String(process.pid) === String(pid));
    if (index === -1) return { ok: false, error: "Process not found" };
    const [removed] = state.processes.splice(index, 1);
    return { ok: true, process: removed };
  }

  function openListener(state, listener) {
    state.listeners.push({ ...listener });
    return { ok: true };
  }

  function clearListeners(state) {
    state.listeners = [];
  }

  function findTarget(state, search) {
    const value = (search || "").trim();
    return state.targets.find((target) => {
      if (target.ip === value) return true;
      if (target.hostname === value) return true;
      return (target.aliases || []).includes(value);
    });
  }

  function recordDiscovery(state, record) {
    state.discovery.push({ ...record, recordedAt: Date.now() });
  }

  function extractArchive(state, archivePath) {
    const archive = getNode(state, archivePath);

    if (!archive) return { ok: false, error: "Archive not found" };
    if (archive.type !== "file") return { ok: false, error: "Path is not a file" };
    if (!archive.archiveEntries || !archive.archiveEntries.length) {
      return { ok: false, error: "Archive has no extractable entries" };
    }

    const parent = archive.path.slice(0, archive.path.lastIndexOf("/")) || getRootPath(state);

    archive.archiveEntries.forEach((entry) => {
      const target = normalizePath(state, entry.path, parent);
      if (entry.type === "dir") {
        ensureDirectory(state, target);
      } else {
        createFile(state, {
          path: target,
          content: entry.content || "",
          hidden: Boolean(entry.hidden),
          executable: Boolean(entry.executable)
        });
      }
    });

    state.extractedArchives.push(archive.path);
    return { ok: true };
  }

  function createState(environment) {
    const base = clone(environment);
    const state = {
      platform: base.platform || "linux",
      shell: base.platform || "linux",
      user: base.user || (base.platform === "cmd" ? "student" : "student"),
      host: base.host || "lab",
      drive: base.drive || "C:",
      cwd: base.cwd || (base.platform === "cmd" ? "C:/Users/student" : "/home/student"),
      home: base.home || (base.platform === "cmd" ? "C:/Users/student" : "/home/student"),
      fs: {},
      processes: clone(base.processes || []),
      targets: clone(base.targets || []),
      discovery: [],
      listeners: [],
      extractedArchives: [],
      metasploit: {
        active: false,
        currentModule: null,
        options: {}
      },
      activeConnection: null,
      history: [],
      completedScenarioIds: clone(base.completedScenarioIds || [])
    };

    ensureDirectory(state, getRootPath(state));
    ensureDirectory(state, state.home);
    ensureDirectory(state, state.cwd);

    (base.directories || []).forEach((dir) => ensureDirectory(state, dir));
    (base.files || []).forEach((file) => createFile(state, file));

    return state;
  }

  function getPrompt(state) {
    if (state.metasploit.active) return "msf6 >";
    if (state.activeConnection) {
      if (state.activeConnection.type === "smtp") return "smtp>";
      if (state.activeConnection.type === "shell") return "shell>";
      return "conn>";
    }

    if (isWindowsState(state)) {
      return `${displayPath(state, state.cwd)}>`;
    }

    return `${state.user}@${state.host}:${displayPath(state, state.cwd, true)}$`;
  }

  window.StateManager = {
    clone,
    createState,
    normalizePath,
    displayPath,
    getPrompt,
    getNode,
    listChildren,
    readFile,
    writeFile,
    mkdir,
    touch,
    changeDirectory,
    removePath,
    copyPath,
    movePath,
    listProcesses,
    killProcess,
    openListener,
    clearListeners,
    findTarget,
    recordDiscovery,
    extractArchive,
    isWindowsState
  };
})();
