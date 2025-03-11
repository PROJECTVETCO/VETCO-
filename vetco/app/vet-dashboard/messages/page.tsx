"use client"

import type React from "react"

import { useState } from "react"
import { Search, Send, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { VetDashboardLayout } from "@/components/vet-dashboard-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VetMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentChat, setCurrentChat] = useState<string | null>("chat1")
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock contacts data
  const contacts = [
    {
      id: "chat1",
      name: "Rajesh Kumar",
      lastMessage: "Thank you for the information about vaccination schedules.",
      time: "10:30 AM",
      unread: true,
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Pune, Maharashtra",
      type: "regular",
    },
    {
      id: "chat2",
      name: "Aisha Omondi",
      lastMessage: "My cow is still showing signs of respiratory distress. Can you advise?",
      time: "Yesterday",
      unread: true,
      online: false,
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Nakuru, Kenya",
      type: "urgent",
    },
    {
      id: "chat3",
      name: "Samuel Maina",
      lastMessage: "I'll send you photos of the poultry as requested.",
      time: "Mar 5",
      unread: false,
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Nairobi, Kenya",
      type: "regular",
    },
    {
      id: "chat4",
      name: "Priya Sharma",
      lastMessage: "Looking forward to your visit next week.",
      time: "Mar 3",
      unread: false,
      online: false,
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Delhi, India",
      type: "regular",
    },
  ]

  // Mock messages data
  const messages = {
    chat1: [
      {
        id: 1,
        sender: "them",
        text: "Hello Dr. Smith, I wanted to ask about the vaccination schedule for my cattle.",
        time: "10:00 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Hello Rajesh, I recommend vaccinating your cattle against FMD every 6 months. For other diseases like Hemorrhagic Septicemia, once a year is sufficient.",
        time: "10:15 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "Thank you for the information. When would be the best time to schedule these vaccinations?",
        time: "10:20 AM",
      },
      {
        id: 4,
        sender: "me",
        text: "I suggest scheduling FMD vaccinations before the monsoon and winter seasons. For HS, pre-monsoon is ideal. Would you like me to create a calendar for your herd?",
        time: "10:25 AM",
      },
      { id: 5, sender: "them", text: "Thank you for the information about vaccination schedules.", time: "10:30 AM" },
    ],
    chat2: [
      {
        id: 1,
        sender: "them",
        text: "Dr. Smith, one of my cows is showing signs of respiratory distress. She's breathing heavily and not eating well.",
        time: "Yesterday, 9:00 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "I'm sorry to hear that, Aisha. Can you provide more details? Is there any nasal discharge? How long has this been happening?",
        time: "Yesterday, 9:30 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "It started yesterday morning. There's some clear nasal discharge, and she seems to have a slight fever.",
        time: "Yesterday, 10:00 AM",
      },
      {
        id: 4,
        sender: "me",
        text: "This could be a respiratory infection. I recommend isolating her from the herd. I can visit your farm tomorrow morning. In the meantime, keep her hydrated and monitor her temperature.",
        time: "Yesterday, 10:15 AM",
      },
      {
        id: 5,
        sender: "them",
        text: "My cow is still showing signs of respiratory distress. Can you advise?",
        time: "Yesterday, 4:30 PM",
      },
    ],
    chat3: [
      {
        id: 1,
        sender: "me",
        text: "Hello Samuel, regarding your question about the poultry flock, could you send me some photos of the affected birds?",
        time: "Mar 5, 2:00 PM",
      },
      { id: 2, sender: "them", text: "Yes, I'll take some photos today and send them to you.", time: "Mar 5, 2:15 PM" },
      { id: 3, sender: "them", text: "I'll send you photos of the poultry as requested.", time: "Mar 5, 2:30 PM" },
    ],
    chat4: [
      {
        id: 1,
        sender: "me",
        text: "Hello Priya, I've scheduled a farm visit for next Tuesday at 10 AM to check on your cattle. Does that work for you?",
        time: "Mar 3, 11:00 AM",
      },
      {
        id: 2,
        sender: "them",
        text: "Yes, Tuesday at 10 AM works perfectly. Thank you for scheduling the visit.",
        time: "Mar 3, 11:30 AM",
      },
      { id: 3, sender: "them", text: "Looking forward to your visit next week.", time: "Mar 3, 4:00 PM" },
    ],
  }

  // Filter contacts based on search and tab
  const filteredContacts = contacts.filter((contact) => {
    // Filter by search
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && contact.unread) ||
      (activeTab === "urgent" && contact.type === "urgent")

    return matchesSearch && matchesTab
  })

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !currentChat) return

    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    })

    // In a real app, you would send this to an API
    console.log("Sending message:", messageText, "to chat:", currentChat)

    setMessageText("")
  }

  const startNewChat = () => {
    toast({
      title: "New conversation",
      description: "Select a farmer to start a new conversation",
    })
  }

  return (
    <VetDashboardLayout>
      <div className="container p-4 md:p-6 h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Communicate with farmers and provide remote support</p>
          </div>

          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex h-[calc(100vh-12rem)]">
              {/* Contacts sidebar */}
              <div className="w-full sm:w-80 border-r">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search conversations"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                      <TabsTrigger value="urgent">Urgent</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <ScrollArea className="h-[calc(100%-7.5rem)]">
                  <div className="p-2">
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No conversations found</div>
                    ) : (
                      filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            currentChat === contact.id ? "bg-muted" : "hover:bg-muted/50"
                          } ${contact.unread ? "font-medium" : ""}`}
                          onClick={() => setCurrentChat(contact.id)}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar>
                              <AvatarImage src={contact.avatar} alt={contact.name} />
                              <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {contact.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <p className="truncate">{contact.name}</p>
                              <span className="text-xs text-muted-foreground">{contact.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                            <p className="text-xs text-muted-foreground mt-1">{contact.location}</p>
                          </div>
                          {contact.unread && <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>}
                          {contact.type === "urgent" && (
                            <Badge variant="destructive" className="ml-auto">
                              Urgent
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full mt-2" onClick={startNewChat}>
                      New Conversation
                    </Button>
                  </div>
                </ScrollArea>
              </div>

              {/* Chat area */}
              <div className="hidden sm:flex flex-col flex-1">
                {currentChat ? (
                  <>
                    {/* Chat header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={contacts.find((c) => c.id === currentChat)?.avatar || "/placeholder.svg"}
                            alt="Contact"
                          />
                          <AvatarFallback>{contacts.find((c) => c.id === currentChat)?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{contacts.find((c) => c.id === currentChat)?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contacts.find((c) => c.id === currentChat)?.location}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Video call",
                              description: "Starting video call...",
                            })
                          }}
                        >
                          Video Call
                        </Button>
                        {contacts.find((c) => c.id === currentChat)?.type === "urgent" && (
                          <Badge variant="destructive" className="ml-2">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages[currentChat as keyof typeof messages].map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                              >
                                {message.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Message input */}
                    <div className="p-4 border-t">
                      <form onSubmit={sendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Select a conversation</h3>
                      <p className="text-muted-foreground">Choose a farmer to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VetDashboardLayout>
  )
}

