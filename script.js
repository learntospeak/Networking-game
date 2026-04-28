const cidrs = [24, 25, 26, 27, 28, 29, 30];

const masks = {
  24: "255.255.255.0",
  25: "255.255.255.128",
  26: "255.255.255.192",
  27: "255.255.255.224",
  28: "255.255.255.240",
  29: "255.255.255.248",
  30: "255.255.255.252"
};

const bitValues = [128, 64, 32, 16, 8, 4, 2, 1];

const commandQuestions = [
  {
    question: "Which command shows the running configuration?",
    options: ["show run", "show start", "show version", "show flash"],
    answer: "show run",
    hint: "This shows the current active config in RAM."
  },
  {
    question: "Which command shows the startup configuration?",
    options: ["show run", "show start", "show version", "show interface"],
    answer: "show start",
    hint: "This shows the saved config used at boot."
  },
  {
    question: "Which command shows the IOS version and system details?",
    options: ["show flash", "show version", "show run", "show ip route"],
    answer: "show version",
    hint: "Think operating system, model, RAM, flash."
  },
  {
    question: "Which command helps you find what router interfaces are called?",
    options: ["show interface", "show flash", "show start", "show vlan"],
    answer: "show interface",
    hint: "This shows interface details like Gigabit0/0, Gigabit0/1."
  },
  {
    question: "Which command shows the files stored in flash memory?",
    options: ["show interface", "show flash", "show version", "show run"],
    answer: "show flash",
    hint: "Flash is storage, not live config."
  },
  {
    question: "Which command brings a Cisco interface back up?",
    options: ["enable", "startup", "no shutdown", "power on"],
    answer: "no shutdown",
    hint: "It removes the shutdown state."
  },
  {
    question: "Which command disables a Cisco interface?",
    options: ["disable", "shutdown", "close", "no interface"],
    answer: "shutdown",
    hint: "Think of putting a padlock on a gate."
  },
  {
    question: "Why do switches usually get an IP address?",
    options: [
      "To forward user traffic faster",
      "For remote management",
      "To replace the router",
      "To give each port internet"
    ],
    answer: "For remote management",
    hint: "A normal switch IP is for you, not for user traffic."
  },
  {
    question: "Where is a normal switch management IP usually configured?",
    options: [
      "On every physical port",
      "On a virtual interface",
      "On the power supply",
      "On the default gateway"
    ],
    answer: "On a virtual interface",
    hint: "You do not waste a user port just for management."
  },
  {
    question: "What is the default gateway for a normal switch management setup?",
    options: [
      "The switch itself",
      "The router",
      "The VLAN name",
      "The flash memory"
    ],
    answer: "The router",
    hint: "The switch is not the default gateway."
  },
  {
    question: "Which command shows the current active configuration in RAM?",
    options: ["show start", "show run", "show flash", "show version"],
    answer: "show run",
    hint: "Running config = what is active right now."
  },
  {
    question: "Which command shows the configuration used when the device boots?",
    options: ["show run", "show start", "show interface", "show ip route"],
    answer: "show start",
    hint: "Startup config = saved config."
  },
  {
    question: "Which command shows details about interfaces like errors and bandwidth?",
    options: ["show ip route", "show interface", "show flash", "show version"],
    answer: "show interface",
    hint: "Think physical and data link info."
  },
  {
    question: "What is the main purpose of giving a switch an IP address?",
    options: [
      "To route traffic",
      "For remote management",
      "To replace the router",
      "To increase speed"
    ],
    answer: "For remote management",
    hint: "You don't use a switch IP for user traffic."
  },
  {
    question: "Is a normal switch the default gateway?",
    options: ["Yes", "No"],
    answer: "No",
    hint: "The router is the default gateway."
  },
  {
    question: "Where is a switch management IP usually configured?",
    options: [
      "On a physical port",
      "On a virtual interface",
      "On the power supply",
      "On the router"
    ],
    answer: "On a virtual interface",
    hint: "You don't waste a user port for management."
  },
  {
    question: "You cannot access a device remotely. What should you check first?",
    options: [
      "Replace the device",
      "Check interface status",
      "Reinstall the OS",
      "Shutdown the network"
    ],
    answer: "Check interface status",
    hint: "Always check if the interface is up."
  },
  {
    question: "An interface shows 'administratively down'. What should you do?",
    options: [
      "Replace cable",
      "Run show version",
      "Use no shutdown",
      "Restart router"
    ],
    answer: "Use no shutdown",
    hint: "This state means it was manually disabled."
  },
  {
    question: "Which command helps you quickly see if interfaces are up or down?",
    options: [
      "show ip interface brief",
      "show flash",
      "show version",
      "show run"
    ],
    answer: "show ip interface brief",
    hint: "This gives a quick summary."
  },
  {
    question: "A device has no IP address configured. What command would confirm this?",
    options: [
      "show ip interface brief",
      "show flash",
      "show start",
      "show version"
    ],
    answer: "show ip interface brief",
    hint: "Look for missing IP addresses."
  },
  {
    question: "You fix a network issue. What should you do next?",
    options: [
      "Ignore it",
      "Restart everything",
      "Document the fix",
      "Log out"
    ],
    answer: "Document the fix",
    hint: "Think about future troubleshooting."
  },
  {
    question: "A device is reachable but very slow. Which command helps check interface errors?",
    options: [
      "show interface",
      "show version",
      "show flash",
      "show run"
    ],
    answer: "show interface",
    hint: "Look for errors, collisions, drops."
  },
  {
    question: "Which command shows both IP addresses and interface status quickly?",
    options: [
      "show ip interface brief",
      "show flash",
      "show start",
      "show version"
    ],
    answer: "show ip interface brief",
    hint: "This is the fastest summary command."
  },
  {
    question: "You reboot a router and lose your config. What likely happened?",
    options: [
      "You didn't save it",
      "Hardware failure",
      "Wrong cable",
      "Interface down"
    ],
    answer: "You didn't save it",
    hint: "Running config must be saved."
  },
  {
    question: "Which command shows the saved configuration?",
    options: [
      "show start",
      "show run",
      "show version",
      "show flash"
    ],
    answer: "show start",
    hint: "Startup config = saved config."
  },
  {
    question: "Which command helps confirm the IOS version running on a device?",
    options: [
      "show version",
      "show run",
      "show flash",
      "show ip interface brief"
    ],
    answer: "show version",
    hint: "Includes system details."
  },
  {
    question: "A port is up but no traffic is passing. What should you check?",
    options: [
      "Interface errors",
      "Flash memory",
      "IOS version",
      "Hostname"
    ],
    answer: "Interface errors",
    hint: "Look for drops or collisions."
  },
  {
    question: "Which command would help you verify if an interface has an IP assigned?",
    options: [
      "show ip interface brief",
      "show version",
      "show flash",
      "show run"
    ],
    answer: "show ip interface brief",
    hint: "Quick IP check."
  },
  {
    question: "You need to check files stored on the device. Which command?",
    options: [
      "show flash",
      "show version",
      "show run",
      "show interface"
    ],
    answer: "show flash",
    hint: "Flash = storage."
  },
  {
    question: "Which command would you use to verify current active configuration?",
    options: [
      "show run",
      "show start",
      "show flash",
      "show version"
    ],
    answer: "show run",
    hint: "Running config = active config."
  },
  {
    question: "An interface is down/down. What is the most likely issue?",
    options: [
      "Physical problem",
      "Configuration saved incorrectly",
      "Wrong IOS version",
      "Flash full"
    ],
    answer: "Physical problem",
    hint: "Down/down usually means cable or hardware."
  },
  {
    question: "A user cannot access the network. What is the FIRST thing you should check?",
    options: [
      "Replace the router",
      "Check if the interface is up",
      "Reinstall the OS",
      "Check flash memory"
    ],
    answer: "Check if the interface is up",
    hint: "Always start simple."
  },
  {
    question: "You suspect an interface is misconfigured. What command should you run?",
    options: [
      "show run",
      "show flash",
      "show version",
      "ping"
    ],
    answer: "show run",
    hint: "Check current configuration."
  },
  {
    question: "A device is not reachable over the network. What should you check first?",
    options: [
      "IP configuration",
      "Flash storage",
      "IOS version",
      "Hostname"
    ],
    answer: "IP configuration",
    hint: "No IP = no communication."
  },
  {
    question: "An interface shows 'administratively down'. What is the issue?",
    options: [
      "Hardware failure",
      "Disabled in config",
      "Wrong subnet",
      "Cable unplugged"
    ],
    answer: "Disabled in config",
    hint: "Think 'shutdown' command."
  },
  {
    question: "You fix a network issue. What is the BEST next step?",
    options: [
      "Ignore it",
      "Restart the device",
      "Document the solution",
      "Log out"
    ],
    answer: "Document the solution",
    hint: "Future troubleshooting depends on this."
  },
  {
    question: "A port is up but no traffic is flowing. What should you check?",
    options: [
      "Interface errors",
      "Flash memory",
      "Hostname",
      "IOS version"
    ],
    answer: "Interface errors",
    hint: "Look for drops or collisions."
  },
  {
    question: "You need to quickly see if all interfaces are up. Which command?",
    options: [
      "show ip interface brief",
      "show run",
      "show flash",
      "show version"
    ],
    answer: "show ip interface brief",
    hint: "Quick overview command."
  },
  {
    question: "A switch cannot be managed remotely. What is a likely issue?",
    options: [
      "No management IP configured",
      "Wrong hostname",
      "Flash is empty",
      "IOS missing"
    ],
    answer: "No management IP configured",
    hint: "Switch needs an IP for remote access."
  },
  {
    question: "You reboot a device and lose your config. Why?",
    options: [
      "Not saved to startup config",
      "Hardware issue",
      "Wrong cable",
      "Interface error"
    ],
    answer: "Not saved to startup config",
    hint: "Running config is temporary."
  },
  {
    question: "A cable is unplugged from an interface. What status would you expect?",
    options: [
      "down/down",
      "up/up",
      "administratively down",
      "up/down"
    ],
    answer: "down/down",
    hint: "Physical issue."
  }
];

