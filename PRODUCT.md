# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective clients of a freelance frontend developer: CTOs, product leads, founders and recruiters evaluating whether to hire Jeremy Laurain for a React/TypeScript frontend mission. They arrive from LinkedIn or a CV link, scan on desktop or phone, and decide in under a minute whether to reach out.

## Product Purpose

Personal portfolio for Jeremy Laurain's freelance activity, operated under the company name "Oui" (renamed from "Studio JL"). It presents who he is, a decade of frontend experience, a few hand-built interactive projects, and the ways to get in touch. Success is a contact (email copy, LinkedIn, GitHub) or a project page visited.

## Positioning

A senior frontend developer who ships polished, animated, production-grade UI and proves it with the portfolio itself: the site and its project demos are the work sample. The company name "Oui" is the pitch: saying yes to the project.

## Operating Context

- Astro 6 with React islands, Tailwind CSS v4, shadcn/ui components, Hugeicons, Sonner toasts, custom cursor on fine pointers.
- Routes: `/` (hero, headline, experience, projects, contact) and `/projects/<slug>` (interactive demos, currently Pomodoro; others marked coming soon).
- Project registry in `src/projects/registry.ts`; experience data inline in `src/components/experience-section.astro`.

## Capabilities and Constraints

- Hero CTA copy "Explore what I can do" is binding; it scrolls to the projects section.
- Light theme only: no dark mode, no theme toggle. The existing light palette (zinc-based oklch neutrals plus the pink/violet/sky accents) is binding.
- Material language is glassmorphism in the register of Apple's Liquid Glass (binding, re-pinned on the second round): lensed, highly rounded translucent controls and panes with specular rims, content scrolling under glass.
- The ground must not be a full-page gradient (user rejected the first round's shader backlight); glass needs something to refract but the page reads as a calm light surface.
- Contact email: jeremylaurain+free@gmail.com; LinkedIn /in/jlaurain; GitHub najie.
- Site language: English on the home page; project pages use `lang="fr"` and a French "Retour" back link.

## Brand Commitments

- Company name: "Oui". Replaces "Studio JL" and the former 創 (Sō) monogram everywhere.
- Variations must stay glassmorphic only; the user wants to compare several section layouts, not several materials.
- Logo: the word "Oui" set as a very tall, narrow, condensed wordmark, barcode-like, inspired by Bebas Neue; the O is a rounded square, not a circle. Simple, single colour.
- Display typeface direction: Bebas Neue (or a face with that condensed grotesque character). Body remains Figtree.
- Hero copy: "Hi I'm Jeremy Laurain", on two lines with no full stops. The role "Senior Frontend Developer" sits in the meta line above it.

## Evidence on Hand

- Real experience data: Oui (2026–present, led by the Vizzia mission), AVIV Group (2020–2026), Interencheres (2016–2020) with highlights and stacks.
- Two shipped projects: the Pomodoro timer (on this site) and Invoice PDF Editor (external, https://najie.github.io/pdf-invoice-editor/). Cookie Clicker is not built; keep it "coming soon", no fabricated screenshots.
- Logos on the freelance card, under "Clients & projects": Vizzia (freelance mission), SeLoger (AVIV period) and Finance to the Moon (personal app). Keep that label, since only Vizzia is a freelance client.
- No testimonials or metrics exist; do not invent any, and add no other logos.

## Product Principles

1. The portfolio is the work sample: craft in the UI is the proof.
2. One clear path: understand who, see the work, get in touch.
3. Honest content: real experience and shipped demos only.
4. Light, fast, and legible on a phone; effects never block reading.
