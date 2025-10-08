"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { IndianRupee, ShoppingCart, Calendar, Users, TrendingUp, Clock, Star } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user, token, login, logout } = useAuth()
  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    todaySales: 0,
    weeklyOrders: 0,
    totalCustomers: 0,
    weeklyReservations: 0,
    bestSellingItems: [],
    dailySales: []
  })
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  const COLORS = ["#8B4513", "#D2B48C", "#A0522D", "#DEB887", "#CD853F"]

  useEffect(() => {
    // Redirect if user is not admin
    if (user && user.role !== 'ADMIN') {
      router.push('/auth')
    } else if (user && user.role === 'ADMIN') {
      fetchAnalytics()
    }
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/orders/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setAnalyticsLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError("")

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user.role === 'ADMIN') {
          login(data.token, data.user)
        } else {
          setLoginError("Access denied. Admin privileges required.")
        }
      } else {
        setLoginError(data.error || "Login failed")
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-cream-50 py-8 flex items-center justify-center">
        <Card className="card-3d bg-cream-50 border-0 w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-brown-900 text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-brown-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-brown-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                  {loginError}
                </div>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-3"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="text-sm text-brown-600 mt-4 text-center">Admin credentials: admin@cafe.com / admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-brown-900">Admin Dashboard</h1>
          <Button
            onClick={logout}
            variant="outline"
            className="border-brown-600 text-brown-600 hover:bg-brown-50"
          >
            Logout
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brown-700">Today's Sales</CardTitle>
              <IndianRupee className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">
                {analyticsLoading ? "..." : `₹${analytics.todaySales.toLocaleString()}`}
              </div>
              <p className="text-xs text-sage-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Today's sales
              </p>
            </CardContent>
          </Card>

          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brown-700">Weekly Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">
                {analyticsLoading ? "..." : analytics.weeklyOrders}
              </div>
              <p className="text-xs text-sage-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brown-700">Total Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">
                {analyticsLoading ? "..." : analytics.weeklyReservations}
              </div>
              <p className="text-xs text-sage-600 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                This week
              </p>
            </CardContent>
          </Card>

          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-brown-700">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-brown-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brown-900">
                {analyticsLoading ? "..." : analytics.totalCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-sage-600 flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Registered users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-brown-900">Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D2B48C" />
                  <XAxis dataKey="day" stroke="#8B4513" />
                  <YAxis stroke="#8B4513" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F5F5DC",
                      border: "1px solid #D2B48C",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#8B4513"
                    strokeWidth={3}
                    dot={{ fill: "#8B4513", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>

        <Card className="card-3d bg-cream-50 border-0">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-brown-900">Best-Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.bestSellingItems}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D2B48C" />
                <XAxis dataKey="name" stroke="#8B4513" />
                <YAxis stroke="#8B4513" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F5F5DC",
                    border: "1px solid #D2B48C",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sales" fill="#8B4513" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
