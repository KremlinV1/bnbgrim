"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { FaPlus, FaExternalLinkAlt, FaChartBar, FaSignOutAlt, FaCalendarCheck, FaHome, FaUsers, FaStar, FaConciergeBell } from "react-icons/fa"

interface AdminSidebarProps {
  userEmail: string | null | undefined
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
  }
  
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-900 text-white">
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF385C] to-[#E31C5F] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">W</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">WhereTo</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <Link 
          href="/admin" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin') && pathname === '/admin'
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaChartBar className={isActive('/admin') && pathname === '/admin' ? 'text-[#FF385C]' : 'text-slate-400'} />
          Dashboard
        </Link>
        <Link 
          href="/admin/bookings" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin/bookings')
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaCalendarCheck className={isActive('/admin/bookings') ? 'text-[#FF385C]' : 'text-slate-400'} />
          Bookings
        </Link>
        <Link 
          href="/admin/properties/new" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin/properties')
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaHome className={isActive('/admin/properties') ? 'text-[#FF385C]' : 'text-slate-400'} />
          Properties
        </Link>
        <Link 
          href="/admin/users" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin/users')
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaUsers className={isActive('/admin/users') ? 'text-[#FF385C]' : 'text-slate-400'} />
          Users
        </Link>
        <Link 
          href="/admin/experiences" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin/experiences')
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaStar className={isActive('/admin/experiences') ? 'text-[#FF385C]' : 'text-slate-400'} />
          Experiences
        </Link>
        <Link 
          href="/admin/services" 
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive('/admin/services')
              ? 'bg-slate-800 text-white font-medium'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <FaConciergeBell className={isActive('/admin/services') ? 'text-[#FF385C]' : 'text-slate-400'} />
          Services
        </Link>
        <Link 
          href="/" 
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
        >
          <FaExternalLinkAlt className="text-slate-400" />
          View Site
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{userEmail?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userEmail}</p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
        >
          <FaSignOutAlt className="text-slate-400" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
