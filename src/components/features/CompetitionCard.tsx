import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, Star, ChevronLeft } from 'lucide-react';
import type { Competition } from '@/types';

interface Props {
  competition: Competition;
}

function daysLeft(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function CompetitionCard({ competition }: Props) {
  const days = daysLeft(competition.endDate);

  return (
    <div className="glass-card p-5 hover:border-brand-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-secondary/10 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center flex-shrink-0">
          <Trophy size={22} className="text-white" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              days <= 1
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : days <= 3
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-brand-success/20 text-brand-success border border-brand-success/30'
            }`}
          >
            {days === 0 ? 'ينتهي اليوم!' : days === 1 ? 'ينتهي غداً' : `${days} أيام متبقية`}
          </span>
          <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
            {competition.category}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-white text-lg mb-2">{competition.title}</h3>
      <p className="text-white/50 text-sm mb-4 line-clamp-2">{competition.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-brand-secondary text-lg font-bold">
            <Star size={14} />
            {competition.rewardPoints}
          </div>
          <div className="text-white/40 text-xs">نقاط</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-white font-bold text-sm">
            <Users size={12} />
            {competition.participants}
          </div>
          <div className="text-white/40 text-xs">مشارك</div>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-brand-warning font-bold text-xs">
            <Clock size={12} />
            {days}
          </div>
          <div className="text-white/40 text-xs">أيام</div>
        </div>
      </div>

      {/* Reward */}
      <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-brand-success flex-shrink-0" />
          <span className="text-brand-success text-sm font-bold">{competition.reward}</span>
        </div>
      </div>

      <Link
        to={`/competitions/${competition.id}`}
        className="btn-primary w-full text-sm"
      >
        شارك الآن
        <ChevronLeft size={16} className="rtl-flip" />
      </Link>
    </div>
  );
}
