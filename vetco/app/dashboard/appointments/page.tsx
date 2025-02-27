"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Activity } from "lucide-react";
import Link from "next/link";
import NewAppointmentModal from "@/components/NewAppointmentModal"; // ✅ Import the Modal

export default function AppointmentsPage() {
  interface Appointment {
    _id: string;
    title: string;
    date: string;
    time: string;
    clientName: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // ✅ Manage modal state
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);

      if (typeof window === "undefined") return;

      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        setError("Unauthorized. Please log in.");
        router.push("/login");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user._id;

      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/appointments/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          setError("Unauthorized. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error: any) {
        console.error("Error fetching appointments:", error);
        setError(error.message || "Failed to fetch appointments.");
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

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
          <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/appointments" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link href="/dashboard/network" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Users className="h-4 w-4" />
            Farmer Records
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Appointments</h1>
            <Button onClick={() => setShowModal(true)}>New Appointment</Button> {/* ✅ Open Modal */}
          </div>
        </div>

        <div className="p-4">
          {/* Appointment Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">Total scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter((a) => new Date(a.date) > new Date()).length}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled Appointments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Appointments */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading appointments...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : appointments.length === 0 ? (
                <p className="text-muted-foreground">No upcoming appointments.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-green-100"></div>
                      <div>
                        <p className="text-sm font-medium">{appointment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time} - {appointment.clientName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* New Appointment Modal */}
      {showModal && <NewAppointmentModal isOpen={showModal} onClose={() => setShowModal(false)} onAppointmentCreated={() => setShowModal(false)} />}
    </div>
  );
}
