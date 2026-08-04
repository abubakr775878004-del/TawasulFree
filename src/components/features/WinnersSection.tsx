import { Trophy, Phone, Star } from 'lucide-react';
import type { WeeklyWinner } from '@/types';
import { CONTACT_NUMBER } from '@/constants/data';

interface Props {
  winners: WeeklyWinner[];
  compact?: boolean;
}

function formatWeek(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString('ar', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('ar', { month: 'short', day: 'numeric' })}`;
}

export default function WinnersSection({ winners, compact = false }: Props) {
  const [latest, ...prev] = winners;

  return (
    <div className="space-y-4">
      {/* Latest winner - featured */}
      {latest && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border border-yellow-500/30 p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-2 mb-4">
            <Trophy size={20} className="text-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">بطل الأسبوع</span>
            <span className="text-white/30 text-xs mr-auto">{formatWeek(latest.weekStart, latest.weekEnd)}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={latest.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(latest.fullName)}&background=1E40AF&color=fff&size=80`}
                alt={latest.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-yellow-400/50"
              />
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-black font-bold text-xs">
                👑
              </div>
            </div>
            <div className="flex-1">
              <div className="font-black text-white text-xl mb-1">{latest.fullName}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="points-badge">
                  <Star size={12} fill="currentColor" />
                  {latest.points.toLocaleString()} نقطة
                </span>
                <span className="text-brand-success text-sm font-bold">{latest.reward}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-black/20 rounded-xl p-3 flex items-center gap-2">
            <Phone size={14} className="text-brand-secondary flex-shrink-0" />
            <p className="text-white/70 text-xs">
              سيتم التواصل مع الفائز على الرقم الرسمي للمنصة للحصول على جائزته:{' '}
              <a href={`tel:${CONTACT_NUMBER}`} className="text-brand-secondary font-bold">
                {CONTACT_NUMBER}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Previous winners */}
      {!compact && prev.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white/60 text-sm font-medium">فائزون سابقون</h4>
          {prev.map((winner) => (
            <div key={winner.id} className="glass-card p-4 flex items-center gap-3">
              <img
                src={winner.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(winner.fullName)}&background=1F2937&color=9CA3AF&size=48`}
                alt={winner.fullName}
                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate">{winner.fullName}</div>
                <div className="text-white/40 text-xs">{formatWeek(winner.weekStart, winner.weekEnd)}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-brand-warning font-bold text-sm">{winner.points.toLocaleString()}</div>
                <div className="text-white/30 text-xs">نقطة</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
