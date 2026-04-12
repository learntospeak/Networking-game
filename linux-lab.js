const TARGET_IP = "192.168.56.102";

const commandMatchQuestions = [
  {
    task: "You want to prove Kali can reach Metasploitable2 before doing anything else.",
    context: `Use the target address ${TARGET_IP}.`,
    options: [
      `ping ${TARGET_IP}`,
      "ls",
      "sudo apt install python3-nmap",
      "nano example.py"
    ],
    answer: `ping ${TARGET_IP}`,
    why: "ping sends ICMP echo requests so you can confirm the target is reachable on the lab network."
  },
  {
    task: "You need to install the Python Nmap package from the package manager.",
    context: "This is the package used by the lab workflow.",
    options: [
      "apt show python3-nmap",
      "touch python_nmap.py",
      "sudo apt install python3-nmap",
      "python ./python_nmap.py"
    ],
    answer: "sudo apt install python3-nmap",
    why: "Use apt install with sudo to install the package system-wide."
  },
  {
    task: "The package is installed and you want to inspect its package details.",
    context: "Check what apt knows about python3-nmap.",
    options: [
      "apt show python3-nmap",
      "tar -xvzf python-nmap.tar.gz",
      "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
      "cd python-nmap-0.7.1"
    ],
    answer: "apt show python3-nmap",
    why: "apt show displays package metadata, version details, and descriptive package information."
  },
  {
    task: "You need to create an empty file called python_nmap.py.",
    context: "You are still in your working directory on Kali.",
    options: [
      "touch python_nmap.py",
      "nano example.py",
      "ls",
      "python ./python_nmap.py"
    ],
    answer: "touch python_nmap.py",
    why: "touch creates an empty file in the current directory."
  },
  {
    task: "You want to download the upstream python-nmap archive and save it as python-nmap.tar.gz.",
    context: "Use wget and the exact output filename from the lab.",
    options: [
      "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
      "tar -xvzf python-nmap.tar.gz",
      "apt show python3-nmap",
      "cd python-nmap-0.7.1"
    ],
    answer: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
    why: "wget downloads the archive and -O saves it with the filename you want in the current directory."
  },
  {
    task: "The download is complete and you want to confirm the archive file is actually present.",
    context: "You just need a directory listing.",
    options: [
      "ls",
      "touch python_nmap.py",
      "apt show python3-nmap",
      `ping ${TARGET_IP}`
    ],
    answer: "ls",
    why: "ls lists the files in the current directory so you can confirm the archive exists."
  },
  {
    task: "You are ready to extract python-nmap.tar.gz.",
    context: "Use the tar flags from the lab sequence.",
    options: [
      "tar -xvzf python-nmap.tar.gz",
      "cd python-nmap-0.7.1",
      "python ./python_nmap.py",
      "touch python_nmap.py"
    ],
    answer: "tar -xvzf python-nmap.tar.gz",
    why: "tar -xvzf extracts a gzip-compressed tar archive and shows the files as they unpack."
  },
  {
    task: "The archive is extracted and you want to enter the package directory.",
    context: "Move into the folder created by the archive.",
    options: [
      "nano example.py",
      "cd python-nmap-0.7.1",
      "ls",
      "apt show python3-nmap"
    ],
    answer: "cd python-nmap-0.7.1",
    why: "cd changes your current working directory into the extracted package folder."
  },
  {
    task: "You want to inspect the example script inside the extracted package directory.",
    context: "Use the simple terminal editor from the workflow.",
    options: [
      "nano example.py",
      "python ./python_nmap.py",
      "sudo apt install python3-nmap",
      `ping ${TARGET_IP}`
    ],
    answer: "nano example.py",
    why: "nano opens the file in a terminal text editor so you can inspect or edit it."
  },
  {
    task: "Your Python scan file is ready and you want to execute it from the current directory.",
    context: "Run the script with Python exactly as shown in the lab.",
    options: [
      "python ./python_nmap.py",
      "touch python_nmap.py",
      "ls",
      "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz"
    ],
    answer: "python ./python_nmap.py",
    why: "python ./python_nmap.py runs the script in the current directory with the Python interpreter."
  }
];

