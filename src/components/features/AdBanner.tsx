import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Advertisement } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Props {
  location: string;
  size?: 'banner' | 'square' | 'leaderboard' | 'rectangle';
  className?: string;
}

const SIZE_CONFIG = {
  banner: { label: 'إعلان 728×90' },
  square: { label: 'إعلان 300×250' },
  leaderboard: { label: 'إعلان 970×90' },
  rectangle: { label: 'إعلان 300×100' },
};

export default function AdBanner({ location, size = 'banner', className = '' }: Props) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.banner;
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

  // حقن كود HilltopAds تلقائياً في حال عدم وجود إعلان في قاعدة البيانات
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
    <div className={`ad-container w-full flex justify-center my-3 ${className}`}>
      <div
        className="ad-slot w-full max-w-4xl h-[90px] max-h-[100px] cursor-pointer overflow-hidden relative flex justify-center items-center bg-slate-900/40 border border-slate-700/50 rounded-xl shadow-sm"
        onClick={ad ? handleAdClick : undefined}
        title={ad?.name || 'إعلان'}
      >
        {ad?.code ? (
          <div dangerouslySetInnerHTML={{ __html: ad.code }} className="w-full h-full flex justify-center items-center" />
        ) : (
          <div ref={adContainerRef} className="w-full h-full flex justify-center items-center scale-90 sm:scale-100">
            {/* إعلان نحيف أفقياً من اليمين إلى اليسار بارتفاع محدود */}
          </div>
        )}
      </div>
    </div>
  );
}
