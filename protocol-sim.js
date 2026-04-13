const scenarios = [
  {
    id: "arp-local",
    title: "ARP on Same Subnet",
    tag: "ARP | Same LAN",
    subtitle: "Resolve the destination MAC on the local network.",
    summary:
      "When the destination is on the same subnet, the sender ARPs for the destination host, learns its MAC address, and then sends the frame directly on the LAN.",
    devices: [
      { id: "pc", type: "PC", label: "User PC", meta: "192.168.1.10 /24" },
      { id: "switch", type: "Switch", label: "Access Switch", meta: "Local LAN" },
      { id: "host", type: "Host", label: "Destination Host", meta: "192.168.1.20 /24" }
    ],
    steps: [
      {
        flow: "ARP request broadcast on the local LAN",
        prompt: "PC 192.168.1.10 wants to reach 192.168.1.20. What happens first?",
        path: ["pc", "switch", "host"],
        options: [
          {
            label: "Send an ARP request for 192.168.1.20",
            correct: true,
            why: "On the same subnet, the sender needs the destination host MAC address, so it ARPs for the destination host directly."
          },
          {
            label: "Send an ARP request for the default gateway",
            correct: false,
            why: "The default gateway is only needed when the destination is on a different network."
          },
          {
            label: "Send HTTPS traffic immediately",
            correct: false,
            why: "The PC still needs a Layer 2 destination MAC before the frame can be sent on Ethernet."
          }
        ]
      },
      {
        flow: "Destination host sends an ARP reply back to the PC",
        prompt: "The ARP request reaches the correct host. What is the next action?",
        path: ["host", "switch", "pc"],
        options: [
          {
            label: "Destination host replies with its MAC address",
            correct: true,
            why: "The host that owns the target IP responds with an ARP reply that includes its MAC address."
          },
          {
            label: "The router replies with its MAC address",
            correct: false,
            why: "The router is not involved when both devices are on the same subnet."
          },
          {
            label: "The DNS server returns an IP address",
            correct: false,
            why: "DNS is for resolving names to IPs, not for resolving IPs to MAC addresses."
          }
        ]
      },
      {
        flow: "Frame sent directly to the local destination host",
        prompt: "The PC now knows the destination MAC. What should happen next?",
        path: ["pc", "switch", "host"],
        options: [
          {
            label: "Send the frame directly to the destination host",
            correct: true,
            why: "Now that the destination MAC is known, the PC can send the local Ethernet frame directly toward the host."
          },
          {
            label: "Send the packet to the default gateway first",
            correct: false,
            why: "The default gateway is not needed for same-subnet delivery."
          },
          {
            label: "Start another ARP for the router",
            correct: false,
            why: "The PC already has the correct Layer 2 destination for this local conversation."
          }
        ]
      }
    ]
  },
  {
    id: "arp-gateway",
    title: "ARP for the Default Gateway",
    tag: "ARP | Different Network",
    subtitle: "Send to the gateway when the destination is remote.",
    summary:
      "When the destination IP is on a different subnet, the PC does not ARP for the remote host. It ARPs for the default gateway, then forwards the packet to the router.",
    devices: [
      { id: "pc", type: "PC", label: "User PC", meta: "192.168.1.10 /24" },
      { id: "switch", type: "Switch", label: "Access Switch", meta: "Local LAN" },
      { id: "router", type: "Router", label: "Default Gateway", meta: "192.168.1.1" },
      { id: "server", type: "Server", label: "Remote Server", meta: "10.0.0.50 /24" }
    ],
    steps: [
      {
        flow: "Remote destination detected, so the PC needs the gateway MAC",
        prompt: "The PC wants to reach 10.0.0.50 on another subnet. What happens first?",
        path: ["pc", "switch", "router"],
        options: [
          {
            label: "Send an ARP request for the default gateway",
            correct: true,
            why: "For remote traffic, the next hop is the default gateway, so the PC resolves the router MAC on the local LAN."
          },
          {
            label: "Send an ARP request for 10.0.0.50",
            correct: false,
            why: "ARP does not cross routers. A remote host MAC cannot be resolved directly from another subnet."
          },
          {
            label: "Send the packet straight to the switch",
            correct: false,
            why: "The switch forwards frames, but the PC still needs a valid Layer 2 destination first."
          }
        ]
      },
      {
        flow: "Default gateway replies with its MAC address",
        prompt: "Who should answer the ARP request on the local network?",
        path: ["router", "switch", "pc"],
        options: [
          {
            label: "The default gateway replies with its MAC address",
            correct: true,
            why: "The router interface on the local LAN owns the gateway IP, so it answers the ARP request."
          },
          {
            label: "The remote server replies with its MAC address",
            correct: false,
            why: "The remote server is on a different network and will not answer a local ARP broadcast."
          },
          {
            label: "The DNS server replies with the gateway MAC",
            correct: false,
            why: "DNS resolves names to IP addresses. It does not participate in ARP."
          }
        ]
      },
      {
        flow: "PC sends the packet to the gateway for routing",
        prompt: "The PC now knows the gateway MAC. What is the correct next action?",
        path: ["pc", "switch", "router", "server"],
        options: [
          {
            label: "Send the frame to the gateway while keeping the remote IP as the destination IP",
            correct: true,
            why: "Layer 2 goes to the router MAC, but Layer 3 still targets the remote host IP so the router can forward it."
          },
          {
            label: "Send the frame directly to the remote server MAC",
            correct: false,
            why: "The PC does not know a remote host MAC, and that MAC is not reachable across the routed boundary."
          },
          {
            label: "Discard the packet because the networks are different",
            correct: false,
            why: "That is exactly what the default gateway is for: forwarding off-net traffic."
          }
        ]
      }
    ]
  },
  {
    id: "dns-https",
    title: "DNS Lookup Before HTTPS",
    tag: "DNS + HTTPS",
    subtitle: "Resolve the name before the secure web session starts.",
    summary:
      "A host must resolve the website name to an IP address first. After that, it can start secure web communication with HTTPS.",
    devices: [
      { id: "pc", type: "PC", label: "User PC", meta: "Wants https://learn.lab" },
      { id: "switch", type: "Switch", label: "Access Switch", meta: "Local LAN" },
      { id: "router", type: "Router", label: "Default Gateway", meta: "Path to services" },
      { id: "dns", type: "Server", label: "DNS Server", meta: "Resolves names to IPs" },
      { id: "web", type: "Server", label: "Web Server", meta: "HTTPS destination" }
    ],
    steps: [
      {
        flow: "User enters a website name, so the host needs a DNS answer first",
        prompt: "A user types https://learn.lab. What should happen before HTTPS traffic starts?",
        path: ["pc", "switch", "router", "dns"],
        options: [
          {
            label: "Send a DNS query to resolve the website name to an IP address",
            correct: true,
            why: "The host needs the destination IP before it can build the web session to the correct server."
          },
          {
            label: "Start the HTTPS session immediately",
            correct: false,
            why: "Without the destination IP, the PC does not yet know where to send the secure web request."
          },
          {
            label: "Use ARP for the public website directly",
            correct: false,
            why: "ARP is for resolving local MAC addresses, not for resolving internet names."
          }
        ]
      },
      {
        flow: "DNS server returns the IP address for the website",
        prompt: "The DNS server receives the query. What is the correct next action?",
        path: ["dns", "router", "switch", "pc"],
        options: [
          {
            label: "Return the web server IP address to the PC",
            correct: true,
            why: "DNS answers with the IP information the client needs so communication can continue."
          },
          {
            label: "Return the web server MAC address to the PC",
            correct: false,
            why: "DNS does not supply MAC addresses. That is handled locally with ARP when needed."
          },
          {
            label: "Open the web page automatically",
            correct: false,
            why: "DNS only resolves the name. The browser still has to start the actual web connection."
          }
        ]
      },
      {
        flow: "HTTPS session starts after name resolution succeeds",
        prompt: "The PC now knows the web server IP. What is the best next step?",
        path: ["pc", "switch", "router", "web"],
        options: [
          {
            label: "Start the HTTPS connection to the resolved web server",
            correct: true,
            why: "Once DNS resolution is complete, the client can begin secure web communication with HTTPS."
          },
          {
            label: "Use Telnet for the website session",
            correct: false,
            why: "Telnet is for remote terminal access, not secure web browsing."
          },
          {
            label: "Send an FTP upload instead",
            correct: false,
            why: "FTP is for file transfer, not loading a secure webpage."
          }
        ]
      }
    ]
  },
  {
    id: "ssh-telnet",
    title: "Choose SSH Instead of Telnet",
    tag: "Remote Access",
    subtitle: "Pick the secure protocol for device administration.",
    summary:
      "SSH is the correct choice for remote administration because it encrypts the login and the management session. Telnet leaves the traffic readable on the network.",
    devices: [
      { id: "pc", type: "PC", label: "Admin PC", meta: "Remote management source" },
      { id: "switch", type: "Switch", label: "Access Switch", meta: "Network path" },
      { id: "router", type: "Router", label: "Managed Router", meta: "Target device" }
    ],
    steps: [
      {
        flow: "Administrator needs a remote management session",
        prompt: "You need to log into a router remotely. Which protocol should you choose?",
        path: ["pc", "switch", "router"],
        options: [
          {
            label: "SSH",
            correct: true,
            why: "SSH is built for secure remote administration and protects the session with encryption."
          },
          {
            label: "Telnet",
            correct: false,
            why: "Telnet works for remote access, but it is insecure because the traffic is not encrypted."
          },
          {
            label: "ARP",
            correct: false,
            why: "ARP resolves MAC addresses on a LAN. It is not a remote login protocol."
          }
        ]
      },
      {
        flow: "Credentials and commands should stay protected in transit",
        prompt: "Why is SSH the better answer here?",
        path: ["pc", "switch", "router"],
        options: [
          {
            label: "It encrypts credentials and session data",
            correct: true,
            why: "SSH protects both the login information and the management commands from easy interception."
          },
          {
            label: "It is the file transfer protocol",
            correct: false,
            why: "FTP is associated with file transfer. SSH is for secure remote administration."
          },
          {
            label: "It resolves hostnames before login",
            correct: false,
            why: "Name resolution is handled by DNS, not by SSH."
          }
        ]
      },
      {
        flow: "Insecure remote access leaves data exposed",
        prompt: "Why is Telnet risky on untrusted networks?",
        path: ["pc", "switch", "router"],
        options: [
          {
            label: "Credentials and commands can be read in plain text",
            correct: true,
            why: "Telnet does not encrypt the session, so packet captures can expose the login and remote commands."
          },
          {
            label: "It does not use IP addressing",
            correct: false,
            why: "Telnet does use IP. The issue is lack of encryption, not lack of addressing."
          },
          {
            label: "It only works on the same subnet",
            correct: false,
            why: "Telnet can cross networks. Its weakness is security, not reachability."
          }
        ]
      }
    ]
  }
];

