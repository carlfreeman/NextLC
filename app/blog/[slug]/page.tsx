import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blog"
import { generateSEOMetadata } from "@/lib/metadata"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogPostPageProps {
  params: { slug: string }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)
  
  if (!post) {
    return generateSEOMetadata({
      title: "Пост не найден | Марк Литвак",
      description: "Запрашиваемый пост блога не найден.",
    })
  }

  return generateSEOMetadata({
    title: `${post.title} | Марк Литвак`,
    description: post.excerpt,
    image: post.image,
    url: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
    tags: post.tags,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к блогу
            </Button>
          </Link>
        </div>

        {/* Article header */}
        <article className="space-y-8">
          <header className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-light text-foreground leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-muted text-muted-foreground hover:bg-muted-foreground hover:text-background transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Article content */}
          <Card className="bg-card border-border">
            <CardContent className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-muted-foreground leading-relaxed mb-6 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Article footer */}
          <footer className="pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Опубликовано {new Date(post.date).toLocaleDateString('ru-RU')} автором {post.author}
              </div>
              
              <Link href="/blog">
                <Button variant="outline" className="border-border hover:bg-muted">
                  Все посты блога
                </Button>
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
