(function () {
  function flag(name, meaning) {
    return { name, meaning };
  }

  function entry(config) {
    return {
      id: config.id,
      command: config.command,
      category: config.category,
      meaning: config.meaning,
      example: config.example,
      flags: config.flags || [],
      related: config.related || [],
      aliases: config.aliases || [],
      keywords: config.keywords || []
    };
  }

  const entries = [
    entry({ id: "linux-pwd", command: "pwd", category: "Linux", meaning: "Print the current working directory.", example: "pwd", related: ["cd", "ls"], keywords: ["path", "where am i", "current directory"] }),
    entry({ id: "linux-ls", command: "ls", category: "Linux", meaning: "List files and folders in the current or target directory.", example: "ls -a /srv/apps", flags: [flag("-a", "Show hidden files too.")], related: ["pwd", "cd", "grep"], keywords: ["listing", "files", "folders", "hidden"] }),
    entry({ id: "linux-cd", command: "cd", category: "Linux", meaning: "Change into another directory.", example: "cd /srv/apps/api/logs", related: ["pwd", "ls"], keywords: ["change directory", "navigate", "move"] }),
    entry({ id: "linux-mkdir", command: "mkdir", category: "Linux", meaning: "Create a new directory.", example: "mkdir reports", related: ["cd", "touch"], keywords: ["make directory", "folder", "create"] }),
    entry({ id: "linux-touch", command: "touch", category: "Linux", meaning: "Create an empty file or update a file timestamp.", example: "touch python_nmap.py", related: ["cat", "echo"], keywords: ["create file", "empty file"] }),
    entry({ id: "linux-cat", command: "cat", category: "Linux", meaning: "Read file contents directly in the terminal.", example: "cat .env", related: ["grep", "echo", "type"], keywords: ["read file", "show contents"] }),
    entry({ id: "linux-echo", command: "echo", category: "Linux", meaning: "Print text or redirect text into a file.", example: "echo \"done\" > status.txt", related: ["cat", "touch"], keywords: ["print text", "redirect", "write file"] }),
    entry({ id: "linux-grep", command: "grep", category: "Linux", meaning: "Filter lines that match a search pattern.", example: "ps | grep api_worker", related: ["cat", "findstr", "ps"], keywords: ["filter", "search text", "pattern"] }),
    entry({ id: "linux-cp", command: "cp", category: "Linux", meaning: "Copy a file or directory to a new location.", example: "cp report.txt backup/report.txt", related: ["mv", "rm"], keywords: ["copy", "duplicate"] }),
    entry({ id: "linux-mv", command: "mv", category: "Linux", meaning: "Move or rename a file or directory.", example: "mv notes.txt notes.old", related: ["cp", "rm"], keywords: ["move", "rename"] }),
    entry({ id: "linux-rm", command: "rm", category: "Linux", meaning: "Remove a file or directory.", example: "rm memory.dump", related: ["mv", "cp"], keywords: ["delete", "remove"] }),
    entry({ id: "linux-ps", command: "ps", category: "Linux", meaning: "List running processes so you can inspect PIDs and commands.", example: "ps | grep api-worker", related: ["kill", "grep", "tasklist"], keywords: ["processes", "pid", "running"] }),
    entry({ id: "linux-kill", command: "kill", category: "Linux", meaning: "Send a signal to a process by PID.", example: "kill -9 2451", flags: [flag("-9", "Forcefully terminate the process.")], related: ["ps", "taskkill"], keywords: ["terminate", "process", "pid"] }),
    entry({ id: "linux-tar", command: "tar", category: "Linux", meaning: "Extract or create tar archives.", example: "tar -xvzf python-nmap.tar.gz", flags: [flag("-x", "Extract files from the archive."), flag("-v", "Show each file as it is processed."), flag("-z", "Use gzip compression or decompression."), flag("-f", "Specify the archive filename.")], related: ["wget", "ls"], keywords: ["archive", "extract", "tar.gz"] }),
    entry({ id: "linux-wget", command: "wget", category: "Linux", meaning: "Download a file from a URL.", example: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz", flags: [flag("-O", "Save the download using a chosen output filename.")], related: ["tar", "ls"], keywords: ["download", "url", "file"] }),
    entry({ id: "linux-ping", command: "ping", category: "Linux", meaning: "Check whether a host responds on the network.", example: "ping 192.168.56.102", related: ["nmap", "nc"], keywords: ["reachability", "icmp", "host up"] }),

    entry({ id: "cmd-cd", command: "cd", category: "Windows CMD", meaning: "Change the current directory in CMD.", example: "cd C:\\Lab\\Incident", related: ["dir", "type"], keywords: ["windows path", "directory", "navigate"] }),
    entry({ id: "cmd-dir", command: "dir", category: "Windows CMD", meaning: "List files and folders in the current or target directory.", example: "dir C:\\Lab\\Logs", related: ["cd", "type"], keywords: ["windows listing", "files", "folders"] }),
    entry({ id: "cmd-type", command: "type", category: "Windows CMD", meaning: "Print file contents in CMD.", example: "type service.txt", related: ["findstr", "cat"], keywords: ["read file", "show contents"] }),
    entry({ id: "cmd-echo", command: "echo", category: "Windows CMD", meaning: "Print text or redirect it into a file.", example: "echo done > status.txt", related: ["type"], keywords: ["print text", "redirect", "write file"] }),
    entry({ id: "cmd-findstr", command: "findstr", category: "Windows CMD", meaning: "Filter text output for a matching string in CMD.", example: "tasklist | findstr spoolsvc", related: ["tasklist", "type", "grep"], keywords: ["filter", "search text", "windows grep"] }),
    entry({ id: "cmd-tasklist", command: "tasklist", category: "Windows CMD", meaning: "Show running Windows processes and their PIDs.", example: "tasklist | findstr spoolsvc", related: ["taskkill", "findstr", "ps"], keywords: ["processes", "pid", "windows"] }),
    entry({ id: "cmd-taskkill", command: "taskkill", category: "Windows CMD", meaning: "Terminate a Windows process by PID or image name.", example: "taskkill /PID 884 /F", flags: [flag("/PID", "Target a specific process ID."), flag("/F", "Force the process to terminate.")], related: ["tasklist"], keywords: ["kill process", "terminate", "windows pid"] }),

    entry({ id: "nmap-command", command: "nmap", category: "Nmap", meaning: "Scan hosts for open ports, services, and fingerprints.", example: "nmap -sV 192.168.56.102", flags: [flag("-p", "Scan only the specified ports."), flag("-sV", "Probe service versions."), flag("-O", "Attempt OS detection."), flag("-oN", "Write normal text output to a file."), flag("--top-ports", "Scan the most common ports only.")], related: ["ping", "nc", "-p", "-sV"], keywords: ["scan", "ports", "services", "host discovery"] }),
    entry({ id: "nmap-p", command: "-p", category: "Nmap", meaning: "Scan only specific ports instead of the default set.", example: "nmap -p 21,80,443 192.168.56.102", related: ["nmap", "--top-ports", "-sV"], keywords: ["ports", "specific port", "targeted scan"] }),
    entry({ id: "nmap-il", command: "-iL", category: "Nmap", meaning: "Load targets from a file.", example: "nmap -iL targets.txt -p 80,443", related: ["nmap", "--exclude", "-oN"], keywords: ["input list", "targets file", "batch scan"] }),
    entry({ id: "nmap-exclude", command: "--exclude", category: "Nmap", meaning: "Skip specific hosts or IPs during a scan.", example: "nmap 192.168.56.0/24 --exclude 192.168.56.1", related: ["nmap", "-iL", "--top-ports"], keywords: ["exclude hosts", "omit target", "subnet scan"] }),
    entry({ id: "nmap-on", command: "-oN", category: "Nmap", meaning: "Write scan output in normal text format.", example: "nmap -sV -oN baseline.txt 192.168.56.102", related: ["nmap", "-oX", "-oA"], keywords: ["save output", "report", "text file"] }),
    entry({ id: "nmap-ox", command: "-oX", category: "Nmap", meaning: "Write scan output in XML format.", example: "nmap -oX scan.xml 192.168.56.102", related: ["nmap", "-oN", "-oA"], keywords: ["xml", "save output", "machine readable"] }),
    entry({ id: "nmap-oa", command: "-oA", category: "Nmap", meaning: "Write all major Nmap output formats with one base name.", example: "nmap -oA corp-scan 192.168.56.0/24", related: ["nmap", "-oN", "-oX"], keywords: ["all output", "report set", "gnmap"] }),
    entry({ id: "nmap-os", command: "-O", category: "Nmap", meaning: "Attempt operating system detection.", example: "nmap -O 192.168.56.102", related: ["nmap", "-sV"], keywords: ["os detection", "fingerprint", "host profile"] }),
    entry({ id: "nmap-sv", command: "-sV", category: "Nmap", meaning: "Probe open ports to identify service versions.", example: "nmap -sV -p 80 192.168.56.102", related: ["nmap", "-p", "-O"], keywords: ["version detection", "service evidence"] }),
    entry({ id: "nmap-ss", command: "-sS", category: "Nmap", meaning: "Run a TCP SYN scan for a fast, lower-noise TCP probe.", example: "nmap -sS 192.168.56.102", related: ["nmap", "-sT", "-T4"], keywords: ["syn scan", "stealth", "tcp scan"] }),
    entry({ id: "nmap-st", command: "-sT", category: "Nmap", meaning: "Run a TCP connect scan using full connections.", example: "nmap -sT 192.168.56.102", related: ["nmap", "-sS"], keywords: ["tcp connect", "full connection", "scan"] }),
    entry({ id: "nmap-su", command: "-sU", category: "Nmap", meaning: "Scan UDP ports.", example: "nmap -sU -p 53,161 192.168.56.102", related: ["nmap", "-p"], keywords: ["udp", "dns", "snmp"] }),
    entry({ id: "nmap-t4", command: "-T4", category: "Nmap", meaning: "Use a faster timing template for reasonably quick scans.", example: "nmap -T4 --top-ports 20 192.168.56.102", related: ["nmap", "--top-ports"], keywords: ["timing", "speed", "faster scan"] }),
    entry({ id: "nmap-topports", command: "--top-ports", category: "Nmap", meaning: "Scan the most common ports instead of the full range.", example: "nmap --top-ports 20 192.168.56.102", related: ["nmap", "-p", "-T4"], keywords: ["common ports", "quick triage"] }),
    entry({ id: "nmap-pn", command: "-Pn", category: "Nmap", meaning: "Treat the host as online and skip host discovery.", example: "nmap -Pn -p 22 192.168.56.102", related: ["nmap", "ping"], keywords: ["skip ping", "host discovery", "assume up"] }),

    entry({ id: "netcat-command", command: "nc / netcat", category: "Netcat", meaning: "Open TCP or UDP connections, listen on ports, or move simple data.", example: "nc -lvnp 4444", flags: [flag("-n", "Use numeric IPs and ports only."), flag("-v", "Show verbose connection details."), flag("-l", "Listen for an incoming connection."), flag("-p", "Specify the local port.")], related: ["ping", "telnet"], aliases: ["nc", "netcat"], keywords: ["listener", "reverse shell", "connection", "socket"] }),
    entry({ id: "netcat-n", command: "-n", category: "Netcat", meaning: "Use numeric addresses and skip DNS resolution.", example: "nc -nv 192.168.56.102 25", related: ["nc / netcat", "-v"], keywords: ["numeric", "no dns", "faster lookup"] }),
    entry({ id: "netcat-v", command: "-v", category: "Netcat", meaning: "Show connection progress and banner details.", example: "nc -nv 192.168.56.102 25", related: ["nc / netcat", "-n"], keywords: ["verbose", "debug", "banner"] }),
    entry({ id: "netcat-l", command: "-l", category: "Netcat", meaning: "Listen for an inbound connection instead of connecting out.", example: "nc -lvnp 4444", related: ["nc / netcat", "-p"], keywords: ["listener", "bind", "wait for connection"] }),
    entry({ id: "netcat-p", command: "-p", category: "Netcat", meaning: "Specify the local listening or source port.", example: "nc -lvnp 4444", related: ["nc / netcat", "-l"], keywords: ["port", "listener port", "source port"] }),

    entry({ id: "msfdb-init", command: "sudo msfdb init", category: "Metasploit", meaning: "Initialize the Metasploit database service.", example: "sudo msfdb init", related: ["msfconsole", "db_status"], keywords: ["database", "init", "setup"] }),
    entry({ id: "msfconsole", command: "msfconsole", category: "Metasploit", meaning: "Start the Metasploit console.", example: "msfconsole", related: ["search", "use", "show options"], keywords: ["start metasploit", "framework console"] }),
    entry({ id: "msf-banner", command: "banner", category: "Metasploit", meaning: "Show the current Metasploit banner.", example: "banner", related: ["msfconsole"], keywords: ["splash", "banner"] }),
    entry({ id: "msf-db-status", command: "db_status", category: "Metasploit", meaning: "Check whether Metasploit is connected to its database.", example: "db_status", related: ["sudo msfdb init", "msfconsole"], keywords: ["database connected", "db"] }),
    entry({ id: "msf-search", command: "search", category: "Metasploit", meaning: "Search modules by service, product, or vulnerability keyword.", example: "search vsftpd", related: ["use", "info"], keywords: ["find module", "module search", "vulnerability"] }),
    entry({ id: "msf-use", command: "use", category: "Metasploit", meaning: "Select a specific module to work with.", example: "use exploit/unix/ftp/vsftpd_234_backdoor", related: ["search", "show options", "info"], keywords: ["select module", "load exploit"] }),
    entry({ id: "msf-options", command: "options", category: "Metasploit", meaning: "View module options in shorter form.", example: "options", related: ["show options", "set RHOSTS"], keywords: ["module settings", "required values"] }),
    entry({ id: "msf-show-options", command: "show options", category: "Metasploit", meaning: "Show the current module options and required settings.", example: "show options", related: ["options", "set RHOSTS", "show payloads"], keywords: ["module options", "required fields"] }),
    entry({ id: "msf-info", command: "info", category: "Metasploit", meaning: "Show detailed information about the selected module.", example: "info", related: ["search", "use", "show payloads"], keywords: ["module details", "disclosure", "description"] }),
    entry({ id: "msf-set-rhosts", command: "set RHOSTS", category: "Metasploit", meaning: "Set the remote target host or hosts.", example: "set RHOSTS 192.168.56.102", related: ["show options", "run", "exploit"], keywords: ["target host", "remote hosts", "rhosts"] }),
    entry({ id: "msf-show-payloads", command: "show payloads", category: "Metasploit", meaning: "List payloads that work with the current module.", example: "show payloads", related: ["use", "info", "run"], keywords: ["payload list", "compatible payloads"] }),
    entry({ id: "msf-run", command: "run", category: "Metasploit", meaning: "Execute the current module using the configured options.", example: "run", related: ["exploit", "show options"], keywords: ["execute module", "launch exploit"] }),
    entry({ id: "msf-exploit", command: "exploit", category: "Metasploit", meaning: "Execute the current exploit module.", example: "exploit", related: ["run", "use"], keywords: ["run exploit", "launch"] })
  ];

  const categories = ["All", "Linux", "Windows CMD", "Nmap", "Netcat", "Metasploit"];

  function searchableText(entryRecord) {
    const flagsText = (entryRecord.flags || [])
      .map((value) => (typeof value === "string" ? value : `${value.name} ${value.meaning}`))
      .join(" ");

    return [
      entryRecord.command,
      entryRecord.category,
      entryRecord.meaning,
      entryRecord.example,
      flagsText,
      ...(entryRecord.related || []),
      ...(entryRecord.aliases || []),
      ...(entryRecord.keywords || [])
    ]
      .join(" ")
      .toLowerCase();
  }

  function searchEntries(query = "", category = "All") {
    const normalizedQuery = (query || "").trim().toLowerCase();
    return entries.filter((item) => {
      if (category && category !== "All" && item.category !== category) return false;
      if (!normalizedQuery) return true;
      return searchableText(item).includes(normalizedQuery);
    });
  }

  function findEntry(command) {
    const normalized = (command || "").trim().toLowerCase();
    return entries.find((item) => item.command.toLowerCase() === normalized) || null;
  }

  function lookupForInput(rawInput) {
    const normalized = (rawInput || "").trim().toLowerCase();
    if (!normalized) return null;

    const ranked = [...entries].sort((left, right) => right.command.length - left.command.length);

    for (const item of ranked) {
      const commands = [item.command, ...(item.aliases || [])].map((value) => value.toLowerCase());
      const matched = commands.find((command) => normalized === command || normalized.startsWith(`${command} `));
      if (matched) return item;
    }

    return null;
  }

  window.CommandsData = {
    entries,
    categories,
    searchEntries,
    findEntry,
    lookupForInput
  };
})();