const useCases = [
  {
    prompt: "You need to transfer files between a client and a server.",
    options: ["FTP", "DNS", "ARP"],
    answer: "FTP",
    why: "FTP is used for file transfer between systems."
  },
  {
    prompt: "You need secure remote login to a network device.",
    options: ["SSH", "Telnet", "ICMP"],
    answer: "SSH",
    why: "SSH is the secure choice for remote administration."
  },
  {
    prompt: "You want to check whether a device is reachable on the network.",
    options: ["ICMP / ping", "FTP", "HTTPS"],
    answer: "ICMP / ping",
    why: "Ping uses ICMP to test reachability and response."
  },
  {
    prompt: "A user wants to open a webpage securely in a browser.",
    options: ["HTTPS", "HTTP", "ARP"],
    answer: "HTTPS",
    why: "HTTPS protects the web session with encryption."
  }
];

const els = {
  scenarioSelector: document.getElementById("scenarioSelector"),
  scenarioTag: document.getElementById("scenarioTag"),
  scenarioTitle: document.getElementById("scenarioTitle"),
  scenarioProgress: document.getElementById("scenarioProgress"),
  mobileScenarioTitle: document.getElementById("mobileScenarioTitle"),
  mobileScenarioProgress: document.getElementById("mobileScenarioProgress"),
  mobileStatusEcho: document.getElementById("mobileStatusEcho"),
  mobileResultEcho: document.getElementById("mobileResultEcho"),
  networkMap: document.getElementById("networkMap"),
  flowLabel: document.getElementById("flowLabel"),
  stepPrompt: document.getElementById("stepPrompt"),
  stepOptions: document.getElementById("stepOptions"),
  nextStepBtn: document.getElementById("nextStepBtn"),
  resetScenarioBtn: document.getElementById("resetScenarioBtn"),
  statusBadge: document.getElementById("statusBadge"),
  resultText: document.getElementById("resultText"),
  whyText: document.getElementById("whyText"),
  summaryText: document.getElementById("summaryText"),
  useCaseGrid: document.getElementById("useCaseGrid")
};

