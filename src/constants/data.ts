import type { Game, Competition, WeeklyWinner, Advertisement, Announcement, LeaderboardEntry } from '@/types';

export const ADMIN_PASSWORD = 'tawasul2024';
export const CONTACT_NUMBER = '775878004';
export const SITE_NAME = 'تواصل فري';

// الألعاب والمسابقات تظل جاهزة ويمكن لاحقاً ربطها بقاعدة البيانات
export const MOCK_GAMES: Game[] = [
  {
    id: 'g1',
    title: 'Quiz Challenge',
    titleAr: 'تحدي الأسئلة',
    description: 'اختبر معلوماتك العامة وأجب على أسئلة متنوعة',
    category: 'quiz',
    thumbnail: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=250&fit=crop',
    pointsPerGame: 50,
    maxAttempts: 3,
    isActive: true,
    totalPlays: 1247,
    difficulty: 'medium',
    hasRewardedAd: true,
    questions: [
      { id: 'q1', question: 'ما هي عاصمة المملكة العربية السعودية؟', options: ['جدة', 'الرياض', 'مكة المكرمة', 'الدمام'], correctIndex: 1, points: 10 },
      { id: 'q2', question: 'كم عدد أيام الأسبوع؟', options: ['5', '6', '7', '8'], correctIndex: 2, points: 10 },
      { id: 'q3', question: 'ما هو أكبر كوكب في المجموعة الشمسية؟', options: ['الأرض', 'المريخ', 'المشتري', 'زحل'], correctIndex: 2, points: 10 },
      { id: 'q4', question: 'ما هي اللغة الأكثر انتشاراً في العالم؟', options: ['الإنجليزية', 'الصينية', 'العربية', 'الإسبانية'], correctIndex: 1, points: 10 },
      { id: 'q5', question: 'كم تبلغ درجة غليان الماء؟', options: ['80°C', '90°C', '100°C', '110°C'], correctIndex: 2, points: 10 },
    ],
  },
  {
    id: 'g2',
    title: 'Memory Match',
    titleAr: 'لعبة الذاكرة',
    description: 'طابق البطاقات المتشابهة وقوّ ذاكرتك',
    category: 'memory',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop',
    pointsPerGame: 40,
    maxAttempts: 5,
    isActive: true,
    totalPlays: 893,
    difficulty: 'easy',
    hasRewardedAd: false,
  },
  {
    id: 'g3',
    title: 'Speed Math',
    titleAr: 'الرياضيات السريعة',
    description: 'أجب على عمليات الحساب بأسرع وقت ممكن',
    category: 'speed',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=250&fit=crop',
    pointsPerGame: 60,
    maxAttempts: 3,
    isActive: true,
    totalPlays: 654,
    difficulty: 'hard',
    hasRewardedAd: true,
    questions: [
      { id: 'sq1', question: '15 + 27 = ?', options: ['40', '42', '43', '44'], correctIndex: 1, points: 12 },
      { id: 'sq2', question: '8 × 7 = ?', options: ['54', '56', '58', '60'], correctIndex: 1, points: 12 },
      { id: 'sq3', question: '100 ÷ 4 = ?', options: ['20', '25', '30', '35'], correctIndex: 1, points: 12 },
      { id: 'sq4', question: '63 - 38 = ?', options: ['23', '24', '25', '26'], correctIndex: 2, points: 12 },
      { id: 'sq5', question: '9² = ?', options: ['72', '81', '90', '99'], correctIndex: 1, points: 12 },
    ],
  },
  {
    id: 'g4',
    title: 'Word Puzzle',
    titleAr: 'ألغاز الكلمات',
    description: 'اعثر على الكلمات المخفية في الشبكة',
    category: 'puzzle',
    thumbnail: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=250&fit=crop',
    pointsPerGame: 35,
    maxAttempts: 5,
    isActive: true,
    totalPlays: 421,
    difficulty: 'easy',
    hasRewardedAd: false,
  },
  {
    id: 'g5',
    title: 'Reaction Master',
    titleAr: 'سيد ردود الفعل',
    description: 'اضغط في الوقت المناسب واختبر سرعة ردود أفعالك',
    category: 'reaction',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
    pointsPerGame: 45,
    maxAttempts: 3,
    isActive: true,
    totalPlays: 1089,
    difficulty: 'medium',
    hasRewardedAd: true,
  },
  {
    id: 'g6',
    title: 'Geography Quiz',
    titleAr: 'مسابقة الجغرافيا',
    description: 'تعرف على دول وعواصم العالم',
    category: 'educational',
    thumbnail: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=400&h=250&fit=crop',
    pointsPerGame: 55,
    maxAttempts: 3,
    isActive: true,
    totalPlays: 312,
    difficulty: 'medium',
    hasRewardedAd: false,
    questions: [
      { id: 'gq1', question: 'ما هي عاصمة فرنسا؟', options: ['برلين', 'مدريد', 'باريس', 'روما'], correctIndex: 2, points: 11 },
      { id: 'gq2', question: 'أطول نهر في العالم؟', options: ['الأمازون', 'النيل', 'المسيسبي', 'الفولغا'], correctIndex: 1, points: 11 },
      { id: 'gq3', question: 'أكبر قارة في العالم؟', options: ['أفريقيا', 'أمريكا الشمالية', 'آسيا', 'أوروبا'], correctIndex: 2, points: 11 },
      { id: 'gq4', question: 'ما هي عاصمة اليابان؟', options: ['طوكيو', 'أوساكا', 'كيوتو', 'هيروشيما'], correctIndex: 0, points: 11 },
      { id: 'gq5', question: 'أصغر دولة في العالم؟', options: ['موناكو', 'سان مارينو', 'الفاتيكان', 'ليختنشتاين'], correctIndex: 2, points: 11 },
    ],
  },
];

