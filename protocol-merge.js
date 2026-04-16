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
      router: { label: "Router", meta: "Visible on the LAN, not used for forwarding", icon: "fa-route" },
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
      router: { label: "Default Gateway", meta: "192.168.1.1", icon: "fa-route" },
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
      router: { label: "Default Gateway", meta: "Path to remote services", icon: "fa-route" },
      server: { label: "DNS / Web Service", meta: "Resolver first, web response second", icon: "fa-server" }
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
          trafficLabel: "DNS query from the client to the resolver"
        },
        flowIndicator: { label: "DNS Query", tone: "unicast" }
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
          mode: "reply",
          devices: ["pc", "switch", "router", "server"],
          cables: ["pc-switch", "switch-router", "router-server"],
          trafficLabel: "DNS response returns from the server to the client"
        },
        flowIndicator: { label: "DNS Response", tone: "reply" }
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
          trafficLabel: "HTTPS request goes out, then the secure response comes back"
        },
        flowIndicator: { label: "HTTPS Exchange", tone: "secure" }
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
      router: { label: "Managed Router", meta: "Target device", icon: "fa-route" },
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
          trafficLabel: "SSH session setup to the managed router"
        },
        flowIndicator: { label: "SSH Handshake", tone: "secure" }
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
          trafficLabel: "Encrypted SSH credentials and commands"
        },
        flowIndicator: { label: "SSH Encrypted Session", tone: "secure" }
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
          trafficLabel: "Plaintext Telnet credentials and commands"
        },
        flowIndicator: { label: "Telnet Plaintext Session", tone: "warning" }
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
  flowIndicator: document.getElementById("flowIndicator"),
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
  useCaseGrid: document.getElementById("useCaseGrid"),
  diagramStage: document.getElementById("diagramStage"),
  messageLayer: document.getElementById("messageLayer"),
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
  "switch-server": document.getElementById("cableSwitchServer"),
  "switch-server-start": document.getElementById("cableSwitchServerStart"),
  "switch-server-end": document.getElementById("cableSwitchServerEnd")
};

const state = {
  scenarioIndex: 0,
  stepIndex: 0,
  stepResolved: false,
  visualRunId: 0
};

const MESSAGE_TIME_SCALE = 1.96;

function getScenario() {
  return scenarios[state.scenarioIndex];
}

function scaleMs(ms) {
  return Math.round(ms * MESSAGE_TIME_SCALE);
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, scaleMs(ms)));
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

function overlapMidpoint(startA, endA, startB, endB) {
  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);

  if (overlapEnd > overlapStart) {
    return overlapStart + (overlapEnd - overlapStart) / 2;
  }

  return (startA + endA + startB + endB) / 4;
}

function setCableBox(element, { left, top, width, height, transform = "none" }) {
  if (!element) return;

  element.style.left = `${left}px`;
  element.style.top = `${top}px`;
  element.style.width = `${Math.max(width, 0)}px`;
  element.style.height = `${Math.max(height, 0)}px`;
  element.style.transform = transform;
}

