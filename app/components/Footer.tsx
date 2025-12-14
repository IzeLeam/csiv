import { t } from "../translations";
import { Language } from "../types";

export default function Footer({ language }: { language: Language }) {
  return (
    <footer className="mt-8 md:px-8 md:py-12 flex flex-col gap-3 text-[10px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
      <span className="max-w-xs leading-snug text-zinc-600">
        {t(language, "footerText")}
      </span>
    </footer>
  );
}