commandMatchQuestions.push(
  {
    task: "Which wget flag lets you save the download using a specific file name?",
    context: "Think about the option used before python-nmap.tar.gz.",
    options: ["-x", "-O", "-f", "-z"],
    answer: "-O",
    hint: "This wget option controls the saved output filename.",
    why: "-O tells wget what local filename to use for the downloaded content."
  },
  {
    task: "Which tar flag means extract?",
    context: "This is the flag that starts unpacking the archive.",
    options: ["-x", "-v", "-z", "-f"],
    answer: "-x",
    hint: "This flag is the actual unpack action.",
    why: "-x tells tar to extract files from the archive."
  },
  {
    task: "Which tar flag enables verbose output while extracting?",
    context: "Use the flag that makes tar show what it is doing.",
    options: ["-f", "-z", "-v", "-x"],
    answer: "-v",
    hint: "Verbose means more visible output.",
    why: "-v enables verbose mode so tar lists files as they are processed."
  },
  {
    task: "Which tar flag tells tar to use gzip decompression?",
    context: "This matters for .tar.gz files.",
    options: ["-z", "-x", "-O", "-f"],
    answer: "-z",
    hint: "Think gzip.",
    why: "-z tells tar it is working with gzip-compressed archive content."
  },
  {
    task: "Which tar flag specifies the archive file name to work on?",
    context: "This flag points tar at the file argument.",
    options: ["-v", "-f", "-x", "-O"],
    answer: "-f",
    hint: "This one is about the file input itself.",
    why: "-f tells tar which archive file name to read from or write to."
  }
);

const workflowQuestions = [
  {
    title: "Workflow Step 1",
    task: "You have just opened your Kali terminal. What command should come first in the lab?",
    context: "Start by checking that the target responds.",
    options: [
      "sudo apt install python3-nmap",
      `ping ${TARGET_IP}`,
      "touch python_nmap.py",
      "ls"
    ],
    answer: `ping ${TARGET_IP}`,
    why: "The first step is reachability. There is no point installing or scripting if the target does not respond."
  },
  {
    title: "Workflow Step 2",
    task: "Connectivity is good. What is the next command in the workflow?",
    context: "Now you can install the required package.",
    options: [
      "apt show python3-nmap",
      "sudo apt install python3-nmap",
      "nano example.py",
      "tar -xvzf python-nmap.tar.gz"
    ],
    answer: "sudo apt install python3-nmap",
    why: "After confirming the lab network works, the next job is installing the Python Nmap package."
  },
  {
    title: "Workflow Step 3",
    task: "The install completed. Which command should you use next?",
    context: "Check the package details after installation.",
    options: [
      "python ./python_nmap.py",
      "apt show python3-nmap",
      "cd python-nmap-0.7.1",
      "touch python_nmap.py"
    ],
    answer: "apt show python3-nmap",
    why: "apt show is the check step in this workflow, confirming the package information after installation."
  },
  {
    title: "Workflow Step 4",
    task: "You have confirmed the package. What is the next lab action?",
    context: "Create your own script file before pulling other resources.",
    options: [
      "touch python_nmap.py",
      "ls",
      "nano example.py",
      `ping ${TARGET_IP}`
    ],
    answer: "touch python_nmap.py",
    why: "The workflow creates the Python script file before downloading the separate package archive."
  },
  {
    title: "Workflow Step 5",
    task: "The empty script file exists. What should you do next?",
    context: "Bring down the upstream python-nmap archive.",
    options: [
      "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
      "apt show python3-nmap",
      "python ./python_nmap.py",
      "cd python-nmap-0.7.1"
    ],
    answer: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
    why: "The next step is downloading the archive so you can inspect the package contents and examples."
  },
  {
    title: "Workflow Step 6",
    task: "You have downloaded python-nmap.tar.gz. What do you do next?",
    context: "Confirm the file is actually in the directory before extracting it.",
    options: [
      "ls",
      "tar -xvzf python-nmap.tar.gz",
      "touch python_nmap.py",
      "nano example.py"
    ],
    answer: "ls",
    why: "The workflow checks that the file exists before unpacking it."
  },
  {
    title: "Workflow Step 7",
    task: "The archive is visible in the directory listing. What is the next command?",
    context: "Now unpack the tar.gz file.",
    options: [
      "tar -xvzf python-nmap.tar.gz",
      "cd python-nmap-0.7.1",
      "python ./python_nmap.py",
      `ping ${TARGET_IP}`
    ],
    answer: "tar -xvzf python-nmap.tar.gz",
    why: "This is the extraction step that unpacks the archive into a working folder."
  },
  {
    title: "Workflow Step 8",
    task: "The extraction has finished. What command moves you into the unpacked folder?",
    context: "Use the directory name from the archive.",
    options: [
      "ls",
      "cd python-nmap-0.7.1",
      "apt show python3-nmap",
      "touch python_nmap.py"
    ],
    answer: "cd python-nmap-0.7.1",
    why: "You need to enter the extracted folder before you can open its example file."
  },
  {
    title: "Workflow Step 9",
    task: "You are inside python-nmap-0.7.1. What is the next useful command?",
    context: "Inspect the sample script from the package.",
    options: [
      "nano example.py",
      "python ./python_nmap.py",
      "sudo apt install python3-nmap",
      "ls"
    ],
    answer: "nano example.py",
    why: "The workflow opens example.py so you can inspect how the package is used."
  },
  {
    title: "Workflow Step 10",
    task: "You have finished preparing the environment and your script is ready. What comes last?",
    context: "Run your Python scan file.",
    options: [
      "python ./python_nmap.py",
      "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
      "apt show python3-nmap",
      "cd python-nmap-0.7.1"
    ],
    answer: "python ./python_nmap.py",
    why: "The final step is running the Python script so it can perform the Nmap-based scan."
  }
];

