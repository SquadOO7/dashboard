"use client"

import { useState } from "react"
import { MapComponent } from "@/components/map-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Bell, MapPin, Trash2, Edit, Navigation, Plus, AlertTriangle, Clock } from "lucide-react"
import { useLocation } from "@/components/location-provider"
import { cn } from "@/lib/utils"

// Dummy alert subscriptions data
const dummySubscriptions = [
  {
    id: "1",
    location: "MG Road, Bengaluru",
    eventTypes: ["Traffic", "Emergency"],
    frequency: "Immediate",
    status: "Active",
    radius: 2,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    location: "Whitefield, Bengaluru",
    eventTypes: ["Construction", "Road Closure"],
    frequency: "Daily Digest",
    status: "Active",
    radius: 5,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    location: "Electronic City",
    eventTypes: ["Weather", "Traffic"],
    frequency: "Weekly Summary",
    status: "Paused",
    radius: 3,
    createdAt: new Date("2024-01-05"),
  },
]

const eventTypeOptions = [
  "Traffic",
  "Emergency",
  "Construction",
  "Weather",
  "Road Closure",
  "Public Safety",
  "Infrastructure",
  "Administrative",
]

const frequencyOptions = [
  { value: "immediate", label: "Immediate" },
  { value: "hourly", label: "Hourly Digest" },
  { value: "daily", label: "Daily Digest" },
  { value: "weekly", label: "Weekly Summary" },
]

export default function ManageAlerts() {
  const [newAlertLocation, setNewAlertLocation] = useState("")
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [frequency, setFrequency] = useState("")
  const [radius, setRadius] = useState(2)
  const [description, setDescription] = useState("")
  const [subscriptions, setSubscriptions] = useState(dummySubscriptions)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { location, hasPermission } = useLocation()

  const handleCreateSubscription = () => {
    if (!newAlertLocation || selectedEventTypes.length === 0 || !frequency) {
      return
    }

    const newSubscription = {
      id: Date.now().toString(),
      location: newAlertLocation,
      eventTypes: selectedEventTypes,
      frequency,
      status: "Active",
      radius,
      createdAt: new Date(),
    }

    setSubscriptions([...subscriptions, newSubscription])

    // Reset form
    setNewAlertLocation("")
    setSelectedEventTypes([])
    setFrequency("")
    setRadius(2)
    setDescription("")
  }

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: sub.status === "Active" ? "Paused" : "Active" } : sub,
      ),
    )
  }

  const handleUseCurrentLocation = () => {
    if (location) {
      setNewAlertLocation(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
  }

  const getFrequencyBadgeColor = (freq: string) => {
    switch (freq) {
      case "Immediate":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "Hourly Digest":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "Daily Digest":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "Weekly Summary":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-none p-6 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Alerts</h1>
            <p className="text-muted-foreground">Set up location-based notifications for incidents in Bangalore</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Bell className="h-3 w-3" />
              <span>{subscriptions.filter((s) => s.status === "Active").length} Active</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{subscriptions.length} Total</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Create Alert Form */}
        <div className="w-96 p-6 border-r bg-muted/30 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Alert</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="alert-location">Location</Label>
                  {location && (
                    <Button
                      onClick={handleUseCurrentLocation}
                      size="sm"
                      variant="outline"
                      className="text-xs bg-transparent"
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Use Current
                    </Button>
                  )}
                </div>
                <Input
                  id="alert-location"
                  placeholder="Enter location or area..."
                  value={newAlertLocation}
                  onChange={(e) => setNewAlertLocation(e.target.value)}
                />
              </div>

              <div>
                <Label>Alert Radius (km)</Label>
                <Select value={radius.toString()} onValueChange={(value) => setRadius(Number.parseInt(value))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 km</SelectItem>
                    <SelectItem value="2">2 km</SelectItem>
                    <SelectItem value="5">5 km</SelectItem>
                    <SelectItem value="10">10 km</SelectItem>
                    <SelectItem value="20">20 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Event Types</Label>
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {eventTypeOptions.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch
                        id={type}
                        checked={selectedEventTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEventTypes([...selectedEventTypes, type])
                          } else {
                            setSelectedEventTypes(selectedEventTypes.filter((t) => t !== type))
                          }
                        }}
                      />
                      <Label htmlFor={type} className="text-sm">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notification Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.label}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this alert..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCreateSubscription}
                className="w-full"
                disabled={!newAlertLocation || selectedEventTypes.length === 0 || !frequency}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </CardContent>
          </Card>

          {/* Location Status */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Location Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={cn("w-2 h-2 rounded-full", hasPermission ? "bg-green-500" : "bg-yellow-500")} />
                <span className="text-sm text-muted-foreground">
                  {hasPermission ? "Location access enabled" : "Location access disabled"}
                </span>
              </div>
              {location && (
                <p className="text-xs text-muted-foreground mt-2">
                  Current: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="flex-1 p-6">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Alert Coverage Map</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
              <div className="h-full">
                <MapComponent incidents={[]} height="100%" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Subscriptions */}
        <div className="w-96 p-6 border-l bg-muted/30 overflow-y-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Alerts</span>
                <Badge variant="secondary">{subscriptions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {subscriptions.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No alerts configured</p>
                    <p className="text-xs mt-1">Create your first alert to get started</p>
                  </div>
                ) : (
                  subscriptions.map((subscription) => (
                    <div key={subscription.id} className="p-4 border-b hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{subscription.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className={cn("text-xs", getStatusColor(subscription.status))}>
                            {subscription.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setEditingId(subscription.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteSubscription(subscription.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {subscription.eventTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{subscription.frequency}</span>
                        </div>
                        <span>{subscription.radius}km radius</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created {subscription.createdAt.toLocaleDateString()}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs bg-transparent"
                          onClick={() => handleToggleStatus(subscription.id)}
                        >
                          {subscription.status === "Active" ? "Pause" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
