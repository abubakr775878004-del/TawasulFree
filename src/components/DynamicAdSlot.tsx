import React, { useState } from 'react';
import { storage } from '@/lib/storage';
import { useApp } from '@/stores/appStore';
import { toast } from 'sonner';

interface AdSlotProps {
  slotId: string;
  defaultSize: string;
}

export const DynamicAdSlot: React.FC<AdSlotProps> = ({ slotId, defaultSize }) => {
  // isAdmin الآن من الجلسة الحقيقية (useApp) وليس من قيمة localStorage غير موثوقة
  const { isAdmin } = useApp();
  const adStats = storage.getAdStats();
  const currentAd = adStats[slotId];

  const [isEditing, setIsEditing] = useState(false);
  const [adTitle, setAdTitle] = useState(currentAd?.name || '');
  const [adLink, setAdLink] = useState(currentAd?.url || '');

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adLink) {
      toast.error('يرجى إدخال اسم الإعلان ورابط التوجيه');
      return;
    }

    const stats = storage.getAdStats();
    stats[slotId] = { name: adTitle, url: adLink, impressions: stats[slotId]?.impressions || 0, clicks: stats[slotId]?.clicks || 0 };
    localStorage.setItem('tawasul_ad_stats', JSON.stringify(stats));

    toast.success('تم تحديث وتثبيت الإعلان في هذه المساحة بنجاح!');
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <div className="relative my-4 p-4 card-bg rounded-2xl border border-dashed border-sky-500/30 text-center">
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-800 text-gray-400 text-xs rounded-md">
        إعلان ({defaultSize})
      </div>

      {currentAd && currentAd.url && !isEditing ? (
        <div className="py-2">
          <a
            href={currentAd.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => storage.trackAdClick(slotId)}
            className="block text-sky-400 font-bold hover:underline text-lg"
          >
            {currentAd.name || 'زيارة الإعلان الترويجي'}
          </a>
          <p className="text-xs text-gray-500 mt-1">اضغط للانتقال إلى الموقع الإعلاني</p>
        </div>
      ) : (
        <div className="py-3">
          <p className="text-gray-400 text-sm">مساحة إعلانية {defaultSize}</p>
          <p className="text-gray-600 text-xs mt-0.5">أضف كود الإعلان أو الرابط من لوحة الإدارة</p>
        </div>
      )}

      {isAdmin && (
        <div className="mt-3 pt-3 border-t border-border/50 flex justify-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 text-xs font-medium rounded-lg transition-all"
          >
            {isEditing ? 'إلغاء' : '⚙️ تعديل هذا الإعلان'}
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSaveAd} className="mt-3 pt-3 border-t border-border space-y-2 text-right" dir="rtl">
          <input
            type="text"
            value={adTitle}
            onChange={(e) => setAdTitle(e.target.value)}
            placeholder="اسم الشركة أو الإعلان (مثال: شبكة الإنترنت السريع)"
            className="w-full p-2 bg-slate-800 border border-border rounded-lg text-white text-sm"
          />
          <input
            type="url"
            value={adLink}
            onChange={(e) => setAdLink(e.target.value)}
            placeholder="رابط الموقع (https://...)"
            className="w-full p-2 bg-slate-800 border border-border rounded-lg text-white text-sm"
          />
          <button type="submit" className="w-full py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-lg">
            حفظ ونشر الإعلان فوراً
          </button>
        </form>
      )}
    </div>
  );
};
