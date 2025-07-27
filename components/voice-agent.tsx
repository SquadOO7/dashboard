// components/voice-agent.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging
import toast from "react-hot-toast"; // For feedback

// IMPORTANT: Replace with your actual ElevenLabs Agent ID
// This should ideally be loaded from an environment variable (e.g., process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID)
const ELEVENLABS_AGENT_ID =
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "YOUR_ELEVENLABS_AGENT_ID";

export function VoiceAgent() {
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false); // Tracks if we attempted to start a session
  const [isUserSpeaking, setIsUserSpeaking] = useState(false); // Track if user is currently speaking (mic open)
  const [initialVolume, setInitialVolume] = useState<number>(0.8); // Default volume

  const conversation = useConversation({
    onConnect: () => {
      console.log("Conversation connected!");
      toast.success("Voice agent connected! You can start talking.", {
        icon: "📞",
      });
    },
    onDisconnect: () => {
      console.log("Conversation disconnected.");
      toast("Voice agent disconnected.", { icon: "👋" });
      setIsSessionActive(false); // Reset session state
      setIsUserSpeaking(false);
    },
    onMessage: (message) => {
      // You can process and display messages here if needed
      if (message.type === "final_user_transcription") {
        console.log("You said:", message.text);
      } else if (message.type === "agent_response") {
        console.log("Agent said:", message.text);
      }
      // console.log("Received message:", message);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast.error(`Voice agent error: ${error.message || "Unknown error"}`, {
        icon: "🚨",
      });
      setIsSessionActive(false); // Ensure session is marked as inactive on error
      setIsUserSpeaking(false);
    },
  });

  const { status, isSpeaking } = conversation; // Get status and speaking state from the hook

  // Request microphone permission on component mount or a user gesture
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicPermissionGranted(true);
        stream.getTracks().forEach((track) => track.stop()); // Stop immediately after checking
      } catch (err) {
        console.error("Microphone permission denied:", err);
        setMicPermissionGranted(false);
        toast.error("Microphone access denied. Voice agent won't work.", {
          icon: "🎤❌",
        });
      }
    };

    // Request permission only once or on a user interaction if preferred
    // For a hovering icon, it's often better to request on first click of the icon
    // or provide a clear "Enable Microphone" button.
    // We'll request on the first toggle attempt for simplicity here.
  }, []);

  const toggleConversation = async () => {
    if (!micPermissionGranted) {
      // Request permission if not already granted
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicPermissionGranted(true);
        stream.getTracks().forEach((track) => track.stop()); // Stop immediately
        toast.success("Microphone access granted!", { icon: "🎤✅" });
      } catch (err) {
        console.error("Microphone permission denied:", err);
        toast.error("Microphone access required for voice agent.", {
          icon: "🎤🚫",
        });
        setMicPermissionGranted(false);
        return; // Exit if permission not granted
      }
    }

    if (status === "connected") {
      // If connected, end the session
      await conversation.endSession();
      setIsSessionActive(false); // Update local state
      setIsUserSpeaking(false);
    } else if (status === "disconnected" || status === "error") {
      // If disconnected or errored, try to start a new session
      if (
        !ELEVENLABS_AGENT_ID ||
        ELEVENLABS_AGENT_ID === "YOUR_ELEVENLABS_AGENT_ID"
      ) {
        toast.error(
          "ElevenLabs Agent ID not configured. Please set NEXT_PUBLIC_ELEVENLABS_AGENT_ID.",
          { duration: 6000 }
        );
        return;
      }

      setIsSessionActive(true); // Indicate that we are trying to activate
      try {
        // IMPORTANT: For public agents, use agentId and connectionType: 'webrtc' or 'websocket'
        // 'webrtc' is generally recommended for lower latency.
        const conversationId = await conversation.startSession({
          agentId: ELEVENLABS_AGENT_ID,
          connectionType: "webrtc", // Or "websocket" if your agent is configured for it
        });
        console.log("Session started with ID:", conversationId);
        setIsUserSpeaking(true); // Assume user is ready to speak once session starts
        await conversation.setVolume({ volume: initialVolume }); // Set initial volume
      } catch (err: any) {
        console.error("Failed to start session:", err);
        toast.error(
          `Failed to connect voice agent: ${
            err.message || "Check Agent ID or network."
          }`,
          { duration: 5000 }
        );
        setIsSessionActive(false); // Revert state on failure
        setIsUserSpeaking(false);
      }
    }
  };

  const getStatusText = () => {
    if (status === "connected") {
      if (isSpeaking) {
        return "Agent Speaking...";
      }
      if (isUserSpeaking) {
        // This local state tracks user mic activity
        return "Listening...";
      }
      return "Connected";
    }
    if (status === "connecting") {
      return "Connecting...";
    }
    if (status === "disconnected") {
      return "Disconnected";
    }
    if (status === "error") {
      return "Error";
    }
    return "Ready";
  };

  const renderIcon = () => {
    if (status === "connecting") {
      return <Loader className='h-6 w-6 animate-spin text-white' />;
    }
    if (status === "connected") {
      if (isSpeaking) {
        return <Volume2 className='h-6 w-6 text-green-400 animate-pulse' />; // Agent is speaking
      }
      return <Mic className='h-6 w-6 text-green-400' />; // Connected, listening for user
    }
    // Disconnected or initial state
    return <Phone className='h-6 w-6 text-white' />;
  };

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "flex flex-col items-center group" // Use group for hover effects
      )}>
      <button
        onClick={toggleConversation}
        className={cn(
          "relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800",
          status === "connected"
            ? "ring-4 ring-green-500/50"
            : "ring-2 ring-gray-600/50",
          "focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75"
        )}
        aria-label={
          status === "connected" ? "End Voice Chat" : "Start Voice Chat"
        }
        disabled={
          status === "connecting" || (!micPermissionGranted && isSessionActive)
        } // Disable if connecting or trying to activate without mic
      >
        {renderIcon()}
      </button>

      {/* Status Text / Tooltip */}
      <div
        className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap",
          (status === "connected" || status === "connecting") &&
            "opacity-100 translate-y-2 group-hover:translate-y-0" // Always show when active
        )}>
        {getStatusText()}
      </div>

      {/* Volume Control (Optional - only visible when connected or connecting) */}
      {(status === "connected" || status === "connecting") && (
        <div className='absolute -left-36 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-lg shadow-md flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <VolumeX className='h-5 w-5 text-gray-400' />
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={initialVolume}
            onChange={async (e) => {
              const newVolume = parseFloat(e.target.value);
              setInitialVolume(newVolume);
              if (status === "connected") {
                await conversation.setVolume({ volume: newVolume });
              }
            }}
            className='w-24 h-1 rounded-lg appearance-none cursor-pointer bg-gray-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-sm'
          />
          <Volume2 className='h-5 w-5 text-gray-400' />
        </div>
      )}
    </div>
  );
}
