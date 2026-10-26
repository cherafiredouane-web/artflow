# Artflow — site statique prêt pour GitHub Pages

Site vitrine / catalogue bilingue pour Artflow. Le site utilise HTML, CSS et JavaScript natifs, sans serveur, clé API, abonnement, processus de compilation ou dépendance npm. Les routes utilisent des fragments (`#/oeuvres`, `#/categorie/nature`, `#/oeuvre/...`) : les liens restent partageables et fonctionnent sur GitHub Pages, y compris lorsque le dépôt est publié sous un sous-chemin.

## Fonctions incluses

- Interface française et arabe avec mémorisation de la langue, direction RTL complète et police Alexandria pour l’arabe.
- Six catégories reprenant les dossiers source, plus la page « Toutes les œuvres ».
- Catalogue unique de **199 œuvres** ; les copies strictement identiques sont regroupées en un seul enregistrement et conservent l’union de leurs catégories source.
- Titres français uniques, titres arabes, alias de fichiers d’origine et recherche bilingue avec normalisation des variantes de caractères arabes.
- Filtrage combinable par catégorie et couleur dominante, tri A–Z / Z–A, état vide, compteurs et « Afficher plus ».
- Fiches d’œuvres partageables, œuvres similaires, commandes WhatsApp par œuvre avec titre et référence dans le message.
- Images converties en WebP, chargement différé dans le catalogue, attributs alt et dispositions mobiles adaptées.
- Déploiement GitHub Pages avec GitHub Actions.

## 1. Ajouter ces fichiers au dépôt GitHub

1. Décompressez `artflow-site.zip` sur votre ordinateur.
2. Ouvrez votre dépôt GitHub actuel.
3. Envoyez **le contenu** du dossier décompressé à la racine du dépôt (les fichiers `index.html`, `app.js`, `styles.css`, les dossiers `assets/`, `data/`, `.github/` et le rapport doivent être directement à la racine, pas enfouis dans un autre dossier).
4. Validez les changements avec un commit, par exemple `Add Artflow website`.

Vous pouvez aussi remplacer les fichiers équivalents dans le dépôt, mais gardez une copie de sauvegarde avant de remplacer un site existant.

## 2. Activer GitHub Pages

1. Sur GitHub, ouvrez **Settings → Pages**.
2. Dans **Build and deployment → Source**, choisissez **GitHub Actions**.
3. Vérifiez que `.github/workflows/pages.yml` est présent dans la branche par défaut.
4. Après le commit, ouvrez l’onglet **Actions** et attendez que le workflow `Deploy Artflow to GitHub Pages` termine avec succès.
5. GitHub affichera l’URL publiée dans **Settings → Pages** et dans le résumé du déploiement.

Le site n’a pas été publié depuis cet environnement : son URL finale dépend du compte et du nom de votre dépôt.

## 3. Confirmer le prix et les dimensions avant lancement

Ouvrez **`data/store-config.json`**. Modifiez ces deux champs uniquement après confirmation :

```json
{
  "productPriceMAD": null,
  "productDimensions": ""
}
```

- `productPriceMAD` : remplacez `null` par le prix partagé en dirhams, par exemple `230`.
- `productDimensions` : remplacez la chaîne vide par les dimensions confirmées, par exemple `60 × 40 cm`.

Ces champs sont partagés par toutes les fiches et les messages WhatsApp. Tant qu’ils ne sont pas renseignés, le site affiche un prix sur demande et demande de confirmer le format avec Artflow — aucun montant ni format n’est inventé.

Le numéro WhatsApp se trouve au même endroit dans `whatsappNumber`, au format international sans signe `+` ni espaces : `212627025271`.

## 4. Modifier le catalogue

- **Titres, titres arabes, catégories, couleurs, mots-clés, alt et références source :** `data/artworks.json`.
- **Version CSV pour édition de masse :** `data/artworks.csv` (le JSON reste la source utilisée par le site ; reportez les changements du CSV dans le JSON si vous l’utilisez pour préparer des modifications).
- **Liste et textes des catégories :** `data/categories.json`.
- **Prix, dimensions, téléphone WhatsApp et textes de secours :** `data/store-config.json`.
- **Rapport d’audit avec les sources et les groupes de doublons :** `ARTWORK_CATALOG_REPORT.md`.

Chaque œuvre possède un identifiant stable (`art-…`), un slug et une seule image canonique. Quand une œuvre appartient à plusieurs catégories, ajoutez les identifiants des catégories dans le même tableau `categories` — ne créez pas une deuxième fiche produit.

## 5. Ajouter une nouvelle œuvre

1. Ajoutez l’image optimisée dans `assets/artworks/` au format WebP.
2. Ajoutez **un seul** objet à `data/artworks.json`, avec un nouvel `id`, un `slug` distinct, `titleFr`, `titleAr`, `image`, `categories`, `dominantColor`, `keywordsFr`, `keywordsAr`, `originalFilenames`, `altFr` et `altAr`.
3. Utilisez un ou plusieurs identifiants existants dans `categories` : `abstrait`, `animaux`, `islamique`, `culture-marocaine`, `minimalisme`, `nature`.
4. Attribuez exactement une couleur parmi : `Beige`, `Blanc`, `Noir`, `Gris`, `Marron`, `Bleu`, `Vert`, `Rouge`, `Orange`, `Jaune / doré`, `Rose`, `Violet`, `Multicolore`.
5. Vérifiez que l’image et les liens de la fiche fonctionnent, puis commit/push pour déclencher le déploiement.

## Structure

```text
.
├── index.html
├── app.js
├── styles.css
├── assets/
│   ├── brand/            # logo et favicon SVG d’origine
│   └── artworks/         # 199 images WebP canoniques
├── data/
│   ├── artworks.json
│   ├── artworks.csv
│   ├── categories.json
│   └── store-config.json
├── .github/workflows/pages.yml
└── ARTWORK_CATALOG_REPORT.md
```

## Validation effectuée dans l’environnement de préparation

- Audit du ZIP : 232 fichiers image, 6 dossiers source, aucune image illisible détectée.
- Déduplication SHA-256 : 199 enregistrements uniques et 31 groupes de copies identiques.
- Contrôle par empreinte perceptuelle : aucun doublon visuel supplémentaire probable au seuil de distance utilisé.
- Export WebP : environ 14,7 Mo pour les 199 images canoniques.
- Fichiers JS : syntaxe vérifiée avec `node --check`.
- Fonctionnalités HTML/JS testables localement ; le workflow GitHub Pages doit être confirmé après import dans votre propre dépôt.

La classification de couleur utilise une analyse de zone centrale avec des corrections visuelles sur les fichiers Artboard. Une revue humaine reste recommandée pour les œuvres où la photo de mise en scène rend la couleur dominante moins évidente.
