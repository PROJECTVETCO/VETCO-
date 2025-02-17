'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Activity, Calendar } from "lucide-react";
import NewMessageModal from "@/components/NewMessageModal";
import Link from "next/link";

export default function MessagesPage() {
  interface Message {
    _id: string;
    sender: { _id: string; fullName: string };
    recipient: { _id: string; fullName: string };
    content: string;
    createdAt: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [refreshMessages, setRefreshMessages] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchMessages() {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?._id;

      if (!userId) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/messages/recent/${userId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }

    fetchMessages();
  }, [refreshMessages]);

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
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/network"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Network
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
      <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Messages</h1>
            <NewMessageModal onMessageSent={() => setRefreshMessages(!refreshMessages)} />
          </div>
        </div>

        <div className="p-4">
          {/* Message Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-muted-foreground">+15 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Check recent messages</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Engaging clients</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your latest messages</CardDescription>
            </CardHeader>
            <CardContent>
              {messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="flex items-center gap-4 border-b pb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-semibold">
                        {msg.sender.fullName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {msg.sender.fullName} → {msg.recipient.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">{msg.content}</p>
                      </div>
                      <Button size="sm" onClick={() => console.log(`Reply to ${msg.sender.fullName}`)}>
                        Reply
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
