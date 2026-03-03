import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // If the user is authenticated but not an admin, redirect them
    // For this simple app, we just check if they are logged in since there's only one admin.
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/admin/login",
    }
  }
)

export const config = {
  matcher: [
    "/admin/((?!login).*)",
    "/api/admin/:path*"
  ],
}
