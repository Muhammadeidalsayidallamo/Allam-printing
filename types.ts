export type Language = 'ar' | 'en' | 'tr' | 'fr';

export type Page = 'home' | 'blog' | 'article';

export interface MultilingualString {
  ar: string;
  en: string;
  tr: string;
  fr: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  category: GalleryCategory;
  type: string;
  title: string;
  span?: 'row' | 'col';
}

export type GalleryCategory = 'all' | 't-shirts' | 'hoodies' | 'bags' | 'uniforms' | 'process';

export interface Testimonial {
  id: number;
  quote: MultilingualString;
  author: MultilingualString;
  role: MultilingualString;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
}

export interface Quote {
    id: number;
    ar: string;
    en: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  image: string;
  category: MultilingualString;
  title: MultilingualString;
  excerpt: MultilingualString;
  content: MultilingualString;
  author: string;
  date: string; // e.g., "2023-10-26"
}

export interface Zikr {
  id: number;
  key: string;
  targetCount: number;
}

export interface Achievement {
    id: string;
    titleKey: string;
    descriptionKey: string;
    check: (progress: AzkarProgress) => boolean;
}

export interface AzkarProgress {
    counts: number[];
    totalCounts: { [key: string]: number };
    unlockedAchievements: string[];
    streak: number;
    lastVisit: string; // ISO date string
}

export type TranslationKeys = {
    [key: string]: string;
}

export type Translations = {
    [key in Language]: TranslationKeys;
}