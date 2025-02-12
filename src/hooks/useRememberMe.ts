"use client";
import { useState, useEffect } from 'react';

export const useRememberMe = (key: string) => {
  const [remembered, setRemembered] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const remember = (data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    setRemembered(data);
  };

  const forget = () => {
    localStorage.removeItem(key);
    setRemembered(null);
  };

  return {
    remembered,
    remember,
    forget
  };
}; 