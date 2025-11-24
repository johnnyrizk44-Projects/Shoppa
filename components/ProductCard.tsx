import React from 'react';
import { Product } from '../types';
import StarRating from './StarRating';
import { getCheapestPrice } from '../services/shopService';
import { useList } from '../context/ListContext';
import { ChevronRight, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const cheapest = getCheapestPrice(product);
  const rating = product.healthStarRating || 0;
  const { addItem, isInList } = useList();

  const isAdded = isInList(product.id);

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cheapest) {
      addItem(product, cheapest);
    }
  };

  return (
    <div 
      onClick={() => onClick(product.id)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.99] transform duration-100 relative group"
    >
      <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 leading-tight mb-1 pr-8">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2">{product.brand} · {product.size}</p>
          
          <div className="flex items-center gap-2 mb-1">
            <StarRating rating={rating} size={14} />
            <span className="text-xs font-medium text-gray-600">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div>
             {cheapest ? (
               <>
                 <span className="text-xs text-gray-400 block">from</span>
                 <span className="text-lg font-bold text-green-700">${cheapest.price.toFixed(2)}</span>
                 <span className="text-[10px] text-gray-400 ml-1">@ {cheapest.retailer}</span>
               </>
             ) : (
               <span className="text-sm text-gray-400 italic">No prices</span>
             )}
          </div>
          {/* Mobile friendly chevron */}
          <div className="bg-gray-50 text-gray-400 p-1.5 rounded-full">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      {/* Quick Add Button - Absolute Top Right */}
      {cheapest && (
        <button
          onClick={handleAddToList}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all ${
            isAdded 
            ? 'bg-green-100 text-green-600 border border-green-200' 
            : 'bg-white text-gray-400 border border-gray-200 hover:text-blue-600 hover:border-blue-300'
          }`}
        >
          {isAdded ? <Check size={18} /> : <Plus size={18} />}
        </button>
      )}
    </div>
  );
};

export default ProductCard;