"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  const name = session?.user?.name || "User";
  const image = session?.user?.image;

  const [imgError, setImgError] = useState(false);

  const initial = name.charAt(0).toUpperCase();

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
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
             transition-all duration-200 hover:underline cursor-pointer"
    >
      {/* Avatar */}
      {image && !imgError ? (
        <img
          src={image}
          alt={name}
          onError={() => setImgError(true)} // 💥 key fix
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
          {initial}
        </div>
      )}

      {/* Name */}
      <span className="max-w-[120px] truncate">{name}</span>

      {/* Logout Icon */}
      <LogOut size={16} className="text-gray-600" />
    </button>
  );
}