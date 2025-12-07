# CyberSecurity Interview Vault (CSIV)

CSIV est une web app minimaliste pour s’entraîner rapidement aux questions d’entretien en cybersécurité.
Tu ouvres le site, une question apparaît, tu réfléchis, puis tu affiches la réponse.

## Usage Rapide
1. Ouvre [csiv.lucaprc.fr](https://csiv.lucaprc.fr)
2. Une question tombe, tu réfléchis comme en entretien.
3. Tu affiches la réponse, tu ajustes tes filtres si besoin.


## Questions
Les questions sont définies dans data/questions.json.
Chaque entrée suit ce format :
```json
{
  "id": "q1",
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

Tu peux ajouter autant de catégories / difficultés que tu veux.
Les filtres et compteurs se mettent automatiquement à jour en lisant le JSON.

## Stack
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion