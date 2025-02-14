import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
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
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-center">Simple, Transparent Pricing</h1>
            <p className="mt-6 text-xl text-center max-w-2xl mx-auto">
              Choose the plan that's right for you and start connecting with veterinary professionals today.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For small-scale farmers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    10,000 UGX<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Up to 10 animals
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> 5 consultations/month
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Basic health tracking
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className="border-green-600">
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For growing farms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">
                    19,999 UGX<span className="text-sm font-normal">/month</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Up to 50 animals
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Unlimited consultations
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Advanced health tracking
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Priority support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Get Started</Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large-scale operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">Custom</div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Unlimited animals
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Unlimited consultations
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-600" /> Dedicated account manager
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Contact Sales</Button>
                </CardFooter>
              </Card>
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

