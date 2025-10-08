"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, MessageSquare, User, Loader2 } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  order: {
    orderItems: Array<{
      menuItem: {
        name: string
      }
    }>
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    averageRating: 0
  })

  // Fetch reviews and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const [reviewsResponse, statsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/reviews/all`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${baseUrl}/api/reviews/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ])

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json()
          setReviews(reviewsData.reviews)
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching reviews data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateReviewStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setUpdating(id)
    try {
      const token = localStorage.getItem('token')
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Update local state
        setReviews(reviews.map((review) => 
          review.id === id ? { ...review, status: newStatus, updatedAt: new Date().toISOString() } : review
        ))
        
        // Update stats
        setStats(prevStats => ({
          ...prevStats,
          pendingReviews: newStatus === 'APPROVED' ? prevStats.pendingReviews - 1 : prevStats.pendingReviews,
          approvedReviews: newStatus === 'APPROVED' ? prevStats.approvedReviews + 1 : prevStats.approvedReviews,
          rejectedReviews: newStatus === 'REJECTED' ? prevStats.rejectedReviews + 1 : prevStats.rejectedReviews
        }))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update review status')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
      alert('Failed to update review status')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const pendingReviews = reviews.filter((review) => review.status === "PENDING")
  const approvedReviews = reviews.filter((review) => review.status === "APPROVED")
  const rejectedReviews = reviews.filter((review) => review.status === "REJECTED")

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-brown-600" />
          <p className="text-brown-700">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-900 mb-2">Reviews Management</h1>
        <p className="text-brown-700 text-sm sm:text-base">Moderate and manage customer reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="card-3d bg-cream-50 border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-brown-600">Total Reviews</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-brown-900">{stats.totalReviews}</p>
              </div>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-brown-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d bg-yellow-50 border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-yellow-700">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900">{stats.pendingReviews}</p>
              </div>
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d bg-green-50 border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-700">Approved</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-900">{stats.approvedReviews}</p>
              </div>
              <Check className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d bg-red-50 border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-red-700">Rejected</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-900">{stats.rejectedReviews}</p>
              </div>
              <X className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="card-3d bg-blue-50 border-0">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-blue-700">Avg Rating</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">{stats.averageRating}</p>
              </div>
              <Star className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {pendingReviews.length > 0 && (
        <Card className="card-3d bg-cream-50 border-0 mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="font-serif text-lg sm:text-xl lg:text-2xl text-brown-900 flex items-center">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Pending Reviews ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4 sm:space-y-6">
              {pendingReviews.map((review) => (
                <div key={review.id} className="bg-yellow-50 rounded-lg p-4 sm:p-6 border border-yellow-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brown-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-cream-50" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-brown-900 text-sm sm:text-base">{review.user.name}</h3>
                        <p className="text-xs sm:text-sm text-brown-600">{review.user.email}</p>
                        <p className="text-xs sm:text-sm text-brown-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                  </div>

                  <div className="flex items-center mb-3">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-xs sm:text-sm text-brown-700">({review.rating}/5)</span>
                  </div>

                  {review.comment && (
                    <p className="text-brown-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                  )}

                  {review.order.orderItems.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm text-brown-600 mb-2">Items ordered:</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {review.order.orderItems.map((item, index) => (
                          <Badge key={index} variant="outline" className="border-brown-300 text-brown-700 text-xs">
                            {item.menuItem.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={() => updateReviewStatus(review.id, "APPROVED")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      disabled={updating === review.id}
                    >
                      {updating === review.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button 
                      onClick={() => updateReviewStatus(review.id, "REJECTED")} 
                      size="sm" 
                      variant="destructive"
                      className="text-xs sm:text-sm"
                      disabled={updating === review.id}
                    >
                      {updating === review.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Reviews */}
      <Card className="card-3d bg-cream-50 border-0">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-lg sm:text-xl lg:text-2xl text-brown-900">All Reviews</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-sage-50 rounded-lg p-4 sm:p-6 border border-brown-100">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brown-600 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-cream-50" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brown-900 text-sm sm:text-base">{review.user.name}</h3>
                      <p className="text-xs sm:text-sm text-brown-600">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-xs sm:text-sm text-brown-700">({review.rating}/5)</span>
                </div>

                {review.comment && (
                  <p className="text-brown-800 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                )}

                {review.order.orderItems.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-brown-600 mb-2">Items ordered:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {review.order.orderItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="border-brown-300 text-brown-700 text-xs">
                          {item.menuItem.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {review.status === "PENDING" && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={() => updateReviewStatus(review.id, "APPROVED")}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      disabled={updating === review.id}
                    >
                      {updating === review.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button 
                      onClick={() => updateReviewStatus(review.id, "REJECTED")} 
                      size="sm" 
                      variant="destructive"
                      className="text-xs sm:text-sm"
                      disabled={updating === review.id}
                    >
                      {updating === review.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      )}
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
