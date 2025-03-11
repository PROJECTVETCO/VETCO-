"use client"

import { useState } from "react"
import { Download, Printer, Search, FileText, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { VetDashboardLayout } from "@/components/vet-dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PatientRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [farmerFilter, setFarmerFilter] = useState("all")

  // Mock patient records data
  const patientRecords = [
    {
      id: "PR001",
      animalId: "C-001",
      animalType: "cattle",
      breed: "Holstein",
      lastCheckup: "Feb 28, 2025",
      status: "healthy",
      notes: "All vaccinations up to date. Good overall health condition.",
      farmer: {
        id: "F001",
        name: "Rajesh Kumar",
        location: "Pune, Maharashtra",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "PR002",
      animalId: "C-002",
      animalType: "cattle",
      breed: "Jersey",
      lastCheckup: "Mar 2, 2025",
      status: "needs-attention",
      notes: "Showing signs of mild respiratory issues. Scheduled for follow-up next week.",
      farmer: {
        id: "F001",
        name: "Rajesh Kumar",
        location: "Pune, Maharashtra",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "PR003",
      animalId: "C-003",
      animalType: "cattle",
      breed: "Angus",
      lastCheckup: "Mar 5, 2025",
      status: "healthy",
      notes: "Recent vaccination for FMD completed. No health concerns.",
      farmer: {
        id: "F002",
        name: "Aisha Omondi",
        location: "Nakuru, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "PR004",
      animalId: "P-001",
      animalType: "poultry",
      breed: "Broiler",
      lastCheckup: "Mar 1, 2025",
      status: "healthy",
      notes: "Flock is healthy. Recommended feed adjustments for better growth.",
      farmer: {
        id: "F003",
        name: "Samuel Maina",
        location: "Nairobi, Kenya",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "PR005",
      animalId: "G-001",
      animalType: "goat",
      breed: "Boer",
      lastCheckup: "Feb 25, 2025",
      status: "needs-attention",
      notes: "Slight limping observed. Prescribed anti-inflammatory medication.",
      farmer: {
        id: "F004",
        name: "Priya Sharma",
        location: "Delhi, India",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  // Get unique farmers for filter
  const farmers = Array.from(new Set(patientRecords.map((record) => record.farmer.id))).map(
    (id) => patientRecords.find((record) => record.farmer.id === id)?.farmer,
  )

  // Filter records based on search and filters
  const filteredRecords = patientRecords.filter((record) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      record.animalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.farmer.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by animal type
    const matchesType = typeFilter === "all" || record.animalType === typeFilter

    // Filter by status
    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    // Filter by farmer
    const matchesFarmer = farmerFilter === "all" || record.farmer.id === farmerFilter

    return matchesSearch && matchesType && matchesStatus && matchesFarmer
  })

  const exportRecords = () => {
    toast({
      title: "Exporting records",
      description: "Patient records are being exported to CSV",
    })
  }

  const printRecord = (id: string) => {
    toast({
      title: "Printing record",
      description: `Printing record ${id}`,
    })
  }

  const viewRecord = (id: string) => {
    toast({
      title: "Viewing record",
      description: `Opening detailed view for record ${id}`,
    })
    window.location.href = `/vet-dashboard/patient-records/${id}`
  }

  const addNewRecord = () => {
    toast({
      title: "Add new record",
      description: "Opening form to add a new patient record",
    })
    window.location.href = "/vet-dashboard/patient-records/new"
  }

  return (
    <VetDashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Patient Records</h1>
            <p className="text-muted-foreground">Manage livestock health records for all your patients</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={exportRecords}>
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </Button>
            <Button onClick={addNewRecord}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Record
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="cattle">Cattle</TabsTrigger>
            <TabsTrigger value="poultry">Poultry</TabsTrigger>
            <TabsTrigger value="goat">Goats</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, breed, or notes"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by animal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="cattle">Cattle</SelectItem>
                        <SelectItem value="poultry">Poultry</SelectItem>
                        <SelectItem value="goat">Goat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="healthy">Healthy</SelectItem>
                        <SelectItem value="needs-attention">Needs Attention</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={farmerFilter} onValueChange={setFarmerFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by farmer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Farmers</SelectItem>
                        {farmers.map((farmer) => (
                          <SelectItem key={farmer.id} value={farmer.id}>
                            {farmer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cattle">
            <Card>
              <CardHeader>
                <CardTitle>Cattle Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Farmer
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
                      {patientRecords
                        .filter((record) => record.animalType === "cattle")
                        .map((record) => (
                          <tr key={record.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{record.animalId}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage src={record.farmer.avatar} alt={record.farmer.name} />
                                  <AvatarFallback>{record.farmer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {record.farmer.name}
                              </div>
                            </td>
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
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => viewRecord(record.id)}>
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => printRecord(record.id)}>
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="poultry">
            <Card>
              <CardHeader>
                <CardTitle>Poultry Records</CardTitle>
              </CardHeader>
              <CardContent>
                {patientRecords.filter((record) => record.animalType === "poultry").length === 0 ? (
                  <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No poultry records found.</p>
                    <Button className="mt-4" size="sm" onClick={addNewRecord}>
                      Add Poultry Records
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Farmer
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
                        {patientRecords
                          .filter((record) => record.animalType === "poultry")
                          .map((record) => (
                            <tr key={record.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{record.animalId}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={record.farmer.avatar} alt={record.farmer.name} />
                                    <AvatarFallback>{record.farmer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {record.farmer.name}
                                </div>
                              </td>
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
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => viewRecord(record.id)}>
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => printRecord(record.id)}>
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="goat">
            <Card>
              <CardHeader>
                <CardTitle>Goat Records</CardTitle>
              </CardHeader>
              <CardContent>
                {patientRecords.filter((record) => record.animalType === "goat").length === 0 ? (
                  <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No goat records found.</p>
                    <Button className="mt-4" size="sm" onClick={addNewRecord}>
                      Add Goat Records
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Farmer
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
                        {patientRecords
                          .filter((record) => record.animalType === "goat")
                          .map((record) => (
                            <tr key={record.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{record.animalId}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex items-center">
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={record.farmer.avatar} alt={record.farmer.name} />
                                    <AvatarFallback>{record.farmer.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {record.farmer.name}
                                </div>
                              </td>
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
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => viewRecord(record.id)}>
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => printRecord(record.id)}>
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Animal ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Farmer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Type
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
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No records found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{record.id}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{record.animalId}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={record.farmer.avatar} alt={record.farmer.name} />
                            <AvatarFallback>{record.farmer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {record.farmer.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{record.animalType}</td>
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => viewRecord(record.id)}>
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => printRecord(record.id)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </VetDashboardLayout>
  )
}

