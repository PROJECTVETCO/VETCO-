import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stethoscope, Syringe, AlertTriangle, MessageCircle, BookOpen, Microscope } from "lucide-react"

export default function ServicesPage() {
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
        <section className="bg-gradient-to-r from-green-600 to-green-700 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-center">Our Services</h1>
            <p className="mt-6 text-xl text-center max-w-2xl mx-auto">
              Comprehensive veterinary care tailored for smallholder farmers in Uganda
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Stethoscope className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>General Health Check-ups</CardTitle>
                  <CardDescription>Regular health assessments for your livestock</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Comprehensive physical examinations</li>
                    <li>Early disease detection</li>
                    <li>Nutritional advice</li>
                    <li>Growth monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Syringe className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Vaccinations</CardTitle>
                  <CardDescription>Protect your animals from common diseases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Customized vaccination schedules</li>
                    <li>High-quality vaccines</li>
                    <li>Record keeping and reminders</li>
                    <li>Post-vaccination monitoring</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <AlertTriangle className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Emergency Care</CardTitle>
                  <CardDescription>24/7 support for urgent veterinary needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Rapid response team</li>
                    <li>On-site emergency treatments</li>
                    <li>Critical care support</li>
                    <li>Follow-up care</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageCircle className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Telemedicine Consultations</CardTitle>
                  <CardDescription>Expert advice at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Video consultations</li>
                    <li>Quick query resolutions</li>
                    <li>Digital prescriptions</li>
                    <li>Follow-up check-ins</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Farmer Education</CardTitle>
                  <CardDescription>Empowering you with knowledge</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Workshops and seminars</li>
                    <li>Best practice guides</li>
                    <li>Disease prevention tips</li>
                    <li>Sustainable farming techniques</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Microscope className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Diagnostic Services</CardTitle>
                  <CardDescription>Advanced testing for accurate diagnoses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Laboratory testing</li>
                    <li>Parasitology screenings</li>
                    <li>Nutritional assessments</li>
                    <li>Genetic testing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join VetCo today and give your animals the care they deserve.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Sign Up Now</Link>
            </Button>
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
                  <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link href="/services#emergency" className="text-sm text-muted-foreground hover:text-foreground">
                    Emergency Care
                  </Link>
                </li>
                <li>
                  <Link href="/services#vaccinations" className="text-sm text-muted-foreground hover:text-foreground">
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

