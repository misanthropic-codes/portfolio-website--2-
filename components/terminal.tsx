"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Square, TerminalIcon } from "lucide-react"
import { useTheme } from "./theme-provider"
import data from "@/data/data.json"

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
}

interface Command {
  input: string
  output: string[]
  timestamp: string
}

export function Terminal({ isOpen, onClose }: TerminalProps) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Command[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  const commands = {
    help: () => [
      "Available commands:",
      "  help          - Show this help message",
      "  about         - About Abhishek Kumar",
      "  skills        - List technical skills",
      "  projects      - Show projects",
      "  contact       - Contact information",
      "  resume        - Download resume",
      "  github        - Open GitHub profile",
      "  linkedin      - Open LinkedIn profile",
      "  twitter       - Open Twitter profile",
      "  theme <mode>  - Change theme (developer/hacker/noob)",
      "  clear         - Clear terminal",
      "  exit          - Close terminal",
      "  whoami        - Current user info",
      "  pwd           - Current directory",
      "  ls            - List directory contents",
      "  cat <file>    - Display file contents",
      "  neofetch      - System information",
    ],
    about: () => [
      "Abhishek Kumar - Full Stack Developer",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      data.bio.summary,
      "",
      `Location: ${data.bio.location}`,
      `Email: ${data.bio.email}`,
      `Role: ${data.bio.title}`,
    ],
    skills: () => [
      "Technical Skills:",
      "━━━━━━━━━━━━━━━━",
      ...data.skills.map((category) => `${category.category}: ${category.items.join(", ")}`),
    ],
    projects: () => [
      "Featured Projects:",
      "━━━━━━━━━━━━━━━━━",
      ...data.projects
        .filter((p) => p.featured)
        .map((project) => `• ${project.title} (${project.year}) - ${project.description.substring(0, 80)}...`),
    ],
    contact: () => [
      "Contact Information:",
      "━━━━━━━━━━━━━━━━━━━━",
      `Email: ${data.contact.email}`,
      `GitHub: ${data.contact.github}`,
      `LinkedIn: ${data.contact.linkedin}`,
      `Twitter: ${data.contact.twitter}`,
    ],
    resume: () => {
      window.open(data.bio.resumeUrl, "_blank")
      return ["Opening resume in new tab..."]
    },
    github: () => {
      window.open(data.contact.github, "_blank")
      return ["Opening GitHub profile..."]
    },
    linkedin: () => {
      window.open(data.contact.linkedin, "_blank")
      return ["Opening LinkedIn profile..."]
    },
    twitter: () => {
      window.open(data.contact.twitter, "_blank")
      return ["Opening Twitter profile..."]
    },
    clear: () => {
      setHistory([])
      return []
    },
    exit: () => {
      onClose()
      return ["Goodbye! 👋"]
    },
    whoami: () => ["abhishek"],
    pwd: () => ["/home/abhishek/portfolio"],
    ls: () => [
      "total 8",
      "drwxr-xr-x  2 abhishek abhishek 4096 Jan 26 2025 projects/",
      "drwxr-xr-x  2 abhishek abhishek 4096 Jan 26 2025 skills/",
      "-rw-r--r--  1 abhishek abhishek 1024 Jan 26 2025 about.txt",
      "-rw-r--r--  1 abhishek abhishek 2048 Jan 26 2025 resume.pdf",
      "-rw-r--r--  1 abhishek abhishek  512 Jan 26 2025 contact.txt",
    ],
    cat: (args: string[]) => {
      const file = args[0]
      switch (file) {
        case "about.txt":
          return commands.about()
        case "contact.txt":
          return commands.contact()
        case "resume.pdf":
          return ["Error: cannot display binary file. Use 'resume' command to download."]
        default:
          return [`cat: ${file}: No such file or directory`]
      }
    },
    neofetch: () => [
      "                   -`                    abhishek@portfolio",
      "                  .o+`                   ─────────────────────",
      "                 `ooo/                   OS: Arch Linux x86_64",
      "                `+oooo:                  Host: Portfolio v2.0",
      "               `+oooooo:                 Kernel: Next.js 15.1.3",
      "               -+oooooo+:                Uptime: 24/7",
      "             `/:-:++oooo+:               Packages: React, TypeScript, Tailwind",
      "            `/++++/+++++++:              Shell: zsh 5.9",
      "           `/++++++++++++++:             Resolution: Responsive",
      "          `/+++ooooooooo+++/`            Theme: " + theme,
      "         ./ooosssso++osssssso+`          Terminal: Custom Terminal v1.0",
      "        .oossssso-````/ossssss+`         CPU: Full Stack Developer",
      "       -osssssso.      :ssssssso.        GPU: Creative Problem Solver",
      "      :osssssss/        osssso+++.       Memory: Unlimited Learning",
      "     /ossssssss/        +ssssooo/-       ",
      "   `/ossssso+/:-        -:/+osssso+-     ",
      "  `+sso+:-`                 `.-/+oso:    ",
      " `++:.                           `-/+/   ",
      " .`                                 `/   ",
    ],
    theme: (args: string[]) => {
      const newTheme = args[0] as "developer" | "hacker" | "noob"
      if (["developer", "hacker", "noob"].includes(newTheme)) {
        setTheme(newTheme)
        const themeNames = {
          developer: "Developer Mode (Red)",
          hacker: "Hacker Mode (Green)",
          noob: "Noob Mode (Light)",
        }
        return [`Theme changed to: ${themeNames[newTheme]}`]
      }
      return [
        "Usage: theme <mode>",
        "Available themes:",
        "  developer - Red theme for developers",
        "  hacker    - Green theme for hackers",
        "  noob      - Light theme for beginners",
      ]
    },
  }

  const executeCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().toLowerCase().split(" ")
    const timestamp = new Date().toLocaleTimeString()

    let output: string[] = []

    if (command === "") {
      output = []
    } else if (commands[command as keyof typeof commands]) {
      const commandFunc = commands[command as keyof typeof commands] as any
      output = commandFunc(args)
    } else {
      output = [`Command not found: ${command}. Type 'help' for available commands.`]
    }

    const newCommand: Command = {
      input: cmd,
      output,
      timestamp,
    }

    setHistory((prev) => [...prev, newCommand])
    setCommandHistory((prev) => [...prev, cmd])
    setInput("")
    setHistoryIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    }
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        {
          input: "",
          output: [
            "Welcome to Abhishek's Interactive Terminal!",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
            "Type 'help' to see available commands.",
            "Type 'about' to learn more about me.",
            "Type 'theme <mode>' to change the theme.",
            "",
          ],
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }, [isOpen, history.length])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="terminal w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Header */}
          <div className="terminal-header flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-sm font-mono">abhishek@portfolio:~</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-white/10 rounded">
                <Minus className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded">
                <Square className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded" onClick={onClose}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div ref={terminalRef} className="terminal-content p-4 h-full overflow-y-auto font-mono text-sm">
            {history.map((command, index) => (
              <div key={index} className="mb-4">
                {command.input && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary">abhishek@portfolio:~$</span>
                    <span>{command.input}</span>
                  </div>
                )}
                {command.output.map((line, lineIndex) => (
                  <div key={lineIndex} className="text-muted-foreground pl-4">
                    {line}
                  </div>
                ))}
              </div>
            ))}

            {/* Current Input */}
            <div className="flex items-center gap-2">
              <span className="text-primary">abhishek@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-foreground"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
