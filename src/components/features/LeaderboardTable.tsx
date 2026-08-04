import { Star, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '@/types';

interface Props {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  compact?: boolean;
}

const RANK_STYLES = [
  'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black',
  'bg-gradient-to-br from-gray-300 to-gray-500 text-black',
  'bg-gradient-to-br from-amber-600 to-amber-800 text-white',
];

export default function LeaderboardTable({ entries, currentUserId, compact = false }: Props) {
  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        const isCurrentUser = entry.userId === currentUserId;
        const rankStyle = idx < 3 ? RANK_STYLES[idx] : 'bg-white/10 text-white/60';

        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
              isCurrentUser
                ? 'bg-brand-secondary/10 border-brand-secondary/40 shadow-lg shadow-brand-secondary/10'
                : 'glass-card hover:border-white/20'
            }`}
          >
            {/* Rank */}
            <div className={`rank-badge flex-shrink-0 font-black text-sm ${rankStyle}`}>
              {idx < 3 ? entry.badge || idx + 1 : idx + 1}
            </div>

            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              idx < 3
                ? 'bg-gradient-to-br from-brand-primary to-brand-secondary'
                : 'bg-white/10'
            }`}>
              {entry.fullName.charAt(0)}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm truncate ${isCurrentUser ? 'text-brand-secondary' : 'text-white'}`}>
                  {entry.fullName}
                  {isCurrentUser && <span className="text-xs text-brand-secondary mr-1">(أنت)</span>}
                </span>
              </div>
              {!compact && (
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-white/40 text-xs">{entry.gamesPlayed} لعبة</span>
                  <span className="text-brand-success text-xs flex items-center gap-1">
                    <TrendingUp size={10} />
                    +{entry.weeklyPoints.toLocaleString()} هذا الأسبوع
                  </span>
                </div>
              )}
            </div>

            {/* Points */}
            <div className="text-right flex-shrink-0">
              <div className={`font-black text-base flex items-center gap-1 ${
                idx < 3 ? 'text-brand-warning' : 'text-white'
              }`}>
                <Star size={14} fill="currentColor" />
                {entry.points.toLocaleString()}
              </div>
              {!compact && (
                <div className="text-white/30 text-xs">نقطة</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
