---
name: Virio
description: Le film de marque devenu page interactive. Une arnaque par SMS se déroule sur un téléphone 3D, et Virio l'arrête au moment du clic.
colors:
  ink: "#07090d"
  stage: "#0b0e14"
  surface: "#121722"
  surface-2: "#19202d"
  line: "#252d3b"
  text: "#f2f4f8"
  text-2: "#b9c0cc"
  muted: "#8c96a8"
  safe: "#2bc97a"
  safe-ink: "#06140c"
  threat: "#e5484d"
  threat-strong: "#c8363b"
  threat-deep: "#3a1418"
  threat-text: "#ff7a7d"
  page: "#ffffff"
  page-text: "#161b26"
  page-muted: "#5b6474"
  page-line: "#e3e7ee"
  gov-blue: "#1d2f6f"
  gov-red: "#d23a43"
  sms: "#e9ecf2"
  sms-text: "#10131a"
  sms-meta: "#5a6170"
  link: "#1c4ed8"
  link-bg: "#dce5ff"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.25rem, 7vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.5rem, 5.2vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  slam:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(3.25rem, 9vw, 7.5rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  figure:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(2.75rem, 5.2vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  title:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(1.0625rem, 1.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.92em"
    fontWeight: 500
    letterSpacing: "0"
rounded:
  tag: "6px"
  control: "13px"
  panel: "20px"
  card: "22px"
  sheet: "24px 24px 0 0"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 5rem)"
  section: "clamp(6rem, 13vw, 11rem)"
  maxw: "1360px"
  nav-height: "4.25rem"
components:
  button-safe:
    backgroundColor: "{colors.safe}"
    textColor: "{colors.safe-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-safe-hover:
    backgroundColor: "#3bd889"
    textColor: "{colors.safe-ink}"
  button-safe-sm:
    backgroundColor: "{colors.safe}"
    textColor: "{colors.safe-ink}"
    rounded: "{rounded.pill}"
    padding: "0 1.1rem"
    height: "2.5rem"
  text-link:
    textColor: "{colors.text}"
    padding: "0.5rem 0"
  nav-link:
    textColor: "{colors.muted}"
  nav-link-hover:
    textColor: "{colors.text}"
  sms-card:
    backgroundColor: "{colors.sms}"
    textColor: "{colors.sms-text}"
    rounded: "{rounded.card}"
    padding: "12px 15px 14px"
  sms-link:
    backgroundColor: "{colors.link-bg}"
    textColor: "{colors.link}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  strike-chip:
    backgroundColor: "{colors.threat-strong}"
    textColor: "{colors.page}"
    rounded: "{rounded.pill}"
    padding: "5px 10px 5px 6px"
  pill-threat:
    backgroundColor: "{colors.threat-deep}"
    textColor: "{colors.threat-text}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
  switch:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "1rem 1.25rem 1rem 1rem"
  reveal-toggle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "3.25rem"
  notify-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0.4rem"
  block-sheet:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sheet}"
    padding: "22px 20px 0"
  sheet-go:
    backgroundColor: "{colors.safe}"
    textColor: "{colors.safe-ink}"
    rounded: "{rounded.control}"
    height: "50px"
---

# Design System: Virio

## Overview

**Creative North Star: "Le film qui se laisse toucher"**

Virio reprend le monde de son film de marque (projet Remotion `mon-video`, v3) et le rend manipulable : un fond d'encre presque noir, légèrement relevé au centre comme sous un projecteur, un téléphone en acier construit en CSS 3D, et autour de lui de vrais SMS d'arnaque, gris clair, à la manière d'iOS. La page ne décrit pas la protection, elle la met en scène : on voit le piège arriver, le faux site s'ouvrir, puis Virio l'arrêter.

Le système repose sur un contraste moral plus que décoratif. L'encre et les gris acier portent tout le reste ; le vert n'apparaît que là où Virio agit, le rouge que sur ce qui appartient à l'escroc. Les objets « du monde réel » (cartes SMS, pages web blanches, bandeau tricolore du faux site officiel, barre d'adresse) gardent leurs propres couleurs et leur propre typographie d'interface, parce que leur réalisme est l'argument.

La densité est celle d'un film : peu de mots, des titres qui claquent en Inter très gras à -0.04em, de grands vides d'encre, des chiffres en très grand corps. Le mouvement suit les trois courbes du film, une tâche chacune.

