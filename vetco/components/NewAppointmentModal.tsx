"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function NewAppointmentModal({ onAppointmentCreated }: { onAppointmentCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [vetId, setVetId] = useState(""); // Optional vet assignment
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      toast({
        title: "Unauthorized",
        description: "Please log in to create an appointment.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include authentication token
        },
        body: JSON.stringify({
          title,
          date,
          time,
          clientName,
          vetId: vetId || null, // Optional
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create appointment: ${response.statusText}`);
      }

      toast({
        title: "✅ Appointment Created",
        description: `Your appointment has been scheduled.`,
        variant: "success",
      });

      // Reset form
      setTitle("");
      setDate("");
      setTime("");
      setClientName("");
      setVetId("");

      // Notify parent to refresh appointments
      onAppointmentCreated();
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      });
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
          <DialogTitle>Schedule a New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="vetId">Assign a Veterinarian (Optional)</Label>
            <Input id="vetId" value={vetId} onChange={(e) => setVetId(e.target.value)} placeholder="Vet ID (if available)" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Create Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
