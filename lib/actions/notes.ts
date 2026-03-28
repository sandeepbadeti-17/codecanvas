"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getNotes() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized")

  return prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" }
  })
}

export async function createNote(data: { title?: string; content: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized")

  const note = await prisma.note.create({
    data: { ...data, userId: session.user.id }
  })

  revalidatePath("/notes")  // ✅ auto refreshes server component
  return note
}

export async function updateNote(id: string, data: { title?: string; content?: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized")

  const note = await prisma.note.update({
    where: { id, userId: session.user.id },
    data
  })

  revalidatePath("/notes")
  return note
}

export async function deleteNote(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.note.delete({
    where: { id, userId: session.user.id }
  })

  revalidatePath("/notes")
}