"use client";

import { useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Terminal } from "@/components/terminal";
import { Home, User, FolderGit2, Mail, Terminal as TerminalIcon, Palette } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function DockNav() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Cycle through themes
  const cycleTheme = () => {
    const themes = ["developer", "hacker", "noob"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as "developer" | "hacker" | "noob");
  };

  const navItems = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-foreground" />,
      href: "/",
    },
    {
      title: "About",
      icon: <User className="h-full w-full text-foreground" />,
      href: "/about",
    },
    {
      title: "Projects",
      icon: <FolderGit2 className="h-full w-full text-foreground" />,
      href: "/projects",
    },
    {
      title: "Contact",
      icon: <Mail className="h-full w-full text-foreground" />,
      href: "/contact",
    },
    {
      title: `Theme: ${theme}`,
      icon: <Palette className="h-full w-full text-foreground" />,
      href: "#",
      onClick: cycleTheme,
    },
    {
      title: "Terminal",
      icon: <TerminalIcon className="h-full w-full text-foreground" />,
      href: "#",
      onClick: () => setTerminalOpen(true),
    },
  ];

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock
          items={navItems}
          desktopClassName="shadow-xl shadow-primary/10"
          mobileClassName=""
        />
      </div>
      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
}
