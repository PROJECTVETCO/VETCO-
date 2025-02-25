"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function MedicalRecordModal({ isOpen, onClose, onRecordAdded }: { isOpen: boolean; onClose: () => void; onRecordAdded: () => void }) {
  interface Patient {
    _id: string;
    name: string;
  }

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [medications, setMedications] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vet/patients`);
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []); // ✅ Ensure data is an array
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]); // ✅ Fallback to empty array
      }
    }
  
    fetchPatients();
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!patientId || !diagnosis.trim() || !treatment.trim()) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/vet/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          diagnosis,
          treatment,
          medications,
          followUpDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save medical record");
      }

      toast({ title: "Success", description: "Medical record added successfully." });
      setPatientId("");
      setDiagnosis("");
      setTreatment("");
      setMedications("");
      setFollowUpDate("");
      onRecordAdded();
      onClose(); // Close modal after submission
    } catch (error) {
      toast({ title: "Error", description: "Failed to add medical record." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Medical Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="patient">Select Patient</Label>
            <select
            id="patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full border px-2 py-2 rounded bg-white text-black"
            >
            <option value="">-- Select Patient --</option>
            {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                {patient.name}
                </option>
            ))}
            </select>

          </div>
          <div>
            <Label htmlFor="diagnosis">Diagnosis</Label>
            <Textarea id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required placeholder="Enter diagnosis" />
          </div>
          <div>
            <Label htmlFor="treatment">Treatment Plan</Label>
            <Textarea id="treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} required placeholder="Enter treatment plan" />
          </div>
          <div>
            <Label htmlFor="medications">Prescribed Medications</Label>
            <Input id="medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="Enter medications" />
          </div>
          <div>
            <Label htmlFor="followUpDate">Follow-up Date</Label>
            <Input id="followUpDate" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Record"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
