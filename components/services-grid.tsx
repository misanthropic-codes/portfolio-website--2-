"use client"

import { motion } from "framer-motion"
import { ServiceCard } from "@/components/service-card"

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  pricing_type: string;
  base_price: number;
  currency: string;
  features: string[];
}

interface ServicesGridProps {
  services: Service[]
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
          className="h-full"
        >
          <ServiceCard service={service} />
        </motion.div>
      ))}
    </div>
  )
}
