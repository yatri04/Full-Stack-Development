"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const { user, token } = useAuth()
  const router = useRouter()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderMessage, setOrderMessage] = useState("")
  const [orderError, setOrderError] = useState("")

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setIsPlacingOrder(true)
    setOrderMessage("")
    setOrderError("")

    try {
      const orderItems = items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      }))

      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items: orderItems }),
      })

      const data = await response.json()

      if (!response.ok) {
        setOrderError(data.error || "Failed to place order")
      } else {
        const orderId = data.order?.id || 'Unknown'
        setOrderMessage(`Order #${orderId} placed successfully! We'll prepare it for you. You can track your order status in your account.`)
        clearCart()
        // Redirect to home page after showing success
        setTimeout(() => {
          router.push('/')
        }, 3000)
      }
    } catch (error) {
      setOrderError("Network error. Please try again.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 sm:py-16">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 mb-4">Your Cart</h1>
            <p className="text-brown-700 text-base sm:text-lg mb-6 sm:mb-8">Your cart is empty</p>
            <Button asChild className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base">
              <a href="/menu">Browse Menu</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 mb-4">Your Cart</h1>
          <p className="text-brown-700 text-sm sm:text-base">Review your items and place your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="card-3d bg-cream-50 border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-brown-900 truncate">{item.name}</h3>
                      <p className="text-brown-600 font-medium text-sm sm:text-base">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-brown-300"
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center font-medium text-brown-900 text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full border-brown-300"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-3d bg-cream-50 border-0 sticky top-4 sm:top-8">
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-brown-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-brown-700 truncate mr-2">
                        {item.name} x{item.quantity}
                      </span>
                      <span className="text-brown-900 font-medium flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brown-200 pt-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-base sm:text-lg font-bold text-brown-900">Total</span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-brown-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                {orderMessage && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md mb-4">
                    {orderMessage}
                  </div>
                )}
                
                {orderError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
                    {orderError}
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50"
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="w-full border-brown-300 text-brown-600 hover:bg-brown-50 rounded-full bg-transparent text-sm sm:text-base py-2 sm:py-3"
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
