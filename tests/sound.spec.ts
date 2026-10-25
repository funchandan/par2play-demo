import { expect, test } from "@playwright/test";

type Probe = {
  live: boolean;
  muted: boolean;
  volume: number;
  paused: boolean;
  bgGain: number;
};

type HeroVideo = HTMLVideoElement & {
  webkitAudioDecodedByteCount: number;
  captureStream: () => MediaStream;
};

test("Sound starts in the click and the loop takes over past the hero", async ({ page }) => {
  const media: string[] = [];
  page.on("response", (response) => {
    const url = response.url();
    if (/hero\.(webm|mp4)|bg_loop_A\.(m4a|mp3)/.test(url)) {
      media.push(`${response.status()} ${url}`);
    }
  });

  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("par2play-sound", "on"));
  await page.reload();

  const sound = page.getByRole("button", { name: "Sound" });
  const video = page.locator("#hero video");
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => video.evaluate((node) => (node as HeroVideo).muted)).toBe(true);

  await sound.click();

  await expect
    .poll(async () =>
      video.evaluate((node) => {
        const element = node as HeroVideo;
        return {
          muted: element.muted,
          volume: element.volume,
          paused: element.paused,
          bytes: element.webkitAudioDecodedByteCount,
          src: element.currentSrc,
        };
      }),
    )
    .toMatchObject({ muted: false, volume: 1, paused: false });

  const audible = await video.evaluate((node) => {
    const element = node as HeroVideo;
    const stream = element.captureStream();
    return {
      bytes: element.webkitAudioDecodedByteCount,
      tracks: stream.getAudioTracks().length,
      src: element.currentSrc,
    };
  });
  expect(audible.bytes).toBeGreaterThan(0);
  expect(audible.tracks).toBeGreaterThan(0);
  expect(audible.src).toMatch(/\/par2play-demo\/media\/hero\.(webm|mp4)/);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const read = (window as Window & { __par2playSound?: () => Probe }).__par2playSound;
          return read?.().bgGain ?? 0;
        }),
      { timeout: 4000 },
    )
    .toBeGreaterThan(0.5);

  const probe = await page.evaluate(() => (window as Window & { __par2playSound?: () => Probe }).__par2playSound?.());
  expect(probe.live).toBe(true);
  expect(probe.muted).toBe(false);
  expect(media.some((line) => line.startsWith("200") || line.startsWith("206"))).toBe(true);
  expect(media.some((line) => line.startsWith("404"))).toBe(false);
});