function isStackedMergeLayout() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function updateMergeCableGeometry() {
  const pcRect = getRelativeRect(deviceElements.pc);
  const switchRect = getRelativeRect(deviceElements.switch);
  const routerRect = getRelativeRect(deviceElements.router);
  const serverRect = getRelativeRect(deviceElements.server);
  const lineThickness = 6;
  const lineOffset = lineThickness / 2;

  if (isStackedMergeLayout()) {
    const pcSwitchX = overlapMidpoint(pcRect.left, pcRect.right, switchRect.left, switchRect.right);
    const switchRouterX = overlapMidpoint(switchRect.left, switchRect.right, routerRect.left, routerRect.right);
    const routerServerX = overlapMidpoint(routerRect.left, routerRect.right, serverRect.left, serverRect.right);
    const switchY = switchRect.top + switchRect.height / 2;
    const serverY = serverRect.top + serverRect.height / 2;
    const bypassAnchorX = Math.max(switchRect.right, serverRect.right) + 22;
    const bypassHeight = Math.max(12, serverY - switchY);
    const switchStubLength = Math.max(14, bypassAnchorX - switchRect.right);
    const serverStubLength = Math.max(14, bypassAnchorX - serverRect.right);

    setCableBox(cableElements["pc-switch"], {
      left: pcSwitchX - lineOffset,
      top: pcRect.bottom,
      width: lineThickness,
      height: switchRect.top - pcRect.bottom
    });

    setCableBox(cableElements["switch-router"], {
      left: switchRouterX - lineOffset,
      top: switchRect.bottom,
      width: lineThickness,
      height: routerRect.top - switchRect.bottom
    });

    setCableBox(cableElements["router-server"], {
      left: routerServerX - lineOffset,
      top: routerRect.bottom,
      width: lineThickness,
      height: serverRect.top - routerRect.bottom
    });

    setCableBox(cableElements["switch-server"], {
      left: bypassAnchorX - lineOffset,
      top: switchY,
      width: lineThickness,
      height: bypassHeight
    });

    setCableBox(cableElements["switch-server-start"], {
      left: switchRect.right,
      top: switchY - lineOffset,
      width: switchStubLength,
      height: lineThickness
    });

    setCableBox(cableElements["switch-server-end"], {
      left: serverRect.right,
      top: serverY - lineOffset,
      width: serverStubLength,
      height: lineThickness
    });
    return;
  }

  const pcSwitchY = overlapMidpoint(pcRect.top, pcRect.bottom, switchRect.top, switchRect.bottom);
  const switchRouterY = overlapMidpoint(switchRect.top, switchRect.bottom, routerRect.top, routerRect.bottom);
  const routerServerY = overlapMidpoint(routerRect.top, routerRect.bottom, serverRect.top, serverRect.bottom);
  const switchX = switchRect.left + switchRect.width / 2;
  const serverX = serverRect.left + serverRect.width / 2;
  const switchBottom = switchRect.bottom;
  const serverBottom = serverRect.bottom;
  const bypassLaneY = Math.max(switchRect.bottom, serverRect.bottom) + 26;
  const bypassWidth = Math.max(14, serverX - switchX);
  const leftStemHeight = Math.max(10, bypassLaneY - switchBottom);
  const rightStemHeight = Math.max(10, bypassLaneY - serverBottom);

  setCableBox(cableElements["pc-switch"], {
    left: pcRect.right,
    top: pcSwitchY - lineOffset,
    width: switchRect.left - pcRect.right,
    height: lineThickness
  });

  setCableBox(cableElements["switch-router"], {
    left: switchRect.right,
    top: switchRouterY - lineOffset,
    width: routerRect.left - switchRect.right,
    height: lineThickness
  });

  setCableBox(cableElements["router-server"], {
    left: routerRect.right,
    top: routerServerY - lineOffset,
    width: serverRect.left - routerRect.right,
    height: lineThickness
  });

  setCableBox(cableElements["switch-server"], {
    left: switchX,
    top: bypassLaneY - lineOffset,
    width: bypassWidth,
    height: lineThickness
  });

  setCableBox(cableElements["switch-server-start"], {
    left: switchX - lineOffset,
    top: switchBottom,
    width: lineThickness,
    height: leftStemHeight
  });

  setCableBox(cableElements["switch-server-end"], {
    left: serverX - lineOffset,
    top: serverBottom,
    width: lineThickness,
    height: rightStemHeight
  });
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
  const switchRect = getRelativeRect(deviceElements.switch);
  const serverRect = getRelativeRect(deviceElements.server);

  if (isStackedMergeLayout()) {
    const laneX = bypassRect.left + bypassRect.width / 2;
    const switchY = switchRect.top + switchRect.height / 2;
    const serverY = serverRect.top + serverRect.height / 2;
    const switchEdgeX = switchRect.right;
    const serverEdgeX = serverRect.right;

    if (fromId === "switch" && toId === "server") {
      return [
        { x: switchEdgeX, y: switchY },
        { x: laneX, y: switchY },
        { x: laneX, y: serverY },
        { x: serverEdgeX, y: serverY }
      ];
    }

    if (fromId === "server" && toId === "switch") {
      return [
        { x: serverEdgeX, y: serverY },
        { x: laneX, y: serverY },
        { x: laneX, y: switchY },
        { x: switchEdgeX, y: switchY }
      ];
    }

    return [];
  }

  const laneY = bypassRect.top + bypassRect.height / 2;
  const leftX = switchRect.left + switchRect.width / 2;
  const rightX = serverRect.left + serverRect.width / 2;
  const switchBottom = switchRect.bottom;
  const serverBottom = serverRect.bottom;

  if (fromId === "switch" && toId === "server") {
    return [
      { x: leftX, y: from.y },
      { x: leftX, y: switchBottom },
      { x: leftX, y: laneY },
      { x: rightX, y: laneY },
      { x: rightX, y: serverBottom },
      { x: rightX, y: to.y }
    ];
  }

  if (fromId === "server" && toId === "switch") {
    return [
      { x: rightX, y: from.y },
      { x: rightX, y: serverBottom },
      { x: rightX, y: laneY },
      { x: leftX, y: laneY },
      { x: leftX, y: switchBottom },
      { x: leftX, y: to.y }
    ];
  }

  return [];
}

