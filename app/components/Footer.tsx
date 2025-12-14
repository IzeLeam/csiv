import { t } from "../translations";
import { Language } from "../types";
import Link from "next/link";

export default function Footer({ language }: { language: Language }) {
  return (
    <footer className="mt-8 flex flex-col gap-3 text-[10px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/propose"
          className="inline-flex items-center justify-center rounded-full border border-red-900/70 bg-zinc-950/80 px-3 py-1.5 text-[11px] font-medium text-zinc-100 shadow-[0_0_18px_rgba(248,113,113,0.25)] transition hover:border-red-500 hover:bg-red-950/40 hover:text-zinc-50"
        >
          {t(language, "footerCta")}
        </Link>
        <Link
          href="/library"
          className="inline-flex items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/50 px-3 py-1.5 text-[11px] font-medium text-zinc-200 transition hover:border-red-500 hover:bg-red-950/30 hover:text-zinc-50"
        >
          {t(language, "footerLibrary")}
        </Link>
      </div>

      <span className="max-w-xs leading-snug text-zinc-600">
        {t(language, "footerText")}
      </span>
    </footer>
  );
}
