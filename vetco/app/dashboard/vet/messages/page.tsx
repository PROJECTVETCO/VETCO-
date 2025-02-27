"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MessageSquare, Users, Activity, Calendar } from "lucide-react";
import NewMessageModal from "@/components/NewMessageModal";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, MessageSquare, Users, Activity, ClipboardCheck, Stethoscope, ClipboardList } from "lucide-react";

export default function MessagesPage() {
  interface Message {
    _id: string;
    sender: { _id: string; fullName: string };
    recipient: { _id: string; fullName: string };
    content: string;
    createdAt: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchMessages() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized. Please log in.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/messages/recent`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setMessages(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!token || !user) {
      setError("Unauthorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sender: user._id, recipient: activeChat.sender._id, content: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      toast({ title: "Success", description: "Message sent successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message." });
    }
  };

  return (
    <div className="flex min-h-screen">
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
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
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
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
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
          <Link
            href="/dashboard/vet/records"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <ClipboardCheck className="h-4 w-4" />
            Farmers Records
          </Link>
        </nav>
      </aside>
      {/* Chat Container */}
      <main className="flex-1 flex">
        {/* Chat List */}
        <div className="w-1/3 border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          {messages.map((msg) => (
            <div key={msg._id} className="p-3 border-b cursor-pointer hover:bg-gray-100" onClick={() => setActiveChat(msg)}>
              <p className="font-medium">{msg.sender.fullName}</p>
              <p className="text-sm text-gray-500 truncate">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
          {activeChat ? (
            <>
              <div className="border-b p-4 font-bold">Chat with {activeChat.sender.fullName}</div>
              <div className="flex-1 p-4 overflow-y-auto">
                <p className="text-gray-600">{activeChat.content}</p>
              </div>
              <div className="border-t p-4 flex gap-2">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">Select a conversation to start chatting</div>
          )}
        </div>
      </main>
    </div>
  );
}
