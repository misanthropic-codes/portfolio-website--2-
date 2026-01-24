import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { BackgroundEffects } from "@/components/background-effects"
import { InteractiveSound } from "@/components/interactive-sound"
import { DockNav } from "@/components/dock-nav"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"


const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Abhishek Kumar - Full Stack Developer",
    template: "%s | Abhishek Kumar",
  },
  description:
    "Full Stack Developer & Graphics Designer. Building innovative web solutions with React, Next.js, and modern technologies.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Web Developer", "JavaScript", "TypeScript"],
  authors: [{ name: "Abhishek Kumar" }],
  creator: "Abhishek Kumar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://misanthropic.site",
    title: "Abhishek Kumar - Full Stack Developer",
    description:
      "Full Stack Developer & Graphics Designer. Building innovative web solutions with React, Next.js, and modern technologies.",
    siteName: "Abhishek Kumar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Kumar - Full Stack Developer",
    description:
      "Full Stack Developer & Graphics Designer. Building innovative web solutions with React, Next.js, and modern technologies.",
    creator: "@airabhishek098",
  },
   
}

import { getProfile, getProjects, getSkills } from "@/lib/data";

// ... metadata

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile();
  const projects = await getProjects();
  const skills = await getSkills();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${jetbrainsMono.variable} min-h-screen`}>
        <ThemeProvider>
          <BackgroundEffects />
          <InteractiveSound />
          <main className="min-h-screen relative z-10">{children}</main>
          <Footer profile={profile} />
          <DockNav profile={profile} projects={projects} skills={skills} />
          <Toaster />
          <Analytics />
           <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
