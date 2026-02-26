import { useState } from "react";
import { galleryImages, categories, type GalleryCategory } from "@/data/galleryData";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GallerySection = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeCategory === "All" ? galleryImages : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const navigate = (dir: 1 | -1) => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + dir + filtered.length) % filtered.length);
  };

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">Our Sample Work</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Browse through our portfolio across various photography categories
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gold-gradient text-primary-foreground shadow-gold"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((img, idx) => (
            <div
              key={img.src}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid cursor-pointer group overflow-hidden rounded-lg border border-border hover:border-primary/40 transition-all"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIdx !== null && (
          <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-foreground hover:text-primary z-10">
              <X className="h-8 w-8" />
            </button>
            <button onClick={() => navigate(-1)} className="absolute left-4 text-foreground hover:text-primary">
              <ChevronLeft className="h-10 w-10" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-4 text-foreground hover:text-primary">
              <ChevronRight className="h-10 w-10" />
            </button>
            <img
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg animate-scale-in"
            />
            <div className="absolute bottom-6 text-center">
              <span className="text-sm text-muted-foreground font-body bg-card/80 px-4 py-2 rounded-full">
                {filtered[lightboxIdx].category} · {lightboxIdx + 1} / {filtered.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