const state = {
  scenarioId: scenarios[0].id,
  stepIndex: 0,
  resolved: false,
  complete: false
};

function getScenario() {
  return scenarios.find((scenario) => scenario.id === state.scenarioId);
}

function setStatus(type, text) {
  els.statusBadge.className = `status-badge ${type}`;
  els.statusBadge.textContent = text;
  els.mobileStatusEcho.className = `simulation-mobile-status ${type}`;
  els.mobileStatusEcho.textContent = text;
}

function renderScenarioButtons() {
  els.scenarioSelector.innerHTML = "";

  scenarios.forEach((scenario) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-selector-btn";
    button.dataset.scenarioId = scenario.id;
    button.innerHTML = `
      <span class="selector-title">${scenario.title}</span>
      <span class="selector-subtitle">${scenario.subtitle}</span>
    `;
    button.addEventListener("click", () => selectScenario(scenario.id));
    els.scenarioSelector.appendChild(button);
  });
}

function updateScenarioSelectorState() {
  const buttons = Array.from(els.scenarioSelector.querySelectorAll("button"));

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scenarioId === state.scenarioId);
  });
}

function buildPathSegments(path) {
  const segments = [];

  for (let i = 0; i < path.length - 1; i += 1) {
    segments.push(`${path[i]}->${path[i + 1]}`);
  }

  return segments;
}

