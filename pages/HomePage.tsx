import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Milk, Wheat, Coffee, Candy, Soup, Camera, Loader2 } from 'lucide-react';
import { ProductCategory } from '../types';
import { identifyProductFromImage } from '../services/geminiService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64String = await convertFileToBase64(file);
      // Remove data url prefix for API
      const base64Data = base64String.split(',')[1];
      const mimeType = file.type;

      const productName = await identifyProductFromImage(base64Data, mimeType);
      
      if (productName) {
        setSearchTerm(productName);
        // Pass the full image string in state so the results page can display it
        navigate(`/search?q=${encodeURIComponent(productName)}`, { 
          state: { capturedImage: base64String } 
        });
      } else {
        alert("Could not identify the product. Please try typing the name.");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const categories = [
    { name: ProductCategory.SOFT_DRINKS, icon: <Coffee className="text-amber-600" />, color: 'bg-amber-100' },
    { name: ProductCategory.CEREAL, icon: <Wheat className="text-yellow-600" />, color: 'bg-yellow-100' },
    { name: ProductCategory.DAIRY, icon: <Milk className="text-blue-600" />, color: 'bg-blue-100' },
    { name: ProductCategory.SNACKS, icon: <Candy className="text-pink-600" />, color: 'bg-pink-100' },
    { name: ProductCategory.PANTRY, icon: <Soup className="text-red-600" />, color: 'bg-red-100' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Hidden File Input for Camera */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* Hero / Search Section */}
      <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-2">Compare prices. <br/> Eat healthier.</h2>
        <p className="text-blue-100 text-sm mb-4">Find the best value across Aussie supermarkets.</p>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder={isAnalyzing ? "Analyzing photo..." : "Search by name or photo"}
            className="w-full py-3 pl-10 pr-12 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isAnalyzing}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          
          <button 
            type="button"
            onClick={handleCameraClick}
            disabled={isAnalyzing}
            className="absolute right-2 top-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors disabled:opacity-50"
            title="Search by photo"
          >
            {isAnalyzing ? (
              <Loader2 className="animate-spin text-blue-600" size={18} />
            ) : (
              <Camera size={18} />
            )}
          </button>
        </form>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900">Browse Categories</h3>
          <span className="text-xs text-blue-600 font-medium cursor-pointer" onClick={() => navigate('/search')}>View All</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <div className={`p-3 rounded-full ${cat.color} bg-opacity-50`}>
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-center text-gray-700">{cat.name}</span>
            </div>
          ))}
          {/* View More Card */}
           <div 
              onClick={() => navigate('/search')}
              className="bg-gray-100 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="p-3 rounded-full bg-white">
                <ArrowRight className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-center text-gray-500">More</span>
            </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white flex justify-between items-center shadow-md">
        <div>
           <h4 className="font-bold">New: Health Rating</h4>
           <p className="text-xs text-emerald-100 mt-1">Check the 5-star rating before you buy.</p>
        </div>
        <div className="text-3xl">⭐</div>
      </div>
    </div>
  );
};

export default HomePage;