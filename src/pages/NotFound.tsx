import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center page-container py-20 text-center">
      <div className="animate-fade-in">
        <div className="text-8xl mb-6">🎮</div>
        <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">الصفحة غير موجودة</h2>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          عد إلى الصفحة الرئيسية والاستمتع بالألعاب!
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => navigate('/')} className="btn-primary">
            <Home size={18} />
            الصفحة الرئيسية
          </button>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowRight size={18} className="rtl-flip" />
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
}
