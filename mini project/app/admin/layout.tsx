"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { BarChart3, ShoppingCart, Calendar, Menu, Package, Users, MessageSquare, QrCode, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/admin/menu", label: "Menu Manager", icon: Menu },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/qr", label: "QR Generator", icon: QrCode },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <CartProvider>
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="flex">
          {/* Admin Sidebar */}
          <div className="w-64 min-h-screen bg-brown-900 text-cream-50 p-4">
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold">Admin Panel</h2>
            </div>
            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive
                          ? "bg-brown-800 text-cream-50"
                          : "text-cream-100 hover:bg-brown-800 hover:text-cream-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </CartProvider>
  )
}
