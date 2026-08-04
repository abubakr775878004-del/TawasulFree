import { useApp } from '@/stores/appStore';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

// تمت إزالة كلمة المرور الثابتة "abubakr350" التي كانت تشكل باباً خلفياً
// موازياً لنظام الإدارة الرسمي. الآن الزر يوجّه فقط لصفحة /admin
// حيث تسجيل الدخول يتم عبر Supabase Auth الحقيقي (loginAdmin في adminAuth.ts)
export const AdminLoginButton = () => {
  const { isAdmin, setIsAdmin } = useApp();

  if (isAdmin) {
    return (
      <button
        onClick={() => {
          setIsAdmin(false);
          toast.success('تم تسجيل خروج المدير');
        }}
        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-medium"
      >
        خروج من وضع المدير 🔓
      </button>
    );
  }

  return (
    <a
      href="/admin"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-medium hover:bg-sky-500/20"
    >
      <Lock size={14} />
      دخول المدير
    </a>
  );
};
