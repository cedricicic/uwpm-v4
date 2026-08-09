# UI Style Guide
A shared standard for any interface: websites, web apps, mobile apps, desktop software. The rules describe intent, not one framework. Names like "display role", "subtitle role", "accent token", and "dots indicator" are concepts. Map them to your stack, whether that is CSS custom properties, Tailwind, React, SwiftUI, Jetpack Compose, Flutter, or a design tool. Read "screen" as screen or page throughout.

## 1. Writing
Rules for the text itself, before it reaches a component.
- **No em dashes or en dashes**: Not in headlines, body, labels, or stored data. Where you would reach for one, use a period, a colon, or two sentences. Hyphens exist only to spell compound words, never to set off a clause.
- **No generic filler**: Every line says something specific to this screen. Cut anything that could sit on any product ("Welcome", "Get started with our powerful tools"). Specific beats vague.
- **No hanging fragments**: Keep sentences substantial and avoid trailing scraps under five words in instructional or descriptive copy. Product microcopy may be terse when it is deliberate ("A match."); guidance and prose should not trail off.
- **No repetition**: State a thing once. If two lines carry the same idea, delete one.

## 2. Voice & Copy
These govern what the UI says, not how it looks. They bind as tightly as the visual tokens.
- **No redundant page-name subtitles**: A screen never announces itself. Skip "You're on the home page", "Profile page", "Messages page". The route or nav state is the title. The kicker and headline carry meaning, not a navigation echo. A contextual kicker (Today, Inbox) is fine when it adds real information. If the kicker only paraphrases the page title, drop it.
- **No full caps on word labels**: Never uppercase word strings. Not through a code transform (CSS `text-transform: uppercase`, a `.toUpperCase()` call, an uppercase text-case modifier), and not by storing shouted source data ("WARMBLOOD"). Source data is cased correctly at rest ("Warmblood", "Dressage"). One narrow exception: data values that contain letters (units and codes such as 16.2HH, 9YRS, 4MIN) may be uppercased by a dedicated data-display font, never by a transform. Until such a font exists in the project, nothing is uppercased.
- **No "Step N of M" or "Chapter N" counters**: Flows carry no pagination numbers. Progress shows through a minimal dots indicator and through the headline itself. If a user truly needs to know how much is left, the flow is too long. Fix the flow, not the label.
- **One display headline per screen**: Reserve the display type role for a single element: the editorial hero, the feature title, the screen's anchor. Section heads on inner screens use the subtitle role, not display. Per-item proper nouns (artist names, album titles, product names) stay at subtitle. Those are not screen headlines.
- **No exclamation marks in product copy**: The voice stays calm. Even celebration ends on a full stop ("A match.").

Enforce these in your shared label style, which must never uppercase, and surface them in a living style guide with a Voice section so the team can see the rules applied to real components.

## 3. Forbidden (visual)
- **Drop shadows on layout containers.**
- **More than one typeface.** One font family across the product.
- **Raw hex values inside markup, styles, or components.** Colors come from named tokens only.
- **Filled icon variants outside an active-state indicator.**
- **Heavy card-on-card stacking.**
- **Text labels beneath primary navigation icons** (tab bars, nav rails, bottom bars).
- **The platform default accent or link color leaking through.** Set your own accent token everywhere the system default would otherwise show.
- **Expanded letter-spacing.** Never adjust letter-spacing, tracking, or kerning on any text (see §1).

## 4. Tokens over hardcoding
Everything visual resolves through a named token, never a literal in a view.
- **Color**: reference `color.text.primary` / `var(--paper)` / `var(--signal)`, not `#111`.
- **Type**: reference the display, subtitle, body, and label roles, not raw sizes and weights.
- **Space**: reference a scale (`space.4`, `--pad-x`, `--pad-y`), not stray pixel values.
- **Radius, elevation, motion**: same rule. One source, reused everywhere.

If a value appears twice by hand, it should have been a token.

## 5. How to adopt this on a new project
1. Define the type roles first: one display role, one subtitle role, body, and label. Wire the label style so it cannot uppercase.
2. Move every color into named tokens. Block raw hex in components with a lint rule where the stack allows it.
3. Set an accent token and apply it everywhere the platform accent or link color would default.
4. Build the dots progress indicator once and reuse it. Delete any step counters.
5. Add a living style guide screen that renders real components and states the Voice rules inline.
