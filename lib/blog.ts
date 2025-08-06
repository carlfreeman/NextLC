import { promises as fs } from "fs"
import path from "path"

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  tags: string[]
  image: string
  author: string
}

export interface BlogData {
  posts: BlogPost[]
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), "data", "blog-posts.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const data: BlogData = JSON.parse(fileContents)
    
    // Sort posts by date (newest first)
    return data.posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error reading blog posts:", error)
    return []
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await getAllBlogPosts()
    return posts.find(post => post.slug === slug) || null
  } catch (error) {
    console.error("Error getting blog post:", error)
    return null
  }
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const posts = await getAllBlogPosts()
    return posts.filter(post => post.tags.includes(tag))
  } catch (error) {
    console.error("Error getting blog posts by tag:", error)
    return []
  }
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllBlogPosts()
    const allTags = posts.flatMap(post => post.tags)
    return [...new Set(allTags)].sort()
  } catch (error) {
    console.error("Error getting tags:", error)
    return []
  }
}

// Generate slug from title (utility function)
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/g, '') // Remove special characters, keep Cyrillic
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}
