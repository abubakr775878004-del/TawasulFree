import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from '@/types';
import { storage } from '@/lib/storage';
import { supabase } from '@/supabaseClient';
import { checkIsAdmin, logoutAdmin } from '@/lib/adminAuth';

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
  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [showRegModal, setShowRegModalState] = useState(false);

  // isAdmin الآن يُشتق من جلسة Supabase الحقيقية + جدول admins
  // وليس من قيمة موثوقة محفوظة بالمتصفح (localStorage) كما كان سابقاً
  useEffect(() => {
    checkIsAdmin().then(setIsAdminState);

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdminState(false);
      } else {
        checkIsAdmin().then(setIsAdminState);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) storage.saveUser(u);
  };

  // يُستخدم فقط لتسجيل الخروج من لوحة الأدمن (setIsAdmin(false))
  // تسجيل الدخول يتم فعلياً عبر loginAdmin() في adminAuth.ts وليس هنا
  const setIsAdmin = (v: boolean) => {
    if (!v) {
      logoutAdmin();
    }
    setIsAdminState(v);
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
