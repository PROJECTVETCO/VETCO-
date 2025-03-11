"use client"

import { useState } from "react"
import {
  Download,
  Printer,
  Search,
  FileText,
  Calendar,
  Activity,
  Pill,
  Stethoscope,
  Syringe,
  AlertTriangle,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function MyRecordsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<TreatmentRecord | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null)

  interface TreatmentRecord {
    id: string
    animalId: string
    animalType: string
    breed: string
    treatmentDate: string
    treatmentType: string
    diagnosis: string
    medications: Medication[]
    followUpDate?: string
    notes: string
    cost: number
    status: "completed" | "ongoing" | "scheduled"
    vet: {
      id: string
      name: string
      specialty: string
      avatar: string
    }
  }

  interface Medication {
    name: string
    dosage: string
    frequency: string
    duration: string
  }

  interface AnimalSummary {
    id: string
    type: string
    breed: string
    lastTreatment: string
    totalTreatments: number
    totalCost: number
    status: "healthy" | "needs-attention" | "critical"
  }

  // Mock treatment records data
  const treatmentRecords: TreatmentRecord[] = [
    {
      id: "TR001",
      animalId: "C-001",
      animalType: "cattle",
      breed: "Holstein",
      treatmentDate: "2025-03-05",
      treatmentType: "Vaccination",
      diagnosis: "Preventive care",
      medications: [
        {
          name: "FMD Vaccine",
          dosage: "5ml",
          frequency: "Once",
          duration: "N/A",
        },
      ],
      notes: "Routine vaccination for Foot and Mouth Disease. Animal in good health.",
      cost: 45.0,
      status: "completed",
      vet: {
        id: "V001",
        name: "Dr. James Smith",
        specialty: "Large Animal Medicine",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "TR002",
      animalId: "C-001",
      animalType: "cattle",
      breed: "Holstein",
      treatmentDate: "2025-02-10",
      treatmentType: "Check-up",
      diagnosis: "Mild respiratory infection",
      medications: [
        {
          name: "Oxytetracycline",
          dosage: "10ml",
          frequency: "Once daily",
          duration: "5 days",
        },
        {
          name: "Anti-inflammatory",
          dosage: "5ml",
          frequency: "Once daily",
          duration: "3 days",
        },
      ],
      followUpDate: "2025-02-17",
      notes:
        "Animal showing signs of mild respiratory distress. Prescribed antibiotics and anti-inflammatory medication.",
      cost: 75.5,
      status: "completed",
      vet: {
        id: "V001",
        name: "Dr. James Smith",
        specialty: "Large Animal Medicine",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "TR003",
      animalId: "C-002",
      animalType: "cattle",
      breed: "Jersey",
      treatmentDate: "2025-03-02",
      treatmentType: "Emergency",
      diagnosis: "Bloat",
      medications: [
        {
          name: "Anti-bloat medication",
          dosage: "15ml",
          frequency: "Once",
          duration: "N/A",
        },
      ],
      followUpDate: "2025-03-09",
      notes: "Severe bloating observed. Emergency treatment administered. Animal responded well to treatment.",
      cost: 120.0,
      status: "ongoing",
      vet: {
        id: "V002",
        name: "Dr. Angela Mwangi",
        specialty: "Dairy Cattle Health",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "TR004",
      animalId: "P-001",
      animalType: "poultry",
      breed: "Broiler",
      treatmentDate: "2025-03-01",
      treatmentType: "Vaccination",
      diagnosis: "Preventive care",
      medications: [
        {
          name: "Newcastle Disease Vaccine",
          dosage: "0.5ml",
          frequency: "Once",
          duration: "N/A",
        },
      ],
      notes: "Routine vaccination for Newcastle Disease. Flock in good health.",
      cost: 35.0,
      status: "completed",
      vet: {
        id: "V003",
        name: "Dr. Peter Okello",
        specialty: "Poultry & Livestock",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "TR005",
      animalId: "G-001",
      animalType: "goat",
      breed: "Boer",
      treatmentDate: "2025-03-15",
      treatmentType: "Scheduled Check-up",
      diagnosis: "Pending",
      medications: [],
      notes: "Scheduled routine check-up and deworming.",
      cost: 40.0,
      status: "scheduled",
      vet: {
        id: "V001",
        name: "Dr. James Smith",
        specialty: "Large Animal Medicine",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: "TR006",
      animalId: "C-003",
      animalType: "cattle",
      breed: "Angus",
      treatmentDate: "2025-02-25",
      treatmentType: "Surgery",
      diagnosis: "Dystocia (difficult calving)",
      medications: [
        {
          name: "Antibiotics",
          dosage: "15ml",
          frequency: "Twice daily",
          duration: "7 days",
        },
        {
          name: "Pain medication",
          dosage: "10ml",
          frequency: "Once daily",
          duration: "5 days",
        },
      ],
      followUpDate: "2025-03-04",
      notes: "Cesarean section performed due to difficult calving. Mother and calf doing well post-surgery.",
      cost: 350.0,
      status: "completed",
      vet: {
        id: "V004",
        name: "Dr. Sarah Kimani",
        specialty: "Veterinary Surgery",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  // Generate animal summaries from treatment records
  const generateAnimalSummaries = (): AnimalSummary[] => {
    const animalMap = new Map<string, AnimalSummary>()

    treatmentRecords.forEach((record) => {
      if (!animalMap.has(record.animalId)) {
        animalMap.set(record.animalId, {
          id: record.animalId,
          type: record.animalType,
          breed: record.breed,
          lastTreatment: record.treatmentDate,
          totalTreatments: 1,
          totalCost: record.cost,
          status: "healthy",
        })
      } else {
        const existing = animalMap.get(record.animalId)!
        const newLastTreatment =
          new Date(record.treatmentDate) > new Date(existing.lastTreatment)
            ? record.treatmentDate
            : existing.lastTreatment

        animalMap.set(record.animalId, {
          ...existing,
          lastTreatment: newLastTreatment,
          totalTreatments: existing.totalTreatments + 1,
          totalCost: existing.totalCost + record.cost,
          // If any ongoing treatments, mark as needs-attention
          status: record.status === "ongoing" ? "needs-attention" : existing.status,
        })
      }
    })

    return Array.from(animalMap.values())
  }

  const animalSummaries = generateAnimalSummaries()

  // Filter records based on search and filters
  const filteredRecords = treatmentRecords.filter((record) => {
    // Filter by selected animal
    if (selectedAnimal && record.animalId !== selectedAnimal) {
      return false
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      record.animalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.treatmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vet.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by treatment type
    const matchesType = typeFilter === "all" || record.treatmentType.toLowerCase() === typeFilter.toLowerCase()

    // Filter by status
    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    // Filter by date
    const matchesDate = dateFilter === "" || record.treatmentDate === dateFilter

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  const exportRecords = () => {
    toast({
      title: "Exporting records",
      description: "Your treatment records are being exported to CSV",
    })
  }

  const printRecord = (id: string) => {
    toast({
      title: "Printing record",
      description: `Printing record ${id}`,
    })
  }

  const viewRecord = (record: TreatmentRecord) => {
    setSelectedRecord(record)
  }

  const getTreatmentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "vaccination":
        return <Syringe className="h-4 w-4" />
      case "check-up":
        return <Stethoscope className="h-4 w-4" />
      case "emergency":
        return <AlertTriangle className="h-4 w-4" />
      case "surgery":
        return <Activity className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "ongoing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "scheduled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return ""
    }
  }

  const getAnimalStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Records</h1>
            <p className="text-muted-foreground">View treatment history and health records for your animals</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={exportRecords}>
              <Download className="h-4 w-4 mr-2" />
              Export Records
            </Button>
          </div>
        </div>

        <Tabs defaultValue="animals" className="mb-6">
          <TabsList>
            <TabsTrigger value="animals">My Animals</TabsTrigger>
            <TabsTrigger value="treatments">Treatment History</TabsTrigger>
          </TabsList>

          <TabsContent value="animals" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Animal Health Summary</CardTitle>
                <CardDescription>Overview of all your animals and their health status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Animal ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Breed</TableHead>
                        <TableHead>Last Treatment</TableHead>
                        <TableHead>Total Treatments</TableHead>
                        <TableHead>Total Cost</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {animalSummaries.map((animal) => (
                        <TableRow key={animal.id}>
                          <TableCell className="font-medium">{animal.id}</TableCell>
                          <TableCell className="capitalize">{animal.type}</TableCell>
                          <TableCell>{animal.breed}</TableCell>
                          <TableCell>{new Date(animal.lastTreatment).toLocaleDateString()}</TableCell>
                          <TableCell>{animal.totalTreatments}</TableCell>
                          <TableCell>${animal.totalCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getAnimalStatusColor(animal.status)}>
                              {animal.status === "healthy"
                                ? "Healthy"
                                : animal.status === "needs-attention"
                                  ? "Needs Attention"
                                  : "Critical"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAnimal(animal.id)
                                const tabTrigger = document.querySelector(
                                  '[data-state="inactive"][value="treatments"]',
                                ) as HTMLElement
                                if (tabTrigger) tabTrigger.click()
                              }}
                            >
                              View History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments" className="mt-4">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
                {selectedAnimal && (
                  <Badge variant="outline" className="mt-2">
                    Showing records for: {selectedAnimal}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 ml-2 p-0"
                      onClick={() => setSelectedAnimal(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, treatment, or vet"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="vaccination">Vaccination</SelectItem>
                        <SelectItem value="check-up">Check-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="surgery">Surgery</SelectItem>
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
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      placeholder="Filter by date"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Animal</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Vet</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                        No treatment records found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{record.animalId}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {record.animalType} - {record.breed}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.treatmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getTreatmentTypeIcon(record.treatmentType)}
                            <span>{record.treatmentType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{record.diagnosis}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={record.vet.avatar} alt={record.vet.name} />
                              <AvatarFallback>{record.vet.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{record.vet.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>${record.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => viewRecord(record)}>
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => printRecord(record.id)}>
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Treatment Record Detail Dialog */}
        {selectedRecord && (
          <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Treatment Record Details</DialogTitle>
                <DialogDescription>
                  {selectedRecord.id} - {new Date(selectedRecord.treatmentDate).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Animal Information</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">ID:</span> {selectedRecord.animalId}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        <span className="capitalize">{selectedRecord.animalType}</span>
                      </p>
                      <p>
                        <span className="font-medium">Breed:</span> {selectedRecord.breed}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Treatment Information</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Type:</span> {selectedRecord.treatmentType}
                      </p>
                      <p>
                        <span className="font-medium">Diagnosis:</span> {selectedRecord.diagnosis}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <Badge className={getStatusColor(selectedRecord.status)}>
                          {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                        </Badge>
                      </p>
                      {selectedRecord.followUpDate && (
                        <p>
                          <span className="font-medium">Follow-up Date:</span>{" "}
                          {new Date(selectedRecord.followUpDate).toLocaleDateString()}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Cost:</span> ${selectedRecord.cost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Veterinarian</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar>
                        <AvatarImage src={selectedRecord.vet.avatar} alt={selectedRecord.vet.name} />
                        <AvatarFallback>{selectedRecord.vet.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedRecord.vet.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedRecord.vet.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Notes</h3>
                    <p className="text-sm">{selectedRecord.notes}</p>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="medications">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      <span>Medications & Treatments ({selectedRecord.medications.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {selectedRecord.medications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No medications prescribed</p>
                    ) : (
                      <div className="rounded-md border mt-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                              <TableHead>Duration</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedRecord.medications.map((med, index) => (
                              <TableRow key={index}>
                                <TableCell>{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                                <TableCell>{med.duration}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <DialogFooter className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => printRecord(selectedRecord.id)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  {selectedRecord.status === "scheduled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Rescheduling appointment",
                          description: "Opening reschedule form",
                        })
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  )}
                </div>
                <Button onClick={() => setSelectedRecord(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

