"use client"

import { useState, useEffect } from "react"
import { Activity, AlertTriangle, Calendar, CheckCircle, Clock, MessageSquare, Users } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { VetDashboardLayout } from "@/components/vet-dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VetDashboardPage() {
  const [pendingAppointments, setPendingAppointments] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [activeChats, setActiveChats] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentRequests, setRecentRequests] = useState<Request[]>([])

  interface Request {
    id: string
    type: "appointment" | "message" | "emergency"
    farmer: {
      name: string
      location: string
      avatar?: string
    }
    status: "pending" | "accepted" | "declined"
    time: string
    details: string
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // In a real app, this would be an API call
        // Simulating API response with mock data
        setTimeout(() => {
          setPendingAppointments(8)
          setTotalPatients(124)
          setActiveChats(5)
          setRecentRequests([
            {
              id: "REQ001",
              type: "appointment",
              farmer: {
                name: "Rajesh Kumar",
                location: "Pune, Maharashtra",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: "pending",
              time: "30 minutes ago",
              details: "Requesting farm visit for cattle vaccination on March 15, 2025",
            },
            {
              id: "REQ002",
              type: "emergency",
              farmer: {
                name: "Aisha Omondi",
                location: "Nakuru, Kenya",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: "pending",
              time: "1 hour ago",
              details: "Urgent: Cow showing signs of respiratory distress",
            },
            {
              id: "REQ003",
              type: "message",
              farmer: {
                name: "Samuel Maina",
                location: "Nairobi, Kenya",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: "pending",
              time: "2 hours ago",
              details: "Question about poultry vaccination schedule",
            },
            {
              id: "REQ004",
              type: "appointment",
              farmer: {
                name: "Priya Sharma",
                location: "Delhi, India",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              status: "accepted",
              time: "Yesterday",
              details: "Follow-up visit for cattle treatment scheduled for March 12, 2025",
            },
          ])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError("Failed to fetch dashboard data. Please try again.")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAcceptRequest = (id: string, type: "appointment" | "message" | "emergency") => {
    // Update the request status
    setRecentRequests(
      recentRequests.map((request) => (request.id === id ? { ...request, status: "accepted" } : request)),
    )

    // Show appropriate toast message
    if (type === "appointment") {
      toast({
        title: "Appointment accepted",
        description: "The appointment has been added to your schedule",
      })
    } else if (type === "emergency") {
      toast({
        title: "Emergency response initiated",
        description: "Connecting you with the farmer immediately",
      })
    } else {
      toast({
        title: "Message accepted",
        description: "Opening chat with the farmer",
      })
    }
  }

  const handleDeclineRequest = (id: string) => {
    // Update the request status
    setRecentRequests(
      recentRequests.map((request) => (request.id === id ? { ...request, status: "declined" } : request)),
    )

    toast({
      title: "Request declined",
      description: "The farmer will be notified",
    })
  }

  // Today's schedule
  const todaysSchedule = [
    {
      id: "SCH001",
      time: "09:00 AM",
      farmer: "Rajesh Kumar",
      location: "Pune, Maharashtra",
      type: "Farm Visit",
      status: "upcoming",
    },
    {
      id: "SCH002",
      time: "11:30 AM",
      farmer: "Aisha Omondi",
      location: "Nakuru, Kenya",
      type: "Clinic Appointment",
      status: "upcoming",
    },
    {
      id: "SCH003",
      time: "02:00 PM",
      farmer: "Samuel Maina",
      location: "Nairobi, Kenya",
      type: "Virtual Consultation",
      status: "upcoming",
    },
    {
      id: "SCH004",
      time: "04:30 PM",
      farmer: "Priya Sharma",
      location: "Delhi, India",
      type: "Farm Visit",
      status: "upcoming",
    },
  ]

  return (
    <VetDashboardLayout>
      <div className="container p-4 md:p-6">
        {/* Welcome Banner */}
        <div className="mb-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome back, Dr. James Smith!</h2>
              <p className="text-muted-foreground">Here's an overview of your schedule and patient requests</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Availability updated",
                  description: "Your availability has been updated",
                })
              }}
            >
              Update Availability
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">Requires your attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : activeChats}</div>
              <p className="text-xs text-muted-foreground">+2 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "Loading..." : totalPatients}</div>
              <p className="text-xs text-muted-foreground">+8 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Requests */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Incoming requests from farmers</CardDescription>
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
                <p>Loading requests...</p>
              ) : recentRequests.length === 0 ? (
                <p className="text-muted-foreground">No pending requests.</p>
              ) : (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={request.farmer.avatar} alt={request.farmer.name} />
                          <AvatarFallback>{request.farmer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{request.farmer.name}</h4>
                              <Badge
                                variant={
                                  request.type === "emergency"
                                    ? "destructive"
                                    : request.type === "appointment"
                                      ? "outline"
                                      : "secondary"
                                }
                              >
                                {request.type === "emergency"
                                  ? "Emergency"
                                  : request.type === "appointment"
                                    ? "Appointment"
                                    : "Message"}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{request.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{request.farmer.location}</p>
                          <p className="text-sm mt-2">{request.details}</p>

                          {request.status === "pending" ? (
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" onClick={() => handleAcceptRequest(request.id, request.type)}>
                                {request.type === "emergency" ? "Respond Now" : "Accept"}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeclineRequest(request.id)}>
                                Decline
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-3">
                              <Badge variant={request.status === "accepted" ? "default" : "secondary"}>
                                {request.status === "accepted" ? "Accepted" : "Declined"}
                              </Badge>
                              {request.status === "accepted" && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                  onClick={() => {
                                    toast({
                                      title: "Opening details",
                                      description: `Viewing details for ${request.type}`,
                                    })
                                  }}
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaysSchedule.map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{appointment.time}</h4>
                        <Badge variant="outline">{appointment.type}</Badge>
                      </div>
                      <p className="text-sm mt-1">{appointment.farmer}</p>
                      <p className="text-sm text-muted-foreground">{appointment.location}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Viewing details",
                              description: `Opening details for appointment with ${appointment.farmer}`,
                            })
                          }}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Rescheduling",
                              description: "Opening reschedule form",
                            })
                          }}
                        >
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Alerts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Emergency Alerts</CardTitle>
            <CardDescription>Urgent cases requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRequests.filter((req) => req.type === "emergency" && req.status === "pending").length > 0 ? (
              <div className="space-y-4">
                {recentRequests
                  .filter((req) => req.type === "emergency" && req.status === "pending")
                  .map((emergency) => (
                    <Alert key={emergency.id} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center justify-between">
                        <span>Emergency Request from {emergency.farmer.name}</span>
                        <span className="text-xs font-normal">{emergency.time}</span>
                      </AlertTitle>
                      <AlertDescription className="mt-2">
                        <p>{emergency.details}</p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAcceptRequest(emergency.id, "emergency")}
                          >
                            Respond Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Transferring emergency",
                                description: "Transferring to another available veterinarian",
                              })
                            }}
                          >
                            Transfer
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <CheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <p className="font-medium">No emergency alerts at this time</p>
                  <p className="text-sm text-muted-foreground">
                    You'll be notified immediately when an emergency is reported
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VetDashboardLayout>
  )
}

