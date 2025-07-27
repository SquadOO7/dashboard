"use client";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

interface Incident {
  id: string;
  lat: number;
  lng: number;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  headline?: string;
  category?: string;
  confidence?: number;
  impact?: number;
  timeAgo?: string;
  location?: string;
  timestamp?: Date;
  status?: string;
}

interface MapComponentProps {
  height?: string;
  incidents: Array<{
    id: string;
    lat: number;
    lng: number;
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
    headline?: string;
    category?: string;
    confidence?: number;
    impact?: number;
    timeAgo?: string;
    location?: string;
    timestamp?: Date;
    status?: string;
  }>;
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Dynamically import the LeafletMap component to avoid SSR issues
const LeafletMap = dynamic(
  () => import("./leaflet-map").then((mod) => ({ default: mod.LeafletMap })),
  {
    ssr: false,
    loading: () => (
      <div className='w-full h-full flex items-center justify-center bg-gray-800 rounded-lg min-h-[800px]'>
        {" "}
        {/* Doubled height here */}
        <div className='text-center'>
          <Skeleton className='h-8 w-8 rounded-full mx-auto mb-2 bg-gray-700' />
          <p className='text-sm text-gray-400'>Loading map...</p>
        </div>
      </div>
    ),
  }
);

export function MapComponent({
  height = "100%",
  incidents,
  onLocationSelect,
}: MapComponentProps) {
  console.log("MapComponent rendering with", incidents.length, "incidents");

  return (
    // Doubled height here as well
    <div className='w-full h-full min-h-[800px]'>
      <LeafletMap
        incidents={incidents}
        height={height}
        onLocationSelect={onLocationSelect}
      />
    </div>
  );
}
