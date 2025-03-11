"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  Calendar,
  FileText,
  Globe,
  Home,
  MessageSquare,
  Settings,
  User,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface VetDashboardLayoutProps {
  children: React.ReactNode
}

export function VetDashboardLayout({ children }: VetDashboardLayoutProps) {
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("EN")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Emergency Request",
      message: "Aisha Omondi has reported an emergency with a cow showing respiratory distress.",
      time: "1 hour ago",
      read: false,
      type: "emergency",
    },
    {
      id: 2,
      title: "New Appointment Request",
      message: "Rajesh Kumar has requested a farm visit for cattle vaccination on March 15, 2025.",
      time: "30 minutes ago",
      read: false,
      type: "appointment",
    },
    {
      id: 3,
      title: "New Message",
      message: "Samuel Maina has sent you a message about poultry vaccination schedule.",
      time: "2 hours ago",
      read: false,
      type: "message",
    },
    {
      id: 4,
      title: "Appointment Reminder",
      message: "You have a farm visit scheduled with Priya Sharma tomorrow at 10:00 AM.",
      time: "Yesterday",
      read: true,
      type: "reminder",
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
  const emergencyCount = notifications.filter(
    (notification) => !notification.read && notification.type === "emergency",
  ).length

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
            <div className="ml-4 bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm">Vet Portal</div>
            <nav className="ml-auto flex items-center gap-4 md:gap-6">
              {/* Patient Records Button */}
              <Link href="/vet-dashboard/patient-records">
                <Button variant="ghost" size="icon">
                  <FileText className="h-5 w-5" />
                  <span className="sr-only">Patient Records</span>
                </Button>
              </Link>

              {/* Appointments Button */}
              <Link href="/vet-dashboard/appointments">
                <Button variant="ghost" size="icon">
                  <Calendar className="h-5 w-5" />
                  <span className="sr-only">Appointments</span>
                </Button>
              </Link>

              {/* Messages Button */}
              <Link href="/vet-dashboard/messages">
                <Button variant="ghost" size="icon">
                  <MessageSquare className="h-5 w-5" />
                  <span className="sr-only">Messages</span>
                </Button>
              </Link>

              {/* Profile Button */}
              <Link href="/vet-dashboard/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
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
                      <SheetDescription>Stay updated with patient requests and alerts</SheetDescription>
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
                            className={`relative rounded-lg border p-4 ${
                              notification.type === "emergency" ? "border-red-200 bg-red-50" : ""
                            } ${notification.read ? "" : "bg-muted/30"}`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className={`font-medium ${notification.type === "emergency" ? "text-red-600" : ""}`}>
                                {notification.title}
                                {notification.type === "emergency" && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                    Emergency
                                  </span>
                                )}
                              </h4>
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
                            {notification.type === "emergency" && !notification.read && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => {
                                    markNotificationAsRead(notification.id)
                                    toast({
                                      title: "Responding to emergency",
                                      description: "Connecting you with the farmer",
                                    })
                                  }}
                                >
                                  Respond Now
                                </Button>
                              </div>
                            )}
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

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Dr. James Smith" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => (window.location.href = "/vet-dashboard/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (window.location.href = "/vet-dashboard/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (window.location.href = "/vet-dashboard/availability")}>
                    Manage Availability
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => (window.location.href = "/auth/login")}>Log out</DropdownMenuItem>
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
                <span className="font-bold">VetCo Portal</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard"}>
                        <Link href="/vet-dashboard">
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/appointments"}>
                        <Link href="/vet-dashboard/appointments">
                          <Calendar className="h-4 w-4" />
                          <span>Appointments</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/messages"}>
                        <Link href="/vet-dashboard/messages">
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/patient-records"}>
                        <Link href="/vet-dashboard/patient-records">
                          <FileText className="h-4 w-4" />
                          <span>Patient Records</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/farmers"}>
                        <Link href="/vet-dashboard/farmers">
                          <Users className="h-4 w-4" />
                          <span>Farmer Directory</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/availability"}>
                        <Link href="/vet-dashboard/availability">
                          <Calendar className="h-4 w-4" />
                          <span>Availability</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/profile"}>
                        <Link href="/vet-dashboard/profile">
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/vet-dashboard/settings"}>
                        <Link href="/vet-dashboard/settings">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {emergencyCount > 0 && (
                <SidebarGroup>
                  <SidebarGroupLabel>Emergency Alerts</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <div className="space-y-3 px-2">
                      <Alert variant="destructive" className="border-red-600/50 bg-red-50 text-red-900">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Emergency Request</AlertTitle>
                        <AlertDescription className="text-xs">
                          {emergencyCount} emergency request{emergencyCount > 1 ? "s" : ""} requiring immediate
                          attention
                        </AlertDescription>
                      </Alert>
                    </div>
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </SidebarContent>
            <SidebarFooter>
              <div className="space-y-2 p-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Availability updated",
                      description: "Your availability has been updated",
                    })
                    window.location.href = "/vet-dashboard/availability"
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Update Availability
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Emergency Mode",
                      description: "Emergency response mode activated",
                    })
                  }}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Emergency Mode
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

