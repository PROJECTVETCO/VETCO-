"use client"

import type React from "react"

import { useState } from "react"
import { Search, Send, User, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentChat, setCurrentChat] = useState<string | null>("chat1")
  const [messageText, setMessageText] = useState("")

  // Mock contacts data
  const contacts = [
    {
      id: "chat1",
      name: "Dr. James Smith",
      lastMessage: "I'll check on your cattle tomorrow as scheduled.",
      time: "10:30 AM",
      unread: true,
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat2",
      name: "Dr. Angela Mwangi",
      lastMessage: "The test results look good. No concerns at this time.",
      time: "Yesterday",
      unread: false,
      online: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat3",
      name: "Dr. Peter Okello",
      lastMessage: "Please send me photos of the affected animals.",
      time: "Mar 5",
      unread: false,
      online: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock messages data
  const messages = {
    chat1: [
      { id: 1, sender: "them", text: "Hello Rajesh, how are your cattle doing today?", time: "10:00 AM" },
      {
        id: 2,
        sender: "me",
        text: "They're doing well, but I noticed one of them isn't eating as much as usual.",
        time: "10:15 AM",
      },
      { id: 3, sender: "them", text: "I see. Is there any other unusual behavior?", time: "10:20 AM" },
      { id: 4, sender: "me", text: "Not really, just the reduced appetite. Should I be concerned?", time: "10:25 AM" },
      { id: 5, sender: "them", text: "I'll check on your cattle tomorrow as scheduled.", time: "10:30 AM" },
    ],
    chat2: [
      {
        id: 1,
        sender: "me",
        text: "Good morning Dr. Mwangi. Have you received the test results?",
        time: "Yesterday, 9:00 AM",
      },
      { id: 2, sender: "them", text: "Yes, I just got them. Give me a moment to review.", time: "Yesterday, 9:30 AM" },
      {
        id: 3,
        sender: "them",
        text: "The test results look good. No concerns at this time.",
        time: "Yesterday, 10:00 AM",
      },
    ],
    chat3: [
      {
        id: 1,
        sender: "them",
        text: "Hi Rajesh, I heard you have some concerns about your poultry?",
        time: "Mar 5, 2:00 PM",
      },
      {
        id: 2,
        sender: "me",
        text: "Yes, a few of them have developed some spots on their skin.",
        time: "Mar 5, 2:15 PM",
      },
      { id: 3, sender: "them", text: "Please send me photos of the affected animals.", time: "Mar 5, 2:30 PM" },
    ],
  }

  // Filter contacts based on search
  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
      description: "Select a contact to start a new conversation",
    })
  }

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6 h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-muted-foreground">Chat with veterinarians and experts</p>
          </div>

          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 flex h-[calc(100vh-12rem)]">
              {/* Contacts sidebar */}
              <div className="w-full sm:w-80 border-r">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search contacts"
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-b">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="unread">Unread</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <ScrollArea className="h-[calc(100%-7.5rem)]">
                  <div className="p-2">
                    {filteredContacts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No contacts found</div>
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
                            <img
                              src={contact.avatar || "/placeholder.svg"}
                              alt={contact.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
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
                          </div>
                          {contact.unread && <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>}
                        </div>
                      ))
                    )}
                    <Button variant="outline" className="w-full mt-2" onClick={startNewChat}>
                      <UserPlus className="h-4 w-4 mr-2" />
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
                        <div className="relative">
                          <img
                            src={contacts.find((c) => c.id === currentChat)?.avatar || "/placeholder.svg"}
                            alt="Contact"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          {contacts.find((c) => c.id === currentChat)?.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{contacts.find((c) => c.id === currentChat)?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contacts.find((c) => c.id === currentChat)?.online ? "Online" : "Offline"}
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
                      <p className="text-muted-foreground">Choose a contact to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

