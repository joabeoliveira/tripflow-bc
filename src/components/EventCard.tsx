"use client";

import React from "react";
import {
  Plane,
  Umbrella,
  FerrisWheel,
  Pizza,
  Compass,
  Home,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
  Car,
  Paperclip,
} from "lucide-react";
import { TripEvent } from "@/types/trip";
import { getGoogleCalendarLink, getUberDeepLink, parseAttachments } from "@/utils/tripLinks";

interface EventCardProps {
  event: TripEvent;
  showDateBadge?: boolean;
  onToggleComplete: (event: TripEvent) => void;
  onEdit: (event: TripEvent) => void;
  onDelete: (event: TripEvent) => void;
}

export function getCategoryMeta(category: string) {
  switch (category) {
    case "Transporte":
      return {
        icon: Plane,
        badgeClass:
          "bg-[#0B8494]/20 text-[#208494] border-[#0B8494]/40",
        dotClass: "bg-[#0B8494]",
      };
    case "Passeio":
      return {
        icon: FerrisWheel,
        badgeClass:
          "bg-[#008B8B]/25 text-[#4fd1c5] border-[#008B8B]/50",
        dotClass: "bg-[#008B8B]",
      };
    case "Praia":
      return {
        icon: Umbrella,
        badgeClass:
          "bg-cyan-500/15 text-cyan-300 border-cyan-500/35",
        dotClass: "bg-cyan-400",
      };
    case "Comemoração":
      return {
        icon: Pizza,
        badgeClass:
          "bg-amber-500/20 text-amber-300 border-amber-500/40",
        dotClass: "bg-amber-400",
      };
    case "Hospedagem":
      return {
        icon: Home,
        badgeClass:
          "bg-teal-600/20 text-teal-300 border-teal-500/40",
        dotClass: "bg-teal-400",
      };
    case "Lazer":
    default:
      return {
        icon: Compass,
        badgeClass:
          "bg-[#208494]/20 text-[#F3F4F6] border-[#208494]/45",
        dotClass: "bg-[#208494]",
      };
  }
}

