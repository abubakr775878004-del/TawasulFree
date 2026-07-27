import { useState } from 'react';
import { X, User, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '@/stores/appStore';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';
import logoImg from '@/assets/logo.png';

export default function UserRegistrationModal() {
  const { setShowRegModal, setUser } = useApp();
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = fullName.trim();

    if (trimmed.split(' ').length < 2) {
      toast.error('يرجى إدخال الاسم الكامل (ثلاثة أجزاء على الأقل)');
      return;
    }

    if (trimmed.length < 6) {
      toast.error('الاسم قصير جداً');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const user = storage.createUser(trimmed);
      setUser(user);
      setShowRegModal(false);
      setSubmitting(false);
      toast.success(`مرحباً بك، ${trimmed.split(' ')[0]}! 🎉`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowRegModal(false)}
      />
      <div className="relative w-full max-w-md glass-card-dark border border-white/20 p-8 shadow-2xl animate-fade-in">
        <button
          onClick={() => setShowRegModal(false)}
          className="absolute top-4 left-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={18} className="text-white/60" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <img src={logoImg} alt="تواصل فري" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
              <div className="absolute -bottom-2 -right-2 bg-brand-success rounded-full p-1">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">انضم إلى تواصل فري</h2>
          <p className="text-white/50 text-sm">سجّل اسمك وابدأ اللعب والمنافسة مجاناً</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: '🎮', label: 'العب مجاناً' },
            { icon: '🏆', label: 'اكسب جوائز' },
            { icon: '⭐', label: 'تصدّر القائمة' },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs text-white/60">{label}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              الاسم الكامل (ثلاثي)
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-white/30"
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: محمد أحمد علي"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors text-right"
                autoFocus
                disabled={submitting}
              />
            </div>
            <p className="text-white/30 text-xs mt-1">لا تحتاج إلى بريد إلكتروني أو كلمة مرور</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !fullName.trim()}
            className="btn-primary w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trophy size={18} />
                ابدأ المغامرة!
              </>
            )}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-4">
          بالتسجيل، أنت توافق على شروط استخدام المنصة
        </p>
      </div>
    </div>
  );
}
