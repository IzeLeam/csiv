import { useEffect, useMemo, useRef, useState } from "react";
import type { Language, Question } from "../types";
import questionsData from "../../data/questions.json";

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

export function useQuestions(language: Language) {
  const [difficulty, setDifficulty] = useState<string>("all");
  const [frequency, setFrequency] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
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

  return {
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
    filteredQuestions,
    totalFiltered,
    countsByCategory,
    countsByDifficulty,
    countsByFrequency,
    handleNextQuestion,
  };
}
