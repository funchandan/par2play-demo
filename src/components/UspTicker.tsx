import { USP_ITEMS } from "../data/usps";

function Chip({ label, src }: { label: string; src: string }) {
  return (
    <li className="flex shrink-0 items-center gap-3 pr-10">
      <img src={src} alt="" width={44} height={44} className="size-11 rounded-xl object-cover" />
      <span className="text-base font-semibold text-[#0A0F0B]">{label}</span>
    </li>
  );
}

export function UspTicker() {
  const chips = USP_ITEMS.map((item) => (
    <Chip key={item.id} label={item.label} src={item.photo.jpg} />
  ));
  const loop = USP_ITEMS.map((item) => (
    <Chip key={`${item.id}-loop`} label={item.label} src={item.photo.jpg} />
  ));

  return (
    <section aria-label="What Par2Play offers" className="border-y border-[#0A0F0B]/10 bg-[#f6f6f4]">
      <ul className="usp-static flex flex-wrap gap-x-8 gap-y-3 px-6 py-4 @3xl:px-12">
        {USP_ITEMS.map((item) => (
          <Chip key={item.id} label={item.label} src={item.photo.jpg} />
        ))}
      </ul>
      <div className="usp-marquee overflow-hidden py-4">
        <ul className="sr-only">
          {USP_ITEMS.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
        <ul aria-hidden="true" className="usp-track flex w-max items-center">
          {chips}
          {loop}
        </ul>
      </div>
    </section>
  );
}
