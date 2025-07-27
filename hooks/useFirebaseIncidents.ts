"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, set, update, remove } from "firebase/database"

export interface FirebaseIncident {
  id: string
  lat: number
  lng: number
  type: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: Date
  location: string
  status: "active" | "resolved"
  timeAgo?: string
  category?: string
  headline?: string
  context?: string
  confidence?: number
  impact?: number
}

export interface AnalyticsData {
  totalIncidents: number
  activeIncidents: number
  resolvedIncidents: number
  trendingIncidents: Array<{
    type: string
    count: number
    trend: "up" | "down"
    change: string
  }>
  recentActivity: Array<{
    time: string
    event: string
    severity: "low" | "medium" | "high"
  }>
}

// Fallback demo data when Firebase is not available
const fallbackIncidents: FirebaseIncident[] = [
  {
    id: "demo-1",
    lat: 12.9716,
    lng: 77.5946,
    type: "Traffic Accident",
    description: "Multi-vehicle collision on MG Road causing traffic delays (Demo Data)",
    severity: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    location: "MG Road, Bengaluru",
    status: "active",
    timeAgo: "2 mins ago",
    category: "Traffic & Transportation",
    headline: "Major Traffic Accident on MG Road",
    context: "Multi-vehicle collision causing significant delays",
    confidence: 0.9,
    impact: 3,
  },
  {
    id: "demo-2",
    lat: 12.9698,
    lng: 77.5986,
    type: "Road Closure",
    description: "Construction work blocking two lanes on Brigade Road (Demo Data)",
    severity: "medium",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    location: "Brigade Road, Bengaluru",
    status: "active",
    timeAgo: "15 mins ago",
    category: "Administrative Announcements",
    headline: "Road Construction on Brigade Road",
    context: "Lane closures due to ongoing construction work",
    confidence: 0.85,
    impact: 2,
  },
  {
    id: "demo-3",
    lat: 12.975,
    lng: 77.59,
    type: "Water Logging",
    description: "Heavy rainfall causing waterlogging in low-lying areas (Demo Data)",
    severity: "low",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    location: "Cubbon Park Area, Bengaluru",
    status: "active",
    timeAgo: "1 hour ago",
    category: "Weather & Environment",
    headline: "Waterlogging in Cubbon Park Area",
    context: "Heavy rainfall causing temporary waterlogging",
    confidence: 0.8,
    impact: 1,
  },
  {
    id: "demo-4",
    lat: 12.9352,
    lng: 77.6245,
    type: "Public Event",
    description: "Cultural festival causing temporary road closures in Koramangala (Demo Data)",
    severity: "low",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    location: "Koramangala, Bengaluru",
    status: "active",
    timeAgo: "3 hours ago",
    category: "Events & Gatherings",
    headline: "Cultural Festival in Koramangala",
    context: "Festival activities causing minor traffic diversions",
    confidence: 0.92,
    impact: 1,
  },
  {
    id: "demo-5",
    lat: 12.9279,
    lng: 77.6271,
    type: "Emergency Response",
    description: "Fire department responding to emergency call in HSR Layout (Demo Data)",
    severity: "high",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    location: "HSR Layout, Bengaluru",
    status: "active",
    timeAgo: "45 mins ago",
    category: "Public Safety",
    headline: "Emergency Response in HSR Layout",
    context: "Fire department and emergency services on scene",
    confidence: 0.95,
    impact: 3,
  },
]

const fallbackAnalytics: AnalyticsData = {
  totalIncidents: 156,
  activeIncidents: 89,
  resolvedIncidents: 67,
  trendingIncidents: [
    { type: "Traffic & Transportation", count: 34, trend: "up", change: "+12%" },
    { type: "Administrative Announcements", count: 26, trend: "down", change: "-8%" },
    { type: "Weather & Environment", count: 19, trend: "up", change: "+15%" },
    { type: "Public Safety", count: 12, trend: "down", change: "-5%" },
    { type: "Infrastructure", count: 8, trend: "up", change: "+3%" },
  ],
  recentActivity: [
    { time: "2 mins ago", event: "Traffic accident reported on MG Road (Demo)", severity: "high" },
    { time: "15 mins ago", event: "Road closure on Brigade Road updated (Demo)", severity: "medium" },
    { time: "1 hour ago", event: "Water logging reported in Cubbon Park area (Demo)", severity: "low" },
    { time: "3 hours ago", event: "Emergency response completed in Koramangala (Demo)", severity: "high" },
    { time: "6 hours ago", event: "Construction work started in HSR Layout (Demo)", severity: "medium" },
  ],
}

// Helper function to parse geolocation string
function parseGeolocation(geolocation: string): { lat: number; lng: number } {
  try {
    const [lat, lng] = geolocation.split(",").map((coord) => Number.parseFloat(coord.trim()))
    if (isNaN(lat) || isNaN(lng)) {
      return { lat: 12.9716, lng: 77.5946 } // Default to Bengaluru
    }
    return { lat, lng }
  } catch (error) {
    console.error("Error parsing geolocation:", error)
    return { lat: 12.9716, lng: 77.5946 } // Default to Bengaluru
  }
}

