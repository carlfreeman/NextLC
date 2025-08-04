"use client"

import { useState, useEffect } from "react"
import { Camera, Filter, Calendar, Tag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

interface PhotoMetadata {
  id: string
  title: string
  description: string
  categories: string[]
  season?: string
  filename: string
  url: string
  width: number
  height: number
  dateCreated: string
  dateTaken?: string
  camera?: string
  lens?: string
  settings?: {
    aperture?: string
    shutter?: string
    iso?: string
    focalLength?: string
  }
  fileSize?: string
  format?: string
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
}

interface PortfolioData {
  photos: PhotoMetadata[]
  lastUpdated: string
}

const CATEGORIES = ["best", "street", "concept", "monochrome", "experiments", "architecture"]
const SEASONS = ["SS 25", "FW 24"]

export default function PhotographerPortfolio() {
  const [activeSection, setActiveSection] = useState("main")
  const [photos, setPhotos] = useState<PhotoMetadata[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<PhotoMetadata[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load portfolio data from JSON
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const [portfolioResponse, blogResponse] = await Promise.all([fetch("/api/portfolio"), fetch("/api/blog")])

        if (portfolioResponse.ok) {
          const portfolioData: PortfolioData = await portfolioResponse.json()
          setPhotos(portfolioData.photos)
          setFilteredPhotos(portfolioData.photos)
        }

        if (blogResponse.ok) {
          const blogData = await blogResponse.json()
          setBlogPosts(blogData.posts)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        // Fallback to empty arrays
        setPhotos([])
        setFilteredPhotos([])
        setBlogPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPortfolioData()
  }, [])

  // Filter photos based on selected categories and seasons
  useEffect(() => {
    let filtered = photos

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((photo) => selectedCategories.some((category) => photo.categories.includes(category)))
    }

    if (selectedSeasons.length > 0) {
      filtered = filtered.filter((photo) => photo.season && selectedSeasons.includes(photo.season))
    }

    setFilteredPhotos(filtered)
  }, [photos, selectedCategories, selectedSeasons])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleSeasonChange = (season: string, checked: boolean) => {
    if (checked) {
      setSelectedSeasons([...selectedSeasons, season])
    } else {
      setSelectedSeasons(selectedSeasons.filter((s) => s !== season))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedSeasons([])
  }

  const renderMainSection = () => (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-light text-white tracking-tight">Visual Stories</h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Capturing moments that speak beyond words, exploring the intersection of light, shadow, and human
            experience.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button
            onClick={() => setActiveSection("portfolio")}
            className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg"
          >
            View Portfolio
          </Button>
          <Button
            onClick={() => setActiveSection("blog")}
            variant="outline"
            className="border-white bg-white text-black hover:bg-gray-200 hover:text-black px-8 py-3 text-lg"
          >
            Read Blog
          </Button>
        </div>
      </div>
    </div>
  )

  const renderPortfolioSection = () => (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Portfolio</h2>
            <p className="text-gray-400 text-lg">
              {loading ? "Loading..." : `${filteredPhotos.length} ${filteredPhotos.length === 1 ? "image" : "images"}`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-600 bg-white text-black hover:bg-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(selectedCategories.length > 0 || selectedSeasons.length > 0) && (
                <Badge className="ml-2 bg-white text-black">{selectedCategories.length + selectedSeasons.length}</Badge>
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="bg-gray-900 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={category} className="text-gray-300 capitalize cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Seasons
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {SEASONS.map((season) => (
                      <div key={season} className="flex items-center space-x-2">
                        <Checkbox
                          id={season}
                          checked={selectedSeasons.includes(season)}
                          onCheckedChange={(checked) => handleSeasonChange(season, checked as boolean)}
                        />
                        <Label htmlFor={season} className="text-gray-300 cursor-pointer">
                          {season}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {(selectedCategories.length > 0 || selectedSeasons.length > 0) && (
                  <Button onClick={clearFilters} variant="ghost" className="text-gray-400 hover:text-black">
                    Clear all filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading portfolio...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden bg-gray-900 rounded-lg aspect-[4/5]">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <h3 className="text-white font-medium">{photo.title}</h3>
                      <div className="flex flex-wrap gap-1">
                        {photo.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                            {category}
                          </Badge>
                        ))}
                        {photo.season && <Badge className="text-xs bg-white text-black">{photo.season}</Badge>}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-none w-full h-full bg-black border-none p-0 m-0 overflow-hidden">
                  <VisuallyHidden>
                    <DialogTitle>{photo.title}</DialogTitle>
                    <DialogDescription>
                      {photo.description ||
                        `Photo titled ${photo.title} with categories: ${photo.categories.join(", ")}`}
                    </DialogDescription>
                  </VisuallyHidden>
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex w-full h-full py-8 px-4">
                      {/* Determine if image is landscape or portrait */}
                      {photo.width > photo.height ? (
                        // Landscape image - 60% width minimum
                        <div className="flex w-full h-full max-h-[calc(100vh-4rem)]">
                          <div
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{ minWidth: "60vw", maxWidth: "70vw" }}
                          >
                            <div className="relative w-full h-full flex items-center justify-center">
                              <Image
                                src={photo.url || "/placeholder.svg"}
                                alt={photo.title}
                                width={photo.width}
                                height={photo.height}
                                className="max-w-full max-h-full object-contain"
                                sizes="70vw"
                                priority
                              />
                            </div>
                          </div>
                          <div className="flex-1 p-8 overflow-y-auto">
                            <div className="space-y-6 max-w-md">
                              <div>
                                <h2 className="text-2xl font-light text-white mb-2">{photo.title}</h2>
                                <p className="text-gray-400">{photo.description}</p>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-white font-medium mb-2">Categories</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {photo.categories.map((category) => (
                                      <Badge key={category} variant="secondary" className="bg-gray-800 text-gray-300">
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {photo.camera && (
                                  <div className="space-y-2">
                                    <h3 className="text-white font-medium">Technical Details</h3>
                                    <div className="text-gray-400 space-y-1 text-sm">
                                      <p>Camera: {photo.camera}</p>
                                      {photo.lens && <p>Lens: {photo.lens}</p>}
                                      {photo.settings && (
                                        <div className="grid grid-cols-1 gap-2 mt-2">
                                          {photo.settings.aperture && <p>Aperture: {photo.settings.aperture}</p>}
                                          {photo.settings.shutter && <p>Shutter: {photo.settings.shutter}</p>}
                                          {photo.settings.iso && <p>ISO: {photo.settings.iso}</p>}
                                          {photo.settings.focalLength && (
                                            <p>Focal Length: {photo.settings.focalLength}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="text-gray-400 text-sm space-y-1">
                                  <p>
                                    Dimensions: {photo.width} × {photo.height}
                                  </p>
                                  <p>Date: {new Date(photo.dateCreated).toLocaleDateString()}</p>
                                  {photo.dateTaken && <p>Taken: {new Date(photo.dateTaken).toLocaleDateString()}</p>}
                                  {photo.format && <p>Format: {photo.format.toUpperCase()}</p>}
                                  {photo.fileSize && <p>Size: {photo.fileSize}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Portrait image - 80% height minimum
                        <div className="flex w-full h-full max-h-[calc(100vh-4rem)]">
                          <div
                            className="flex-shrink-0 flex items-center justify-center"
                            style={{ minHeight: "80vh", maxHeight: "calc(100vh-4rem)" }}
                          >
                            <div className="relative flex items-center justify-center h-full">
                              <Image
                                src={photo.url || "/placeholder.svg"}
                                alt={photo.title}
                                width={photo.width}
                                height={photo.height}
                                className="max-w-[60vw] max-h-full object-contain"
                                sizes="60vw"
                                priority
                              />
                            </div>
                          </div>
                          <div className="flex-1 p-8 overflow-y-auto">
                            <div className="space-y-6 max-w-md">
                              <div>
                                <h2 className="text-2xl font-light text-white mb-2">{photo.title}</h2>
                                <p className="text-gray-400">{photo.description}</p>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-white font-medium mb-2">Categories</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {photo.categories.map((category) => (
                                      <Badge key={category} variant="secondary" className="bg-gray-800 text-gray-300">
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {photo.camera && (
                                  <div className="space-y-2">
                                    <h3 className="text-white font-medium">Technical Details</h3>
                                    <div className="text-gray-400 space-y-1 text-sm">
                                      <p>Camera: {photo.camera}</p>
                                      {photo.lens && <p>Lens: {photo.lens}</p>}
                                      {photo.settings && (
                                        <div className="grid grid-cols-1 gap-2 mt-2">
                                          {photo.settings.aperture && <p>Aperture: {photo.settings.aperture}</p>}
                                          {photo.settings.shutter && <p>Shutter: {photo.settings.shutter}</p>}
                                          {photo.settings.iso && <p>ISO: {photo.settings.iso}</p>}
                                          {photo.settings.focalLength && (
                                            <p>Focal Length: {photo.settings.focalLength}</p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="text-gray-400 text-sm space-y-1">
                                  <p>
                                    Dimensions: {photo.width} × {photo.height}
                                  </p>
                                  <p>Date: {new Date(photo.dateCreated).toLocaleDateString()}</p>
                                  {photo.dateTaken && <p>Taken: {new Date(photo.dateTaken).toLocaleDateString()}</p>}
                                  {photo.format && <p>Format: {photo.format.toUpperCase()}</p>}
                                  {photo.fileSize && <p>Size: {photo.fileSize}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mobile Layout - 70% image, 30% metadata */}
                    <div className="flex md:hidden flex-col w-full h-screen">
                      {/* Image area - exactly 70% of viewport height */}
                      <div className="flex items-center justify-center bg-black" style={{ height: "70vh" }}>
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <Image
                            src={photo.url || "/placeholder.svg"}
                            alt={photo.title}
                            width={photo.width}
                            height={photo.height}
                            className="max-w-full max-h-full object-contain"
                            sizes="100vw"
                            priority
                          />
                        </div>
                      </div>

                      {/* Metadata area - exactly 30% of viewport height */}
                      <div
                        className="bg-black/95 backdrop-blur-sm border-t border-gray-800 overflow-hidden"
                        style={{ height: "30vh" }}
                      >
                        <div className="h-full overflow-y-auto p-4">
                          <div className="space-y-3 pb-4">
                            <div>
                              <h2 className="text-lg font-light text-white mb-1 leading-tight">{photo.title}</h2>
                              {photo.description && (
                                <p className="text-gray-400 text-sm leading-relaxed">{photo.description}</p>
                              )}
                            </div>

                            <div className="space-y-3">
                              {photo.categories.length > 0 && (
                                <div>
                                  <h3 className="text-white font-medium mb-1 text-sm">Categories</h3>
                                  <div className="flex flex-wrap gap-1">
                                    {photo.categories.map((category) => (
                                      <Badge
                                        key={category}
                                        variant="secondary"
                                        className="bg-gray-800 text-gray-300 text-xs px-2 py-1"
                                      >
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {photo.camera && (
                                <div className="space-y-1">
                                  <h3 className="text-white font-medium text-sm">Technical Details</h3>
                                  <div className="text-gray-400 space-y-1 text-xs leading-relaxed">
                                    <p>Camera: {photo.camera}</p>
                                    {photo.lens && <p>Lens: {photo.lens}</p>}
                                    {photo.settings && (
                                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
                                        {photo.settings.aperture && <p>Aperture: {photo.settings.aperture}</p>}
                                        {photo.settings.shutter && <p>Shutter: {photo.settings.shutter}</p>}
                                        {photo.settings.iso && <p>ISO: {photo.settings.iso}</p>}
                                        {photo.settings.focalLength && (
                                          <p>Focal Length: {photo.settings.focalLength}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="text-gray-400 text-xs space-y-1 leading-relaxed">
                                <p>
                                  Dimensions: {photo.width} × {photo.height}
                                </p>
                                <p>Date: {new Date(photo.dateCreated).toLocaleDateString()}</p>
                                {photo.dateTaken && <p>Taken: {new Date(photo.dateTaken).toLocaleDateString()}</p>}
                                <div className="flex gap-4">
                                  {photo.format && <p>Format: {photo.format.toUpperCase()}</p>}
                                  {photo.fileSize && <p>Size: {photo.fileSize}</p>}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderBlogSection = () => (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-white mb-12">Blog</h2>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-light text-white">{post.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{post.excerpt}</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="text-white hover:text-black px-3 py-3">
                        Read more →
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 overflow-hidden mx-3 my-4 max-h-[calc(100vh-2rem)] md:m-4">
                      <DialogTitle className="text-2xl font-light text-white mb-4">{post.title}</DialogTitle>
                      <DialogDescription className="text-gray-400 mb-4">{post.excerpt}</DialogDescription>
                      <div className="overflow-y-auto flex-1 pr-2 md:pr-4" style={{ maxHeight: "calc(100vh - 12rem)" }}>
                        <div className="space-y-4 px-2 md:px-0">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <div className="prose prose-invert max-w-none">
                            {post.content.split("\n\n").map((paragraph, index) => (
                              <p key={index} className="text-gray-300 leading-relaxed mb-4 last:mb-8 pr-2 md:pr-0">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="w-6 h-6 text-white" />
              <span className="text-white font-light text-lg">Portfolio</span>
            </div>

            <div className="flex space-x-8">
              {["main", "portfolio", "blog"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-medium transition-colors capitalize ${
                    activeSection === section ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {section === "main" ? "Home" : section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {activeSection === "main" && renderMainSection()}
        {activeSection === "portfolio" && renderPortfolioSection()}
        {activeSection === "blog" && renderBlogSection()}
      </main>
    </div>
  )
}
