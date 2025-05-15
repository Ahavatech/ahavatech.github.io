import { Link } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "@lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import TestPage from "@/pages/test-page";
import CourseDetailPage from "@/pages/course-detail-page";
import { Profile } from "@shared/schema";

function Navbar() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.error('Profile fetch failed:', response.status);
          return null;
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Profile fetch error:', error);
        return null;
      }
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2
  });

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            {isLoading ? (
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              profile?.name || "Loading Profile..."
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <ProtectedRoute requireAdmin>
                <CourseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}

export default App;