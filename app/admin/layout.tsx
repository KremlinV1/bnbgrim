import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import AdminSidebar from "./AdminSidebar"
import MobileHeader from "./MobileHeader"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar userEmail={session.user?.email} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header for Mobile */}
        <MobileHeader />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
