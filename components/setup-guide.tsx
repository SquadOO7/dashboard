"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { useState } from "react"

export function SetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text)
    setCopiedStep(step)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  const currentDomain = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

  return (
    <div className="min-h-screen bg-zinc-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Firebase Setup Required</h1>
          <p className="text-gray-400">Follow these steps to configure Google Authentication for CityPulse</p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Firebase Console */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                Create Firebase Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">Go to the Firebase Console and create a new project:</p>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                  onClick={() => window.open("https://console.firebase.google.com/", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Firebase Console
                </Button>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Steps:</p>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Click "Create a project"</li>
                  <li>Enter project name: "citypulse-webapp"</li>
                  <li>Enable Google Analytics (optional)</li>
                  <li>Click "Create project"</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Enable Authentication */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                Enable Google Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">In your Firebase project:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Go to "Authentication" in the left sidebar</li>
                  <li>Click "Get started"</li>
                  <li>Go to "Sign-in method" tab</li>
                  <li>Click on "Google" provider</li>
                  <li>Toggle "Enable"</li>
                  <li>Add your project support email</li>
                  <li>Click "Save"</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Configure Authorized Domains */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                Add Authorized Domains
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">In Firebase Authentication → Settings → Authorized domains:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm">localhost</code>
                    <span className="text-gray-400">(for development)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-800 px-2 py-1 rounded text-sm">your-domain.com</code>
                    <span className="text-gray-400">(for production)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Get Configuration */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                Get Firebase Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">In your Firebase project:</p>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Go to Project Settings (gear icon)</li>
                  <li>Scroll down to "Your apps"</li>
                  <li>Click "Add app" → Web app</li>
                  <li>Enter app nickname: "CityPulse Web"</li>
                  <li>Click "Register app"</li>
                  <li>Copy the configuration object</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Step 5: Environment Variables */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  5
                </div>
                Configure Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">
                  Create a <code className="bg-gray-800 px-1 rounded">.env.local</code> file in your project root:
                </p>
                <div className="bg-gray-800 p-4 rounded-lg relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() =>
                      copyToClipboard(
                        `NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id`,
                        5,
                      )
                    }
                  >
                    {copiedStep === 5 ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    {`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 6: OAuth Consent Screen */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                  6
                </div>
                Configure OAuth Consent Screen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300">
                <p className="mb-4">Go to Google Cloud Console for your Firebase project:</p>
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 mb-4 bg-transparent"
                  onClick={() => window.open("https://console.cloud.google.com/apis/credentials/consent", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open OAuth Consent Screen
                </Button>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Select "External" user type</li>
                  <li>
                    Fill in app information:
                    <ul className="ml-4 mt-1 space-y-1 list-disc list-inside text-xs">
                      <li>App name: "CityPulse"</li>
                      <li>User support email: your email</li>
                      <li>Developer contact: your email</li>
                    </ul>
                  </li>
                  <li>
                    Add authorized domains: <code className="bg-gray-800 px-1 rounded text-xs">localhost</code>
                  </li>
                  <li>Save and continue through all steps</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card className="bg-gray-900 border-yellow-800">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-300 space-y-3">
                <div>
                  <h4 className="font-medium text-white mb-1">Error 400: invalid_request</h4>
                  <p className="text-sm">OAuth consent screen not configured properly. Complete Step 6 above.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Popup blocked</h4>
                  <p className="text-sm">Allow popups for your domain in browser settings.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Unauthorized domain</h4>
                  <p className="text-sm">Add your domain to Firebase Authentication → Settings → Authorized domains.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Configuration errors</h4>
                  <p className="text-sm">Double-check all environment variables match your Firebase config exactly.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Button */}
          <Card className="bg-gray-900 border-green-800">
            <CardContent className="p-6 text-center">
              <p className="text-gray-300 mb-4">Once you've completed all steps above:</p>
              <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="h-4 w-4 mr-2" />
                Test Authentication
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
