import React, { useState } from 'react';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import { ShieldCheck, Lock } from 'lucide-react';

export const AdminLoginButton = () => {
  const isAdmin = storage.getAdminAuth();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  if (isAdmin) {
    return (
      <button
        onClick={() => {
          storage.setAdminAuth(false);
          toast.success('تم تسجيل خروج المدير');
          window.location.reload();
        }}
        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium"
      >
        خروج من وضع المدير 🔓
      </button>
    );
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'abubakr350') {
      storage.setAdminAuth(true);
      toast.success('مرحباً بك يا أبو بكر، تم تفعيل صلاحيات المدير بنجاح!');
      setShowModal(false);
      window.location.reload();
    } else {
      toast.error('كلمة المرور غير صحيحة');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-medium hover:bg-sky-500/20"
      >
        <Lock size={14} />
        دخول المدير
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="card-bg max-w-sm w-full p-6 rounded-2xl border border-sky-500/30 bg-slate-900 text-right space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <ShieldCheck className="text-sky-400" />
              تسجيل دخول المشرف
            </div>
            <p className="text-gray-400 text-xs">أدخل كلمة المرور الخاصة بك للتحكم في الإعلانات والمحتوى:</p>
            
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور..."
                className="w-full p-2.5 bg-slate-800 border border-border rounded-xl text-white text-sm"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-gray-400 text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-500 text-white rounded-lg text-xs font-bold"
                >
                  دخول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
