import { cn } from "@/lib/utils"

interface ChatMessageProps {
  text: string
  role: "user" | "model"
}

export function ChatMessage({ text, role }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 shadow-sm border",
          isUser
            ? "bg-primary text-primary-foreground border-primary/20"
            : "bg-card text-card-foreground border-border",
        )}
      >
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
