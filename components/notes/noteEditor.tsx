import { useState, useEffect } from "react"
// import Toolbar from "./Toolbar"
import { Note } from "@/types/notes"
import Toolbar from "./toolbar"

type Props = {
  selected: Note | null
  setSelected: React.Dispatch<React.SetStateAction<Note | null>>
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

export default function NoteEditor({ selected, setSelected, setNotes }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState(selected)

  useEffect(() => {
    setDraft(selected)
    setEditMode(false)
  }, [selected])

  if (!draft) {
    return <div className="flex-1 flex items-center justify-center">No note selected</div>
  }

  const saveNote = async () => {
    const res = await fetch("/api/notes", {
      method: "PATCH",
      body: JSON.stringify(draft)
    })

    const updated = await res.json()

    setNotes(prev =>
      prev.map(n => (n.id === updated.id ? updated : n))
    )

    setSelected(updated)
    setEditMode(false)
  }

  const deleteNote = async () => {
    await fetch("/api/notes", {
      method: "DELETE",
      body: JSON.stringify({ id: draft.id })
    })

    setNotes(prev => prev.filter(n => n.id !== draft.id))
    setSelected(null)
  }

  const discardChanges = () => {
    setDraft(selected)
    setEditMode(false)
  }

  return (
    <div className="flex-1 p-6">
      <Toolbar
        editMode={editMode}
        setEditMode={setEditMode}
        saveNote={saveNote}
        discardChanges={discardChanges}
        deleteNote={deleteNote}
      />

      <input
        disabled={!editMode}
        value={draft.title || ""}
        onChange={e => setDraft({ ...draft, title: e.target.value })}
        className="text-2xl font-semibold w-full mb-4 outline-none"
        placeholder="Title"
      />

      <textarea
        disabled={!editMode}
        value={draft.content}
        onChange={e => setDraft({ ...draft, content: e.target.value })}
        className="w-full h-[70%] outline-none resize-none text-gray-700"
        placeholder="Write your note..."
      />
    </div>
  )
}