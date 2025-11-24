import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getProductById, getHealthLabel } from '../services/shopService';
import { getHealthExplanation } from '../services/geminiService';
import { useList } from '../context/ListContext';
import StarRating from '../components/StarRating';
import { ArrowLeft, MapPin, Sparkles, Info, PlusCircle, CheckCircle2 } from 'lucide-react';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { addItem, isInList } = useList();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        setLoading(true);
        const p = await getProductById(id);
        setProduct(p);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAskAI = async () => {
    if (!product) return;
    setAiLoading(true);
    const explanation = await getHealthExplanation(product);
    setAiExplanation(explanation);
    setAiLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading details...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  const rating = product.healthStarRating || 0;
  const healthLabel = getHealthLabel(rating);

  return (
    <div className="bg-white min-h-full pb-10">
      {/* Navbar */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-700 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </button>
        <span className="font-semibold text-sm truncate max-w-[200px]">{product.brand}</span>
        <div className="w-8" />
      </div>

      {/* Hero Image */}
      <div className="w-full h-64 bg-white flex items-center justify-center p-6 border-b border-gray-100">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>

      {/* Basic Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
           <div>
             <h2 className="text-lg font-medium text-gray-500">{product.brand}</h2>
             <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
           </div>
           <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">{product.size}</span>
        </div>
        <p className="text-gray-600 mt-2 text-sm leading-relaxed">{product.description || "No description available."}</p>
      </div>

      <hr className="border-gray-100" />

      {/* Health Section */}
      <div className="p-5 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            Health Rating
            <Info size={14} className="text-gray-400" />
          </h3>
          <span className={`text-xs font-bold px-2 py-1 rounded border ${rating >= 3.5 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
            {healthLabel}
          </span>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-4">
              <span className="text-4xl font-extrabold text-gray-900">{rating.toFixed(1)}</span>
              <StarRating rating={rating} size={16} />
           </div>
           
           {/* Mini Nutrition Table */}
           <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 text-sm">
             <div>
                <span className="text-gray-500 text-xs block">Sugar</span>
                <span className={`font-medium ${product.nutrition.sugarg > 20 ? 'text-red-600' : 'text-gray-900'}`}>{product.nutrition.sugarg}g</span>
             </div>
             <div>
                <span className="text-gray-500 text-xs block">Fat</span>
                <span className="font-medium text-gray-900">{product.nutrition.saturatedFatg}g</span>
             </div>
             <div>
                <span className="text-gray-500 text-xs block">Sodium</span>
                <span className="font-medium text-gray-900">{product.nutrition.sodiummg}mg</span>
             </div>
             <div>
                <span className="text-gray-500 text-xs block">Protein</span>
                <span className="font-medium text-gray-900">{product.nutrition.proteing}g</span>
             </div>
           </div>
        </div>

        {/* Gemini AI Insight */}
        <div className="mt-4">
          {!aiExplanation ? (
            <button 
              onClick={handleAskAI}
              disabled={aiLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              {aiLoading ? (
                 <span className="animate-pulse">Analyzing Nutrition...</span>
              ) : (
                <>
                  <Sparkles size={18} />
                  Ask AI: Why this rating?
                </>
              )}
            </button>
          ) : (
             <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold text-sm">
                   <Sparkles size={14} />
                   AI Health Insight
                </div>
                <p className="text-purple-900 text-sm leading-relaxed">{aiExplanation}</p>
             </div>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Retailer Comparison */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Compare Prices</h3>
        <p className="text-xs text-gray-500 mb-4">Tap the tick button to add specific retailer offers to your list.</p>
        <div className="space-y-3">
           {product.prices.sort((a,b) => a.price - b.price).map((p, idx) => {
             const added = isInList(product.id, p.retailer);
             return (
              <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg shadow-sm transition-colors ${added ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{p.retailer}</span>
                    <div className="flex items-center text-xs text-gray-500 gap-1 mt-0.5">
                      <MapPin size={10} />
                      <span>{p.storeDistanceKm} km away</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</div>
                      <div className="text-[10px] text-gray-400">{p.unitPriceStr}</div>
                    </div>
                    
                    <button 
                      onClick={() => addItem(product, p)}
                      className={`p-2 rounded-full transition-colors ${added ? 'text-green-600 bg-green-100 hover:bg-green-200' : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-blue-600'}`}
                    >
                      {added ? <CheckCircle2 size={24} className="fill-green-100" /> : <PlusCircle size={24} />}
                    </button>
                  </div>
              </div>
             );
           })}
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
           Prices updated recently. Availability may vary by store location.
        </p>
      </div>
    </div>
  );
};

export default ProductDetailsPage;