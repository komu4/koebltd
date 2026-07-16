"use client";

import { motion } from "framer-motion";
import { Shield, Gauge, Headset, Award, LucideIcon } from "lucide-react";
import Container from "@/components/ui/Container";

const iconMap: Record<string, LucideIcon> = {
  shield: Shield,
  gauge: Gauge,
  headset: Headset,
  award: Award,
};

export type FeatureCard = { icon: string; title: string; description: string };

export default function FeatureStrip({ features }: { features: FeatureCard[] }) {
  return (
    <section className="bg-brand-red py-10">
      <Container className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => {
          const Icon = iconMap[f.icon] ?? Shield;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-4"
            >
              <Icon className="mt-1 shrink-0 text-white" size={30} strokeWidth={1.75} />
              <div>
                <h3 className="font-heading font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-white/85">{f.description}</p>
              </div>
            </motion.div>
          );
        })}
      </Container>
    </section>
  );
}
