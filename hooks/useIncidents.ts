"use client"

import { useState, useEffect } from "react"

export interface Incident {
  id: string
  lat: number
  lng: number
  type: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: Date
  location: string
  status: "active" | "resolved"
}

// Dummy incidents data
const dummyIncidents: Incident[] = [
  {
    id: "1",
    lat: 12.9716,
    lng: 77.5946,
    type: "Traffic Accident",
    description: "Multi-vehicle collision on MG Road",
    severity: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    location: "MG Road, Bengaluru",
    status: "active",
  },
  {
    id: "2",
    lat: 12.9698,
    lng: 77.5986,
    type: "Road Closure",
    description: "Construction work blocking lane",
    severity: "medium",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    location: "Brigade Road, Bengaluru",
    status: "active",
  },
  {
    id: "3",
    lat: 12.975,
    lng: 77.59,
    type: "Water Logging",
    description: "Heavy rainfall causing waterlogging",
    severity: "low",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    location: "Cubbon Park Area",
    status: "active",
  },
  {
    id: "4",
    lat: 12.965,
    lng: 77.6,
    type: "Emergency",
    description: "Medical emergency reported",
    severity: "high",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    location: "Koramangala",
    status: "active",
  },
  {
    id: "5",
    lat: 12.98,
    lng: 77.59,
    type: "Traffic",
    description: "Signal malfunction causing delays",
    severity: "medium",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    location: "Indiranagar",
    status: "active",
  },
]

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIncidents(dummyIncidents)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const addIncident = async (incident: Omit<Incident, "id" | "timestamp" | "status">) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "active",
    }

    setIncidents((prev) => [newIncident, ...prev])
    return { id: newIncident.id, error: null }
  }

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    setIncidents((prev) => prev.map((incident) => (incident.id === id ? { ...incident, ...updates } : incident)))
    return { error: null }
  }

  const deleteIncident = async (id: string) => {
    setIncidents((prev) => prev.filter((incident) => incident.id !== id))
    return { error: null }
  }

  const resolveIncident = async (id: string) => {
    return updateIncident(id, { status: "resolved" })
  }

  return {
    incidents,
    loading,
    addIncident,
    updateIncident,
    deleteIncident,
    resolveIncident,
  }
}
