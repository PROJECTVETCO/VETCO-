"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, Users, Activity, ClipboardCheck, Stethoscope, ClipboardList, Search } from "lucide-react";
import Link from "next/link";

export default function PatientsPage() {
  interface Patient {
    _id: string;
    name: string;
    species: string;
    breed: string;
    owner: string;
    lastVisit: string;
  }

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?._id;

      if (!userId || !storedToken) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/vet/patients`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch (error: any) {
        setError(error.message || "Failed to fetch patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-600"></div>
            <span className="font-bold">VetCo</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/dashboard/vet"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/vet/appointments"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/dashboard/vet/messages"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/vet/patients"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            Patients
          </Link>
          <Link
            href="/dashboard/vet/records"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <ClipboardCheck className="h-4 w-4" />
            Medical Records
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">My Patients</h1>
            <Button>Add New Patient</Button>
          </div>
        </div>

        <div className="p-4">
          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {/* Patient Listings */}
          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground">Loading patients...</p>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <Card key={patient._id}>
                  <CardHeader>
                    <CardTitle>{patient.name} ({patient.species})</CardTitle>
                    <CardDescription>
                      Breed: {patient.breed} | Owner: {patient.owner}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Last Visit: {patient.lastVisit}</p>
                    <Button variant="outline">View Details</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">No patients found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