const securityQuestions = [
  {
    question: "Which protocol is secure for remote access?",
    options: ["Telnet", "SSH"],
    answer: "SSH",
    hint: "This one encrypts the session."
  },
  {
    question: "Which protocol sends usernames and passwords in clear text?",
    options: ["SSH", "Telnet"],
    answer: "Telnet",
    hint: "Wireshark can read it easily."
  },
  {
    question: "If you sniff Telnet traffic, what can you often see?",
    options: [
      "Only encrypted gibberish",
      "The username and password in plain text",
      "Nothing at all",
      "Only the MAC address"
    ],
    answer: "The username and password in plain text",
    hint: "That is why Telnet is insecure."
  },
  {
    question: "Why is SSH preferred over Telnet?",
    options: [
      "It uses less bandwidth",
      "It is encrypted",
      "It does not need usernames",
      "It works without IP"
    ],
    answer: "It is encrypted",
    hint: "The conversation is protected."
  },
  {
    question: "Which protocol would expose passwords in Wireshark?",
    options: ["SSH", "Telnet"],
    answer: "Telnet",
    hint: "It sends data in plain text."
  },
  {
    question: "Which protocol encrypts traffic between devices?",
    options: ["Telnet", "SSH"],
    answer: "SSH",
    hint: "Encryption = secure."
  },
  {
    question: "Why is Telnet considered insecure?",
    options: [
      "It is slow",
      "It uses too much bandwidth",
      "It sends data in plain text",
      "It does not work on routers"
    ],
    answer: "It sends data in plain text",
    hint: "Anyone can read the traffic."
  },
  {
    question: "What is the main advantage of SSH over Telnet?",
    options: [
      "Faster speed",
      "Encryption",
      "Less configuration",
      "Uses less power"
    ],
    answer: "Encryption",
    hint: "Security is the key difference."
  },
  {
    question: "If you capture Telnet traffic, what sensitive data can you see?",
    options: [
      "Passwords",
      "Nothing",
      "Encrypted packets",
      "Only IP addresses"
    ],
    answer: "Passwords",
    hint: "Telnet is plain text."
  },
  {
    question: "Why is SSH preferred over Telnet in production networks?",
    options: [
      "It encrypts traffic",
      "It is faster",
      "It uses less CPU",
      "It requires less config"
    ],
    answer: "It encrypts traffic",
    hint: "Security is the key reason."
  },
  {
    question: "Which protocol is safest for remote administration?",
    options: [
      "SSH",
      "Telnet",
      "FTP",
      "HTTP"
    ],
    answer: "SSH",
    hint: "Only one encrypts sessions."
  },
  {
    question: "What is the main risk of using Telnet?",
    options: [
      "Credentials can be intercepted",
      "Slow performance",
      "High bandwidth usage",
      "Device crashes"
    ],
    answer: "Credentials can be intercepted",
    hint: "Think packet capture."
  },
  {
    question: "Which type of attack benefits most from plain-text protocols?",
    options: [
      "Packet sniffing",
      "DDoS",
      "Brute force",
      "Routing loops"
    ],
    answer: "Packet sniffing",
    hint: "Reading traffic directly."
  },
  {
    question: "Which protocol protects data in transit?",
    options: [
      "SSH",
      "Telnet",
      "Ping",
      "ARP"
    ],
    answer: "SSH",
    hint: "Encryption."
  },
  {
    question: "A network admin logs in remotely over Telnet. What is the biggest concern?",
    options: [
      "Credentials exposed",
      "Slow login",
      "Wrong IP",
      "Packet loss"
    ],
    answer: "Credentials exposed",
    hint: "Plain text traffic."
  },
  {
    question: "Which protocol should NOT be used on untrusted networks?",
    options: [
      "Telnet",
      "SSH",
      "HTTPS",
      "VPN"
    ],
    answer: "Telnet",
    hint: "It has no encryption."
  },
  {
    question: "What is a key benefit of encrypted protocols?",
    options: [
      "Prevents data interception",
      "Faster speeds",
      "Less CPU usage",
      "Simpler configs"
    ],
    answer: "Prevents data interception",
    hint: "Security benefit."
  },
  {
    question: "If an attacker captures SSH traffic, what can they see?",
    options: [
      "Encrypted data",
      "Passwords in plain text",
      "Full commands readable",
      "Device configs"
    ],
    answer: "Encrypted data",
    hint: "They can't read it easily."
  },
  {
    question: "An attacker is capturing traffic on the network. Which protocol exposes credentials?",
    options: [
      "Telnet",
      "SSH",
      "HTTPS",
      "VPN"
    ],
    answer: "Telnet",
    hint: "No encryption."
  },
  {
    question: "Which protocol would protect login credentials from being read on the network?",
    options: [
      "SSH",
      "Telnet",
      "FTP",
      "HTTP"
    ],
    answer: "SSH",
    hint: "Encrypted session."
  },
  {
    question: "What is the main weakness of plain-text protocols?",
    options: [
      "Data can be read easily",
      "Slow performance",
      "High CPU usage",
      "Limited compatibility"
    ],
    answer: "Data can be read easily",
    hint: "Think packet sniffing."
  },
  {
    question: "Which type of attack involves capturing packets to read sensitive data?",
    options: [
      "Sniffing",
      "DDoS",
      "Brute force",
      "Spoofing"
    ],
    answer: "Sniffing",
    hint: "Reading traffic directly."
  },
  {
    question: "Which protocol ensures confidentiality of transmitted data?",
    options: [
      "SSH",
      "Telnet",
      "Ping",
      "ARP"
    ],
    answer: "SSH",
    hint: "Encryption protects data."
  },
  {
    question: "If credentials are visible in Wireshark, what protocol is likely being used?",
    options: [
      "Telnet",
      "SSH",
      "HTTPS",
      "VPN"
    ],
    answer: "Telnet",
    hint: "Plain text protocol."
  },
  {
    question: "Which protocol should be disabled on secure networks?",
    options: [
      "Telnet",
      "SSH",
      "HTTPS",
      "VPN"
    ],
    answer: "Telnet",
    hint: "Insecure protocol."
  },
  {
    question: "What is the main benefit of encryption in networking?",
    options: [
      "Protects data from interception",
      "Faster speeds",
      "Simpler configs",
      "Lower bandwidth"
    ],
    answer: "Protects data from interception",
    hint: "Security benefit."
  },
  {
    question: "An attacker captures SSH traffic. What can they read?",
    options: [
      "Encrypted data",
      "Passwords in plain text",
      "Commands clearly",
      "Full config"
    ],
    answer: "Encrypted data",
    hint: "Not readable easily."
  },
  {
    question: "Which protocol is safest for remote login over the internet?",
    options: [
      "SSH",
      "Telnet",
      "FTP",
      "HTTP"
    ],
    answer: "SSH",
    hint: "Secure remote access."
  }
];

