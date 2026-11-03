import { Attachment, TripEvent } from "@/types/trip";

export function getUberDeepLink(address: string, nickname = "") {
  const params = new URLSearchParams({ action: "setPickup", pickup: "my_location", "dropoff[formatted_address]": address });
  if (nickname) params.set("dropoff[nickname]", nickname);
  return `https://m.uber.com/ul/?${params.toString()}`;
}

export function getGoogleCalendarLink(event: TripEvent) {
  const date = event.date.replaceAll("-", "");
  const start = `${date}T${(event.time || "12:00").slice(0, 5).replace(":", "")}00`;
  const end = `${date}T${(event.time || "13:00").slice(-5).replace(":", "")}00`;
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title, dates: `${start}/${end}`, details: event.details, location: event.location || "" });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function parseAttachments(value?: string | Attachment[] | null): Attachment[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try { return JSON.parse(value); } catch { return []; }
}
