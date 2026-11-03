"use client";
import { useEffect, useState } from "react";

const places: Record<string, [number, number]> = { "2026-11-27": [-26.7712, -48.6475] };
const labels: Record<number, string> = { 0: "Ensolarado", 1: "Parcialmente nublado", 2: "Parcialmente nublado", 3: "Nublado", 45: "Neblina", 51: "Chuvisco", 61: "Chuva", 80: "Pancadas", 95: "Trovoada" };

export default function WeatherBadge({ date }: { date: string }) {
  const [weather, setWeather] = useState<{ max: number; min: number; code: number } | null>(null);
  useEffect(() => {
    const [latitude, longitude] = places[date] || [-26.993, -48.6343];
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo&start_date=${date}&end_date=${date}`)
      .then((r) => r.json()).then((d) => d.daily && setWeather({ max: Math.round(d.daily.temperature_2m_max[0]), min: Math.round(d.daily.temperature_2m_min[0]), code: d.daily.weathercode[0] })).catch(() => undefined);
  }, [date]);
  if (!weather) return <span className="text-xs text-[#9CA3AF]">⛅ Carregando clima…</span>;
  return <span className="text-xs text-[#9CA3AF]">{weather.code <= 2 ? "☀️" : "🌧️"} {weather.max}°C / {weather.min}°C — {labels[weather.code] || "Condição variável"}</span>;
}
