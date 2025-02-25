"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Users, Activity, ClipboardCheck, Search } from "lucide-react";
import NewAppointmentModal from "@/components/NewAppointmentModal";
import Link from "next/link";


export default function DashboardPage() {
  const router = useRouter();
  const [refreshAppointments, setRefreshAppointments] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [activeChats, setActiveChats] = useState(0);
  const [networkSize, setNetworkSize] = useState(0);
  const [responseRate, setResponseRate] = useState(0);
  interface Activity {
    id: string;
    status: string;
    description: string;
  }

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vetco.onrender.com";

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

        // Fetch Dashboard Stats
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
        setActiveChats(statsData.activeChats || 0);
        setNetworkSize(statsData.networkSize || 0);
        setResponseRate(statsData.responseRate || 0);

        // Fetch Recent Activity
        const activityResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-activity`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!activityResponse.ok) {
          throw new Error(`Activity Fetch Error: ${activityResponse.statusText}`);
        }

        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      } catch (error) {
        console.error("🔥 Error fetching dashboard data:", error);
        if (error instanceof Error) {
          setError(error.message || "Failed to fetch data.");
        } else {
          setError("Failed to fetch data.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [refreshAppointments]);

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
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
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
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
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
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <NewAppointmentModal onAppointmentCreated={() => setRefreshAppointments(!refreshAppointments)} />
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
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : activeChats}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : networkSize}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : `${responseRate}%`}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading activity...</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-full bg-gray-200`}></div>
                      <div>
                        <p className="text-sm font-medium">{activity.status}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
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
