"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface TimelineItem {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  achievements?: string[];
}

interface TimelineProps {
  title: string;
  items: TimelineItem[];
}

export function Timeline({ title, items }: TimelineProps) {
  return (
    <section className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, margin: "-50px" }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title.split(" ")[0]}{" "}
          <span className="gradient-text">{title.split(" ")[1]}</span>
        </h2>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent transform md:-translate-x-1/2"></div>

        <div className="space-y-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              viewport={{ once: true, margin: "-50px" }}
              className={`relative flex ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 mt-6 z-10 glow"></div>

              <Card
                className={`w-full md:w-5/12 ml-12 md:ml-0 glass-card border-border interactive-element ${
                  index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-lg text-foreground">
                      {item.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="w-fit glass border-primary/30 text-primary bg-primary/10"
                    >
                      {item.date}
                    </Badge>
                  </div>
                  <p className="text-primary font-medium">{item.subtitle}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  {item.achievements && item.achievements.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-foreground">
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1 font-bold">
                              •
                            </span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
