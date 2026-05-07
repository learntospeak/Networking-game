(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function step(config) {
    return {
      objective: config.objective,
      commandFamily: config.commandFamily || "",
      hints: config.hints || [],
      context: config.context || "",
      explanation: config.explanation,
      whyThisMatters: config.whyThisMatters || "",
      successFeedback: config.successFeedback || "That command moves the task forward.",
      nextObjective: config.nextObjective || "",
      realWorldNote: config.realWorldNote || "",
      completionSummary: config.completionSummary || "",
      walkthrough: config.walkthrough || [],
      demoCommand: config.demoCommand || "",
      demoOutput: config.demoOutput || [],
      demoExplanation: config.demoExplanation || "",
      accepts: config.accepts || [],
      partials: config.partials || [],
      exploration: config.exploration || []
    };
  }

  function linuxEnv(config = {}) {
    return {
      platform: "linux",
      user: "student",
      host: "lab",
      home: "/home/student",
      cwd: config.cwd || "/home/student",
      directories: [
        "/home/student",
        "/home/student/projects",
        "/home/student/downloads",
        "/home/student/scripts",
        "/var/log",
        "/srv",
        ...(config.directories || [])
      ],
      files: config.files || [],
      processes: config.processes || [],
      networkConnections: config.networkConnections || [],
      targets: config.targets || commonTargets()
    };
  }

  function cmdEnv(config = {}) {
    return {
      platform: "cmd",
      user: "student",
      host: "lab-win",
      home: "C:/Users/student",
      cwd: config.cwd || "C:/Users/student",
      drive: "C:",
      directories: [
        "C:/Users/student",
        "C:/Users/student/Desktop",
        "C:/Users/student/Downloads",
        "C:/Lab",
        "C:/Lab/Logs",
        "C:/Lab/Temp",
        "C:/Lab/Reports",
        "C:/Lab/Shares",
        "C:/Lab/Services",
        "C:/Windows",
        "C:/Windows/System32",
        ...(config.directories || [])
      ],
      files: config.files || [],
      processes: config.processes || [],
      targets: config.targets || commonTargets(),
      envVars: config.envVars || commonWindowsEnvVars(),
      systemInfo: config.systemInfo || commonWindowsSystemInfo(),
      networkAdapters: config.networkAdapters || commonWindowsNetworkAdapters(),
      networkConnections: config.networkConnections || commonWindowsConnections(),
      arpCache: config.arpCache || commonWindowsArpCache(),
      routeTable: config.routeTable || commonWindowsRouteTable(),
      dnsRecords: config.dnsRecords || commonWindowsDnsRecords(),
      services: config.services || commonWindowsServices(),
      drivers: config.drivers || commonWindowsDrivers(),
      userSessions: config.userSessions || commonWindowsUserSessions(),
      localUsers: config.localUsers || commonWindowsUsers(),
      localGroups: config.localGroups || commonWindowsLocalGroups(),
      shares: config.shares || commonWindowsShares(),
      mappedShares: config.mappedShares || [],
      scheduledTasks: config.scheduledTasks || commonWindowsScheduledTasks(),
      pathExecutables: config.pathExecutables || commonWindowsPathExecutables(),
      currentDate: config.currentDate || "04/17/2026",
      currentTime: config.currentTime || "08:24 AM",
      promptTemplate: config.promptTemplate || "$P$G"
    };
  }

  function ciscoEnv(config = {}) {
    const hostname = config.hostname || "Router";
    const interfaces = config.interfaces || commonCiscoInterfaces();
    const staticRoutes = config.staticRoutes || commonCiscoStaticRoutes();

    return {
      platform: "cisco",
      host: hostname,
      home: "/",
      cwd: "/",
      directories: ["/"],
      files: [],
      processes: [],
      targets: config.targets || commonCiscoTargets(),
      router: {
        hostname,
        mode: config.mode || "user-exec",
        selectedInterface: config.selectedInterface || null,
        configDirty: Boolean(config.configDirty),
        version: config.version || "Cisco IOS Software, 1900 Software (C1900-UNIVERSALK9-M), Version 15.4(3)M",
        model: config.model || "Cisco 1941/K9",
        image: config.image || "flash:c1900-universalk9-mz.SPA.154-3.M.bin",
        serialNumber: config.serialNumber || "FTX0001ABCD",
        uptime: config.uptime || "2 weeks, 4 days, 1 hour, 12 minutes",
        configRegister: config.configRegister || "0x2102",
        interfaces,
        staticRoutes,
        startupConfig: config.startupConfig || buildCiscoStartupConfigSnapshot({
          hostname,
          interfaces,
          staticRoutes
        })
      }
    };
  }

  function commonTargets() {
    return clone([
      {
        ip: "192.168.56.102",
        hostname: "metasploitable2",
        aliases: ["target", "ftp-lab"],
        reachable: true,
        os: "Linux 2.6.x",
        ports: [
          { port: 21, proto: "tcp", service: "ftp", version: "vsftpd 2.3.4", banner: "220 (vsFTPd 2.3.4)" },
          { port: 22, proto: "tcp", service: "ssh", version: "OpenSSH 4.7p1", banner: "SSH-2.0-OpenSSH_4.7p1 Debian-8ubuntu1" },
          { port: 23, proto: "tcp", service: "telnet", version: "Linux telnetd", banner: "Connected to metasploitable2." },
          { port: 25, proto: "tcp", service: "smtp", version: "Postfix smtpd", banner: "220 metasploitable2 ESMTP Postfix" },
          { port: 80, proto: "tcp", service: "http", version: "Apache httpd 2.2.8", banner: "HTTP/1.1 200 OK" },
          { port: 139, proto: "tcp", service: "netbios-ssn", version: "Samba smbd 3.0.20-Debian", banner: "Samba smbd 3.0.20" },
          { port: 445, proto: "tcp", service: "microsoft-ds", version: "Samba smbd 3.0.20-Debian", banner: "Samba smbd 3.0.20" },
          { port: 53, proto: "udp", service: "domain", version: "ISC BIND", banner: "DNS service ready" },
          { port: 161, proto: "udp", service: "snmp", version: "Net-SNMP", banner: "SNMP response available" }
        ]
      },
      {
        ip: "192.168.56.10",
        hostname: "web-lab",
        aliases: ["web", "frontend"],
        reachable: true,
        os: "Ubuntu Linux",
        ports: [
          { port: 80, proto: "tcp", service: "http", version: "nginx 1.18.0", banner: "HTTP/1.1 200 OK" },
          { port: 443, proto: "tcp", service: "https", version: "nginx 1.18.0", banner: "TLS service ready" },
          { port: 22, proto: "tcp", service: "ssh", version: "OpenSSH 8.2p1", banner: "SSH-2.0-OpenSSH_8.2p1" }
        ]
      },
      {
        ip: "192.168.56.20",
        hostname: "fileserver",
        aliases: ["storage", "archive"],
        reachable: true,
        os: "Windows Server 2019",
        ports: [
          { port: 445, proto: "tcp", service: "microsoft-ds", version: "SMB Server 2019", banner: "SMB service ready" },
          { port: 139, proto: "tcp", service: "netbios-ssn", version: "NetBIOS Session Service", banner: "NetBIOS session ready" },
          { port: 3389, proto: "tcp", service: "ms-wbt-server", version: "RDP", banner: "RDP service ready" }
        ]
      }
    ]);
  }

  function commonCiscoTargets() {
    return clone([
      {
        ip: "192.168.10.10",
        hostname: "branch-pc",
        aliases: ["branch-pc", "pc1", "lan-host"],
        reachable: true,
        os: "Windows Workstation",
        ports: []
      },
      {
        ip: "198.51.100.2",
        hostname: "isp-gateway",
        aliases: ["isp", "wan-gw"],
        reachable: true,
        os: "Upstream Router",
        ports: []
      },
      {
        ip: "172.16.30.10",
        hostname: "hq-file",
        aliases: ["hq", "hq-file", "remote-lan"],
        reachable: true,
        os: "Linux Server",
        ports: []
      }
    ]);
  }

  function commonCiscoInterfaces() {
    return clone([
      {
        name: "GigabitEthernet0/0",
        aliases: ["g0/0", "gi0/0"],
        ipAddress: "",
        subnetMask: "",
        adminUp: false,
        lineProtocol: false,
        description: "Branch user LAN"
      },
      {
        name: "GigabitEthernet0/1",
        aliases: ["g0/1", "gi0/1"],
        ipAddress: "198.51.100.1",
        subnetMask: "255.255.255.252",
        adminUp: true,
        lineProtocol: true,
        description: "WAN uplink to ISP"
      },
      {
        name: "Loopback0",
        aliases: ["lo0"],
        ipAddress: "10.255.255.1",
        subnetMask: "255.255.255.255",
        adminUp: true,
        lineProtocol: true,
        description: "Management loopback"
      }
    ]);
  }

  function commonCiscoStaticRoutes() {
    return clone([
      {
        network: "0.0.0.0",
        mask: "0.0.0.0",
        nextHop: "198.51.100.2"
      }
    ]);
  }

  function buildCiscoStartupConfigSnapshot({ hostname, interfaces, staticRoutes }) {
    return clone({
      hostname,
      interfaces: interfaces || commonCiscoInterfaces(),
      staticRoutes: staticRoutes || commonCiscoStaticRoutes()
    });
  }

  function commonWindowsEnvVars() {
    return clone({
      ALLUSERSPROFILE: "C:\\ProgramData",
      APPDATA: "C:\\Users\\student\\AppData\\Roaming",
      COMPUTERNAME: "LAB-WIN",
      COMSPEC: "C:\\Windows\\System32\\cmd.exe",
      PATH: "C:\\Windows\\System32;C:\\Windows;C:\\Python311",
      TEMP: "C:\\Temp",
      TMP: "C:\\Temp",
      USERDOMAIN: "LAB",
      USERNAME: "student",
      USERPROFILE: "C:\\Users\\student"
    });
  }

  function commonWindowsSystemInfo() {
    return clone({
      hostName: "LAB-WIN",
      osName: "Microsoft Windows 10 Enterprise",
      osVersion: "10.0.19045 N/A Build 19045",
      osManufacturer: "Microsoft Corporation",
      systemModel: "VMware Virtual Platform",
      systemType: "x64-based PC",
      bootTime: "4/17/2026, 7:58:11 AM",
      hotfixCount: 5,
      biosVersion: "VMware, Inc. VMW71.00V.21100432.B64.2202210304, 02/21/2022"
    });
  }

  function commonWindowsNetworkAdapters() {
    return clone([
      {
        name: "Ethernet0",
        description: "Intel(R) 82574L Gigabit Network Connection",
        ipv4: "192.168.56.25",
        subnetMask: "255.255.255.0",
        gateway: "192.168.56.1",
        dns: ["192.168.56.1"],
        mac: "00-0C-29-5E-11-22",
        dhcpEnabled: false
      }
    ]);
  }

  function commonWindowsConnections() {
    return clone([
      { proto: "TCP", localAddress: "192.168.56.25:49712", foreignAddress: "192.168.56.10:443", state: "ESTABLISHED", pid: 4088 },
      { proto: "TCP", localAddress: "0.0.0.0:135", foreignAddress: "0.0.0.0:0", state: "LISTENING", pid: 960 },
      { proto: "TCP", localAddress: "0.0.0.0:445", foreignAddress: "0.0.0.0:0", state: "LISTENING", pid: 4 },
      { proto: "UDP", localAddress: "0.0.0.0:68", foreignAddress: "*:*", state: "", pid: 1140 }
    ]);
  }

  function commonWindowsArpCache() {
    return clone([
      { interface: "192.168.56.25", ip: "192.168.56.1", mac: "08-00-27-AA-BB-CC", type: "dynamic" },
      { interface: "192.168.56.25", ip: "192.168.56.10", mac: "08-00-27-11-22-33", type: "dynamic" },
      { interface: "192.168.56.25", ip: "192.168.56.20", mac: "08-00-27-44-55-66", type: "dynamic" }
    ]);
  }

  function commonWindowsRouteTable() {
    return clone([
      { network: "0.0.0.0", netmask: "0.0.0.0", gateway: "192.168.56.1", interface: "192.168.56.25", metric: 25 },
      { network: "127.0.0.0", netmask: "255.0.0.0", gateway: "On-link", interface: "127.0.0.1", metric: 331 },
      { network: "192.168.56.0", netmask: "255.255.255.0", gateway: "On-link", interface: "192.168.56.25", metric: 281 },
      { network: "192.168.56.25", netmask: "255.255.255.255", gateway: "On-link", interface: "192.168.56.25", metric: 281 }
    ]);
  }

  function commonWindowsDnsRecords() {
    return clone([
      { hostname: "fileserver", address: "192.168.56.20" },
      { hostname: "web-lab", address: "192.168.56.10" },
      { hostname: "metasploitable2", address: "192.168.56.102" },
      { hostname: "dc01", address: "192.168.56.5" }
    ]);
  }

  function commonWindowsServices() {
    return clone([
      { name: "Spooler", displayName: "Print Spooler", status: "RUNNING", pid: 1504, startType: "Auto" },
      { name: "w32time", displayName: "Windows Time", status: "RUNNING", pid: 1224, startType: "Manual" },
      { name: "BITS", displayName: "Background Intelligent Transfer Service", status: "RUNNING", pid: 1756, startType: "Manual" },
      { name: "Dnscache", displayName: "DNS Client", status: "RUNNING", pid: 1092, startType: "Auto" }
    ]);
  }

  function commonWindowsDrivers() {
    return clone([
      { moduleName: "ACPI", displayName: "Microsoft ACPI Driver", startMode: "Boot", state: "Running" },
      { moduleName: "disk", displayName: "Disk Driver", startMode: "System", state: "Running" },
      { moduleName: "Tcpip", displayName: "TCP/IP Protocol Driver", startMode: "System", state: "Running" },
      { moduleName: "vmxnet3", displayName: "VMware vmxnet3 Ethernet Adapter Driver", startMode: "Manual", state: "Running" }
    ]);
  }

  function commonWindowsUserSessions() {
    return clone([
      { username: "student", sessionName: "console", id: 1, state: "Active", idleTime: "none", logonTime: "4/17/2026 8:00 AM" },
      { username: "analyst", sessionName: "rdp-tcp#3", id: 2, state: "Disc", idleTime: "1:12", logonTime: "4/17/2026 6:42 AM" }
    ]);
  }

  function commonWindowsUsers() {
    return clone([
      { username: "Administrator", fullName: "Built-in Administrator", enabled: true, lastLogon: "4/16/2026 7:11 PM", groups: ["Administrators"] },
      { username: "student", fullName: "Lab Student", enabled: true, lastLogon: "4/17/2026 8:00 AM", groups: ["Users"] },
      { username: "analyst", fullName: "IR Analyst", enabled: true, lastLogon: "4/17/2026 6:42 AM", groups: ["Administrators", "Remote Desktop Users"] },
      { username: "backupsvc", fullName: "Backup Service", enabled: true, lastLogon: "Never", groups: ["Backup Operators"] }
    ]);
  }

  function commonWindowsLocalGroups() {
    return clone([
      { name: "Administrators", members: ["Administrator", "analyst"] },
      { name: "Users", members: ["student"] },
      { name: "Backup Operators", members: ["backupsvc"] },
      { name: "Remote Desktop Users", members: ["analyst"] }
    ]);
  }

  function commonWindowsShares() {
    return clone([
      { name: "ADMIN$", path: "C:\\Windows", remark: "Remote Admin" },
      { name: "C$", path: "C:\\", remark: "Default share" },
      { name: "Tools", path: "C:\\Lab\\Shares\\Tools", remark: "IR toolkit share", server: "fileserver", unc: "\\\\fileserver\\Tools" },
      { name: "Reports", path: "C:\\Lab\\Shares\\Reports", remark: "Incident report drop", server: "fileserver", unc: "\\\\fileserver\\Reports" }
    ]);
  }

  function commonWindowsScheduledTasks() {
    return clone([
      { name: "\\DailyBackup", nextRunTime: "4/18/2026 1:00 AM", status: "Ready", taskToRun: "C:\\Lab\\Scripts\\backup.cmd" },
      { name: "\\LogArchive", nextRunTime: "4/17/2026 11:00 PM", status: "Ready", taskToRun: "C:\\Lab\\Scripts\\archive-logs.cmd" }
    ]);
  }

  function commonWindowsPathExecutables() {
    return clone([
      "C:\\Windows\\System32\\arp.exe",
      "C:\\Windows\\System32\\cmd.exe",
      "C:\\Windows\\System32\\find.exe",
      "C:\\Windows\\System32\\findstr.exe",
      "C:\\Windows\\System32\\ipconfig.exe",
      "C:\\Windows\\System32\\netstat.exe",
      "C:\\Windows\\System32\\nslookup.exe",
      "C:\\Windows\\System32\\ping.exe",
      "C:\\Windows\\System32\\route.exe",
      "C:\\Python311\\python.exe"
    ]);
  }

  function selectTargets(...identifiers) {
    if (!identifiers.length) {
      return commonTargets();
    }

    const wanted = identifiers.map((value) => String(value || "").toLowerCase());

    return commonTargets().filter((target) => {
      const keys = [
        target.ip,
        target.hostname,
        ...(target.aliases || [])
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());

      return keys.some((key) => wanted.includes(key));
    });
  }

  function shellDisplayLabel(shell) {
    if (shell === "cmd") return "Windows CMD";
    if (shell === "cisco") return "Cisco IOS CLI";
    if (shell === "metasploit") return "Metasploit";
    return "Linux Terminal";
  }

  function environmentCategoryLabel(category) {
    if (category === "windows") return "Windows Terminal Learning";
    if (category === "cisco") return "Cisco CLI Lab";
    if (category === "cyber") return "Cyber Challenge Mode";
    return "Linux Terminal Learning";
  }

  function normalizeMachineContexts(machineContexts = []) {
    return machineContexts
      .map((entry) => {
        if (!entry) return null;

        return {
          label: entry.label || "Machine Context",
          role: entry.role || entry.kind || "",
          detail: entry.detail || ""
        };
      })
      .filter(Boolean);
  }

  function inferTargetContextLabel(target) {
    const combined = `${target?.hostname || ""} ${target?.os || ""}`.toLowerCase();

    if (/\bwindows\b/.test(combined)) {
      return "Windows Host";
    }

    if (/\blinux\b|\bubuntu\b|\bdebian\b/.test(combined)) {
      return "Linux Server";
    }

    return "Target Machine";
  }

  function buildMachineContexts(config, environment, shell) {
    const provided = normalizeMachineContexts(config.machineContexts);
    if (provided.length) {
      return provided;
    }

    const environmentCategory = config.environmentCategory || (config.mode === "challenge" ? "cyber" : shell === "cmd" ? "windows" : shell === "cisco" ? "cisco" : "linux");
    const location = environment.cwd || environment.home || "";

    if (environmentCategory === "cyber") {
      const contexts = [
        {
          label: "Analyst Box",
          role: shellDisplayLabel(shell),
          detail: location
        }
      ];

      (environment.targets || []).forEach((target) => {
        contexts.push({
          label: inferTargetContextLabel(target),
          role: target.hostname ? `${target.hostname} (${target.ip})` : target.ip,
          detail: target.os || ""
        });
      });

      return contexts;
    }

    if (environmentCategory === "cisco") {
      return [
        {
          label: config.deviceLabel || "Training Router",
          role: shellDisplayLabel(shell),
          detail: environment.router?.hostname || environment.host || "Router"
        }
      ];
    }

    return [
      {
        label: shell === "cmd" ? "Windows Host" : "Linux Host",
        role: shellDisplayLabel(shell),
        detail: location
      }
    ];
  }

  function buildScenarioContextMetadata(config, environment, shell) {
    const environmentCategory = config.environmentCategory || (config.mode === "challenge" ? "cyber" : shell === "cmd" ? "windows" : shell === "cisco" ? "cisco" : "linux");

    return {
      environmentCategory,
      environmentLabel: environmentCategoryLabel(environmentCategory),
      environmentPolicy: config.environmentPolicy || "segregated",
      machineContexts: buildMachineContexts({ ...config, environmentCategory }, environment, shell)
    };
  }

  function archiveFile(path, entries) {
    return { path, content: "", archiveEntries: entries };
  }

  function commandMatch(command, extras = {}) {
    return { command, ...extras };
  }

  function rawMatch(regex, extras = {}) {
    return { raw: regex, ...extras };
  }

  const WINDOWS_COMMAND_FAMILIES = {
    ipconfig: {
      family: "ipconfig",
      base: "ipconfig",
      use: "Use it to check this computer's network settings.",
      firstTry: "ipconfig",
      variations: [
        { command: "ipconfig", meaning: "quick network view" },
        { command: "ipconfig /all", meaning: "detailed network view" },
        { command: "ipconfig /release", meaning: "drop current network lease", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "ipconfig /renew", meaning: "ask for a new lease", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "ipconfig /renew4", meaning: "ask for a new IPv4 lease", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "ipconfig /renew6", meaning: "ask for a new IPv6 lease", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "ipconfig /flushdns", meaning: "clear saved DNS answers", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "ipconfig /displaydns", meaning: "show saved DNS answers" },
        { command: "ipconfig /registerdns", meaning: "refresh DNS registration", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." }
      ]
    },
    netstat: {
      family: "netstat",
      base: "netstat",
      use: "Use it to inspect connections, ports, and process IDs.",
      firstTry: "netstat",
      variations: [
        { command: "netstat", meaning: "quick connection list" },
        { command: "netstat -a", meaning: "show all connections and listeners" },
        { command: "netstat -n", meaning: "show numbers instead of names" },
        { command: "netstat -o", meaning: "show process IDs" },
        { command: "netstat -ano", meaning: "all, numeric, with process IDs" },
        { command: "netstat -r", meaning: "show route table" },
        { command: "netstat -s", meaning: "show protocol stats" },
        { command: "netstat -ano | findstr :445", meaning: "filter for one port" }
      ]
    },
    route: {
      family: "route",
      base: "route print",
      use: "Use it to inspect the route table and gateways.",
      firstTry: "route print",
      variations: [
        { command: "route print", meaning: "show route table" },
        { command: "route print -4", meaning: "show IPv4 routes" },
        { command: "route print -6", meaning: "show IPv6 routes" },
        { command: "route add", meaning: "add a route", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." },
        { command: "route delete", meaning: "delete a route", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." }
      ]
    },
    arp: {
      family: "arp",
      base: "arp -a",
      use: "Use it to inspect IP-to-MAC address mappings.",
      firstTry: "arp -a",
      variations: [
        { command: "arp -a", meaning: "show ARP cache" },
        { command: "arp -d", meaning: "delete ARP entries", safety: "In this lab this is simulated. On a real computer, this can change network behaviour." }
      ]
    },
    nslookup: {
      family: "nslookup",
      base: "nslookup hostname",
      use: "Use it to ask DNS what a name or IP address resolves to.",
      firstTry: "nslookup fileserver",
      variations: [
        { command: "nslookup fileserver", meaning: "hostname to IP address" },
        { command: "nslookup 192.168.56.20", meaning: "IP address to name" },
        { command: "nslookup fileserver 192.168.56.1", meaning: "ask a specific DNS server" },
        { command: "set type=A", meaning: "look for A records" },
        { command: "set type=MX", meaning: "look for mail records" },
        { command: "set type=NS", meaning: "look for name servers" }
      ]
    },
    tracert: {
      family: "tracert",
      base: "tracert hostname",
      use: "Use it to see the path from your PC to a target.",
      firstTry: "tracert web-lab",
      variations: [
        { command: "tracert web-lab", meaning: "trace by hostname" },
        { command: "tracert -d web-lab", meaning: "skip name lookups" },
        { command: "tracert -h 5 web-lab", meaning: "limit hops" },
        { command: "tracert -4 web-lab", meaning: "force IPv4" },
        { command: "tracert -6 web-lab", meaning: "force IPv6" }
      ]
    }
  };

  function cwdMatch(target, extras = {}) {
    return {
      command: "cd",
      finalCwd: target,
      postCheck: (_, state) => {
        if (window.StateManager && typeof window.StateManager.normalizePath === "function") {
          return window.StateManager.normalizePath(state, state.cwd) === window.StateManager.normalizePath(state, target);
        }
        if (String(state?.platform || "").toLowerCase() === "cmd") {
          return String(state.cwd || "").toLowerCase() === String(target || "").toLowerCase();
        }
        return state.cwd === target;
      },
      ...extras
    };
  }

  function fileExistsMatch(path, extras = {}) {
    const { nodeType, postCheck, ...rest } = extras;

    return {
      ...rest,
      fileExists: path,
      postCheck: (execution, state) => {
        const node = window.StateManager.getNode(state, path);
        if (!node) return false;
        if (nodeType && node.type !== nodeType) return false;
        if (postCheck) return postCheck(execution, state);
        return true;
      }
    };
  }

  function listenerPortMatch(port, extras = {}) {
    return { listenerPort: port, ...extras };
  }

  function envVarMatch(name, value, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => {
        if (!state.envVars) return false;
        if (value === undefined) return Object.prototype.hasOwnProperty.call(state.envVars, name);
        return String(state.envVars[name] || "") === String(value);
      }
    };
  }

  function serviceStatusMatch(serviceName, status, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.services)
        && state.services.some((service) => String(service.name).toLowerCase() === String(serviceName).toLowerCase()
          && String(service.status).toUpperCase() === String(status).toUpperCase())
    };
  }

  function mappedShareMatch(drive, unc, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.mappedShares)
        && state.mappedShares.some((share) => String(share.drive).toUpperCase() === String(drive).toUpperCase()
          && String(share.unc).toLowerCase() === String(unc).toLowerCase())
    };
  }

  function promptTemplateMatch(template, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => String(state.promptTemplate || "") === String(template)
    };
  }

  function shutdownMatch(kind, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => state.pendingShutdown && String(state.pendingShutdown.kind) === String(kind)
    };
  }

  function routerModeMatch(mode, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => String(state.router?.mode || "") === String(mode)
    };
  }

  function ciscoHostnameMatch(hostname, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => String(state.router?.hostname || "") === String(hostname)
    };
  }

  function ciscoInterfaceStatusMatch(name, adminUp, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.router?.interfaces)
        && state.router.interfaces.some((iface) => String(iface.name).toLowerCase() === String(name).toLowerCase()
          && Boolean(iface.adminUp) === Boolean(adminUp))
    };
  }

  function ciscoInterfaceAddressMatch(name, ipAddress, subnetMask, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.router?.interfaces)
        && state.router.interfaces.some((iface) => String(iface.name).toLowerCase() === String(name).toLowerCase()
          && String(iface.ipAddress || "") === String(ipAddress)
          && String(iface.subnetMask || "") === String(subnetMask))
    };
  }

  function ciscoInterfaceDescriptionMatch(name, description, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.router?.interfaces)
        && state.router.interfaces.some((iface) => String(iface.name).toLowerCase() === String(name).toLowerCase()
          && String(iface.description || "") === String(description))
    };
  }

  function ciscoStartupConfigMatch(extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => {
        const startup = state.router?.startupConfig;
        if (!startup) return false;

        const runningInterfaces = JSON.stringify(state.router?.interfaces || []);
        const startupInterfaces = JSON.stringify(startup.interfaces || []);
        const runningRoutes = JSON.stringify(state.router?.staticRoutes || []);
        const startupRoutes = JSON.stringify(startup.staticRoutes || []);

        return String(state.router?.hostname || "") === String(startup.hostname || "")
          && runningInterfaces === startupInterfaces
          && runningRoutes === startupRoutes;
      }
    };
  }

  function ciscoStaticRouteMatch(network, mask, nextHop, extras = {}) {
    return {
      ...extras,
      postCheck: (_, state) => Array.isArray(state.router?.staticRoutes)
        && state.router.staticRoutes.some((route) => String(route.network) === String(network)
          && String(route.mask) === String(mask)
          && String(route.nextHop) === String(nextHop))
    };
  }

  function explorationRule(match, feedback, coach) {
    return {
      match,
      classification: "exploration",
      countsAsAttempt: false,
      feedback,
      coach
    };
  }

  function firstSentence(text) {
    if (!text) return "";
    const match = text.match(/^[^.!?]+[.!?]?/);
    return match ? match[0].trim() : text.trim();
  }

  function getTargetPath(stepConfig) {
    const rule = (stepConfig.accepts || []).find((item) => item && (item.finalCwd || item.fileExists));
    if (!rule) return "";
    return rule.finalCwd || rule.fileExists || "";
  }

  function inferPathContext(path, shell) {
    if (!path) return "";

    if (shell === "cmd") {
      if (/\/logs/i.test(path)) {
        return "On Windows labs, logs and notes are usually kept in named working folders. Use dir to inspect those folders before you move.";
      }

      return "In CMD, dir is your main discovery command. Use it to inspect folders before you commit to a path change or file read.";
    }

    if (path.startsWith("/srv")) {
      return "On Linux, service-owned application data often lives under /srv. If the exact path is new to you, explore from / with ls and move one level at a time.";
    }

    if (path.startsWith("/var/log")) {
      return "On Linux, system and service logs commonly live under /var/log. A quick pwd or ls keeps you oriented before you open files.";
    }

    if (path.startsWith("/etc")) {
      return "On Linux, configuration files often live under /etc. Explore the tree with ls before you assume a filename or folder.";
    }

    return "Use discovery commands first. pwd and ls reduce path mistakes before you read, create, or move anything.";
  }

  function extractStepUrl(stepConfig) {
    const hintUrl = (stepConfig.hints || [])
      .map((hint) => {
        const match = String(hint).match(/https?:\/\/[^\s`]+/i);
        return match ? match[0] : "";
      })
      .find(Boolean);

    if (hintUrl) return hintUrl;

    const acceptUrl = (stepConfig.accepts || [])
      .map((rule) => {
        if (!rule || !(rule.raw instanceof RegExp)) return "";
        const match = rule.raw.source.match(/https?:\\\/\\\/[^\\s)]+/i);
        return match ? match[0].replace(/\\\//g, "/") : "";
      })
      .find(Boolean);

    return acceptUrl || "";
  }

  function inferCommandContext(scenario, stepConfig) {
    const objective = stepConfig.objective.toLowerCase();

    if (/hidden/.test(objective)) {
      return "On Linux, files that begin with a dot are hidden from a normal listing. Use ls -a when you suspect a hidden config or state file.";
    }

    if (/version/.test(objective) && /nmap/.test(objective)) {
      return "In Nmap, -sV asks open services to identify themselves. Use it when an open port alone is not enough evidence.";
    }

    if (/\bos\b|operating system/.test(objective)) {
      return "Nmap uses -O for operating-system fingerprinting. It belongs after you have confirmed the host is reachable.";
    }

    if (/udp/.test(objective)) {
      return "Use -sU when the service is expected on UDP instead of TCP. That changes how Nmap probes the target.";
    }

    if (/xml output/.test(objective)) {
      return "Nmap uses -oX when you want XML output for another tool or parser.";
    }

    if (/all standard output formats/.test(objective)) {
      return "Nmap uses -oA with a base name when you want normal, XML, and grepable output together.";
    }

    if (/exclude/.test(objective)) {
      return "Use --exclude when you want to keep a known infrastructure host out of a wider sweep.";
    }

    if (/from file/.test(objective)) {
      return "Nmap uses -iL to read targets from a file. This is the normal way to scale a scan beyond one host.";
    }

    if (/top-ports/.test(objective)) {
      return "The --top-ports option is a quick-triage tool. It scans the most common ports before you go deeper.";
    }

    if (/extract/.test(objective) && /tar/.test(stepConfig.hints.join(" ").toLowerCase() + stepConfig.explanation.toLowerCase())) {
      return "For .tar.gz archives, tar -xvzf is a common extraction form: x extracts, v shows files, z handles gzip, and f points at the archive name.";
    }

    if (/download/.test(objective) && /wget/.test(stepConfig.hints.join(" ").toLowerCase())) {
      const url = extractStepUrl(stepConfig);
      if (url) {
        return `wget retrieves a remote file over HTTP or HTTPS. In this lab, the archive is hosted at ${url}. Use -O when you want a clean local filename instead of the server default.`;
      }
      return "wget retrieves a remote file over HTTP or HTTPS. Use -O when you want a clean local filename instead of the server default.";
    }

    if (/listener/.test(objective)) {
      return "With Netcat, -l means listen locally. Use it when you expect the remote side to call back to you.";
    }

    if (/connect to smtp/.test(objective)) {
      return "Netcat can open a raw TCP session so you can speak a protocol by hand. SMTP on port 25 is a good example.";
    }

    if (/ehlo|mail from|rcpt to|data|quit/.test(objective)) {
      return "SMTP is an ordered conversation. Start with EHLO, then set sender and recipient, then DATA, and quit cleanly when done.";
    }

    if (/search the local exploit database/.test(objective)) {
      return "Exploit research should come after you have solid service or version evidence. searchsploit is for narrowing that evidence into candidate references.";
    }

    if (/open metasploit/.test(objective)) {
      return "Move into Metasploit after you have enough evidence to justify an exploit path. The framework is for controlled execution, not guessing.";
    }

    if (/search for .*module|search for samba|search for vsftpd/.test(objective)) {
      return "Inside msfconsole, search is how you locate candidate modules before you try to use one.";
    }

    if (/load the .*module|select the .*module|use exploit/.test(objective)) {
      return "Inside msfconsole, use selects a module and changes the current context to that exploit.";
    }

    if (/set the remote target host|set rhosts/.test(objective)) {
      return "Metasploit modules need target options such as RHOSTS before execution makes sense.";
    }

    if (/run the exploit|execute the loaded exploit/.test(objective)) {
      return "Run belongs at the end of the chain, after module selection and target configuration are already correct.";
    }

    if (/filter/.test(objective)) {
      return scenario.shell === "cmd"
        ? "Use findstr after you have seen the raw file once. Filtering is how you reduce noise to the lines that matter."
        : "Use grep after you have seen the raw file once. Filtering is how you reduce noise to the lines that matter.";
    }

    if (/terminate|kill|stop/.test(objective)) {
      return "Only kill a process after you have evidence for the exact PID. Good operators gather before they act.";
    }

    if (/reachable|reachability|responds on the network/.test(objective)) {
      return "Start with reachability before deeper service work. A fast connectivity check prevents wasted scanning.";
    }

    return "";
  }

  function inferStepContext(scenario, stepConfig) {
    if (stepConfig.context) return stepConfig.context;

    const pathContext = inferPathContext(getTargetPath(stepConfig), scenario.shell);
    if (pathContext) return pathContext;

    const commandContext = inferCommandContext(scenario, stepConfig);
    if (commandContext) return commandContext;

    if (scenario.level === "Beginner") {
      return "Start by gathering evidence from the terminal. Use simple discovery commands and let the output tell you what to do next.";
    }

    if (scenario.level === "Intermediate") {
      return "Use the command output you already have to justify the next move. This step is meant to be reasoned through, not guessed.";
    }

    return "At this level, treat the shell output as evidence. Explore just enough to support the next action instead of memorising a fixed path.";
  }

  function stepEvidenceBoundary(stepConfig, scenario) {
    const text = `${stepConfig?.objective || ""} ${stepConfig?.successFeedback || ""} ${scenario?.title || ""}`.toLowerCase();

    if (/\bping\b|\breachab|\bresponds\b/.test(text)) {
      return "A successful reachability check tells you the host answers on the network. It does not prove DNS, application health, or user access are healthy.";
    }

    if (/\bnslookup\b|\bdns\b|\bresolve\b|\bhostname\b/.test(text)) {
      return "A successful lookup proves that DNS returned an answer. It does not prove the target service is reachable or behaving correctly.";
    }

    if (/\bdir\b|\bls\b|\bpwd\b|\bcd\b|\btree\b/.test(text)) {
      return "This confirms where you are and what artifacts are available. It does not explain the fault by itself, but it keeps the investigation grounded.";
    }

    if (/\bcat\b|\btype\b|\bgrep\b|\bfindstr\b|\bread\b|\blog\b|\bnote\b/.test(text)) {
      return "Reading the artifact gives you direct evidence from the system or note trail. You still need to decide whether that evidence actually explains the reported symptom.";
    }

    if (/\bshow ip interface brief\b|\binterface\b|\bno shutdown\b|\bip address\b|\broute\b|\bhostname\b/.test(text)) {
      return "This confirms device state or configuration. It still needs a follow-up verification step before you treat the network issue as resolved.";
    }

    if (/\btasklist\b|\bps\b|\btaskkill\b|\bkill\b|\bprocess\b/.test(text)) {
      return "Process evidence tells you what is running right now. It does not prove user impact is resolved until you verify behavior afterward.";
    }

    if (/\bnet use\b|\bshare\b|\bmapped\b/.test(text)) {
      return "This confirms the share state you can see from the workstation. It does not prove every downstream file operation is healthy unless you verify it.";
    }

    if (/\bnmap\b|\bscan\b|\bport\b|\bservice version\b|\bnetcat\b|\bsmtp\b/.test(text)) {
      return "This gives you network evidence at a point in time. It does not replace application testing, user validation, or authorization checks.";
    }

    if (/\bpython\b|\bscript\b|\bextract\b|\bdownload\b/.test(text)) {
      return "This proves the workflow step succeeded locally. It does not tell you whether the resulting content is correct until you inspect the output.";
    }

    return "This gives you one piece of evidence. Use it to decide the next step instead of assuming the entire issue is already understood.";
  }

  function enrichExplanation(stepConfig, scenario) {
    const base = String(stepConfig?.explanation || "").trim();
    const evidenceBoundary = stepEvidenceBoundary(stepConfig, scenario);
    if (!base) {
      return evidenceBoundary;
    }

    if (/does not prove|doesn't prove|point in time|follow-up verification/i.test(base)) {
      return base;
    }

    return `${base} ${evidenceBoundary}`;
  }

  function enrichSuccessFeedback(stepConfig, scenario) {
    const base = String(stepConfig?.successFeedback || "That command moves the task forward.").trim();
    const text = `${stepConfig?.objective || ""} ${base}`.toLowerCase();

    if (/that proves|you proved|you confirmed|you verified|does not prove/i.test(base)) {
      return base;
    }

    if (/\bping\b|\breachab|\bresponds\b/.test(text)) {
      return `${base} You now have network evidence, not just a user report, and you can decide whether the next check belongs to DNS, routing, or the service itself.`;
    }

    if (/\bnslookup\b|\bdns\b|\bresolve\b/.test(text)) {
      return `${base} That separates name resolution from pure connectivity and keeps the diagnosis honest.`;
    }

    if (/\bdir\b|\bls\b|\bpwd\b|\bcd\b|\btree\b/.test(text)) {
      return `${base} You have confirmed the working context and can move forward without guessing at paths or artifact names.`;
    }

    if (/\bcat\b|\btype\b|\bgrep\b|\bfindstr\b|\bread\b|\blog\b|\bnote\b/.test(text)) {
      return `${base} You converted a file or note into usable evidence for the next decision.`;
    }

    if (/\binterface\b|\broute\b|\bhostname\b|\bno shutdown\b|\bip address\b/.test(text)) {
      return `${base} The configuration or state change is visible now, which means you can move into verification instead of assumption.`;
    }

    if (/\bkill\b|\btaskkill\b|\bprocess\b/.test(text)) {
      return `${base} The corrective action is done, but a professional still verifies that the symptom actually cleared.`;
    }

    return `${base} Use that result to choose the next logical check instead of widening the investigation too early.`;
  }

  function enrichPartialFeedbackEntry(entry, stepConfig) {
    if (!entry || !entry.feedback) return entry;

    const feedback = String(entry.feedback).trim();
    if (/current question|current objective|right now|does not answer|doesn't answer/i.test(feedback)) {
      return entry;
    }

    return {
      ...entry,
      feedback: `${feedback} Right now, stay focused on the current question before you widen the workflow.`
    };
  }

  function enrichExplorationEntry(entry) {
    if (!entry || !entry.feedback) return entry;

    const feedback = String(entry.feedback).trim();
    const coach = String(entry.coach || "").trim();

    return {
      ...entry,
      feedback: /does not yet complete|background|useful later|not the root cause|does not complete/i.test(feedback)
        ? feedback
        : `${feedback} It is useful background, but it does not yet complete the objective.`,
      coach: coach || "Use the discovery you just gathered to decide the narrowest next command that actually answers the ticket."
    };
  }

  function inferNextObjective(stepConfig, scenario) {
    if (stepConfig?.nextObjective) return stepConfig.nextObjective;

    const steps = scenarioSteps(scenario);
    const stepIndex = steps.indexOf(stepConfig);
    const nextStep = stepIndex >= 0 ? steps[stepIndex + 1] : null;
    if (nextStep?.objective) {
      return nextStep.objective;
    }

    return "Continue with the current mission objective and verify the result before you close the work.";
  }

  function inferRealWorldNote(stepConfig, scenario) {
    if (stepConfig?.realWorldNote) return stepConfig.realWorldNote;

    const text = `${stepConfig?.objective || ""} ${stepConfig?.successFeedback || ""} ${scenario?.title || ""}`.toLowerCase();

    if (/\bping\b|\breachab|\bresponds\b/.test(text)) {
      return "In real support work, a successful ping narrows the fault but does not justify closing the ticket without application or name-resolution checks.";
    }

    if (/\bnslookup\b|\bdns\b|\bresolve\b|\bhostname\b/.test(text)) {
      return "Real incidents often stall when name resolution is assumed instead of tested directly. A quick DNS check can save a lot of guesswork.";
    }

    if (/\bdir\b|\bls\b|\bpwd\b|\bcd\b|\btree\b/.test(text)) {
      return "Technicians lose time when they act in the wrong directory or on the wrong host. Context checks are quiet, but they prevent expensive mistakes.";
    }

    if (/\bcat\b|\btype\b|\bgrep\b|\bfindstr\b|\blog\b|\bnote\b/.test(text)) {
      return "Ticket notes and logs often contain the first reliable evidence. Reading them early keeps the rest of the investigation anchored to facts.";
    }

    if (/\binterface\b|\broute\b|\bhostname\b|\bno shutdown\b|\bip address\b/.test(text)) {
      return "Network changes should be traceable to an observed device state. Operators who verify before and after changes create safer maintenance records.";
    }

    return "Professional troubleshooting is not just about using the right command. It is about proving what changed in your understanding after you ran it.";
  }

  function ensureProgressiveHints(stepConfig, scenario) {
    const hints = Array.isArray(stepConfig.hints) ? stepConfig.hints.filter(Boolean) : [];
    if (hints.length >= 3) return hints.slice(0, 3);

    const context = inferStepContext(scenario, stepConfig) || "Use what the terminal already shows you to narrow the next move.";
    while (hints.length < 3) {
      if (hints.length === 0) {
        hints.push("Start with discovery. Use the terminal to reduce guesswork before you act.");
      } else if (hints.length === 1) {
        hints.push(context);
      } else {
        hints.push("Use the command family that best matches the current objective and the evidence you already have.");
      }
    }

    return hints.slice(0, 3);
  }

  function inferWhyThisMatters(stepConfig) {
    const base = stepConfig.whyThisMatters || firstSentence(stepConfig.explanation);
    if (/before you close|before you move on|before you act|before you change anything/i.test(base)) {
      return base;
    }

    return `${base} That discipline is what keeps a technician from confusing activity with proof.`;
  }

  function buildExplorationRules(scenario, stepConfig) {
    const rules = [];
    const objective = stepConfig.objective.toLowerCase();
    const category = scenario.category.toLowerCase();

    if (scenario.shell === "linux") {
      rules.push(
        explorationRule(commandMatch("pwd"), "Good context check. A junior technician should know exactly where they are before they start changing paths or reading the wrong artifact.", "Use the printed path to decide whether you should stay here, move deeper, or step back and confirm the intended location."),
        explorationRule(commandMatch("ls"), "Good discovery step. Listings reduce guesswork and help you separate likely evidence from clutter in a live filesystem.", "Use the listing to identify which directory or filename best fits the ticket symptom before you read anything."),
        explorationRule(rawMatch(/^ls\s+\/.*$/i), "Useful exploration. Checking another directory is a valid way to discover where service data, notes, or logs actually live.", "Walk the tree one level at a time so your next move is based on evidence instead of path memorisation."),
        explorationRule(commandMatch("cd"), "Exploration is valid. Moving into a candidate directory is fine if you confirm quickly whether it contains the right evidence.", "Real operators often probe the tree before they commit to the final path. Just make sure the move answers the current question."),
        explorationRule(commandMatch("cat"), "Reading a file can be useful once you have narrowed the path to something likely to explain the symptom.", "Use file reads to confirm clues after discovery has reduced the search space. Do not treat every file as equally relevant.")
      );
    } else if (scenario.shell === "cmd") {
      rules.push(
        explorationRule(commandMatch("dir"), "Good discovery step. dir is how a Windows technician confirms the current workspace before making assumptions about where the evidence lives.", "Use the listing to decide which folder or file actually matches the ticket note before you change context."),
        explorationRule(commandMatch("cd"), "Exploration is valid. Moving into a candidate folder is fine if you verify immediately whether it contains the right case evidence.", "In CMD, directory changes are part of discovery when the exact path is not yet obvious. Just keep the move tied to the symptom you are investigating."),
        explorationRule(commandMatch("type"), "Reading a file is a valid way to gather evidence once you have found the right note, log, or configuration artifact.", "Use type to confirm clues from a specific artifact once the path is narrowed. Reading random files is noise, not investigation."),
        explorationRule(commandMatch("findstr"), "Filtering is a sensible move once you already know which Windows file contains the likely signal.", "Use findstr after you have located the correct file so the filter answers a real question instead of creating more noise.")
      );
    } else if (scenario.shell === "cisco") {
      rules.push(
        explorationRule(commandMatch("enable"), "Good first move. On Cisco gear, privilege level matters before you can inspect or change most of the state that affects users.", "Move into privileged EXEC first, then decide whether you only need show commands or whether the evidence justifies configuration mode."),
        explorationRule(rawMatch(/^show\s+version$/i), "Useful discovery. show version confirms the platform and IOS context before you change anything on the device.", "Use version output to ground yourself, then pivot to the specific interface or routing evidence that actually matches the reported fault."),
        explorationRule(rawMatch(/^show\s+ip\s+interface\s+brief$/i), "Good discovery step. show ip interface brief is the fastest way to spot interface state and addressing issues without diving into full config immediately.", "Use the summary to choose the exact interface you need to inspect or configure. That keeps the change small and deliberate."),
        explorationRule(rawMatch(/^show\s+interfaces(?:\s+\S+)?$/i), "Useful exploration. Detailed interface output can confirm whether the problem is status, addressing, or description related.", "Use the evidence to decide whether the next move belongs in privileged mode or configuration mode. Avoid changing a port before you can describe the current state.")
      );
    }

    if (category.includes("nmap") || category.includes("networking") || category.includes("exploitation") || category.includes("netcat") || category.includes("metasploit")) {
      rules.push(
        explorationRule(commandMatch("ping"), "That is a valid discovery move. Reachability checks often come before deeper service work, especially when the ticket simply says the host is 'down'.", "Use the result to decide whether you should keep scanning, narrow ports, or change approach. Do not assume an application problem until the network basics are proven."),
        explorationRule(commandMatch("nmap"), "That is in the right tool family. Use what the scan gives you to justify the next, more targeted step instead of scanning wider just because you can.", "Good operators move from broad evidence to narrow evidence instead of guessing."),
        explorationRule(commandMatch("searchsploit"), "Research is valid once you have enough evidence to justify it. Treat it as a follow-up to confirmed service data, not as a replacement for it.", "Tie exploit research back to a confirmed service or version so the workflow stays disciplined.")
      );
    }

    if (category.includes("metasploit")) {
      rules.push(
        explorationRule(rawMatch(/^search\s+/i), "Searching inside Metasploit is a valid way to discover module names before you select one.", "Use search results to justify the module path you choose next."),
        explorationRule(rawMatch(/^show options$/i), "Reviewing module options is a sensible move once a module is loaded.", "Use the option list to see which settings still need to be configured.")
      );
    }

    if (category.includes("troubleshooting")) {
      rules.push(
        explorationRule(commandMatch("ps"), "Good evidence-gathering step. Process listings are how you verify which PID you should care about before you touch anything disruptive.", "Use the output to isolate the exact process before you kill anything. Otherwise you are changing state without proving the cause."),
        explorationRule(commandMatch("tasklist"), "Good evidence-gathering step. Task listings are how you verify the exact Windows process before you stop it.", "Use the output to isolate the right PID before you terminate anything. That is the difference between troubleshooting and guessing.")
      );
    }

    if (/filter/.test(objective) || category.includes("text processing")) {
      rules.push(
        explorationRule(scenario.shell === "cmd" ? commandMatch("type") : commandMatch("cat"), "Reading the full file first is a sensible discovery move.", "Look at the raw content, then choose the filter that isolates the signal.")
      );
    }

    return rules;
  }

  function refineStep(stepConfig, scenario) {
    return {
      ...stepConfig,
      hints: ensureProgressiveHints(stepConfig, scenario),
      context: inferStepContext(scenario, stepConfig),
      explanation: enrichExplanation(stepConfig, scenario),
      whyThisMatters: inferWhyThisMatters({ ...stepConfig, explanation: enrichExplanation(stepConfig, scenario) }),
      successFeedback: enrichSuccessFeedback(stepConfig, scenario),
      nextObjective: inferNextObjective(stepConfig, scenario),
      realWorldNote: inferRealWorldNote(stepConfig, scenario),
      partials: (stepConfig.partials || []).map((entry) => enrichPartialFeedbackEntry(entry, stepConfig)),
      exploration: [
        ...buildExplorationRules(scenario, stepConfig).map((entry) => enrichExplorationEntry(entry)),
        ...(stepConfig.exploration || []).map((entry) => enrichExplorationEntry(entry))
      ]
    };
  }

  function inferScenarioLayer(scenario) {
    const explicitLayer = String(scenario.layer || "").toLowerCase();
    if (["network", "application", "exploitation"].includes(explicitLayer)) {
      return explicitLayer;
    }

    const category = String(scenario.category || "").toLowerCase();
    const combined = `${category} ${scenario.title || ""} ${scenario.objective || ""}`.toLowerCase();

    if (
      category === "file system navigation" ||
      category === "file manipulation" ||
      category === "text processing" ||
      category === "archive workflows" ||
      category === "python/script workflows" ||
      category === "troubleshooting scenarios" ||
      category === "mixed real-world tasks"
    ) {
      return "application";
    }

    if (category === "nmap scanning workflows" || category === "netcat workflows" || category === "networking basics" || category === "cisco cli fundamentals") {
      return "network";
    }

    if (category === "exploitation thinking" || category === "metasploit workflows") {
      return "exploitation";
    }

    if (/\bmetasploit\b|\bexploit\b|\bpayload\b|\breverse shell\b|\bbind shell\b|\bprivilege\b|\bsession\b/.test(combined)) {
      return "exploitation";
    }

    if (/\bnmap\b|\bnetcat\b|\bnc\b|\bport\b|\bports\b|\bhost\b|\bscan\b|\blistener\b|\bconnect\b|\bping\b|\bsmtp\b|\btcp\b|\budp\b|\brouter\b|\binterface\b|\broute\b|\bios\b|\bcisco\b/.test(combined)) {
      return "network";
    }

    if (/\bhttp\b|\bhttps\b|\brequest\b|\bresponse\b|\bparameter\b|\bheader\b|\bcookie\b|\bapi\b|\bconfig\b|\blog\b|\bservice\b/.test(combined)) {
      return "application";
    }

    return "application";
  }

  const allocatedTicketIds = new Set();

  function stableTicketSeed(text) {
    return String(text || "").split("").reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) % 1000003, 7);
  }

  function nextTicketId(prefix, scenarioId) {
    const base = prefix === "CIS" ? 200 : prefix === "CYB" ? 300 : 100;
    let candidate = base + 1 + (stableTicketSeed(`${prefix}:${scenarioId || ""}`) % 700);
    let ticketId = `${prefix}-${candidate}`;

    while (allocatedTicketIds.has(ticketId)) {
      candidate += 1;
      ticketId = `${prefix}-${candidate}`;
    }

    allocatedTicketIds.add(ticketId);
    return ticketId;
  }

  function scenarioSteps(scenario) {
    return Array.isArray(scenario?.steps) ? scenario.steps : [];
  }

  function scenarioTextBlob(scenario) {
    return [
      scenario?.id,
      scenario?.title,
      scenario?.category,
      scenario?.objective,
      scenario?.successCondition,
      scenario?.scenarioIntro,
      ...(scenario?.commandFocus || [])
    ].filter(Boolean).join(" ").toLowerCase();
  }

  function scenarioTicketPrefix(scenario, shell) {
    const text = scenarioTextBlob(scenario);
    const category = String(scenario?.category || "").toLowerCase();

    if (scenario?.ticketId) {
      return String(scenario.ticketId).split("-")[0] || "NET";
    }

    if (scenario?.mode === "challenge") return "CYB";
    if (shell === "cisco") return "CIS";
    if (shell === "cmd") return "WIN";
    if (/\bproxy\b|\bhttp\b|\bweb\b|\brequest\b|\bresponse\b|\bparameter\b|\bcookie\b|\bapi\b/.test(text) || category.includes("proxy")) return "WEB";
    if (/\bnetwork\b|\bnmap\b|\bnetcat\b|\bcisco\b|\brouter\b|\bping\b|\broute\b|\bdns\b|\btracert\b|\bpathping\b/.test(text)) return "NET";
    return "LNX";
  }

  function inferScenarioRole(scenario, shell) {
    if (scenario?.role) return scenario.role;

    if (scenario?.mode === "challenge") return "Junior Security Analyst";
    if (shell === "cisco") return "Junior Network Technician";
    if (shell === "cmd") return "Junior Support Technician";

    const text = scenarioTextBlob(scenario);
    if (/\bproxy\b|\bhttp\b|\bweb\b/.test(text)) return "Junior Web Security Analyst";
    if (/\bnetwork\b|\bnmap\b|\bnetcat\b|\bdns\b|\broute\b|\bservice\b/.test(text)) return "Junior Network Support Technician";
    return "Junior Linux Support Technician";
  }

  function inferScenarioType(scenario, shell) {
    if (scenario?.scenarioType) return scenario.scenarioType;

    const text = scenarioTextBlob(scenario);
    const category = String(scenario?.category || "").toLowerCase();

    if (scenario?.mode === "challenge") return "Security Investigation";
    if (shell === "cisco") return /config|interface|route|hostname|startup/i.test(text) ? "Configuration Lab" : "Network Verification";
    if (category.includes("troubleshooting") || /\bincident\b|\btriage\b|\bfailure\b|\bissue\b/.test(text)) return "Troubleshooting";
    if (category.includes("file") || category.includes("text") || category.includes("archive") || category.includes("python")) return "Operational Workflow";
    if (category.includes("network") || /\bping\b|\btracert\b|\bnslookup\b|\broute\b|\bnetstat\b/.test(text)) return "Network Investigation";
    if (category.includes("proxy") || /\bhttp\b|\brequest\b|\bresponse\b/.test(text)) return "Web Investigation";
    if (category.includes("metasploit") || category.includes("exploitation")) return "Controlled Exploitation Workflow";
    return shell === "cmd" ? "Support Workflow" : "Terminal Workflow";
  }

  function inferEstimatedTime(scenario) {
    if (scenario?.estimatedTime) return scenario.estimatedTime;

    const steps = scenarioSteps(scenario).length;
    if (steps <= 1) return "5 minutes";
    if (steps <= 3) return "8-10 minutes";
    if (steps <= 5) return "10-15 minutes";
    return "15-20 minutes";
  }

  function inferPriority(scenario) {
    if (scenario?.priority) return scenario.priority;

    const text = scenarioTextBlob(scenario);
    const difficulty = String(scenario?.difficulty || scenario?.level || "").toLowerCase();

    if (scenario?.mode === "challenge" || /\bincident\b|\btriage\b|\boutage\b|\bservice\b|\bfailure\b/.test(text)) return "High";
    if (difficulty === "advanced" || difficulty === "intermediate") return "Medium";
    return "Low";
  }

  function toTitleTag(value) {
    return String(value || "")
      .replace(/[-_/]+/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase())
      .trim();
  }

  function inferTags(scenario, shell) {
    if (Array.isArray(scenario?.tags) && scenario.tags.length) return scenario.tags;

    const tags = new Set();
    tags.add(toTitleTag(shell === "cmd" ? "windows" : shell === "cisco" ? "cisco" : scenario?.mode === "challenge" ? "cyber" : "linux"));
    tags.add(toTitleTag(inferScenarioType(scenario, shell)));
    if (scenario?.category) tags.add(toTitleTag(scenario.category));
    (scenario?.commandFocus || []).slice(0, 4).forEach((command) => tags.add(toTitleTag(command)));
    (scenario?.layers || [scenario?.layer]).filter(Boolean).forEach((layer) => tags.add(toTitleTag(layer)));
    return Array.from(tags).filter(Boolean).slice(0, 6);
  }

  function inferSkills(scenario, shell) {
    if (Array.isArray(scenario?.skills) && scenario.skills.length) return scenario.skills;

    const text = scenarioTextBlob(scenario);
    const skills = new Set();

    if (shell === "cmd") skills.add("Windows command line");
    if (shell === "linux") skills.add("Linux command line");
    if (shell === "cisco") skills.add("Cisco IOS navigation");
    if (scenario?.mode === "challenge") skills.add("Evidence-led investigation");
    if (/\bping\b|\bnslookup\b|\bipconfig\b|\broute\b|\btracert\b|\bpathping\b|\bnetstat\b/.test(text)) skills.add("Network troubleshooting");
    if (/\bdir\b|\bls\b|\bcd\b|\bpwd\b|\btree\b/.test(text)) skills.add("Filesystem navigation");
    if (/\bcat\b|\btype\b|\bgrep\b|\bfindstr\b/.test(text)) skills.add("Evidence review");
    if (/\bshow\b|\bconfigure terminal\b|\binterface\b|\bstartup-config\b|\brunning-config\b/.test(text)) skills.add("Configuration verification");
    if (/\bsearchsploit\b|\bmsfconsole\b|\bexploit\b|\bpayload\b/.test(text)) skills.add("Security tooling");

    return Array.from(skills).slice(0, 5);
  }

  function inferScenarioSummary(scenario) {
    if (scenario?.summary) return scenario.summary;
    if (scenario?.successCondition) return firstSentence(scenario.successCondition);
    return firstSentence(scenario?.objective || scenario?.scenarioIntro || "");
  }

  function inferTicketTitle(scenario) {
    return scenario?.ticketTitle || scenario?.title || "Assigned Mission";
  }

  function inferReportedBy(scenario, shell) {
    if (scenario?.reportedBy) return scenario.reportedBy;
    if (scenario?.mode === "challenge") return "SOC Triage Queue";
    if (shell === "cisco") return "Network Operations Queue";
    if (shell === "cmd") return "Helpdesk Queue";
    return "Operations Queue";
  }

  function inferReportedTime(scenario) {
    if (scenario?.reportedTime) return scenario.reportedTime;
    return "";
  }

  function inferAffectedSystem(scenario, shell, contextMeta) {
    if (scenario?.affectedSystem) return scenario.affectedSystem;
    if (scenario?.mode === "challenge") return "Controlled training target";
    if (shell === "cisco") return "Branch router";
    if (shell === "cmd") return "Windows workstation";
    return contextMeta?.environmentLabel === "Linux Terminal Learning" ? "Linux host" : (contextMeta?.environmentLabel || "Training system");
  }

  function inferSymptomsList(scenario, shell) {
    if (Array.isArray(scenario?.symptoms) && scenario.symptoms.length) {
      return scenario.symptoms;
    }

    const text = scenarioTextBlob(scenario);
    const symptoms = [];

    if (/\bdns\b|\bresolve\b|\bhostname\b|\bnslookup\b/.test(text)) {
      symptoms.push("The reported issue points to a name-resolution failure rather than a total network outage.");
      symptoms.push("IP connectivity may still work even if hostnames fail.");
    } else if (/\blog\b|\bcrash\b|\bpanic\b|\bservice\b/.test(text)) {
      symptoms.push("Service behavior needs to be confirmed from host-side evidence.");
      symptoms.push("The reported fault is based on symptoms, not yet on verified root cause.");
    } else if (/\bshare\b|\bfileserver\b|\bnet use\b/.test(text)) {
      symptoms.push("Shared resource access appears affected from the workstation perspective.");
      symptoms.push("The issue could still be reachability, name resolution, or share state.");
    } else if (/\brouter\b|\binterface\b|\bno shutdown\b|\bcisco\b/.test(text)) {
      symptoms.push("The branch network appears impacted, but the device state still needs to be inspected.");
      symptoms.push("Configuration should not be changed before the current operational state is clear.");
    } else if (shell === "cmd") {
      symptoms.push("The workstation issue still needs evidence from the command line.");
    } else {
      symptoms.push("The report provides a symptom, not a confirmed technical cause.");
    }

    return symptoms.slice(0, 3);
  }

  function inferUserReport(scenario) {
    if (scenario?.userReport) return scenario.userReport;
    return inferReportedSymptom(scenario, scenario.shell);
  }

  function inferKnownFacts(scenario, shell) {
    if (Array.isArray(scenario?.knownFacts) && scenario.knownFacts.length) {
      return scenario.knownFacts;
    }

    const facts = [];
    if (scenario?.objective) {
      facts.push(`The current assignment is to ${String(scenario.objective).replace(/\.$/, "")}.`);
    }
    if (scenario?.scenarioIntro) {
      facts.push(firstSentence(scenario.scenarioIntro));
    }
    if (shell === "cisco") {
      facts.push("The training device is simulated, but the IOS workflow is meant to mirror real operator discipline.");
    } else if (shell === "cmd") {
      facts.push("The workstation environment is simulated and intended for evidence-led support practice.");
    } else if (scenario?.mode === "challenge") {
      facts.push("The environment is controlled for training and should be investigated methodically.");
    }

    return facts.filter(Boolean).slice(0, 3);
  }

  function inferConstraints(scenario) {
    if (Array.isArray(scenario?.constraints) && scenario.constraints.length) {
      return scenario.constraints;
    }

    return [
      inferDoNotAssumeNote(scenario),
      "Do not change settings until you have evidence that justifies the action.",
      "Verify the final state before you close the ticket."
    ].filter(Boolean).slice(0, 3);
  }

  function inferEscalationNote(scenario, shell) {
    if (scenario?.escalationNote) return scenario.escalationNote;
    if (scenario?.mode === "challenge") return "Escalate only after you can explain what the evidence supports and what still needs confirmation.";
    if (shell === "cisco") return "If the live device state still does not match the intended branch design after verification, capture the evidence before escalation.";
    if (/\bdns\b|\bresolve\b|\bhostname\b/.test(scenarioTextBlob(scenario))) {
      return "If DNS remains the leading hypothesis after local checks, collect the command evidence before escalation.";
    }
    return "";
  }

  function inferReportedSymptom(scenario, shell) {
    const text = scenarioTextBlob(scenario);

    if (/\bdns\b|\bnslookup\b|\bresolve\b|\bhostname\b/.test(text)) {
      return "The report suggests something works by IP but fails by name, so DNS is suspicious but not yet guilty.";
    }

    if (/\blog\b|\bcrash\b|\bpanic\b|\bworker\b|\bservice note\b/.test(text)) {
      return "A service owner or operator has reported a fault, but the ticket still needs evidence from the host before anyone can claim to know the cause.";
    }

    if (/\binterface\b|\bno shutdown\b|\brouter\b|\bcisco\b/.test(text)) {
      return "The site says the network link or branch access is broken, but the device state still has to be inspected before you change configuration.";
    }

    if (/\bshare\b|\bnet use\b|\bfileserver\b/.test(text)) {
      return "The user says the shared workspace is unavailable, but you still need to separate reachability, name resolution, and share state.";
    }

    if (/\bprocess\b|\btaskkill\b|\bkill\b|\brogue\b/.test(text)) {
      return "The symptom points to a runaway process or unstable service, but you should confirm the exact process before taking action.";
    }

    if (/\bproxy\b|\bhttp\b|\brequest\b|\bresponse\b|\bparameter\b|\bweb\b/.test(text)) {
      return "The application is behaving unexpectedly, but the useful evidence still needs to be isolated from the surrounding traffic or surface noise.";
    }

    if (/\bnmap\b|\bnetcat\b|\bport\b|\bservice\b|\bscan\b/.test(text)) {
      return "The ticket needs network evidence first, not a guess based on symptoms or assumptions about which service matters.";
    }

    if (shell === "cmd") {
      return "The user report gives you a symptom, not a root cause. Start by proving what the workstation actually shows you.";
    }

    if (shell === "cisco") {
      return "The change request or outage note gives you a direction, but the device still needs to be inspected before you touch the running state.";
    }

    return "The starting note gives you a symptom, not a conclusion. Use the terminal to turn that report into evidence.";
  }

  function inferDoNotAssumeNote(scenario) {
    const text = scenarioTextBlob(scenario);

    if (/\bdns\b|\bresolve\b|\bhostname\b/.test(text)) {
      return "Do not assume the server is down just because a name fails to resolve.";
    }

    if (/\bping\b|\breachab|\bport\b|\bservice\b/.test(text)) {
      return "Do not confuse basic network reachability with application health or user access.";
    }

    if (/\blog\b|\bconfig\b|\bfile\b/.test(text)) {
      return "Do not assume the first file you open contains the real answer; confirm the artifact is the right one first.";
    }

    if (/\binterface\b|\brouter\b|\bno shutdown\b|\bip address\b/.test(text)) {
      return "Do not change configuration before you can describe the current device state clearly.";
    }

    if (/\bprocess\b|\bkill\b|\btaskkill\b/.test(text)) {
      return "Do not stop a process until you have proven it is the one tied to the symptom.";
    }

    return "Do not assume the first plausible answer is the right one. Collect enough evidence to justify the next move.";
  }

  function inferProfessionalVerificationNote(scenario) {
    const text = scenarioTextBlob(scenario);

    if (/\brouter\b|\binterface\b|\bcisco\b/.test(text)) {
      return "A professional closes the task only after the device state and the expected operational view agree.";
    }

    if (/\bshare\b|\bfileserver\b|\bservice\b|\bprocess\b/.test(text)) {
      return "A professional verifies the visible result before closing the ticket, rather than assuming the first corrective step solved the symptom.";
    }

    if (/\bproxy\b|\bhttp\b|\bweb\b|\bchallenge\b/.test(text)) {
      return "A professional records what the evidence supports, what it does not prove yet, and what the next justified step would be.";
    }

    return "A professional verifies the final state before marking the work complete.";
  }

  function scenarioEasterEgg(scenario) {
    const easterEggs = {
      "linux-log-triage": "A log entry complains about coffee being unavailable. This is not the root cause, but morale is clearly degraded.",
      "hidden-config-hunt": "The previous technician named one folder final_final_really_final. Proceed with caution.",
      "win-dir-incident-triage": "The ticket summary says 'internet broken'. Classic.",
      "win-staged-share-access-triage": "A sticky note on the monitor says: 'DNS is always innocent until proven guilty.' It is lying about half the time.",
      "cisco-no-shutdown-lan": "The router hostname is still Router. Somewhere, a documentation specialist just sighed.",
      "challenge-web-surface-recon": "Someone helpfully labeled a scan note 'quick check'. It was not quick, and it definitely was not the whole story."
    };

    return easterEggs[scenario?.id] || "";
  }

  function inferMissionBriefing(scenario, shell, contextMeta) {
    if (scenario?.missionBriefing) return scenario.missionBriefing;

    const role = inferScenarioRole(scenario, shell);
    const summary = inferScenarioSummary(scenario);
    const ticketId = scenario?.ticketId || `${scenarioTicketPrefix(scenario, shell)}-TBD`;
    const intro = firstSentence(scenario?.scenarioIntro || "");
    const symptom = inferReportedSymptom(scenario, shell);
    const caution = inferDoNotAssumeNote(scenario);
    const verification = inferProfessionalVerificationNote(scenario);

    return [
      `${role}, you are picking up ticket ${ticketId}: ${scenario.title}.`,
      symptom,
      intro || `Your current objective is to ${String(summary || scenario.objective || "").replace(/\.$/, "")}.`,
      caution,
      verification
    ].filter(Boolean).join(" ");
  }

  function inferLearningObjectives(scenario) {
    if (Array.isArray(scenario?.learningObjectives) && scenario.learningObjectives.length) {
      return scenario.learningObjectives;
    }

    const objectives = scenarioSteps(scenario)
      .map((stepConfig) => String(stepConfig?.objective || "").trim())
      .filter(Boolean)
      .slice(0, 3);

    if (objectives.length) {
      return objectives;
    }

    return [scenario?.objective || "Use terminal evidence to complete the assigned task."].filter(Boolean);
  }

  function inferSuccessCriteria(scenario) {
    if (Array.isArray(scenario?.successCriteria) && scenario.successCriteria.length) {
      return scenario.successCriteria;
    }

    const criteria = scenarioSteps(scenario)
      .map((stepConfig) => String(stepConfig?.objective || "").trim())
      .filter(Boolean)
      .slice(0, 5);

    return criteria.length ? criteria : [scenario?.successCondition || scenario?.objective].filter(Boolean);
  }

  function inferEnvironmentNotes(scenario, shell, contextMeta) {
    if (scenario?.environmentNotes) return scenario.environmentNotes;

    const easterEgg = scenarioEasterEgg(scenario);
    let note = "";

    if (scenario?.mode === "challenge") {
      note = "This is a controlled challenge environment. Investigate methodically, justify each action with evidence, and avoid treating the lab like a production target.";
    } else if (shell === "cisco") {
      note = "This is a simulated network device. Review the current state first, make the smallest justified change, and verify the operational result before you consider the task complete.";
    } else if (shell === "cmd") {
      note = "This is a simulated Windows support environment. Commands are scoped to a safe lab and should be used to confirm evidence before any corrective action is taken.";
    } else {
      note = `This is a simulated ${String(contextMeta?.environmentLabel || "Linux Terminal Learning").toLowerCase()} environment. Treat command output like case evidence and keep your next move tied to what the system actually shows you.`;
    }

    if (easterEgg) {
      note = `${note} ${easterEgg}`;
    }

    return note;
  }

  function inferVerificationRequired(scenario) {
    if (typeof scenario?.verificationRequired === "boolean") return scenario.verificationRequired;

    const text = scenarioTextBlob(scenario);
    if (scenarioSteps(scenario).length > 1) return true;
    return /\bverify\b|\bconfirm\b|\bvalidation\b|\bresolved\b/.test(text);
  }

  function inferVerificationSteps(scenario) {
    if (Array.isArray(scenario?.verificationSteps) && scenario.verificationSteps.length) {
      return scenario.verificationSteps;
    }

    if (!inferVerificationRequired(scenario)) {
      return [];
    }

    const lastObjective = scenarioSteps(scenario).slice(-1)[0]?.objective;
    return [
      lastObjective || "Confirm the final command output supports the conclusion.",
      "Confirm what the command output does and does not prove before you close the ticket.",
      "Confirm the final state matches the objective from the user or system perspective."
    ];
  }

  function inferRiskyCommands(scenario, shell) {
    if (Array.isArray(scenario?.riskyCommands) && scenario.riskyCommands.length) {
      return scenario.riskyCommands;
    }

    const text = scenarioTextBlob(scenario);
    const rules = [];

    if ((shell === "linux" || scenario?.mode === "challenge") && /\bservice\b|\bconfig\b|\bprocess\b|\bincident\b|\btriage\b|\bfile\b/.test(text)) {
      rules.push(
        { pattern: "rm -rf", reason: "This can delete important files and should not be used casually during investigation." },
        { pattern: "shutdown", reason: "Restarting or shutting down before diagnosis can interrupt users and hide useful evidence." }
      );
    }

    if (shell === "cmd" && /\bservice\b|\bincident\b|\btriage\b|\btask\b|\buser\b|\bshare\b|\badmin\b/.test(text)) {
      rules.push(
        { pattern: "shutdown", reason: "Restarting a workstation or server before diagnosis can interrupt users and hide the original condition." },
        { pattern: "del", reason: "Deleting files is risky during support work unless the cause and recovery path are already confirmed." }
      );
    }

    if (shell === "cisco" && /\bconfig\b|\binterface\b|\broute\b|\bhostname\b|\bstartup\b|\brunning\b/.test(text)) {
      rules.push(
        { pattern: "reload", reason: "Reloading network equipment before saving or verifying configuration can cause avoidable outages." },
        { pattern: "erase startup-config", reason: "Erasing the startup configuration is destructive and inappropriate for routine training tasks." }
      );
    }

    return rules;
  }

  function inferStageKind(scenario, stepConfig, stepIndex, totalSteps) {
    const text = `${stepConfig?.objective || ""} ${stepConfig?.successFeedback || ""}`.toLowerCase();
    const scenarioType = inferScenarioType(scenario, scenario.shell).toLowerCase();

    if (scenario?.mode === "challenge") {
      if (stepIndex === 0) return "scope";
      if (/\breport\b|\bsummary\b|\bconclusion\b/.test(text)) return "reporting";
      if (/\bcat\b|\btype\b|\bgrep\b|\bfindstr\b|\bresponse\b|\brequest\b|\bparameter\b|\bproof\b/.test(text)) return "analysis";
      return stepIndex === totalSteps - 1 ? "analysis" : "enumeration";
    }

    if (shellDisplayLabel(scenario.shell).includes("Cisco")) {
      if (/\bshow\b|\binspect\b|\breview\b|\bdisplay\b|\bcheck\b/.test(text) && !/\brunning-config\b|\bstartup-config\b/.test(text)) return "inspect";
      if (/\bcopy running-config startup-config\b|\bwrite memory\b|\bshow running-config\b|\bstartup-config\b|\bverify\b|\bconfirm\b/.test(text)) return "verification";
      return "configuration";
    }

    if (/\bverify\b|\bverification\b|\bconfirm\b|\bresolved\b|\bfinal\b|\brunning-config\b|\bmapping table\b/.test(text)) {
      return "verification";
    }

    if (/\bconfigure\b|\bset\b|\bmap\b|\bcreate\b|\bstart\b|\bstop\b|\bkill\b|\bterminate\b|\bassign\b|\bextract\b|\bdownload\b|\brun\b|\bload\b|\buse exploit\b/.test(text)) {
      return scenarioType.includes("troubleshooting") ? "resolution" : "practice";
    }

    if (/\blist\b|\bdisplay\b|\breview\b|\binspect\b|\bshow\b|\bquery\b|\bcheck\b|\bresolve\b|\bread\b|\bopen\b|\bping\b|\bnslookup\b|\broute\b|\btracert\b|\bpathping\b/.test(text)) {
      if (stepIndex === 0) {
        return scenarioType.includes("troubleshooting") || scenarioType.includes("investigation") ? "triage" : "orientation";
      }
      return scenarioType.includes("troubleshooting") || scenarioType.includes("investigation") ? "investigation" : "practice";
    }

    if (stepIndex === 0) return "orientation";
    if (stepIndex === totalSteps - 1) return "verification";
    return "practice";
  }

  function stageTemplate(kind, scenario) {
    const templates = {
      orientation: {
        title: "Orientation",
        briefing: "Establish the starting context so you know where you are, what artifacts exist, and what the ticket is actually asking you to prove.",
        completionSummary: "You established the starting context and reduced the chance of chasing the wrong artifact or path."
      },
      practice: {
        title: "Practice",
        briefing: "Work through the operational sequence carefully and make sure each command answers a real question instead of adding noise.",
        completionSummary: "You completed the core workflow with usable evidence at each step."
      },
      triage: {
        title: "Triage",
        briefing: "Collect enough evidence to understand the shape of the fault before changing anything.",
        completionSummary: "You gathered the first solid evidence and avoided jumping straight to conclusions."
      },
      investigation: {
        title: "Investigation",
        briefing: "Narrow the cause. Avoid jumping straight to fixes before you know what layer is failing or which artifact matters.",
        completionSummary: "You narrowed the problem space with evidence-led command output and a clearer hypothesis."
      },
      resolution: {
        title: "Resolution",
        briefing: "Apply the smallest fix that addresses the proven cause, not the broadest change you can make.",
        completionSummary: "You applied a targeted corrective action that matched the evidence you had collected."
      },
      inspect: {
        title: "Inspect Current State",
        briefing: "Review the current device state before you enter configuration mode. A good network operator can describe the device before changing it.",
        completionSummary: "You confirmed the live router state before making changes to the running configuration."
      },
      configuration: {
        title: "Apply Configuration",
        briefing: "Move through the IOS workflow and apply the required configuration safely, with the smallest justified change set.",
        completionSummary: "You completed the intended configuration changes and kept the workflow controlled."
      },
      verification: {
        title: "Verification",
        briefing: "Confirm the issue is actually resolved from the user or system perspective before you close the work.",
        completionSummary: "You verified the final state instead of assuming the task was complete."
      },
      scope: {
        title: "Scope",
        briefing: "Establish the problem space and decide what evidence matters first. Challenge work still begins with disciplined scoping.",
        completionSummary: "You framed the investigation and identified the right starting evidence."
      },
      enumeration: {
        title: "Enumeration",
        briefing: "Enumerate the environment carefully and gather the evidence needed for analysis without collecting noise just because a tool can do it.",
        completionSummary: "You collected the important technical details without overreaching."
      },
      analysis: {
        title: "Analysis",
        briefing: "Interpret the evidence and confirm the strongest next conclusion. Separate what the data supports from what it merely suggests.",
        completionSummary: "You translated raw evidence into a justified technical conclusion."
      },
      reporting: {
        title: "Reporting",
        briefing: "Summarise the cause, action taken, and verification result like a real ticket note before you close the task.",
        completionSummary: "You closed the task with a defensible summary of what the evidence showed."
      }
    };

    return templates[kind] || templates.practice;
  }

  function autoStagesForScenario(scenario) {
    const existingStages = normalizeScenarioStages(scenario?.stages || []);
    if (existingStages.length) {
      return existingStages;
    }

    const steps = scenarioSteps(scenario);
    if (steps.length < 2) {
      return [];
    }

    const grouped = [];
    steps.forEach((stepConfig, stepIndex) => {
      const kind = inferStageKind(scenario, stepConfig, stepIndex, steps.length);
      const lastGroup = grouped[grouped.length - 1];

      if (lastGroup && lastGroup.kind === kind) {
        lastGroup.steps.push(stepConfig);
        return;
      }

      grouped.push({ kind, steps: [stepConfig] });
    });

    return grouped.map((group, index) => {
      const template = stageTemplate(group.kind, scenario);
      return {
        id: `${group.kind}-${index + 1}`,
        title: template.title,
        briefing: template.briefing,
        steps: group.steps.slice(),
        completionSummary: template.completionSummary
      };
    });
  }

  function enrichScenarioMetadata(scenario, shell, contextMeta) {
    const difficulty = scenario.difficulty || scenario.level || "Beginner";
    const stages = autoStagesForScenario(scenario);

    return {
      ...scenario,
      difficulty,
      role: inferScenarioRole(scenario, shell),
      estimatedTime: inferEstimatedTime(scenario),
      scenarioType: inferScenarioType(scenario, shell),
      missionBriefing: inferMissionBriefing(scenario, shell, contextMeta),
      learningObjectives: inferLearningObjectives(scenario),
      successCriteria: inferSuccessCriteria(scenario),
      environmentNotes: inferEnvironmentNotes(scenario, shell, contextMeta),
      verificationRequired: inferVerificationRequired(scenario),
      verificationSteps: inferVerificationSteps(scenario),
      riskyCommands: inferRiskyCommands(scenario, shell),
      ticketId: scenario.ticketId || nextTicketId(scenarioTicketPrefix(scenario, shell), scenario.id),
      ticketTitle: inferTicketTitle(scenario),
      reportedBy: inferReportedBy(scenario, shell),
      reportedTime: inferReportedTime(scenario),
      priority: inferPriority(scenario),
      affectedSystem: inferAffectedSystem(scenario, shell, contextMeta),
      symptoms: inferSymptomsList(scenario, shell),
      userReport: inferUserReport(scenario),
      knownFacts: inferKnownFacts(scenario, shell),
      constraints: inferConstraints(scenario),
      escalationNote: inferEscalationNote(scenario, shell),
      easterEggNote: scenario.easterEggNote || scenarioEasterEgg(scenario),
      tags: inferTags(scenario, shell),
      skills: inferSkills(scenario, shell),
      summary: inferScenarioSummary(scenario),
      stages
    };
  }

  function normalizeScenarioStages(stages = []) {
    return stages
      .map((stage, stageIndex) => {
        if (!stage || !Array.isArray(stage.steps) || !stage.steps.length) {
          return null;
        }

        return {
          id: stage.id || `stage-${stageIndex + 1}`,
          title: stage.title || `Stage ${stageIndex + 1}`,
          briefing: stage.briefing || "",
          completionSummary: stage.completionSummary || "",
          steps: stage.steps.slice()
        };
      })
      .filter(Boolean);
  }

  function refineScenario(scenario) {
    const shell = scenario.shell || (
      scenario.environment?.platform === "cmd"
        ? "cmd"
        : scenario.environment?.platform === "cisco"
          ? "cisco"
          : "linux"
    );
    const environment = scenario.environment || (shell === "cmd" ? cmdEnv() : shell === "cisco" ? ciscoEnv() : linuxEnv());
    const contextMeta = buildScenarioContextMetadata(scenario, environment, shell);
    const enrichedScenario = enrichScenarioMetadata({
      ...scenario,
      shell,
      environment
    }, shell, contextMeta);
    const normalizedStages = normalizeScenarioStages(enrichedScenario.stages);
    const flattenedSteps = normalizedStages.length
      ? normalizedStages.flatMap((stage, stageIndex) => stage.steps.map((stepConfig, stepIndex) => ({
        ...stepConfig,
        stageId: stage.id,
        stageTitle: stage.title,
        stageBriefing: stage.briefing,
        stageCompletionSummary: stage.completionSummary,
        stageIndex,
        stageStepIndex: stepIndex
      })))
      : scenarioSteps(enrichedScenario);
    const layeredScenario = {
      ...enrichedScenario,
      mode: enrichedScenario.mode || "lesson",
      hiddenSteps: Boolean(enrichedScenario.hiddenSteps),
      challengeObjective: enrichedScenario.challengeObjective || "",
      successConditions: enrichedScenario.successConditions || [],
      allowedApproaches: enrichedScenario.allowedApproaches || [],
      difficulty: enrichedScenario.difficulty || enrichedScenario.level,
      layers: Array.isArray(enrichedScenario.layers) && enrichedScenario.layers.length
        ? enrichedScenario.layers
        : [enrichedScenario.layer || inferScenarioLayer(enrichedScenario)],
      layer: inferScenarioLayer(enrichedScenario),
      stages: normalizedStages,
      steps: flattenedSteps
    };

    return {
      ...layeredScenario,
      shell,
      environment,
      environmentCategory: layeredScenario.environmentCategory || contextMeta.environmentCategory,
      environmentLabel: layeredScenario.environmentLabel || contextMeta.environmentLabel,
      environmentPolicy: layeredScenario.environmentPolicy || contextMeta.environmentPolicy,
      machineContexts: normalizeMachineContexts(layeredScenario.machineContexts).length
        ? normalizeMachineContexts(layeredScenario.machineContexts)
        : contextMeta.machineContexts,
      steps: (Array.isArray(layeredScenario.steps) ? layeredScenario.steps : []).map((stepConfig) => refineStep(stepConfig, layeredScenario))
    };
  }

  const exampleScenarios = [
    {
      id: "linux-log-triage",
      title: "Log Triage on a Linux Host",
      category: "File system navigation",
      level: "Beginner",
      shell: "linux",
      objective: "Move through the filesystem, reach the rotated log directory, and inspect the crash traces without leaving the shell.",
      allowedFlexibility: "Absolute and relative paths are both valid as long as you land in the right directory and inspect the right file.",
      visualGuide: {
        type: "folder",
        currentPath: "/home/student",
        relevantPaths: ["/srv", "/srv/apps", "/srv/apps/api", "/srv/apps/api/logs"],
        commandMap: [
          { command: "pwd", icon: "📍", meaning: "show where you are" },
          { command: "ls", icon: "👀", meaning: "look inside" },
          { command: "cd", icon: "🚶", meaning: "move into a folder" },
          { command: "cat", icon: "📄", meaning: "read file" }
        ]
      },
      environment: linuxEnv({
        cwd: "/home/student",
        directories: ["/srv/apps/api/logs"],
        files: [
          { path: "/srv/apps/api/logs/app.log", content: "INFO boot complete\nWARN retrying db\nERROR db connection refused\n" },
          { path: "/srv/apps/api/logs/app.log.1", content: "INFO previous run\nERROR worker panic\n" }
        ]
      }),
      steps: [
        step({
          objective: "Confirm your current location before you start moving.",
          context: "Start by orienting yourself. When a path outside your home directory is involved, the first job is to confirm where the shell currently is.",
          hints: [
            "Check where the shell currently is.",
            "Use the command that prints the working directory.",
            "Try `pwd`."
          ],
          explanation: "Strong operators confirm context before they start navigating the filesystem.",
          whyThisMatters: "Path mistakes compound quickly. Confirming location first prevents blind navigation.",
          successFeedback: "You verified the current directory.",
          accepts: [commandMatch("pwd")],
          partials: [
            {
              match: commandMatch("ls"),
              classification: "wrong_context",
              feedback: "Useful later, but first confirm where you are."
            }
          ]
        }),
        step({
          objective: "Move into the application log directory.",
          context: "In this lab, service-owned application data lives under /srv. If that path is unfamiliar, explore from / with ls and then move one level at a time.",
          hints: [
            "The logs are outside your home directory in a service-owned area.",
            "Check common Linux service locations such as /srv if you need discovery before moving.",
            "Try `cd /srv/apps/api/logs`."
          ],
          explanation: "Changing into the exact log directory narrows the problem space before you inspect files.",
          whyThisMatters: "Linux service data is often separated from user home directories. Knowing where to look reduces guesswork.",
          successFeedback: "You moved into the log directory.",
          accepts: [cwdMatch("/srv/apps/api/logs")],
          partials: [
            {
              match: rawMatch(/^ls(?:\s+-a[l]?)?$/i),
              classification: "wrong_context",
              feedback: "Listing the current directory is valid, but you are still not in the log path."
            }
          ]
        }),
        step({
          objective: "List the files so you can see the rotated log set.",
          context: "Once you reach the service directory, list before you read. Logs are often rotated, and the older file may contain the real crash evidence.",
          hints: [
            "Now inspect the contents of the directory.",
            "Use the standard Linux listing command.",
            "Try `ls`."
          ],
          explanation: "Listing first gives you the file names and shows that a rotated log exists.",
          whyThisMatters: "Discovery commands tell you which artifact is most likely to contain the clue before you open anything.",
          successFeedback: "You inspected the directory contents.",
          accepts: [commandMatch("ls")],
          partials: [
            {
              match: commandMatch("cat"),
              classification: "inefficient",
              feedback: "You can read a file directly, but listing first is the cleaner way to discover what is here."
            }
          ]
        }),
        step({
          objective: "Open the rotated log that contains the previous crash.",
          context: "The active log may only show the current clean restart. Rotated logs often preserve the actual failure that happened just before the restart.",
          hints: [
            "The interesting clues are in the older log file.",
            "Read the rotated file rather than the active one.",
            "Try `cat app.log.1`."
          ],
          explanation: "The rotated log often contains the failure that caused the current process to restart cleanly.",
          whyThisMatters: "Administrators often inspect rotated logs because the current log may no longer contain the crash event they care about.",
          successFeedback: "You inspected the rotated crash log.",
          accepts: [
            rawMatch(/^cat\s+app\.log\.1$/i),
            rawMatch(/^cat\s+\/srv\/apps\/api\/logs\/app\.log\.1$/i)
          ],
          partials: [
            {
              match: rawMatch(/^cat\s+app\.log$/i),
              classification: "inefficient",
              feedback: "Close, but the crash clue is in the rotated log, not the active file."
            }
          ]
        })
      ]
    },
    {
      id: "hidden-config-hunt",
      title: "Hidden Config Hunt",
      category: "File system navigation",
      level: "Beginner",
      shell: "linux",
      objective: "Find a hidden configuration file in a project folder and inspect its contents.",
      allowedFlexibility: "Any route into the directory is fine, but hidden files must actually be shown before you read the config.",
      environment: linuxEnv({
        cwd: "/home/student/projects",
        directories: ["/home/student/projects/site"],
        files: [
          { path: "/home/student/projects/site/.env", hidden: true, content: "DB_HOST=127.0.0.1\nAPP_MODE=debug\n" },
          { path: "/home/student/projects/site/README.md", content: "Deployment notes\n" }
        ]
      }),
      steps: [
        step({
          objective: "Move into the site project directory.",
          context: "Stay in the project workspace and move one level at a time. Discovery is allowed, so use ls first if you want to confirm the folder name.",
          hints: ["The target folder is named site.", "Confirm the project folder name with ls if needed, then move into it.", "Try `cd site`."],
          explanation: "Start by entering the project folder so your file operations stay scoped.",
          whyThisMatters: "Moving into the right project first keeps later file reads and listings clean and predictable.",
          successFeedback: "You entered the project directory.",
          accepts: [cwdMatch("/home/student/projects/site")]
        }),
        step({
          objective: "List hidden files so the config becomes visible.",
          context: "Many Linux applications store local settings in dotfiles such as .env. A normal ls will hide them, so use the hidden-file view when you suspect local configuration.",
          hints: [
            "A normal listing will miss the file you need.",
            "Use the listing command with the flag that reveals dotfiles.",
            "Try `ls -a`."
          ],
          explanation: "Hidden files are common for local configuration. You need the hidden-file flag to see them.",
          whyThisMatters: "Dotfiles are a normal place for Linux configuration, so knowing how to reveal them is part of practical shell work.",
          successFeedback: "You exposed the hidden files.",
          accepts: [commandMatch("ls", { flagsAny: ["a"] })],
          partials: [
            {
              match: commandMatch("ls"),
              classification: "inefficient",
              feedback: "You listed the directory, but you still are not showing hidden files."
            }
          ]
        }),
        step({
          objective: "Read the hidden environment file.",
          context: "Once a hidden config is visible, read it directly to confirm what the project is using instead of guessing from filenames alone.",
          hints: ["The file begins with a dot.", "Read the .env file directly.", "Try `cat .env`."],
          explanation: "Once the hidden file is visible, reading it confirms what settings the project is using.",
          whyThisMatters: "Reading the discovered config file turns a hidden artifact into usable evidence.",
          successFeedback: "You inspected the hidden environment file.",
          accepts: [
            rawMatch(/^cat\s+\.env$/i),
            rawMatch(/^cat\s+\/home\/student\/projects\/site\/\.env$/i)
          ]
        })
      ]
    },
    {
      id: "windows-log-review",
      title: "Windows Log Review",
      category: "File system navigation",
      level: "Beginner",
      shell: "cmd",
      objective: "Work through a Windows incident folder, inspect the right directory, and read the suspicious service notes.",
      allowedFlexibility: "You can use relative or absolute paths, but stay in CMD commands.",
      environment: cmdEnv({
        cwd: "C:/Lab",
        directories: ["C:/Lab/Incident", "C:/Lab/Incident/Notes"],
        files: [
          { path: "C:/Lab/Incident/Notes/service.txt", content: "spoolsvc restarted unexpectedly\nCheck PID 884\n" },
          { path: "C:/Lab/Incident/Notes/todo.txt", content: "collect process list\n" }
        ]
      }),
      steps: [
        step({
          objective: "List the current incident workspace.",
          hints: ["You are in a Windows shell.", "Use the standard CMD directory listing command.", "Try `dir`."],
          explanation: "Listing the workspace first shows the incident folders available in the current directory.",
          successFeedback: "You inspected the incident workspace.",
          accepts: [commandMatch("dir")]
        }),
        step({
          objective: "Move into the Notes folder.",
          hints: ["The interesting files are in Incident\\Notes.", "Change into the Notes folder.", "Try `cd Incident\\Notes`."],
          explanation: "Changing into the notes folder keeps the file review focused and avoids unnecessary path typing.",
          successFeedback: "You moved into the notes folder.",
          accepts: [cwdMatch("C:/Lab/Incident/Notes")]
        }),
        step({
          objective: "Read the service note file.",
          hints: ["Use the Windows file-reading command.", "Open service.txt directly.", "Try `type service.txt`."],
          explanation: "Reading the service note reveals the PID clue that drives the next troubleshooting action.",
          successFeedback: "You opened the service note.",
          accepts: [rawMatch(/^type\s+service\.txt$/i)]
        })
      ]
    },
    {
      id: "archive-release-review",
      title: "Archive Release Review",
      category: "Archive workflows",
      level: "Beginner",
      shell: "linux",
      objective: "Confirm the archive is present, extract it, and inspect the release notes.",
      allowedFlexibility: "You can use relative or absolute paths after the archive is unpacked.",
      environment: linuxEnv({
        cwd: "/home/student/downloads",
        files: [
          archiveFile("/home/student/downloads/release-pack.tar.gz", [
            { path: "release-pack", type: "dir" },
            { path: "release-pack/README.txt", content: "Release notes for build 4.2\n" },
            { path: "release-pack/app.conf", content: "mode=staging\n" }
          ])
        ]
      }),
      steps: [
        step({
          objective: "List the downloads directory so you can confirm the archive name.",
          context: "Before you extract anything, verify the archive name in the current directory. Real systems often contain several similar bundles.",
          hints: ["Check what is in the current directory.", "Use the standard listing command.", "Try `ls`."],
          explanation: "Confirming the archive name before extraction prevents mistakes on similarly named packages.",
          whyThisMatters: "A quick listing avoids extracting the wrong package just because the filename looked familiar.",
          successFeedback: "You confirmed the archive file is present.",
          accepts: [commandMatch("ls")]
        }),
        step({
          objective: "Extract the tar.gz archive.",
          context: "For .tar.gz files, tar -xvzf is a common extraction form: x extracts, v shows progress, z handles gzip compression, and f points tar at the archive file name.",
          hints: [
            "This is a gzip-compressed tar archive.",
            "Use tar with the extraction flags that handle gzip and the archive file name.",
            "Try `tar -xvzf release-pack.tar.gz`."
          ],
          explanation: "The tar extraction step creates the working folder you need to inspect the release content.",
          whyThisMatters: "Archive extraction is a routine admin task, and understanding the tar flags helps you reason instead of memorising.",
          successFeedback: "You extracted the archive.",
          accepts: [
            rawMatch(/^tar\s+-xvzf\s+release-pack\.tar\.gz$/i),
            rawMatch(/^tar\s+-xzvf\s+release-pack\.tar\.gz$/i)
          ]
        }),
        step({
          objective: "Change into the extracted release directory.",
          context: "Extraction usually creates a new directory named after the bundle. List first if you want to confirm exactly what the archive created.",
          hints: ["The archive created a release-pack folder.", "Move into the new directory.", "Try `cd release-pack`."],
          explanation: "Moving into the extracted directory keeps the rest of the review targeted and clean.",
          whyThisMatters: "Working inside the extracted folder reduces path clutter and keeps later file reads precise.",
          successFeedback: "You entered the extracted release directory.",
          accepts: [cwdMatch("/home/student/downloads/release-pack")]
        }),
        step({
          objective: "Read the release notes.",
          context: "README or release-note files are usually the fastest way to understand what changed after you extract a package.",
          hints: ["The file is named README.txt.", "Open the README in the extracted directory.", "Try `cat README.txt`."],
          explanation: "Reading the release notes is the first check after extraction because it tells you what changed in the build.",
          whyThisMatters: "Reading release notes first turns the archive into a documented change set instead of an unexplained folder.",
          successFeedback: "You reviewed the release notes.",
          accepts: [rawMatch(/^cat\s+README\.txt$/i)]
        })
      ]
    },
    {
      id: "download-and-extract-toolkit",
      title: "Download and Extract Toolkit",
      category: "Archive workflows",
      level: "Intermediate",
      shell: "linux",
      objective: "Download a toolkit archive, confirm it exists, and extract it into the working directory.",
      allowedFlexibility: "Any valid local output file name is fine if it matches the scenario objective.",
      environment: linuxEnv({
        cwd: "/home/student/downloads",
        files: []
      }),
      steps: [
        step({
          objective: "Download the toolkit archive with a clean output file name.",
          hints: [
            "Use wget and save the file locally with a readable name.",
            "You need wget plus the output filename flag.",
            "Try `wget https://downloads.lab/toolkit.tar.gz -O toolkit.tar.gz`."
          ],
          explanation: "A clean local filename makes the later extraction step easier to read and repeat.",
          successFeedback: "You downloaded the toolkit archive.",
          accepts: [
            rawMatch(/^wget\s+https:\/\/downloads\.lab\/toolkit\.tar\.gz\s+-O\s+toolkit\.tar\.gz$/i)
          ]
        }),
        step({
          objective: "Confirm that the downloaded archive is in the directory.",
          hints: ["Now verify the file is here.", "Use the standard file listing command.", "Try `ls`."],
          explanation: "Checking that the file exists before extraction prevents a wasted troubleshooting loop.",
          successFeedback: "You confirmed the downloaded file is present.",
          accepts: [commandMatch("ls")]
        }),
        step({
          objective: "Extract the downloaded toolkit archive.",
          hints: [
            "This is still a tar.gz extraction task.",
            "Use tar against toolkit.tar.gz.",
            "Try `tar -xvzf toolkit.tar.gz`."
          ],
          explanation: "Extraction is what turns the downloaded package into a usable working directory.",
          successFeedback: "You extracted the toolkit archive.",
          accepts: [
            rawMatch(/^tar\s+-xvzf\s+toolkit\.tar\.gz$/i),
            rawMatch(/^tar\s+-xzvf\s+toolkit\.tar\.gz$/i)
          ]
        })
      ]
    },
    {
      id: "linux-rogue-process",
      title: "Linux Rogue Process Cleanup",
      category: "Troubleshooting scenarios",
      level: "Intermediate",
      shell: "linux",
      objective: "Identify the rogue api-worker process, terminate it, and confirm it is gone.",
      allowedFlexibility: "Either a normal kill or a stronger kill is acceptable if you target the right PID.",
      environment: linuxEnv({
        cwd: "/home/student",
        processes: [
          { pid: 2110, name: "sshd", user: "root", cpu: "0.0", memory: "0.4", command: "/usr/sbin/sshd -D" },
          { pid: 2451, name: "api-worker", user: "student", cpu: "96.1", memory: "14.3", command: "python api_worker.py" },
          { pid: 3120, name: "tail", user: "student", cpu: "0.1", memory: "0.2", command: "tail -f /var/log/app.log" }
        ]
      }),
      steps: [
        step({
          objective: "List the running processes.",
          hints: ["Start with a process listing.", "Use the standard Linux process command.", "Try `ps`."],
          explanation: "You need the process table before you can identify what to terminate.",
          successFeedback: "You pulled the process list.",
          accepts: [commandMatch("ps")],
          partials: [
            {
              match: rawMatch(/^ps\s+-a/i),
              classification: "inefficient",
              feedback: "Close, but a plain process listing is enough in this simulated host."
            }
          ]
        }),
        step({
          objective: "Filter the process output down to the api-worker process.",
          context: "Use a label that is actually visible in the process list. In this lab, the service label and the script name both point to the same worker.",
          hints: [
            "Do not scan the whole list by eye if you can filter it.",
            "Use grep with the worker label you can see in the ps output.",
            "Try `ps | grep api-worker` or `ps | grep api_worker`."
          ],
          explanation: "Filtering the process table is the cleanest way to isolate the one runaway process you care about.",
          successFeedback: "You isolated the api-worker process.",
          accepts: [
            rawMatch(/^ps\s*\|\s*grep\s+api-worker$/i),
            rawMatch(/^ps\s+\|\s+grep\s+api-worker$/i),
            rawMatch(/^ps\s*\|\s*grep\s+api_worker$/i),
            rawMatch(/^ps\s+\|\s+grep\s+api_worker$/i)
          ]
        }),
        step({
          objective: "Terminate the api-worker PID.",
          hints: [
            "The PID in the process list is the target.",
            "Either a normal kill or a stronger signal is acceptable.",
            "Try `kill 2451` or `kill -9 2451`."
          ],
          explanation: "Both kill forms are valid here. What matters is targeting the correct runaway process.",
          successFeedback: "You terminated the rogue process.",
          accepts: [
            rawMatch(/^kill\s+2451$/i),
            rawMatch(/^kill\s+-9\s+2451$/i)
          ]
        }),
        step({
          objective: "Confirm that the api-worker process is gone.",
          hints: ["Check the process list again.", "A second process listing is enough here.", "Try `ps`."],
          explanation: "Verification matters. Killing a process is not enough until you confirm the host state changed.",
          successFeedback: "You confirmed the process is no longer running.",
          accepts: [
            commandMatch("ps", {
              postCheck: (_, state) => !state.processes.some((process) => process.pid === 2451)
            })
          ]
        })
      ]
    },
    {
      id: "windows-rogue-process",
      title: "Windows Rogue Process Cleanup",
      category: "Troubleshooting scenarios",
      level: "Intermediate",
      shell: "cmd",
      objective: "Inspect the Windows task list, isolate spoolsvc.exe, terminate it, and verify the result.",
      allowedFlexibility: "Use the correct CMD task commands and target the right PID.",
      environment: cmdEnv({
        cwd: "C:/Lab",
        processes: [
          { pid: 884, name: "spoolsvc.exe", user: "SYSTEM", cpu: "42", memory: "31", command: "spoolsvc.exe /service" },
          { pid: 1012, name: "explorer.exe", user: "student", cpu: "2", memory: "84", command: "explorer.exe" },
          { pid: 1204, name: "cmd.exe", user: "student", cpu: "1", memory: "6", command: "cmd.exe" }
        ]
      }),
      steps: [
        step({
          objective: "List the running Windows tasks.",
          hints: ["This is a CMD host.", "Use the standard Windows task listing command.", "Try `tasklist`."],
          explanation: "You need the Windows task list before you can isolate the target process.",
          successFeedback: "You listed the running tasks.",
          accepts: [commandMatch("tasklist")]
        }),
        step({
          objective: "Filter the task list to the spoolsvc process.",
          hints: ["Use the Windows text filtering tool.", "Filter tasklist output with findstr.", "Try `tasklist | findstr spoolsvc`."],
          explanation: "Filtering the task list is faster and cleaner than manually reading every process line.",
          successFeedback: "You isolated the spoolsvc process.",
          accepts: [
            rawMatch(/^tasklist\s*\|\s*findstr\s+spoolsvc$/i)
          ]
        }),
        step({
          objective: "Terminate the spoolsvc PID.",
          hints: ["Use the Windows task termination command.", "Target PID 884 and force the stop.", "Try `taskkill /PID 884 /F`."],
          explanation: "Targeting the PID directly is the cleanest way to stop the exact Windows process you found.",
          successFeedback: "You terminated the Windows process.",
          accepts: [rawMatch(/^taskkill\s+\/PID\s+884\s+\/F$/i)]
        }),
        step({
          objective: "Confirm that spoolsvc.exe is no longer running.",
          hints: ["Check the task list again.", "Use a fresh process listing to verify the PID is gone.", "Try `tasklist` or `ps`."],
          explanation: "Verification matters on Windows just as much as on Linux. You need to confirm that the process actually disappeared with a current process listing.",
          successFeedback: "You verified that the process is gone.",
          accepts: [
            commandMatch("tasklist", {
              postCheck: (_, state) => !state.processes.some((process) => process.pid === 884)
            }),
            commandMatch("ps", {
              postCheck: (_, state) => !state.processes.some((process) => process.pid === 884)
            })
          ]
        })
      ]
    },
    {
      id: "reachability-and-port-check",
      title: "Reachability and Port Check",
      category: "Networking basics",
      level: "Intermediate",
      shell: "linux",
      objective: "Confirm that metasploitable2 (192.168.56.102) is reachable, check its web port, and identify the web service version.",
      allowedFlexibility: "Stay on the named target host and move from basic connectivity into targeted scan evidence. You can use either the hostname or the IP.",
      environment: linuxEnv({
        cwd: "/home/student",
        files: [],
        targets: commonTargets()
      }),
      steps: [
        step({
          objective: "Check whether the target responds on the network.",
          context: "Start with reachability. The target for this task is metasploitable2 at 192.168.56.102, so verify that it responds before you spend time on ports or services.",
          hints: ["Start with a reachability test.", "Use the ICMP tool against metasploitable2 or 192.168.56.102.", "Try `ping metasploitable2` or `ping 192.168.56.102`."],
          explanation: "A reachability check is the cleanest way to confirm the host is there before you spend time scanning it.",
          whyThisMatters: "Reachability is the first gate. If the host is down, deeper scans only create noise.",
          successFeedback: "You confirmed the host is reachable.",
          accepts: [
            rawMatch(/^ping\s+192\.168\.56\.102$/i),
            rawMatch(/^ping\s+metasploitable2$/i),
            rawMatch(/^ping\s+target$/i)
          ]
        }),
        step({
          objective: "Check only the web port on the target.",
          context: "Now move from reachability to a narrow service check. Stay on the same target, metasploitable2 (192.168.56.102), and check only the web port first.",
          hints: ["Do not run a full version sweep yet.", "Target port 80 directly with a focused port scan.", "Try `nmap -p 80 metasploitable2` or `nmap -p 80 192.168.56.102`."],
          explanation: "A focused port check is the next efficient move when you only need to know whether the web service is exposed.",
          whyThisMatters: "Targeted scans are faster to interpret and teach you to narrow your question before you collect more data.",
          successFeedback: "You verified the web port state.",
          accepts: [
            rawMatch(/^nmap\s+-p\s+80\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-p\s+80\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-p\s+80\s+target$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." }),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." }),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+metasploitable2$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." }),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+metasploitable2$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." }),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+target$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." }),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+target$/i, { advanceBy: 2, feedback: "You checked the web port and already collected the version evidence." })
          ]
        }),
        step({
          objective: "Identify the web service version on that port.",
          context: "An open port tells you a service exists. Now use version detection on the same target, metasploitable2 (192.168.56.102), so the open port becomes usable evidence.",
          hints: ["Now move from open-port status to service evidence.", "Use Nmap version detection on port 80.", "Try `nmap -sV -p 80 metasploitable2` or `nmap -sV -p 80 192.168.56.102`."],
          explanation: "Version evidence is what turns a reachable web port into something you can actually analyze.",
          whyThisMatters: "Version evidence is what lets you compare a live service to documentation, fixes, and vulnerabilities.",
          successFeedback: "You identified the web service version.",
          accepts: [
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+target$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+target$/i)
          ]
        })
      ]
    },
    {
      id: "ftp-version-to-research",
      title: "FTP Version to Research Chain",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      shell: "linux",
      objective: "Discover the FTP service on metasploitable2 (192.168.56.102), confirm its version, and move into evidence-based research.",
      allowedFlexibility: "Stay on metasploitable2 and use a focused Nmap workflow. You can refer to the host by hostname or IP.",
      environment: linuxEnv({
        cwd: "/home/student",
        files: [],
        targets: commonTargets()
      }),
      steps: [
        step({
          objective: "Check whether FTP is open on the target.",
          context: "The target for this workflow is metasploitable2 at 192.168.56.102. Start with the FTP port only instead of widening the scan too early.",
          hints: ["You only need one service port right now.", "Target port 21 on metasploitable2 directly.", "Try `nmap -p 21 metasploitable2` or `nmap -p 21 192.168.56.102`."],
          explanation: "A focused check on the FTP port is the cleanest first move when you already know which service you care about.",
          successFeedback: "You checked the FTP port.",
          accepts: [
            rawMatch(/^nmap\s+-p\s+21\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-p\s+21\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-p\s+21\s+target$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." }),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." }),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+metasploitable2$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." }),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+metasploitable2$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." }),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+target$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." }),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+target$/i, { advanceBy: 2, feedback: "You confirmed the FTP port and already pulled the version evidence." })
          ]
        }),
        step({
          objective: "Identify the FTP service version.",
          context: "Stay on metasploitable2 and turn the FTP port state into real service evidence with version detection.",
          hints: ["Now turn the open port into service evidence.", "Use version detection on port 21.", "Try `nmap -sV -p 21 metasploitable2` or `nmap -sV -p 21 192.168.56.102`."],
          explanation: "Version detection is the bridge between a port number and a credible exploit-research path.",
          successFeedback: "You identified the FTP service version.",
          accepts: [
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+target$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+target$/i)
          ]
        }),
        step({
          objective: "Search the local exploit database for the exact version you found.",
          hints: ["Do not jump into Metasploit first.", "Use the local exploit search tool.", "Try `searchsploit vsftpd 2.3.4`."],
          explanation: "Searching exploit references locally is the right next step once you have a confirmed service version.",
          successFeedback: "You moved from evidence into focused research.",
          accepts: [rawMatch(/^searchsploit\s+vsftpd\s+2\.3\.4$/i)]
        })
      ]
    },
    {
      id: "smtp-banner-flow",
      title: "SMTP Banner and Session Flow",
      category: "Netcat workflows",
      level: "Intermediate",
      shell: "linux",
      objective: "Connect to SMTP on metasploitable2 (192.168.56.102) with Netcat, identify the service, and move through the opening protocol flow correctly.",
      allowedFlexibility: "Stay within the live SMTP session on metasploitable2 and send the correct protocol verbs in order.",
      environment: linuxEnv({
        cwd: "/home/student",
        targets: commonTargets()
      }),
      steps: [
        step({
          objective: "Open a direct TCP session to SMTP on the target.",
          context: "The SMTP service in this lab lives on metasploitable2 at 192.168.56.102. Open a raw TCP session to port 25 instead of scanning again.",
          hints: ["Use a raw TCP client, not another scan.", "Connect to port 25 with Netcat.", "Try `nc -nv metasploitable2 25` or `nc -nv 192.168.56.102 25`."],
          explanation: "Netcat gives you a direct protocol session so you can observe the service and interact with it manually.",
          successFeedback: "You opened the SMTP session.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+25$/i),
            rawMatch(/^nc\s+-nv\s+metasploitable2\s+25$/i),
            rawMatch(/^nc\s+-nv\s+target\s+25$/i)
          ]
        }),
        step({
          objective: "Greet the SMTP service correctly after the banner appears.",
          context: "After the SMTP banner, identify your client with EHLO or HELO. The client name can be any sensible local name; `lab.local` is only an example.",
          hints: ["Use the SMTP greeting verb.", "Identify your client first.", "Try `EHLO lab.local` or `HELO lab.local`."],
          explanation: "EHLO or HELO is the correct opening protocol step after the SMTP banner because it starts the conversation cleanly.",
          successFeedback: "You started the SMTP conversation.",
          accepts: [rawMatch(/^(EHLO|HELO)\s+[A-Za-z0-9.-]+$/i)]
        }),
        step({
          objective: "Set the sender address for the test message.",
          context: "Now define the envelope sender with MAIL FROM. Any syntactically valid email address is acceptable here; `kali@lab.local` is just an example.",
          hints: ["The sender comes before the recipient.", "Use the SMTP sender verb.", "Try `MAIL FROM:<kali@lab.local>`."],
          explanation: "MAIL FROM defines the envelope sender and must happen before you identify the recipient.",
          successFeedback: "You set the sender address.",
          accepts: [rawMatch(/^MAIL FROM:\s*<[^>\s]+@[^>\s]+>$/i)]
        }),
        step({
          objective: "Close the SMTP session cleanly.",
          hints: ["Use the protocol's exit verb.", "Do not just abandon the connection.", "Try `QUIT`."],
          explanation: "QUIT ends the session cleanly and proves you understand the flow instead of just opening the socket.",
          successFeedback: "You closed the SMTP session correctly.",
          accepts: [rawMatch(/^QUIT$/i)]
        })
      ]
    },
    {
      id: "reverse-listener-prep",
      title: "Reverse Listener Preparation",
      category: "Netcat workflows",
      level: "Intermediate",
      shell: "linux",
      objective: "Prepare a clean listener before a reverse shell callback is triggered.",
      allowedFlexibility: "Any valid Netcat listener syntax that binds the correct port is acceptable.",
      environment: linuxEnv({ cwd: "/home/student" }),
      steps: [
        step({
          objective: "Confirm your current working directory before setting up the listener.",
          hints: ["Start with context.", "Print the working directory first.", "Try `pwd`."],
          explanation: "Even quick response tasks should begin with context so you know where artifacts will land.",
          successFeedback: "You confirmed your current location.",
          accepts: [commandMatch("pwd")]
        }),
        step({
          objective: "Create a directory for shell captures.",
          hints: ["You want a folder to hold response notes.", "Create a directory named shells.", "Try `mkdir shells`."],
          explanation: "Creating a working folder before the listener starts keeps the response workspace organized.",
          successFeedback: "You created the shell workspace.",
          accepts: [fileExistsMatch("/home/student/shells", { command: "mkdir" })]
        }),
        step({
          objective: "Move into the shell workspace.",
          hints: ["Work from the folder you just created.", "Change into shells.", "Try `cd shells`."],
          explanation: "Moving into the workspace now keeps the rest of the response artifacts together.",
          successFeedback: "You moved into the shell workspace.",
          accepts: [cwdMatch("/home/student/shells")]
        }),
        step({
          objective: "Start a listener on TCP 4444 before the callback arrives.",
          hints: ["This must be a listening Netcat command.", "You need listen, verbose, numeric, and port options.", "Try `nc -lvnp 4444`."],
          explanation: "A reverse shell needs somewhere to land. The right listener must already be waiting when the target connects back.",
          successFeedback: "You prepared the reverse listener.",
          accepts: [rawMatch(/^nc\s+-lvnp\s+4444$/i), listenerPortMatch(4444, { command: "nc" })]
        })
      ]
    },
    {
      id: "python-workspace-prep",
      title: "Python Scan Workspace Prep",
      category: "Python/script workflows",
      level: "Beginner",
      shell: "linux",
      objective: "Create a clean script workspace for the `port-audit` project, move into it, create `scan.py`, and verify the result.",
      allowedFlexibility: "Any valid path form is acceptable as long as the final workspace and file exist in the right location.",
      environment: linuxEnv({ cwd: "/home/student/scripts" }),
      steps: [
        step({
          objective: "Create a new folder for the scan project.",
          context: "For this task, the project folder should be named `port-audit` so the rest of the workflow has a consistent workspace.",
          hints: ["Start by making the project directory.", "Create a folder named port-audit.", "Try `mkdir port-audit`."],
          explanation: "Creating a dedicated project folder before you script keeps tools and notes isolated from the rest of the host.",
          successFeedback: "You created the project directory.",
          accepts: [fileExistsMatch("/home/student/scripts/port-audit", { command: "mkdir", nodeType: "dir" })]
        }),
        step({
          objective: "Move into the new project folder.",
          hints: ["Work inside the new project directory.", "Change into port-audit.", "Try `cd port-audit`."],
          explanation: "Entering the project folder first keeps later files in the right place.",
          successFeedback: "You moved into the project directory.",
          accepts: [cwdMatch("/home/student/scripts/port-audit")],
          partials: [
            {
              match: (execution, state) =>
                /^cd\s+port-audit$/i.test((execution.raw || "").trim()) &&
                window.StateManager.getNode(state, "/home/student/scripts/port-audit")?.type === "file",
              classification: "wrong_context",
              feedback: "`port-audit` exists as a file, not a directory.",
              coach: "Remove the file, recreate `port-audit` as a directory, then change into it.",
              countsAsAttempt: false
            }
          ]
        }),
        step({
          objective: "Create the Python scan file.",
          context: "The script file for this workspace should be named `scan.py`, so create that file inside the project directory before you verify it.",
          hints: ["You need an empty file first.", "Create scan.py in the current directory.", "Try `touch scan.py`."],
          explanation: "touch creates the script placeholder so you can start building or reviewing code in the correct location.",
          successFeedback: "You created the script file.",
          accepts: [fileExistsMatch("/home/student/scripts/port-audit/scan.py", { command: "touch" })]
        }),
        step({
          objective: "List the folder so you can confirm the script exists.",
          hints: ["Verify the file is there.", "Use the standard listing command.", "Try `ls`."],
          explanation: "A quick listing is the simplest verification that the file exists where you expected it to be created.",
          successFeedback: "You confirmed the script file exists.",
          accepts: [commandMatch("ls")]
        })
      ]
    },
    {
      id: "grep-error-correlation",
      title: "Grep Error Correlation",
      category: "Text processing",
      level: "Intermediate",
      shell: "linux",
      objective: "Inspect the service logs and filter down to the lines that actually show the failure.",
      allowedFlexibility: "Using grep directly on the file or through a simple pipeline is acceptable.",
      environment: linuxEnv({
        cwd: "/var/log",
        files: [
          { path: "/var/log/auth.log", content: "INFO login ok\nERROR auth backend timeout\nWARN retrying auth\nERROR token validation failed\n" }
        ]
      }),
      steps: [
        step({
          objective: "Confirm which directory you are in before you inspect logs.",
          hints: ["Start with the working directory.", "Use the command that prints the current path.", "Try `pwd`."],
          explanation: "Even log work starts with context. That prevents confusion about which host path you are in.",
          successFeedback: "You confirmed the log directory context.",
          accepts: [commandMatch("pwd")]
        }),
        step({
          objective: "Read the log once so you know its file name and shape.",
          hints: ["Open the file directly first.", "Read auth.log.", "Try `cat auth.log`."],
          explanation: "A first read gives you the error vocabulary you will filter for next.",
          successFeedback: "You inspected the raw log.",
          accepts: [rawMatch(/^cat\s+auth\.log$/i)]
        }),
        step({
          objective: "Filter the log down to only ERROR lines.",
          hints: ["Now cut the noise out of the file.", "Use grep with the word ERROR.", "Try `grep ERROR auth.log`."],
          explanation: "Filtering the log for error lines is the efficient way to isolate the real failure signal.",
          successFeedback: "You filtered the log to the error lines.",
          accepts: [rawMatch(/^grep\s+ERROR\s+auth\.log$/i), rawMatch(/^cat\s+auth\.log\s*\|\s*grep\s+ERROR$/i)]
        })
      ]
    },
    {
      id: "metasploit-vsftpd-chain",
      title: "Metasploit vsftpd Chain",
      category: "Metasploit workflows",
      level: "Advanced",
      shell: "linux",
      objective: "Move from a version-confirmed FTP finding on metasploitable2 (192.168.56.102) into a disciplined Metasploit execution chain.",
      allowedFlexibility: "Stay inside the proper order: evidence, framework, search, module selection, targeting, execution.",
      environment: linuxEnv({
        cwd: "/home/student",
        targets: commonTargets()
      }),
      steps: [
        step({
          objective: "Confirm the FTP version before you open the framework.",
          context: "Do not open an exploitation framework until you have evidence. Here the evidence is the version of the FTP service on port 21 of metasploitable2 at 192.168.56.102.",
          hints: ["Do not skip evidence gathering.", "Use version detection on port 21.", "Try `nmap -sV -p 21 metasploitable2` or `nmap -sV -p 21 192.168.56.102`."],
          explanation: "Version confirmation is what justifies the exploit path. Skipping it turns exploitation into guesswork.",
          whyThisMatters: "Evidence first keeps exploitation tied to reality instead of hope.",
          successFeedback: "You verified the FTP version.",
          accepts: [
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+21\s+target$/i),
            rawMatch(/^nmap\s+-p\s+21\s+-sV\s+target$/i)
          ]
        }),
        step({
          objective: "Open Metasploit.",
          context: "Metasploit is the execution environment, not the discovery tool. Move into it only after you have enough evidence to justify a specific exploit path.",
          hints: ["Move into the framework now.", "Launch the console.", "Try `msfconsole`."],
          explanation: "Once you have evidence, msfconsole is the next environment for controlled exploitation work.",
          whyThisMatters: "Good operators separate reconnaissance from exploitation so each decision has evidence behind it.",
          successFeedback: "You opened Metasploit.",
          accepts: [rawMatch(/^msfconsole$/i)]
        }),
        step({
          objective: "Search for the relevant vsftpd module inside Metasploit.",
          context: "Inside Metasploit, search is the discovery step. It lets you verify the module name before you select anything.",
          hints: ["Search before you try to use a module.", "Look for vsftpd.", "Try `search vsftpd`."],
          explanation: "Searching inside Metasploit confirms the module path before you select it.",
          whyThisMatters: "Searching first keeps module selection evidence-based instead of relying on memory alone.",
          successFeedback: "You found the relevant module family.",
          accepts: [rawMatch(/^search\s+vsftpd$/i)]
        }),
        step({
          objective: "Load the vsftpd backdoor module.",
          context: "Once search has shown the module family, use selects the exact module and changes your working context inside Metasploit.",
          hints: ["Use the full module path.", "Load the unix FTP vsftpd module.", "Try `use exploit/unix/ftp/vsftpd_234_backdoor`."],
          explanation: "Loading the correct module is what turns the search result into an actionable exploit context.",
          whyThisMatters: "Selecting the exact module proves you can move from evidence to the right execution context.",
          successFeedback: "You selected the vsftpd exploit module.",
          accepts: [rawMatch(/^use\s+exploit\/unix\/ftp\/vsftpd_234_backdoor$/i)]
        }),
        step({
          objective: "Set the target host for the module.",
          context: "Exploit modules need target options before they can run. In Metasploit, RHOSTS tells the module which remote host to attack. In this lab that host is metasploitable2 at 192.168.56.102.",
          hints: ["Point the module at the right target host.", "Set RHOSTS to metasploitable2 or 192.168.56.102.", "Try `set RHOSTS metasploitable2` or `set RHOSTS 192.168.56.102`."],
          explanation: "The module needs a target before it can run. Setting RHOSTS is that control point.",
          whyThisMatters: "Module configuration is what turns a loaded exploit into a controlled action instead of a blind launch.",
          successFeedback: "You configured the target host.",
          accepts: [
            rawMatch(/^set\s+RHOSTS\s+192\.168\.56\.102$/i),
            rawMatch(/^set\s+RHOSTS\s+metasploitable2$/i),
            rawMatch(/^set\s+RHOSTS\s+target$/i)
          ]
        }),
        step({
          objective: "Execute the loaded exploit.",
          context: "Run belongs at the end of the chain. At this point you have evidence, a selected module, and a configured target.",
          hints: ["The module and target are ready.", "Use the execution command.", "Try `run`."],
          explanation: "Only after selecting the module and setting the target should you run the exploit.",
          whyThisMatters: "This step reinforces that execution is the last decision in the chain, not the first.",
          successFeedback: "You launched the exploit chain.",
          accepts: [rawMatch(/^run$/i)]
        })
      ]
    },
    {
      id: "nmap-output-capture",
      title: "Nmap Output Capture",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      shell: "linux",
      objective: "Run a version scan of metasploitable2 (192.168.56.102), save the output to a normal file, and inspect the saved report from the shell.",
      allowedFlexibility: "The output filename can be different, but the scan must save to disk and the saved report must be read back.",
      environment: linuxEnv({
        cwd: "/home/student"
      }),
      steps: [
        step({
          objective: "Run a version scan against the target and save it to baseline.txt.",
          context: "The target for this reporting workflow is metasploitable2 at 192.168.56.102. Capture the version evidence and save it directly to disk.",
          hints: ["Combine version detection with a normal output file.", "Use -sV and save with -oN.", "Try `nmap -sV -oN baseline.txt metasploitable2` or `nmap -sV -oN baseline.txt 192.168.56.102`."],
          explanation: "Saving the scan output is the right move when you want evidence you can review, compare, or hand off later.",
          successFeedback: "You captured the scan output to disk.",
          accepts: [
            rawMatch(/^nmap\s+-sV\s+-oN\s+baseline\.txt\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-oN\s+baseline\.txt\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-sV\s+-oN\s+baseline\.txt\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-oN\s+baseline\.txt\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-sV\s+-oN\s+baseline\.txt\s+target$/i),
            rawMatch(/^nmap\s+-oN\s+baseline\.txt\s+-sV\s+target$/i)
          ]
        }),
        step({
          objective: "List the directory so you can verify the report file exists.",
          hints: ["Confirm the saved file is there.", "Use the directory listing command.", "Try `ls`."],
          explanation: "A quick listing confirms the saved evidence file exists before you read it.",
          successFeedback: "You confirmed the report file is present.",
          accepts: [commandMatch("ls")]
        }),
        step({
          objective: "Read the saved report from the shell.",
          hints: ["Open the saved report directly.", "Read baseline.txt.", "Try `cat baseline.txt`."],
          explanation: "Reading the saved report proves you can move from active scanning into evidence review without leaving the terminal.",
          successFeedback: "You reviewed the saved Nmap report.",
          accepts: [rawMatch(/^cat\s+baseline\.txt$/i)]
        })
      ]
    }
  ];

  function linuxNavigationScenario(config) {
    return {
      id: config.id,
      title: config.title,
      category: "File system navigation",
      layer: config.layer || inferScenarioLayer({ ...config, category: "File system navigation" }),
      level: config.level,
      shell: "linux",
      objective: config.objective,
      allowedFlexibility: "Relative or absolute paths are both acceptable if you land in the right directory and inspect the right file.",
      environment: linuxEnv({
        cwd: config.start,
        directories: [config.targetDir],
        files: [{ path: `${config.targetDir}/${config.file}`, content: config.content }]
      }),
      steps: [
        step({ objective: "Confirm your current location.", hints: ["Start with context.", "Print the current path.", "Try `pwd`."], explanation: "Context before movement prevents path confusion.", accepts: [commandMatch("pwd")] }),
        step({ objective: config.moveObjective, hints: config.moveHints, explanation: "Moving into the correct directory narrows the task immediately.", accepts: [cwdMatch(config.targetDir)] }),
        step({ objective: "List the directory contents.", hints: ["Inspect the folder contents.", "Use the listing command.", "Try `ls`."], explanation: "A listing confirms the file names before you open anything.", accepts: [commandMatch("ls")] }),
        step({ objective: config.readObjective, hints: config.readHints, explanation: "Reading the target file confirms the clue you were sent to collect.", accepts: [rawMatch(new RegExp(`^cat\\s+${config.file.replace(/\./g, "\\.")}$`, "i"))] })
      ]
    };
  }

  function cmdNavigationScenario(config) {
    return {
      id: config.id,
      title: config.title,
      category: "File system navigation",
      layer: config.layer || inferScenarioLayer({ ...config, category: "File system navigation" }),
      level: config.level,
      shell: "cmd",
      objective: config.objective,
      allowedFlexibility: "Relative or absolute Windows paths are both acceptable if you stay in CMD commands.",
      environment: cmdEnv({
        cwd: config.start,
        directories: [config.targetDir],
        files: [{ path: `${config.targetDir}/${config.file}`, content: config.content }]
      }),
      steps: [
        step({ objective: "List the current workspace.", hints: ["Start by listing the current folder.", "Use the CMD directory command.", "Try `dir`."], explanation: "A quick listing gives you the current workspace before you navigate.", accepts: [commandMatch("dir")] }),
        step({ objective: config.moveObjective, hints: config.moveHints, explanation: "Moving into the right incident folder narrows the problem immediately.", accepts: [cwdMatch(config.targetDir)] }),
        step({ objective: "List the directory contents again inside the target folder.", hints: ["Inspect the target folder itself.", "Use the same listing command.", "Try `dir`."], explanation: "A second listing confirms the files you actually need to inspect in that folder.", accepts: [commandMatch("dir")] }),
        step({ objective: config.readObjective, hints: config.readHints, explanation: "Reading the file gives you the exact clue required for the task.", accepts: [rawMatch(new RegExp(`^type\\s+${config.file.replace(/\./g, "\\.")}$`, "i"))] })
      ]
    };
  }

  function fileManipScenario(config) {
    return {
      id: config.id,
      title: config.title,
      category: "File manipulation",
      layer: config.layer || inferScenarioLayer({ ...config, category: "File manipulation" }),
      level: config.level,
      shell: "linux",
      objective: config.objective,
      allowedFlexibility: "As long as the right file state exists after the command sequence, path style can vary.",
      environment: linuxEnv({
        cwd: config.cwd,
        directories: config.directories || [],
        files: config.files || []
      }),
      steps: config.steps
    };
  }

  function linuxScenario(config) {
    const environment = linuxEnv(config.environment || {});
    const contextMeta = buildScenarioContextMetadata(config, environment, "linux");

    return {
      id: config.id,
      title: config.title,
      category: config.category,
      mode: config.mode || "lesson",
      hiddenSteps: Boolean(config.hiddenSteps),
      challengeObjective: config.challengeObjective || "",
      successConditions: config.successConditions || [],
      allowedApproaches: config.allowedApproaches || [],
      difficulty: config.difficulty || config.level,
      layers: Array.isArray(config.layers) && config.layers.length ? config.layers : [config.layer || inferScenarioLayer(config)],
      layer: config.layer || inferScenarioLayer(config),
      level: config.level,
      shell: "linux",
      scenarioIntro: config.scenarioIntro || "",
      commandFocus: config.commandFocus || [],
      commandFamilyIntro: config.commandFamilyIntro || null,
      commandFamilyIntros: config.commandFamilyIntros || [],
      acceptedCommands: config.acceptedCommands || [],
      simulatedOutput: config.simulatedOutput || [],
      successCondition: config.successCondition || "",
      feedbackText: config.feedbackText || "",
      role: config.role || "",
      estimatedTime: config.estimatedTime || "",
      scenarioType: config.scenarioType || "",
      missionBriefing: config.missionBriefing || "",
      learningObjectives: config.learningObjectives || [],
      successCriteria: config.successCriteria || [],
      environmentNotes: config.environmentNotes || "",
      verificationRequired: Boolean(config.verificationRequired),
      verificationSteps: config.verificationSteps || [],
      riskyCommands: config.riskyCommands || [],
      ticketId: config.ticketId || "",
      ticketTitle: config.ticketTitle || "",
      reportedBy: config.reportedBy || "",
      reportedTime: config.reportedTime || "",
      priority: config.priority || "",
      affectedSystem: config.affectedSystem || "",
      symptoms: config.symptoms || [],
      userReport: config.userReport || "",
      knownFacts: config.knownFacts || [],
      constraints: config.constraints || [],
      escalationNote: config.escalationNote || "",
      easterEggNote: config.easterEggNote || "",
      tags: config.tags || [],
      skills: config.skills || [],
      summary: config.summary || "",
      beginnerTicket: config.beginnerTicket || null,
      visualGuide: config.visualGuide || null,
      beginnerTrack: config.beginnerTrack || "",
      beginnerLabLevelId: config.beginnerLabLevelId || "",
      beginnerLabMissionLabel: config.beginnerLabMissionLabel || "",
      walkthrough: config.walkthrough || [],
      stages: config.stages || [],
      environmentCategory: contextMeta.environmentCategory,
      environmentLabel: contextMeta.environmentLabel,
      environmentPolicy: contextMeta.environmentPolicy,
      machineContexts: contextMeta.machineContexts,
      objective: config.objective,
      allowedFlexibility: config.allowedFlexibility || "Reasonable command variations are fine if the right state or evidence is produced.",
      environment,
      steps: config.steps
    };
  }

  function cmdScenario(config) {
    const environment = cmdEnv(config.environment || {});
    const contextMeta = buildScenarioContextMetadata(config, environment, "cmd");

    return {
      id: config.id,
      title: config.title,
      category: config.category,
      mode: config.mode || "lesson",
      hiddenSteps: Boolean(config.hiddenSteps),
      challengeObjective: config.challengeObjective || "",
      successConditions: config.successConditions || [],
      allowedApproaches: config.allowedApproaches || [],
      difficulty: config.difficulty || config.level,
      layers: Array.isArray(config.layers) && config.layers.length ? config.layers : [config.layer || inferScenarioLayer(config)],
      layer: config.layer || inferScenarioLayer(config),
      level: config.level,
      shell: "cmd",
      scenarioIntro: config.scenarioIntro || "",
      commandFocus: config.commandFocus || [],
      commandFamilyIntro: config.commandFamilyIntro || null,
      commandFamilyIntros: config.commandFamilyIntros || [],
      acceptedCommands: config.acceptedCommands || [],
      simulatedOutput: config.simulatedOutput || [],
      successCondition: config.successCondition || "",
      feedbackText: config.feedbackText || "",
      role: config.role || "",
      estimatedTime: config.estimatedTime || "",
      scenarioType: config.scenarioType || "",
      missionBriefing: config.missionBriefing || "",
      learningObjectives: config.learningObjectives || [],
      successCriteria: config.successCriteria || [],
      environmentNotes: config.environmentNotes || "",
      verificationRequired: Boolean(config.verificationRequired),
      verificationSteps: config.verificationSteps || [],
      riskyCommands: config.riskyCommands || [],
      ticketId: config.ticketId || "",
      ticketTitle: config.ticketTitle || "",
      reportedBy: config.reportedBy || "",
      reportedTime: config.reportedTime || "",
      priority: config.priority || "",
      affectedSystem: config.affectedSystem || "",
      symptoms: config.symptoms || [],
      userReport: config.userReport || "",
      knownFacts: config.knownFacts || [],
      constraints: config.constraints || [],
      escalationNote: config.escalationNote || "",
      easterEggNote: config.easterEggNote || "",
      tags: config.tags || [],
      skills: config.skills || [],
      summary: config.summary || "",
      beginnerTicket: config.beginnerTicket || null,
      visualGuide: config.visualGuide || null,
      beginnerTrack: config.beginnerTrack || "",
      beginnerLabLevelId: config.beginnerLabLevelId || "",
      beginnerLabMissionLabel: config.beginnerLabMissionLabel || "",
      walkthrough: config.walkthrough || [],
      stages: config.stages || [],
      environmentCategory: contextMeta.environmentCategory,
      environmentLabel: contextMeta.environmentLabel,
      environmentPolicy: contextMeta.environmentPolicy,
      machineContexts: contextMeta.machineContexts,
      objective: config.objective,
      allowedFlexibility: config.allowedFlexibility || "Stay inside CMD commands while reaching the required result.",
      environment,
      steps: config.steps
    };
  }

  function ciscoScenario(config) {
    const environment = ciscoEnv(config.environment || {});
    const contextMeta = buildScenarioContextMetadata(config, environment, "cisco");

    return {
      id: config.id,
      title: config.title,
      category: config.category,
      mode: config.mode || "lesson",
      hiddenSteps: Boolean(config.hiddenSteps),
      challengeObjective: config.challengeObjective || "",
      successConditions: config.successConditions || [],
      allowedApproaches: config.allowedApproaches || [],
      difficulty: config.difficulty || config.level,
      layers: Array.isArray(config.layers) && config.layers.length ? config.layers : [config.layer || inferScenarioLayer(config)],
      layer: config.layer || inferScenarioLayer(config),
      level: config.level,
      shell: "cisco",
      scenarioIntro: config.scenarioIntro || "",
      commandFocus: config.commandFocus || [],
      acceptedCommands: config.acceptedCommands || [],
      simulatedOutput: config.simulatedOutput || [],
      successCondition: config.successCondition || "",
      feedbackText: config.feedbackText || "",
      role: config.role || "",
      estimatedTime: config.estimatedTime || "",
      scenarioType: config.scenarioType || "",
      missionBriefing: config.missionBriefing || "",
      learningObjectives: config.learningObjectives || [],
      successCriteria: config.successCriteria || [],
      environmentNotes: config.environmentNotes || "",
      verificationRequired: Boolean(config.verificationRequired),
      verificationSteps: config.verificationSteps || [],
      riskyCommands: config.riskyCommands || [],
      ticketId: config.ticketId || "",
      ticketTitle: config.ticketTitle || "",
      reportedBy: config.reportedBy || "",
      reportedTime: config.reportedTime || "",
      priority: config.priority || "",
      affectedSystem: config.affectedSystem || "",
      symptoms: config.symptoms || [],
      userReport: config.userReport || "",
      knownFacts: config.knownFacts || [],
      constraints: config.constraints || [],
      escalationNote: config.escalationNote || "",
      easterEggNote: config.easterEggNote || "",
      tags: config.tags || [],
      skills: config.skills || [],
      summary: config.summary || "",
      beginnerTicket: config.beginnerTicket || null,
      visualGuide: config.visualGuide || null,
      beginnerTrack: config.beginnerTrack || "",
      beginnerLabLevelId: config.beginnerLabLevelId || "",
      beginnerLabMissionLabel: config.beginnerLabMissionLabel || "",
      walkthrough: config.walkthrough || [],
      stages: config.stages || [],
      environmentCategory: contextMeta.environmentCategory,
      environmentLabel: contextMeta.environmentLabel,
      environmentPolicy: contextMeta.environmentPolicy,
      machineContexts: contextMeta.machineContexts,
      objective: config.objective,
      allowedFlexibility: config.allowedFlexibility || "Stay inside Cisco IOS commands and move through the correct mode changes for the task.",
      environment,
      steps: config.steps
    };
  }

  function windowsLessonScenario(config) {
    return cmdScenario({
      level: config.level || config.difficulty || "Beginner",
      difficulty: config.difficulty || config.level || "Beginner",
      allowedFlexibility: config.allowedFlexibility || "Stay inside practical CMD commands. Relative or absolute Windows paths are both fine when the end state or evidence is correct.",
      ...config
    });
  }

  function ciscoLessonScenario(config) {
    return ciscoScenario({
      category: config.category || "Cisco CLI fundamentals",
      level: config.level || config.difficulty || "Beginner",
      difficulty: config.difficulty || config.level || "Beginner",
      allowedFlexibility: config.allowedFlexibility || "Cisco accepts the exact IOS workflow or a close equivalent that reaches the same router state safely.",
      ...config
    });
  }

  function proxyScenario(config) {
    return linuxScenario({
      category: "Proxy interception workflows",
      layer: "application",
      allowedFlexibility: config.allowedFlexibility || "Use terminal inspection commands to isolate the meaningful request or response artifact before you decide what matters.",
      ...config
    });
  }

  function challengeScenario(config) {
    return linuxScenario({
      category: config.category || "Challenge labs",
      mode: "challenge",
      hiddenSteps: true,
      challengeObjective: config.challengeObjective || config.objective,
      successConditions: config.successConditions || [],
      allowedApproaches: config.allowedApproaches || [],
      difficulty: config.difficulty || config.level,
      layers: Array.isArray(config.layers) && config.layers.length ? config.layers : [config.layer || inferScenarioLayer(config)],
      allowedFlexibility: config.allowedFlexibility || "Multiple valid approaches are acceptable if you gather the right evidence and reach a defensible outcome.",
      ...config
    });
  }

  const generatedNavigationScenarios = [
    linuxNavigationScenario({
      id: "apache-vhost-hunt",
      title: "Apache VHost Hunt",
      level: "Beginner",
      objective: "Reach the Apache configuration directory and inspect the active virtual host file.",
      start: "/home/student",
      targetDir: "/etc/apache2/sites-enabled",
      file: "000-default.conf",
      content: "ServerName intranet.lab\nDocumentRoot /var/www/html\n",
      moveObjective: "Move into the Apache virtual host directory.",
      moveHints: ["The Apache vhost files are under /etc/apache2/sites-enabled.", "Change into the sites-enabled directory.", "Try `cd /etc/apache2/sites-enabled`."],
      readObjective: "Read the active virtual host file.",
      readHints: ["The file is named 000-default.conf.", "Open the vhost file directly.", "Try `cat 000-default.conf`."]
    }),
    linuxNavigationScenario({
      id: "cron-dropbox-review",
      title: "Cron Dropbox Review",
      level: "Beginner",
      objective: "Reach the cron dropbox and inspect the scheduled task file.",
      start: "/home/student",
      targetDir: "/etc/cron.d",
      file: "backup-job",
      content: "*/15 * * * * root /usr/local/bin/backup.sh\n",
      moveObjective: "Move into the cron configuration directory.",
      moveHints: ["The cron dropbox is under /etc/cron.d.", "Change into that directory.", "Try `cd /etc/cron.d`."],
      readObjective: "Read the backup-job file.",
      readHints: ["Open the cron file directly.", "The file is named backup-job.", "Try `cat backup-job`."]
    }),
    cmdNavigationScenario({
      id: "windows-startup-audit",
      title: "Windows Startup Audit",
      level: "Beginner",
      objective: "Reach the startup review folder and inspect the autorun notes.",
      start: "C:/Lab",
      targetDir: "C:/Lab/Startup",
      file: "autoruns.txt",
      content: "OneDriveUpdater launches at login\n",
      moveObjective: "Move into the startup folder.",
      moveHints: ["The folder is named Startup.", "Change into the Startup directory.", "Try `cd Startup`."],
      readObjective: "Read the autorun notes file.",
      readHints: ["The file is named autoruns.txt.", "Use the Windows file-reading command.", "Try `type autoruns.txt`."]
    }),
    cmdNavigationScenario({
      id: "windows-archive-note-review",
      title: "Windows Archive Note Review",
      level: "Beginner",
      objective: "Move through the archive review folder and read the archived notice.",
      start: "C:/Lab",
      targetDir: "C:/Lab/Archives",
      file: "notice.txt",
      content: "Legacy payroll export retired on Friday\n",
      moveObjective: "Move into the archive review folder.",
      moveHints: ["The folder is named Archives.", "Change into that folder.", "Try `cd Archives`."],
      readObjective: "Read the archived notice file.",
      readHints: ["Open the notice file directly.", "The file is named notice.txt.", "Try `type notice.txt`."]
    })
  ];

  const generatedFileManipScenarios = [
    fileManipScenario({
      id: "create-backup-folder",
      title: "Create a Backup Workspace",
      level: "Beginner",
      objective: "Create a backup folder, enter it, create a placeholder note, and verify the result.",
      cwd: "/home/student/projects",
      steps: [
        step({ objective: "Create a directory named backups.", hints: ["Start by creating the workspace.", "Use mkdir for backups.", "Try `mkdir backups`."], explanation: "Creating the backup workspace first keeps later artifacts in one place.", accepts: [fileExistsMatch("/home/student/projects/backups", { command: "mkdir" })] }),
        step({ objective: "Move into the backups directory.", hints: ["Work inside the folder you just created.", "Change into backups.", "Try `cd backups`."], explanation: "Changing into the folder keeps the rest of the work scoped correctly.", accepts: [cwdMatch("/home/student/projects/backups")] }),
        step({ objective: "Create a placeholder file named notes.txt.", hints: ["Create an empty file for the backup notes.", "Use touch on notes.txt.", "Try `touch notes.txt`."], explanation: "touch gives you a clean placeholder file to fill later.", accepts: [fileExistsMatch("/home/student/projects/backups/notes.txt", { command: "touch" })] }),
        step({ objective: "List the folder to confirm the file exists.", hints: ["Now verify the file is there.", "Use the listing command.", "Try `ls`."], explanation: "Verification matters even in basic file manipulation tasks.", accepts: [commandMatch("ls")] })
      ]
    }),
    fileManipScenario({
      id: "copy-config-template",
      title: "Copy a Config Template",
      level: "Intermediate",
      objective: "Copy the baseline config into a backup file and confirm both files are present.",
      cwd: "/home/student/projects",
      files: [{ path: "/home/student/projects/app.conf", content: "mode=prod\nthreads=4\n" }],
      steps: [
        step({ objective: "List the project folder to confirm the source file exists.", hints: ["Start by verifying the source file.", "Use the listing command.", "Try `ls`."], explanation: "A quick directory check confirms the source file name before you copy it.", accepts: [commandMatch("ls")] }),
        step({ objective: "Copy app.conf to app.conf.bak.", hints: ["Use the copy command with source and destination.", "Duplicate the config into a .bak file.", "Try `cp app.conf app.conf.bak`."], explanation: "Copying first preserves the original before any later edits.", accepts: [fileExistsMatch("/home/student/projects/app.conf.bak", { command: "cp" })] }),
        step({ objective: "List the folder again to confirm the backup file exists.", hints: ["Verify both files are now present.", "Use ls again.", "Try `ls`."], explanation: "A post-copy check confirms that the backup artifact really exists.", accepts: [commandMatch("ls")] })
      ]
    }),
    fileManipScenario({
      id: "move-suspicious-log",
      title: "Move a Suspicious Log",
      level: "Intermediate",
      objective: "Create a folder named `quarantine` in the current workspace, move the suspicious log into that folder, and verify the move completed.",
      cwd: "/home/student/downloads",
      files: [{ path: "/home/student/downloads/suspicious.log", content: "anomalous login pattern\n" }],
      steps: [
        step({ objective: "Create the `quarantine` directory under `/home/student/downloads`.", context: "Stay in the current downloads workspace. The holding folder for this task is `/home/student/downloads/quarantine`.", hints: ["You need a holding area first.", "Create a folder named quarantine in the current directory.", "Try `mkdir quarantine`."], explanation: "Quarantine folders keep suspicious artifacts separate from the rest of the workspace.", accepts: [fileExistsMatch("/home/student/downloads/quarantine", { command: "mkdir" })] }),
        step({ objective: "Move suspicious.log into the `quarantine` folder.", context: "The destination is the directory you just created: `/home/student/downloads/quarantine`. Moving the file into that directory is enough; you do not need to rename it.", hints: ["Use the move command.", "Send suspicious.log into the quarantine directory.", "Try `mv suspicious.log quarantine/` or `mv suspicious.log quarantine`."], explanation: "Moving the file separates it from the main workspace without destroying it.", accepts: [fileExistsMatch("/home/student/downloads/quarantine/suspicious.log", { command: "mv" })] }),
        step({ objective: "List the quarantine folder to confirm the move.", context: "Confirm the file is now inside `/home/student/downloads/quarantine` rather than in the main downloads listing.", hints: ["Check the target folder now.", "List quarantine directly.", "Try `ls quarantine`."], explanation: "A direct listing of the target directory confirms the file landed where you intended.", accepts: [rawMatch(/^ls\s+quarantine$/i)] })
      ]
    }),
    fileManipScenario({
      id: "remove-temp-dump",
      title: "Remove a Temporary Dump",
      level: "Intermediate",
      objective: "Inspect the working directory, remove the temporary dump file, and verify it is gone.",
      cwd: "/home/student/downloads",
      files: [{ path: "/home/student/downloads/memory.dump", content: "binary-placeholder\n" }],
      steps: [
        step({ objective: "List the directory so you can confirm the dump file is present.", hints: ["Check the current folder first.", "Use ls.", "Try `ls`."], explanation: "A quick listing confirms you are about to remove the right artifact.", accepts: [commandMatch("ls")] }),
        step({ objective: "Remove memory.dump from the current directory.", hints: ["Use the remove command against the file.", "Delete memory.dump directly.", "Try `rm memory.dump`."], explanation: "Removing the temporary dump clears the workspace once you no longer need the artifact.", accepts: [{ command: "rm", fileMissing: "/home/student/downloads/memory.dump" }] }),
        step({ objective: "List the directory again to verify the dump is gone.", hints: ["Verify the file really disappeared.", "Use ls again.", "Try `ls`."], explanation: "Verification prevents accidental assumptions after a destructive action.", accepts: [commandMatch("ls", { postCheck: (_, state) => !window.StateManager.getNode(state, "/home/student/downloads/memory.dump") })] })
      ]
    }),
    fileManipScenario({
      id: "rename-incident-note",
      title: "Rename an Incident Note",
      level: "Intermediate",
      objective: "Rename the rough incident note into a final review file and confirm the new name.",
      cwd: "/home/student/projects",
      files: [{ path: "/home/student/projects/rough-note.txt", content: "investigate daemon restart\n" }],
      steps: [
        step({ objective: "Move rough-note.txt to final-review.txt.", hints: ["Use the move command as a rename.", "Rename the note into final-review.txt.", "Try `mv rough-note.txt final-review.txt`."], explanation: "mv is the normal Linux way to rename a file in place.", accepts: [fileExistsMatch("/home/student/projects/final-review.txt", { command: "mv" })] }),
        step({ objective: "List the directory to confirm the renamed file exists.", hints: ["Check the directory contents now.", "Use ls.", "Try `ls`."], explanation: "A directory listing confirms that the rename happened exactly as intended.", accepts: [commandMatch("ls")] }),
        step({ objective: "Read the renamed note file.", hints: ["Open the new file name directly.", "Read final-review.txt.", "Try `cat final-review.txt`."], explanation: "Reading the renamed file confirms the content survived the rename operation.", accepts: [rawMatch(/^cat\s+final-review\.txt$/i)] })
      ]
    })
  ];

  const generatedTextScenarios = [
    linuxScenario({
      id: "grep-warn-log",
      title: "Filter WARN Lines",
      category: "Text processing",
      level: "Intermediate",
      objective: "Filter a service log down to the warning lines only.",
      environment: { cwd: "/var/log", files: [{ path: "/var/log/service.log", content: "INFO boot\nWARN cache stale\nINFO retry\nWARN certificate expires soon\n" }] },
      steps: [
        step({ objective: "Read the raw service log once.", hints: ["Open the file directly first.", "Read service.log.", "Try `cat service.log`."], explanation: "A first read gives you the language and file shape before you filter it.", accepts: [rawMatch(/^cat\s+service\.log$/i)] }),
        step({ objective: "Filter the log down to WARN lines only.", hints: ["Use grep with the word WARN.", "You can use grep directly on the file.", "Try `grep WARN service.log`."], explanation: "Filtering saves time and gets you straight to the warning signal.", accepts: [rawMatch(/^grep\s+WARN\s+service\.log$/i), rawMatch(/^cat\s+service\.log\s*\|\s*grep\s+WARN$/i)] }),
        step({ objective: "Read the file again if you want to confirm the full context.", hints: ["A second raw read is fine here.", "Open the file again.", "Try `cat service.log`."], explanation: "Switching back to the full log helps you place the filtered warnings in context.", accepts: [rawMatch(/^cat\s+service\.log$/i)] })
      ]
    }),
    linuxScenario({
      id: "grep-token-log",
      title: "Token Failure Isolation",
      category: "Text processing",
      level: "Intermediate",
      objective: "Inspect an access log and isolate the token-related failures.",
      environment: { cwd: "/var/log", files: [{ path: "/var/log/access.log", content: "INFO auth ok\nERROR token expired\nINFO auth ok\nERROR token signature mismatch\n" }] },
      steps: [
        step({ objective: "Read the access log once.", hints: ["Open the log file directly.", "Read access.log.", "Try `cat access.log`."], explanation: "A first read shows you the exact phrase you want to isolate.", accepts: [rawMatch(/^cat\s+access\.log$/i)] }),
        step({ objective: "Filter the token lines from the access log.", hints: ["Use grep with the word token.", "Target access.log with grep.", "Try `grep token access.log`."], explanation: "Filtering on the key token term gets you to the relevant failure lines quickly.", accepts: [rawMatch(/^grep\s+token\s+access\.log$/i), rawMatch(/^cat\s+access\.log\s*\|\s*grep\s+token$/i)] }),
        step({ objective: "Read the filtered log again if you need to re-check the file structure.", hints: ["A second direct read is acceptable.", "Open access.log again.", "Try `cat access.log`."], explanation: "Returning to the full file is a normal part of log work when you want broader context.", accepts: [rawMatch(/^cat\s+access\.log$/i)] })
      ]
    }),
    cmdScenario({
      id: "findstr-failed-job",
      title: "Findstr Failed Job Review",
      category: "Text processing",
      level: "Intermediate",
      objective: "Inspect the Windows job log and isolate the FAILED lines using CMD tools.",
      environment: { cwd: "C:/Lab/Logs", files: [{ path: "C:/Lab/Logs/jobs.txt", content: "SUCCESS backup\nFAILED report-export\nSUCCESS sync\nFAILED invoice-build\n" }] },
      steps: [
        step({ objective: "Read the job log file once.", hints: ["Open the file directly first.", "Use the CMD file-reading command.", "Try `type jobs.txt`."], explanation: "A first read shows you the exact failure term you want to search for.", accepts: [rawMatch(/^type\s+jobs\.txt$/i)] }),
        step({ objective: "Filter the FAILED lines from the log.", hints: ["Use the Windows text filter.", "Search the file for FAILED.", "Try `findstr FAILED jobs.txt`."], explanation: "findstr is the practical Windows way to isolate matching lines in a text file.", accepts: [rawMatch(/^findstr\s+FAILED\s+jobs\.txt$/i), rawMatch(/^type\s+jobs\.txt\s*\|\s*findstr\s+FAILED$/i)] }),
        step({ objective: "List the directory to verify the working files around the log.", hints: ["Look at the rest of the folder.", "Use dir.", "Try `dir`."], explanation: "A quick directory listing gives you surrounding context after you isolate the failure lines.", accepts: [commandMatch("dir")] })
      ]
    }),
    cmdScenario({
      id: "findstr-backup-notes",
      title: "Findstr Backup Notes",
      category: "Text processing",
      level: "Intermediate",
      objective: "Inspect the incident note file and isolate the backup-related lines.",
      environment: { cwd: "C:/Lab/Logs", files: [{ path: "C:/Lab/Logs/notes.txt", content: "database backup failed\nmail relay ok\nbackup job retried\n" }] },
      steps: [
        step({ objective: "Read the notes file once.", hints: ["Open notes.txt first.", "Use the CMD file-reading command.", "Try `type notes.txt`."], explanation: "Reading the raw note file first shows you the terms worth filtering.", accepts: [rawMatch(/^type\s+notes\.txt$/i)] }),
        step({ objective: "Filter the lines mentioning backup.", hints: ["Use the Windows text filter with the word backup.", "Search notes.txt for backup.", "Try `findstr backup notes.txt`."], explanation: "findstr pulls the relevant backup lines out of the broader note file.", accepts: [rawMatch(/^findstr\s+backup\s+notes\.txt$/i), rawMatch(/^type\s+notes\.txt\s*\|\s*findstr\s+backup$/i)] }),
        step({ objective: "Read the notes again if you need the full context.", hints: ["A second direct read is fine here.", "Open notes.txt again.", "Try `type notes.txt`."], explanation: "Switching between filtered and full output is normal when you are building context from a Windows note file.", accepts: [rawMatch(/^type\s+notes\.txt$/i)] })
      ]
    })
  ];

  const generatedArchiveScenarios = [
    linuxScenario({
      id: "asset-bundle-extract",
      title: "Asset Bundle Extract",
      category: "Archive workflows",
      level: "Intermediate",
      objective: "Confirm an asset bundle archive, extract it, move into the folder, and inspect the manifest.",
      environment: {
        cwd: "/home/student/downloads",
        files: [archiveFile("/home/student/downloads/assets.tar.gz", [
          { path: "assets", type: "dir" },
          { path: "assets/manifest.txt", content: "css/main.css\njs/app.js\n" }
        ])]
      },
      steps: [
        step({ objective: "List the downloads directory.", hints: ["Check what is here first.", "Use ls.", "Try `ls`."], explanation: "A quick listing confirms the archive name before you act on it.", accepts: [commandMatch("ls")] }),
        step({ objective: "Extract assets.tar.gz.", hints: ["Use tar with the gzip extraction flags.", "Target assets.tar.gz.", "Try `tar -xvzf assets.tar.gz`."], explanation: "Extracting the archive turns the package into a working directory you can inspect.", accepts: [rawMatch(/^tar\s+-xvzf\s+assets\.tar\.gz$/i), rawMatch(/^tar\s+-xzvf\s+assets\.tar\.gz$/i)] }),
        step({ objective: "Move into the extracted assets directory.", hints: ["The extracted folder is named assets.", "Change into it.", "Try `cd assets`."], explanation: "Changing into the extracted directory keeps the inspection focused on the unpacked content.", accepts: [cwdMatch("/home/student/downloads/assets")] }),
        step({ objective: "Read the manifest file.", hints: ["The file is named manifest.txt.", "Open it directly.", "Try `cat manifest.txt`."], explanation: "The manifest confirms what the archive actually contained after extraction.", accepts: [rawMatch(/^cat\s+manifest\.txt$/i)] })
      ]
    }),
    linuxScenario({
      id: "config-bundle-extract",
      title: "Config Bundle Extract",
      category: "Archive workflows",
      level: "Intermediate",
      objective: "Extract a configuration bundle and inspect the service configuration inside it.",
      environment: {
        cwd: "/home/student/downloads",
        files: [archiveFile("/home/student/downloads/configs.tar.gz", [
          { path: "configs", type: "dir" },
          { path: "configs/service.conf", content: "listen_port=8443\nmode=staging\n" }
        ])]
      },
      steps: [
        step({ objective: "Extract configs.tar.gz.", hints: ["This is a tar.gz extraction task.", "Use tar against configs.tar.gz.", "Try `tar -xvzf configs.tar.gz`."], explanation: "The archive must be extracted before you can inspect the configuration inside it.", accepts: [rawMatch(/^tar\s+-xvzf\s+configs\.tar\.gz$/i), rawMatch(/^tar\s+-xzvf\s+configs\.tar\.gz$/i)] }),
        step({ objective: "Move into the extracted configs directory.", hints: ["Work inside the extracted folder.", "Change into configs.", "Try `cd configs`."], explanation: "Changing into the extracted directory scopes the next file read correctly.", accepts: [cwdMatch("/home/student/downloads/configs")] }),
        step({ objective: "Read the service configuration file.", hints: ["The file is named service.conf.", "Open the config directly.", "Try `cat service.conf`."], explanation: "Reading the extracted config reveals the service settings you were asked to inspect.", accepts: [rawMatch(/^cat\s+service\.conf$/i)] })
      ]
    }),
    linuxScenario({
      id: "evidence-bundle-extract",
      title: "Evidence Bundle Extract",
      category: "Archive workflows",
      level: "Intermediate",
      objective: "Extract the evidence bundle, enter it, and inspect the incident summary.",
      environment: {
        cwd: "/home/student/downloads",
        files: [archiveFile("/home/student/downloads/evidence.tar.gz", [
          { path: "evidence", type: "dir" },
          { path: "evidence/summary.txt", content: "Primary compromise window: 02:14 UTC\n" }
        ])]
      },
      steps: [
        step({ objective: "List the downloads directory to confirm the bundle name.", hints: ["Use ls to confirm the archive name.", "List the folder first.", "Try `ls`."], explanation: "A listing confirms the archive name before you extract the evidence set.", accepts: [commandMatch("ls")] }),
        step({ objective: "Extract evidence.tar.gz.", hints: ["Use tar with the archive.", "Target evidence.tar.gz.", "Try `tar -xvzf evidence.tar.gz`."], explanation: "Extraction is what turns the evidence bundle into readable files.", accepts: [rawMatch(/^tar\s+-xvzf\s+evidence\.tar\.gz$/i), rawMatch(/^tar\s+-xzvf\s+evidence\.tar\.gz$/i)] }),
        step({ objective: "Move into the evidence directory.", hints: ["The extracted folder is named evidence.", "Change into it.", "Try `cd evidence`."], explanation: "Entering the extracted folder keeps the later file read focused on the unpacked evidence.", accepts: [cwdMatch("/home/student/downloads/evidence")] }),
        step({ objective: "Read the summary file.", hints: ["The summary is stored in summary.txt.", "Open it directly.", "Try `cat summary.txt`."], explanation: "The summary file gives the immediate incident signal you wanted from the bundle.", accepts: [rawMatch(/^cat\s+summary\.txt$/i)] })
      ]
    }),
    linuxScenario({
      id: "toolkit-verify-extract",
      title: "Toolkit Verify and Extract",
      category: "Archive workflows",
      level: "Intermediate",
      objective: "Download the toolkit archive, verify it, and extract it for review.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({ objective: "Download toolkit.tar.gz with wget.", hints: ["Use wget and a local output filename.", "Save the download as toolkit.tar.gz.", "Try `wget https://downloads.lab/toolkit.tar.gz -O toolkit.tar.gz`."], explanation: "A predictable local filename makes the later verification and extraction steps cleaner.", accepts: [rawMatch(/^wget\s+https:\/\/downloads\.lab\/toolkit\.tar\.gz\s+-O\s+toolkit\.tar\.gz$/i)] }),
        step({ objective: "List the directory to verify toolkit.tar.gz exists.", hints: ["Confirm the download first.", "Use ls.", "Try `ls`."], explanation: "A quick file listing confirms the archive really arrived before you try to extract it.", accepts: [commandMatch("ls")] }),
        step({ objective: "Extract toolkit.tar.gz.", hints: ["Use tar with the extraction flags.", "Target toolkit.tar.gz.", "Try `tar -xvzf toolkit.tar.gz`."], explanation: "Extraction is what turns the downloaded package into something you can actually inspect.", accepts: [rawMatch(/^tar\s+-xvzf\s+toolkit\.tar\.gz$/i), rawMatch(/^tar\s+-xzvf\s+toolkit\.tar\.gz$/i)] })
      ]
    })
  ];

  const generatedNetworkScenarios = [
    linuxScenario({
      id: "web-lab-check",
      title: "Web Lab Check",
      category: "Networking basics",
      level: "Intermediate",
      objective: "Verify reachability to the web lab, check HTTPS, and identify the web service version.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Check whether 192.168.56.10 is reachable.", hints: ["Start with ICMP reachability.", "Ping the web-lab host.", "Try `ping 192.168.56.10`."], explanation: "Reachability checks come before service work so you know the host is actually there.", accepts: [rawMatch(/^ping\s+192\.168\.56\.10$/i)] }),
        step({ objective: "Check only port 443 on the host.", hints: ["Focus on HTTPS only.", "Use Nmap with port 443.", "Try `nmap -p 443 192.168.56.10`."], explanation: "A focused port check is the fastest path when you care about one service.", accepts: [rawMatch(/^nmap\s+-p\s+443\s+192\.168\.56\.10$/i), rawMatch(/^nmap\s+-sV\s+-p\s+443\s+192\.168\.56\.10$/i, { advanceBy: 2, feedback: "You checked the HTTPS port and already collected the version evidence." }), rawMatch(/^nmap\s+-p\s+443\s+-sV\s+192\.168\.56\.10$/i, { advanceBy: 2, feedback: "You checked the HTTPS port and already collected the version evidence." })] }),
        step({ objective: "Identify the version of the HTTPS service.", hints: ["Now move from open-port state to service evidence.", "Use version detection on port 443.", "Try `nmap -sV -p 443 192.168.56.10`."], explanation: "Version evidence is what turns an open web port into something you can actually analyze.", accepts: [rawMatch(/^nmap\s+-sV\s+-p\s+443\s+192\.168\.56\.10$/i), rawMatch(/^nmap\s+-p\s+443\s+-sV\s+192\.168\.56\.10$/i)] })
      ]
    }),
    linuxScenario({
      id: "fileserver-check",
      title: "File Server Exposure Check",
      category: "Networking basics",
      level: "Intermediate",
      objective: "Verify the file server is up, check SMB, and identify the SMB service version.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Check whether 192.168.56.20 is reachable.", hints: ["Use a ping test first.", "Target 192.168.56.20.", "Try `ping 192.168.56.20`."], explanation: "Connectivity comes first because service work is pointless against a host that is not responding.", accepts: [rawMatch(/^ping\s+192\.168\.56\.20$/i)] }),
        step({ objective: "Check SMB on port 445.", hints: ["Focus on the SMB port only.", "Use Nmap with port 445.", "Try `nmap -p 445 192.168.56.20`."], explanation: "Targeting the exact SMB port keeps the task narrow and efficient.", accepts: [rawMatch(/^nmap\s+-p\s+445\s+192\.168\.56\.20$/i), rawMatch(/^nmap\s+-sV\s+-p\s+445\s+192\.168\.56\.20$/i, { advanceBy: 2, feedback: "You checked the SMB port and already collected the version evidence." }), rawMatch(/^nmap\s+-p\s+445\s+-sV\s+192\.168\.56\.20$/i, { advanceBy: 2, feedback: "You checked the SMB port and already collected the version evidence." })] }),
        step({ objective: "Identify the SMB service version.", hints: ["Use service version detection on port 445.", "Add -sV to the port scan.", "Try `nmap -sV -p 445 192.168.56.20`."], explanation: "Version detection on SMB is what turns a port state into something you can research or exploit responsibly.", accepts: [rawMatch(/^nmap\s+-sV\s+-p\s+445\s+192\.168\.56\.20$/i), rawMatch(/^nmap\s+-p\s+445\s+-sV\s+192\.168\.56\.20$/i)] })
      ]
    }),
    linuxScenario({
      id: "subnet-sweep-exclude-gateway",
      title: "Subnet Sweep with Gateway Exclusion",
      category: "Networking basics",
      level: "Intermediate",
      objective: "Sweep the subnet, exclude the gateway, and then narrow to the most common ports.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a subnet scan of 192.168.56.0/24.", hints: ["Point Nmap at the subnet CIDR.", "Start with the full range.", "Try `nmap 192.168.56.0/24`."], explanation: "A subnet scan is the right way to build the initial host picture across the segment.", accepts: [rawMatch(/^nmap\s+192\.168\.56\.0\/24$/i)] }),
        step({ objective: "Rerun the subnet scan and exclude the gateway 192.168.56.1.", hints: ["Use the exclusion option.", "Keep the same subnet and omit the gateway.", "Try `nmap 192.168.56.0/24 --exclude 192.168.56.1`."], explanation: "Excluding infrastructure keeps the sweep focused on the hosts you actually want to test.", accepts: [rawMatch(/^nmap\s+192\.168\.56\.0\/24\s+--exclude\s+192\.168\.56\.1$/i)] }),
        step({ objective: "Narrow to the top 20 common ports on that same subnet scope.", hints: ["Now use the top-ports option.", "Keep the subnet and exclusion in place.", "Try `nmap --top-ports 20 192.168.56.0/24 --exclude 192.168.56.1`."], explanation: "A top-ports pass is a practical second-stage sweep once the host set is known.", accepts: [rawMatch(/^nmap\s+--top-ports\s+20\s+192\.168\.56\.0\/24\s+--exclude\s+192\.168\.56\.1$/i)] })
      ]
    }),
    linuxScenario({
      id: "target-file-web-scan",
      title: "Target File Web Scan",
      category: "Networking basics",
      level: "Intermediate",
      objective: "Scan a host list from file, narrow to web ports, and then add version detection.",
      environment: {
        cwd: "/home/student",
        files: [{ path: "/home/student/targets.txt", content: "192.168.56.10\n192.168.56.102\n" }],
        targets: commonTargets()
      },
      steps: [
        step({ objective: "Read the target file once so you know what it contains.", hints: ["Inspect the file directly first.", "Open targets.txt.", "Try `cat targets.txt`."], explanation: "Reading the target list first confirms the host scope before you scan it.", accepts: [rawMatch(/^cat\s+targets\.txt$/i)] }),
        step({ objective: "Scan the targets from file on ports 80 and 443.", hints: ["Use the file-input flag and web ports.", "Keep the scan focused on 80 and 443.", "Try `nmap -iL targets.txt -p 80,443`."], explanation: "Loading targets from file and narrowing to web ports is the clean way to scale a focused web check.", accepts: [rawMatch(/^nmap\s+-iL\s+targets\.txt\s+-p\s+80,443$/i), rawMatch(/^nmap\s+-iL\s+targets\.txt\s+-p\s+80,443\s+-sV$/i, { advanceBy: 2, feedback: "You ran the file-based web scan and already collected version evidence." }), rawMatch(/^nmap\s+-iL\s+targets\.txt\s+-sV\s+-p\s+80,443$/i, { advanceBy: 2, feedback: "You ran the file-based web scan and already collected version evidence." })] }),
        step({ objective: "Add service version detection to the same file-based web scan.", hints: ["Keep the same scan scope and add -sV.", "Use the same host list and ports.", "Try `nmap -iL targets.txt -p 80,443 -sV`."], explanation: "Version detection is what makes the file-based web scan actionable instead of just enumerative.", accepts: [rawMatch(/^nmap\s+-iL\s+targets\.txt\s+-p\s+80,443\s+-sV$/i), rawMatch(/^nmap\s+-iL\s+targets\.txt\s+-sV\s+-p\s+80,443$/i)] })
      ]
    })
  ];

  const generatedNmapScenarios = [
    linuxScenario({
      id: "nmap-basics-host-check",
      title: "Nmap Basics Host Check",
      category: "Nmap scanning workflows",
      level: "Beginner",
      objective: "Confirm that a newly assigned target is alive before you spend time on deeper service scans.",
      allowedFlexibility: "A lightweight reachability check or a basic Nmap host scan is acceptable if it proves the target is responding.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Confirm that metasploitable2 (192.168.56.102) is responding.",
          context: "You have a target IP but no port evidence yet. Prove the host is alive before you move into service discovery.",
          hints: [
            "Before hunting services, confirm the host is answering at all.",
            "Start with a lightweight scan rather than a full sweep.",
            "Use a basic scan or reachability check against metasploitable2."
          ],
          explanation: "The right first move is to prove the host is actually there. That keeps the rest of the workflow grounded in evidence instead of assumption.",
          whyThisMatters: "Host confirmation prevents wasted scanning against the wrong or offline target.",
          successFeedback: "You confirmed the target is responding.",
          accepts: [
            rawMatch(/^nmap\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+metasploitable2$/i),
            rawMatch(/^nmap\s+target$/i),
            rawMatch(/^ping\s+192\.168\.56\.102$/i),
            rawMatch(/^ping\s+metasploitable2$/i),
            rawMatch(/^ping\s+target$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nmap-basics-web-hypothesis",
      title: "Nmap Basics Web Hypothesis",
      category: "Nmap scanning workflows",
      level: "Beginner",
      objective: "Test a web-service hypothesis quickly without defaulting to a broad scan.",
      allowedFlexibility: "A focused web-port check is the goal. Adding version detection is acceptable if you still stay on the likely port.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Check whether web-lab (192.168.56.10) is offering HTTP on port 80.",
          context: "A teammate suspects the target is serving HTTP. Validate that idea directly instead of scanning unrelated ports first.",
          hints: [
            "You already have a likely service in mind.",
            "A narrow scan is faster than checking the usual port set.",
            "Specify the likely web port directly in the scan."
          ],
          explanation: "When the service hypothesis is already narrow, a focused port check is the cleanest way to validate it.",
          whyThisMatters: "Operators narrow scope on purpose when they already have a credible lead.",
          successFeedback: "You tested the web-service hypothesis directly.",
          accepts: [
            rawMatch(/^nmap\s+-p\s+80\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-p\s+80\s+web-lab$/i),
            rawMatch(/^nmap\s+-p\s+80\s+web$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+web-lab$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+web-lab$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+web$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+web$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nmap-basics-full-range",
      title: "Nmap Basics Full Range Decision",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Escalate to a full-range scan when the default scan is too narrow for the task.",
      allowedFlexibility: "Any full TCP range scan is acceptable. Faster timing is fine if the command still clearly expands coverage to all ports.",
      environment: {
        cwd: "/home/student",
        targets: [
          ...commonTargets(),
          {
            ip: "192.168.56.30",
            hostname: "custom-app",
            aliases: ["staging-app", "target"],
            reachable: true,
            os: "Ubuntu Linux",
            ports: [
              { port: 8088, proto: "tcp", service: "http-alt", version: "gunicorn 20.1.0", banner: "HTTP/1.1 200 OK" }
            ]
          }
        ]
      },
      steps: [
        step({
          objective: "Run a full TCP port scan against custom-app (192.168.56.30).",
          context: "A basic scan did not show the expected service. The target may be listening on a non-standard port, so you need to expand coverage instead of guessing.",
          hints: [
            "The problem is scope, not just speed.",
            "You need more than Nmap's default port selection.",
            "Use the option that checks the full TCP range."
          ],
          explanation: "When the default scan misses the expected service, the correct next move is to widen the search space to all TCP ports.",
          whyThisMatters: "Coverage decisions matter. A narrow scan can hide the very service you are trying to prove exists.",
          successFeedback: "You escalated to full-range coverage instead of guessing.",
          accepts: [
            rawMatch(/^nmap\s+-p-\s+192\.168\.56\.30$/i),
            rawMatch(/^nmap\s+-p-\s+custom-app$/i),
            rawMatch(/^nmap\s+-p-\s+staging-app$/i),
            rawMatch(/^nmap\s+-p-\s+target$/i),
            rawMatch(/^nmap\s+-T4\s+-p-\s+192\.168\.56\.30$/i),
            rawMatch(/^nmap\s+-T4\s+-p-\s+custom-app$/i),
            rawMatch(/^nmap\s+-T4\s+-p-\s+staging-app$/i),
            rawMatch(/^nmap\s+-T4\s+-p-\s+target$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nmap-basics-fast-triage",
      title: "Nmap Basics Fast Triage",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Use a faster timing profile appropriately on a stable internal lab host.",
      allowedFlexibility: "Any Nmap command that clearly applies the T4 timing template to the target is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Apply a faster timing profile while scanning metasploitable2 (192.168.56.102).",
          context: "This is a controlled internal lab target, so a faster timing profile is reasonable. The goal is to tune the scan pace, not change the host.",
          hints: [
            "This is about tuning scan pace, not changing what gets scanned.",
            "Nmap has timing templates for faster or slower behavior.",
            "Use the common lab-friendly timing option that speeds up the scan."
          ],
          explanation: "Timing templates are for tuning scan pace to the environment. In a stable lab, a faster template is often appropriate.",
          whyThisMatters: "Operators adapt scan speed to the environment instead of treating every target the same way.",
          successFeedback: "You applied a faster timing profile appropriately.",
          accepts: [
            rawMatch(/^nmap\s+-T4\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-T4\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-T4\s+target$/i),
            rawMatch(/^nmap\s+-T4\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-T4\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-T4\s+-sV\s+target$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nmap-basics-save-output",
      title: "Nmap Basics Save Output",
      category: "Nmap scanning workflows",
      level: "Beginner",
      objective: "Preserve scan evidence in a readable file instead of relying on terminal scrollback.",
      allowedFlexibility: "Any normal-text Nmap output command that writes to scan.txt for the correct target is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Save a readable Nmap scan of metasploitable2 (192.168.56.102) to scan.txt.",
          context: "You want an artifact you can review later, so write the scan output directly to a normal text file while you scan.",
          hints: [
            "Think about preserving evidence, not changing the scan target.",
            "Nmap can write output in several formats.",
            "Use the normal-text output option and name the file scan.txt."
          ],
          explanation: "Saving a scan to normal text keeps the evidence readable and easy to reference in later tasks.",
          whyThisMatters: "Saved output turns one-off terminal output into reusable evidence.",
          successFeedback: "You preserved the scan output in a readable file.",
          accepts: [
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+target$/i),
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+-sV\s+192\.168\.56\.102$/i),
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+-sV\s+metasploitable2$/i),
            rawMatch(/^nmap\s+-oN\s+scan\.txt\s+-sV\s+target$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nmap-basics-read-and-follow-up",
      title: "Nmap Basics Read and Follow Up",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Read Nmap output, separate meaningful open services from filtered results, and choose a focused follow-up.",
      allowedFlexibility: "Reading the saved output first is required. For the follow-up, a focused scan of the open web port is acceptable with or without version detection.",
      environment: {
        cwd: "/home/student",
        files: [{
          path: "/home/student/scan.txt",
          content: "Nmap scan report for 192.168.56.10\n80/tcp open http\n443/tcp filtered https\n"
        }],
        targets: commonTargets()
      },
      steps: [
        step({
          objective: "Read the saved scan output first.",
          context: "You already have scan evidence in scan.txt. Read it before you decide which service deserves the next action.",
          hints: [
            "Do not rescan blindly before you look at the evidence you already have.",
            "Open the saved report first.",
            "Try `cat scan.txt`."
          ],
          explanation: "The disciplined move is to read the evidence first so the next action is driven by output instead of habit.",
          whyThisMatters: "Operators build the next step from evidence already collected, not from guesswork.",
          successFeedback: "You reviewed the saved scan evidence.",
          accepts: [rawMatch(/^cat\s+scan\.txt$/i)]
        }),
        step({
          objective: "Follow up on the confirmed open web service, not the filtered one.",
          context: "The saved output shows port 80 open and port 443 filtered on web-lab at 192.168.56.10. Focus the next check on the service that actually answered.",
          hints: [
            "Not every listed port deserves the same attention.",
            "Focus on services that truly responded, not uncertain blocked paths.",
            "Treat the open service as the next lead and avoid chasing the filtered one first."
          ],
          explanation: "An open service is actionable evidence. A filtered result tells you the path is constrained, not that the service is ready for immediate follow-up.",
          whyThisMatters: "Good operators prioritize live evidence before they burn time on ambiguous results.",
          successFeedback: "You chose the meaningful follow-up based on the scan output.",
          accepts: [
            rawMatch(/^nmap\s+-p\s+80\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-p\s+80\s+web-lab$/i),
            rawMatch(/^nmap\s+-p\s+80\s+web$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.10$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+web-lab$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+web-lab$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80\s+web$/i),
            rawMatch(/^nmap\s+-p\s+80\s+-sV\s+web$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "top-ports-triage",
      title: "Top Ports Triage",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Start with a top-ports sweep against metasploitable2 (192.168.56.102), then narrow into service versioning on the interesting target.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a top-ports scan against the target.", context: "This triage run is against metasploitable2 at 192.168.56.102. Start broad, but still keep the scan bounded to common ports.", hints: ["Use the top-ports option with a small count.", "Scan the most common ports first.", "Try `nmap --top-ports 20 metasploitable2` or `nmap --top-ports 20 192.168.56.102`."], explanation: "A top-ports sweep is a fast way to triage the exposed surface before deeper work.", accepts: [rawMatch(/^nmap\s+--top-ports\s+20\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+--top-ports\s+20\s+metasploitable2$/i), rawMatch(/^nmap\s+--top-ports\s+20\s+target$/i)] }),
        step({ objective: "Focus on the web service once the quick sweep is done.", context: "Stay on metasploitable2 and narrow the follow-up to the web port only.", hints: ["Now check port 80 directly.", "Use the single web port scan.", "Try `nmap -p 80 metasploitable2` or `nmap -p 80 192.168.56.102`."], explanation: "A focused follow-up after a top-ports sweep is how you turn broad discovery into targeted evidence.", accepts: [rawMatch(/^nmap\s+-p\s+80\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-p\s+80\s+metasploitable2$/i), rawMatch(/^nmap\s+-p\s+80\s+target$/i), rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." }), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.102$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." }), rawMatch(/^nmap\s+-sV\s+-p\s+80\s+metasploitable2$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." }), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+metasploitable2$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." }), rawMatch(/^nmap\s+-sV\s+-p\s+80\s+target$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." }), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+target$/i, { advanceBy: 2, feedback: "You focused the web port and already pulled the service version." })] }),
        step({ objective: "Identify the web service version.", context: "Use service version detection against the same web port on metasploitable2 so the open port becomes actionable evidence.", hints: ["Add service version detection.", "Use -sV with port 80.", "Try `nmap -sV -p 80 metasploitable2` or `nmap -sV -p 80 192.168.56.102`."], explanation: "The version check is what makes the web finding useful for real follow-up decisions.", accepts: [rawMatch(/^nmap\s+-sV\s+-p\s+80\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-sV\s+-p\s+80\s+metasploitable2$/i), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+metasploitable2$/i), rawMatch(/^nmap\s+-sV\s+-p\s+80\s+target$/i), rawMatch(/^nmap\s+-p\s+80\s+-sV\s+target$/i)] })
      ]
    }),
    linuxScenario({
      id: "xml-report-generation",
      title: "XML Report Generation",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Run a version scan of metasploitable2 (192.168.56.102) and preserve the result in XML for tooling.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a version scan of the target.", context: "The report target here is metasploitable2 at 192.168.56.102. Start by collecting service evidence before you choose the output format.", hints: ["Start with a full service version pass.", "Use Nmap -sV against the target.", "Try `nmap -sV metasploitable2` or `nmap -sV 192.168.56.102`."], explanation: "Version scanning produces the service evidence you want to preserve in a structured report.", accepts: [rawMatch(/^nmap\s+-sV\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-sV\s+metasploitable2$/i), rawMatch(/^nmap\s+-sV\s+target$/i)] }),
        step({ objective: "Save a scan to XML output.", context: "Keep the same target, metasploitable2, and write the XML report directly to disk for later tooling.", hints: ["Use the XML output flag and a filename.", "Write the report to scan.xml.", "Try `nmap -oX scan.xml metasploitable2` or `nmap -oX scan.xml 192.168.56.102`."], explanation: "XML output is useful when another tool or parser will consume the scan results.", accepts: [rawMatch(/^nmap\s+-oX\s+scan\.xml\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-oX\s+scan\.xml\s+metasploitable2$/i), rawMatch(/^nmap\s+-oX\s+scan\.xml\s+target$/i)] }),
        step({ objective: "List the directory to confirm the XML file exists.", hints: ["Verify the report file is there.", "Use ls.", "Try `ls`."], explanation: "Checking the report file is part of preserving evidence instead of assuming the output was written.", accepts: [commandMatch("ls")] })
      ]
    }),
    linuxScenario({
      id: "all-output-generation",
      title: "All Output Generation",
      category: "Nmap scanning workflows",
      level: "Intermediate",
      objective: "Run a subnet scan and save all standard Nmap output families with one base name.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a subnet scan first.", hints: ["Start with the subnet CIDR.", "Use Nmap on 192.168.56.0/24.", "Try `nmap 192.168.56.0/24`."], explanation: "The subnet scan establishes the host scope before you decide how to preserve reporting output.", accepts: [rawMatch(/^nmap\s+192\.168\.56\.0\/24$/i)] }),
        step({ objective: "Save the scan in all standard output formats.", hints: ["Use the all-output flag with a base name.", "Write to corp-scan.", "Try `nmap -oA corp-scan 192.168.56.0/24`."], explanation: "The all-output option is the cleanest way to preserve several Nmap output families from one run.", accepts: [rawMatch(/^nmap\s+-oA\s+corp-scan\s+192\.168\.56\.0\/24$/i)] }),
        step({ objective: "List the directory to confirm the report set exists.", hints: ["Now verify the output files were written.", "Use ls.", "Try `ls`."], explanation: "Verifying the generated files confirms the report set is ready for review or tooling.", accepts: [commandMatch("ls")] })
      ]
    }),
    linuxScenario({
      id: "udp-services-check",
      title: "UDP Services Check",
      category: "Nmap scanning workflows",
      level: "Advanced",
      objective: "Check DNS and SNMP on metasploitable2 (192.168.56.102) with targeted UDP scans instead of jumping straight into exploitation.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a general host scan first.", context: "This UDP workflow is against metasploitable2 at 192.168.56.102. Start broad so you have host context before you focus on UDP services.", hints: ["Do not assume which services matter yet.", "Start with a basic Nmap scan.", "Try `nmap metasploitable2` or `nmap 192.168.56.102`."], explanation: "A general scan still provides the broad context before you decide to focus on UDP services.", accepts: [rawMatch(/^nmap\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+metasploitable2$/i), rawMatch(/^nmap\s+target$/i)] }),
        step({ objective: "Target UDP 53 directly.", context: "Stay on metasploitable2 and check only DNS first so the UDP evidence stays narrow.", hints: ["Use the UDP scan type on port 53.", "Check the DNS service.", "Try `nmap -sU -p 53 metasploitable2` or `nmap -sU -p 53 192.168.56.102`."], explanation: "Targeted UDP service checks are the practical way to confirm DNS without broad UDP noise.", accepts: [rawMatch(/^nmap\s+-sU\s+-p\s+53\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-sU\s+-p\s+53\s+metasploitable2$/i), rawMatch(/^nmap\s+-sU\s+-p\s+53\s+target$/i)] }),
        step({ objective: "Expand the UDP check to 53 and 161.", context: "Keep the same target, metasploitable2, and expand the UDP evidence to include SNMP.", hints: ["Add the SNMP port too.", "Use a comma-separated port list.", "Try `nmap -sU -p 53,161 metasploitable2` or `nmap -sU -p 53,161 192.168.56.102`."], explanation: "Adding SNMP is a normal next step when you want the likely UDP services in one focused pass.", accepts: [rawMatch(/^nmap\s+-sU\s+-p\s+53,161\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-sU\s+-p\s+53,161\s+metasploitable2$/i), rawMatch(/^nmap\s+-sU\s+-p\s+53,161\s+target$/i)] })
      ]
    })
  ];

  const generatedNetcatScenarios = [
    linuxScenario({
      id: "nc-basics-smtp-banner-check",
      title: "Netcat SMTP Banner Check",
      category: "Netcat workflows",
      level: "Beginner",
      objective: "Reach a known remote service and confirm it answers on the expected port.",
      allowedFlexibility: "Any direct Netcat client connection to the correct SMTP host and port is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Connect to the SMTP service on metasploitable2 (192.168.56.102).",
          context: "You only need to prove that the mail service answers on its expected port. This is a client connection to a known remote service.",
          hints: [
            "This is an outbound connection, not a local waiting task.",
            "Mail services usually speak first once you reach the right port.",
            "Use Netcat as a client against metasploitable2 on SMTP."
          ],
          explanation: "When you already know the service port, the cleanest proof is a direct socket connection that returns the service banner.",
          whyThisMatters: "Operators use raw socket checks to validate whether a service is truly reachable before doing anything deeper.",
          successFeedback: "You connected to the remote SMTP service correctly.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+25$/i),
            rawMatch(/^nc\s+-nv\s+metasploitable2\s+25$/i),
            rawMatch(/^nc\s+-nv\s+target\s+25$/i),
            rawMatch(/^nc\s+192\.168\.56\.102\s+25$/i),
            rawMatch(/^nc\s+metasploitable2\s+25$/i),
            rawMatch(/^nc\s+target\s+25$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-web-port-check",
      title: "Netcat Web Port Check",
      category: "Netcat workflows",
      level: "Beginner",
      objective: "Test whether a likely web service is reachable without setting up any listener locally.",
      allowedFlexibility: "Any direct client connection to the correct web host and port is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Test whether web-lab (192.168.56.10) is accepting connections on port 80.",
          context: "A teammate suspects HTTP is running. Validate the web port directly instead of using a local listener or an unrelated port.",
          hints: [
            "You are testing a remote service, not waiting for a callback.",
            "This is a single outbound socket to the likely web port.",
            "Connect to web-lab on port 80."
          ],
          explanation: "A direct client connection is the fastest way to confirm whether the suspected web port is actually accepting sessions.",
          whyThisMatters: "Connection logic starts with role clarity: if the service is remote, you connect to it.",
          successFeedback: "You tested the remote web port correctly.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.10\s+80$/i),
            rawMatch(/^nc\s+-nv\s+web-lab\s+80$/i),
            rawMatch(/^nc\s+-nv\s+web\s+80$/i),
            rawMatch(/^nc\s+192\.168\.56\.10\s+80$/i),
            rawMatch(/^nc\s+web-lab\s+80$/i),
            rawMatch(/^nc\s+web\s+80$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-listener-callback",
      title: "Netcat Callback Listener",
      category: "Netcat workflows",
      level: "Beginner",
      objective: "Prepare your system to receive an inbound callback on a known port.",
      allowedFlexibility: "Any valid Netcat listener on the correct port is acceptable.",
      environment: { cwd: "/home/student" },
      steps: [
        step({
          objective: "Start a local listener on TCP 4444 before the remote side calls back.",
          context: "The remote system will initiate the connection to you. Your side must already be waiting on the chosen port.",
          hints: [
            "The remote side is the initiator here.",
            "If you are waiting for a callback, your socket must already be open.",
            "Use Netcat in listen mode on port 4444."
          ],
          explanation: "A callback only lands if the receiving side is already listening. That is the critical role decision in this workflow.",
          whyThisMatters: "Knowing who listens versus who connects is the core Netcat skill.",
          successFeedback: "You prepared the local callback listener.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+4444$/i),
            rawMatch(/^nc\s+-lvp\s+4444$/i),
            listenerPortMatch(4444, { command: "nc" })
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-file-receiver",
      title: "Netcat File Receiver",
      category: "Netcat workflows",
      level: "Beginner",
      objective: "Prepare the receiving side of a file transfer and write incoming data straight to disk.",
      allowedFlexibility: "A valid listener on the correct port with output redirected to the target file is required.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({
          objective: "Set up the receiving side on port 9001 so incoming data is saved to loot.txt.",
          context: "Your machine is receiving the file. The receiver should wait first and direct the incoming bytes into a local file.",
          hints: [
            "The receiver should wait; the sender should connect.",
            "You need both a listening socket and output redirection.",
            "Listen on port 9001 and redirect the stream into loot.txt."
          ],
          explanation: "For a one-way transfer, the receiving host takes the listener role and writes the incoming stream to disk.",
          whyThisMatters: "File movement with Netcat depends on assigning the listener role to the destination side.",
          successFeedback: "You prepared the file receiver correctly.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+9001\s*>\s*loot\.txt$/i),
            rawMatch(/^nc\s+-lvp\s+9001\s*>\s*loot\.txt$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-file-sender",
      title: "Netcat File Sender",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Send a local file to a host that is already waiting to receive it.",
      allowedFlexibility: "Any valid outbound Netcat connection to the waiting host and port that feeds the local file into the socket is acceptable.",
      environment: {
        cwd: "/home/student",
        files: [{ path: "/home/student/notes.txt", content: "operator notes\n" }],
        targets: [
          ...commonTargets(),
          {
            ip: "192.168.56.50",
            hostname: "receiver-lab",
            aliases: ["receiver", "dropbox"],
            reachable: true,
            os: "Ubuntu Linux",
            ports: [{ port: 9001, proto: "tcp", service: "nc-listener", version: "waiting receiver", banner: "" }]
          }
        ]
      },
      steps: [
        step({
          objective: "Send notes.txt to receiver-lab (192.168.56.50) on port 9001.",
          context: "The destination host is already listening. Your role is to connect to it and stream the local file across the socket.",
          hints: [
            "The sender is not the listener in this situation.",
            "You need an outbound connection plus input redirection from a local file.",
            "Connect to receiver-lab on port 9001 and feed notes.txt into the session."
          ],
          explanation: "When the receiver is already waiting, the sender becomes the client and pushes local file data into the outbound connection.",
          whyThisMatters: "Transfers work cleanly only when the sender and receiver roles are assigned correctly.",
          successFeedback: "You initiated the file transfer from the sending side.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.50\s+9001\s*<\s*notes\.txt$/i),
            rawMatch(/^nc\s+-nv\s+receiver-lab\s+9001\s*<\s*notes\.txt$/i),
            rawMatch(/^nc\s+-nv\s+receiver\s+9001\s*<\s*notes\.txt$/i),
            rawMatch(/^nc\s+192\.168\.56\.50\s+9001\s*<\s*notes\.txt$/i),
            rawMatch(/^nc\s+receiver-lab\s+9001\s*<\s*notes\.txt$/i),
            rawMatch(/^nc\s+receiver\s+9001\s*<\s*notes\.txt$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-port-correction",
      title: "Netcat Wrong Port Correction",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Correct a bad port assumption and connect to the real service port instead.",
      allowedFlexibility: "Any direct client connection to the correct SMTP port is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "After a failed guess at 2525, connect to the real SMTP service on metasploitable2.",
          context: "The host is still correct. The mistake was the port choice. Use the real mail-service port instead of repeating the bad guess.",
          hints: [
            "Host identity and port identity are different checks.",
            "A failed service connection does not always mean the host is wrong.",
            "Reconnect to metasploitable2 on the real SMTP port."
          ],
          explanation: "When the host is right but the port is wrong, the correct recovery is to adjust the service port, not abandon the target.",
          whyThisMatters: "Operators separate host problems from port problems instead of treating them as the same failure.",
          successFeedback: "You corrected the service port cleanly.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+25$/i),
            rawMatch(/^nc\s+-nv\s+metasploitable2\s+25$/i),
            rawMatch(/^nc\s+-nv\s+target\s+25$/i),
            rawMatch(/^nc\s+192\.168\.56\.102\s+25$/i),
            rawMatch(/^nc\s+metasploitable2\s+25$/i),
            rawMatch(/^nc\s+target\s+25$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-missing-listener-fix",
      title: "Netcat Missing Listener Fix",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Fix a stalled transfer by preparing the missing receiving socket first.",
      allowedFlexibility: "Any valid listener on the agreed port is acceptable.",
      environment: { cwd: "/home/student" },
      steps: [
        step({
          objective: "Start a local listener on port 7001 so the sender can retry.",
          context: "The sender already tried once and nothing landed because your side was not waiting yet. Fix the role problem before the next attempt.",
          hints: [
            "Netcat does not invent a receiver for you.",
            "One side must be ready before the other side can connect.",
            "Start a listener on the agreed local port before the sender retries."
          ],
          explanation: "If the receiving side is not listening first, the sending side has nowhere to connect and the transfer fails.",
          whyThisMatters: "Sequence matters with sockets: listening must exist before the client initiates.",
          successFeedback: "You corrected the missing-listener problem.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+7001$/i),
            rawMatch(/^nc\s+-lvp\s+7001$/i),
            listenerPortMatch(7001, { command: "nc" })
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-destination-listens",
      title: "Netcat Destination Listens",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Assign the listener role to the machine that must receive the file.",
      allowedFlexibility: "A valid receiving listener with output redirected to the intended file is required.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({
          objective: "Prepare this host to receive a report on port 9100 and save it as report.txt.",
          context: "Machine A has the file. This machine is the destination. The destination should wait and capture the incoming bytes locally.",
          hints: [
            "Think about where the data needs to end up.",
            "The host that must capture the bytes should be passive first.",
            "Listen on port 9100 and write the received stream into report.txt."
          ],
          explanation: "The receiving machine should be the listener in a one-way transfer because it is the endpoint that must capture the data.",
          whyThisMatters: "Connection role decisions become much easier once you think in terms of data destination.",
          successFeedback: "You assigned the listener role to the destination side.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+9100\s*>\s*report\.txt$/i),
            rawMatch(/^nc\s+-lvp\s+9100\s*>\s*report\.txt$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-both-sides-connect-fix",
      title: "Netcat Both Sides Connect Fix",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Resolve a failed exchange caused by both operators trying to initiate connections.",
      allowedFlexibility: "Any valid listener on the agreed port is acceptable.",
      environment: { cwd: "/home/student" },
      steps: [
        step({
          objective: "Switch your side into a waiting role on port 8800 so the other operator can connect.",
          context: "Nothing worked because both sides tried to connect out. One side has to stop initiating and open a listening socket instead.",
          hints: [
            "Connections need a server side and a client side.",
            "If both ends initiate, there may be no open listening socket.",
            "Open a local listener on the agreed port so the other operator can connect."
          ],
          explanation: "A socket exchange needs one passive side and one initiating side. Two clients do not create a complete session by themselves.",
          whyThisMatters: "Understanding why a connection fails is often more important than memorizing the syntax.",
          successFeedback: "You fixed the role mismatch by listening locally.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+8800$/i),
            rawMatch(/^nc\s+-lvp\s+8800$/i),
            listenerPortMatch(8800, { command: "nc" })
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-https-reachability",
      title: "Netcat HTTPS Socket Check",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Test whether an HTTPS service is accepting TCP connections even before you speak the full protocol.",
      allowedFlexibility: "Any direct client connection to the correct host and port is acceptable.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({
          objective: "Connect to web-lab (192.168.56.10) on port 443.",
          context: "You are only validating TCP acceptance on the HTTPS port. This is still a client-side connection to a remote service.",
          hints: [
            "This is a raw connectivity check to a secure web port.",
            "You do not need a local listener for this task.",
            "Connect directly to web-lab on port 443."
          ],
          explanation: "Even when the higher-level protocol is HTTPS, Netcat can still tell you whether the socket accepts the connection.",
          whyThisMatters: "Operators often separate transport reachability from full application-layer testing.",
          successFeedback: "You validated TCP reachability to the HTTPS port.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.10\s+443$/i),
            rawMatch(/^nc\s+-nv\s+web-lab\s+443$/i),
            rawMatch(/^nc\s+-nv\s+web\s+443$/i),
            rawMatch(/^nc\s+192\.168\.56\.10\s+443$/i),
            rawMatch(/^nc\s+web-lab\s+443$/i),
            rawMatch(/^nc\s+web\s+443$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-quiet-service-connect",
      title: "Netcat Quiet Service Connect",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Connect to a service that accepts the socket even if it does not print an immediate banner.",
      allowedFlexibility: "Any direct client connection to the correct host and port is acceptable.",
      environment: {
        cwd: "/home/student",
        targets: [
          ...commonTargets(),
          {
            ip: "192.168.56.60",
            hostname: "raw-app",
            aliases: ["raw", "quiet-service"],
            reachable: true,
            os: "Linux",
            ports: [{ port: 8088, proto: "tcp", service: "custom-app", version: "raw socket", banner: "" }]
          }
        ]
      },
      steps: [
        step({
          objective: "Connect to raw-app (192.168.56.60) on port 8088.",
          context: "This service may stay quiet after the connection opens. The absence of a banner does not mean the socket failed if the connection is held open.",
          hints: [
            "Silence does not always mean failure.",
            "Some protocols wait for the client to speak first.",
            "Open a direct Netcat connection to raw-app on port 8088."
          ],
          explanation: "Some services accept the socket but wait for client input before sending anything. That is still a successful connection.",
          whyThisMatters: "You need to distinguish a quiet open socket from a refused or unreachable service.",
          successFeedback: "You reached the quiet service correctly.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.60\s+8088$/i),
            rawMatch(/^nc\s+-nv\s+raw-app\s+8088$/i),
            rawMatch(/^nc\s+-nv\s+raw\s+8088$/i),
            rawMatch(/^nc\s+192\.168\.56\.60\s+8088$/i),
            rawMatch(/^nc\s+raw-app\s+8088$/i),
            rawMatch(/^nc\s+raw\s+8088$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-notes-intake",
      title: "Netcat Notes Intake",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Prepare a simple listener that captures plain-text notes from another operator.",
      allowedFlexibility: "A valid receiving listener with output redirected to notes.txt is required.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({
          objective: "Start a listener on port 7777 and save the incoming text as notes.txt.",
          context: "A teammate is about to send you a short note file. Your machine is the receiving endpoint and should write the data directly to disk.",
          hints: [
            "You are collecting, not sending.",
            "Combine a waiting socket with file output redirection.",
            "Listen on port 7777 and write the incoming stream into notes.txt."
          ],
          explanation: "A listener with output redirection is the cleanest way to receive a short text artifact from another host.",
          whyThisMatters: "Netcat becomes much easier when you think about byte direction first and syntax second.",
          successFeedback: "You prepared the notes intake listener.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+7777\s*>\s*notes\.txt$/i),
            rawMatch(/^nc\s+-lvp\s+7777\s*>\s*notes\.txt$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-notes-send",
      title: "Netcat Notes Send",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Send a local notes file to a remote host that is already listening.",
      allowedFlexibility: "Any valid outbound Netcat file-send command to the correct host and port is acceptable.",
      environment: {
        cwd: "/home/student",
        files: [{ path: "/home/student/status.txt", content: "status: ready\n" }],
        targets: [
          ...commonTargets(),
          {
            ip: "192.168.56.70",
            hostname: "ops-drop",
            aliases: ["ops", "drop"],
            reachable: true,
            os: "Linux",
            ports: [{ port: 7777, proto: "tcp", service: "nc-listener", version: "waiting receiver", banner: "" }]
          }
        ]
      },
      steps: [
        step({
          objective: "Send status.txt to ops-drop (192.168.56.70) on port 7777.",
          context: "The remote side is already waiting. Your task is to initiate the client connection and feed the local file into the socket.",
          hints: [
            "The receiver is already passive and waiting.",
            "Use an outbound connection plus input redirection from the local file.",
            "Connect to ops-drop on port 7777 and feed status.txt into the session."
          ],
          explanation: "When the far end is already listening, the correct role for your side is the sender client that streams the file outward.",
          whyThisMatters: "File transfers are clearer once you always ask which side is already waiting.",
          successFeedback: "You started the outbound file send correctly.",
          accepts: [
            rawMatch(/^nc\s+-nv\s+192\.168\.56\.70\s+7777\s*<\s*status\.txt$/i),
            rawMatch(/^nc\s+-nv\s+ops-drop\s+7777\s*<\s*status\.txt$/i),
            rawMatch(/^nc\s+-nv\s+ops\s+7777\s*<\s*status\.txt$/i),
            rawMatch(/^nc\s+192\.168\.56\.70\s+7777\s*<\s*status\.txt$/i),
            rawMatch(/^nc\s+ops-drop\s+7777\s*<\s*status\.txt$/i),
            rawMatch(/^nc\s+ops\s+7777\s*<\s*status\.txt$/i)
          ]
        })
      ]
    }),
    linuxScenario({
      id: "nc-basics-late-listener-recovery",
      title: "Netcat Late Listener Recovery",
      category: "Netcat workflows",
      level: "Advanced",
      objective: "Recover from a failed transfer where the listener was started too late.",
      allowedFlexibility: "Any valid listener on the agreed port is acceptable.",
      environment: { cwd: "/home/student" },
      steps: [
        step({
          objective: "Put your side into listen mode on port 5555 before the next retry.",
          context: "The earlier attempt failed because the sender already tried to connect before your machine was waiting. Fix the order before the retry.",
          hints: [
            "This is a sequencing problem, not just a syntax problem.",
            "The receiver must be ready before the client side reaches out.",
            "Start a listener on port 5555 before the retry happens."
          ],
          explanation: "Netcat exchanges are timing-sensitive. If the listener is not present first, the sender cannot complete the connection.",
          whyThisMatters: "Correct sequencing is part of operational discipline, not just command recall.",
          successFeedback: "You corrected the timing problem by listening first.",
          accepts: [
            rawMatch(/^nc\s+-lvnp\s+5555$/i),
            rawMatch(/^nc\s+-lvp\s+5555$/i),
            listenerPortMatch(5555, { command: "nc" })
          ]
        })
      ]
    }),
    linuxScenario({
      id: "smtp-full-mail-flow",
      title: "SMTP Full Mail Flow",
      category: "Netcat workflows",
      level: "Advanced",
      objective: "Connect to SMTP on metasploitable2 (192.168.56.102) and progress through sender, recipient, data, and session close.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Connect to SMTP on the target.", context: "The SMTP host for this workflow is metasploitable2 at 192.168.56.102. Open a raw TCP session to port 25.", hints: ["Use Netcat against port 25.", "Connect to the service directly.", "Try `nc -nv metasploitable2 25` or `nc -nv 192.168.56.102 25`."], explanation: "A raw TCP connection is what gives you manual protocol control over SMTP.", accepts: [rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+25$/i), rawMatch(/^nc\s+-nv\s+metasploitable2\s+25$/i), rawMatch(/^nc\s+-nv\s+target\s+25$/i)] }),
        step({ objective: "Start the session with EHLO.", context: "After the banner, identify your client with EHLO or HELO. The client label can be any sensible local name; `lab.local` is only an example.", hints: ["Use the SMTP greeting command.", "Identify your client first.", "Try `EHLO lab.local` or `HELO lab.local`."], explanation: "EHLO or HELO is the correct opening protocol verb after the service banner.", accepts: [rawMatch(/^(EHLO|HELO)\s+[A-Za-z0-9.-]+$/i)] }),
        step({ objective: "Set the sender address.", context: "Define the envelope sender with MAIL FROM. Any syntactically valid sender address is acceptable here.", hints: ["Use the sender verb.", "Define the sender before the recipient.", "Try `MAIL FROM:<kali@lab.local>`."], explanation: "The sender must be defined before you can address the message to a recipient.", accepts: [rawMatch(/^MAIL FROM:\s*<[^>\s]+@[^>\s]+>$/i)] }),
        step({ objective: "Set the recipient address.", context: "Now identify the destination mailbox with RCPT TO. Any syntactically valid recipient address is acceptable here.", hints: ["Use the recipient verb next.", "Name the target mailbox.", "Try `RCPT TO:<admin@lab.local>`."], explanation: "RCPT TO tells the SMTP service who the message is for.", accepts: [rawMatch(/^RCPT TO:\s*<[^>\s]+@[^>\s]+>$/i)] }),
        step({ objective: "Switch the session into message-body mode.", hints: ["Use the content-entry verb.", "This comes after the recipient.", "Try `DATA`."], explanation: "DATA is what tells the SMTP server to expect the message body next.", accepts: [rawMatch(/^DATA$/i)] }),
        step({ objective: "Close the session cleanly.", hints: ["End the conversation correctly.", "Use the SMTP exit verb.", "Try `QUIT`."], explanation: "QUIT closes the session cleanly instead of leaving the service waiting on the socket.", accepts: [rawMatch(/^QUIT$/i)] })
      ]
    }),
    linuxScenario({
      id: "netcat-file-receiver",
      title: "Netcat File Receiver",
      category: "Netcat workflows",
      level: "Intermediate",
      objective: "Prepare a listener that will receive a file and write it directly to disk.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({ objective: "Confirm your current location.", hints: ["Start with context.", "Use the working-directory command.", "Try `pwd`."], explanation: "Context comes first so you know where the received file will land.", accepts: [commandMatch("pwd")] }),
        step({ objective: "Start a file-receiving listener on port 9001.", hints: ["Use Netcat in listening mode and redirect output.", "The target file is loot.txt.", "Try `nc -lvnp 9001 > loot.txt`."], explanation: "A listening socket with output redirection is the cleanest way to receive and save a file stream.", accepts: [rawMatch(/^nc\s+-lvnp\s+9001\s*>\s*loot\.txt$/i)] }),
        step({ objective: "List the directory once the listener is ready.", hints: ["Check the workspace after the listener setup.", "Use ls.", "Try `ls`."], explanation: "A quick listing after setup confirms the workspace is still where you expect it to be.", accepts: [commandMatch("ls")] })
      ]
    }),
    linuxScenario({
      id: "bind-shell-connect",
      title: "Bind Shell Connect",
      category: "Netcat workflows",
      level: "Advanced",
      objective: "Treat the bind shell on metasploitable2 (192.168.56.102) as a remote listener and connect to it directly rather than preparing a callback receiver.",
      environment: {
        cwd: "/home/student",
        targets: [{
          ip: "192.168.56.102",
          hostname: "metasploitable2",
          aliases: ["target"],
          reachable: true,
          os: "Linux 2.6.x",
          ports: [{ port: 4444, proto: "tcp", service: "shell", version: "bind shell", banner: "sh-3.2$ ", shell: true }]
        }]
      },
      steps: [
        step({ objective: "Check that the host is reachable before you try the shell port.", context: "The bind shell host here is metasploitable2 at 192.168.56.102. Verify it is up before you try the shell port.", hints: ["A quick connectivity check still matters.", "Ping the host first.", "Try `ping metasploitable2` or `ping 192.168.56.102`."], explanation: "Even when you expect a shell, confirming the host is reachable is still good operating discipline.", accepts: [rawMatch(/^ping\s+192\.168\.56\.102$/i), rawMatch(/^ping\s+metasploitable2$/i), rawMatch(/^ping\s+target$/i)] }),
        step({ objective: "Connect to the bind shell on TCP 4444.", context: "This is a direct outbound connection to metasploitable2, not a local listener setup.", hints: ["This is a direct outbound connection, not a local listener.", "Use Netcat against 4444.", "Try `nc -nv metasploitable2 4444` or `nc -nv 192.168.56.102 4444`."], explanation: "A bind shell means the target is already listening. Your job is to connect to it.", accepts: [rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+4444$/i), rawMatch(/^nc\s+-nv\s+metasploitable2\s+4444$/i), rawMatch(/^nc\s+-nv\s+target\s+4444$/i)] }),
        step({ objective: "Exit the shell session cleanly.", hints: ["Close the active session instead of abandoning it.", "Use the standard exit command.", "Try `exit`."], explanation: "Exiting the session cleanly keeps the workflow controlled and predictable.", accepts: [rawMatch(/^exit$/i)] })
      ]
    })
  ];

  const generatedPythonScenarios = [
    linuxScenario({
      id: "python-runner-check",
      title: "Python Runner Check",
      category: "Python/script workflows",
      level: "Intermediate",
      objective: "Inspect the script directory and run the health-check script from the right location.",
      environment: {
        cwd: "/home/student/scripts",
        directories: ["/home/student/scripts/health"],
        files: [
          { path: "/home/student/scripts/health/README.txt", content: "Run healthcheck.py after reviewing this folder.\n" },
          { path: "/home/student/scripts/health/healthcheck.py", content: "print('healthy')\n", executable: true }
        ]
      },
      steps: [
        step({ objective: "Move into the health script directory.", hints: ["The folder is named health.", "Change into that folder.", "Try `cd health`."], explanation: "Entering the script folder first keeps the run command and artifact review in the right place.", accepts: [cwdMatch("/home/student/scripts/health")] }),
        step({ objective: "Read the README file.", hints: ["Inspect the instructions first.", "Open README.txt.", "Try `cat README.txt`."], explanation: "Reading the local note first is part of disciplined script handling instead of blindly executing files.", accepts: [rawMatch(/^cat\s+README\.txt$/i)] }),
        step({ objective: "Run the Python health-check script.", hints: ["Use the Python interpreter against the local file.", "Run healthcheck.py from the current directory.", "Try `python ./healthcheck.py`."], explanation: "Executing the script from the correct directory is the final step once you have confirmed the context and file name.", accepts: [rawMatch(/^python\s+\.\/healthcheck\.py$/i), rawMatch(/^python\s+healthcheck\.py$/i)] })
      ]
    }),
    linuxScenario({
      id: "python-helper-run",
      title: "Python Helper Run",
      category: "Python/script workflows",
      level: "Intermediate",
      objective: "Move into the helper project, inspect the script, and run it with Python.",
      environment: {
        cwd: "/home/student/projects",
        directories: ["/home/student/projects/helpers"],
        files: [
          { path: "/home/student/projects/helpers/helper.py", content: "print('helper ready')\n", executable: true }
        ]
      },
      steps: [
        step({ objective: "Change into the helpers directory.", hints: ["The project folder is named helpers.", "Move into it.", "Try `cd helpers`."], explanation: "Entering the script folder is the cleanest way to keep later commands simple and correct.", accepts: [cwdMatch("/home/student/projects/helpers")] }),
        step({ objective: "Read the helper script.", hints: ["Open the Python file first.", "Read helper.py.", "Try `cat helper.py`."], explanation: "A quick script read gives you confidence about what you are about to run.", accepts: [rawMatch(/^cat\s+helper\.py$/i)] }),
        step({ objective: "Run the helper script with Python.", hints: ["Use the Python interpreter on helper.py.", "Run the local script directly.", "Try `python ./helper.py`."], explanation: "The Python interpreter executes the script from the current directory and is the right final step once context is confirmed.", accepts: [rawMatch(/^python\s+\.\/helper\.py$/i), rawMatch(/^python\s+helper\.py$/i)] })
      ]
    }),
    linuxScenario({
      id: "python-setup-and-run",
      title: "Python Setup and Run",
      category: "Python/script workflows",
      level: "Intermediate",
      objective: "Create a new script folder, build the empty runner file, and execute the prepared script.",
      environment: {
        cwd: "/home/student/scripts",
        files: [{ path: "/home/student/scripts/runner.py", content: "print('runner active')\n", executable: true }]
      },
      steps: [
        step({ objective: "Create a directory named staging.", hints: ["Start with a clean folder.", "Use mkdir on staging.", "Try `mkdir staging`."], explanation: "Creating a new workspace first is the cleanest way to separate fresh work from existing scripts.", accepts: [fileExistsMatch("/home/student/scripts/staging", { command: "mkdir" })] }),
        step({ objective: "Move into the staging directory.", hints: ["Work from the new folder.", "Change into staging.", "Try `cd staging`."], explanation: "Moving into the working folder keeps the next file creation in the right place.", accepts: [cwdMatch("/home/student/scripts/staging")] }),
        step({ objective: "Create an empty file named runner.py in the staging directory.", hints: ["You only need an empty placeholder.", "Use touch on runner.py.", "Try `touch runner.py`."], explanation: "touch creates the placeholder file that marks the new workspace as ready for scripting.", accepts: [fileExistsMatch("/home/student/scripts/staging/runner.py", { command: "touch" })] }),
        step({ objective: "Run the prepared runner script from the parent scripts directory.", hints: ["Use Python against the existing runner.py.", "The executable script is one level up.", "Try `python ../runner.py`."], explanation: "Running the prepared script after staging work is a common way to verify you can move between related script workspaces.", accepts: [rawMatch(/^python\s+\.\.\/runner\.py$/i)] })
      ]
    })
  ];

  const generatedProxyScenarios = [
    proxyScenario({
      id: "proxy-login-capture-review",
      title: "Proxy Login Capture Review",
      level: "Beginner",
      objective: "Inspect a captured login exchange and isolate the request that actually submits credentials.",
      environment: {
        cwd: "/home/student/proxy-lab/login",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/login"],
        files: [
          { path: "/home/student/proxy-lab/login/GET-login.txt", content: "GET /login HTTP/1.1\nHost: app.lab\nUser-Agent: Browser\n" },
          { path: "/home/student/proxy-lab/login/POST-login.txt", content: "POST /session HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nusername=alice&password=Winter2025!\n" },
          { path: "/home/student/proxy-lab/login/telemetry.txt", content: "POST /metrics HTTP/1.1\nHost: app.lab\nContent-Length: 12\n\nbeacon=login\n" }
        ]
      },
      steps: [
        step({ objective: "List the intercepted traffic files so you can identify the state-changing request.", hints: ["Start by triaging the capture set.", "List the files in the current workspace.", "Try `ls`."], explanation: "A directory listing helps you separate likely login traffic from surrounding noise before you open anything.", whyThisMatters: "Application testing starts with choosing the right request, not editing random traffic.", successFeedback: "You enumerated the captured request artifacts.", accepts: [commandMatch("ls")] }),
        step({ objective: "Read the request that actually submits the login.", hints: ["The state-changing login request is not the page load.", "Open the POST capture rather than the GET page fetch.", "Try `cat POST-login.txt`."], explanation: "The credential-bearing request is the one worth studying because it actually changes application state.", whyThisMatters: "In interception work, finding the meaningful request comes before manipulating it.", successFeedback: "You isolated the login submission request.", accepts: [rawMatch(/^cat\s+POST-login\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-username-field-hunt",
      title: "Proxy Username Field Hunt",
      level: "Beginner",
      objective: "Locate the username-bearing field inside a captured login request.",
      environment: {
        cwd: "/home/student/proxy-lab/fields",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/fields"],
        files: [
          { path: "/home/student/proxy-lab/fields/login-submit.txt", content: "POST /session HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nusername=alice&password=Winter2025!&remember=false\n" }
        ]
      },
      steps: [
        step({ objective: "Read the captured login request once.", hints: ["Start with the full request.", "Open login-submit.txt directly.", "Try `cat login-submit.txt`."], explanation: "A first read shows which part of the request carries actual application input.", whyThisMatters: "Headers and bodies play different roles. You need to see the whole request before you isolate one field.", successFeedback: "You reviewed the full request.", accepts: [rawMatch(/^cat\s+login-submit\.txt$/i)] }),
        step({ objective: "Filter the request down to the username-bearing line.", hints: ["You want the field that matches the account identifier.", "Use grep on the username key.", "Try `grep username= login-submit.txt`."], explanation: "Filtering the request isolates the specific application input you are about to reason about.", whyThisMatters: "Application-layer testing depends on finding which field the server is likely to trust or process.", successFeedback: "You isolated the username field.", accepts: [rawMatch(/^grep\s+username=\s+login-submit\.txt$/i), rawMatch(/^cat\s+login-submit\.txt\s*\|\s*grep\s+username=$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-numeric-id-review",
      title: "Proxy Numeric ID Review",
      level: "Beginner",
      objective: "Inspect a request that selects a record by numeric identifier and then review the replayed response.",
      environment: {
        cwd: "/home/student/proxy-lab/id-review",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/id-review"],
        files: [
          { path: "/home/student/proxy-lab/id-review/profile-request.txt", content: "GET /api/profile?id=104 HTTP/1.1\nHost: app.lab\nAccept: application/json\n" },
          { path: "/home/student/proxy-lab/id-review/replayed-response.txt", content: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"id\":105,\"user\":\"bob\",\"email\":\"bob@app.lab\"}\n" }
        ]
      },
      steps: [
        step({ objective: "Filter the request down to the selector parameter.", hints: ["The interesting input chooses which record is returned.", "Use grep on the id parameter.", "Try `grep id= profile-request.txt`."], explanation: "A selector parameter is often the first thing to inspect when the response content changes scope.", whyThisMatters: "Record-selection parameters are common application-layer decision points.", successFeedback: "You identified the record selector.", accepts: [rawMatch(/^grep\s+id=\s+profile-request\.txt$/i), rawMatch(/^cat\s+profile-request\.txt\s*\|\s*grep\s+id=$/i)] }),
        step({ objective: "Read the replayed response to see what changed after the request was altered.", hints: ["Now inspect the returned object, not the request.", "Open the replayed response file.", "Try `cat replayed-response.txt`."], explanation: "The response tells you whether the modified request changed the application’s returned data.", whyThisMatters: "Request manipulation only matters if you can tie it to a response difference.", successFeedback: "You reviewed the replayed response.", accepts: [rawMatch(/^cat\s+replayed-response\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-body-vs-query-review",
      title: "Proxy Body vs Query Review",
      level: "Intermediate",
      objective: "Distinguish a URL selector from a body field in a mixed request and focus on the submitted input.",
      environment: {
        cwd: "/home/student/proxy-lab/orders",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/orders"],
        files: [
          { path: "/home/student/proxy-lab/orders/order-update.txt", content: "POST /orders?id=731 HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nnote=fragile&status=queued\n" }
        ]
      },
      steps: [
        step({ objective: "Read the mixed request so you can see both the URL selector and the submitted body.", hints: ["Open the request before you decide which input matters.", "Read order-update.txt.", "Try `cat order-update.txt`."], explanation: "Seeing the whole request first is what lets you separate routing data from user-submitted content.", whyThisMatters: "Application inputs can appear in more than one place. You need to choose the field that actually drives the tested behaviour.", successFeedback: "You reviewed the mixed request.", accepts: [rawMatch(/^cat\s+order-update\.txt$/i)] }),
        step({ objective: "Filter the request down to the submitted body field you would be most likely to edit first.", hints: ["The free-form body field is more useful than the route selector for this test.", "Use grep on the note field.", "Try `grep note= order-update.txt`."], explanation: "A body field such as a note is often a better first manipulation target than an identifier that simply selects the object.", whyThisMatters: "Application-layer reasoning means knowing where to focus your first controlled edit.", successFeedback: "You isolated the body parameter.", accepts: [rawMatch(/^grep\s+note=\s+order-update\.txt$/i), rawMatch(/^cat\s+order-update\.txt\s*\|\s*grep\s+note=$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-single-change-replay",
      title: "Proxy Single Change Replay",
      level: "Intermediate",
      objective: "Compare a baseline request, a single-field replay, and the replayed response without introducing extra noise.",
      environment: {
        cwd: "/home/student/proxy-lab/replay",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/replay"],
        files: [
          { path: "/home/student/proxy-lab/replay/baseline-request.txt", content: "POST /api/email HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nemail=alice@lab.local&notify=false\n" },
          { path: "/home/student/proxy-lab/replay/replayed-request.txt", content: "POST /api/email HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nemail=alice@lab.local&notify=true\n" },
          { path: "/home/student/proxy-lab/replay/replayed-response.txt", content: "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"status\":\"queued\",\"notification\":\"scheduled\"}\n" }
        ]
      },
      steps: [
        step({ objective: "Read the baseline request first.", hints: ["Start with the known-good request.", "Open baseline-request.txt.", "Try `cat baseline-request.txt`."], explanation: "A baseline request is what makes later replay differences meaningful instead of random.", whyThisMatters: "You cannot reason about a replay if you do not preserve what changed from the baseline.", successFeedback: "You reviewed the baseline request.", accepts: [rawMatch(/^cat\s+baseline-request\.txt$/i)] }),
        step({ objective: "Read the replayed request that changes only one field.", hints: ["Compare the controlled variation next.", "Open replayed-request.txt.", "Try `cat replayed-request.txt`."], explanation: "A single-field replay is the cleanest way to test whether one input changes behaviour.", whyThisMatters: "One change at a time is what keeps response differences attributable.", successFeedback: "You reviewed the controlled replay.", accepts: [rawMatch(/^cat\s+replayed-request\.txt$/i)] }),
        step({ objective: "Read the replayed response so you can judge the effect of the single change.", hints: ["Now inspect what the server said back.", "Open replayed-response.txt.", "Try `cat replayed-response.txt`."], explanation: "The replayed response is the evidence that tells you whether the changed parameter altered application behaviour.", whyThisMatters: "Interception is not about editing for its own sake. It is about proving a behavioural change.", successFeedback: "You reviewed the replay result.", accepts: [rawMatch(/^cat\s+replayed-response\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-hidden-flag-review",
      title: "Proxy Hidden Flag Review",
      level: "Intermediate",
      objective: "Inspect a suspicious control field and see whether a modified replay exposed extra server behaviour.",
      environment: {
        cwd: "/home/student/proxy-lab/debug",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/debug"],
        files: [
          { path: "/home/student/proxy-lab/debug/report-request.txt", content: "POST /reports/render HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nreport=weekly&preview=false&debug=false\n" },
          { path: "/home/student/proxy-lab/debug/debug-response.txt", content: "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nrender complete\nstackTrace=enabled\nqueryTimer=18ms\n" }
        ]
      },
      steps: [
        step({ objective: "Filter the request down to the suspicious control field.", hints: ["Mode and flag fields are often more interesting than ordinary content.", "Use grep on the debug field.", "Try `grep debug= report-request.txt`."], explanation: "Control-style fields often hint at hidden application behaviour that is worth testing carefully.", whyThisMatters: "A small flag can matter more than a large block of user content if the server trusts it.", successFeedback: "You isolated the hidden control field.", accepts: [rawMatch(/^grep\s+debug=\s+report-request\.txt$/i), rawMatch(/^cat\s+report-request\.txt\s*\|\s*grep\s+debug=$/i)] }),
        step({ objective: "Read the response captured after the flag was altered.", hints: ["Now look for the effect of the replayed change.", "Open debug-response.txt.", "Try `cat debug-response.txt`."], explanation: "The modified response is what tells you whether the flag changed server behaviour in a meaningful way.", whyThisMatters: "You are validating hidden behaviour, not just noticing that the field exists.", successFeedback: "You reviewed the altered response.", accepts: [rawMatch(/^cat\s+debug-response\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-auth-response-compare",
      title: "Proxy Auth Response Compare",
      level: "Intermediate",
      objective: "Compare two authentication responses and infer what the application decided.",
      environment: {
        cwd: "/home/student/proxy-lab/auth-compare",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/auth-compare"],
        files: [
          { path: "/home/student/proxy-lab/auth-compare/auth-success.response", content: "HTTP/1.1 302 Found\nLocation: /dashboard\nSet-Cookie: session=abc123\n" },
          { path: "/home/student/proxy-lab/auth-compare/auth-fail.response", content: "HTTP/1.1 200 OK\nContent-Type: text/html\n\nInvalid credentials\n" }
        ]
      },
      steps: [
        step({ objective: "Read the response that represents a successful authentication path.", hints: ["Start with the success case.", "Open auth-success.response.", "Try `cat auth-success.response`."], explanation: "A successful response establishes the baseline signs of accepted authentication.", whyThisMatters: "Redirects, cookies, and response codes are application-layer clues about server decisions.", successFeedback: "You reviewed the success response.", accepts: [rawMatch(/^cat\s+auth-success\.response$/i)] }),
        step({ objective: "Read the response that represents a failed authentication path.", hints: ["Now compare it to the failure case.", "Open auth-fail.response.", "Try `cat auth-fail.response`."], explanation: "Contrasting the failure case helps you infer what changed in the server’s decision process.", whyThisMatters: "Response comparison is what turns a replay into analysis instead of guesswork.", successFeedback: "You reviewed the failure response.", accepts: [rawMatch(/^cat\s+auth-fail\.response$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-cookie-role-review",
      title: "Proxy Cookie Role Review",
      level: "Intermediate",
      objective: "Inspect a cookie-heavy request and identify the cookie value most likely to influence authorization behaviour.",
      environment: {
        cwd: "/home/student/proxy-lab/cookies",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/cookies"],
        files: [
          { path: "/home/student/proxy-lab/cookies/account-request.txt", content: "GET /account HTTP/1.1\nHost: app.lab\nCookie: session=abc123; theme=dark; role=user\nAccept: text/html\n" },
          { path: "/home/student/proxy-lab/cookies/role-replay.response", content: "HTTP/1.1 200 OK\nContent-Type: text/html\n\nadmin panel hidden\n" }
        ]
      },
      steps: [
        step({ objective: "Filter the request down to the Cookie header.", hints: ["Start by isolating the header that carries multiple browser-side values.", "Use grep on Cookie:.", "Try `grep Cookie: account-request.txt`."], explanation: "A cookie header often contains several independent application inputs that deserve different levels of scrutiny.", whyThisMatters: "Not all cookies are equal. You need to isolate the right one before you test it.", successFeedback: "You isolated the Cookie header.", accepts: [rawMatch(/^grep\s+Cookie:\s+account-request\.txt$/i), rawMatch(/^cat\s+account-request\.txt\s*\|\s*grep\s+Cookie:$/i)] }),
        step({ objective: "Filter the request down to the role-like cookie value.", hints: ["The interesting cookie looks like an authorization hint.", "Use grep on the role field.", "Try `grep role= account-request.txt`."], explanation: "Role-like cookie values are often worth attention because they may influence authorization decisions if the server trusts them.", whyThisMatters: "Application trust boundaries are frequently exposed in small, role-like values.", successFeedback: "You isolated the role cookie.", accepts: [rawMatch(/^grep\s+role=\s+account-request\.txt$/i), rawMatch(/^cat\s+account-request\.txt\s*\|\s*grep\s+role=$/i)] }),
        step({ objective: "Read the response captured after the role cookie was tampered with.", hints: ["Now inspect the server reaction to the changed cookie.", "Open role-replay.response.", "Try `cat role-replay.response`."], explanation: "The response tells you whether the application reacted differently after the cookie was altered.", whyThisMatters: "Cookie manipulation is only useful if you connect it to a server-side behaviour change.", successFeedback: "You reviewed the replayed cookie response.", accepts: [rawMatch(/^cat\s+role-replay\.response$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-header-priority-review",
      title: "Proxy Header Priority Review",
      level: "Intermediate",
      objective: "Separate one potentially meaningful header from a larger set of ordinary browser noise.",
      environment: {
        cwd: "/home/student/proxy-lab/headers",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/headers"],
        files: [
          { path: "/home/student/proxy-lab/headers/admin-request.txt", content: "GET /admin HTTP/1.1\nHost: app.lab\nUser-Agent: Browser\nAccept: text/html\nX-Forwarded-For: 127.0.0.1\nReferer: https://app.lab/home\n" }
        ]
      },
      steps: [
        step({ objective: "Read the full request once so you can judge header priority instead of guessing.", hints: ["Start by reading the whole request.", "Open admin-request.txt.", "Try `cat admin-request.txt`."], explanation: "A full request read helps you separate potentially trusted headers from routine browser noise.", whyThisMatters: "Application-layer testing depends on choosing high-value hypotheses rather than editing everything.", successFeedback: "You reviewed the header set.", accepts: [rawMatch(/^cat\s+admin-request\.txt$/i)] }),
        step({ objective: "Filter the request down to the header most likely to influence trust or routing decisions.", hints: ["One header looks more interesting than the rest.", "Use grep on the forwarded-for header.", "Try `grep X-Forwarded-For: admin-request.txt`."], explanation: "Forwarding-related headers are often more meaningful to test than generic browser headers like User-Agent or Accept.", whyThisMatters: "Prioritising likely trust headers is part of disciplined interception work.", successFeedback: "You isolated the high-interest header.", accepts: [rawMatch(/^grep\s+X-Forwarded-For:\s+admin-request\.txt$/i), rawMatch(/^cat\s+admin-request\.txt\s*\|\s*grep\s+X-Forwarded-For:$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-client-check-bypass",
      title: "Proxy Client Check Bypass",
      level: "Intermediate",
      objective: "Inspect a request that carries a value the browser would normally restrict and review the replayed server response.",
      environment: {
        cwd: "/home/student/proxy-lab/checkout",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/checkout"],
        files: [
          { path: "/home/student/proxy-lab/checkout/checkout-request.txt", content: "POST /checkout HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\namount=10001&currency=USD\n" },
          { path: "/home/student/proxy-lab/checkout/bypass-response.txt", content: "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nqueued for manual review\n" }
        ]
      },
      steps: [
        step({ objective: "Filter the request down to the value that looks like it may have bypassed a simple client-side check.", hints: ["Look for the submitted value that would be most likely limited by the browser.", "Use grep on the amount field.", "Try `grep amount= checkout-request.txt`."], explanation: "A large submitted value is a good candidate when you want to test whether validation happens in the browser or on the server.", whyThisMatters: "Client-side limits only matter if the server enforces them too.", successFeedback: "You isolated the candidate bypass field.", accepts: [rawMatch(/^grep\s+amount=\s+checkout-request\.txt$/i), rawMatch(/^cat\s+checkout-request\.txt\s*\|\s*grep\s+amount=$/i)] }),
        step({ objective: "Read the response captured after the modified request was replayed.", hints: ["Now inspect the server’s reaction.", "Open bypass-response.txt.", "Try `cat bypass-response.txt`."], explanation: "The replayed response is what tells you whether the server accepted, rejected, or rerouted the changed value.", whyThisMatters: "The point of bypass testing is to determine where enforcement actually lives.", successFeedback: "You reviewed the bypass response.", accepts: [rawMatch(/^cat\s+bypass-response\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-method-awareness-review",
      title: "Proxy Method Awareness Review",
      level: "Intermediate",
      objective: "Use the HTTP method to identify which request is more likely to represent a state-changing application action.",
      environment: {
        cwd: "/home/student/proxy-lab/methods",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/methods"],
        files: [
          { path: "/home/student/proxy-lab/methods/view-request.txt", content: "GET /profile?id=12 HTTP/1.1\nHost: app.lab\n" },
          { path: "/home/student/proxy-lab/methods/update-request.txt", content: "POST /profile/update HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nemail=new@app.lab\n" }
        ]
      },
      steps: [
        step({ objective: "Read the captured request that most clearly represents a submitted update rather than a simple fetch.", hints: ["The request you care about changes state rather than only reading it.", "Open the update request rather than the view request.", "Try `cat update-request.txt`."], explanation: "The request method helps you separate ordinary retrieval from a state-changing submission.", whyThisMatters: "Method awareness is a fast way to prioritise requests in a capture set.", successFeedback: "You reviewed the state-changing request.", accepts: [rawMatch(/^cat\s+update-request\.txt$/i)] }),
        step({ objective: "Filter the request down to the method line that signals state change.", hints: ["Use the method itself as the clue.", "Filter for POST in the update request.", "Try `grep POST update-request.txt`."], explanation: "The request line often frames the whole test by telling you what kind of action the server is being asked to perform.", whyThisMatters: "Reading the method early reduces blind manipulation.", successFeedback: "You isolated the method signal.", accepts: [rawMatch(/^grep\s+POST\s+update-request\.txt$/i), rawMatch(/^cat\s+update-request\.txt\s*\|\s*grep\s+POST$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-sequence-triage",
      title: "Proxy Sequence Triage",
      level: "Advanced",
      objective: "Pick the action-bearing request from a small burst of surrounding traffic.",
      environment: {
        cwd: "/home/student/proxy-lab/sequence",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/sequence"],
        files: [
          { path: "/home/student/proxy-lab/sequence/asset-style.txt", content: "GET /assets/site.css HTTP/1.1\nHost: app.lab\n" },
          { path: "/home/student/proxy-lab/sequence/login-api.txt", content: "POST /api/login HTTP/1.1\nHost: app.lab\nContent-Type: application/json\n\n{\"username\":\"alice\",\"password\":\"Winter2025!\"}\n" },
          { path: "/home/student/proxy-lab/sequence/telemetry.txt", content: "POST /api/telemetry HTTP/1.1\nHost: app.lab\nContent-Type: application/json\n\n{\"event\":\"page_load\"}\n" }
        ]
      },
      steps: [
        step({ objective: "List the intercepted files so you can decide which request is worth opening first.", hints: ["Start by triaging the capture burst.", "Use ls in the sequence folder.", "Try `ls`."], explanation: "Traffic triage is part of interception skill. You do not open everything blindly.", whyThisMatters: "Application analysis often begins by separating business actions from surrounding noise.", successFeedback: "You triaged the capture set.", accepts: [commandMatch("ls")] }),
        step({ objective: "Read the request most likely to carry the meaningful authentication action.", hints: ["One request carries credentials; the others do not.", "Open the API login request.", "Try `cat login-api.txt`."], explanation: "The action-bearing request is the one that actually carries the user-controlled authentication content.", whyThisMatters: "Choosing the right request is what makes later manipulation useful.", successFeedback: "You isolated the action-bearing request.", accepts: [rawMatch(/^cat\s+login-api\.txt$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-response-size-signal",
      title: "Proxy Response Size Signal",
      level: "Advanced",
      objective: "Use response summaries to spot a behavioural difference even when the visible page shape looks similar.",
      environment: {
        cwd: "/home/student/proxy-lab/response-signal",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/response-signal"],
        files: [
          { path: "/home/student/proxy-lab/response-signal/baseline.summary", content: "status=200\nlength=842\nsections=profile,alerts\n" },
          { path: "/home/student/proxy-lab/response-signal/modified.summary", content: "status=200\nlength=1254\nsections=profile,alerts,debug-panel\n" }
        ]
      },
      steps: [
        step({ objective: "Read the baseline response summary first.", hints: ["Start with the unmodified case.", "Open baseline.summary.", "Try `cat baseline.summary`."], explanation: "A baseline summary gives you a compact reference for later response comparison.", whyThisMatters: "Application differences are often subtle. Baselines stop you from relying on memory.", successFeedback: "You reviewed the baseline response summary.", accepts: [rawMatch(/^cat\s+baseline\.summary$/i)] }),
        step({ objective: "Read the modified response summary and look for structural differences.", hints: ["Now compare it to the altered case.", "Open modified.summary.", "Try `cat modified.summary`."], explanation: "A changed response length or section list can reveal hidden behaviour even when the page does not obviously announce it.", whyThisMatters: "Response structure is part of application-layer evidence, not just cosmetic output.", successFeedback: "You reviewed the modified response summary.", accepts: [rawMatch(/^cat\s+modified\.summary$/i)] })
      ]
    }),
    proxyScenario({
      id: "proxy-role-parameter-review",
      title: "Proxy Role Parameter Review",
      level: "Advanced",
      objective: "Inspect a role-like parameter in a request and review the server’s replayed reaction to it.",
      environment: {
        cwd: "/home/student/proxy-lab/role-review",
        directories: ["/home/student/proxy-lab", "/home/student/proxy-lab/role-review"],
        files: [
          { path: "/home/student/proxy-lab/role-review/access-request.txt", content: "POST /api/report HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nmode=user&format=html\n" },
          { path: "/home/student/proxy-lab/role-review/role-change.response", content: "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nmode=admin view enabled\n" }
        ]
      },
      steps: [
        step({ objective: "Filter the request down to the role-like parameter.", hints: ["The high-interest input looks like an authorization hint.", "Use grep on the mode field.", "Try `grep mode= access-request.txt`."], explanation: "Role-like fields are valuable because they may expose trust decisions if the server uses them directly.", whyThisMatters: "Privilege and mode values often deserve more attention than ordinary content fields.", successFeedback: "You isolated the role-like parameter.", accepts: [rawMatch(/^grep\s+mode=\s+access-request\.txt$/i), rawMatch(/^cat\s+access-request\.txt\s*\|\s*grep\s+mode=$/i)] }),
        step({ objective: "Read the response captured after that parameter was changed and replayed.", hints: ["Now inspect how the server reacted.", "Open role-change.response.", "Try `cat role-change.response`."], explanation: "The replayed response is the evidence for whether the server trusted the altered role-like value.", whyThisMatters: "The lesson is not that a field exists, but whether the application changes behaviour when it is manipulated.", successFeedback: "You reviewed the replayed role response.", accepts: [rawMatch(/^cat\s+role-change\.response$/i)] })
      ]
    })
  ];

  const generatedExploitScenarios = [
    linuxScenario({
      id: "samba-research-path",
      title: "Samba Research Path",
      category: "Exploitation thinking",
      level: "Advanced",
      objective: "Confirm SMB evidence on fileserver (192.168.56.20) before you search for a Samba exploit path.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Check the SMB ports on the file server.", context: "The file server in this lab is fileserver at 192.168.56.20. Focus on the SMB ports only.", hints: ["Focus on 139 and 445.", "Use Nmap with those ports.", "Try `nmap -p 139,445 fileserver` or `nmap -p 139,445 192.168.56.20`."], explanation: "A focused SMB port check is the right first move when the scenario already points at file-sharing exposure.", accepts: [rawMatch(/^nmap\s+-p\s+139,445\s+192\.168\.56\.20$/i), rawMatch(/^nmap\s+-p\s+139,445\s+fileserver$/i), rawMatch(/^nmap\s+-sV\s+-p\s+139,445\s+192\.168\.56\.20$/i, { advanceBy: 2, feedback: "You checked the SMB ports and already collected the version evidence." }), rawMatch(/^nmap\s+-p\s+139,445\s+-sV\s+192\.168\.56\.20$/i, { advanceBy: 2, feedback: "You checked the SMB ports and already collected the version evidence." }), rawMatch(/^nmap\s+-sV\s+-p\s+139,445\s+fileserver$/i, { advanceBy: 2, feedback: "You checked the SMB ports and already collected the version evidence." }), rawMatch(/^nmap\s+-p\s+139,445\s+-sV\s+fileserver$/i, { advanceBy: 2, feedback: "You checked the SMB ports and already collected the version evidence." })] }),
        step({ objective: "Identify the SMB service versions on those ports.", context: "Stay on fileserver and turn the SMB port state into version evidence before you research exploits.", hints: ["Add service version detection to the same ports.", "Use -sV with 139,445.", "Try `nmap -sV -p 139,445 fileserver` or `nmap -sV -p 139,445 192.168.56.20`."], explanation: "Version evidence is what turns the open SMB ports into a credible exploit-research path.", accepts: [rawMatch(/^nmap\s+-sV\s+-p\s+139,445\s+192\.168\.56\.20$/i), rawMatch(/^nmap\s+-p\s+139,445\s+-sV\s+192\.168\.56\.20$/i), rawMatch(/^nmap\s+-sV\s+-p\s+139,445\s+fileserver$/i), rawMatch(/^nmap\s+-p\s+139,445\s+-sV\s+fileserver$/i)] }),
        step({ objective: "Search the local exploit database for Samba.", hints: ["Research comes after version evidence.", "Use the local exploit search tool.", "Try `searchsploit samba`."], explanation: "Local exploit research is the disciplined next move once you have confirmed the target service family and version.", accepts: [rawMatch(/^searchsploit\s+samba$/i)] })
      ]
    }),
    linuxScenario({
      id: "os-and-service-evidence",
      title: "OS and Service Evidence",
      category: "Exploitation thinking",
      level: "Advanced",
      objective: "Collect host OS evidence and service version evidence on metasploitable2 (192.168.56.102) before you commit to an exploit path.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Run a general host scan first.", context: "The target for this evidence chain is metasploitable2 at 192.168.56.102. Start broad before you fingerprint anything.", hints: ["Start broad before fingerprinting.", "Use a basic Nmap scan.", "Try `nmap metasploitable2` or `nmap 192.168.56.102`."], explanation: "A general host scan is still the right first move before deeper fingerprinting and exploit research.", accepts: [rawMatch(/^nmap\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+metasploitable2$/i), rawMatch(/^nmap\s+target$/i)] }),
        step({ objective: "Collect operating system clues.", context: "Stay on metasploitable2 and use OS fingerprinting once you have the broad host picture.", hints: ["Use the OS detection flag.", "Fingerprint the target host.", "Try `nmap -O metasploitable2` or `nmap -O 192.168.56.102`."], explanation: "OS evidence gives you host-level context that helps you judge which exploit paths are even plausible.", accepts: [rawMatch(/^nmap\s+-O\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-O\s+metasploitable2$/i), rawMatch(/^nmap\s+-O\s+target$/i)] }),
        step({ objective: "Collect service version evidence.", context: "Finish the evidence chain on metasploitable2 with a full version-detection pass.", hints: ["Run a full version detection pass.", "Use Nmap -sV against the target.", "Try `nmap -sV metasploitable2` or `nmap -sV 192.168.56.102`."], explanation: "Service version evidence is what moves you from curiosity into a responsible exploit decision path.", accepts: [rawMatch(/^nmap\s+-sV\s+192\.168\.56\.102$/i), rawMatch(/^nmap\s+-sV\s+metasploitable2$/i), rawMatch(/^nmap\s+-sV\s+target$/i)] })
      ]
    })
  ];

  const generatedMetasploitScenarios = [
    linuxScenario({
      id: "metasploit-search-and-use",
      title: "Metasploit Search and Use",
      category: "Metasploit workflows",
      level: "Advanced",
      objective: "Open Metasploit, search for a Samba module, and load it cleanly.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Open Metasploit.", hints: ["Start the framework console.", "Launch msfconsole.", "Try `msfconsole`."], explanation: "Framework work begins by entering the Metasploit console.", accepts: [rawMatch(/^msfconsole$/i)] }),
        step({ objective: "Search for Samba-related modules.", hints: ["Search inside Metasploit for samba.", "Use the framework search command.", "Try `search samba`."], explanation: "Searching inside the framework confirms which Samba modules are even available.", accepts: [rawMatch(/^search\s+samba$/i)] }),
        step({ objective: "Load the discovered vsftpd module anyway to prove you can select an explicit module path.", hints: ["Use the full exploit path from the vsftpd workflow.", "Load the module directly.", "Try `use exploit/unix/ftp/vsftpd_234_backdoor`."], explanation: "Loading a module by path proves that you can move from search results or prior knowledge into a selected exploit context.", accepts: [rawMatch(/^use\s+exploit\/unix\/ftp\/vsftpd_234_backdoor$/i)] })
      ]
    }),
    linuxScenario({
      id: "metasploit-target-and-run",
      title: "Metasploit Target and Run",
      category: "Metasploit workflows",
      level: "Advanced",
      objective: "Open Metasploit, load the vsftpd module, set metasploitable2 (192.168.56.102) as the target, and execute it.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Open Metasploit.", hints: ["Launch the framework first.", "Start msfconsole.", "Try `msfconsole`."], explanation: "You need the Metasploit console before you can select or run modules.", accepts: [rawMatch(/^msfconsole$/i)] }),
        step({ objective: "Load the vsftpd exploit module.", hints: ["Use the full module path.", "Load the unix FTP module.", "Try `use exploit/unix/ftp/vsftpd_234_backdoor`."], explanation: "Loading the module creates the exploit context you will configure.", accepts: [rawMatch(/^use\s+exploit\/unix\/ftp\/vsftpd_234_backdoor$/i)] }),
        step({ objective: "Set the remote target host.", context: "The host for this exploit path is metasploitable2 at 192.168.56.102. Configure RHOSTS before you run the module.", hints: ["Point the module at metasploitable2 or 192.168.56.102.", "Set RHOSTS correctly.", "Try `set RHOSTS metasploitable2` or `set RHOSTS 192.168.56.102`."], explanation: "The exploit context is incomplete until the target host is configured.", accepts: [rawMatch(/^set\s+RHOSTS\s+192\.168\.56\.102$/i), rawMatch(/^set\s+RHOSTS\s+metasploitable2$/i), rawMatch(/^set\s+RHOSTS\s+target$/i)] }),
        step({ objective: "Run the exploit module.", hints: ["The target is configured.", "Use the execution command.", "Try `run`."], explanation: "Execution comes only after the module and target are both in place.", accepts: [rawMatch(/^run$/i)] })
      ]
    })
  ];

  const generatedTroubleshootScenarios = [
    linuxScenario({
      id: "cleanup-runaway-tail",
      title: "Cleanup Runaway Tail Process",
      category: "Troubleshooting scenarios",
      level: "Intermediate",
      objective: "Identify the runaway tail process, stop it, and verify it is gone.",
      environment: {
        cwd: "/home/student",
        processes: [
          { pid: 3990, name: "tail", user: "student", cpu: "35.2", memory: "0.6", command: "tail -f /var/log/app.log" },
          { pid: 4120, name: "bash", user: "student", cpu: "0.2", memory: "0.4", command: "-bash" }
        ]
      },
      steps: [
        step({ objective: "List the processes.", hints: ["Start with the process table.", "Use ps.", "Try `ps`."], explanation: "You need the running process list before you can isolate the runaway job.", accepts: [commandMatch("ps")] }),
        step({ objective: "Filter the list for tail.", hints: ["Use grep with the process name.", "Filter on tail.", "Try `ps | grep tail`."], explanation: "Filtering is the efficient way to isolate the process you care about.", accepts: [rawMatch(/^ps\s*\|\s*grep\s+tail$/i)] }),
        step({ objective: "Terminate PID 3990.", hints: ["Use kill against the listed PID.", "Target 3990.", "Try `kill 3990`."], explanation: "Targeting the exact PID is what turns the filtered result into action.", accepts: [rawMatch(/^kill\s+3990$/i), rawMatch(/^kill\s+-9\s+3990$/i)] })
      ]
    }),
    linuxScenario({
      id: "linux-local-bind-investigation",
      title: "Local Bind Service Investigation",
      category: "Troubleshooting scenarios",
      difficulty: "Intermediate",
      ticketId: "LNX-214",
      ticketTitle: "Service responds locally but not from the network",
      reportedBy: "Operations Queue",
      reportedTime: "11:05",
      priority: "High",
      affectedSystem: "Linux application host",
      role: "Junior Linux Support Technician",
      estimatedTime: "8-15 minutes",
      scenarioType: "Troubleshooting",
      missionBriefing: "An internal API appears down to users, but the host is still online. Your task is to confirm the working context, inspect the process and logs, identify why the service is not reachable from other systems, and write a short investigation note.",
      summary: "Investigate a Linux service that is running but only listening on the loopback address.",
      learningObjectives: [
        "Use process, file, and socket evidence together during Linux troubleshooting",
        "Separate 'service running' from 'service reachable'",
        "Record the root cause in a short support note"
      ],
      successCriteria: [
        "Confirm the application directory",
        "Show the service process is present",
        "Read the log and config evidence",
        "Confirm the socket is bound only to 127.0.0.1",
        "Write and verify a concise investigation note"
      ],
      environmentNotes: "This is a simulated Linux support host. You are not changing the service in this mission; you are proving why it is unreachable from elsewhere.",
      verificationRequired: true,
      verificationSteps: [
        "Confirm the service process exists",
        "Confirm the listening socket is bound to loopback only",
        "Confirm the saved findings note matches the evidence"
      ],
      commandFocus: ["pwd", "cd", "ps", "grep", "cat", "netstat"],
      walkthrough: [
        {
          command: "cd /srv/portal",
          explanation: "Begin by moving into the application directory so you are working from the right evidence set.",
          output: []
        },
        {
          command: "ps | grep portal",
          explanation: "Confirm the process exists before you assume the service is fully down.",
          output: [
            "  PID USER       %CPU %MEM COMMAND",
            " 4240 student     3.4  0.8 portal-api | portal-api --config /srv/portal/config/portal.conf"
          ]
        },
        {
          command: "netstat -an | grep 8080",
          explanation: "This shows whether the service is listening on an address other systems can reach or only on loopback.",
          output: [
            "TCP    127.0.0.1:8080         0.0.0.0:0              LISTEN"
          ]
        }
      ],
      environment: {
        cwd: "/home/student",
        directories: ["/srv/portal", "/srv/portal/config", "/srv/portal/logs"],
        files: [
          { path: "/srv/portal/config/portal.conf", content: "bind_address=127.0.0.1\nport=8080\n" },
          { path: "/srv/portal/logs/app.log", content: "INFO portal-api starting\nWARN binding service to 127.0.0.1:8080\nINFO health checks local only\n" }
        ],
        processes: [
          { pid: 4240, name: "portal-api", user: "student", cpu: "3.4", memory: "0.8", command: "portal-api --config /srv/portal/config/portal.conf" },
          { pid: 4120, name: "bash", user: "student", cpu: "0.2", memory: "0.3", command: "-bash" }
        ],
        networkConnections: [
          { proto: "TCP", localAddress: "127.0.0.1:8080", foreignAddress: "0.0.0.0:0", state: "LISTEN" },
          { proto: "TCP", localAddress: "0.0.0.0:22", foreignAddress: "0.0.0.0:0", state: "LISTEN" }
        ]
      },
      stages: [
        {
          id: "triage",
          title: "Triage",
          briefing: "Start by confirming your working context so you do not inspect the wrong service tree or note file.",
          completionSummary: "You confirmed the starting Linux context and moved into the service directory safely.",
          steps: [
            step({
              objective: "Confirm your current location on the Linux host.",
              hints: ["Start with a context command.", "Open Commands -> Linux and look for the working-directory command.", "Try `pwd`."],
              explanation: "This shows where the shell currently is before you move into the application tree.",
              whyThisMatters: "Context mistakes are a common source of wasted effort during Linux investigations.",
              successFeedback: "You confirmed the current shell location on the host.",
              nextObjective: "Move into the portal service directory.",
              realWorldNote: "Strong Linux operators always know where they are before they read files or assume a path.",
              accepts: [commandMatch("pwd")]
            }),
            step({
              objective: "Move into the portal service directory.",
              hints: ["The service files live under /srv/portal.", "Change into the application directory before reviewing files.", "Try `cd /srv/portal`."],
              explanation: "Moving into the service directory narrows the investigation to the right logs and configuration files.",
              whyThisMatters: "Linux hosts often contain many services. The right directory keeps the evidence trail coherent.",
              successFeedback: "You moved into the portal service directory.",
              nextObjective: "Confirm the service process is still running.",
              realWorldNote: "Directory context matters because support notes and runbooks often assume you are standing in the correct service tree.",
              accepts: [cwdMatch("/srv/portal")]
            })
          ]
        },
        {
          id: "investigation",
          title: "Investigation",
          briefing: "Determine whether the service is actually stopped or whether the symptom is happening at a different layer.",
          completionSummary: "You proved the process exists, which means the incident is more specific than 'service is down'.",
          steps: [
            step({
              objective: "List processes and isolate the portal service.",
              hints: ["Use the process list and a text filter together.", "Open Commands -> Linux and combine the process listing with grep.", "Try `ps | grep portal`."],
              explanation: "This confirms whether the service process is present before you assume a startup failure.",
              whyThisMatters: "A running process does not prove the application is healthy, but it changes the kind of failure you are looking for.",
              successFeedback: "You proved the portal service process is present.",
              nextObjective: "Check the application log for service clues.",
              realWorldNote: "This is how you separate a dead service from a living service with the wrong behavior.",
              accepts: [rawMatch(/^ps\s*\|\s*grep\s+portal$/i)]
            })
          ]
        },
        {
          id: "evidence",
          title: "Evidence Gathering",
          briefing: "Use logs, configuration, and socket state together so you can explain the failure path clearly.",
          completionSummary: "You collected the log, config, and socket evidence needed to explain why the service appears down from the network.",
          steps: [
            step({
              objective: "Read the application log.",
              hints: ["The log is under /srv/portal/logs/app.log.", "Read the service log before you guess at configuration.", "Try `cat /srv/portal/logs/app.log`."],
              explanation: "Logs often tell you what the service thought it was doing when it started.",
              whyThisMatters: "A log entry can turn a vague outage report into a specific technical hypothesis.",
              successFeedback: "You reviewed the application log and found a clue about the bind address.",
              nextObjective: "Read the portal configuration file.",
              realWorldNote: "Logs often point you toward the right config file or startup option faster than random inspection does.",
              accepts: [rawMatch(/^cat\s+\/srv\/portal\/logs\/app\.log$/i), rawMatch(/^cat\s+logs\/app\.log$/i)]
            }),
            step({
              objective: "Read the portal configuration file.",
              hints: ["The config file is /srv/portal/config/portal.conf.", "Read the configuration after the log clue.", "Try `cat /srv/portal/config/portal.conf`."],
              explanation: "This confirms whether the service configuration matches the behavior hinted at by the log.",
              whyThisMatters: "A log warning is stronger when the configuration file independently supports the same conclusion.",
              successFeedback: "You confirmed the service is configured to bind to 127.0.0.1.",
              nextObjective: "Check the listening socket for the service port.",
              realWorldNote: "Configuration evidence is what lets you explain not only what happened, but why it happened.",
              accepts: [rawMatch(/^cat\s+\/srv\/portal\/config\/portal\.conf$/i), rawMatch(/^cat\s+config\/portal\.conf$/i)]
            }),
            step({
              objective: "Check the listening socket for port 8080.",
              hints: ["Use a socket listing command and filter for 8080.", "Open Commands -> Linux and look for netstat.", "Try `netstat -an | grep 8080`."],
              explanation: "Socket state confirms whether the service is listening on a reachable address or only on loopback.",
              whyThisMatters: "This is the evidence that connects the running process to the real user symptom.",
              successFeedback: "You proved the service listens only on 127.0.0.1:8080.",
              nextObjective: "Write a short findings note for the next technician.",
              realWorldNote: "A service can be perfectly alive and still unreachable to users if it binds only to loopback.",
              accepts: [rawMatch(/^netstat\s+-an\s*\|\s*grep\s+8080$/i)]
            })
          ]
        },
        {
          id: "conclusion",
          title: "Conclusion",
          briefing: "Record the root cause clearly so the next action is justified and easy to hand off.",
          completionSummary: "You turned the terminal evidence into a concise support conclusion.",
          steps: [
            step({
              objective: "Save a findings note that explains the loopback bind problem.",
              hints: ["Use echo with output redirection.", "Save the note to /home/student/portal-findings.txt.", "Try `echo Service is running but bound only to 127.0.0.1:8080 > /home/student/portal-findings.txt`."],
              explanation: "A support note should state the proven cause, not just list raw commands that were run.",
              whyThisMatters: "Another technician or application owner should be able to pick up the case without rerunning the whole investigation.",
              successFeedback: "You saved a concise findings note that matches the evidence.",
              nextObjective: "Verify the note was written correctly.",
              realWorldNote: "Good notes reduce duplicate effort and make escalation cleaner.",
              accepts: [rawMatch(/^echo\s+Service is running but bound only to 127\.0\.0\.1:8080\s*>\s*\/home\/student\/portal-findings\.txt$/i)]
            })
          ]
        },
        {
          id: "verification",
          title: "Verification",
          briefing: "Verify the saved note before you close your part of the ticket.",
          completionSummary: "You verified the support note rather than assuming the handoff artifact was correct.",
          steps: [
            step({
              objective: "Read the saved portal findings note.",
              hints: ["Use the Linux file-reading command.", "Open the note you just created.", "Try `cat /home/student/portal-findings.txt`."],
              explanation: "Verification applies to the handoff note as well as to the technical state you observed earlier.",
              whyThisMatters: "If the note is wrong or incomplete, the next queue loses the benefit of your investigation.",
              successFeedback: "You verified the saved findings note before handing the ticket on.",
              nextObjective: "Continue to the next mission when you are ready.",
              realWorldNote: "Verifying your own handoff note is a small habit that prevents a surprising amount of rework.",
              accepts: [rawMatch(/^cat\s+\/home\/student\/portal-findings\.txt$/i)]
            })
          ]
        }
      ]
    }),
    cmdScenario({
      id: "cmd-updater-stop",
      title: "CMD Updater Stop",
      category: "Troubleshooting scenarios",
      level: "Intermediate",
      objective: "Find the updater process in Windows, terminate it, and confirm the task list is clean.",
      environment: {
        cwd: "C:/Lab",
        processes: [
          { pid: 2210, name: "updater.exe", user: "SYSTEM", cpu: "44", memory: "20", command: "updater.exe /scheduled" },
          { pid: 991, name: "explorer.exe", user: "student", cpu: "2", memory: "85", command: "explorer.exe" }
        ]
      },
      steps: [
        step({ objective: "List the Windows tasks.", hints: ["Use the Windows process listing command.", "Start with tasklist.", "Try `tasklist`."], explanation: "The Windows task list is the starting point for any process-based troubleshooting action.", accepts: [commandMatch("tasklist")] }),
        step({ objective: "Filter the task list to updater.exe.", hints: ["Use findstr with the process name.", "Search the task list for updater.", "Try `tasklist | findstr updater`."], explanation: "Filtering the task list is faster and cleaner than manually reading the full process output.", accepts: [rawMatch(/^tasklist\s*\|\s*findstr\s+updater$/i)] }),
        step({ objective: "Terminate the updater process with PID 2210.", hints: ["Use taskkill with the PID and force flag.", "Target PID 2210.", "Try `taskkill /PID 2210 /F`."], explanation: "Windows task termination is safest and most precise when you target the PID directly.", accepts: [rawMatch(/^taskkill\s+\/PID\s+2210\s+\/F$/i)] })
      ]
    })
  ];

  const generatedWindowsCurriculumScenarios = [
    windowsLessonScenario({
      id: "win-dir-incident-triage",
      title: "Incident Folder Triage",
      category: "Files and navigation",
      difficulty: "Beginner",
      beginnerTrack: "windows-beginner",
      beginnerLabLevelId: "level-1-terminal-orientation",
      beginnerLabMissionLabel: "Mission 1: Incident Folder Triage",
      role: "Junior Support Technician",
      ticketId: "WIN-102",
      ticketTitle: "Incident folder requires initial workstation triage",
      reportedBy: "Helpdesk Queue",
      reportedTime: "09:14",
      priority: "Medium",
      affectedSystem: "Windows support workstation",
      symptoms: [
        "A triage folder has been prepared for a service-access issue",
        "The written case note has not been reviewed yet",
        "No remediation should begin before the note is confirmed"
      ],
      userReport: "The ticket notes say a service issue is being escalated, but the workstation side of the evidence has not been reviewed yet.",
      knownFacts: [
        "The analyst workstation starts at C:\\Lab",
        "An Incidents folder exists in the current workspace",
        "A notes folder exists somewhere inside the case structure"
      ],
      constraints: [
        "Do not guess the full path before you inspect the current folder",
        "Use CMD navigation and folder listings to discover where the notes live",
        "Confirm each move before you go deeper"
      ],
      estimatedTime: "5-8 minutes",
      scenarioType: "Terminal Orientation",
      escalationNote: "This is an orientation ticket. The goal is to prove folder discovery and navigation habits before deeper troubleshooting begins.",
      easterEggNote: "A sticky note on the monitor says: 'Do not guess paths. Future you will complain.'",
      missionBriefing: "A support ticket has been staged on a Windows practice workstation. Your first job is not to guess where the evidence lives. Start from the current folder, list what is there, move into the incident folder you discover, and keep confirming your location as you go.",
      summary: "Use Windows CMD to discover the incident folder structure step by step instead of guessing hidden paths.",
      beginnerTicket: {
        happened: "The ticket says the incident notes have not been found yet.",
        meaning: "The notes are somewhere in the lab folders. Your job is to discover the right folder one step at a time.",
        tryFirst: "Look at the folders you can already see before you guess where to go."
      },
      visualGuide: {
        type: "folder-map",
        root: "C:/Lab",
        relevantPaths: ["C:/Lab/Incidents", "C:/Lab/Incidents/notes"],
        commandMap: [
          { command: "dir", icon: "👀", meaning: "look inside this folder" },
          { command: "cd", icon: "🚶", meaning: "move into a folder" }
        ]
      },
      walkthrough: [
        {
          title: "Step 1: List the current folder",
          goal: "See which folders are available before you guess a path.",
          prompt: "C:\\Lab>",
          command: "dir",
          explanation: "Start by listing the current workspace. Before you move anywhere, confirm what evidence is already in front of you.",
          output: [
            " Volume in drive C is OS",
            " Directory of C:\\Lab",
            "04/17/2026  08:20 AM    <DIR>          Incidents",
            "04/17/2026  08:22 AM    <DIR>          Reports"
          ]
        },
        {
          title: "Step 2: Enter the incident folder",
          goal: "Move into the folder that likely contains the case material.",
          prompt: "C:\\Lab>",
          command: "cd Incidents",
          explanation: "Now that you have evidence of an Incidents folder, move into it directly instead of guessing a deeper path.",
          output: [
            "C:\\Lab\\Incidents>"
          ]
        },
        {
          title: "Step 3: Inspect the incident folder",
          goal: "Check what is inside Incidents before you guess the next folder.",
          prompt: "C:\\Lab\\Incidents>",
          command: "dir",
          explanation: "List the incident folder itself. This is how you discover that the notes folder is one level deeper.",
          output: [
            " Volume in drive C is OS",
            " Directory of C:\\Lab\\Incidents",
            "04/17/2026  08:26 AM    <DIR>          notes",
            "04/17/2026  08:27 AM                41 queue.txt"
          ]
        },
        {
          title: "Step 4: Enter the notes folder",
          goal: "Move into the notes folder you just discovered.",
          prompt: "C:\\Lab\\Incidents>",
          command: "cd notes",
          explanation: "The folder listing already proved notes exists here, so now you can move into it with confidence.",
          output: [
            "C:\\Lab\\Incidents\\notes>"
          ]
        },
        {
          title: "Step 5: Verify the notes folder contents",
          goal: "Confirm you are in the right place and can see the ticket files.",
          prompt: "C:\\Lab\\Incidents\\notes>",
          command: "dir",
          explanation: "A final listing confirms you reached the expected folder and can now work with the actual note files.",
          output: [
            " Volume in drive C is OS",
            " Directory of C:\\Lab\\Incidents\\notes",
            "04/17/2026  08:28 AM                55 service.txt",
            "04/17/2026  08:28 AM                42 triage.txt"
          ]
        }
      ],
      learningObjectives: [
        "Use the visible workspace before guessing a path",
        "List folders to discover where evidence lives",
        "Move one level at a time and confirm each change"
      ],
      successCriteria: [
        "List the current folder and discover Incidents",
        "Move into Incidents and inspect it",
        "Discover notes and move into it",
        "Verify the final folder contents"
      ],
      environmentNotes: "This scenario simulates a Windows support workstation and focuses on beginner folder discovery. You are learning how to inspect first and navigate second.",
      verificationRequired: true,
      verificationSteps: ["Confirm the notes folder is visible from inside Incidents", "Confirm the prompt changes as you move into notes", "Confirm the notes folder contents are visible"],
      objective: "Use CMD to discover where the incident notes live, then move into the correct notes folder without guessing the path in advance.",
      scenarioIntro: "You are on the Windows analyst workstation at C:\\Lab. Start by listing the current folder so you can discover the incident path instead of memorising it.",
      commandFocus: ["dir", "cd"],
      acceptedCommands: ["dir", "cd Incidents", "cd notes"],
      simulatedOutput: [" Directory of C:\\Lab", "Incidents", " Directory of C:\\Lab\\Incidents", "notes", " Directory of C:\\Lab\\Incidents\\notes"],
      successCondition: "Discover the Incidents folder, move into it, discover notes, and confirm the final notes folder contents.",
      feedbackText: "The learner used folder discovery instead of guessing the path.",
      environment: {
        cwd: "C:/Lab",
        directories: ["C:/Lab/Incidents", "C:/Lab/Incidents/notes", "C:/Lab/Reports"],
        files: [
          { path: "C:/Lab/Incidents/queue.txt", content: "Open the incident notes folder before you assume where the case file lives.\n" },
          { path: "C:/Lab/Incidents/notes/service.txt", content: "Spooler restarts are failing.\n" },
          { path: "C:/Lab/Incidents/notes/triage.txt", content: "User reported the printer queue is stuck.\n" }
        ]
      },
      stages: [
        {
          id: "orientation",
          title: "Orientation",
          briefing: "Learn to inspect the current folder before you guess where the ticket files are stored.",
          completionSummary: "You used a folder listing to discover the incident folder instead of guessing a deeper path.",
          steps: [
            step({
              objective: "List the current folder contents.",
              hints: ["You are trying to see which folders are available first.", "Open Command Help and look for the Windows command that lists files and folders.", "Try `dir`."],
              explanation: "dir lists the files and folders in the current location.",
              whyThisMatters: "Good technicians inspect the environment before moving or changing files.",
              successFeedback: "You discovered the available folders instead of guessing a hidden path.",
              nextObjective: "Move into the Incidents folder you discovered.",
              realWorldNote: "Listing first keeps you anchored to evidence instead of memory.",
              walkthrough: [
                {
                  title: "Step 1: List the current folder",
                  goal: "See what folders are available before you guess a path.",
                  objective: "List the folders and files in the current workspace.",
                  howToThink: "Do not guess where notes is. First inspect the folder you are already standing in.",
                  whereToLook: "Open Command Help -> Windows CMD and look for the command that lists files and folders.",
                  command: "dir",
                  output: [
                    " Volume in drive C is OS",
                    " Directory of C:\\Lab",
                    "04/17/2026  08:20 AM    <DIR>          Incidents",
                    "04/17/2026  08:22 AM    <DIR>          Reports"
                  ],
                  explanation: "dir shows the folders and files in the current location. This lets you discover Incidents instead of guessing.",
                  whyThisMatters: "A good junior technician confirms the visible evidence first instead of jumping to a path from memory.",
                  nowTry: "Type dir yourself."
                }
              ],
              accepts: [commandMatch("dir")]
            })
          ]
        },
        {
          id: "enter-incident-folder",
          title: "Enter the incident folder",
          briefing: "Move into the folder you discovered so you can inspect its contents one level at a time.",
          completionSummary: "You entered the incident folder deliberately instead of jumping to a guessed nested path.",
          steps: [
            step({
              objective: "Move into the Incidents folder.",
              hints: ["You already proved that Incidents exists.", "Use the Windows change-directory command on the folder you discovered.", "Try `cd Incidents`."],
              explanation: "cd changes the current folder so the prompt and subsequent listings come from the correct location.",
              whyThisMatters: "Navigation should be based on evidence from the previous command, not on a guessed full path.",
              successFeedback: "You moved into the Incidents folder you discovered.",
              nextObjective: "List the contents of Incidents.",
              realWorldNote: "Moving one level at a time makes it easier to catch a wrong path before it becomes confusing.",
              walkthrough: [
                {
                  title: "Step 2: Enter Incidents",
                  goal: "Move into the folder that likely contains the ticket material.",
                  objective: "Move into the Incidents folder.",
                  howToThink: "Use the folder name you just discovered. Do not guess a deeper path yet.",
                  whereToLook: "Open Command Help -> Windows CMD and look for the change-directory command.",
                  command: "cd Incidents",
                  output: [
                    "C:\\Lab\\Incidents>"
                  ],
                  explanation: "The prompt changes when you enter a folder. That is your first confirmation that the command worked.",
                  whyThisMatters: "The prompt is part of your evidence. It tells you where the next command will run.",
                  nowTry: "Type cd Incidents yourself."
                }
              ],
              accepts: [
                cwdMatch("C:/Lab/Incidents"),
                cwdMatch("C:/Lab/Incidents/notes", {
                  advanceBy: 3,
                  feedback: "You reached the notes folder in one move."
                })
              ]
            })
          ]
        },
        {
          id: "discover-notes-folder",
          title: "Discover the notes folder",
          briefing: "Inspect the incident folder before you assume what is inside it.",
          completionSummary: "You discovered the notes folder from the folder listing instead of guessing the nested structure.",
          steps: [
            step({
              objective: "List the contents of the Incidents folder.",
              hints: ["You are trying to see what is inside Incidents.", "Use the Windows directory listing command again in the new location.", "Try `dir`."],
              explanation: "A fresh listing in the current folder shows the next available folders and files.",
              whyThisMatters: "The right command does not change, but the meaning changes because you are now in a different folder.",
              successFeedback: "You inspected the incident folder and discovered the notes folder.",
              nextObjective: "Move into the notes folder.",
              realWorldNote: "Repeating a context command in a new folder is not wasted effort. It is how you build a reliable path step by step.",
              walkthrough: [
                {
                  title: "Step 3: Inspect the incident folder",
                  goal: "Check what is inside Incidents before you guess the next folder.",
                  objective: "List the contents of the Incidents folder.",
                  howToThink: "You are in a new location now, so list this folder before you decide where to go next.",
                  whereToLook: "Use the same Windows CMD listing command again.",
                  command: "dir",
                  output: [
                    " Volume in drive C is OS",
                    " Directory of C:\\Lab\\Incidents",
                    "04/17/2026  08:26 AM    <DIR>          notes",
                    "04/17/2026  08:27 AM                41 queue.txt"
                  ],
                  explanation: "This second listing shows you that notes exists inside Incidents.",
                  whyThisMatters: "This is how you discover nested paths safely instead of memorising them.",
                  nowTry: "Type dir yourself."
                }
              ],
              accepts: [commandMatch("dir")]
            })
          ]
        },
        {
          id: "enter-notes-and-verify",
          title: "Enter notes and verify",
          briefing: "Move into the notes folder you discovered and confirm you reached the correct location.",
          completionSummary: "You reached the notes folder and verified the final working location.",
          steps: [
            step({
              objective: "Move into the notes folder.",
              hints: ["You already proved that notes exists here.", "Use the Windows change-directory command on notes.", "Try `cd notes`."],
              explanation: "Use the folder name from the listing you just saw.",
              whyThisMatters: "This is the habit we want: observe, decide, move, and confirm.",
              successFeedback: "You moved into the notes folder.",
              nextObjective: "List the notes folder contents to verify the location.",
              realWorldNote: "A prompt change is good evidence, but a final listing removes doubt before you continue.",
              walkthrough: [
                {
                  title: "Step 4: Enter notes",
                  goal: "Move into the notes folder you just discovered.",
                  objective: "Move into the notes folder.",
                  howToThink: "Now you have evidence that notes exists here, so you can move into it confidently.",
                  whereToLook: "Open Command Help -> Windows CMD and use the change-directory command again.",
                  command: "cd notes",
                  output: [
                    "C:\\Lab\\Incidents\\notes>"
                  ],
                  explanation: "The prompt changed again. That confirms you are now inside notes.",
                  whyThisMatters: "Prompt changes are part of the evidence trail in terminal work.",
                  nowTry: "Type cd notes yourself."
                }
              ],
              accepts: [cwdMatch("C:/Lab/Incidents/notes")]
            }),
            step({
              objective: "List the notes folder contents.",
              hints: ["Verify the folder you entered by listing it.", "Use the same Windows directory listing command one more time.", "Try `dir`."],
              explanation: "A final listing confirms you reached the intended folder and can now see the ticket files.",
              whyThisMatters: "Verification matters even for navigation. You should know you are in the right place before reading or changing files.",
              successFeedback: "You verified the notes folder contents.",
              nextObjective: "Now try the same discovery habits in the next mission.",
              realWorldNote: "Strong beginners do not just reach the right folder. They prove they reached it.",
              walkthrough: [
                {
                  title: "Step 5: Verify the notes folder",
                  goal: "Confirm you are in the right place before you continue.",
                  objective: "List the notes folder contents.",
                  howToThink: "A final listing removes any doubt about where you are and what files are available next.",
                  whereToLook: "Use the Windows CMD listing command in the current folder.",
                  command: "dir",
                  output: [
                    " Volume in drive C is OS",
                    " Directory of C:\\Lab\\Incidents\\notes",
                    "04/17/2026  08:28 AM                55 service.txt",
                    "04/17/2026  08:28 AM                42 triage.txt"
                  ],
                  explanation: "You can now see the notes files directly. That confirms you reached the intended folder.",
                  whyThisMatters: "Now try the same steps yourself.",
                  nowTry: "Type dir yourself."
                }
              ],
              accepts: [commandMatch("dir")]
            })
          ]
        }
      ]
    }),
    windowsLessonScenario({
      id: "win-dns-escalation-ticket",
      title: "DNS Escalation Review",
      category: "Troubleshooting scenarios",
      difficulty: "Intermediate",
      ticketId: "WIN-214",
      ticketTitle: "User can reach IPs but not internal hostname",
      reportedBy: "Helpdesk Queue",
      reportedTime: "10:26",
      priority: "High",
      affectedSystem: "Windows workstation",
      role: "Junior Support Technician",
      estimatedTime: "8-15 minutes",
      scenarioType: "Troubleshooting",
      missionBriefing: "A user reports they can reach the internal server IP 192.168.56.20 but cannot use the hostname intranet.lab. Your job is to confirm local configuration, test gateway reachability, isolate whether the failure is DNS or routing, and leave a clear ticket note before escalation.",
      summary: "Use the ticket facts hostname intranet.lab and service IP 192.168.56.20 to prove whether DNS or reachability is failing.",
      beginnerTicket: {
        happened: "The user can reach service IP 192.168.56.20, but hostname intranet.lab does not work.",
        meaning: "You are checking whether the name is broken while the IP path still works.",
        tryFirst: "Start with this PC's network settings, then test the gateway, hostname, and service IP."
      },
      learningObjectives: [
        "Confirm local Windows network configuration before chasing the wider network",
        "Separate gateway reachability from hostname resolution",
        "Leave a short technician note that explains what the evidence supports"
      ],
      successCriteria: [
        "Confirm IP, gateway, and DNS configuration",
        "Prove the gateway responds",
        "Show the hostname lookup fails while the target IP remains reachable",
        "Record the DNS-focused conclusion in a ticket note"
      ],
      knownFacts: [
        "Reported hostname: intranet.lab",
        "Known service IP from the ticket: 192.168.56.20",
        "Default gateway and DNS server shown by ipconfig: 192.168.56.1"
      ],
      userReport: "I can reach the internal service by IP address 192.168.56.20, but intranet.lab does not open.",
      symptoms: [
        "Hostname intranet.lab fails",
        "Service IP 192.168.56.20 is the known target from the ticket",
        "Workstation should use DNS server 192.168.56.1"
      ],
      constraints: [
        "Use the hostname and IP given in the ticket instead of guessing hidden values",
        "Prove each layer before writing the ticket note"
      ],
      environmentNotes: "This is a simulated Windows support environment. The goal is to prove whether the reported fault belongs to DNS, routing, or the target service before you escalate.",
      verificationRequired: true,
      verificationSteps: [
        "Confirm the default gateway responds",
        "Confirm the target IP is reachable",
        "Confirm the saved ticket note matches the evidence"
      ],
      commandFocus: ["ipconfig", "ping", "nslookup", "route print", "type"],
      walkthrough: [
        {
          command: "ipconfig /all",
          explanation: "Start with the workstation itself. Before you assume DNS is broken, confirm the machine actually has an address, gateway, and DNS server configured.",
          output: [
            "Windows IP Configuration",
            "",
            "Ethernet adapter Ethernet0:",
            "   IPv4 Address. . . . . . . . . . . : 192.168.56.25",
            "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
            "   Default Gateway . . . . . . . . . : 192.168.56.1",
            "   DNS Servers . . . . . . . . . . . : 192.168.56.1"
          ]
        },
        {
          command: "ping 192.168.56.1",
          explanation: "Now prove the workstation can at least reach the default gateway. That tells you the machine is not completely isolated from the local network.",
          output: [
            "Pinging 192.168.56.1 [192.168.56.1] with 32 bytes of data:",
            "Reply from 192.168.56.1: bytes=32 time<1ms TTL=128"
          ]
        },
        {
          command: "nslookup intranet.lab",
          explanation: "Use the reported hostname from the ticket. If intranet.lab fails while gateway and IP tests succeed, DNS becomes the leading suspect.",
          output: [
            "Server:  192.168.56.1",
            "Address: 192.168.56.1",
            "",
            "*** 192.168.56.1 can't find intranet.lab: Non-existent domain"
          ]
        }
      ],
      environment: {
        cwd: "C:/Lab/Reports",
        files: [
          { path: "C:/Lab/Reports/dns-ticket-template.txt", content: "User can browse by IP but not by hostname. Capture evidence before escalation.\n" }
        ]
      },
      stages: [
        {
          id: "triage",
          title: "Triage",
          briefing: "Confirm the workstation has a usable local network configuration before you assume the wider problem belongs to DNS or the server.",
          completionSummary: "You confirmed the workstation configuration and ruled out obvious local misconfiguration.",
          steps: [
            step({
              objective: "Review the full Windows IP configuration.",
              hints: ["Check local network configuration first.", "Open Commands and look for the Windows IP configuration command.", "Try `ipconfig /all`."],
              explanation: "This shows the workstation IP address, subnet mask, default gateway, and DNS server settings.",
              whyThisMatters: "A user report about a hostname problem is not enough by itself. You still need to prove the workstation has a valid network baseline.",
              successFeedback: "You confirmed the workstation has a local IP configuration to work from.",
              nextObjective: "Test whether the workstation can reach the default gateway.",
              realWorldNote: "Good support work starts at the endpoint. If the local network settings are wrong, every later DNS or service test becomes misleading.",
              accepts: [rawMatch(/^ipconfig\s+\/all$/i), rawMatch(/^ipconfig$/i)]
            })
          ]
        },
        {
          id: "gateway-check",
          title: "Investigation",
          briefing: "Prove the workstation can talk to the local network before you blame DNS.",
          completionSummary: "You established that the workstation is not completely isolated from its gateway.",
          steps: [
            step({
              objective: "Test reachability to the default gateway.",
              hints: ["The gateway is 192.168.56.1.", "Use a simple reachability test against the gateway.", "Try `ping 192.168.56.1`."],
              explanation: "A successful gateway ping proves the workstation can communicate beyond itself on the local segment.",
              whyThisMatters: "This rules out total local isolation, but it still does not prove DNS or the target application is healthy.",
              successFeedback: "You proved the workstation can reach the default gateway.",
              nextObjective: "Test the reported hostname directly.",
              realWorldNote: "A reachable gateway is often the line between a local NIC problem and a higher-layer name or service problem.",
              accepts: [rawMatch(/^ping\s+192\.168\.56\.1$/i)]
            })
          ]
        },
        {
          id: "dns-evidence",
          title: "Evidence Gathering",
          briefing: "Now test the reported hostname intranet.lab, then compare it with the known service IP 192.168.56.20 from the ticket.",
          completionSummary: "You gathered the direct hostname evidence needed to treat DNS as the leading issue.",
          steps: [
            step({
              objective: "Test the reported hostname intranet.lab with nslookup.",
              hints: ["The ticket says the hostname is intranet.lab.", "Use the DNS lookup command from Commands -> Windows CMD.", "Try `nslookup intranet.lab`."],
              explanation: "A failed lookup for the reported hostname shows the problem is happening at the name-resolution step rather than at the first local network hop.",
              whyThisMatters: "This is the point where you stop saying 'the internet is broken' and start saying what exact part of the path is failing.",
              successFeedback: "You showed that the internal hostname does not resolve.",
              nextObjective: "Confirm the route and the target IP path are still viable.",
              realWorldNote: "Support escalations are much stronger when they include the exact hostname that failed, not just a generic complaint about access.",
              accepts: [rawMatch(/^nslookup\s+intranet\.lab$/i)]
            }),
            step({
              objective: "Review the route table for the local network path.",
              hints: ["You are checking whether the workstation still has a normal route to the local subnet.", "Use the Windows route display command.", "Try `route print`."],
              explanation: "This confirms the workstation still has a default route and local-subnet route consistent with the current network.",
              whyThisMatters: "If the routing table were broken, the hostname failure might be a distraction instead of the root issue.",
              successFeedback: "You confirmed the workstation route table still points traffic toward the expected gateway.",
              nextObjective: "Confirm the target IP remains reachable even though the hostname fails.",
              realWorldNote: "This is how you avoid blaming DNS when the machine may actually have no route to the target network at all.",
              accepts: [rawMatch(/^route\s+print$/i)]
            }),
            step({
              objective: "Test the known service IP 192.168.56.20 directly.",
              hints: ["The ticket gives service IP 192.168.56.20.", "Use a direct reachability test against that server IP.", "Try `ping 192.168.56.20`."],
              explanation: "If the IP responds while the hostname still fails, the evidence strongly favors DNS rather than routing or total service loss.",
              whyThisMatters: "This separates 'cannot find the server by name' from 'cannot reach the server at all'.",
              successFeedback: "You proved the target IP remains reachable even though the hostname fails.",
              nextObjective: "Write the ticket note so the escalation is evidence-led.",
              realWorldNote: "This is the kind of split test that keeps tickets from bouncing between network and DNS teams without useful evidence.",
              accepts: [rawMatch(/^ping\s+192\.168\.56\.20$/i)]
            })
          ]
        },
        {
          id: "ticket-note",
          title: "Ticket Close Note",
          briefing: "Leave a short technician note that explains what the evidence supports before you pass the issue on.",
          completionSummary: "You recorded the diagnosis clearly enough for another technician or resolver team to pick it up.",
          steps: [
            step({
              objective: "Save a short ticket note that identifies DNS as the failing layer.",
              hints: ["Use echo with output redirection.", "Write the note into C:\\Lab\\Reports\\dns-findings.txt.", "Try `echo DNS failure isolated while gateway and target IP remain reachable > C:\\Lab\\Reports\\dns-findings.txt`."],
              explanation: "A short ticket note turns your terminal evidence into something another technician can act on without repeating the whole investigation.",
              whyThisMatters: "Support work does not end with a private conclusion. The next person needs a defensible handoff.",
              successFeedback: "You recorded the evidence-led DNS conclusion in the ticket note.",
              nextObjective: "Verify the note was saved correctly.",
              realWorldNote: "A precise note saves time for the next queue and shows that you separated the failing layer before escalating.",
              accepts: [rawMatch(/^echo\s+DNS failure isolated while gateway and target IP remain reachable\s*>\s*C:\\Lab\\Reports\\dns-findings\.txt$/i)]
            })
          ]
        },
        {
          id: "verification",
          title: "Verification",
          briefing: "Verify the saved note matches the investigation result before you close the ticket handoff.",
          completionSummary: "You verified the handoff note instead of assuming it was saved correctly.",
          steps: [
            step({
              objective: "Read the saved DNS findings note.",
              hints: ["Use the Windows file-reading command.", "Open the saved ticket note you just created.", "Try `type C:\\Lab\\Reports\\dns-findings.txt`."],
              explanation: "Verification includes checking the artifact you created for the next queue, not just the live command output from earlier steps.",
              whyThisMatters: "A saved note is only useful if it actually says what the investigation proved.",
              successFeedback: "You verified the saved technician note before closing the handoff.",
              nextObjective: "Proceed to the next mission when you are ready.",
              realWorldNote: "Verification is not only for systems. It also applies to notes, exports, and evidence you expect another person to rely on.",
              accepts: [rawMatch(/^type\s+C:\\Lab\\Reports\\dns-findings\.txt$/i), rawMatch(/^type\s+dns-findings\.txt$/i)]
            })
          ]
        }
      ]
    }),
    windowsLessonScenario({
      id: "win-cd-notes-folder",
      title: "Move Into the Notes Folder",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Change into the Notes folder so you are working in the correct case directory.",
      scenarioIntro: "The case notes are stored under C:\\Lab\\Incident\\Notes. Move into that directory explicitly so the learner associates Windows navigation with the correct folder context.",
      commandFocus: ["cd"],
      acceptedCommands: ["cd Notes", "cd C:\\Lab\\Incident\\Notes"],
      simulatedOutput: ["C:\\Lab\\Incident\\Notes"],
      successCondition: "End the step with the CMD working directory set to C:\\Lab\\Incident\\Notes.",
      feedbackText: "The working directory now matches the incident notes context.",
      environment: {
        cwd: "C:/Lab/Incident",
        directories: ["C:/Lab/Incident/Notes"]
      },
      steps: [
        step({
          objective: "Move into C:\\Lab\\Incident\\Notes.",
          hints: ["Change into the Notes folder.", "Relative or full Windows paths are fine.", "Try `cd Notes`."],
          explanation: "Changing into the exact case folder reduces path confusion for beginners.",
          successFeedback: "You moved into the notes folder.",
          accepts: [cwdMatch("C:/Lab/Incident/Notes")]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-tree-toolbox-map",
      title: "Map the Toolbox Tree",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Display the folder tree for the toolkit so you can see the directory structure at a glance.",
      scenarioIntro: "The analyst toolkit has several subfolders. Use the tree view so the learner sees a Windows-native way to understand folder layout without opening each directory one by one.",
      commandFocus: ["tree"],
      acceptedCommands: ["tree", "tree C:\\Lab\\Toolkit"],
      simulatedOutput: ["C:\\Lab\\Toolkit", "+---Docs", "\\---Scripts"],
      successCondition: "Render the toolkit directory structure in tree form.",
      feedbackText: "The learner has a visual folder map instead of guessing from separate listings.",
      environment: {
        cwd: "C:/Lab/Toolkit",
        directories: ["C:/Lab/Toolkit/Docs", "C:/Lab/Toolkit/Scripts", "C:/Lab/Toolkit/Logs"],
        files: [{ path: "C:/Lab/Toolkit/Docs/readme.txt", content: "Toolkit usage notes.\n" }]
      },
      steps: [
        step({
          objective: "Display the current toolkit folder as a tree.",
          hints: ["Use the CMD tree command.", "You can target the current folder or name it explicitly.", "Try `tree`."],
          explanation: "tree is a beginner-friendly way to understand a Windows folder hierarchy quickly.",
          successFeedback: "You mapped the toolkit tree.",
          accepts: [commandMatch("tree")]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-mkdir-rmdir-temp-workspace",
      title: "Create and Remove a Temp Workspace",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Create a scratch directory for triage notes, then remove it once the practice task is complete.",
      scenarioIntro: "Temporary work folders are common during Windows triage. Create one under C:\\Lab\\Temp, then clean it up so the learner sees both setup and tidy-up commands in one small workflow.",
      commandFocus: ["mkdir", "rmdir"],
      acceptedCommands: ["mkdir scratch", "rmdir scratch"],
      simulatedOutput: ["created directory scratch"],
      successCondition: "Create C:\\Lab\\Temp\\scratch and remove it again.",
      feedbackText: "The learner practiced both making and removing a temporary Windows folder.",
      environment: {
        cwd: "C:/Lab/Temp"
      },
      steps: [
        step({
          objective: "Create a directory named scratch in the current folder.",
          hints: ["Start by making the workspace.", "Use the Windows directory creation command.", "Try `mkdir scratch`."],
          explanation: "Creating a dedicated workspace first keeps response artifacts contained.",
          successFeedback: "You created the scratch workspace.",
          accepts: [fileExistsMatch("C:/Lab/Temp/scratch", { command: "mkdir", nodeType: "dir" })]
        }),
        step({
          objective: "Remove the scratch directory once the practice setup is proven.",
          hints: ["Clean the temporary folder back up.", "Use the Windows directory removal command.", "Try `rmdir scratch`."],
          explanation: "Cleaning up temporary folders is part of disciplined terminal work.",
          successFeedback: "You removed the temporary workspace.",
          accepts: [{ command: "rmdir", fileMissing: "C:/Lab/Temp/scratch" }]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-copy-case-note",
      title: "Copy a Case Note Forward",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Copy the current case note into the reports folder without changing the original file.",
      scenarioIntro: "A responder often needs to duplicate a note before editing a report version. Use copy so the learner sees the difference between duplicating and moving a file.",
      commandFocus: ["copy"],
      acceptedCommands: ["copy case-note.txt C:\\Lab\\Reports\\case-note.txt"],
      simulatedOutput: ["1 file(s) copied."],
      successCondition: "Create a copy of case-note.txt under C:\\Lab\\Reports.",
      feedbackText: "The report copy exists and the original note remains in place.",
      environment: {
        cwd: "C:/Lab/Notes",
        directories: ["C:/Lab/Reports"],
        files: [{ path: "C:/Lab/Notes/case-note.txt", content: "Initial case note.\n" }]
      },
      steps: [
        step({
          objective: "Copy case-note.txt into C:\\Lab\\Reports.",
          hints: ["Use copy with a source and destination.", "Keep the original file where it is.", "Try `copy case-note.txt C:\\Lab\\Reports\\case-note.txt`."],
          explanation: "copy preserves the source file while creating a second copy where you need it.",
          successFeedback: "You copied the case note into the reports folder.",
          accepts: [fileExistsMatch("C:/Lab/Reports/case-note.txt", { command: "copy" })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-xcopy-toolkit-bundle",
      title: "Replicate the Toolkit Bundle",
      category: "Files and navigation",
      difficulty: "Intermediate",
      objective: "Copy the whole toolkit bundle into the archive area so the folder structure is preserved.",
      scenarioIntro: "Simple copy is not enough when you need the whole folder tree. Use xcopy so the learner sees the Windows command that handles recursive copy workflows more naturally.",
      commandFocus: ["xcopy"],
      acceptedCommands: ["xcopy Bundle C:\\Lab\\Archive\\Bundle /E /I"],
      simulatedOutput: ["1 File(s) copied"],
      successCondition: "Create a copied Bundle tree under C:\\Lab\\Archive.",
      feedbackText: "The toolkit bundle was replicated with its folder structure intact.",
      environment: {
        cwd: "C:/Lab/Tools",
        directories: ["C:/Lab/Tools/Bundle", "C:/Lab/Tools/Bundle/Docs", "C:/Lab/Archive"],
        files: [
          { path: "C:/Lab/Tools/Bundle/Docs/checklist.txt", content: "Acquisition checklist.\n" },
          { path: "C:/Lab/Tools/Bundle/readme.txt", content: "Toolkit bundle.\n" }
        ]
      },
      steps: [
        step({
          objective: "Copy the Bundle directory tree into C:\\Lab\\Archive.",
          hints: ["Use the recursive copy command.", "Preserve the folder structure while copying Bundle.", "Try `xcopy Bundle C:\\Lab\\Archive\\Bundle /E /I`."],
          explanation: "xcopy is the classic CMD way to duplicate a folder tree without collapsing it into single files.",
          successFeedback: "You copied the toolkit bundle tree.",
          accepts: [fileExistsMatch("C:/Lab/Archive/Bundle/Docs/checklist.txt", { command: "xcopy" })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-move-and-rename-review-note",
      title: "Move and Rename a Review Note",
      category: "Files and navigation",
      difficulty: "Intermediate",
      objective: "Move the draft review note into the reports folder and rename it to its final report name.",
      scenarioIntro: "This mini workflow teaches that moving and renaming are separate concerns in CMD. First relocate the file, then rename it once it is in the right folder.",
      commandFocus: ["move", "ren"],
      acceptedCommands: ["move review-draft.txt C:\\Lab\\Reports\\review-draft.txt", "ren C:\\Lab\\Reports\\review-draft.txt review-final.txt"],
      simulatedOutput: ["1 file(s) moved."],
      successCondition: "Place review-final.txt under C:\\Lab\\Reports.",
      feedbackText: "The draft was relocated and renamed into its report-ready state.",
      environment: {
        cwd: "C:/Lab/Temp",
        directories: ["C:/Lab/Reports"],
        files: [{ path: "C:/Lab/Temp/review-draft.txt", content: "Draft review text.\n" }]
      },
      steps: [
        step({
          objective: "Move review-draft.txt into C:\\Lab\\Reports.",
          hints: ["Relocate the file first.", "Use move with the reports path as the destination.", "Try `move review-draft.txt C:\\Lab\\Reports\\review-draft.txt`."],
          explanation: "move changes the file location without creating a duplicate.",
          successFeedback: "You moved the draft into the reports folder.",
          accepts: [fileExistsMatch("C:/Lab/Reports/review-draft.txt", { command: "move" })]
        }),
        step({
          objective: "Rename the moved file to review-final.txt.",
          hints: ["Now rename the file in its new folder.", "Use ren against the report copy.", "Try `ren C:\\Lab\\Reports\\review-draft.txt review-final.txt`."],
          explanation: "ren is the straightforward CMD command for changing a file name in place.",
          successFeedback: "You renamed the report file.",
          accepts: [fileExistsMatch("C:/Lab/Reports/review-final.txt", { command: "ren" })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-delete-old-dump",
      title: "Purge an Old Dump File",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Delete a stale dump file from the temp folder after confirming the target file name.",
      scenarioIntro: "Temporary dump files quickly clutter a Windows workspace. Use del for a direct clean-up action once the target file is clear.",
      commandFocus: ["del"],
      acceptedCommands: ["del old-dump.txt"],
      simulatedOutput: [],
      successCondition: "Remove old-dump.txt from C:\\Lab\\Temp.",
      feedbackText: "The stale dump file is gone from the temp workspace.",
      environment: {
        cwd: "C:/Lab/Temp",
        files: [{ path: "C:/Lab/Temp/old-dump.txt", content: "old collection data\n" }]
      },
      steps: [
        step({
          objective: "Delete old-dump.txt from the current directory.",
          hints: ["Use the Windows delete command on the file.", "You do not need to move it first.", "Try `del old-dump.txt`."],
          explanation: "del removes a file directly when you are certain the workspace no longer needs it.",
          successFeedback: "You deleted the stale dump file.",
          accepts: [{ command: "del", fileMissing: "C:/Lab/Temp/old-dump.txt" }]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-type-more-audit-log",
      title: "Read a Long Audit Note Safely",
      category: "Files and navigation",
      difficulty: "Beginner",
      objective: "Read the audit log once, then page it through more so the output is easier to review.",
      scenarioIntro: "Large text files can overwhelm new learners. This lesson shows the difference between printing the whole file with type and paging it with more when the output gets long.",
      commandFocus: ["type", "more"],
      acceptedCommands: ["type audit.log", "type audit.log | more"],
      simulatedOutput: ["Line 01: startup ok", "Line 12: archive completed"],
      successCondition: "Read audit.log directly and then run it through more for paged review.",
      feedbackText: "The learner has seen both the raw file read and the paged review workflow.",
      environment: {
        cwd: "C:/Lab/Logs",
        files: [{ path: "C:/Lab/Logs/audit.log", content: "Line 01: startup ok\nLine 02: driver load ok\nLine 03: analyst login ok\nLine 04: share check ok\nLine 05: backup task ready\nLine 06: archive job queued\nLine 07: ip config captured\nLine 08: dns cache warm\nLine 09: service inventory done\nLine 10: spooler monitored\nLine 11: route table reviewed\nLine 12: archive completed\n" }]
      },
      steps: [
        step({
          objective: "Read audit.log directly in CMD.",
          hints: ["Open the file with the Windows text-display command.", "Start with the full file output.", "Try `type audit.log`."],
          explanation: "type is the basic Windows command for reading a text file directly in the terminal.",
          successFeedback: "You printed the audit log.",
          accepts: [rawMatch(/^type\s+audit\.log$/i)]
        }),
        step({
          objective: "Page the same file through more so the output is easier to scan.",
          hints: ["Now send the file output through the pager.", "Use a simple pipeline with more.", "Try `type audit.log | more`."],
          explanation: "more is useful when a file is too long to read comfortably as one burst of output.",
          successFeedback: "You paged the audit log output.",
          accepts: [rawMatch(/^type\s+audit\.log\s*\|\s*more$/i), rawMatch(/^more\s+audit\.log$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-attrib-hidden-plan",
      title: "Review Hidden File Attributes",
      category: "Files and navigation",
      difficulty: "Intermediate",
      objective: "Inspect the attributes on the hidden plan file so you can explain why it does not appear in a normal listing.",
      scenarioIntro: "A responder may know a file exists but not see it in a normal dir result. Use attrib to make the hidden context explicit instead of guessing.",
      commandFocus: ["attrib"],
      acceptedCommands: ["attrib hidden-plan.txt"],
      simulatedOutput: ["H A      C:\\Lab\\Secrets\\hidden-plan.txt"],
      successCondition: "Inspect hidden-plan.txt with attrib.",
      feedbackText: "The hidden attribute is now obvious instead of implied.",
      environment: {
        cwd: "C:/Lab/Secrets",
        files: [{ path: "C:/Lab/Secrets/hidden-plan.txt", content: "Hidden remediation plan.\n", hidden: true, attributes: ["H"] }]
      },
      steps: [
        step({
          objective: "Inspect the attributes on hidden-plan.txt.",
          hints: ["Use the Windows attribute command on the file directly.", "Do not rely on a normal dir listing for this one.", "Try `attrib hidden-plan.txt`."],
          explanation: "attrib exposes file metadata that a beginner would otherwise miss in a normal folder listing.",
          successFeedback: "You inspected the hidden file attributes.",
          accepts: [rawMatch(/^attrib\s+hidden-plan\.txt$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-host-and-user-identity",
      title: "Identify the Host and User",
      category: "System and environment",
      difficulty: "Beginner",
      objective: "Confirm the Windows host name and the current logged-in user context.",
      scenarioIntro: "Before changing anything on a Windows system, learners should know which host and account they are actually using. This keeps the environment context explicit from the start.",
      commandFocus: ["hostname", "whoami"],
      acceptedCommands: ["hostname", "whoami"],
      simulatedOutput: ["LAB-WIN", "LAB\\student"],
      successCondition: "Display both the host name and the active user context.",
      feedbackText: "The learner confirmed both the machine identity and the current account.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Print the host name of this Windows machine.",
          hints: ["Use the command that returns the computer name.", "Stay inside CMD.", "Try `hostname`."],
          explanation: "Host identity is basic but essential context before system work begins.",
          successFeedback: "You confirmed the host name.",
          accepts: [rawMatch(/^hostname$/i)]
        }),
        step({
          objective: "Print the current user context.",
          hints: ["Now show which account is active.", "Use the built-in identity command.", "Try `whoami`."],
          explanation: "User context matters because command results and permissions depend on the active account.",
          successFeedback: "You confirmed the current user context.",
          accepts: [rawMatch(/^whoami$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-build-snapshot",
      title: "Capture a Build Snapshot",
      category: "System and environment",
      difficulty: "Beginner",
      objective: "Collect the full Windows system summary, then confirm the short version string.",
      scenarioIntro: "Build and OS context often matter before troubleshooting. This lesson pairs the verbose system snapshot with the quick version check so learners see both levels of detail.",
      commandFocus: ["systeminfo", "ver"],
      acceptedCommands: ["systeminfo", "ver"],
      simulatedOutput: ["OS Name: Microsoft Windows 10 Enterprise", "Microsoft Windows [Version 10.0.19045]"],
      successCondition: "Run both the full system summary and the short version command.",
      feedbackText: "The learner collected both broad system detail and the fast build check.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Display the full system summary.",
          hints: ["Use the built-in Windows system report command.", "This one gives you the detailed picture.", "Try `systeminfo`."],
          explanation: "systeminfo provides the detailed baseline when you need more than the host name alone.",
          successFeedback: "You captured the system summary.",
          accepts: [rawMatch(/^systeminfo$/i)]
        }),
        step({
          objective: "Confirm the short Windows version string.",
          hints: ["Now use the compact version command.", "You only need the brief OS string.", "Try `ver`."],
          explanation: "ver is useful when you only need a fast Windows version confirmation.",
          successFeedback: "You confirmed the short version string.",
          accepts: [rawMatch(/^ver$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-set-and-echo-lab-role",
      title: "Review and Set Environment Variables",
      category: "System and environment",
      difficulty: "Intermediate",
      objective: "Set a session variable for the analyst role, then echo it back to confirm the value.",
      scenarioIntro: "CMD environment variables matter during repeatable workflows and scripted triage. This lesson keeps it simple: set a variable, then prove the session now knows it.",
      commandFocus: ["set", "echo"],
      acceptedCommands: ["set LAB_ROLE=analyst", "echo %LAB_ROLE%"],
      simulatedOutput: ["LAB_ROLE=analyst", "analyst"],
      successCondition: "Create LAB_ROLE=analyst in the current session and print it back with echo.",
      feedbackText: "The CMD session now carries the analyst role variable and the learner verified it.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Set LAB_ROLE to analyst in the current CMD session.",
          hints: ["Use set with NAME=VALUE syntax.", "The variable name is LAB_ROLE.", "Try `set LAB_ROLE=analyst`."],
          explanation: "Environment variables are useful for lightweight session context and scripted reuse.",
          successFeedback: "You set the session variable.",
          accepts: [envVarMatch("LAB_ROLE", "analyst", { command: "set" })]
        }),
        step({
          objective: "Echo the LAB_ROLE variable so you can confirm the value.",
          hints: ["Use echo with the percent-wrapped variable name.", "Print the variable back to the terminal.", "Try `echo %LAB_ROLE%`."],
          explanation: "Printing the variable back confirms that the session value really exists and is spelled correctly.",
          successFeedback: "You confirmed the session variable value.",
          accepts: [rawMatch(/^echo\s+%LAB_ROLE%$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-date-and-time-check",
      title: "Confirm the Lab Clock",
      category: "System and environment",
      difficulty: "Beginner",
      objective: "Check the current date and time so the case notes line up with the host clock.",
      scenarioIntro: "Time context matters in every investigation. This lesson uses the built-in date and time commands so learners get comfortable checking the Windows host clock directly.",
      commandFocus: ["date", "time"],
      acceptedCommands: ["date", "time"],
      simulatedOutput: ["The current date is: 04/17/2026", "The current time is: 08:24 AM"],
      successCondition: "Display both the current system date and the current system time.",
      feedbackText: "The learner checked the host clock before making timeline assumptions.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Display the current Windows date.",
          hints: ["Use the built-in date command first.", "You only need to read the current value.", "Try `date`."],
          explanation: "Timeline accuracy starts by checking what the host thinks the date is.",
          successFeedback: "You displayed the current date.",
          accepts: [rawMatch(/^date$/i)]
        }),
        step({
          objective: "Display the current Windows time.",
          hints: ["Now check the time component too.", "Use the matching clock command.", "Try `time`."],
          explanation: "Both date and time matter when you align system activity to case notes.",
          successFeedback: "You displayed the current time.",
          accepts: [rawMatch(/^time$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-cls-and-prompt-cleanup",
      title: "Clear and Customise the Prompt",
      category: "System and environment",
      difficulty: "Intermediate",
      objective: "Clear the terminal screen, then set a prompt that shows date, time, and the current path.",
      scenarioIntro: "A clean screen and a more informative prompt make guided terminal learning less confusing. This lesson uses cls and prompt to improve the visible shell context directly.",
      commandFocus: ["cls", "prompt"],
      acceptedCommands: ["cls", "prompt $D $T $P$G"],
      simulatedOutput: ["04/17/2026 08:24 AM C:\\Lab>"],
      successCondition: "Clear the terminal and change the prompt template to include date, time, and path.",
      feedbackText: "The learner cleaned the screen and made the shell context more obvious.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Clear the current CMD screen.",
          hints: ["Use the screen-clearing command.", "This one has no arguments.", "Try `cls`."],
          explanation: "Clearing clutter can make the next command output easier for beginners to follow.",
          successFeedback: "You cleared the screen.",
          accepts: [rawMatch(/^cls$/i)]
        }),
        step({
          objective: "Set the prompt to show date, time, and the current path.",
          hints: ["Use the prompt command with CMD tokens.", "You need date, time, path, and the > symbol.", "Try `prompt $D $T $P$G`."],
          explanation: "A more informative prompt reduces the chance of learners forgetting which path or session they are in.",
          successFeedback: "You updated the CMD prompt template.",
          accepts: [promptTemplateMatch("$D $T $P$G", { command: "prompt" })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-ipconfig-and-getmac-audit",
      title: "Ipconfig Family: Local Network Settings",
      category: "Networking",
      difficulty: "Beginner",
      objective: "Use the ipconfig family in layers: quick view, detailed view, DNS cache, clear cache, then verify settings.",
      scenarioIntro: "Start with the base ipconfig command, then add one option at a time so each variation has a clear job.",
      commandFocus: ["ipconfig"],
      commandFamilyIntro: WINDOWS_COMMAND_FAMILIES.ipconfig,
      acceptedCommands: ["ipconfig", "ipconfig /all", "ipconfig /displaydns", "ipconfig /flushdns"],
      simulatedOutput: ["IPv4 Address . . . . . . . . . . : 192.168.56.25", "DNS Servers . . . . . . . . . . : 192.168.56.1", "Successfully flushed the DNS Resolver Cache."],
      successCondition: "Run the ipconfig family from base view through DNS cache verification.",
      feedbackText: "The learner used ipconfig variations without needing hidden command knowledge.",
      visualGuide: {
        type: "network",
        nodes: ["Your PC settings", "Gateway", "DNS"],
        highlightAfter: {
          ipconfig: "Your PC settings"
        },
        commandMap: [
          { command: "ipconfig", icon: "🖥️", meaning: "quick PC settings" },
          { command: "ipconfig /all", icon: "🔎", meaning: "detailed PC settings" },
          { command: "ipconfig /displaydns", icon: "📄", meaning: "saved DNS answers" },
          { command: "ipconfig /flushdns", icon: "🧹", meaning: "clear DNS cache" }
        ]
      },
      walkthrough: [
        {
          title: "Base ipconfig",
          goal: "See basic IP settings.",
          command: "ipconfig",
          output: ["IPv4 Address . . . . . . . . . . : 192.168.56.25"],
          explanation: "This proves the quick local network view. Next variation: ipconfig /all."
        },
        {
          title: "Detailed ipconfig",
          goal: "Find DNS and adapter details.",
          command: "ipconfig /all",
          output: ["DNS Servers . . . . . . . . . . : 192.168.56.1"],
          explanation: "This proves the DNS server. Next variation: ipconfig /displaydns."
        },
        {
          title: "Display DNS cache",
          goal: "See saved DNS answers.",
          command: "ipconfig /displaydns",
          output: ["Record Name . . . . . : fileserver"],
          explanation: "This proves saved DNS answers are visible. Next variation: ipconfig /flushdns."
        },
        {
          title: "Flush DNS cache",
          goal: "Clear saved DNS answers.",
          command: "ipconfig /flushdns",
          output: ["Successfully flushed the DNS Resolver Cache."],
          explanation: "This proves the simulated clear action ran. Next variation: ipconfig."
        },
        {
          title: "Verify settings",
          goal: "Check the quick view again.",
          command: "ipconfig",
          output: ["IPv4 Address . . . . . . . . . . : 192.168.56.25"],
          explanation: "This verifies the next check after clearing saved DNS answers."
        }
      ],
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Use the ipconfig family. Run the base command to see basic IP settings. Variations are shown in the Command Family Intro.",
          commandFamily: "ipconfig",
          hints: ["Start with the base command.", "Use the chip labelled ipconfig if you want it filled in.", "Try `ipconfig`."],
          explanation: "The base ipconfig command gives the quick local network view.",
          successFeedback: "Checked basic network info.",
          walkthrough: [{
            title: "Base ipconfig",
            goal: "See the quick local network view.",
            command: "ipconfig",
            output: ["IPv4 Address . . . . . . . . . . : 192.168.56.25", "Default Gateway . . . . . . . . : 192.168.56.1"],
            explanation: "This proves the PC has an IP address and gateway. Next variation: ipconfig /all."
          }],
          accepts: [rawMatch(/^ipconfig$/i)]
        }),
        step({
          objective: "Use the ipconfig family. Run the detailed version to find DNS server and MAC/address details.",
          commandFamily: "ipconfig",
          hints: ["You need the detailed ipconfig version.", "Look at the variation chips.", "Try `ipconfig /all`."],
          explanation: "ipconfig /all adds DNS, DHCP, and physical-address detail.",
          successFeedback: "Found DNS server.",
          walkthrough: [{
            title: "Detailed ipconfig",
            goal: "Find DNS and adapter details.",
            command: "ipconfig /all",
            output: ["Physical Address. . . . . . . . . : 00-0C-29-5E-11-22", "DNS Servers . . . . . . . . . . : 192.168.56.1"],
            explanation: "This proves which DNS server and adapter identity the PC is using. Next variation: ipconfig /displaydns."
          }],
          accepts: [rawMatch(/^ipconfig\s+\/all$/i)]
        }),
        step({
          objective: "Use the ipconfig family. You need the version that shows saved DNS answers.",
          commandFamily: "ipconfig",
          hints: ["Look for the DNS cache variation.", "The chip says displaydns.", "Try `ipconfig /displaydns`."],
          explanation: "ipconfig /displaydns shows cached name answers.",
          successFeedback: "Viewed DNS cache.",
          walkthrough: [{
            title: "Display DNS cache",
            goal: "See saved DNS answers.",
            command: "ipconfig /displaydns",
            output: ["Record Name . . . . . : fileserver", "A (Host) Record . . . : 192.168.56.20"],
            explanation: "This proves the PC has a saved DNS answer. Next variation: ipconfig /flushdns."
          }],
          accepts: [rawMatch(/^ipconfig\s+\/displaydns$/i)]
        }),
        step({
          objective: "Use the ipconfig family. Clear saved DNS answers in this simulated lab.",
          commandFamily: "ipconfig",
          hints: ["Look for the clear-DNS variation.", "This is simulated in the lab.", "Try `ipconfig /flushdns`."],
          explanation: "ipconfig /flushdns clears the resolver cache in this simulated lab.",
          successFeedback: "Cleared DNS cache.",
          walkthrough: [{
            title: "Flush DNS cache",
            goal: "Clear saved DNS answers.",
            command: "ipconfig /flushdns",
            output: ["Successfully flushed the DNS Resolver Cache."],
            explanation: "This proves the cache-clear action ran. Next variation: verify with ipconfig again."
          }],
          accepts: [rawMatch(/^ipconfig\s+\/flushdns$/i)]
        }),
        step({
          objective: "Verify with the ipconfig family. Run ipconfig again to confirm settings are still visible.",
          commandFamily: "ipconfig",
          hints: ["Use a safe verification command.", "The base command is enough.", "Try `ipconfig`."],
          explanation: "A final quick view verifies the local network settings remain readable.",
          successFeedback: "Verified settings.",
          walkthrough: [{
            title: "Verify settings",
            goal: "Check the quick view again.",
            command: "ipconfig",
            output: ["IPv4 Address . . . . . . . . . . : 192.168.56.25"],
            explanation: "This verifies the next check after clearing saved DNS answers."
          }],
          accepts: [rawMatch(/^ipconfig$/i), rawMatch(/^nslookup\s+(?:fileserver|web-lab)$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-ping-fileserver",
      title: "Reachability Check on the File Server",
      category: "Networking",
      difficulty: "Beginner",
      objective: "Test basic reachability to the file server before you troubleshoot anything deeper.",
      scenarioIntro: "Ping is still useful when the learner needs a first yes-or-no answer about host reachability. Keep it focused on the Windows file server so the shell context and target context remain simple.",
      commandFocus: ["ping"],
      acceptedCommands: ["ping fileserver", "ping 192.168.56.20"],
      simulatedOutput: ["Reply from 192.168.56.20: bytes=32 time<1ms TTL=128"],
      successCondition: "Send an ICMP reachability check to fileserver.",
      feedbackText: "The learner proved the file server responds before escalating to route or service checks.",
      environment: {
        cwd: "C:/Lab",
        targets: selectTargets("fileserver")
      },
      steps: [
        step({
          objective: "Ping the file server from this Windows host.",
          hints: ["Use the built-in Windows reachability command.", "The target can be fileserver or 192.168.56.20.", "Try `ping fileserver`."],
          explanation: "A basic reachability test is still a sensible first move before deeper networking steps.",
          successFeedback: "You confirmed the file server responds to ping.",
          accepts: [rawMatch(/^ping\s+(?:fileserver|192\.168\.56\.20)$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-tracert-and-pathping-web-lab",
      title: "Tracert Family: Trace the Path",
      category: "Networking",
      difficulty: "Intermediate",
      objective: "Use the tracert family in layers: normal trace, no-name lookup trace, hop limit, then verify reachability.",
      scenarioIntro: "Use tracert when ping is not enough and you need to see the path to a target.",
      commandFocus: ["tracert"],
      commandFamilyIntro: WINDOWS_COMMAND_FAMILIES.tracert,
      acceptedCommands: ["tracert web-lab", "tracert -d web-lab", "tracert -h 5 web-lab", "tracert -4 web-lab"],
      simulatedOutput: ["Tracing route to web-lab [192.168.56.10]", "Trace complete."],
      successCondition: "Run layered tracert variations against web-lab.",
      feedbackText: "The learner used tracert variations to inspect and verify the path.",
      visualGuide: {
        type: "network",
        nodes: ["Your PC", "Gateway", "DNS/Server"],
        highlightAfter: {
          tracert: "DNS/Server",
          ping: "Gateway"
        },
        commandMap: [
          { command: "tracert", icon: "🛣️", meaning: "show path" },
          { command: "tracert -d", icon: "🔢", meaning: "skip names" },
          { command: "tracert -h 5", icon: "5", meaning: "limit hops" }
        ]
      },
      environment: {
        cwd: "C:/Lab",
        targets: selectTargets("web-lab")
      },
      steps: [
        step({
          objective: "Use the tracert family. Run a normal trace to web-lab.",
          commandFamily: "tracert",
          hints: ["Start with the base tracert shape.", "The target is web-lab.", "Try `tracert web-lab`."],
          explanation: "tracert shows the hop path without deeper tooling.",
          successFeedback: "You traced the route to web-lab.",
          walkthrough: [{
            title: "Normal trace",
            goal: "Show the path to web-lab.",
            command: "tracert web-lab",
            output: ["1  192.168.56.1", "2  192.168.56.10", "Trace complete."],
            explanation: "This proves the path reaches the server. Next variation: tracert -d."
          }],
          accepts: [rawMatch(/^tracert\s+(?:web-lab|192\.168\.56\.10)$/i)]
        }),
        step({
          objective: "Use the tracert family. Run the version that skips name lookups.",
          commandFamily: "tracert",
          hints: ["Look for the no-name lookup variation.", "It uses -d.", "Try `tracert -d web-lab`."],
          explanation: "tracert -d keeps the output numeric and often faster.",
          successFeedback: "Traced path without name lookups.",
          walkthrough: [{
            title: "No-name trace",
            goal: "Trace using numeric hops.",
            command: "tracert -d web-lab",
            output: ["1  192.168.56.1", "2  192.168.56.10"],
            explanation: "This proves the route without waiting for hop names. Next variation: tracert -h 5."
          }],
          accepts: [rawMatch(/^tracert\s+-d\s+(?:web-lab|192\.168\.56\.10)$/i)]
        }),
        step({
          objective: "Use the tracert family. Limit the trace to 5 hops.",
          commandFamily: "tracert",
          hints: ["Look for the hop-limit variation.", "The limit is 5.", "Try `tracert -h 5 web-lab`."],
          explanation: "A hop limit keeps a trace bounded during troubleshooting.",
          successFeedback: "Limited the trace depth.",
          accepts: [rawMatch(/^tracert\s+-h\s+5\s+(?:web-lab|192\.168\.56\.10)$/i)]
        }),
        step({
          objective: "Verify the path check with tracert -4 or a normal tracert.",
          commandFamily: "tracert",
          hints: ["Use a verification variation.", "IPv4 is fine in this lab.", "Try `tracert -4 web-lab`."],
          explanation: "A final trace verifies the path using the intended address family.",
          successFeedback: "Verified the traced path.",
          accepts: [rawMatch(/^tracert\s+-4\s+(?:web-lab|192\.168\.56\.10)$/i), rawMatch(/^tracert\s+(?:web-lab|192\.168\.56\.10)$/i), rawMatch(/^ping\s+(?:web-lab|192\.168\.56\.10)$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-nslookup-fileserver",
      title: "Nslookup Family: Resolve Names",
      category: "Networking",
      difficulty: "Beginner",
      objective: "Use nslookup variations to resolve a hostname, reverse-check an IP, and query a specific DNS server.",
      scenarioIntro: "DNS checks are easier when the learner can see the nslookup variations before the task asks for them.",
      commandFocus: ["nslookup"],
      commandFamilyIntro: WINDOWS_COMMAND_FAMILIES.nslookup,
      acceptedCommands: ["nslookup fileserver", "nslookup 192.168.56.20", "nslookup fileserver 192.168.56.1"],
      simulatedOutput: ["Name:    fileserver", "Address: 192.168.56.20"],
      successCondition: "Resolve names with the layered nslookup family.",
      feedbackText: "The learner separated DNS evidence from reachability evidence.",
      visualGuide: {
        type: "network",
        nodes: ["Name", "DNS", "IP address"],
        highlightAfter: {
          nslookup: "IP address"
        },
        commandMap: [
          { command: "nslookup fileserver", icon: "DNS", meaning: "name to IP" },
          { command: "nslookup 192.168.56.20", icon: "IP", meaning: "IP to name" }
        ]
      },
      environment: {
        cwd: "C:/Lab",
        targets: selectTargets("fileserver")
      },
      steps: [
        step({
          objective: "Use the nslookup family. Resolve fileserver to an IP address.",
          commandFamily: "nslookup",
          hints: ["Start with hostname to IP.", "The hostname is fileserver.", "Try `nslookup fileserver`."],
          explanation: "nslookup is the Windows-native way to confirm name resolution directly from the shell.",
          successFeedback: "You resolved the file server name.",
          walkthrough: [{
            title: "Hostname lookup",
            goal: "Resolve fileserver to an IP address.",
            command: "nslookup fileserver",
            output: ["Name:    fileserver", "Address: 192.168.56.20"],
            explanation: "This proves DNS can turn the name into an IP. Next variation: nslookup 192.168.56.20."
          }],
          accepts: [rawMatch(/^nslookup\s+fileserver$/i)]
        }),
        step({
          objective: "Use the nslookup family. Reverse-check the file server IP address.",
          commandFamily: "nslookup",
          hints: ["Now query the IP address.", "The file server IP is 192.168.56.20.", "Try `nslookup 192.168.56.20`."],
          explanation: "An IP lookup can confirm the address belongs to the expected name.",
          successFeedback: "Reverse-checked the IP address.",
          accepts: [rawMatch(/^nslookup\s+192\.168\.56\.20$/i)]
        }),
        step({
          objective: "Use the nslookup family. Ask the known DNS server directly.",
          commandFamily: "nslookup",
          hints: ["Add the DNS server after the hostname.", "The DNS server is 192.168.56.1.", "Try `nslookup fileserver 192.168.56.1`."],
          explanation: "Specifying the DNS server proves which resolver answered.",
          successFeedback: "Queried a specific DNS server.",
          accepts: [rawMatch(/^nslookup\s+fileserver\s+192\.168\.56\.1$/i), rawMatch(/^nslookup\s+fileserver$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-netstat-connection-audit",
      title: "Netstat Family: Connections and Ports",
      category: "Networking",
      difficulty: "Intermediate",
      objective: "Use the netstat family in layers: list connections, show listeners, add process IDs, then filter one port.",
      scenarioIntro: "Netstat variations build from a quick connection view into process and port evidence.",
      commandFocus: ["netstat"],
      commandFamilyIntro: WINDOWS_COMMAND_FAMILIES.netstat,
      acceptedCommands: ["netstat", "netstat -a", "netstat -ano", "netstat -ano | findstr :445"],
      simulatedOutput: ["Proto  Local Address          Foreign Address        State           PID", "TCP    0.0.0.0:445          0.0.0.0:0              LISTENING       4"],
      successCondition: "Display netstat output with listening ports and owning process IDs.",
      feedbackText: "The learner connected network sockets to processes instead of treating them as anonymous ports.",
      visualGuide: {
        type: "network",
        nodes: ["Computer", "open ports", "process ID"],
        highlightAfter: {
          netstat: "process ID"
        },
        commandMap: [
          { command: "netstat", icon: "NET", meaning: "connections" },
          { command: "netstat -a", icon: "A", meaning: "listeners" },
          { command: "netstat -ano", icon: "PID", meaning: "process IDs" }
        ]
      },
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Use the netstat family. Run the base command to list current connections.",
          commandFamily: "netstat",
          hints: ["Start with the base command.", "The netstat chip can fill it in.", "Try `netstat`."],
          explanation: "The base command gives a quick connection list.",
          successFeedback: "Listed connections.",
          walkthrough: [{
            title: "Base netstat",
            goal: "List current connections.",
            command: "netstat",
            output: ["Proto  Local Address          Foreign Address        State", "TCP    192.168.56.25:49712  192.168.56.10:443  ESTABLISHED"],
            explanation: "This proves which connections exist. Next variation: netstat -a."
          }],
          accepts: [rawMatch(/^netstat$/i)]
        }),
        step({
          objective: "Use the netstat family. Show listening ports too.",
          commandFamily: "netstat",
          hints: ["Look for the all/listeners variation.", "It uses -a.", "Try `netstat -a`."],
          explanation: "netstat -a includes listening ports.",
          successFeedback: "Found listening ports.",
          accepts: [rawMatch(/^netstat\s+-a$/i)]
        }),
        step({
          objective: "Use the netstat family. Add numeric addresses and process IDs.",
          commandFamily: "netstat",
          hints: ["You need all, numeric, and owning-process flags.", "Flag order can vary.", "Try `netstat -ano`."],
          explanation: "netstat -ano ties sockets to process IDs.",
          successFeedback: "Found process ID.",
          accepts: [rawMatch(/^netstat\s+-ano$/i), rawMatch(/^netstat\s+-aon$/i), rawMatch(/^netstat\s+-oan$/i)]
        }),
        step({
          objective: "Use the netstat family. Filter the PID view to port 445.",
          commandFamily: "netstat",
          hints: ["Use netstat -ano, then findstr for :445.", "This filters one port.", "Try `netstat -ano | findstr :445`."],
          explanation: "Filtering keeps the table focused on one port.",
          successFeedback: "Matched port to process.",
          accepts: [rawMatch(/^netstat\s+-(?:ano|aon|oan)\s*\|\s*findstr\s+:445$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-arp-and-route-review",
      title: "ARP and Route Families: Neighbor and Gateway Clues",
      category: "Networking",
      difficulty: "Intermediate",
      objective: "Use arp to inspect IP-to-MAC mappings, then route print to inspect gateways and route choices.",
      scenarioIntro: "ARP and route answer different questions. ARP maps nearby IPs to MAC addresses; route print shows where traffic goes next.",
      commandFocus: ["arp", "route print"],
      commandFamilyIntros: [WINDOWS_COMMAND_FAMILIES.arp, WINDOWS_COMMAND_FAMILIES.route],
      acceptedCommands: ["arp -a", "arp -d", "route print", "route print -4", "route add", "route delete"],
      simulatedOutput: ["Interface: 192.168.56.25 --- 0x6", "IPv4 Route Table"],
      successCondition: "Run arp -a and then route print on the current Windows host.",
      feedbackText: "The learner collected both neighbor-table and route-table evidence without mixing the two concepts.",
      visualGuide: {
        type: "network",
        nodes: ["IP address", "MAC address", "route table", "gateway"],
        highlightAfter: {
          arp: "MAC address",
          route: "gateway",
          netstat: "route table"
        },
        commandMap: [
          { command: "arp -a", icon: "ARP", meaning: "IP to MAC" },
          { command: "route print", icon: "RT", meaning: "route table" }
        ]
      },
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Use the arp family. Review the ARP cache on the current Windows host.",
          commandFamily: "arp",
          hints: ["Start with the ARP cache listing.", "This is the local IP-to-MAC view.", "Try `arp -a`."],
          explanation: "ARP shows which IP-to-MAC mappings the host already knows on the local segment.",
          successFeedback: "Mapped IP address to MAC address.",
          walkthrough: [{
            title: "ARP cache",
            goal: "Show IP-to-MAC mappings.",
            command: "arp -a",
            output: ["192.168.56.1    08-00-27-AA-BB-CC    dynamic"],
            explanation: "This proves the local neighbor mapping. Next family: route print."
          }],
          accepts: [rawMatch(/^arp\s+-a$/i), rawMatch(/^arp$/i)]
        }),
        step({
          objective: "Use the arp family. Try the simulated delete variation so you know it exists.",
          commandFamily: "arp",
          hints: ["This is simulated in the lab.", "Look for the arp delete variation.", "Try `arp -d`."],
          explanation: "arp -d removes cached ARP entries on a real computer, so this lab only simulates it.",
          successFeedback: "Practised simulated ARP delete.",
          accepts: [rawMatch(/^arp\s+-d$/i)]
        }),
        step({
          objective: "Use the route family. Print the current route table.",
          commandFamily: "route",
          hints: ["Now move from local neighbor data to routing data.", "Use route with print.", "Try `route print`."],
          explanation: "route print shows the network paths the host will actually prefer once traffic leaves the local segment.",
          successFeedback: "Opened route table.",
          walkthrough: [{
            title: "Route table",
            goal: "Show destinations and gateways.",
            command: "route print",
            output: ["Network Destination        Netmask          Gateway", "0.0.0.0                    0.0.0.0          192.168.56.1"],
            explanation: "This proves the default gateway. Next variation: route print -4."
          }],
          accepts: [rawMatch(/^route\s+print$/i), rawMatch(/^netstat\s+-r$/i)]
        }),
        step({
          objective: "Use the route family. Show IPv4 routes only.",
          commandFamily: "route",
          hints: ["Look for the IPv4 route variation.", "It adds -4.", "Try `route print -4`."],
          explanation: "route print -4 narrows the table to IPv4 routes.",
          successFeedback: "Filtered IPv4 routes.",
          accepts: [rawMatch(/^route\s+print\s+-4$/i), rawMatch(/^route\s+print$/i), rawMatch(/^netstat\s+-r$/i)]
        }),
        step({
          objective: "Use the route family. Try the simulated route add variation.",
          commandFamily: "route",
          hints: ["This is simulated in the lab.", "Look for route add in the variations.", "Try `route add`."],
          explanation: "route add can change real routing, so this lab only simulates it.",
          successFeedback: "Practised simulated route add.",
          accepts: [rawMatch(/^route\s+add(?:\s+.*)?$/i)]
        }),
        step({
          objective: "Use the route family. Try the simulated route delete variation.",
          commandFamily: "route",
          hints: ["This is simulated in the lab.", "Look for route delete in the variations.", "Try `route delete`."],
          explanation: "route delete can change real routing, so this lab only simulates it.",
          successFeedback: "Practised simulated route delete.",
          accepts: [rawMatch(/^route\s+delete(?:\s+.*)?$/i)]
        }),
        step({
          objective: "Use the route family. Verify the route table with route print or netstat -r.",
          commandFamily: "route",
          hints: ["Both commands can show route-table evidence.", "Use the chips if you want the route version.", "Try `route print`."],
          explanation: "route print and netstat -r can both show route-table evidence.",
          successFeedback: "Verified gateway route.",
          accepts: [rawMatch(/^route\s+print(?:\s+-4|\s+-6)?$/i), rawMatch(/^netstat\s+-r$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-tasklist-and-wmic-inventory",
      title: "Running Process Inventory",
      category: "Processes and services",
      difficulty: "Intermediate",
      objective: "Inspect the running process list with tasklist, then confirm the same idea with WMIC's brief process view.",
      scenarioIntro: "Windows learners should know there is more than one way to inspect processes. This lesson starts with tasklist and then reinforces the inventory concept with WMIC.",
      commandFocus: ["tasklist", "wmic process list brief"],
      acceptedCommands: ["tasklist", "wmic process list brief"],
      simulatedOutput: ["Image Name                     PID", "Caption                ProcessId"],
      successCondition: "Run both tasklist and WMIC's brief process listing.",
      feedbackText: "The learner saw two CMD-native ways to inventory running processes.",
      environment: {
        cwd: "C:/Lab",
        processes: [
          { pid: 2210, name: "updater.exe", user: "SYSTEM", cpu: "44", memory: "20", command: "updater.exe /scheduled" },
          { pid: 1504, name: "spoolsv.exe", user: "SYSTEM", cpu: "2", memory: "18", command: "spoolsv.exe" },
          { pid: 991, name: "explorer.exe", user: "student", cpu: "2", memory: "85", command: "explorer.exe" }
        ]
      },
      steps: [
        step({
          objective: "List the running processes with tasklist.",
          hints: ["Start with the primary Windows process listing command.", "You only need the full process table first.", "Try `tasklist`."],
          explanation: "tasklist is the default Windows command learners should know for process visibility.",
          successFeedback: "You listed the running tasks.",
          accepts: [rawMatch(/^tasklist$/i)]
        }),
        step({
          objective: "Show the brief WMIC process inventory as well.",
          hints: ["Use WMIC for the alternate brief process view.", "This command is longer but still common in older Windows workflows.", "Try `wmic process list brief`."],
          explanation: "WMIC reinforces that Windows process inspection is not limited to one command surface.",
          successFeedback: "You displayed the WMIC process view.",
          accepts: [rawMatch(/^wmic\s+process\s+list\s+brief$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-taskkill-updater",
      title: "Terminate a Runaway Worker",
      category: "Processes and services",
      difficulty: "Intermediate",
      objective: "Terminate the runaway updater process by PID once the task is identified.",
      scenarioIntro: "A process inventory is only useful if the learner can act on it. This lesson focuses on the direct containment move: stopping a known bad PID with taskkill.",
      commandFocus: ["taskkill"],
      acceptedCommands: ["taskkill /PID 2210 /F"],
      simulatedOutput: ["SUCCESS: Sent termination signal to PID 2210."],
      successCondition: "Terminate PID 2210 from the Windows process list.",
      feedbackText: "The runaway process was removed from the host process table.",
      environment: {
        cwd: "C:/Lab",
        processes: [
          { pid: 2210, name: "updater.exe", user: "SYSTEM", cpu: "44", memory: "20", command: "updater.exe /scheduled" },
          { pid: 991, name: "explorer.exe", user: "student", cpu: "2", memory: "85", command: "explorer.exe" }
        ]
      },
      steps: [
        step({
          objective: "Terminate PID 2210 with force enabled.",
          hints: ["Use taskkill with the PID switch.", "The target PID is 2210.", "Try `taskkill /PID 2210 /F`."],
          explanation: "taskkill is safest when the learner targets the exact PID instead of guessing at a name.",
          successFeedback: "You terminated the updater process.",
          accepts: [{ command: "taskkill", fileMissing: "", postCheck: (_, state) => !state.processes.some((process) => process.pid === 2210) }]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-sc-query-spooler",
      title: "Check Service State",
      category: "Processes and services",
      difficulty: "Intermediate",
      objective: "Check the status of the Print Spooler service before you decide whether it needs intervention.",
      scenarioIntro: "Services and processes are related but not identical. This lesson teaches the service-status view explicitly with sc query so the learner sees the Windows service-management surface.",
      commandFocus: ["sc query"],
      acceptedCommands: ["sc query Spooler"],
      simulatedOutput: ["SERVICE_NAME: Spooler", "STATE              : 4  RUNNING"],
      successCondition: "Query the Spooler service state with sc.",
      feedbackText: "The learner confirmed service state before taking action.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Query the Spooler service status.",
          hints: ["Use sc with the query action.", "The service name is Spooler.", "Try `sc query Spooler`."],
          explanation: "sc query gives direct service state without forcing a start or stop action first.",
          successFeedback: "You queried the Spooler service.",
          accepts: [rawMatch(/^sc\s+query\s+Spooler$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-net-stop-start-spooler",
      title: "Stop and Start the Spooler",
      category: "Processes and services",
      difficulty: "Intermediate",
      objective: "Stop the Print Spooler service, then start it again cleanly.",
      scenarioIntro: "Once the learner can check a service, the next skill is controlled restart. This lesson uses net stop and net start on the same named service so the action stays obvious.",
      commandFocus: ["net stop", "net start"],
      acceptedCommands: ["net stop Spooler", "net start Spooler"],
      simulatedOutput: ["The Print Spooler service was stopped successfully.", "The Print Spooler service was started successfully."],
      successCondition: "Set Spooler to stopped and then back to running.",
      feedbackText: "The learner practiced a clean service restart rather than jumping straight to process killing.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Stop the Spooler service.",
          hints: ["Use the NET service-control command to stop the service.", "The service name is Spooler.", "Try `net stop Spooler`."],
          explanation: "net stop is the simpler Windows service-control surface for routine restarts.",
          successFeedback: "You stopped the Spooler service.",
          accepts: [serviceStatusMatch("Spooler", "STOPPED", { raw: /^net\s+stop\s+Spooler$/i })]
        }),
        step({
          objective: "Start the Spooler service again.",
          hints: ["Bring the same service back online.", "Use the matching NET start action.", "Try `net start Spooler`."],
          explanation: "Restarting cleanly after a controlled stop reinforces the difference between service control and process termination.",
          successFeedback: "You started the Spooler service again.",
          accepts: [serviceStatusMatch("Spooler", "RUNNING", { raw: /^net\s+start\s+Spooler$/i })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-driverquery-review",
      title: "Review Loaded Drivers",
      category: "Processes and services",
      difficulty: "Intermediate",
      objective: "Inspect the driver inventory so you can verify which major kernel and device drivers are present.",
      scenarioIntro: "Driver state is a different layer from services and user processes. This lesson introduces driverquery so learners can separate device-driver visibility from everything else in Windows.",
      commandFocus: ["driverquery"],
      acceptedCommands: ["driverquery"],
      simulatedOutput: ["Module Name  Display Name", "Tcpip        TCP/IP Protocol Driver"],
      successCondition: "Display the current driver inventory with driverquery.",
      feedbackText: "The learner saw the Windows driver inventory without confusing it with services or processes.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "List the current Windows drivers.",
          hints: ["Use the built-in driver inventory command.", "You only need the direct command here.", "Try `driverquery`."],
          explanation: "driverquery surfaces a Windows layer that many beginners overlook until a troubleshooting scenario demands it.",
          successFeedback: "You reviewed the driver inventory.",
          accepts: [rawMatch(/^driverquery$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-query-user-sessions",
      title: "Review Logged-On Sessions",
      category: "Processes and services",
      difficulty: "Beginner",
      objective: "Inspect the currently logged-on or disconnected user sessions on the host.",
      scenarioIntro: "User-session awareness matters when the learner needs to understand whether another admin or analyst has touched the box recently. query user provides that quick session picture.",
      commandFocus: ["query user"],
      acceptedCommands: ["query user"],
      simulatedOutput: ["USERNAME              SESSIONNAME        ID  STATE", "student               console            1  Active"],
      successCondition: "Display the current Windows user-session table.",
      feedbackText: "The learner gathered session context before making assumptions about who used the host.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Show the current Windows user sessions.",
          hints: ["Use the query command against user sessions.", "The subcommand is user.", "Try `query user`."],
          explanation: "query user is a fast way to see active and disconnected sessions without leaving CMD.",
          successFeedback: "You reviewed the user-session table.",
          accepts: [rawMatch(/^query\s+user$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-net-user-analyst",
      title: "Review a Local User",
      category: "Users, shares, and admin tasks",
      difficulty: "Beginner",
      objective: "Inspect the local analyst account so you can confirm its status and group membership.",
      scenarioIntro: "Account context should be explicit for beginners. net user is the quickest CMD path to local-account details without opening a GUI tool.",
      commandFocus: ["net user"],
      acceptedCommands: ["net user analyst"],
      simulatedOutput: ["User name                    analyst", "Local Group Memberships      Administrators, Remote Desktop Users"],
      successCondition: "Display the local analyst account record.",
      feedbackText: "The learner checked the user record directly from CMD.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Inspect the analyst local account.",
          hints: ["Use NET with the user subcommand.", "The local account name is analyst.", "Try `net user analyst`."],
          explanation: "net user is the standard CMD tool for quick local-account inspection.",
          successFeedback: "You reviewed the analyst account.",
          accepts: [rawMatch(/^net\s+user\s+analyst$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-net-localgroup-admins",
      title: "Audit the Administrators Group",
      category: "Users, shares, and admin tasks",
      difficulty: "Beginner",
      objective: "Review who belongs to the local Administrators group on this machine.",
      scenarioIntro: "Privilege context matters. This lesson uses net localgroup so the learner can check local administrative membership directly from CMD.",
      commandFocus: ["net localgroup"],
      acceptedCommands: ["net localgroup Administrators"],
      simulatedOutput: ["Alias name     Administrators", "Administrator", "analyst"],
      successCondition: "Display the member list for the local Administrators group.",
      feedbackText: "The learner confirmed which accounts hold local administrative access.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "List the local Administrators group membership.",
          hints: ["Use NET with the localgroup subcommand.", "The group name is Administrators.", "Try `net localgroup Administrators`."],
          explanation: "Group membership is often the fastest way to understand local privilege on a Windows host.",
          successFeedback: "You reviewed the Administrators group.",
          accepts: [rawMatch(/^net\s+localgroup\s+Administrators$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-net-share-audit",
      title: "Review Shared Resources",
      category: "Users, shares, and admin tasks",
      difficulty: "Beginner",
      objective: "Inspect the currently shared folders so you know what this Windows host exposes.",
      scenarioIntro: "Before mapping or browsing shares, the learner should know what the Windows host claims to expose. net share provides that local share inventory directly.",
      commandFocus: ["net share"],
      acceptedCommands: ["net share"],
      simulatedOutput: ["Share name   Resource", "Tools        C:\\Lab\\Shares\\Tools"],
      successCondition: "Display the local share inventory with net share.",
      feedbackText: "The learner reviewed the share surface before interacting with it.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "List the currently shared folders.",
          hints: ["Use NET with the share subcommand.", "This one does not need a share name yet.", "Try `net share`."],
          explanation: "net share gives the local Windows share inventory without needing PowerShell or GUI tools.",
          successFeedback: "You reviewed the share inventory.",
          accepts: [rawMatch(/^net\s+share$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-net-use-map-tools",
      title: "Map the Tools Share",
      category: "Users, shares, and admin tasks",
      difficulty: "Intermediate",
      objective: "Map the remote Tools share to drive Z:, then verify the mapping table.",
      scenarioIntro: "Mapping a share makes the remote context concrete for beginners. This lesson uses net use both to create the mapping and to confirm it exists afterward.",
      commandFocus: ["net use"],
      acceptedCommands: ["net use Z: \\\\fileserver\\Tools", "net use"],
      simulatedOutput: ["The command completed successfully.", "Z: is now connected to \\\\fileserver\\Tools"],
      successCondition: "Map Z: to \\\\fileserver\\Tools and then display the mapping list.",
      feedbackText: "The learner created a usable share mapping and verified it from CMD.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Map drive Z: to the remote Tools share.",
          hints: ["Use NET USE with a drive letter and UNC path.", "The remote share is \\\\fileserver\\Tools.", "Try `net use Z: \\\\fileserver\\Tools`."],
          explanation: "Mapping a share makes later file work easier and reinforces UNC path awareness.",
          successFeedback: "You mapped the remote Tools share.",
          accepts: [mappedShareMatch("Z:", "\\\\fileserver\\Tools", { raw: /^net\s+use\s+Z:\s+\\\\fileserver\\Tools$/i })]
        }),
        step({
          objective: "Display the current mapping table so you can verify Z: is present.",
          hints: ["Now list the current NET USE mappings.", "You only need the subcommand by itself.", "Try `net use`."],
          explanation: "Verifying the mapping table stops the learner from assuming the drive letter mapped correctly.",
          successFeedback: "You confirmed the share mapping table.",
          accepts: [rawMatch(/^net\s+use$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-staged-share-access-triage",
      title: "Share Access Incident Review",
      category: "Troubleshooting",
      difficulty: "Beginner",
      role: "Junior Support Technician",
      estimatedTime: "10-15 minutes",
      scenarioType: "Troubleshooting",
      objective: "Confirm local network health, validate name resolution, and restore access to the shared tools location.",
      missionBriefing: "A user reports they cannot reach the internal tools share from their workstation. Confirm the workstation configuration, verify server reachability and DNS resolution, then re-establish and verify the expected share mapping before you close the case.",
      learningObjectives: [
        "Confirm local Windows network settings before testing remote services",
        "Separate reachability evidence from DNS evidence",
        "Verify a share mapping instead of assuming the access issue is resolved"
      ],
      successCriteria: [
        "Review local IP configuration",
        "Confirm the file server is reachable",
        "Validate DNS resolution for the host",
        "Map and verify the required share"
      ],
      environmentNotes: "This is a controlled training shell. Commands behave like a safe Windows lab and are intended to reinforce incident workflow rather than full operating system behavior.",
      verificationRequired: true,
      verificationSteps: ["net use"],
      riskyCommands: [
        {
          pattern: "shutdown",
          reason: "Restarting the workstation before diagnosis can interrupt the user and hide the original condition."
        },
        {
          pattern: "del",
          reason: "Deleting files is not part of this access investigation and could damage user data."
        }
      ],
      commandFocus: ["ipconfig", "ping", "nslookup", "net use"],
      acceptedCommands: ["ipconfig /all", "ping fileserver", "nslookup fileserver", "net use Z: \\\\fileserver\\Tools", "net use"],
      simulatedOutput: [
        "IPv4 Address . . . . . . . . . . : 192.168.56.25",
        "Reply from 192.168.56.20: bytes=32 time<1ms TTL=128",
        "Name:    fileserver",
        "The command completed successfully."
      ],
      successCondition: "Work from local validation through name resolution and verify the restored share mapping.",
      feedbackText: "The learner followed a support workflow from local checks through verification instead of guessing at the cause.",
      environment: {
        cwd: "C:/Lab",
        targets: selectTargets("fileserver")
      },
      stages: [
        {
          id: "triage",
          title: "Triage",
          briefing: "Establish whether the workstation is configured correctly and can still reach the target host.",
          completionSummary: "You confirmed the workstation has a valid local configuration and can still reach the file server.",
          steps: [
            step({
              objective: "Review the workstation IP configuration in full detail.",
              hints: ["Start with the local network configuration.", "You need the full adapter details, not the short view.", "Try `ipconfig /all`."],
              explanation: "A good incident workflow begins with the host's own IP, gateway, and DNS configuration before it blames remote systems.",
              whyThisMatters: "Local configuration issues can imitate server or DNS faults if they are not ruled out first.",
              successFeedback: "You reviewed the local adapter configuration.",
              accepts: [rawMatch(/^ipconfig\s+\/all$/i)],
              partials: [
                {
                  match: rawMatch(/^ipconfig$/i),
                  classification: "inefficient",
                  feedback: "You are using the right tool, but this incident needs the full adapter details."
                }
              ],
              exploration: [
                {
                  match: rawMatch(/^(?:hostname|whoami)$/i),
                  feedback: "That host context is useful background, but it does not yet confirm the network configuration for this ticket."
                }
              ]
            }),
            step({
              objective: "Confirm the file server responds to a reachability test.",
              hints: ["Now move from local config to host reachability.", "Use a basic ICMP test against the file server.", "Try `ping fileserver`."],
              explanation: "A successful ping gives you a quick answer about host reachability before you move into DNS or share access assumptions.",
              whyThisMatters: "Support work becomes faster when you separate basic reachability from higher-layer access issues.",
              successFeedback: "You confirmed the file server responds to ping.",
              accepts: [rawMatch(/^ping\s+(?:fileserver|192\.168\.56\.20)$/i)],
              partials: [
                {
                  match: rawMatch(/^tracert\s+(?:fileserver|192\.168\.56\.20)$/i),
                  classification: "inefficient",
                  feedback: "Route tracing can be useful later, but first confirm simple reachability."
                }
              ],
              exploration: [
                {
                  match: rawMatch(/^hostname$/i),
                  feedback: "The workstation identity is already known. The current goal is to prove whether the target host responds."
                }
              ]
            })
          ]
        },
        {
          id: "investigation",
          title: "Investigation",
          briefing: "Distinguish name-resolution evidence from share-access evidence before you restore the user's workflow.",
          completionSummary: "You confirmed DNS resolution and rebuilt the required share mapping.",
          steps: [
            step({
              objective: "Resolve the file server hostname through DNS.",
              hints: ["Use the direct DNS lookup command.", "You need name-resolution evidence, not another reachability test.", "Try `nslookup fileserver`."],
              explanation: "DNS proof is separate from ping proof. Looking them up independently reduces guesswork about where the failure sits.",
              whyThisMatters: "IP connectivity and name resolution are different checks. Good technicians prove both.",
              successFeedback: "You resolved the file server name through DNS.",
              accepts: [rawMatch(/^nslookup\s+fileserver$/i)],
              partials: [
                {
                  match: rawMatch(/^ping\s+(?:fileserver|192\.168\.56\.20)$/i),
                  classification: "inefficient",
                  feedback: "Ping confirms reachability, but this stage needs direct DNS evidence."
                }
              ],
              exploration: [
                {
                  match: rawMatch(/^ipconfig(?:\s+\/all)?$/i),
                  feedback: "Reviewing the local adapter again is safe, but this stage is about proving name resolution specifically."
                }
              ]
            }),
            step({
              objective: "Map the remote Tools share to drive Z:.",
              hints: ["Use NET USE to map the share.", "The destination is the Tools share on fileserver.", "Try `net use Z: \\\\fileserver\\Tools`."],
              explanation: "Once host and DNS checks look healthy, restoring the user's expected share path is the next practical support action.",
              whyThisMatters: "Support investigations should end with a concrete recovery action, not only with observations.",
              successFeedback: "You mapped the remote Tools share.",
              accepts: [
                rawMatch(/^net\s+use\s+Z:\s+\\+fileserver\\+Tools$/i),
                mappedShareMatch("Z:", "\\\\fileserver\\Tools", { raw: /^net\s+use\s+Z:\s+\\+fileserver\\+Tools$/i })
              ],
              partials: [
                {
                  match: rawMatch(/^net\s+use$/i),
                  classification: "inefficient",
                  feedback: "Close, but listing mappings only verifies the result after you create the share mapping."
                }
              ],
              exploration: [
                {
                  match: rawMatch(/^net\s+share$/i),
                  feedback: "That shows local shared resources. This incident needs the remote share to be mapped on the workstation."
                }
              ]
            })
          ]
        },
        {
          id: "verification",
          title: "Verification",
          briefing: "Verify the restored share mapping before closing the ticket.",
          completionSummary: "You verified the final state before closing the incident.",
          steps: [
            step({
              objective: "Display the current mapping table and verify that drive Z: is present.",
              hints: ["Confirm the final state before you close the ticket.", "List the current share mappings.", "Try `net use`."],
              explanation: "Verification is what separates a guess from a completed support action.",
              whyThisMatters: "Good technicians do not stop after making a change. They prove the result.",
              successFeedback: "You verified the share mapping table.",
              accepts: [rawMatch(/^net\s+use$/i)],
              partials: [
                {
                  match: mappedShareMatch("Z:", "\\\\fileserver\\Tools", { raw: /^net\s+use\s+Z:\s+\\+fileserver\\+Tools$/i }),
                  classification: "inefficient",
                  feedback: "The mapping already exists. This final step is to verify it, not recreate it."
                }
              ],
              exploration: [
                {
                  match: rawMatch(/^dir\s+Z:$/i),
                  feedback: "Browsing the mapped drive is reasonable follow-up context, but first verify that the mapping itself is present."
                }
              ]
            })
          ]
        }
      ]
    }),
    windowsLessonScenario({
      id: "win-schtasks-review",
      title: "Review Scheduled Tasks",
      category: "Users, shares, and admin tasks",
      difficulty: "Intermediate",
      objective: "Query the scheduled-task list so you can identify which jobs run automatically on the host.",
      scenarioIntro: "Automatic execution matters in both admin work and response work. schtasks gives the learner a direct CMD view of what is set to run without requiring Task Scheduler GUI access.",
      commandFocus: ["schtasks"],
      acceptedCommands: ["schtasks /query"],
      simulatedOutput: ["TaskName                         Next Run Time         Status", "\\DailyBackup"],
      successCondition: "Display the scheduled task list with schtasks.",
      feedbackText: "The learner surfaced the host's automatic jobs from the command line.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Query the scheduled task list.",
          hints: ["Use schtasks with the query action.", "You do not need to target a single task yet.", "Try `schtasks /query`."],
          explanation: "schtasks /query is the direct CMD way to review scheduled automation on a Windows host.",
          successFeedback: "You reviewed the scheduled task list.",
          accepts: [rawMatch(/^schtasks\s+\/query$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-shutdown-planned-restart",
      title: "Queue a Planned Restart",
      category: "Users, shares, and admin tasks",
      difficulty: "Intermediate",
      objective: "Schedule a controlled restart with a one-minute delay so the action is deliberate and observable.",
      scenarioIntro: "Shutdown commands should feel intentional, not casual. This lesson makes the learner schedule a restart with a timer so they see the difference between planning and abrupt action.",
      commandFocus: ["shutdown"],
      acceptedCommands: ["shutdown /r /t 60"],
      simulatedOutput: ["Shutdown scheduled: restart in 60 second(s)."],
      successCondition: "Create a pending restart action with a 60-second timer.",
      feedbackText: "The learner scheduled a controlled restart instead of triggering an immediate reboot.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Schedule a restart with a 60-second delay.",
          hints: ["Use shutdown with the restart and timer switches.", "The timer should be 60 seconds.", "Try `shutdown /r /t 60`."],
          explanation: "A delayed restart is safer in training because it reinforces that restart actions can be planned and communicated.",
          successFeedback: "You scheduled the planned restart.",
          accepts: [shutdownMatch("restart", { raw: /^shutdown\s+\/r\s+\/t\s+60$/i })]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-find-failure-lines",
      title: "Find Failure Lines",
      category: "Search and comparison",
      difficulty: "Beginner",
      objective: "Search a summary file for the lines that contain the literal FAILED marker.",
      scenarioIntro: "Literal text search is a useful first filter before learners move to broader pattern matching. This lesson keeps the task small and obvious with the exact word FAILED.",
      commandFocus: ["find"],
      acceptedCommands: ["find \"FAILED\" backup-summary.txt"],
      simulatedOutput: ["FAILED backup validation on drive D:"],
      successCondition: "Filter backup-summary.txt for the literal word FAILED.",
      feedbackText: "The learner isolated the failure lines with a direct literal search.",
      environment: {
        cwd: "C:/Lab/Logs",
        files: [{ path: "C:/Lab/Logs/backup-summary.txt", content: "OK backup started\nFAILED backup validation on drive D:\nOK archive uploaded\nFAILED retention check\n" }]
      },
      steps: [
        step({
          objective: "Filter backup-summary.txt for the literal FAILED lines.",
          hints: ["Use the Windows literal text filter.", "The string to find is FAILED.", "Try `find \"FAILED\" backup-summary.txt`."],
          explanation: "find is useful when the learner wants a direct literal match without broader pattern options.",
          successFeedback: "You isolated the failure lines.",
          accepts: [rawMatch(/^find\s+\"FAILED\"\s+backup-summary\.txt$/i), rawMatch(/^find\s+FAILED\s+backup-summary\.txt$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-findstr-service-filter",
      title: "Filter Service Output",
      category: "Search and comparison",
      difficulty: "Beginner",
      objective: "Search a service inventory file for the Spooler lines so the relevant service stands out immediately.",
      scenarioIntro: "findstr is broader than find and commonly appears in real Windows workflows. Here it is used to isolate the Spooler lines from a larger service-inventory text file.",
      commandFocus: ["findstr"],
      acceptedCommands: ["findstr Spooler services.txt"],
      simulatedOutput: ["Spooler               RUNNING"],
      successCondition: "Filter services.txt down to the Spooler lines.",
      feedbackText: "The learner narrowed noisy service output down to the one service that matters.",
      environment: {
        cwd: "C:/Lab/Services",
        files: [{ path: "C:/Lab/Services/services.txt", content: "Spooler               RUNNING\nBITS                  RUNNING\nDnscache              RUNNING\nw32time               RUNNING\n" }]
      },
      steps: [
        step({
          objective: "Filter services.txt for the Spooler entry.",
          hints: ["Use the Windows pattern filter command.", "The target text is Spooler.", "Try `findstr Spooler services.txt`."],
          explanation: "findstr is one of the most practical CMD filters once the learner needs to isolate a signal from noisy output.",
          successFeedback: "You filtered the service inventory down to Spooler.",
          accepts: [rawMatch(/^findstr\s+Spooler\s+services\.txt$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-where-python",
      title: "Locate an Executable",
      category: "Search and comparison",
      difficulty: "Beginner",
      objective: "Find where Python is available on this host's PATH before you rely on it in a follow-up workflow.",
      scenarioIntro: "Beginners often assume a tool exists without confirming the path. where gives them a direct Windows-native way to verify executable location before using it.",
      commandFocus: ["where"],
      acceptedCommands: ["where python"],
      simulatedOutput: ["C:\\Python311\\python.exe"],
      successCondition: "Locate python.exe through the current PATH.",
      feedbackText: "The learner confirmed the executable path before depending on the tool.",
      environment: {
        cwd: "C:/Lab"
      },
      steps: [
        step({
          objective: "Locate python on the current PATH.",
          hints: ["Use the Windows executable-location command.", "The target tool name is python.", "Try `where python`."],
          explanation: "where confirms tool availability and path placement before the learner assumes a command exists.",
          successFeedback: "You located the Python executable.",
          accepts: [rawMatch(/^where\s+python$/i)]
        })
      ]
    }),
    windowsLessonScenario({
      id: "win-fc-config-compare",
      title: "Compare Two Configs",
      category: "Search and comparison",
      difficulty: "Intermediate",
      objective: "Compare the baseline and candidate configuration files so you can spot the changed setting quickly.",
      scenarioIntro: "Configuration drift is easier to explain when the learner sees a direct file comparison. fc is the CMD-native comparison command that keeps the task inside the terminal.",
      commandFocus: ["fc"],
      acceptedCommands: ["fc baseline.cfg candidate.cfg"],
      simulatedOutput: ["Comparing files baseline.cfg and candidate.cfg", "***** baseline.cfg"],
      successCondition: "Run a line comparison between baseline.cfg and candidate.cfg.",
      feedbackText: "The learner used CMD to surface configuration differences directly.",
      environment: {
        cwd: "C:/Lab/Config",
        files: [
          { path: "C:/Lab/Config/baseline.cfg", content: "mode=baseline\nthreads=4\nlog_level=info\n" },
          { path: "C:/Lab/Config/candidate.cfg", content: "mode=baseline\nthreads=8\nlog_level=info\n" }
        ]
      },
      steps: [
        step({
          objective: "Compare baseline.cfg and candidate.cfg.",
          hints: ["Use the CMD file-compare command.", "Target the baseline and candidate files in that order.", "Try `fc baseline.cfg candidate.cfg`."],
          explanation: "fc gives the learner a lightweight comparison workflow without needing a separate editor or GUI diff tool.",
          successFeedback: "You compared the two configuration files.",
          accepts: [rawMatch(/^fc\s+baseline\.cfg\s+candidate\.cfg$/i)]
        })
      ]
    }),
  ];

  const generatedCiscoCurriculumScenarios = [
    ciscoLessonScenario({
      id: "cisco-enter-privileged-mode",
      title: "Enter and Exit Privileged Mode",
      category: "Cisco CLI fundamentals",
      objective: "Move from user EXEC into privileged EXEC, then step back out cleanly so you understand the first Cisco mode boundary.",
      scenarioIntro: "Cisco routers change prompt symbols as your privilege level changes. This first scenario is about reading the prompt and moving between `>` and `#` deliberately.",
      commandFocus: ["enable", "disable"],
      acceptedCommands: ["enable", "disable"],
      simulatedOutput: ["BranchRTR#", "BranchRTR>"],
      successCondition: "The prompt changes into privileged EXEC and then back to user EXEC.",
      feedbackText: "Prompt awareness matters on Cisco devices because the same word can be valid or invalid depending on the current mode.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode from the `>` prompt.",
          hints: ["Start with the command that unlocks the `#` prompt.", "On Cisco gear, this is the first step before deeper inspection or config work.", "Try `enable`."],
          explanation: "Privileged EXEC mode opens the inspection and configuration path. The prompt changing from `>` to `#` is the visible confirmation.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Return to user EXEC mode so you can recognise the reverse transition too.",
          hints: ["Use the command that drops you from `#` back to `>`.", "This is the clean way to leave privileged EXEC without leaving the device session.", "Try `disable`."],
          explanation: "Beginners should learn both directions of the prompt transition so they do not lose track of privilege level.",
          successFeedback: "You returned to user EXEC mode.",
          accepts: [routerModeMatch("user-exec", { raw: /^disable$/i })]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-show-version-and-status",
      title: "Review Version and Interface Status",
      category: "Cisco CLI fundamentals",
      objective: "Check the router platform details, then use the quick interface summary to spot which ports are up, down, or unconfigured.",
      scenarioIntro: "Before changing a router, operators usually confirm what box they are on and what the interface summary already says.",
      commandFocus: ["enable", "show version", "show ip interface brief"],
      acceptedCommands: ["enable", "show version", "show ip interface brief"],
      simulatedOutput: ["Cisco IOS Software, 1900 Software", "GigabitEthernet0/0 unassigned administratively down down"],
      successCondition: "You confirm the router version and the current interface summary.",
      feedbackText: "show version gives platform context, while show ip interface brief gives the fastest operational summary.",
      environment: {
        hostname: "EdgeRTR"
      },
      steps: [
        step({
          objective: "Move into privileged EXEC mode first.",
          hints: ["The summary and config inspection workflow starts from `#`.", "Use the privilege command first.", "Try `enable`."],
          explanation: "Even when a show command could be available elsewhere, teaching a stable `enable` first workflow helps beginners stay oriented.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Display the IOS version and hardware summary.",
          hints: ["Use the Cisco show command that reports IOS, hardware, uptime, and image details.", "You are not looking at config yet.", "Try `show version`."],
          explanation: "show version confirms the platform and IOS image before you judge any interface or routing output.",
          successFeedback: "You reviewed the router version output.",
          accepts: [rawMatch(/^show\s+version$/i)]
        }),
        step({
          objective: "Display the quick interface summary.",
          hints: ["Now move from platform context to interface state.", "Use the fast summary command, not the detailed interface output yet.", "Try `show ip interface brief`."],
          explanation: "show ip interface brief is the normal first stop when you need to see status and addressing at a glance.",
          successFeedback: "You reviewed the interface status summary.",
          accepts: [rawMatch(/^show\s+ip\s+interface\s+brief$/i)]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-interface-description",
      title: "Inspect an Interface and Add a Description",
      category: "Cisco CLI fundamentals",
      objective: "Inspect the detailed state of the LAN interface, enter interface configuration mode, and label it clearly.",
      scenarioIntro: "Descriptions do not change packet flow, but they make real router configurations easier to read and troubleshoot later.",
      commandFocus: ["enable", "show interfaces", "configure terminal", "interface", "description", "exit"],
      acceptedCommands: ["enable", "show interfaces GigabitEthernet0/0", "configure terminal", "interface g0/0", "description Branch User LAN", "exit"],
      simulatedOutput: ["GigabitEthernet0/0 is administratively down, line protocol is down", "description Branch User LAN"],
      successCondition: "You inspect the interface details, apply a description, and exit back to global configuration mode.",
      feedbackText: "Detailed interface views explain the problem; descriptions make the config easier to read next time.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Start by moving from `>` to `#`.", "Use the standard privilege command.", "Try `enable`."],
          explanation: "Cisco configuration work begins by consciously entering privileged EXEC mode.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Display the detailed output for GigabitEthernet0/0.",
          hints: ["Use the detailed interface command against the LAN port.", "A short form like g0/0 is fine.", "Try `show interfaces GigabitEthernet0/0` or `show interfaces g0/0`."],
          explanation: "The detailed interface view tells you whether the issue is admin state, line protocol, errors, or another interface-specific detail.",
          successFeedback: "You inspected the detailed interface output.",
          accepts: [rawMatch(/^show\s+interfaces\s+(?:gigabitethernet0\/0|gi0\/0|g0\/0)$/i)]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["You need to leave show commands and enter config mode now.", "The standard transition command is two words.", "Try `configure terminal`."],
          explanation: "configure terminal moves the router from observation into controlled configuration changes.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Move into the GigabitEthernet0/0 interface configuration context.",
          hints: ["Select the interface before you try to label it.", "A short or full interface name is fine.", "Try `interface g0/0`."],
          explanation: "Cisco keeps interface-specific changes inside an interface submode so you can target one port at a time.",
          successFeedback: "You entered interface configuration mode.",
          accepts: [routerModeMatch("interface-config", { raw: /^interface\s+(?:gigabitethernet0\/0|gi0\/0|g0\/0)$/i })]
        }),
        step({
          objective: "Add the description `Branch User LAN` to the interface.",
          hints: ["Stay in interface config mode.", "Use the description command followed by the exact label.", "Try `description Branch User LAN`."],
          explanation: "Descriptions are simple but valuable because they tell the next operator what the interface is for without reverse-engineering the topology.",
          successFeedback: "You labeled the interface clearly.",
          accepts: [ciscoInterfaceDescriptionMatch("GigabitEthernet0/0", "Branch User LAN", { raw: /^description\s+Branch\s+User\s+LAN$/i })]
        }),
        step({
          objective: "Exit back to global configuration mode.",
          hints: ["Leave the interface submode without going all the way back to `#` yet.", "Use the mode-exit command once.", "Try `exit`."],
          explanation: "Cisco uses nested modes. Learning to back out one level at a time is part of reading and controlling the prompt.",
          successFeedback: "You moved back to global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^exit$/i })]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-no-shutdown-lan",
      title: "Bring a Shutdown Interface Up",
      category: "Cisco CLI fundamentals",
      objective: "Move into the LAN interface configuration mode, bring the interface up, and verify that the admin state changed.",
      scenarioIntro: "An `administratively down` interface is usually a configuration issue, not a bad cable. This scenario teaches the beginner fix path.",
      commandFocus: ["enable", "configure terminal", "interface", "no shutdown", "end", "show ip interface brief"],
      acceptedCommands: ["enable", "configure terminal", "interface g0/0", "no shutdown", "end", "show ip interface brief"],
      simulatedOutput: ["GigabitEthernet0/0 changed state to up", "GigabitEthernet0/0 unassigned up up"],
      successCondition: "The target interface is no longer shutdown and the prompt returns to privileged EXEC for verification.",
      feedbackText: "The prompt and the interface summary together tell you whether the port is administratively disabled or actually active.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["The router is still at the `>` prompt.", "Start by moving to `#`.", "Try `enable`."],
          explanation: "Privilege first keeps the Cisco workflow consistent for new learners.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["You need config mode before you can alter an interface.", "Use the standard Cisco command.", "Try `configure terminal`."],
          explanation: "Configuration mode is the router's guarded change area.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Select GigabitEthernet0/0 for configuration.",
          hints: ["Pick the LAN interface before changing its state.", "A short or full interface name is fine.", "Try `interface g0/0`."],
          explanation: "The interface submode narrows the command scope to one port.",
          successFeedback: "You entered the LAN interface context.",
          accepts: [routerModeMatch("interface-config", { raw: /^interface\s+(?:gigabitethernet0\/0|gi0\/0|g0\/0)$/i })]
        }),
        step({
          objective: "Bring the interface up administratively.",
          hints: ["Remove the shutdown state rather than adding more config first.", "This Cisco command begins with `no`.", "Try `no shutdown`."],
          explanation: "no shutdown is the standard fix for an administratively down Cisco interface.",
          successFeedback: "You brought the interface out of shutdown.",
          accepts: [ciscoInterfaceStatusMatch("GigabitEthernet0/0", true, { raw: /^no\s+shutdown$/i })]
        }),
        step({
          objective: "Return directly to privileged EXEC mode.",
          hints: ["Leave config mode cleanly instead of typing exit multiple times.", "Cisco has a command that jumps straight back to `#`.", "Try `end`."],
          explanation: "end is the quick way to leave nested config modes and return to privileged EXEC.",
          successFeedback: "You returned to privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^end$/i })]
        }),
        step({
          objective: "Verify the interface status from the summary view.",
          hints: ["Finish with the quick summary command.", "You want to confirm the admin state is no longer down.", "Try `show ip interface brief`."],
          explanation: "Verification is what turns a configuration guess into a finished change.",
          successFeedback: "You verified that the interface is up.",
          accepts: [rawMatch(/^show\s+ip\s+interface\s+brief$/i)]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-assign-ip-address",
      title: "Assign an Interface IP Address",
      category: "Cisco CLI fundamentals",
      objective: "Configure the LAN interface with the correct IPv4 address and mask, then confirm it appears in the summary output.",
      scenarioIntro: "Cisco routers need you to enter the interface submode before you can assign IPv4 addressing. The prompt tells you when you are in the right place.",
      commandFocus: ["enable", "configure terminal", "interface", "ip address", "no shutdown", "end", "show ip interface brief"],
      acceptedCommands: ["enable", "configure terminal", "interface g0/0", "ip address 192.168.10.1 255.255.255.0", "no shutdown", "end", "show ip interface brief"],
      simulatedOutput: ["GigabitEthernet0/0 192.168.10.1 up up"],
      successCondition: "GigabitEthernet0/0 shows the expected IPv4 address in the interface summary.",
      feedbackText: "Addressing belongs on the interface itself, and verification belongs back in privileged EXEC mode.",
      environment: {
        hostname: "BranchRTR",
        interfaces: [
          {
            name: "GigabitEthernet0/0",
            aliases: ["g0/0", "gi0/0"],
            ipAddress: "",
            subnetMask: "",
            adminUp: false,
            lineProtocol: false,
            description: "Branch User LAN"
          },
          {
            name: "GigabitEthernet0/1",
            aliases: ["g0/1", "gi0/1"],
            ipAddress: "198.51.100.1",
            subnetMask: "255.255.255.252",
            adminUp: true,
            lineProtocol: true,
            description: "WAN uplink to ISP"
          },
          {
            name: "Loopback0",
            aliases: ["lo0"],
            ipAddress: "10.255.255.1",
            subnetMask: "255.255.255.255",
            adminUp: true,
            lineProtocol: true,
            description: "Management loopback"
          }
        ]
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Start by moving into `#` mode.", "Cisco config work begins from privileged EXEC.", "Try `enable`."],
          explanation: "This keeps the router workflow predictable before you start changing interfaces.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["You need `(config)#` before you can target an interface.", "Use the standard two-word command.", "Try `configure terminal`."],
          explanation: "Global config is the staging area for interface, routing, and device-level changes.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Select GigabitEthernet0/0 for configuration.",
          hints: ["Enter the LAN interface submode.", "Use the full or short interface name.", "Try `interface g0/0`."],
          explanation: "Cisco keeps interface addressing scoped to the selected interface mode.",
          successFeedback: "You entered the interface configuration mode.",
          accepts: [routerModeMatch("interface-config", { raw: /^interface\s+(?:gigabitethernet0\/0|gi0\/0|g0\/0)$/i })]
        }),
        step({
          objective: "Assign `192.168.10.1 255.255.255.0` to the interface.",
          hints: ["Stay in interface mode.", "Use the Cisco IPv4 addressing command followed by IP and mask.", "Try `ip address 192.168.10.1 255.255.255.0`."],
          explanation: "Router interfaces carry the Layer 3 address that hosts in that subnet will use as their gateway.",
          successFeedback: "You assigned the interface IPv4 address.",
          accepts: [ciscoInterfaceAddressMatch("GigabitEthernet0/0", "192.168.10.1", "255.255.255.0", { raw: /^ip\s+address\s+192\.168\.10\.1\s+255\.255\.255\.0$/i })]
        }),
        step({
          objective: "Bring the interface up if needed.",
          hints: ["Addressing alone is not enough if the port is still shutdown.", "Use the Cisco command that removes the admin-down state.", "Try `no shutdown`."],
          explanation: "A valid IP on a shutdown interface still leaves the network unusable. The port must be administratively up as well.",
          successFeedback: "You enabled the interface.",
          accepts: [ciscoInterfaceStatusMatch("GigabitEthernet0/0", true, { raw: /^no\s+shutdown$/i })]
        }),
        step({
          objective: "Return to privileged EXEC mode.",
          hints: ["Jump back out of config mode cleanly.", "Use the command that returns directly to `#`.", "Try `end`."],
          explanation: "Verification should happen from privileged EXEC mode after the change is staged.",
          successFeedback: "You returned to privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^end$/i })]
        }),
        step({
          objective: "Verify the interface address in the summary output.",
          hints: ["Finish with the fast summary command.", "You want to see the new IP on GigabitEthernet0/0.", "Try `show ip interface brief`."],
          explanation: "The interface summary is the quick proof that the new IP address really landed where you expected.",
          successFeedback: "You confirmed the new interface address.",
          accepts: [rawMatch(/^show\s+ip\s+interface\s+brief$/i)]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-change-hostname",
      title: "Change the Router Hostname",
      category: "Cisco CLI fundamentals",
      objective: "Rename the router to match the branch role and confirm the prompt changes to the new hostname.",
      scenarioIntro: "Cisco prompt changes are not cosmetic. They tell you which device you are on, especially when you have multiple consoles or saved configs open.",
      commandFocus: ["enable", "configure terminal", "hostname", "end"],
      acceptedCommands: ["enable", "configure terminal", "hostname BranchRTR", "end"],
      simulatedOutput: ["BranchRTR(config)#", "BranchRTR#"],
      successCondition: "The router prompt reflects the new hostname.",
      feedbackText: "A clear hostname reduces mistakes when you manage more than one device.",
      environment: {
        hostname: "Router"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Start by moving into `#` mode.", "Cisco config changes start from privileged EXEC.", "Try `enable`."],
          explanation: "This is the normal entry point into safe device changes.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["You need `(config)#` before changing the device hostname.", "Use the standard configuration command.", "Try `configure terminal`."],
          explanation: "Device-level settings like hostname live in global config mode.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Rename the router to `BranchRTR`.",
          hints: ["Use the hostname command followed by the new router name.", "The new name is BranchRTR.", "Try `hostname BranchRTR`."],
          explanation: "A descriptive hostname is basic but important operational hygiene on network devices.",
          successFeedback: "You updated the router hostname.",
          accepts: [ciscoHostnameMatch("BranchRTR", { raw: /^hostname\s+BranchRTR$/i })]
        }),
        step({
          objective: "Return to privileged EXEC mode so you can see the new prompt clearly.",
          hints: ["Leave global config without stepping down to user EXEC.", "Use the direct return command.", "Try `end`."],
          explanation: "The best confirmation is seeing the new hostname at the privileged EXEC prompt.",
          successFeedback: "You returned to privileged EXEC mode with the new hostname visible.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^end$/i })]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-review-and-save-config",
      title: "Review Running vs Startup Config and Save",
      category: "Cisco CLI fundamentals",
      objective: "Inspect the active config, compare it to startup config, then save the running configuration to startup.",
      scenarioIntro: "Cisco beginners often confuse running config with startup config. This lab makes the difference visible before saving.",
      commandFocus: ["enable", "show running-config", "show startup-config", "copy running-config startup-config", "write memory"],
      acceptedCommands: ["enable", "show running-config", "show startup-config", "copy running-config startup-config", "write memory"],
      simulatedOutput: ["hostname BranchRTR", "Building configuration...", "[OK]"],
      successCondition: "Startup config matches the running config after the save command.",
      feedbackText: "Running config is live RAM state. Startup config is what survives a reboot.",
      environment: {
        hostname: "BranchRTR",
        configDirty: true,
        interfaces: [
          {
            name: "GigabitEthernet0/0",
            aliases: ["g0/0", "gi0/0"],
            ipAddress: "192.168.10.1",
            subnetMask: "255.255.255.0",
            adminUp: true,
            lineProtocol: true,
            description: "Branch User LAN"
          },
          {
            name: "GigabitEthernet0/1",
            aliases: ["g0/1", "gi0/1"],
            ipAddress: "198.51.100.1",
            subnetMask: "255.255.255.252",
            adminUp: true,
            lineProtocol: true,
            description: "WAN uplink to ISP"
          },
          {
            name: "Loopback0",
            aliases: ["lo0"],
            ipAddress: "10.255.255.1",
            subnetMask: "255.255.255.255",
            adminUp: true,
            lineProtocol: true,
            description: "Management loopback"
          }
        ],
        startupConfig: buildCiscoStartupConfigSnapshot({
          hostname: "Router",
          interfaces: commonCiscoInterfaces(),
          staticRoutes: commonCiscoStaticRoutes()
        })
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["The config review starts from `#`.", "Use the standard privilege command.", "Try `enable`."],
          explanation: "Configuration inspection and save operations happen from privileged EXEC mode.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Display the active running configuration.",
          hints: ["Use the show command for the current live config in RAM.", "This is not the saved boot config yet.", "Try `show running-config`."],
          explanation: "show running-config tells you what the router is currently using, not what it will reboot with.",
          successFeedback: "You reviewed the running config.",
          accepts: [rawMatch(/^show\s+running-config$/i)]
        }),
        step({
          objective: "Display the saved startup configuration.",
          hints: ["Now compare against the boot-time copy.", "Use the Cisco show command for startup config.", "Try `show startup-config`."],
          explanation: "Seeing both outputs before saving teaches the difference between active config and reboot-persistent config.",
          successFeedback: "You reviewed the startup config.",
          accepts: [rawMatch(/^show\s+startup-config$/i)]
        }),
        step({
          objective: "Save the running configuration to startup configuration.",
          hints: ["You can use the longer copy command or the classic short save command.", "Either valid command is acceptable in this lab.", "Try `copy running-config startup-config` or `write memory`."],
          explanation: "Saving commits the current running state into the startup config so it survives a reboot.",
          successFeedback: "You saved the running config to startup config.",
          accepts: [
            ciscoStartupConfigMatch({ raw: /^copy\s+running-config\s+startup-config$/i }),
            ciscoStartupConfigMatch({ raw: /^write\s+memory$/i })
          ]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-connectivity-checks",
      title: "Test Connectivity with Ping and Traceroute",
      category: "Cisco CLI fundamentals",
      objective: "Use ping to confirm direct reachability, then traceroute to build a simple path view to a remote host.",
      scenarioIntro: "Routers are often the best place to test connectivity because they sit on the forwarding path itself.",
      commandFocus: ["enable", "ping", "traceroute"],
      acceptedCommands: ["enable", "ping 198.51.100.2", "traceroute 172.16.30.10"],
      simulatedOutput: ["!!!!!", "Tracing the route to 172.16.30.10"],
      successCondition: "You confirm direct reachability and then inspect the path toward the remote destination.",
      feedbackText: "Ping answers the basic 'can I reach it?' question; traceroute begins answering 'how do I reach it?'.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Start from the Cisco prompt transition again.", "Move from `>` to `#` first.", "Try `enable`."],
          explanation: "Keeping the learner in a consistent workflow matters more than saving one command.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Ping the upstream next hop at `198.51.100.2`.",
          hints: ["Start with the nearest path check first.", "The target is the ISP-side next hop.", "Try `ping 198.51.100.2`."],
          explanation: "A successful ping to the next hop tells you the local WAN adjacency is alive before you test deeper paths.",
          successFeedback: "You confirmed upstream reachability.",
          accepts: [rawMatch(/^ping\s+198\.51\.100\.2$/i)]
        }),
        step({
          objective: "Run traceroute toward `172.16.30.10`.",
          hints: ["Now move from reachability to path visibility.", "Use the Cisco traceroute command against the remote host.", "Try `traceroute 172.16.30.10`."],
          explanation: "Traceroute is the next layer of reasoning after ping because it shows where the path actually goes.",
          successFeedback: "You traced the path toward the remote host.",
          accepts: [rawMatch(/^traceroute\s+172\.16\.30\.10$/i)]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-add-static-route",
      title: "Add and Verify a Static Route",
      category: "Cisco CLI fundamentals",
      objective: "Add a basic static route for the HQ subnet and confirm it appears in the routing table.",
      scenarioIntro: "This lab teaches the simplest safe routing change: adding one clear static route and checking the router table afterwards.",
      commandFocus: ["enable", "configure terminal", "ip route", "end", "show ip route"],
      acceptedCommands: ["enable", "configure terminal", "ip route 172.16.30.0 255.255.255.0 198.51.100.2", "end", "show ip route"],
      simulatedOutput: ["S 172.16.30.0/24 [1/0] via 198.51.100.2", "Gateway of last resort is 198.51.100.2"],
      successCondition: "The new static route appears in the routing table.",
      feedbackText: "Static routes are simple to understand because you can see the destination network, mask, and chosen next hop directly.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Start with the privilege transition.", "Move into `#` first.", "Try `enable`."],
          explanation: "This keeps routing changes inside the same deliberate configuration workflow as other Cisco labs.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["Routing changes happen in global config mode.", "Use the standard command.", "Try `configure terminal`."],
          explanation: "Static routes are device-level settings, so they belong in global config mode rather than interface config.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Add a static route for `172.16.30.0/24` via `198.51.100.2`.",
          hints: ["Use the Cisco static-route command with destination, mask, and next hop.", "The network is 172.16.30.0 with mask 255.255.255.0.", "Try `ip route 172.16.30.0 255.255.255.0 198.51.100.2`."],
          explanation: "A static route tells the router exactly where to forward traffic for a destination network.",
          successFeedback: "You added the new static route.",
          accepts: [ciscoStaticRouteMatch("172.16.30.0", "255.255.255.0", "198.51.100.2", { raw: /^ip\s+route\s+172\.16\.30\.0\s+255\.255\.255\.0\s+198\.51\.100\.2$/i })]
        }),
        step({
          objective: "Return to privileged EXEC mode.",
          hints: ["Leave config mode before you inspect the route table.", "Use the direct mode-return command.", "Try `end`."],
          explanation: "After making the change, jump back out and verify from the operational prompt.",
          successFeedback: "You returned to privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^end$/i })]
        }),
        step({
          objective: "Display the routing table.",
          hints: ["Use the show command that focuses on IPv4 routes.", "You are looking for the new static route entry.", "Try `show ip route`."],
          explanation: "The routing table is the authoritative place to confirm that the router accepted the new route.",
          successFeedback: "You verified the static route in the routing table.",
          accepts: [rawMatch(/^show\s+ip\s+route$/i)]
        })
      ]
    }),
    ciscoLessonScenario({
      id: "cisco-shutdown-unused-interface",
      title: "Shutdown an Unused Interface",
      category: "Cisco CLI fundamentals",
      objective: "Move into the unused WAN-facing interface and administratively shut it down so you can recognise the reverse of `no shutdown`.",
      scenarioIntro: "Beginners should learn both directions of interface state changes. Unused interfaces are often shut down intentionally.",
      commandFocus: ["enable", "configure terminal", "interface", "shutdown", "end", "show ip interface brief"],
      acceptedCommands: ["enable", "configure terminal", "interface g0/1", "shutdown", "end", "show ip interface brief"],
      simulatedOutput: ["GigabitEthernet0/1 changed state to administratively down", "GigabitEthernet0/1 198.51.100.1 administratively down down"],
      successCondition: "GigabitEthernet0/1 shows as administratively down in the interface summary.",
      feedbackText: "Learning both `shutdown` and `no shutdown` helps beginners understand whether the interface problem is deliberate configuration or something else.",
      environment: {
        hostname: "BranchRTR"
      },
      steps: [
        step({
          objective: "Enter privileged EXEC mode.",
          hints: ["Move from `>` to `#` first.", "The interface shutdown path starts the same way as other config tasks.", "Try `enable`."],
          explanation: "Privilege level stays explicit throughout the Cisco curriculum.",
          successFeedback: "You entered privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^enable$/i })]
        }),
        step({
          objective: "Enter global configuration mode.",
          hints: ["You need `(config)#` before you can target the interface.", "Use the two-word config command.", "Try `configure terminal`."],
          explanation: "Global config is the step between privileged EXEC and interface submode.",
          successFeedback: "You entered global configuration mode.",
          accepts: [routerModeMatch("global-config", { raw: /^configure\s+terminal$/i })]
        }),
        step({
          objective: "Select GigabitEthernet0/1 for configuration.",
          hints: ["This time the target is the WAN-facing interface.", "Use a full or short interface name.", "Try `interface g0/1`."],
          explanation: "Target the exact interface before changing its administrative state.",
          successFeedback: "You entered the GigabitEthernet0/1 interface context.",
          accepts: [routerModeMatch("interface-config", { raw: /^interface\s+(?:gigabitethernet0\/1|gi0\/1|g0\/1)$/i })]
        }),
        step({
          objective: "Administratively shut the interface down.",
          hints: ["This is the reverse of `no shutdown`.", "Use the single-word Cisco command.", "Try `shutdown`."],
          explanation: "shutdown intentionally disables the interface at the configuration level, which is why the summary will say administratively down.",
          successFeedback: "You shut the interface down.",
          accepts: [ciscoInterfaceStatusMatch("GigabitEthernet0/1", false, { raw: /^shutdown$/i })]
        }),
        step({
          objective: "Return to privileged EXEC mode.",
          hints: ["Leave config mode cleanly so you can verify the state.", "Use the command that jumps back to `#`.", "Try `end`."],
          explanation: "Ending the config session before verification keeps the workflow clean and readable.",
          successFeedback: "You returned to privileged EXEC mode.",
          accepts: [routerModeMatch("privileged-exec", { raw: /^end$/i })]
        }),
        step({
          objective: "Verify the interface summary.",
          hints: ["Use the fast interface summary again.", "You want to see the target port as administratively down.", "Try `show ip interface brief`."],
          explanation: "Verification closes the loop and teaches what the shutdown state looks like in the summary view.",
          successFeedback: "You confirmed the interface is administratively down.",
          accepts: [rawMatch(/^show\s+ip\s+interface\s+brief$/i)]
        })
      ]
    })
  ];

  const generatedMixedScenarios = [
    linuxScenario({
      id: "download-extract-inspect",
      title: "Download, Extract, Inspect",
      category: "Mixed real-world tasks",
      level: "Intermediate",
      objective: "Download a bundle, extract it, move into the folder, and inspect the config file inside it.",
      environment: { cwd: "/home/student/downloads" },
      steps: [
        step({ objective: "Download bundle.tar.gz with wget.", hints: ["Use wget and save the file locally.", "Name the output bundle.tar.gz.", "Try `wget https://downloads.lab/bundle.tar.gz -O bundle.tar.gz`."], explanation: "A predictable local archive name makes extraction and later review easier.", accepts: [rawMatch(/^wget\s+https:\/\/downloads\.lab\/bundle\.tar\.gz\s+-O\s+bundle\.tar\.gz$/i)] }),
        step({ objective: "Extract bundle.tar.gz.", hints: ["Use tar with the extraction flags.", "Target bundle.tar.gz.", "Try `tar -xvzf bundle.tar.gz`."], explanation: "Extraction turns the downloaded archive into real files you can inspect.", accepts: [rawMatch(/^tar\s+-xvzf\s+bundle\.tar\.gz$/i), rawMatch(/^tar\s+-xzvf\s+bundle\.tar\.gz$/i)] }),
        step({ objective: "Move into the extracted bundle directory.", hints: ["The extracted folder is named bundle.", "Change into that directory.", "Try `cd bundle`."], explanation: "Entering the extracted directory is the cleanest way to keep later inspection targeted.", accepts: [cwdMatch("/home/student/downloads/bundle")] }),
        step({ objective: "Read config.ini in the extracted directory.", hints: ["Open the config file directly.", "The file is config.ini.", "Try `cat config.ini`."], explanation: "The final inspection step proves you can take a download from retrieval all the way to useful content review.", accepts: [rawMatch(/^cat\s+config\.ini$/i)] })
      ]
    }),
    linuxScenario({
      id: "logs-and-network-triage",
      title: "Logs and Network Triage",
      category: "Mixed real-world tasks",
      level: "Advanced",
      objective: "Inspect a local log, isolate the error lines, then confirm the related service port on the remote host.",
      environment: {
        cwd: "/var/log",
        files: [{ path: "/var/log/web.log", content: "INFO start\nERROR upstream 192.168.56.10:443 failed\nINFO retry\n" }],
        targets: commonTargets()
      },
      steps: [
        step({ objective: "Read the web log file.", hints: ["Start with the local log.", "Open web.log.", "Try `cat web.log`."], explanation: "A local log read gives you the exact remote clue you need before you test the network side.", accepts: [rawMatch(/^cat\s+web\.log$/i)] }),
        step({ objective: "Filter the error lines from web.log.", hints: ["Use grep with the word ERROR.", "Filter the log down to the error lines.", "Try `grep ERROR web.log`."], explanation: "Filtering down to the error lines gets you the actionable signal before you pivot to network validation.", accepts: [rawMatch(/^grep\s+ERROR\s+web\.log$/i), rawMatch(/^cat\s+web\.log\s*\|\s*grep\s+ERROR$/i)] }),
        step({ objective: "Check port 443 on 192.168.56.10.", hints: ["Now pivot to the remote web host.", "Use Nmap on port 443.", "Try `nmap -p 443 192.168.56.10`."], explanation: "The network check validates the remote service named in the local error output.", accepts: [rawMatch(/^nmap\s+-p\s+443\s+192\.168\.56\.10$/i)] })
      ]
    }),
    linuxScenario({
      id: "process-to-shell-followup",
      title: "Process to Shell Follow-up",
      category: "Mixed real-world tasks",
      level: "Advanced",
      objective: "Inspect a local process issue, stop it, then prepare a reverse listener for the next recovery phase.",
      environment: {
        cwd: "/home/student",
        processes: [
          { pid: 5011, name: "relay-worker", user: "student", cpu: "88.1", memory: "9.2", command: "python relay_worker.py" }
        ]
      },
      steps: [
        step({ objective: "List the running processes.", hints: ["Start with the process table.", "Use ps.", "Try `ps`."], explanation: "You need the process table first before you isolate or kill anything.", accepts: [commandMatch("ps")] }),
        step({ objective: "Terminate PID 5011.", hints: ["Use kill against the runaway PID.", "Target 5011.", "Try `kill 5011`."], explanation: "Targeting the runaway worker is the first containment move before you prepare follow-up access tooling.", accepts: [rawMatch(/^kill\s+5011$/i), rawMatch(/^kill\s+-9\s+5011$/i)] }),
        step({ objective: "Start a listener on TCP 4444 for the next phase.", hints: ["Prepare the callback receiver.", "Use Netcat in listen mode on 4444.", "Try `nc -lvnp 4444`."], explanation: "The listener setup is the follow-up step that prepares you for the next recovery or access phase.", accepts: [rawMatch(/^nc\s+-lvnp\s+4444$/i), listenerPortMatch(4444, { command: "nc" })] })
      ]
    })
  ];

  const generatedChallengeScenarios = [
    challengeScenario({
      id: "challenge-web-surface-recon",
      title: "Challenge Lab 1: Web Surface Recon",
      level: "Intermediate",
      difficulty: "Beginner / Intermediate",
      layer: "network",
      layers: ["network", "application"],
      objective: "Investigate web-lab, identify the useful web surface, and gather enough evidence to justify the next application step.",
      challengeObjective: "Investigate the target system, identify useful services, and reach a justified next step without step-by-step guidance.",
      successConditions: [
        "Confirm the target is reachable or directly prove it with scan evidence.",
        "Identify the exposed web service with useful detail.",
        "Take a reasonable next step toward interacting with the web application."
      ],
      allowedApproaches: [
        "Start with ping or go straight to Nmap.",
        "Use a targeted web-port scan or a broader scan with version detection.",
        "Make contact with the web service directly or capture usable scan evidence for follow-up."
      ],
      environment: { cwd: "/home/student", targets: selectTargets("web-lab") },
      machineContexts: [
        { label: "Analyst Box", role: "Linux Terminal", detail: "/home/student" },
        { label: "Linux Server", role: "web-lab (192.168.56.10)", detail: "Ubuntu Linux" }
      ],
      steps: [
        step({
          objective: "Establish credible initial evidence on web-lab before you commit to a web interaction.",
          context: "The target in this lab is web-lab at 192.168.56.10. You can confirm it is alive directly or jump straight into service discovery if that is your preferred workflow.",
          hints: [
            "Start by proving the host is alive or by gathering direct exposure evidence.",
            "Ping is acceptable, but a sensible Nmap scan is also a valid opening move.",
            "Try `ping web-lab`, `ping 192.168.56.10`, or a basic `nmap` against the same target."
          ],
          explanation: "Challenge work still begins with evidence. You either confirm reachability first or collect credible surface information immediately.",
          whyThisMatters: "Operators do not guess whether a target is up. They prove it or replace the question with better evidence.",
          successFeedback: "You established initial target evidence.",
          accepts: [
            rawMatch(/^ping\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-T4\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80,443\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i, {
              advanceBy: 2,
              feedback: "You jumped straight from initial evidence to identified web services."
            }),
            rawMatch(/^nmap\s+-p\s+80,443\s+-sV\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i, {
              advanceBy: 2,
              feedback: "You jumped straight from initial evidence to identified web services."
            }),
            rawMatch(/^nmap\s+-A\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i, {
              advanceBy: 2,
              feedback: "You collected broad web-facing evidence in one pass."
            })
          ]
        }),
        step({
          objective: "Identify the web-facing service with enough detail to justify interaction.",
          context: "Stay on web-lab and turn the broad host evidence into something specific enough to support the next move.",
          hints: [
            "Now reduce the uncertainty around the web service itself.",
            "A web-port scan with version detection is the fastest clean way to do that.",
            "Try `nmap -sV -p 80,443 web-lab` or the same scan against 192.168.56.10."
          ],
          explanation: "Once you have the host in scope, the next useful move is to identify the web-facing service precisely enough to justify interaction.",
          whyThisMatters: "A good challenge workflow narrows from host evidence to service evidence before it touches the application.",
          successFeedback: "You identified the useful web surface.",
          accepts: [
            rawMatch(/^nmap\s+-sV\s+-p\s+80,443\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-p\s+80,443\s+-sV\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-sV\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-A\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i)
          ]
        }),
        step({
          objective: "Take a reasonable next step toward the web application itself.",
          context: "At this point you have enough evidence to justify making contact with the HTTP service or preserving the scan output for follow-up.",
          hints: [
            "Either touch the web service directly or preserve the evidence for the next operator move.",
            "A raw TCP connection to port 80 is acceptable, and saving a focused scan is also valid.",
            "Try `nc web-lab 80`, `telnet web-lab 80`, or save a focused web scan with `-oN`."
          ],
          explanation: "A challenge scenario should end on a defensible next step, not on blind curiosity.",
          whyThisMatters: "Good operators know when they have enough evidence to move from recon into interaction.",
          successFeedback: "You reached a justified next step against the web target.",
          accepts: [
            rawMatch(/^nc\s+(?:-nv\s+)?(?:web-lab|web|frontend|192\.168\.56\.10)\s+80$/i),
            rawMatch(/^telnet\s+(?:web-lab|web|frontend|192\.168\.56\.10)\s+80$/i),
            rawMatch(/^nmap\s+-oN\s+\S+\s+-sV\s+-p\s+80,443\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+80,443\s+-oN\s+\S+\s+(?:web-lab|web|frontend|192\.168\.56\.10)$/i)
          ]
        })
      ]
    }),
    challengeScenario({
      id: "challenge-text-service-hunt",
      title: "Challenge Lab 2: Text Service Hunt",
      level: "Intermediate",
      difficulty: "Intermediate",
      layer: "network",
      layers: ["network"],
      objective: "Discover the right host and service, choose a valid interaction method, and prove you can speak to it.",
      challengeObjective: "Find the correct host and service, choose a workable interaction method, and establish a live session with minimal guidance.",
      successConditions: [
        "Identify the correct host/port with real scan evidence.",
        "Choose a valid client method for the discovered service.",
        "Send enough protocol data to prove the session is real."
      ],
      allowedApproaches: [
        "A focused scan is fine if you already have a strong hypothesis.",
        "A broader scan is acceptable if you need to reduce uncertainty.",
        "Netcat or Telnet are both valid if they fit the discovered service."
      ],
      environment: { cwd: "/home/student", targets: selectTargets("metasploitable2") },
      machineContexts: [
        { label: "Analyst Box", role: "Linux Terminal", detail: "/home/student" },
        { label: "Target Machine", role: "metasploitable2 (192.168.56.102)", detail: "Linux 2.6.x" }
      ],
      steps: [
        step({
          objective: "Discover the text-based service that matters on metasploitable2.",
          context: "You are looking for a remotely reachable text-based service on metasploitable2 at 192.168.56.102. You do not need the whole host map if you already have a good service hypothesis.",
          hints: [
            "Use scan evidence to confirm the correct service first.",
            "A focused scan on SMTP is acceptable, but a broader scan also works.",
            "Try `nmap -p 25 metasploitable2`, `nmap -sV -p 25 metasploitable2`, or a broader `nmap metasploitable2`."
          ],
          explanation: "The service decision should come from evidence, not from a hint ladder alone.",
          whyThisMatters: "Challenge work rewards justified narrowing instead of habit-based command entry.",
          successFeedback: "You identified the service target.",
          accepts: [
            rawMatch(/^nmap\s+-p\s+25\s+(?:metasploitable2|target|192\.168\.56\.102)$/i),
            rawMatch(/^nmap\s+-sV\s+-p\s+25\s+(?:metasploitable2|target|192\.168\.56\.102)$/i),
            rawMatch(/^nmap\s+-p\s+25\s+-sV\s+(?:metasploitable2|target|192\.168\.56\.102)$/i),
            rawMatch(/^nmap\s+(?:metasploitable2|target|192\.168\.56\.102)$/i)
          ]
        }),
        step({
          objective: "Choose a valid way to connect to the discovered service.",
          context: "Now that you have service evidence, pick a client that makes sense for a plain text protocol on TCP 25.",
          hints: [
            "The service speaks plain text over TCP.",
            "Use a simple socket client rather than another scanner.",
            "Try Netcat or Telnet against port 25."
          ],
          explanation: "Once the port is identified, the next operator decision is which client best fits the service and the task.",
          whyThisMatters: "Choosing the right interaction method is part of real workflow judgement, not just syntax recall.",
          successFeedback: "You opened a live service session.",
          accepts: [
            rawMatch(/^nc\s+(?:-nv\s+)?(?:metasploitable2|target|192\.168\.56\.102)\s+25$/i),
            rawMatch(/^telnet\s+(?:metasploitable2|target|192\.168\.56\.102)\s+25$/i)
          ]
        }),
        step({
          objective: "Send the opening protocol verb that proves the session is interactive.",
          context: "You have a live text-based service session. Send the normal opening greeting rather than random text.",
          hints: [
            "Use the standard SMTP greeting verb.",
            "Either of the two common hello forms is acceptable.",
            "Try `EHLO lab.local` or `HELO lab.local`."
          ],
          explanation: "The point is not just to connect, but to prove you can interact meaningfully with the service once connected.",
          whyThisMatters: "A live session only becomes useful when you can speak the protocol correctly enough to elicit a response.",
          successFeedback: "You proved the connection with a valid protocol move.",
          accepts: [
            rawMatch(/^(EHLO|HELO)\s+\S+$/i, { connectionType: "smtp" })
          ]
        })
      ]
    }),
    challengeScenario({
      id: "challenge-suspicious-access-review",
      title: "Challenge Lab 3: Suspicious Access Review",
      level: "Intermediate",
      difficulty: "Intermediate",
      layer: "application",
      layers: ["application", "network"],
      ticketId: "CYB-342",
      ticketTitle: "Investigate unusual listener and login activity",
      reportedBy: "SOC Triage Queue",
      reportedTime: "14:18",
      priority: "High",
      affectedSystem: "Linux server under review",
      role: "Junior Security Analyst",
      estimatedTime: "8-15 minutes",
      scenarioType: "Security Investigation",
      missionBriefing: "A review ticket flags unusual login failures and an unfamiliar listening port on a Linux server. Confirm your context, inspect process and socket evidence, review the authentication log, and write a short conclusion based on what the terminal proves.",
      learningObjectives: [
        "Confirm analyst context before collecting evidence",
        "Correlate process, socket, and log evidence during an investigation",
        "Write a short evidence-led conclusion instead of guessing at impact"
      ],
      successCriteria: [
        "Confirm the current analyst identity",
        "Identify the suspicious process",
        "Confirm the unexpected listening port",
        "Review failed-authentication evidence",
        "Record and verify a short conclusion"
      ],
      environmentNotes: "This is a controlled challenge environment. The goal is not to remediate the host, but to justify a defensible conclusion from the available evidence.",
      verificationRequired: true,
      verificationSteps: [
        "Confirm the suspicious listening port",
        "Confirm the authentication log contains the failed-login evidence",
        "Confirm the saved conclusion note reflects the evidence"
      ],
      commandFocus: ["whoami", "ps", "grep", "netstat", "cat", "echo"],
      challengeObjective: "Investigate the unusual listening service and login evidence, then leave a concise analyst conclusion without relying on step-by-step prompts.",
      successConditions: [
        "Confirm who is collecting the evidence",
        "Tie a process to the suspicious port",
        "Show failed authentication evidence in the log",
        "Write a short analyst conclusion"
      ],
      allowedApproaches: [
        "Start with analyst context, then move to process or socket evidence.",
        "Use grep to narrow logs or process output instead of reading everything blindly.",
        "End with a clear written conclusion rather than a pile of raw output."
      ],
      walkthrough: [
        {
          command: "whoami",
          explanation: "Begin by confirming the analyst context so you know which host and identity are collecting the evidence.",
          output: ["student"]
        },
        {
          command: "ps | grep sshd",
          explanation: "Check whether a suspicious or unusual SSH-related process is present before you interpret the open port by itself.",
          output: [
            "  PID USER       %CPU %MEM COMMAND",
            " 2222 student     4.8  0.7 sshd-wrapper | sshd -D -p 2222"
          ]
        },
        {
          command: "netstat -an | grep 2222",
          explanation: "Now confirm the listener is active and tied to the suspicious port that triggered the review.",
          output: [
            "TCP    0.0.0.0:2222          0.0.0.0:0              LISTEN"
          ]
        }
      ],
      environment: {
        cwd: "/home/student/incidents",
        directories: ["/home/student/incidents", "/home/student/incidents/notes", "/var/log"],
        files: [
          { path: "/var/log/auth.log", content: "Apr 17 14:02:11 lab sshd[2222]: Failed password for invalid user backup from 198.51.100.24 port 51120 ssh2\nApr 17 14:02:19 lab sshd[2222]: Failed password for invalid user backup from 198.51.100.24 port 51120 ssh2\nApr 17 14:03:08 lab sshd[2222]: Accepted password for trainee from 192.168.56.25 port 50111 ssh2\n" }
        ],
        processes: [
          { pid: 2222, name: "sshd-wrapper", user: "student", cpu: "4.8", memory: "0.7", command: "sshd -D -p 2222" },
          { pid: 1188, name: "bash", user: "student", cpu: "0.2", memory: "0.3", command: "-bash" }
        ],
        networkConnections: [
          { proto: "TCP", localAddress: "0.0.0.0:2222", foreignAddress: "0.0.0.0:0", state: "LISTEN", pid: 2222 },
          { proto: "TCP", localAddress: "0.0.0.0:22", foreignAddress: "0.0.0.0:0", state: "LISTEN", pid: 1044 }
        ]
      },
      machineContexts: [
        { label: "Analyst Box", role: "Linux Terminal", detail: "/home/student/incidents" },
        { label: "Linux Server", role: "Investigation Target", detail: "Auth log and process evidence available locally" }
      ],
      stages: [
        {
          id: "triage",
          title: "Triage",
          briefing: "Confirm who you are and where you are collecting evidence from before you interpret the incident data.",
          completionSummary: "You established the analyst context before widening the investigation.",
          steps: [
            step({
              objective: "Confirm the current analyst identity.",
              hints: ["Start with an identity/context command.", "Open Commands -> Linux and look for the current-user command.", "Try `whoami`."],
              explanation: "This confirms which user context is collecting the evidence.",
              whyThisMatters: "In security work, evidence is only useful if you know which host and user collected it.",
              successFeedback: "You confirmed the current analyst identity before investigating further.",
              nextObjective: "Find the process tied to the suspicious service.",
              realWorldNote: "Analysts who skip context checks lose track of which shell, host, or privilege level generated the evidence.",
              accepts: [commandMatch("whoami")]
            })
          ]
        },
        {
          id: "investigation",
          title: "Investigation",
          briefing: "Tie the suspicious service to a real process before you interpret the port by itself.",
          completionSummary: "You linked the unusual service to a specific running process.",
          steps: [
            step({
              objective: "Find the SSH-related process tied to the review ticket.",
              hints: ["Use the process list and a text filter.", "Look for an SSH-related process in Commands -> Linux.", "Try `ps | grep sshd`."],
              explanation: "This shows whether the unexpected listener belongs to an active SSH-related process.",
              whyThisMatters: "A listening port matters more once you can connect it to a real process name and PID.",
              successFeedback: "You identified the process behind the suspicious service.",
              nextObjective: "Confirm the listening socket on port 2222.",
              realWorldNote: "Process evidence is what turns a vague socket concern into something another analyst can validate.",
              accepts: [rawMatch(/^ps\s*\|\s*grep\s+sshd$/i)]
            })
          ]
        },
        {
          id: "evidence",
          title: "Evidence Gathering",
          briefing: "Now gather the network and log evidence that explains why this process triggered attention.",
          completionSummary: "You collected the socket and authentication evidence needed for a defensible conclusion.",
          steps: [
            step({
              objective: "Confirm the service is listening on port 2222.",
              hints: ["Use a socket listing command and filter for 2222.", "Open Commands -> Linux and look for netstat.", "Try `netstat -an | grep 2222`."],
              explanation: "This shows whether the suspicious service is actively listening and reachable from the network.",
              whyThisMatters: "A process name alone is not enough. The live socket tells you whether the service is actually exposed.",
              successFeedback: "You confirmed that a service is listening on port 2222.",
              nextObjective: "Review failed-authentication evidence in the auth log.",
              realWorldNote: "Socket evidence is one of the fastest ways to connect a process to real exposure risk.",
              accepts: [rawMatch(/^netstat\s+-an\s*\|\s*grep\s+2222$/i)]
            }),
            step({
              objective: "Review failed-authentication entries in the auth log.",
              hints: ["Use grep against /var/log/auth.log.", "Look for failed authentication attempts.", "Try `grep Failed /var/log/auth.log`."],
              explanation: "This narrows the log to the failed authentication entries that explain why the ticket was raised.",
              whyThisMatters: "Log evidence tells you whether the suspicious service is also associated with the reported authentication activity.",
              successFeedback: "You confirmed failed-login evidence in the authentication log.",
              nextObjective: "Write a concise analyst conclusion.",
              realWorldNote: "A small filtered log excerpt is often more useful than pasting an entire auth log into a ticket.",
              accepts: [rawMatch(/^grep\s+Failed\s+\/var\/log\/auth\.log$/i), rawMatch(/^cat\s+\/var\/log\/auth\.log\s*\|\s*grep\s+Failed$/i)]
            })
          ]
        },
        {
          id: "conclusion",
          title: "Conclusion",
          briefing: "Write a short analyst note that states what the evidence supports, not what you merely suspect.",
          completionSummary: "You translated the raw evidence into a concise investigation conclusion.",
          steps: [
            step({
              objective: "Save a short conclusion note in /home/student/incidents/notes/access-review.txt.",
              hints: ["Use echo with output redirection.", "Save the note in the notes folder.", "Try `echo Suspicious listener on port 2222 with repeated failed logins confirmed > /home/student/incidents/notes/access-review.txt`."],
              explanation: "A short conclusion note is how you turn terminal output into something the next analyst or queue can act on.",
              whyThisMatters: "Security investigations need conclusions that are brief, defensible, and tied to evidence.",
              successFeedback: "You saved a concise analyst conclusion.",
              nextObjective: "Verify the saved conclusion note.",
              realWorldNote: "A clean analyst note is often the difference between a useful escalation and a noisy one.",
              accepts: [rawMatch(/^echo\s+Suspicious listener on port 2222 with repeated failed logins confirmed\s*>\s*\/home\/student\/incidents\/notes\/access-review\.txt$/i)]
            })
          ]
        },
        {
          id: "verification",
          title: "Verification",
          briefing: "Verify the note before you close your part of the case.",
          completionSummary: "You verified the saved analyst note before handing the case on.",
          steps: [
            step({
              objective: "Read the saved analyst conclusion note.",
              hints: ["Use the Linux file-reading command.", "Open the saved note in the incidents notes folder.", "Try `cat /home/student/incidents/notes/access-review.txt`."],
              explanation: "Verification applies to the investigation note as much as it does to the live evidence.",
              whyThisMatters: "A saved note only helps the next person if it actually reflects the evidence you gathered.",
              successFeedback: "You verified the saved analyst conclusion note.",
              nextObjective: "Move to the next challenge when you are ready.",
              realWorldNote: "Analysts who verify their notes leave cleaner handoffs and reduce repeat triage.",
              accepts: [rawMatch(/^cat\s+\/home\/student\/incidents\/notes\/access-review\.txt$/i)]
            })
          ]
        }
      ]
    }),
    challengeScenario({
      id: "challenge-parameter-trace",
      title: "Challenge Lab 3: Parameter Trace",
      level: "Intermediate",
      difficulty: "Intermediate",
      layer: "application",
      layers: ["application"],
      objective: "Explore a captured web request set, isolate a high-interest parameter, and justify why it matters.",
      challengeObjective: "Explore the captured web application traffic, identify a parameter or endpoint worth testing, and choose a reasonable next step.",
      successConditions: [
        "Identify the request artifact that matters.",
        "Isolate a parameter or control field worth testing.",
        "Review evidence that the modified request changed behavior."
      ],
      allowedApproaches: [
        "List the workspace first or open the likely request directly.",
        "Use full file reads or targeted grep to isolate the interesting input.",
        "Use the replayed response to justify why the input deserves more testing."
      ],
      environment: {
        cwd: "/home/student/challenges/proxy-audit",
        directories: ["/home/student/challenges", "/home/student/challenges/proxy-audit"],
        files: [
          { path: "/home/student/challenges/proxy-audit/asset-style.txt", content: "GET /assets/site.css HTTP/1.1\nHost: app.lab\n" },
          { path: "/home/student/challenges/proxy-audit/access-request.txt", content: "POST /api/report HTTP/1.1\nHost: app.lab\nContent-Type: application/x-www-form-urlencoded\n\nmode=user&format=html\n" },
          { path: "/home/student/challenges/proxy-audit/role-change.response", content: "HTTP/1.1 200 OK\nContent-Type: text/plain\n\nmode=admin view enabled\n" }
        ]
      },
      machineContexts: [
        { label: "Analyst Box", role: "Linux Terminal", detail: "/home/student/challenges/proxy-audit" },
        { label: "Target Application", role: "app.lab capture set", detail: "Captured request and replay evidence" }
      ],
      steps: [
        step({
          objective: "Identify the request artifact that is worth investigating first.",
          context: "This capture set includes noise and a meaningful request. Start by triaging the files before you decide what to inspect deeply.",
          hints: [
            "Separate the likely business action from ordinary asset noise.",
            "A quick listing is a valid opening move, but you can open the likely request directly if you see it.",
            "Try `ls` or `cat access-request.txt`."
          ],
          explanation: "Challenge application work still starts with choosing the right request artifact rather than opening everything at random.",
          whyThisMatters: "Traffic triage is a real skill. The right first file is usually the one tied to state or user-controlled input.",
          successFeedback: "You isolated the action-bearing artifact.",
          accepts: [
            commandMatch("ls", {
              advanceBy: 1,
              feedback: "You triaged the capture set and identified the useful artifact."
            }),
            rawMatch(/^cat\s+access-request\.txt$/i)
          ]
        }),
        step({
          objective: "Isolate the control field that looks worth testing.",
          context: "Focus on the request field that looks like it could influence behavior or scope rather than on harmless formatting values.",
          hints: [
            "Look for a mode-like or role-like value.",
            "Use grep to narrow the request to the suspicious field.",
            "Try `grep mode= access-request.txt` or filter the request output for that key."
          ],
          explanation: "Small control fields often matter more than ordinary content because the server may branch on them.",
          whyThisMatters: "Application reasoning depends on recognizing which field is likely to influence trust or behavior.",
          successFeedback: "You isolated the high-interest parameter.",
          accepts: [
            rawMatch(/^grep\s+mode=\s+access-request\.txt$/i),
            rawMatch(/^cat\s+access-request\.txt\s*\|\s*grep\s+mode=$/i)
          ]
        }),
        step({
          objective: "Review the replay evidence that shows why the parameter deserves more attention.",
          context: "The replayed response is what tells you whether the parameter actually changed application behavior.",
          hints: [
            "Now switch from request inspection to response comparison.",
            "Read the replayed response directly.",
            "Try `cat role-change.response`."
          ],
          explanation: "The altered response is the evidence that turns a suspicious field into a justified next application step.",
          whyThisMatters: "A parameter only becomes interesting when you can tie it to a server-side behavior change.",
          successFeedback: "You justified the next application-focused move with evidence.",
          accepts: [rawMatch(/^cat\s+role-change\.response$/i)]
        })
      ]
    })
  ];

  const refinedExampleScenarios = exampleScenarios.map(refineScenario);
  const refinedNavigationScenarios = generatedNavigationScenarios.map(refineScenario);
  const refinedFileManipScenarios = generatedFileManipScenarios.map(refineScenario);
  const refinedTextScenarios = generatedTextScenarios.map(refineScenario);
  const refinedArchiveScenarios = generatedArchiveScenarios.map(refineScenario);
  const refinedNetworkScenarios = generatedNetworkScenarios.map(refineScenario);
  const refinedNmapScenarios = generatedNmapScenarios.map(refineScenario);
  const refinedNetcatScenarios = generatedNetcatScenarios.map(refineScenario);
  const refinedPythonScenarios = generatedPythonScenarios.map(refineScenario);
  const refinedProxyScenarios = generatedProxyScenarios.map(refineScenario);
  const refinedChallengeScenarios = generatedChallengeScenarios.map(refineScenario);
  const refinedExploitScenarios = generatedExploitScenarios.map(refineScenario);
  const refinedMetasploitScenarios = generatedMetasploitScenarios.map(refineScenario);
  const refinedTroubleshootScenarios = generatedTroubleshootScenarios.map(refineScenario);
  const refinedWindowsCurriculumScenarios = generatedWindowsCurriculumScenarios.map(refineScenario);
  const refinedCiscoCurriculumScenarios = generatedCiscoCurriculumScenarios.map(refineScenario);
  const refinedMixedScenarios = generatedMixedScenarios.map(refineScenario);

  const scenarios = [
    ...refinedExampleScenarios,
    ...refinedNavigationScenarios,
    ...refinedFileManipScenarios,
    ...refinedTextScenarios,
    ...refinedArchiveScenarios,
    ...refinedNetworkScenarios,
    ...refinedNmapScenarios,
    ...refinedNetcatScenarios,
    ...refinedPythonScenarios,
    ...refinedProxyScenarios,
    ...refinedChallengeScenarios,
    ...refinedExploitScenarios,
    ...refinedMetasploitScenarios,
    ...refinedTroubleshootScenarios,
    ...refinedWindowsCurriculumScenarios,
    ...refinedCiscoCurriculumScenarios,
    ...refinedMixedScenarios
  ];

  const scalingGuidance = [
    "Add more scenarios by extending the same helper factories instead of copying raw objects by hand.",
    "Keep each scenario between 3 and 8 steps so the learner solves a real workflow instead of isolated trivia.",
    "Reuse the shared target library and archive/file builders so new scenarios inherit realistic state automatically.",
    "Prefer multiple valid accept rules and targeted partial-feedback rules over single exact-command matches.",
    "Every new step should satisfy discovery, taught context, or logical inference before it asks the learner to act.",
    "Use exploration rules to reward ls, dir, pwd, cat, type, and scoped scans when the learner is trying to gather evidence.",
    "Scale difficulty by reducing scaffolding gradually, not by reintroducing hidden knowledge or path memorisation."
  ];

  const beginnerLabLevels = {
    windows: [
      {
        id: "level-1-terminal-orientation",
        title: "Level 1: Terminal Orientation",
        description: "Learn where to type commands, how to read the prompt, and how to move through a ticket one step at a time.",
        estimatedTime: "5-10 minutes",
        skills: ["terminal input", "Run button", "Command Help", "Hint", "Walkthrough", "dir", "cd"],
        scenarioIds: ["win-dir-incident-triage"],
        unlocksAfter: null,
        walkthrough: [
          {
            title: "Step 1: Read the ticket and current task",
            goal: "Know what you are trying to prove before you type anything.",
            explanation: "Start by reading the mission and the current task. This tells you what kind of command will actually help.",
            nowTry: "Then use Command Help, Hint, or type a command yourself."
          },
          {
            title: "Step 2: Use Command Help when you are unsure",
            goal: "Find the command family before you guess.",
            explanation: "Command Help gives you examples. It is there to help you recognise the right Windows CMD command family.",
            nowTry: "Open Command Help and look for a command that matches the task."
          }
        ]
      },
      {
        id: "level-2-folder-navigation",
        title: "Level 2: Folder Navigation",
        description: "Practice moving through Windows folders deliberately instead of jumping to guessed paths.",
        estimatedTime: "6-10 minutes",
        skills: ["cd", "dir", "folder navigation", "prompt awareness"],
        scenarioIds: ["win-cd-notes-folder", "win-tree-toolbox-map"],
        unlocksAfter: "level-1-terminal-orientation"
      },
      {
        id: "level-3-reading-files-and-notes",
        title: "Level 3: Reading Files and Notes",
        description: "Use Windows commands to inspect ticket notes and long text safely before acting.",
        estimatedTime: "8-12 minutes",
        skills: ["type", "more", "reading notes"],
        scenarioIds: ["win-type-more-audit-log", "win-attrib-hidden-plan"],
        unlocksAfter: "level-2-folder-navigation"
      },
      {
        id: "level-4-basic-system-checks",
        title: "Level 4: Basic System Checks",
        description: "Confirm who the machine is, who you are, and what environment you are working in.",
        estimatedTime: "8-12 minutes",
        skills: ["hostname", "whoami", "systeminfo", "date", "time", "set"],
        scenarioIds: ["win-host-and-user-identity", "win-build-snapshot", "win-set-and-echo-lab-role"],
        unlocksAfter: "level-3-reading-files-and-notes"
      },
      {
        id: "level-5-network-configuration",
        title: "Level 5: Network Configuration",
        description: "Learn how to inspect local adapter, IP, and hardware network details from Windows CMD.",
        estimatedTime: "6-10 minutes",
        skills: ["ipconfig", "getmac", "adapter review"],
        scenarioIds: ["win-ipconfig-and-getmac-audit"],
        unlocksAfter: "level-4-basic-system-checks"
      },
      {
        id: "level-6-connectivity-checks",
        title: "Level 6: Connectivity Checks",
        description: "Practice basic reachability tests and understand what they do and do not prove.",
        estimatedTime: "8-12 minutes",
        skills: ["ping", "tracert", "pathping"],
        scenarioIds: ["win-ping-fileserver", "win-tracert-and-pathping-web-lab"],
        unlocksAfter: "level-5-network-configuration"
      },
      {
        id: "level-7-dns-troubleshooting",
        title: "Level 7: DNS Troubleshooting",
        description: "Separate name resolution problems from basic IP reachability problems.",
        estimatedTime: "8-12 minutes",
        skills: ["nslookup", "hostname vs IP", "DNS evidence"],
        scenarioIds: ["win-nslookup-fileserver"],
        unlocksAfter: "level-6-connectivity-checks"
      },
      {
        id: "level-8-service-and-port-checks",
        title: "Level 8: Service and Port Checks",
        description: "Inspect sockets and service state before assuming an application is fully down.",
        estimatedTime: "8-12 minutes",
        skills: ["netstat", "sc query", "tasklist"],
        scenarioIds: ["win-netstat-connection-audit", "win-sc-query-spooler"],
        unlocksAfter: "level-7-dns-troubleshooting"
      },
      {
        id: "level-9-shares-and-access",
        title: "Level 9: Shares and Access",
        description: "Review Windows share and mapping workflows that show how access issues surface in support tickets.",
        estimatedTime: "8-12 minutes",
        skills: ["net share", "net use", "share access"],
        scenarioIds: ["win-net-share-audit", "win-net-use-map-tools"],
        unlocksAfter: "level-8-service-and-port-checks"
      },
      {
        id: "level-10-beginner-capstone-ticket",
        title: "Level 10: Beginner Capstone Ticket",
        description: "Combine Windows network checks and ticket-note habits in a longer troubleshooting mission.",
        estimatedTime: "10-15 minutes",
        skills: ["ipconfig", "ping", "nslookup", "route print", "verification"],
        scenarioIds: ["win-dns-escalation-ticket"],
        unlocksAfter: "level-9-shares-and-access"
      }
    ]
  };

  const scenarioStructure = {
    id: "string",
    title: "string",
    category: "string",
    mode: "lesson | challenge",
    environmentCategory: "linux | windows | cisco | cyber",
    environmentLabel: "Linux Terminal Learning | Windows Terminal Learning | Cisco CLI Lab | Cyber Challenge Mode",
    environmentPolicy: "segregated | combined",
    layer: "network | application | exploitation",
    layers: ["network", "application"],
    role: "string",
    level: "Beginner | Intermediate | Advanced",
    difficulty: "Beginner | Intermediate | Advanced | custom challenge difficulty",
    estimatedTime: "string",
    scenarioType: "string",
    shell: "linux | cmd | cisco | metasploit",
    objective: "string",
    missionBriefing: "string",
    learningObjectives: ["string"],
    successCriteria: ["string"],
    environmentNotes: "string",
    verificationRequired: "boolean",
    verificationSteps: ["string"],
    riskyCommands: [{ pattern: "string", reason: "string" }],
    ticketId: "LNX-101 | WIN-101 | CIS-201 | CYB-301 | WEB-101 | NET-101",
    priority: "Low | Medium | High",
    tags: ["string"],
    skills: ["string"],
    summary: "string",
    scenarioIntro: "string",
    commandFocus: ["command names"],
    acceptedCommands: ["example command"],
    simulatedOutput: ["key output line"],
    successCondition: "string",
    feedbackText: "string",
    challengeObjective: "string",
    hiddenSteps: "boolean",
    successConditions: ["string"],
    allowedApproaches: ["string"],
    allowedFlexibility: "string",
    machineContexts: [{ label: "Analyst Box", role: "Linux Terminal", detail: "/home/student" }],
    environment: {
      cwd: "string",
      directories: ["string"],
      files: [{ path: "string", content: "string" }],
      processes: [{ pid: 1234, name: "string" }],
      targets: [{ ip: "string", hostname: "string", ports: [{ port: 80, proto: "tcp", service: "http" }] }]
    },
    stages: [
      {
        id: "string",
        title: "string",
        briefing: "string",
        completionSummary: "string",
        steps: [
          {
            objective: "string",
            context: "string",
            hints: ["hint 1", "hint 2", "hint 3"],
            explanation: "string",
            whyThisMatters: "string",
            successFeedback: "string",
            accepts: ["match rules"],
            partials: ["partial feedback rules"],
            exploration: ["non-penalized discovery rules"]
          }
        ]
      }
    ],
    steps: [
      {
        objective: "string",
        context: "string",
        hints: ["hint 1", "hint 2", "hint 3"],
        explanation: "string",
        whyThisMatters: "string",
        successFeedback: "string",
        accepts: ["match rules"],
        partials: ["partial feedback rules"],
        exploration: ["non-penalized discovery rules"]
      }
    ]
  };

  window.ScenarioEngine = {
    scenarios,
    beginnerLabLevels,
    exampleScenarios: refinedExampleScenarios.slice(0, 15),
    scenarioStructure,
    scalingGuidance,
    totalScenarios: scenarios.length
  };
})();
