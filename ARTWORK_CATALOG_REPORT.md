# Artflow — rapport d’audit du catalogue

## Résumé de l’inventaire

- Images candidates dans les six dossiers de catégories : **333**.
- Œuvres uniques après déduplication par SHA-256 exact : **270**.
- Groupes de doublons exacts : **53** (63 fichiers source supplémentaires fusionnés dans les enregistrements canoniques).
- Fichiers source supplémentaires fusionnés : **63**.
- Œuvres présentes dans plusieurs dossiers de catégories : **53**.
- Images produits générées : **270 fichiers WebP**.
- Formats source des œuvres : JPEG: 225, PNG: 108.

## Répartition par dossier officiel

- **abstrait** → Art abstrait / الفن التجريدي : 72 fichiers source, 72 œuvres uniques.
- **art islamique** → Art islamique / الفن الإسلامي : 22 fichiers source, 22 œuvres uniques.
- **culture marocaine** → Culture marocaine / الثقافة المغربية : 44 fichiers source, 44 œuvres uniques.
- **meilleurs ventes** → Meilleures ventes / الأكثر مبيعًا : 18 fichiers source, 18 œuvres uniques.
- **minimaliste et géométrique** → Minimaliste et géométrique / البساطة والأشكال الهندسية : 31 fichiers source, 31 œuvres uniques.
- **nature et animaux** → Nature et animaux / الطبيعة والحيوانات : 146 fichiers source, 144 œuvres uniques.

## Doublons et déduplication

Les fichiers ont été comparés par empreinte SHA-256. Les fichiers strictement identiques, même lorsqu’ils portent des noms différents ou apparaissent dans plusieurs dossiers, sont regroupés dans un seul enregistrement produit. Les appartenances à chaque dossier source sont conservées dans `categories`. Les images visuellement proches mais ayant une empreinte différente ont été passées dans une comparaison perceptuelle pHash, puis les candidates ambiguës ont été vérifiées visuellement. Des compositions proches (par exemple des tableaux floraux sur des mockups de salon similaires) ont été conservées séparément lorsque le tableau lui-même différait. Aucune paire visuellement distincte n’a été fusionnée sur la seule base d’un nom semblable ou d’un décor de pièce similaire.
Les images de production sont des copies WebP optimisées, une par œuvre unique. Les originaux du ZIP n’ont pas été modifiés. Le fichier `ASSET_AUDIT.csv` fournit, pour chaque image source, le chemin, le format, les dimensions, la catégorie, la résolution du doublon, l’ID produit, les titres et la couleur estimée.

## Collection Meilleures ventes

Le dossier source `meilleurs ventes` contient **18 fichiers**, correspondant à **18 œuvres uniques**. La liste `bestSellerArtworkIds` dans `site/data/store-config.json` est générée directement à partir de ces enregistrements, sans créer de catégorie supplémentaire ni de produits dupliqués.

## Héros de la page d’accueil — blocage à résoudre

Aucun dossier nommé `hero` n’existe dans l’archive. Un fichier `Hero.png` (1536 × 1024, PNG) existe à la racine, mais il ne se trouve pas dans le dossier obligatoire `hero/`. Conformément au brief, ce fichier n’a pas été substitué à l’image hero requise et n’a pas été ajouté au catalogue. La page d’accueil est donc livrée avec un hero éditorial typographique temporaire, sans image de couverture. Pour compléter cette partie, ajouter le visuel approuvé dans `site/assets/hero/cover.webp` ; le site détectera automatiquement ce fichier et l’utilisera comme couverture sans autre modification du code.

## Logo et favicon

Le logo et le favicon fournis ont été copiés sans modification dans `site/assets/brand/`. Le logo utilise `#4400AB`, qui sert de couleur principale de marque dans l’interface.

## Couleurs dominantes

Chaque œuvre reçoit une étiquette de couleur afin d’activer le filtre. La classification est calculée à partir d’un recadrage central de chaque image source, pour réduire l’influence des bords de la pièce et du mobilier présents dans plusieurs fichiers de type mockup. Les fichiers fournis montrent souvent le tableau dans une pièce plutôt que le visuel du tableau seul ; cette estimation ne peut donc pas isoler parfaitement l’œuvre dans tous les cas. Les catégories colorimétriques sont complètes et opérationnelles, mais les affectations indiquées comme incertaines devront être revues visuellement par le propriétaire avant publication définitive.
Répartition estimée : Beige: 33, Blanc: 15, Bleu: 45, Gris: 6, Jaune / doré: 7, Marron: 9, Multicolore: 23, Noir: 1, Orange: 108, Rose: 4, Rouge: 7, Vert: 8, Violet: 4.

## Couvertures de catégories

- **Art abstrait** : artwork-bc4ffd0ff0e1 (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).
- **Art islamique** : artwork-633555938bd0 (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).
- **Culture marocaine** : artwork-03af9cd69271 (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).
- **Meilleures ventes** : artwork-e4c3af2934ab (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).
- **Minimaliste et géométrique** : artwork-8f872d8a5be8 (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).
- **Nature et animaux** : artwork-9827985755ae (œuvre existante réutilisée comme couverture, sans nouvel enregistrement produit).

## Limites et vérifications

- Les six dossiers officiels déterminent les appartenances aux catégories. Le dossier accentué est présent dans le ZIP sous un nom échappé par les métadonnées (`minimaliste et g#U00e9om#U00e9trique`) ; il est mappé vers le libellé officiel `minimaliste et géométrique` du brief.
- Les images de catégorie présentent souvent des tableaux dans une pièce (mockups). Elles sont conservées sans recadrage destructif et affichées en `contain` pour éviter de couper les visuels.
- Les titres français et arabes sont des noms éditoriaux descriptifs créés pour l’interface. Ils ne prétendent pas identifier un artiste, une origine historique, ni le texte d’une calligraphie.
- Le hero approuvé reste le seul blocage asset majeur : le dossier source `hero/` est absent.
- Le contrôle d’intégrité des données confirme 270 fiches, 270 slugs uniques, 18 IDs best-sellers uniques et 270 fichiers image présents. `node --check site/app.js` et les requêtes HTTP locales sur les fichiers principaux et une image produit ont également réussi. Le navigateur automatisé de cet environnement a bloqué l’accès au serveur local (`ERR_BLOCKED_BY_ADMINISTRATOR`) ; le rendu visuel interactif n’a donc pas pu être certifié ici.
- Le build est une application front-end statique sans backend, conçue pour GitHub Pages. Les commandes et résultats de validation sont consignés dans le README.