function highlightCables(cableIds, type) {
  const toneClass = cableTone(type);

  cableIds.forEach((cableId) => {
    const relatedCableIds = cableId === "switch-server"
      ? ["switch-server", "switch-server-start", "switch-server-end"]
      : [cableId];

    relatedCableIds.forEach((relatedId) => {
      const element = cableElements[relatedId];
      if (element) {
        element.classList.add(toneClass);
      }
    });
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
  return scaleMs(Math.max(260, Math.min(620, Math.round(distance * 2.8))));
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

    window.setTimeout(finish, duration + scaleMs(48));
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
    await delay(50);
  }

  return element;
}

async function flashNode(nodeId, statusText, type, runId, options = {}) {
  if (!isRunCurrent(runId)) return;

  const element = deviceElements[nodeId];
  const toneClass = `node-${nodeTone(type)}`;
  const indicator = createStatusIndicator(nodeId, statusText, type);

  element.classList.add("node-active", "node-verify", toneClass);
  await delay(options.hold || 360);

  indicator.remove();
  element.classList.remove("node-verify");

  if (!options.persist) {
    await delay(90);
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
  const stagger = options.stagger || 140;

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
          { hold: options.hold || 340 }
        );

        packet.remove();
      })()
    )
  );
}

async function runArpSameSubnetFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("broadcast", visualAction.trafficLabel);
    await flashNode("pc", "TX", "broadcast", runId, { hold: 260 });
    await travelAndVerify("pc", "switch", "ARP?", "broadcast", "RX", runId);
    await flashNode("switch", "FLOOD", "broadcast", runId, { hold: 280 });
    highlightCables(["switch-router", "switch-server"], "broadcast");
    await animateBroadcast("switch", ["router", "server"], "ARP?", runId, {
      toneMap: { router: "warning", server: "broadcast" },
      statusMap: { router: "RX", server: "IP match" },
      pathMap: { server: getBypassWaypoints("switch", "server") }
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("server", "Reply", "reply", runId, { hold: 280 });
    await travelAndVerify("server", "switch", "MAC", "reply", "RX", runId, {
      via: getBypassWaypoints("server", "switch"),
      nodeType: "reply"
    });
    await flashNode("switch", "FWD", "reply", runId, { hold: 250 });
    await travelAndVerify("switch", "pc", "MAC", "reply", "OK", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("unicast", visualAction.trafficLabel);
  await flashNode("pc", "DATA", "unicast", runId, { hold: 260 });
  await travelAndVerify("pc", "switch", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("switch", "server", "DATA", "unicast", "RX", runId, {
    via: getBypassWaypoints("switch", "server"),
    nodeType: "unicast"
  });
}

async function runArpGatewayFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("broadcast", visualAction.trafficLabel);
    await flashNode("pc", "Remote", "warning", runId, { hold: 260 });
    await travelAndVerify("pc", "switch", "ARP GW?", "broadcast", "RX", runId);
    await flashNode("switch", "LOCAL", "broadcast", runId, { hold: 260 });
    await animateBroadcast("switch", ["router"], "ARP GW?", runId, {
      toneMap: { router: "broadcast" },
      statusMap: { router: "GW IP" }
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("router", "Reply", "reply", runId, { hold: 280 });
    await travelAndVerify("router", "switch", "GW MAC", "reply", "RX", runId, {
      nodeType: "reply"
    });
    await flashNode("switch", "FWD", "reply", runId, { hold: 250 });
    await travelAndVerify("switch", "pc", "GW MAC", "reply", "OK", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("unicast", visualAction.trafficLabel);
  await flashNode("pc", "DATA", "unicast", runId, { hold: 240 });
  await travelAndVerify("pc", "switch", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("switch", "router", "DATA", "unicast", "FWD", runId);
  await travelAndVerify("router", "server", "FWD", "unicast", "RX", runId);
}

async function runDnsHttpsFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("unicast", visualAction.trafficLabel);
    await flashNode("pc", "DNS", "unicast", runId, { hold: 240 });
    await travelAndVerify("pc", "switch", "DNS?", "unicast", "RX", runId);
    await travelAndVerify("switch", "router", "DNS?", "unicast", "FWD", runId);
    await travelAndVerify("router", "server", "learn.lab", "unicast", "DNS RX", runId);
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("server", "A Rec", "reply", runId, { hold: 260 });
    await travelAndVerify("server", "router", "A 203.0.113.20", "reply", "RX", runId, {
      nodeType: "reply"
    });
    await travelAndVerify("router", "switch", "A 203.0.113.20", "reply", "FWD", runId, {
      nodeType: "reply"
    });
    await travelAndVerify("switch", "pc", "A 203.0.113.20", "reply", "IP OK", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("secure", visualAction.trafficLabel);
  await flashNode("pc", "HTTPS", "secure", runId, { hold: 240 });
  await travelAndVerify("pc", "switch", "TLS", "secure", "FWD", runId, {
    nodeType: "secure"
  });
  await travelAndVerify("switch", "router", "TLS", "secure", "FWD", runId, {
    nodeType: "secure"
  });
  await travelAndVerify("router", "server", "HTTPS GET", "secure", "200 OK", runId, {
    nodeType: "secure"
  });
  await flashNode("server", "Reply", "secure", runId, { hold: 220 });
  await travelAndVerify("server", "router", "HTTPS 200", "secure", "FWD", runId, {
    nodeType: "secure"
  });
  await travelAndVerify("router", "switch", "HTTPS 200", "secure", "FWD", runId, {
    nodeType: "secure"
  });
  await travelAndVerify("switch", "pc", "HTTPS 200", "secure", "Page", runId, {
    nodeType: "secure"
  });
}

async function runRemoteAccessFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "SSH", "secure", runId, { hold: 240 });
    await travelAndVerify("pc", "switch", "SSH KeyX", "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "router", "SSH KeyX", "secure", "Ready", runId, {
      nodeType: "secure"
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "Login", "secure", runId, { hold: 240 });
    await travelAndVerify("pc", "switch", "ENC{admin}", "secure", "Cipher", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "router", "ENC{show ip}", "secure", "Decrypt", runId, {
      nodeType: "secure"
    });
    await flashNode("router", "Auth OK", "secure", runId, { hold: 220 });
    await travelAndVerify("router", "switch", "ENC{OK}", "secure", "Cipher", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "pc", "ENC{OK}", "secure", "RX", runId, {
      nodeType: "secure"
    });
    return;
  }

  updateTrafficMode("warning", visualAction.trafficLabel);
  await flashNode("pc", "Telnet", "warning", runId, { hold: 240 });
  await travelAndVerify("pc", "switch", "admin:cisco123", "warning", "Readable", runId, {
    nodeType: "warning"
  });
  await travelAndVerify("switch", "router", "show run", "warning", "Exec", runId, {
    nodeType: "warning"
  });
  await travelAndVerify("router", "switch", "config text", "warning", "Readable", runId, {
    nodeType: "warning"
  });
  await travelAndVerify("switch", "pc", "config text", "warning", "RX", runId, {
    nodeType: "warning"
  });
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

function updateFlowIndicator(indicator) {
  if (!els.flowIndicator) return;

  if (!indicator) {
    els.flowIndicator.hidden = true;
    els.flowIndicator.className = "flow-indicator idle";
    els.flowIndicator.textContent = "";
    return;
  }

  els.flowIndicator.hidden = false;
  els.flowIndicator.className = `flow-indicator ${indicator.tone || "idle"}`;
  els.flowIndicator.textContent = indicator.label;
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

  await flashNode(devices[0], "TX", tone, runId, { hold: 240 });

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

  if (scenario.id === "dns-https") {
    await runDnsHttpsFlow(state.stepIndex, visualAction, runId);
    return;
  }

  if (scenario.id === "ssh-vs-telnet") {
    await runRemoteAccessFlow(state.stepIndex, visualAction, runId);
    return;
  }

  await runGenericVisualAction(visualAction, runId);
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
  updateMergeCableGeometry();
  clearVisualState();
  updateScenarioStatus("idle", "Waiting for action");
  updateTrafficMode("idle", "No traffic active");

  els.scenarioLabel.textContent = scenario.label;
  els.scenarioName.textContent = scenario.name;
  els.scenarioSubtitle.textContent = scenario.subtitle;
  els.stepBadge.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  updateFlowIndicator(step.flowIndicator);
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
    button.textContent = option.label;
    button.addEventListener("click", () => handleAnswer(index, button));
    els.actionButtons.appendChild(button);
  });
}

async function handleAnswer(index, button) {
  if (state.stepResolved) return;

  const scenario = getScenario();
  const step = scenario.steps[state.stepIndex];
  const option = step.options[index];

  if (option.correct) {
    state.stepResolved = true;
    button.classList.add("correct-btn");
    disableOptionButtons();
    els.explanationText.textContent = step.explanation;
    els.whyText.textContent = option.why;
    els.mobileFeedbackText.textContent = step.explanation;
    updateScenarioStatus("good", "Running flow");

    await runVisualAction(step.visualAction);

    if (state.stepIndex < scenario.steps.length - 1) {
      updateScenarioStatus("good", "Correct path");
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
  els.mobileFeedbackText.textContent = option.why;
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

  window.addEventListener("resize", () => {
    clearVisualState();
    updateMergeCableGeometry();

    if (!state.stepResolved) return;

    const scenario = getScenario();
    const step = scenario.steps[state.stepIndex];

    runVisualAction(step.visualAction).catch(() => {});
  });
}

renderScenarioTabs();
renderUseCases();
bindEvents();
loadScenario(0);
