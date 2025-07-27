"use client";

import { useState } from "react";
import { MapComponent } from "@/components/map-component";
import { MediaUpload } from "@/components/media-upload"; // Make sure this component exists
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Navigation, CheckCircle, AlertCircle } from "lucide-react";
import { useLocation } from "@/components/location-provider"; // Make sure this context/hook exists
import { useReportSubmission } from "@/hooks/useReportSubmission"; // Make sure this hook exists
//import { TopNavigation } from "../dashboard/page"; // Adjust path if TopNavigation is elsewhere

// Define category options for the Select component
const CATEGORY_OPTIONS = [
  { value: "Traffic & Transportation", label: "Traffic & Transportation" },
  { value: "Administrative Announcements", label: "Administrative" },
  { value: "Weather & Environment", label: "Weather & Environment" },
  { value: "Public Safety", label: "Public Safety" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Health & Medical", label: "Health & Medical" },
  { value: "Education", label: "Education" },
  { value: "Technology", label: "Technology" },
  { value: "Events & Gatherings", label: "Events & Gatherings" },
];

// Define impact level options for the Select component
const IMPACT_LEVELS = [
  { value: 1, label: "Low Impact", description: "Minor inconvenience" },
  { value: 2, label: "Medium Impact", description: "Moderate disruption" },
  { value: 3, label: "High Impact", description: "Major disruption" },
];

export default function Reports() {
  // State for form fields and UI feedback
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [impact, setImpact] = useState<number>(1);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false); // For showing success message

  // Custom hooks for location and report submission
  const { location, hasPermission, requestLocation } = useLocation();
  const { submitReport, isSubmitting, uploadProgress, error, clearError } =
    useReportSubmission();

  // Callback for when a location is selected on the map
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
  };

  // Callback to use the device's current location
  const handleUseCurrentLocation = () => {
    if (location) {
      // If location is already available, use it
      setSelectedLocation(location);
    } else {
      // Otherwise, request location permission and data
      requestLocation();
    }
  };

  // Handler for submitting the report form
  const handleSubmitReport = async () => {
    // Basic form validation
    if (!category || !context || !selectedLocation) {
      alert(
        "Please fill in all required fields: Category, Description, and Location."
      );
      return;
    }

    clearError(); // Clear any previous errors before a new submission

    // Prepare the report data payload
    const reportData = {
      category,
      context,
      geolocation: `${selectedLocation.lat},${selectedLocation.lng}`, // Format as "lat,lng" string
      impact,
      // Include user's current device location if available (optional)
      userLocation: location ? `${location.lat},${location.lng}` : undefined,
    };

    // Determine the key name for media files in the API payload: 'video' or 'image'
    let mediaKey: "video" | "image" | undefined = undefined;
    if (mediaFiles.length > 0) {
      // Check if any of the attached files have a video MIME type
      const hasVideo = mediaFiles.some((file) =>
        file.type.startsWith("video/")
      );
      mediaKey = hasVideo ? "video" : "image"; // If any video, prioritize 'video' key
    }

    // Call the submission hook with report data, media files, and the determined media key
    const result = await submitReport(reportData, mediaFiles, mediaKey);

    if (result.success) {
      setSubmitted(true); // Show success message
      // Reset form fields to their initial state for a new report
      setCategory("");
      setContext("");
      setImpact(1);
      setSelectedLocation(null);
      setMediaFiles([]);

      // Hide the success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  // Determine if the form is valid to enable the submit button
  const isFormValid = category && context && selectedLocation;

  return (
    <div className='flex flex-col h-full'>
      {/* Top Navigation Component */}
      {/* <TopNavigation /> */}

      {/* Main content area for the report form */}
      <div className='p-6 flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 to-gray-900 text-white'>
        <div className='max-w-full mx-auto'>
          <h1 className='text-3xl font-bold mb-6 shuttle-glow'>
            Report an Issue
          </h1>

          {/* Success Alert Message */}
          {submitted && (
            <Alert className='mb-6 bg-green-900 border-green-700 text-green-100'>
              <CheckCircle className='h-4 w-4' />
              <AlertDescription>
                Report submitted successfully! Thank you for helping improve our
                city.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert Message */}
          {error && (
            <Alert className='mb-6 bg-red-900 border-red-700 text-red-100'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Grid layout for form and map */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Report Form Card */}
            <Card className='bg-gray-900 border-gray-800 shuttle-glow shadow-lg'>
              <CardHeader>
                <CardTitle className='text-white'>Issue Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Category Selection */}
                <div>
                  <Label htmlFor='category' className='text-white'>
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200'>
                      <SelectValue placeholder='Select issue category' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700 text-white'>
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='hover:bg-gray-700'>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Impact Level Selection */}
                <div>
                  <Label htmlFor='impact' className='text-white'>
                    Impact Level *
                  </Label>
                  <Select
                    value={impact.toString()}
                    onValueChange={(value) =>
                      setImpact(Number.parseInt(value))
                    }>
                    <SelectTrigger className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white transition-all duration-200'>
                      <SelectValue placeholder='Select impact level' />
                    </SelectTrigger>
                    <SelectContent className='bg-gray-800 border-gray-700 text-white'>
                      {IMPACT_LEVELS.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value.toString()}
                          className='hover:bg-gray-700'>
                          <div>
                            <div className='font-medium'>{level.label}</div>
                            <div className='text-xs text-gray-400'>
                              {level.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description Textarea */}
                <div>
                  <Label htmlFor='context' className='text-white'>
                    Description *
                  </Label>
                  <Textarea
                    id='context'
                    placeholder='Describe the issue in detail...'
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className='mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-white min-h-[120px] transition-all duration-200'
                  />
                </div>

                {/* Location Selection Display */}
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <Label className='text-white'>Location *</Label>
                    {location && ( // Only show "Use Current Location" if device location is available
                      <Button
                        onClick={handleUseCurrentLocation}
                        size='sm'
                        variant='outline'
                        className='border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent text-xs'>
                        <Navigation className='h-3 w-3 mr-1' />
                        Use Current Location
                      </Button>
                    )}
                  </div>
                  <div className='p-3 bg-gray-800 rounded-md border border-gray-700'>
                    {selectedLocation ? (
                      <div className='flex items-center gap-2 text-white'>
                        <MapPin className='h-4 w-4 text-white' />
                        <span>
                          {selectedLocation.lat.toFixed(6)},{" "}
                          {selectedLocation.lng.toFixed(6)}
                        </span>
                      </div>
                    ) : (
                      <span className='text-gray-400'>
                        Click on the map to select location
                      </span>
                    )}
                  </div>
                </div>

                {/* Media Upload Component */}
                <div>
                  <Label className='text-white'>Add Media (Optional)</Label>
                  <div className='mt-2'>
                    <MediaUpload
                      onFilesChange={setMediaFiles}
                      uploadProgress={uploadProgress}
                      maxFiles={5} // Allow up to 5 media files
                    />
                  </div>
                </div>

                {/* Submit Report Button */}
                <Button
                  onClick={handleSubmitReport}
                  className='w-full bg-white text-black hover:bg-gray-200 transition-all duration-200 shuttle-glow'
                  disabled={!isFormValid || isSubmitting} // Disable if form is invalid or submitting
                >
                  {isSubmitting ? "Submitting Report..." : "Submit Report"}
                </Button>
              </CardContent>
            </Card>

            {/* Map for Location Selection Card */}
            <Card className='bg-gray-900 border-gray-800 shadow-lg'>
              <CardHeader>
                <CardTitle className='text-white'>Select Location</CardTitle>
                {!hasPermission && ( // Inform user if location permission is not granted
                  <p className='text-gray-400 text-sm'>
                    Enable location access for more accurate positioning
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {/* MapComponent used here for interactive location selection */}
                {/* Incidents array is empty as this map is for selecting, not displaying */}
                <MapComponent
                  height='500px' // Fixed height for the map
                  incidents={[]}
                  onLocationSelect={handleLocationSelect}
                />
                <p className='text-gray-400 text-sm mt-2'>
                  Click on the map to select the incident location
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
