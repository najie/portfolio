---
name: Oui
description: A lock screen on calm paper; Liquid Glass widgets in one centred column, Bebas Neue caps, one violet voice.
colors:
  paper: "oklch(0.962 0.008 300)"
  ink: "oklch(0.141 0.005 285.823)"
  ink-primary: "oklch(0.21 0.006 285.885)"
  ink-muted: "oklch(0.552 0.016 285.938)"
  hairline: "oklch(0.92 0.004 286.32)"
  ring: "oklch(0.705 0.015 286.067)"
  accent-ink: "oklch(0.5 0.22 295)"
  glass-fill: "oklch(1 0 0 / 0.46)"
  glass-fill-lifted: "oklch(1 0 0 / 0.62)"
  chip-white: "oklch(1 0 0 / 0.6)"
  tile-white: "#ffffff"
  pool-pink: "#ff92c8"
  pool-sky: "#2bbdf5"
  pool-lavender: "#c9b8ff"
  glow-violet: "#c084fc"
  glow-pink: "#f472b6"
  glow-sky: "#38bdf8"
  selection-pink: "oklch(0.85 0.1 350 / 0.6)"
  particle-pink: "#f9d3e4"
  particle-lavender: "#dfd5fa"
  particle-sky: "#cbe8f8"
typography:
  display:
    fontFamily: "Bebas Neue, Figtree Variable, sans-serif"
    fontSize: "clamp(4rem, 12vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.025em"
  headline:
    fontFamily: "Bebas Neue, Figtree Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.05em"
  title:
    fontFamily: "Bebas Neue, Figtree Variable, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.025em"
  nav:
    fontFamily: "Bebas Neue, Figtree Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
  label:
    fontFamily: "Bebas Neue, Figtree Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  body:
    fontFamily: "Figtree Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Figtree Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  meta:
    fontFamily: "Figtree Variable, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.025em"
rounded:
  tile: "14px"
  row: "25.2px"
  widget: "30.8px"
  pill: "36.4px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  widget-pad: "20px"
  card-pad: "24px"
  label-top: "28px"
  hero-gap: "56px"
  column: "min(600px, 100% - 2rem)"
components:
  widget:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.widget}"
    padding: "{spacing.widget-pad}"
  widget-hover:
    backgroundColor: "{colors.glass-fill-lifted}"
  card-experience:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.widget}"
    padding: "{spacing.card-pad}"
  chip:
    backgroundColor: "{colors.chip-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  chip-live:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.tile-white}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
    height: "20px"
  symbol-tile:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    size: "44px"
  client-tile:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    height: "64px"
  contact-row:
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.row}"
    padding: "14px 16px"
  button-cta:
    backgroundColor: "{colors.tile-white}"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    padding: "20px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  nav-tab-bar:
    backgroundColor: "{colors.glass-fill}"
    rounded: "{rounded.full}"
    padding: "6px"
  nav-tab:
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    rounded: "{rounded.full}"
    padding: "12px 16px"
  nav-tab-active:
    backgroundColor: "oklch(1 0 0 / 0.8)"
  section-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    padding: "{spacing.label-top} {spacing.xs} 10px"
---

# Design System: Oui

## Overview

**Creative North Star: "The Lock Screen Stack"**

The home page behaves like a phone's lock screen laid on a sheet of paper: a wordmark at the top, a greeting at wake-screen scale, and beneath it a single column of widgets. Nothing structural sits left or right of the column (the one exception is the decorative desktop "Test it" callout in the right gutter); the page is one 600px-wide spine, and every container on it is the same material, Liquid Glass. The ground is a calm lavender-grey paper with a fine multiply noise and three large blurred colour pools (pink, sky, lavender) that the glass refracts. The pools are what the glass is for; they never cover the page.

Density is low and the rhythm is the widget stack's: a small tracked label, then one or more glass panes with a 16px gap. Type carries the hierarchy in two voices only. Bebas Neue caps do the greeting, the headline quote, widget titles, the section labels and the tab bar; Figtree does everything readable. Emphasis is one solid violet ink on two words per page. The page's single glowing object is the hero CTA; every other shadow is the glass's own soft lift.

Confirmed rejections: a full-page gradient ground, the left-title / right-card scaffold, dark mode, and any second material next to the glass.

