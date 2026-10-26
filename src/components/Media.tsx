import { useEffect, useRef, useState } from "react";
import { bootAmbient, registerHeroVideo } from "../audio/soundtrack";
import { HERO_MEDIA, type ClipAsset } from "../data/media";
import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Photo({
  photo,
  className = "",
  priority = false,
  decorative = false,
}: {
  photo: PhotoAsset;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  return (
    <picture className="block h-full w-full">
      <source srcSet={photo.avif} type="image/avif" />
      <source srcSet={photo.webp} type="image/webp" />
      <img
        src={photo.jpg}
        alt={decorative ? "" : photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}

const FRAME_W = 1920;
const FRAME_H = 1080;
/** Green Par2Play wordmark is on screen from here until the film loops. */
const END_CARD_AT = 26.45;
/**
 * The wordmark spans about x 0.27–0.73 of the 16:9 frame. Padding that to
 * 0.52 of the frame, then sizing it to 92% of the hero width, keeps the
 * whole mark inside a portrait phone. When that scale is larger than
 * object-cover (desktop), cover already shows the mark and stays in use.
 */
const WORDMARK_SPAN = 0.52;
const WORDMARK_TARGET = 0.92;

type EndCardFit = { width: number; height: number };

function endCardFit(box: { width: number; height: number }): EndCardFit | null {
  if (box.width <= 0 || box.height <= 0) return null;
  const cover = Math.max(box.width / FRAME_W, box.height / FRAME_H);
  const fitted = (WORDMARK_TARGET * box.width) / (WORDMARK_SPAN * FRAME_W);
  if (fitted >= cover - 0.001) return null;
  return { width: Math.round(FRAME_W * fitted), height: Math.round(FRAME_H * fitted) };
}

export function HeroVideo() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [fit, setFit] = useState<EndCardFit | null>(null);

  useEffect(() => {
    if (reduce) {
      registerHeroVideo(null);
      bootAmbient();
      return;
    }
    const video = ref.current;
    registerHeroVideo(video);
    if (!video) return;
    const frame = video.parentElement;
    const syncFit = () => {
      const onCard = video.currentTime >= END_CARD_AT;
      const box = frame?.getBoundingClientRect();
      const next = onCard && box ? endCardFit(box) : null;
      setFit((current) => {
        if (current === null && next === null) return current;
        if (current && next && current.width === next.width && current.height === next.height) return current;
        return next;
      });
    };
    const onVis = () => {
      if (document.hidden) video.pause();
      else void video.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVis);
    video.addEventListener("timeupdate", syncFit);
    video.addEventListener("seeked", syncFit);
    const observer = new ResizeObserver(syncFit);
    if (frame) observer.observe(frame);
    syncFit();
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      video.removeEventListener("timeupdate", syncFit);
      video.removeEventListener("seeked", syncFit);
      observer.disconnect();
      video.pause();
      registerHeroVideo(null);
    };
  }, [reduce]);

  if (reduce) {
    return (
      <img
        src={HERO_MEDIA.poster}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-black ${fit ? "opacity-100" : "opacity-0"}`}
      />
      <video
        ref={ref}
        className={
          fit
            ? "absolute max-w-none bg-black object-fill"
            : "absolute inset-0 h-full w-full object-cover"
        }
        style={
          fit
            ? {
                width: fit.width,
                height: fit.height,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }
            : undefined
        }
        poster={HERO_MEDIA.poster}
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={HERO_MEDIA.webm} type="video/webm" />
        <source src={HERO_MEDIA.mp4} type="video/mp4" />
      </video>
    </>
  );
}

export function ClipTile({
  clip,
  className = "",
  caption,
}: {
  clip: ClipAsset;
  className?: string;
  caption?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { rootMargin: "120px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <figure className={`overflow-hidden rounded-2xl bg-slate-950 ${className}`}>
      {reduce ? (
        <img src={clip.poster} alt={clip.label} className="aspect-video w-full object-cover" />
      ) : (
        <video
          ref={ref}
          className="aspect-video w-full object-cover"
          poster={clip.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-label={clip.label}
        >
          <source src={clip.webm} type="video/webm" />
          <source src={clip.mp4} type="video/mp4" />
        </video>
      )}
      <figcaption className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
        {caption ?? clip.caption}
      </figcaption>
    </figure>
  );
}
