import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 60_000,
  use: {
    baseURL: "http://127.0.0.1:4180/par2play-demo/",
    ...devices["Desktop Chrome"],
    channel: "chrome",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4180 --strictPort",
    port: 4180,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
