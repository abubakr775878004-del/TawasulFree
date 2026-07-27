import { useEffect } from 'react';
import { storage } from '@/lib/storage';

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
  const adId = `ad_${location}_${size}`;
  const cfg = SIZE_CONFIG[size];

  useEffect(() => {
    storage.trackAdImpression(adId);
  }, [adId]);

  return (
    <div className={`ad-container w-full ${className}`}>
      <div
        className={`ad-slot w-full ${cfg.h} cursor-pointer hover:border-white/20 transition-colors`}
        onClick={() => storage.trackAdClick(adId)}
        title="إعلان"
      >
        {/* Placeholder ad content */}
        <div className="flex flex-col items-center justify-center gap-1 w-full h-full">
          <div className="text-white/20 text-xs font-medium">{cfg.label}</div>
          <div className="text-white/10 text-xs">أضف كود الإعلان من لوحة الإدارة</div>
        </div>
      </div>
    </div>
  );
}
