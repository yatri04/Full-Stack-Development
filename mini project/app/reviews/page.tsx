"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    id: string
    name: string
  }
  order: {
    orderItems: Array<{
      menuItem: {
        name: string
      }
    }>
  }
}

interface CompletedOrder {
  id: string
  createdAt: string
  orderItems: Array<{
    menuItem: {
      name: string
    }
  }>
}

export default function ReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
    orderId: "",
    rating: 0,
    comment: "",
  })

  // Fetch approved reviews and completed orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const [reviewsResponse, ordersResponse] = await Promise.all([
          fetch(`${baseUrl}/api/reviews/approved`),
          user ? fetch(`${baseUrl}/api/orders/my-orders`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }) : Promise.resolve(null)
        ])

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData.reviews)
        }

        if (ordersResponse && ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          // Filter only completed orders
          const completed = ordersData.orders.filter((order: any) => order.status === 'COMPLETED')
          setCompletedOrders(completed)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newReview.rating === 0) {
      alert("Please select a rating")
      return
    }
    if (!newReview.orderId) {
      alert("Please select an order to review")
      return
    }
    if (completedOrders.length === 0) {
      alert("No completed orders available for review")
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: newReview.orderId,
          rating: newReview.rating,
          comment: newReview.comment
        })
      })

      if (response.ok) {
        alert("Thank you for your review!.")
        setNewReview({ orderId: "", rating: 0, comment: "" })
        setShowForm(false)
        // Refresh reviews
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const reviewsResponse = await fetch(`${baseUrl}/api/reviews/approved`)
        if (reviewsResponse.ok) {
          const data = await reviewsResponse.json()
          setReviews(data.reviews)
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit review")
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brown-600" />
          <p className="text-brown-700">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 mb-4">Customer Reviews</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-brown-700 text-base sm:text-lg font-medium">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
          <p className="text-brown-700 text-base sm:text-lg max-w-2xl mx-auto px-4">
            See what our customers are saying about their Brew & Bloom experience
          </p>
        </div>

        {/* Add Review Button */}
        {user && (
          <div className="text-center mb-6 sm:mb-8">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base"
            >
              {showForm ? "Cancel" : "Leave a Review"}
            </Button>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <Card className="card-3d bg-cream-50 border-0 mb-6 sm:mb-8">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl sm:text-2xl text-brown-900">Share Your Experience</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="orderId" className="text-brown-700 font-medium">
                    Select Order to Review
                  </Label>
                  {completedOrders.length > 0 ? (
                    <select
                      id="orderId"
                      value={newReview.orderId}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, orderId: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 border border-brown-200 rounded-md focus:border-brown-500 focus:ring-brown-500 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select an order...</option>
                      {completedOrders.map((order) => (
                        <option key={order.id} value={order.id}>
                          Order #{order.id.slice(-8)} - {new Date(order.createdAt).toLocaleDateString()} 
                          ({order.orderItems.map(item => item.menuItem.name).join(', ')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs sm:text-sm text-yellow-700">
                        No completed orders found. You can only review completed orders.
                      </p>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-brown-600 mt-1">
                    Only completed orders can be reviewed. If you don't see your order here, 
                    it may still be in progress.
                  </p>
                </div>

                <div>
                  <Label className="text-brown-700 font-medium">Rating</Label>
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 sm:h-8 sm:w-8 transition-colors ${
                            star <= newReview.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="reviewComment" className="text-brown-700 font-medium">
                    Your Review
                  </Label>
                  <Textarea
                    id="reviewComment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500 min-h-[100px] sm:min-h-[120px] text-sm sm:text-base"
                    placeholder="Tell us about your experience at Brew & Bloom..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || completedOrders.length === 0}
                  className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-2 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4 sm:space-y-6">
          {reviews.length === 0 ? (
            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-6 sm:p-8 text-center">
                <p className="text-brown-700 text-base sm:text-lg">No reviews yet. Be the first to share your experience!</p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="card-3d bg-cream-50 border-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-brown-900">{review.user.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-brown-600 text-xs sm:text-sm">{review.rating}/5</span>
                      </div>
                    </div>
                    <span className="text-brown-500 text-xs sm:text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.comment && (
                    <p className="text-brown-700 leading-relaxed italic text-sm sm:text-base">"{review.comment}"</p>
                  )}
                  {review.order.orderItems.length > 0 && (
                    <div className="mt-3 sm:mt-4">
                      <p className="text-xs sm:text-sm text-brown-600 mb-2">Items ordered:</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {review.order.orderItems.map((item, index) => (
                          <span key={index} className="bg-brown-100 text-brown-700 px-2 py-1 rounded text-xs sm:text-sm">
                            {item.menuItem.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
