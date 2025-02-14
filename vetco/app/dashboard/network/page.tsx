"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, Activity, Store, Tractor, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const businesses = [
  { name: "Green Pastures Farm", type: "Farm", location: "New York, USA", img: "/farm1.jpg" },
  { name: "Healthy Cattle Vet", type: "Vet Shop", location: "Texas, USA", img: "/vet1.jpg" },
  { name: "Sunrise Poultry", type: "Farm", location: "California, USA", img: "/farm2.jpg" },
];

export default function NetworkPage() {
  const [search, setSearch] = useState("");

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <Tractor className="h-4 w-4" />
            Appointments
          </Link>
          <Link
            href="/dashboard/messages"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <Users className="h-4 w-4" />
            Messages
          </Link>
          <Link
            href="/dashboard/network"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Store className="h-4 w-4" />
            Network
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Network</h1>
            <Button>Add Business</Button>
          </div>
        </div>

        <div className="p-4">
          {/* Network Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Farms</CardTitle>
                <Tractor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vet Shops</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Businesses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+3 from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <div className="mt-6 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search businesses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-lg"
            />
          </div>

          {/* Business Listings */}
          <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business, index) => (
              <Card key={index}>
                <img
                  src={business.img}
                  alt={business.name}
                  className="h-40 w-full object-cover rounded-t-md"
                />
                <CardHeader>
                  <CardTitle>{business.name}</CardTitle>
                  <CardDescription>{business.type} - {business.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
