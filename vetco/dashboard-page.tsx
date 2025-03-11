"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  FileText,
  Globe,
  HelpCircle,
  MapPin,
  MessageSquare,
  Search,
  Users,
  X,
  Check,
  Download,
  Printer,
  Star,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { NewAppointmentModal } from "@/components/new-appointment-modal"
import { DoctorCarousel } from "@/components/doctor-carousel"

export default function DashboardPage() {
  const [refreshAppointments, setRefreshAppointments] = useState(false)
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [healthRecordsOpen, setHealthRecordsOpen] = useState(false)
  const [knowledgeHubOpen, setKnowledgeHubOpen] = useState(false)
  const [vetDirectoryOpen, setVetDirectoryOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("EN")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedDistance, setSelectedDistance] = useState("any")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedHealthRecord, setSelectedHealthRecord] = useState<HealthRecord | null>(null)
  const [newHealthRecordOpen, setNewHealthRecordOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. James Smith is confirmed for tomorrow at 10:00 AM.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 2,
      title: "Vaccination Reminder",
      message: "5 cattle are due for vaccination this week. Please schedule an appointment.",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "New Message",
      message: "Dr. Angela Mwangi sent you a message regarding your recent appointment.",
      time: "Yesterday",
      read: false,
    },
  ])

  interface Activity {
    id: string
    color: string
    status: string
    description: string
  }

  interface HealthRecord {
    id: string
    animalId: string
    animalType: string
    breed: string
    lastCheckup: string
    status: string
    notes: string
  }

  interface Article {
    id: number
    title: string
    summary: string
    content: string
    image: string
    date: string
    author: string
  }

  interface Video {
    id: number
    title: string
    summary: string
    duration: string
    thumbnail: string
  }

  interface Doctor {
    id: number
    name: string
    expertise: string
    location: string
    distance: number
    contact: string
    availability: string
    profilePic: string
    rating: number
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vetco.onrender.com"

  // Mock data for health records
  const healthRecords: HealthRecord[] = [
    {
      id: "HR001",
      animalId: "C-001",
      animalType: "cattle",
      breed: "Holstein",
      lastCheckup: "Feb 28, 2025",
      status: "healthy",
      notes: "All vaccinations up to date. Good overall health condition.",
    },
    {
      id: "HR002",
      animalId: "C-002",
      animalType: "cattle",
      breed: "Jersey",
      lastCheckup: "Mar 2, 2025",
      status: "needs-attention",
      notes: "Showing signs of mild respiratory issues. Scheduled for follow-up next week.",
    },
    {
      id: "HR003",
      animalId: "C-003",
      animalType: "cattle",
      breed: "Angus",
      lastCheckup: "Mar 5, 2025",
      status: "healthy",
      notes: "Recent vaccination for FMD completed. No health concerns.",
    },
  ]

  // Mock data for articles
  const articles: Article[] = [
    {
      id: 1,
      title: "Disease Prevention Guide",
      summary: "Learn how to prevent common livestock diseases during monsoon season.",
      content:
        "Monsoon season brings unique challenges for livestock health. This comprehensive guide covers preventive measures for common diseases that affect cattle, goats, and poultry during rainy seasons. Key topics include proper shelter management, vaccination schedules, feed adjustments, and early warning signs of common monsoon-related illnesses.\n\nProper drainage around animal housing is essential to prevent waterlogging and the growth of disease-causing organisms. Ensure that animal shelters have adequate ventilation while protecting from rain and wind. Regularly clean and disinfect all housing areas.\n\nVaccination schedules may need adjustment before monsoon season begins. Consult with your veterinarian about boosters for foot and mouth disease, hemorrhagic septicemia, and other seasonal concerns.\n\nDuring monsoon, feed quality can deteriorate rapidly due to moisture. Store feed in dry, elevated areas and inspect regularly for mold or spoilage. Consider supplementing with vitamins A, D, and E which help boost immunity.",
      image: "/placeholder.svg?height=200&width=400",
      date: "March 1, 2025",
      author: "Dr. James Smith",
    },
    {
      id: 2,
      title: "Government Subsidies 2025",
      summary: "New agricultural subsidies available for small-scale farmers.",
      content:
        "The Ministry of Agriculture has announced new subsidy programs for small-scale farmers effective April 2025. These programs aim to support sustainable farming practices, improve livestock health, and increase agricultural productivity across rural communities.\n\nThe Livestock Health Initiative provides up to 50% subsidy on veterinary services and medications for registered farmers with fewer than 50 animals. To qualify, farmers must maintain proper health records and participate in the national animal identification program.\n\nThe Farm Equipment Modernization Program offers low-interest loans and direct subsidies for purchasing essential farming equipment. Small-scale farmers can receive up to 40% subsidy on approved equipment purchases.\n\nThe Sustainable Farming Practices Grant provides financial support for farmers implementing environmentally friendly farming methods. This includes water conservation systems, renewable energy for farm operations, and organic farming transitions.\n\nApplications for all programs open on April 1, 2025, and close on April 15, 2025. Farmers can apply through the Ministry's online portal or at local agricultural extension offices.",
      image: "/placeholder.svg?height=200&width=400",
      date: "February 25, 2025",
      author: "Ministry of Agriculture",
    },
  ]

  // Mock data for videos
  const videos: Video[] = [
    {
      id: 1,
      title: "Cattle Vaccination Techniques",
      summary: "Learn proper vaccination techniques from our experts.",
      duration: "12:45",
      thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Dairy Farm Management",
      summary: "Best practices for managing a small dairy farm.",
      duration: "18:30",
      thumbnail: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Mock data for doctors
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. James Smith",
      expertise: "Large Animal Medicine",
      location: "Nairobi, Kenya",
      distance: 5,
      contact: "+254 712 345 678",
      availability: "Mon - Fri: 9 AM - 5 PM",
      profilePic: "/placeholder.svg?height=64&width=64",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Dr. Angela Mwangi",
      expertise: "Dairy Cattle Health",
      location: "Kisumu, Kenya",
      distance: 12,
      contact: "+254 798 765 432",
      availability: "Weekends Only",
      profilePic: "/placeholder.svg?height=64&width=64",
      rating: 4.5,
    },
    {
      id: 3,
      name: "Dr. Peter Okello",
      expertise: "Poultry & Livestock",
      location: "Mombasa, Kenya",
      distance: 18,
      contact: "+254 711 223 344",
      availability: "Mon - Sat: 8 AM - 6 PM",
      profilePic: "/placeholder.svg?height=64&width=64",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Dr. Sarah Kimani",
      expertise: "Veterinary Surgery",
      location: "Nakuru, Kenya",
      distance: 25,
      contact: "+254 722 123 456",
      availability: "Tue - Sat: 10 AM - 6 PM",
      profilePic: "/placeholder.svg?height=64&width=64",
      rating: 4.7,
    },
  ]

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by specialty
    const matchesSpecialty =
      selectedSpecialties.length === 0 || selectedSpecialties.some((specialty) => doctor.expertise.includes(specialty))

    // Filter by distance
    const matchesDistance =
      selectedDistance === "any" ||
      (selectedDistance === "0-10" && doctor.distance <= 10) ||
      (selectedDistance === "11-20" && doctor.distance > 10 && doctor.distance <= 20) ||
      (selectedDistance === "21+" && doctor.distance > 20)

    return matchesSearch && matchesSpecialty && matchesDistance
  })

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

  // Notification functions
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "You have no unread notifications",
    })
  }

  const markNotificationAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    })
  }

  // Health Records functions
  const addHealthRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const newRecord: HealthRecord = {
      id: `HR${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      animalId: formData.get("animalId") as string,
      animalType: formData.get("animalType") as string,
      breed: formData.get("breed") as string,
      lastCheckup: formData.get("checkupDate") as string,
      status: formData.get("status") as string,
      notes: formData.get("notes") as string,
    }

    // In a real app, you would send this to an API
    console.log("New health record:", newRecord)

    toast({
      title: "Health record added",
      description: `Record for ${newRecord.animalId} has been created`,
    })

    setNewHealthRecordOpen(false)
  }

  const viewHealthRecord = (record: HealthRecord) => {
    setSelectedHealthRecord(record)
  }

  // Vet Directory functions
  const bookAppointment = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      toast({
        title: "Booking initiated",
        description: `Opening appointment form for Dr. ${doctor.name}`,
      })
      // In a real app, you would open the appointment form pre-filled with this doctor
      setVetDirectoryOpen(false)
    }
  }

  // Knowledge Hub functions
  const readArticle = (article: Article) => {
    setSelectedArticle(article)
  }

  const watchVideo = (video: Video) => {
    setSelectedVideo(video)
  }

  // Language functions
  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang)
    toast({
      title: "Language changed",
      description: `Language set to ${lang === "EN" ? "English" : lang === "SW" ? "Swahili" : lang === "HI" ? "Hindi" : "French"}`,
    })
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <SidebarTrigger className="mr-2 md:hidden" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <span className="text-sm font-medium text-white">V</span>
              </div>
              <span className="text-lg font-semibold">VetCo</span>
            </div>
            <nav className="ml-auto flex items-center gap-4 md:gap-6">
              {/* Health Records Button */}
              <Dialog open={healthRecordsOpen} onOpenChange={setHealthRecordsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-5 w-5" />
                    <span className="sr-only">Health Records</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Health Records</DialogTitle>
                    <DialogDescription>View and manage your livestock health records</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="cattle" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="cattle">Cattle</TabsTrigger>
                      <TabsTrigger value="poultry">Poultry</TabsTrigger>
                      <TabsTrigger value="goats">Goats</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cattle" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Cattle Records</h3>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Exporting records",
                                  description: "Your health records are being exported to CSV",
                                })
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Export
                            </Button>
                            <Button size="sm" onClick={() => setNewHealthRecordOpen(true)}>
                              Add New Record
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-md border">
                          <table className="min-w-full divide-y divide-border">
                            <thead>
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Breed
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                  Last Checkup
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
                              {healthRecords
                                .filter((record) => record.animalType === "cattle")
                                .map((record) => (
                                  <tr key={record.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{record.animalId}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{record.breed}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{record.lastCheckup}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <Badge
                                        className={
                                          record.status === "healthy"
                                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                        }
                                      >
                                        {record.status === "healthy" ? "Healthy" : "Needs Attention"}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <Button variant="ghost" size="sm" onClick={() => viewHealthRecord(record)}>
                                        View
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="poultry" className="mt-4">
                      <div className="rounded-md border p-8 text-center">
                        <p className="text-muted-foreground">No poultry records found.</p>
                        <Button
                          className="mt-4"
                          size="sm"
                          onClick={() => {
                            setNewHealthRecordOpen(true)
                            toast({
                              title: "Adding poultry record",
                              description: "Please fill in the details for your poultry",
                            })
                          }}
                        >
                          Add Poultry Records
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="goats" className="mt-4">
                      <div className="rounded-md border p-8 text-center">
                        <p className="text-muted-foreground">No goat records found.</p>
                        <Button
                          className="mt-4"
                          size="sm"
                          onClick={() => {
                            setNewHealthRecordOpen(true)
                            toast({
                              title: "Adding goat record",
                              description: "Please fill in the details for your goat",
                            })
                          }}
                        >
                          Add Goat Records
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* New Health Record Dialog */}
              <Dialog open={newHealthRecordOpen} onOpenChange={setNewHealthRecordOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Health Record</DialogTitle>
                    <DialogDescription>Enter the details for the new health record</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addHealthRecord}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="animalId" className="text-right">
                          Animal ID
                        </Label>
                        <Input id="animalId" name="animalId" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="animalType" className="text-right">
                          Animal Type
                        </Label>
                        <Select name="animalType" defaultValue="cattle" required>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select animal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cattle">Cattle</SelectItem>
                            <SelectItem value="poultry">Poultry</SelectItem>
                            <SelectItem value="goat">Goat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="breed" className="text-right">
                          Breed
                        </Label>
                        <Input id="breed" name="breed" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="checkupDate" className="text-right">
                          Checkup Date
                        </Label>
                        <Input id="checkupDate" name="checkupDate" type="date" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <RadioGroup defaultValue="healthy" name="status" className="col-span-3">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="healthy" id="healthy" />
                            <Label htmlFor="healthy">Healthy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="needs-attention" id="needs-attention" />
                            <Label htmlFor="needs-attention">Needs Attention</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                          Notes
                        </Label>
                        <Textarea id="notes" name="notes" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setNewHealthRecordOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Save Record</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Health Record Details Dialog */}
              {selectedHealthRecord && (
                <Dialog open={!!selectedHealthRecord} onOpenChange={(open) => !open && setSelectedHealthRecord(null)}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Health Record Details</DialogTitle>
                      <DialogDescription>Detailed information for {selectedHealthRecord.animalId}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Animal ID:</div>
                        <div className="col-span-2">{selectedHealthRecord.animalId}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Type:</div>
                        <div className="col-span-2 capitalize">{selectedHealthRecord.animalType}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Breed:</div>
                        <div className="col-span-2">{selectedHealthRecord.breed}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Last Checkup:</div>
                        <div className="col-span-2">{selectedHealthRecord.lastCheckup}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Status:</div>
                        <div className="col-span-2">
                          <Badge
                            className={
                              selectedHealthRecord.status === "healthy"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {selectedHealthRecord.status === "healthy" ? "Healthy" : "Needs Attention"}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="font-medium text-right">Notes:</div>
                        <div className="col-span-2">{selectedHealthRecord.notes}</div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "Printing record",
                            description: "Sending record to printer",
                          })
                        }}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button onClick={() => setSelectedHealthRecord(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Vet Directory Button */}
              <Sheet open={vetDirectoryOpen} onOpenChange={setVetDirectoryOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MapPin className="h-5 w-5" />
                    <span className="sr-only">Vet Directory</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Veterinarian Directory</SheetTitle>
                    <SheetDescription>Find veterinarians in your area</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, location, or specialty"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4">
                      <div className="w-1/3 space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Specialty</h3>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="large-animal"
                                checked={selectedSpecialties.includes("Large Animal")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSpecialties([...selectedSpecialties, "Large Animal"])
                                  } else {
                                    setSelectedSpecialties(selectedSpecialties.filter((s) => s !== "Large Animal"))
                                  }
                                }}
                              />
                              <label htmlFor="large-animal" className="text-sm">
                                Large Animal
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="dairy"
                                checked={selectedSpecialties.includes("Dairy")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSpecialties([...selectedSpecialties, "Dairy"])
                                  } else {
                                    setSelectedSpecialties(selectedSpecialties.filter((s) => s !== "Dairy"))
                                  }
                                }}
                              />
                              <label htmlFor="dairy" className="text-sm">
                                Dairy
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="poultry"
                                checked={selectedSpecialties.includes("Poultry")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSpecialties([...selectedSpecialties, "Poultry"])
                                  } else {
                                    setSelectedSpecialties(selectedSpecialties.filter((s) => s !== "Poultry"))
                                  }
                                }}
                              />
                              <label htmlFor="poultry" className="text-sm">
                                Poultry
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="surgery"
                                checked={selectedSpecialties.includes("Surgery")}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedSpecialties([...selectedSpecialties, "Surgery"])
                                  } else {
                                    setSelectedSpecialties(selectedSpecialties.filter((s) => s !== "Surgery"))
                                  }
                                }}
                              />
                              <label htmlFor="surgery" className="text-sm">
                                Surgery
                              </label>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Distance</h3>
                          <RadioGroup defaultValue="any" value={selectedDistance} onValueChange={setSelectedDistance}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="any" id="any" />
                              <Label htmlFor="any">Any distance</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0-10" id="0-10" />
                              <Label htmlFor="0-10">0-10 km</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="11-20" id="11-20" />
                              <Label htmlFor="11-20">11-20 km</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="21+" id="21+" />
                              <Label htmlFor="21+">21+ km</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setSearchQuery("")
                            setSelectedSpecialties([])
                            setSelectedDistance("any")
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>

                      <div className="w-2/3">
                        <h3 className="text-sm font-medium mb-4">{filteredDoctors.length} Veterinarians Found</h3>

                        <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                          {filteredDoctors.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No veterinarians match your filters
                            </div>
                          ) : (
                            filteredDoctors.map((doctor) => (
                              <div key={doctor.id} className="flex items-start gap-4 rounded-lg border p-4">
                                <img
                                  src={doctor.profilePic || "/placeholder.svg"}
                                  alt={doctor.name}
                                  className="h-12 w-12 rounded-full object-cover border"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{doctor.name}</h4>
                                    <div className="flex items-center">
                                      <span className="text-sm font-medium mr-1">{doctor.rating}</span>
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{doctor.expertise}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {doctor.location} ({doctor.distance} km away)
                                  </p>
                                  <div className="mt-2 flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        toast({
                                          title: "Viewing profile",
                                          description: `Viewing Dr. ${doctor.name}'s full profile`,
                                        })
                                      }}
                                    >
                                      Profile
                                    </Button>
                                    <Button size="sm" onClick={() => bookAppointment(doctor.id)}>
                                      Book
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <SheetFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({
                          title: "Showing all veterinarians",
                          description: "Redirecting to full directory page",
                        })
                        setVetDirectoryOpen(false)
                      }}
                    >
                      View All Veterinarians
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Knowledge Hub Button */}
              <Dialog open={knowledgeHubOpen} onOpenChange={setKnowledgeHubOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Knowledge Hub</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Knowledge Hub</DialogTitle>
                    <DialogDescription>Access resources and information to help manage your farm</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="articles" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="articles">Articles</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>
                    <TabsContent value="articles" className="mt-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search articles" className="pl-8" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {articles.map((article) => (
                            <div key={article.id} className="rounded-lg border overflow-hidden">
                              <div className="aspect-video bg-muted">
                                <img
                                  src={article.image || "/placeholder.svg"}
                                  alt={article.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium">{article.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{article.summary}</p>
                                <Button size="sm" className="mt-3" onClick={() => readArticle(article)}>
                                  Read Article
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="videos" className="mt-4">
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Search videos" className="pl-8" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {videos.map((video) => (
                            <div key={video.id} className="rounded-lg border overflow-hidden">
                              <div className="aspect-video bg-muted flex items-center justify-center relative">
                                <img
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                                    <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                                  </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {video.duration}
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="font-medium">{video.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{video.summary}</p>
                                <Button size="sm" className="mt-3" onClick={() => watchVideo(video)}>
                                  Watch Video
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="faq" className="mt-4">
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <h3 className="font-medium">How often should I vaccinate my cattle?</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Vaccination schedules vary by disease and region. Generally, most cattle require annual
                            vaccinations for common diseases like FMD. Consult with your veterinarian for a customized
                            vaccination schedule.
                          </p>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h3 className="font-medium">What signs indicate my livestock might be sick?</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Common signs include reduced appetite, lethargy, abnormal discharge, coughing, diarrhea, or
                            changes in milk production. Any sudden behavioral changes should be evaluated by a
                            veterinarian.
                          </p>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h3 className="font-medium">How can I improve milk production in my dairy cows?</h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Ensure proper nutrition with balanced feed, maintain good hygiene, provide clean water,
                            establish regular milking schedules, control parasites, and ensure adequate housing with
                            proper ventilation.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              {/* Article Detail Dialog */}
              {selectedArticle && (
                <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>{selectedArticle.title}</DialogTitle>
                      <DialogDescription>
                        By {selectedArticle.author} • {selectedArticle.date}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="aspect-video bg-muted mb-6">
                        <img
                          src={selectedArticle.image || "/placeholder.svg"}
                          alt={selectedArticle.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        {selectedArticle.content.split("\n\n").map((paragraph, index) => (
                          <p key={index} className="text-sm">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Article saved",
                              description: "This article has been saved to your bookmarks",
                            })
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Sharing article",
                              description: "Share options opened",
                            })
                          }}
                        >
                          Share
                        </Button>
                      </div>
                      <Button onClick={() => setSelectedArticle(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Video Detail Dialog */}
              {selectedVideo && (
                <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>{selectedVideo.title}</DialogTitle>
                      <DialogDescription>{selectedVideo.duration} • Educational Video</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="aspect-video bg-muted flex items-center justify-center mb-6">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-2">Video Player</p>
                          <Button
                            onClick={() => {
                              toast({
                                title: "Video playback",
                                description: "This would play the actual video in production",
                              })
                            }}
                          >
                            Play Video
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-sm">{selectedVideo.summary}</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setSelectedVideo(null)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Notifications Button */}
              <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {unreadCount > 0 && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
                        {unreadCount}
                      </div>
                    )}
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[380px] sm:w-[440px]">
                  <SheetHeader className="flex flex-row items-center justify-between">
                    <div>
                      <SheetTitle>Notifications</SheetTitle>
                      <SheetDescription>Stay updated with important alerts and messages</SheetDescription>
                    </div>
                    {unreadCount > 0 && (
                      <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </SheetHeader>

                  <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No notifications</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`relative rounded-lg border p-4 ${notification.read ? "" : "bg-muted/30"}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium">{notification.title}</h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 -mt-1 -mr-1"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-muted-foreground">{notification.time}</span>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{currentLanguage}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => changeLanguage("EN")}>
                    <span className="h-4 w-6 rounded-sm bg-muted flex items-center justify-center text-[10px]">EN</span>
                    <span>English</span>
                    {currentLanguage === "EN" && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => changeLanguage("SW")}>
                    <span className="h-4 w-6 rounded-sm bg-muted flex items-center justify-center text-[10px]">SW</span>
                    <span>Swahili</span>
                    {currentLanguage === "SW" && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => changeLanguage("HI")}>
                    <span className="h-4 w-6 rounded-sm bg-muted flex items-center justify-center text-[10px]">HI</span>
                    <span>Hindi</span>
                    {currentLanguage === "HI" && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2" onClick={() => changeLanguage("FR")}>
                    <span className="h-4 w-6 rounded-sm bg-muted flex items-center justify-center text-[10px]">FR</span>
                    <span>French</span>
                    {currentLanguage === "FR" && <Check className="h-4 w-4 ml-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex flex-1">
          {/* Sidebar */}
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="h-6 w-6 rounded-full bg-green-600"></div>
                <span className="font-bold">VetCo Dashboard</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive>
                        <Link href="/dashboard">
                          <Activity className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/appointments">
                          <Calendar className="h-4 w-4" />
                          <span>Appointments</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/messages">
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/dashboard/network">
                          <Users className="h-4 w-4" />
                          <span>My Records</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel>Urgent Alerts</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="space-y-3 px-2">
                    <Alert variant="destructive" className="border-red-600/50 bg-red-50 text-red-900">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Disease Outbreak</AlertTitle>
                      <AlertDescription className="text-xs">Foot and Mouth Disease reported nearby</AlertDescription>
                    </Alert>

                    <Alert variant="default" className="border-yellow-600/50 bg-yellow-50 text-yellow-900">
                      <Calendar className="h-4 w-4" />
                      <AlertTitle>Vaccination Due</AlertTitle>
                      <AlertDescription className="text-xs">5 cattle due for vaccination this week</AlertDescription>
                    </Alert>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <div className="space-y-2 p-4">
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Emergency Vet",
                      description: "Finding emergency veterinarians near you",
                    })
                    setVetDirectoryOpen(true)
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Find Emergency Vet
                </Button>
                <Button
                  variant="secondary"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => {
                    setNewHealthRecordOpen(true)
                    setHealthRecordsOpen(true)
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Log New Health Event
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Dashboard Area */}
          <div className="flex-1 overflow-auto">
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
                          <div
                            className={`h-8 w-8 rounded-full bg-${activity.color}-100 flex items-center justify-center`}
                          >
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
                        setKnowledgeHubOpen(true)
                        setTimeout(() => {
                          readArticle(articles[0])
                        }, 100)
                      }}
                    >
                      <h4 className="font-medium">Disease Prevention</h4>
                      <p className="text-sm text-muted-foreground">Seasonal care guide for monsoon</p>
                    </div>
                    <div
                      className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setKnowledgeHubOpen(true)
                        setTimeout(() => {
                          readArticle(articles[1])
                        }, 100)
                      }}
                    >
                      <h4 className="font-medium">Government Subsidies</h4>
                      <p className="text-sm text-muted-foreground">New scheme deadline: April 15</p>
                    </div>
                    <div
                      className="rounded-lg border bg-card p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setKnowledgeHubOpen(true)
                        setTimeout(() => {
                          const tab = document.querySelector('[data-state="inactive"][value="faq"]') as HTMLElement
                          if (tab) tab.click()
                        }, 100)
                      }}
                    >
                      <h4 className="font-medium">Community Q&A</h4>
                      <p className="text-sm text-muted-foreground">5 new answers to your questions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

