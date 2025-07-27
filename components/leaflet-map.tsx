"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

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

interface LeafletMapProps {
  incidents: Incident[];
  height: string; // This will be "100%" from MapComponent
  onLocationSelect?: (lat: number, lng: number) => void;
}

export function LeafletMap({
  incidents,
  height,
  onLocationSelect,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const locationMarkerRef = useRef<any>(null);
  const [L, setL] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load Leaflet CSS first
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          link.integrity =
            "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
          link.crossOrigin = "";
          document.head.appendChild(link);
        }

        // Wait a bit for CSS to load
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Dynamically import Leaflet
        const leaflet = await import("leaflet");
        const L = leaflet.default;

        // Fix default markers issue with webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });

        setL(L);
        setIsLoading(false);
        console.log("Leaflet loaded successfully");
      } catch (err) {
        console.error("Error loading Leaflet:", err);
        setError("Failed to load map library");
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (!L || !mapRef.current || mapInstanceRef.current) return;

    try {
      console.log("Initializing map...");

      // Create map instance
      const map = L.map(mapRef.current, {
        center: [12.9716, 77.5946], // Bengaluru coordinates
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
      });

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Handle map clicks for location selection
      if (onLocationSelect) {
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          console.log("Map clicked at:", lat, lng);
          onLocationSelect(lat, lng);

          // Remove previous location marker
          if (locationMarkerRef.current) {
            map.removeLayer(locationMarkerRef.current);
          }

          // Create location selection marker
          const locationIcon = L.divIcon({
            html: `
              <div style="
                background-color: #3b82f6;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse 2s infinite;
              ">
                <div style="
                  background-color: white;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                "></div>
              </div>
              <style>
                @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.2); opacity: 0.7; }
                  100% { transform: scale(1); opacity: 1; }
                }
              </style>
            `,
            className: "custom-location-marker",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          locationMarkerRef.current = L.marker([lat, lng], {
            icon: locationIcon,
          }).addTo(map);
        });
      }

      mapInstanceRef.current = map;
      console.log("Map initialized successfully");
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map");
    }
  }, [L, onLocationSelect]);

  // Create custom marker icons
  const createCustomIcon = (severity: "low" | "medium" | "high") => {
    if (!L) return null;

    const colors = {
      high: "#ef4444", // red
      medium: "#f59e0b", // amber
      low: "#10b981", // emerald
    };

    const color = colors[severity];

    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 30px;
          height: 30px;
        ">
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-${severity} 2s infinite;
          "></div>
          <style>
            @keyframes pulse-${severity} {
              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
              50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
          </style>
        </div>
      `,
      className: `custom-marker-${severity}`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  // Update markers when incidents change
  useEffect(() => {
    if (!L || !mapInstanceRef.current || !incidents.length) return;

    console.log("Updating markers with", incidents.length, "incidents");

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Create new markers
    const newMarkers: any[] = [];
    const bounds = L.latLngBounds([]);

    incidents.forEach((incident) => {
      try {
        const icon = createCustomIcon(incident.severity);
        if (!icon) return;

        const marker = L.marker([incident.lat, incident.lng], { icon });

        // Create rich popup content
        const popupContent = `
          <div style="min-width: 280px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <span style="
                background-color: ${
                  incident.severity === "high"
                    ? "#ef4444"
                    : incident.severity === "medium"
                    ? "#f59e0b"
                    : "#10b981"
                };
                color: white;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">${incident.severity}</span>
              ${
                incident.timeAgo
                  ? `<span style="color: #6b7280; font-size: 12px;">${incident.timeAgo}</span>`
                  : ""
              }
            </div>
            
            <h3 style="
              margin: 0 0 8px 0; 
              font-size: 16px; 
              font-weight: 600; 
              color: #1f2937;
              line-height: 1.3;
            ">
              ${incident.headline || incident.type}
            </h3>
            
            <p style="
              margin: 0 0 12px 0; 
              font-size: 14px; 
              color: #4b5563; 
              line-height: 1.4;
            ">
              ${incident.description}
            </p>
            
            <div style="margin-bottom: 8px;">
              <div style="
                display: flex; 
                align-items: center; 
                gap: 4px; 
                font-size: 12px; 
                color: #6b7280;
                margin-bottom: 4px;
              ">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>${incident.location || "Unknown location"}</span>
              </div>
            </div>
            
            <div style="
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              padding-top: 8px; 
              border-top: 1px solid #e5e7eb;
              font-size: 11px;
            ">
              <div style="display: flex; gap: 8px; align-items: center;">
                ${
                  incident.category
                    ? `
                  <span style="
                    background-color: #dbeafe;
                    color: #1e40af;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-weight: 500;
                  ">${incident.category}</span>
                `
                    : ""
                }
                ${
                  incident.confidence
                    ? `
                  <span style="color: ${
                    incident.confidence >= 0.9
                      ? "#10b981"
                      : incident.confidence >= 0.7
                      ? "#f59e0b"
                      : "#ef4444"
                  };">
                    ${Math.round(incident.confidence * 100)}% confidence
                  </span>
                `
                    : ""
                }
              </div>
              <span style="
                color: ${incident.status === "active" ? "#10b981" : "#6b7280"};
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              ">${incident.status || "active"}</span>
            </div>
            
            ${
              incident.impact
                ? `
              <div style="
                margin-top: 8px; 
                padding-top: 8px; 
                border-top: 1px solid #e5e7eb;
                font-size: 11px; 
                color: #6b7280;
              ">
                Impact Level: <span style="font-weight: 600; color: #374151;">${incident.impact}/3</span>
              </div>
            `
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 350,
          className: "custom-popup",
          closeButton: true,
          autoClose: false,
          closeOnEscapeKey: true,
        });

        // Add hover effects
        marker.on("mouseover", function () {
          this.openPopup();
        });

        marker.addTo(mapInstanceRef.current);
        newMarkers.push(marker);
        bounds.extend([incident.lat, incident.lng]);
      } catch (err) {
        console.error("Error creating marker for incident:", incident.id, err);
      }
    });

    markersRef.current = newMarkers;

    // Fit map to show all markers
    if (newMarkers.length > 0 && bounds.isValid()) {
      try {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 15,
        });
      } catch (err) {
        console.error("Error fitting bounds:", err);
      }
    }

    console.log("Successfully added", newMarkers.length, "markers");
  }, [L, incidents]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        console.log("Cleaning up map...");
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className='w-full flex items-center justify-center bg-gray-50 rounded-lg border'
        style={{ height }}>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3'></div>
          <p className='text-sm text-gray-600 font-medium'>Loading map...</p>
          <p className='text-xs text-gray-500 mt-1'>
            Initializing Leaflet library
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='w-full flex items-center justify-center bg-red-50 rounded-lg border border-red-200'
        style={{ height }}>
        <Card className='p-6 text-center border-red-200'>
          <div className='text-red-600 mb-2'>
            <svg
              className='w-8 h-8 mx-auto mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
            <p className='font-medium'>Map Error</p>
          </div>
          <p className='text-sm text-gray-600'>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className='mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors'>
            Reload Page
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      {/* Re-added minHeight to ensure the map container always has dimensions */}
      <div
        ref={mapRef}
        className='w-full rounded-lg border shadow-sm'
        style={{ height, minHeight: "800px" }}
      />

      {/* Map overlay info */}
      <div className='absolute top-4 right-4 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-xs z-[1000] backdrop-blur-sm'>
        <div className='flex items-center gap-2 mb-1'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
          <span className='font-medium'>{incidents.length} incidents</span>
        </div>
        {onLocationSelect && (
          <div className='text-gray-300 text-[10px]'>
            Click map to select location
          </div>
        )}
      </div>

      {/* Legend */}
      <div className='absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg z-[1000]'>
        <div className='font-medium text-gray-800 mb-2'>Severity Levels</div>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-red-500 rounded-full'></div>
            <span className='text-gray-700'>High</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-amber-500 rounded-full'></div>
            <span className='text-gray-700'>Medium</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-emerald-500 rounded-full'></div>
            <span className='text-gray-700'>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
