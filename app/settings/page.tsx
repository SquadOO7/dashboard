"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { User, Bell, MapPin, Shield, Palette } from "lucide-react"

export default function Settings() {
  return (
    <div className="p-6 h-full w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 shuttle-glow">Settings</h1>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-gray-900 border-gray-800 shuttle-glow">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    defaultValue="John"
                    className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="last-name" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    defaultValue="Doe"
                    className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
                />
              </div>
              <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Push Notifications</Label>
                  <p className="text-gray-400 text-sm">Receive push notifications for incidents</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-white" />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Alerts</Label>
                  <p className="text-gray-400 text-sm">Receive email notifications for subscribed areas</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-white" />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">SMS Alerts</Label>
                  <p className="text-gray-400 text-sm">Receive SMS for high-priority incidents</p>
                </div>
                <Switch className="data-[state=checked]:bg-white" />
              </div>
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Location Access</Label>
                  <p className="text-gray-400 text-sm">Allow CityPulse to access your location</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-white" />
              </div>
              <div>
                <Label className="text-white">Default Location</Label>
                <Input
                  placeholder="Enter your default location"
                  defaultValue="Bengaluru, Karnataka"
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200"
                />
              </div>
              <div>
                <Label className="text-white">Search Radius</Label>
                <Select defaultValue="5km">
                  <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="1km">1 km</SelectItem>
                    <SelectItem value="5km">5 km</SelectItem>
                    <SelectItem value="10km">10 km</SelectItem>
                    <SelectItem value="25km">25 km</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gray-900 border-gray-800 shuttle-glow">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Anonymous Reporting</Label>
                  <p className="text-gray-400 text-sm">Submit reports without revealing your identity</p>
                </div>
                <Switch className="data-[state=checked]:bg-white" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Data Sharing</Label>
                  <p className="text-gray-400 text-sm">Share anonymized data for city planning</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-white" />
              </div>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent transition-all duration-200"
              >
                Change Password
              </Button>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white focus:border-white transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="kn">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
