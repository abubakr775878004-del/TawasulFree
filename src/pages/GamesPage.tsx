import { useState } from 'react';
import { Search, Gamepad2 } from 'lucide-react';
import GameCard from '@/components/features/GameCard';
import AdBanner from '@/components/features/AdBanner';
import { MOCK_GAMES, GAME_CATEGORIES } from '@/constants/data';
import type { GameCategory } from '@/types';

export default function GamesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_GAMES.filter((g) => {
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch =
      !search ||
      g.titleAr.includes(search) ||
      g.description.includes(search);
    return matchesCategory && matchesSearch && g.isActive;
  });

  return (
    <div className="page-enter page-container py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/30 rounded-full px-4 py-2 mb-4">
          <Gamepad2 size={16} className="text-brand-secondary" />
          <span className="text-brand-secondary text-sm font-medium">منصة الألعاب</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">🎮 الألعاب</h1>
        <p className="text-white/50 max-w-xl mx-auto">
          اختر لعبتك المفضلة، العب، واكسب النقاط. كل لعبة تمنحك نقاطاً تضيفها لرصيدك الأسبوعي.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-8">
        <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن لعبة..."
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
        {GAME_CATEGORIES.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 min-h-[44px] ${
              activeCategory === id
                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-secondary/20'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Ad */}
      <AdBanner location="games-top" size="banner" className="mb-8" />

      {/* Games Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-white/40 text-lg">لا توجد ألعاب في هذا القسم حالياً</p>
        </div>
      ) : (
        <>
          <div className="text-white/40 text-sm mb-4">{filtered.length} لعبة متاحة</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      )}

      {/* Ad bottom */}
      <AdBanner location="games-bottom" size="banner" className="mt-12" />
    </div>
  );
}
