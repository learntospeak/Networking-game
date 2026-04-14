(function () {
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function step(config) {
    return {
      objective: config.objective,
      hints: config.hints || [],
      context: config.context || "",
      explanation: config.explanation,
      whyThisMatters: config.whyThisMatters || "",
      successFeedback: config.successFeedback || "That command moves the task forward.",
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
        ...(config.directories || [])
      ],
      files: config.files || [],
      processes: config.processes || [],
      targets: config.targets || commonTargets()
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

  function archiveFile(path, entries) {
    return { path, content: "", archiveEntries: entries };
  }

  function commandMatch(command, extras = {}) {
    return { command, ...extras };
  }

  function rawMatch(regex, extras = {}) {
    return { raw: regex, ...extras };
  }

  function cwdMatch(target, extras = {}) {
    return {
      command: "cd",
      finalCwd: target,
      postCheck: (_, state) => state.cwd === target,
      ...extras
    };
  }

  function fileExistsMatch(path, extras = {}) {
    return {
      fileExists: path,
      postCheck: (_, state) => Boolean(window.StateManager.getNode(state, path)),
      ...extras
    };
  }

  function listenerPortMatch(port, extras = {}) {
    return { listenerPort: port, ...extras };
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
    return stepConfig.whyThisMatters || firstSentence(stepConfig.explanation);
  }

  function buildExplorationRules(scenario, stepConfig) {
    const rules = [];
    const objective = stepConfig.objective.toLowerCase();
    const category = scenario.category.toLowerCase();

    if (scenario.shell === "linux") {
      rules.push(
        explorationRule(commandMatch("pwd"), "Good context check. Knowing your current path reduces wrong turns before you act.", "Use the printed path to decide whether you should stay here or move somewhere more relevant."),
        explorationRule(commandMatch("ls"), "Good discovery step. Listings are how you reduce guessing in a live filesystem.", "Use the listing to identify the directory or file name that best matches the objective."),
        explorationRule(rawMatch(/^ls\s+\/.*$/i), "Useful exploration. Checking another directory is a valid way to discover where data or logs live.", "Walk the tree one level at a time so you can justify the next move instead of memorising paths."),
        explorationRule(commandMatch("cd"), "Exploration is valid. If you move into a candidate directory, confirm it with pwd or ls.", "Real operators often probe the tree before they commit to a final path."),
        explorationRule(commandMatch("cat"), "Reading a file can be useful once you have narrowed the path.", "Use file reads to confirm clues after discovery has reduced the search space.")
      );
    } else {
      rules.push(
        explorationRule(commandMatch("dir"), "Good discovery step. dir is how you inspect the current Windows workspace before changing state.", "Use the listing to decide which folder or file actually matches the task."),
        explorationRule(commandMatch("cd"), "Exploration is valid. Moving into a candidate folder is fine if you verify what is inside it next.", "In CMD, directory changes are part of discovery when the exact path is not yet obvious."),
        explorationRule(commandMatch("type"), "Reading a file is a valid way to gather evidence after you have found the right location.", "Use type to confirm clues from a specific note or log once the path is narrowed."),
        explorationRule(commandMatch("findstr"), "Filtering is a sensible move once you already know which Windows file contains the signal.", "Use findstr after you have read or located the right file.")
      );
    }

    if (category.includes("nmap") || category.includes("networking") || category.includes("exploitation") || category.includes("netcat") || category.includes("metasploit")) {
      rules.push(
        explorationRule(commandMatch("ping"), "That is a valid discovery move. Reachability checks often come before deeper service work.", "Use the result to decide whether you should keep scanning, narrow ports, or change approach."),
        explorationRule(commandMatch("nmap"), "That is in the right tool family. Use what the scan gives you to justify the next, more targeted step.", "Good operators move from broad evidence to narrow evidence instead of guessing."),
        explorationRule(commandMatch("searchsploit"), "Research is valid once you have enough evidence to justify it.", "Tie exploit research back to a confirmed service or version so the workflow stays disciplined.")
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
        explorationRule(commandMatch("ps"), "Good evidence-gathering step. Process listings are how you verify which PID you should care about.", "Use the output to isolate the exact process before you kill anything."),
        explorationRule(commandMatch("tasklist"), "Good evidence-gathering step. Task listings are how you verify the exact Windows process before you stop it.", "Use the output to isolate the right PID before you terminate anything.")
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
      whyThisMatters: inferWhyThisMatters(stepConfig),
      exploration: [...buildExplorationRules(scenario, stepConfig), ...(stepConfig.exploration || [])]
    };
  }

  function refineScenario(scenario) {
    return {
      ...scenario,
      steps: scenario.steps.map((stepConfig) => refineStep(stepConfig, scenario))
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
          hints: ["Use the SMTP greeting verb.", "Identify your client first.", "Try `EHLO lab.local`."],
          explanation: "EHLO is the correct first protocol command after the SMTP banner because it starts the session cleanly.",
          successFeedback: "You started the SMTP conversation.",
          accepts: [rawMatch(/^EHLO\s+lab\.local$/i)]
        }),
        step({
          objective: "Set the sender address for the test message.",
          hints: ["The sender comes before the recipient.", "Use the SMTP sender verb.", "Try `MAIL FROM:<kali@lab.local>`."],
          explanation: "MAIL FROM defines the envelope sender and must happen before you identify the recipient.",
          successFeedback: "You set the sender address.",
          accepts: [rawMatch(/^MAIL FROM:<kali@lab\.local>$/i)]
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
      objective: "Create a clean script workspace, move into it, create the file, and verify the result.",
      allowedFlexibility: "Any valid path form is acceptable as long as the final workspace and file exist in the right location.",
      environment: linuxEnv({ cwd: "/home/student/scripts" }),
      steps: [
        step({
          objective: "Create a new folder for the scan project.",
          hints: ["Start by making the project directory.", "Create a folder named port-audit.", "Try `mkdir port-audit`."],
          explanation: "Creating a dedicated project folder before you script keeps tools and notes isolated from the rest of the host.",
          successFeedback: "You created the project directory.",
          accepts: [fileExistsMatch("/home/student/scripts/port-audit", { command: "mkdir" })]
        }),
        step({
          objective: "Move into the new project folder.",
          hints: ["Work inside the new project directory.", "Change into port-audit.", "Try `cd port-audit`."],
          explanation: "Entering the project folder first keeps later files in the right place.",
          successFeedback: "You moved into the project directory.",
          accepts: [cwdMatch("/home/student/scripts/port-audit")]
        }),
        step({
          objective: "Create the Python scan file.",
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
    return {
      id: config.id,
      title: config.title,
      category: config.category,
      level: config.level,
      shell: "linux",
      objective: config.objective,
      allowedFlexibility: config.allowedFlexibility || "Reasonable command variations are fine if the right state or evidence is produced.",
      environment: linuxEnv(config.environment || {}),
      steps: config.steps
    };
  }

  function cmdScenario(config) {
    return {
      id: config.id,
      title: config.title,
      category: config.category,
      level: config.level,
      shell: "cmd",
      objective: config.objective,
      allowedFlexibility: config.allowedFlexibility || "Stay inside CMD commands while reaching the required result.",
      environment: cmdEnv(config.environment || {}),
      steps: config.steps
    };
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
      objective: "Create a quarantine folder, move the suspicious log into it, and verify the move completed.",
      cwd: "/home/student/downloads",
      files: [{ path: "/home/student/downloads/suspicious.log", content: "anomalous login pattern\n" }],
      steps: [
        step({ objective: "Create a quarantine directory.", hints: ["You need a holding area first.", "Create a folder named quarantine.", "Try `mkdir quarantine`."], explanation: "Quarantine folders keep suspicious artifacts separate from the rest of the workspace.", accepts: [fileExistsMatch("/home/student/downloads/quarantine", { command: "mkdir" })] }),
        step({ objective: "Move suspicious.log into the quarantine folder.", hints: ["Use the move command.", "Send suspicious.log into quarantine.", "Try `mv suspicious.log quarantine/`."], explanation: "Moving the file separates it from the main workspace without destroying it.", accepts: [fileExistsMatch("/home/student/downloads/quarantine/suspicious.log", { command: "mv" })] }),
        step({ objective: "List the quarantine folder to confirm the move.", hints: ["Check the target folder now.", "List quarantine.", "Try `ls quarantine`."], explanation: "A direct listing of the target directory confirms the file landed where you intended.", accepts: [rawMatch(/^ls\s+quarantine$/i)] })
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
      id: "smtp-full-mail-flow",
      title: "SMTP Full Mail Flow",
      category: "Netcat workflows",
      level: "Advanced",
      objective: "Connect to SMTP on metasploitable2 (192.168.56.102) and progress through sender, recipient, data, and session close.",
      environment: { cwd: "/home/student", targets: commonTargets() },
      steps: [
        step({ objective: "Connect to SMTP on the target.", context: "The SMTP host for this workflow is metasploitable2 at 192.168.56.102. Open a raw TCP session to port 25.", hints: ["Use Netcat against port 25.", "Connect to the service directly.", "Try `nc -nv metasploitable2 25` or `nc -nv 192.168.56.102 25`."], explanation: "A raw TCP connection is what gives you manual protocol control over SMTP.", accepts: [rawMatch(/^nc\s+-nv\s+192\.168\.56\.102\s+25$/i), rawMatch(/^nc\s+-nv\s+metasploitable2\s+25$/i), rawMatch(/^nc\s+-nv\s+target\s+25$/i)] }),
        step({ objective: "Start the session with EHLO.", hints: ["Use the SMTP greeting command.", "Identify your client first.", "Try `EHLO lab.local`."], explanation: "EHLO is the correct opening protocol verb after the service banner.", accepts: [rawMatch(/^EHLO\s+lab\.local$/i)] }),
        step({ objective: "Set the sender address.", hints: ["Use the sender verb.", "Define the sender before the recipient.", "Try `MAIL FROM:<kali@lab.local>`."], explanation: "The sender must be defined before you can address the message to a recipient.", accepts: [rawMatch(/^MAIL FROM:<kali@lab\.local>$/i)] }),
        step({ objective: "Set the recipient address.", hints: ["Use the recipient verb next.", "Name the target mailbox.", "Try `RCPT TO:<admin@lab.local>`."], explanation: "RCPT TO tells the SMTP service who the message is for.", accepts: [rawMatch(/^RCPT TO:<admin@lab\.local>$/i)] }),
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

  const refinedExampleScenarios = exampleScenarios.map(refineScenario);
  const refinedNavigationScenarios = generatedNavigationScenarios.map(refineScenario);
  const refinedFileManipScenarios = generatedFileManipScenarios.map(refineScenario);
  const refinedTextScenarios = generatedTextScenarios.map(refineScenario);
  const refinedArchiveScenarios = generatedArchiveScenarios.map(refineScenario);
  const refinedNetworkScenarios = generatedNetworkScenarios.map(refineScenario);
  const refinedNmapScenarios = generatedNmapScenarios.map(refineScenario);
  const refinedNetcatScenarios = generatedNetcatScenarios.map(refineScenario);
  const refinedPythonScenarios = generatedPythonScenarios.map(refineScenario);
  const refinedExploitScenarios = generatedExploitScenarios.map(refineScenario);
  const refinedMetasploitScenarios = generatedMetasploitScenarios.map(refineScenario);
  const refinedTroubleshootScenarios = generatedTroubleshootScenarios.map(refineScenario);
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
    ...refinedExploitScenarios,
    ...refinedMetasploitScenarios,
    ...refinedTroubleshootScenarios,
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

  const scenarioStructure = {
    id: "string",
    title: "string",
    category: "string",
    level: "Beginner | Intermediate | Advanced",
    shell: "linux | cmd | metasploit",
    objective: "string",
    allowedFlexibility: "string",
    environment: {
      cwd: "string",
      directories: ["string"],
      files: [{ path: "string", content: "string" }],
      processes: [{ pid: 1234, name: "string" }],
      targets: [{ ip: "string", hostname: "string", ports: [{ port: 80, proto: "tcp", service: "http" }] }]
    },
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
    exampleScenarios: refinedExampleScenarios.slice(0, 15),
    scenarioStructure,
    scalingGuidance,
    totalScenarios: scenarios.length
  };
})();
