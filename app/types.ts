export type Language = "en" | "fr";

export type Question = {
  category: string;
  difficulty: string;
  frequency: string;
  translations: {
    en: { question: string; answer: string };
    fr: { question: string; answer: string };
  };
};
