# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step (user's choice). Motion with GSAP + ScrollTrigger loaded from a CDN. Must host on any static host (Netlify, GitHub Pages, Vercel).

## Users

Grand public, au sens large (confirmé) : toute personne qui reçoit des SMS, mails ou messages frauduleux et clique sur des liens depuis son navigateur. Pas de ciblage particulier par âge ou par niveau technique. Le site est en français.

## Product Purpose

Virio est une extension de navigateur (Chrome) qui protège contre les arnaques en ligne (« scam ») : faux SMS d'amende, de colis, de banque, d'impôts, d'assurance maladie, de CPF, et les faux sites vers lesquels ils mènent. Le site doit donner envie de l'installer : faire comprendre l'ampleur des arnaques aujourd'hui, les dégâts qu'elles causent, et que Virio est totalement gratuit.

Succès : le visiteur comprend en quelques secondes ce que fait Virio, voit l'extension agir (démo), et laisse son e-mail pour être prévenu du lancement.

## Positioning

Virio agit au moment exact du clic : il détecte le lien piégé, bloque le faux site avec une explication claire (pourquoi c'est une arnaque), puis redirige vers le site officiel. Il est entièrement gratuit.

## Operating Context

L'arnaque type commence par un SMS (« Amende impayée : 35 €. Payez ici : antai-paiement-gouv.com »), mène à un faux site qui imite un service officiel avec un compte à rebours, et demande la carte bancaire. Virio intervient entre le clic et la saisie de la carte.

## Capabilities and Constraints

- Ce que fait l'extension (tel que montré dans le film de marque) : détecter, bloquer, rediriger vers le site officiel. Écran de blocage avec niveau de risque et raisons (imite un service de l'État, domaine créé récemment, demande la carte bancaire). Confirmation « Site officiel vérifié ».
- Extension Chrome. Statut : bientôt disponible (pas encore téléchargeable). Le CTA est « être prévenu du lancement ».
- Gratuite : confirmé par l'utilisateur. Sans abonnement.
- Non décidé / non fourni : lien Chrome Web Store, backend pour la liste d'attente, politique de données, autres navigateurs, mentions légales. Ne pas inventer de chiffres d'efficacité, de nombre d'utilisateurs, de témoignages ni de partenaires.

## Brand Commitments

- Nom : **Virio** (confirmé, comme dans le film).
- Logo : bouclier vert avec une « pupille » en forme de capsule verticale (la capsule du lien du SMS devenue marque) — `SHIELD_PATH` du film.
- Le site garde le thème du film motion design (demande explicite de l'utilisateur) : fond encre très sombre, vert = protection uniquement, rouge = arnaque uniquement, Inter + JetBrains Mono, cartes de SMS réalistes, téléphone flottant en 3D, mots qui claquent (« STOP. », « DÉTECTE », « BLOQUE », « REDIRIGE »).
- Source : projet Remotion `mon-video` (src/v3), session « Installer les skills du projet ».

## Evidence on Hand

- Film de marque 40 s (9:16) : `mon-video/out/vigie-v3-40s-9x16.mp4` et ses composants (SMS, faux site, écran de blocage, site officiel).
- Statistiques publiques vérifiées (sources dans le pied de page du site) : SSMSI / ministère de l'Intérieur, Banque de France (OSMP 2024), Cybermalveillance.gouv.fr (rapport 2024), FBI IC3 2024, FTC 2024, GASA & Feedzai 2024.
- Absents : témoignages, utilisateurs, presse, partenaires, chiffres d'efficacité de l'extension. Ne pas les fabriquer.

## Product Principles

1. Montrer plutôt qu'affirmer : on voit l'arnaque se dérouler, puis Virio l'arrêter.
2. Expliquer pourquoi : chaque blocage dit en clair ce qui cloche.
3. Chaque chiffre est sourcé et vérifiable.
4. Gratuit, sans condition : jamais de friction pour se protéger.

## Accessibility & Inclusion

Grand public, tous âges : textes lisibles, contraste AA, démo utilisable au clavier et au tactile, chemin `prefers-reduced-motion`.
