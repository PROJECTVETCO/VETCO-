"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState(searchParams.get("type") || "farmer")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add signup logic here
    toast({
      title: "Account created",
      description: "Please check your email to verify your account.",
    })
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Join VetCo to connect with {userType === "farmer" ? "veterinary professionals" : "farmers"} in your area
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
                <Input id="name" placeholder="John Doe" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              {userType === "vet" && (
                <div className="grid gap-2">
                  <Label htmlFor="license">License Number</Label>
                  <Input id="license" placeholder="Enter your veterinary license number" required />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter your city or address" required />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Account
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
  )
}

