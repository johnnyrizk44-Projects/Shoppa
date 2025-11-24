import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, MapPin } from 'lucide-react';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ListsPage from './pages/ListsPage';
import ProfilePage from './pages/ProfilePage';
import { ListProvider } from './context/ListContext';
import { UserProvider } from './context/UserContext';

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Set default to Adelaide for testing
  const [currentLoc, setCurrentLoc] = useState("Adelaide, 5000");
  // Disable loading state for testing
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // Geolocation disabled for testing Adelaide location
    /*
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using BigDataCloud's free client-side reverse geocoding API for the MVP
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          // Construct location string (e.g., "Surry Hills, 2010")
          const suburb = data.locality || data.city || "";
          const postcode = data.postcode || "";
          
          if (suburb) {
            setCurrentLoc(`${suburb}${postcode ? `, ${postcode}` : ''}`);
          }
        } catch (error) {
          console.warn("Reverse geocoding failed, using default", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Location permission denied or error:", error);
        setIsLocating(false);
      }
    );
    */
  }, []);

  const getNavClass = (path: string) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && path !== '/search');
    return `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`;
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
            S
          </div>
          <h1 className="font-bold text-xl text-gray-900 tracking-tight">ShopPA</h1>
        </div>
        <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
           <MapPin size={12} className={`mr-1 ${isLocating ? 'animate-pulse text-blue-500' : ''}`} />
           <span className="truncate max-w-[120px]">
             {isLocating ? "Locating..." : currentLoc}
           </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 h-16 absolute bottom-0 w-full flex justify-between items-center z-40 px-2">
        <button className={getNavClass('/')} onClick={() => navigate('/')}>
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button className={getNavClass('/search')} onClick={() => navigate('/search')}>
          <Search size={22} />
          <span className="text-[10px] font-medium">Search</span>
        </button>
        <button className={getNavClass('/cart')} onClick={() => navigate('/cart')}>
          <ShoppingCart size={22} />
          <span className="text-[10px] font-medium">Lists</span>
        </button>
        <button className={getNavClass('/profile')} onClick={() => navigate('/profile')}>
          <User size={22} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ListProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/cart" element={<ListsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ListProvider>
    </UserProvider>
  );
};

export default App;