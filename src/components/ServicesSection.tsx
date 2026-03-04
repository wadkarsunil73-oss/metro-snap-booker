import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Camera, Heart, Baby, Sparkles, Flower2, Users, Cake, PartyPopper,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Camera, Heart, Baby, Sparkles, Flower2, Users, Cake, PartyPopper,
};

interface Service {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  pricing: string | null;
  slug: string | null;
}

const fallbackServices = [
  { id: "1", icon: "Heart", title: "Pre-Wedding", description: "Romantic pre-wedding shoots at stunning locations", pricing: null, slug: "pre-wedding" },
  { id: "2", icon: "Camera", title: "Wedding", description: "Complete wedding day photography coverage", pricing: null, slug: "wedding" },
  { id: "3", icon: "Baby", title: "Baby Shoot", description: "Adorable baby and newborn photography", pricing: null, slug: "baby-shoot" },
  { id: "4", icon: "Sparkles", title: "Haldi", description: "Vibrant haldi ceremony photography", pricing: null, slug: "haldi" },
  { id: "5", icon: "Flower2", title: "Mehendi", description: "Beautiful mehendi function coverage", pricing: null, slug: "mehendi" },
  { id: "6", icon: "Users", title: "Maternity", description: "Elegant maternity photoshoot sessions", pricing: null, slug: "maternity" },
  { id: "7", icon: "Cake", title: "Birthday", description: "Fun-filled birthday party photography", pricing: null, slug: "birthday" },
  { id: "8", icon: "PartyPopper", title: "Event", description: "Corporate & social event photography", pricing: null, slug: "event" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("services").select("id, title, description, icon, pricing, slug").order("sort_order");
      if (data && data.length > 0) {
        setServices(data.map((s: any) => ({
          ...s,
          slug: s.slug || s.title.toLowerCase().replace(/\s+/g, "-"),
        })));
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">Our Services</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Professional photography for every occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon || "Camera"] || Camera;
            const serviceSlug = s.slug || s.title.toLowerCase().replace(/\s+/g, "-");

            return (
              <motion.div
                key={s.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Link
                  to={`/service/${serviceSlug}`}
                  className="block bg-secondary rounded-xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-gold group relative overflow-hidden"
                  style={{ perspective: "1000px" }}
                >
                  {/* Glassmorphism overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 transform group-hover:-translate-y-1 group-hover:scale-[1.02] transition-transform duration-300">
                    <Icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{s.description}</p>
                    {s.pricing && (
                      <p className="text-sm text-primary font-display mt-2">{s.pricing}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-xs text-primary/70 font-body mt-3 group-hover:text-primary transition-colors">
                      View Details →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
