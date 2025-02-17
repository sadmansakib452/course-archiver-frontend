"use client";
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'remembered_credentials';

interface RememberedCredentials {
  email: string;
  timestamp: number;
}

export const useRememberCredentials = () => {
  const [remembered, setRemembered] = useState<RememberedCredentials | null>(null);

  useEffect(() => {
    // Load remembered credentials on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as RememberedCredentials;
      // Check if credentials are not expired (30 days)
      if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
        setRemembered(data);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const rememberCredentials = (email: string) => {
    const data: RememberedCredentials = {
      email,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setRemembered(data);
  };

  const forgetCredentials = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRemembered(null);
  };

  return {
    remembered,
    rememberCredentials,
    forgetCredentials
  };
}; 