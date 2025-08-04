# Photographer Portfolio

A minimalist photographer portfolio website built with Next.js, featuring dark aesthetics and advanced photo management.

## Features

- 🎨 Dark minimalist design optimized for photo display
- 📸 Advanced filtering system (categories, seasons)
- 🖼️ Support for modern image formats (WebP, AVIF)
- 📊 Automatic EXIF metadata extraction
- 📝 JSON-based content management
- 🚀 Optimized for Vercel deployment

## Deployment Workflow

### 1. Add New Photos

Place your photos in the `public/photos/` directory:

\`\`\`bash
mkdir -p public/photos
cp /path/to/your/photos/* public/photos/
\`\`\`

### 2. Process Photos

Run the processing script to extract metadata and update portfolio.json:

\`\`\`bash
npm run process-photos
\`\`\`

This script will:
- Extract EXIF data (camera, lens, settings, date taken)
- Generate metadata for each photo
- Create optimized entries in `data/portfolio.json`
- Preserve existing manual edits (titles, descriptions, categories)

### 3. Manual Metadata Editing

Edit `data/portfolio.json` to add:
- Custom titles and descriptions
- Categories: `best`, `street`, `concept`, `monochrome`, `experiments`, `architecture`
- Seasons: `SS 25`, `FW 24`

Example photo entry:
\`\`\`json
{
  "id": "urban-solitude",
  "title": "Urban Solitude",
  "description": "A moment of quiet contemplation in the bustling city",
  "categories": ["best", "street", "monochrome"],
  "season": "FW 24",
  "filename": "urban-solitude.webp",
  "url": "/photos/urban-solitude.webp",
  "width": 2400,
  "height": 3200,
  "camera": "Canon EOS R5",
  "lens": "50mm f/1.4",
  "settings": {
    "aperture": "f/2.8",
    "shutter": "1/125s",
    "iso": "800",
    "focalLength": "50mm"
  }
}
\`\`\`

### 4. Deploy to Vercel

\`\`\`bash
git add .
git commit -m "Add new photos and update portfolio"
git push origin main
\`\`\`

Vercel will automatically deploy your changes.

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp) - Recommended for web
- AVIF (.avif) - Next-gen format
- TIFF (.tiff, .tif)

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your portfolio.

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── portfolio/route.ts    # Portfolio data API
│   │   └── blog/route.ts         # Blog data API
│   └── page.tsx                  # Main application
├── data/
│   ├── portfolio.json            # Photo metadata
│   └── blog.json                 # Blog posts
├── public/
│   └── photos/                   # Your photo files
├── scripts/
│   └── process-photos.js         # Photo processing script
└── components/ui/                # UI components
\`\`\`

## Tips

1. **Image Optimization**: Use WebP or AVIF formats for better performance
2. **Batch Processing**: The script preserves existing metadata, so you can run it multiple times
3. **Manual Edits**: Edit `portfolio.json` directly for custom titles, descriptions, and categories
4. **Git LFS**: Consider using Git LFS for large image files
5. **Backup**: Keep backups of your `data/portfolio.json` file

## Environment Variables

No environment variables required for basic functionality.
