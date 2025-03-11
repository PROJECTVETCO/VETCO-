"use client"

import Link from "next/link"
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Calendar,
  FileText,
  HelpCircle,
  MapPin,
  MessageSquare,
  PhoneCall,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const vets = [
  {
    id: 1,
    name: "Dr. James Smith",
    expertise: "Large Animal Medicine",
    location: "Nairobi, Kenya",
    contact: "+254 712 345 678",
    availability: "Mon - Fri: 9 AM - 5 PM",
    profilePic: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    name: "Dr. Angela Mwangi",
    expertise: "Dairy Cattle Health",
    location: "Kisumu, Kenya",
    contact: "+254 798 765 432",
    availability: "Weekends Only",
    profilePic: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    name: "Dr. Peter Okello",
    expertise: "Poultry & Livestock",
    location: "Mombasa, Kenya",
    contact: "+254 711 223 344",
    availability: "Mon - Sat: 8 AM - 6 PM",
    profilePic: "/placeholder.svg?height=64&width=64",
  },
]

export default function DashboardPage() {
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
              <span className="text-lg font-semibold"></span>
            </div>
            <nav className="ml-auto flex items-center gap-4 md:gap-6">
              <Button variant="ghost" size="icon">
                <FileText className="h-5 w-5" />
                <span className="sr-only">Health Records</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MapPin className="h-5 w-5" />
                <span className="sr-only">Vet Directory</span>
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">Knowledge Hub</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] font-medium text-white">
                  3
                </div>
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Button variant="outline" size="sm">
                <span>EN</span>
              </Button>
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
                        <Link href="/appointments">
                          <Calendar className="h-4 w-4" />
                          <span>Appointments</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/messages">
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/alerts">
                          <AlertCircle className="h-4 w-4" />
                          <span>Health Alerts</span>
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
                <Button variant="destructive" className="w-full justify-start" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Find Emergency Vet
                </Button>
                <Button variant="secondary" className="w-full justify-start" size="sm">
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
                  <Button className="bg-green-600 text-white hover:bg-green-700">New Appointment</Button>
                </div>
              </div>

              {/* Farm Snapshot */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Livestock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+4 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Healthy Animals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">38</div>
                    <p className="text-xs text-muted-foreground">90% of total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">95%</div>
                    <p className="text-xs text-muted-foreground">+2% from last month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Available Vets Section */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Available Veterinarians</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {vets.map((vet) => (
                      <Card key={vet.id} className="overflow-hidden">
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <img
                              src={vet.profilePic || "/placeholder.svg"}
                              alt={vet.name}
                              className="h-16 w-16 rounded-full object-cover border"
                            />
                            <div className="space-y-1">
                              <h3 className="font-semibold">{vet.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3" /> {vet.expertise}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {vet.location}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <PhoneCall className="h-3 w-3" /> {vet.contact}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {vet.availability}
                              </p>
                            </div>
                          </div>
                          <Button className="mt-3 w-full" size="sm">
                            Book Appointment
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Hub Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Hub</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="rounded-lg border bg-card p-3">
                      <h4 className="font-medium">Disease Prevention</h4>
                      <p className="text-sm text-muted-foreground">Seasonal care guide for monsoon</p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
                      <h4 className="font-medium">Government Subsidies</h4>
                      <p className="text-sm text-muted-foreground">New scheme deadline: April 15</p>
                    </div>
                    <div className="rounded-lg border bg-card p-3">
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

