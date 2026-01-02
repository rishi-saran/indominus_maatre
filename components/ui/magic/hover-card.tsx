import React from "react"

interface HoverCardProps {
  children: React.ReactNode
}

export function HoverCard({ children }: HoverCardProps) {
  return (
    <div className="transition-all duration-300 hover:shadow-lg">
      {children}
    </div>
  )
}
