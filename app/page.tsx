"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import SignPage from "./sign/page";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>{session.user?.email}</p>
          <button onClick={() => signOut()}>Logout</button>
          <h1>Welcome back, {session?.accessToken}!</h1>
        </>
      ) : (
        <>
        <SignPage/>
          <Button onClick={() => signIn("google")}>Login with Google</Button>
          <Button onClick={() => signIn("github")}>Login with GitHub</Button>
        </>
      )}
    </div>
  );
}