"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Language } from "./types";
import { t } from "./translations";
import { FilterSelect } from "./components/FilterSelect";
import { HeaderBar } from "./components/HeaderBar";
import { QuestionCard } from "./components/QuestionCard";
import { useQuestions } from "./hooks/useQuestions";
import Footer from "./components/Footer";

export default function Home() {
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
    if (value.toLowerCase() === "os") return t(language, "categoryOs");
    if (value.toLowerCase() === "crypto") return t(language, "categoryCrypto");
    if (value.toLowerCase() === "cloud") return t(language, "categoryCloud");
    if (value.toLowerCase() === "blue-team") return t(language, "categoryBlueTeam");
    if (value.toLowerCase() === "red-team") return t(language, "categoryRedTeam");
    return value;
  };

  return (
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
                label: `${frequencyDisplay(f)} (${countsByFrequency[f] ?? 0})`,
              })),
            ]}
          />
        </motion.section>

        <main className="flex flex-1 flex-col gap-6">
          {currentQuestion ? (
            <QuestionCard
              language={language}
              question={currentQuestion}
              translation={currentTranslation}
              showAnswer={showAnswer}
              currentIndex={currentIndex}
              categoryDisplay={categoryDisplay}
              difficultyDisplay={difficultyDisplay}
              frequencyDisplay={frequencyDisplay}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-2xl border border-red-900/60 bg-gradient-to-br from-zinc-950 via-black to-red-950/40 p-6 shadow-[0_0_40px_rgba(248,113,113,0.15)] md:p-8"
            >
              <h2 className="text-lg font-semibold leading-snug text-zinc-50 md:text-xl">
                {t(language, "noQuestion")}
              </h2>
              <p className="mt-3 text-sm text-zinc-400">
                {t(language, "noQuestionTip")}
              </p>
            </motion.div>
          )}

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              onClick={handleNextQuestion}
              disabled={totalFiltered === 0}
              whileTap={{ scale: 0.97 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 30px rgba(248,113,113,0.6)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-zinc-50 shadow-[0_0_25px_rgba(248,113,113,0.5)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            >
              {t(language, "newQuestion")}
            </motion.button>

            <motion.button
              type="button"
              onClick={() => setShowAnswer((prev) => !prev)}
              disabled={totalFiltered === 0}
              whileTap={{ scale: 0.97 }}
              whileHover={{
                scale: 1.02,
                borderColor: "rgb(248 113 113)",
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center rounded-full border border-red-900/70 bg-zinc-950/80 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-red-500 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-500"
            >
              {showAnswer
                ? t(language, "hideAnswer")
                : t(language, "showAnswer")}
            </motion.button>
          </motion.div>
        </main>

        <Footer language={language} />
      </div>
    </div>
  );
}
