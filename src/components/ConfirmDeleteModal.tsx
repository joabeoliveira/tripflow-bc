"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onCancel();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="w-full max-w-sm bg-[#1e1e1e] border border-[#2e2e2e] rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#121212] hover:bg-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] flex items-center justify-center transition"
            aria-label="Fechar confirmação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3
            id="confirm-delete-title"
            className="text-base font-bold text-[#F3F4F6]"
          >
            {title}
          </h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed">{description}</p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="min-h-[44px] px-4 rounded-xl bg-[#121212] hover:bg-[#2e2e2e] text-sm font-medium text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#2e2e2e] transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="min-h-[44px] px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm font-semibold text-white inline-flex items-center gap-1.5 transition shadow-lg"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

