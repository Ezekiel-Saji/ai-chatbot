"use client"

import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  userInput: string
  onInputChange: (value: string) => void
  onSendMessage: (message: string) => void
  disabled: boolean
}

export function ChatInput({ userInput, onInputChange, onSendMessage, disabled }: ChatInputProps) {
  const handleSend = () => {
    if (userInput.trim() && !disabled) {
      onSendMessage(userInput.trim())
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-card p-4">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Input
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Connecting..." : "Ask me about music, artists, or get recommendations..."}
          disabled={disabled}
          className="flex-1 bg-input border-border focus:ring-ring"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !userInput.trim()}
          size="icon"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 max-w-4xl mx-auto">
        <button
          onClick={() => onInputChange("What's trending in indie rock right now?")}
          disabled={disabled}
          className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1 rounded-full transition-colors"
        >
          🎸 Trending indie rock
        </button>
        <button
          onClick={() => onInputChange("Recommend some chill study music")}
          disabled={disabled}
          className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1 rounded-full transition-colors"
        >
          📚 Study playlist
        </button>
        <button
          onClick={() => onInputChange("I love jazz fusion, what should I listen to next?")}
          disabled={disabled}
          className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1 rounded-full transition-colors"
        >
          🎷 Jazz fusion
        </button>
      </div>
    </div>
  )
}
