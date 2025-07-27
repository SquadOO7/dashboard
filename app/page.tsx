"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapComponent } from "@/components/map-component";
import { TimeDisplay } from "@/components/time-display";
import { useFirebaseIncidents } from "@/hooks/useFirebaseIncidents";
import { AlertTriangle, MapPin, Clock, Search, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Bangalore city bounds (approximate)
const BANGALORE_BOUNDS = {
  north: 13.25, // Slightly expanded
  south: 12.8, // Slightly expanded
  east: 77.75, // Slightly expanded
  west: 77.4, // Slightly expanded
};

// Function to check if coordinates are within Bangalore
function isInBangalore(lat: number, lng: number): boolean {
  return (
    lat >= BANGALORE_BOUNDS.south &&
    lat <= BANGALORE_BOUNDS.north &&
    lng >= BANGALORE_BOUNDS.west &&
    lng <= BANGALORE_BOUNDS.east
  );
}

export default function Dashboard() {
  const { incidents, loading, error, connectionStatus } =
    useFirebaseIncidents();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("timestamp");

  // Filter incidents to only show those in Bangalore
  const bangaloreIncidents = useMemo(() => {
    return incidents.filter((incident) =>
      isInBangalore(incident.lat, incident.lng)
    );
  }, [incidents]);

  // Apply filters and search
  const filteredIncidents = useMemo(() => {
    let filtered = bangaloreIncidents;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (incident) =>
          incident.description.toLowerCase().includes(searchLower) ||
          incident.type.toLowerCase().includes(searchLower) ||
          incident.location?.toLowerCase().includes(searchLower) ||
          incident.headline?.toLowerCase().includes(searchLower)
      );
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(
        (incident) => incident.severity === severityFilter
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (incident) => incident.category === categoryFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          return (
            new Date(b.timestamp || 0).getTime() -
            new Date(a.timestamp || 0).getTime()
          );
        case "severity":
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        case "confidence":
          return (b.confidence || 0) - (a.confidence || 0);
        case "impact":
          return (b.impact || 0) - (a.impact || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bangaloreIncidents, searchTerm, severityFilter, categoryFilter, sortBy]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(
      bangaloreIncidents.map((incident) => incident.category).filter(Boolean)
    );
    return Array.from(cats);
  }, [bangaloreIncidents]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = bangaloreIncidents.length;
    const high = bangaloreIncidents.filter((i) => i.severity === "high").length;
    const medium = bangaloreIncidents.filter(
      (i) => i.severity === "medium"
    ).length;
    const low = bangaloreIncidents.filter((i) => i.severity === "low").length;
    const recent = bangaloreIncidents.filter((i) => {
      const timestamp = new Date(i.timestamp || 0);
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return timestamp > hourAgo;
    }).length;

    return { total, high, medium, low, recent };
  }, [bangaloreIncidents]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-muted-foreground'>
            Loading Bangalore incidents...
          </p>
        </div>
      </div>
    );
  }

  return (
    // **** KEY CHANGE HERE: Changed h-screen to h-full ****
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='flex-none p-6 border-b bg-background'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h1 className='text-3xl font-bold'>Bangalore Dashboard</h1>
            <p className='text-muted-foreground'>
              Real-time incident monitoring for Bangalore city
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <div
              className={cn(
                "flex items-center space-x-2 px-3 py-1 rounded-full text-sm",
                connectionStatus === "connected"
                  ? "bg-green-500/10 text-green-500"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
              )}>
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                )}
              />
              <span className='capitalize'>{connectionStatus}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-6'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <Activity className='h-4 w-4 text-blue-500' />
                <div>
                  <p className='text-2xl font-bold'>{stats.total}</p>
                  <p className='text-xs text-muted-foreground'>
                    Total Incidents
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='h-4 w-4 text-red-500' />
                <div>
                  <p className='text-2xl font-bold'>{stats.high}</p>
                  <p className='text-xs text-muted-foreground'>High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='h-4 w-4 text-yellow-500' />
                <div>
                  <p className='text-2xl font-bold'>{stats.medium}</p>
                  <p className='text-xs text-muted-foreground'>
                    Medium Priority
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <AlertTriangle className='h-4 w-4 text-green-500' />
                <div>
                  <p className='text-2xl font-bold'>{stats.low}</p>
                  <p className='text-xs text-muted-foreground'>Low Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center space-x-2'>
                <Clock className='h-4 w-4 text-purple-500' />
                <div>
                  <p className='text-2xl font-bold'>{stats.recent}</p>
                  <p className='text-xs text-muted-foreground'>Last Hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-4'>
          <div className='flex-1 min-w-[200px]'>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search incidents...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Severity' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Severity</SelectItem>
              <SelectItem value='high'>High</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='low'>Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='timestamp'>Latest</SelectItem>
              <SelectItem value='severity'>Severity</SelectItem>
              <SelectItem value='confidence'>Confidence</SelectItem>
              <SelectItem value='impact'>Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content Area (Map and Sidebar) */}
      <div className='flex-1 flex min-h-0'>
        {" "}
        {/* flex-1 takes remaining vertical space */}
        {/* Map Section */}
        <div className='flex-1 p-6'>
          {" "}
          {/* flex-1 takes remaining horizontal space */}
          <Card className='h-full flex flex-col'>
            {" "}
            {/* h-full ensures card fills vertical space */}
            <CardHeader className='flex-shrink-0 pb-4'>
              <CardTitle className='flex items-center space-x-2'>
                <MapPin className='h-5 w-5' />
                <span>Bangalore Incident Map</span>
              </CardTitle>
              <CardDescription>
                Showing {filteredIncidents.length} incidents in Bangalore
              </CardDescription>
            </CardHeader>
            {/* flex-1 allows CardContent to take remaining space, min-h-0 prevents overflow */}
            <CardContent className='flex-1 p-0 min-h-0'>
              {/* h-full here makes the inner div fill CardContent */}
              <div className='h-full p-6 pt-0'>
                <MapComponent incidents={filteredIncidents} height='100%' />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Sidebar */}
        <div className='w-96 p-6 border-l bg-muted/30'>
          <Card className='h-full flex flex-col'>
            <CardHeader className='flex-shrink-0'>
              <CardTitle className='flex items-center justify-between'>
                <span>Recent Events</span>
                <Badge variant='secondary'>{filteredIncidents.length}</Badge>
              </CardTitle>
              <CardDescription>Latest incidents in Bangalore</CardDescription>
            </CardHeader>
            <CardContent className='flex-1 p-0 min-h-0'>
              <div className='h-full overflow-y-auto'>
                {filteredIncidents.length === 0 ? (
                  <div className='p-6 text-center text-muted-foreground'>
                    <AlertTriangle className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p>No incidents match your filters</p>
                  </div>
                ) : (
                  <div className='space-y-1'>
                    {filteredIncidents.map((incident) => (
                      <div
                        key={incident.id}
                        className='p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer'>
                        <div className='flex items-start justify-between mb-2'>
                          <h4 className='font-medium text-sm line-clamp-2'>
                            {incident.headline || incident.type}
                          </h4>
                          <Badge
                            variant='outline'
                            className={cn(
                              "ml-2 text-xs",
                              getSeverityColor(incident.severity)
                            )}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <p className='text-xs text-muted-foreground mb-2 line-clamp-2'>
                          {incident.description}
                        </p>
                        <div className='flex items-center justify-between text-xs text-muted-foreground'>
                          <div className='flex items-center space-x-1'>
                            <MapPin className='h-3 w-3' />
                            <span className='truncate'>
                              {incident.location || "Unknown location"}
                            </span>
                          </div>
                          <TimeDisplay
                            timestamp={incident.timestamp}
                            format='relative'
                          />
                        </div>
                        {(incident.confidence || incident.impact) && (
                          <div className='flex items-center justify-between mt-2 text-xs'>
                            {incident.confidence && (
                              <span className='text-muted-foreground'>
                                Confidence:{" "}
                                {Math.round(incident.confidence * 100)}%
                              </span>
                            )}
                            {incident.impact && (
                              <span className='text-muted-foreground'>
                                Impact: {incident.impact}/3
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
