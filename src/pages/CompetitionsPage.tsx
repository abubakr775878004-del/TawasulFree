import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Users, Star, Clock } from 'lucide-react';
import CompetitionCard from '@/components/features/CompetitionCard';
import QuizGameEngine from '@/components/features/QuizGameEngine';
import AdBanner from '@/components/features/AdBanner';
import { MOCK_COMPETITIONS } from '@/constants/data';
import { useApp } from '@/stores/appStore';
import type { Game } from '@/types';

function CompetitionDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const { user, setShowRegModal } = useApp();
  const [started, setStarted] = useState(false);
  const comp = MOCK_COMPETITIONS.find((c) => c.id === id);

  if (!comp) return <div className="text-center py-20 text-white">المسابقة غير موجودة</div>;

  const fakeGame: Game = {
    id: comp.id,
    title: comp.title,
    titleAr: comp.title,
    description: comp.description,
    category: 'quiz',
    thumbnail: '',
    pointsPerGame: comp.rewardPoints,
    maxAttempts: 1,
    isActive: true,
    totalPlays: comp.participants,
    difficulty: 'medium',
    hasRewardedAd: false,
    questions: comp.questions,
  };

  return (
    <div className="page-container py-10">
      <button
        onClick={() => navigate('/competitions')}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 min-h-[44px]"
      >
        <ArrowRight size={18} className="rtl-flip" />
        كل المسابقات
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
              <Trophy size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{comp.title}</h1>
              <span className="text-brand-secondary text-sm">{comp.category}</span>
            </div>
          </div>
          <p className="text-white/60 mb-4">{comp.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Star size={16} className="text-brand-warning mx-auto mb-1" />
              <div className="font-bold text-white">{comp.rewardPoints}</div>
              <div className="text-white/40 text-xs">نقطة</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Users size={16} className="text-brand-secondary mx-auto mb-1" />
              <div className="font-bold text-white">{comp.participants}</div>
              <div className="text-white/40 text-xs">مشارك</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 text-center">
              <Clock size={16} className="text-brand-warning mx-auto mb-1" />
              <div className="font-bold text-white">{comp.questions.length}</div>
              <div className="text-white/40 text-xs">سؤال</div>
            </div>
          </div>

          <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl p-4">
            <div className="text-brand-success font-bold text-sm mb-1">الجائزة</div>
            <div className="text-white font-bold">{comp.reward}</div>
          </div>
        </div>

        {!started ? (
          <button
            onClick={() => user ? setStarted(true) : setShowRegModal(true)}
            className="btn-primary w-full text-lg py-4"
          >
            <Trophy size={20} />
            شارك في المسابقة
          </button>
        ) : (
          <QuizGameEngine game={fakeGame} onClose={() => navigate('/competitions')} />
        )}
      </div>
    </div>
  );
}

export default function CompetitionsPage() {
  const { id } = useParams<{ id?: string }>();

  if (id) return <CompetitionDetail id={id} />;

  return (
    <div className="page-enter page-container py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-brand-primary/20 border border-brand-primary/30 rounded-full px-4 py-2 mb-4">
          <Trophy size={16} className="text-brand-secondary" />
          <span className="text-brand-secondary text-sm font-medium">منافسات أسبوعية</span>
        </div>
        <h1 className="text-4xl font-black text-white mb-3">🏆 المسابقات</h1>
        <p className="text-white/50 max-w-xl mx-auto">
          شارك في مسابقاتنا الأسبوعية وفز بجوائز حقيقية. كل مسابقة تمنحك نقاطاً ضخمة وفرصة للتصدر!
        </p>
      </div>

      <AdBanner location="competitions-top" size="banner" className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_COMPETITIONS.map((comp) => (
          <CompetitionCard key={comp.id} competition={comp} />
        ))}
      </div>

      <AdBanner location="competitions-bottom" size="banner" className="mt-12" />
    </div>
  );
}