const builderTasks = [
  {
    task: "Build the command to test connectivity from Kali to Metasploitable2.",
    context: `Use the target IP ${TARGET_IP}.`,
    tokens: ["ping", TARGET_IP],
    answer: `ping ${TARGET_IP}`,
    why: "ping is the fastest way to prove the target is reachable before continuing."
  },
  {
    task: "Build the command to install python3-nmap.",
    context: "Use the package manager with elevated privileges.",
    tokens: ["sudo", "apt", "install", "python3-nmap"],
    answer: "sudo apt install python3-nmap",
    why: "Use sudo apt install when you need to add the package through the system package manager."
  },
  {
    task: "Build the command to inspect the package details after install.",
    context: "Show the apt metadata for python3-nmap.",
    tokens: ["apt", "show", "python3-nmap"],
    answer: "apt show python3-nmap",
    why: "apt show prints package details, which makes it a good verification step."
  },
  {
    task: "Build the command to create the script file.",
    context: "The file should be named python_nmap.py.",
    tokens: ["touch", "python_nmap.py"],
    answer: "touch python_nmap.py",
    why: "touch creates the empty Python file you will later fill with scan code."
  },
  {
    task: "Build the command to download the upstream python-nmap archive.",
    context: "Save it locally as python-nmap.tar.gz.",
    tokens: ["wget", "https://xael.org/pages/python-nmap-0.7.1.tar.gz", "-O", "python-nmap.tar.gz"],
    answer: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz",
    why: "wget retrieves the file and -O writes it to the desired output filename."
  },
  {
    task: "Build the command to extract the downloaded archive.",
    context: "Use tar with the gzip extraction flags.",
    tokens: ["tar", "-xvzf", "python-nmap.tar.gz"],
    answer: "tar -xvzf python-nmap.tar.gz",
    why: "This tar command unpacks the archive and prints the extracted contents."
  },
  {
    task: "Build the command to enter the extracted package directory.",
    context: "Use the exact folder name from the workflow.",
    tokens: ["cd", "python-nmap-0.7.1"],
    answer: "cd python-nmap-0.7.1",
    why: "cd changes your working directory so you can inspect files inside the extracted package."
  },
  {
    task: "Build the command to run your finished Python scan script.",
    context: "Execute the script from the current directory.",
    tokens: ["python", "./python_nmap.py"],
    answer: "python ./python_nmap.py",
    why: "python followed by the script path runs the Python Nmap lab file."
  }
];

