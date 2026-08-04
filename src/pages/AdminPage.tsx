import { useState, useEffect } from 'react';
import {
  Shield, Users, Gamepad2, Trophy, BarChart3,
  LogOut, Eye, EyeOff, Settings, Plus, Trash2, Edit3,
  TrendingUp, Star, Monitor, Bell, RefreshCw
} from 'lucide-react';
import { useApp } from '@/stores/appStore';
import { MOCK_GAMES, MOCK_COMPETITIONS, MOCK_LEADERBOARD, MOCK_ANNOUNCEMENTS, AD_NETWORKS } from '@/constants/data';
import type { Advertisement, AdType, AdLocation } from '@/types';
import { toast } from 'sonner';
import { fetchAdsFromDB, saveAdToDB, deleteAdFromDB } from '@/lib/supabaseAds';
import { loginAdmin } from '@/lib/adminAuth';
import { supabase } from '@/supabaseClient';

type AdminTab = 'dashboard' | 'users' | 'games' | 'competitions' | 'ads' | 'announcements' | 'settings';

const AD_TYPES: { id: AdType; label: string }[] = [
  { id: 'banner', label: 'بانر' },
  { id: 'video', label: 'فيديو' },
  { id: 'interstitial', label: 'بيني' },
  { id: 'rewarded', label: 'مكافأة' },
];

const AD_LOCATIONS: { id: AdLocation; label: string }[] = [
  { id: 'header', label: 'رأس الصفحة' },
  { id: 'footer', label: 'تذييل الصفحة' },
  { id: 'sidebar', label: 'الشريط الجانبي' },
  { id: 'in-game', label: 'داخل اللعبة' },
  { id: 'popup', label: 'نافذة منبثقة' },
  { id: 'between-sections', label: 'بين الأقسام' },
];

