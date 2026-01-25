"use client";


import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { ArrowRight, DollarSign, Check } from "lucide-react";

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

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <CardContainer className="inter-var w-full" containerClassName="py-0 h-full">
      <CardBody className="bg-card relative group/card border-border dark:hover:shadow-2xl dark:hover:shadow-primary/[0.1] w-full h-auto rounded-xl p-6 border glass-card">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-foreground flex items-center gap-2"
        >
          {service.title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-muted-foreground text-sm max-w-sm mt-2 line-clamp-2"
        >
          {service.description}
        </CardItem>
        
        <CardItem translateZ="40" className="w-full mt-4">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
             {service.features?.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-primary" />
                  {feature}
                </div>
             ))}
             {service.features?.length > 3 && (
                <div>+{service.features.length - 3} more</div>
             )}
          </div>
        </CardItem>

        <CardItem translateZ="80" className="w-full mt-6 flex justify-between items-end">
             <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Starting from</span>
                <span className="text-2xl font-bold gradient-text">
                  {service.currency} {service.base_price}
                </span>
             </div>
        </CardItem>

        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as={Link}
            href={`/services/${service.slug}`}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors w-full text-center"
          >
            View Details & Quote
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
