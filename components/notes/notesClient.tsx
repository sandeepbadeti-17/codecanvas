"use client"
import { Note } from "@/types/notes"
import NoteEditor from "@/components/notes/noteEditor"
import NotesList from "@/components/notes/notesList"
import { useState } from "react"

interface Props {
  initialNotes: Note[]
}

export default function NotesClient({ initialNotes }: Props) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)  // ✅ pre-populated, no useEffect needed
  const [selected, setSelected] = useState<Note | null>(initialNotes[0] ?? null)

  return (
    <div className="flex h-screen bg-gray-50">
      <NotesList
        notes={notes}
        selected={selected}
        setSelected={setSelected}
        setNotes={setNotes}
      />
      <NoteEditor
        selected={selected}
        setSelected={setSelected}
        setNotes={setNotes}
      />
    </div>
  )
}
