"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { FaSignOutAlt } from "react-icons/fa"

export default function MobileHeader() {
  return (
    <header className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-gray-900">WhereTo Admin</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          <FaSignOutAlt />
          Sign Out
        </button>
      </div>
    </header>
  )
}
