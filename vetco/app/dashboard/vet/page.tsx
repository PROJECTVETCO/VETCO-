import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, Users, Activity } from "lucide-react"

export default function VetDashboard() {
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
          <Link
            href="/dashboard/vet"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/vet/appointments"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/dashboard/vet/messages"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/vet/patients"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Patients
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Vet Dashboard</h1>
            <Button>Update Availability</Button>
          </div>
        </div>

        <div className="p-4">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">+6 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">Next: Today at 2:00 PM</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">3 new messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Consultations</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-green-100"></div>
                  <div>
                    <p className="text-sm font-medium">New appointment scheduled</p>
                    <p className="text-sm text-muted-foreground">Today at 2:00 PM with Farmer John</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                  <div>
                    <p className="text-sm font-medium">New message received</p>
                    <p className="text-sm text-muted-foreground">From Farmer Sarah about pig health</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-yellow-100"></div>
                  <div>
                    <p className="text-sm font-medium">Consultation completed</p>
                    <p className="text-sm text-muted-foreground">With Farmer Mike - Follow-up in 2 weeks</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

