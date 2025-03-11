"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Calendar, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { VetDashboardLayout } from "@/components/vet-dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function FarmerDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")

  // Mock farmers data
  const farmers = [
    {
      id: "F001",
      name: "Rajesh Kumar",
      location: "Pune, Maharashtra",
      contact: "+254 712 345 678",
      farmType: "Dairy Farm",
      animals: "15 cattle, 5 goats",
      lastVisit: "Feb 28, 2025",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "F002",
      name: "Aisha Omondi",
      location: "Nakuru, Kenya",
      contact: "+254 798 765 432",
      farmType: "Mixed Livestock",
      animals: "8 cattle, 20 poultry",
      lastVisit: "Mar 2, 2025",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "F003",
      name: "Samuel Maina",
      location: "Nairobi, Kenya",
      contact: "+254 711 223 344",
      farmType: "Poultry Farm",
      animals: "200 poultry",
      lastVisit: "Mar 5, 2025",
      avatar: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "F004",
      name: "Priya Sharma",
      location: "Delhi, India",
      contact: "+254 722 123 456",
      farmType: "Goat Farm",
      animals: "25 goats",
      lastVisit: "Feb 25, 2025",
      avatar: "/placeholder.svg?height=64&width=64",
    },
  ]

  // Get unique locations for filter
  const locations = Array.from(new Set(farmers.map((farmer) => farmer.location.split(", ")[1])))

  // Filter farmers based on search and filters
  const filteredFarmers = farmers.filter((farmer) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.animals.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by location
    const matchesLocation = locationFilter === "all" || farmer.location.includes(locationFilter)

    return matchesSearch && matchesLocation
  })

  const scheduleAppointment = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    if (farmer) {
      toast({
        title: "Scheduling appointment",
        description: `Opening appointment form for ${farmer.name}`,
      })
      window.location.href = `/vet-dashboard/appointments/new?farmer=${farmerId}`
    }
  }

  const sendMessage = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    if (farmer) {
      toast({
        title: "Opening chat",
        description: `Starting conversation with ${farmer.name}`,
      })
      window.location.href = `/vet-dashboard/messages?farmer=${farmerId}`
    }
  }

  const viewFarmerProfile = (farmerId: string) => {
    const farmer = farmers.find((f) => f.id === farmerId)
    if (farmer) {
      toast({
        title: "Viewing profile",
        description: `Opening ${farmer.name}'s profile`,
      })
      window.location.href = `/vet-dashboard/farmers/${farmerId}`
    }
  }

  return (
    <VetDashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Farmer Directory</h1>
            <p className="text-muted-foreground">View and manage your farmer clients</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, farm type, or animals"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredFarmers.length === 0 ? (
            <div className="md:col-span-2 rounded-md border p-8 text-center">
              <p className="text-muted-foreground">No farmers found matching your filters</p>
            </div>
          ) : (
            filteredFarmers.map((farmer) => (
              <Card key={farmer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={farmer.avatar} alt={farmer.name} />
                      <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{farmer.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="mr-1 h-3 w-3" />
                        {farmer.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone className="mr-1 h-3 w-3" />
                        {farmer.contact}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm font-medium">Farm Type</p>
                          <p className="text-sm text-muted-foreground">{farmer.farmType}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Animals</p>
                          <p className="text-sm text-muted-foreground">{farmer.animals}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium">Last Visit</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {farmer.lastVisit}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewFarmerProfile(farmer.id)}>
                          View Profile
                        </Button>
                        <Button size="sm" onClick={() => scheduleAppointment(farmer.id)}>
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule Visit
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => sendMessage(farmer.id)}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </VetDashboardLayout>
  )
}

