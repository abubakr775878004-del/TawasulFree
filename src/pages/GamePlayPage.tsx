import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield } from 'lucide-react';
import { MOCK_GAMES } from '@/constants/data';
import QuizGameEngine from '@/components/features/QuizGameEngine';
import { DynamicAdSlot } from '@/components/DynamicAdSlot';

export default function GamePlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const game = MOCK_GAMES.find((g) => g.id === id);

  if (!game) {
    return (
      <div className="page-container py-20 text-center">
        <div className="text-6xl mb-4">🎮</div>
        <h2 className="text-2xl font-bold text-white mb-4">اللعبة غير موجودة</h2>
        <button onClick={() => navigate('/games')} className="btn-primary">
          العودة للألعاب
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter page-container py-10">
      {/* Back */}
      <button
        onClick={() => navigate('/games')}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 min-h-[44px]"
      >
        <ArrowRight size={18} className="rtl-flip" />
        العودة للألعاب
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-white mb-2">{game.titleAr}</h1>
            <p className="text-white/50">{game.description}</p>
          </div>

          <QuizGameEngine game={game} onClose={() => navigate('/games')} />

          {/* Dynamic Ad Slot - إعلان تفاعلي أسفل اللعبة */}
          <div className="mt-8">
            <DynamicAdSlot slotId="game_page_bottom_banner" defaultSize="90×728" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Game Info */}
          <div className="glass-card p-5">
            <img
              src={game.thumbnail}
              alt={game.titleAr}
              className="w-full h-36 object-cover rounded-xl mb-4"
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">النقاط</span>
                <span className="points-badge">
                  <Star size={12} />
                  {game.pointsPerGame}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">المحاولات</span>
                <span className="text-white font-bold">{game.maxAttempts}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">إجمالي اللاعبين</span>
                <span className="text-white flex items-center gap-1">
                  <Users size={12} className="text-brand-secondary" />
                  {game.totalPlays.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Shield size={16} className="text-brand-secondary" />
              قواعد اللعبة
            </h3>
            <ul className="space-y-2 text-white/50 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand-success mt-0.5">•</span>
                أجب على كل سؤال في 15 ثانية
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-success mt-0.5">•</span>
                كل إجابة صحيحة تمنحك نقاطاً
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-success mt-0.5">•</span>
                تُضاف النقاط فوراً لرصيدك
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-warning mt-0.5">•</span>
                شاهد إعلاناً للحصول على محاولات إضافية
              </li>
            </ul>
          </div>

          {/* Dynamic Ad Slot - إعلان تفاعلي في الشريط الجانبي */}
          <DynamicAdSlot slotId="game_page_sidebar_ad" defaultSize="100×300" />
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}
