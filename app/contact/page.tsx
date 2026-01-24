import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"
import { getProfile } from "@/lib/data"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Abhishek Kumar for collaboration opportunities, project inquiries, or just to say hello.",
}

export const revalidate = 60;

export default async function ContactPage() {
  const profile = await getProfile();
  
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <ContactInfo profile={profile} />
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