**Key Characteristics:**
- One centred column (`min(600px, 100% - 2rem)`), no sidebars, no asymmetric sections.
- Every pane is `.glass`: 46% white fill, 28px blur with 1.9 saturation, an even 1px white rim, one soft lift.
- Paper ground with noise and three blurred colour pools; project pages fade the pools to 12%.
- Bebas Neue caps for every heading, label and tab; Figtree body.
- Violet `accent-ink` as the only chromatic emphasis in text; BorderGlow on the hero CTA (and, by request, the desktop "Test it" callout) as the only glow.
- Fixed bottom glass tab bar whose active pill follows the section in view.

## Colors

A near-white lavender paper, zinc ink, white chips and glass fills, three pastel wallpaper pools, and one saturated violet.

### Primary
- **Violet Ink** (`accent-ink`): the only chromatic text colour. Used on "Hi" in the greeting and the quoted answer under the wordmark. It is never a fill, border or button colour.

### Tertiary
- **Pool Pink / Pool Sky / Pool Lavender** (`pool-pink`, `pool-sky`, `pool-lavender`): three slowly drifting, 90px-blurred discs in the wallpaper at 45%, 30% and 35% opacity, resting behind the greeting, to its right, and at 60vh. They exist to be refracted through glass; they are never applied to a component.
- **Glow Violet / Glow Pink / Glow Sky** (`glow-violet`, `glow-pink`, `glow-sky`): the BorderGlow mesh on the hero CTA only.
- **Selection Pink** (`selection-pink`): text selection highlight.
- **Particle Pink / Particle Lavender / Particle Sky** (`particle-pink`, `particle-lavender`, `particle-sky`): the flat circles drifting out from behind the contact card, at 60% opacity at most. Pale on purpose: they tint, never glow.

### Neutral
- **Paper** (`paper`): page ground under the wallpaper noise; also the `--background` token.
- **Ink** (`ink`): body text, headings, icons, the cursor dot and ring, the wordmark.
- **Ink Primary** (`ink-primary`): the solid fill of the "Live" status pill and of default shadcn buttons.
- **Ink Muted** (`ink-muted`): meta line, section labels, descriptions, highlight dashes, row subtitles.
- **Hairline** (`hairline`): the only stroke colour: row separators inside the contact widget, default borders.
- **Ring** (`ring`): focus ring at 50%, 3px.
- **Glass Fill / Glass Fill Lifted** (`glass-fill`, `glass-fill-lifted`): the pane fill at rest and on hover of interactive glass.
- **Chip White** (`chip-white`): the fill of outline chips, with a 90% white hairline.
- **Tile White** (`tile-white`): opaque white for the 44px symbol tile, the hero CTA body and the hover state of chips.

### Named Rules
**The One Violet Rule.** `accent-ink` is text-only and appears on at most two phrases per page. If it starts colouring borders, fills or icons, it has stopped being emphasis.

**The Pools Stay Under Rule.** The three colour pools live only in the wallpaper, blurred and partial. No component takes a pink, sky or lavender fill; colour reaches the surface only by refraction through glass.

## Typography

**Display Font:** Bebas Neue (with Figtree Variable, sans-serif)
**Body Font:** Figtree Variable (with sans-serif)

**Character:** A tall condensed caps face set loose (0.025em to 0.14em) against a warm, round humanist body. Bebas carries every heading from 128px greeting down to a 15px label; Figtree never goes above 18px on the home page.

### Hierarchy
- **Display** (400, clamp(4rem, 12vw, 8rem), 0.95): the greeting "Hi / I'm Jeremy Laurain" only. Centred, `text-wrap: balance`, enters with the text-reveal animation.
- **Headline** (400, 1rem, 0.05em): the single quote directly under the top wordmark, on one line.
- **Title** (400, 1.5rem, 1.0): widget titles: card role, project name.
- **Nav** (400, 1.125rem, 0.05em): tab bar labels, the project-page "Retour" link, and at 1.25rem the hero CTA.
- **Label** (400, 15px, 0.14em, uppercase, muted): the `section-label` above each widget group.
- **Meta** (500, 15px, 0.025em, muted): the "Senior Frontend Developer · Paris · Freelance" line.
- **Body** (400, 1rem, 1.5): the hero sub line is 1.125rem; widget copy, highlights, row titles and chips are **Body Small** (0.875rem, chips at 0.75rem / 500).

