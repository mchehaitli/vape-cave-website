import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBrandCategories } from "@/hooks/use-brands";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: categories, isLoading: isCategoriesLoading } = useBrandCategories();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated || !data.user.isAdmin) {
          toast({
            title: "Unauthorized",
            description: "Please login with admin credentials",
            variant: "destructive",
          });
          navigate('/admin/login');
          return;
        }
        
        setAdminData(data.user);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication",
          variant: "destructive",
        });
        navigate('/admin/login');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Admin Dashboard | Vape Cave"
        description="Admin dashboard for Vape Cave website management."
      >
        <div className="min-h-screen bg-gray-900 text-white p-4">
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-36 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-64 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Admin Dashboard | Vape Cave"
      description="Admin dashboard for Vape Cave website management."
    >
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="container mx-auto pt-4 pb-16">
          <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {adminData?.username}</p>
            </div>
            <Button 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-800"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </header>

          <Tabs defaultValue="brands" className="space-y-4">
            <TabsList className="bg-gray-800 border border-gray-700">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="brands">Manage Brands</TabsTrigger>
              <TabsTrigger value="categories">Brand Categories</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{categories?.length || 0}</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Brands</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {categories?.reduce((acc, cat) => acc + cat.brands.length, 0) || 0}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle>Website Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p>Online</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="brands" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Manage Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    This section allows you to add, edit, and delete brands across all categories.
                  </p>
                  <div className="flex justify-end mb-4">
                    <Button className="bg-primary hover:bg-primary/90">Add New Brand</Button>
                  </div>
                  
                  {isCategoriesLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-lg font-semibold">
                        Brand Management UI Coming Soon
                      </p>
                      <p className="text-gray-400">
                        The brand management interface is currently being developed. Check back soon!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Brand Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Manage brand categories and their display settings.
                  </p>
                  <div className="flex justify-end mb-4">
                    <Button className="bg-primary hover:bg-primary/90">Add New Category</Button>
                  </div>
                  
                  {isCategoriesLoading ? (
                    <div className="animate-pulse space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-700 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-lg font-semibold">
                        Category Management UI Coming Soon
                      </p>
                      <p className="text-gray-400">
                        The category management interface is currently being developed. Check back soon!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    Configure website settings and user preferences.
                  </p>
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Settings UI Coming Soon
                    </p>
                    <p className="text-gray-400">
                      The settings interface is currently being developed. Check back soon!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}