"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"

interface Message {
  role: "user" | "model"
  text: string
  timestamp: Date
}

interface ChatMessagesProps {
  messages: Message[]
  loading: boolean
}

export function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} text={message.text} role={message.role} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="bg-card rounded-lg p-3 max-w-xs shadow-sm border border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <span className="text-sm">curating...</span>
            </div>
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  )
}
