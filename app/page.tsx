"use client";

import questionsData from "../data/questions.json";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Language, Question } from "./types";
import { t } from "./translations";
import { FilterSelect } from "./components/FilterSelect";

const allQuestions = questionsData as Question[];

function getUniqueValues(key: "category" | "difficulty" | "frequency") {
  const values = new Set<string>();
  allQuestions.forEach((q) => {
    const value = q[key]?.trim();
    if (value) values.add(value);
  });
  return Array.from(values).sort();
}

const allCategories = getUniqueValues("category");
const allDifficulties = getUniqueValues("difficulty");
const allFrequencies = getUniqueValues("frequency");

export default function Home() {
  const [language, setLanguage] = useState<Language>("fr");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [frequency, setFrequency] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  // Start with a deterministic index for SSR; pick a random index on client mount to avoid hydration mismatch
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchDifficulty =
        difficulty === "all" || q.difficulty === difficulty;
      const matchFrequency = frequency === "all" || q.frequency === frequency;
      const matchCategory = category === "all" || q.category === category;
      return matchDifficulty && matchFrequency && matchCategory;
    });
  }, [difficulty, frequency, category]);

  const countsByCategory = useMemo<Record<string, number>>(() => {
    const base = allQuestions.filter((q) => {
      const matchDifficulty =
        difficulty === "all" || q.difficulty === difficulty;
      const matchFrequency = frequency === "all" || q.frequency === frequency;
      return matchDifficulty && matchFrequency;
    });

    const counts: Record<string, number> = {};
    base.forEach((q) => {
      counts[q.category] = (counts[q.category] || 0) + 1;
    });

    const total = base.length;
    return { ...counts, all: total };
  }, [difficulty, frequency]);

  const countsByDifficulty = useMemo<Record<string, number>>(() => {
    const base = allQuestions.filter((q) => {
      const matchCategory = category === "all" || q.category === category;
      const matchFrequency = frequency === "all" || q.frequency === frequency;
      return matchCategory && matchFrequency;
    });

    const counts: Record<string, number> = {};
    base.forEach((q) => {
      counts[q.difficulty] = (counts[q.difficulty] || 0) + 1;
    });

    const total = base.length;
    return { ...counts, all: total };
  }, [category, frequency]);

  const countsByFrequency = useMemo<Record<string, number>>(() => {
    const base = allQuestions.filter((q) => {
      const matchCategory = category === "all" || q.category === category;
      const matchDifficulty =
        difficulty === "all" || q.difficulty === difficulty;
      return matchCategory && matchDifficulty;
    });

    const counts: Record<string, number> = {};
    base.forEach((q) => {
      counts[q.frequency] = (counts[q.frequency] || 0) + 1;
    });

    const total = base.length;
    return { ...counts, all: total };
  }, [category, difficulty]);

  const handleNextQuestion = () => {
    if (filteredQuestions.length === 0) return;
    if (filteredQuestions.length === 1) {
      setCurrentIndex(0);
      setShowAnswer(false);
      return;
    }

    let nextIndex = currentIndex;
    let safety = 0;
    while (nextIndex === currentIndex && safety < 10) {
      nextIndex = Math.floor(Math.random() * filteredQuestions.length);
      safety += 1;
    }

    setCurrentIndex(nextIndex);
    setShowAnswer(false);
  };

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

  const currentQuestion =
    filteredQuestions.length > 0
      ? filteredQuestions[Math.min(currentIndex, filteredQuestions.length - 1)]
      : null;

  const currentTranslation = currentQuestion
    ? currentQuestion.translations[language]
    : null;

  const totalFiltered = filteredQuestions.length;

  const mountTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (filteredQuestions.length === 0) {
      return;
    }

    const idx = Math.floor(Math.random() * filteredQuestions.length);

    if (mountTimerRef.current) window.clearTimeout(mountTimerRef.current);
    mountTimerRef.current = window.setTimeout(() => {
      setCurrentIndex(idx);
      mountTimerRef.current = null;
    }, 0);

    return () => {
      if (mountTimerRef.current) {
        window.clearTimeout(mountTimerRef.current);
        mountTimerRef.current = null;
      }
    };
  }, [filteredQuestions.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 md:px-8 md:py-12">
        <motion.header
          className="mb-8 flex items-center justify-between gap-4"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="CyberSecurity Interview Vault logo"
                fill
                sizes="1024"
                className="object-cover"
                priority
              />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-red-600/70">
              {t(language, "title")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={() =>
                setLanguage((prev) => (prev === "en" ? "fr" : "en"))
              }
              className="relative flex h-8 w-16 items-center rounded-full border border-red-900/60 bg-zinc-950/80 px-1 text-[11px] font-semibold text-zinc-400 shadow-[0_0_18px_rgba(248,113,113,0.35)]"
              whileTap={{ scale: 0.96 }}
            >
              <motion.div
                className="absolute inset-y-1 w-1/2 rounded-full bg-red-600/80 shadow-[0_0_18px_rgba(248,113,113,0.7)]"
                animate={{ x: language === "en" ? 0 : "80%" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              />
              <span
                className={`z-10 flex-1 text-center ${
                  language === "en" ? "text-zinc-50" : "text-zinc-400"
                }`}
              >
                EN
              </span>
              <span
                className={`z-10 flex-1 text-center ${
                  language === "fr" ? "text-zinc-50" : "text-zinc-400"
                }`}
              >
                FR
              </span>
            </motion.button>

            <motion.a
              href="https://github.com/IzeLeam/csiv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/70 text-zinc-300 transition hover:border-red-500 hover:text-zinc-50"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.96 }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.79 8.21 11.38.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.22.09 1.87 1.26 1.87 1.26 1.08 1.85 2.84 1.32 3.53 1.01.11-.78.42-1.32.76-1.62-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.25-3.23-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3.01-.4c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.87.12 3.17.78.84 1.25 1.91 1.25 3.23 0 4.63-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.23 0 1.61-.01 2.91-.01 3.31 0 .32.21.7.83.58C20.57 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0Z" />
              </svg>
            </motion.a>
          </div>
        </motion.header>

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
          {currentQuestion ? 
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative rounded-2xl border border-red-900/60 bg-gradient-to-br from-zinc-950 via-black to-red-950/40 p-6 shadow-[0_0_40px_rgba(248,113,113,0.15)] md:p-8"
            >
              <button
                className="absolute w-6 h-6 top-4 right-4 text-xs text-zinc-500 hover:text-white cursor-pointer hover:text-red-500 transition"
                title="Report this question"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g strokeWidth="2"></g>
                  <g
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g>
                    {" "}
                    <path
                      d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="currentColor"
                    ></path>{" "}
                  </g>
                </svg>
              </button>
              <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {t(language, "cardCategory")}:{" "}
                  {categoryDisplay(currentQuestion!.category)}
                  {" · "}
                  {t(language, "cardDifficulty")}:{" "}
                  {difficultyDisplay(currentQuestion!.difficulty)}
                  {" · "}
                  {t(language, "cardFrequency")}:{" "}
                  {frequencyDisplay(currentQuestion!.frequency)}
                </span>
              </div>

              <h2 className="mb-4 text-lg font-semibold leading-snug text-zinc-50 md:text-xl">
                {currentTranslation!.question}
              </h2>

              <div className="mt-3 border-t border-red-900/40 pt-4 text-sm text-zinc-300/90">
                {showAnswer ? (
                  <p className="whitespace-pre-line leading-relaxed">
                    {currentTranslation!.answer}
                  </p>
                ) : (
                  <p className="text-zinc-500">{t(language, "revealHint")}</p>
                )}
              </div>
            </motion.div>
            : (
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

        <footer className="mt-8 flex flex-col gap-3 text-[10px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <motion.a
            href="/propose-question"
            className="inline-flex items-center justify-center rounded-full border border-red-900/70 bg-zinc-950/80 px-4 py-2 text-[11px] font-medium text-zinc-100 shadow-[0_0_18px_rgba(248,113,113,0.4)] transition hover:border-red-500 hover:bg-red-950/40 hover:text-zinc-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t(language, "footerCta")}
          </motion.a>

          <span className="max-w-xs leading-snug text-zinc-600 sm:text-left">
            {t(language, "footerText")}
          </span>
        </footer>
      </div>
    </div>
  );
}
