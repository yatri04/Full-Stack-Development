"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { usePathname } from "next/navigation"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  // Don't show regular navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/reservations", label: "Reserve" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-sm border-b border-brown-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brown-500 to-brown-700 rounded-full flex items-center justify-center">
              <span className="text-cream-50 font-bold text-sm">B&B</span>
            </div>
            <span className="font-serif text-xl font-bold text-brown-900">Brew & Bloom</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-brown-700 hover:text-brown-900 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-brown-700 hover:text-brown-900 hover:bg-brown-50">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-brown-600 text-cream-50 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/orders" className="text-brown-700 hover:text-brown-900 transition-colors font-medium text-sm hidden sm:block">
                  My Orders
                </Link>
                <span className="text-brown-700 text-sm hidden sm:block">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-brown-700 hover:text-brown-900 hover:bg-brown-50"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="icon" className="text-brown-700 hover:text-brown-900 hover:bg-brown-50">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-brown-700 hover:text-brown-900 hover:bg-brown-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-brown-100">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-brown-700 hover:text-brown-900 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/orders"
                  className="text-brown-700 hover:text-brown-900 transition-colors font-medium px-2 py-1"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
