"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Map as MapIcon,
  CheckSquare,
  Plus,
  Plane,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  Lightbulb,
  Car,
  Sparkles,
  Filter,
  RefreshCw,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { TripEvent, TripNote } from "@/types/trip";
import WeatherBadge from "@/components/WeatherBadge";
import HighlightBanner from "@/components/HighlightBanner";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import NoteModal from "@/components/NoteModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

type ActiveTab = "day" | "all" | "notes";

const TRIP_DAYS = [
  { date: "2026-11-26", short: "26/11", weekday: "Qui", fullWeekday: "Quinta-feira" },
  { date: "2026-11-27", short: "27/11", weekday: "Sex", fullWeekday: "Sexta-feira" },
  { date: "2026-11-28", short: "28/11", weekday: "Sáb", fullWeekday: "Sábado" },
  { date: "2026-11-29", short: "29/11", weekday: "Dom", fullWeekday: "Domingo" },
  { date: "2026-11-30", short: "30/11", weekday: "Seg", fullWeekday: "Segunda-feira" },
  { date: "2026-12-01", short: "01/12", weekday: "Ter", fullWeekday: "Terça-feira" },
];

const FALLBACK_INITIAL_EVENTS: TripEvent[] = [
  {
    id: 1,
    date: "2026-11-26",
    displayDate: "26/11/2026",
    weekday: "Quinta-feira",
    period: "Tarde / Noite",
    time: "16:40 - 18:30",
    title: "Voo Rio (GIG) ➔ Navegantes (NVT) & Transfer",
    location: "Aeroporto Galeão / Navegantes",
    category: "Transporte",
    details:
      "Saída do Galeão às 16:40 e chegada prevista às 18:30. Transfer contratado até Balneário Camboriú.",
    completed: false,
  },
  {
    id: 2,
    date: "2026-11-26",
    displayDate: "26/11/2026",
    weekday: "Quinta-feira",
    period: "Noite",
    time: "19:30",
    title: "Check-in na Casa & Caminhada na Orla",
    location: "Rua Euclides Rosa, 52 - Barra",
    category: "Hospedagem",
    details:
      "Acomodação na casa alugada no bairro da Barra e caminhada leve pela Av. Atlântica.",
    completed: false,
  },
  {
    id: 3,
    date: "2026-11-27",
    displayDate: "27/11/2026",
    weekday: "Sexta-feira",
    period: "Dia Todo",
    time: "08:30 - 19:00",
    title: "Beto Carrero World",
    location: "Penha - SC",
    category: "Passeio",
    details:
      "Dia inteiro no parque. Ida e volta de transfer/Uber. Noite livre para descanso na casa.",
    completed: false,
  },
  {
    id: 4,
    date: "2026-11-28",
    displayDate: "28/11/2026",
    weekday: "Sábado",
    period: "Manhã / Tarde",
    time: "09:30",
    title: "Parque Unipraias & Praia de Laranjeiras",
    location: "Barra Sul / Laranjeiras",
    category: "Passeio",
    details:
      "Bondinho aéreo saindo da Barra Sul (próximo à casa), mirantes e tarde na Praia de Laranjeiras.",
    completed: false,
  },
  {
    id: 5,
    date: "2026-11-28",
    displayDate: "28/11/2026",
    weekday: "Sábado",
    period: "Fim de Tarde",
    time: "17:30",
    title: "Pôr do Sol no Molhe da Barra Sul",
    location: "Molhe da Barra Sul",
    category: "Praia",
    details:
      "Passeio gratuito caminhando pelo molhe com vista panorâmica da orla.",
    completed: false,
  },
  {
    id: 6,
    date: "2026-11-29",
    displayDate: "29/11/2026",
    weekday: "Domingo",
    period: "Manhã",
    time: "10:00",
    title: "Oceanic Aquarium",
    location: "Barra Sul - Balneário Camboriú",
    category: "Passeio",
    details: "Visita ao aquário moderno. Fácil acesso de Uber.",
    completed: false,
  },
  {
    id: 7,
    date: "2026-11-29",
    displayDate: "29/11/2026",
    weekday: "Domingo",
    period: "Tarde",
    time: "14:30",
    title: "Praia de Taquaras",
    location: "Rota Interpraias",
    category: "Praia",
    details: "Passeio gratuito para curtir a natureza e o mar em família.",
    completed: false,
  },
  {
    id: 8,
    date: "2026-11-29",
    displayDate: "29/11/2026",
    weekday: "Domingo",
    period: "Noite",
    time: "20:00",
    title: "🎉 Aniversário da Bruna na Heróis da Pizza!",
    location: "3ª Avenida - Balneário Camboriú",
    category: "Comemoração",
    details:
      "Comemoração especial do aniversário da sobrinha Bruna no rodízio temático de super-heróis.",
    completed: false,
  },
  {
    id: 9,
    date: "2026-11-30",
    displayDate: "30/11/2026",
    weekday: "Segunda-feira",
    period: "Manhã",
    time: "09:30",
    title: "Passarela da Barra & Bairro Histórico",
    location: "Bairro da Barra (próximo à Rua Euclides Rosa)",
    category: "Lazer",
    details:
      "Passeio gratuito a poucos passos da casa, atravessando o Rio Camboriú.",
    completed: false,
  },
  {
    id: 10,
    date: "2026-11-30",
    displayDate: "30/11/2026",
    weekday: "Segunda-feira",
    period: "Tarde / Noite",
    time: "14:00",
    title: "Praia Central, Compras e Despedida",
    location: "Av. Atlântica / Centro",
    category: "Lazer",
    details:
      "Tarde livre para curtir a praia, compras e jantar de despedida.",
    completed: false,
  },
  {
    id: 11,
    date: "2026-12-01",
    displayDate: "01/12/2026",
    weekday: "Terça-feira",
    period: "Madrugada",
    time: "03:15 - 05:30",
    title: "Transfer e Voo de Retorno (NVT ➔ GIG)",
    location: "Rua Euclides Rosa, 52 ➔ Aeroporto de Navegantes",
    category: "Transporte",
    details:
      "Transfer busca na casa às 03:15 da manhã para o voo das 05:30.",
    completed: false,
  },
];

