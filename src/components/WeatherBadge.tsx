"use client";
import { useEffect, useState } from "react";

const places: Record<string, [number, number]> = { "2026-11-27": [-26.7712, -48.6475] };
const labels: Record<number, string> = { 0: "Ensolarado", 1: "Parcialmente nublado", 2: "Parcialmente nublado", 3: "Nublado", 45: "Neblina", 51: "Chuvisco", 61: "Chuva", 80: "Pancadas", 95: "Trovoada" };
const historical = { max: 26, min: 20 };

function isWithinForecastWindow(date: string) {
  const selected = new Date(`${date}T12:00:00`);
  const today = new Date();
  const diff = (selected.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) / 86400000;
  return diff >= 0 && diff <= 16;
}

export default function WeatherBadge({ date }: { date: string }) {
  const [weather, setWeather] = useState<{ max: number; min: number; code?: number; historical?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setWeather(null);
    if (!isWithinForecastWindow(date)) {
      setWeather({ ...historical, historical: true });
      setLoading(false);
      return () => { cancelled = true; };
    }
    const [latitude, longitude] = places[date] || [-26.993, -48.6343];
    const controller = new AbortController();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo&start_date=${date}&end_date=${date}`, { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error("Falha ao consultar o clima"); return r.json(); })
      .then((d) => { if (!cancelled && d.daily?.temperature_2m_max?.[0] != null) setWeather({ max: Math.round(d.daily.temperature_2m_max[0]), min: Math.round(d.daily.temperature_2m_min[0]), code: d.daily.weathercode[0] }); else if (!cancelled) setWeather({ ...historical, historical: true }); })
      .catch((error) => { if (!cancelled && error.name !== "AbortError") setWeather({ ...historical, historical: true }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [date]);
  if (loading) return <span className="text-xs text-[#9CA3AF]">⛅ Consultando clima…</span>;
  if (!weather) return null;
  if (weather.historical) return <span className="text-xs text-[#9CA3AF]">☀️ {weather.max}°C • Méd. histórica</span>;
  return <span className="text-xs text-[#9CA3AF]">{(weather.code ?? 0) <= 2 ? "☀️" : "🌧️"} {weather.max}°C / {weather.min}°C — {labels[weather.code ?? 0] || "Condição variável"}</span>;
}
