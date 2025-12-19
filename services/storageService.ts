
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
      // Migrate hapticEnabled to soundEnabled if it exists
      const soundSetting = parsed.soundEnabled ?? parsed.hapticEnabled ?? true;
      
      return {
        activeTasbihId: null,
        view: 'LIBRARY',
        soundEnabled: soundSetting,
        ...parsed
      };
    }
    return { activeTasbihId: null, view: 'LIBRARY', soundEnabled: true };
  } catch (e) {
    return { activeTasbihId: null, view: 'LIBRARY', soundEnabled: true };
  }
};

export const saveAppState = (state: AppState) => {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save app state", e);
  }
};
