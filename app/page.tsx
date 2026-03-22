"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>{session.user?.email}</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <>
          <Button onClick={() => signIn("google")}>Login with Google</Button>
          <Button onClick={() => signIn("github")}>Login with GitHub</Button>
        </>
      )}
    </div>
  );
}