"use client";

import { useSession } from "next-auth/react";
import SignPage from "./sign/page";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {!session &&  <SignPage />}
    </div>
  );
}
