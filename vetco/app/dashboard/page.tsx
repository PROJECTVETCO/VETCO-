"use client"

import { useState, useEffect } from "react"
import { Activity, AlertTriangle, Calendar, MessageSquare, Users } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import  NewAppointmentModal  from "../../components/NewAppointmentModal"
import { DoctorCarousel } from "../../components/doctor-carousel"
import { DashboardLayout } from "../../components/dashboard-layout";

export default function DashboardPage() {
  const [refreshAppointments, setRefreshAppointments] = useState(false)
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  interface Activity {
    id: string
    color: string
    status: string
    description: string
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vetco.onrender.com"

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Check for token
        const token = localStorage.getItem("token")

        if (!token) {
          console.log("🔍 No authentication token found. Using demo mode.")
          // Provide mock data for demo/development purposes
          setTotalAppointments(12)
          setRecentActivity([
            {
              id: "1",
              color: "green",
              status: "Appointment Confirmed",
              description: "Dr. James Smith will visit on March 10, 2025",
            },
            {
              id: "2",
              color: "blue",
              status: "Vaccination Complete",
              description: "15 cattle vaccinated against FMD on March 5, 2025",
            },
            {
              id: "3",
              color: "yellow",
              status: "Health Record Updated",
              description: "Added new livestock health records on March 3, 2025",
            },
          ])
          setLoading(false)
          return
        }

        console.log("🔍 Sending token:", token) // Debugging: Log token before sending

        // Fetch total appointments
        const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
          },
          credentials: "include", // ✅ Helps with authentication headers
        })

        if (!statsResponse.ok) {
          console.error(`❌ Stats Fetch Error (${statsResponse.status}):`, await statsResponse.text())
          throw new Error(`Stats Fetch Error: ${statsResponse.statusText}`)
        }

        const statsData = await statsResponse.json()
        setTotalAppointments(statsData.totalAppointments)
        console.log("✅ Stats Data Received:", statsData) // Debugging: Log API response

        // Fetch recent activity
        const activityResponse = await fetch(`${API_BASE_URL}/api/dashboard/recent-activity`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
          },
          credentials: "include", // ✅ Helps prevent issues with cross-origin requests
        })

        if (!activityResponse.ok) {
          console.error(`❌ Activity Fetch Error (${activityResponse.status}):`, await activityResponse.text())
          throw new Error(`Activity Fetch Error: ${activityResponse.statusText}`)
        }

        const activityData = await activityResponse.json()
        setRecentActivity(activityData)
        console.log("✅ Activity Data Received:", activityData) // Debugging: Log API response
      } catch (error) {
        console.error("🔥 Error fetching dashboard data:", error)
        if (error instanceof Error) {
          setError(error.message || "Failed to fetch data.")
        } else {
          setError("Failed to fetch data.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshAppointments])

  // Articles for Knowledge Hub
  const articles = [
    {
      id: 1,
      title: "Disease Prevention Guide",
      summary: "Learn how to prevent common livestock diseases during monsoon season.",
      content: "Monsoon season brings unique challenges for livestock health...",
      image: "/placeholder.svg?height=200&width=400",
      date: "March 1, 2025",
      author: "Dr. James Smith",
    },
    {
      id: 2,
      title: "Government Subsidies 2025",
      summary: "New agricultural subsidies available for small-scale farmers.",
      content: "The Ministry of Agriculture has announced new subsidy programs...",
      image: "/placeholder.svg?height=200&width=400",
      date: "February 25, 2025",
      author: "Ministry of Agriculture",
    },
  ]

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6">
        {/* Welcome Banner */}
        <div className="mb-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, Rajesh from Pune!</h2>
              <p className="text-muted-foreground">Here's an overview of your farm's health status</p>
            </div>
            <NewAppointmentModal onAppointmentCreated={() => setRefreshAppointments(!refreshAppointments)} />
          </div>
        </div>

        {/* Farm Snapshot / Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <p>Loading activity...</p>
            ) : recentActivity.length === 0 ? (
              <p className="text-muted-foreground">No recent activity.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <div className={`h-8 w-8 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
                      <Activity className="h-4 w-4" />
                    </div>
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

        {/* Doctors Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Our Doctors</CardTitle>
            <CardDescription>Meet our professional veterinary doctors</CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorCarousel />
          </CardContent>
        </Card>

        {/* Knowledge Hub Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Hub</CardTitle>
            <CardDescription>Latest resources and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div
                className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  toast({
                    title: "Opening article",
                    description: "Navigating to Disease Prevention article",
                  })
                  window.location.href = "/dashboard/knowledge-hub?article=1"
                }}
              >
                <h4 className="font-medium">Disease Prevention</h4>
                <p className="text-sm text-muted-foreground">Seasonal care guide for monsoon</p>
              </div>
              <div
                className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  toast({
                    title: "Opening article",
                    description: "Navigating to Government Subsidies article",
                  })
                  window.location.href = "/dashboard/knowledge-hub?article=2"
                }}
              >
                <h4 className="font-medium">Government Subsidies</h4>
                <p className="text-sm text-muted-foreground">New scheme deadline: April 15</p>
              </div>
              <div
                className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  toast({
                    title: "Opening FAQ",
                    description: "Navigating to Community Q&A section",
                  })
                  window.location.href = "/dashboard/knowledge-hub?tab=faq"
                }}
              >
                <h4 className="font-medium">Community Q&A</h4>
                <p className="text-sm text-muted-foreground">5 new answers to your questions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

