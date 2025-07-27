"use client"

import { useState } from "react"
import { reportsDatabase, reportsStorage } from "@/lib/firebase-reports"
import { ref as dbRef, push, set } from "firebase/database"
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

export interface ReportData {
  category: string
  context: string
  geolocation: string
  impact: number
  timestamp: number
  mediaUrls?: string[]
  issueType?: string
  userLocation?: string
}

export function useReportSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
    if (!reportsStorage || files.length === 0) {
      return []
    }

    const uploadPromises = files.map(async (file, index) => {
      try {
        // Create unique filename with timestamp
        const timestamp = Date.now()
        const fileExtension = file.name.split(".").pop()
        const fileName = `reports/${timestamp}_${index}.${fileExtension}`

        const fileRef = storageRef(reportsStorage, fileName)

        // Upload file
        const snapshot = await uploadBytes(fileRef, file)

        // Get download URL
        const downloadURL = await getDownloadURL(snapshot.ref)

        console.log(`File ${file.name} uploaded successfully:`, downloadURL)
        return downloadURL
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        throw error
      }
    })

    try {
      const mediaUrls = await Promise.all(uploadPromises)
      return mediaUrls
    } catch (error) {
      console.error("Error uploading media files:", error)
      throw new Error("Failed to upload media files")
    }
  }

  const submitReport = async (reportData: Omit<ReportData, "timestamp" | "mediaUrls">, mediaFiles: File[] = []) => {
    if (!reportsDatabase) {
      throw new Error("Firebase database not available")
    }

    setIsSubmitting(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Upload media files first
      let mediaUrls: string[] = []
      if (mediaFiles.length > 0) {
        setUploadProgress(25)
        mediaUrls = await uploadMediaFiles(mediaFiles)
        setUploadProgress(75)
      }

      // Prepare report data
      const completeReportData: ReportData = {
        ...reportData,
        timestamp: Date.now(),
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      }

      // Submit to Firebase database
      const reportsRef = dbRef(reportsDatabase, "user-reports")
      const newReportRef = push(reportsRef)

      await set(newReportRef, completeReportData)

      setUploadProgress(100)
      console.log("Report submitted successfully:", newReportRef.key)

      return {
        success: true,
        reportId: newReportRef.key,
        mediaUrls,
      }
    } catch (error: any) {
      console.error("Error submitting report:", error)
      setError(error.message || "Failed to submit report")
      return {
        success: false,
        error: error.message || "Failed to submit report",
      }
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }

  return {
    submitReport,
    isSubmitting,
    uploadProgress,
    error,
    clearError: () => setError(null),
  }
}
