"use client";

import React from "react";
import {
  Plane,
  Pizza,
  BellRing,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { TripEvent } from "@/types/trip";
import { toast } from "sonner";

interface HighlightBannerProps {
  events: TripEvent[];
  onSelectDay: (date: string) => void;
}

export default function HighlightBanner({
  events,
  onSelectDay,
}: HighlightBannerProps) {
  const nextPendingEvent = events.find((e) => !e.completed) || events[0];

  const brunaBirthdayEvent = events.find(
    (e) =>
      e.date === "2026-11-29" &&
      (e.category === "Comemoração" ||
        e.title.toLowerCase().includes("bruna") ||
        e.title.toLowerCase().includes("pizza"))
  );

  const returnTransferEvent = events.find(
    (e) =>
      e.date === "2026-12-01" &&
      (e.category === "Transporte" ||
        e.title.toLowerCase().includes("transfer") ||
        e.title.toLowerCase().includes("retorno"))
  );

  const handleJumpToDay = (date: string, label: string) => {
    onSelectDay(date);
    toast.info(`Exibindo roteiro de ${label}`);
  };

  return (
    <section className="space-y-2.5 mb-5" aria-label="Destaques da Viagem">
      {/* Próximo evento importante */}
      {nextPendingEvent && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#008B8B]/25 via-[#0B8494]/20 to-[#1e1e1e] border border-[#008B8B]/50 p-3.5 sm:p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#008B8B] text-[#F3F4F6]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Próximo Evento Importante
                </span>
                <span className="text-xs font-medium text-[#9CA3AF]">
                  {nextPendingEvent.displayDate} ({nextPendingEvent.weekday})
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#F3F4F6] truncate">
                {nextPendingEvent.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9CA3AF]">
                {nextPendingEvent.time && (
                  <span className="inline-flex items-center gap-1 text-[#208494] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {nextPendingEvent.time} ({nextPendingEvent.period})
                  </span>
                )}
                {nextPendingEvent.location && (
                  <span className="inline-flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#0B8494] shrink-0" />
                    <span className="truncate">{nextPendingEvent.location}</span>
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleJumpToDay(
                  nextPendingEvent.date,
                  nextPendingEvent.displayDate
                )
              }
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] active:scale-95 text-[#F3F4F6] text-xs font-semibold inline-flex items-center justify-center gap-1 transition shrink-0 shadow"
              title="Ver no roteiro do dia"
            >
              <span className="hidden sm:inline">Ver Dia</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Destaques Especiais Obrigatórios: Aniversário da Bruna (29/11) & Transfer da Madrugada (01/12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleJumpToDay("2026-11-29", "29/11 (Domingo)")}
          className="min-h-[44px] text-left rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2e2e2e] hover:border-[#008B8B]/60 p-3 transition flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#008B8B]/20 border border-[#008B8B]/40 flex items-center justify-center text-[#208494] shrink-0 group-hover:scale-105 transition">
            <Pizza className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#208494]">
                Destaque 29/11 • 20:00
              </span>
              {brunaBirthdayEvent?.completed && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                  Concluído
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F3F4F6] truncate">
              🎉 Aniversário da Bruna na Heróis da Pizza!
            </p>
            <p className="text-[11px] text-[#9CA3AF] truncate">
              3ª Avenida • Rodízio temático de super-heróis
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleJumpToDay("2026-12-01", "01/12 (Terça-feira)")}
          className="min-h-[44px] text-left rounded-xl bg-[#1e1e1e] hover:bg-[#252525] border border-[#2e2e2e] hover:border-[#0B8494]/60 p-3 transition flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B8494]/20 border border-[#0B8494]/40 flex items-center justify-center text-[#0B8494] shrink-0 group-hover:scale-105 transition">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B8494] inline-flex items-center gap-1">
                <Plane className="w-3 h-3" /> Alerta Madrugada 01/12 • 03:15
              </span>
              {returnTransferEvent?.completed && (
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">
                  Concluído
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#F3F4F6] truncate">
              Transfer & Voo Retorno (NVT ➔ GIG)
            </p>
            <p className="text-[11px] text-[#9CA3AF] truncate">
              Saída da casa às 03:15 para voo das 05:30
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}

