import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  user: UserProfile | null;
  login: (email: string) => boolean;
  signup: (name: string, email: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check for active session on load
    const saved = localStorage.getItem('shoppa_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('shoppa_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shoppa_current_user');
    }
  }, [user]);

  const login = (email: string): boolean => {
    // Mock login: check against a stored array of users in localStorage
    const usersStr = localStorage.getItem('shoppa_users_db');
    const users: UserProfile[] = usersStr ? JSON.parse(usersStr) : [];
    
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (name: string, email: string) => {
    const newUser: UserProfile = {
      id: `u_${Date.now()}`,
      name,
      email,
      isGuest: false,
      joinedDate: new Date().toLocaleDateString(),
      memberTier: 'Free'
    };

    // Save to "DB"
    const usersStr = localStorage.getItem('shoppa_users_db');
    const users: UserProfile[] = usersStr ? JSON.parse(usersStr) : [];
    
    // Simple check if exists
    if (!users.some(u => u.email === email)) {
       users.push(newUser);
       localStorage.setItem('shoppa_users_db', JSON.stringify(users));
    }

    // Auto login
    setUser(newUser);
  };

  const continueAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest_user',
      name: 'Guest',
      email: '',
      isGuest: true,
      joinedDate: new Date().toLocaleDateString(),
      memberTier: 'Free'
    };
    setUser(guestUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout, continueAsGuest }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};