const els = {
  appSectionShell: document.getElementById("appSectionShell"),
  practiceToggle: document.getElementById("practiceToggle"),
  cheatSheetToggle: document.getElementById("cheatSheetToggle"),
  practiceSection: document.getElementById("practiceSection"),
  cheatSheetSection: document.getElementById("cheatSheetSection"),
  dashboardPracticeCard: document.getElementById("dashboardPracticeCard"),
  dashboardWalkthroughCard: document.getElementById("dashboardWalkthroughCard"),
  dashboardExamCard: document.getElementById("dashboardExamCard"),
  referenceDisclosure: document.getElementById("referencePanelDisclosure"),
  referencePanel: document.getElementById("referencePanel"),
  referenceModal: document.getElementById("referenceModal"),
  referenceModalTitle: document.getElementById("referenceModalTitle"),
  referenceModalBody: document.getElementById("referenceModalBody"),
  referenceModalCloseBtn: document.getElementById("referenceModalCloseBtn"),
  examModeBtn: document.getElementById("examModeBtn"),
  examStatus: document.getElementById("examStatus"),
  questionPanel: document.getElementById("subnetQuestionPanel"),
  question: document.getElementById("question"),
  diagram: document.getElementById("diagram"),
  answers: document.getElementById("answers"),
  hint: document.getElementById("hint"),
  feedback: document.getElementById("feedback"),
  hintBtn: document.getElementById("hintBtn"),
  nextBtn: document.getElementById("nextBtn"),
  restartExamBtn: document.getElementById("restartExamBtn"),
  exitExamBtn: document.getElementById("exitExamBtn"),
  streak: document.getElementById("streak"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong"),
  scoreboard: document.querySelector(".scoreboard"),
  mobileAppbarTitle: document.getElementById("subnetMobileAppbarTitle"),
  mobileHomeBtn: document.getElementById("subnetMobileHomeBtn"),
  mobileMenuBtn: document.getElementById("subnetMobileMenuBtn"),
  mobileMenuOverlay: document.getElementById("subnetMobileMenuOverlay"),
  mobileMenuCloseBtn: document.getElementById("subnetMobileMenuCloseBtn"),
  mobileMenuInfoBtn: document.getElementById("subnetMobileInfoBtn"),
  mobileMenuReferenceBtn: document.getElementById("subnetMobileReferenceBtn"),
  mobileInfoOverlay: document.getElementById("subnetMobileInfoOverlay"),
  mobileInfoCloseBtn: document.getElementById("subnetMobileInfoCloseBtn"),
  mobileInfoScroll: document.getElementById("subnetMobileInfoScroll")
};

const NetlabApp = window.NetlabApp;
const SECTION_ID = "subnetting-lab";
let savedProgressRecord = null;

const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));
const referenceCards = Array.from(document.querySelectorAll("[data-reference-card]"));
const referenceCloseControls = Array.from(document.querySelectorAll("[data-reference-close]"));
const subnetExamModes = [
  "cidrToHosts",
  "hostsToCidr",
  "cidrToMask",
  "bitsToValue",
  "networkAddress",
  "broadcastAddress",
  "usableRange",
  "hostRequirement"
];

const state = {
  currentAnswer: "",
  currentMode: "",
  currentCidr: 0,
  currentBits: [],
  correct: 0,
  wrong: 0,
  currentIp: 0,
  currentNetwork: 0,
  currentBroadcast: 0,
  currentBlockSize: 0,
  currentHintText: "",
  streak: 0,
  recentCommandQuestions: [],
  recentSecurityQuestions: [],
  examModeActive: false,
  examFinished: false,
  examQuestions: [],
  examIndex: 0,
  examScore: 0,
  examQuestionCount: 10,
  usedExamQuestions: new Set(),
  completedModes: new Set(),
  resumePromptVisible: false
};

const subnetMobilePanelRegistry = [];

function syncDashboardModeCards(activeCard = "practice") {
  if (els.dashboardPracticeCard) {
    els.dashboardPracticeCard.classList.toggle("is-active", activeCard === "practice");
  }
  if (els.dashboardWalkthroughCard) {
    els.dashboardWalkthroughCard.classList.toggle("is-active", activeCard === "walkthrough");
  }
  if (els.dashboardExamCard) {
    els.dashboardExamCard.classList.toggle("is-active", activeCard === "exam");
  }
}

function syncReferenceDisclosureDefault() {
  if (!els.referenceDisclosure) {
    return;
  }

  els.referenceDisclosure.open = false;
}

function ensureSubnetMobilePanelRegistry() {
  if (subnetMobilePanelRegistry.length) {
    return;
  }

  [
    els.appSectionShell,
    els.scoreboard,
    els.referenceDisclosure
  ].filter(Boolean).forEach((element, index) => {
    if (!element.parentNode) {
      return;
    }

    const placeholder = document.createElement("div");
    placeholder.hidden = true;
    placeholder.className = "subnet-mobile-panel-placeholder";
    placeholder.dataset.mobilePanelKey = String(index);
    element.parentNode.insertBefore(placeholder, element);
    subnetMobilePanelRegistry.push({ element, placeholder });
  });
}

function restoreSubnetDesktopPanels() {
  subnetMobilePanelRegistry.forEach(({ element, placeholder }) => {
    const parent = placeholder.parentNode;
    if (!parent || element.parentNode === parent) {
      return;
    }

    parent.insertBefore(element, placeholder.nextSibling);
  });
}

function currentSubnetMobileTitle() {
  if (state.examModeActive) {
    return state.examFinished ? "Subnetting Exam Results" : "Subnetting Exam";
  }

  if (state.currentMode) {
    return formatModeLabel(state.currentMode);
  }

  return "Subnetting Lab";
}

function syncSubnetMobileAppbar() {
  if (!els.mobileAppbarTitle) {
    return;
  }

  els.mobileAppbarTitle.textContent = currentSubnetMobileTitle();
}

function closeSubnetMobileMenu(options = {}) {
  const { restoreFocus = false } = options;

  if (!els.mobileMenuOverlay) {
    return;
  }

  document.body.classList.remove("subnet-mobile-menu-open");
  els.mobileMenuOverlay.hidden = true;

  if (els.mobileMenuBtn) {
    els.mobileMenuBtn.setAttribute("aria-expanded", "false");
    if (restoreFocus && isSubnetMobileTrainerView() && typeof els.mobileMenuBtn.focus === "function") {
      els.mobileMenuBtn.focus();
    }
  }
}

function closeSubnetMobileInfo(options = {}) {
  const { restoreFocus = false } = options;

  if (!els.mobileInfoOverlay) {
    return;
  }

  document.body.classList.remove("subnet-mobile-info-open");
  els.mobileInfoOverlay.hidden = true;

  if (restoreFocus && els.mobileMenuBtn && isSubnetMobileTrainerView() && typeof els.mobileMenuBtn.focus === "function") {
    els.mobileMenuBtn.focus();
  }
}

function syncSubnetMobilePanels() {
  ensureSubnetMobilePanelRegistry();

  if (!els.mobileInfoScroll) {
    return;
  }

  if (!isSubnetMobileTrainerView()) {
    restoreSubnetDesktopPanels();
    closeSubnetMobileMenu();
    closeSubnetMobileInfo();
    return;
  }

  subnetMobilePanelRegistry.forEach(({ element }) => {
    if (element.parentNode !== els.mobileInfoScroll) {
      els.mobileInfoScroll.appendChild(element);
    }
  });
}

