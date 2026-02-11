import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BookmarkedToken = {
  name: string;
  symbol: string;
  chain: string;
  price: number;
  priceChange24h: number;
  url: string;
  addedAt: string;
};

export type BookmarkedWallet = {
  address: string;
  label: string;
  chain: string;
  totalProfit: number;
  totalROI: number;
  addedAt: string;
};

export type AlertPreference = {
  type: 'price' | 'volume' | 'wallet' | 'news';
  tokenSymbol?: string;
  walletAddress?: string;
  condition: 'above' | 'below' | 'contains';
  value: number | string;
  enabled: boolean;
};

export type UserPreferences = {
  theme: 'dark' | 'light';
  defaultChain: 'solana' | 'base' | 'ethereum' | 'all';
  refreshInterval: number; // in minutes
  notifications: boolean;
};

interface UserContextType {
  // Bookmarks
  bookmarkedTokens: BookmarkedToken[];
  bookmarkedWallets: BookmarkedWallet[];
  addTokenBookmark: (token: Omit<BookmarkedToken, 'addedAt'>) => void;
  removeTokenBookmark: (symbol: string) => void;
  addWalletBookmark: (wallet: Omit<BookmarkedWallet, 'addedAt'>) => void;
  removeWalletBookmark: (address: string) => void;
  isTokenBookmarked: (symbol: string) => boolean;
  isWalletBookmarked: (address: string) => boolean;
  
  // Alerts
  alerts: AlertPreference[];
  addAlert: (alert: AlertPreference) => void;
  removeAlert: (index: number) => void;
  toggleAlert: (index: number) => void;
  
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  
  // Stats
  stats: {
    totalBookmarks: number;
    totalAlerts: number;
    lastUpdated: string;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  defaultChain: 'solana',
  refreshInterval: 2,
  notifications: true,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [bookmarkedTokens, setBookmarkedTokens] = useState<BookmarkedToken[]>([]);
  const [bookmarkedWallets, setBookmarkedWallets] = useState<BookmarkedWallet[]>([]);
  const [alerts, setAlerts] = useState<AlertPreference[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const savedTokens = localStorage.getItem('iseeiape_bookmarked_tokens');
      const savedWallets = localStorage.getItem('iseeiape_bookmarked_wallets');
      const savedAlerts = localStorage.getItem('iseeiape_alerts');
      const savedPrefs = localStorage.getItem('iseeiape_preferences');
      
      if (savedTokens) {
        setBookmarkedTokens(JSON.parse(savedTokens));
      }
      
      if (savedWallets) {
        setBookmarkedWallets(JSON.parse(savedWallets));
      }
      
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
      
      if (savedPrefs) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(savedPrefs) });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('iseeiape_bookmarked_tokens', JSON.stringify(bookmarkedTokens));
      localStorage.setItem('iseeiape_bookmarked_wallets', JSON.stringify(bookmarkedWallets));
      localStorage.setItem('iseeiape_alerts', JSON.stringify(alerts));
      localStorage.setItem('iseeiape_preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [bookmarkedTokens, bookmarkedWallets, alerts, preferences, isInitialized]);

  // Bookmark functions
  const addTokenBookmark = (token: Omit<BookmarkedToken, 'addedAt'>) => {
    const newBookmark: BookmarkedToken = {
      ...token,
      addedAt: new Date().toISOString(),
    };
    setBookmarkedTokens(prev => [...prev, newBookmark]);
  };

  const removeTokenBookmark = (symbol: string) => {
    setBookmarkedTokens(prev => prev.filter(t => t.symbol !== symbol));
  };

  const addWalletBookmark = (wallet: Omit<BookmarkedWallet, 'addedAt'>) => {
    const newBookmark: BookmarkedWallet = {
      ...wallet,
      addedAt: new Date().toISOString(),
    };
    setBookmarkedWallets(prev => [...prev, newBookmark]);
  };

  const removeWalletBookmark = (address: string) => {
    setBookmarkedWallets(prev => prev.filter(w => w.address !== address));
  };

  const isTokenBookmarked = (symbol: string) => {
    return bookmarkedTokens.some(t => t.symbol === symbol);
  };

  const isWalletBookmarked = (address: string) => {
    return bookmarkedWallets.some(w => w.address === address);
  };

  // Alert functions
  const addAlert = (alert: AlertPreference) => {
    setAlerts(prev => [...prev, alert]);
  };

  const removeAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAlert = (index: number) => {
    setAlerts(prev => prev.map((alert, i) => 
      i === index ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };

  // Preference functions
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  // Stats
  const stats = {
    totalBookmarks: bookmarkedTokens.length + bookmarkedWallets.length,
    totalAlerts: alerts.filter(a => a.enabled).length,
    lastUpdated: new Date().toLocaleTimeString(),
  };

  const value: UserContextType = {
    bookmarkedTokens,
    bookmarkedWallets,
    addTokenBookmark,
    removeTokenBookmark,
    addWalletBookmark,
    removeWalletBookmark,
    isTokenBookmarked,
    isWalletBookmarked,
    alerts,
    addAlert,
    removeAlert,
    toggleAlert,
    preferences,
    updatePreferences,
    stats,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}