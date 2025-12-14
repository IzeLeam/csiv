"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Language, Question } from "../types";
import { t } from "../translations";
import { ReportModal } from "./ReportModal";

interface QuestionCardProps {
  language: Language;
  question: Question | null;
  translation: { question: string; answer: string } | null;
  showAnswer: boolean;
  currentIndex: number;
  categoryDisplay: (v: string) => string;
  difficultyDisplay: (v: string) => string;
  frequencyDisplay: (v: string) => string;
}

export function QuestionCard({
  language,
  question,
  translation,
  showAnswer,
  currentIndex,
  categoryDisplay,
  difficultyDisplay,
  frequencyDisplay,
}: QuestionCardProps) {
  const [reportOpen, setReportOpen] = useState(false);

  if (!question || !translation) {
    return null;
  }

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative rounded-2xl border border-red-900/60 bg-gradient-to-br from-zinc-950 via-black to-red-950/40 p-6 shadow-[0_0_40px_rgba(248,113,113,0.15)] md:p-8"
    >
      <button
        type="button"
        onClick={() => setReportOpen(true)}
        className="absolute w-4 h-4 top-4 right-4 text-xs text-zinc-500 hover:text-white cursor-pointer hover:text-red-500 transition"
        title={t(language, "reportTitle")}
      >
        <svg
          viewBox="0 0 24.00 24.00"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M5 21V3.90002C5 3.90002 5.875 3 8.5 3C11.125 3 12.875 4.8 15.5 4.8C18.125 4.8 19 3.9 19 3.9V14.7C19 14.7 18.125 15.6 15.5 15.6C12.875 15.6 11.125 13.8 8.5 13.8C5.875 13.8 5 14.7 5 14.7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>{" "}
          </g>
        </svg>
      </button>
      <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
        <span>
          {t(language, "cardCategory")}: {categoryDisplay(question.category)}
          {" · "}
          {t(language, "cardDifficulty")}: {difficultyDisplay(question.difficulty)}
          {" · "}
          {t(language, "cardFrequency")}: {frequencyDisplay(question.frequency)}
        </span>
      </div>

      <h2 className="mb-4 text-lg font-semibold leading-snug text-zinc-50 md:text-xl">
        {translation.question}
      </h2>

      <div className="mt-3 border-t border-red-900/40 pt-4 text-sm text-zinc-300/90">
        {showAnswer ? (
          <p className="whitespace-pre-line leading-relaxed">
            {translation.answer}
          </p>
        ) : (
          <p className="text-zinc-500">{t(language, "revealHint")}</p>
        )}
      </div>

      <ReportModal
        open={reportOpen}
        language={language}
        question={question}
        onClose={() => setReportOpen(false)}
      />
    </motion.div>
  );
}
