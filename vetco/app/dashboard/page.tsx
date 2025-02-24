'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Users, Activity } from "lucide-react"
import NewAppointmentModal from "@/components/NewAppointmentModal";
import Link from "next/link"

export default function DashboardPage() {
  const [refreshAppointments, setRefreshAppointments] = useState(false);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [error, setError] = useState<string | null>(null);
  interface Activity {
    id: string;
    color: string;
    status: string;
    description: string;
  }

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
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
          return;
        }
  
        console.log("🔍 Sending token:", token); // Debugging: Log token before sending
  
        // Fetch total appointments
        const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ Ensure token is sent
          },
          credentials: "include", // ✅ Helps with authentication headers
        });
  
        if (!statsResponse.ok) {
          console.error(`❌ Stats Fetch Error (${statsResponse.status}):`, await statsResponse.text());
          throw new Error(`Stats Fetch Error: ${statsResponse.statusText}`);
        }
  
        const statsData = await statsResponse.json();
        setTotalAppointments(statsData.totalAppointments);
        console.log("✅ Stats Data Received:", statsData); // Debugging: Log API response
  
        // Fetch recent activity
        const activityResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-activity`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ Ensure token is sent
          },
          credentials: "include", // ✅ Helps prevent issues with cross-origin requests
        });
  
        if (!activityResponse.ok) {
          console.error(`❌ Activity Fetch Error (${activityResponse.status}):`, await activityResponse.text());
          throw new Error(`Activity Fetch Error: ${activityResponse.statusText}`);
        }
  
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
        console.log("✅ Activity Data Received:", activityData); // Debugging: Log API response
  
      } catch (error) {
        console.error("🔥 Error fetching dashboard data:", error);
        setError(error.message || "Failed to fetch data.");
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
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
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
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/network"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Network
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
                <p className="text-xs text-muted-foreground">Total booked</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network Size</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
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
                      <div className={`h-8 w-8 rounded-full bg-${activity.color}-100`}></div>
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
  )
}


