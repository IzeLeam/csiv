import { QuestionCard } from "../components/QuestionCard";
import { HeaderBar } from "../components/HeaderBar";
import Footer from "../components/Footer";
import Link from "next/link";
import { t } from "./translations";
import { Language } from "../types";
import { useState, useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";
import { Question } from "../types";
import { FilterSelect } from "../components/FilterSelect";
import { motion } from "framer-motion";

export default function Library() {
  const [language, setLanguage] = useState<Language>("fr");
  const {
    allCategories,
    allDifficulties,
    allFrequencies,
    difficulty,
    setDifficulty,
    frequency,
    setFrequency,
    category,
    setCategory,
    currentIndex,
    currentQuestion,
    currentTranslation,
    showAnswer,
    setShowAnswer,
    totalFiltered,
    countsByCategory,
    countsByDifficulty,
    countsByFrequency,
    handleNextQuestion,
  } = useQuestions(language);

  const difficultyDisplay = (value: string) => {
    if (value === "all") return t(language, "allLevels");
    if (value.toLowerCase() === "junior") return "Junior";
    if (value.toLowerCase() === "intermediate")
      return language === "en" ? "Intermediate" : "Intermédiaire";
    if (value.toLowerCase() === "senior") return "Senior";
    return value;
  };

  const frequencyDisplay = (value: string) => {
    if (value === "all") return t(language, "allFrequencies");
    if (value.toLowerCase() === "low") return t(language, "frequencyLow");
    if (value.toLowerCase() === "medium") return t(language, "frequencyMedium");
    if (value.toLowerCase() === "high") return t(language, "frequencyHigh");
    return value;
  };

  const categoryDisplay = (value: string) => {
    if (value === "all") return t(language, "allCategories");
    if (value.toLowerCase() === "network")
      return t(language, "categoryNetwork");
    if (value.toLowerCase() === "web") return t(language, "categoryWeb");
    if (value.toLowerCase() === "general")
      return t(language, "categoryGeneral");
    return value;
  };

  useEffect(() => {}, []);

  return (
    <main>
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 md:px-8 md:py-12">
          <HeaderBar language={language} setLanguage={setLanguage} />

          <motion.section
            className="mb-4 flex flex-wrap items-end gap-2 md:mb-6 md:flex-nowrap md:gap-3"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
          >
            <FilterSelect
              label={t(language, "categoryLabel")}
              value={category}
              onChange={(value) => setCategory(value)}
              options={[
                {
                  value: "all",
                  label: `${categoryDisplay("all")} (${
                    countsByCategory.all ?? 0
                  })`,
                },
                ...allCategories.map((c) => ({
                  value: c,
                  label: `${categoryDisplay(c)} (${countsByCategory[c] ?? 0})`,
                })),
              ]}
            />

            <FilterSelect
              label={t(language, "difficultyLabel")}
              value={difficulty}
              onChange={(value) => setDifficulty(value)}
              options={[
                {
                  value: "all",
                  label: `${difficultyDisplay("all")} (${
                    countsByDifficulty.all ?? 0
                  })`,
                },
                ...allDifficulties.map((d) => ({
                  value: d,
                  label: `${difficultyDisplay(d)} (${
                    countsByDifficulty[d] ?? 0
                  })`,
                })),
              ]}
            />

            <FilterSelect
              label={t(language, "frequencyLabel")}
              value={frequency}
              onChange={(value) => setFrequency(value)}
              options={[
                {
                  value: "all",
                  label: `${frequencyDisplay("all")} (${
                    countsByFrequency.all ?? 0
                  })`,
                },
                ...allFrequencies.map((f) => ({
                  value: f,
                  label: `${frequencyDisplay(f)} (${
                    countsByFrequency[f] ?? 0
                  })`,
                })),
              ]}
            />
          </motion.section>
          <Footer language={language} />
        </div>
      </div>
    </main>
  );
}
