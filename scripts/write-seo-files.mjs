import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/site.ts", import.meta.url), "utf8");
const business = readFileSync(new URL("../src/data/business.ts", import.meta.url), "utf8");
const site = source.match(/export const SITE_URL = "([^"]+)"/)?.[1];
const courses = business.match(/export const SIMULATOR_COURSE_COUNT = (\d+)/)?.[1];
if (!site || !courses) throw new Error("Could not read SITE_URL or SIMULATOR_COURSE_COUNT");
const origin = site.replace(/\/$/, "");

const routes = [
  ["", "Indoor golf in Somerset, NJ"],
  ["membership/", "Indoor golf membership"],
  ["coaching/", "Golf lessons"],
  ["juniors/", "Junior golf"],
  ["events/", "Events"],
  ["tournament/", "Fall League"],
  ["privacy-policy/", "Privacy policy"],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ([path]) => `  <url>
    <loc>${origin}/${path}</loc>
    <lastmod>2026-10-30</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

# Search and AI answer engines
User-agent: Googlebot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Bingbot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

const llms = `# Par2Play

> Par2Play is an indoor golf studio at 695 Hamilton Street, Suite G, Somerset, NJ 08873 (Franklin Township, near New Brunswick). Four enclosed Full Swing golf simulator bays, private golf lessons with PGA professionals Nick Schiavo and Nick Monticello, junior golf coaching, memberships, and private events. Phone (732) 448-2769. Email info@par2play.com.

## Key facts
- Address: 695 Hamilton Street, Suite G, Somerset, NJ 08873
- Phone: (732) 448-2769
- Hours: 10am–10pm, Monday–Sunday
- Simulators: Full Swing, 4 enclosed bays, complimentary premium golf clubs, ${courses}+ courses
- Coaches: Nick Schiavo, PGA (PGA Professional since 2011; Penn State PGM; former GOLFTEC Director of Instruction); Nick Monticello, PGA (PGA member since 2011; Methodist University PGM; former Lead Instructor, Basking Ridge Country Club)
- Booking: https://par2play.oclock.app/book
- Instagram: https://www.instagram.com/par2play/
- Facebook: https://www.facebook.com/people/Par2play/100090440193611/ (the page linked from the live par2play.com footer). A Google listing points at a different page, facebook.com/102565266099864. That second page is not used here.

## Prices (USD)
- Silver membership: $100/month
- Gold membership: $250/month
- Platinum membership: $4,500/year
- Single bay rental: shown at checkout
- Private lesson, 30 min: $100; packs 5/$400, 10/$750, 20/$1,400, 30/$2,000, 50/$3,000 (never expire)
- Swing Evaluation (50–60 min): $100
- Golf Improvement Bundle: $599
- Junior coaching, once a week: $249/month
- Junior coaching, twice a week: $399/month
- Club fitting, event packages, and the league fee: not published

## Pages
- [Home](${origin}/): indoor golf in Somerset, NJ
- [Membership](${origin}/membership/): Silver, Gold, and Platinum
- [Golf lessons](${origin}/coaching/): PGA coaches, lesson packs, swing evaluation, club fitting
- [Junior golf](${origin}/juniors/): junior coaching once or twice a week
- [Events](${origin}/events/): holiday parties, company events, birthdays
- [Fall League](${origin}/tournament/): indoor golf league (coming soon)
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), sitemap);
writeFileSync(new URL("../public/robots.txt", import.meta.url), robots);
writeFileSync(new URL("../public/llms.txt", import.meta.url), llms);
console.log("wrote sitemap, robots.txt, llms.txt for", origin);
