"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Phone, Mail, Check, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Reservation {
  id: string
  table: number
  time: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

export default function ReservationsPage() {
  const { user, token } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      window.location.href = '/auth'
      return
    }
    fetchReservations()
  }, [user])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/reservations/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReservations(data.reservations)
      } else {
        setError("Failed to load reservations")
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateReservationStatus = async (id: string, newStatus: string) => {
    try {
      setError("")
      setSuccessMessage("")
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchReservations() // Refresh data
        
        // Show success message for completed reservations
        if (newStatus === 'COMPLETED') {
          setSuccessMessage("Reservation marked as completed! Customer has been notified via email.")
          setTimeout(() => setSuccessMessage(""), 5000)
        } else {
          setSuccessMessage(`Reservation ${newStatus.toLowerCase()} successfully! Customer has been notified via email.`)
          setTimeout(() => setSuccessMessage(""), 5000)
        }
      } else {
        setError("Failed to update reservation status")
      }
    } catch (error) {
      console.error('Error updating reservation:', error)
      setError("Network error. Please try again.")
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
      case "CANCELLED":
        return "bg-gray-100 text-gray-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p className="text-brown-700">Loading reservations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">{error}</p>
          <Button 
            onClick={fetchReservations}
            className="mt-4 bg-brown-600 hover:bg-brown-700 text-cream-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Reservations Management</h1>
        <p className="text-brown-700">Manage table reservations and customer bookings</p>
        
        {successMessage && (
          <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
      </div>

      <Card className="card-3d bg-cream-50 border-0">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-brown-900">All Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-brown-700 text-lg">No reservations found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-sage-50 rounded-lg p-6 border border-brown-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brown-900 text-lg">{reservation.user.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-brown-700">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{reservation.user.email}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(reservation.status)} capitalize`}>
                      {reservation.status.toLowerCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-brown-700">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(reservation.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-brown-700">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(reservation.time)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-brown-700">
                      <Users className="h-4 w-4" />
                      <span>Table {reservation.table}</span>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-cream-100 rounded-lg">
                    <p className="text-sm text-brown-700">
                      <strong>Created:</strong> {formatDate(reservation.createdAt)} at {formatTime(reservation.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brown-600">ID: {reservation.id}</span>
                    <div className="flex space-x-2">
                      {reservation.status === "PENDING" && (
                        <>
                          <Button
                            onClick={() => updateReservationStatus(reservation.id, "APPROVED")}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => updateReservationStatus(reservation.id, "REJECTED")}
                            size="sm"
                            variant="destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {reservation.status === "APPROVED" && (
                        <>
                          <Button
                            onClick={() => updateReservationStatus(reservation.id, "COMPLETED")}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                          <Button
                            onClick={() => updateReservationStatus(reservation.id, "CANCELLED")}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
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
