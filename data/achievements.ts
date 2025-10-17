import type { Achievement, AzkarProgress } from '../types';
import { azkar as zikrList } from './azkar';

export const achievements: Achievement[] = [
    {
        id: 'first_step',
        titleKey: 'achFirstStepTitle',
        descriptionKey: 'achFirstStepDesc',
        check: (progress: AzkarProgress) => (Object.values(progress.totalCounts).reduce((a, b) => a + b, 0) >= 1)
    },
    {
        id: 'tasbih_100',
        titleKey: 'achTasbih100Title',
        descriptionKey: 'achTasbih100Desc',
        check: (progress: AzkarProgress) => (progress.totalCounts['subhanAllah'] || 0) >= 100
    },
    {
        id: 'total_1000',
        titleKey: 'achTotal1000Title',
        descriptionKey: 'achTotal1000Desc',
        check: (progress: AzkarProgress) => (Object.values(progress.totalCounts).reduce((a, b) => a + b, 0) >= 1000)
    },
    {
        id: 'streak_3',
        titleKey: 'achStreak3Title',
        descriptionKey: 'achStreak3Desc',
        check: (progress: AzkarProgress) => progress.streak >= 3
    },
    {
        id: 'streak_7',
        titleKey: 'achStreak7Title',
        descriptionKey: 'achStreak7Desc',
        check: (progress: AzkarProgress) => progress.streak >= 7
    },
    {
        id: 'perfectionist',
        titleKey: 'achPerfectionistTitle',
        descriptionKey: 'achPerfectionistDesc',
        // Correctly checks if the count for each zikr has met its specific target count.
        check: (progress: AzkarProgress) => zikrList.every((zikr, index) => (progress.counts[index] || 0) >= zikr.targetCount)
    },
];