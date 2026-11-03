export type EventCategory =
  | "Transporte"
  | "Passeio"
  | "Praia"
  | "Comemoração"
  | "Lazer"
  | "Hospedagem";

export type NoteCategory = "Checklist" | "Dica" | "Transfer/Uber";

export interface TripEvent {
  id: number;
  date: string; // "YYYY-MM-DD"
  displayDate: string; // "DD/MM/YYYY"
  weekday: string; // "Quinta-feira"
  period: string; // "Manhã" | "Tarde" | "Noite" | "Madrugada" | "Dia Todo" etc.
  time: string | null;
  title: string;
  location: string | null;
  details: string;
  category: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TripNote {
  id: number;
  title: string;
  content: string;
  category: string; // "Checklist" | "Dica" | "Transfer/Uber"
  done: boolean;
  createdAt?: string;
}

