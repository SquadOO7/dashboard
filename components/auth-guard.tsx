"use client"

import type React from "react"
import { useAuthContext } from "@/components/auth-provider"
import { LoginForm } from "@/components/login-form"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, initialized } = useAuthContext()

  // Show loading spinner while checking authentication
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Initializing CityPulse...</div>
          <div className="text-gray-400 text-sm mt-2">Setting up your session...</div>
        </div>
      </div>
    )
  }

  // Show login form if user is not authenticated (without TopNavigation)
  if (!user) {
    return (
      <div className="min-h-screen w-full bg-zinc-900">
        <LoginForm />
      </div>
    )
  }

  // User is authenticated, show the protected content (TopNavigation will be shown by layout)
  return <>{children}</>
}
