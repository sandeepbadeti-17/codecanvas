"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import SignPage from "./sign/page";
import Notes from "./notes/page";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
            <Notes />

            <button
              onClick={() => signOut()}
              className="fixed bottom-[50px] right-[30px] flex items-center gap-2 
             px-5 py-2.5 
             bg-white/70 backdrop-blur-md
             border border-gray-200
             rounded-full 
             shadow-md
             text-sm font-medium
             text-gray-700
             hover:bg-white 
             hover:shadow-lg
             active:scale-95
             transition-all duration-200"
            >
              {/* Avatar */}
              <img
                src={session?.user?.image || "/default-avatar.png"}
                alt="user"
                className="w-8 h-8 rounded-full object-cover"
              />

              {/* Name */}
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {session?.user?.name || "User"}
              </span>

              {/* Logout Icon */}
              <LogOut size={16} className="text-gray-600" />
            </button>
          </div>
        </>
      ) : (
        <>
          <SignPage />
        </>
      )}
    </div>
  );
}
