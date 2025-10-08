"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Clock, CheckCircle, Package, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"

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
  user: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newOrderCount, setNewOrderCount] = useState(0)
  const { token } = useAuth()

  useEffect(() => {
    fetchOrders()
    // Refresh orders every 30 seconds to show new orders
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/orders/admin/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        const newOrders = data.orders
        const previousOrderCount = orders.length
        setOrders(newOrders)
        
        // Show notification if new orders came in
        if (newOrders.length > previousOrderCount && previousOrderCount > 0) {
          const newCount = newOrders.length - previousOrderCount
          setNewOrderCount(newCount)
          setTimeout(() => setNewOrderCount(0), 5000) // Hide notification after 5 seconds
        }
      } else {
        setError("Failed to load orders")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      } else {
        setError("Failed to update order status")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <Package className="h-4 w-4" />
      case "ready":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Orders Management</h1>
            <p className="text-brown-700">Manage and track all customer orders</p>
          </div>
          <Button 
            onClick={fetchOrders}
            variant="outline"
            className="border-brown-300 text-brown-700 hover:bg-brown-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* New Order Notification */}
      {newOrderCount > 0 && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              {newOrderCount} new order{newOrderCount > 1 ? 's' : ''} received!
            </span>
          </div>
        </div>
      )}

      <Card className="card-3d bg-cream-50 border-0">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-brown-900">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
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
            <div className="text-center py-8">
              <p className="text-brown-700">No orders found.</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-sage-50 rounded-lg p-6 border border-brown-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brown-900">{order.id}</h3>
                      <p className="text-brown-700">{order.user.name}</p>
                      <p className="text-sm text-brown-600">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brown-900 text-lg">₹{calculateTotal(order.orderItems).toFixed(2)}</p>
                      <p className="text-sm text-brown-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.toLowerCase()}</span>
                      </Badge>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-brown-300 text-brown-700 hover:bg-brown-50 bg-transparent"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Items
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="font-serif text-xl text-brown-900">
                              Order Details - {order.id}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {order.orderItems.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-cream-50 rounded-lg">
                                <Image
                                  src={item.menuItem.image || "/placeholder.svg"}
                                  alt={item.menuItem.name}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-brown-900">{item.menuItem.name}</h4>
                                  <p className="text-sm text-brown-600">Qty: {item.quantity}</p>
                                  <p className="text-sm font-semibold text-brown-700">
                                    ₹{(item.menuItem.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                            <div className="border-t pt-3">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-brown-900">Total:</span>
                                <span className="font-bold text-brown-900 text-lg">₹{calculateTotal(order.orderItems).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Select onValueChange={(value) => updateOrderStatus(order.id, value)} defaultValue={order.status}>
                      <SelectTrigger className="w-40 border-brown-200 focus:border-brown-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="PREPARING">Preparing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
