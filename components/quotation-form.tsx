"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Send, Loader2 } from "lucide-react"
import { submitQuotation } from "@/lib/data"

interface QuotationFormProps {
  serviceId: string
  serviceTitle: string
}

export function QuotationForm({ serviceId, serviceTitle }: QuotationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const data = {
      service_id: serviceId,
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      project_title: formData.get("project_title"),
      project_description: formData.get("project_description"),
      budget_range: formData.get("budget_range"),
      timeline: formData.get("timeline"),
      requirements: {
         additional_info: formData.get("additional_info")
      }
    }

    const res = await submitQuotation(data)

    if (res.success) {
      toast({
        title: "Quotation Request Sent!",
        description: "We'll review your project and get back to you with a detailed quote.",
      })
      form.reset()
    } else {
      toast({
        title: "Error",
        description: res.message || "Failed to submit quotation. Please try again.",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Request a Quote for {serviceTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input name="name" required placeholder="John Doe" className="glass-card" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input name="email" type="email" required placeholder="john@company.com" className="glass-card" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company (Optional)</label>
              <Input name="company" placeholder="Acme Inc." className="glass-card" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
              <Input name="phone" placeholder="+1 (555) 000-0000" className="glass-card" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Project Title</label>
            <Input name="project_title" placeholder="e.g. E-commerce Website Redesign" className="glass-card" />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Project Description</label>
            <Textarea name="project_description" required placeholder="Describe your project goals, features, and target audience..." rows={4} className="glass-card resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
             <div>
               <label className="text-sm font-medium mb-2 block">Budget Range</label>
                <select name="budget_range" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 glass-card">
                  <option value="">Select Range</option>
                  <option value="<1k">Less than $1k</option>
                  <option value="1k-5k">$1k - $5k</option>
                  <option value="5k-10k">$5k - $10k</option>
                  <option value="10k-25k">$10k - $25k</option>
                  <option value="25k+">$25k+</option>
                </select>
             </div>
             <div>
               <label className="text-sm font-medium mb-2 block">Timeline</label>
                <select name="timeline" className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 glass-card">
                  <option value="">Select Timeline</option>
                  <option value="Urgent">Urgent (&lt; 2 weeks)</option>
                  <option value="Standard">Standard (2-4 weeks)</option>
                  <option value="Relaxed">Flexible (1+ month)</option>
                </select>
             </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full glow" size="lg">
            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 w-4 h-4" />}
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
