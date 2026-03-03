"use client"

import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
    >
      <FaSignOutAlt className="text-slate-400" />
      Sign Out
    </button>
  )
}
