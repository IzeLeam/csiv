# Contribuer à CyberSecurity Interview Vault (CSIV)

Ce projet vise à rassembler des questions/réponses d'entretien en cybersécurité, claires et directement utiles pour s'entraîner.

## Proposer de nouvelles questions

Il y a deux façons principales de proposer des questions :

### 1. Via l'interface du site (recommandé)

Sur le site, un bouton en bas de page permet de **proposer une nouvelle question** via un formulaire.

- Tu renseignes : catégorie, niveau, fréquence, question/réponse en FR et/ou EN.
- Ta proposition est enregistrée dans un fichier JSON séparé côté serveur.
- Elles pourront ensuite être relues et intégrées dans le pool principal de questions.

C'est la manière la plus simple si tu n'as pas envie de toucher au code.

### 2. Via un Pull Request sur GitHub

Si tu es à l'aise avec Git et les PR, tu peux :

1. **Fork** le dépôt.
2. **Cloner** ton fork en local.
3. Ajouter/modifier des questions dans `data/questions.json`.
4. Lancer le projet en local si tu veux tester :

   ```bash
   npm install
   npm run dev
   ```

5. Vérifier que tout s'affiche bien et que les filtres fonctionnent toujours.
6. Ouvrir une **Pull Request** avec un titre clair (ex: `feat: add blue team questions`).

### Format des questions

Les questions se trouvent dans `data/questions.json` et suivent ce format sans identifiant technique :

```json
{
  "category": "network",          // ex: network, web, cloud, blue-team, etc.
  "difficulty": "junior",         // ex: junior, intermediate, senior
  "frequency": "high",            // ex: low, medium, high (fréquence en entretien)
  "translations": {
    "en": {
      "question": "...",
      "answer": "..."
    },
    "fr": {
      "question": "...",
      "answer": "..."
    }
  }
}
```

Quelques conseils :
- **Précision** : des réponses claires, sans jargon inutile.
- **Pédagogie** : expliquer le *pourquoi*, pas seulement le *quoi*.
- **Réalisme** : des questions qu’on voit vraiment en entretien.

## Style & qualité

- Évite les fautes grossières (FR comme EN).
- Garde un ton professionnel mais accessible.
- Pas d’informations sensibles ou confidentielles.

## Bug reports & idées

Tu peux aussi ouvrir une **Issue** pour :
- Proposer de nouvelles catégories / filtres
- Signaler un bug ou une incohérence
- Suggérer une amélioration UX/UI