function renderNetworkMap() {
  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];
  const activeIds = new Set(step.path);
  const activeSegments = new Set(buildPathSegments(step.path));

  els.networkMap.innerHTML = "";

  scenario.devices.forEach((device, index) => {
    const deviceCard = document.createElement("div");
    deviceCard.className = `device-card${activeIds.has(device.id) ? " active" : ""}`;
    deviceCard.innerHTML = `
      <div class="device-type">${device.type}</div>
      <p class="device-name">${device.label}</p>
      <p class="device-meta">${device.meta}</p>
    `;
    els.networkMap.appendChild(deviceCard);

    if (index < scenario.devices.length - 1) {
      const nextDevice = scenario.devices[index + 1];
      const link = document.createElement("div");
      const isActive = activeSegments.has(`${device.id}->${nextDevice.id}`) || activeSegments.has(`${nextDevice.id}->${device.id}`);
      link.className = `network-link${isActive ? " active" : ""}`;
      link.textContent = ">";
      els.networkMap.appendChild(link);
    }
  });
}

function disableStepButtons() {
  Array.from(els.stepOptions.querySelectorAll("button")).forEach((button) => {
    button.disabled = true;
  });
}

function renderStepOptions() {
  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];

  els.stepOptions.innerHTML = "";

  step.options.forEach((option, optionIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "step-option";
    button.textContent = option.label;
    button.addEventListener("click", () => handleStepChoice(optionIndex, button));
    els.stepOptions.appendChild(button);
  });
}

