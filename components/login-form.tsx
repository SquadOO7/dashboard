"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/components/auth-provider"
import { Chrome, Shield, MapPin, BarChart3, AlertTriangle } from "lucide-react"

export function LoginForm() {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const { signInWithGoogle, error } = useAuthContext()

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    await signInWithGoogle()
    setIsSigningIn(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shuttle-glow">
              <span className="text-black font-bold text-xl">CP</span>
            </div>
            <h1 className="text-3xl font-bold text-white">CityPulse</h1>
          </div>
          <p className="text-gray-400 text-lg">Real-time City Incident Monitoring</p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <MapPin className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Live Incident Map</p>
            <p className="text-gray-400 text-xs">Real-time updates</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Report Issues</p>
            <p className="text-gray-400 text-xs">Help your community</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <BarChart3 className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">City Analytics</p>
            <p className="text-gray-400 text-xs">Data insights</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
            <Shield className="h-8 w-8 text-white mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Smart Alerts</p>
            <p className="text-gray-400 text-xs">Stay informed</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-900 border-gray-800 shuttle-glow">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Welcome to CityPulse</CardTitle>
            <p className="text-center text-gray-400">Sign in to access real-time city incident monitoring</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 h-12 text-base font-medium"
            >
              {isSigningIn ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Chrome className="h-5 w-5" />
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>

            {/* OAuth Progress Indicator */}
            {isSigningIn && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
                <div className="text-blue-400 text-sm text-center mb-2">Authenticating with Google OAuth...</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                </div>
                <div className="text-blue-300 text-xs text-center mt-2">This may take a few seconds</div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
                <div className="text-red-400 text-sm text-center">{error}</div>
              </div>
            )}

            <div className="text-center text-xs text-gray-500 mt-4">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Shield className="h-4 w-4" />
            <span>Secure authentication powered by Google</span>
          </div>
        </div>
      </div>
    </div>
  )
}
