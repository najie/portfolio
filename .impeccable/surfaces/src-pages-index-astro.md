---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/layouts/main.astro","src/layouts/project.astro"]
---

# Surface: home page (`/`) and the chrome shared with project pages

Scope: second-round redesign of the home page (hero, headline, experience, projects, contact) plus the glass chrome on `/projects/*`. The Pomodoro app itself is out of scope. Light theme only.

Mode: Persuade. Visitor: a CTO, product lead or recruiter deciding whether to contact Jeremy Laurain for a freelance frontend mission. Action: email copy, LinkedIn, GitHub, or opening a project demo. Proof: real experience and the shipped Pomodoro demo; nothing invented.

Pinned by the user (round 2): glassmorphism in Apple's Liquid Glass register only; the light palette tones; CTA copy "Explore what I can do"; company name "Oui" and the tall barcode-like wordmark; Bebas Neue display voice. Rejected: a full-page gradient ground (round 1 backlight) and the round-1 section layout.

Approved comp: `.impeccable/mocks/decision/lockscreen.png` (HTML mock `lockscreen.html`, locked on the surface round, seed 9ae56c90).

## Direction contract

THESIS: The home page is an iOS lock screen with its widget stack: one centered column, a greeting at lock-screen scale, then glass widgets. It refuses the left-title / right-card-column scaffold and the full-page gradient of round 1.

OWN-WORLD: Calm paper ground (#f3f2f7) with a fine noise and two or three soft blurred colour pools (pink, sky, lavender) that never cover the page. Every container is Liquid Glass: 46% white fill, backdrop blur 28px with saturation 1.9, a specular 1px rim brighter at top-left, a soft inner top highlight, one lifted shadow; interactive glass lifts and brightens on hover. Bebas Neue caps for greeting, widget titles, labels and the tab bar; Figtree body. Emphasis is solid violet (#6d3df0). Chips are small white pills.

STORY: The visitor lands on a lock screen that says who this is in one glance, slides the CTA to the work, scrolls a stack of widgets (three experience widgets, three project widgets, one contact widget) and taps a contact row. The tab bar follows them and shows where they are.

FIRST VIEWPORT: Wordmark centered at top. Column max 600px. Meta line "Senior Frontend Developer · Paris · Freelance" in muted body type, then "Hi / I'm Jeremy Laurain" in Bebas at clamp(64px, 12vw, 128px), a one-line sub in body type, then the CTA "Explore what I can do": the incumbent BorderGlow pill (white, animated pink/violet/sky glow sweep, cursor-tracking rim, press feedback), kept at the user's request as the one shadowed, glowing object; it replaces the mock's slider pill. Soft pink pool behind the greeting, sky pool to its right. On desktop the headline line and the first experience widget start inside the first screen; a glass tab bar floats at the bottom center (Experience / Projects / Contact with icons). Signature interaction: the tab bar's active pill moves to the section currently in view (scroll-spy), Liquid Glass morph.

FORM: Lock Screen Stack, candidate 6 of 7 on the grounded structural list (desktop & dock, control-center bento, scroll-under-glass editorial, Finder split pane, stacked sheets, lock-screen stack, timeline rail). Seed key 9ae56c90, dealt lead, code-led build from the approved HTML mock.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Unresolved: none blocking. Cookie Clicker stays "Coming soon", no thumbnails. Invoice PDF Editor is live and links out.
