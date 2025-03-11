"use client"

import { useState } from "react"
import { Calendar, Clock, Search, X, CheckCircle, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { VetDashboardLayout } from "@/components/vet-dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VetAppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("upcoming")

  // Mock appointments data
  const appointments = [
    {
      id: "APT001",
      farmer: {
        name: "Rajesh Kumar",
        location: "Pune, Maharashtra",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-10",
      time: "10:00 AM",
      status: "confirmed",
      type: "farm-visit",
      reason: "Cattle vaccination",
      animals: "15 cattle",
      notes: "Farmer has requested FMD vaccination for all cattle",
    },
    {
      id: "APT002",
      farmer: {
        name: "Aisha Omondi",
        location: "Nakuru, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-10",
      time: "02:30 PM",
      status: "pending",
      type: "clinic",
      reason: "Poultry health check",
      animals: "Sample from poultry flock",
      notes: "Farmer will bring samples for testing",
    },
    {
      id: "APT003",
      farmer: {
        name: "Samuel Maina",
        location: "Nairobi, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-11",
      time: "09:00 AM",
      status: "confirmed",
      type: "virtual",
      reason: "Consultation on feed",
      animals: "Dairy cattle",
      notes: "Farmer wants advice on improving milk production through feed adjustments",
    },
    {
      id: "APT004",
      farmer: {
        name: "Priya Sharma",
        location: "Delhi, India",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-12",
      time: "11:30 AM",
      status: "confirmed",
      type: "farm-visit",
      reason: "Follow-up treatment",
      animals: "3 cattle",
      notes: "Follow-up visit for cattle treated last week for respiratory issues",
    },
    {
      id: "APT005",
      farmer: {
        name: "John Kamau",
        location: "Kisumu, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-05",
      time: "10:00 AM",
      status: "completed",
      type: "farm-visit",
      reason: "Routine checkup",
      animals: "Mixed livestock",
      notes: "Completed routine health check for all farm animals",
    },
    {
      id: "APT006",
      farmer: {
        name: "Anita Desai",
        location: "Mumbai, India",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2025-03-07",
      time: "03:00 PM",
      status: "cancelled",
      type: "clinic",
      reason: "Goat vaccination",
      animals: "5 goats",
      notes: "Farmer cancelled due to transportation issues",
    },
  ]

  // Pending appointment requests
  const pendingRequests = [
    {
      id: "REQ001",
      farmer: {
        name: "Rajesh Kumar",
        location: "Pune, Maharashtra",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      requestedDate: "2025-03-15",
      preferredTime: "Morning",
      type: "farm-visit",
      reason: "Cattle vaccination",
      animals: "15 cattle",
      notes: "Requesting FMD vaccination for all cattle",
      requestedOn: "2025-03-09",
    },
    {
      id: "REQ002",
      farmer: {
        name: "Aisha Omondi",
        location: "Nakuru, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      requestedDate: "2025-03-16",
      preferredTime: "Afternoon",
      type: "clinic",
      reason: "Poultry disease investigation",
      animals: "Poultry flock",
      notes: "Several birds showing signs of illness, needs urgent attention",
      requestedOn: "2025-03-09",
    },
  ]

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by tab
    if (activeTab === "upcoming" && (appointment.status === "completed" || appointment.status === "cancelled")) {
      return false
    }
    if (activeTab === "past" && (appointment.status === "confirmed" || appointment.status === "pending")) {
      return false
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      appointment.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    // Filter by date
    const matchesDate = dateFilter === "" || appointment.date === dateFilter

    // Filter by type
    const matchesType = typeFilter === "all" || appointment.type === typeFilter

    return matchesSearch && matchesStatus && matchesDate && matchesType
  })

  const acceptAppointmentRequest = (id: string) => {
    toast({
      title: "Appointment accepted",
      description: `Appointment request ${id} has been accepted`,
    })
  }

  const declineAppointmentRequest = (id: string) => {
    toast({
      title: "Appointment declined",
      description: `Appointment request ${id} has been declined`,
    })
  }

  const suggestAlternative = (id: string) => {
    toast({
      title: "Suggesting alternative",
      description: `Opening form to suggest alternative time for request ${id}`,
    })
  }

  const completeAppointment = (id: string) => {
    toast({
      title: "Completing appointment",
      description: `Opening form to complete appointment ${id} and add notes`,
    })
  }

  const rescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule appointment",
      description: `Opening reschedule form for appointment ${id}`,
    })
  }

  const cancelAppointment = (id: string) => {
    toast({
      title: "Appointment cancelled",
      description: `Appointment ${id} has been cancelled`,
    })
  }

  return (
    <VetDashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your appointments and requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => {
                toast({
                  title: "Update availability",
                  description: "Opening availability calendar",
                })
                window.location.href = "/vet-dashboard/availability"
              }}
            >
              Update Availability
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="requests">Appointment Requests</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by farmer, reason, or ID"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="farm-visit">Farm Visit</SelectItem>
                        <SelectItem value="clinic">Clinic Visit</SelectItem>
                        <SelectItem value="virtual">Virtual Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="dateFilter" className="sr-only">
                      Filter by date
                    </Label>
                    <Input
                      id="dateFilter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                    {dateFilter && (
                      <Button variant="ghost" size="icon" onClick={() => setDateFilter("")} className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear date filter</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">No appointments found matching your filters</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                            <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{appointment.farmer.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {appointment.farmer.location}
                            </div>
                          </div>
                        </div>

                        <div className="md:ml-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Details</p>
                            <p className="text-sm mt-1">{appointment.reason}</p>
                            <p className="text-sm text-muted-foreground mt-1">{appointment.animals}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <div className="flex items-center mt-1">
                              <Badge
                                className={
                                  appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : appointment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : appointment.status === "completed"
                                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline">
                                {appointment.type === "farm-visit"
                                  ? "Farm Visit"
                                  : appointment.type === "clinic"
                                    ? "Clinic Visit"
                                    : "Virtual Consultation"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {appointment.status === "confirmed" && (
                          <>
                            <Button onClick={() => completeAppointment(appointment.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                            <Button variant="outline" onClick={() => rescheduleAppointment(appointment.id)}>
                              Reschedule
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === "pending" && (
                          <>
                            <Button onClick={() => acceptAppointmentRequest(appointment.id)}>Accept</Button>
                            <Button variant="outline" onClick={() => suggestAlternative(appointment.id)}>
                              Suggest Alternative
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => declineAppointmentRequest(appointment.id)}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                        {(appointment.status === "completed" || appointment.status === "cancelled") && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Viewing details",
                                description: `Opening detailed view for appointment ${appointment.id}`,
                              })
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-4">
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">No pending appointment requests</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pending Requests ({pendingRequests.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Checking availability",
                          description: "Opening availability calendar to check open slots",
                        })
                      }}
                    >
                      Check Availability
                    </Button>
                  </div>

                  {pendingRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={request.farmer.avatar} alt={request.farmer.name} />
                              <AvatarFallback>{request.farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{request.farmer.name}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                {request.farmer.location}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">Requested on: {request.requestedOn}</p>
                            </div>
                          </div>

                          <div className="md:ml-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm font-medium">Requested Date & Time</p>
                              <div className="flex items-center mt-1">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-sm">{new Date(request.requestedDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-sm">{request.preferredTime}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm font-medium">Details</p>
                              <p className="text-sm mt-1">{request.reason}</p>
                              <p className="text-sm text-muted-foreground mt-1">{request.animals}</p>
                            </div>

                            <div>
                              <p className="text-sm font-medium">Type</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline">
                                  {request.type === "farm-visit"
                                    ? "Farm Visit"
                                    : request.type === "clinic"
                                      ? "Clinic Visit"
                                      : "Virtual Consultation"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="mt-4 text-sm">
                            <p className="font-medium">Notes:</p>
                            <p className="text-muted-foreground">{request.notes}</p>
                          </div>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button onClick={() => acceptAppointmentRequest(request.id)}>Accept Request</Button>
                          <Button variant="outline" onClick={() => suggestAlternative(request.id)}>
                            Suggest Alternative
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => declineAppointmentRequest(request.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by farmer, reason, or ID"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="dateFilter" className="sr-only">
                      Filter by date
                    </Label>
                    <Input
                      id="dateFilter"
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                    {dateFilter && (
                      <Button variant="ghost" size="icon" onClick={() => setDateFilter("")} className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear date filter</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="rounded-md border p-8 text-center">
                  <p className="text-muted-foreground">No past appointments found matching your filters</p>
                </div>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={appointment.farmer.avatar} alt={appointment.farmer.name} />
                            <AvatarFallback>{appointment.farmer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{appointment.farmer.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-3 w-3" />
                              {appointment.farmer.location}
                            </div>
                          </div>
                        </div>

                        <div className="md:ml-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{new Date(appointment.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Details</p>
                            <p className="text-sm mt-1">{appointment.reason}</p>
                            <p className="text-sm text-muted-foreground mt-1">{appointment.animals}</p>
                          </div>

                          <div>
                            <p className="text-sm font-medium">Status</p>
                            <div className="flex items-center mt-1">
                              <Badge
                                className={
                                  appointment.status === "completed"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline">
                                {appointment.type === "farm-visit"
                                  ? "Farm Visit"
                                  : appointment.type === "clinic"
                                    ? "Clinic Visit"
                                    : "Virtual Consultation"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 text-sm">
                          <p className="font-medium">Notes:</p>
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Viewing details",
                              description: `Opening detailed view for appointment ${appointment.id}`,
                            })
                          }}
                        >
                          View Details
                        </Button>
                        {appointment.status === "completed" && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Generating report",
                                description: `Generating report for appointment ${appointment.id}`,
                              })
                            }}
                          >
                            Generate Report
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </VetDashboardLayout>
  )
}