**Key Characteristics:**
- Fond d'encre unique, relevé par des halos radiaux bleu nuit derrière l'objet principal, jamais par des dégradés colorés.
- Vert = protection, rouge = arnaque ; aucune autre couleur d'accent sur la scène.
- Objets réalistes (SMS, navigateur, pages web) rendus fidèlement, avec leurs codes iOS.
- Inter 800–900 serré pour les mots qui claquent, JetBrains Mono pour les URL et les montants.
- Un seul objet 3D (le téléphone) qui porte le récit au défilement.
- Marque : bouclier vert à pupille en capsule verticale.

## Colors

Une scène d'encre bleutée où deux couleurs seulement ont le droit de parler, chacune pour un camp.

### Primary
- **Vert Protection** (`safe`) : la couleur de Virio en action. Bouton principal « Être prévenu », écran STOP, flash plein cadre « STOP. », bouton « Aller sur le site officiel » de la feuille de blocage, bouclier de marque, coches des listes, interrupteur de la démo à l'état actif, balayage de l'URL analysée, anneau de focus, sélection de texte. Son texte associé est l'**Encre Verte** (`safe-ink`), jamais du blanc.

### Secondary
- **Rouge Arnaque** (`threat`) : tout ce qui appartient à l'escroc. Contour des SMS piégés quand Virio les frappe, mots « Faux site » du récit, barre de risque, domaine barré dans la comparaison, devise du compteur des pertes, halo rouge de la scène au moment du faux site.
- **Rouge Frappe** (`threat-strong`) : fond des pastilles « Faux domaine » et des étiquettes de pièges (« Urgence », « Appât »), texte blanc. Plus sombre que `threat` pour porter un texte blanc lisible.
- **Rouge Profond** (`threat-deep`) et **Rouge Clair** (`threat-text`) : le couple de la pastille « ARNAQUE DÉTECTÉE » sur la feuille de blocage, et (`threat-deep`) la teinte du halo de scène.

### Tertiary
- **Bleu Lien SMS** (`link`) sur **Bleu Lien Pâle** (`link-bg`) : le lien piégé tel qu'iOS l'affiche dans un SMS, en mono souligné. C'est une couleur du monde réel, pas un accent de la marque.
- **Bleu État** (`gov-blue`) et **Rouge État** (`gov-red`) : le tricolore imité par le faux site et repris par le vrai site officiel. Confinés à l'intérieur de l'écran du téléphone.

### Neutral
- **Encre** (`ink`) : fond de la page, de la nav au pied de page.
- **Scène** (`stage`) : fond légèrement relevé d'une section pour la distinguer sans bordure lourde (section des signes).
- **Surface** (`surface`) et **Surface 2** (`surface-2`) : panneaux d'interface Virio (feuille de blocage, interrupteur, champ e-mail, bouton de révélation, URL analysée) et leurs creux (piste de la barre de risque, pastille du bouton de révélation).
- **Filet** (`line`) : séparateurs de sections, bordures de panneaux, lignes des listes de chiffres, piste de progression.
- **Texte** (`text`), **Texte 2** (`text-2`), **Atténué** (`muted`) : titres, paragraphes, puis métadonnées, sources et liens de nav.
- **Page** (`page`), **Texte de page** (`page-text`), **Page atténuée** (`page-muted`), **Filet de page** (`page-line`) : les sites web blancs affichés dans le téléphone.
- **Carte SMS** (`sms`), **Texte SMS** (`sms-text`), **Méta SMS** (`sms-meta`) : la notification iOS, posée à 96 % d'opacité.

### Named Rules
**The Two Camps Rule.** Le vert n'existe que là où Virio agit ; le rouge que sur ce qui appartient à l'escroc. Test : si on ne peut pas répondre « Virio » ou « l'escroc » à la question « à qui est cet élément ? », il n'a droit ni au vert ni au rouge.

