"use client";

import React, { useState, useEffect } from "react";
import { X, Save, CheckSquare, Lightbulb, Car } from "lucide-react";
import { TripNote } from "@/types/trip";

interface NoteModalProps {
  isOpen: boolean;
  initialNote: TripNote | null;
  defaultCategory?: string;
  onClose: () => void;
  onSave: (
    noteData: Omit<TripNote, "id" | "createdAt">,
    id?: number
  ) => Promise<void>;
}

const NOTE_CATEGORIES = [
  { value: "Checklist", label: "Checklist de Bagagem / Tarefa", icon: CheckSquare },
  { value: "Dica", label: "Dica / Informação Útil", icon: Lightbulb },
  { value: "Transfer/Uber", label: "Contato Transfer / Uber", icon: Car },
];

export default function NoteModal({
  isOpen,
  initialNote,
  defaultCategory = "Checklist",
  onClose,
  onSave,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Checklist");
  const [content, setContent] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setCategory(initialNote.category);
      setContent(initialNote.content);
      setDone(initialNote.done);
    } else {
      setTitle("");
      setCategory(defaultCategory === "Todas" ? "Checklist" : defaultCategory);
      setContent("");
      setDone(false);
    }
  }, [initialNote, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          category,
          content: content.trim(),
          done,
        },
        initialNote?.id
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
    >
      <div className="w-full max-w-md bg-[#1e1e1e] border-t sm:border border-[#2e2e2e] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
          <div>
            <h2
              id="note-modal-title"
              className="text-lg font-bold text-[#F3F4F6]"
            >
              {initialNote ? "Editar Nota / Item" : "Nova Nota ou Checklist"}
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Bagagem, dicas da viagem ou contatos de motoristas
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-[#121212] hover:bg-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] flex items-center justify-center transition"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-4 flex-1"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
              Categoria *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {NOTE_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`min-h-[44px] px-2.5 py-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition ${
                      active
                        ? "bg-[#008B8B]/25 border-[#008B8B] text-[#F3F4F6]"
                        : "bg-[#121212] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#208494]" />
                    <span>{cat.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
              Título *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Motorista Transfer Navegantes / Protetor Solar"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
              Conteúdo / Detalhes *
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite os itens, telefone do motorista, horário combinado ou dica..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 resize-none"
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2e2e2e] cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
              className="w-5 h-5 rounded accent-[#008B8B]"
            />
            <span className="text-sm font-medium text-[#F3F4F6]">
              Marcar como concluído / verificado
            </span>
          </label>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-xl bg-[#121212] hover:bg-[#2e2e2e] text-sm font-medium text-[#9CA3AF] hover:text-[#F3F4F6] border border-[#2e2e2e] transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="min-h-[44px] px-5 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] disabled:opacity-50 text-sm font-semibold text-[#F3F4F6] inline-flex items-center gap-2 transition shadow-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? "Salvando..." : "Salvar Nota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

