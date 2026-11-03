"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Clock, MapPin, Tag, FileText } from "lucide-react";
import { TripEvent } from "@/types/trip";

interface EventModalProps {
  isOpen: boolean;
  initialEvent: TripEvent | null;
  defaultDate: string;
  onClose: () => void;
  onSave: (
    eventData: Omit<TripEvent, "id" | "createdAt" | "updatedAt">,
    id?: number
  ) => Promise<void>;
}

const CATEGORIES = [
  "Transporte",
  "Passeio",
  "Praia",
  "Comemoração",
  "Lazer",
  "Hospedagem",
];

const PERIOD_SUGGESTIONS = [
  "Manhã",
  "Manhã / Tarde",
  "Tarde",
  "Fim de Tarde",
  "Tarde / Noite",
  "Noite",
  "Madrugada",
  "Dia Todo",
];

function computeDisplayDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function computeWeekday(isoDate: string): string {
  const weekdays = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return "";
  const dt = new Date(year, month - 1, day);
  return weekdays[dt.getDay()] || "";
}

export default function EventModal({
  isOpen,
  initialEvent,
  defaultDate,
  onClose,
  onSave,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-11-26");
  const [displayDate, setDisplayDate] = useState("26/11/2026");
  const [weekday, setWeekday] = useState("Quinta-feira");
  const [period, setPeriod] = useState("Manhã");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("Passeio");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDate(initialEvent.date);
      setDisplayDate(initialEvent.displayDate);
      setWeekday(initialEvent.weekday);
      setPeriod(initialEvent.period);
      setTime(initialEvent.time || "");
      setCategory(initialEvent.category);
      setLocation(initialEvent.location || "");
      setDetails(initialEvent.details);
      setCompleted(initialEvent.completed);
    } else {
      const targetDate = defaultDate || "2026-11-26";
      setTitle("");
      setDate(targetDate);
      setDisplayDate(computeDisplayDate(targetDate));
      setWeekday(computeWeekday(targetDate));
      setPeriod("Manhã");
      setTime("09:00");
      setCategory("Passeio");
      setLocation("");
      setDetails("");
      setCompleted(false);
    }
  }, [initialEvent, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setDisplayDate(computeDisplayDate(newDate));
    setWeekday(computeWeekday(newDate));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !period.trim() || !details.trim()) return;

    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          date,
          displayDate: displayDate.trim() || computeDisplayDate(date),
          weekday: weekday.trim() || computeWeekday(date),
          period: period.trim(),
          time: time.trim() ? time.trim() : null,
          category,
          location: location.trim() ? location.trim() : null,
          details: details.trim(),
          completed,
        },
        initialEvent?.id
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
      aria-labelledby="event-modal-title"
    >
      <div className="w-full max-w-lg bg-[#1e1e1e] border-t sm:border border-[#2e2e2e] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2e2e2e] flex items-center justify-between">
          <div>
            <h2
              id="event-modal-title"
              className="text-lg font-bold text-[#F3F4F6]"
            >
              {initialEvent ? "Editar Evento do Roteiro" : "Novo Evento no Roteiro"}
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Preencha os detalhes do passeio ou compromisso em BC
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

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 overflow-y-auto space-y-4 flex-1"
        >
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
              Título do Evento *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Passeio no Barco Pirata"
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50"
            />
          </div>

          {/* Data, Data Exibição e Dia da Semana */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-[#008B8B]" />
                Data *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Formato Exibição
              </label>
              <input
                type="text"
                required
                value={displayDate}
                onChange={(e) => setDisplayDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Dia da Semana
              </label>
              <input
                type="text"
                required
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                placeholder="Ex: Quinta-feira"
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6]"
              />
            </div>
          </div>

          {/* Categoria e Período */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                <Tag className="w-3.5 h-3.5 inline mr-1 text-[#008B8B]" />
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                Período *
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6]"
              >
                {PERIOD_SUGGESTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Horário e Local */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#008B8B]" />
                Horário (Opcional)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Ex: 09:30 ou 08:30 - 19:00"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#008B8B]" />
                Localização (Opcional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Barra Sul - Balneário Camboriú"
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50"
              />
            </div>
          </div>

          {/* Detalhes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5">
              <FileText className="w-3.5 h-3.5 inline mr-1 text-[#008B8B]" />
              Detalhes e Observações *
            </label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva informações importantes, ingressos, transporte ou dicas..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121212] border border-[#2e2e2e] focus:border-[#008B8B] focus:outline-none text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 resize-none"
            />
          </div>

          {/* Toggle Concluído */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#121212] border border-[#2e2e2e] cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-5 h-5 rounded accent-[#008B8B]"
            />
            <span className="text-sm font-medium text-[#F3F4F6]">
              Marcar este evento como já concluído
            </span>
          </label>

          {/* Botões de Ação */}
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
              {saving
                ? "Salvando..."
                : initialEvent
                ? "Salvar Alterações"
                : "Adicionar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

