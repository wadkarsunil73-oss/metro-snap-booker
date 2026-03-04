import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, MessageCircle, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryFormDialog, { type InquiryData } from "@/components/InquiryFormDialog";
import MeetingScheduler from "@/components/MeetingScheduler";
import PaymentSection from "@/components/PaymentSection";

interface ServiceData {
  id: string;
  title: string;
  description: string | null;
  summary: string | null;
  icon: string | null;
  pricing: string | null;
  packages: any[] | null;
  cover_image_url: string | null;
  gallery_images: string[] | null;
  slug: string | null;
}

type BookingStep = "closed" | "inquiry" | "meeting" | "payment";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<BookingStep>("closed");
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [meetingTime, setMeetingTime] = useState("");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) {
        setService({
          ...data,
          summary: (data as any).summary ?? null,
          packages: (data as any).packages ?? [],
          cover_image_url: (data as any).cover_image_url ?? null,
          gallery_images: (data as any).gallery_images ?? [],
          slug: (data as any).slug ?? null,
        });
      }
      setLoading(false);
    };
    fetchService();
  }, [slug]);

  const openBooking = () => setStep("inquiry");

  const handleInquirySubmit = (data: InquiryData) => {
    setInquiryData(data);
    setStep("meeting");
  };

  const handleMeetingSubmit = (date: Date, time: string) => {
    setMeetingDate(date);
    setMeetingTime(time);
    setStep("payment");
  };

  const handleComplete = () => {
    setStep("closed");
    setInquiryData(null);
    setMeetingDate(null);
    setMeetingTime("");
  };

  const sendWhatsAppInquiry = () => {
    const msg = encodeURIComponent(
      `Hi! I'm interested in your ${service?.title} photography service. Can you share more details?`
    );
    window.open(`https://wa.me/919324236203?text=${msg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-body">Loading...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-body text-lg">Service not found</p>
        <Link to="/" className="text-primary hover:underline font-body">← Back to Home</Link>
      </div>
    );
  }

  const galleryImages = service.gallery_images?.length ? service.gallery_images : [];
  const packages = Array.isArray(service.packages) ? service.packages : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={openBooking} />

      {/* Hero / Cover */}
      <section className="relative pt-20">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {service.cover_image_url ? (
            <img
              src={service.cover_image_url}
              alt={service.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-card to-secondary flex items-center justify-center">
              <Camera className="h-24 w-24 text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-body mb-4">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gold-gradient mb-2">
                {service.title}
              </h1>
              {service.pricing && (
                <p className="text-primary font-display text-xl">{service.pricing}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Summary */}
              {service.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card/50 backdrop-blur border border-border rounded-2xl p-6 md:p-8"
                >
                  <p className="text-lg text-muted-foreground font-body leading-relaxed">
                    {service.summary}
                  </p>
                </motion.div>
              )}

              {/* Full Description */}
              {service.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Service</h2>
                  <div className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                    {service.description}
                  </div>
                </motion.div>
              )}

              {/* Packages */}
              {packages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Packages</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {packages.map((pkg: any, i: number) => (
                      <div
                        key={i}
                        className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-gold transition-all"
                      >
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                          {pkg.name || `Package ${i + 1}`}
                        </h3>
                        {pkg.price && (
                          <p className="text-primary font-display text-xl font-bold mb-3">{pkg.price}</p>
                        )}
                        {pkg.features && (
                          <ul className="space-y-1.5">
                            {(Array.isArray(pkg.features) ? pkg.features : []).map((f: string, j: number) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground font-body">
                                <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Sample Gallery */}
              {galleryImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">Sample Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {galleryImages.map((img: string, i: number) => (
                      <div
                        key={i}
                        className="aspect-[4/3] overflow-hidden rounded-xl border border-border cursor-pointer group"
                        onClick={() => setLightboxImg(img)}
                      >
                        <img
                          src={img}
                          alt={`${service.title} sample ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24 space-y-4"
              >
                <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                  <h3 className="font-display text-xl font-bold text-foreground">Interested?</h3>
                  <p className="text-sm text-muted-foreground font-body">
                    Book your {service.title.toLowerCase()} session today!
                  </p>
                  <Button
                    onClick={openBooking}
                    className="w-full bg-gold-gradient text-primary-foreground font-semibold py-3 h-auto"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                  <Button
                    onClick={sendWhatsAppInquiry}
                    variant="outline"
                    className="w-full border-primary/30 text-primary hover:bg-primary/10 py-3 h-auto"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Inquiry
                  </Button>
                  <a
                    href="tel:9324236203"
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body py-2"
                  >
                    <Phone className="h-4 w-4" /> +91 93242 36203
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
      <WhatsAppButton />

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImg(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightboxImg}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* Booking Flow */}
      <InquiryFormDialog
        open={step === "inquiry"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSubmit={handleInquirySubmit}
        defaultCategory={service.title}
      />
      <MeetingScheduler
        open={step === "meeting"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSubmit={handleMeetingSubmit}
      />
      <PaymentSection
        open={step === "payment"}
        onOpenChange={(open) => !open && setStep("closed")}
        inquiryData={inquiryData}
        meetingDate={meetingDate}
        meetingTime={meetingTime}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default ServiceDetail;
