"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Dummy Data for Available Vets
const availableVets = [
  { id: "vet1", name: "Dr. Alice Johnson", specialty: "Small Animals", availableTimes: ["10:00 AM", "2:00 PM"] },
  { id: "vet2", name: "Dr. Bob Smith", specialty: "Large Animals", availableTimes: ["9:00 AM", "3:00 PM"] },
  { id: "vet3", name: "Dr. Emily White", specialty: "Exotic Pets", availableTimes: ["11:00 AM", "4:00 PM"] },
];

export default function NewAppointmentModal({ onAppointmentCreated }: { onAppointmentCreated: () => void }) {
  const [step, setStep] = useState(1); // Step 1: Vet selection | Step 2: Form
  const [selectedVet, setSelectedVet] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleVetSelection = (vet: any, time: string) => {
    setSelectedVet(vet);
    setSelectedTime(time);
    setStep(2); // Move to appointment form
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      toast({ title: "Unauthorized", description: "Please log in.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          date,
          time: selectedTime,
          clientName,
          vetId: selectedVet.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.statusText}`);
      }

      toast({ title: "✅ Appointment Created", description: "Your appointment has been scheduled.", variant: "success" });

      // Reset form
      setStep(1);
      setTitle("");
      setDate("");
      setClientName("");
      setSelectedVet(null);
      setSelectedTime("");

      // Notify parent to refresh appointments
      onAppointmentCreated();
    } catch (error: any) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Appointment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Select a Veterinarian" : "Schedule a New Appointment"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            {availableVets.map((vet) => (
              <div key={vet.id} className="border p-4 rounded-lg">
                <h3 className="text-lg font-bold">{vet.name}</h3>
                <p className="text-sm text-gray-500">{vet.specialty}</p>
                <div className="mt-2 flex gap-2">
                  {vet.availableTimes.map((time) => (
                    <Button key={time} variant="outline" onClick={() => handleVetSelection(vet, time)}>
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Veterinarian</Label>
              <p className="font-semibold">{selectedVet.name} ({selectedVet.specialty})</p>
            </div>
            <div>
              <Label>Selected Time</Label>
              <p className="font-semibold">{selectedTime}</p>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Create Appointment"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
