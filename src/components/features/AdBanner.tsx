import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Advertisement } from '@/types';

interface Props {
  location: string;
  size?: 'banner' | 'square' | 'leaderboard' | 'rectangle';
  className?: string;
}

const SIZE_CONFIG = {
  banner: { h: 'h-20', label: 'إعلان 728×90' },
  square: { h: 'h-48 sm:h-64', label: 'إعلان 300×250' },
  leaderboard: { h: 'h-16', label: 'إعلان 970×90' },
  rectangle: { h: 'h-32', label: 'إعلان 300×100' },
};

export default function AdBanner({ location, size = 'banner', className = '' }: Props) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const cfg = SIZE_CONFIG[size];

  // جلب الإعلان المناسب لهذا الموقع من قاعدة البيانات سوبابيس
  useEffect(() => {
    async function fetchAd() {
      try {
        const { data, error } = await supabase
          .from('advertisements')
          .select('*')
          .eq('location', location)
          .eq('isActive', true)
          .limit(1)
          .single();

        if (!error && data) {
          setAd(data);
          
          // تحديث عداد الظهور (Impressions) في السحابة بالطريقة الصحيحة
          await supabase
            .from('advertisements')
            .update({ impressions: (data.impressions || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error('Error fetching ad:', err);
      }
    }

    fetchAd();
  }, [location]);

  // دالة لتسجيل النقرات (Clicks) وتوجيه المستخدم
  const handleAdClick = async () => {
    if (ad) {
      try {
        // تحديث عداد النقرات في السحابة
        await supabase
          .from('advertisements')
          .update({ clicks: (ad.clicks || 0) + 1 })
          .eq('id', ad.id);
      } catch (err) {
        console.error('Error updating click:', err);
      }

      if (ad.link) {
        window.open(ad.link, '_blank');
      }
    }
  };

  return (
    <div className={`ad-container w-full ${className}`}>
      <div
        className={`ad-slot w-full ${cfg.h} cursor-pointer hover:border-white/20 transition-colors overflow-hidden relative flex items-center justify-center bg-black/20 border border-white/10 rounded-2xl`}
        onClick={handleAdClick}
        title={ad?.name || 'إعلان'}
      >
        {ad?.code ? (
          <div dangerouslySetInnerHTML={{ __html: ad.code }} className="w-full h-full flex items-center justify-center" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
            <div className="text-white/40 text-xs font-medium">{ad?.name || cfg.label}</div>
            <div className="text-white/20 text-xs">{ad ? (ad.network || 'إعلان سحابي') : 'أضف كود الإعلان من لوحة الإدارة'}</div>
          </div>
        )}
      </div>
    </div>
  );
}
