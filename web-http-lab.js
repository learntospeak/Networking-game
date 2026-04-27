const { scenarios = [], useCases = [] } = window.WebHttpFlowData || {};

const els = {
  stageDisclosure: document.getElementById("httpStageDisclosure"),
  stageSummaryTitle: document.getElementById("httpStageSummaryTitle"),
  stageSummaryNote: document.getElementById("httpStageSummaryNote"),
  stageSummaryBadge: document.getElementById("httpStageSummaryBadge"),
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
  visualRunId: 0,
  unlockedScenarioCount: 1,
  completedScenarios: new Set()
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

function requestLabel(visualAction, fallback) {
  return visualAction.requestLabel || fallback;
}

function responseLabel(visualAction, fallback) {
  return visualAction.responseLabel || fallback;
}

function pageLabel(visualAction, fallback) {
  return visualAction.pageLabel || fallback;
}

async function runHttpPageFlow(stepIndex, visualAction, runId) {
  const request = requestLabel(visualAction, "GET /profile");

  if (stepIndex === 0) {
    updateTrafficMode("warning", visualAction.trafficLabel);
    await flashNode("pc", "Open", "warning", runId, { hold: 260 });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("warning", visualAction.trafficLabel);
    await flashNode("pc", "GET", "warning", runId, { hold: 300 });
    return;
  }

  if (stepIndex === 2) {
    updateTrafficMode("warning", visualAction.trafficLabel);
    await flashNode("pc", "Send", "warning", runId, { hold: 220 });
    await travelAndVerify("pc", "switch", request, "warning", "FWD", runId, {
      nodeType: "warning"
    });
    await travelAndVerify("switch", "router", request, "warning", "FWD", runId, {
      nodeType: "warning"
    });
    await travelAndVerify("router", "server", request, "warning", "GET RX", runId, {
      nodeType: "warning"
    });
    return;
  }

  if (stepIndex === 3) {
    updateTrafficMode("warning", visualAction.trafficLabel);
    await flashNode("server", "Process", "warning", runId, { hold: 320 });
    return;
  }

  if (stepIndex === 4) {
    updateTrafficMode("reply", visualAction.trafficLabel);
    await flashNode("server", "200", "reply", runId, { hold: 220 });
    await travelAndVerify("server", "router", responseLabel(visualAction, "200 OK"), "reply", "FWD", runId, {
      nodeType: "reply"
    });
    await travelAndVerify("router", "switch", responseLabel(visualAction, "200 OK"), "reply", "FWD", runId, {
      nodeType: "reply"
    });
    await travelAndVerify("switch", "pc", responseLabel(visualAction, "200 OK"), "reply", "200 RX", runId, {
      nodeType: "reply"
    });
    return;
  }

  updateTrafficMode("reply", visualAction.trafficLabel);
  await flashNode("pc", pageLabel(visualAction, "Page"), "reply", runId, { hold: 320 });
}

async function runHttpsPageFlow(stepIndex, visualAction, runId) {
  const request = requestLabel(visualAction, "LOCKED GET");
  const response = responseLabel(visualAction, "LOCKED 200");

  if (stepIndex === 0) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "Open", "secure", runId, { hold: 260 });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "GET", "secure", runId, { hold: 300 });
    return;
  }

  if (stepIndex === 2) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "Lock", "secure", runId, { hold: 220 });
    await travelAndVerify("pc", "switch", request, "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "router", request, "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("router", "server", request, "secure", "TLS RX", runId, {
      nodeType: "secure"
    });
    return;
  }

  if (stepIndex === 3) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("server", "Process", "secure", runId, { hold: 320 });
    return;
  }

  if (stepIndex === 4) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("server", "200", "secure", runId, { hold: 220 });
    await travelAndVerify("server", "router", response, "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("router", "switch", response, "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "pc", response, "secure", "Page RX", runId, {
      nodeType: "secure"
    });
    return;
  }

  updateTrafficMode("secure", visualAction.trafficLabel);
  await flashNode("pc", pageLabel(visualAction, "Secure Page"), "secure", runId, { hold: 320 });
}

