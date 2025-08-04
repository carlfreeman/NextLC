#!/usr/bin/env node

import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"
import ExifReader from "exifreader"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const PHOTOS_DIR = path.join(__dirname, "..", "public", "photos")
const OUTPUT_DIR = path.join(__dirname, "..", "data")
const OUTPUT_FILE = path.join(OUTPUT_DIR, "portfolio.json")

// Supported formats
const SUPPORTED_FORMATS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff", ".tif"]

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Helper function to extract EXIF data
async function extractExifData(filePath) {
  try {
    const buffer = await fs.readFile(filePath)
    const tags = ExifReader.load(buffer)

    const exifData = {
      camera: null,
      lens: null,
      settings: {},
    }

    // Camera make and model
    if (tags.Make && tags.Model) {
      exifData.camera = `${tags.Make.description} ${tags.Model.description}`
    }

    // Lens information
    if (tags.LensModel) {
      exifData.lens = tags.LensModel.description
    } else if (tags.LensMake && tags.LensModel) {
      exifData.lens = `${tags.LensMake.description} ${tags.LensModel.description}`
    }

    // Camera settings
    if (tags.FNumber) {
      exifData.settings.aperture = `f/${tags.FNumber.description}`
    }

    if (tags.ExposureTime) {
      const exposure = tags.ExposureTime.description
      exifData.settings.shutter = exposure.includes("/") ? `${exposure}s` : `${exposure}s`
    }

    if (tags.ISOSpeedRatings) {
      exifData.settings.iso = tags.ISOSpeedRatings.description
    }

    if (tags.FocalLength) {
      exifData.settings.focalLength = `${tags.FocalLength.description}mm`
    }

    // Date taken
    let dateTaken = null
    if (tags.DateTimeOriginal) {
      dateTaken = tags.DateTimeOriginal.description.replace(/:/g, "-").replace(" ", "T") + ".000Z"
    } else if (tags.DateTime) {
      dateTaken = tags.DateTime.description.replace(/:/g, "-").replace(" ", "T") + ".000Z"
    }

    return { ...exifData, dateTaken }
  } catch (error) {
    console.warn(`Could not extract EXIF data from ${filePath}:`, error.message)
    return { camera: null, lens: null, settings: {}, dateTaken: null }
  }
}

// Helper function to generate photo ID from filename
function generatePhotoId(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

// Helper function to generate title from filename
function generateTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, "") // Remove extension
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
}

// Main processing function
async function processPhotos() {
  try {
    console.log("🔍 Scanning for photos...")

    // Ensure directories exist
    await fs.mkdir(PHOTOS_DIR, { recursive: true })
    await fs.mkdir(OUTPUT_DIR, { recursive: true })

    // Read existing portfolio data
    let existingData = { photos: [], lastUpdated: new Date().toISOString() }
    try {
      const existingContent = await fs.readFile(OUTPUT_FILE, "utf8")
      existingData = JSON.parse(existingContent)
    } catch (error) {
      console.log("📝 Creating new portfolio.json file")
    }

    // Get all image files
    const files = await fs.readdir(PHOTOS_DIR)
    const imageFiles = files.filter((file) => SUPPORTED_FORMATS.includes(path.extname(file).toLowerCase()))

    console.log(`📸 Found ${imageFiles.length} image files`)

    const processedPhotos = []
    const existingPhotosMap = new Map(existingData.photos.map((photo) => [photo.filename, photo]))

    for (const filename of imageFiles) {
      const filePath = path.join(PHOTOS_DIR, filename)
      const stats = await fs.stat(filePath)

      console.log(`Processing: ${filename}`)

      // Check if photo already exists and hasn't been modified
      const existingPhoto = existingPhotosMap.get(filename)
      if (existingPhoto && new Date(stats.mtime) <= new Date(existingPhoto.dateCreated)) {
        console.log(`  ✓ Using existing metadata for ${filename}`)
        processedPhotos.push(existingPhoto)
        continue
      }

      try {
        // Get image metadata using Sharp
        const image = sharp(filePath)
        const metadata = await image.metadata()

        // Extract EXIF data
        const exifData = await extractExifData(filePath)

        // Generate photo metadata
        const photoId = generatePhotoId(filename)
        const photoData = {
          id: existingPhoto?.id || photoId,
          title: existingPhoto?.title || generateTitle(filename),
          description: existingPhoto?.description || "",
          categories: existingPhoto?.categories || [],
          season: existingPhoto?.season || null,
          filename: filename,
          url: `/photos/${filename}`,
          width: metadata.width || 0,
          height: metadata.height || 0,
          dateCreated: stats.mtime.toISOString(),
          dateTaken: exifData.dateTaken,
          camera: exifData.camera,
          lens: exifData.lens,
          settings: Object.keys(exifData.settings).length > 0 ? exifData.settings : undefined,
          fileSize: formatFileSize(stats.size),
          format: metadata.format || path.extname(filename).slice(1),
        }

        processedPhotos.push(photoData)
        console.log(`  ✓ Processed ${filename} (${photoData.width}x${photoData.height}, ${photoData.fileSize})`)
      } catch (error) {
        console.error(`  ❌ Error processing ${filename}:`, error.message)
      }
    }

    // Sort photos by date taken (newest first), then by filename
    processedPhotos.sort((a, b) => {
      const dateA = new Date(a.dateTaken || a.dateCreated)
      const dateB = new Date(b.dateTaken || b.dateCreated)
      return dateB.getTime() - dateA.getTime()
    })

    // Create output data
    const outputData = {
      photos: processedPhotos,
      lastUpdated: new Date().toISOString(),
    }

    // Write to file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(outputData, null, 2))

    console.log(`\n✅ Successfully processed ${processedPhotos.length} photos`)
    console.log(`📄 Portfolio data written to: ${OUTPUT_FILE}`)
    console.log(`🕒 Last updated: ${outputData.lastUpdated}`)

    // Print summary
    const categories = [...new Set(processedPhotos.flatMap((p) => p.categories))]
    const seasons = [...new Set(processedPhotos.map((p) => p.season).filter(Boolean))]

    if (categories.length > 0) {
      console.log(`🏷️  Categories found: ${categories.join(", ")}`)
    }
    if (seasons.length > 0) {
      console.log(`📅 Seasons found: ${seasons.join(", ")}`)
    }
  } catch (error) {
    console.error("❌ Error processing photos:", error)
    process.exit(1)
  }
}

// Run the script
processPhotos()
