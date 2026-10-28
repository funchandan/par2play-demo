import { TESTIMONIAL_FILMS, type TestimonialFilm } from "../data/films";
import { Photo } from "./Media";

function Slide({ film, active }: { film: TestimonialFilm; active: boolean }) {
  if (!active || film.src.trim() === "") {
    return (
      <div className={active ? "absolute inset-0" : "hidden"}>
        <Photo photo={film.poster} decorative priority={active} />
      </div>
    );
  }

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      poster={film.poster.jpg}
      src={film.src}
      muted
      playsInline
      loop
      autoPlay
      preload="none"
      aria-hidden="true"
    />
  );
}

export function FilmCarousel({ index }: { index: number }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {TESTIMONIAL_FILMS.map((film, filmIndex) => (
        <Slide key={film.id} film={film} active={filmIndex === index} />
      ))}
    </div>
  );
}