const workflowReference = [
  { label: "Connectivity check", command: `ping ${TARGET_IP}` },
  { label: "Install package", command: "sudo apt install python3-nmap" },
  { label: "Inspect package", command: "apt show python3-nmap" },
  { label: "Create script file", command: "touch python_nmap.py" },
  { label: "Download archive", command: "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz" },
  { label: "List files", command: "ls" },
  { label: "Extract archive", command: "tar -xvzf python-nmap.tar.gz" },
  { label: "Enter directory", command: "cd python-nmap-0.7.1" },
  { label: "Open example file", command: "nano example.py" },
  { label: "Run the script", command: "python ./python_nmap.py" }
];

const flagQuestions = [
  {
    task: "What does `-O` do in `wget`?",
    context: "Think about the downloaded file name.",
    options: [
      "Save the download using a specific output filename",
      "Open the file after download",
      "Overwrite the remote server",
      "Show package information"
    ],
    answer: "Save the download using a specific output filename",
    hint: "This option controls the name of the saved local file.",
    why: "-O lets wget save the download under the exact filename you provide."
  },
  {
    task: "Which wget flag lets you save the archive as `python-nmap.tar.gz`?",
    context: "You want to choose the output filename yourself.",
    options: ["-x", "-f", "-O", "-z"],
    answer: "-O",
    hint: "This option is used right before the desired filename.",
    why: "-O is the wget option used to choose the saved filename."
  },
  {
    task: "Which tar flag extracts files from an archive?",
    context: "This is the core extraction action.",
    options: ["-x", "-v", "-z", "-f"],
    answer: "-x",
    hint: "This is the action flag, not the display flag.",
    why: "-x tells tar to extract archive contents."
  },
  {
    task: "Which tar flag enables verbose output?",
    context: "You want tar to show each file as it works.",
    options: ["-f", "-v", "-O", "-x"],
    answer: "-v",
    hint: "Verbose means more output on screen.",
    why: "-v enables verbose mode so you can see what tar is processing."
  },
  {
    task: "Which tar flag tells tar to handle gzip compression?",
    context: "This matters for `.tar.gz` archives.",
    options: ["-z", "-x", "-f", "-O"],
    answer: "-z",
    hint: "This one maps to gzip.",
    why: "-z tells tar to apply gzip decompression when reading the archive."
  },
  {
    task: "Which tar flag specifies the archive file name?",
    context: "This tells tar which file to operate on.",
    options: ["-x", "-v", "-f", "-O"],
    answer: "-f",
    hint: "This one is about the archive file argument.",
    why: "-f is used to specify the archive file name."
  },
  {
    task: "In `tar -xvzf python-nmap.tar.gz`, which flag is responsible for the archive filename argument?",
    context: "Think about the flag that expects a file name after it.",
    options: ["-f", "-x", "-z", "-v"],
    answer: "-f",
    hint: "This flag pairs with the archive filename.",
    why: "-f tells tar that the next argument is the archive file to read."
  },
  {
    task: "You want tar to unpack `python-nmap.tar.gz` and show progress. Which flag pair matters most for those goals?",
    context: "One flag extracts and one shows output.",
    options: ["-x and -v", "-f and -O", "-z and -O", "-v and -O"],
    answer: "-x and -v",
    hint: "One performs extraction, the other displays progress.",
    why: "-x performs the extraction and -v makes the process visible in the terminal."
  }
];

