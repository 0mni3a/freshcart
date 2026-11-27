"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  // الضغط على Escape بيقفل النافذة
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 className="h-6 w-6" />
        </span>

        <h2 className="mt-4 text-lg font-bold text-stone-900">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-500">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-400"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}