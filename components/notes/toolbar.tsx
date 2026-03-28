type ToolbarProps = {
  editMode: boolean
  setEditMode: (val: boolean) => void
  saveNote: () => void
  discardChanges: () => void
  deleteNote: () => void
  loading: boolean  // ✅ add this
}

export default function Toolbar({
  editMode,
  setEditMode,
  saveNote,
  discardChanges,
  deleteNote
}: ToolbarProps) {
  return (
    <div className="flex justify-between mb-4">
      <div>
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>✏️ Edit</button>
        ) : (
          <>
            <button onClick={saveNote} className="mr-2 text-green-600">
              Save
            </button>
            <button onClick={discardChanges} className="text-red-500">
              Discard
            </button>
          </>
        )}
      </div>

      <button onClick={deleteNote} className="text-red-600">
        Delete
      </button>
    </div>
  )
}