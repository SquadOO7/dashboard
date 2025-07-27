"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface TimeDisplayProps {
  timestamp?: Date | string | number
  format?: "time" | "date" | "datetime" | "relative"
  className?: string
  showIcon?: boolean
}

export function TimeDisplay({ timestamp, format = "time", className = "", showIcon = false }: TimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [displayTime, setDisplayTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!timestamp) {
      setDisplayTime("--:--")
      return
    }

    try {
      const date = new Date(timestamp)

      if (isNaN(date.getTime())) {
        setDisplayTime("Invalid date")
        return
      }

      switch (format) {
        case "time":
          setDisplayTime(
            date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          )
          break
        case "date":
          setDisplayTime(date.toLocaleDateString())
          break
        case "datetime":
          setDisplayTime(date.toLocaleString())
          break
        case "relative":
          const now = currentTime.getTime()
          const then = date.getTime()
          const diff = now - then

          if (diff < 60000) {
            // Less than 1 minute
            setDisplayTime("Just now")
          } else if (diff < 3600000) {
            // Less than 1 hour
            const minutes = Math.floor(diff / 60000)
            setDisplayTime(`${minutes}m ago`)
          } else if (diff < 86400000) {
            // Less than 1 day
            const hours = Math.floor(diff / 3600000)
            setDisplayTime(`${hours}h ago`)
          } else if (diff < 604800000) {
            // Less than 1 week
            const days = Math.floor(diff / 86400000)
            setDisplayTime(`${days}d ago`)
          } else {
            setDisplayTime(date.toLocaleDateString())
          }
          break
        default:
          setDisplayTime(
            currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          )
      }
    } catch (error) {
      console.error("Error formatting time:", error)
      setDisplayTime("Error")
    }
  }, [timestamp, format, currentTime])

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {showIcon && <Clock className="h-3 w-3" />}
      <span className="font-mono text-sm">{displayTime}</span>
    </div>
  )
}
