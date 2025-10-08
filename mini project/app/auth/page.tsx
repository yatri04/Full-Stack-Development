"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)
    
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

      if (!response.ok) {
        setLoginError(data.error || "Login failed")
      } else {
        // Save the token and user data
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        
        // Redirect to home page or admin dashboard
        if (data.user.role === 'ADMIN') {
          window.location.href = "/admin"
        } else {
          window.location.href = "/"
        }
      }
    } catch (error) {
      setLoginError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")
    setRegisterSuccess("")
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    if (registerData.password.length < 6) {
      setRegisterError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setRegisterError(data.error || "Registration failed")
      } else {
        setRegisterSuccess("Registration successful! You can now sign in.")
        // Clear the form
        setRegisterData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        })
        // Optionally save the JWT token
        if (data.token) {
          localStorage.setItem("token", data.token)
        }
      }
    } catch (error) {
      setRegisterError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Welcome Back</h1>
          <p className="text-brown-700">Sign in to your account or create a new one</p>
        </div>

        <Card className="card-3d bg-cream-50 border-0">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="loginEmail" className="text-brown-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="loginEmail"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="loginPassword" className="text-brown-700 font-medium">
                      Password
                    </Label>
                    <Input
                      id="loginPassword"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  
                  {loginError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {loginError}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-3 mt-6 disabled:opacity-50"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="registerName" className="text-brown-700 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="registerName"
                      value={registerData.name}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="registerEmail" className="text-brown-700 font-medium">
                      Email
                    </Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="registerPassword" className="text-brown-700 font-medium">
                      Password
                    </Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-brown-700 font-medium">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className="mt-1 border-brown-200 focus:border-brown-500 focus:ring-brown-500"
                      required
                    />
                  </div>
                  
                  {registerError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                      {registerError}
                    </div>
                  )}
                  
                  {registerSuccess && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
                      {registerSuccess}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full py-3 mt-6 disabled:opacity-50"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-brown-600 text-sm">By signing up, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  )
}
