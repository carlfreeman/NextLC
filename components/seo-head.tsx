"use client"

import Head from "next/head"
import { useTheme } from "./theme-provider"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
}

export function SEOHead({
  title = "Марк Литвак | Фотограф | Москва",
  description = "Фотопортфолио Марка Литвака: концептуальная и стрит-фотография, чёрно-белые работы и визуальные эксперименты.",
  image = "/og-image.jpg",
  url = "https://littlecan.ru",
  type = "website",
}: SEOHeadProps) {
  const { theme } = useTheme()

  return (
    <Head>
      {/* Dynamic theme color based on current theme */}
      <meta name="theme-color" content={theme === "dark" ? "#000000" : "#ffffff"} />

      {/* Page-specific Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://littlecan.ru${image}`} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Page-specific Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`https://littlecan.ru${image}`} />
    </Head>
  )
}
