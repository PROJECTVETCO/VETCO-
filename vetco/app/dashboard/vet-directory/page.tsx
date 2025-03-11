"use client"

import { useState, useEffect } from "react"
import { Search, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function VetDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [selectedDistance, setSelectedDistance] = useState("any")
  const [isEmergency, setIsEmergency] = useState(false)

  // Check for emergency parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("emergency") === "true") {
      setIsEmergency(true)
      toast({
        title: "Emergency Mode",
        description: "Showing veterinarians available for emergency services",
      })
    }
  }, [])

  // Mock data for doctors
  const doctors = [
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
      emergency: true,
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
      emergency: false,
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
      emergency: true,
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
      emergency: true,
    },
  ]

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by emergency if needed
    if (isEmergency && !doctor.emergency) return false

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

  const bookAppointment = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      toast({
        title: "Booking initiated",
        description: `Opening appointment form for Dr. ${doctor.name}`,
      })
      window.location.href = `/dashboard/appointments/new?doctor=${doctorId}`
    }
  }

  const viewProfile = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      toast({
        title: "Viewing profile",
        description: `Viewing Dr. ${doctor.name}'s full profile`,
      })
      window.location.href = `/dashboard/vet-directory/${doctorId}`
    }
  }

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Veterinarian Directory</h1>
            <p className="text-muted-foreground">Find and connect with veterinarians in your area</p>
          </div>
          {isEmergency && (
            <div className="mt-4 md:mt-0">
              <Button variant="destructive">Call Emergency Hotline</Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, specialty, location"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specialty</Label>
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

                <div className="space-y-2">
                  <Label>Distance</Label>
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

                {isEmergency && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emergency-only"
                        checked={isEmergency}
                        onCheckedChange={(checked) => {
                          setIsEmergency(!!checked)
                        }}
                      />
                      <label htmlFor="emergency-only" className="text-sm font-medium text-red-600">
                        Emergency Services Only
                      </label>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedSpecialties([])
                    setSelectedDistance("any")
                    setIsEmergency(false)
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{filteredDoctors.length} Veterinarians Found</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDoctors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No veterinarians match your filters</div>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <div key={doctor.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <img
                            src={doctor.profilePic || "/placeholder.svg"}
                            alt={doctor.name}
                            className="h-20 w-20 rounded-full object-cover border"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.expertise}</p>
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <span className="text-sm font-medium mr-1">{doctor.rating}</span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                            <p className="text-sm">
                              📍 {doctor.location} ({doctor.distance} km away)
                            </p>
                            <p className="text-sm">📞 {doctor.contact}</p>
                            <p className="text-sm">🕒 {doctor.availability}</p>
                            {doctor.emergency && (
                              <p className="text-sm text-red-600 font-medium">🚑 Emergency Services Available</p>
                            )}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" onClick={() => viewProfile(doctor.id)}>
                              View Profile
                            </Button>
                            <Button onClick={() => bookAppointment(doctor.id)}>Book Appointment</Button>
                            {doctor.emergency && (
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  toast({
                                    title: "Emergency Contact",
                                    description: `Calling Dr. ${doctor.name} for emergency services`,
                                  })
                                }}
                              >
                                Emergency Contact
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

