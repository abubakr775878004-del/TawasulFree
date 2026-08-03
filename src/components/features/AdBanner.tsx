import { useEffect, useRef } from 'react';

interface Props {
  location?: string;
  size?: 'banner' | 'square' | 'leaderboard' | 'rectangle';
  className?: string;
}

export default function AdBanner({ className = '' }: Props) {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container) {
      container.innerHTML = '';

      const script = document.createElement('script');
      script.src = "//quarrelsomebitter.com/bFX_V/s.dtGdl/0pYPWmcz/QeRmE9wumZlUbl/k/PaTHcSyJOwDXYF2ANcj/EXtkNmzOI-4MNWjdYc2sNqQG";
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      container.appendChild(script);
    }
  }, []);

  return (
    <div className={`ad-container w-full flex justify-center items-center my-4 ${className}`}>
      <div
        ref={adContainerRef}
        className="w-[300px] h-[250px] bg-black/20 border border-white/10 rounded-2xl overflow-hidden shadow-lg flex justify-center items-center"
      >
        {/* سيتم تحميل إعلان HilltopAds تلقائياً في هذا المكان */}
      </div>
    </div>
  );
}
