import { useNavigate } from 'react-router-dom';
import { Star, Gamepad2, Trophy, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { useApp } from '@/stores/appStore';
import { storage } from '@/lib/storage';
import { MOCK_GAMES } from '@/constants/data';
import AdBanner from '@/components/features/AdBanner';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, setShowRegModal } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowRegModal(true);
      navigate('/');
    }
  }, [user]);

  if (!user) return null;

  const sessions = storage.getSessions();
  const userSessions = sessions.filter((s) => s.userId === user.id).slice(-10).reverse();

  const joinedDate = new Date(user.joinedAt).toLocaleDateString('ar', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const STATS = [
    { icon: Star, label: 'إجمالي النقاط', value: user.points.toLocaleString(), color: 'text-brand-warning' },
    { icon: TrendingUp, label: 'نقاط هذا الأسبوع', value: user.weeklyPoints.toLocaleString(), color: 'text-brand-secondary' },
    { icon: Gamepad2, label: 'ألعاب لُعبت', value: user.gamesPlayed.toString(), color: 'text-brand-success' },
    { icon: Trophy, label: 'مسابقات فُزت', value: user.competitionsWon.toString(), color: 'text-purple-400' },
  ];

  return (
    <div className="page-enter page-container py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 min-h-[44px]"
      >
        <ArrowRight size={18} className="rtl-flip" />
        رجوع
      </button>

      {/* Profile Card */}
      <div className="glass-card p-8 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-1">{user.fullName}</h1>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Calendar size={14} />
              انضم في {joinedDate}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <Icon size={20} className={`${color} mx-auto mb-2`} />
            <div className={`font-black text-2xl ${color}`}>{value}</div>
            <div className="text-white/40 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      <AdBanner location="profile-mid" size="banner" className="mb-8" />

      {/* Recent Sessions */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4">آخر الألعاب</h2>
        {userSessions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎮</div>
            <p className="text-white/40">لم تلعب أي لعبة بعد</p>
            <button onClick={() => navigate('/games')} className="btn-primary mt-4 text-sm">
              العب الآن
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userSessions.map((session, idx) => {
              const game = MOCK_GAMES.find((g) => g.id === session.gameId);
              return (
                <div key={idx} className="flex items-center gap-4 bg-white/5 rounded-xl p-3">
                  {game && (
                    <img src={game.thumbnail} alt={game.titleAr} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">
                      {game?.titleAr || session.gameId}
                    </div>
                    <div className="text-white/40 text-xs">
                      {new Date(session.completedAt).toLocaleString('ar')}
                    </div>
                  </div>
                  <div className="points-badge flex-shrink-0">
                    <Star size={12} />
                    +{session.pointsEarned}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
