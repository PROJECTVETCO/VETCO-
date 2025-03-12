"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"

interface NewAppointmentModalProps {
  onAppointmentCreated: () => void
}

export function NewAppointmentModal({ onAppointmentCreated }: NewAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("farm-visit");
  const [availableVets, setAvailableVets] = useState<Vet[]>([]);
  const [filteredVets, setFilteredVets] = useState<Vet[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  interface Vet {
    id: string;
    name: string;
    specialty: string;
    location: string;
    rating: number;
    avatar: string;
    availableSlots: {
      date: string;
      slots: string[];
    }[];
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vetco.onrender.com";

  useEffect(() => {
    async function fetchVets() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vets`);
        if (!response.ok) throw new Error("Failed to fetch vets");
        const data = await response.json();
        setAvailableVets(data);
        setFilteredVets(data);
      } catch (err) {
        console.error("Error fetching vets:", err);
      }
    }
    fetchVets();
  }, []);

  useEffect(() => {
    if (specialtyFilter === "all") {
      setFilteredVets(availableVets);
    } else {
      setFilteredVets(
        availableVets.filter((vet) => vet.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()))
      );
    }
  }, [specialtyFilter, availableVets]);

  useEffect(() => {
    setSelectedVet("");
    setSelectedTimeSlot("");
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const appointmentData = {
      date: selectedDate,
      time: selectedTimeSlot,
      vetId: selectedVet,
      type: appointmentType,
      reason: formData.get("reason"),
      notes: formData.get("notes"),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(`${API_BASE_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

      setOpen(false);
      toast({
        title: "Appointment scheduled",
        description: `Your appointment is set for ${selectedDate} at ${selectedTimeSlot}`,
      });
      onAppointmentCreated();
    } catch (error) {
      setError((error as Error).message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white hover:bg-green-700">New Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Book a consultation with one of our veterinary specialists.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="date" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="date">1. Select Date</TabsTrigger>
              <TabsTrigger value="vet" disabled={!selectedDate}>
                2. Select Vet
              </TabsTrigger>
              <TabsTrigger value="details" disabled={!selectedDate || !selectedVet || !selectedTimeSlot}>
                3. Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="date" className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3 relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      className="pl-10"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="appointmentType" className="text-right">
                    Type
                  </Label>
                  <RadioGroup className="col-span-3" value={appointmentType} onValueChange={setAppointmentType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="farm-visit" id="farm-visit" />
                      <Label htmlFor="farm-visit">Farm Visit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="clinic" id="clinic" />
                      <Label htmlFor="clinic">Clinic Visit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="virtual" id="virtual" />
                      <Label htmlFor="virtual">Virtual Consultation</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    disabled={!selectedDate}
                    onClick={() => {
                      const tabTrigger = document.querySelector('[data-state="inactive"][value="vet"]') as HTMLElement
                      if (tabTrigger) tabTrigger.click()
                    }}
                  >
                    Next: Select Vet
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vet" className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Available Veterinarians</h3>
                  <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specialties</SelectItem>
                      <SelectItem value="large animal">Large Animal</SelectItem>
                      <SelectItem value="dairy">Dairy</SelectItem>
                      <SelectItem value="poultry">Poultry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {filteredVets.filter((vet) => vet.availableSlots.some((slot) => slot.date === selectedDate))
                    .length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No veterinarians available on the selected date
                    </div>
                  ) : (
                    filteredVets
                      .filter((vet) => vet.availableSlots.some((slot) => slot.date === selectedDate))
                      .map((vet) => (
                        <div
                          key={vet.id}
                          className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${selectedVet === vet.id ? "bg-muted" : "hover:bg-muted/50"}`}
                          onClick={() => setSelectedVet(vet.id)}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={vet.avatar} alt={vet.name} />
                            <AvatarFallback>{vet.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{vet.name}</h4>
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-1">{vet.rating}</span>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{vet.specialty}</p>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="mr-1 h-3 w-3" />
                              {vet.location}
                            </div>

                            {selectedVet === vet.id && (
                              <div className="mt-3">
                                <Label className="text-xs">Available Time Slots</Label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {getAvailableTimeSlots(vet.id).map((slot) => (
                                    <Badge
                                      key={slot}
                                      variant={selectedTimeSlot === slot ? "default" : "outline"}
                                      className="cursor-pointer"
                                      onClick={() => setSelectedTimeSlot(slot)}
                                    >
                                      {slot}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabTrigger = document.querySelector('[data-state="inactive"][value="date"]') as HTMLElement
                      if (tabTrigger) tabTrigger.click()
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={!selectedVet || !selectedTimeSlot}
                    onClick={() => {
                      const tabTrigger = document.querySelector(
                        '[data-state="inactive"][value="details"]',
                      ) as HTMLElement
                      if (tabTrigger) tabTrigger.click()
                    }}
                  >
                    Next: Add Details
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="py-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/30">
                  <h3 className="font-medium">Appointment Summary</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {selectedTimeSlot}
                    </p>
                    <p>
                      <span className="font-medium">Vet:</span> {availableVets.find((v) => v.id === selectedVet)?.name}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {appointmentType === "farm-visit"
                        ? "Farm Visit"
                        : appointmentType === "clinic"
                          ? "Clinic Visit"
                          : "Virtual Consultation"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reason" className="text-right">
                    Reason
                  </Label>
                  <Input
                    id="reason"
                    name="reason"
                    className="col-span-3"
                    placeholder="Brief reason for visit"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    className="col-span-3"
                    placeholder="Additional details about your animal's condition"
                    rows={3}
                  />
                </div>
                {error && <div className="text-sm text-red-500 text-center">{error}</div>}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabTrigger = document.querySelector('[data-state="inactive"][value="vet"]') as HTMLElement
                      if (tabTrigger) tabTrigger.click()
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </DialogContent>
    </Dialog>
  )
}

