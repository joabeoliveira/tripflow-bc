import { Attachment, TripEvent } from "@/types/trip";

export function getUberDeepLink(address: string, nickname = "") {
  const query = `action=setPickup&pickup=my_location&dropoff[formatted_address]=${encodeURIComponent(address.trim())}`;
  return `https://m.uber.com/ul/?${nickname ? `${query}&dropoff[nickname]=${encodeURIComponent(nickname.trim())}` : query}`;
}

export function getGoogleCalendarLink(event: TripEvent) {
  const [year, month, day] = event.date.split("-").map(Number);
  const times = (event.time || "12:00 - 13:00").match(/\d{1,2}:\d{2}/g) || ["12:00", "13:00"];
  const toUtc = (value: string) => new Date(Date.UTC(year, month - 1, day, Number(value.slice(0, 2)) + 3, Number(value.slice(3, 5)))).toISOString().replace(/[-:]/g, "").replace(".000", "");
  const start = toUtc(times[0]);
  const end = toUtc(times[1] || `${String(Number(times[0].slice(0, 2)) + 1).padStart(2, "0")}:${times[0].slice(3)}`);
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: `${start}/${end}`, details: event.details, location: event.location || "" });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function parseAttachments(value?: string | Attachment[] | null): Attachment[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}
