import { Routes, Route, Link } from "react-router-dom";
import { queryClient } from "@lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@components/ui/toaster";
import { AuthProvider, useAuth } from "@hooks/use-auth";
import { ProtectedRoute } from "@lib/protected-route";
import NotFound from "@pages/not-found";
import HomePage from "@pages/home-page";
import AuthPage from "@pages/auth-page";
import AdminPage from "@pages/admin-page";
import TestPage from "@pages/test-page";
import CourseDetailPage from "@pages/course-detail-page";
import { Profile } from "@shared/schema";

function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!user // Only fetch profile when user is authenticated
  });

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          {isLoading ? "Loading..." : profile?.name || "Guest"}
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => logoutMutation.mutate()}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Wrapper for admin-protected routes
function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  return <ProtectedRoute path="" requireAdmin component={() => children} />;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id"
          element={
            <AdminProtectedRoute>
              <CourseDetailPage />
            </AdminProtectedRoute>
          }
        />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
