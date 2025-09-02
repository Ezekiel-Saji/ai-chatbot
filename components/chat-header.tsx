interface ChatHeaderProps {
  userId: string
}

export function ChatHeader({ userId }: ChatHeaderProps) {
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Music Curator
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Your personal music discovery assistant</p>
          </div>
        </div>

        {userId && (
          <div className="text-right bg-muted/50 rounded-xl px-4 py-2 border border-border/30">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Connected</p>
            <p className="text-sm font-mono text-primary font-semibold">{userId.slice(0, 12)}...</p>
          </div>
        )}
      </div>
    </header>
  )
}