### Named Rules
**The Two Voices Rule.** Bebas Neue is for things you glance at (greeting, titles, labels, tabs); Figtree is for things you read. No third face, no weight games in Bebas (it has one), no italics.

**The Loose Caps Rule.** Bebas is never set at `normal` tracking. Headings take 0.025em, tabs 0.05em, labels 0.14em.

## Layout

One centred column, `min(600px, 100% - 2rem)` wide, 24px top padding and 144px bottom padding so the last widget clears the fixed tab bar. Inside the column the hero is centred text: wordmark (36px tall), the headline quote 8px below it, 40px gap, meta line, greeting, sub line, CTA at 32px below, then 24px before the first widget group. Each widget group starts with a `section-label` (28px above, 10px below, 4px side inset) and stacks its panes with a 16px gap. Experience is three full-width cards; Projects is a 2-column grid becoming 3 columns at sm (640px), each tile at least 192px tall; Contact is one pane under its own `section-label`, like every other group. From xl (1280px) the right gutter beside Projects holds the decorative "Test it" callout. Sections carry `scroll-margin-top: 2rem` for the tab bar's smooth scroll.

The tab bar is fixed 20px from the bottom, centred, and hides its text labels below sm so only three icons remain. Project pages reuse the same glass in a top-left header pill (24px from top, 16px from the left, 32px at md) and hand the viewport to the demo (`100dvh`, overflow hidden) over a quieted wallpaper.

## Elevation & Depth

Depth is material, not shadow. Everything above the paper is the same translucent glass, and what reads as height is the backdrop blur pulling the wallpaper pools into soft colour inside each pane. Each pane carries one low lift shadow and one even 1px inset white rim at 70%; there is no gradient rim, no top highlight and no corner band. Interactive glass answers hover by rising 2px, scaling 1%, brightening to 62% white and deepening its lift; active presses back to 99%.

### Shadow Vocabulary
- **Glass lift** (`box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.7), 0 12px 32px -12px oklch(0.2 0.02 300 / 0.18)`): every `.glass` pane at rest.
- **Glass lifted** (`box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.9), 0 24px 50px -22px oklch(0.3 0.08 300 / 0.35)`): `.glass-tap` on hover.
- **Tile shadow** (`shadow-xs`, `0 1px 2px rgb(0 0 0 / 0.05)`): the white symbol tile inside a project widget, the client tiles and the Pomodoro notch chips.
- **Active tab** (`0 6px 16px -8px rgb(0 0 0 / 0.25)`): the lit pill in the tab bar.
- **CTA glow** (BorderGlow, 13-layer hsl glow at 0.6 intensity, 40px radius, plus `shadow-md`): the hero CTA only.

### Named Rules
**The One Glow Rule.** The hero CTA is the page's only glowing object, with one user-requested exception: the decorative desktop "Test it" callout. Nothing else gets a coloured shadow, a mesh border or a cursor-tracking rim.

**The Even Rim Rule.** Glass has no solid border. Its edge is one even 1px inset white rim at 70% (90% when lifted); gradient rims and corner highlights were tried and rejected by the user.

## Shapes

Everything is rounded from one base radius of 14px (`--radius: 0.875rem`). Inside widgets, the symbol tile is exactly that base (14px, a rounded square, echoing the O of the wordmark). Contact rows are the 1.8x step (25.2px); experience cards, project widgets and the contact pane are the 2.2x step (30.8px); chips, shadcn buttons and the project-page header are the 2.6x step (36.4px), which on their heights reads as a full pill. The tab bar, its tabs and the CTA are true pills. There are no square corners and no hairline strokes except the horizontal separators between contact rows. The "Oui" wordmark follows the same geometry: three equal 7-unit strokes in a 60x100 box, the O a rounded rectangle (rx 7), u and i at a lower cap height, set in `currentColor`.

## Components

Glass widgets that read like lock-screen tiles: generous radius, no strokes, content set small inside.

