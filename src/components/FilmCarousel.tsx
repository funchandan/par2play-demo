import { useEffect, useRef } from "react";
import { TESTIMONIAL_FILMS, type TestimonialFilm } from "../data/films";

function ActiveFilm({
  film,
  paused,
  onEnded,
}: {
  film: TestimonialFilm;
  paused: boolean;
  onEnded: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) {
      video.pause();
      return;
    }
    void video.play().catch(() => undefined);
  }, [paused, film.id]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-center"
      poster={film.poster}
      muted
      playsInline
      preload="auto"
      autoPlay={!paused}
      onEnded={onEnded}
    >
      <source src={film.srcMobile} type="video/mp4" media="(max-width: 767px)" />
      <source src={film.src} type="video/mp4" />
    </video>
  );
}

export function FilmCarousel({
  index,
  paused,
  reduce,
  onEnded,
}: {
  index: number;
  paused: boolean;
  reduce: boolean;
  onEnded: () => void;
}) {
  const film = TESTIMONIAL_FILMS[index] ?? TESTIMONIAL_FILMS[0];
  if (!film) return null;

  if (reduce) {
    return <img src={film.poster} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />;
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <ActiveFilm key={film.id} film={film} paused={paused} onEnded={onEnded} />
    </div>
  );
}
