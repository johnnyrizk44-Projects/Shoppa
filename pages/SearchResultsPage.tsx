import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Product } from '../types';
import { getProducts } from '../services/shopService';
import { generateProductFromQuery } from '../services/geminiService';
import ProductCard from '../components/ProductCard';
import { Filter, SlidersHorizontal, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const capturedImage = location.state?.capturedImage as string | undefined;
  
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setAiLoading(false);
      const all = await getProducts();
      let filtered = all;

      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }

      if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      // --- AI FALLBACK START ---
      // If no local products found and we have a query, ask AI to generate one
      if (filtered.length === 0 && query) {
         setLoading(false);
         setAiLoading(true);
         try {
            const aiProduct = await generateProductFromQuery(query);
            if (aiProduct) {
                // If the user came from the camera search, use that image instead of the placeholder
                if (capturedImage) {
                    aiProduct.image = capturedImage;
                }
                
                // Save to session storage so ProductDetailsPage can find it
                sessionStorage.setItem(`ai_product_${aiProduct.id}`, JSON.stringify(aiProduct));
                setProducts([aiProduct]);
            } else {
                setProducts([]);
            }
         } catch (e) {
            console.error(e);
            setProducts([]);
         }
         setAiLoading(false);
         return; 
      }
      // --- AI FALLBACK END ---

      if (minRating > 0) {
        filtered = filtered.filter(p => (p.healthStarRating || 0) >= minRating);
      }

      setProducts(filtered);
      setLoading(false);
    };

    fetch();
  }, [query, categoryFilter, minRating]); // capturedImage is stable from location state

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-start gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-gray-600 mt-1">
            <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 leading-snug line-clamp-2 pr-2">
                {categoryFilter || (query ? `"${query}"` : 'All Products')}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
                {aiLoading ? 'Searching external database...' : `${products.length} results`}
            </p>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg mt-1 flex-shrink-0 ${showFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
        >
            <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Filters Drawer (Inline for MVP) */}
      {showFilters && (
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200 animate-in slide-in-from-top-2 duration-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Health Rating</h3>
            <div className="flex gap-2">
                {[0, 3, 4, 5].map((stars) => (
                    <button
                        key={stars}
                        onClick={() => setMinRating(stars)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                            minRating === stars 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white text-gray-600 border-gray-200'
                        }`}
                    >
                        {stars === 0 ? 'Any' : `${stars}+ Stars`}
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* Product List */}
      <div className="flex-1 p-4 space-y-3">
        {loading ? (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
        ) : aiLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-center space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <div>
                    <h3 className="font-medium text-gray-900">Checking external database...</h3>
                    <p className="text-sm mt-1">We're retrieving details for "{query}"</p>
                </div>
            </div>
        ) : products.length > 0 ? (
            <>
                {products[0].id.startsWith('ai_') && (
                    <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start gap-3 mb-4">
                        <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-sm text-indigo-900 font-medium">Found via AI Search</p>
                            <p className="text-xs text-indigo-700 mt-0.5">
                                This product wasn't in our local list, so we retrieved live details and estimated prices for you.
                            </p>
                        </div>
                    </div>
                )}
                
                {products.map(p => (
                    <ProductCard 
                        key={p.id} 
                        product={p} 
                        onClick={(id) => navigate(`/product/${id}`)}
                    />
                ))}
            </>
        ) : (
            <div className="text-center py-10 text-gray-500">
                <p>No products found.</p>
                <button 
                    onClick={() => { setMinRating(0); navigate('/search'); }} 
                    className="mt-4 text-blue-600 font-medium text-sm"
                >
                    Clear filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;