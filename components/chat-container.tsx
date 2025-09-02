import type React from "react"
interface ChatContainerProps {
  children: React.ReactNode
}

export function ChatContainer({ children }: ChatContainerProps) {
  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-background">
      <div className="flex flex-col h-full backdrop-blur-sm bg-background/95 border border-border/50 rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
