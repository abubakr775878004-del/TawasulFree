import { Link } from 'react-router-dom';
import { Trophy, Gamepad2, Star, Users, ChevronLeft, Wifi, Zap } from 'lucide-react';
import { useApp } from '@/stores/appStore';
import GameCard from '@/components/features/GameCard';
import CompetitionCard from '@/components/features/CompetitionCard';
import LeaderboardTable from '@/components/features/LeaderboardTable';
import WinnersSection from '@/components/features/WinnersSection';
import AnnouncementBanner from '@/components/features/AnnouncementBanner';
import { DynamicAdSlot } from '@/components/DynamicAdSlot';
import { AdminLoginButton } from '@/components/AdminLoginButton';
import { MOCK_GAMES, MOCK_COMPETITIONS, MOCK_LEADERBOARD, MOCK_WEEKLY_WINNERS, MOCK_ANNOUNCEMENTS } from '@/constants/data';
import heroBanner from '@/assets/hero-banner.jpg';

const STATS = [
  { icon: Users, label: 'مستخدم نشط', value: '2,400+', color: 'text-brand-secondary' },
  { icon: Gamepad2, label: 'لعبة متاحة', value: '12+', color: 'text-brand-warning' },
  { icon: Trophy, label: 'مسابقة أسبوعية', value: '3', color: 'text-brand-success' },
  { icon: Star, label: 'نقطة موزعة', value: '48K+', color: 'text-purple-400' },
];

export default function HomePage() {
  const { user, setShowRegModal } = useApp();

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="تواصل فري"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 via-brand-dark/50 to-brand-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/10" />
        </div>

        {/* Animated dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-brand-secondary rounded-full opacity-40 animate-pulse"
              style={{
                top: `${15 + i * 14}%`,
                right: `${10 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative page-container py-20">
          {/* زر دخول المدير يظهر في أعلى الصفحة للتحكم الفوري */}
          <div className="mb-6 flex justify-end">
            <AdminLoginButton />
          </div>

          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-secondary/20 border border-brand-secondary/40 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Wifi size={16} className="text-brand-secondary" />
              <span className="text-brand-secondary text-sm font-medium">وصول مجاني عبر شبكة الواي فاي</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              الترفيه{' '}
              <span className="gradient-text text-glow">المجاني</span>
              <br />
              في متناول يدك
            </h1>

            <p className="text-white/70 text-lg md:text-xl mb-8 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              العب، نافس، واكسب النقاط والجوائز الحقيقية — مجاناً تماماً بدون إنترنت أو رصيد!
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {user ? (
                <Link to="/games" className="btn-primary text-lg px-8 py-4">
                  <Gamepad2 size={20} />
                  العب الآن
                </Link>
              ) : (
                <button onClick={() => setShowRegModal(true)} className="btn-primary text-lg px-8 py-4">
                  <Zap size={20} />
                  ابدأ مجاناً
                </button>
              )}
              <Link to="/leaderboard" className="btn-secondary text-lg px-8 py-4">
                <Trophy size={20} />
                المتصدرون
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-black/30 border-y border-white/10">
        <div className="page-container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`${color} font-black text-3xl`}>{value}</div>
                <div className="text-white/50 text-sm mt-1 flex items-center justify-center gap-1">
                  <Icon size={14} className={color} />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="page-container mt-10">
        <AnnouncementBanner announcements={MOCK_ANNOUNCEMENTS} />
      </section>

      {/* Dynamic Ad Banner - العلوي (قابل للتعديل من لوحة المدير) */}
      <section className="page-container mt-8">
        <DynamicAdSlot slotId="home_top_banner" defaultSize="90×728" />
      </section>

      {/* Featured Games */}
      <section className="page-container mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">🎮 الألعاب المميزة</h2>
            <p className="section-subtitle">العب واكسب النقاط الآن</p>
          </div>
          <Link to="/games" className="btn-secondary text-sm py-2 px-4">
            كل الألعاب
            <ChevronLeft size={16} className="rtl-flip" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_GAMES.slice(0, 6).map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Dynamic Middle Ad - الأوسط (قابل للتعديل من لوحة المدير) */}
      <section className="page-container mt-12">
        <DynamicAdSlot slotId="home_middle_square" defaultSize="250×300" />
      </section>

      {/* Competitions + Leaderboard */}
      <section className="page-container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Competitions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">🏆 المسابقات النشطة</h2>
                <p className="section-subtitle">شارك وفز بجوائز حقيقية</p>
              </div>
              <Link to="/competitions" className="btn-secondary text-sm py-2 px-4">
                كل المسابقات
                <ChevronLeft size={16} className="rtl-flip" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {MOCK_COMPETITIONS.slice(0, 2).map((comp) => (
                <CompetitionCard key={comp.id} competition={comp} />
              ))}
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="section-title">⭐ المتصدرون</h2>
                <p className="section-subtitle">أفضل اللاعبين</p>
              </div>
              <Link to="/leaderboard" className="btn-secondary text-sm py-2 px-4">
                الكل
              </Link>
            </div>
            <LeaderboardTable
              entries={MOCK_LEADERBOARD.slice(0, 5)}
              currentUserId={user?.id}
              compact
            />
          </div>
        </div>
      </section>

      {/* Weekly Winners */}
      <section className="page-container mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">👑 أبطال الأسبوع</h2>
            <p className="section-subtitle">الفائزون بالجوائز الأسبوعية</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <WinnersSection winners={MOCK_WEEKLY_WINNERS} />
        </div>
      </section>

      {/* Dynamic Bottom Ad - السفلي (قابل للتعديل من لوحة المدير) */}
      <section className="page-container mt-12 mb-8">
        <DynamicAdSlot slotId="home_bottom_banner" defaultSize="90×728" />
      </section>
    </div>
  );
}
