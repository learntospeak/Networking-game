const scenarios = [
  {
    id: "arp-local",
    name: "ARP on Same Subnet",
    label: "ARP Flow",
    note: "Local host to local host",
    subtitle: "Resolve the destination MAC on the local network.",
    summary:
      "Same-subnet ARP is a local LAN process. The sender ARPs for the destination host, learns its MAC address, and then sends unicast frames directly on the LAN.",
    devices: {
      pc: { label: "PC A", meta: "192.168.1.10 /24", icon: "fa-desktop" },
      switch: { label: "Switch", meta: "Access switch on the local LAN", icon: "fa-network-wired" },
      router: { label: "Router", meta: "Visible on the LAN, not used for forwarding", icon: "fa-router" },
      server: { label: "Destination Host", meta: "192.168.1.20 /24", icon: "fa-desktop" }
    },
    steps: [
      {
        prompt: "PC 192.168.1.10 wants to reach 192.168.1.20. What happens first?",
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
        ],
        explanation:
          "The first move is a local ARP broadcast so the sender can learn the destination host MAC address before sending the frame.",
        visualAction: {
          mode: "broadcast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "switch-server"],
          trafficLabel: "Broadcast ARP request across the local LAN"
        }
      },
      {
        prompt: "The ARP request reaches the correct host. What is the next action?",
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
        ],
        explanation:
          "The destination host answers with an ARP reply, which is unicast back so the sender learns the correct MAC address.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "server"],
          cables: ["pc-switch", "switch-server"],
          trafficLabel: "Unicast ARP reply back to the sender"
        }
      },
      {
        prompt: "The PC now knows the destination MAC. What should happen next?",
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
        ],
        explanation:
          "Once the MAC address is known, the data frame goes directly across the switch to the local destination host.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "server"],
          cables: ["pc-switch", "switch-server"],
          trafficLabel: "Direct local unicast data path"
        }
      }
    ]
  },
  {
    id: "arp-gateway",
    name: "ARP for the Default Gateway",
    label: "Gateway Flow",
    note: "Local PC to remote network",
    subtitle: "Send to the gateway when the destination is remote.",
    summary:
      "When the destination IP is on a different subnet, the PC does not ARP for the remote host. It ARPs for the default gateway, then forwards the packet to the router.",
    devices: {
      pc: { label: "PC A", meta: "192.168.1.10 /24", icon: "fa-desktop" },
      switch: { label: "Switch", meta: "Local LAN forwarding", icon: "fa-network-wired" },
      router: { label: "Default Gateway", meta: "192.168.1.1", icon: "fa-router" },
      server: { label: "Remote Server", meta: "10.0.0.50 /24", icon: "fa-server" }
    },
    steps: [
      {
        prompt: "The PC wants to reach 10.0.0.50 on another subnet. What happens first?",
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
        ],
        explanation:
          "Remote destinations are off-net, so the sender first resolves the MAC address of the local default gateway, not the remote server.",
        visualAction: {
          mode: "broadcast",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Broadcast ARP request for the gateway"
        }
      },
      {
        prompt: "Who should answer the ARP request on the local network?",
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
        ],
        explanation:
          "The gateway interface on the router replies with its own MAC address so the PC knows the next Layer 2 hop.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Unicast ARP reply from the gateway"
        }
      },
      {
        prompt: "The PC now knows the gateway MAC. What is the correct next action?",
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
        ],
        explanation:
          "The Ethernet frame goes to the router MAC, but the IP packet still targets the remote host so the router can route it onward.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "Unicast toward the gateway, then routed to the server"
        }
      }
    ]
  },
  {
    id: "dns-https",
    name: "DNS Lookup Before HTTPS",
    label: "DNS + HTTPS",
    note: "Resolve before secure web access",
    subtitle: "Resolve the name before the secure web session starts.",
    summary:
      "A host must resolve the website name to an IP address first. After that, it can start secure web communication with HTTPS.",
    devices: {
      pc: { label: "User PC", meta: "Wants https://learn.lab", icon: "fa-desktop" },
      switch: { label: "Access Switch", meta: "Local LAN path", icon: "fa-network-wired" },
      router: { label: "Default Gateway", meta: "Path to remote services", icon: "fa-router" },
      server: { label: "DNS / Web Service", meta: "DNS answer first, then HTTPS target", icon: "fa-server" }
    },
    steps: [
      {
        prompt: "A user types https://learn.lab. What should happen before HTTPS traffic starts?",
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
        ],
        explanation:
          "DNS comes first. The client must resolve the website name to an IP address before it can open the secure web session.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "DNS query path from client to the resolver"
        }
      },
      {
        prompt: "The DNS server receives the query. What is the correct next action?",
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
        ],
        explanation:
          "The DNS reply returns the website IP address so the client finally knows where to send the HTTPS connection.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "DNS response returns the destination IP"
        }
      },
      {
        prompt: "The PC now knows the web server IP. What is the best next step?",
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
        ],
        explanation:
          "After name resolution succeeds, the browser can start the HTTPS session to the resolved destination.",
        visualAction: {
          mode: "secure",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "Secure HTTPS flow across the path"
        }
      }
    ]
  },
  {
    id: "ssh-vs-telnet",
    name: "Choose SSH Instead of Telnet",
    label: "Remote Access",
    note: "Secure or insecure admin traffic",
    subtitle: "Pick the secure protocol for device administration.",
    summary:
      "SSH is the correct choice for remote administration because it encrypts the login and the management session. Telnet leaves the traffic readable on the network.",
    inactiveDevices: ["server"],
    devices: {
      pc: { label: "Admin PC", meta: "Remote management source", icon: "fa-desktop" },
      switch: { label: "Access Switch", meta: "Forwarding path", icon: "fa-network-wired" },
      router: { label: "Managed Router", meta: "Target device", icon: "fa-router" },
      server: { label: "Server", meta: "Not involved in this path", icon: "fa-server" }
    },
    steps: [
      {
        prompt: "You need to log into a router remotely. Which protocol should you choose?",
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
        ],
        explanation:
          "SSH is the right protocol for remote administration because it protects the management session with encryption.",
        visualAction: {
          mode: "secure",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Secure management session path"
        }
      },
      {
        prompt: "Why is SSH the better answer here?",
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
        ],
        explanation:
          "The main advantage is confidentiality. SSH keeps both credentials and commands encrypted while they cross the network.",
        visualAction: {
          mode: "secure",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Encrypted remote administration traffic"
        }
      },
      {
        prompt: "Why is Telnet risky on untrusted networks?",
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
        ],
        explanation:
          "Telnet is risky because the session stays readable on the wire, which means credentials and commands can be intercepted.",
        visualAction: {
          mode: "warning",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Insecure Telnet session across the path"
        }
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
  scenarioTabs: document.getElementById("scenarioTabs"),
  scenarioStatus: document.getElementById("scenarioStatus"),
  scenarioLabel: document.getElementById("scenarioLabel"),
  scenarioName: document.getElementById("scenarioName"),
  scenarioSubtitle: document.getElementById("scenarioSubtitle"),
  stepBadge: document.getElementById("stepBadge"),
  stepPrompt: document.getElementById("stepPrompt"),
  actionButtons: document.getElementById("actionButtons"),
  nextStepBtn: document.getElementById("nextStepBtn"),
  resetScenarioBtn: document.getElementById("resetScenarioBtn"),
  explanationText: document.getElementById("explanationText"),
  whyText: document.getElementById("whyText"),
  trafficMode: document.getElementById("trafficMode"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  useCaseGrid: document.getElementById("useCaseGrid"),
  devicePc: document.getElementById("devicePc"),
  deviceSwitch: document.getElementById("deviceSwitch"),
  deviceRouter: document.getElementById("deviceRouter"),
  deviceServer: document.getElementById("deviceServer"),
  devicePcTitle: document.getElementById("devicePcTitle"),
  deviceSwitchTitle: document.getElementById("deviceSwitchTitle"),
  deviceRouterTitle: document.getElementById("deviceRouterTitle"),
  deviceServerTitle: document.getElementById("deviceServerTitle"),
  devicePcMeta: document.getElementById("devicePcMeta"),
  deviceSwitchMeta: document.getElementById("deviceSwitchMeta"),
  deviceRouterMeta: document.getElementById("deviceRouterMeta"),
  deviceServerMeta: document.getElementById("deviceServerMeta"),
  devicePcIcon: document.getElementById("devicePcIcon"),
  deviceSwitchIcon: document.getElementById("deviceSwitchIcon"),
  deviceRouterIcon: document.getElementById("deviceRouterIcon"),
  deviceServerIcon: document.getElementById("deviceServerIcon")
};

