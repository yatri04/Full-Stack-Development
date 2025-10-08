"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Plus, Edit, Trash2, Package } from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  lowStockThreshold: number
  supplier: string
  lastRestocked: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Coffee Beans - Arabica",
      category: "Coffee",
      quantity: 25,
      unit: "lbs",
      lowStockThreshold: 10,
      supplier: "Premium Coffee Co.",
      lastRestocked: "2024-01-15",
    },
    {
      id: "2",
      name: "Whole Milk",
      category: "Dairy",
      quantity: 8,
      unit: "gallons",
      lowStockThreshold: 15,
      supplier: "Local Dairy Farm",
      lastRestocked: "2024-01-18",
    },
    {
      id: "3",
      name: "Flour - All Purpose",
      category: "Baking",
      quantity: 50,
      unit: "lbs",
      lowStockThreshold: 20,
      supplier: "Bakery Supply Inc.",
      lastRestocked: "2024-01-10",
    },
    {
      id: "4",
      name: "Avocados",
      category: "Produce",
      quantity: 12,
      unit: "pieces",
      lowStockThreshold: 20,
      supplier: "Fresh Produce Market",
      lastRestocked: "2024-01-19",
    },
    {
      id: "5",
      name: "Blueberries",
      category: "Produce",
      quantity: 5,
      unit: "lbs",
      lowStockThreshold: 8,
      supplier: "Berry Farm Co.",
      lastRestocked: "2024-01-17",
    },
  ])

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    lowStockThreshold: 0,
    supplier: "",
    lastRestocked: "",
  })

  const lowStockItems = inventory.filter((item) => item.quantity <= item.lowStockThreshold)

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.unit && newItem.supplier) {
      const item: InventoryItem = {
        id: (inventory.length + 1).toString(),
        name: newItem.name,
        category: newItem.category,
        quantity: newItem.quantity || 0,
        unit: newItem.unit,
        lowStockThreshold: newItem.lowStockThreshold || 0,
        supplier: newItem.supplier,
        lastRestocked: newItem.lastRestocked || new Date().toISOString().split("T")[0],
      }
      setInventory([...inventory, item])
      setNewItem({
        name: "",
        category: "",
        quantity: 0,
        unit: "",
        lowStockThreshold: 0,
        supplier: "",
        lastRestocked: "",
      })
      setIsDialogOpen(false)
    }
  }

  const handleEditItem = () => {
    if (editingItem) {
      setInventory(inventory.map((item) => (item.id === editingItem.id ? editingItem : item)))
      setEditingItem(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem({ ...item })
    setIsDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingItem(null)
    setNewItem({
      name: "",
      category: "",
      quantity: 0,
      unit: "",
      lowStockThreshold: 0,
      supplier: "",
      lastRestocked: "",
    })
    setIsDialogOpen(true)
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.lowStockThreshold) {
      return { status: "Low Stock", color: "bg-red-100 text-red-800", icon: AlertTriangle }
    }
    return { status: "In Stock", color: "bg-green-100 text-green-800", icon: Package }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">Inventory Management</h1>
          <p className="text-brown-700">Track ingredients and supplies</p>
        </div>
        <Button onClick={openAddDialog} className="bg-brown-600 hover:bg-brown-700 text-cream-50">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="card-3d bg-red-50 border-red-200 mb-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl text-red-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock Alert ({lowStockItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-red-100 rounded">
                  <span className="font-medium text-red-900">{item.name}</span>
                  <span className="text-red-700">
                    {item.quantity} {item.unit} remaining
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="card-3d bg-cream-50 border-0">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-brown-900">Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => {
              const stockStatus = getStockStatus(item)
              const StatusIcon = stockStatus.icon

              return (
                <div key={item.id} className="bg-sage-50 rounded-lg p-6 border border-brown-100">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-brown-900 text-lg">{item.name}</h3>
                      <p className="text-brown-700">{item.category}</p>
                      <p className="text-sm text-brown-600">Supplier: {item.supplier}</p>
                    </div>
                    <Badge className={`${stockStatus.color} flex items-center space-x-1`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{stockStatus.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-brown-600">Current Stock</p>
                      <p className="font-semibold text-brown-900">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-brown-600">Low Stock Threshold</p>
                      <p className="font-semibold text-brown-900">
                        {item.lowStockThreshold} {item.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-brown-600">Last Restocked</p>
                      <p className="font-semibold text-brown-900">{item.lastRestocked}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => openEditDialog(item)}
                        size="sm"
                        variant="outline"
                        className="border-brown-300 text-brown-700 hover:bg-brown-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button onClick={() => handleDeleteItem(item.id)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-brown-900">
              {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
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
              <Input
                id="itemCategory"
                value={editingItem ? editingItem.category : newItem.category}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, category: e.target.value })
                    : setNewItem({ ...newItem, category: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemQuantity" className="text-brown-700 font-medium">
                  Quantity
                </Label>
                <Input
                  id="itemQuantity"
                  type="number"
                  value={editingItem ? editingItem.quantity : newItem.quantity}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) })
                      : setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) })
                  }
                  className="mt-1 border-brown-200 focus:border-brown-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="itemUnit" className="text-brown-700 font-medium">
                  Unit
                </Label>
                <Input
                  id="itemUnit"
                  value={editingItem ? editingItem.unit : newItem.unit}
                  onChange={(e) =>
                    editingItem
                      ? setEditingItem({ ...editingItem, unit: e.target.value })
                      : setNewItem({ ...newItem, unit: e.target.value })
                  }
                  className="mt-1 border-brown-200 focus:border-brown-500"
                  placeholder="lbs, gallons, pieces"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="itemThreshold" className="text-brown-700 font-medium">
                Low Stock Threshold
              </Label>
              <Input
                id="itemThreshold"
                type="number"
                value={editingItem ? editingItem.lowStockThreshold : newItem.lowStockThreshold}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, lowStockThreshold: Number.parseInt(e.target.value) })
                    : setNewItem({ ...newItem, lowStockThreshold: Number.parseInt(e.target.value) })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemSupplier" className="text-brown-700 font-medium">
                Supplier
              </Label>
              <Input
                id="itemSupplier"
                value={editingItem ? editingItem.supplier : newItem.supplier}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, supplier: e.target.value })
                    : setNewItem({ ...newItem, supplier: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="itemRestocked" className="text-brown-700 font-medium">
                Last Restocked
              </Label>
              <Input
                id="itemRestocked"
                type="date"
                value={editingItem ? editingItem.lastRestocked : newItem.lastRestocked}
                onChange={(e) =>
                  editingItem
                    ? setEditingItem({ ...editingItem, lastRestocked: e.target.value })
                    : setNewItem({ ...newItem, lastRestocked: e.target.value })
                }
                className="mt-1 border-brown-200 focus:border-brown-500"
                required
              />
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
