"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import SplashScreen from '@/components/splash/SplashScreen';

interface SplashContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [shouldShowSplash, setShouldShowSplash] = useState(true);

  useEffect(() => {
    // Simulate application loading
    const appLoadTime = setTimeout(() => {
      // Check if this is the first visit
      if (typeof window !== 'undefined') {
        const visited = localStorage.getItem('hasVisited');
        if (!visited) {
          localStorage.setItem('hasVisited', 'true');
          setIsFirstVisit(true);
        } else {
          setIsFirstVisit(false);
        }
      }
    }, 1000); // Delay the check

    return () => clearTimeout(appLoadTime);
  }, []);

  const handleSplashFinish = () => {
    setShouldShowSplash(false);
    setIsLoading(false);
  };

  // Show splash screen for first visit or when explicitly needed
  const showSplash = shouldShowSplash && (isFirstVisit || isLoading);

  return (
    <SplashContext.Provider value={{ isLoading, setIsLoading }}>
      {showSplash && (
        <SplashScreen 
          onFinish={handleSplashFinish}
          minDisplayTime={3500} // Increased minimum display time
        />
      )}
      <div style={{ opacity: showSplash ? 0 : 1, transition: 'opacity 0.5s ease-out' }}>
        {children}
      </div>
    </SplashContext.Provider>
  );
}

export const useSplash = () => {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}; 