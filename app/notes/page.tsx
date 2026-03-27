"use client"
import { Note } from "@/types/notes"
import NoteEditor from "@/components/notes/noteEditor"
import NotesList from "@/components/notes/notesList"
import { useEffect, useState } from "react"

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)

  // Fetch notes
  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => {
        setNotes(data)
        if (data.length) setSelected(data[0])
      })
  }, [])

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