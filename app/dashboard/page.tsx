import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default async function Dashboard() {
  // const session = await getServerSession();
    const { data: session } = useSession()

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      Welcome to Dashboard
      <>
        <p>{session.user.email}</p>
        <button onClick={() => signOut()}>Logout</button>
      </>
    </div>
  );
}
