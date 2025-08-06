import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  authors?: string[]
  tags?: string[]
}

export function generateSEOMetadata({
  title = "Марк Литвак | Фотограф | Москва",
  description = "Фотопортфолио Марка Литвака: концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты.",
  image = "/og-image.jpg",
  url = "/",
  type = "website",
  publishedTime,
  authors,
  tags,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littlecan.vercel.app"
  const fullUrl = `${baseUrl}${url}`
  const fullImageUrl = `${baseUrl}${image}`

  return {
    title,
    description,
    keywords: tags,
    authors: authors?.map(name => ({ name })),
    openGraph: {
      type: type as any,
      locale: "ru_RU",
      url: fullUrl,
      title,
      description,
      siteName: "Little Can Photography",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && publishedTime && {
        publishedTime,
        authors: authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
      creator: "@canonlifeshots",
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
