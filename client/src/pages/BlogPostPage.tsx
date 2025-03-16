import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { BlogPost, BlogCategory } from "@/types/blog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BlogPostPage() {
  // Extract slug from URL
  const [match, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug;
  
  // Query for the blog post
  const { data: post, isLoading: isPostLoading, error: postError } = useQuery<BlogPost>({
    queryKey: ['/api/blog-posts/slug', slug],
    staleTime: 30000,
    enabled: !!slug,
  });
  
  // Query for blog categories for navigation
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['/api/blog-categories'],
    staleTime: 60000,
  });
  
  // Find the category this post belongs to
  const category = post ? categories.find(c => c.id === post.categoryId) : null;
  
  // Handle 404 if post not found
  if (!isPostLoading && (!post || postError)) {
    return (
      <MainLayout
        title="Post Not Found | Vape Cave TX Blog"
        description="The blog post you're looking for could not be found."
        canonical={`/blog/${slug}`}
      >
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for could not be found.</p>
          <Button asChild>
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  if (isPostLoading || !post) {
    return (
      <MainLayout
        title="Loading... | Vape Cave TX Blog"
        description="Loading blog post content..."
      >
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout
      title={`${post.metaTitle || post.title} | Vape Cave TX Blog`}
      description={post.metaDescription || post.summary}
      canonical={`/blog/${post.slug}`}
      ogImage={post.imageUrl}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span>{category?.name || 'Uncategorized'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <>
                <span className="mx-2">•</span>
                <span>Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </>
            )}
          </div>
          
          {post.imageUrl && (
            <div className="mb-8">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}
        </div>
        
        <Separator className="my-6" />
        
        <Card className="border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* This would be populated with related posts if we had them */}
            <div className="text-center py-4">
              <p className="text-gray-500">Check back soon for more related content!</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}