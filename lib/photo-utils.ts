export interface PhotoMetadata {
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
  camera?: string
  lens?: string
  settings?: {
    aperture?: string
    shutter?: string
    iso?: string
    focalLength?: string
  }
}

export const extractPhotoMetadata = async (file: File): Promise<Partial<PhotoMetadata>> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const metadata: Partial<PhotoMetadata> = {
        filename: file.name,
        url: url,
        width: img.width,
        height: img.height,
        dateCreated: new Date(file.lastModified).toISOString().split("T")[0],
        title: file.name.split(".")[0].replace(/[-_]/g, " "),
      }

      // Try to extract EXIF data if available
      // Note: In a real implementation, you'd use a library like exif-js or piexifjs
      resolve(metadata)
    }

    img.src = url
  })
}

export const savePhotosToJSON = (photos: PhotoMetadata[]) => {
  const data = { photos }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = "photos.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const loadPhotosFromJSON = (file: File): Promise<PhotoMetadata[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data.photos || [])
      } catch (error) {
        reject(error)
      }
    }

    reader.readAsText(file)
  })
}