**The Real Objects Keep Their Colors Rule.** Ce qui imite le monde réel (SMS, barre d'adresse, pages web, tricolore) garde ses couleurs d'origine et reste à l'intérieur du téléphone ou des cartes SMS. Ces couleurs ne deviennent jamais des accents de la page.

**The Ink Halo Rule.** La profondeur de fond vient d'un halo radial bleu nuit (`#121826` vers transparent) derrière l'objet principal. Pas de dégradés multicolores.

## Typography

**Display Font:** Inter (avec system-ui, -apple-system, Segoe UI, Roboto)
**Body Font:** Inter
**Label/Mono Font:** JetBrains Mono (avec ui-monospace, SFMono-Regular, Menlo, Consolas)

**Character:** Une seule famille sans empattement poussée à ses extrêmes : 900 serré à -0.04em pour les mots qui claquent, 400 aéré pour lire. La mono est réservée à ce que l'utilisateur devrait vérifier lui-même : adresses, montants, compteurs.

### Hierarchy
- **Display** (900, `clamp(3.25rem, 7vw, 6rem)`, 0.94) : le H1 « Un clic suffit. » uniquement.
- **Headline** (800, `clamp(2.5rem, 5.2vw, 4.75rem)`, 0.98) : titres de section et temps du récit épinglé. `text-wrap: balance`.
- **Slam** (900, `clamp(3.25rem, 9vw, 7.5rem)`, 0.9, majuscules) : les trois verbes DÉTECTE / BLOQUE / REDIRIGE. Les rares très grands corps de la même famille (flash « STOP. » jusqu'à 22rem, « 0 € » jusqu'à 26rem, nom « Virio » de clôture) suivent la même règle : 900, -0.04 à -0.045em, interlignage ≤ 0.9.
- **Figure** (800, `clamp(2.75rem, 5.2vw, 4.5rem)`, 0.95, chiffres tabulaires) : chiffres sourcés ; le compteur en direct monte à `clamp(3rem, 10.5vw, 9.5rem)`. Unités en 0.5em, couleur `text-2`.
- **Title** (800, `clamp(1.75rem, 3vw, 2.5rem)`, 1.05, -0.035em) : intitulés des dégâts.
- **Lead** (400, `clamp(1.0625rem, 1.35vw, 1.25rem)`, 1.55, `text-2`) : la phrase sous un titre, 30 à 34ch.
- **Body** (400, 1.0625rem, 1.55) : texte courant, 36 à 52ch.
- **Label** (500, 0.8125–0.9375rem) : nav, sources, notes de démo, en `muted`.
- **Mono** (500, 0.92em dans le texte) : URL, domaines, montants, compteur de la démo (700, 1.75rem, tabulaire).

### Named Rules
**The Slam Rule.** Un titre affiché se compose en Inter 800 ou 900 à -0.04em, interlignage sous 1. Pas de graisse intermédiaire pour un titre, pas d'interlettrage positif.

**The Verify-It Mono Rule.** JetBrains Mono uniquement pour ce qui se vérifie : une adresse, un domaine, un montant, un compteur. Jamais pour décorer un intitulé.

## Layout

Grille de 12 parts exprimée en fractions : le récit épinglé et la démo sont en `5fr / 6fr` (texte à gauche, téléphone à droite), les chiffres en `7fr / 5fr`, les lignes « comment » en `6fr / 5fr`, les dégâts en `5fr / 7fr`. Conteneur de 1360px maximum (`maxw`), marges latérales fluides (`gutter`), sections espacées par `section` (de 6 à 11rem). La nav fixe fait 4.25rem et se floute en fond d'encre à 82 % une fois la page défilée.

Le premier écran est une scène épinglée de 100svh (minimum 640px) : le texte change par temps successifs à gauche pendant que le téléphone tourne et que l'essaim de SMS réagit à droite ; une fine barre de progression de 2px court en bas. La grille des signes décale ses colonnes (+2.5rem, +1rem) pour un rythme posé à la main.

Points de rupture : 1100px (colonnes égales, signes sur deux colonnes), 860px (une colonne ; le téléphone passe au-dessus du texte, les liens de nav disparaissent au profit du seul bouton, l'interrupteur de démo devient collant sous la nav), 420px (le champ e-mail s'empile). Un chemin `prefers-reduced-motion` coupe flottements, balayages et transitions.

## Elevation & Depth

Hybride : la page est plate et organisée par filets, mais les objets du monde réel flottent. Le téléphone est un vrai volume CSS 3D (faces avant et arrière, tranche, perspective 1500px) posé sur une ombre portée au sol floutée, avec un reflet qui suit le curseur. Les cartes SMS de l'essaim sont placées en profondeur autour de lui. Toutes les ombres sont noires, longues et à rayon négatif : elles décollent l'objet de l'encre sans jamais dessiner de contour.

### Shadow Vocabulary
- **Carte SMS** (`box-shadow: 0 18px 40px -16px rgba(0,0,0,0.55)`) : notification au repos.
- **Carte d'essaim** (`box-shadow: 0 24px 50px -18px rgba(0,0,0,0.7)`) : SMS flottant autour du téléphone.
- **Bouton vert** (`box-shadow: 0 10px 24px -14px rgba(0,0,0,0.7)`, au survol `0 14px 28px -14px rgba(0,0,0,0.8)`).
- **Panneau flottant** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,0.8)`) : mini-feuille de blocage.
- **Feuille montante** (`box-shadow: 0 -20px 60px rgba(0,0,0,0.5)`) : feuille de blocage qui monte dans le téléphone.
- **Ombre au sol** (`radial-gradient(closest-side, rgba(0,0,0,0.75), transparent)` flouté 14px) : sous le téléphone.

### Named Rules
**The One Object Rule.** Un seul objet a un vrai volume 3D par vue : le téléphone. Le reste reste plat ou flotte en cartes.

**The Soft Black Shadow Rule.** Ombres noires diffuses à rayon négatif uniquement ; pas d'ombre décalée nette, pas d'ombre colorée.

## Shapes

Deux familles de formes. L'interface Virio et les appels à l'action sont des pilules (999px) : boutons, champ e-mail, URL analysée, pastilles. Les objets iOS ont des coins généreux et doux : cartes SMS à 22px, interrupteur à 20px, feuille de blocage arrondie en haut à 24px, bouton de feuille à 13px. Le téléphone garde ses proportions réelles (rayon à 16 % de sa largeur, écran à 12,4 %, îlot dynamique). Les petites étiquettes de pièges sont à 6px. Les sections ne sont jamais encadrées : elles se séparent par un filet d'1px en `line`, ou par un filet en `text` pour ouvrir une liste de chiffres.

## Components

### Buttons
Vert franc, plein, rond, une seule promesse par écran.
- **Shape:** pilule (999px), hauteur 3.25rem (2.5rem en petit format dans la nav).
- **Primary:** fond `safe`, texte `safe-ink`, Inter 700 1rem, padding 0 1.5rem.
- **Hover / Focus:** fond plus clair (`#3bd889`), montée de 1px, ombre élargie ; enfoncement `translateY(1px) scale(0.98)` à l'appui ; anneau de focus vert 2px décalé de 3px.
- **Text link:** lien secondaire « Essayer la démo » en `text` 600, souligné par un filet d'1px dessiné en fond, flèche qui descend de 3px au survol.

