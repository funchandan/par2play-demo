import { chromium } from "@playwright/test";
import { preview } from "vite";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROUTES = ["", "membership/", "coaching/", "juniors/", "events/", "tournament/", "privacy-policy/"];
const port = 4193;
const server = await preview({ preview: { port, strictPort: true, host: "127.0.0.1" } });
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

for (const route of ROUTES) {
  await page.goto(`http://127.0.0.1:${port}/${route}`, { waitUntil: "networkidle" });
  await page.locator("h1").first().waitFor();
  const html = "<!doctype html>\n" + (await page.content());
  const file = route === "" ? resolve("dist/index.html") : resolve("dist", route, "index.html");
  await writeFile(file, html);
  const words = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  console.log("prerendered", route || "/", words, "words");
}

await browser.close();
await new Promise((done) => server.httpServer.close(done));
