import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET -> Fetch All notes
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
        where: {
            userId: session.user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return NextResponse.json(notes)
}

// POST  -> Create Note

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content } = body;

    if (!content) {
        return NextResponse.json({ error: "Content require" }, { status: 400 })
    }

    const note = await prisma.note.create({
        data: {
            title,
            content,
            userId: session.user.id
        }
    })

    return NextResponse.json(note)
}



// PATCH -> Update note
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, content} = body

    if(!id){
        return NextResponse.json({error: "Note ID required"}, {status: 400})
    }

    // Ensure user owns the note
    const existingNote = await prisma.note.findUnique({
        where: {id}
    })

    if(!existingNote || existingNote.userId !== session.user.id){
        return NextResponse.json({error: "Not allowed"}, {status: 403})
    }

    const updatedNote = await prisma.note.update({
        where: {id},
        data: {
            title,
            content
        }
    })

    return NextResponse.json(updatedNote)
}


// Delete Note

export async function DELETE(req: Request){
    const session = await getServerSession(authOptions)

    if(!session?.user?.id){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const body = await req.json()
    const {id} = body
    
    if(!id){
        return NextResponse.json({error: "Note ID required"}, {status: 400})
    }

    // Ensure user owns the note
    const existingNote = await prisma.note.findUnique({
        where:{id}
    })

    if(!existingNote || existingNote.userId !== session.user.id){
        return NextResponse.json({error: "Not allowed"},{status: 403})
    }

    //Delete the note
    await prisma.note.delete({
        where: {id}
    })

    return NextResponse.json({message: "Note deleted successfully", id})
}
