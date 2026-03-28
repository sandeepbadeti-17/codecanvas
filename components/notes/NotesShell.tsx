// components/notes/NotesShell.tsx ← only this is "use client"
"use client";

import { useState } from "react";
import { Note } from "@/types/notes";
import NotesList from "./notesList";
import NoteEditor from "./noteEditor";

export default function NotesShell({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes); // no useEffect needed
  const [selected, setSelected] = useState<Note | null>(initialNotes[0] ?? null);

  return (
    <>
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
    </>
  );
}