const STATS_DATA = [
  { icon: Users, label: 'إجمالي المستخدمين', value: '2,847', change: '+124 هذا الأسبوع', color: 'text-brand-secondary', bg: 'from-blue-600/20 to-blue-800/10 border-blue-600/20' },
  { icon: Gamepad2, label: 'إجمالي الألعاب', value: '18,492', change: '+892 اليوم', color: 'text-brand-warning', bg: 'from-yellow-600/20 to-yellow-800/10 border-yellow-600/20' },
  { icon: Trophy, label: 'مسابقات نشطة', value: '3', change: '89 مشارك جديد', color: 'text-brand-success', bg: 'from-green-600/20 to-green-800/10 border-green-600/20' },
  { icon: Monitor, label: 'مشاهدات الإعلانات', value: '31,240', change: '+2.1K اليوم', color: 'text-purple-400', bg: 'from-purple-600/20 to-purple-800/10 border-purple-600/20' },
];

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // تسجيل الدخول الآن عبر Supabase Auth حقيقي + تحقق من جدول admins
  // بدل مقارنة كلمة مرور ثابتة داخل كود المتصفح
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginAdmin(email, password);
    if (result.success) {
      onLogin();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card-dark border border-white/20 p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">لوحة الإدارة</h2>
          <p className="text-white/40 text-sm mt-1">تواصل فري – نظام الإدارة السحابي</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-secondary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>
              <Shield size={16} />
              دخول
            </>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdmin, setIsAdmin } = useApp();
  const [tab, setTab] = useState<AdminTab>('dashboard');
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Advertisement>>({
    type: 'banner', location: 'header', isActive: true, impressions: 0, clicks: 0,
  });
  const [realUserCount, setRealUserCount] = useState<number | null>(null);

  // عدد المستخدمين الحقيقي من قاعدة البيانات
  // (بقية أرقام STATS_DATA — الألعاب/المسابقات — تبقى تقديرية لعدم وجود
  // جداول games/competitions فعلية بعد؛ راجع التوصية المرفقة بخصوص هذا)
  useEffect(() => {
    if (isAdmin) {
      supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .then(({ count }) => setRealUserCount(count ?? 0));
    }
  }, [isAdmin]);

  // جلب الإعلانات من قاعدة البيانات عند فتح لوحة الإدارة
  useEffect(() => {
    if (isAdmin) {
      fetchAdsFromDB().then((data) => {
        if (data && data.length > 0) {
          setAds(data);
        }
      });
    }
  }, [isAdmin]);

  if (!isAdmin) return <LoginForm onLogin={() => setIsAdmin(true)} />;

  const TABS: { id: AdminTab; label: string; icon: typeof Users }[] = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'games', label: 'الألعاب', icon: Gamepad2 },
    { id: 'competitions', label: 'المسابقات', icon: Trophy },
    { id: 'ads', label: 'الإعلانات', icon: Monitor },
    { id: 'announcements', label: 'الإعلانات العامة', icon: Bell },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ];

  const toggleAd = async (id: string) => {
    const adToUpdate = ads.find(a => a.id === id);
    if (!adToUpdate) return;
    
    const updatedAd = { ...adToUpdate, isActive: !adToUpdate.isActive };
    try {
      await saveAdToDB(updatedAd);
      setAds((prev) => prev.map((a) => a.id === id ? updatedAd : a));
      toast.success('تم تحديث حالة الإعلان في السحابة');
    } catch {
      toast.error('فشل تحديث حالة الإعلان');
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await deleteAdFromDB(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
      toast.success('تم حذف الإعلان من السحابة');
    } catch {
      toast.error('فشل حذف الإعلان');
    }
  };

  const addAd = async () => {
    if (!newAd.name || !newAd.network) {
      toast.error('يرجى ملء الاسم وشبكة الإعلان');
      return;
    }
    const ad: Advertisement = {
      id: `ad_${Date.now()}`,
      name: newAd.name || '',
      network: newAd.network || '',
      type: newAd.type as AdType || 'banner',
      location: newAd.location as AdLocation || 'header',
      code: newAd.code || '',
      link: newAd.link,
      isActive: true,
      impressions: 0,
      clicks: 0,
      rewardPoints: newAd.rewardPoints,
    };

    try {
      await saveAdToDB(ad);
      setAds((prev) => [...prev, ad]);
      setNewAd({ type: 'banner', location: 'header', isActive: true, impressions: 0, clicks: 0 });
      setShowAdForm(false);
      toast.success('تم إضافة الإعلان وحفظه في السحابة بنجاح!');
    } catch {
      toast.error('فشل حفظ الإعلان في قاعدة البيانات');
    }
  };

  return (
    <div className="min-h-screen flex page-enter">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 border-l border-white/10 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">لوحة الإدارة</div>
              <div className="text-white/30 text-xs">تواصل فري</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] ${
                tab === id
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => { setIsAdmin(false); toast.info('تم تسجيل الخروج'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm min-h-[44px]"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 overflow-x-auto p-3 bg-black/30 border-b border-white/10 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 min-h-[44px] transition-colors ${
                tab === id ? 'bg-brand-primary text-white' : 'text-white/50 hover:text-white bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">لوحة التحكم الرئيسية</h2>
                <button onClick={() => toast.success('تم تحديث البيانات')} className="btn-secondary text-sm py-2 px-4">
                  <RefreshCw size={14} />
                  تحديث
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS_DATA.map(({ icon: Icon, label, value, change, color, bg }, idx) => (
                  <div key={label} className={`bg-gradient-to-br ${bg} border rounded-2xl p-5`}>
                    <Icon size={24} className={`${color} mb-3`} />
                    <div className={`font-black text-3xl ${color}`}>
                      {idx === 0 ? (realUserCount === null ? '...' : realUserCount.toLocaleString('en-US')) : value}
                    </div>
                    <div className="text-white font-medium text-sm mt-1">{label}</div>
                    <div className="text-white/40 text-xs mt-1 flex items-center gap-1">
                      <TrendingUp size={10} className="text-brand-success" />
                      {change}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 size={18} className="text-brand-secondary" />
                    نشاط المستخدمين (7 أيام)
                  </h3>
                  <div className="flex items-end gap-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-sm transition-all duration-500"
                          style={{ height: `${h}%` }}
                        />
                        <span className="text-white/30 text-xs">
                          {['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Monitor size={18} className="text-brand-secondary" />
                    إحصائيات الإعلانات
                  </h3>
                  <div className="space-y-3">
                    {ads.filter(a => a.isActive).slice(0, 4).map((ad) => (
                      <div key={ad.id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">{ad.name}</div>
                          <div className="flex gap-2 mt-0.5">
                            <span className="text-white/40 text-xs">{ad.impressions.toLocaleString()} ظهور</span>
                            <span className="text-brand-secondary text-xs">{ad.clicks} نقرة</span>
                          </div>
                        </div>
                        <div className="text-brand-success text-sm font-bold">
                          {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0'}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="font-bold text-white mb-4">أفضل 5 لاعبين</h3>
                <div className="space-y-2">
                  {MOCK_LEADERBOARD.slice(0, 5).map((entry, idx) => (
                    <div key={entry.userId} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                        {idx + 1}
                      </div>
                      <div className="flex-1 font-medium text-white text-sm">{entry.fullName}</div>
                      <div className="points-badge text-xs">
                        <Star size={10} />
                        {entry.points.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-black text-white">إدارة المستخدمين</h2>
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <span className="text-white/60 text-sm">{MOCK_LEADERBOARD.length} مستخدم مسجل</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-right text-white/50 text-xs p-4 font-medium">#</th>
                        <th className="text-right text-white/50 text-xs p-4 font-medium">الاسم</th>
                        <th className="text-right text-white/50 text-xs p-4 font-medium">النقاط</th>
                        <th className="text-right text-white/50 text-xs p-4 font-medium">الألعاب</th>
                        <th className="text-right text-white/50 text-xs p-4 font-medium">الترتيب</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_LEADERBOARD.map((user, idx) => (
                        <tr key={user.userId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-white/40 text-sm">{idx + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {user.fullName.charAt(0)}
                              </div>
                              <span className="text-white text-sm font-medium">{user.fullName}</span>
                            </div>
                          </td>
                          <td className="p-4 text-brand-warning font-bold text-sm">{user.points.toLocaleString()}</td>
                          <td className="p-4 text-white/60 text-sm">{user.gamesPlayed}</td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              idx < 3 ? 'bg-brand-warning/20 text-brand-warning' : 'bg-white/10 text-white/40'
                            }`}>
                              #{idx + 1}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Games */}
          {tab === 'games' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">إدارة الألعاب</h2>
                <button onClick={() => toast.info('قريباً: إضافة لعبة جديدة')} className="btn-primary text-sm py-2 px-4">
                  <Plus size={16} />
                  إضافة لعبة
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_GAMES.map((game) => (
                  <div key={game.id} className="glass-card p-4">
                    <img src={game.thumbnail} alt={game.titleAr} className="w-full h-28 object-cover rounded-xl mb-3" />
                    <div className="font-bold text-white text-sm mb-1">{game.titleAr}</div>
                    <div className="text-white/40 text-xs mb-3 line-clamp-1">{game.description}</div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${game.isActive ? 'bg-brand-success/20 text-brand-success' : 'bg-red-500/20 text-red-400'}`}>
                        {game.isActive ? 'نشط' : 'معطل'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => toast.info('تعديل اللعبة')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <Edit3 size={14} className="text-brand-secondary" />
                        </button>
                        <button onClick={() => toast.error('حذف اللعبة')} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitions */}
          {tab === 'competitions' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">إدارة المسابقات</h2>
                <button onClick={() => toast.info('قريباً: إضافة مسابقة جديدة')} className="btn-primary text-sm py-2 px-4">
                  <Plus size={16} />
                  مسابقة جديدة
                </button>
              </div>
              <div className="space-y-4">
                {MOCK_COMPETITIONS.map((comp) => (
                  <div key={comp.id} className="glass-card p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{comp.title}</h3>
                        <p className="text-white/50 text-sm mt-1">{comp.description}</p>
                        <div className="flex gap-4 mt-3 text-xs text-white/40">
                          <span>{comp.participants} مشارك</span>
                          <span>{comp.questions.length} سؤال</span>
                          <span className="text-brand-success">{comp.reward}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mr-4">
                        <button onClick={() => toast.info('تعديل المسابقة')} className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit3 size={16} className="text-brand-secondary" />
                        </button>
                        <button onClick={() => toast.error('حذف المسابقة')} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ads Management */}
          {tab === 'ads' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">إدارة الإعلانات (سحابي)</h2>
                <button onClick={() => setShowAdForm(!showAdForm)} className="btn-primary text-sm py-2 px-4">
                  <Plus size={16} />
                  إضافة إعلان
                </button>
              </div>

              {showAdForm && (
                <div className="glass-card p-6 animate-fade-in">
                  <h3 className="font-bold text-white text-lg mb-4">إضافة إعلان جديد</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1">اسم الإعلان *</label>
                      <input
                        type="text"
                        value={newAd.name || ''}
                        onChange={(e) => setNewAd((p) => ({ ...p, name: e.target.value }))}
                        placeholder="مثال: Google AdSense - الرئيسية"
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">شبكة الإعلان *</label>
                      <select
                        value={newAd.network || ''}
                        onChange={(e) => setNewAd((p) => ({ ...p, network: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                      >
                        <option value="" className="bg-gray-900">اختر الشبكة</option>
                        {AD_NETWORKS.map((n) => (
                          <option key={n} value={n} className="bg-gray-900">{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">نوع الإعلان</label>
                      <select
                        value={newAd.type || 'banner'}
                        onChange={(e) => setNewAd((p) => ({ ...p, type: e.target.value as AdType }))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                      >
                        {AD_TYPES.map(({ id, label }) => (
                          <option key={id} value={id} className="bg-gray-900">{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1">موقع الإعلان</label>
                      <select
                        value={newAd.location || 'header'}
                        onChange={(e) => setNewAd((p) => ({ ...p, location: e.target.value as AdLocation }))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                      >
                        {AD_LOCATIONS.map(({ id, label }) => (
                          <option key={id} value={id} className="bg-gray-900">{label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-white/60 text-xs mb-1">رابط الإعلان</label>
                      <input
                        type="url"
                        value={newAd.link || ''}
                        onChange={(e) => setNewAd((p) => ({ ...p, link: e.target.value }))}
                        placeholder="https://..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-secondary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-white/60 text-xs mb-1">كود الإعلان (اختياري)</label>
                      <textarea
                        value={newAd.code || ''}
                        onChange={(e) => setNewAd((p) => ({ ...p, code: e.target.value }))}
                        placeholder="الصق كود الإعلان هنا..."
                        rows={3}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-secondary resize-none"
                      />
                    </div>
                    {newAd.type === 'rewarded' && (
                      <div>
                        <label className="block text-white/60 text-xs mb-1">نقاط المكافأة</label>
                        <input
                          type="number"
                          value={newAd.rewardPoints || 20}
                          onChange={(e) => setNewAd((p) => ({ ...p, rewardPoints: +e.target.value }))}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={addAd} className="btn-primary text-sm py-2 px-6">
                      <Plus size={16} />
                      إضافة
                    </button>
                    <button onClick={() => setShowAdForm(false)} className="btn-secondary text-sm py-2 px-6">
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {ads.map((ad) => (
                  <div key={ad.id} className={`glass-card p-5 border ${ad.isActive ? 'border-brand-success/20' : 'border-white/10 opacity-60'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{ad.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ad.isActive ? 'bg-brand-success/20 text-brand-success' : 'bg-red-500/20 text-red-400'}`}>
                            {ad.isActive ? 'نشط' : 'معطل'}
                          </span>
                          <span className="text-xs bg-brand-primary/20 text-brand-secondary px-2 py-0.5 rounded-full">
                            {AD_TYPES.find(t => t.id === ad.type)?.label}
                          </span>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-white/40">
                          <span>الشبكة: {ad.network}</span>
                          <span>الموقع: {AD_LOCATIONS.find(l => l.id === ad.location)?.label}</span>
                          <span className="text-brand-secondary">{ad.impressions.toLocaleString()} ظهور</span>
                          <span className="text-brand-warning">{ad.clicks} نقرة</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => toggleAd(ad.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] flex items-center ${
                            ad.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-brand-success/20 text-brand-success hover:bg-brand-success/30'
                          }`}
                        >
                          {ad.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {tab === 'announcements' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white">الإعلانات العامة</h2>
                <button onClick={() => toast.info('قريباً: إضافة إعلان جديد')} className="btn-primary text-sm py-2 px-4">
                  <Plus size={16} />
                  إعلان جديد
                </button>
              </div>
              <div className="space-y-4">
                {MOCK_ANNOUNCEMENTS.map((ann) => (
                  <div key={ann.id} className="glass-card p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-white mb-1">{ann.title}</h3>
                        <p className="text-white/50 text-sm">{ann.content}</p>
                        <div className="flex gap-3 mt-2 text-xs text-white/30">
                          <span>{ann.createdAt}</span>
                          <span className={ann.isActive ? 'text-brand-success' : 'text-red-400'}>
                            {ann.isActive ? 'نشط' : 'معطل'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mr-4">
                        <button onClick={() => toast.info('تعديل الإعلان')} className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Edit3 size={14} className="text-brand-secondary" />
                        </button>
                        <button onClick={() => toast.error('حذف الإعلان')} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {tab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <h2 className="text-2xl font-black text-white">الإعدادات العامة</h2>
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-bold text-white">إعدادات المنصة</h3>
                {[
                  { label: 'اسم المنصة', val: 'تواصل فري', type: 'text' },
                  { label: 'رقم التواصل للفائزين', val: '775878004', type: 'tel' },
                  { label: 'نقاط مضاعفة (الضارب)', val: '1', type: 'number' },
                  { label: 'حد المحاولات اليومية', val: '10', type: 'number' },
                ].map(({ label, val, type }) => (
                  <div key={label}>
                    <label className="block text-white/60 text-sm mb-1">{label}</label>
                    <input
                      type={type}
                      defaultValue={val}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                    />
                  </div>
                ))}
                <button onClick={() => toast.success('تم حفظ الإعدادات')} className="btn-primary text-sm py-2 px-6">
                  حفظ الإعدادات
                </button>
              </div>

              <div className="glass-card p-6 space-y-4">
                <h3 className="font-bold text-white">إعدادات الأمان</h3>
                <div>
                  <label className="block text-white/60 text-sm mb-1">تغيير كلمة مرور الإدارة</label>
                  <input
                    type="password"
                    placeholder="كلمة المرور الجديدة"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary mb-2"
                  />
                  <input
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-secondary"
                  />
                </div>
                <button onClick={() => toast.success('تم تحديث كلمة المرور')} className="btn-secondary text-sm py-2 px-6">
                  تحديث كلمة المرور
                </button>
              </div>

              <div className="glass-card p-6 border border-red-500/20 bg-red-500/5">
                <h3 className="font-bold text-red-400 mb-2">منطقة الخطر</h3>
                <p className="text-white/40 text-sm mb-4">إجراءات لا يمكن التراجع عنها</p>
                <button onClick={() => toast.error('تم مسح جميع النقاط (محاكاة)')} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 text-sm transition-colors">
                  مسح جميع النقاط
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