// Helper function to determine severity based on impact and category
function determineSeverity(impact: number, category: string): "low" | "medium" | "high" {
  if (impact >= 3) return "high"
  if (impact >= 2) return "medium"
  if (category === "Traffic & Transportation" && impact >= 1) return "medium"
  return "low"
}

// Helper function to determine incident type from category
function determineType(category: string): string {
  const categoryMap: Record<string, string> = {
    "Traffic & Transportation": "Traffic",
    "Administrative Announcements": "Administrative",
    "Weather & Environment": "Weather",
    "Public Safety": "Emergency",
    Infrastructure: "Construction",
    "Health & Medical": "Medical",
    Education: "Educational",
    Technology: "Tech Issue",
  }
  return categoryMap[category] || category
}

// Helper function to generate location name from coordinates
function generateLocationName(lat: number, lng: number): string {
  // Simple location mapping for Bengaluru area
  const locations = [
    { name: "MG Road, Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Brigade Road, Bengaluru", lat: 12.9698, lng: 77.5986 },
    { name: "Cubbon Park, Bengaluru", lat: 12.975, lng: 77.59 },
    { name: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245 },
    { name: "HSR Layout, Bengaluru", lat: 12.9279, lng: 77.6271 },
    { name: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.7499 },
    { name: "Electronic City, Bengaluru", lat: 12.8456, lng: 77.6603 },
    { name: "Indiranagar, Bengaluru", lat: 12.9719, lng: 77.6412 },
  ]

  // Find closest location
  let closestLocation = locations[0]
  let minDistance = Math.abs(lat - closestLocation.lat) + Math.abs(lng - closestLocation.lng)

  for (const location of locations) {
    const distance = Math.abs(lat - location.lat) + Math.abs(lng - location.lng)
    if (distance < minDistance) {
      minDistance = distance
      closestLocation = location
    }
  }

  return closestLocation.name
}

