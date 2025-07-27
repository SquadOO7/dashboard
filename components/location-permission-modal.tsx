"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Shield, X } from "lucide-react"
import { useLocation } from "./location-provider"

interface LocationPermissionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationPermissionModal({ isOpen, onClose }: LocationPermissionModalProps) {
  const { requestLocation, useDefaultLocation, loading } = useLocation()
  const handleAllowLocation = () => {
    requestLocation()
    onClose()
  }

  const handleUseDefault = () => {
    useDefaultLocation()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Access
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Navigation className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Enable Location Services</h3>
            <p className="text-gray-400 text-sm mb-4">
              CityPulse would like to access your location to show nearby incidents and provide personalized alerts.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white text-sm font-medium mb-1">Your Privacy Matters</h4>
                <p className="text-gray-400 text-xs">
                  Your location data is only used to show relevant incidents and is never stored or shared with third
                  parties.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAllowLocation}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Getting Location...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  <span>Allow Location Access</span>
                </div>
              )}
            </Button>

            <Button
              onClick={handleUseDefault}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Use Bengaluru as Default
            </Button>
          </div>

          <p className="text-gray-500 text-xs text-center">You can change this preference later in Settings</p>
        </CardContent>
      </Card>
    </div>
  )
}
