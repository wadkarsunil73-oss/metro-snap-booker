import { useState } from "react";
import { Camera, Menu, X } from "lucide-react";

interface NavbarProps {
  onBookNow: () => void;
}

const Navbar = ({ onBookNow }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-gold-gradient">Metro Photo Studio</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ["Home", "hero"],
            ["Gallery", "gallery"],
            ["Services", "services"],
            ["Contact", "contact"],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-body text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            onClick={onBookNow}
            className="bg-gold-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Book Now
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {[
              ["Home", "hero"],
              ["Gallery", "gallery"],
              ["Services", "services"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-muted-foreground hover:text-primary transition-colors py-2"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { onBookNow(); setIsOpen(false); }}
              className="bg-gold-gradient text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold mt-2"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
