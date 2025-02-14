import { Button } from "@/components/ui/button"
import { MapPin, MessageSquare, Calendar, Star, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-600"></div>
            <span className="font-bold text-xl">VetCo</span>
          </Link>
          <nav className="hidden space-x-8 md:flex">
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/services" className="text-sm font-medium">
              Services
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-600 to-green-700 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  Connect with Veterinary Professionals Near You
                </h1>
                <p className="mt-6 text-lg">
                  VetCo brings professional veterinary care to smallholder farmers. Get expert help when you need it,
                  right where you are.
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup?type=farmer">I'm a Farmer</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/signup?type=vet">I'm a Vet</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="Vet caring for animals" fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold">Why Choose VetCo?</h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold">Location-Based Matching</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Find qualified vets in your area quickly and easily
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-4">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold">Real-Time Chat</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Communicate directly with vets and share images instantly
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold">Easy Scheduling</h3>
                <p className="mt-2 text-sm text-muted-foreground">Book appointments with just a few clicks</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-green-100 p-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-4 font-semibold">Verified Professionals</h3>
                <p className="mt-2 text-sm text-muted-foreground">All vets are verified and licensed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-center text-3xl font-bold">Premium Features</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <Star className="h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-xl font-semibold">Video Consultations</h3>
                <p className="mt-2 text-muted-foreground">Get expert advice through secure video calls</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <Star className="h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-xl font-semibold">Priority Booking</h3>
                <p className="mt-2 text-muted-foreground">Get preferred access to veterinary services</p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <Star className="h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-xl font-semibold">Health Records</h3>
                <p className="mt-2 text-muted-foreground">Securely store and access animal health records</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold">About VetCo</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-muted-foreground hover:text-foreground">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Services</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/services/consultations" className="text-sm text-muted-foreground hover:text-foreground">
                    Consultations
                  </Link>
                </li>
                <li>
                  <Link href="/services/emergency" className="text-sm text-muted-foreground hover:text-foreground">
                    Emergency Care
                  </Link>
                </li>
                <li>
                  <Link href="/services/vaccinations" className="text-sm text-muted-foreground hover:text-foreground">
                    Vaccinations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} VetCo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

