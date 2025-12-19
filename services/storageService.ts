
import { Tasbih, AppState } from '../types';
import { STORAGE_KEY, STATE_KEY, PREDEFINED_TASBIHS } from '../constants';

export const loadTasbihs = (): Tasbih[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((t: any) => ({
        ...t,
        dailyCounts: t.dailyCounts || {},
        isFavorite: t.isFavorite || false
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
      const parsed = JSON.parse(stored);
      return {
        activeTasbihId: null,
        view: 'LIBRARY',
        hapticEnabled: true,
        ...parsed
      };
    }
    return { activeTasbihId: null, view: 'LIBRARY', hapticEnabled: true };
  } catch (e) {
    return { activeTasbihId: null, view: 'LIBRARY', hapticEnabled: true };
  }
};

export const saveAppState = (state: AppState) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save app state", e);
  }
};
