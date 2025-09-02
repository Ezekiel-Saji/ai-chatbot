"use client"

import { useState, useEffect } from "react"
import { ChatContainer } from "./chat-container"
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
const SYSTEM_PROMPT =  `You are a highly skilled AI Music Curator and Playlist Creator. Your mission is to create a personalized Spotify playlist for the user based on their mood, story, or activity.
  Your process must be as follows:
  1. Analyze the User Request: Carefully read the user input to understand their mood (e.g., melancholic), the story they are telling (e.g., "a rainy Sunday afternoon"), or the activity they're engaged in (e.g., "a coding session").
  2. Generate a Playlist Concept: Based on your analysis, come up with a creative playlist title and a short description that captures the essence of the user's request.
  3. Curate Song Recommendations: Curate a list of 10-15 songs that perfectly match the identified mood and theme. The songs must be real tracks available on Spotify.
  4. Format the Output as JSON: Your final response must be a single, valid JSON object that adheres to the following strict schema. Do not include any conversational text, explanations, or markdown outside of the JSON block. The entire response must be a single JSON object so it can be programmatically parsed.
  JSON Schema:
  {
    "playlist_title": "string",
    "playlist_description": "string",
    "tracks": [
      {
        "track_name": "string",
        "artist_name": "string"
      },
      {
        "track_name": "string",
        "artist_name": "string"
      }
    ]
  }
  Keep responses conversational and engaging. Always show genuine interest in the user's musical journey.`
export function App() {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "model",
      text: "🎵 Hey there! I'm your AI Music Curator. I'm here to help you discover amazing music tailored just for you. What kind of music are you in the mood for today?",
      timestamp: new Date(),
    },
  ])
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [userId, setUserId] = useState<string>("")

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // TODO: Initialize Firebase services (auth, db)
        // const auth = getAuth()
        // const db = getFirestore()

        // For now, simulate anonymous sign-in
        const tempUserId = `user_${Math.random().toString(36).substr(2, 9)}`
        setUserId(tempUserId)
        setIsAuthReady(true)

        console.log("[v0] Firebase initialized with user:", tempUserId)
      } catch (error) {
        console.error("Firebase initialization error:", error)
      }
    }

    initializeFirebase()
  }, [])

  useEffect(() => {
    if (!userId || !isAuthReady) return

    // TODO: Set up Firestore real-time listener
    // const unsubscribe = onSnapshot(
    //   doc(db, `artifacts/${__app_id}/users/${userId}/chat_history/main`),
    //   (doc) => {
    //     if (doc.exists()) {
    //       const data = doc.data()
    //       if (data.messages) {
    //         setChatHistory(JSON.parse(data.messages))
    //       }
    //     }
    //   }
    // )

    console.log("[v0] Setting up Firestore listener for user:", userId)

    // return () => unsubscribe()
  }, [userId, isAuthReady])

  const saveChatHistory = async (messages: Message[]) => {
    if (!userId || !isAuthReady) return

    try {
      // TODO: Save to Firestore
      // await setDoc(
      //   doc(db, `artifacts/${__app_id}/users/${userId}/chat_history/main`),
      //   { messages: JSON.stringify(messages) },
      //   { merge: true }
      // )

      console.log("[v0] Chat history saved for user:", userId)
    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading || !isAuthReady) return

    setLoading(true)

    // Add user message to chat history
    const userMessage: Message = {
      role: "user",
      text: message,
      timestamp: new Date(),
    }

    const updatedHistory = [...chatHistory, userMessage]
    setChatHistory(updatedHistory)
    setUserInput("")

    try {
      //TODO: Replace with actual Gemini API call
      const createPlaylist = async (mood, spotifyAccessToken, spotifyUserId) => {
      const response = await fetch('/api/create-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, spotifyAccessToken, spotifyUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }

      const data = await response.json();
      return data.playlistUrl;
    };

      // const response = await fetch('/api/gemini', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message, history: chatHistory })

        
      // })

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500))

      // const aiResponse: Message = {
      //   role: "model",
      //   text: generateMockResponse(message),
      //   timestamp: new Date(),
      // }

      const finalHistory = [...updatedHistory, response]
      setChatHistory(finalHistory)

      // Save to Firestore after AI response
      await saveChatHistory(finalHistory)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "model",
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🎵",
        timestamp: new Date(),
      }
      const errorHistory = [...updatedHistory, errorMessage]
      setChatHistory(errorHistory)
      await saveChatHistory(errorHistory)
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
    <ChatContainer>
      <ChatHeader userId={userId} />
      <ChatMessages messages={chatHistory} loading={loading} />
      <ChatInput
        userInput={userInput}
        onInputChange={setUserInput}
        onSendMessage={sendMessage}
        disabled={loading || !isAuthReady}
      />
    </ChatContainer>
  )
}
