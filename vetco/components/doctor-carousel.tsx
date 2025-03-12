"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Briefcase, MapPin, PhoneCall, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Doctor {
  id: number
  name: string
  expertise: string
  location: string
  contact: string
  availability: string
  profilePic: string
}

export function DoctorCarousel() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vetco.onrender.com"

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem("token")

        if (!token) {
          console.log("🔍 No authentication token found for doctors. Using demo data.")
          // Fallback data for demo purposes
          setDoctors([
            {
              id: 1,
              name: "Dr.Okiria Jude",
              expertise: "Large Animal Medicine",
              location: "Kampala,Uganda",
              contact: "+256 772 345 678",
              availability: "Mon - Fri: 9 AM - 5 PM",
              profilePic: "/placeholder.svg?height=64&width=64",
            },
            {
              id: 2,
              name: "Dr. Angela Mwangi",
              expertise: "Dairy Cattle Health",
              location: "Nakasongola, Uganda",
              contact: "+256 788 765 432",
              availability: "Weekends Only",
              profilePic: "/placeholder.svg?height=64&width=64",
            },
            {
              id: 3,
              name: "Dr. Peter Okello",
              expertise: "Poultry & Livestock",
              location: "Kitende, Uganda",
              contact: "+256 771 223 344",
              availability: "Mon - Sat: 8 AM - 6 PM",
              profilePic: "/placeholder.svg?height=64&width=64",
            },
          ])
          setLoading(false)
          return
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.statusText}`)
        }

        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setError(error.message || "Failed to fetch doctors")

        // Fallback data for demo purposes
        setDoctors([
          {
            id: 1,
            name: "Dr. Okiria Jude",
            expertise: "Large Animal Medicine",
            location: "Kampala, Uganda",
            contact: "+256 772 345 678",
            availability: "Mon - Fri: 9 AM - 5 PM",
            profilePic: "/placeholder.svg?height=64&width=64",
          },
          {
            id: 2,
            name: "Dr. Angela Mwangi",
            expertise: "Dairy Cattle Health",
            location: "Nakasongola, Uganda",
            contact: "+256 788 765 432",
            availability: "Weekends Only",
            profilePic: "/placeholder.svg?height=64&width=64",
          },
          {
            id: 3,
            name: "Dr. Peter Okello",
            expertise: "Poultry & Livestock",
            location: "Kitende, Uganda",
            contact: "+256 771 223 344",
            availability: "Mon - Sat: 8 AM - 6 PM",
            profilePic: "/placeholder.svg?height=64&width=64",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === doctors.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? doctors.length - 1 : prevIndex - 1))
  }

  if (loading) {
    return <div className="text-center py-8">Loading doctors...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (doctors.length === 0) {
    return <div className="text-center py-8">No doctors available at the moment.</div>
  }

  // For mobile, show one doctor at a time
  // For desktop, show up to 3 doctors at a time
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false
  const visibleDoctors = isMobile
    ? [doctors[currentIndex]]
    : doctors.length <= 3
      ? doctors
      : [
          doctors[currentIndex],
          doctors[(currentIndex + 1) % doctors.length],
          doctors[(currentIndex + 2) % doctors.length],
        ]

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Available Veterinarians</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextSlide}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {visibleDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={doctor.profilePic || "/placeholder.svg?height=64&width=64"}
                  alt={doctor.name}
                  className="h-16 w-16 rounded-full object-cover border"
                />
                <div className="space-y-1">
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> {doctor.expertise}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {doctor.location}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" /> {doctor.contact}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {doctor.availability}
                  </p>
                </div>
              </div>
              {/* <Button className="mt-3 w-full" size="sm" onClick={() => setSelectedDoctor(doctor)}>
              Book Appointment
            </Button> */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

