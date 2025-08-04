"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type PhotoMetadata, extractPhotoMetadata } from "@/lib/photo-utils"
import Image from "next/image"

interface PhotoUploadProps {
  onPhotosUploaded: (photos: PhotoMetadata[]) => void
  onClose: () => void
}

const CATEGORIES = ["best", "street", "concept", "monochrome", "experiments", "architecture"]
const SEASONS = ["SS 25", "FW 24"]

export default function PhotoUpload({ onPhotosUploaded, onClose }: PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoMetadata[]>([])
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsProcessing(true)
    const newPhotos: PhotoMetadata[] = []

    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        const metadata = await extractPhotoMetadata(file)
        const photo: PhotoMetadata = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: metadata.title || "",
          description: "",
          categories: [],
          filename: metadata.filename || "",
          url: metadata.url || "",
          width: metadata.width || 0,
          height: metadata.height || 0,
          dateCreated: metadata.dateCreated || new Date().toISOString().split("T")[0],
        }
        newPhotos.push(photo)
      }
    }

    setUploadedPhotos(newPhotos)
    setIsProcessing(false)
  }

  const updateCurrentPhoto = (updates: Partial<PhotoMetadata>) => {
    setUploadedPhotos((prev) =>
      prev.map((photo, index) => (index === currentPhotoIndex ? { ...photo, ...updates } : photo)),
    )
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentPhoto = uploadedPhotos[currentPhotoIndex]
    const newCategories = checked
      ? [...currentPhoto.categories, category]
      : currentPhoto.categories.filter((c) => c !== category)

    updateCurrentPhoto({ categories: newCategories })
  }

  const handleSave = () => {
    onPhotosUploaded(uploadedPhotos)
    onClose()
  }

  const currentPhoto = uploadedPhotos[currentPhotoIndex]

  return (
    <Card className="bg-gray-900 border-gray-700 max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Upload Photos</CardTitle>
        <Button onClick={onClose} variant="ghost" size="sm">
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadedPhotos.length === 0 ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">Select photos to upload</p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="bg-gray-800 border-gray-600 text-white"
                disabled={isProcessing}
              />
            </div>
            {isProcessing && <p className="text-gray-400 text-center">Processing images...</p>}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={currentPhoto.url || "/placeholder.svg"}
                  alt={currentPhoto.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                  {currentPhotoIndex + 1} of {uploadedPhotos.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                    disabled={currentPhotoIndex === 0}
                    variant="outline"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPhotoIndex(Math.min(uploadedPhotos.length - 1, currentPhotoIndex + 1))}
                    disabled={currentPhotoIndex === uploadedPhotos.length - 1}
                    variant="outline"
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  value={currentPhoto.title}
                  onChange={(e) => updateCurrentPhoto({ title: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={currentPhoto.description}
                  onChange={(e) => updateCurrentPhoto({ description: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white">Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${currentPhotoIndex}-${category}`}
                        checked={currentPhoto.categories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <Label
                        htmlFor={`${currentPhotoIndex}-${category}`}
                        className="text-gray-300 capitalize cursor-pointer text-sm"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-white">Season</Label>
                <div className="flex gap-2">
                  {SEASONS.map((season) => (
                    <Button
                      key={season}
                      onClick={() =>
                        updateCurrentPhoto({
                          season: currentPhoto.season === season ? undefined : season,
                        })
                      }
                      variant={currentPhoto.season === season ? "default" : "outline"}
                      size="sm"
                      className={currentPhoto.season === season ? "bg-white text-black" : "border-gray-600 text-white"}
                    >
                      {season}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <Button onClick={handleSave} className="w-full bg-white text-black hover:bg-gray-200">
                  <Save className="w-4 h-4 mr-2" />
                  Save All Photos
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
