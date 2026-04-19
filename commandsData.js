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
    entry({ id: "linux-grep", command: "grep", category: "Linux", meaning: "Filter lines that match a search pattern.", example: "ps | grep api_worker", flags: [flag("-i", "Ignore case when matching text."), flag("-n", "Show line numbers with matches.")], related: ["cat", "findstr", "ps"], keywords: ["filter", "search text", "pattern"] }),
    entry({ id: "linux-cp", command: "cp", category: "Linux", meaning: "Copy a file or directory to a new location.", example: "cp report.txt backup/report.txt", related: ["mv", "rm"], keywords: ["copy", "duplicate"] }),
    entry({ id: "linux-mv", command: "mv", category: "Linux", meaning: "Move or rename a file or directory.", example: "mv notes.txt notes.old", related: ["cp", "rm"], keywords: ["move", "rename"] }),
    entry({ id: "linux-rm", command: "rm", category: "Linux", meaning: "Remove a file or directory.", example: "rm memory.dump", related: ["mv", "cp"], keywords: ["delete", "remove"] }),
    entry({ id: "linux-ps", command: "ps", category: "Linux", meaning: "List running processes so you can inspect PIDs and commands.", example: "ps -a | grep api-worker", flags: [flag("-a", "Show processes from more than just the current shell context."), flag("-ef", "Show a fuller process listing on many Linux systems.")], related: ["kill", "grep", "tasklist"], keywords: ["processes", "pid", "running"] }),
    entry({ id: "linux-kill", command: "kill", category: "Linux", meaning: "Send a signal to a process by PID.", example: "kill -9 2451", flags: [flag("-9", "Forcefully terminate the process.")], related: ["ps", "taskkill"], keywords: ["terminate", "process", "pid"] }),
    entry({ id: "linux-tar", command: "tar", category: "Linux", meaning: "Extract or create tar archives.", example: "tar -xvzf python-nmap.tar.gz", flags: [flag("-x", "Extract files from the archive."), flag("-v", "Show each file as it is processed."), flag("-z", "Use gzip compression or decompression."), flag("-f", "Specify the archive filename.")], related: ["wget", "ls"], keywords: ["archive", "extract", "tar.gz"] }),
    entry({ id: "linux-wget", command: "wget", category: "Linux", meaning: "Download a file from a URL.", example: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz", flags: [flag("-O", "Save the download using a chosen output filename.")], related: ["tar", "ls"], keywords: ["download", "url", "file"] }),
    entry({ id: "linux-ping", command: "ping", category: "Linux", meaning: "Check whether a host responds on the network.", example: "ping 192.168.56.102", flags: [flag("-c", "Limit how many echo requests are sent.")], related: ["nmap", "nc"], keywords: ["reachability", "icmp", "host up"] }),
    entry({ id: "linux-sudo", command: "sudo", category: "Linux", meaning: "Run a command with elevated privileges.", example: "sudo apt install python3-nmap", related: ["apt install", "msfconsole"], keywords: ["privilege", "root", "admin"] }),
    entry({ id: "linux-apt-install", command: "apt install", category: "Linux", meaning: "Install packages from the configured APT repositories.", example: "sudo apt install python3-nmap", related: ["apt show", "wget", "python"], keywords: ["package install", "apt", "deb", "software"] }),
    entry({ id: "linux-apt-show", command: "apt show", category: "Linux", meaning: "Display package metadata such as version, description, and dependencies.", example: "apt show python3-nmap", related: ["apt install", "dpkg", "python"], keywords: ["package info", "apt", "metadata"] }),
    entry({ id: "linux-nano", command: "nano", category: "Linux", meaning: "Open a file in a terminal text editor.", example: "nano example.py", related: ["cat", "echo", "python"], keywords: ["editor", "edit file", "terminal editor"] }),
    entry({ id: "linux-python", command: "python", category: "Linux", meaning: "Run a Python script or open the Python interpreter.", example: "python ./python_nmap.py", aliases: ["python3"], related: ["nano", "touch", "wget"], keywords: ["python interpreter", "run script", "script execution"] }),
    entry({ id: "linux-ssh", command: "ssh", category: "Linux", meaning: "Open a secure remote shell session to another host.", example: "ssh msfadmin@192.168.56.102", related: ["telnet", "nc / netcat"], keywords: ["remote login", "secure shell", "encrypted session"] }),
    entry({ id: "linux-telnet", command: "telnet", category: "Linux", meaning: "Open a plain-text TCP session to a remote host and port.", example: "telnet 192.168.56.102 23", related: ["ssh", "nc / netcat", "QUIT"], keywords: ["remote session", "plain text", "tcp client", "legacy"] }),
    entry({ id: "linux-searchsploit", command: "searchsploit", category: "Linux", meaning: "Search the local Exploit-DB copy for public exploit references.", example: "searchsploit samba", related: ["nmap", "msfconsole", "search"], keywords: ["exploit research", "exploit-db", "vulnerability lookup"] }),
    entry({ id: "linux-find", command: "find", category: "Linux", meaning: "Search for files and directories by name, path, or other attributes.", example: "find /srv -name \"*.log\"", related: ["ls", "grep", "pwd"], keywords: ["locate file", "search filesystem", "path"] }),
    entry({ id: "linux-head", command: "head", category: "Linux", meaning: "Show the first lines of a file.", example: "head access.log", related: ["tail", "cat", "less"], keywords: ["first lines", "preview file", "logs"] }),
    entry({ id: "linux-tail", command: "tail", category: "Linux", meaning: "Show the last lines of a file or follow new log output.", example: "tail -f /var/log/app.log", flags: [flag("-f", "Follow a file as new lines are appended.")], related: ["head", "cat", "less"], keywords: ["last lines", "follow log", "logs"] }),
    entry({ id: "linux-less", command: "less", category: "Linux", meaning: "Open a file in a pager so you can scroll through it interactively.", example: "less access.log", related: ["cat", "head", "tail"], keywords: ["pager", "scroll file", "read large file"] }),
    entry({ id: "linux-chmod", command: "chmod", category: "Linux", meaning: "Change file or directory permissions.", example: "chmod +x healthcheck.py", related: ["ls", "python", "cp"], keywords: ["permissions", "executable", "access rights"] }),
    entry({ id: "linux-history", command: "history", category: "Linux", meaning: "Show recent shell commands from your session history.", example: "history", related: ["grep", "clear", "pwd"], keywords: ["command history", "recent commands"] }),
    entry({ id: "linux-clear", command: "clear", category: "Linux", meaning: "Clear the terminal screen without changing the current session state.", example: "clear", related: ["history", "pwd"], keywords: ["clear screen", "terminal display"] }),

    entry({ id: "cmd-cd", command: "cd", category: "Windows CMD", meaning: "Change the current directory in CMD.", example: "cd C:\\Lab\\Incident", related: ["dir", "tree", "pushd"], keywords: ["windows path", "directory", "navigate", "cd ..", "change folder"] }),
    entry({ id: "cmd-dir", command: "dir", category: "Windows CMD", meaning: "List files and folders in the current or target directory.", example: "dir C:\\Lab\\Logs", flags: [flag("/A", "Show files with specific attributes, including hidden files."), flag("/B", "Use a bare format with names only."), flag("/S", "List files in the current directory and all subdirectories.")], related: ["cd", "type", "tree"], keywords: ["windows listing", "files", "folders", "hidden files"] }),
    entry({ id: "cmd-type", command: "type", category: "Windows CMD", meaning: "Print file contents in CMD.", example: "type service.txt", related: ["findstr", "cat"], keywords: ["read file", "show contents"] }),
    entry({ id: "cmd-echo", command: "echo", category: "Windows CMD", meaning: "Print text or redirect it into a file.", example: "echo done > status.txt", related: ["type"], keywords: ["print text", "redirect", "write file"] }),
    entry({ id: "cmd-findstr", command: "findstr", category: "Windows CMD", meaning: "Filter text output for a matching string in CMD.", example: "tasklist | findstr spoolsvc", related: ["tasklist", "type", "grep"], keywords: ["filter", "search text", "windows grep"] }),
    entry({ id: "cmd-tasklist", command: "tasklist", category: "Windows CMD", meaning: "Show running Windows processes and their PIDs.", example: "tasklist | findstr spoolsvc", related: ["taskkill", "findstr", "ps"], keywords: ["processes", "pid", "windows"] }),
    entry({ id: "cmd-taskkill", command: "taskkill", category: "Windows CMD", meaning: "Terminate a Windows process by PID or image name.", example: "taskkill /PID 884 /F", flags: [flag("/PID", "Target a specific process ID."), flag("/F", "Force the process to terminate.")], related: ["tasklist"], keywords: ["kill process", "terminate", "windows pid"] }),
    entry({ id: "cmd-cls", command: "cls", category: "Windows CMD", meaning: "Clear the CMD screen.", example: "cls", related: ["dir", "echo"], keywords: ["clear screen", "cmd display"] }),
    entry({ id: "cmd-mkdir", command: "mkdir", category: "Windows CMD", meaning: "Create a new directory in CMD.", example: "mkdir C:\\Lab\\Archive", aliases: ["md"], related: ["cd", "rmdir", "dir"], keywords: ["make directory", "create folder", "md"] }),
    entry({ id: "cmd-rmdir", command: "rmdir", category: "Windows CMD", meaning: "Remove a directory in CMD.", example: "rmdir C:\\Lab\\Temp", aliases: ["rd"], flags: [flag("/S", "Remove the directory and all files and subdirectories inside it."), flag("/Q", "Quiet mode with no confirmation prompts.")], related: ["mkdir", "del", "dir"], keywords: ["remove directory", "delete folder", "rd"] }),
    entry({ id: "cmd-tree", command: "tree", category: "Windows CMD", meaning: "Display the directory structure of a path as a tree.", example: "tree C:\\Lab", flags: [flag("/F", "Show files as well as folders in the tree.")], related: ["dir", "cd", "where"], keywords: ["folder tree", "directory structure", "navigation"] }),
    entry({ id: "cmd-pushd", command: "pushd", category: "Windows CMD", meaning: "Change to a directory and save the previous location on a stack.", example: "pushd C:\\Lab\\Logs", related: ["popd", "cd", "dir"], keywords: ["directory stack", "jump to folder", "navigation"] }),
    entry({ id: "cmd-popd", command: "popd", category: "Windows CMD", meaning: "Return to the last directory saved with pushd.", example: "popd", related: ["pushd", "cd"], keywords: ["directory stack", "return to folder", "navigation"] }),
    entry({ id: "cmd-ren", command: "ren", category: "Windows CMD", meaning: "Rename a file or directory in CMD.", example: "ren report.txt report-old.txt", aliases: ["rename"], related: ["move", "copy", "dir"], keywords: ["rename file", "rename folder", "windows file"] }),
    entry({ id: "cmd-copy", command: "copy", category: "Windows CMD", meaning: "Copy a file to another location in CMD.", example: "copy report.txt C:\\Lab\\Archive\\report.txt", related: ["move", "del"], keywords: ["copy file", "duplicate", "windows file"] }),
    entry({ id: "cmd-move", command: "move", category: "Windows CMD", meaning: "Move or rename a file in CMD.", example: "move notes.txt C:\\Lab\\Done\\notes.txt", related: ["copy", "del"], keywords: ["move file", "rename", "windows file"] }),
    entry({ id: "cmd-del", command: "del", category: "Windows CMD", meaning: "Delete a file in CMD.", example: "del temp.txt", related: ["copy", "move"], keywords: ["delete file", "remove", "windows file"] }),
    entry({ id: "cmd-more", command: "more", category: "Windows CMD", meaning: "Page through text output one screen at a time.", example: "type service.txt | more", related: ["type", "findstr"], keywords: ["pager", "scroll text", "windows file"] }),
    entry({ id: "cmd-where", command: "where", category: "Windows CMD", meaning: "Locate where an executable or file exists in the current path or a target directory.", example: "where python", related: ["dir", "tree", "cd"], keywords: ["locate executable", "find command", "path lookup"] }),
    entry({ id: "cmd-hostname", command: "hostname", category: "Windows CMD", meaning: "Print the current computer name.", example: "hostname", related: ["ipconfig", "whoami"], keywords: ["computer name", "host name", "system id"] }),
    entry({ id: "cmd-whoami", command: "whoami", category: "Windows CMD", meaning: "Show the current logged-in user context.", example: "whoami", related: ["hostname", "echo"], keywords: ["current user", "identity", "account"] }),
    entry({ id: "cmd-ipconfig", command: "ipconfig", category: "Windows CMD", meaning: "Show IP address configuration for local network adapters.", example: "ipconfig", flags: [flag("/all", "Show detailed adapter and DNS information.")], related: ["hostname", "ping", "netstat"], keywords: ["ip address", "network config", "adapter"] }),
    entry({ id: "cmd-netstat", command: "netstat", category: "Windows CMD", meaning: "Show active connections, listening ports, and protocol statistics.", example: "netstat -ano", flags: [flag("-a", "Show all connections and listening ports."), flag("-n", "Show addresses numerically instead of resolving names."), flag("-o", "Show the owning process ID for each connection.")], related: ["tasklist", "ipconfig", "findstr"], keywords: ["listening ports", "connections", "pid", "network"] }),
    entry({ id: "cmd-xcopy", command: "xcopy", category: "Windows CMD", meaning: "Copy files and whole directory trees into another location.", example: "xcopy C:\\Lab\\Toolkit C:\\Lab\\Archive\\Toolkit /E /I", flags: [flag("/E", "Copy directories and subdirectories, including empty ones."), flag("/I", "Assume the destination is a directory.")], related: ["copy", "move", "dir"], keywords: ["copy folder", "recursive copy", "directory tree"] }),
    entry({ id: "cmd-attrib", command: "attrib", category: "Windows CMD", meaning: "View or change file attributes such as hidden or read-only.", example: "attrib hidden-note.txt", flags: [flag("+H", "Set the hidden attribute."), flag("-H", "Remove the hidden attribute.")], related: ["dir", "type", "del"], keywords: ["attributes", "hidden file", "read only"] }),
    entry({ id: "cmd-systeminfo", command: "systeminfo", category: "Windows CMD", meaning: "Show OS version, hardware, boot time, and other system details.", example: "systeminfo", related: ["hostname", "ver", "driverquery"], keywords: ["system details", "os version", "boot time"] }),
    entry({ id: "cmd-set", command: "set", category: "Windows CMD", meaning: "List, filter, or set environment variables in the current CMD session.", example: "set LAB_ROLE=analyst", related: ["echo", "prompt", "whoami"], keywords: ["environment variable", "session variable", "path"] }),
    entry({ id: "cmd-ver", command: "ver", category: "Windows CMD", meaning: "Show the current Windows version string.", example: "ver", related: ["systeminfo", "hostname"], keywords: ["windows version", "build", "os"] }),
    entry({ id: "cmd-date", command: "date", category: "Windows CMD", meaning: "Display or change the current system date.", example: "date", related: ["time", "systeminfo"], keywords: ["date", "clock", "system time"] }),
    entry({ id: "cmd-time", command: "time", category: "Windows CMD", meaning: "Display or change the current system time.", example: "time", related: ["date", "systeminfo"], keywords: ["time", "clock", "system time"] }),
    entry({ id: "cmd-prompt", command: "prompt", category: "Windows CMD", meaning: "Customize the CMD prompt text and tokens.", example: "prompt $D $T $P$G", related: ["cls", "set", "echo"], keywords: ["prompt", "custom shell", "cmd prompt"] }),
    entry({ id: "cmd-ping", command: "ping", category: "Windows CMD", meaning: "Test whether a host responds and measure basic network reachability.", example: "ping fileserver", related: ["tracert", "pathping", "ipconfig"], keywords: ["reachability", "icmp", "latency", "windows"] }),
    entry({ id: "cmd-tracert", command: "tracert", category: "Windows CMD", meaning: "Trace the router hops between this host and a remote destination.", example: "tracert web-lab", related: ["ping", "pathping"], keywords: ["route trace", "network path", "hops"] }),
    entry({ id: "cmd-pathping", command: "pathping", category: "Windows CMD", meaning: "Combine path tracing and packet-loss measurement for a destination.", example: "pathping fileserver", related: ["ping", "tracert"], keywords: ["packet loss", "route health", "path analysis"] }),
    entry({ id: "cmd-nslookup", command: "nslookup", category: "Windows CMD", meaning: "Resolve hostnames to IP addresses using DNS.", example: "nslookup fileserver", related: ["ping", "ipconfig"], keywords: ["dns", "name resolution", "lookup"] }),
    entry({ id: "cmd-arp", command: "arp", category: "Windows CMD", meaning: "Inspect cached IP-to-MAC address mappings on the local host.", example: "arp -a", related: ["ipconfig", "getmac", "route print"], keywords: ["arp cache", "mac address", "layer 2"] }),
    entry({ id: "cmd-route-print", command: "route print", category: "Windows CMD", meaning: "Display the local routing table so you can inspect gateways and interfaces.", example: "route print", related: ["tracert", "arp", "ipconfig"], keywords: ["routing table", "gateway", "routes"] }),
    entry({ id: "cmd-getmac", command: "getmac", category: "Windows CMD", meaning: "Show MAC addresses for local network adapters.", example: "getmac", related: ["ipconfig", "arp"], keywords: ["mac address", "adapter", "network card"] }),
    entry({ id: "cmd-sc-query", command: "sc query", category: "Windows CMD", meaning: "Inspect the current status of Windows services.", example: "sc query Spooler", related: ["net start", "net stop", "tasklist"], keywords: ["service status", "service control", "spooler"] }),
    entry({ id: "cmd-net-start", command: "net start", category: "Windows CMD", meaning: "List running services or start a specific Windows service.", example: "net start Spooler", related: ["sc query", "net stop"], keywords: ["start service", "running services", "service control"] }),
    entry({ id: "cmd-net-stop", command: "net stop", category: "Windows CMD", meaning: "Stop a specific Windows service.", example: "net stop Spooler", related: ["net start", "sc query"], keywords: ["stop service", "service control", "spooler"] }),
    entry({ id: "cmd-wmic-process-list-brief", command: "wmic process list brief", category: "Windows CMD", meaning: "Show a compact process listing through WMIC.", example: "wmic process list brief", related: ["tasklist", "taskkill"], keywords: ["wmic", "process inventory", "brief list"] }),
    entry({ id: "cmd-driverquery", command: "driverquery", category: "Windows CMD", meaning: "List installed drivers and their runtime state.", example: "driverquery", related: ["systeminfo", "sc query"], keywords: ["drivers", "kernel modules", "device drivers"] }),
    entry({ id: "cmd-query-user", command: "query user", category: "Windows CMD", meaning: "Show currently logged-on or disconnected user sessions.", example: "query user", related: ["whoami", "net user"], keywords: ["sessions", "logged on users", "rdp"] }),
    entry({ id: "cmd-net-user", command: "net user", category: "Windows CMD", meaning: "List local accounts or inspect a specific local user.", example: "net user analyst", related: ["whoami", "net localgroup"], keywords: ["local user", "account details", "admin"] }),
    entry({ id: "cmd-net-localgroup", command: "net localgroup", category: "Windows CMD", meaning: "Inspect local group membership such as Administrators.", example: "net localgroup Administrators", related: ["net user", "whoami"], keywords: ["group membership", "administrators", "local group"] }),
    entry({ id: "cmd-net-use", command: "net use", category: "Windows CMD", meaning: "View or map SMB shares to drive letters.", example: "net use Z: \\\\fileserver\\Tools", related: ["net share", "dir"], keywords: ["map drive", "smb share", "network drive"] }),
    entry({ id: "cmd-net-share", command: "net share", category: "Windows CMD", meaning: "List available shares exposed on the local host.", example: "net share", related: ["net use", "dir"], keywords: ["shares", "smb", "shared folders"] }),
    entry({ id: "cmd-shutdown", command: "shutdown", category: "Windows CMD", meaning: "Schedule or cancel a shutdown or restart action.", example: "shutdown /r /t 60", flags: [flag("/r", "Restart instead of a full power-off."), flag("/t", "Set the countdown in seconds."), flag("/a", "Abort a pending shutdown.")], related: ["schtasks", "systeminfo"], keywords: ["restart", "power off", "reboot"] }),
    entry({ id: "cmd-schtasks", command: "schtasks", category: "Windows CMD", meaning: "Query scheduled tasks to inspect what runs automatically.", example: "schtasks /query", related: ["shutdown", "systeminfo"], keywords: ["scheduled task", "automation", "job list"] }),
    entry({ id: "cmd-find", command: "find", category: "Windows CMD", meaning: "Search text output or a file for lines containing a literal string.", example: "find \"ERROR\" service.log", related: ["findstr", "type"], keywords: ["literal search", "filter text", "windows find"] }),
    entry({ id: "cmd-fc", command: "fc", category: "Windows CMD", meaning: "Compare two files and show line differences.", example: "fc baseline.cfg candidate.cfg", related: ["type", "findstr"], keywords: ["file compare", "diff", "configuration drift"] }),

    entry({ id: "cisco-enable", command: "enable", category: "Cisco CLI", meaning: "Move from user EXEC mode into privileged EXEC mode.", example: "enable", related: ["disable", "configure terminal", "show version"], keywords: ["router prompt", "privileged exec", "# prompt"] }),
    entry({ id: "cisco-disable", command: "disable", category: "Cisco CLI", meaning: "Leave privileged EXEC mode and return to user EXEC mode.", example: "disable", related: ["enable"], keywords: ["user exec", "> prompt", "drop privilege"] }),
    entry({ id: "cisco-configure-terminal", command: "configure terminal", category: "Cisco CLI", meaning: "Enter global configuration mode from privileged EXEC.", example: "configure terminal", related: ["end", "exit", "interface"], keywords: ["global config", "config mode", "(config)#"] }),
    entry({ id: "cisco-exit", command: "exit", category: "Cisco CLI", meaning: "Back out one Cisco mode level at a time.", example: "exit", related: ["end", "configure terminal"], keywords: ["leave mode", "interface config", "global config"] }),
    entry({ id: "cisco-end", command: "end", category: "Cisco CLI", meaning: "Jump straight from configuration mode back to privileged EXEC.", example: "end", related: ["exit", "configure terminal"], keywords: ["leave config", "privileged exec", "# prompt"] }),
    entry({ id: "cisco-write-memory", command: "write memory", category: "Cisco CLI", meaning: "Save the running configuration into startup configuration.", example: "write memory", related: ["copy running-config startup-config", "show startup-config"], keywords: ["save config", "startup config", "nvram"] }),
    entry({ id: "cisco-copy-run-start", command: "copy running-config startup-config", category: "Cisco CLI", meaning: "Copy the live running config into the saved startup config.", example: "copy running-config startup-config", related: ["write memory", "show running-config", "show startup-config"], keywords: ["save config", "copy run start", "nvram"] }),
    entry({ id: "cisco-show-running-config", command: "show running-config", category: "Cisco CLI", meaning: "Display the current active configuration in RAM.", example: "show running-config", related: ["show startup-config", "copy running-config startup-config"], keywords: ["show run", "active config", "ram"] }),
    entry({ id: "cisco-show-startup-config", command: "show startup-config", category: "Cisco CLI", meaning: "Display the configuration the router will use after a reboot.", example: "show startup-config", related: ["show running-config", "write memory"], keywords: ["show start", "saved config", "boot config"] }),
    entry({ id: "cisco-show-ip-interface-brief", command: "show ip interface brief", category: "Cisco CLI", meaning: "Quickly list interfaces, IPv4 addresses, and status values.", example: "show ip interface brief", related: ["show interfaces", "ip address", "shutdown"], keywords: ["interfaces", "status", "address summary"] }),
    entry({ id: "cisco-show-interfaces", command: "show interfaces", category: "Cisco CLI", meaning: "Display detailed operational data for interfaces such as admin state, protocol state, and description.", example: "show interfaces GigabitEthernet0/0", related: ["show ip interface brief", "description"], keywords: ["detailed interface", "errors", "line protocol"] }),
    entry({ id: "cisco-show-version", command: "show version", category: "Cisco CLI", meaning: "Display IOS version, model, uptime, and system image information.", example: "show version", related: ["enable", "show running-config"], keywords: ["ios version", "model", "uptime"] }),
    entry({ id: "cisco-hostname", command: "hostname", category: "Cisco CLI", meaning: "Set the router hostname while in global configuration mode.", example: "hostname BranchRTR", related: ["configure terminal", "show running-config"], keywords: ["router name", "prompt name", "global config"] }),
    entry({ id: "cisco-interface", command: "interface", category: "Cisco CLI", meaning: "Enter the configuration mode for one interface.", example: "interface GigabitEthernet0/0", related: ["ip address", "description", "shutdown", "no shutdown"], keywords: ["interface mode", "config-if", "port config"] }),
    entry({ id: "cisco-ip-address", command: "ip address", category: "Cisco CLI", meaning: "Assign an IPv4 address and subnet mask to the selected interface.", example: "ip address 192.168.10.1 255.255.255.0", related: ["interface", "show ip interface brief"], keywords: ["ipv4", "subnet mask", "gateway interface"] }),
    entry({ id: "cisco-no-shutdown", command: "no shutdown", category: "Cisco CLI", meaning: "Administratively enable the selected interface.", example: "no shutdown", related: ["shutdown", "show ip interface brief"], keywords: ["enable interface", "admin up", "bring port up"] }),
    entry({ id: "cisco-shutdown", command: "shutdown", category: "Cisco CLI", meaning: "Administratively disable the selected interface.", example: "shutdown", related: ["no shutdown", "show ip interface brief"], keywords: ["disable interface", "admin down", "turn port off"] }),
    entry({ id: "cisco-description", command: "description", category: "Cisco CLI", meaning: "Attach a text label to the selected interface.", example: "description Branch User LAN", related: ["interface", "show interfaces"], keywords: ["label interface", "port note", "documentation"] }),
    entry({ id: "cisco-ping", command: "ping", category: "Cisco CLI", meaning: "Test whether the router can reach another IP host.", example: "ping 198.51.100.2", related: ["traceroute", "show ip route"], keywords: ["reachability", "icmp", "connectivity"] }),
    entry({ id: "cisco-traceroute", command: "traceroute", category: "Cisco CLI", meaning: "Trace the path from the router to a remote destination.", example: "traceroute 172.16.30.10", related: ["ping", "show ip route"], keywords: ["path", "hops", "route trace"] }),
    entry({ id: "cisco-ip-route", command: "ip route", category: "Cisco CLI", meaning: "Create a static route in global configuration mode.", example: "ip route 172.16.30.0 255.255.255.0 198.51.100.2", related: ["show ip route", "configure terminal"], keywords: ["static route", "next hop", "routing"] }),
    entry({ id: "cisco-show-ip-route", command: "show ip route", category: "Cisco CLI", meaning: "Display the IPv4 routing table including connected and static routes.", example: "show ip route", related: ["ip route", "ping", "traceroute"], keywords: ["routing table", "connected routes", "static routes"] }),

    entry({ id: "nmap-command", command: "nmap", category: "Nmap", meaning: "Scan hosts for open ports, services, and fingerprints.", example: "nmap -sV 192.168.56.102", flags: [flag("-p", "Scan only the specified ports."), flag("-sV", "Probe service versions."), flag("-sC", "Run common default scripts."), flag("-O", "Attempt OS detection."), flag("-A", "Enable several advanced detection features together."), flag("-oN", "Write normal text output to a file."), flag("--top-ports", "Scan the most common ports only."), flag("-Pn", "Skip host discovery and treat the host as up.")], related: ["ping", "nc", "-p", "-sV"], keywords: ["scan", "ports", "services", "host discovery"] }),
    entry({ id: "nmap-p", command: "-p", category: "Nmap", meaning: "Scan only specific ports instead of the default set.", example: "nmap -p 21,80,443 192.168.56.102", related: ["nmap", "--top-ports", "-sV"], keywords: ["ports", "specific port", "targeted scan"] }),
    entry({ id: "nmap-il", command: "-iL", category: "Nmap", meaning: "Load targets from a file.", example: "nmap -iL targets.txt -p 80,443", related: ["nmap", "--exclude", "-oN"], keywords: ["input list", "targets file", "batch scan"] }),
    entry({ id: "nmap-exclude", command: "--exclude", category: "Nmap", meaning: "Skip specific hosts or IPs during a scan.", example: "nmap 192.168.56.0/24 --exclude 192.168.56.1", related: ["nmap", "-iL", "--top-ports"], keywords: ["exclude hosts", "omit target", "subnet scan"] }),
    entry({ id: "nmap-on", command: "-oN", category: "Nmap", meaning: "Write scan output in normal text format.", example: "nmap -sV -oN baseline.txt 192.168.56.102", related: ["nmap", "-oX", "-oA"], keywords: ["save output", "report", "text file"] }),
    entry({ id: "nmap-ox", command: "-oX", category: "Nmap", meaning: "Write scan output in XML format.", example: "nmap -oX scan.xml 192.168.56.102", related: ["nmap", "-oN", "-oA"], keywords: ["xml", "save output", "machine readable"] }),
    entry({ id: "nmap-oa", command: "-oA", category: "Nmap", meaning: "Write all major Nmap output formats with one base name.", example: "nmap -oA corp-scan 192.168.56.0/24", related: ["nmap", "-oN", "-oX"], keywords: ["all output", "report set", "gnmap"] }),
    entry({ id: "nmap-os", command: "-O", category: "Nmap", meaning: "Attempt operating system detection.", example: "nmap -O 192.168.56.102", related: ["nmap", "-sV"], keywords: ["os detection", "fingerprint", "host profile"] }),
    entry({ id: "nmap-sv", command: "-sV", category: "Nmap", meaning: "Probe open ports to identify service versions.", example: "nmap -sV -p 80 192.168.56.102", related: ["nmap", "-p", "-O"], keywords: ["version detection", "service evidence"] }),
    entry({ id: "nmap-sc", command: "-sC", category: "Nmap", meaning: "Run the default Nmap scripts against the target.", example: "nmap -sC -p 80,443 192.168.56.102", related: ["nmap", "-sV", "-A"], keywords: ["default scripts", "nse", "enumeration"] }),
    entry({ id: "nmap-ss", command: "-sS", category: "Nmap", meaning: "Run a TCP SYN scan for a fast, lower-noise TCP probe.", example: "nmap -sS 192.168.56.102", related: ["nmap", "-sT", "-T4"], keywords: ["syn scan", "stealth", "tcp scan"] }),
    entry({ id: "nmap-st", command: "-sT", category: "Nmap", meaning: "Run a TCP connect scan using full connections.", example: "nmap -sT 192.168.56.102", related: ["nmap", "-sS"], keywords: ["tcp connect", "full connection", "scan"] }),
    entry({ id: "nmap-su", command: "-sU", category: "Nmap", meaning: "Scan UDP ports.", example: "nmap -sU -p 53,161 192.168.56.102", related: ["nmap", "-p"], keywords: ["udp", "dns", "snmp"] }),
    entry({ id: "nmap-a", command: "-A", category: "Nmap", meaning: "Enable aggressive options like OS detection, version detection, script scanning, and traceroute.", example: "nmap -A 192.168.56.102", related: ["nmap", "-O", "-sV", "-sC"], keywords: ["aggressive scan", "combined detection", "enumeration"] }),
    entry({ id: "nmap-t4", command: "-T4", category: "Nmap", meaning: "Use a faster timing template for reasonably quick scans.", example: "nmap -T4 --top-ports 20 192.168.56.102", related: ["nmap", "--top-ports"], keywords: ["timing", "speed", "faster scan"] }),
    entry({ id: "nmap-topports", command: "--top-ports", category: "Nmap", meaning: "Scan the most common ports instead of the full range.", example: "nmap --top-ports 20 192.168.56.102", related: ["nmap", "-p", "-T4"], keywords: ["common ports", "quick triage"] }),
    entry({ id: "nmap-pn", command: "-Pn", category: "Nmap", meaning: "Treat the host as online and skip host discovery.", example: "nmap -Pn -p 22 192.168.56.102", related: ["nmap", "ping"], keywords: ["skip ping", "host discovery", "assume up"] }),
    entry({ id: "nmap-n", command: "-n", category: "Nmap", meaning: "Skip DNS resolution and use numeric addresses only.", example: "nmap -n -sV 192.168.56.102", related: ["nmap", "-Pn"], keywords: ["no dns", "numeric", "speed"] }),
    entry({ id: "nmap-vv", command: "-vv", category: "Nmap", meaning: "Increase verbosity so you see more scan progress and detail.", example: "nmap -vv -sV 192.168.56.102", related: ["nmap", "-sV"], keywords: ["verbose", "more output", "scan detail"] }),

    entry({ id: "netcat-command", command: "nc / netcat", category: "Netcat", meaning: "Open TCP or UDP connections, listen on ports, or move simple data.", example: "nc -lvnp 4444", flags: [flag("-n", "Use numeric IPs and ports only."), flag("-v", "Show verbose connection details."), flag("-l", "Listen for an incoming connection."), flag("-p", "Specify the local port."), flag("-u", "Use UDP instead of TCP."), flag("-w", "Set a connection timeout.")], related: ["ping", "telnet"], aliases: ["nc", "netcat"], keywords: ["listener", "reverse shell", "connection", "socket"] }),
    entry({ id: "netcat-n", command: "-n", category: "Netcat", meaning: "Use numeric addresses and skip DNS resolution.", example: "nc -nv 192.168.56.102 25", related: ["nc / netcat", "-v"], keywords: ["numeric", "no dns", "faster lookup"] }),
    entry({ id: "netcat-v", command: "-v", category: "Netcat", meaning: "Show connection progress and banner details.", example: "nc -nv 192.168.56.102 25", related: ["nc / netcat", "-n"], keywords: ["verbose", "debug", "banner"] }),
    entry({ id: "netcat-l", command: "-l", category: "Netcat", meaning: "Listen for an inbound connection instead of connecting out.", example: "nc -lvnp 4444", related: ["nc / netcat", "-p"], keywords: ["listener", "bind", "wait for connection"] }),
    entry({ id: "netcat-p", command: "-p", category: "Netcat", meaning: "Specify the local listening or source port.", example: "nc -lvnp 4444", related: ["nc / netcat", "-l"], keywords: ["port", "listener port", "source port"] }),
    entry({ id: "netcat-u", command: "-u", category: "Netcat", meaning: "Use UDP instead of TCP for the Netcat session.", example: "nc -u -nv 192.168.56.102 53", related: ["nc / netcat", "-n", "-v"], keywords: ["udp", "dns", "connectionless"] }),
    entry({ id: "netcat-w", command: "-w", category: "Netcat", meaning: "Set a timeout so the connection does not wait forever.", example: "nc -w 3 -nv 192.168.56.102 25", related: ["nc / netcat", "-v"], keywords: ["timeout", "wait", "connection timeout"] }),
    entry({ id: "smtp-ehlo", command: "EHLO", category: "Netcat", meaning: "Start an SMTP session by identifying your client to the server.", example: "EHLO lab.local", related: ["HELO", "MAIL FROM", "telnet"], keywords: ["smtp", "greeting", "mail protocol"] }),
    entry({ id: "smtp-helo", command: "HELO", category: "Netcat", meaning: "Legacy SMTP greeting used to identify your client to the server.", example: "HELO lab.local", related: ["EHLO", "MAIL FROM", "telnet"], keywords: ["smtp", "greeting", "mail protocol"] }),
    entry({ id: "smtp-mail-from", command: "MAIL FROM", category: "Netcat", meaning: "Set the envelope sender during a manual SMTP session.", example: "MAIL FROM:<kali@lab.local>", related: ["RCPT TO", "DATA", "EHLO"], keywords: ["smtp sender", "mail from", "email envelope"] }),
    entry({ id: "smtp-rcpt-to", command: "RCPT TO", category: "Netcat", meaning: "Set the envelope recipient during a manual SMTP session.", example: "RCPT TO:<admin@lab.local>", related: ["MAIL FROM", "DATA", "EHLO"], keywords: ["smtp recipient", "rcpt", "email envelope"] }),
    entry({ id: "smtp-data", command: "DATA", category: "Netcat", meaning: "Tell the SMTP server that the message body is about to follow.", example: "DATA", related: ["MAIL FROM", "RCPT TO", "QUIT"], keywords: ["smtp content", "message body", "email data"] }),
    entry({ id: "smtp-quit", command: "QUIT", category: "Netcat", meaning: "Close a manual SMTP session cleanly.", example: "QUIT", related: ["DATA", "EHLO", "telnet"], keywords: ["smtp exit", "close session", "mail protocol"] }),

    entry({ id: "msfdb-init", command: "sudo msfdb init", category: "Metasploit", meaning: "Initialize the Metasploit database service.", example: "sudo msfdb init", related: ["msfconsole", "db_status"], keywords: ["database", "init", "setup"] }),
    entry({ id: "msfconsole", command: "msfconsole", category: "Metasploit", meaning: "Start the Metasploit console.", example: "msfconsole", related: ["search", "use", "show options"], keywords: ["start metasploit", "framework console"] }),
    entry({ id: "msf-banner", command: "banner", category: "Metasploit", meaning: "Show the current Metasploit banner.", example: "banner", related: ["msfconsole"], keywords: ["splash", "banner"] }),
    entry({ id: "msf-db-status", command: "db_status", category: "Metasploit", meaning: "Check whether Metasploit is connected to its database.", example: "db_status", related: ["sudo msfdb init", "msfconsole"], keywords: ["database connected", "db"] }),
    entry({ id: "msf-search", command: "search", category: "Metasploit", meaning: "Search modules by service, product, or vulnerability keyword.", example: "search vsftpd", related: ["use", "info"], keywords: ["find module", "module search", "vulnerability"] }),
    entry({ id: "msf-use", command: "use", category: "Metasploit", meaning: "Select a specific module to work with.", example: "use exploit/unix/ftp/vsftpd_234_backdoor", related: ["search", "show options", "info"], keywords: ["select module", "load exploit"] }),
    entry({ id: "msf-options", command: "options", category: "Metasploit", meaning: "View module options in shorter form.", example: "options", related: ["show options", "set RHOSTS"], keywords: ["module settings", "required values"] }),
    entry({ id: "msf-show-options", command: "show options", category: "Metasploit", meaning: "Show the current module options and required settings.", example: "show options", related: ["options", "set RHOSTS", "show payloads"], keywords: ["module options", "required fields"] }),
    entry({ id: "msf-info", command: "info", category: "Metasploit", meaning: "Show detailed information about the selected module.", example: "info", related: ["search", "use", "show payloads"], keywords: ["module details", "disclosure", "description"] }),
    entry({ id: "msf-set", command: "set", category: "Metasploit", meaning: "Assign a value to a Metasploit option such as RHOSTS, LHOST, or PAYLOAD.", example: "set RHOSTS 192.168.56.102", related: ["show options", "set RHOSTS", "run"], keywords: ["assign option", "configure module", "set value"] }),
    entry({ id: "msf-set-rhosts", command: "set RHOSTS", category: "Metasploit", meaning: "Set the remote target host or hosts.", example: "set RHOSTS 192.168.56.102", related: ["show options", "run", "exploit"], keywords: ["target host", "remote hosts", "rhosts"] }),
    entry({ id: "msf-show-payloads", command: "show payloads", category: "Metasploit", meaning: "List payloads that work with the current module.", example: "show payloads", related: ["use", "info", "run"], keywords: ["payload list", "compatible payloads"] }),
    entry({ id: "msf-show-exploits", command: "show exploits", category: "Metasploit", meaning: "List exploit modules in the current console context.", example: "show exploits", related: ["search", "use", "show auxiliary"], keywords: ["exploit list", "modules", "framework"] }),
    entry({ id: "msf-show-auxiliary", command: "show auxiliary", category: "Metasploit", meaning: "List auxiliary modules such as scanners and information-gathering tools.", example: "show auxiliary", related: ["show exploits", "search"], keywords: ["auxiliary modules", "scanners", "framework"] }),
    entry({ id: "msf-check", command: "check", category: "Metasploit", meaning: "Ask a module whether a target looks vulnerable before attempting full exploitation.", example: "check", related: ["run", "exploit", "show options"], keywords: ["verify vulnerability", "pre-check", "module test"] }),
    entry({ id: "msf-back", command: "back", category: "Metasploit", meaning: "Leave the current module context and return to the main Metasploit prompt.", example: "back", related: ["use", "search", "show options"], keywords: ["leave module", "return", "main prompt"] }),
    entry({ id: "msf-sessions", command: "sessions", category: "Metasploit", meaning: "List or interact with established Metasploit sessions.", example: "sessions", related: ["run", "exploit", "show payloads"], keywords: ["meterpreter", "shell session", "session list"] }),
    entry({ id: "msf-run", command: "run", category: "Metasploit", meaning: "Execute the current module using the configured options.", example: "run", related: ["exploit", "show options"], keywords: ["execute module", "launch exploit"] }),
    entry({ id: "msf-exploit", command: "exploit", category: "Metasploit", meaning: "Execute the current exploit module.", example: "exploit", related: ["run", "use"], keywords: ["run exploit", "launch"] })
  ];

  const categories = ["All", "Linux", "Windows CMD", "Cisco CLI", "Nmap", "Netcat", "Metasploit"];

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

  function prioritizeMatches(matches, preferredCategories = []) {
    if (!Array.isArray(matches) || !matches.length) return null;
    if (!Array.isArray(preferredCategories) || !preferredCategories.length) return matches[0];

    const ranked = [...matches].sort((left, right) => {
      const leftIndex = preferredCategories.indexOf(left.category);
      const rightIndex = preferredCategories.indexOf(right.category);
      const leftScore = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const rightScore = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
      return leftScore - rightScore;
    });

    return ranked[0];
  }

  function findEntry(command, preferredCategories = []) {
    const normalized = (command || "").trim().toLowerCase();
    return prioritizeMatches(
      entries.filter((item) => item.command.toLowerCase() === normalized || (item.aliases || []).some((alias) => alias.toLowerCase() === normalized)),
      preferredCategories
    );
  }

  function lookupForInput(rawInput, preferredCategories = []) {
    const normalized = (rawInput || "").trim().toLowerCase();
    if (!normalized) return null;

    const ranked = [...entries].sort((left, right) => right.command.length - left.command.length);
    const matches = [];

    for (const item of ranked) {
      const commands = [item.command, ...(item.aliases || [])].map((value) => value.toLowerCase());
      const matched = commands.find((command) => normalized === command || normalized.startsWith(`${command} `));
      if (matched) {
        matches.push(item);
      }
    }

    return prioritizeMatches(matches, preferredCategories);
  }

  window.CommandsData = {
    entries,
    categories,
    searchEntries,
    findEntry,
    lookupForInput
  };
})();
