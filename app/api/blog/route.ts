import { NextResponse } from "next/server"
import { getAllBlogPosts } from "@/lib/blog"

export async function GET() {
  try {
    const posts = await getAllBlogPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error in blog API:", error)
    return NextResponse.json({ posts: [] }, { status: 500 })
  }
}
