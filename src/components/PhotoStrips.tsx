import { COMMUNITY_GALLERY, EVENT_GALLERY, EVENT_HERO, type GalleryPhoto } from "../data/gallery";

function Photo({ photo, eager = false, sizes }: { photo: GalleryPhoto; eager?: boolean; sizes: string }) {
  return (
    <img
      src={photo.src800}
      srcSet={`${photo.src800} 800w, ${photo.src1600} 1600w`}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

export function EventGallery() {
  return (
    <ul className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 @3xl:mx-0 @3xl:grid @3xl:grid-cols-3 @3xl:overflow-visible @3xl:px-0">
      {EVENT_GALLERY.map((photo) => (
        <li key={photo.id} className="aspect-[3/2] w-[78%] shrink-0 snap-start overflow-hidden @3xl:w-auto">
          <Photo photo={photo} sizes="(min-width: 48rem) 30vw, 78vw" />
        </li>
      ))}
    </ul>
  );
}

export function EventHero() {
  return (
    <header className="relative isolate min-h-[18rem] overflow-hidden bg-[#020806] text-white @3xl:min-h-[24rem]">
      <img
        src={EVENT_HERO.src800}
        srcSet={`${EVENT_HERO.src800} 800w, ${EVENT_HERO.src1600} 1600w`}
        sizes="100vw"
        alt=""
        width={EVENT_HERO.width}
        height={EVENT_HERO.height}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#020806] from-30% via-[#020806]/80 via-55% to-[#020806]/30"
        aria-hidden="true"
      />
      <div className="relative flex min-h-[18rem] items-end px-6 pt-24 pb-8 @3xl:min-h-[24rem] @3xl:px-12">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight @5xl:text-6xl">
          Events
        </h1>
      </div>
    </header>
  );
}

export function CommunityStrip() {
  return (
    <section aria-labelledby="community-heading" className="px-6 py-16 @3xl:px-12 @3xl:py-20">
      <h2 id="community-heading" className="font-display text-3xl font-semibold tracking-tight @5xl:text-5xl">
        Around the club
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-2 @3xl:grid-cols-4 @3xl:gap-3">
        {COMMUNITY_GALLERY.map((photo) => (
          <li key={photo.id} className="aspect-[3/2] overflow-hidden">
            <Photo photo={photo} sizes="(min-width: 48rem) 22vw, 46vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