export function useFirebaseIncidents() {
  const [incidents, setIncidents] = useState<FirebaseIncident[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    console.log("useFirebaseIncidents: Starting to load data...")

    // Check if database is available
    if (!database) {
      console.warn("Firebase database not available, using fallback data")
      setIncidents(fallbackIncidents)
      setAnalytics(fallbackAnalytics)
      setError("Firebase database not configured - using demo data")
      setUsingFallback(true)
      setLoading(false)
      return
    }

    let incidentsUnsubscribe: (() => void) | null = null

    try {
      // Listen to the events-citypulse node
      const eventsRef = ref(database, "events-citypulse")
      console.log("Setting up Firebase listener for events-citypulse...")

      incidentsUnsubscribe = onValue(
        eventsRef,
        (snapshot) => {
          try {
            const data = snapshot.val()
            console.log("Firebase events data received:", data ? Object.keys(data).length : 0, "events")

            if (data && Object.keys(data).length > 0) {
              const incidentsArray: FirebaseIncident[] = Object.keys(data).map((key) => {
                const event = data[key]
                const { lat, lng } = parseGeolocation(event.geolocation || "12.9716,77.5946")
                const severity = determineSeverity(event.impact || 1, event.category || "")
                const type = determineType(event.category || "Unknown")
                const location = generateLocationName(lat, lng)

                return {
                  id: key,
                  lat,
                  lng,
                  type,
                  description: event.context || event.headline || "No description available",
                  severity,
                  timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
                  location,
                  status: "active", // All events are considered active by default
                  timeAgo: calculateTimeAgo(event.timestamp),
                  category: event.category,
                  headline: event.headline,
                  context: event.context,
                  confidence: event.confidence,
                  impact: event.impact,
                }
              })

              // Sort by severity first (high -> medium -> low), then by timestamp (newest first)
              incidentsArray.sort((a, b) => {
                const severityOrder = { high: 3, medium: 2, low: 1 }
                const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
                if (severityDiff !== 0) return severityDiff
                return b.timestamp.getTime() - a.timestamp.getTime()
              })

              setIncidents(incidentsArray)
              setUsingFallback(false)

              // Generate analytics from the incidents
              const generatedAnalytics = generateAnalyticsFromIncidents(incidentsArray)
              setAnalytics(generatedAnalytics)

              console.log("Successfully loaded", incidentsArray.length, "incidents from Firebase")
            } else {
              // No data in Firebase, use fallback
              console.log("No events data found in Firebase, using demo data")
              setIncidents(fallbackIncidents)
              setAnalytics(fallbackAnalytics)
              setUsingFallback(true)
            }
            setError(null)
            setLoading(false)
          } catch (err) {
            console.error("Error processing events data:", err)
            setError("Failed to process events data - using demo data")
            setIncidents(fallbackIncidents)
            setAnalytics(fallbackAnalytics)
            setUsingFallback(true)
            setLoading(false)
          }
        },
        (error) => {
          console.error("Firebase events connection error:", error)
          setError(`Firebase connection failed: ${error.message} - using demo data`)
          setIncidents(fallbackIncidents)
          setAnalytics(fallbackAnalytics)
          setUsingFallback(true)
          setLoading(false)
        },
      )
    } catch (error: any) {
      console.error("Error setting up Firebase listeners:", error)
      setError(`Firebase setup error: ${error.message} - using demo data`)
      setIncidents(fallbackIncidents)
      setAnalytics(fallbackAnalytics)
      setUsingFallback(true)
      setLoading(false)
    }

    // Cleanup function
    return () => {
      if (incidentsUnsubscribe) {
        try {
          incidentsUnsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from events:", error)
        }
      }
    }
  }, [])

  const addIncident = async (incident: Omit<FirebaseIncident, "id" | "timestamp" | "status">) => {
    if (!database) {
      return { id: null, error: "Firebase database not available" }
    }

    try {
      const eventsRef = ref(database, "events-citypulse")
      const newEventRef = push(eventsRef)

      const newEvent = {
        category: incident.category || "Administrative Announcements",
        confidence: incident.confidence || 0.8,
        context: incident.description,
        geolocation: `${incident.lat},${incident.lng}`,
        headline: incident.headline || incident.description,
        impact: incident.impact || (incident.severity === "high" ? 3 : incident.severity === "medium" ? 2 : 1),
        timestamp: Date.now(),
      }

      await set(newEventRef, newEvent)
      console.log("Successfully added event:", newEventRef.key)
      return { id: newEventRef.key, error: null }
    } catch (error: any) {
      console.error("Error adding event:", error)
      return { id: null, error: `Failed to add event: ${error.message}` }
    }
  }

  const updateIncident = async (id: string, updates: Partial<FirebaseIncident>) => {
    if (!database) {
      return { error: "Firebase database not available" }
    }

    try {
      const eventRef = ref(database, `events-citypulse/${id}`)
      const eventUpdates: any = {}

      if (updates.description) eventUpdates.context = updates.description
      if (updates.headline) eventUpdates.headline = updates.headline
      if (updates.category) eventUpdates.category = updates.category
      if (updates.confidence) eventUpdates.confidence = updates.confidence
      if (updates.impact) eventUpdates.impact = updates.impact
      if (updates.lat && updates.lng) eventUpdates.geolocation = `${updates.lat},${updates.lng}`

      await update(eventRef, eventUpdates)
      console.log("Successfully updated event:", id)
      return { error: null }
    } catch (error: any) {
      console.error("Error updating event:", error)
      return { error: `Failed to update event: ${error.message}` }
    }
  }

  const deleteIncident = async (id: string) => {
    if (!database) {
      return { error: "Firebase database not available" }
    }

    try {
      const eventRef = ref(database, `events-citypulse/${id}`)
      await remove(eventRef)
      console.log("Successfully deleted event:", id)
      return { error: null }
    } catch (error: any) {
      console.error("Error deleting event:", error)
      return { error: `Failed to delete event: ${error.message}` }
    }
  }

  const refreshData = () => {
    setLoading(true)
    setError(null)
    // This will trigger the useEffect to re-run
    window.location.reload()
  }

  return {
    incidents,
    analytics,
    loading,
    error,
    usingFallback,
    addIncident,
    updateIncident,
    deleteIncident,
    refreshData,
  }
}

// Helper function to generate analytics from incidents
function generateAnalyticsFromIncidents(incidents: FirebaseIncident[]): AnalyticsData {
  const totalIncidents = incidents.length
  const activeIncidents = incidents.filter((i) => i.status === "active").length
  const resolvedIncidents = incidents.filter((i) => i.status === "resolved").length

  // Generate trending incidents by category
  const categoryCount: Record<string, number> = {}
  incidents.forEach((incident) => {
    const category = incident.category || incident.type
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  const trendingIncidents = Object.entries(categoryCount)
    .map(([type, count]) => ({
      type,
      count,
      trend: Math.random() > 0.5 ? "up" : ("down" as "up" | "down"),
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 20)}%`,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Generate recent activity from recent incidents
  const recentActivity = incidents.slice(0, 5).map((incident) => ({
    time: incident.timeAgo || "Unknown time",
    event: incident.headline || incident.description,
    severity: incident.severity,
  }))

  return {
    totalIncidents,
    activeIncidents,
    resolvedIncidents,
    trendingIncidents,
    recentActivity,
  }
}

// Helper function to calculate time ago
function calculateTimeAgo(timestamp: number): string {
  if (!timestamp) return "Unknown time"

  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  return `${days} day${days === 1 ? "" : "s"} ago`
}
