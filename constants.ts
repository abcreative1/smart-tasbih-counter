import { Tasbih } from './types';

export const PREDEFINED_TASBIHS: Tasbih[] = [
  {
    id: 'default-1',
    title: 'SubhanAllah',
    arabicTitle: 'سُبْحَانَ ٱللَّٰهِ',
    target: 33,
    count: 0,
    totalCount: 0,
    color: 'emerald',
    dailyCounts: {}
  },
  {
    id: 'default-2',
    title: 'Alhamdulillah',
    arabicTitle: 'ٱلْحَمْدُ لِلَّٰهِ',
    target: 33,
    count: 0,
    totalCount: 0,
    color: 'emerald',
    dailyCounts: {}
  },
  {
    id: 'default-3',
    title: 'Allahu Akbar',
    arabicTitle: 'ٱللَّٰهُ أَكْبَرُ',
    target: 33,
    count: 0,
    totalCount: 0,
    color: 'emerald',
    dailyCounts: {}
  },
  {
    id: 'default-4',
    title: 'Astaghfirullah',
    arabicTitle: 'أَسْتَغْفِرُ ٱللَّٰهَ',
    target: 100,
    count: 0,
    totalCount: 0,
    color: 'gold',
    dailyCounts: {}
  },
  {
    id: 'default-5',
    title: 'La ilaha illallah',
    arabicTitle: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
    target: 100,
    count: 0,
    totalCount: 0,
    color: 'gold',
    dailyCounts: {}
  }
];

export const STORAGE_KEY = 'soulcount_data_v1';
export const STATE_KEY = 'soulcount_state_v1';
