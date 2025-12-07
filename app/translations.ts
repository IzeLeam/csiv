import type { Language } from "./types";

export const uiTexts: Record<Language, Record<string, string>> = {
  en: {
    categoryLabel: "Category",
    difficultyLabel: "Difficulty",
    frequencyLabel: "Frequency in interview",
    allCategories: "All categories",
    allLevels: "All levels",
    allFrequencies: "All",
    frequencyLow: "Low",
    frequencyMedium: "Medium",
    frequencyHigh: "High",
    categoryNetwork: "Network",
    categoryWeb: "Web",
    categoryGeneral: "General",
    cardCategory: "Category",
    cardDifficulty: "Difficulty",
    cardFrequency: "Frequency",
    revealHint:
      "Reveal the answer when you've tried to reason it out.",
    newQuestion: "New question",
    showAnswer: "Show answer",
    hideAnswer: "Hide answer",
    footerCta: "Submit a new question",
    footerText: "Made for internship struggler",
    title: "CyberSecurity Interview Vault",
  },
  fr: {
    categoryLabel: "Catégorie",
    difficultyLabel: "Difficulté",
    frequencyLabel: "Fréquence en entretien",
    allCategories: "Toutes catégories",
    allLevels: "Tous niveaux",
    allFrequencies: "Toutes",
    frequencyLow: "Faible",
    frequencyMedium: "Moyenne",
    frequencyHigh: "Forte",
    categoryNetwork: "Réseau",
    categoryWeb: "Web",
    categoryGeneral: "Général",
    cardCategory: "Catégorie",
    cardDifficulty: "Difficulté",
    cardFrequency: "Fréquence",
    revealHint: "Révèle la réponse après avoir vraiment réfléchi.",
    newQuestion: "Nouvelle question",
    showAnswer: "Afficher la réponse",
    hideAnswer: "Cacher la réponse",
    footerCta: "Proposer une nouvelle question",
    footerText: "Fais pour les galèriens de stage",
    title: "CyberSecurity Interview Vault",
  },
};

export const t = (
  language: Language,
  key: keyof (typeof uiTexts)[Language]
): string => uiTexts[language][key];
