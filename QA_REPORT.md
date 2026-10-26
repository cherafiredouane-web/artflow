# Artflow — rapport de contrôle technique

## Résultats de l'audit des fichiers

- **232** fichiers image source détectés dans les six catégories.
- **199** œuvres uniques dans le catalogue livré, après comparaison exacte des empreintes SHA-256.
- **31** groupes de fichiers identiques regroupés en une seule fiche par œuvre ; les catégories source de chaque copie sont fusionnées dans le tableau `categories`.
- **199** identifiants uniques, **199** slugs uniques et **199** titres français uniques.
- Toutes les fiches ont un titre arabe, des mots-clés dans les deux langues, une couleur dominante valide et des catégories existantes.
- Toutes les images WebP référencées existent et ont été vérifiées comme fichiers image lisibles.
- Les 199 images optimisées occupent environ **14,72 Mo** au total.
- Aucun fichier image source illisible n'a été détecté.

## Tests fonctionnels exécutés

Le test de fumée a été exécuté dans Chromium avec les données de catalogue chargées dans un environnement de test en mémoire. Les images y étaient remplacées par une illustration de test afin d'éviter les restrictions de navigation locale de cet environnement. Les vrais fichiers graphiques ont été vérifiés séparément.

**25 vérifications réussies :**

1. Affichage de la page d'accueil et des six catégories.
2. Comptage de 199 œuvres uniques.
3. Absence de débordement horizontal sur ordinateur.
4. Catalogue complet de 199 œuvres, avec 24 cartes initiales.
5. Bouton « Afficher plus » montrant 48 cartes après activation.
6. Recherche française en direct (`Fleurs` donne 11 résultats dans le catalogue actuel).
7. La catégorie Nature contient 77 œuvres associées.
8. La fiche de filtres d'une catégorie ne propose pas un filtre de catégorie redondant.
9. Combinaison effective Catégorie + couleur dominante (Nature + Bleu donne 10 résultats dans le catalogue actuel).
10. Bascule vers l'arabe, avec `lang="ar"` et direction RTL.
11. Traduction arabe du lien d'accès rapide.
12. Recherche arabe par nom de catégorie (`الطبيعة`).
13. Absence de débordement horizontal en arabe sur ordinateur.
14. Numéro WhatsApp correct (`212627025271`).
15. Message WhatsApp contenant le titre et l'identifiant stable de l'œuvre choisie.
16. Cartes de catégories empilées verticalement sur mobile.
17. Image et texte côte à côte à l'intérieur des cartes de catégories mobiles.
18. Absence de débordement horizontal à 320 px.
19. Ouverture de la fenêtre de filtres sur mobile.
20. Fermeture de la fenêtre par la touche Échap.
21. Aucun incident JavaScript non intercepté pendant les scénarios exécutés.
22. Syntaxe JavaScript validée avec `node --check app.js`.
23. Le prix partagé de 230 DH configuré pour le test apparaît sur les cartes.
24. Le prix partagé et les dimensions `60 × 40 cm` configurés pour le test apparaissent dans le message WhatsApp.
25. Un prix de configuration égal à zéro est rejeté au profit du message de confirmation, plutôt que publié.

## Points à valider avant publication

- **Prix commun :** laissé à `null` dans `data/store-config.json`, parce que la vitrine existante affiche plusieurs prix et n'établit pas de prix commun vérifiable. Le site ne publie pas de prix nul ou inventé.
- **Dimensions communes :** laissées vides dans `data/store-config.json` car elles n'étaient pas confirmables. Les fiches et messages de commande demandent une confirmation à Artflow.
- **Couleurs dominantes :** une classification automatique a été faite sur la zone utile des images, avec corrections sur certaines créations Artboard. Une revue visuelle humaine reste recommandée pour les œuvres mises en scène où une couleur dominante pourrait être discutée.
- **Déploiement réel :** le site n'a pas été envoyé dans le dépôt GitHub de l'utilisateur et n'est pas encore public depuis cet environnement. Le workflow GitHub Actions est fourni ; l'exécution du déploiement doit être vérifiée après l'import dans le dépôt et l'activation de GitHub Pages.
- **Contrôle en ligne :** le navigateur de cet environnement bloque la navigation locale sur le serveur de test. Le smoke test a donc été exécuté en mémoire. Il faudra effectuer une dernière vérification navigateur sur l'URL GitHub Pages après le premier déploiement.

## Approche de déploiement

Le site est en HTML, CSS et JavaScript natifs, sans compilation, npm, backend ou clé API. Les routes utilisent des fragments `#`, ce qui convient à l'hébergement GitHub Pages depuis la racine ou un sous-chemin de dépôt.
