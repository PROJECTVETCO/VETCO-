"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Users,
  X,
  Check,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("EN")
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
              <Link href="/dashboard/health-records">
                <Button variant="ghost" size="icon">
                  <FileText className="h-5 w-5" />
                  <span className="sr-only">Health Records</span>
                </Button>
              </Link>

              {/* Vet Directory Button */}
              <Link href="/dashboard/vet-directory">
                <Button variant="ghost" size="icon">
                  <MapPin className="h-5 w-5" />
                  <span className="sr-only">Vet Directory</span>
                </Button>
              </Link>

              {/* Knowledge Hub Button */}
              <Link href="/dashboard/knowledge-hub">
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Knowledge Hub</span>
                </Button>
              </Link>

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
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                        <Link href="/dashboard">
                          <Activity className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/appointments"}>
                        <Link href="/dashboard/appointments">
                          <Calendar className="h-4 w-4" />
                          <span>Appointments</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/messages"}>
                        <Link href="/dashboard/messages">
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/dashboard/my-records"}>
                        <Link href="/dashboard/my-records">
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
                    window.location.href = "/dashboard/vet-directory?emergency=true"
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
                    toast({
                      title: "New Health Event",
                      description: "Opening health record form",
                    })
                    window.location.href = "/dashboard/health-records/new"
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Log New Health Event
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

