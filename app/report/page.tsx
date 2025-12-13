"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formTexts, type Language } from "./translations";
import { Question } from "../types";

export default function ReportQuestion(question: Question) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: keyof (typeof formTexts)[Language]) =>
    formTexts[language][key];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 md:px-8 md:py-12">
        <header className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
            {t("title")}
          </h1>
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

            <Link
              href="/"
              className="text-[11px] text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              {t("backLink")}
            </Link>
            <motion.section
              className="flex flex-1 flex-col gap-4 rounded-2xl border border-red-900/60 bg-gradient-to-br from-zinc-950 via-black to-red-950/40 p-6 shadow-[0_0_40px_rgba(248,113,113,0.15)] md:p-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-1 text-[11px]">
                    <div className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100">
                        {question.category}
                    </div>
                </div>
              </div>
            </motion.section>
          </div>
        </header>
      </div>
    </div>
  );
}
