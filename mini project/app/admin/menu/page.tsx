"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Edit, Upload } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  available: boolean
  categoryId: string
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
}

export default function MenuManagerPage() {
  const { user, token } = useAuth()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    categoryId: "",
    price: 0,
    description: "",
    image: "",
    available: true,
  })

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      window.location.href = '/auth'
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      console.log('Fetching data with token:', token)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${baseUrl}/api/menu`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${baseUrl}/api/menu/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      console.log('Menu response status:', menuResponse.status)
      console.log('Categories response status:', categoriesResponse.status)

      if (menuResponse.ok && categoriesResponse.ok) {
        const menuData = await menuResponse.json()
        const categoriesData = await categoriesResponse.json()
        console.log('Menu data:', menuData.length, 'items')
        console.log('Categories data:', categoriesData.length, 'categories')
        setMenuItems(menuData)
        setCategories(categoriesData)
      } else {
        const menuError = await menuResponse.text()
        const catError = await categoriesResponse.text()
        console.error('Menu error:', menuError)
        console.error('Categories error:', catError)
        setError("Failed to load data")
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredItems =
    selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category.name === selectedCategory)

  const handleAddItem = async () => {
    if (newItem.name && newItem.categoryId && newItem.price && newItem.description) {
      try {
        console.log('Adding item:', newItem)
        console.log('Token:', token)
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${baseUrl}/api/menu/item`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: newItem.name,
            description: newItem.description,
            price: newItem.price,
            image: newItem.image,
            categoryId: newItem.categoryId,
            available: newItem.available ?? true,
          }),
        })

        console.log('Response status:', response.status)
        const responseData = await response.json()
        console.log('Response data:', responseData)

        if (response.ok) {
          await fetchData() // Refresh data
          setNewItem({ name: "", categoryId: "", price: 0, description: "", image: "", available: true })
          setIsDialogOpen(false)
        } else {
          setError(`Failed to add menu item: ${responseData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Error adding item:', error)
        setError("Network error. Please try again.")
      }
    }
  }

  const handleEditItem = async () => {
    if (editingItem) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${baseUrl}/api/menu/item/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: editingItem.name,
            description: editingItem.description,
            price: editingItem.price,
            image: editingItem.image,
            categoryId: editingItem.categoryId,
            available: editingItem.available,
          }),
        })

        if (response.ok) {
          await fetchData() // Refresh data
          setEditingItem(null)
          setIsDialogOpen(false)
        } else {
          setError("Failed to update menu item")
        }
      } catch (error) {
        setError("Network error. Please try again.")
      }
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${baseUrl}/api/menu/item/${id}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          await fetchData() // Refresh data
        } else {
          setError("Failed to delete menu item")
        }
      } catch (error) {
        setError("Network error. Please try again.")
      }
    }
  }

  const toggleAvailability = async (id: string) => {
    const item = menuItems.find(item => item.id === id)
    if (item) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${baseUrl}/api/menu/item/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            categoryId: item.categoryId,
            available: !item.available,
          }),
        })

        if (response.ok) {
          await fetchData() // Refresh data
        } else {
          setError("Failed to update availability")
        }
      } catch (error) {
        setError("Network error. Please try again.")
      }
    }
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem({ ...item })
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setNewItem({ name: "", categoryId: "", price: 0, description: "", image: "", available: true })
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto mb-4"></div>
          <p className="text-brown-700">Loading menu items...</p>
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
            onClick={fetchData}
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Menu Manager</h1>
          <p className="text-brown-700">Add, edit, and manage your café menu items</p>
        </div>
        <Button onClick={openAddDialog} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          onClick={() => setSelectedCategory("All")}
          className={`rounded-full ${
            selectedCategory === "All"
              ? "bg-brown-600 hover:bg-brown-700 text-cream-50"
              : "border-brown-600 text-brown-600 hover:bg-brown-50"
          }`}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.name)}
            className={`rounded-full ${
              selectedCategory === category.name
                ? "bg-brown-600 hover:bg-brown-700 text-cream-50"
                : "border-brown-600 text-brown-600 hover:bg-brown-50"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="card-3d bg-cream-50 border-0 overflow-hidden">
            <div className="relative h-48">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              <div className="absolute top-2 left-2">
                <Badge className="bg-brown-600 text-cream-50">{item.category.name}</Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant={item.available ? "default" : "secondary"}>
                  {item.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-serif text-lg font-bold text-brown-900 mb-2">{item.name}</h3>
              <p className="text-brown-700 text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-brown-600">₹{item.price.toFixed(2)}</span>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`available-${item.id}`} className="text-sm">
                    Available
                  </Label>
                  <Switch
                    id={`available-${item.id}`}
                    checked={item.available}
                    onCheckedChange={() => toggleAvailability(item.id)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => openEditDialog(item)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-brown-300 text-brown-700 hover:bg-brown-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-brown-900">
              {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemName" className="text-brown-700 font-medium">
                Name
              </Label>
              <Input
                id="itemName"
                value={editingItem ? editingItem.name : newItem.name}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, name: e.target.value })
                    : setNewItem({ ...newItem, name: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemCategory" className="text-brown-700 font-medium">
                Category
              </Label>
              <Select
                value={editingItem ? editingItem.categoryId : newItem.categoryId}
                onValueChange={(value) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, categoryId: value })
                    : setNewItem({ ...newItem, categoryId: value })
                }
              >
                <SelectTrigger className="mt-1 border-brown-200 focus:border-brown-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="itemPrice" className="text-brown-700 font-medium">
                Price
              </Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                value={editingItem ? editingItem.price : newItem.price}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, price: Number.parseFloat(e.target.value) })
                    : setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemDescription" className="text-brown-700 font-medium">
                Description
              </Label>
              <Textarea
                id="itemDescription"
                value={editingItem ? editingItem.description : newItem.description}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, description: e.target.value })
                    : setNewItem({ ...newItem, description: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemImage" className="text-brown-700 font-medium">
                Image URL
              </Label>
              <Input
                id="itemImage"
                type="url"
                value={editingItem ? editingItem.image || "" : newItem.image || ""}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, image: e.target.value })
                    : setNewItem({ ...newItem, image: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="itemAvailable"
                checked={editingItem ? editingItem.available : newItem.available}
                onCheckedChange={(checked) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, available: checked })
                    : setNewItem({ ...newItem, available: checked })
                }
              />
              <Label htmlFor="itemAvailable" className="text-brown-700 font-medium">
                Available
              </Label>
            </div>
            <Button
              onClick={editingItem ? handleEditItem : handleAddItem}
              className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50"
            >
              {editingItem ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
