"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Activity, Calendar, Search } from "lucide-react";
import Link from "next/link";

export default function NetworkPage() {
  interface Appointment {
    _id: string;
    title: string;
    date: string;
    time: string;
    clientName: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token"); // Get token from localStorage

      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?._id;

      if (!userId) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      if (!storedToken) {
        setError("Unauthorized. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/appointments/user/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`, // Add token to request
          },
        });

        if (!response.ok) {
          if (response.status === 401) throw new Error("Unauthorized. Please log in again.");
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format. Expected an array.");
        }

        setAppointments(data);
      } catch (error: any) {
        console.error("Error fetching appointments:", error);
        setError(error.message || "Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Ensure `appointments` is always an array before filtering
  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter((appointment) =>
        appointment.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

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
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/network"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Users className="h-4 w-4" />
            My Records
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">My Appointments & Records</h1>
            <Button>Add Record</Button>
          </div>
        </div>

        <div className="p-4">
          {/* Search Bar */}
          <div className="mt-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          {/* Appointment Listings */}
          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground">Loading records...</p>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <Card key={appointment._id}>
                  <CardHeader>
                    <CardTitle>{appointment.title}</CardTitle>
                    <CardDescription>
                      {appointment.clientName} | {appointment.date} at {appointment.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline">View Details</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-sm text-muted-foreground">No records found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