const defaultHints = {
  [`ping ${TARGET_IP}`]: "This command sends a basic reachability test to the target.",
  "sudo apt install python3-nmap": "This command installs a package through apt.",
  "apt show python3-nmap": "This displays package details instead of installing anything.",
  "touch python_nmap.py": "This command creates an empty file.",
  "wget https://xael.org/pages/python-nmap-0.7.1.tar.gz -O python-nmap.tar.gz": "This downloads a file from a URL and saves it locally.",
  "ls": "This shows what files are in the current directory.",
  "tar -xvzf python-nmap.tar.gz": "This command extracts a .tar.gz archive.",
  "cd python-nmap-0.7.1": "This changes into the extracted folder.",
  "nano example.py": "This opens a file in a terminal text editor.",
  "python ./python_nmap.py": "This runs the script with the Python interpreter.",
  "-O": "This wget option controls the saved output filename.",
  "-x": "This tar flag starts the extraction action.",
  "-v": "This tar flag makes tar show more output.",
  "-z": "This tar flag tells tar to handle gzip compression.",
  "-f": "This tar flag points tar at the archive file name."
};

const els = {
  modeTabs: Array.from(document.querySelectorAll(".mode-tab-btn")),
  modeBadge: document.getElementById("modeBadge"),
  progressBadge: document.getElementById("progressBadge"),
  stepMiniBadge: document.getElementById("stepMiniBadge"),
  taskEyebrow: document.getElementById("taskEyebrow"),
  taskTitle: document.getElementById("taskTitle"),
  taskPrompt: document.getElementById("taskPrompt"),
  taskContext: document.getElementById("taskContext"),
  hintText: document.getElementById("hintText"),
  choicePanel: document.getElementById("choicePanel"),
  choiceOptions: document.getElementById("choiceOptions"),
  builderPanel: document.getElementById("builderPanel"),
  builderSequence: document.getElementById("builderSequence"),
  builderTokens: document.getElementById("builderTokens"),
  hintBtn: document.getElementById("hintBtn"),
  checkBuilderBtn: document.getElementById("checkBuilderBtn"),
  resetBuilderBtn: document.getElementById("resetBuilderBtn"),
  feedbackBadge: document.getElementById("feedbackBadge"),
  feedbackText: document.getElementById("feedbackText"),
  whyText: document.getElementById("whyText"),
  nextTaskBtn: document.getElementById("nextTaskBtn"),
  resetModeBtn: document.getElementById("resetModeBtn"),
  workflowReference: document.getElementById("workflowReference")
};

const state = {
  mode: "match",
  matchIndex: 0,
  matchOrder: shuffle(commandMatchQuestions.map((_, index) => index)),
  workflowIndex: 0,
  builderIndex: 0,
  flagIndex: 0,
  builderTokens: [],
  builderSelection: [],
  locked: false
};

function shuffle(items) {
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getModeLabel(mode) {
  if (mode === "workflow") return "Workflow Mode";
  if (mode === "builder") return "Command Builder";
  if (mode === "flag") return "Flag Match";
  return "Command Match";
}

function getCurrentMatchQuestion() {
  return commandMatchQuestions[state.matchOrder[state.matchIndex]];
}

function getCurrentWorkflowQuestion() {
  return workflowQuestions[state.workflowIndex];
}

function getCurrentBuilderTask() {
  return builderTasks[state.builderIndex];
}

function getCurrentFlagQuestion() {
  return flagQuestions[state.flagIndex];
}

function getCurrentItem() {
  if (state.mode === "workflow") return getCurrentWorkflowQuestion();
  if (state.mode === "builder") return getCurrentBuilderTask();
  if (state.mode === "flag") return getCurrentFlagQuestion();
  return getCurrentMatchQuestion();
}

function getHintForItem(item) {
  return item.hint || defaultHints[item.answer] || "Think about what the command is actually doing in the lab.";
}

function clearHint() {
  els.hintText.textContent = "";
}

function showHint() {
  const item = getCurrentItem();
  els.hintText.textContent = getHintForItem(item);
}

function setFeedback(type, text, why) {
  els.feedbackBadge.className = `feedback-badge ${type}`;
  els.feedbackBadge.textContent =
    type === "good" ? "Correct" : type === "bad" ? "Incorrect" : "Awaiting answer";
  els.feedbackText.textContent = text;
  els.whyText.textContent = why;
}

function resetFeedback() {
  setFeedback(
    "idle",
    "Pick the next command and the lab will explain why it fits.",
    "Practical command work is about choosing the next useful action, not memorizing definitions."
  );
}

function updateModeTabs() {
  els.modeTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
}

function renderWorkflowReference() {
  els.workflowReference.innerHTML = "";

  workflowReference.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.toggle("active", state.mode === "workflow" && index === state.workflowIndex);
    li.innerHTML = `<strong>${item.label}</strong><code>${item.command}</code>`;
    els.workflowReference.appendChild(li);
  });
}

