import { getNotes } from "@/lib/actions/notes";
import Logout from "@/components/auth/logout";
import NotesShell from "@/components/notes/NotesShell";

export default async function NotesPage() {
  const notes = await getNotes(); // direct Prisma, no HTTP

  return (
    <div className="flex h-screen bg-gray-50">
      <NotesShell initialNotes={notes} />
      <Logout />
    </div>
  );
}