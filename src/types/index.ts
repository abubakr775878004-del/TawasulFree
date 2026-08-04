export interface User {
  id: string;
  fullName: string;
  points: number;
  gamesPlayed: number;
  competitionsWon: number;
  rank: number;
  joinedAt: string;
  weeklyPoints: number;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Game {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  category: GameCategory;
  thumbnail: string;
  pointsPerGame: number;
  maxAttempts: number;
  isActive: boolean;
  totalPlays: number;
  difficulty: 'easy' | 'medium' | 'hard';
  hasRewardedAd: boolean;
  questions?: QuizQuestion[];
}

export type GameCategory =
  | 'puzzle'
  | 'memory'
  | 'quiz'
  | 'logic'
  | 'speed'
  | 'educational'
  | 'reaction';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reward: string;
  rewardPoints: number;
  participants: number;
  questions: QuizQuestion[];
  isActive: boolean;
  winnerId?: string;
  category: string;
}

export interface LeaderboardEntry {
  userId: string;
  fullName: string;
  points: number;
  rank: number;
  weeklyPoints: number;
  gamesPlayed: number;
  badge?: string;
}

export interface WeeklyWinner {
  id: string;
  userId: string;
  fullName: string;
  points: number;
  weekStart: string;
  weekEnd: string;
  reward: string;
  photoUrl?: string;
}

export interface Advertisement {
  id: string;
  name: string;
  network: string;
  type: AdType;
  location: AdLocation;
  code: string;
  link?: string;
  isActive: boolean;
  impressions: number;
  clicks: number;
  rewardPoints?: number;
  showFrequency?: number;
}

export type AdType = 'banner' | 'video' | 'interstitial' | 'rewarded';
export type AdLocation =
  | 'header'
  | 'footer'
  | 'sidebar'
  | 'in-game'
  | 'popup'
  | 'between-sections';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  isActive: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalGamesPlayed: number;
  totalCompetitions: number;
  adImpressions: number;
  adClicks: number;
  totalPoints: number;
  newUsersThisWeek: number;
}

export interface GameSession {
  gameId: string;
  userId: string;
  score: number;
  completedAt: string;
  pointsEarned: number;
}
