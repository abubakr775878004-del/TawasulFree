import { useState } from 'react';
import { Star, TrendingUp, Calendar } from 'lucide-react';
import LeaderboardTable from '@/components/features/LeaderboardTable';
import WinnersSection from '@/components/features/WinnersSection';
import AdBanner from '@/components/features/AdBanner';
import { MOCK_LEADERBOARD, MOCK_WEEKLY_WINNERS } from '@/constants/data';
import { useApp } from '@/stores/appStore';
import { storage } from '@/lib/storage';
import type { LeaderboardEntry } from '@/types';

export default function LeaderboardPage() {
  const [tab, setTab] = useState<'all' | 'weekly' | 'winners'>('all');
  const { user } = useApp();

  // Merge current user into leaderboard if exists
  const getEntries = (): LeaderboardEntry[] => {
    const sessions = storage.getSessions();
    const totalByUser: Record<string, number> = {};
    sessions.forEach((s) => {
      totalByUser[s.userId] = (totalByUser[s.userId] || 0) + s.pointsEarned;
    });

    let entries = [...MOCK_LEADERBOARD];

    if (user && user.points > 0) {
      const existing = entries.find((e) => e.userId === user.id);
      if (!existing) {
        entries.push({
          userId: user.id,
          fullName: user.fullName,
          points: user.points,
          rank: 0,
          weeklyPoints: user.weeklyPoints,
          gamesPlayed: user.gamesPlayed,
        });
      } else {
        entries = entries.map((e) =>
          e.userId === user.id ? { ...e, points: Math.max(e.points, user.points) } : e
        );
      }
    }

    if (tab === 'weekly') {
      return entries.sort((a, b) => b.weeklyPoints - a.weeklyPoints).map((e, i) => ({ ...e, rank: i + 1 }));
    }

    return entries.sort((a, b) => b.points - a.points).map((e, i) => ({ ...e, rank: i + 1 }));
  };

  const entries = getEntries();
  const userEntry = user ? entries.find((e) => e.userId === user.id) : null;

  return (
    <div className="page-enter page-container py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-3">⭐ قائمة المتصدرين</h1>
        <p className="text-white/50">
          تنافس مع أفضل اللاعبين واصعد للقمة. القائمة تُحدَّث تلقائياً بعد كل لعبة.
        </p>
      </div>

      {/* User position */}
      {user && userEntry && (
        <div className="bg-brand-secondary/10 border border-brand-secondary/30 rounded-2xl p-4 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-bold text-white">{user.fullName}</div>
            <div className="text-white/50 text-sm">ترتيبك الحالي في القائمة</div>
          </div>
          <div className="text-right">
            <div className="text-brand-secondary font-black text-2xl">#{userEntry.rank}</div>
            <div className="points-badge justify-end">
              <Star size={12} />
              {user.points.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <AdBanner location="leaderboard-top" size="banner" className="mb-8" />

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl border border-white/10 w-full max-w-sm">
        {[
          { id: 'all', label: 'الكل', icon: Star },
          { id: 'weekly', label: 'هذا الأسبوع', icon: TrendingUp },
          { id: 'winners', label: 'الفائزون', icon: Calendar },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
              tab === id
                ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'winners' ? (
        <WinnersSection winners={MOCK_WEEKLY_WINNERS} />
      ) : (
        <LeaderboardTable entries={entries.slice(0, 20)} currentUserId={user?.id} />
      )}

      <AdBanner location="leaderboard-bottom" size="banner" className="mt-12" />
    </div>
  );
}
