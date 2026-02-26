import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GallerySection from "@/components/GallerySection";
import ServicesSection from "@/components/ServicesSection";
import InstagramSection from "@/components/InstagramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import InquiryFormDialog, { type InquiryData } from "@/components/InquiryFormDialog";
import MeetingScheduler from "@/components/MeetingScheduler";
import PaymentSection from "@/components/PaymentSection";

type BookingStep = "closed" | "inquiry" | "meeting" | "payment";

const Index = () => {
  const [step, setStep] = useState<BookingStep>("closed");
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [meetingDate, setMeetingDate] = useState<Date | null>(null);
  const [meetingTime, setMeetingTime] = useState("");

  // Auto popup on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      const visited = sessionStorage.getItem("metro_visited");
      if (!visited) {
        setStep("inquiry");
        sessionStorage.setItem("metro_visited", "1");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onBookNow={openBooking} />
      <HeroSection onBookNow={openBooking} />
      <ServicesSection />
      <GallerySection />
      <TestimonialsSection />
      <InstagramSection />
      <FooterSection />
      <WhatsAppButton />

      <InquiryFormDialog
        open={step === "inquiry"}
        onOpenChange={(open) => !open && setStep("closed")}
        onSubmit={handleInquirySubmit}
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

export default Index;
