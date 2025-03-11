"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Activity, ClipboardCheck } from "lucide-react";
import NewAppointmentModal from "@/components/NewAppointmentModal";
import Link from "next/link";

export default function VetAppointmentsDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No authentication token found. Redirecting to login...");
          setError("Unauthorized. Please log in.");
          router.push("/login");
          return;
        }

        // Fetch Appointments Stats
        const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (statsResponse.status === 401) {
          console.error("❌ Unauthorized: Token expired. Redirecting to login...");
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const statsData = await statsResponse.json();
        setTotalAppointments(statsData.totalAppointments || 0);
        setUpcomingAppointments(statsData.upcomingAppointments || 0);
        setCancelledAppointments(statsData.cancelledAppointments || 0);

        // Fetch Appointments
        const appointmentsResponse = await fetch(`${API_BASE_URL}/api/vet/appointments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!appointmentsResponse.ok) {
          throw new Error(`Appointments Fetch Error: ${appointmentsResponse.statusText}`);
        }

        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("🔥 Error fetching vet appointments:", error);
        setError(error.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-green-600"></div>
            <span className="font-bold"></span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link href="/dashboard/vet" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/vet/appointments" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link href="/dashboard/vet/messages" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link href="/dashboard/vet/patients" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Users className="h-4 w-4" />
            Farmers
          </Link>
          <Link href="/dashboard/vet/records" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <ClipboardCheck className="h-4 w-4" />
            Farmer Records
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Vet Appointments</h1>
            <NewAppointmentModal onAppointmentCreated={function (): void {
              throw new Error("Function not implemented.");
            } } />
          </div>
        </div>

        <div className="p-4">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : totalAppointments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : upcomingAppointments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cancelled Appointments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : cancelledAppointments}</div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading appointments...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
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
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
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
    </div>
  );
}
