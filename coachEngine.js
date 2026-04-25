(function () {
  function normalizeRaw(raw) {
    return (raw || "").trim();
  }

  function toComparableFlags(values) {
    const expanded = new Set();

    (values || []).forEach((value) => {
      if (typeof value !== "string" || !value) return;

      expanded.add(value);

      if (value.startsWith("--")) return;

      if (value.startsWith("-") && value.length > 1) {
        expanded.add(value.slice(1));
        return;
      }

      if (value.startsWith("/") && value.length > 1) {
        expanded.add(value.toUpperCase());
        expanded.add(value.slice(1).toUpperCase());
        return;
      }

      expanded.add(`-${value}`);
    });

    return Array.from(expanded);
  }

  function includesAll(values, required) {
    const comparableValues = toComparableFlags(values);
    return required.every((item) => comparableValues.includes(item));
  }

  function includesAny(values, required) {
    const comparableValues = toComparableFlags(values);
    return required.some((item) => comparableValues.includes(item));
  }

  function pathsMatch(state, left, right) {
    const manager = window.StateManager;

    if (manager && typeof manager.normalizePath === "function") {
      return manager.normalizePath(state, left) === manager.normalizePath(state, right);
    }

    if (String(state?.platform || "").toLowerCase() === "cmd") {
      return String(left || "").toLowerCase() === String(right || "").toLowerCase();
    }

    return String(left || "") === String(right || "");
  }

  function matchRule(rule, execution, state) {
    if (!rule) return false;

    if (typeof rule === "function") {
      return rule(execution, state);
    }

    const raw = normalizeRaw(execution.raw);
    const parsed = execution.primary || execution.command || {};

    if (rule instanceof RegExp) {
      return rule.test(raw);
    }

    if (typeof rule === "string") {
      return raw === rule;
    }

    if (rule.raw && rule.raw instanceof RegExp && !rule.raw.test(raw)) return false;
    if (rule.rawEquals && raw !== rule.rawEquals) return false;
    if (rule.command && parsed.command !== rule.command) return false;
    if (rule.mode && execution.mode !== rule.mode) return false;
    if (rule.flagsAll && !includesAll(parsed.flagsExpanded || [], rule.flagsAll)) return false;
    if (rule.flagsAny && !includesAny(parsed.flagsExpanded || [], rule.flagsAny)) return false;
    if (rule.argsIncludes && !includesAll(parsed.args || [], rule.argsIncludes)) return false;
    if (rule.argsAny && !includesAny(parsed.args || [], rule.argsAny)) return false;
    if (rule.pipelineCommands && !includesAll((execution.pipelineCommands || []), rule.pipelineCommands)) return false;
    if (rule.finalCwd && !pathsMatch(state, state.cwd, rule.finalCwd)) return false;
    if (rule.fileExists && !window.StateManager.getNode(state, rule.fileExists)) return false;
    if (rule.fileMissing && window.StateManager.getNode(state, rule.fileMissing)) return false;
    if (rule.connectionType && (!state.activeConnection || state.activeConnection.type !== rule.connectionType)) return false;
    if (rule.listenerPort) {
      const exists = state.listeners.some((listener) => String(listener.port) === String(rule.listenerPort));
      if (!exists) return false;
    }
    if (rule.postCheck && !rule.postCheck(execution, state)) return false;

    return true;
  }

  function getClassificationForExecution(execution) {
    if (execution.status === "invalid_command") return "invalid_command";
    if (execution.status === "syntax_error") return "wrong_syntax";
    if (execution.status === "runtime_error") return "wrong_context";
    return "wrong_context";
  }

  function getHintTierFromAttempts(attempts) {
    if (attempts <= 0) return 0;
    if (attempts === 1) return 0;
    if (attempts === 2) return 1;
    return 2;
  }

  function getCurrentLayer(state) {
    const layer = String(state?.currentLayer || "").toLowerCase();
    return ["network", "application", "exploitation"].includes(layer) ? layer : "application";
  }

  function getLayerHintLead(state) {
    switch (getCurrentLayer(state)) {
      case "network":
        return "Network layer: think about hosts, ports, reachability, and service exposure.";
      case "exploitation":
        return "Exploitation layer: think about how controlled input changes behavior or execution.";
      default:
        return "Application layer: focus on service behavior, files, requests, or parameters.";
    }
  }

  function withLayerLead(state, text) {
    const lead = getLayerHintLead(state);
    if (!text) return lead;
    if (String(text).toLowerCase().includes("layer:")) return text;
    return `${lead} ${text}`;
  }

  function getHint(step, level, state) {
    const hints = step.hints || [];
    const baseHint = hints.length
      ? hints[Math.min(level, hints.length - 1)]
      : "Stay on the current objective and use the output you already have.";
    return withLayerLead(state, baseHint);
  }

  function buildMistakeMessage(step, execution, state, attempts, classification, partial) {
    if (partial) {
      return {
        classification: partial.classification || "inefficient",
        feedback: partial.feedback,
        coach: withLayerLead(state, partial.coach || step.context || step.explanation),
        hint: partial.countsAsAttempt === false ? null : getHint(step, getHintTierFromAttempts(attempts), state),
        countsAsAttempt: partial.countsAsAttempt !== false
      };
    }

    if (classification === "invalid_command") {
      return {
        classification,
        feedback: "That command is not available in this training shell.",
        coach: withLayerLead(state, step.context || "Stay inside the tools and commands that fit the current platform and scenario."),
        hint: getHint(step, getHintTierFromAttempts(attempts), state),
        countsAsAttempt: true
      };
    }

    if (classification === "wrong_syntax") {
      const syntaxMessage = (execution.stderr || []).join(" ");
      if (/illegal port specification/i.test(syntaxMessage)) {
        return {
          classification,
          feedback: "The `-p` value is not a valid port list.",
          coach: withLayerLead(state, "Use `-p` with a port number or comma-separated port list, then put the target after that. For example, keep the port after `-p` and the host as the final argument."),
          hint: getHint(step, getHintTierFromAttempts(attempts), state),
          countsAsAttempt: true
        };
      }

      return {
        classification,
        feedback: "The command is recognized, but the syntax or arguments are off.",
        coach: withLayerLead(state, step.context || "Look at the flags, argument order, or the target you passed in."),
        hint: getHint(step, getHintTierFromAttempts(attempts), state),
        countsAsAttempt: true
      };
    }

    return {
      classification,
      feedback: "That command is valid, but it does not move this scenario forward.",
      coach: withLayerLead(state, step.context || "Use the current objective and the terminal output to decide the next practical move."),
      hint: getHint(step, getHintTierFromAttempts(attempts), state),
      countsAsAttempt: true
    };
  }

  function evaluateAttempt(step, execution, state, attempts) {
    const accepts = step.accepts || [];
    const partials = step.partials || [];
    const exploration = step.exploration || [];

    const matchedSuccess = accepts.find((rule) => matchRule(rule, execution, state));
    if (matchedSuccess) {
      return {
        success: true,
        classification: "success",
        feedback: matchedSuccess.feedback || step.successFeedback || "That command works for this task.",
        coach: withLayerLead(state, matchedSuccess.coach || step.explanation),
        hint: null,
        countsAsAttempt: false,
        advanceBy: matchedSuccess.advanceBy || 1
      };
    }

    const matchedExploration = exploration.find((entry) => matchRule(entry.match, execution, state));
    if (matchedExploration) {
      return {
        success: false,
        classification: matchedExploration.classification || "exploration",
        feedback: matchedExploration.feedback,
        coach: withLayerLead(state, matchedExploration.coach || step.context || step.explanation),
        hint: matchedExploration.hint ? withLayerLead(state, matchedExploration.hint) : null,
        countsAsAttempt: false
      };
    }

    const matchedPartial = partials.find((partial) => matchRule(partial.match, execution, state));
    const classification = getClassificationForExecution(execution);
    const result = buildMistakeMessage(step, execution, state, attempts, classification, matchedPartial);

    return {
      success: false,
      ...result
    };
  }

  window.CoachEngine = {
    evaluateAttempt,
    getHint,
    getHintTierFromAttempts,
    matchRule
  };
})();
