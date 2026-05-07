const fs = require("fs");
const path = require("path");

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

class SmokeReporter {
  constructor() {
    this.results = [];
  }

  onTestEnd(test, result) {
    const attachment = (result.attachments || []).find((item) => item.name === "smoke-report-data");
    let smokeData = null;

    if (attachment && attachment.body) {
      try {
        smokeData = JSON.parse(Buffer.from(attachment.body).toString("utf8"));
      } catch (error) {
        smokeData = {
          page: test.title,
          warnings: [`Failed to parse smoke-report-data attachment: ${error.message}`]
        };
      }
    }

    this.results.push({
      title: test.title,
      status: result.status,
      durationMs: result.duration,
      errors: (result.errors || []).map((error) => error.message || String(error)),
      smokeData
    });
  }

  async onEnd() {
    const reportsDir = path.join(process.cwd(), "reports");
    fs.mkdirSync(reportsDir, { recursive: true });

    const generatedAt = new Date().toISOString();
    const summary = {
      generatedAt,
      passed: this.results.filter((item) => item.status === "passed").length,
      failed: this.results.filter((item) => item.status !== "passed").length,
      total: this.results.length
    };

    const payload = {
      summary,
      results: this.results
    };

    const labHealth = {
      pagesTested: [],
      commandsTested: [],
      acceptedVariations: [],
      rejectedReasonableAlternatives: [],
      textNoiseFailures: [],
      modalBlockingFailures: [],
      mobileFailures: []
    };

    const mergeHealth = (source = {}) => {
      Object.keys(labHealth).forEach((key) => {
        const values = Array.isArray(source[key]) ? source[key] : [];
        values.forEach((value) => {
          const text = String(value || "").trim();
          if (text && !labHealth[key].includes(text)) {
            labHealth[key].push(text);
          }
        });
      });
    };

    this.results.forEach((result) => mergeHealth(result.smokeData?.labHealth));
    payload.labHealth = labHealth;

    fs.writeFileSync(
      path.join(reportsDir, "smoke-report.json"),
      JSON.stringify(payload, null, 2),
      "utf8"
    );

    const html = [
      "<!doctype html>",
      "<html lang=\"en\">",
      "<head>",
      "  <meta charset=\"utf-8\">",
      "  <title>Smoke Report</title>",
      "  <style>",
      "    body { font-family: Arial, sans-serif; margin: 24px; color: #1f2937; background: #f8fafc; }",
      "    h1, h2 { margin: 0 0 12px; }",
      "    .summary { display: flex; gap: 12px; margin: 0 0 24px; flex-wrap: wrap; }",
      "    .card { background: white; border: 1px solid #dbe2ea; border-radius: 10px; padding: 12px 16px; }",
      "    .result { background: white; border: 1px solid #dbe2ea; border-radius: 12px; padding: 16px; margin: 0 0 16px; }",
      "    .pass { border-left: 6px solid #16a34a; }",
      "    .fail { border-left: 6px solid #dc2626; }",
      "    table { width: 100%; border-collapse: collapse; margin: 12px 0; }",
      "    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; vertical-align: top; }",
      "    th { background: #f3f4f6; }",
      "    ul { margin: 8px 0 0 18px; }",
      "    code { background: #eff6ff; padding: 2px 4px; border-radius: 4px; }",
      "  </style>",
      "</head>",
      "<body>",
      `  <h1>Functional Smoke Report</h1>`,
      `  <p>Generated at <code>${escapeHtml(generatedAt)}</code></p>`,
      "  <div class=\"summary\">",
      `    <div class=\"card\"><strong>Total</strong><div>${summary.total}</div></div>`,
      `    <div class=\"card\"><strong>Passed</strong><div>${summary.passed}</div></div>`,
      `    <div class=\"card\"><strong>Failed</strong><div>${summary.failed}</div></div>`,
      "  </div>"
    ];

    this.results.forEach((result) => {
      const smokeData = result.smokeData || {};
      const checks = Array.isArray(smokeData.checks) ? smokeData.checks : [];
      const commandResults = Array.isArray(smokeData.commandResults) ? smokeData.commandResults : [];
      const warnings = Array.isArray(smokeData.warnings) ? smokeData.warnings : [];
      const consoleErrors = Array.isArray(smokeData.consoleErrors) ? smokeData.consoleErrors : [];
      const pageErrors = Array.isArray(smokeData.pageErrors) ? smokeData.pageErrors : [];

      html.push(
        `<section class="result ${result.status === "passed" ? "pass" : "fail"}">`,
        `  <h2>${escapeHtml(smokeData.page || result.title)}</h2>`,
        `  <p><strong>Status:</strong> ${escapeHtml(result.status)} | <strong>Duration:</strong> ${result.durationMs}ms</p>`
      );

      if (smokeData.url) {
        html.push(`  <p><strong>URL:</strong> <code>${escapeHtml(smokeData.url)}</code></p>`);
      }

      if (checks.length) {
        html.push("  <table><thead><tr><th>Check</th><th>Status</th><th>Details</th></tr></thead><tbody>");
        checks.forEach((check) => {
          html.push(
            "    <tr>",
            `      <td>${escapeHtml(check.name)}</td>`,
            `      <td>${escapeHtml(check.ok ? "pass" : "fail")}</td>`,
            `      <td>${escapeHtml(check.details || "")}</td>`,
            "    </tr>"
          );
        });
        html.push("  </tbody></table>");
      }

      if (commandResults.length) {
        html.push("  <table><thead><tr><th>Command</th><th>Accepted</th><th>Scenario Progress</th><th>Notes</th></tr></thead><tbody>");
        commandResults.forEach((command) => {
          html.push(
            "    <tr>",
            `      <td><code>${escapeHtml(command.command)}</code></td>`,
            `      <td>${escapeHtml(String(Boolean(command.accepted)))}</td>`,
            `      <td>${escapeHtml(String(Boolean(command.progressed)))}</td>`,
            `      <td>${escapeHtml(command.notes || "")}</td>`,
            "    </tr>"
          );
        });
        html.push("  </tbody></table>");
      }

      if (warnings.length) {
        html.push("  <p><strong>Warnings</strong></p><ul>");
        warnings.forEach((warning) => {
          html.push(`    <li>${escapeHtml(warning)}</li>`);
        });
        html.push("  </ul>");
      }

      if (consoleErrors.length) {
        html.push("  <p><strong>Console Errors</strong></p><ul>");
        consoleErrors.forEach((error) => {
          html.push(`    <li>${escapeHtml(error)}</li>`);
        });
        html.push("  </ul>");
      }

      if (pageErrors.length || result.errors.length) {
        html.push("  <p><strong>Page/Test Errors</strong></p><ul>");
        pageErrors.forEach((error) => {
          html.push(`    <li>${escapeHtml(error)}</li>`);
        });
        result.errors.forEach((error) => {
          html.push(`    <li>${escapeHtml(error)}</li>`);
        });
        html.push("  </ul>");
      }

      html.push("</section>");
    });

    html.push("</body>", "</html>");
    fs.writeFileSync(path.join(reportsDir, "smoke-report.html"), html.join("\n"), "utf8");

    console.log("\nFunctional smoke summary");
    console.log(`- Total tests: ${summary.total}`);
    console.log(`- Passed: ${summary.passed}`);
    console.log(`- Failed: ${summary.failed}`);
    console.log(`- JSON report: ${path.join("reports", "smoke-report.json")}`);
    console.log(`- HTML report: ${path.join("reports", "smoke-report.html")}`);
    console.log("\nLab health summary");
    console.log(`- Pages tested: ${labHealth.pagesTested.join(", ") || "none recorded"}`);
    console.log(`- Commands tested: ${labHealth.commandsTested.join(", ") || "none recorded"}`);
    console.log(`- Accepted variations: ${labHealth.acceptedVariations.join(", ") || "none recorded"}`);
    console.log(`- Rejected reasonable alternatives: ${labHealth.rejectedReasonableAlternatives.join(", ") || "none"}`);
    console.log(`- Text-noise failures: ${labHealth.textNoiseFailures.join(", ") || "none"}`);
    console.log(`- Modal/blocking failures: ${labHealth.modalBlockingFailures.join(", ") || "none"}`);
    console.log(`- Mobile failures: ${labHealth.mobileFailures.join(", ") || "none"}`);
  }
}

module.exports = SmokeReporter;
