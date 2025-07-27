"use client"

import { MapComponent } from "@/components/map-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, MapPin, RefreshCw, Database, Wifi, WifiOff, BarChart3, Activity } from "lucide-react"
import { useLocation } from "@/components/location-provider"
import { useFirebaseIncidents } from "@/hooks/useFirebaseIncidents"

export default function Analytics() {
  const { location, hasPermission } = useLocation()
  const { incidents, analytics, loading, error, usingFallback, refreshData } = useFirebaseIncidents()

  // Transform incidents for the heatmap
  const heatmapIncidents = incidents.map((incident) => ({
    id: incident.id,
    lat: incident.lat,
    lng: incident.lng,
    type: incident.type,
    description: incident.description,
    severity: incident.severity,
  }))

  // Calculate additional analytics
  const categoryStats = incidents.reduce(
    (acc, incident) => {
      const category = incident.category || incident.type
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const severityStats = incidents.reduce(
    (acc, incident) => {
      acc[incident.severity] = (acc[incident.severity] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgConfidence =
    incidents.length > 0
      ? incidents.reduce((sum, incident) => sum + (incident.confidence || 0), 0) / incidents.length
      : 0

  const highImpactEvents = incidents.filter((incident) => (incident.impact || 0) >= 3).length

  const getConnectionStatusIcon = () => {
    if (usingFallback) return <Database className="h-5 w-5 text-yellow-500" />
    if (error) return <WifiOff className="h-5 w-5 text-red-500" />
    return <Wifi className="h-5 w-5 text-green-500" />
  }

  const getConnectionStatusText = () => {
    if (usingFallback) return "Demo Mode Active"
    if (error) return "Firebase Connection Issue"
    return "Firebase Connected"
  }

  const getConnectionStatusDescription = () => {
    if (usingFallback) return "Showing sample data. Firebase events-citypulse node available."
    if (error) return error
    return "Real-time data from Firebase events-citypulse database"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900 text-red-300 border-red-700"
      case "medium":
        return "bg-yellow-900 text-yellow-300 border-yellow-700"
      case "low":
        return "bg-green-900 text-green-300 border-green-700"
      default:
        return "bg-gray-600 text-gray-300 border-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading analytics from Firebase...</div>
          <div className="text-gray-400 text-sm mt-2">Analyzing events-citypulse data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-950">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">City Pulse Analytics</h1>
            <p className="text-gray-400">Real-time insights from city events and incidents</p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="7days">
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="24hours">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Firebase Connection Status */}
        {(error || usingFallback) && (
          <div className="mb-6 p-4 bg-yellow-900 bg-opacity-20 border border-yellow-700 rounded-lg">
            <div className="flex items-center gap-3">
              {getConnectionStatusIcon()}
              <div>
                <p className="text-yellow-200 font-medium">{getConnectionStatusText()}</p>
                <p className="text-yellow-300 text-sm">{getConnectionStatusDescription()}</p>
              </div>
              {error && (
                <Button onClick={refreshData} variant="outline" size="sm" className="ml-auto bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Location Status Banner */}
        {!hasPermission && (
          <div className="mb-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-blue-200 font-medium">Location Access Disabled</p>
                <p className="text-blue-300 text-sm">
                  Enable location access to see personalized analytics for your area
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Events</p>
                  <p className="text-3xl font-bold text-white">{incidents.length.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">From events-citypulse</p>
                </div>
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">High Impact</p>
                  <p className="text-3xl font-bold text-white">{highImpactEvents.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Impact level ≥ 3</p>
                </div>
                <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Confidence</p>
                  <p className="text-3xl font-bold text-white">{Math.round(avgConfidence * 100)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Data reliability</p>
                </div>
                <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Categories</p>
                  <p className="text-3xl font-bold text-white">{Object.keys(categoryStats).length}</p>
                  <p className="text-xs text-gray-500 mt-1">Event types</p>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Event Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([category, count], index) => (
                    <div
                      key={category}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        <div>
                          <p className="text-white font-medium">{category}</p>
                          <p className="text-gray-400 text-sm">{count} events</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / Math.max(...Object.values(categoryStats))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Severity Distribution */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Severity Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(severityStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([severity, count]) => (
                    <div
                      key={severity}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getSeverityColor(severity)}>
                          {severity.toUpperCase()}
                        </Badge>
                        <div>
                          <p className="text-white font-medium">{severity} Priority</p>
                          <p className="text-gray-400 text-sm">{count} events</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              severity === "high"
                                ? "bg-red-500"
                                : severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ width: `${(count / Math.max(...Object.values(severityStats))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.slice(0, 5).map((incident) => (
                  <div
                    key={incident.id}
                    className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 transition-all duration-200 hover:bg-gray-750"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{incident.headline || incident.description}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {incident.category} • {incident.location}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {incident.timeAgo}
                        </span>
                        {incident.confidence && <span>Confidence: {Math.round(incident.confidence * 100)}%</span>}
                        {incident.impact && <span>Impact: {incident.impact}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Map */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Event Heatmap ({heatmapIncidents.length} events)</CardTitle>
            {!hasPermission && (
              <p className="text-gray-400 text-sm">
                Showing citywide data. Enable location access for personalized insights.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapComponent height="400px" incidents={heatmapIncidents} />
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Interactive map showing event density across the city - {getConnectionStatusDescription()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