const EVENT_CATEGORIES = [
  "Todas",
  "Transporte",
  "Passeio",
  "Praia",
  "Comemoração",
  "Lazer",
  "Hospedagem",
];

const NOTE_CATEGORIES = ["Todas", "Checklist", "Dica", "Transfer/Uber"];

function getInitialSelectedDay(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayIso = `${yyyy}-${mm}-${dd}`;
  if (todayIso >= "2026-11-26" && todayIso <= "2026-12-01") {
    return todayIso;
  }
  return "2026-11-26";
}

export default function TripFlowHomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("day");
  const [selectedDate, setSelectedDate] = useState<string>("2026-11-26");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedNoteCategory, setSelectedNoteCategory] =
    useState<string>("Todas");

  const [events, setEvents] = useState<TripEvent[]>(FALLBACK_INITIAL_EVENTS);
  const [notes, setNotes] = useState<TripNote[]>([]);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Estados de Modais CRUD de Eventos
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TripEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<TripEvent | null>(null);

  // Estados de Modais CRUD de Notas
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<TripNote | null>(null);
  const [deletingNote, setDeletingNote] = useState<TripNote | null>(null);

  useEffect(() => {
    setSelectedDate(getInitialSelectedDay());
  }, []);

  const fetchAllData = useCallback(async (showToast = false) => {
    try {
      setSyncing(true);
      const [eventsRes, notesRes] = await Promise.all([
        fetch("/api/events", { cache: "no-store" }),
        fetch("/api/notes", { cache: "no-store" }),
      ]);

      if (!eventsRes.ok) throw new Error("Erro ao carregar eventos");
      if (!notesRes.ok) throw new Error("Erro ao carregar notas");

      const [eventsData, notesData] = await Promise.all([
        eventsRes.json(),
        notesRes.json(),
      ]);

      setEvents(eventsData);
      setNotes(notesData);

      if (showToast) {
        toast.success("Roteiro e notas atualizados com sucesso!");
      }
    } catch (error) {
      console.error(error);
      if (showToast) {
        toast.error("Não foi possível sincronizar os dados da viagem.");
      }
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(false);
  }, [fetchAllData]);

  // Lista dinâmica de dias (inclui os 6 dias oficiais + qualquer data extra criada pelo usuário)
  const availableDays = useMemo(() => {
    const map = new Map<
      string,
      { date: string; short: string; weekday: string; fullWeekday: string }
    >();
    TRIP_DAYS.forEach((d) => map.set(d.date, d));
    events.forEach((ev) => {
      if (!map.has(ev.date)) {
        map.set(ev.date, {
          date: ev.date,
          short: ev.displayDate.slice(0, 5),
          weekday: ev.weekday.slice(0, 3),
          fullWeekday: ev.weekday,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  }, [events]);

  // Eventos filtrados para a Aba 1 (Eventos do Dia)
  const dayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate]
  );

  // Eventos filtrados e agrupados por dia para a Aba 2 (Toda a Viagem)
  const filteredAllEvents = useMemo(() => {
    if (selectedCategory === "Todas") return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const groupedEventsByDay = useMemo(() => {
    const groups: Record<
      string,
      { date: string; displayDate: string; weekday: string; items: TripEvent[] }
    > = {};
    filteredAllEvents.forEach((ev) => {
      if (!groups[ev.date]) {
        groups[ev.date] = {
          date: ev.date,
          displayDate: ev.displayDate,
          weekday: ev.weekday,
          items: [],
        };
      }
      groups[ev.date].items.push(ev);
    });
    return Object.values(groups).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredAllEvents]);

  // Estatísticas de progresso da viagem
  const progressStats = useMemo(() => {
    const total = events.length;
    const completed = events.filter((e) => e.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
  }, [events]);

  // Notas filtradas para a Aba 3 (Notas & Checklist)
  const filteredNotes = useMemo(() => {
    if (selectedNoteCategory === "Todas") return notes;
    return notes.filter((n) => n.category === selectedNoteCategory);
  }, [notes, selectedNoteCategory]);

  const notesProgress = useMemo(() => {
    const total = notes.length;
    const done = notes.filter((n) => n.done).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [notes]);

  // ================= CRUD HANDLERS: EVENTOS =================
  const handleSaveEvent = async (
    eventData: Omit<TripEvent, "id" | "createdAt" | "updatedAt">,
    id?: number
  ) => {
    try {
      if (id) {
        const res = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!res.ok) throw new Error("Falha ao atualizar evento");
        const updated: TripEvent = await res.json();
        setEvents((prev) =>
          prev
            .map((item) => (item.id === id ? updated : item))
            .sort(
              (a, b) =>
                a.date.localeCompare(b.date) ||
                (a.time || "").localeCompare(b.time || "")
            )
        );
        toast.success(`Evento "${updated.title}" atualizado!`);
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!res.ok) throw new Error("Falha ao criar evento");
        const created: TripEvent = await res.json();
        setEvents((prev) =>
          [...prev, created].sort(
            (a, b) =>
              a.date.localeCompare(b.date) ||
              (a.time || "").localeCompare(b.time || "")
          )
        );
        setSelectedDate(created.date);
        toast.success(`Evento "${created.title}" adicionado ao roteiro!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o evento. Tente novamente.");
      throw error;
    }
  };

  const handleToggleEventComplete = async (event: TripEvent) => {
    const nextCompleted = !event.completed;
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextCompleted }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar status");
      const updated: TripEvent = await res.json();
      setEvents((prev) =>
        prev.map((item) => (item.id === event.id ? updated : item))
      );
      if (nextCompleted) {
        toast.success(`Passeio concluído: "${event.title}"!`);
      } else {
        toast.success(`Passeio reaberto: "${event.title}"`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível alterar o status do evento.");
    }
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deletingEvent) return;
    try {
      const res = await fetch(`/api/events/${deletingEvent.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir evento");
      setEvents((prev) => prev.filter((item) => item.id !== deletingEvent.id));
      toast.success(`Evento "${deletingEvent.title}" excluído do roteiro.`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir o evento.");
      throw error;
    }
  };

  // ================= CRUD HANDLERS: NOTAS & CHECKLIST =================
  const handleSaveNote = async (
    noteData: Omit<TripNote, "id" | "createdAt">,
    id?: number
  ) => {
    try {
      if (id) {
        const res = await fetch(`/api/notes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        if (!res.ok) throw new Error("Falha ao atualizar nota");
        const updated: TripNote = await res.json();
        setNotes((prev) =>
          prev.map((item) => (item.id === id ? updated : item))
        );
        toast.success(`Nota "${updated.title}" atualizada!`);
      } else {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        });
        if (!res.ok) throw new Error("Falha ao criar nota");
        const created: TripNote = await res.json();
        setNotes((prev) => [created, ...prev]);
        toast.success(`Item "${created.title}" adicionado com sucesso!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a nota/checklist.");
      throw error;
    }
  };

  const handleToggleNoteDone = async (note: TripNote) => {
    const nextDone = !note.done;
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: nextDone }),
      });
      if (!res.ok) throw new Error("Falha ao atualizar item");
      const updated: TripNote = await res.json();
      setNotes((prev) =>
        prev.map((item) => (item.id === note.id ? updated : item))
      );
      toast.success(
        nextDone
          ? `Checklist marcado: "${note.title}"`
          : `Item desmarcado: "${note.title}"`
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status da nota.");
    }
  };

  const handleConfirmDeleteNote = async () => {
    if (!deletingNote) return;
    try {
      const res = await fetch(`/api/notes/${deletingNote.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Falha ao excluir nota");
      setNotes((prev) => prev.filter((item) => item.id !== deletingNote.id));
      toast.success(`Nota "${deletingNote.title}" removida.`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir a nota.");
      throw error;
    }
  };

  const selectedDayMeta = availableDays.find((d) => d.date === selectedDate) || {
    date: selectedDate,
    short: selectedDate.split("-").reverse().slice(0, 2).join("/"),
    weekday: "",
    fullWeekday: "",
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#F3F4F6] pb-28 sm:pb-12">
      {/* Top Header Fixo Elegante Dark/Teal */}
      <header className="sticky top-0 z-30 bg-[#121212]/90 backdrop-blur-md border-b border-[#2e2e2e]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#008B8B] to-[#0B8494] flex items-center justify-center text-white shadow-md shadow-[#008B8B]/20 shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-[#F3F4F6] truncate">
                  TripFlow BC
                </h1>
                <span className="hidden xs:inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#008B8B]/20 text-[#208494] border border-[#008B8B]/40">
                  26/11 a 01/12
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#008B8B] shrink-0" />
                Balneário Camboriú • Viagem em Família
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fetchAllData(true)}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-[#1e1e1e] hover:bg-[#2e2e2e] border border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] flex items-center justify-center transition active:scale-95"
              title="Sincronizar roteiro"
              aria-label="Sincronizar roteiro"
            >
              <RefreshCw
                className={`w-4 h-4 ${syncing ? "animate-spin text-[#008B8B]" : ""}`}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab === "notes") {
                  setEditingNote(null);
                  setNoteModalOpen(true);
                } else {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }
              }}
              className="min-h-[44px] px-3.5 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] active:scale-95 text-[#F3F4F6] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-lg shadow-[#008B8B]/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{activeTab === "notes" ? "Nova Nota" : "Novo Evento"}</span>
            </button>
          </div>
        </div>

        {/* Abas Superiores (Visíveis em Desktop/Tablet e também acessíveis no topo) */}
        <div className="max-w-4xl mx-auto px-4 hidden sm:flex items-center gap-2 pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("day")}
            className={`min-h-[44px] px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition border ${
              activeTab === "day"
                ? "bg-[#008B8B] text-[#F3F4F6] border-[#008B8B] shadow"
                : "bg-[#1e1e1e] text-[#9CA3AF] hover:text-[#F3F4F6] border-[#2e2e2e]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Eventos do Dia
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`min-h-[44px] px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition border ${
              activeTab === "all"
                ? "bg-[#008B8B] text-[#F3F4F6] border-[#008B8B] shadow"
                : "bg-[#1e1e1e] text-[#9CA3AF] hover:text-[#F3F4F6] border-[#2e2e2e]"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Toda a Viagem
            <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/30">
              {progressStats.completed}/{progressStats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`min-h-[44px] px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-2 transition border ${
              activeTab === "notes"
                ? "bg-[#008B8B] text-[#F3F4F6] border-[#008B8B] shadow"
                : "bg-[#1e1e1e] text-[#9CA3AF] hover:text-[#F3F4F6] border-[#2e2e2e]"
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            Notas & Checklist
            <span className="px-1.5 py-0.5 text-xs rounded-md bg-black/30">
              {notes.length}
            </span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {/* Banner de Destaque Obrigatório no Topo */}
        <HighlightBanner
          events={events}
          onSelectDay={(date) => {
            setSelectedDate(date);
            setActiveTab("day");
          }}
        />

        {/* =========================================================
            ABA 1: EVENTOS DO DIA
           ========================================================= */}
        {activeTab === "day" && (
          <section aria-label="Eventos do Dia" className="space-y-5">
            {/* Seletor Horizontal de Dias (26/11 a 01/12) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Selecione o Dia do Roteiro
                </h2>
                <span className="text-xs text-[#208494] font-semibold">
                  {selectedDayMeta.short} • {selectedDayMeta.fullWeekday} <WeatherBadge date={selectedDate} />
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {availableDays.map((day) => {
                  const isSelected = day.date === selectedDate;
                  const dayEvs = events.filter((e) => e.date === day.date);
                  const allDone =
                    dayEvs.length > 0 &&
                    dayEvs.every((e) => e.completed);

                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDate(day.date)}
                      className={`min-h-[56px] min-w-[76px] px-3 py-2 rounded-2xl border flex flex-col items-center justify-center transition shrink-0 active:scale-95 ${
                        isSelected
                          ? "bg-gradient-to-b from-[#008B8B] to-[#0B8494] border-[#208494] text-[#F3F4F6] shadow-lg shadow-[#008B8B]/25"
                          : "bg-[#1e1e1e] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#008B8B]/50"
                      }`}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider opacity-85">
                        {day.weekday}
                      </span>
                      <span className="text-sm font-extrabold">
                        {day.short}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            allDone
                              ? "bg-emerald-400"
                              : isSelected
                              ? "bg-white"
                              : "bg-[#008B8B]"
                          }`}
                        />
                        <span className="text-[10px] opacity-80">
                          {dayEvs.length} {dayEvs.length === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cabeçalho do Dia Selecionado */}
            <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6]">
                  Roteiro de {selectedDayMeta.fullWeekday} (
                  {selectedDayMeta.short}/2026)
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  {dayEvents.length === 0
                    ? "Nenhum passeio cadastrado para este dia ainda."
                    : `${
                        dayEvents.filter((e) => e.completed).length
                      } de ${dayEvents.length} passeios concluídos neste dia`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEventModalOpen(true);
                }}
                className="min-h-[44px] px-3.5 rounded-xl bg-[#121212] hover:bg-[#008B8B]/20 text-[#208494] border border-[#008B8B]/40 text-xs font-semibold inline-flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                Adicionar em {selectedDayMeta.short}
              </button>
            </div>

            {/* Timeline Vertical de Eventos do Dia */}
            {dayEvents.length === 0 ? (
              <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-8 text-center space-y-3">
                <Calendar className="w-10 h-10 text-[#008B8B] mx-auto opacity-80" />
                <div className="space-y-1">
                  <p className="text-base font-bold text-[#F3F4F6]">
                    Dia livre no roteiro!
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    Toque no botão abaixo para adicionar um passeio ou atividade
                    para {selectedDayMeta.short}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setEventModalOpen(true);
                  }}
                  className="min-h-[44px] px-4 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] text-sm font-semibold text-white inline-flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Criar Evento para {selectedDayMeta.short}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {dayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onToggleComplete={handleToggleEventComplete}
                    onEdit={(ev) => {
                      setEditingEvent(ev);
                      setEventModalOpen(true);
                    }}
                    onDelete={(ev) => setDeletingEvent(ev)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            ABA 2: TODA A VIAGEM
           ========================================================= */}
        {activeTab === "all" && (
          <section aria-label="Toda a Viagem" className="space-y-5">
            {/* Barra de Progresso dos Passeios Concluídos */}
            <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-4 sm:p-5 space-y-3 shadow-md">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#008B8B]" />
                    Progresso da Viagem em Família
                  </h2>
                  <p className="text-xs text-[#9CA3AF]">
                    Acompanhe os passeios concluídos de 26/11 a 01/12/2026
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#208494]">
                    {progressStats.percent}%
                  </span>
                  <p className="text-[11px] text-[#9CA3AF]">
                    {progressStats.completed} de {progressStats.total}{" "}
                    concluídos
                  </p>
                </div>
              </div>

              <div className="w-full h-3 rounded-full bg-[#121212] border border-[#2e2e2e] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#008B8B] to-[#208494] transition-all duration-500 rounded-full"
                  style={{ width: `${progressStats.percent}%` }}
                />
              </div>
            </div>

            {/* Filtro Rápido por Categoria */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
                <Filter className="w-3.5 h-3.5 text-[#008B8B]" />
                Filtrar por Categoria
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {EVENT_CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  const count =
                    category === "Todas"
                      ? events.length
                      : events.filter((e) => e.category === category)
                          .length;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition shrink-0 inline-flex items-center gap-1.5 ${
                        active
                          ? "bg-[#008B8B] border-[#208494] text-[#F3F4F6] shadow"
                          : "bg-[#1e1e1e] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6]"
                      }`}
                    >
                      <span>{category}</span>
                      <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-black/30">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Eventos Agrupados por Dia */}
            {groupedEventsByDay.length === 0 ? (
              <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-8 text-center space-y-2">
                <p className="text-base font-bold text-[#F3F4F6]">
                  Nenhum evento encontrado nesta categoria.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("Todas")}
                  className="min-h-[44px] px-4 rounded-xl bg-[#008B8B] text-xs font-semibold text-white"
                >
                  Mostrar Todas as Categorias
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedEventsByDay.map((group) => (
                  <div key={group.date} className="space-y-3">
                    <div className="sticky top-[68px] sm:top-[120px] z-10 bg-[#121212]/95 backdrop-blur py-2 border-b border-[#2e2e2e] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#008B8B]/20 border border-[#008B8B]/40 text-xs font-extrabold text-[#208494]">
                          {group.displayDate}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#F3F4F6]">
                          {group.weekday}
                        </h3>
                      </div>
                      <span className="text-xs text-[#9CA3AF]">
                        {group.items.filter((i) => i.completed).length}/
                        {group.items.length} concluídos
                      </span>
                    </div>

                    <div className="space-y-4">
                      {group.items.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onToggleComplete={handleToggleEventComplete}
                          onEdit={(ev) => {
                            setEditingEvent(ev);
                            setEventModalOpen(true);
                          }}
                          onDelete={(ev) => setDeletingEvent(ev)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* =========================================================
            ABA 3: NOTAS & CHECKLIST (CRUD EXTRA)
           ========================================================= */}
        {activeTab === "notes" && (
          <section aria-label="Notas e Checklist" className="space-y-5">
            {/* Cabeçalho e Progresso de Notas/Checklist */}
            <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#008B8B]" />
                  Notas Rápidas, Bagagem & Contatos Uber/Transfer
                </h2>
                <p className="text-xs text-[#9CA3AF]">
                  {notesProgress.done} de {notesProgress.total} itens
                  verificados ({notesProgress.percent}%)
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingNote(null);
                  setNoteModalOpen(true);
                }}
                className="min-h-[44px] px-4 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] text-xs sm:text-sm font-semibold text-[#F3F4F6] inline-flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item / Contato
              </button>
            </div>

            {/* Filtro por Categoria de Nota */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {NOTE_CATEGORIES.map((cat) => {
                const active = selectedNoteCategory === cat;
                const count =
                  cat === "Todas"
                    ? notes.length
                    : notes.filter((n) => n.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedNoteCategory(cat)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold border transition shrink-0 inline-flex items-center gap-1.5 ${
                      active
                        ? "bg-[#008B8B] border-[#208494] text-[#F3F4F6] shadow"
                        : "bg-[#1e1e1e] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6]"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded-md bg-black/30">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Lista de Cards de Notas & Checklist */}
            {filteredNotes.length === 0 ? (
              <div className="rounded-2xl bg-[#1e1e1e] border border-[#2e2e2e] p-8 text-center space-y-3">
                <CheckSquare className="w-10 h-10 text-[#008B8B] mx-auto opacity-80" />
                <p className="text-base font-bold text-[#F3F4F6]">
                  Nenhuma nota ou checklist nesta categoria
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingNote(null);
                    setNoteModalOpen(true);
                  }}
                  className="min-h-[44px] px-4 rounded-xl bg-[#008B8B] hover:bg-[#0B8494] text-xs font-semibold text-white inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeira Nota
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredNotes.map((note) => {
                  const BadgeIcon =
                    note.category === "Transfer/Uber"
                      ? Car
                      : note.category === "Dica"
                      ? Lightbulb
                      : CheckSquare;

                  return (
                    <article
                      key={note.id}
                      className={`rounded-2xl bg-[#1e1e1e] border p-4 flex flex-col justify-between gap-3 transition shadow ${
                        note.done
                          ? "border-emerald-500/30 opacity-80"
                          : "border-[#2e2e2e] hover:border-[#008B8B]/50"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              note.category === "Transfer/Uber"
                                ? "bg-[#0B8494]/20 text-[#208494] border-[#0B8494]/40"
                                : note.category === "Dica"
                                ? "bg-amber-500/15 text-amber-300 border-amber-500/35"
                                : "bg-[#008B8B]/20 text-[#4fd1c5] border-[#008B8B]/40"
                            }`}
                          >
                            <BadgeIcon className="w-3.5 h-3.5" />
                            {note.category}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleToggleNoteDone(note)}
                            className={`min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center border transition active:scale-95 ${
                              note.done
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : "bg-[#121212] border-[#2e2e2e] text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#008B8B]"
                            }`}
                            title={
                              note.done
                                ? "Desmarcar item"
                                : "Marcar item como concluído"
                            }
                            aria-label={
                              note.done
                                ? "Desmarcar item"
                                : "Marcar item como concluído"
                            }
                          >
                            {note.done ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <h3
                          className={`text-base font-bold ${
                            note.done
                              ? "line-through text-[#9CA3AF]"
                              : "text-[#F3F4F6]"
                          }`}
                        >
                          {note.title}
                        </h3>

                        <p className="text-sm text-[#9CA3AF] leading-relaxed whitespace-pre-line">
                          {note.content}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#2e2e2e] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#9CA3AF]">
                          {note.done ? "✓ Verificado" : "Pendente"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNote(note);
                              setNoteModalOpen(true);
                            }}
                            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#121212] hover:bg-[#008B8B]/20 text-[#F3F4F6] hover:text-[#208494] border border-[#2e2e2e] inline-flex items-center justify-center gap-1.5 text-xs font-medium transition"
                            aria-label={`Editar ${note.title}`}
                          >
                            <Pencil className="w-4 h-4" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingNote(note)}
                            className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-[#121212] hover:bg-red-500/15 text-[#9CA3AF] hover:text-red-400 border border-[#2e2e2e] inline-flex items-center justify-center gap-1.5 text-xs font-medium transition"
                            aria-label={`Excluir ${note.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Barra de Navegação Inferior Fixa (Bottom Navigation Mobile-First) */}
      <nav
        aria-label="Navegação Principal Mobile"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1e1e1e]/95 backdrop-blur-md border-t border-[#2e2e2e] px-3 py-1.5"
      >
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("day")}
            className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-semibold transition ${
              activeTab === "day"
                ? "bg-[#008B8B]/25 text-[#208494] border border-[#008B8B]/50"
                : "text-[#9CA3AF] hover:text-[#F3F4F6]"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Eventos do Dia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-[#008B8B]/25 text-[#208494] border border-[#008B8B]/50"
                : "text-[#9CA3AF] hover:text-[#F3F4F6]"
            }`}
          >
            <MapIcon className="w-5 h-5" />
            <span>Toda a Viagem</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`min-h-[48px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-semibold transition ${
              activeTab === "notes"
                ? "bg-[#008B8B]/25 text-[#208494] border border-[#008B8B]/50"
                : "text-[#9CA3AF] hover:text-[#F3F4F6]"
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>Notas & Check</span>
          </button>
        </div>
      </nav>

      {/* Modais CRUD de Eventos */}
      <EventModal
        isOpen={eventModalOpen}
        initialEvent={editingEvent}
        defaultDate={selectedDate}
        onClose={() => {
          setEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingEvent)}
        title="Excluir Evento do Roteiro"
        description={
          deletingEvent
            ? `Tem certeza que deseja excluir "${deletingEvent.title}" (${deletingEvent.displayDate})? Esta ação não pode ser desfeita.`
            : ""
        }
        onCancel={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDeleteEvent}
      />

      {/* Modais CRUD de Notas & Checklist */}
      <NoteModal
        isOpen={noteModalOpen}
        initialNote={editingNote}
        defaultCategory={selectedNoteCategory}
        onClose={() => {
          setNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
      />

      <ConfirmDeleteModal
        isOpen={Boolean(deletingNote)}
        title="Excluir Nota / Item"
        description={
          deletingNote
            ? `Tem certeza que deseja excluir "${deletingNote.title}"?`
            : ""
        }
        onCancel={() => setDeletingNote(null)}
        onConfirm={handleConfirmDeleteNote}
      />
    </div>
  );
}