function renderScenario() {
  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];

  updateScenarioSelectorState();
  els.scenarioTag.textContent = scenario.tag;
  els.scenarioTitle.textContent = scenario.title;
  els.scenarioProgress.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.mobileScenarioTitle.textContent = scenario.title;
  els.mobileScenarioProgress.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.flowLabel.textContent = step.flow;
  els.stepPrompt.textContent = step.prompt;
  els.summaryText.textContent = scenario.summary;
  els.resultText.textContent = "Pick the action that matches the real network behavior.";
  els.whyText.textContent = "Correct and incorrect choices will explain what should happen next and why.";
  els.mobileResultEcho.textContent = "Pick the next action. Feedback will stay visible here on mobile.";
  setStatus("idle", "Awaiting selection");
  els.nextStepBtn.hidden = true;
  els.nextStepBtn.textContent = "Next Step";
  state.resolved = false;
  state.complete = false;

  renderNetworkMap();
  renderStepOptions();
}

function finishScenario() {
  const scenario = getScenario();

  state.complete = true;
  state.resolved = true;
  setStatus("good", "Scenario complete");
  els.resultText.textContent = `${scenario.title} complete. You walked the traffic in the correct order.`;
  els.whyText.textContent = scenario.summary;
  els.mobileResultEcho.textContent = scenario.summary;
  els.nextStepBtn.hidden = true;
}

function handleStepChoice(optionIndex, clickedButton) {
  if (state.resolved) return;

  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];
  const option = step.options[optionIndex];

  if (option.correct) {
    state.resolved = true;
    clickedButton.classList.add("correct-btn");
    disableStepButtons();
    setStatus("good", "Correct next action");
    els.resultText.textContent = "That matches the protocol flow.";
    els.whyText.textContent = option.why;
    els.mobileResultEcho.textContent = option.why;

    if (state.stepIndex < scenario.steps.length - 1) {
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = "Next Step";
    } else {
      finishScenario();
    }

    return;
  }

  clickedButton.classList.add("wrong-btn");
  clickedButton.disabled = true;
  setStatus("bad", "Try again");
  els.resultText.textContent = "That is not the right next action for this step.";
  els.whyText.textContent = option.why;
  els.mobileResultEcho.textContent = option.why;
}

function goToNextStep() {
  const scenario = getScenario();

  if (!state.resolved || state.complete) return;

  if (state.stepIndex < scenario.steps.length - 1) {
    state.stepIndex += 1;
    renderScenario();
  }
}

function selectScenario(scenarioId) {
  state.scenarioId = scenarioId;
  state.stepIndex = 0;
  renderScenario();
}

function resetScenario() {
  state.stepIndex = 0;
  renderScenario();
}

function renderUseCases() {
  els.useCaseGrid.innerHTML = "";

  useCases.forEach((useCase) => {
    const card = document.createElement("article");
    card.className = "usecase-card";

    const title = document.createElement("p");
    title.className = "usecase-question";
    title.textContent = useCase.prompt;

    const options = document.createElement("div");
    options.className = "usecase-options";

    const feedback = document.createElement("div");
    feedback.className = "usecase-feedback";
    feedback.textContent = "Choose the best protocol.";

    useCase.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", () => {
        const buttons = Array.from(options.querySelectorAll("button"));
        const correct = option === useCase.answer;

        buttons.forEach((item) => {
          item.disabled = true;

          if (item.textContent === useCase.answer) {
            item.classList.add("correct-btn");
          }
        });

        if (!correct) {
          button.classList.add("wrong-btn");
        }

        feedback.textContent = correct
          ? `Correct. ${useCase.why}`
          : `Not quite. ${useCase.why}`;
      });

      options.appendChild(button);
    });

    card.appendChild(title);
    card.appendChild(options);
    card.appendChild(feedback);
    els.useCaseGrid.appendChild(card);
  });
}

function bindEvents() {
  els.nextStepBtn.addEventListener("click", goToNextStep);
  els.resetScenarioBtn.addEventListener("click", resetScenario);
}

renderScenarioButtons();
renderUseCases();
bindEvents();
renderScenario();
