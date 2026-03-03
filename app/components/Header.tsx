'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { FaUserCircle, FaBars, FaGlobe } from 'react-icons/fa'
import { SiAirbnb } from 'react-icons/si'

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <header className="bg-white pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-[90px]">
          {/* Logo - Left aligned */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-[#FF385C]">
              <SiAirbnb className="text-3xl" />
              <span className="font-bold text-xl hidden md:block tracking-tight">WhereTo</span>
            </Link>
          </div>

          {/* Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            <Link 
              href="/" 
              className={`transition font-medium ${pathname === '/' ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Homes
            </Link>
            <Link 
              href="/experiences" 
              className={`transition font-medium ${pathname === '/experiences' ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Experiences
            </Link>
            <Link 
              href="/services" 
              className={`transition font-medium ${pathname === '/services' ? 'font-semibold text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Services
            </Link>
          </div>

          {/* Right side menus - Right aligned */}
          <div className="flex items-center justify-end gap-2">
            <Link href="/admin/login" className="hidden sm:block text-sm font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition">
              Become a host
            </Link>
            
            <button className="p-3 hover:bg-gray-100 rounded-full transition text-gray-700">
              <FaGlobe />
            </button>

            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 border border-gray-300 rounded-full py-1.5 px-2 hover:shadow-md transition cursor-pointer bg-white ml-1"
              >
                <FaBars className="text-gray-500 text-sm ml-1.5" />
                <FaUserCircle className="text-gray-500 text-[30px]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {session ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session.user?.email}</p>
                      </div>
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="block px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link 
                        href="/signup" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link 
                          href="/admin/login" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Host your home
                        </Link>
                        <Link 
                          href="/" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setMenuOpen(false)}
                        >
                          Help Center
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
