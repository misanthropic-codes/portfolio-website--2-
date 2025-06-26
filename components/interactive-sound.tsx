"use client"

import { useEffect, useRef } from "react"

export function InteractiveSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const lastSoundTime = useRef<number>(0)

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
    }

    // Create subtle click sound
    const createClickSound = () => {
      const now = Date.now()
      if (now - lastSoundTime.current < 100) return // Throttle sounds
      lastSoundTime.current = now

      if (!audioContextRef.current) return

      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContextRef.current.currentTime + 0.05)

      gainNode.gain.setValueAtTime(0.02, audioContextRef.current.currentTime) // Much quieter
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.05)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.05)
    }

    // Subtle haptic feedback
    const triggerHaptic = (intensity = 1) => {
      if ("vibrate" in navigator) {
        navigator.vibrate(intensity * 5) // Reduced intensity
      }
    }

    // Add event listeners only to important interactive elements
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a[href], [role="button"]')) {
        initAudio()
        createClickSound()
        triggerHaptic(1)
      }
    }

    // Only add click listeners, remove hover sounds
    document.addEventListener("click", handleClick, { passive: true })

    return () => {
      document.removeEventListener("click", handleClick)
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return null
}