### Buttons
- **Hero CTA (BorderGlow):** white pill (`border-radius: 99px`), Bebas 1.25rem at 0.05em, padding 20px 32px, text in ink. Animated mesh glow in glow-violet / glow-pink / glow-sky sweeps once on mount (and every 10s on touch devices), then tracks the pointer angle on fine pointers. Press: translate down 4px and scale 0.95 over 300ms.
- **Ghost (shadcn):** transparent, Bebas 1.125rem at 0.05em, 36px tall, 12px side padding, radius 36.4px; hover fills with `muted`. Used for the French "Retour" link inside the project header.
- **Default (shadcn):** `ink-primary` fill, white text, same pill radius; present in the kit, not used on the home page.
- **Copy action:** 70% white pill with a 90% white hairline, 12px/500 muted text with a 14px icon, 6px 12px padding; hover goes opaque white and ink text.
- **Focus:** 3px ring in `ring` at 50% on all buttons, chips and rows.

### Chips
- **Outline (the house chip):** 20px tall white pill, `chip-white` fill with a 90% white hairline, 0.75rem/500 ink text, 2px 8px padding. Used for the period and the tech stack on experience cards and the "Coming soon" status. Hover (only when a link) goes opaque white.
- **Live status:** same pill filled `ink-primary` with white text; the only solid chip.
- Chips are not glass. They sit on glass.

### Cards / Containers
- **Experience card:** `.glass`, radius 30.8px, 24px vertical and horizontal padding, 24px gap between header, content and footer. Header is a grid with the period chip in the top-right, Bebas 1.5rem role, 0.875rem muted description with the company in medium ink. Highlights are an em-dash list at 0.875rem; footer is a wrapped row of chips at 6px gap.
- **Client tiles:** on the freelance experience card only, under a small tracked "Clients & projects" label: three equal white tiles (64px tall, 14px radius, `shadow-xs`) in a 3-column grid with an 8px gap, each holding one logo 28px tall in ink. Logos are always monochrome, never brand-coloured, and tiles are not links.
- **Project widget:** `.glass`, radius 30.8px, 20px padding, min-height 192px, space-between column: 44px white symbol tile (14px radius, 20px Hugeicons stroke icon) on top; status chip, Bebas 1.5rem title and 0.875rem muted description at the bottom. Live widgets are links with `.glass-tap`; external ones open in a new tab and show the 16px link icon at top right. Coming-soon widgets are static panes.
- **Contact pane:** `.glass`, radius 30.8px, 16px padding, headed from outside by the "Let's get in touch" `section-label`, three rows (16px/14px padding, radius 25.2px, 16px icon, 0.875rem/500 title and muted description) separated by `hairline` with 8px margins. Link rows tint `muted` on hover.
- **Shadow strategy:** glass lift at rest, glass lifted on hover for `.glass-tap` surfaces (see Elevation & Depth).
- **Border:** none; the even 1px inset white rim only.

### Navigation
- **Tab bar:** fixed bottom-centre glass pill, 6px padding, 4px gap, z-index 99. Each tab is a pill with 16px/12px padding, 20px icon and a Bebas 1.125rem label at 0.05em; labels disappear below sm. Hover tints 50% white; the active tab (the last section whose top has crossed a line 40% down the viewport; over the final half viewport of scroll the line slides to the bottom edge so a short last section still lights up) fills 80% white with the active-tab shadow, transitioning background and shadow over 300ms. Clicking smooth-scrolls to the section. The rule lives in `src/lib/scroll-spy.ts`.
- **Project header:** fixed top-left glass pill (radius 36.4px, 6px padding, 16px left inset) holding the 32px wordmark link and the ghost "Retour" button.

### Contact particles
A canvas under all page content (`z-index: -1`) reaching 140px past the contact card. Flat transparent circles in pastel pink `#f9d3e4`, lavender `#dfd5fa` and sky `#cbe8f8`, at 60% opacity at most, with no rim, highlight or glow. Each one leaves the card's centre, travels straight out behind the glass, grows as it goes and fades quadratically past the edge while slowing down. They are the one sanctioned exception to the Pools Stay Under Rule. The loop stops offscreen, and reduced motion shows one still frame.

