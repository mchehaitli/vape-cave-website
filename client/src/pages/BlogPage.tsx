import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogCategory, BlogPost } from "@/types/blog";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Query for blog categories
  const { data: blogCategories = [], isLoading: isBlogCategoriesLoading } = useQuery<any[]>({
    queryKey: ['/api/blog-categories'],
    staleTime: 60000,
  });

  // Query for blog posts
  const { data: blogPosts = [], isLoading: isBlogPostsLoading } = useQuery<any[]>({
    queryKey: ['/api/blog-posts'],
    staleTime: 30000,
  });
  
  // Set first category as active when data loads
  useEffect(() => {
    if (blogCategories && blogCategories.length > 0 && !activeCategory) {
      setActiveCategory(blogCategories[0].slug);
    }
  }, [blogCategories, activeCategory]);
  
  return (
    <MainLayout
      title="Blog | Vape Cave TX"
      description="Read our latest articles about vaping, CBD products, and industry news."
      canonical="/blog"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl font-bold text-center mb-2">Vape Cave Blog</h1>
        <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Stay up to date with the latest news, reviews, and information about vaping products and CBD.
        </p>
        
        <Separator className="my-8" />
        
        {isBlogCategoriesLoading || isBlogPostsLoading ? (
          // Loading state
          <div className="space-y-8">
            <div className="animate-pulse flex justify-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : blogCategories.length > 0 ? (
          <Tabs defaultValue={activeCategory || "all"} className="w-full">
            <div className="flex justify-center">
              <TabsList className="mb-8">
                <TabsTrigger value="all" onClick={() => setActiveCategory(null)}>
                  All Posts
                </TabsTrigger>
                {blogCategories.map((category: any) => (
                  <TabsTrigger 
                    key={category.slug} 
                    value={category.slug}
                    onClick={() => setActiveCategory(category.slug)}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="all" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post: any) => (
                    <BlogPostCard key={post.id} post={post} categories={blogCategories} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500">No blog posts have been published yet. Check back soon!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {blogCategories.map((category: any) => (
              <TabsContent key={category.slug} value={category.slug} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.filter((post: any) => 
                    post.categoryId === category.id && post.published
                  ).length > 0 ? (
                    blogPosts
                      .filter((post: any) => post.categoryId === category.id && post.published)
                      .map((post: any) => (
                        <BlogPostCard key={post.id} post={post} categories={blogCategories} />
                      ))
                  ) : (
                    <div className="col-span-3 text-center py-8">
                      <p className="text-gray-500">No posts in this category yet. Check back soon!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              Our blog is coming soon. Check back for articles about vaping, CBD, and more!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

interface BlogPostCardProps {
  post: any;
  categories: any[];
}

function BlogPostCard({ post, categories }: BlogPostCardProps) {
  const category = categories.find(c => c.id === post.categoryId);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
      {post.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <CardDescription className="text-sm">
              {category?.name} • {new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          {post.featured && (
            <div className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.summary}</p>
        <a 
          href={`/blog/${post.slug}`} 
          className="text-primary hover:text-primary/80 text-sm font-semibold"
        >
          Read More →
        </a>
      </CardContent>
    </Card>
  );
}