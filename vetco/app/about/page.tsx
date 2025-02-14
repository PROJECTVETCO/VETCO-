import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, MessageSquare, Calendar, Shield } from "lucide-react"

export default function AboutPage() {
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

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">About VetCo</h1>
            <p className="mt-6 text-lg max-w-3xl">
              VetCo is revolutionizing veterinary care for smallholder farmers by connecting them with professional
              veterinarians through our innovative platform. Our mission is to improve animal health and farmer
              livelihoods across the globe.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Founded in 2024, VetCo emerged from a simple yet powerful idea: to bridge the gap between local
                  farmers in Uganda and veterinary professionals. Our founders, having grown up in rural farming
                  communities in Uganda, understood firsthand the challenges faced by farmers in accessing quality
                  veterinary care.
                </p>
                <p className="mt-4 text-lg text-muted-foreground">
                  What started as a local initiative in Uganda has now grown into a promising platform, connecting
                  farmers with skilled veterinarians, and improving the lives of countless animals across the country.
                  We are committed to expanding our services to reach more farmers and make a lasting impact on animal
                  health and agricultural productivity in Uganda.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="VetCo founders" fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-center">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              At VetCo, our mission is to empower local farmers in Uganda with access to professional veterinary care,
              enhancing animal health, and improving agricultural productivity. We strive to create a network where
              every Ugandan farmer has the resources they need to care for their animals effectively.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-green-600" />
                  <CardTitle className="mt-4">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Bringing veterinary expertise to remote and underserved farming communities.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-green-600" />
                  <CardTitle className="mt-4">Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Facilitating direct and efficient communication between farmers and vets.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-green-600" />
                  <CardTitle className="mt-4">Timeliness</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ensuring prompt veterinary assistance to prevent and treat animal health issues.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-green-600" />
                  <CardTitle className="mt-4">Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Maintaining high standards of veterinary care through our verified professional network.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-center">Meet Our Team</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Our diverse team of experts is passionate about revolutionizing veterinary care and supporting smallholder
              farmers.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {[
                { name: "Jimmy Bujjingo", role: "Co-founder", image: "/placeholder.svg" },
                { name: "Adebua Vani Joshua", role: "Co-founder", image: "/placeholder.svg" },
              ].map((member) => (
                <Card key={member.name}>
                  <CardHeader>
                    <div className="relative h-40 w-40 mx-auto rounded-full overflow-hidden">
                      <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                    </div>
                    <CardTitle className="mt-4 text-center">{member.name}</CardTitle>
                    <CardDescription className="text-center">{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-600 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-3xl font-bold">Join the VetCo Community</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Whether you're a farmer looking for expert veterinary care or a veterinarian wanting to make a difference,
              VetCo is here to connect you. Join our growing community today and be part of the future of animal
              healthcare.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup?type=farmer">Join as a Farmer</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup?type=vet">Join as a Vet</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
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

