# Artflow — site e-commerce bilingue

Site statique bilingue (français / arabe) pour Artflow, préparé pour GitHub Pages. Le projet fonctionne sans serveur applicatif, base de données, clé API ou dépendance payante. Les données catalogue et les commandes WhatsApp sont gérées côté navigateur.

## Ce qui est inclus

- Accueil éditorial, collection **Meilleures ventes** sous forme de carrousel superposé, et six pages de catégories.
- Catalogue de **270 œuvres uniques** dédupliquées à partir des 333 fichiers image des six dossiers officiels.
- Recherche en français et en arabe, filtre combinable par catégorie et couleur dominante, tri alphabétique, filtres actifs et affichage progressif.
- Fiche individuelle pour chaque œuvre, trois formats/prix communs, et commande WhatsApp préremplie après sélection obligatoire d’un format.
- Interface FR / العربية avec bascule LTR / RTL et mémorisation du choix de langue.
- Images WebP optimisées, logo et favicon d’origine, navigation par URL hash compatible avec un site GitHub Pages hébergé dans un sous-dossier.
- Rapport d’audit complet : `ARTWORK_CATALOG_REPORT.md` et `ASSET_AUDIT.csv`.

## Technologie

Le ZIP fourni contenait les ressources de marque et les dossiers d’images, mais pas de dépôt Git existant ni de squelette d’application. Pour livrer un site statique autonome sans dépendances à installer, l’interface est construite en HTML, CSS et JavaScript natifs. Les fichiers de données sont des JSON séparés. Cela évite un serveur de développement et permet à GitHub Pages de servir directement le dossier `site/`.

Les polices Sora et Alexandria sont chargées depuis Google Fonts, avec des polices de secours si le service est indisponible.

## Tarifs et WhatsApp

Les trois formats sont configurés à un seul endroit :

`site/data/store-config.json`

- `60 × 40 cm` — `230 DH`
- `80 × 60 cm` — `280 DH`
- `85 × 110 cm` — `342 DH`

Le numéro WhatsApp est également dans ce fichier : `212627025271`. Les boutons de commande restent désactivés tant qu’un format n’a pas été sélectionné.

## Modifier le catalogue

Le catalogue central est dans `site/data/catalog.json`. Chaque entrée contient un ID stable, un slug, un titre français, un titre arabe, un chemin image, ses catégories (plusieurs sont possibles), une couleur dominante, les mots-clés et les noms de fichiers source.

Pour mettre à jour un titre, une traduction, des mots-clés, une catégorie ou une couleur, modifiez l’entrée correspondante dans ce fichier. Les libellés et les introductions de catégories sont dans `site/data/categories.json`.

### Ajouter une œuvre

1. Ajoutez le fichier optimisé de l’œuvre dans `site/assets/artworks/` (WebP recommandé).
2. Ajoutez un nouvel objet à `site/data/catalog.json` avec un ID et un slug uniques, les titres FR/AR, le chemin vers l’image, au moins une catégorie officielle, une couleur dominante et les mots-clés.
3. Ajoutez l’ID dans `bestSellerArtworkIds` de `site/data/store-config.json` uniquement lorsque l’œuvre doit faire partie de la sélection Meilleures ventes.
4. Actualisez les totaux et la correspondance source dans `ARTWORK_CATALOG_REPORT.md` et `ASSET_AUDIT.csv`.

Ne créez pas une deuxième fiche pour une œuvre simplement parce qu’elle appartient à plusieurs catégories : ajoutez plusieurs IDs à son tableau `categories`.

### Modifier la sélection Meilleures ventes

La liste se trouve dans `site/data/store-config.json`, propriété `bestSellerArtworkIds`. Elle contient actuellement les **18 œuvres uniques** issues du dossier `meilleurs ventes` fourni.

## Visuel de couverture manquant

L’archive fournie ne contient aucun dossier source nommé `hero/`. Elle contient un fichier `Hero.png` à la racine, mais celui-ci n’a pas été utilisé comme remplacement, conformément au brief. Le haut de la page d’accueil est donc éditorial et textuel jusqu’à ce que le visuel approuvé soit fourni. Placez le fichier approuvé dans `site/assets/hero/cover.webp` : le site le détectera automatiquement au chargement et l’utilisera en couverture plein écran, sans modification du code. Le rapport d’audit documente ce blocage.

## Validation locale

Depuis la racine du projet :

```bash
python scripts/verify_site.py
node --check site/app.js
python -m http.server 8000 --directory site
```

Puis ouvrez `http://localhost:8000`. Les URL de pages utilisent `#/catalog`, `#/category/abstrait` ou `#/artwork/<slug>` ; un rafraîchissement fonctionne donc sans règle de réécriture serveur.

## Déployer sur GitHub Pages

Le workflow est inclus dans `.github/workflows/deploy.yml` et publie automatiquement `site/` à chaque push sur la branche `main` (ou manuellement avec `workflow_dispatch`).

1. Décompressez ce projet à la racine du dépôt GitHub voulu et poussez les fichiers sur la branche `main`.
2. Dans le dépôt GitHub, ouvrez **Settings → Pages**.
3. Dans **Build and deployment**, choisissez **GitHub Actions** comme source.
4. Ouvrez l’onglet **Actions** et vérifiez la réussite de `Deploy Artflow to GitHub Pages`.
5. GitHub affichera l’URL publique du site dans **Settings → Pages** après un déploiement réussi.

Le projet n’a pas été poussé vers GitHub ni publié depuis cette session : aucun dépôt distant n’était connecté dans les fichiers fournis. Le workflow est prêt, mais le site ne doit pas être considéré comme en ligne tant que les étapes ci-dessus ne sont pas effectuées et vérifiées.

## Benchmark UX consulté

Les pages publiques actuelles de Massinart et Weenart ont été consultées pour leurs conventions de découverte : collections, mises en avant de best-sellers, filtres, et choix/options produit. Artflow reprend uniquement ces idées générales de parcours d’achat, avec son identité et ses contenus propres. Sources : https://massinart.ma/ et https://weenart.ma/.
