import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const INITIAL_EVENTS = [
  {
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

let seedPromise: Promise<void> | null = null;

function formatDisplayDate(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getWeekdayPtBr(isoDate: string): string {
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

export async function GET() {
  try {
    if (!seedPromise) {
      seedPromise = (async () => {
        const count = await prisma.tripEvent.count();
        if (count === 0) {
          await prisma.tripEvent.createMany({
            data: INITIAL_EVENTS,
          });
        }
      })().finally(() => {
        seedPromise = null;
      });
    }
    await seedPromise;

    const events = await prisma.tripEvent.findMany({
      orderBy: [{ date: "asc" }, { time: "asc" }, { id: "asc" }],
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching/seeding events:", error);
    return NextResponse.json(
      { error: "Falha ao carregar o roteiro da viagem." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      date,
      displayDate,
      weekday,
      period,
      time,
      title,
      location,
      details,
      category,
      completed,
    } = body;

    if (!date || !title || !period || !category || !details) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    const created = await prisma.tripEvent.create({
      data: {
        date,
        displayDate: displayDate || formatDisplayDate(date),
        weekday: weekday || getWeekdayPtBr(date),
        period,
        time: time || null,
        title,
        location: location || null,
        details,
        category,
        completed: Boolean(completed),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Erro ao criar novo evento no roteiro." },
      { status: 500 }
    );
  }
}