### "Test it" callout (desktop)
From `xl` (1280px), a glass card sits 32px into the right gutter of the Projects section, vertically centred on the widget grid. It is built like a project widget turned on its side: `.glass` fill, edge and lift, 30.8px radius, 20px padding, the 44px white symbol tile (14px radius, `shadow-xs`) holding a 20px Hugeicons left arrow that points at the projects, then a 16px gap and "Test it" in Bebas Neue at 13cqi of the gutter (about 36-54px). This is the one exception to the Loose Caps Rule: it is set tight at -0.02em. It is decorative (`aria-hidden`, no pointer events), so it never pretends to be a button.

The card is a BorderGlow carrying the hero CTA's violet/pink/sky mesh at 0.5 intensity, the user-requested second exception to the One Glow Rule: its edge sweeps on each play and follows a nearby pointer. Its stock hairline border and `shadow-md` are replaced by the glass edge and lift.

It plays when 60% of the section is visible and replays every 10s, but only while the section stays in view and the tab is visible. The card slides in from 1rem on the first play only. Letters condense out of frosted glass, staggered 80ms. Over 1.5s each one goes from an 18px blur at 112% scale to sharp, while its colour runs from pool pink to sky, then `accent-ink` with a soft `accent-ink` glow at 40%, then settles on ink. Eight flat 2-4px droplets in the pool colours, like the contact particles, drift a few pixels off the word and fade as it clears. At 1.9s a single white specular sheen crosses the letters left to right while the arrow nudges 4px toward the projects twice. With reduced motion the word is shown still, with no droplets, glow sweep, nudge or replay.

### Pomodoro dial
One glass pane (`rounded-3xl`, max 600px) under a Bebas clock of up to 160px. The dial stays neutral: reached arcs and the cable are `foreground`, unreached arcs `muted-foreground` at 60%, and notch labels are small white chips that double as preset buttons. `accent-ink` appears only on "Time's up". The lever is a white 30px bead that swings on a damped curve when released, then retracts to the pivot as time runs out.

### Wallpaper (signature)
A fixed, non-interactive layer at z-index -10: `paper` ground, a 160px tiled SVG fractal-noise texture at 60% opacity in multiply, and three absolutely positioned blurred discs (`filter: blur(90px)`, radius 50%): 520px pink at 45% high and left of centre, 420px sky at 30% to the right, 600px lavender at 35% centred at 60vh. Each pool drifts on three unsynced compositor loops (sway, orbit, stretch). On load the drift surges to 8x over 1.2s, then settles to its slow pace over 12s; with reduced motion the pools hold still at rest. The `quiet` variant drops all pools to 12% so a project demo stays legible.

### Toast
Sonner, light theme, bottom-centre; popover white fill, `hairline` border, 14px radius, Hugeicons status glyphs at 16px / stroke 2. Fired on email copy.

### Cursor
On fine pointers the native cursor is hidden (except in text fields) and replaced by a 25px ink dot and a 35px, 2px ink ring at 70%, the ring trailing on a 350ms `cubic-bezier(0.16, 1, 0.3, 1)` ease.

## Do's and Don'ts

### Do:
- **Do** build every new container from `.glass` and add `.glass-tap` only when it is a link or button.
- **Do** keep the column at `min(600px, 100% - 2rem)` and stack panes with a 16px gap under a `section-label`.
- **Do** set every heading, label and tab in Bebas Neue with tracking (0.025em / 0.05em / 0.14em) and every readable line in Figtree.
- **Do** reserve `accent-ink` for one or two emphasised phrases of text.
- **Do** place status and metadata in the 20px white chip; use the `ink-primary` chip only for "Live".
- **Do** pass `quiet` to the wallpaper on any page where the glass sits over interactive content.
- **Do** keep the 14px white symbol tile as the icon housing inside widgets.

### Don't:
- **Don't** paint a full-page gradient or let a colour pool cover more than a corner of the viewport; the ground reads as paper.
- **Don't** give a pane a solid `border`, a hard offset shadow or a second glow; the CTA's BorderGlow is the only glowing object.
- **Don't** fill a component with pool pink, sky or lavender, or tint glass away from white.
- **Don't** add a dark theme, a theme toggle or a second display face.
- **Don't** introduce a left/right two-column section layout or a sidebar; the world is one centred spine.
- **Don't** make chips glass or drop the radius below the 14px base anywhere.
