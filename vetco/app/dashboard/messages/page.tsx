"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Activity, Calendar, RefreshCw } from "lucide-react";
import NewMessageModal from "@/components/NewMessageModal";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

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
  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loadingReply, setLoadingReply] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchMessages() {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?._id;

      if (!token || !userId) {
        setError("Unauthorized. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/messages/recent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Ensure token is sent
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMessages(Array.isArray(data) ? data : []); // ✅ Ensuring it's an array
      } catch (err: any) {
        console.error("Error fetching messages:", err);
        setError(err.message || "Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [refreshMessages]);

  const handleReply = async () => {
    if (!replyMessage.trim() || !replyingTo) return;
    setLoadingReply(true);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const senderId = user?._id;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token
        },
        body: JSON.stringify({ sender: senderId, recipient: replyingTo, content: replyMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      setReplyMessage("");
      setReplyingTo(null);
      setRefreshMessages(!refreshMessages);
      toast({ title: "Success", description: "Reply sent successfully." });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({ title: "Error", description: "Failed to send message." });
    } finally {
      setLoadingReply(false);
    }
  };

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
          <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Activity className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/dashboard/appointments" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Calendar className="h-4 w-4" />
            Appointments
          </Link>
          <Link href="/dashboard/messages" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
          <Link href="/dashboard/network" className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
            <Users className="h-4 w-4" />
            My Records
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
          {/* Recent Messages */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>Your latest messages</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading messages...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="border-b pb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-semibold">
                          {msg.sender.fullName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {msg.sender.fullName} → {msg.recipient.fullName}
                          </p>
                          <p className="text-sm text-muted-foreground">{msg.content}</p>
                        </div>
                        <Button size="sm" onClick={() => setReplyingTo(msg.sender._id)}>
                          Reply
                        </Button>
                      </div>

                      {/* Reply Input Box */}
                      {replyingTo === msg.sender._id && (
                        <div className="mt-2 flex gap-2">
                          <Input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                          />
                          <Button onClick={handleReply} disabled={loadingReply}>
                            {loadingReply ? "Sending..." : "Send"}
                          </Button>
                        </div>
                      )}
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
