import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Upload, CheckCircle, Send } from "lucide-react";
import { InquiryData } from "./InquiryFormDialog";
import { format } from "date-fns";
import { toast } from "sonner";

interface PaymentSectionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiryData: InquiryData | null;
  meetingDate: Date | null;
  meetingTime: string;
  onComplete: () => void;
}

const PaymentSection = ({ open, onOpenChange, inquiryData, meetingDate, meetingTime, onComplete }: PaymentSectionProps) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB");
        return;
      }
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!screenshot || !inquiryData || !meetingDate) return;
    setSubmitting(true);

    // Build WhatsApp message
    const msg = encodeURIComponent(
      `🎬 *New Booking Confirmed - Metro Photo Studio*\n\n` +
      `👤 Name: ${inquiryData.fullName}\n` +
      `📧 Email: ${inquiryData.email}\n` +
      `📱 Phone: ${inquiryData.phone}\n` +
      `💬 WhatsApp: ${inquiryData.whatsapp}\n` +
      `📸 Category: ${inquiryData.shootCategory}\n` +
      `📍 Address: ${inquiryData.address}\n` +
      `📅 Meeting: ${format(meetingDate, "PPP")} at ${meetingTime}\n` +
      `💰 Payment: ₹5 Confirmation Paid\n` +
      `📎 Payment screenshot attached separately`
    );

    const whatsappUrl = `https://wa.me/919324236203?text=${msg}`;
    window.open(whatsappUrl, "_blank");

    toast.success("Booking confirmed! WhatsApp message opened.");
    setSubmitting(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-xl text-gold-gradient">Payment Confirmation</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground font-body">Pay ₹5 to confirm your meeting</p>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Amount */}
          <div className="bg-secondary rounded-xl p-6 text-center border border-border">
            <p className="text-sm text-muted-foreground font-body mb-2">Meeting Confirmation Fee</p>
            <p className="font-display text-4xl font-bold text-gold-gradient">₹5</p>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-body mb-3">Scan QR code to pay via UPI</p>
            <div className="inline-block rounded-xl overflow-hidden border-2 border-primary/30 shadow-gold">
              <img
                src="/images/qr-code.jpg"
                alt="UPI QR Code for payment"
                className="w-56 h-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-body">UPI ID: sunilwadkar19730@oksbi</p>
          </div>

          {/* Upload screenshot */}
          <div>
            <p className="text-sm font-semibold text-foreground font-body mb-2 flex items-center gap-2">
              <Upload className="h-4 w-4 text-primary" />
              Upload Payment Screenshot *
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Payment screenshot" className="max-h-40 mx-auto rounded-lg" />
                  <p className="text-xs text-primary font-body flex items-center justify-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Screenshot uploaded
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-body">Click to upload screenshot</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!screenshot || submitting}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            Confirm & Send to WhatsApp
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSection;
