"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: {
    name: string;
  };
  available: boolean;
  image?: string;
}

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${baseUrl}/api/menu`),
        fetch(`${baseUrl}/api/menu/categories`)
      ])
      
      if (menuResponse.ok && categoriesResponse.ok) {
        const menuData = await menuResponse.json()
        const categoriesData = await categoriesResponse.json()
        setMenuItems(menuData)
        setCategories(["All", ...categoriesData.map((cat: any) => cat.name)])
      } else {
        setError("Failed to load menu data")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  const filteredItems =
    selectedCategory === "All" 
      ? menuItems.filter(item => item.available)
      : menuItems.filter((item) => item.category.name === selectedCategory && item.available)

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      alert("Please login to add items to cart")
      return
    }
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "/placeholder.svg",
    })
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-brown-900 mb-4">Our Menu</h1>
          <p className="text-brown-700 text-lg max-w-2xl mx-auto">
            Discover our carefully crafted selection of artisanal coffees, fresh pastries, and wholesome meals
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2 transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-brown-600 hover:bg-brown-700 text-cream-50"
                  : "border-brown-600 text-brown-600 hover:bg-brown-50"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
            <p className="text-brown-700">Loading menu items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <Button 
              onClick={fetchData}
              className="mt-4 bg-brown-600 hover:bg-brown-700 text-cream-50"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Menu Items Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card key={item.id} className="card-3d bg-cream-50 border-0 overflow-hidden">
                <div className="relative h-64">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-brown-600 text-cream-50">{item.category.name}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-serif text-xl font-bold text-brown-900 mb-2">{item.name}</h3>
                  <p className="text-brown-700 mb-4 text-sm leading-relaxed">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-brown-600">₹{item.price.toFixed(2)}</span>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="bg-brown-600 hover:bg-brown-700 text-cream-50 rounded-full px-6 py-2 transition-all duration-200 hover:scale-105"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brown-700 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