### Chips
- **Pastille de frappe** (« Faux domaine », « Créé il y a 2 jours ») : fond `threat-strong`, texte blanc 700 11.5px, pilule avec icône croix, ancrée sur le bord gauche de la carte (gauche -10px, haut -12px). Elle apparaît avec un léger rebond quand Virio frappe la carte.
- **Étiquette de piège** (« Urgence », « Appât », « Pas un .gouv.fr ») : même rouge, rayon 6px, se déroule en largeur quand on révèle les pièges, avec un soulignement rouge de 2px sur le passage fautif.
- **Pastille de statut** (« ARNAQUE DÉTECTÉE ») : `threat-text` sur `threat-deep`, 700 11px, interlettrage 0.1em, à l'intérieur de l'écran de blocage.

### Cards / Containers
- **Corner Style:** 22px pour les cartes SMS et la mini-feuille, 20px pour l'interrupteur.
- **Background:** `sms` à 96 % pour les SMS ; `surface` pour les panneaux Virio.
- **Shadow Strategy:** voir Elevation & Depth.
- **Border:** aucune sur les SMS ; 1px `line` sur les panneaux Virio.
- **Internal Padding:** 12px 15px 14px (SMS), 1.25rem (panneaux).

### Inputs / Fields
- **Style:** champ e-mail en pilule, fond `surface`, filet `line`, bouton vert intégré à droite, padding 0.4rem.
- **Focus:** le filet passe au vert à 60 % (`focus-within`), curseur de saisie vert.
- **Error / Disabled:** message court sous le champ. Le build actuel colore l'erreur en rouge, ce qui contredit The Two Camps Rule ; ne pas le reproduire ailleurs.

