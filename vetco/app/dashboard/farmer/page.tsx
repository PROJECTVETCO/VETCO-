import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, AlertCircle, Activity, PhoneCall, MapPin, Briefcase } from "lucide-react"

const vets = [
  {
    id: 1,
    name: "Dr. James Smith",
    expertise: "Large Animal Medicine",
    location: "Nairobi, Kenya",
    contact: "+254 712 345 678",
    availability: "Mon - Fri: 9 AM - 5 PM",
    profilePic: "/images/vet1.jpg", // Replace with actual uploaded image path
  },
  {
    id: 2,
    name: "Dr. Angela Mwangi",
    expertise: "Dairy Cattle Health",
    location: "Kisumu, Kenya",
    contact: "+254 798 765 432",
    availability: "Weekends Only",
    profilePic: "/images/vet2.jpg",
  },
  {
    id: 3,
    name: "Dr. Peter Okello",
    expertise: "Poultry & Livestock",
    location: "Mombasa, Kenya",
    contact: "+254 711 223 344",
    availability: "Mon - Sat: 8 AM - 6 PM",
    profilePic: "/images/vet3.jpg",
  },
];

export default function FarmerDashboard() {
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
          <Link href="/dashboard/farmer" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/farmer/appointments" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link href="/dashboard/farmer/messages" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link href="/dashboard/farmer/alerts" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <AlertCircle className="h-4 w-4" />
            Health Alerts
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Farmer Dashboard</h1>
            <Button>Request Consultation</Button>
          </div>
        </div>

        <div className="p-4">
          {/* Available Vets Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Available Vets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vets.map((vet) => (
                  <Card key={vet.id} className="shadow-md p-4">
                    <div className="flex items-center gap-4">
                      <img src={vet.profilePic} alt={vet.name} className="h-16 w-16 rounded-full object-cover border" />
                      <div>
                        <h2 className="text-lg font-semibold">{vet.name}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Briefcase className="h-4 w-4" /> {vet.expertise}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> {vet.location}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><PhoneCall className="h-4 w-4" /> {vet.contact}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-4 w-4" /> {vet.availability}</p>
                        <Button className="mt-2" variant="default">Book Appointment</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