function syncSubnetMobileLayout() {
  syncSubnetMobileAppbar();
  syncSubnetMobilePanels();
}

function openSubnetMobileMenu() {
  if (!isSubnetMobileTrainerView()) {
    return;
  }

  syncSubnetMobileLayout();
  closeSubnetMobileInfo();
  document.body.classList.add("subnet-mobile-menu-open");
  els.mobileMenuOverlay.hidden = false;
  els.mobileMenuBtn?.setAttribute("aria-expanded", "true");

  window.requestAnimationFrame(() => {
    if (els.mobileMenuInfoBtn && typeof els.mobileMenuInfoBtn.focus === "function") {
      els.mobileMenuInfoBtn.focus();
    }
  });
}

function openSubnetMobileInfo(section = "progress") {
  if (!isSubnetMobileTrainerView()) {
    return;
  }

  syncSubnetMobileLayout();
  closeSubnetMobileMenu();
  document.body.classList.add("subnet-mobile-info-open");
  els.mobileInfoOverlay.hidden = false;

  if (els.mobileInfoScroll) {
    els.mobileInfoScroll.scrollTop = 0;
  }

  window.requestAnimationFrame(() => {
    let target = els.appSectionShell;

    if (section === "reference" && els.referenceDisclosure) {
      els.referenceDisclosure.open = true;
      target = els.referenceDisclosure;
    }

    target?.scrollIntoView({ block: "start" });

    if (els.mobileInfoCloseBtn && typeof els.mobileInfoCloseBtn.focus === "function") {
      els.mobileInfoCloseBtn.focus();
    }
  });
}

function openReferenceDisclosure() {
  if (els.referenceDisclosure) {
    els.referenceDisclosure.open = true;
  }
}

function syncQuestionPanelVisibility(forceShow = false) {
  if (!els.questionPanel) {
    return;
  }

  const shouldShow = forceShow || state.examModeActive || state.examFinished || Boolean(state.currentMode);
  els.questionPanel.hidden = !shouldShow;
  syncSubnetMobileLayout();
}

function openReferenceTopic(topicId) {
  if (!els.referenceModal || !els.referenceModalTitle || !els.referenceModalBody) {
    return;
  }

  openReferenceDisclosure();

  const source = document.getElementById(`referenceTopic-${topicId}`);
  if (!source) {
    return;
  }

  const title = source.querySelector("h3");
  els.referenceModalTitle.textContent = title ? title.textContent : "Reference";
  els.referenceModalBody.innerHTML = source.innerHTML;
  els.referenceModal.hidden = false;
  document.body.classList.add("subnet-reference-modal-open");
  syncDashboardModeCards("walkthrough");
}

function closeReferenceModal() {
  if (!els.referenceModal) {
    return;
  }

  els.referenceModal.hidden = true;
  document.body.classList.remove("subnet-reference-modal-open");
  syncDashboardModeCards(state.examModeActive ? "exam" : "practice");
}

function formatModeLabel(mode) {
  const button = modeButtons.find((item) => item.dataset.mode === mode);
  return button ? button.textContent : "Subnetting Practice";
}

function captureAnswerButtons() {
  return Array.from(els.answers.querySelectorAll("button")).map((button) => ({
    text: button.textContent,
    disabled: button.disabled,
    className: button.className
  }));
}

function restoreAnswerButtons(buttons) {
  els.answers.innerHTML = "";

  (buttons || []).forEach((buttonState) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(buttonState.text || "");
    btn.className = buttonState.className || "";
    btn.disabled = Boolean(buttonState.disabled);
    btn.addEventListener("click", () => checkAnswer(btn.textContent));
    els.answers.appendChild(btn);
  });
}

function buildProgressSnapshot() {
  // Subnetting mode state is mostly UI-driven, so resume stores the active question and answer buttons as rendered.
  return {
    currentAnswer: state.currentAnswer,
    currentMode: state.currentMode,
    currentCidr: state.currentCidr,
    currentBits: [...state.currentBits],
    correct: state.correct,
    wrong: state.wrong,
    currentIp: state.currentIp,
    currentNetwork: state.currentNetwork,
    currentBroadcast: state.currentBroadcast,
    currentBlockSize: state.currentBlockSize,
    currentHintText: state.currentHintText,
    streak: state.streak,
    recentCommandQuestions: [...state.recentCommandQuestions],
    recentSecurityQuestions: [...state.recentSecurityQuestions],
    examModeActive: state.examModeActive,
    examFinished: state.examFinished,
    examQuestions: NetlabApp ? NetlabApp.clone(state.examQuestions) : JSON.parse(JSON.stringify(state.examQuestions)),
    examIndex: state.examIndex,
    examScore: state.examScore,
    examQuestionCount: state.examQuestionCount,
    usedExamQuestions: Array.from(state.usedExamQuestions),
    completedModes: Array.from(state.completedModes),
    ui: {
      practiceHidden: els.practiceSection.hidden,
      cheatSheetHidden: els.cheatSheetSection.hidden,
      scoreboardHidden: els.scoreboard.hidden,
      questionText: els.question.textContent,
      questionPlaceholder: els.question.classList.contains("question-placeholder"),
      diagramHtml: els.diagram.innerHTML,
      answers: captureAnswerButtons(),
      hintText: els.hint.textContent,
      feedbackText: els.feedback.textContent,
      feedbackClass: els.feedback.className,
      hintBtnHidden: els.hintBtn.hidden,
      nextBtnHidden: els.nextBtn.hidden,
      nextBtnText: els.nextBtn.textContent,
      examStatusHidden: els.examStatus.hidden,
      examStatusText: els.examStatus.textContent,
      restartExamBtnHidden: els.restartExamBtn.hidden,
      exitExamBtnHidden: els.exitExamBtn.hidden
    }
  };
}

function persistSectionProgress() {
  if (!NetlabApp) {
    return;
  }

  const modeLabel = state.examModeActive
    ? `Exam Mode - Question ${Math.min(state.examIndex + 1, state.examQuestionCount)}`
    : state.currentMode
      ? formatModeLabel(state.currentMode)
      : "Practice Lobby";

  savedProgressRecord = NetlabApp.saveSectionProgress(SECTION_ID, {
    sectionLabel: "Subnetting Lab",
    currentItemId: state.examModeActive ? "exam-mode" : state.currentMode,
    currentItemLabel: modeLabel,
    completedCount: state.completedModes.size,
    totalCount: modeButtons.length,
    summaryText: `Score ${state.correct} correct / ${state.wrong} wrong`,
    state: buildProgressSnapshot()
  });
  state.resumePromptVisible = false;
  renderSectionShell();
}