function renderChoiceMode(question, eyebrow, title, progressText, badgeText) {
  state.locked = false;
  els.choicePanel.hidden = false;
  els.builderPanel.hidden = true;
  els.choiceOptions.innerHTML = "";
  els.nextTaskBtn.hidden = true;
  clearHint();

  els.taskEyebrow.textContent = eyebrow;
  els.taskTitle.textContent = title;
  els.taskPrompt.textContent = question.task;
  els.taskContext.textContent = question.context;
  els.progressBadge.textContent = progressText;
  els.stepMiniBadge.textContent = badgeText;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-option";
    button.textContent = option;
    button.addEventListener("click", () => handleChoiceAnswer(option, question, button));
    els.choiceOptions.appendChild(button);
  });
}

function handleChoiceAnswer(selected, question, clickedButton) {
  if (state.locked) return;

  state.locked = true;
  const buttons = Array.from(els.choiceOptions.querySelectorAll("button"));
  const correct = selected === question.answer;

  buttons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === question.answer) {
      button.classList.add("correct-btn");
    }
  });

  if (!correct) {
    clickedButton.classList.add("wrong-btn");
    setFeedback("bad", `Not quite. The correct command is: ${question.answer}`, question.why);
  } else {
    setFeedback("good", `Correct. ${question.answer}`, question.why);
  }

  els.nextTaskBtn.hidden = false;
}

function renderBuilderMode(task) {
  state.locked = false;
  state.builderSelection = [];
  state.builderTokens = shuffle(task.tokens);

  els.choicePanel.hidden = true;
  els.builderPanel.hidden = false;
  els.nextTaskBtn.hidden = true;
  clearHint();

  els.taskEyebrow.textContent = "Command Builder";
  els.taskTitle.textContent = "Build the full command";
  els.taskPrompt.textContent = task.task;
  els.taskContext.textContent = task.context;
  els.progressBadge.textContent = `Task ${state.builderIndex + 1} of ${builderTasks.length}`;
  els.stepMiniBadge.textContent = `Build ${state.builderIndex + 1}`;

  renderBuilderSequence();
  renderBuilderTokens();
}

function renderBuilderSequence() {
  els.builderSequence.innerHTML = "";

  if (state.builderSelection.length === 0) {
    const placeholder = document.createElement("span");
    placeholder.className = "builder-placeholder";
    placeholder.textContent = "(select tokens below)";
    els.builderSequence.appendChild(placeholder);
    return;
  }

  state.builderSelection.forEach((token, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sequence-token";
    button.textContent = token;
    button.addEventListener("click", () => removeBuilderToken(index));
    els.builderSequence.appendChild(button);
  });
}

function renderBuilderTokens() {
  els.builderTokens.innerHTML = "";

  state.builderTokens.forEach((token, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "token-btn";
    button.textContent = token;
    button.addEventListener("click", () => addBuilderToken(index));
    els.builderTokens.appendChild(button);
  });
}

function addBuilderToken(index) {
  if (state.locked) return;
  const [token] = state.builderTokens.splice(index, 1);
  state.builderSelection.push(token);
  renderBuilderSequence();
  renderBuilderTokens();
}

