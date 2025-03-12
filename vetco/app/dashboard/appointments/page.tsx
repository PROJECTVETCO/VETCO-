"use client"

import { useState } from "react"
import { Calendar, Clock, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { NewAppointmentModal } from "@/components/new-appointment-modal"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [refreshAppointments, setRefreshAppointments] = useState(false)

  // Mock appointments data
  const appointments = [
    {
      id: "APT001",
      doctor: "Dr.Okiria Jude",
      date: "2025-03-10",
      time: "10:00 AM",
      status: "confirmed",
      reason: "Regular checkup for cattle",
      location: "Farm Visit",
    },
    {
      id: "APT002",
      doctor: "Dr. Angela Mwangi",
      date: "2025-03-15",
      time: "2:30 PM",
      status: "pending",
      reason: "Vaccination for poultry",
      location: "Clinic Visit",
    },
    {
      id: "APT003",
      doctor: "Dr. Peter Okello",
      date: "2025-03-20",
      time: "9:00 AM",
      status: "completed",
      reason: "Follow-up on cattle treatment",
      location: "Farm Visit",
    },
    {
      id: "APT004",
      doctor: "Dr. Sarah Kimani",
      date: "2025-03-25",
      time: "11:30 AM",
      status: "cancelled",
      reason: "Dairy cow milk production consultation",
      location: "Virtual Consultation",
    },
    {
      id: "APT005",
      doctor: "Dr. James Olupot",
      date: "2025-04-02",
      time: "3:00 PM",
      status: "confirmed",
      reason: "Seasonal vaccination for livestock",
      location: "Farm Visit",
    },
  ]

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.id.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    // Filter by date
    const matchesDate = dateFilter === "" || appointment.date === dateFilter

    return matchesSearch && matchesStatus && matchesDate
  })

  const cancelAppointment = (id: string) => {
    toast({
      title: "Appointment cancelled",
      description: `Appointment ${id} has been cancelled`,
    })
  }

  const rescheduleAppointment = (id: string) => {
    toast({
      title: "Reschedule appointment",
      description: `Opening reschedule form for appointment ${id}`,
    })
  }

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your veterinary appointments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <NewAppointmentModal onAppointmentCreated={() => setRefreshAppointments(!refreshAppointments)} />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor, reason, or ID"
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="dateFilter" className="sr-only">
                  Filter by date
                </Label>
                <Input id="dateFilter" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
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

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No appointments found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">{appointment.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">{appointment.doctor}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {appointment.time}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">{appointment.reason}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">{appointment.location}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
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
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {appointment.status === "confirmed" || appointment.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => rescheduleAppointment(appointment.id)}>
                              Reschedule
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "View details",
                                description: `Viewing details for appointment ${appointment.id}`,
                              })
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