const deviceElements = {
  pc: els.devicePc,
  switch: els.deviceSwitch,
  router: els.deviceRouter,
  server: els.deviceServer
};

const cableElements = {
  "pc-switch": document.getElementById("cablePcSwitch"),
  "switch-router": document.getElementById("cableSwitchRouter"),
  "router-server": document.getElementById("cableRouterServer"),
  "switch-server": document.getElementById("cableSwitchServer")
};

const state = {
  scenarioIndex: 0,
  stepIndex: 0,
  stepResolved: false
};

function getScenario() {
  return scenarios[state.scenarioIndex];
}

function clearVisualState() {
  Object.values(deviceElements).forEach((element) => {
    element.classList.remove("active", "broadcast", "secure", "warning");
  });

  Object.values(cableElements).forEach((element) => {
    element.classList.remove("active", "broadcast", "secure", "warning");
  });
}

function updateScenarioStatus(type, text) {
  els.scenarioStatus.className = `flow-status ${type}`;
  els.scenarioStatus.textContent = text;
}

function updateTrafficMode(type, text) {
  els.trafficMode.className = `traffic-mode ${type}`;
  els.trafficMode.textContent = text;
}

function renderScenarioTabs() {
  els.scenarioTabs.innerHTML = "";

  scenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-tab";
    button.innerHTML = `
      <span class="scenario-tab-title">${scenario.name}</span>
      <span class="scenario-tab-note">${scenario.note}</span>
    `;
    button.addEventListener("click", () => loadScenario(index));
    els.scenarioTabs.appendChild(button);
  });
}