function removeBuilderToken(index) {
  if (state.locked) return;
  const [token] = state.builderSelection.splice(index, 1);
  state.builderTokens.push(token);
  renderBuilderSequence();
  renderBuilderTokens();
}

function checkBuilderAnswer() {
  if (state.locked) return;

  const task = getCurrentBuilderTask();
  const builtCommand = state.builderSelection.join(" ");

  if (!builtCommand) {
    setFeedback("bad", "Add tokens to build the command first.", "Click tokens in the bank to assemble the command in order.");
    return;
  }

  state.locked = true;

  if (builtCommand === task.answer) {
    setFeedback("good", `Correct. ${task.answer}`, task.why);
  } else {
    setFeedback("bad", `Not quite. The correct command is: ${task.answer}`, task.why);
  }

  els.nextTaskBtn.hidden = false;
}

function resetBuilder() {
  if (state.mode !== "builder") return;
  renderBuilderMode(getCurrentBuilderTask());
  resetFeedback();
}

function renderCurrentMode() {
  updateModeTabs();
  renderWorkflowReference();
  els.modeBadge.textContent = getModeLabel(state.mode);
  resetFeedback();

  if (state.mode === "workflow") {
    renderChoiceMode(
      getCurrentWorkflowQuestion(),
      "Workflow Mode",
      getCurrentWorkflowQuestion().title,
      `Step ${state.workflowIndex + 1} of ${workflowQuestions.length}`,
      `Lab ${state.workflowIndex + 1}`
    );
    return;
  }

  if (state.mode === "builder") {
    renderBuilderMode(getCurrentBuilderTask());
    return;
  }

  if (state.mode === "flag") {
    renderChoiceMode(
      getCurrentFlagQuestion(),
      "Flag Match",
      "Match the flag to the job",
      `Question ${state.flagIndex + 1} of ${flagQuestions.length}`,
      `Flag ${state.flagIndex + 1}`
    );
    return;
  }

  renderChoiceMode(
    getCurrentMatchQuestion(),
    "Command Match",
    "Pick the command that fits the task",
    `Question ${state.matchIndex + 1} of ${commandMatchQuestions.length}`,
    `Round ${state.matchIndex + 1}`
  );
}

function advanceMode() {
  if (state.mode === "workflow") {
    state.workflowIndex = (state.workflowIndex + 1) % workflowQuestions.length;
    renderCurrentMode();
    return;
  }

  if (state.mode === "builder") {
    state.builderIndex = (state.builderIndex + 1) % builderTasks.length;
    renderCurrentMode();
    return;
  }

  if (state.mode === "flag") {
    state.flagIndex = (state.flagIndex + 1) % flagQuestions.length;
    renderCurrentMode();
    return;
  }

  state.matchIndex += 1;

  if (state.matchIndex >= commandMatchQuestions.length) {
    state.matchOrder = shuffle(commandMatchQuestions.map((_, index) => index));
    state.matchIndex = 0;
  }

  renderCurrentMode();
}

function resetCurrentMode() {
  if (state.mode === "workflow") {
    state.workflowIndex = 0;
  } else if (state.mode === "builder") {
    state.builderIndex = 0;
  } else if (state.mode === "flag") {
    state.flagIndex = 0;
  } else {
    state.matchIndex = 0;
    state.matchOrder = shuffle(commandMatchQuestions.map((_, index) => index));
  }

  renderCurrentMode();
}

function switchMode(mode) {
  state.mode = mode;
  renderCurrentMode();
}

function bindEvents() {
  els.modeTabs.forEach((button) => {
    button.addEventListener("click", () => switchMode(button.dataset.mode));
  });

  els.nextTaskBtn.addEventListener("click", advanceMode);
  els.resetModeBtn.addEventListener("click", resetCurrentMode);
  els.hintBtn.addEventListener("click", showHint);
  els.checkBuilderBtn.addEventListener("click", checkBuilderAnswer);
  els.resetBuilderBtn.addEventListener("click", resetBuilder);
}

bindEvents();
renderCurrentMode();
