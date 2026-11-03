import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

async function handleUpdate(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.date !== undefined) {
      updateData.date = body.date;
      updateData.displayDate =
        body.displayDate || formatDisplayDate(body.date);
      updateData.weekday = body.weekday || getWeekdayPtBr(body.date);
    } else {
      if (body.displayDate !== undefined)
        updateData.displayDate = body.displayDate;
      if (body.weekday !== undefined) updateData.weekday = body.weekday;
    }

    if (body.period !== undefined) updateData.period = body.period;
    if (body.time !== undefined) updateData.time = body.time || null;
    if (body.title !== undefined) updateData.title = body.title;
    if (body.location !== undefined)
      updateData.location = body.location || null;
    for (const key of ["costEstimated", "costReal"]) {
      if (body[key] !== undefined) updateData[key] = body[key] == null ? null : Number(body[key]);
    }
    if (body.paidBy !== undefined) updateData.paidBy = body.paidBy || null;
    if (body.attachments !== undefined) updateData.attachments = Array.isArray(body.attachments) ? JSON.stringify(body.attachments) : body.attachments || null;
    if (body.details !== undefined) updateData.details = body.details;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.completed !== undefined)
      updateData.completed = Boolean(body.completed);

    const updated = await prisma.tripEvent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o evento." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return handleUpdate(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return handleUpdate(request, context);
}

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    await prisma.tripEvent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Erro ao excluir o evento." },
      { status: 500 }
    );
  }
}

