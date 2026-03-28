"use client"
import { useState, useEffect } from "react"
import { Note } from "@/types/notes"
import { updateNote, deleteNote } from "@/lib/actions/notes"  // ✅ server actions
import Toolbar from "./toolbar"

type Props = {
  selected: Note | null
  setSelected: React.Dispatch<React.SetStateAction<Note | null>>
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

export default function NoteEditor({ selected, setSelected, setNotes }: Props) {
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState<Note | null>(selected)
  const [loading, setLoading] = useState(false)  // ✅ loading state

  useEffect(() => {
    setDraft(selected)
    setEditMode(false)
  }, [selected])

  if (!draft) {
    return <div className="flex-1 flex items-center justify-center">No note selected</div>
  }

  const saveNote = async () => {
    setLoading(true)
    try {
      const updated = await updateNote(draft.id, {  // ✅ direct server action
        title: draft.title ?? undefined,
        content: draft.content
      })

      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
      setSelected(updated)
      setEditMode(false)
    } catch (err) {
      console.error("Failed to save note:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteNote(draft.id)  // ✅ direct server action

      setNotes(prev => prev.filter(n => n.id !== draft.id))
      setSelected(null)
    } catch (err) {
      console.error("Failed to delete note:", err)
    } finally {
      setLoading(false)
    }
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
        deleteNote={handleDelete}
        loading={loading}          // ✅ pass loading to toolbar for button states
      />

      <input
        disabled={!editMode || loading}
        value={draft.title || ""}
        onChange={e => setDraft({ ...draft, title: e.target.value })}
        className="text-2xl font-semibold w-full mb-4 outline-none disabled:opacity-70"
        placeholder="Title"
      />

      <textarea
        disabled={!editMode || loading}
        value={draft.content}
        onChange={e => setDraft({ ...draft, content: e.target.value })}
        className="w-full h-[70%] outline-none resize-none text-gray-700 disabled:opacity-70"
        placeholder="Write your note..."
      />
    </div>
  )
}