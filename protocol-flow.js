const scenarios = [
  {
    id: "arp-local",
    name: "ARP on Same Subnet",
    label: "ARP Flow",
    note: "Local host to local host",
    summary:
      "ARP on the same subnet is a local LAN process. The sender broadcasts to learn the destination MAC, then uses unicast frames for the real traffic.",
    deviceTitles: {
      pc: "PC A",
      switch: "Switch",
      router: "Router",
      server: "PC B"
    },
    deviceMeta: {
      pc: "192.168.1.10 /24",
      switch: "Floods local broadcasts",
      router: "Visible on LAN, not used for forwarding",
      server: "192.168.1.20 /24"
    },
    steps: [
      {
        prompt: "PC A wants to reach a host on the same subnet. What should happen first?",
        options: [
          "Send an ARP request asking for the destination MAC",
          "Send the packet to the default gateway first",
          "Start HTTPS traffic immediately",
          "Use DNS to resolve the local host"
        ],
        correct: 0,
        explanation:
          "On the same subnet, the sender needs the destination MAC address. That means an ARP request is broadcast on the local LAN first.",
        visualAction: {
          mode: "broadcast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "switch-server"],
          trafficLabel: "Broadcast ARP request across the local LAN"
        }
      },
      {
        prompt: "The target host receives the ARP request. What happens next?",
        options: [
          "The target host replies with its MAC address",
          "The router replies with the server MAC",
          "The switch stores the IP and answers itself"
        ],
        correct: 0,
        explanation:
          "The host that owns the destination IP sends an ARP reply back. That reply is unicast back toward PC A with the correct MAC address.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "server"],
          cables: ["pc-switch", "switch-server"],
          trafficLabel: "Unicast ARP reply back to PC A"
        }
      },
      {
        prompt: "PC A now knows the destination MAC. What is the correct next move?",
        options: [
          "Send the frame directly to the destination host",
          "ARP for the router before every packet",
          "Drop the packet because the router was not used"
        ],
        correct: 0,
        explanation:
          "Now that the local MAC address is known, PC A sends the frame directly across the switch to the destination host without using the router.",
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
    name: "ARP via Default Gateway",
    label: "Gateway Flow",
    note: "Local PC to remote network",
    summary:
      "When the destination is off-net, the sender does not ARP for the remote host. It ARPs for the default gateway, then forwards the packet to the router.",
    deviceTitles: {
      pc: "PC A",
      switch: "Switch",
      router: "Gateway",
      server: "Remote Host"
    },
    deviceMeta: {
      pc: "192.168.1.10 /24",
      switch: "Local access switch",
      router: "192.168.1.1 gateway",
      server: "10.0.0.50 remote host"
    },
    steps: [
      {
        prompt: "PC A needs to reach a host on a different subnet. What happens first?",
        options: [
          "ARP for the remote server MAC",
          "ARP for the default gateway MAC",
          "Send the frame directly to the server",
          "Use SSH to discover the route"
        ],
        correct: 1,
        explanation:
          "A remote destination is off-net, so PC A needs the MAC address of the local default gateway, not the remote host.",
        visualAction: {
          mode: "broadcast",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Broadcast ARP request for the gateway"
        }
      },
      {
        prompt: "The gateway ARP request arrives on the local LAN. What happens next?",
        options: [
          "The remote server replies with its MAC",
          "The router replies with its own MAC address",
          "The switch rewrites the packet and forwards it"
        ],
        correct: 1,
        explanation:
          "The router interface that owns the gateway IP replies with its own MAC address so PC A can send frames to the next hop.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Unicast ARP reply from the gateway"
        }
      },
      {
        prompt: "PC A now knows the gateway MAC. What is the right forwarding action?",
        options: [
          "Send the frame to the router while keeping the remote IP as the destination IP",
          "Replace the destination IP with the switch IP",
          "ARP for the remote host again"
        ],
        correct: 0,
        explanation:
          "Layer 2 goes to the router MAC, but Layer 3 still targets the remote host IP. The router then forwards the traffic toward the server.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "Unicast toward gateway, then routed to the server"
        }
      }
    ]
  },
  {
    id: "dns-https",
    name: "DNS Before HTTPS",
    label: "DNS + HTTPS",
    note: "Resolve before secure web access",
    summary:
      "Name resolution comes first. The client asks DNS for the website IP, then starts the HTTPS connection after it knows where to send the secure web traffic.",
    deviceTitles: {
      pc: "Client",
      switch: "Switch",
      router: "Router",
      server: "Server"
    },
    deviceMeta: {
      pc: "User opens a secure website",
      switch: "Access path on the LAN",
      router: "Path to remote services",
      server: "DNS then web service"
    },
    steps: [
      {
        prompt: "A user types a secure website name into the browser. What must happen before HTTPS starts?",
        options: [
          "Send a DNS query to resolve the site name",
          "Start HTTPS immediately without resolution",
          "Use ARP for the public website"
        ],
        correct: 0,
        explanation:
          "The client must learn the destination IP first. DNS resolves the website name before the browser can start the secure web session.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "DNS query path from client to server"
        }
      },
      {
        prompt: "The DNS service has the answer. What comes back to the client?",
        options: [
          "The server MAC address",
          "The website IP address",
          "The switch forwarding table"
        ],
        correct: 1,
        explanation:
          "DNS returns the website IP address so the client can open a connection to the correct host.",
        visualAction: {
          mode: "unicast",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "DNS response returns the destination IP"
        }
      },
      {
        prompt: "The client now knows the website IP. What is the next protocol step?",
        options: [
          "Open an HTTPS connection to the server",
          "Open a Telnet session instead",
          "Use FTP to request the page"
        ],
        correct: 0,
        explanation:
          "Once the name is resolved, the client can begin secure web communication with HTTPS.",
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
    name: "SSH vs Telnet",
    label: "Remote Access",
    note: "Secure or insecure admin traffic",
    summary:
      "SSH is the safe choice for remote administration because the session is encrypted. Telnet exposes credentials and commands in plain text.",
    deviceTitles: {
      pc: "Admin PC",
      switch: "Switch",
      router: "Managed Device",
      server: "Server"
    },
    deviceMeta: {
      pc: "Admin workstation",
      switch: "LAN forwarding path",
      router: "Managed network device",
      server: "Not involved in this path"
    },
    steps: [
      {
        prompt: "An admin needs remote access to a network device. Which protocol should be chosen?",
        options: [
          "Telnet",
          "SSH",
          "ARP"
        ],
        correct: 1,
        explanation:
          "SSH is the correct choice for remote administration because it encrypts the session.",
        visualAction: {
          mode: "secure",
          devices: ["pc", "switch", "router"],
          cables: ["pc-switch", "switch-router"],
          trafficLabel: "Secure management session path"
        }
      },
      {
        prompt: "Why is Telnet the weaker option on an untrusted network?",
        options: [
          "It sends credentials and commands in plain text",
          "It cannot cross a router",
          "It does not use IP"
        ],
        correct: 0,
        explanation:
          "Telnet traffic is not encrypted, so credentials and commands can be read from packet captures.",
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

const els = {
  scenarioTabs: document.getElementById("scenarioTabs"),
  scenarioStatus: document.getElementById("scenarioStatus"),
  scenarioLabel: document.getElementById("scenarioLabel"),
  scenarioName: document.getElementById("scenarioName"),
  stepBadge: document.getElementById("stepBadge"),
  mobileScenarioName: document.getElementById("mobileScenarioName"),
  mobileStepBadge: document.getElementById("mobileStepBadge"),
  mobileFeedbackState: document.getElementById("mobileFeedbackState"),
  mobileFeedbackText: document.getElementById("mobileFeedbackText"),
  stepPrompt: document.getElementById("stepPrompt"),
  actionButtons: document.getElementById("actionButtons"),
  nextStepBtn: document.getElementById("nextStepBtn"),
  resetScenarioBtn: document.getElementById("resetScenarioBtn"),
  explanationText: document.getElementById("explanationText"),
  whyText: document.getElementById("whyText"),
  trafficMode: document.getElementById("trafficMode"),
  scenarioSummary: document.getElementById("scenarioSummary"),
  diagramStage: document.getElementById("diagramStage"),
  messageLayer: document.getElementById("messageLayer"),
  devicePcTitle: document.getElementById("devicePcTitle"),
  deviceSwitchTitle: document.getElementById("deviceSwitchTitle"),
  deviceRouterTitle: document.getElementById("deviceRouterTitle"),
  deviceServerTitle: document.getElementById("deviceServerTitle"),
  devicePcMeta: document.getElementById("devicePcMeta"),
  deviceSwitchMeta: document.getElementById("deviceSwitchMeta"),
  deviceRouterMeta: document.getElementById("deviceRouterMeta"),
  deviceServerMeta: document.getElementById("deviceServerMeta")
};

const deviceElements = {
  pc: document.getElementById("devicePc"),
  switch: document.getElementById("deviceSwitch"),
  router: document.getElementById("deviceRouter"),
  server: document.getElementById("deviceServer")
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
  stepResolved: false,
  visualRunId: 0
};

function getScenario() {
  return scenarios[state.scenarioIndex];
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function stageRect() {
  return els.diagramStage.getBoundingClientRect();
}

function getRelativeRect(element) {
  const stage = stageRect();
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left - stage.left,
    top: rect.top - stage.top,
    width: rect.width,
    height: rect.height,
    right: rect.right - stage.left,
    bottom: rect.bottom - stage.top
  };
}

function getNodeCenter(nodeId) {
  const rect = getRelativeRect(deviceElements[nodeId]);

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function getNodeStatusPoint(nodeId) {
  const rect = getRelativeRect(deviceElements[nodeId]);

  return {
    x: rect.left + rect.width / 2,
    y: rect.top - 12
  };
}

function activeRun() {
  state.visualRunId += 1;
  return state.visualRunId;
}

function isRunCurrent(runId) {
  return runId === state.visualRunId;
}

function clearVisualState({ preserveRun = false } = {}) {
  if (!preserveRun) {
    activeRun();
  }

  Object.values(deviceElements).forEach((element) => {
    element.classList.remove(
      "active",
      "broadcast",
      "secure",
      "warning",
      "node-active",
      "node-verify",
      "node-broadcast",
      "node-unicast",
      "node-reply",
      "node-warning"
    );
  });

  Object.values(cableElements).forEach((element) => {
    element.classList.remove("active", "broadcast", "secure", "warning");
  });

  if (els.messageLayer) {
    els.messageLayer.innerHTML = "";
  }
}

function packetTone(type) {
  if (type === "secure") return "reply";
  if (type === "active") return "unicast";
  return type || "unicast";
}

function nodeTone(type) {
  if (type === "secure") return "reply";
  return type || "unicast";
}

function cableTone(type) {
  if (type === "unicast") return "active";
  if (type === "reply" || type === "secure") return "secure";
  if (type === "warning") return "warning";
  return "broadcast";
}

function resolveCableId(fromId, toId) {
  const map = {
    "pc:switch": "pc-switch",
    "switch:pc": "pc-switch",
    "switch:router": "switch-router",
    "router:switch": "switch-router",
    "router:server": "router-server",
    "server:router": "router-server",
    "switch:server": "switch-server",
    "server:switch": "switch-server"
  };

  return map[`${fromId}:${toId}`] || null;
}

function getBypassWaypoints(fromId, toId) {
  const bypass = cableElements["switch-server"];

  if (!bypass) return [];

  const bypassRect = getRelativeRect(bypass);
  const from = getNodeCenter(fromId);
  const to = getNodeCenter(toId);
  const laneY = bypassRect.top + bypassRect.height / 2;
  const leftX = bypassRect.left + 10;
  const rightX = bypassRect.right - 10;

  if (fromId === "switch" && toId === "server") {
    return [
      { x: leftX, y: from.y },
      { x: leftX, y: laneY },
      { x: rightX, y: laneY },
      { x: rightX, y: to.y }
    ];
  }

  if (fromId === "server" && toId === "switch") {
    return [
      { x: rightX, y: from.y },
      { x: rightX, y: laneY },
      { x: leftX, y: laneY },
      { x: leftX, y: to.y }
    ];
  }

  return [];
}

function highlightCables(cableIds, type) {
  const toneClass = cableTone(type);

  cableIds.forEach((cableId) => {
    const element = cableElements[cableId];
    if (element) {
      element.classList.add(toneClass);
    }
  });
}

function setPosition(element, point) {
  element.style.left = `${point.x}px`;
  element.style.top = `${point.y}px`;
}

function createMessage(label, type) {
  const element = document.createElement("div");
  element.className = `message-dot message-${packetTone(type)}`;
  element.textContent = label;
  els.messageLayer.appendChild(element);
  return element;
}

function createStatusIndicator(nodeId, text, type) {
  const element = document.createElement("div");
  element.className = `status-indicator ${nodeTone(type)}`;
  element.textContent = text;
  els.messageLayer.appendChild(element);
  setPosition(element, getNodeStatusPoint(nodeId));
  return element;
}

function travelDuration(fromPoint, toPoint) {
  const distance = Math.hypot(toPoint.x - fromPoint.x, toPoint.y - fromPoint.y);
  return Math.max(220, Math.min(540, Math.round(distance * 2.4)));
}

function transitionTo(element, point, duration) {
  return new Promise((resolve) => {
    let resolved = false;

    const finish = () => {
      if (resolved) return;
      resolved = true;
      resolve();
    };

    const handleEnd = () => {
      element.removeEventListener("transitionend", handleEnd);
      finish();
    };

    element.addEventListener("transitionend", handleEnd, { once: true });
    element.style.transition = `left ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), top ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;

    window.requestAnimationFrame(() => {
      setPosition(element, point);
    });

    window.setTimeout(finish, duration + 48);
  });
}

async function moveMessage(fromId, toId, label, type, runId, options = {}) {
  const points = [getNodeCenter(fromId), ...(options.via || []), getNodeCenter(toId)];
  const element = createMessage(label, type);

  setPosition(element, points[0]);
  await delay(40);

  for (let index = 1; index < points.length; index += 1) {
    if (!isRunCurrent(runId)) {
      element.remove();
      return null;
    }

    await transitionTo(element, points[index], travelDuration(points[index - 1], points[index]));
    await delay(40);
  }

  return element;
}

async function flashNode(nodeId, statusText, type, runId, options = {}) {
  if (!isRunCurrent(runId)) return;

  const element = deviceElements[nodeId];
  const toneClass = `node-${nodeTone(type)}`;
  const indicator = createStatusIndicator(nodeId, statusText, type);

  element.classList.add("node-active", "node-verify", toneClass);
  await delay(options.hold || 320);

  indicator.remove();
  element.classList.remove("node-verify");

  if (!options.persist) {
    await delay(80);
    element.classList.remove("node-active", toneClass);
  }
}

async function travelAndVerify(fromId, toId, label, type, statusText, runId, options = {}) {
  const cableId = resolveCableId(fromId, toId);

  if (cableId) {
    highlightCables([cableId], type);
  }

  const element = await moveMessage(fromId, toId, label, type, runId, options);

  if (!element || !isRunCurrent(runId)) return;

  await flashNode(toId, statusText, options.nodeType || type, runId, { hold: options.hold });
  element.remove();
}

async function animateBroadcast(fromId, targetIds, label, runId, options = {}) {
  const stagger = options.stagger || 110;

  await Promise.all(
    targetIds.map((targetId, index) =>
      (async () => {
        await delay(index * stagger);

        const packet = await moveMessage(fromId, targetId, label, "broadcast", runId, {
          via: options.pathMap?.[targetId] || []
        });

        if (!packet || !isRunCurrent(runId)) return;

        await flashNode(
          targetId,
          options.statusMap?.[targetId] || "RX",
          options.toneMap?.[targetId] || "broadcast",
          runId,
          { hold: options.hold || 320 }
        );

        packet.remove();
      })()
    )
  );
}

async function runArpSameSubnetFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("broadcast", visualAction.trafficLabel);
    await flashNode("pc", "TX", "broadcast", runId, { hold: 240 });
    await travelAndVerify("pc", "switch", "ARP?", "broadcast", "RX", runId);
    await flashNode("switch", "FLOOD", "broadcast", runId, { hold: 250 });
    highlightCables(["switch-router", "switch-server"], "broadcast");
    await animateBroadcast("switch", ["router", "server"], "ARP?", runId, {
      toneMap: { router: "warning", server: "broadcast" },
      statusMap: { router: "RX", server: "IP match" },
      pathMap: { server: getBypassWaypoints("switch", "server") },
      stagger: 140
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("server", "Reply", "reply", runId, { hold: 250 });
    await travelAndVerify("server", "switch", "MAC", "reply", "RX", runId, {
      via: getBypassWaypoints("server", "switch"),
      nodeType: "reply"
    });
    await flashNode("switch", "FWD", "reply", runId, { hold: 220 });
    await travelAndVerify("switch", "pc", "MAC", "reply", "OK", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("unicast", visualAction.trafficLabel);
  await flashNode("pc", "DATA", "unicast", runId, { hold: 240 });
  await travelAndVerify("pc", "switch", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("switch", "server", "DATA", "unicast", "RX", runId, {
    via: getBypassWaypoints("switch", "server"),
    nodeType: "unicast"
  });
}

async function runArpGatewayFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("broadcast", visualAction.trafficLabel);
    await flashNode("pc", "Remote", "warning", runId, { hold: 240 });
    await travelAndVerify("pc", "switch", "ARP GW?", "broadcast", "RX", runId);
    await flashNode("switch", "LOCAL", "broadcast", runId, { hold: 240 });
    await animateBroadcast("switch", ["router"], "ARP GW?", runId, {
      toneMap: { router: "broadcast" },
      statusMap: { router: "GW IP" }
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("router", "Reply", "reply", runId, { hold: 250 });
    await travelAndVerify("router", "switch", "GW MAC", "reply", "RX", runId, {
      nodeType: "reply"
    });
    await flashNode("switch", "FWD", "reply", runId, { hold: 220 });
    await travelAndVerify("switch", "pc", "GW MAC", "reply", "OK", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("unicast", visualAction.trafficLabel);
  await flashNode("pc", "DATA", "unicast", runId, { hold: 220 });
  await travelAndVerify("pc", "switch", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("switch", "router", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("router", "server", "FWD", "unicast", "RX", runId);
}

async function runGenericVisualAction(visualAction, runId) {
  const devices = visualAction.devices || [];
  const tone = packetTone(visualAction.mode);

  updateTrafficMode(visualAction.mode, visualAction.trafficLabel);

  visualAction.cables.forEach((cableId) => {
    const element = cableElements[cableId];
    if (element) {
      element.classList.add(cableTone(visualAction.mode));
    }
  });

  if (devices.length < 2) {
    devices.forEach((deviceId) => {
      const element = deviceElements[deviceId];
      if (element) {
        element.classList.add(`node-${nodeTone(tone)}`, "node-active");
      }
    });
    return;
  }

  await flashNode(devices[0], "TX", tone, runId, { hold: 220 });

  for (let index = 1; index < devices.length; index += 1) {
    if (!isRunCurrent(runId)) return;

    const fromId = devices[index - 1];
    const toId = devices[index];
    const via = fromId === "switch" && toId === "server"
      ? getBypassWaypoints("switch", "server")
      : fromId === "server" && toId === "switch"
        ? getBypassWaypoints("server", "switch")
        : [];
    const statusText = index === devices.length - 1 ? "RX" : "FWD";

    await travelAndVerify(fromId, toId, tone === "reply" ? "Reply" : "DATA", tone, statusText, runId, {
      via,
      nodeType: tone
    });
  }
}

async function runVisualAction(visualAction) {
  const runId = activeRun();
  clearVisualState({ preserveRun: true });

  const scenario = getScenario();

  if (scenario.id === "arp-local") {
    await runArpSameSubnetFlow(state.stepIndex, visualAction, runId);
    return;
  }

  if (scenario.id === "arp-gateway") {
    await runArpGatewayFlow(state.stepIndex, visualAction, runId);
    return;
  }

  await runGenericVisualAction(visualAction, runId);
}

function updateScenarioStatus(type, text) {
  els.scenarioStatus.className = `flow-status ${type}`;
  els.scenarioStatus.textContent = text;
  els.mobileFeedbackState.className = `interaction-feedback-state ${type}`;
  els.mobileFeedbackState.textContent = text;
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

function applyDeviceMeta(meta) {
  els.devicePcMeta.textContent = meta.pc;
  els.deviceSwitchMeta.textContent = meta.switch;
  els.deviceRouterMeta.textContent = meta.router;
  els.deviceServerMeta.textContent = meta.server;
}

function applyDeviceTitles(titles = {}) {
  els.devicePcTitle.textContent = titles.pc || "PC A";
  els.deviceSwitchTitle.textContent = titles.switch || "Switch";
  els.deviceRouterTitle.textContent = titles.router || "Router";
  els.deviceServerTitle.textContent = titles.server || "Server";
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
  applyDeviceTitles(scenario.deviceTitles);
  applyDeviceMeta(scenario.deviceMeta);
  clearVisualState();
  updateScenarioStatus("idle", "Waiting for action");
  updateTrafficMode("idle", "No traffic active");

  els.scenarioLabel.textContent = scenario.label;
  els.scenarioName.textContent = scenario.name;
  els.stepBadge.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.mobileScenarioName.textContent = scenario.name;
  els.mobileStepBadge.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.stepPrompt.textContent = step.prompt;
  els.explanationText.textContent = "Select the action that matches the next protocol move.";
  els.whyText.textContent = "The right answer will light the correct devices and cables so the path becomes visible.";
  els.mobileFeedbackText.textContent = "Pick the next protocol move. Feedback will stay pinned here on mobile.";
  els.scenarioSummary.textContent = scenario.summary;
  els.nextStepBtn.hidden = true;
  els.nextStepBtn.textContent = "Next Step";

  els.actionButtons.innerHTML = "";

  step.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(index, button));
    els.actionButtons.appendChild(button);
  });
}

async function handleAnswer(index, button) {
  if (state.stepResolved) return;

  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];

  if (index === step.correct) {
    state.stepResolved = true;
    button.classList.add("correct-btn");
    disableOptionButtons();
    els.explanationText.textContent = step.explanation;
    els.whyText.textContent = step.explanation;
    els.mobileFeedbackText.textContent = step.explanation;
    updateScenarioStatus("good", "Running flow");

    await runVisualAction(step.visualAction);

    if (!state.stepResolved) {
      return;
    }

    if (state.stepIndex < scenario.steps.length - 1) {
      updateScenarioStatus("good", "Correct path");
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = "Next Step";
    } else {
      updateScenarioStatus("good", "Scenario complete");
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = "Restart Scenario";
    }

    return;
  }

  button.classList.add("wrong-btn");
  button.disabled = true;
  updateScenarioStatus("bad", "Try again");
  els.explanationText.textContent = `Not quite. Think about what the sender needs before ${step.options[step.correct].toLowerCase()}.`;
  els.whyText.textContent = "Wrong answers stay visible so you can compare them against the correct protocol path.";
  els.mobileFeedbackText.textContent = `Not quite. Think about what the sender needs before ${step.options[step.correct].toLowerCase()}.`;
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

function bindEvents() {
  els.nextStepBtn.addEventListener("click", goToNextStep);
  els.resetScenarioBtn.addEventListener("click", resetScenario);

  window.addEventListener("resize", () => {
    clearVisualState();

    if (!state.stepResolved) return;

    const scenario = getScenario();
    const step = scenario.steps[state.stepIndex];

    runVisualAction(step.visualAction).catch(() => {});
  });
}

renderScenarioTabs();
bindEvents();
loadScenario(0);
