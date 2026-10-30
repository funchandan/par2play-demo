import { BG_LOOP } from "../data/media";

const STORAGE_KEY = "par2play-sound";
const FADE_SECONDS = 1;

type Snapshot = {
  enabled: boolean;
  live: boolean;
};

type Listener = () => void;

let enabled = false;
let live = false;
let heroInView = true;
let video: HTMLVideoElement | null = null;
let ctx: AudioContext | null = null;
let bgGain: GainNode | null = null;
let bgSource: AudioBufferSourceNode | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let videoFade = 0;
let bootToken = 0;
let armed = false;
const listeners = new Set<Listener>();

function readStoredChoice(): "on" | "off" | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "on" || value === "off") return value;
    return null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function remember(next: boolean) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* Private mode can block storage. The button still works for this visit. */
  }
  emit();
}

export function getSoundSnapshot(): Snapshot {
  return { enabled, live };
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function disarm() {
  if (!armed) return;
  armed = false;
  emit();
}

function onVideoTap(event: Event) {
  if (!event.isTrusted || live) return;
  activateSound();
}

export function registerHeroVideo(element: HTMLVideoElement | null) {
  if (video && video !== element) video.removeEventListener("click", onVideoTap);
  video = element;
  if (!element) {
    bootToken += 1;
    return;
  }
  element.muted = true;
  element.volume = 0;
  element.addEventListener("click", onVideoTap);
  if (live) {
    element.muted = false;
    element.volume = heroInView ? 1 : 0;
  }
}

export function setHeroInView(inView: boolean) {
  if (heroInView === inView) return;
  heroInView = inView;
  if (live) applyFade();
}

export function bindHeroWatch(id: string, root: Element | null) {
  const hero = document.getElementById(id);
  if (!hero) return () => undefined;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      setHeroInView(entry.isIntersecting);
    },
    { root, threshold: 0 },
  );
  observer.observe(hero);
  return () => observer.disconnect();
}

function syncHeroInView() {
  const element = video;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  heroInView = rect.bottom > 0 && rect.top < height;
}

function heroAudible() {
  return live && video !== null && heroInView;
}

function bgAudible() {
  if (!live) return false;
  if (!video) return true;
  return !heroInView;
}

function applyFade() {
  fadeVideo(heroAudible() ? 1 : 0);
  fadeBg(bgAudible() ? 1 : 0);
}

function fadeVideo(target: number) {
  const element = video;
  if (!element) return;
  const from = element.volume;
  const started = performance.now();
  const token = ++videoFade;
  const step = (now: number) => {
    if (token !== videoFade || video !== element) return;
    const progress = Math.min(1, (now - started) / (FADE_SECONDS * 1000));
    element.volume = from + (target - from) * progress;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function fadeBg(target: number) {
  if (!ctx || !bgGain) return;
  const now = ctx.currentTime;
  const gain = bgGain.gain;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(gain.value, now);
  gain.linearRampToValueAtTime(target, now + FADE_SECONDS);
}

function startBg(audio: AudioBuffer) {
  if (!ctx || !bgGain || !live) return;
  if (bgSource) {
    try {
      bgSource.stop();
    } catch {
      /* Already stopped. */
    }
    bgSource = null;
  }
  const source = ctx.createBufferSource();
  source.buffer = audio;
  source.loop = true;
  source.connect(bgGain);
  source.start();
  bgSource = source;
}

async function decodeLoop(context: AudioContext, url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(url);
  const data = await response.arrayBuffer();
  return context.decodeAudioData(data.slice(0));
}

function ensureContext() {
  const AudioCtx = window.AudioContext;
  if (!ctx) ctx = new AudioCtx();
  if (!bgGain) {
    bgGain = ctx.createGain();
    bgGain.gain.value = 0;
    bgGain.connect(ctx.destination);
  }
  bindVisibility();
}

function ensureLoop() {
  if (!ctx || !live) return;
  if (buffer) {
    startBg(buffer);
    applyFade();
    return;
  }
  if (loading) return;
  const context = ctx;
  loading = (async () => {
    try {
      buffer = await decodeLoop(context, BG_LOOP.m4a);
    } catch (error) {
      console.error("Background loop failed to decode", BG_LOOP.m4a, error);
      try {
        buffer = await decodeLoop(context, BG_LOOP.mp3);
      } catch (fallbackError) {
        console.error("Background loop failed to decode", BG_LOOP.mp3, fallbackError);
        throw fallbackError;
      }
    }
    if (!live) return;
    startBg(buffer);
    applyFade();
  })().catch(() => {
    loading = null;
  });
}

function onVisibility() {
  if (!ctx || !live) return;
  if (document.hidden) void ctx.suspend();
  else void ctx.resume();
}

let visibilityBound = false;

function bindVisibility() {
  if (visibilityBound) return;
  visibilityBound = true;
  document.addEventListener("visibilitychange", onVisibility);
}

/** Reduced motion has no hero video. Sound stays off until a sound control is tapped. */
export function bootAmbient() {
  return;
}

/**
 * Starts playback inside one user gesture. Unmute, set the volume, then
 * play() before any await, so the browser still treats it as activation.
 */
export function activateSound() {
  bootToken += 1;
  disarm();
  ensureContext();
  void ctx?.resume();
  syncHeroInView();
  live = true;
  const element = video;
  if (element) {
    element.muted = false;
    element.volume = heroInView ? 1 : 0;
    const played = element.play();
    if (played) {
      played.catch((error: unknown) => {
        console.error("Hero sound failed to play", error);
      });
    }
  }
  remember(true);
  applyFade();
  ensureLoop();
}

export function silenceSound() {
  bootToken += 1;
  disarm();
  live = false;
  videoFade += 1;
  if (video) {
    video.muted = true;
    video.volume = 0;
  }
  if (bgGain && ctx) {
    const now = ctx.currentTime;
    bgGain.gain.cancelScheduledValues(now);
    bgGain.gain.setValueAtTime(0, now);
  }
  if (bgSource) {
    try {
      bgSource.stop();
    } catch {
      /* Already stopped. */
    }
    bgSource = null;
  }
  void ctx?.suspend();
  remember(false);
}

export function toggleSound() {
  if (!live) activateSound();
  else silenceSound();
}

export type SoundProbe = {
  live: boolean;
  muted: boolean;
  volume: number;
  paused: boolean;
  bgGain: number;
  armed: boolean;
  stored: "on" | "off" | null;
};

declare global {
  interface Window {
    __par2playSound?: () => SoundProbe;
  }
}

function readProbe(): SoundProbe {
  return {
    live,
    muted: video?.muted ?? true,
    volume: video?.volume ?? 0,
    paused: video?.paused ?? true,
    bgGain: bgGain?.gain.value ?? 0,
    armed,
    stored: readStoredChoice(),
  };
}

if (typeof window !== "undefined") {
  window.__par2playSound = readProbe;
}
