'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface CityContextType {
  userName: string;
  setUserName: (name: string) => void;
  selectedCityId: string | null;
  setSelectedCityId: (cityId: string | null) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatNewsContext: string | null;
  openChatWithNews: (newsTitle: string, newsSummary: string, newsUrl: string) => void;
  clearChatNewsContext: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatNewsContext, setChatNewsContext] = useState<string | null>(null);

  const openChatWithNews = useCallback((newsTitle: string, newsSummary: string, newsUrl: string) => {
    setChatNewsContext(`Regarding this news: "${newsTitle}" — ${newsSummary}\nSource: ${newsUrl}`);
    setChatOpen(true);
  }, []);

  const clearChatNewsContext = useCallback(() => {
    setChatNewsContext(null);
  }, []);

  return (
    <CityContext.Provider
      value={{
        userName,
        setUserName,
        selectedCityId,
        setSelectedCityId,
        chatOpen,
        setChatOpen,
        chatNewsContext,
        openChatWithNews,
        clearChatNewsContext,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}
