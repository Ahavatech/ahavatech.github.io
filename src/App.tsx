function Navbar() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["https://oplayeni.onrender.com/api/profile"],
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
        console.log('Profile data:', data); // Debug log
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
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
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