function updateScenarioTabs() {
  const buttons = Array.from(els.scenarioTabs.querySelectorAll("button"));

  buttons.forEach((button, index) => {
    button.classList.toggle("active", index === state.scenarioIndex);
  });
}

function applyDeviceState(scenario) {
  const { devices, inactiveDevices = [] } = scenario;
  const iconTargets = {
    pc: els.devicePcIcon,
    switch: els.deviceSwitchIcon,
    router: els.deviceRouterIcon,
    server: els.deviceServerIcon
  };
  const titleTargets = {
    pc: els.devicePcTitle,
    switch: els.deviceSwitchTitle,
    router: els.deviceRouterTitle,
    server: els.deviceServerTitle
  };
  const metaTargets = {
    pc: els.devicePcMeta,
    switch: els.deviceSwitchMeta,
    router: els.deviceRouterMeta,
    server: els.deviceServerMeta
  };

  Object.entries(devices).forEach(([id, data]) => {
    titleTargets[id].textContent = data.label;
    metaTargets[id].textContent = data.meta;
    iconTargets[id].className = `fa-solid ${data.icon} device-icon`;
  });

  Object.entries(deviceElements).forEach(([id, element]) => {
    element.classList.toggle("idle-off", inactiveDevices.includes(id));
  });
}

function runVisualAction(visualAction) {
  clearVisualState();

  visualAction.devices.forEach((deviceId) => {
    const element = deviceElements[deviceId];
    if (element) {
      element.classList.add(visualAction.mode === "unicast" ? "active" : visualAction.mode);
    }
  });

  visualAction.cables.forEach((cableId) => {
    const element = cableElements[cableId];
    if (element) {
      element.classList.add(visualAction.mode === "unicast" ? "active" : visualAction.mode);
    }
  });

  updateTrafficMode(visualAction.mode, visualAction.trafficLabel);
}

function disableOptionButtons() {
  Array.from(els.actionButtons.querySelectorAll("button")).forEach((button) => {
    button.disabled = true;
  });
}

function renderStep() {
  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];

  state.stepResolved = false;
  updateScenarioTabs();
  applyDeviceState(scenario);
  clearVisualState();
  updateScenarioStatus("idle", "Waiting for action");
  updateTrafficMode("idle", "No traffic active");

  els.scenarioLabel.textContent = scenario.label;
  els.scenarioName.textContent = scenario.name;
  els.scenarioSubtitle.textContent = scenario.subtitle;
  els.stepBadge.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.stepPrompt.textContent = step.prompt;
  els.explanationText.textContent = "Select the action that matches the next protocol move.";
  els.whyText.textContent = "The right answer will light the correct devices and cables so the path becomes visible.";
  els.scenarioSummary.textContent = scenario.summary;
  els.nextStepBtn.hidden = true;
  els.nextStepBtn.textContent = "Next Step";

  els.actionButtons.innerHTML = "";

  step.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-option";
    button.textContent = option.label;
    button.addEventListener("click", () => handleAnswer(index, button));
    els.actionButtons.appendChild(button);
  });
}

function handleAnswer(index, button) {
  if (state.stepResolved) return;

  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];
  const option = step.options[index];

  if (option.correct) {
    state.stepResolved = true;
    button.classList.add("correct-btn");
    disableOptionButtons();
    runVisualAction(step.visualAction);
    updateScenarioStatus("good", "Correct path");
    els.explanationText.textContent = step.explanation;
    els.whyText.textContent = option.why;

    if (state.stepIndex < scenario.steps.length - 1) {
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = "Next Step";
    } else {
      updateScenarioStatus("good", "Scenario complete");
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = "Restart Scenario";
      els.whyText.textContent = scenario.summary;
    }

    return;
  }

  button.classList.add("wrong-btn");
  button.disabled = true;
  updateScenarioStatus("bad", "Try again");
  els.explanationText.textContent = "That is not the right next action for this step.";
  els.whyText.textContent = option.why;
}

function loadScenario(index) {
  state.scenarioIndex = index;
  state.stepIndex = 0;
  renderStep();
}

function goToNextStep() {
  const scenario = getScenario();

  if (!state.stepResolved) return;

  if (state.stepIndex < scenario.steps.length - 1) {
    state.stepIndex += 1;
    renderStep();
    return;
  }

  resetScenario();
}

function resetScenario() {
  state.stepIndex = 0;
  renderStep();
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

renderScenarioTabs();
renderUseCases();
bindEvents();
loadScenario(0);
