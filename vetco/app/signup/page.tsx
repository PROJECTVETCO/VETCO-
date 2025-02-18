"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  // ✅ Move `useSearchParams()` inside `useEffect`
  const [userType, setUserType] = useState("farmer");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const type = searchParams.get("type");
      if (type) setUserType(type);
    }
  }, []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          userType,
          licenseNumber: userType === "vet" ? licenseNumber : undefined,
          location,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast({
        title: "✅ Account Created",
        description: "Please log in to access your account.",
        variant: "success",
      });

      router.push("/login");
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message.includes("User already exists")) {
        errorMessage = "⚠️ User already exists. Please log in.";
      } else if (error.message.includes("Server error")) {
        errorMessage = "🚨 Server issue. Try again later.";
      }

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join VetCo to connect with {userType === "farmer" ? "veterinary professionals" : "farmers"} in your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <RadioGroup defaultValue={userType} onValueChange={setUserType} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="farmer" id="farmer" className="peer sr-only" />
                <Label
                  htmlFor="farmer"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Farmer</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="vet" id="vet" className="peer sr-only" />
                <Label
                  htmlFor="vet"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <span>Veterinarian</span>
                </Label>
              </div>
            </RadioGroup>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {userType === "vet" && (
                <div className="grid gap-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" placeholder="Enter your veterinary license number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter your city or address" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
