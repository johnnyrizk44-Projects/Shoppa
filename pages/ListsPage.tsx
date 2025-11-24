import React from 'react';
import { useList } from '../context/ListContext';
import { RetailerName } from '../types';
import { Trash2, CheckSquare, Square, Store, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListsPage: React.FC = () => {
  const { items, removeItem, toggleItemCheck, clearList } = useList();
  const navigate = useNavigate();

  // Group items by retailer
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.retailer]) {
      acc[item.retailer] = [];
    }
    acc[item.retailer].push(item);
    return acc;
  }, {} as Record<RetailerName, typeof items>);

  const retailers = Object.keys(groupedItems) as RetailerName[];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your list is empty</h2>
        <p className="text-gray-500">Search for products or scan items to add them to your shopping lists.</p>
        <button 
          onClick={() => navigate('/search')}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-md active:scale-95 transition-transform"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-gray-50 min-h-full">
      <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
        <button onClick={clearList} className="text-xs text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50">
          Clear All
        </button>
      </div>

      <div className="p-4 space-y-6">
        {retailers.map(retailer => {
          const retailerItems = groupedItems[retailer];
          const total = retailerItems.reduce((sum, i) => sum + i.price, 0);
          
          // Retailer specific colors
          const getRetailerColor = (r: string) => {
            if (r === RetailerName.COLES) return 'bg-red-600';
            if (r === RetailerName.WOOLWORTHS) return 'bg-green-600';
            if (r === RetailerName.ALDI) return 'bg-blue-800';
            if (r === RetailerName.IGA) return 'bg-red-700';
            return 'bg-blue-500';
          };

          return (
            <div key={retailer} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Retailer Header */}
              <div className={`${getRetailerColor(retailer)} px-4 py-3 text-white flex justify-between items-center`}>
                <div className="flex items-center gap-2">
                  <Store size={18} />
                  <span className="font-bold text-lg">{retailer}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${total.toFixed(2)}</div>
                  <div className="text-[10px] opacity-80">{retailerItems.length} items</div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {retailerItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center p-3 gap-3 ${item.isChecked ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <button 
                      onClick={() => toggleItemCheck(item.id)}
                      className={`flex-shrink-0 ${item.isChecked ? 'text-gray-400' : 'text-gray-300'}`}
                    >
                      {item.isChecked ? <CheckSquare size={22} /> : <Square size={22} />}
                    </button>
                    
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img src={item.image} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0" onClick={() => navigate(`/product/${item.productId}`)}>
                      <p className={`text-sm font-medium truncate ${item.isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-bold text-sm ${item.isChecked ? 'text-gray-400' : 'text-gray-900'}`}>
                        ${item.price.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 p-1 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListsPage;