"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Clock, CheckCircle, Package } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/orders/my-orders`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders)
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />
      case "PREPARING":
        return <Package className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800"
      case "PREPARING":
        return "bg-blue-100 text-blue-800"
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">My Orders</h1>
          <p className="text-brown-700">Track your order status and view order history</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brown-600 mx-auto mb-4"></div>
            <p className="text-brown-700">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchOrders} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <h2 className="font-serif text-2xl font-bold text-brown-900 mb-4">No Orders Yet</h2>
            <p className="text-brown-700 mb-8">Start by browsing our menu and placing your first order!</p>
            <Button asChild className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full px-8 py-3">
              <a href="/menu">Browse Menu</a>
            </Button>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="card-3d bg-cream-50 border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-serif text-xl text-brown-900">Order #{order.id.slice(-8)}</CardTitle>
                      <p className="text-brown-600 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.toLowerCase()}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm text-brown-600">{order.orderItems.length} item(s)</p>
                        <p className="font-bold text-brown-900 text-lg">₹{calculateTotal(order.orderItems).toFixed(2)}</p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-brown-300 text-brown-700 hover:bg-brown-50 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="font-serif text-xl text-brown-900">
                            Order Details - #{order.id.slice(-8)}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-brown-700">Status:</span>
                            <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status.toLowerCase()}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-brown-700">Order Date:</span>
                            <span className="text-brown-900">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="border-t pt-4">
                            <h4 className="font-semibold text-brown-900 mb-3">Items:</h4>
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-cream-50 rounded-lg mb-2">
                                <Image
                                  src={item.menuItem.image || "/placeholder.svg"}
                                  alt={item.menuItem.name}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-brown-900">{item.menuItem.name}</h5>
                                  <p className="text-sm text-brown-600">Qty: {item.quantity}</p>
                                  <p className="text-sm font-semibold text-brown-700">
                                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="border-t pt-3 mt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-brown-900">Total:</span>
                                <span className="font-bold text-brown-900 text-lg">₹{calculateTotal(order.orderItems).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
