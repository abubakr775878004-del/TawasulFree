import type { User, GameSession } from '@/types';

const KEYS = {
  USER: 'tawasul_user',
  LEADERBOARD: 'tawasul_leaderboard_overrides',
  SESSIONS: 'tawasul_sessions',
  AD_STATS: 'tawasul_ad_stats',
};

export const storage = {
  getUser(): User | null {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  saveUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem(KEYS.USER);
  },

  addPoints(amount: number): User | null {
    const user = this.getUser();
    if (!user) return null;
    user.points += amount;
    user.weeklyPoints += amount;
    this.saveUser(user);
    return user;
  },

  incrementGames(): void {
    const user = this.getUser();
    if (!user) return;
    user.gamesPlayed += 1;
    this.saveUser(user);
  },

  saveSession(session: GameSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions.slice(-50)));
  },

  getSessions(): GameSession[] {
    const raw = localStorage.getItem(KEYS.SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as GameSession[];
    } catch {
      return [];
    }
  },

  trackAdImpression(adId: string): void {
    const stats = this.getAdStats();
    stats[adId] = stats[adId] || { impressions: 0, clicks: 0 };
    stats[adId].impressions += 1;
    localStorage.setItem(KEYS.AD_STATS, JSON.stringify(stats));
  },

  trackAdClick(adId: string): void {
    const stats = this.getAdStats();
    stats[adId] = stats[adId] || { impressions: 0, clicks: 0 };
    stats[adId].clicks += 1;
    localStorage.setItem(KEYS.AD_STATS, JSON.stringify(stats));
  },

  getAdStats(): Record<string, { impressions: number; clicks: number }> {
    const raw = localStorage.getItem(KEYS.AD_STATS);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },
};
