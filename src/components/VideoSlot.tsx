import type { PhotoAsset } from "../data/photos";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Photo } from "./Media";

/**
 * Poster until `src` is filled in. Videos stay muted, inline, and looping.
 * Reduced motion keeps the poster.
 */
export function VideoSlot({
  src,
  poster,
  className = "",
}: {
  src: string;
  poster: PhotoAsset;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const ready = src.trim().length > 0 && !reduce;

  return (
    <div className={`overflow-hidden bg-slate-100 ${className}`}>
      {ready ? (
        <video
          className="h-full w-full object-cover"
          poster={poster.jpg}
          src={src}
          muted
          playsInline
          loop
          autoPlay
          preload="none"
          aria-hidden="true"
        />
      ) : (
        <Photo photo={poster} />
      )}
    </div>
  );
}
