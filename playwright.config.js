const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/functional",
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [
    ["list"],
    ["./tests/functional/smoke-reporter.js"]
  ],
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "node tests/functional/static-server.js",
    url: "http://127.0.0.1:4173/index.html",
    reuseExistingServer: true,
    timeout: 30_000
  }
});
