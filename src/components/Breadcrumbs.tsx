import { pageHref } from "../data/routes";
import { buttonFocus } from "./Cta";

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-base">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <a className={`underline decoration-2 underline-offset-4 ${buttonFocus}`} href={pageHref("")}>
            Home
          </a>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
