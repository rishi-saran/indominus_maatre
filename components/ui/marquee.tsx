import { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      style={{
        gap: "var(--gap, 1rem)",
      }}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around", {
              "flex-row": !vertical,
              "flex-col": vertical,
              "[animation-play-state:paused]": false,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
            })}
            style={{
              gap: "var(--gap, 1rem)",
              animation: vertical
                ? `marquee-vertical var(--duration, 40s) linear infinite ${
                    reverse ? "reverse" : ""
                  }`
                : `marquee var(--duration, 40s) linear infinite ${
                    reverse ? "reverse" : ""
                  }`,
            }}
          >
            {children}
          </div>
        ))}
    </div>
  )
}
