import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * Muted inline video. The mobile file is used under 768px.
 * Reduced motion shows the poster. Off-screen clips are not loaded.
 * When pausable, a transparent control over the picture toggles playback.
 */
export function VideoSlot({
  src,
  srcMobile,
  poster,
  className = "",
  pausable = false,
}: {
  src: string;
  srcMobile?: string;
  poster: string;
  className?: string;
  pausable?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [paused, setPaused] = useState(false);
  const ready = src.trim().length > 0 && !reduce && near;

  useEffect(() => {
    const node = box.current;
    if (!node || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;
    if (paused) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [paused, ready]);

  return (
    <div ref={box} className={`relative overflow-hidden bg-[#020806] ${className}`}>
      {ready ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          poster={poster}
          muted
          playsInline
          loop
          autoPlay={!paused}
          preload="none"
          aria-hidden="true"
        >
          {srcMobile ? <source src={srcMobile} type="video/mp4" media="(max-width: 767px)" /> : null}
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <img src={poster} alt="" className="h-full w-full object-cover" />
      )}
      {pausable && ready ? (
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-default bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          aria-pressed={paused}
          aria-label={paused ? "Play video" : "Pause video"}
          onClick={() => setPaused((value) => !value)}
        />
      ) : null}
    </div>
  );
}
