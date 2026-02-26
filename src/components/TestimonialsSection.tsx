import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya & Rohit Sharma",
    category: "Wedding",
    rating: 5,
    text: "Absolutely stunning work! Every frame captured the magic of our wedding day. The team was professional and made us feel so comfortable.",
  },
  {
    name: "Sneha Patil",
    category: "Maternity",
    rating: 5,
    text: "The maternity shoot was beyond beautiful. They knew exactly how to make me feel confident and the photos turned out like a dream.",
  },
  {
    name: "Amit & Neha Desai",
    category: "Pre-Wedding",
    rating: 5,
    text: "Our pre-wedding shoot was so much fun! The locations, the poses, the final edits — everything was perfect. Highly recommend!",
  },
  {
    name: "Kavita Joshi",
    category: "Baby Shoot",
    rating: 5,
    text: "They captured our little one's expressions so naturally. The patience and creativity of the team is truly remarkable.",
  },
  {
    name: "Rajesh & Meena Kulkarni",
    category: "Haldi",
    rating: 5,
    text: "The haldi ceremony photos were vibrant and full of life. Every candid moment was captured beautifully. Amazing work!",
  },
  {
    name: "Anita Verma",
    category: "Birthday Shoot",
    rating: 4,
    text: "My daughter's birthday party was captured so well. The team blended in and caught every joyful moment perfectly.",
  },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
          <span className="text-gold-gradient">What Our Clients Say</span>
        </h2>
        <p className="text-muted-foreground font-body max-w-lg mx-auto">
          Real stories from families who trusted us with their precious moments
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/40 hover:shadow-gold transition-all"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }, (_, s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s < t.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-4">
              "{t.text}"
            </p>
            <div className="border-t border-border pt-3">
              <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
              <p className="text-xs text-primary font-body">{t.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