function restoreSavedProgress(savedState) {
  if (!savedState) {
    return false;
  }

  state.currentAnswer = savedState.currentAnswer || "";
  state.currentMode = savedState.currentMode || "";
  state.currentCidr = Number(savedState.currentCidr) || 0;
  state.currentBits = Array.isArray(savedState.currentBits) ? savedState.currentBits : [];
  state.correct = Number(savedState.correct) || 0;
  state.wrong = Number(savedState.wrong) || 0;
  state.currentIp = Number(savedState.currentIp) || 0;
  state.currentNetwork = Number(savedState.currentNetwork) || 0;
  state.currentBroadcast = Number(savedState.currentBroadcast) || 0;
  state.currentBlockSize = Number(savedState.currentBlockSize) || 0;
  state.currentHintText = savedState.currentHintText || "";
  state.streak = Number(savedState.streak) || 0;
  state.recentCommandQuestions = Array.isArray(savedState.recentCommandQuestions) ? savedState.recentCommandQuestions : [];
  state.recentSecurityQuestions = Array.isArray(savedState.recentSecurityQuestions) ? savedState.recentSecurityQuestions : [];
  state.examModeActive = Boolean(savedState.examModeActive);
  state.examFinished = Boolean(savedState.examFinished);
  state.examQuestions = Array.isArray(savedState.examQuestions) ? savedState.examQuestions : [];
  state.examIndex = Number(savedState.examIndex) || 0;
  state.examScore = Number(savedState.examScore) || 0;
  state.examQuestionCount = Number(savedState.examQuestionCount) || 10;
  state.usedExamQuestions = new Set(Array.isArray(savedState.usedExamQuestions) ? savedState.usedExamQuestions : []);
  state.completedModes = new Set(Array.isArray(savedState.completedModes) ? savedState.completedModes : []);

  const ui = savedState.ui || {};
  els.practiceSection.hidden = false;
  els.cheatSheetSection.hidden = true;
  els.scoreboard.hidden = Boolean(ui.scoreboardHidden);
  els.practiceToggle.classList.add("active");
  els.cheatSheetToggle.classList.remove("active");

  updateScoreboard();
  updateActiveMode(state.examModeActive ? "" : state.currentMode);
  setExamControlsDisabled(state.examModeActive && !state.examFinished);
  syncDashboardModeCards(state.examModeActive ? "exam" : "practice");
  setQuestion(ui.questionText || "Select a mode to begin", Boolean(ui.questionPlaceholder));
  els.diagram.innerHTML = ui.diagramHtml || "";
  restoreAnswerButtons(ui.answers);
  els.hint.textContent = ui.hintText || "";
  els.feedback.textContent = ui.feedbackText || "";
  els.feedback.className = ui.feedbackClass || "";
  els.hintBtn.hidden = Boolean(ui.hintBtnHidden);
  els.nextBtn.hidden = Boolean(ui.nextBtnHidden);
  els.nextBtn.textContent = ui.nextBtnText || "Next";
  els.examStatus.hidden = Boolean(ui.examStatusHidden);
  els.examStatus.textContent = ui.examStatusText || "";
  els.restartExamBtn.hidden = Boolean(ui.restartExamBtnHidden);
  els.exitExamBtn.hidden = Boolean(ui.exitExamBtnHidden);
  syncQuestionPanelVisibility(!ui.questionPlaceholder || Boolean(ui.diagramHtml) || (ui.answers || []).length > 0);
  syncExamExitButton();
  state.resumePromptVisible = false;

  NetlabApp?.clearLaunchAction();
  syncSubnetMobileLayout();
  return true;
}

