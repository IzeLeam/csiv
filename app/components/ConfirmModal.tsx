"use client";

import { motion, AnimatePresence } from "framer-motion";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="mx-4 max-w-sm rounded-2xl border border-red-900/60 bg-zinc-950/95 p-5 text-xs text-zinc-100 shadow-[0_0_30px_rgba(248,113,113,0.35)]"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <h2 className="mb-2 text-[13px] font-semibold text-red-400">
              {title}
            </h2>
            {description && (
              <p className="mb-4 text-[11px] text-zinc-300">{description}</p>
            )}
            <div className="flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full border border-zinc-700 px-3 py-1 text-zinc-300 transition hover:bg-zinc-800"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-full bg-red-600 px-3 py-1 font-semibold text-zinc-50 shadow-[0_0_18px_rgba(248,113,113,0.6)] transition hover:bg-red-500"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
