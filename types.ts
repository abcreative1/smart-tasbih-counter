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

export type ViewState = 'COUNTER' | 'LIBRARY' | 'STATS' | 'LANDING';

export interface AppState {
  activeTasbihId: string | null;
  view: ViewState;
}

export interface AIInsightResponse {
  meaning: string;
  benefit: string;
  source?: string;
}