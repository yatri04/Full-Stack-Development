"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminCreatePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  const ADMIN_INVITE_CODE = "BREW2024ADMIN"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.inviteCode !== ADMIN_INVITE_CODE) {
      setError("Invalid invite code. Admin registration requires a valid invite code.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    // Here you would typically create the admin user
    console.log("Creating admin user:", formData)
    alert("Admin account created successfully! You can now login.")
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brown-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-cream-50" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Admin Registration</h1>
          <p className="text-brown-700">Create an admin account with invite code</p>
        </div>

        <Card className="card-3d bg-cream-50 border-0">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-brown-900 text-center flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Admin Account Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="inviteCode" className="text-brown-700 font-medium">
                  Admin Invite Code *
                </Label>
                <Input
                  id="inviteCode"
                  type="password"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, inviteCode: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  placeholder="Enter admin invite code"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name" className="text-brown-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-brown-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-brown-700 font-medium">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-brown-700 font-medium">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-3 mt-6"
              >
                Create Admin Account
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-brown-600 text-sm">
            This page is for authorized personnel only. Contact the system administrator for invite codes.
          </p>
        </div>
      </div>
    </div>
  )
}
