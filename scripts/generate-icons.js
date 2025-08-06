#!/usr/bin/env node

import sharp from "sharp"
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const SOURCE_IMAGE = path.join(__dirname, "..", "source-image.jpg") // Your source photo
const PUBLIC_DIR = path.join(__dirname, "..", "public")

// Icon sizes to generate
const ICON_SIZES = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-16x16.png", size: 16 },
]

async function generateIcons() {
  try {
    console.log("🎨 Generating icons from source image...")

    // Check if source image exists
    try {
      await fs.access(SOURCE_IMAGE)
    } catch (error) {
      console.error(`❌ Source image not found: ${SOURCE_IMAGE}`)
      console.log("📝 Please add a high-quality square image (1024x1024px) as 'source-image.jpg' in the project root")
      return
    }

    // Generate each icon size
    for (const icon of ICON_SIZES) {
      const outputPath = path.join(PUBLIC_DIR, icon.name)

      await sharp(SOURCE_IMAGE)
        .resize(icon.size, icon.size, {
          fit: "cover",
          position: "center",
        })
        .png({ quality: 90 })
        .toFile(outputPath)

      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`)
    }

    // Generate OG image (1200x630)
    const ogImagePath = path.join(PUBLIC_DIR, "og-image.jpg")
    await sharp(SOURCE_IMAGE)
      .resize(1200, 630, {
        fit: "cover",
        position: "center",
      })
      .jpeg({ quality: 85 })
      .toFile(ogImagePath)

    console.log("✅ Generated og-image.jpg (1200x630)")

    // Generate favicon.ico (requires additional processing)
    console.log("📝 Note: favicon.ico should be generated manually or using online tools")
    console.log("   Recommended: https://favicon.io/favicon-converter/")

    console.log("\n🎉 Icon generation complete!")
    console.log("📋 Generated files:")
    console.log("   - og-image.jpg (social sharing)")
    console.log("   - icon-192.png (PWA small)")
    console.log("   - icon-512.png (PWA large)")
    console.log("   - apple-touch-icon.png (iOS)")
    console.log("   - favicon-32x32.png & favicon-16x16.png (browser)")
  } catch (error) {
    console.error("❌ Error generating icons:", error)
  }
}

generateIcons()
