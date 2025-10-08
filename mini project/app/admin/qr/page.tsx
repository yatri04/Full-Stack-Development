"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from "qrcode.react"
import { Download, QrCode } from "lucide-react"

export default function QRGeneratorPage() {
  const [tableNumber, setTableNumber] = useState("")
  const [qrValue, setQrValue] = useState("")

  const generateQR = () => {
    if (tableNumber) {
      const url = `${window.location.origin}/menu?table=${tableNumber}`
      setQrValue(url)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `table-${tableNumber}-qr.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-brown-900 mb-2">QR Code Generator</h1>
        <p className="text-brown-700">Generate QR codes for table ordering</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="card-3d bg-cream-50 border-0">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-brown-900 flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="tableNumber" className="text-brown-700 font-medium">
                  Table Number
                </Label>
                <Input
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="mt-1 border-brown-200 focus:border-brown-500"
                  placeholder="Enter table number (e.g., 12)"
                />
              </div>
              <Button
                onClick={generateQR}
                disabled={!tableNumber}
                className="w-full bg-brown-600 hover:bg-brown-700 text-cream-50"
              >
                Generate QR Code
              </Button>

              {qrValue && (
                <div className="space-y-4">
                  <div className="p-4 bg-sage-50 rounded-lg">
                    <Label className="text-brown-700 font-medium">Generated URL:</Label>
                    <p className="text-sm text-brown-600 break-all mt-1">{qrValue}</p>
                  </div>
                  <Button
                    onClick={downloadQR}
                    variant="outline"
                    className="w-full border-brown-300 text-brown-700 hover:bg-brown-50 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d bg-cream-50 border-0">
          <CardHeader>
            <CardTitle className="font-serif text-2xl text-brown-900">QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {qrValue ? (
                <>
                  <div className="p-6 bg-white rounded-lg shadow-lg">
                    <QRCodeSVG id="qr-code" value={qrValue} size={200} level="M" includeMargin={true} />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-brown-900">Table {tableNumber}</p>
                    <p className="text-sm text-brown-600">Scan to view menu</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-brown-400">
                  <QrCode className="h-16 w-16 mb-4" />
                  <p>Enter a table number to generate QR code</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-3d bg-cream-50 border-0 mt-8">
        <CardHeader>
          <CardTitle className="font-serif text-2xl text-brown-900">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-brown-700">
            <div>
              <h3 className="font-semibold mb-2">How to use QR codes:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Enter the table number you want to generate a QR code for</li>
                <li>Click "Generate QR Code" to create the code</li>
                <li>Download the PNG file and print it</li>
                <li>Place the printed QR code on the corresponding table</li>
                <li>Customers can scan the code to access the menu with their table number pre-filled</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Benefits:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Contactless menu access</li>
                <li>Automatic table identification for orders</li>
                <li>Reduced physical menu handling</li>
                <li>Streamlined ordering process</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
