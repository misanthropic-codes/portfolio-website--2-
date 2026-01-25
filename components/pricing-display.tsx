"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface PricingDisplayProps {
  slug: string
  fallbackPrice: number
  fallbackCurrency: string
}

export function PricingDisplay({ slug, fallbackPrice, fallbackCurrency }: PricingDisplayProps) {
  const [price, setPrice] = useState<{ amount: number; currency: string; region?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch(`https://api.misanthropic.codes/api/services/${slug}/price`);
        const json = await res.json();
        if (json.success && json.data.pricing) {
          // API returns price as a string "100.00"
          const amount = json.data.pricing.finalPrice || json.data.pricing.price;
          setPrice({
            amount: typeof amount === 'string' ? parseFloat(amount) : amount,
            currency: json.data.pricing.currency,
            region: json.data.pricing.region
          });
        }
      } catch (e) {
        console.error("Failed to fetch dynamic pricing", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPricing();
  }, [slug]);

  if (loading) return <div className="flex items-center text-muted-foreground"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating regional pricing...</div>

  const displayPrice = price ? price.amount : fallbackPrice;
  const displayCurrency = price ? price.currency : fallbackCurrency;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-xl glass-card border border-primary/20 bg-primary/5 text-center"
    >
      <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
        {price?.region && price.region !== "Unknown" ? `Estimated Price (${price.region})` : "Estimated Starting Price"}
      </p>
      <div className="text-4xl font-bold gradient-text">
        {displayCurrency} {(displayPrice || 0).toLocaleString()}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {price?.region && price.region !== "Unknown" 
          ? "*Price adjusted for your region." 
          : "*Base price shown. Final quote may vary based on requirements."}
      </p>
    </motion.div>
  )
}
