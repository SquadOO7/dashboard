import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { LocationProvider } from "@/components/location-provider"
import { AuthGuard } from "@/components/auth-guard"
import { TopNavigation } from "@/components/top-navigation"
import { VoiceAgent } from "@/components/voice-agent";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CityPulse - Real-time City Incident Monitoring",
  description: "Monitor and report city incidents in real-time with Google Authentication",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' className='dark'>
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>
            <LocationProvider>
              <div className='min-h-screen w-full bg-zinc-900'>
                <TopNavigation />
                <main className='h-[calc(100vh-112px)] overflow-hidden'>
                  {children}
                </main>
                <VoiceAgent />
              </div>
            </LocationProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
