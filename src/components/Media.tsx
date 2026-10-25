import { useEffect, useRef, useSyncExternalStore } from "react";
import { getSoundSnapshot, registerHeroVideo, subscribeSound } from "../audio/soundtrack";
import { HERO_MEDIA, type ClipAsset } from "../data/media";
import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Photo({
  photo,
  className = "",
  priority = false,
}: {
  photo: PhotoAsset;
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture className="block h-full w-full">
      <source srcSet={photo.avif} type="image/avif" />
      <source srcSet={photo.webp} type="image/webp" />
      <img
        src={photo.jpg}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}

function useSoundLive() {
  return useSyncExternalStore(
    subscribeSound,
    () => getSoundSnapshot().live,
    () => false,
  );
}

export function HeroVideo() {
  const reduce = usePrefersReducedMotion();
  const live = useSoundLive();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduce) {
      registerHeroVideo(null);
      return;
    }
    const video = ref.current;
    registerHeroVideo(video);
    if (!video) return;
    const play = () => {
      video.play().catch(() => undefined);
    };
    play();
    const onVis = () => {
      if (document.hidden) video.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
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
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      poster={HERO_MEDIA.poster}
      autoPlay
      muted={!live}
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={HERO_MEDIA.webm} type="video/webm" />
      <source src={HERO_MEDIA.mp4} type="video/mp4" />
    </video>
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
