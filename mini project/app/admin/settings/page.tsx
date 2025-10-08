"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Upload, Palette, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function SettingsPage() {
  const [cafeHours, setCafeHours] = useState({
    monday: { open: "06:30", close: "20:00", closed: false },
    tuesday: { open: "06:30", close: "20:00", closed: false },
    wednesday: { open: "06:30", close: "20:00", closed: false },
    thursday: { open: "06:30", close: "20:00", closed: false },
    friday: { open: "06:30", close: "20:00", closed: false },
    saturday: { open: "07:00", close: "21:00", closed: false },
    sunday: { open: "07:00", close: "21:00", closed: false },
  })

  const [contactInfo, setContactInfo] = useState({
    phone: "(555) 123-BREW",
    email: "hello@brewandbloom.com",
    address: "123 Coffee Street, Downtown District, City 12345",
  })

  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com/brewandbloom",
    instagram: "https://instagram.com/brewandbloom",
    twitter: "https://twitter.com/brewandbloom",
  })

  const [themeSettings, setThemeSettings] = useState({
    darkMode: false,
    primaryColor: "#8B4513",
    accentColor: "#D2B48C",
  })

  const [bannerText, setBannerText] = useState("🎉 Try our new seasonal drinks! Limited time offer.")

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  const handleHoursChange = (day: string, field: string, value: string | boolean) => {
    setCafeHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    alert("Settings saved successfully!")
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Settings</h1>
        <p className="text-brown-700">Manage café settings and preferences</p>
      </div>

      <Tabs defaultValue="hours" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="hours">Hours</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        {/* Café Hours */}
        <TabsContent value="hours">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brown-900 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Café Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(cafeHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between p-4 bg-sage-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-24">
                        <Label className="font-medium text-brown-900">{dayNames[day as keyof typeof dayNames]}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) => handleHoursChange(day, "closed", !checked)}
                        />
                        <Label className="text-sm text-brown-700">Open</Label>
                      </div>
                    </div>
                    {!hours.closed && (
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label className="text-sm text-brown-700">Open</Label>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                            className="mt-1 border-brown-200 focus:border-brown-500"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-brown-700">Close</Label>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                            className="mt-1 border-brown-200 focus:border-brown-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <Button onClick={handleSave} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
                  Save Hours
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information */}
        <TabsContent value="contact">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brown-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="phone" className="text-brown-700 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-brown-700 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-brown-700 font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo((prev) => ({ ...prev, address: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
                  Save Contact Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promotional Banners */}
        <TabsContent value="banners">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brown-900">Promotional Banners</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="bannerText" className="text-brown-700 font-medium">
                    Banner Text
                  </Label>
                  <Textarea
                    id="bannerText"
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                    placeholder="Enter promotional message..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label className="text-brown-700 font-medium">Banner Image</Label>
                  <div className="mt-2 border-2 border-dashed border-brown-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-brown-400 mx-auto mb-4" />
                    <p className="text-brown-600 mb-2">Upload banner image</p>
                    <Button variant="outline" className="border-brown-300 text-brown-700 bg-transparent">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-sage-50 rounded-lg">
                  <Label className="text-brown-700 font-medium">Preview</Label>
                  <div className="mt-2 p-3 bg-brown-600 text-cream-50 rounded text-center">{bannerText}</div>
                </div>
                <Button onClick={handleSave} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
                  Save Banner
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brown-900 flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-brown-700 font-medium">Dark Mode</Label>
                    <p className="text-sm text-brown-600">Enable dark theme for the website</p>
                  </div>
                  <Switch
                    checked={themeSettings.darkMode}
                    onCheckedChange={(checked) => setThemeSettings((prev) => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="primaryColor" className="text-brown-700 font-medium">
                    Primary Color
                  </Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 border-brown-200"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) => setThemeSettings((prev) => ({ ...prev, primaryColor: e.target.value }))}
                      className="border-brown-200 focus:border-brown-500"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor" className="text-brown-700 font-medium">
                    Accent Color
                  </Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings((prev) => ({ ...prev, accentColor: e.target.value }))}
                      className="w-16 h-10 border-brown-200"
                    />
                    <Input
                      value={themeSettings.accentColor}
                      onChange={(e) => setThemeSettings((prev) => ({ ...prev, accentColor: e.target.value }))}
                      className="border-brown-200 focus:border-brown-500"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
                  Save Theme
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <Card className="card-3d bg-cream-50 border-0">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-brown-900">Social Media Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="facebook" className="text-brown-700 font-medium flex items-center">
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks((prev) => ({ ...prev, facebook: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-brown-700 font-medium flex items-center">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks((prev) => ({ ...prev, instagram: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-brown-700 font-medium flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks((prev) => ({ ...prev, twitter: e.target.value }))}
                    className="mt-1 border-brown-200 focus:border-brown-500"
                    placeholder="https://twitter.com/yourpage"
                  />
                </div>
                <Button onClick={handleSave} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
                  Save Social Links
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
