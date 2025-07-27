"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface LocationContextType {
  location: { lat: number; lng: number } | null
  error: string | null
  loading: boolean
  hasPermission: boolean | null
  requestLocation: () => void
  useDefaultLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const useDefaultLocation = () => {
    // Set Bengaluru as default location
    setLocation({ lat: 12.9716, lng: 77.5946 })
    setError(null)
    setHasPermission(false)
    setLoading(false)
  }

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setHasPermission(false)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setHasPermission(true)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.log("Geolocation error:", error)
        let errorMessage = "Unable to retrieve your location."

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user."
            setHasPermission(false)
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            setHasPermission(false)
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            setHasPermission(false)
            break
        }

        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Don't automatically request location on mount
  // Let the dashboard component handle this
  useEffect(() => {
    // Check if we have a saved location preference
    const savedLocation = localStorage.getItem("citypulse_location")
    const savedPermission = localStorage.getItem("citypulse_location_permission")

    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation)
      setLocation(parsedLocation)
      setHasPermission(savedPermission === "true")
    }
  }, [])

  // Save location and permission to localStorage when they change
  useEffect(() => {
    if (location) {
      localStorage.setItem("citypulse_location", JSON.stringify(location))
    }
  }, [location])

  useEffect(() => {
    if (hasPermission !== null) {
      localStorage.setItem("citypulse_location_permission", hasPermission.toString())
    }
  }, [hasPermission])

  // Call useDefaultLocation unconditionally from the top-level component
  useEffect(() => {
    if (!location && !hasPermission) {
      useDefaultLocation()
    }
  }, [location, hasPermission])

  return (
    <LocationContext.Provider
      value={{
        location,
        error,
        loading,
        hasPermission,
        requestLocation,
        useDefaultLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return context
}
