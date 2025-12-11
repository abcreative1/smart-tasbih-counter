import { Tasbih, AppState } from '../types';
import { STORAGE_KEY, STATE_KEY, PREDEFINED_TASBIHS } from '../constants';

export const loadTasbihs = (): Tasbih[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration: Ensure all tasbihs have dailyCounts if loaded from old state
      return parsed.map((t: any) => ({
        ...t,
        dailyCounts: t.dailyCounts || {}
      }));
    }
    return PREDEFINED_TASBIHS;
  } catch (e) {
    console.error("Failed to load tasbihs", e);
    return PREDEFINED_TASBIHS;
  }
};

export const saveTasbihs = (tasbihs: Tasbih[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasbihs));
  } catch (e) {
    console.error("Failed to save tasbihs", e);
  }
};

export const loadAppState = (): AppState => {
  try {
    const stored = localStorage.getItem(STATE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { activeTasbihId: null, view: 'LIBRARY' };
  } catch (e) {
    return { activeTasbihId: null, view: 'LIBRARY' };
  }
};

export const saveAppState = (state: AppState) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save app state", e);
  }
};
