import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
//...
import data from "@/data/data.json"

export function Footer({ profile = data.bio }: { profile?: typeof data.bio }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="gradient-text">{profile.name}</span>
            </h3>
            <p className="text-muted-foreground mb-4">
              Full Stack Developer passionate about creating innovative web solutions.
            </p>
            <div className="flex space-x-4">
              <Link
                href={profile.socials.github}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg interactive-element"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href={profile.socials.linkedin}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg interactive-element"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href={profile.socials.twitter}
                target="_blank"
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg interactive-element"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href={`mailto:${profile.email}`}
                className="text-muted-foreground hover:text-primary transition-colors p-2 glass rounded-lg interactive-element"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* ... Quick Links ... */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition-colors interactive-element"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="block text-muted-foreground hover:text-primary transition-colors interactive-element"
              >
                Projects
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors interactive-element"
              >
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Get In Touch</h4>
            <p className="text-muted-foreground mb-2">{profile.email}</p>
            <p className="text-muted-foreground">{profile.location}</p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {currentYear} Abhishek Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
