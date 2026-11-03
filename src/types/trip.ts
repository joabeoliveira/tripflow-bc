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
  costEstimated?: number | null;
  costReal?: number | null;
  paidBy?: string | null;
  attachments?: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: "pdf" | "image" | "link";
}

export interface TripNote {
  id: number;
  title: string;
  content: string;
  category: string; // "Checklist" | "Dica" | "Transfer/Uber"
  done: boolean;
  attachments?: Attachment[];
  createdAt?: string;
}

