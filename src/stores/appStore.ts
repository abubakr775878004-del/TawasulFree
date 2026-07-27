import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from '@/types';
import { storage } from '@/lib/storage';

interface AppState {
  user: User | null;
  isAdmin: boolean;
  showRegModal: boolean;
  setUser: (u: User | null) => void;
  setIsAdmin: (v: boolean) => void;
  setShowRegModal: (v: boolean) => void;
  logout: () => void;
  refreshUser: () => void;
}

import { createContext as cc } from 'react';

export const AppContext = cc<AppState>({
  user: null,
  isAdmin: false,
  showRegModal: false,
  setUser: () => {},
  setIsAdmin: () => {},
  setShowRegModal: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export function useAppStore(): AppState {
  const [user, setUserState] = useState<User | null>(() => storage.getUser());
  const [isAdmin, setIsAdminState] = useState<boolean>(() => storage.getAdminAuth());
  const [showRegModal, setShowRegModalState] = useState(false);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) storage.saveUser(u);
  };

  const setIsAdmin = (v: boolean) => {
    setIsAdminState(v);
    storage.setAdminAuth(v);
  };

  const setShowRegModal = (v: boolean) => setShowRegModalState(v);

  const logout = () => {
    setUserState(null);
    storage.clearUser();
  };

  const refreshUser = () => {
    setUserState(storage.getUser());
  };

  return { user, isAdmin, showRegModal, setUser, setIsAdmin, setShowRegModal, logout, refreshUser };
}

export const useApp = () => useContext(AppContext);