async function runHttpHttpsCompareFlow(stepIndex, visualAction, runId) {
  if (stepIndex === 0) {
    updateTrafficMode("warning", visualAction.trafficLabel);
    await flashNode("pc", "HTTP", "warning", runId, { hold: 220 });
    await travelAndVerify("pc", "switch", requestLabel(visualAction, "GET /profile"), "warning", "Visible", runId, {
      nodeType: "warning"
    });
    await travelAndVerify("switch", "router", requestLabel(visualAction, "GET /profile"), "warning", "FWD", runId, {
      nodeType: "warning"
    });
    await travelAndVerify("router", "server", requestLabel(visualAction, "GET /profile"), "warning", "Readable", runId, {
      nodeType: "warning"
    });
    return;
  }

  if (stepIndex === 1) {
    updateTrafficMode("secure", visualAction.trafficLabel);
    await flashNode("pc", "HTTPS", "secure", runId, { hold: 220 });
    await travelAndVerify("pc", "switch", requestLabel(visualAction, "LOCKED GET"), "secure", "Locked", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("switch", "router", requestLabel(visualAction, "LOCKED GET"), "secure", "FWD", runId, {
      nodeType: "secure"
    });
    await travelAndVerify("router", "server", requestLabel(visualAction, "LOCKED GET"), "secure", "Cipher", runId, {
      nodeType: "secure"
    });
    return;
  }

  updateTrafficMode("reply", visualAction.trafficLabel);
  await flashNode("server", "200", "reply", runId, { hold: 220 });
  await travelAndVerify("server", "router", responseLabel(visualAction, "200 OK"), "reply", "FWD", runId, {
    nodeType: "reply"
  });
  await travelAndVerify("router", "switch", responseLabel(visualAction, "200 OK"), "reply", "FWD", runId, {
    nodeType: "reply"
  });
  await travelAndVerify("switch", "pc", responseLabel(visualAction, "200 OK"), "reply", "Same page", runId, {
    nodeType: "reply"
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

function isScenarioUnlocked(index) {
  return index < state.unlockedScenarioCount;
}

function isScenarioComplete(index) {
  const scenario = scenarios[index];
  return Boolean(scenario && state.completedScenarios.has(scenario.id));
}

function unlockNextScenario(index) {
  const scenario = scenarios[index];
  if (!scenario) return;

  state.completedScenarios.add(scenario.id);
  state.unlockedScenarioCount = Math.max(
    state.unlockedScenarioCount,
    Math.min(scenarios.length, index + 2)
  );
}

function updateStageSummary() {
  const scenario = getScenario();
  if (!scenario) return;

  if (els.stageSummaryTitle) {
    els.stageSummaryTitle.textContent = `Stage ${state.scenarioIndex + 1}: ${scenario.name}`;
  }

  if (els.stageSummaryBadge) {
    els.stageSummaryBadge.textContent = `Stage ${state.scenarioIndex + 1} of ${scenarios.length}`;
  }

  if (els.stageSummaryNote) {
    if (isScenarioComplete(state.scenarioIndex) && state.scenarioIndex < scenarios.length - 1) {
      els.stageSummaryNote.textContent = `Complete. Stage ${state.scenarioIndex + 2} is now unlocked.`;
    } else if (isScenarioComplete(state.scenarioIndex)) {
      els.stageSummaryNote.textContent = "Complete. All stages unlocked.";
    } else {
      els.stageSummaryNote.textContent = scenario.note;
    }
  }
}

function renderScenarioTabs() {
  els.scenarioTabs.innerHTML = "";

  scenarios.forEach((scenario, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-tab";
    button.innerHTML = `
      <span class="scenario-tab-stage">Stage ${index + 1}</span>
      <span class="scenario-tab-title">${scenario.name}</span>
      <span class="scenario-tab-note">${scenario.note}</span>
      <span class="scenario-tab-status"></span>
    `;
    button.addEventListener("click", () => loadScenario(index));
    els.scenarioTabs.appendChild(button);
  });

  updateScenarioTabs();
}

function updateScenarioTabs() {
  const buttons = Array.from(els.scenarioTabs.querySelectorAll("button"));

  buttons.forEach((button, index) => {
    const unlocked = isScenarioUnlocked(index);
    const complete = isScenarioComplete(index);
    const active = index === state.scenarioIndex;
    const note = button.querySelector(".scenario-tab-note");
    const status = button.querySelector(".scenario-tab-status");

    button.disabled = !unlocked;
    button.classList.toggle("active", active);
    button.classList.toggle("is-locked", !unlocked);
    button.classList.toggle("is-complete", complete);

    if (note) {
      note.textContent = unlocked
        ? scenarios[index].note
        : "Complete the previous stage to unlock this path.";
    }

    if (status) {
      status.textContent = !unlocked
        ? "Locked"
        : complete
          ? "Complete"
          : active
            ? "Current"
            : "Available";
    }
  });

  updateStageSummary();
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

  if (scenario.id === "http-page") {
    await runHttpPageFlow(state.stepIndex, visualAction, runId);
    return;
  }

  if (scenario.id === "https-page") {
    await runHttpsPageFlow(state.stepIndex, visualAction, runId);
    return;
  }

  if (scenario.id === "http-https-compare") {
    await runHttpHttpsCompareFlow(state.stepIndex, visualAction, runId);
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
  updateFlowIndicator(step.flowIndicator || step.visualAction?.flowIndicator);
  els.mobileScenarioName.textContent = scenario.name;
  els.mobileStepBadge.textContent = `Step ${state.stepIndex + 1} of ${scenario.steps.length}`;
  els.stepPrompt.textContent = step.prompt;
  els.explanationText.textContent = "Select the action that matches the next web request move.";
  els.whyText.textContent = "The right answer will light the request path so the browser-to-server flow stays visible.";
  els.mobileFeedbackText.textContent = "Pick the next web request move. Feedback will stay pinned here on mobile.";
  els.scenarioSummary.textContent = scenario.summary;
  els.nextStepBtn.hidden = true;
  els.nextStepBtn.textContent = "Next Step";
  updateStageSummary();

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
      unlockNextScenario(state.scenarioIndex);
      updateScenarioTabs();
      updateScenarioStatus("good", state.scenarioIndex < scenarios.length - 1 ? "Stage complete" : "Lab complete");
      els.nextStepBtn.hidden = false;
      els.nextStepBtn.textContent = state.scenarioIndex < scenarios.length - 1 ? "Next Stage" : "Restart Stage";
      els.whyText.textContent = state.scenarioIndex < scenarios.length - 1
        ? `${scenario.summary} Continue to Stage ${state.scenarioIndex + 2} when you're ready.`
        : scenario.summary;
      els.mobileFeedbackText.textContent = state.scenarioIndex < scenarios.length - 1
        ? `Stage complete. Continue to Stage ${state.scenarioIndex + 2}.`
        : step.explanation;
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
  if (!isScenarioUnlocked(index)) return;

  state.scenarioIndex = index;
  state.stepIndex = 0;
  if (els.stageDisclosure) {
    els.stageDisclosure.open = false;
  }
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

  if (state.scenarioIndex < scenarios.length - 1 && isScenarioComplete(state.scenarioIndex)) {
    loadScenario(state.scenarioIndex + 1);
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
    feedback.textContent = "Choose the best match.";

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
