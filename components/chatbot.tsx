"use client"

import { useState, useEffect } from "react"
import { ChatHeader } from "./chat-header"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"

// Message interface for type safety
interface Message {
  role: "user" | "model"
  text: string
  timestamp: Date
}

// System prompt for the AI Music Curator
const SYSTEM_PROMPT = `You are a personalized AI Music Curator chatbot. Your role is to:
- Provide personalized music recommendations based on user preferences
- Discuss music genres, artists, albums, and songs
- Help users discover new music that matches their taste
- Share interesting music facts and trivia
- Be friendly, enthusiastic, and knowledgeable about music
- Ask follow-up questions to better understand user preferences
- Suggest playlists for different moods, activities, or occasions

Keep responses conversational and engaging. Always show genuine interest in the user's musical journey.`

export function Chatbot() {
  // State management for chat functionality
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "model",
      text: "🎵 Hey there! I'm your AI Music Curator. I'm here to help you discover amazing music tailored just for you. What kind of music are you in the mood for today?",
      timestamp: new Date(),
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [isAuthReady, setIsAuthReady] = useState(false)

  // Initialize Firebase Authentication (placeholder for now)
  useEffect(() => {
    // TODO: Initialize Firebase Auth
    // For now, generate a temporary user ID
    const tempUserId = `user_${Math.random().toString(36).substr(2, 9)}`
    setUserId(tempUserId)
    setIsAuthReady(true)

    // TODO: Load chat history from Firestore
    // loadChatHistory(tempUserId)
  }, [])

  // Function to send message and get AI response
  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return

    setLoading(true)

    // Add user message to chat history
    const userMessage: Message = {
      role: "user",
      text: message,
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, userMessage])
    setUserInput("")

    try {
      // TODO: Replace with actual Gemini API call
      // For now, simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse: Message = {
        role: "model",
        text: generateMockResponse(message),
        timestamp: new Date(),
      }

      setChatHistory((prev) => [...prev, aiResponse])

      // TODO: Save updated chat history to Firestore
      // saveChatHistory(userId, [...chatHistory, userMessage, aiResponse])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "model",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🎵",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  // Mock response generator (replace with actual API call)
  const generateMockResponse = (userMessage: string): string => {
    const responses = [
      "That's a great choice! Based on what you've told me, I'd recommend checking out some indie folk artists like Phoebe Bridgers or Big Thief. Their introspective lyrics and melodic arrangements might really resonate with you. 🎸",
      "I love that genre! Have you explored any jazz fusion lately? Artists like Kamasi Washington or Thundercat blend traditional jazz with modern elements beautifully. What draws you to this style of music? 🎷",
      "Interesting taste! For something similar but with a fresh twist, you might enjoy exploring some neo-soul artists. Try listening to FKA twigs or Blood Orange - they have that same emotional depth with innovative production. 🎵",
      "That's such a vibe! If you're into that sound, I'd suggest creating a playlist with artists like Tame Impala, MGMT, and Glass Animals. They all have that dreamy, psychedelic quality. What's your favorite time of day to listen to music like this? ✨",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-background">
      <div className="flex flex-col h-full backdrop-blur-sm bg-background/95 border border-border/50 rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Chat Header */}
        <ChatHeader userId={userId} isAuthReady={isAuthReady} />

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/20 pointer-events-none z-10" />
          <ChatMessages messages={chatHistory} loading={loading} />
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={sendMessage}
          disabled={loading || !isAuthReady}
          value={userInput}
          onChange={setUserInput}
        />
      </div>
    </div>
  )
}
