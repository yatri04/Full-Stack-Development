"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Toast functionality removed - using alerts for now
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Message sent! We'll get back to you soon.");
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Error: " + (data.error || "Something went wrong."));
      }
    } catch (err) {
      alert("Network Error: Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 mb-4">Contact Us</h1>
          <p className="text-brown-700 text-base sm:text-lg max-w-2xl mx-auto px-4">
            We'd love to hear from you! Get in touch with any questions, feedback, or just to say hello.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information + Form */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-4">Send a Message</h3>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" disabled={loading} className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full text-sm sm:text-base">
                    <Send className="mr-2 h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Cards */}
            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-brown-600" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900">Visit Us</h3>
                </div>
                <p className="text-brown-700 mb-2 text-sm sm:text-base">123 Coffee Street</p>
                <p className="text-brown-700 mb-4 text-sm sm:text-base">Downtown District, City 12345</p>
                <Button className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full text-sm sm:text-base">Get Directions</Button>
              </CardContent>
            </Card>

            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-brown-600" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900">Call Us</h3>
                </div>
                <p className="text-brown-700 mb-2 text-sm sm:text-base">(555) 123-BREW</p>
                <p className="text-brown-600 text-xs sm:text-sm">Available during business hours</p>
              </CardContent>
            </Card>

            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-brown-600" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900">Email Us</h3>
                </div>
                <p className="text-brown-700 mb-1 text-sm sm:text-base">hello@brewandbloom.com</p>
                <p className="text-brown-700 mb-1 text-sm sm:text-base">reservations@brewandbloom.com</p>
                <p className="text-brown-600 text-xs sm:text-sm">We'll respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="card-3d bg-cream-50 border-0">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-brown-600" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900">Hours</h3>
                </div>
                <div className="space-y-2 text-brown-700 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>6:30 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span>7:00 AM - 9:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="relative h-80 sm:h-96 lg:h-full rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18..."
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Brew & Bloom Café Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