export const MOCK_COMPETITIONS: Competition[] = [
  {
    id: 'c1',
    title: 'بطولة المعرفة الأسبوعية',
    description: 'تحدٍّ أسبوعي شامل في مختلف المجالات. الفائز الأول يحصل على جائزة نقدية!',
    startDate: '2026-07-21',
    endDate: '2026-07-28',
    reward: '50,000 ريال + شهادة تقدير',
    rewardPoints: 500,
    participants: 89,
    isActive: true,
    category: 'معرفة عامة',
    questions: [
      { id: 'cq1', question: 'من هو أول رئيس وزراء في اليمن؟', options: ['أحمد محمد نعمان', 'عبدالله السلال', 'محمد محمود الزبيري', 'قحطان الشعبي'], correctIndex: 0, points: 20 },
      { id: 'cq2', question: 'متى تأسست جامعة صنعاء؟', options: ['1970', '1972', '1975', '1980'], correctIndex: 1, points: 20 },
      { id: 'cq3', question: 'ما هي عاصمة اليمن؟', options: ['عدن', 'تعز', 'صنعاء', 'الحديدة'], correctIndex: 2, points: 20 },
    ],
  },
  {
    id: 'c2',
    title: 'تحدي الرياضيات',
    description: 'اختبر مهاراتك في الرياضيات وحل المسائل الذكية',
    startDate: '2026-07-22',
    endDate: '2026-07-29',
    reward: '30,000 ريال',
    rewardPoints: 300,
    participants: 45,
    isActive: true,
    category: 'رياضيات',
    questions: [
      { id: 'mq1', question: '√144 = ?', options: ['10', '11', '12', '13'], correctIndex: 2, points: 25 },
      { id: 'mq2', question: '2^8 = ?', options: ['128', '256', '512', '64'], correctIndex: 1, points: 25 },
      { id: 'mq3', question: 'مساحة مربع طول ضلعه 9 = ?', options: ['18', '36', '72', '81'], correctIndex: 3, points: 25 },
    ],
  },
  {
    id: 'c3',
    title: 'مسابقة الثقافة الإسلامية',
    description: 'تعمق في المعرفة الإسلامية واربح الجوائز القيمة',
    startDate: '2026-07-20',
    endDate: '2026-07-27',
    reward: '40,000 ريال',
    rewardPoints: 400,
    participants: 134,
    isActive: true,
    category: 'ثقافة إسلامية',
    questions: [
      { id: 'iq1', question: 'كم عدد أركان الإسلام؟', options: ['3', '4', '5', '6'], correctIndex: 2, points: 20 },
      { id: 'iq2', question: 'كم سورة في القرآن الكريم؟', options: ['112', '113', '114', '115'], correctIndex: 2, points: 20 },
      { id: 'iq3', question: 'في أي شهر أُنزل القرآن الكريم؟', options: ['رجب', 'شعبان', 'رمضان', 'محرم'], correctIndex: 2, points: 20 },
    ],
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'u1', fullName: 'محمد أحمد علي', points: 4850, rank: 1, weeklyPoints: 1200, gamesPlayed: 87, badge: '👑' },
  { userId: 'u2', fullName: 'سارة محمد الحسن', points: 4320, rank: 2, weeklyPoints: 980, gamesPlayed: 72, badge: '🥈' },
  { userId: 'u3', fullName: 'عبدالله عمر الغالب', points: 3980, rank: 3, weeklyPoints: 850, gamesPlayed: 65, badge: '🥉' },
  { userId: 'u4', fullName: 'فاطمة حسن النجيم', points: 3650, rank: 4, weeklyPoints: 720, gamesPlayed: 58, badge: '⭐' },
  { userId: 'u5', fullName: 'خالد يوسف الأمين', points: 3200, rank: 5, weeklyPoints: 640, gamesPlayed: 51, badge: '⭐' },
];

export const MOCK_WEEKLY_WINNERS: WeeklyWinner[] = [
  {
    id: 'w1',
    userId: 'u1',
    fullName: 'محمد أحمد علي',
    points: 4850,
    weekStart: '2026-07-14',
    weekEnd: '2026-07-20',
    reward: '50,000 ريال',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
];

// الإعلانات الافتراضية كاحتياط في حال عدم الاتصال بقاعدة البيانات
export const MOCK_ADS: Advertisement[] = [
  {
    id: 'ad1',
    name: 'Google AdSense - رأس الصفحة',
    network: 'Google AdSense',
    type: 'banner',
    location: 'header',
    code: '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX"></ins>',
    isActive: true,
    impressions: 12450,
    clicks: 234,
  },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: '🎉 مسابقة الأسبوع متاحة الآن!',
    content: 'شارك في بطولة المعرفة الأسبوعية واربح جوائز قيمة.',
    type: 'success',
    isActive: true,
    createdAt: '2026-07-26',
  },
];

export const GAME_CATEGORIES = [
  { id: 'all', label: 'الكل', icon: '🎮' },
  { id: 'quiz', label: 'أسئلة', icon: '❓' },
  { id: 'memory', label: 'ذاكرة', icon: '🧠' },
  { id: 'speed', label: 'سرعة', icon: '⚡' },
  { id: 'puzzle', label: 'ألغاز', icon: '🧩' },
  { id: 'reaction', label: 'ردود فعل', icon: '🎯' },
  { id: 'educational', label: 'تعليمي', icon: '📚' },
  { id: 'logic', label: 'منطق', icon: '💡' },
];

export const AD_NETWORKS = [
  'Google AdSense',
  'Adsterra',
  'Monetag',
  'PropellerAds',
  'Media.net',
  'Ezoic',
  'AdMaven',
  'PopAds',
  'أخرى',
];
