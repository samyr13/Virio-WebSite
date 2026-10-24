# Virio · site de lancement

Site vitrine de Virio, l'extension Chrome gratuite qui bloque les arnaques au moment du clic.
Le thème reprend le film motion design (projet `mon-video`, dossier `src/v3`).

## Fichiers

- `index.html` : la page (textes, écrans du téléphone de l'animation)
- `css/style.css` : les styles (couleurs et courbes d'animation du film en haut du fichier)
- `js/main.js` : le téléphone 3D, l'animation au scroll, la démo, les compteurs
- `assets/favicon.svg` : l'icône (le bouclier)

Aucune installation : GSAP, ScrollTrigger et Lenis sont chargés depuis un CDN, les polices depuis Google Fonts.

## Voir le site en local

```bash
python -m http.server 5173
```

Puis ouvrir http://localhost:5173.

## Mettre en ligne sur ton hébergeur (OVH, Hostinger, IONOS…)

Le fichier `virio-site-a-envoyer.zip` contient uniquement ce qui doit aller sur le serveur :
`index.html`, `css/`, `js/`, `assets/`, `subscribe.php` et `data/.htaccess`.
(`PRODUCT.md`, `DESIGN.md`, `README.md` et `.impeccable/` restent sur ton ordinateur.)

1. Connecte-toi à l'espace client de ton hébergeur et ouvre le **gestionnaire de fichiers**
   (ou un logiciel FTP comme FileZilla, avec les identifiants FTP donnés par l'hébergeur).
2. Va dans le dossier public de ton domaine :
   - **OVH** : `www`
   - **Hostinger** : `public_html`
   - **IONOS** : le dossier relié à ton domaine (racine du webspace par défaut)
3. Envoie le zip puis décompresse-le **directement dans ce dossier** : `index.html` doit être à la racine, pas dans un sous-dossier.
   Sans gestionnaire de fichiers, décompresse le zip sur ton ordinateur et envoie son contenu par FTP.
   Le fichier `data/.htaccess` commence par un point : dans FileZilla, active l'affichage des fichiers cachés si tu ne le vois pas.
4. Active le **certificat SSL gratuit** (Let's Encrypt) dans l'espace client pour avoir `https://`.
5. Ouvre ton domaine et teste le formulaire « Me prévenir » avec ton propre e-mail.

Si le domaine est chez un autre fournisseur que l'hébergement, il faut faire pointer ses DNS vers l'hébergeur (l'espace client de l'hébergeur indique les valeurs).

### Le formulaire « Me prévenir »

`subscribe.php` enregistre chaque inscription (date + e-mail) dans `data/inscrits.csv`, sur le serveur.
Ce fichier n'est pas accessible depuis le web (`data/.htaccess` le bloque).
Pour récupérer la liste : gestionnaire de fichiers → `data/inscrits.csv` → télécharger (il s'ouvre dans Excel).

Il faut PHP sur l'hébergement : c'est le cas des offres web d'OVH, Hostinger et IONOS.

## À compléter avant le lancement

- Le lien du Chrome Web Store, quand l'extension sera publiée (remplacer les boutons « Être prévenu »).
- Les mentions légales et la politique de confidentialité.
- Vérifier les chiffres une dernière fois : ils datent des rapports 2024 (sources dans le pied de page).

## Sources des chiffres

1. SSMSI, ministère de l'Intérieur : escroqueries et fraudes aux moyens de paiement 2016-2023 (juillet 2024), via La finance pour tous.
2. Banque de France : rapport de l'Observatoire de la sécurité des moyens de paiement 2024 (septembre 2025).
3. Cybermalveillance.gouv.fr : rapport d'activité 2024 (mars 2025).
4. GASA & Feedzai : Global State of Scams Report 2024 (novembre 2024).
5. FBI : Internet Crime Report 2024 (avril 2025).
