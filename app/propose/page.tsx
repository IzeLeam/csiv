"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formTexts, type Language } from "./translations";
import { LanguageToggle } from "../components/LanguageToggle";
import { ConfirmModal } from "../components/ConfirmModal";
import Footer from "../components/Footer";

type TrimmedForm = {
  category: string;
  difficulty: string;
  frequency: string;
  enQuestion: string;
  enAnswer: string;
  frQuestion: string;
  frAnswer: string;
};

export default function ProposeQuestionPage() {
  const [language, setLanguage] = useState<Language>("fr");
  const [form, setForm] = useState({
    category: "",
    difficulty: "",
    frequency: "",
    enQuestion: "",
    enAnswer: "",
    frQuestion: "",
    frAnswer: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string>("");
  const [remaining, setRemaining] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<TrimmedForm | null>(
    null
  );

  const CLIENT_COOLDOWN = 60;

  const t = (key: keyof (typeof formTexts)[Language]) =>
    formTexts[language][key];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitProposal = async (payload: TrimmedForm) => {
    setStatus("submitting");

    try {
      const res = await fetch("/api/propose-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: payload.category,
          difficulty: payload.difficulty,
          frequency: payload.frequency,
          translations: {
            en: { question: payload.enQuestion, answer: payload.enAnswer },
            fr: { question: payload.frQuestion, answer: payload.frAnswer },
          },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const json = await res.json().catch(() => ({}));
          const retry =
            json?.retryAfter ||
            Number(res.headers.get("Retry-After")) ||
            CLIENT_COOLDOWN;
          const secs = Number(retry) || CLIENT_COOLDOWN;
          startCooldown(secs);
          setStatus("error");
          setMessage(t("error") + ` (${t("cooldown")} ${secs}s)`);
          return;
        }

        throw new Error("Request failed");
      }

      setStatus("success");
      setMessage(t("success"));
      setForm({
        category: "",
        difficulty: "",
        frequency: "",
        enQuestion: "",
        enAnswer: "",
        frQuestion: "",
        frAnswer: "",
      });
    } catch {
      setStatus("error");
      setMessage(t("error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const trimmed: TrimmedForm = {
      category: form.category.trim(),
      difficulty: form.difficulty.trim(),
      frequency: form.frequency.trim(),
      enQuestion: form.enQuestion.trim(),
      enAnswer: form.enAnswer.trim(),
      frQuestion: form.frQuestion.trim(),
      frAnswer: form.frAnswer.trim(),
    };

    const hasEnQuestion = trimmed.enQuestion.length > 0;
    const hasFrQuestion = trimmed.frQuestion.length > 0;

    if (!hasEnQuestion && !hasFrQuestion) {
      setStatus("error");
      setMessage(t("missingQuestion"));
      return;
    }

    const values = Object.values(trimmed);
    const hasEmpty = values.some((v) => v.length === 0);

    if (hasEmpty) {
      setPendingPayload(trimmed);
      setConfirmOpen(true);
      setStatus("idle");
      return;
    }

    await submitProposal(trimmed);
  };

  function startCooldown(seconds: number) {
    const until = Date.now() + seconds * 1000;
    setRemaining(seconds);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      const now = Date.now();
      const rem = Math.max(0, Math.ceil((until - now) / 1000));
      setRemaining(rem);
      if (rem <= 0 && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-8 md:px-8 md:py-12">
        <ConfirmModal
          open={confirmOpen}
          title={t("title")}
          description={t("confirmIncomplete")}
          confirmLabel={language === "fr" ? "Envoyer" : "Send"}
          cancelLabel={language === "fr" ? "Annuler" : "Cancel"}
          onCancel={() => {
            setConfirmOpen(false);
            setPendingPayload(null);
          }}
          onConfirm={() => {
            if (!pendingPayload) {
              setConfirmOpen(false);
              return;
            }
            setConfirmOpen(false);
            void submitProposal(pendingPayload);
          }}
        />
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
              {t("title")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle
              language={language}
              onToggle={() => setLanguage(language === "en" ? "fr" : "en")}
            />

            <motion.a
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800/80 bg-zinc-950/70 text-zinc-300 transition hover:border-red-500 hover:text-zinc-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke={"#fff"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </motion.a>
          </div>
        </motion.header>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 rounded-2xl border border-red-900/60 bg-gradient-to-br from-zinc-950 via-black to-red-950/40 p-6 shadow-[0_0_40px_rgba(248,113,113,0.15)] md:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1 text-[11px]">
              <label className="font-medium text-zinc-300">
                {t("categoryLabel")}
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
                placeholder={t("categoryPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-1 text-[11px]">
              <label className="font-medium text-zinc-300">
                {t("levelLabel")}
              </label>
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
              >
                <option value="">{t("levelPlaceholder")}</option>
                <option value="junior">{t("levelJunior")}</option>
                <option value="intermediate">{t("levelIntermediate")}</option>
                <option value="senior">{t("levelSenior")}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 text-[11px]">
              <label className="font-medium text-zinc-300">
                {t("frequencyLabel")}
              </label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
              >
                <option value="">{t("frequencyPlaceholder")}</option>
                <option value="low">{t("frequencyLow")}</option>
                <option value="medium">{t("frequencyMedium")}</option>
                <option value="high">{t("frequencyHigh")}</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2 text-[11px]">
              <span className="text-xs font-semibold text-zinc-200">
                {t("enBlockTitle")}
              </span>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-300">
                  {t("questionLabel")}
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <textarea
                  name="enQuestion"
                  value={form.enQuestion}
                  onChange={handleChange}
                  rows={2}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-300">
                  {t("answerLabel")}
                </label>
                <textarea
                  name="enAnswer"
                  value={form.enAnswer}
                  onChange={handleChange}
                  rows={4}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[11px]">
              <span className="text-xs font-semibold text-zinc-200">
                {t("frBlockTitle")}
              </span>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-300">
                  {t("questionLabel")}
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <textarea
                  name="frQuestion"
                  value={form.frQuestion}
                  onChange={handleChange}
                  rows={2}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-medium text-zinc-300">
                  {t("answerLabel")}
                </label>
                <textarea
                  name="frAnswer"
                  value={form.frAnswer}
                  onChange={handleChange}
                  rows={4}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
            {message && (
              <span
                className={
                  status === "success" ? "text-emerald-400" : "text-red-400"
                }
              >
                {message}
              </span>
            )}
            {!message && (
              <span className="text-[10px] text-zinc-500">
                {t("requiredHint")}
              </span>
            )}
            <motion.button
              type="submit"
              disabled={status === "submitting" || remaining > 0}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="ml-auto inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-[11px] font-semibold text-zinc-50 shadow-[0_0_25px_rgba(248,113,113,0.5)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
            >
              {status === "submitting"
                ? t("submitting")
                : remaining > 0
                ? `${t("cooldown")} (${remaining}s)`
                : t("submit")}
            </motion.button>
          </div>
        </motion.form>
      <Footer language={language} />
      </div>
    </div>
  );
}
