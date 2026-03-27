import { Note } from "@/types/notes";
import { useState } from "react";

type Props = {
  notes: Note[];
  selected: Note | null;
  setSelected: React.Dispatch<React.SetStateAction<Note | null>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
};

export default function NotesList({
  notes,
  selected,
  setSelected,
  setNotes,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createNote = async () => {
    if (!title.trim()) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    const newNote = await res.json();

    setNotes((prev) => [newNote, ...prev]);
    setSelected(newNote);

    // reset + close
    setTitle("");
    setContent("");
    setIsOpen(false);
  };

  return (
    <div className="w-1/3 border-r p-4 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 w-full py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
      >
        + New Note
      </button>

      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => setSelected(note)}
          className={`p-3 rounded-lg cursor-pointer mb-2 ${
            selected?.id === note.id ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <h3 className="font-medium">{note.title || "Untitled"}</h3>
          <p className="text-sm text-gray-500 truncate">{note.content}</p>
        </div>
      ))}

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-[400px] bg-white rounded-2xl shadow-xl p-5">
            <h2 className="text-lg font-semibold mb-4">New Note</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 p-2 bg-gray-100 rounded-lg outline-none"
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mb-4 p-2 bg-gray-100 rounded-lg outline-none h-24 resize-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTitle("");
                  setContent("");
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={createNote}
                className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
