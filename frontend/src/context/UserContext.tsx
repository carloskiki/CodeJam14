import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

interface UserContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [email, setEmail] = useState<string | null>(() => {
    return localStorage.getItem('userEmail') || null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Set up Firebase auth persistence
  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };
    setupPersistence();
  }, []);

  // Update localStorage when email changes
  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  }, [email]);

  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  // Create wrapper functions to handle both state and localStorage
  const handleSetEmail = (newEmail: string | null) => {
    setEmail(newEmail);
    if (!newEmail) {
      // Clear localStorage when logging out
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isLoggedIn');
    }
  };

  const handleSetIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
    if (!value) {
      // Clear localStorage when logging out
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isLoggedIn');
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        email, 
        setEmail: handleSetEmail, 
        isLoggedIn, 
        setIsLoggedIn: handleSetIsLoggedIn 
      }}
    >
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
