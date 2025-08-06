import type { Metadata } from "next"
import { getAllBlogPosts, getAllTags } from "@/lib/blog"
import { generateSEOMetadata } from "@/lib/metadata"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Link from "next/link"

export const metadata: Metadata = generateSEOMetadata({
  title: "Блог | Марк Литвак",
  description: "Статьи о фотографии, технике съёмки, обзоры камер и объективов. Делюсь опытом и знаниями в области стрит-фотографии и концептуального искусства.",
  url: "/blog",
})

export default async function BlogPage() {
  const [posts, tags] = await Promise.all([
    getAllBlogPosts(),
    getAllTags()
  ])

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-foreground mb-6">Блог</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Размышления о фотографии, технике и творчестве. Делюсь опытом и находками в мире визуального искусства.
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog posts */}
        <div className="space-y-8">
          {posts.map((post) => (
            <Card key={post.id} className="bg-card border-border hover:border-muted-foreground transition-colors group">
              <CardContent className="p-8">
                <article className="space-y-4">
                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  </div>

                  {/* Title and excerpt */}
                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-light text-foreground group-hover:text-muted-foreground transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-muted text-muted-foreground text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 4 && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                        +{post.tags.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Read more button */}
                  <div className="pt-4">
                    <Link href={`/blog/${post.slug}`}>
                      <Button 
                        variant="ghost" 
                        className="text-foreground hover:text-muted-foreground p-0 h-auto font-normal group-hover:translate-x-1 transition-transform"
                      >
                        Читать полностью
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </article>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Больше постов скоро появится. Следите за обновлениями!
          </p>
        </div>
      </div>
    </div>
  )
}
