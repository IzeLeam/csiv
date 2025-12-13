"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Language, Question } from "../types";
import { t } from "../translations";

interface ReportModalProps {
  open: boolean;
  language: Language;
  question: Question | null;
  onClose: () => void;
}

export function ReportModal({ open, language, question, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    if (!reason) {
      setStatus("error");
      setMessage(t(language, "reportError"));
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/report-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          reason,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      setMessage(t(language, "reportSuccess"));
      setReason("");
      setDescription("");

      setTimeout(() => {
        onClose();
        setStatus("idle");
        setMessage("");
      }, 1200);
    } catch {
      setStatus("error");
      setMessage(t(language, "reportError"));
    }
  };

  const isDisabled = status === "submitting" || !question;

  return (
    <AnimatePresence>
      {open && question && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="mx-4 max-w-md rounded-2xl border border-red-900/60 bg-zinc-950/95 p-5 text-xs text-zinc-100 shadow-[0_0_30px_rgba(248,113,113,0.35)]"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h2 className="mb-2 text-[13px] font-semibold text-red-400">
              {t(language, "reportTitle")}
            </h2>
            <p className="mb-3 text-[11px] text-zinc-300 line-clamp-3">
              {question.translations[language].question}
            </p>

            <div className="mb-3 flex flex-col gap-1 text-[11px]">
              <label className="font-medium text-zinc-300">
                {t(language, "reportReasonLabel")}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="h-8 rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
              >
                <option value="">
                  -- {language === "fr" ? "Choisir un motif" : "Choose a reason"} --
                </option>
                <option value="incorrect">
                  {t(language, "reportReasonIncorrect")}
                </option>
                <option value="outdated">
                  {t(language, "reportReasonOutdated")}
                </option>
                <option value="duplicate">
                  {t(language, "reportReasonDuplicate")}
                </option>
                <option value="other">
                  {t(language, "reportReasonOther")}
                </option>
              </select>
            </div>

            <div className="mb-3 flex flex-col gap-1 text-[11px]">
              <label className="font-medium text-zinc-300">
                {t(language, "reportDescriptionLabel")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-xl border border-zinc-800 bg-zinc-950/70 px-2 py-1 text-[11px] text-zinc-100 outline-none ring-red-600/60 transition focus:border-red-500 focus:ring-2"
              />
            </div>

            {message && (
              <p
                className={`mb-2 text-[11px] ${
                  status === "success" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setStatus("idle");
                  setMessage("");
                  setReason("");
                  setDescription("");
                }}
                className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 transition hover:bg-zinc-800"
              >
                {t(language, "reportCancel")}
              </button>
              <button
                type="submit"
                disabled={isDisabled}
                className="rounded-full bg-red-600 px-3 py-1 font-semibold text-zinc-50 shadow-[0_0_18px_rgba(248,113,113,0.6)] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
              >
                {status === "submitting" ? "..." : t(language, "reportSubmit")} 
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
