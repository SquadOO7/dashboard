"use client"

import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getDatabase, type Database } from "firebase/database"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: "https://user-reports.asia-southeast1.firebasedatabase.app/",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "hack-52244.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let reportsApp: FirebaseApp
let reportsDatabase: Database | null = null
let reportsStorage: FirebaseStorage | null = null

try {
  // Initialize Firebase for reports
  reportsApp = getApps().find((app) => app.name === "reports") || initializeApp(firebaseConfig, "reports")

  // Initialize Database and Storage
  reportsDatabase = getDatabase(reportsApp)
  reportsStorage = getStorage(reportsApp)

  console.log("Firebase Reports initialized successfully")
} catch (error) {
  console.error("Firebase Reports initialization error:", error)
  reportsDatabase = null
  reportsStorage = null
}

export { reportsDatabase, reportsStorage }
