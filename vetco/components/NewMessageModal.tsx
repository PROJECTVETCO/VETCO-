"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function NewMessageModal({ onMessageSent }: { onMessageSent: () => void }) {
  interface User {
    _id: string;
    fullName: string;
    email: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Get logged-in user's ID from localStorage
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const sender = user?._id; 

      if (!sender) {
        throw new Error("User is not authenticated. Please log in again.");
      }

      if (!recipient) {
        throw new Error("Please select a recipient.");
      }

      if (!message.trim()) {
        throw new Error("Message cannot be empty.");
      }

      const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender, recipient, content: message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      toast({
        title: "✅ Message Sent",
        description: `Your message was sent successfully.`,
        variant: "success",
      });

      // Reset form
      setRecipient("");
      setMessage("");

      // Notify parent to refresh messages
      onMessageSent();
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Message</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a New Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <select 
              id="recipient" 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)} 
              required  
              className="w-full border px-2 py-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Input 
              id="message" 
              placeholder="Type your message..." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
