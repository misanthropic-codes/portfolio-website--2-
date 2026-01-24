"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  Download,
  ArrowRight,
  TerminalIcon,
} from "lucide-react";
import { Typewriter } from "./typewriter";
import { TechGlobe } from "./tech-globe";
import { useState } from "react";
import { Terminal } from "./terminal";
import { Spotlight } from "./ui/spotlight";
import { EncryptedText } from "./ui/encrypted-text";
import { FlipWords } from "./ui/flip-words";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { useTheme } from "next-themes";

const roles = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Open Source Contributor",
  "Freelancer"
];

// ... imports
import data from "@/data/data.json";
// ...

export function Hero({ profile = data.bio }: { profile?: typeof data.bio }) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden hero-section">
        {/* Aceternity Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="hsl(var(--primary))"
        />

        {/* Grid background for hacker theme only */}
        <div className="hero-grid"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none z-2">
          <div className="absolute top-20 left-10 w-20 h-20 glass rounded-full float opacity-30"></div>
          <div
            className="absolute top-40 right-20 w-32 h-32 glass rounded-full float opacity-20"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-16 h-16 glass rounded-full float opacity-25"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="container mx-auto relative z-10">
          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-primary font-medium mb-4 font-mono"
              >
                {">"} Hello, I'm
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold mb-6"
              >
                {theme === "hacker" ? (
                  <EncryptedText
                    text={profile.name}
                    className="gradient-text"
                  />
                ) : (
                  <Typewriter
                    text={profile.name}
                    delay={100}
                    className="gradient-text"
                  />
                )}
              </motion.h1>
            </motion.div>

            {/* Profile Image - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="relative"
            >
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-3xl opacity-20 glow-strong"></div>
                <Image
                  src={profile.profileImage || "/profile.jpeg"}
                  alt={profile.name}
                  width={256}
                  height={256}
                  className="relative z-10 rounded-full border-4 border-primary/20 glass-card"
                  priority
                />
              </div>
            </motion.div>

            {/* Bio - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="glass-card p-6 rounded-lg max-w-md"
            >
              <div className="text-lg text-muted-foreground mb-4 font-mono flex items-center justify-center gap-2">
                <span>I'm a</span>
                <FlipWords 
                  words={roles} 
                  duration={3000}
                  className="text-primary font-bold"
                />
              </div>
              <p className="text-base text-muted-foreground">
                <TextGenerateEffect 
                  words={profile.summary}
                  className="text-base"
                  duration={0.3}
                />
              </p>
            </motion.div>

            {/* Tech Globe - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              className="scale-75"
            >
              <TechGlobe />
            </motion.div>

            {/* Buttons - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col gap-4 w-full max-w-sm"
            >
              <Button asChild size="lg" className="glow w-full">
                <Link href="/contact">
                  Get In Touch
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-card flex-1"
                  onClick={() => setTerminalOpen(true)}
                >
                  <TerminalIcon className="w-4 h-4 mr-2" />
                  Terminal
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="glass-card flex-1"
                >
                  <Link href={profile.resumeUrl} target="_blank" download>
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Social Links - Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="flex space-x-6"
            >
              <Link
                href={profile.socials.github}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link
                href={profile.socials.linkedin}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
              >
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link
                href={profile.socials.twitter}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
              >
                <Twitter className="w-6 h-6" />
              </Link>
            </motion.div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-primary font-medium mb-4 font-mono"
              >
                {">"} Hello, I'm
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              >
                {theme === "hacker" ? (
                  <EncryptedText
                    text={profile.name}
                    className="gradient-text"
                  />
                ) : (
                  <Typewriter
                    text={profile.name}
                    delay={100}
                    className="gradient-text"
                  />
                )}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="glass-card p-6 rounded-lg mb-8"
              >
                <div className="text-xl md:text-2xl text-muted-foreground mb-4 font-mono flex items-center gap-2">
                  <span>I'm a</span>
                  <FlipWords 
                    words={roles} 
                    duration={3000}
                    className="text-primary font-bold"
                  />
                </div>
                <div className="text-lg text-muted-foreground max-w-2xl">
                  <TextGenerateEffect 
                    words={profile.summary}
                    duration={0.3}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Button asChild size="lg" className="glow">
                  <Link href="/contact">
                    Get In Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="glass-card"
                  onClick={() => setTerminalOpen(true)}
                >
                  <TerminalIcon className="w-4 h-4 mr-2" />
                  Open Terminal
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="glass-card"
                >
                  <Link href={profile.resumeUrl} target="_blank" download>
                    <Download className="w-4 h-4 mr-2" />
                    Resume
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="flex space-x-6"
              >
                <Link
                  href={profile.socials.github}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href={profile.socials.linkedin}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
                >
                  <Linkedin className="w-6 h-6" />
                </Link>
                <Link
                  href={profile.socials.twitter}
                  target="_blank"
                  className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg"
                >
                  <Twitter className="w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Profile Image - Desktop */}
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-full blur-3xl opacity-20 glow-strong"></div>
                  <Image
                    src={profile.profileImage || "/profile.jpeg"}
                    alt={profile.name}
                    width={320}
                    height={320}
                    className="relative z-10 rounded-full border-4 border-primary/20 glass-card"
                    priority
                  />
                </div>

                {/* Tech Globe - Desktop */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                >
                  <TechGlobe />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
}
