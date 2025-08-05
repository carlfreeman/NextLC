import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/", "/temp/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Yandex",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    sitemap: "https://littlecan.ru/sitemap.xml",
  }
}