### Navigation
Barre fixe transparente sur l'encre, qui gagne un fond d'encre à 82 % flouté (14px, saturation 140 %) et un filet bas une fois la page défilée. Marque à gauche (bouclier + « Virio » 800), liens 500 0.9375rem en `muted` qui passent en `text` au survol, bouton vert compact à droite. Sous 860px, seuls la marque et le bouton restent.

### Téléphone 3D (signature)
Le cœur du système. Un volume CSS 3D en acier (dégradé de tranche gris acier, lunette noire, îlot dynamique) dont l'écran est un espace de 390 × 834 mis à l'échelle par `zoom` (repli `transform: scale` sous `@supports not (zoom: 1)`) pour que le texte reste net à toutes les densités. Il penche vers le curseur, oscille lentement au repos, et enchaîne au défilement : écran verrouillé, conversation SMS, faux site, flash STOP, feuille de blocage, site officiel vérifié. Largeur 340px dans la scène, 360px dans la démo, 300px sur mobile.

### Carte SMS
La notification iOS fidèle : en-tête « MESSAGES » en petites capitales grises (convention d'iOS), expéditeur en 800, corps en 14.5px, lien piégé en mono dans une pilule bleu pâle soulignée. Elle sert sur l'écran verrouillé, dans l'essaim autour du téléphone et dans la grille des signes, légèrement inclinée (-1° à 1.2°) jusqu'à la révélation.

### Feuille de blocage
Panneau `surface` qui monte du bas de l'écran : bouclier et « Virio, protection active », pastille de statut rouge, titre 800 31px, barre de risque rouge, trois raisons avec croix rouges, comparaison faux domaine barré / domaine officiel vert en mono, bouton vert pleine largeur « Aller sur le site officiel ».

### Interrupteur de démo
Grand bouton-panneau (`role="switch"`) : bouclier gris, libellé, piste de 58 × 34px. À l'état actif, bouclier et piste passent au vert, le panneau prend un voile vert à 6 % et un filet vert à 45 %.

### Motion
Trois courbes du film, une tâche chacune : `--ease-out` `cubic-bezier(0.16, 1, 0.3, 1)` pour ce qui entre, `--ease-inout` `cubic-bezier(0.65, 0, 0.35, 1)` pour ce qui se déplace, `--ease-in` `cubic-bezier(0.7, 0, 0.84, 0)` pour ce qui sort. Dans la timeline GSAP, leurs équivalents sont `expo.out`, `power3.inOut` et `power2.in` / `power3.in`. Les mots montent et claquent ; Virio s'annonce par un flash vert plein cadre très bref (0.16s).

## Do's and Don'ts

### Do:
- **Do** réserver `safe` aux éléments où Virio agit et `threat` aux éléments de l'escroc (The Two Camps Rule).
- **Do** poser le texte sur le vert en `safe-ink`, jamais en blanc.
- **Do** composer chaque titre en Inter 800–900 à -0.04em, interlignage sous 1.
- **Do** écrire URL, domaines et montants en JetBrains Mono 500.
- **Do** rendre les objets du monde réel (SMS, navigateur, pages web) avec leurs couleurs et codes iOS d'origine.
- **Do** créer la profondeur avec un halo radial bleu nuit derrière l'objet et des ombres noires diffuses à rayon négatif.
- **Do** animer avec les trois courbes du film : `--ease-out` pour entrer, `--ease-inout` pour déplacer, `--ease-in` pour sortir.
- **Do** séparer les sections par un filet d'1px en `line`, pas par des cadres.
- **Do** garder un chemin `prefers-reduced-motion` qui coupe flottements et balayages.

### Don't:
- **Don't** utiliser le vert ou le rouge comme simple décoration, ni le rouge pour signaler une erreur qui ne vient pas de l'escroc.
- **Don't** introduire une troisième couleur d'accent sur la scène d'encre ; les bleus et le tricolore restent dans le téléphone et les cartes SMS.
- **Don't** ajouter un second objet 3D à côté du téléphone.
- **Don't** utiliser d'ombre décalée nette, d'ombre colorée ou de dégradé multicolore.
- **Don't** mettre de la mono sur un intitulé ou un texte de lecture.
- **Don't** composer un titre en graisse moyenne ou avec un interlettrage positif.
