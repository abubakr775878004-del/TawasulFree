import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Advertisement } from '@/types';

// استبدل هذه القيم ببيانات مشروعك الفعلية في سوبابيس إذا لزم الأمر
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

export default function AdBanner({ location, size = 'square', className = '' }: Props) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.square;
  const adContainerRef = useRef<HTMLDivElement>(null);

  // جلب الإعلان من Supabase إن وجد
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

  // حقن كود HilltopAds تلقائياً في حال لم يكن هناك إعلان مخصص من قاعدة البيانات، أو كإعلان افتراضي
  useEffect(() => {
    const container = adContainerRef.current;
    if (container && (!ad || !ad.code)) {
      container.innerHTML = '';

      const script = document.createElement('script');
      script.src = "//quarrelsomebitter.com/bFX_V/s.dtGdl/0pYPWmcz/QeRmE9wumZlUbl/k/PaTHcSyJOwDXYF2ANcj/EXtkNmzOI-4MNWjdYc2sNqQG";
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      container.appendChild(script);
    }
  }, [ad]);

  const handleAdClick = async () => {
    if (ad) {
      try {
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
        onClick={ad ? handleAdClick : undefined}
        title={ad?.name || 'إعلان'}
      >
        {ad?.code ? (
          <div dangerouslySetInnerHTML={{ __html: ad.code }} className="w-full h-full flex items-center justify-center" />
        ) : (
          <div ref={adContainerRef} className="w-full h-full flex items-center justify-center">
            {/* سيتم تحميل إعلان HilltopAds هنا تلقائياً */}
          </div>
        )}
      </div>
    </div>
  );
}
