"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Language } from "../types";
import { t } from "../translations";
import { LanguageToggle } from "./LanguageToggle";

type HeaderBarProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export function HeaderBar({ language, setLanguage }: HeaderBarProps) {
  return (
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
        <LanguageToggle
          language={language}
          onToggle={() => setLanguage(language === "en" ? "fr" : "en")}
        />

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
  );
}
