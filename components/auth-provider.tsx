"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  user: { name: string; email: string; avatar: string } | null
  loading: boolean
  initialized: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Dummy user data
const DUMMY_USER = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulate checking for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      // Simulate checking localStorage or session
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const savedUser = localStorage.getItem("dummy_user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      setLoading(false)
      setInitialized(true)
    }

    checkExistingSession()
  }, [])

  const signInWithGoogle = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate OAuth flow with 5 second delay
      console.log("🔐 Starting OAuth simulation...")
      await new Promise((resolve) => setTimeout(resolve, 5000))

      // Simulate successful login
      setUser(DUMMY_USER)
      localStorage.setItem("dummy_user", JSON.stringify(DUMMY_USER))

      console.log("✅ OAuth simulation completed successfully")
    } catch (error: any) {
      setError("Failed to sign in. Please try again.")
      console.error("❌ OAuth simulation error:", error)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      // Simulate logout delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser(null)
      localStorage.removeItem("dummy_user")

      console.log("✅ Logout completed")
    } catch (error: any) {
      setError("Failed to sign out")
      console.error("❌ Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
        error,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
