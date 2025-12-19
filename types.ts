
export interface Tasbih {
  id: string;
  title: string;
  arabicTitle?: string;
  target: number; // e.g., 33, 100, or 0 for infinite
  count: number;
  totalCount: number; // Lifetime count for this tasbih
  color?: string;
  dailyCounts: Record<string, number>; // Format: "YYYY-MM-DD": count
  isFavorite?: boolean;
}

export interface TasbihLog {
  date: string; // ISO Date string YYYY-MM-DD
  count: number;
}

/* Interface for AI-generated spiritual insights, used by geminiService */
export interface AIInsightResponse {
  meaning: string;
  benefit: string;
  source?: string | null;
}

export type ViewState = 'COUNTER' | 'LIBRARY' | 'STATS' | 'LANDING' | 'GLOBAL_STATS';

export interface AppState {
  activeTasbihId: string | null;
  view: ViewState;
  soundEnabled: boolean;
}
