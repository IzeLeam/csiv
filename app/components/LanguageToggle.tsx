"use client";

import { motion } from "framer-motion";
import type { Language } from "../types";

type LanguageToggleProps = {
  language: Language;
  onToggle: () => void;
  size?: "sm" | "md";
};

export function LanguageToggle({ language, onToggle, size = "md" }: LanguageToggleProps) {
  const baseClasses =
    "relative flex items-center rounded-full border border-red-900/60 bg-zinc-950/80 text-[11px] font-semibold text-zinc-400 shadow-[0_0_18px_rgba(248,113,113,0.35)]";
  const sizeClasses = size === "sm" ? "h-7 w-14 px-1" : "h-8 w-16 px-1";

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      className={`${baseClasses} ${sizeClasses}`}
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
  );
}
