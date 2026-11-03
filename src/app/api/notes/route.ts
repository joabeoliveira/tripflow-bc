import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const INITIAL_NOTES = [
  {
    title: "Documentos & Cartões de Embarque (GIG ➔ NVT)",
    content:
      "Conferir RG/CNH originais de toda a família, cartões de embarque e voucher do transfer até Balneário Camboriú.",
    category: "Checklist",
    done: false,
  },
  {
    title: "Kit Dia Inteiro - Beto Carrero World",
    content:
      "Protetor solar, bonés, tênis confortável, capas de chuva leves, garrafas de água e carregador portátil (Powerbank).",
    category: "Checklist",
    done: false,
  },
  {
    title: "Transfer Aeroporto NVT ⇄ Casa na Barra",
    content:
      "Ida: 26/11 às 18:30 no desembarque de Navegantes. Volta: 01/12 às 03:15 da madrugada saindo da Rua Euclides Rosa, 52.",
    category: "Transfer/Uber",
    done: false,
  },
  {
    title: "Aniversário da Bruna - Heróis da Pizza (29/11)",
    content:
      "Localizado na 3ª Avenida. Chegar próximo às 19:45 para garantir mesa especial no rodízio temático de super-heróis.",
    category: "Dica",
    done: false,
  },
  {
    title: "Endereço da Casa Alugada",
    content:
      "Rua Euclides Rosa, 52 - Bairro da Barra, Balneário Camboriú. Pertinho da Passarela da Barra e do Parque Unipraias.",
    category: "Dica",
    done: false,
  },
];

let noteSeedPromise: Promise<void> | null = null;

export async function GET() {
  try {
    if (!noteSeedPromise) {
      noteSeedPromise = (async () => {
        const count = await prisma.tripNote.count();
        if (count === 0) {
          await prisma.tripNote.createMany({
            data: INITIAL_NOTES,
          });
        }
      })().finally(() => {
        noteSeedPromise = null;
      });
    }
    await noteSeedPromise;

    const notes = await prisma.tripNote.findMany({
      orderBy: [{ done: "asc" }, { createdAt: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Falha ao carregar notas e checklists." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, done } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Preencha título, categoria e conteúdo da nota." },
        { status: 400 }
      );
    }

    const created = await prisma.tripNote.create({
      data: {
        title,
        content,
        category,
        done: Boolean(done),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Erro ao criar nota/checklist." },
      { status: 500 }
    );
  }
}
