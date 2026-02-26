import { Camera, Heart, Baby, Sparkles, Flower2, Users, Cake, PartyPopper } from "lucide-react";

const services = [
  { icon: Heart, title: "Pre-Wedding", desc: "Romantic pre-wedding shoots at stunning locations" },
  { icon: Camera, title: "Wedding", desc: "Complete wedding day photography coverage" },
  { icon: Baby, title: "Baby Shoot", desc: "Adorable baby and newborn photography" },
  { icon: Sparkles, title: "Haldi", desc: "Vibrant haldi ceremony photography" },
  { icon: Flower2, title: "Mehendi", desc: "Beautiful mehendi function coverage" },
  { icon: Users, title: "Maternity", desc: "Elegant maternity photoshoot sessions" },
  { icon: Cake, title: "Birthday", desc: "Fun-filled birthday party photography" },
  { icon: PartyPopper, title: "Event", desc: "Corporate & social event photography" },
];

const ServicesSection = () => (
  <section id="services" className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          <span className="text-gold-gradient">Our Services</span>
        </h2>
        <p className="text-muted-foreground font-body max-w-lg mx-auto">
          Professional photography for every occasion
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-secondary rounded-xl p-6 border border-border hover:border-primary/40 transition-all hover:shadow-gold group"
          >
            <Icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground font-body">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
