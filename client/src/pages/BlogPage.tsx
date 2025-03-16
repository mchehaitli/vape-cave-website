import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlogPost } from "@/types/blog";

export default function BlogPage() {
  // Query for blog posts
  const { data: blogPosts = [], isLoading: isBlogPostsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    staleTime: 30000,
  });
  
  return (
    <MainLayout
      title="Blog | Vape Cave TX"
      description="Read our latest articles about vaping, CBD products, and industry news."
      canonical="/blog"
    >
      <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">Vape Cave Blog</h1>
          <p className="text-lg text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Stay up to date with the latest news, reviews, and information about vaping products and CBD.
          </p>
          
          <Separator className="my-8 bg-gray-700" />
          
          {isBlogPostsLoading ? (
            // Loading state
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-700 rounded-lg mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post: BlogPost) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-300">
                Our blog is coming soon. Check back for articles about vaping, CBD, and more!
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-800 bg-gray-800 text-white">
      {post.featured_image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.featured_image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-white">{post.title}</CardTitle>
            <CardDescription className="text-sm text-gray-300">
              {new Date(post.created_at).toLocaleDateString()}
            </CardDescription>
          </div>
          {post.is_featured && (
            <div className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-gray-300 text-sm line-clamp-3 mb-3">{post.summary}</p>
        <Link
          href={`/blog/${post.slug}`} 
          className="text-primary hover:text-primary/80 text-sm font-semibold inline-block"
        >
          Read More →
        </Link>
      </CardContent>
    </Card>
  );
}