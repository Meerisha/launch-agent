"use client"

import { useSession, signIn, signOut } from 'next-auth/react'
import { User, LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          href="/dashboard"
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          Dashboard
        </Link>
        <div className="flex items-center space-x-2">
          {session.user.image ? (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900">{session.user.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signin"
        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
      >
        Get Started
      </Link>
    </div>
  )
} 