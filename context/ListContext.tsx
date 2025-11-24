import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ListItem, Product, PricePoint, RetailerName } from '../types';
import { useUser } from './UserContext';

interface ListContextType {
  items: ListItem[];
  addItem: (product: Product, pricePoint: PricePoint) => void;
  removeItem: (itemId: string) => void;
  toggleItemCheck: (itemId: string) => void;
  isInList: (productId: string, retailer?: RetailerName) => boolean;
  clearList: () => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [items, setItems] = useState<ListItem[]>([]);
  
  // Track if we have loaded the list for the current user to prevent overwriting with []
  const loadedUserId = useRef<string | null>(null);

  // Determine storage key based on user
  const getStorageKey = (userId?: string) => {
    if (!userId) return 'shoppa_list_anon'; // Default for when no user is selected yet (though we force selection in profile, anon allows immediate use)
    return `shoppa_list_${userId}`;
  };

  // Load items when the user changes
  useEffect(() => {
    const userId = user?.id || 'anon';
    
    // Prevent reloading if we are already on this user (avoids flicker)
    if (loadedUserId.current === userId) return;

    const key = getStorageKey(userId);
    try {
      const saved = localStorage.getItem(key);
      setItems(saved ? JSON.parse(saved) : []);
      loadedUserId.current = userId;
    } catch (e) {
      setItems([]);
      loadedUserId.current = userId;
    }
  }, [user]);

  // Save items whenever they change, but ONLY if we have loaded the correct user first
  useEffect(() => {
    const userId = user?.id || 'anon';
    
    // Safety check: ensure we are saving to the user we actually loaded
    if (loadedUserId.current === userId) {
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = (product: Product, pricePoint: PricePoint) => {
    const id = `${product.id}_${pricePoint.retailer}`;
    
    // Check if already exists, if so, remove it (toggle behavior)
    if (items.some(i => i.id === id)) {
      removeItem(id);
      return;
    }

    const newItem: ListItem = {
      id,
      productId: product.id,
      productName: product.name,
      image: product.image,
      size: product.size,
      retailer: pricePoint.retailer,
      price: pricePoint.price,
      isChecked: false
    };

    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  const toggleItemCheck = (itemId: string) => {
    setItems(prev => prev.map(i => 
      i.id === itemId ? { ...i, isChecked: !i.isChecked } : i
    ));
  };

  const isInList = (productId: string, retailer?: RetailerName) => {
    if (retailer) {
      return items.some(i => i.productId === productId && i.retailer === retailer);
    }
    return items.some(i => i.productId === productId);
  };

  const clearList = () => setItems([]);

  return (
    <ListContext.Provider value={{ items, addItem, removeItem, toggleItemCheck, isInList, clearList }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};