export default function EventCard({
  event,
  showDateBadge = false,
  onToggleComplete,
  onEdit,
  onDelete,
}: EventCardProps) {
  const { icon: CategoryIcon, badgeClass, dotClass } = getCategoryMeta(
    event.category
  );

  const mapsUrl = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${event.location} Balneário Camboriú SC`
      )}`
    : null;
  const destination = event.location?.trim();
  const uberUrl = destination ? getUberDeepLink(`${destination} Balneário Camboriú SC`, event.title) : null;
  const attachments = parseAttachments(event.attachments);

  return (
    <div className="relative pl-6 sm:pl-7 group">
      {/* Linha vertical da Timeline */}
      <div
        className="absolute left-2 sm:left-2.5 top-0 bottom-0 w-0.5 bg-[#2e2e2e] group-last:bottom-auto group-last:h-6"
        aria-hidden="true"
      />
      {/* Ponto indicador da Timeline */}
      <div
        className={`absolute left-[3px] sm:left-[5px] top-5 w-3 h-3 rounded-full ring-4 ring-[#121212] transition-colors ${
          event.completed ? "bg-emerald-500" : dotClass
        }`}
        aria-hidden="true"
      />

      <article
        className={`rounded-2xl bg-[#1e1e1e] border transition-all p-4 shadow-md ${
          event.completed
            ? "border-emerald-500/30 opacity-80"
            : event.category === "Comemoração"
            ? "border-[#008B8B]/70 shadow-[#008B8B]/10"
            : "border-[#2e2e2e] hover:border-[#008B8B]/50"
        }`}
      >
        {/* Topo do Card: Badges + Botão Check Rápido */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {showDateBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#121212] text-[#F3F4F6] border border-[#2e2e2e]">
                <Calendar className="w-3.5 h-3.5 text-[#008B8B]" />
                {event.displayDate.slice(0, 5)} • {event.weekday.split("-")[0]}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badgeClass}`}
            >
              <CategoryIcon className="w-3.5 h-3.5" />
              {event.category}
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#121212] text-[#9CA3AF] border border-[#2e2e2e]">
              <Clock className="w-3.5 h-3.5 text-[#208494]" />
              {event.time ? `${event.time} • ${event.period}` : event.period}
            </span>

            {event.completed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Concluído
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleComplete(event)}
            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center transition active:scale-95 shrink-0 border ${
              event.completed
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30"
                : "bg-[#121212] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#008B8B]"
            }`}
            title={
              event.completed
                ? "Desmarcar como concluído"
                : "Marcar passeio como concluído"
            }
            aria-label={
              event.completed
                ? "Desmarcar como concluído"
                : "Marcar passeio como concluído"
            }
          >
            {event.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Título e Detalhes */}
        <div className="mt-2.5 space-y-1.5">
          <h3
            className={`text-base sm:text-lg font-bold leading-snug ${
              event.completed
                ? "line-through text-[#9CA3AF]"
                : "text-[#F3F4F6]"
            }`}
          >
            {event.title}
          </h3>

          <p className="text-sm text-[#9CA3AF] leading-relaxed">
            {event.details}
          </p>
        </div>

        {/* Rodapé do Card: Localização + Ações de Editar e Excluir */}
        <div className="mt-4 pt-3 border-t border-[#2e2e2e] flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            {event.location ? (
              <a
                href={mapsUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#208494] hover:text-[#008B8B] font-medium transition max-w-full"
                title="Abrir localização no Google Maps"
              >
                <MapPin className="w-4 h-4 shrink-0 text-[#008B8B]" />
                <span className="truncate">{event.location}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-75" />
              </a>
            ) : (
              <span className="text-xs text-[#9CA3AF]/60 italic">
                Sem local específico
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5 w-full sm:w-auto sm:shrink-0">
            {uberUrl && (
              <a href={uberUrl} target="_blank" rel="noopener noreferrer" className="min-h-[44px] px-3 rounded-xl bg-[#0B8494]/20 text-[#4fd1c5] border border-[#0B8494]/40 inline-flex items-center gap-1.5 text-xs font-medium" title="Pedir Uber">
                <Car className="w-4 h-4" /><span className="hidden sm:inline">Pedir Uber</span>
              </a>
            )}
            <a href={getGoogleCalendarLink(event)} target="_blank" rel="noopener noreferrer" className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#121212] text-[#9CA3AF] border border-[#2e2e2e] inline-flex items-center justify-center gap-1.5 text-xs font-medium" title="Adicionar à Agenda">
              <Calendar className="w-4 h-4" /><span className="hidden sm:inline">Agenda</span>
            </a>
            {attachments.map((attachment) => (
              <a key={attachment.url} href={attachment.url} target="_blank" rel="noopener noreferrer" className="min-h-[44px] px-3 rounded-xl bg-[#121212] text-[#9CA3AF] border border-[#2e2e2e] inline-flex items-center gap-1.5 text-xs font-medium" title={attachment.name}>
                <Paperclip className="w-4 h-4" /><span className="hidden sm:inline">Documento</span>
              </a>
            ))}
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#121212] hover:bg-[#008B8B]/20 text-[#F3F4F6] hover:text-[#208494] border border-[#2e2e2e] hover:border-[#008B8B]/50 inline-flex items-center justify-center gap-1.5 text-xs font-medium transition active:scale-95"
              title="Editar evento"
              aria-label={`Editar ${event.title}`}
            >
              <Pencil className="w-4 h-4" />
              <span className="hidden sm:inline">Editar</span>
            </button>

            <button
              type="button"
              onClick={() => onDelete(event)}
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#121212] hover:bg-red-500/15 text-[#9CA3AF] hover:text-red-400 border border-[#2e2e2e] hover:border-red-500/40 inline-flex items-center justify-center gap-1.5 text-xs font-medium transition active:scale-95"
              title="Excluir evento"
              aria-label={`Excluir ${event.title}`}
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Excluir</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

