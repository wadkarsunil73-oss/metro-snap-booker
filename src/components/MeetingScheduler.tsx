import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const timeSlots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM"];

interface MeetingSchedulerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (date: Date, time: string) => void;
}

const MeetingScheduler = ({ open, onOpenChange, onSubmit }: MeetingSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSubmit(selectedDate, selectedTime);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-5 w-5 text-primary" />
            <DialogTitle className="font-display text-xl text-gold-gradient">Schedule Meeting</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground font-body">Pick a date and time for your consultation</p>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground font-body mb-3 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Select Date
            </h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < tomorrow}
                className="rounded-lg border border-border bg-secondary"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground font-body mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Select Time
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-body font-medium transition-all ${
                    selectedTime === slot
                      ? "bg-gold-gradient text-primary-foreground shadow-gold"
                      : "bg-secondary text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {selectedDate && selectedTime && (
            <div className="bg-secondary rounded-lg p-3 border border-border animate-fade-in">
              <p className="text-sm text-muted-foreground font-body">
                Selected: <span className="text-primary font-semibold">{format(selectedDate, "PPP")}</span> at{" "}
                <span className="text-primary font-semibold">{selectedTime}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingScheduler;
