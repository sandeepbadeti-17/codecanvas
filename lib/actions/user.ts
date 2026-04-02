"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function saveProfile({ 
  firstName, 
  lastName 
}: { 
  firstName: string
  lastName: string 
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Not authenticated")

  const fullName = lastName 
    ? `${firstName} ${lastName}` 
    : firstName

  await prisma.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, name: fullName }
  })
}