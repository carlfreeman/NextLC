import type { MetadataRoute } from "next"

// Dedicated blog sitemap for better organization
export default async function blogSitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littlecan.vercel.app"
  
  // Get all blog posts with more detailed metadata
  const blogPosts = [
    {
      slug: "philosophy-of-street-photography",
      date: "2024-12-01T10:00:00.000Z",
      title: "Философия стрит-фотографии",
    },
    {
      slug: "working-with-natural-light",
      date: "2024-11-28T14:30:00.000Z", 
      title: "Работа с естественным светом",
    },
    // Add more posts...
  ]

  return blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
    alternates: {
      languages: {
        ru: `${baseUrl}/blog/${post.slug}`,
        en: `${baseUrl}/en/blog/${post.slug}`,
      },
    },
  }))
}
