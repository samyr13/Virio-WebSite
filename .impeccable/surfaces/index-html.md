---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

## Scope

Landing page `index.html` (single page, French). Mode: Persuade. Audience: grand public. Action: laisser son e-mail pour être prévenu du lancement (extension bientôt disponible, gratuite).

## Constraints

World pinned by the user: the Virio brand film (mon-video/src/v3). Static HTML/CSS/JS, GSAP from CDN. Every stat sourced in the footer. No invented testimonials, user counts or efficacy numbers. Demo is labelled as a simulation.

## Direction contract

THESIS: The page is the brand film made interactive: one 3D phone that the scam happens to, while you scroll. It refuses the category default of a shield hero, feature-card grid and generic "AI security" gradients.

OWN-WORLD: Ink #07090D ground with a soft lifted centre, steel phone, real light-grey iOS SMS cards with blue mono links, white fake-site pages. Green #2BC97A only where Virio acts (shield, STOP flash, block-sheet button, CTA); red #E5484D only on what belongs to the scammer. Inter 800–900 at -0.04em for slammed words, JetBrains Mono for URLs and figures. Shield mark with capsule pupil.

STORY: You receive the SMS, it looks real, one tap opens a fake site that asks for your card. Virio stops it, explains why, sends you to the real site. Then you try it yourself, see what scams cost (France then world), learn the signs, and learn it is free.

FIRST VIEWPORT: Left 5 columns: H1 "Un clic suffit." ~6rem, one sentence, green "Être prévenu" pill + "Essayer la démo" text link. Right: CSS-3D phone ~340px wide, tilting toward the cursor, lock screen receiving SMS, eight spam SMS cards floating in depth around it.

FORM: brief-pinned structure (hero → pinned scroll story → demo → live counter + figures → signs → how → free → close); position 1 of 1; seed: none (brief-pinned, no roll). Signature interaction: the pinned phone that follows the scroll through the scam, and the on/off demo. Motion grammar: film's three curves (out .16,1,.3,1 / inOut .65,0,.35,1 / in .7,0,.84,0), word rises and slams, green STOP flash.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Memorable moment

Scrolling: the swarm of spam SMS around the phone is struck out one by one when Virio switches on (red "Faux domaine" chips, then they fall away).

## Unresolved

Waitlist backend (Netlify Forms markup provided), Chrome Web Store link, legal notices.
