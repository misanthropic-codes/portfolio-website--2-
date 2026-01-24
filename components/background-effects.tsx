"use client"

import { useTheme } from "./theme-provider"

// Simplified background - no canvas animations for better scroll performance
export function BackgroundEffects() {
  const { theme } = useTheme()
  
  // Return a minimal static gradient instead of animated canvas
  // This eliminates scroll lag while maintaining visual depth
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Subtle radial gradient based on theme */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: theme === "hacker" 
            ? "radial-gradient(ellipse at 50% 0%, rgba(0, 255, 65, 0.15) 0%, transparent 50%)"
            : theme === "noob"
            ? "radial-gradient(ellipse at 50% 0%, rgba(0, 102, 255, 0.15) 0%, transparent 50%)"
            : "radial-gradient(ellipse at 50% 0%, rgba(179, 0, 0, 0.15) 0%, transparent 50%)"
        }}
      />
    </div>
  )
}
