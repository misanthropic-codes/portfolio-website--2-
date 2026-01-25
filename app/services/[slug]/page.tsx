import { getService } from "@/lib/data"
import { notFound } from "next/navigation"
import { PricingDisplay } from "@/components/pricing-display"
import { QuotationForm } from "@/components/quotation-form"
import { Badge } from "@/components/ui/badge"
import { Check, Calendar, Activity } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.title} - Services`,
    description: service.tagline,
  }
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Details */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className="text-4xl">{service.icon}</span>
                 <h1 className="text-4xl font-bold">{service.title}</h1>
              </div>
              <p className="text-xl text-muted-foreground">{service.tagline}</p>
              <div className="mt-4 flex gap-2">
                 <Badge variant="secondary"><Activity className="w-3 h-3 mr-1"/> {service.pricing_type}</Badge>
                 <Badge variant="outline"><Calendar className="w-3 h-3 mr-1"/> {service.timeline}</Badge>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
               <h3 className="text-xl font-semibold mb-4 text-primary">About this Service</h3>
               <p className="whitespace-pre-wrap leading-relaxed opacity-90">{service.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
               <div className="glass-card p-5 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Key Features
                  </h4>
                  <ul className="space-y-2">
                    {service.features?.map((feature: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="glass-card p-5 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {service.deliverables?.map((item: string, i: number) => (
                       <li key={i} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
            
             <PricingDisplay 
                slug={service.slug} 
                fallbackPrice={service.base_price} 
                fallbackCurrency={service.currency} 
             />

          </div>

          {/* Right Column: Quote Form */}
          <div className="lg:sticky lg:top-24">
            <QuotationForm serviceId={service.id} serviceTitle={service.title} />
          </div>

        </div>
      </div>
    </div>
  )
}
