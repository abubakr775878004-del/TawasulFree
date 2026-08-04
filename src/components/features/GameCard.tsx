import { Link } from 'react-router-dom';
import { Play, Star, Zap, Users } from 'lucide-react';
import type { Game } from '@/types';

interface Props {
  game: Game;
  featured?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  puzzle: 'ألغاز',
  memory: 'ذاكرة',
  quiz: 'أسئلة',
  logic: 'منطق',
  speed: 'سرعة',
  educational: 'تعليمي',
  reaction: 'ردود فعل',
};

const DIFFICULTY_CONFIG = {
  easy: { label: 'سهل', color: 'text-brand-success bg-brand-success/20 border-brand-success/30' },
  medium: { label: 'متوسط', color: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30' },
  hard: { label: 'صعب', color: 'text-red-400 bg-red-400/20 border-red-400/30' },
};

export default function GameCard({ game, featured = false }: Props) {
  const diff = DIFFICULTY_CONFIG[game.difficulty];

  return (
    <div
      className={`group glass-card overflow-hidden hover:border-brand-secondary/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-secondary/10 hover:-translate-y-1 ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-44">
        <img
          src={game.thumbnail}
          alt={game.titleAr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-brand-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
            {CATEGORY_LABELS[game.category]}
          </span>
        </div>

        {/* Rewarded ad badge */}
        {game.hasRewardedAd && (
          <div className="absolute top-3 left-3">
            <span className="bg-brand-success/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-medium">
              <Zap size={10} />
              مكافأة
            </span>
          </div>
        )}

        {/* Points badge */}
        <div className="absolute bottom-3 left-3">
          <span className="points-badge text-xs">
            <Star size={10} />
            {game.pointsPerGame} نقطة
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-white text-base leading-tight">{game.titleAr}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 mr-2 ${diff.color}`}>
            {diff.label}
          </span>
        </div>

        <p className="text-white/50 text-sm mb-4 line-clamp-2">{game.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/40 text-xs">
            <Users size={12} />
            {game.totalPlays.toLocaleString()} لعبة
          </div>

          <Link
            to={`/games/${game.id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-bold px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-brand-secondary/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Play size={14} fill="white" />
            العب الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
