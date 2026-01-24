"use client";

import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, User, FolderGit2, Mail, Terminal } from "lucide-react";

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
];

export function DockNav() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <FloatingDock
        items={navItems}
        desktopClassName="shadow-xl shadow-primary/10"
        mobileClassName=""
      />
    </div>
  );
}
