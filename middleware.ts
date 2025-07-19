import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        // Protect project API routes (user data)
        if (req.nextUrl.pathname.startsWith('/api/projects')) {
          return !!token
        }
        // Allow chat API for all users (no auth required)
        if (req.nextUrl.pathname.startsWith('/api/chat')) {
          return true
        }
        // Allow MCP API for all users (tools can be public)
        if (req.nextUrl.pathname.startsWith('/api/mcp')) {
          return true
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/projects/:path*'
    // Removed /api/chat and /api/mcp from matcher - they're now public
  ]
} 