function renderSectionShell() {
  if (!els.appSectionShell || !NetlabApp) {
    return;
  }

  const profile = NetlabApp.getActiveProfile();
  const record = savedProgressRecord || NetlabApp.getSectionProgress(SECTION_ID);
  const showResume = Boolean(record && state.resumePromptVisible);
  const completionText = record && showResume
    ? `${record.completedCount}/${record.totalCount || modeButtons.length}`
    : `${state.completedModes.size}/${modeButtons.length}`;
  const lastItem = record?.currentItemLabel || (state.currentMode ? formatModeLabel(state.currentMode) : "Not started");
  const accountHref = typeof NetlabApp.buildHubUrl === "function"
    ? (profile.isGuest ? NetlabApp.buildHubUrl({ auth: "login" }) : NetlabApp.buildHubUrl())
    : "./index.html#hubAccountPanel";
  const accountLabel = profile.isGuest ? "Sign In to Sync" : "Manage Account";

  els.appSectionShell.innerHTML = [
    "<div class=\"app-shell-head\">",
    "  <div>",
    "    <p class=\"app-shell-kicker\">Progress</p>",
    "    <h2>Resume Subnetting Lab</h2>",
    "    <p class=\"app-shell-copy\">" + escapeHtml(showResume
      ? "Saved progress is available for this subnetting track. Resume the last mode or start the lab over from the beginning."
      : "Profile: " + profile.label + ". This page saves the current mode, score, and active question so you can return to it later.") + "</p>",
    "  </div>",
    "</div>",
    "<div class=\"app-shell-badges\">",
    "  <span class=\"status-badge status-badge-blue\">Profile: " + escapeHtml(profile.label) + "</span>",
    "  <span class=\"status-badge\">Completed: " + escapeHtml(completionText) + "</span>",
    "  <span class=\"status-badge\">Coins: " + escapeHtml(NetlabApp.getCoinsTotal()) + "</span>",
    "  <span class=\"status-badge\">Last active: " + escapeHtml(lastItem) + "</span>",
    "</div>",
    "<div class=\"app-shell-actions\">",
    (showResume ? "  <button id=\"resumeSectionBtn\" class=\"app-action-btn\" type=\"button\">Resume</button>" : ""),
    "  <a class=\"app-action-link\" href=\"" + escapeHtml(accountHref) + "\">" + escapeHtml(accountLabel) + "</a>",
    "  <button id=\"startOverSectionBtn\" class=\"app-action-btn\" type=\"button\">Start Over</button>",
    "  <button id=\"toggleSoundBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Sound: " + escapeHtml(NetlabApp.isSoundEnabled() ? "On" : "Off") + "</button>",
    "  <button id=\"resetProgressBtn\" class=\"app-action-btn app-action-btn-muted\" type=\"button\">Reset Progress</button>",
    "</div>",
    "<p class=\"app-shell-note\">Reset Progress clears all saved lab progress for the current profile. " + escapeHtml(NetlabApp.getProfileStorageNote()) + "</p>"
  ].join("");

  const resumeBtn = document.getElementById("resumeSectionBtn");
  const startOverBtn = document.getElementById("startOverSectionBtn");
  const toggleSoundBtn = document.getElementById("toggleSoundBtn");
  const resetProgressBtn = document.getElementById("resetProgressBtn");

  if (resumeBtn && record) {
    resumeBtn.addEventListener("click", () => {
      restoreSavedProgress(record.state);
      renderSectionShell();
    });
  }

  if (startOverBtn) {
    startOverBtn.addEventListener("click", () => {
      window.location.href = NetlabApp.buildSectionUrl(SECTION_ID, "start");
    });
  }

  if (toggleSoundBtn) {
    toggleSoundBtn.addEventListener("click", () => {
      NetlabApp.setSoundEnabled(!NetlabApp.isSoundEnabled());
      renderSectionShell();
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", () => {
      if (!window.confirm("Clear all saved progress for the current profile?")) {
        return;
      }

      NetlabApp.clearActiveProfileProgress();
      window.location.href = NetlabApp.buildSectionUrl(SECTION_ID, "start");
    });
  }

  syncSubnetMobileLayout();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCidr(cidr) {
  const hostBits = 32 - cidr;
  return `/${cidr} (${hostBits} host bits)`;
}

function hosts(cidr) {
  return Math.pow(2, 32 - cidr) - 2;
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const copy = [...arr];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function setQuestion(text, isPlaceholder = false) {
  els.question.textContent = text;
  els.question.classList.toggle("question-placeholder", isPlaceholder);
  syncSubnetMobileAppbar();
}

function updateScoreboard() {
  els.streak.textContent = state.streak;
  els.correct.textContent = state.correct;
  els.wrong.textContent = state.wrong;
}

function updateActiveMode(mode) {
  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

function showPractice(force = false) {
  if (state.examModeActive && !force) return;

  els.practiceSection.hidden = false;
  els.cheatSheetSection.hidden = true;
  els.practiceToggle.classList.add("active");
  els.cheatSheetToggle.classList.remove("active");
  closeReferenceModal();
  syncDashboardModeCards("practice");

  if (!state.examModeActive) {
    els.scoreboard.hidden = false;
  }

  if (!state.currentMode && !state.examModeActive) {
    resetIntroState();
  }

  syncQuestionPanelVisibility();

  renderSectionShell();
  syncSubnetMobileLayout();
  if (NetlabApp && !state.resumePromptVisible) {
    persistSectionProgress();
  }
}

function showCheatSheet() {
  if (state.examModeActive) return;

  els.practiceSection.hidden = false;
  els.cheatSheetSection.hidden = true;
  els.practiceToggle.classList.remove("active");
  els.cheatSheetToggle.classList.add("active");
  syncDashboardModeCards("walkthrough");

  openReferenceDisclosure();

  if (els.referencePanel) {
    els.referencePanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  openReferenceTopic("quickRules");
  renderSectionShell();
  syncSubnetMobileLayout();
  if (!state.resumePromptVisible) {
    persistSectionProgress();
  }
}

function resetIntroState() {
  setQuestion("Select a mode to begin", true);
  els.diagram.innerHTML = "";
  els.answers.innerHTML = "";
  els.hint.textContent = "";
  els.feedback.textContent = "";
  els.feedback.className = "";
  els.hintBtn.hidden = true;
  els.nextBtn.hidden = true;
  els.nextBtn.textContent = "Next";
  els.examStatus.hidden = true;
  els.restartExamBtn.hidden = true;
  els.exitExamBtn.hidden = true;
  syncQuestionPanelVisibility(false);
}

function resetQuestionUi({ showHint = true } = {}) {
  els.feedback.textContent = "";
  els.feedback.className = "";
  els.hint.textContent = "";
  els.diagram.innerHTML = "";
  els.answers.innerHTML = "";
  els.hintBtn.hidden = !showHint;
  els.nextBtn.hidden = true;
  els.nextBtn.textContent = "Next";
  els.examStatus.hidden = true;
  els.restartExamBtn.hidden = true;
  els.exitExamBtn.hidden = true;
  state.currentHintText = "";
  state.currentBits = [];
  syncQuestionPanelVisibility(true);
}

function renderAnswerOptions(options) {
  els.answers.innerHTML = "";

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = String(option);
    btn.addEventListener("click", () => checkAnswer(option));
    els.answers.appendChild(btn);
  });
}

function renderQuestionObject(question, mode) {
  state.currentMode = mode;
  state.currentAnswer = question.answer;
  state.currentHintText = question.hint;
  setQuestion(question.question);
  renderAnswerOptions(shuffle(question.options));
  syncQuestionPanelVisibility(true);
}

function renderCurrentModeQuestion(mode) {
  const cidr = random(cidrs);
  state.currentCidr = cidr;
  state.currentMode = mode;

  switch (mode) {
    case "cidrToHosts":
      state.currentAnswer = hosts(cidr);
      setQuestion(`How many usable hosts are available with ${formatCidr(cidr)}?`);
      generateOptions(state.currentAnswer, cidr, "hosts");
      break;
    case "hostsToCidr":
      state.currentAnswer = `/${cidr}`;
      setQuestion(`How many network bits are needed for ${hosts(cidr)} usable hosts?`);
      generateOptions(state.currentAnswer, cidr, "cidr");
      break;
    case "cidrToMask":
      state.currentAnswer = masks[cidr];
      setQuestion(`What is the subnet mask for /${cidr}?`);
      generateOptions(state.currentAnswer, cidr, "mask");
      break;
    case "bitsToValue":
      generateBitsQuestion();
      break;
    case "networkAddress":
      generateNetworkQuestion();
      break;
    case "broadcastAddress":
      generateBroadcastQuestion();
      break;
    case "usableRange":
      generateUsableRangeQuestion();
      break;
    case "hostRequirement":
      generateHostRequirementQuestion();
      break;
    case "commandQuiz":
      generateCommandQuestion();
      break;
    case "securityQuiz":
      generateSecurityQuestion();
      break;
    default:
      resetIntroState();
  }
}

function setExamControlsDisabled(disabled) {
  els.practiceToggle.disabled = disabled;
  els.cheatSheetToggle.disabled = disabled;
  els.examModeBtn.disabled = disabled;
  if (els.dashboardPracticeCard) {
    els.dashboardPracticeCard.disabled = disabled;
  }
  if (els.dashboardWalkthroughCard) {
    els.dashboardWalkthroughCard.disabled = disabled;
  }
  if (els.dashboardExamCard) {
    els.dashboardExamCard.disabled = disabled;
  }

  modeButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function updateExamStatus() {
  if (!state.examModeActive || state.examFinished) {
    els.examStatus.hidden = true;
    syncSubnetMobileAppbar();
    return;
  }

  els.examStatus.hidden = false;
  els.examStatus.textContent = `Question ${state.examIndex + 1} of ${state.examQuestionCount}`;
  syncSubnetMobileAppbar();
}

function syncExamExitButton() {
  els.exitExamBtn.textContent = state.examModeActive && !state.examFinished ? "Cancel Exam" : "Exit Exam";
  els.exitExamBtn.hidden = !state.examModeActive;
  syncSubnetMobileAppbar();
}

function takeRandomItems(list, count) {
  return shuffle(list).slice(0, Math.min(count, list.length));
}

function uniqueQuestionsByText(list) {
  const seen = new Set();

  return list.filter((item) => {
    if (seen.has(item.question)) return false;
    seen.add(item.question);
    return true;
  });
}

function buildExamQuestions() {
  state.usedExamQuestions = new Set();

  const subnetPart = takeRandomItems(subnetExamModes, 4).map((mode) => {
    const id = `subnet:${mode}`;
    state.usedExamQuestions.add(id);
    return { id, type: "subnet", mode };
  });

  const commandPart = takeRandomItems(uniqueQuestionsByText(commandQuestions), 3).map((question) => {
    const id = `command:${question.question}`;
    state.usedExamQuestions.add(id);
    return { id, type: "command", data: question };
  });

  const securityPart = takeRandomItems(uniqueQuestionsByText(securityQuestions), 3).map((question) => {
    const id = `security:${question.question}`;
    state.usedExamQuestions.add(id);
    return { id, type: "security", data: question };
  });

  return shuffle([...subnetPart, ...commandPart, ...securityPart]);
}

function startExamMode() {
  showPractice(true);

  state.examModeActive = true;
  state.examFinished = false;
  state.examIndex = 0;
  state.examScore = 0;
  state.examQuestions = buildExamQuestions();
  state.examQuestionCount = state.examQuestions.length;
  state.currentMode = "";

  updateActiveMode("");
  setExamControlsDisabled(true);
  els.scoreboard.hidden = true;
  syncDashboardModeCards("exam");

  generateExamQuestion();
  syncExamExitButton();
  persistSectionProgress();
}

function generateExamQuestion() {
  if (!state.examModeActive) return;

  if (state.examIndex >= state.examQuestionCount) {
    finishExamMode();
    return;
  }

  resetQuestionUi({ showHint: false });
  showPractice(true);
  updateExamStatus();
  syncExamExitButton();

  const currentExamQuestion = state.examQuestions[state.examIndex];

  if (currentExamQuestion.type === "command") {
    renderQuestionObject(currentExamQuestion.data, "commandQuiz");
    persistSectionProgress();
    return;
  }

  if (currentExamQuestion.type === "security") {
    renderQuestionObject(currentExamQuestion.data, "securityQuiz");
    persistSectionProgress();
    return;
  }

  renderCurrentModeQuestion(currentExamQuestion.mode);
  persistSectionProgress();
}

function markAnswerButtons(answer, isCorrect) {
  const buttons = Array.from(els.answers.querySelectorAll("button"));

  buttons.forEach((button) => {
    const matchesCorrect = answerUsesPartialMatch()
      ? button.textContent.includes(state.currentAnswer)
      : button.textContent == state.currentAnswer;

    if (matchesCorrect) {
      button.classList.add("correct-btn");
    }

    if (button.textContent === String(answer) && !isCorrect) {
      button.classList.add("wrong-btn");
    }

    button.disabled = true;
  });
}

function submitExamAnswer(answer) {
  const isCorrect = answerUsesPartialMatch()
    ? typeof answer === "string" && answer.includes(state.currentAnswer)
    : answer == state.currentAnswer;

  markAnswerButtons(answer, isCorrect);

  if (isCorrect) {
    state.examScore += 1;
    els.feedback.textContent = "Correct";
    els.feedback.className = "correct";
  } else {
    els.feedback.textContent = `Wrong (Correct: ${state.currentAnswer})`;
    els.feedback.className = "wrong";
  }

  els.hintBtn.hidden = true;
  els.nextBtn.hidden = false;
  els.nextBtn.textContent =
    state.examIndex === state.examQuestionCount - 1 ? "Finish Exam" : "Next Question";
  persistSectionProgress();
}

function advanceExamQuestion() {
  if (!state.examModeActive || state.examFinished) return;

  state.examIndex += 1;
  generateExamQuestion();
}

function finishExamMode() {
  state.examFinished = true;

  const percentage = Math.round((state.examScore / state.examQuestionCount) * 100);
  const passed = percentage >= 70;

  setQuestion("Exam Complete");
  els.examStatus.hidden = true;
  els.answers.innerHTML = "";
  els.feedback.textContent = "";
  els.feedback.className = "";
  els.hint.textContent = "";
  els.hintBtn.hidden = true;
  els.nextBtn.hidden = true;

  els.diagram.innerHTML = `
    <div class="exam-result ${passed ? "pass" : "fail"}">
      <div class="exam-result-score">${state.examScore} / ${state.examQuestionCount}</div>
      <div class="exam-result-percent">${percentage}%</div>
      <div class="exam-result-outcome">${passed ? "PASS" : "FAIL"}</div>
    </div>
  `;

  els.restartExamBtn.hidden = false;
  syncExamExitButton();
  if (passed && NetlabApp?.awardCoins) {
    NetlabApp.awardCoins({
      key: "subnetting-exam-pass",
      coins: 20,
      title: "Subnetting Milestone",
      message: "Passed the subnetting exam."
    });
  }
  persistSectionProgress();
}

function exitExamMode() {
  if (state.examModeActive && !state.examFinished) {
    const leaveExam = window.confirm("Leave exam mode and discard this exam attempt?");
    if (!leaveExam) {
      return;
    }
  }

  state.examModeActive = false;
  state.examFinished = false;
  state.examQuestions = [];
  state.examIndex = 0;
  state.examScore = 0;
  state.usedExamQuestions = new Set();
  state.currentMode = "";

  setExamControlsDisabled(false);
  updateActiveMode("");
  els.scoreboard.hidden = false;

  showPractice(true);
  resetIntroState();
  syncExamExitButton();
  persistSectionProgress();
}

function setSubnetState({ cidr, ip, blockSize, network, broadcast }) {
  state.currentIp = ip;
  state.currentCidr = cidr;
  state.currentBlockSize = blockSize;
  state.currentNetwork = network;
  state.currentBroadcast = broadcast;
}

function buildSubnetScenario() {
  const base = "192.168.1.";
  const cidr = random(cidrs);
  const blockSize = Math.pow(2, 32 - cidr);
  const ip = Math.floor(Math.random() * 256);
  const network = Math.floor(ip / blockSize) * blockSize;
  const broadcast = network + blockSize - 1;

  setSubnetState({ cidr, ip, blockSize, network, broadcast });

  return { base, cidr, blockSize, ip, network, broadcast };
}

function generateOptions(correctAnswer, cidr, type) {
  const options = [correctAnswer];

  while (options.length < 4) {
    const candidateCidr = random(cidrs);
    let value = "";

    if (type === "hosts") value = hosts(candidateCidr);
    if (type === "cidr") value = formatCidr(candidateCidr);
    if (type === "mask") value = masks[candidateCidr];

    if (!options.includes(value)) {
      options.push(value);
    }
  }

  renderAnswerOptions(shuffle(options));
}

function generateNetworkQuestion() {
  const { base, cidr, blockSize, ip, network } = buildSubnetScenario();

  state.currentAnswer = base + network;
  setQuestion(`IP: ${base}${ip} ${formatCidr(cidr)} -> What is the network address?`);

  const options = Array.from(new Set([
    base + network,
    base + (network + blockSize),
    base + (network - blockSize),
    base + (network + (blockSize * 2))
  ])).filter((value) => {
    const lastOctet = Number(String(value).split(".")[3]);
    return lastOctet >= 0 && lastOctet <= 255;
  });

  renderAnswerOptions(shuffle(options));
}

function generateBroadcastQuestion() {
  const { base, cidr, blockSize, ip, network, broadcast } = buildSubnetScenario();

  state.currentAnswer = base + broadcast;
  setQuestion(`IP: ${base}${ip} ${formatCidr(cidr)} -> What is the broadcast address?`);

  const options = Array.from(new Set([
    base + broadcast,
    base + (network + blockSize - 2),
    base + (network + blockSize),
    base + network
  ])).filter((value) => {
    const lastOctet = Number(String(value).split(".")[3]);
    return lastOctet >= 0 && lastOctet <= 255;
  });

  renderAnswerOptions(shuffle(options));
}

function generateUsableRangeQuestion() {
  const { base, cidr, ip, network, broadcast } = buildSubnetScenario();
  const first = network + 1;
  const last = broadcast - 1;

  state.currentAnswer = `${base}${first} - ${base}${last}`;
  setQuestion(`IP: ${base}${ip} ${formatCidr(cidr)} -> What is the usable range?`);

  const options = [
    state.currentAnswer,
    `${base}${network} - ${base}${broadcast}`,
    `${base}${first} - ${base}${broadcast}`,
    `${base}${network} - ${base}${last}`
  ];

  renderAnswerOptions(shuffle(options));
}

function generateHostRequirementQuestion() {
  const cidr = random(cidrs);
  const maxHosts = hosts(cidr);
  let minNeeded = 2;

  if (cidr < 30) {
    minNeeded = Math.max(2, hosts(cidr + 1) + 1);
  }

  const requiredHosts = Math.floor(Math.random() * (maxHosts - minNeeded + 1)) + minNeeded;

  state.currentCidr = cidr;
  state.currentAnswer = formatCidr(cidr);

  setQuestion(`You need ${requiredHosts} usable hosts. Which subnet should you use?`);

  const options = [formatCidr(cidr)];

  while (options.length < 4) {
    const wrongCidr = random(cidrs);
    const wrongOption = formatCidr(wrongCidr);

    if (!options.includes(wrongOption)) {
      options.push(wrongOption);
    }
  }

  renderAnswerOptions(shuffle(options));
}

function generateBitsQuestion() {
  const onBits = Math.floor(Math.random() * 4) + 1;

  state.currentBits = Array(8).fill(0);
  for (let i = 0; i < onBits; i += 1) {
    state.currentBits[i] = 1;
  }

  state.currentAnswer = bitValues
    .filter((_, index) => state.currentBits[index] === 1)
    .reduce((sum, value) => sum + value, 0);

  setQuestion("What decimal value does this last octet represent?");

  const valuesLine = bitValues.map((value) => String(value).padStart(3, " ")).join(" ");
  const bitsLine = state.currentBits.map((value) => String(value).padStart(3, " ")).join(" ");

  els.diagram.innerHTML = `
    <div class="bits-row">${valuesLine}</div>
    <div class="bits-row">${bitsLine}</div>
  `;

  const options = [state.currentAnswer];

  while (options.length < 4) {
    const wrongAnswer = state.currentAnswer + random([-64, -32, -16, 16, 32, 64, 8, -8]);

    if (wrongAnswer >= 0 && wrongAnswer <= 255 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  renderAnswerOptions(shuffle(options));
}

function pickRecentQuestion(questions, recentList) {
  let available = questions.filter((question) => !recentList.includes(question.question));

  if (available.length === 0) {
    recentList.length = 0;
    available = questions;
  }

  const picked = random(available);
  recentList.push(picked.question);

  if (recentList.length > 3) {
    recentList.shift();
  }

  return picked;
}

function generateCommandQuestion() {
  const question = pickRecentQuestion(commandQuestions, state.recentCommandQuestions);
  renderQuestionObject(question, "commandQuiz");
}

function generateSecurityQuestion() {
  const question = pickRecentQuestion(securityQuestions, state.recentSecurityQuestions);
  renderQuestionObject(question, "securityQuiz");
}

function startQuiz() {
  if (!state.currentMode) {
    resetIntroState();
    return;
  }

  nextQuestion();
}

function nextQuestion() {
  if (state.examModeActive) return;

  if (!state.currentMode) {
    resetIntroState();
    return;
  }

  showPractice();
  resetQuestionUi({ showHint: true });
  renderCurrentModeQuestion(state.currentMode);
  persistSectionProgress();
}

function showHint() {
  if (!state.currentMode) {
    return;
  }

  if (state.currentMode === "commandQuiz" || state.currentMode === "securityQuiz") {
    els.hint.textContent = state.currentHintText;
    persistSectionProgress();
    return;
  }

  if (state.currentMode === "cidrToHosts") {
    const hostBits = 32 - state.currentCidr;
    els.hint.textContent = `Hint: Work out host bits first. 32 - ${state.currentCidr} = ${hostBits}. Then use 2^${hostBits} - 2.`;
    return;
  }

  if (state.currentMode === "hostsToCidr") {
    const hostBits = 32 - state.currentCidr;
    els.hint.textContent = `Hint: ${hosts(state.currentCidr)} usable hosts means ${hostBits} host bits, so the answer is /${state.currentCidr}.`;
    return;
  }

  if (state.currentMode === "cidrToMask") {
    const extraBits = state.currentCidr - 24;
    const used = bitValues.slice(0, extraBits);
    const sum = used.reduce((total, value) => total + value, 0);
    els.hint.textContent = `Hint: In the last octet, each place is a power of 2: 128, 64, 32, 16, 8, 4, 2, 1. /${state.currentCidr} means ${extraBits} bits are ON there, so add the first ${extraBits}: ${used.join(" + ")} = ${sum}.`;
    return;
  }

  if (state.currentMode === "bitsToValue") {
    const used = bitValues.filter((_, index) => state.currentBits[index] === 1);
    els.hint.textContent = `Hint: Add the values where the bit is 1. Here that means ${used.join(" + ")}.`;
    return;
  }

  if (state.currentMode === "networkAddress") {
    const blockSize = Math.pow(2, 32 - state.currentCidr);
    els.hint.textContent = `Hint: Block size = ${blockSize}. Subnets go 0, ${blockSize}, ${blockSize * 2}, ${blockSize * 3}. Find which range the IP fits into.`;
    return;
  }

  if (state.currentMode === "broadcastAddress") {
    els.hint.textContent = `Hint: Find the network first (${state.currentNetwork}). Then add block size (${state.currentBlockSize}) - 1 -> ${state.currentBroadcast}`;
    return;
  }

  if (state.currentMode === "usableRange") {
    els.hint.textContent = `Hint: Usable range = network + 1 to broadcast - 1 -> ${state.currentNetwork + 1} - ${state.currentBroadcast - 1}`;
    return;
  }

  if (state.currentMode === "hostRequirement") {
    els.hint.textContent = "Hint: Choose the smallest subnet that fits. /24=254, /25=126, /26=62, /27=30, /28=14, /29=6, /30=2.";
  }

  persistSectionProgress();
}

function answerUsesPartialMatch() {
  return state.currentMode === "hostsToCidr" || state.currentMode === "hostRequirement";
}

function isSubnetMobileTrainerView() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function checkAnswer(answer) {
  if (state.examModeActive && !state.examFinished) {
    submitExamAnswer(answer);
    return;
  }

  const isCorrect = answerUsesPartialMatch()
    ? typeof answer === "string" && answer.includes(state.currentAnswer)
    : answer == state.currentAnswer;

  markAnswerButtons(answer, isCorrect);

  if (isCorrect) {
    state.correct += 1;
    state.streak += 1;
    els.feedback.textContent = "Correct";
    els.feedback.className = "correct";
  } else {
    state.wrong += 1;
    state.streak = 0;
    els.feedback.textContent = `Wrong (Correct: ${state.currentAnswer})`;
    els.feedback.className = "wrong";
  }

  updateScoreboard();
  els.nextBtn.hidden = false;
  els.hintBtn.hidden = true;
  persistSectionProgress();

  if (isCorrect && isSubnetMobileTrainerView()) {
    window.setTimeout(() => {
      if (state.examModeActive || !state.currentMode) return;
      if (els.nextBtn.hidden) return;
      nextQuestion();
    }, 720);
  }
}

function setMode(mode) {
  if (state.examModeActive) return;

  state.currentMode = mode;
  state.completedModes.add(mode);
  updateActiveMode(mode);
  showPractice();
  startQuiz();
  persistSectionProgress();
}

function bindEvents() {
  els.practiceToggle.addEventListener("click", () => showPractice());
  els.cheatSheetToggle.addEventListener("click", showCheatSheet);
  if (els.dashboardPracticeCard) {
    els.dashboardPracticeCard.addEventListener("click", () => {
      showPractice();
      els.practiceSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (els.dashboardWalkthroughCard) {
    els.dashboardWalkthroughCard.addEventListener("click", showCheatSheet);
  }
  if (els.dashboardExamCard) {
    els.dashboardExamCard.addEventListener("click", startExamMode);
  }
  referenceCards.forEach((button) => {
    button.addEventListener("click", () => {
      openReferenceTopic(button.getAttribute("data-reference-card"));
    });
  });
  referenceCloseControls.forEach((element) => {
    element.addEventListener("click", closeReferenceModal);
  });
  if (els.referenceModalCloseBtn) {
    els.referenceModalCloseBtn.addEventListener("click", closeReferenceModal);
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.referenceModal && !els.referenceModal.hidden) {
      closeReferenceModal();
      return;
    }

    if (event.key === "Escape" && document.body.classList.contains("subnet-mobile-info-open")) {
      closeSubnetMobileInfo({ restoreFocus: true });
      return;
    }

    if (event.key === "Escape" && document.body.classList.contains("subnet-mobile-menu-open")) {
      closeSubnetMobileMenu({ restoreFocus: true });
    }
  });
  els.hintBtn.addEventListener("click", showHint);

  els.nextBtn.addEventListener("click", () => {
    if (state.examModeActive && !state.examFinished) {
      advanceExamQuestion();
      return;
    }

    nextQuestion();
  });

  els.examModeBtn.addEventListener("click", startExamMode);
  els.restartExamBtn.addEventListener("click", startExamMode);
  els.exitExamBtn.addEventListener("click", exitExamMode);

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  window.addEventListener("netlab:authchange", () => {
    savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
    state.resumePromptVisible = Boolean(savedProgressRecord);
    renderSectionShell();
  });

  window.addEventListener("netlab:progresschange", () => {
    savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
    if (!savedProgressRecord) {
      state.resumePromptVisible = false;
    }
    renderSectionShell();
  });

  window.addEventListener("netlab:profilemetachange", () => {
    renderSectionShell();
  });

  els.mobileHomeBtn?.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  els.mobileMenuBtn?.addEventListener("click", () => {
    if (document.body.classList.contains("subnet-mobile-menu-open")) {
      closeSubnetMobileMenu({ restoreFocus: true });
      return;
    }

    openSubnetMobileMenu();
  });

  document.querySelectorAll("[data-subnet-mobile-menu-close]").forEach((element) => {
    element.addEventListener("click", () => closeSubnetMobileMenu({ restoreFocus: true }));
  });

  els.mobileMenuCloseBtn?.addEventListener("click", () => closeSubnetMobileMenu({ restoreFocus: true }));
  els.mobileMenuInfoBtn?.addEventListener("click", () => openSubnetMobileInfo("progress"));
  els.mobileMenuReferenceBtn?.addEventListener("click", () => openSubnetMobileInfo("reference"));

  document.querySelectorAll("[data-subnet-mobile-info-close]").forEach((element) => {
    element.addEventListener("click", () => closeSubnetMobileInfo({ restoreFocus: true }));
  });

  els.mobileInfoCloseBtn?.addEventListener("click", () => closeSubnetMobileInfo({ restoreFocus: true }));
  window.addEventListener("resize", syncSubnetMobileLayout);
}

async function bootSubnettingLab() {
  if (NetlabApp?.whenReady) {
    await NetlabApp.whenReady();
  }

  if (NetlabApp?.getLaunchAction() === "start") {
    NetlabApp.resetSectionProgress(SECTION_ID);
    NetlabApp.clearLaunchAction();
  }

  savedProgressRecord = NetlabApp ? NetlabApp.getSectionProgress(SECTION_ID) : null;
  state.resumePromptVisible = Boolean(savedProgressRecord && NetlabApp?.getLaunchAction() !== "resume");

  syncReferenceDisclosureDefault();
  bindEvents();
  updateScoreboard();
  if (NetlabApp?.getLaunchAction() === "resume" && savedProgressRecord && restoreSavedProgress(savedProgressRecord.state)) {
    renderSectionShell();
    return;
  }

  showPractice();
  if (NetlabApp?.getLaunchAction()) {
    NetlabApp.clearLaunchAction();
  }
  renderSectionShell();
}

bootSubnettingLab();
