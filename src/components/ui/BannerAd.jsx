import React, { useEffect, useRef } from 'react';

export const BannerAd = () => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (adContainerRef.current) {
      adContainerRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.src = "//quarrelsomebitter.com/b-X.V/s/dyGilJ0rY/WHco/zecml9SuDZ-URlBk/PdTrcJyGOWDzUt2VMjDeUItWN/zgIv4FNgTSYawrOiQL";
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';

      adContainerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center my-6 min-h-[250px] w-full">
      <div 
        ref={adContainerRef} 
        className="w-[300px] h-[250px] bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg flex justify-center items-center"
      >
        {/* سيتم تحميل البنر هنا */}
      </div>
    </div>
  );
};

export default BannerAd;
