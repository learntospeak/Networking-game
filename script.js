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
  }
];

const els = {
  practiceToggle: document.getElementById("practiceToggle"),
  cheatSheetToggle: document.getElementById("cheatSheetToggle"),
  practiceSection: document.getElementById("practiceSection"),
  cheatSheetSection: document.getElementById("cheatSheetSection"),
  question: document.getElementById("question"),
  diagram: document.getElementById("diagram"),
  answers: document.getElementById("answers"),
  hint: document.getElementById("hint"),
  feedback: document.getElementById("feedback"),
  hintBtn: document.getElementById("hintBtn"),
  nextBtn: document.getElementById("nextBtn"),
  streak: document.getElementById("streak"),
  correct: document.getElementById("correct"),
  wrong: document.getElementById("wrong")
};

const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

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
  recentSecurityQuestions: []
};

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

function showPractice() {
  els.practiceSection.hidden = false;
  els.cheatSheetSection.hidden = true;
  els.practiceToggle.classList.add("active");
  els.cheatSheetToggle.classList.remove("active");

  if (!state.currentMode) {
    resetIntroState();
  }
}

function showCheatSheet() {
  els.practiceSection.hidden = true;
  els.cheatSheetSection.hidden = false;
  els.practiceToggle.classList.remove("active");
  els.cheatSheetToggle.classList.add("active");
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
}

function resetQuestionUi() {
  els.feedback.textContent = "";
  els.feedback.className = "";
  els.hint.textContent = "";
  els.diagram.innerHTML = "";
  els.answers.innerHTML = "";
  els.hintBtn.hidden = false;
  els.nextBtn.hidden = true;
  state.currentHintText = "";
  state.currentBits = [];
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

  state.currentAnswer = question.answer;
  state.currentHintText = question.hint;
  setQuestion(question.question);

  renderAnswerOptions(shuffle(question.options));
}

function generateSecurityQuestion() {
  const question = pickRecentQuestion(securityQuestions, state.recentSecurityQuestions);

  state.currentAnswer = question.answer;
  state.currentHintText = question.hint;
  setQuestion(question.question);

  renderAnswerOptions(shuffle(question.options));
}

function startQuiz() {
  if (!state.currentMode) {
    resetIntroState();
    return;
  }

  nextQuestion();
}

function nextQuestion() {
  if (!state.currentMode) {
    resetIntroState();
    return;
  }

  showPractice();
  resetQuestionUi();

  const cidr = random(cidrs);
  state.currentCidr = cidr;

  switch (state.currentMode) {
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

function showHint() {
  if (!state.currentMode) {
    return;
  }

  if (state.currentMode === "commandQuiz" || state.currentMode === "securityQuiz") {
    els.hint.textContent = state.currentHintText;
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
}

function answerUsesPartialMatch() {
  return state.currentMode === "hostsToCidr" || state.currentMode === "hostRequirement";
}

function checkAnswer(answer) {
  const buttons = Array.from(els.answers.querySelectorAll("button"));
  const isCorrect = answerUsesPartialMatch()
    ? typeof answer === "string" && answer.includes(state.currentAnswer)
    : answer == state.currentAnswer;

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
}

function setMode(mode) {
  state.currentMode = mode;
  updateActiveMode(mode);
  showPractice();
  startQuiz();
}

function bindEvents() {
  els.practiceToggle.addEventListener("click", showPractice);
  els.cheatSheetToggle.addEventListener("click", showCheatSheet);
  els.hintBtn.addEventListener("click", showHint);
  els.nextBtn.addEventListener("click", nextQuestion);

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });
}

bindEvents();
updateScoreboard();
showPractice();
