import React, { useState, useEffect, createContext, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { translations } from './data/translations';
import type { Language, Page, Translations, BlogPost, GalleryImage } from './types';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import FloatingWhatsapp from './components/FloatingWhatsapp';
import ScrollToTop from './components/ScrollToTop';
import FloatingSpiritualButtons from './components/FloatingSpiritualButtons';
import Loader from './components/Loader';


// Lazy-loaded main page sections for performance
const PrintRecommender = lazy(() => import('./components/PrintRecommender'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const OurProcess = lazy(() => import('./components/OurProcess'));
const DesignVisualizer = lazy(() => import('./components/DesignVisualizer'));
const Gallery = lazy(() => import('./components/Gallery'));
const Quotes = lazy(() => import('./components/Quotes'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const BlogPreview = lazy(() => import('./components/BlogPreview'));
const Partners = lazy(() => import('./components/Partners'));
const QuoteForm = lazy(() => import('./components/QuoteForm'));
const FAQ = lazy(() => import('./components/FAQ'));
const ZakatCalculator = lazy(() => import('./components/ZakatCalculator'));
const SalaryCalculator = lazy(() => import('./components/SalaryCalculator'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

// Lazy-loaded modals and popups
const GalleryModal = lazy(() => import('./components/GalleryModal'));
const BlogModal = lazy(() => import('./components/BlogModal'));
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'));
const PriceAuthModal = lazy(() => import('./components/PriceAuthModal'));
export const AzkarModalContext = createContext<{ openAzkar: () => void } | null>(null);


// A wrapper for lazy-loaded sections to provide a fallback
const LazySection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Suspense fallback={<div className="h-96 w-full flex items-center justify-center"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400"></div></div>}>
        {children}
    </Suspense>
);

// Types for Contexts
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations[Language];
  dir: 'ltr' | 'rtl';
}


// Context Creation
export const LanguageContext = createContext<LanguageContextType>(null!);

// Main component for the home page
const HomePage: React.FC<{
    onNavigate: (page: Page, data?: any) => void;
    onImageClick: (image: GalleryImage) => void;
    isPriceAuthenticated: boolean;
    priceAuthTimer: number;
    onUnlockPrices: () => void;
}> = ({ onNavigate, onImageClick, isPriceAuthenticated, priceAuthTimer, onUnlockPrices }) => (
    <>
        <Hero />
        <Services />
        <LazySection><PrintRecommender isPriceAuthenticated={isPriceAuthenticated} priceAuthTimer={priceAuthTimer} onUnlockPrices={onUnlockPrices} /></LazySection>
        <LazySection><WhyChooseUs /></LazySection>
        <LazySection><OurProcess /></LazySection>
        <LazySection><DesignVisualizer /></LazySection>
        <LazySection><Gallery onImageClick={onImageClick} /></LazySection>
        <LazySection><Quotes /></LazySection>
        <LazySection><Testimonials /></LazySection>
        <LazySection><BlogPreview onNavigate={onNavigate} /></LazySection>
        <LazySection><Partners /></LazySection>
        <LazySection><QuoteForm /></LazySection>
        <LazySection><FAQ /></LazySection>
        <LazySection><ZakatCalculator /></LazySection>
        <LazySection><SalaryCalculator /></LazySection>
        <LazySection><About /></LazySection>
        <LazySection><Contact /></LazySection>
    </>
);

// Eagerly load components that might be navigated to
const BlogPage = lazy(() => import('./components/BlogPage'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));
const Azkar = lazy(() => import('./components/Azkar'));

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('ar');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('rtl');
  const [page, setPage] = useState<Page>('home');
  const [pageData, setPageData] = useState<any>(null);
  
  // Modal States
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isAzkarOpen, setIsAzkarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Price Auth State
  const [isPriceAuthenticated, setIsPriceAuthenticated] = useState(false);
  const [priceAuthTimer, setPriceAuthTimer] = useState(0); // in seconds
  const [showPriceAuthModal, setShowPriceAuthModal] = useState(false);
  
  // Pre-loader and initial state management
  useEffect(() => {
    // This effect handles initial setup and the definitive reload fix.

    // 1. Set default page state and ensure loader is always shown on hard refresh.
    setPage('home');
    setPageData(null);
    setIsLoading(true);

    // 2. Aggressively manage scroll position.
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
    // Remove hash to prevent browser from jumping.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    // Force scroll to top immediately on script execution.
    window.scrollTo(0, 0);

    // 3. Manage the loader visibility for a fixed duration.
    const MINIMUM_LOADER_TIME = 4000; // 4 seconds

    const loaderTimeout = setTimeout(() => {
      setIsLoading(false);
      // Force scroll to top AGAIN after the loader is gone.
      // This is the definitive fix that overrides the browser's attempt to restore scroll position.
      window.scrollTo(0, 0);
    }, MINIMUM_LOADER_TIME);

    // Cleanup timeout on component unmount to prevent memory leaks.
    return () => clearTimeout(loaderTimeout);
  }, []); // Empty dependency array ensures this runs only once on mount.
  
  // Price Auth Timer
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined;
    if (isPriceAuthenticated && priceAuthTimer > 0) {
      timerId = setInterval(() => {
        setPriceAuthTimer(prev => prev - 1);
      }, 1000);
    } else if (priceAuthTimer <= 0 && isPriceAuthenticated) {
      setIsPriceAuthenticated(false);
    }
    return () => clearInterval(timerId);
  }, [isPriceAuthenticated, priceAuthTimer]);

  // Language management
  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.lang = lang;
    document.documentElement.dir = newDir;
    document.body.lang = lang; // Ensure body also has the lang attribute for font-family
    localStorage.setItem('language', lang);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    handleSetLanguage(savedLanguage || 'ar');
  }, [handleSetLanguage]);
  
  // SEO: Dynamic Page Titles
  useEffect(() => {
    const t = translations[language];
    let title = `${t.appName} – ${t.heroTitle}`; // Default title
  
    switch (page) {
      case 'blog':
        title = `${t.blogPageTitle} | ${t.appName}`;
        break;
      case 'article':
        if (pageData && pageData.title) {
          title = `${pageData.title[language]} | ${t.appName}`;
        }
        break;
      case 'home':
      default:
        // Use default title
        break;
    }
    document.title = title;
  }, [page, pageData, language]);


  // Exit-intent handler
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
            setShowExitPopup(true);
            sessionStorage.setItem('exitIntentShown', 'true');
        }
    };

    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
        document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);


  const handleNavigate = useCallback((newPage: Page, data: any = null) => {
    window.scrollTo(0, 0);
    setPage(newPage);
    setPageData(data);
  }, []);
  
  const openAzkar = useCallback(() => setIsAzkarOpen(true), []);

  const handlePriceAuthSuccess = () => {
      setIsPriceAuthenticated(true);
      setPriceAuthTimer(60); // Start 1 minute timer
      setShowPriceAuthModal(false);
  };

  const renderPage = () => {
    switch(page) {
        case 'home':
            return <HomePage 
              onNavigate={handleNavigate} 
              onImageClick={setSelectedImage} 
              isPriceAuthenticated={isPriceAuthenticated}
              priceAuthTimer={priceAuthTimer}
              onUnlockPrices={() => setShowPriceAuthModal(true)}
            />;
        case 'blog':
            return <Suspense fallback={<div>Loading...</div>}><BlogPage onNavigate={handleNavigate} /></Suspense>;
        case 'article':
            return <Suspense fallback={<div>Loading...</div>}><ArticlePage post={pageData} onNavigate={handleNavigate} /></Suspense>;
        default:
            return <HomePage 
              onNavigate={handleNavigate} 
              onImageClick={setSelectedImage}
              isPriceAuthenticated={isPriceAuthenticated}
              priceAuthTimer={priceAuthTimer}
              onUnlockPrices={() => setShowPriceAuthModal(true)}
            />;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t: translations[language], dir }}>
    <AzkarModalContext.Provider value={{ openAzkar }}>
        <AnimatePresence>
            {isLoading && <Loader />}
        </AnimatePresence>
        <div className={`bg-zinc-950 text-zinc-300 transition-colors duration-300 transition-opacity overflow-x-hidden ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <Header onNavigate={handleNavigate} currentPage={page} />
            <main>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={{ duration: 0.4 }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer onNavigate={handleNavigate} />
            <FloatingWhatsapp />
            <ScrollToTop />
            <FloatingSpiritualButtons />
            
            <Suspense fallback={null}>
                <AnimatePresence>
                    {isAzkarOpen && <Azkar onClose={() => setIsAzkarOpen(false)} />}
                </AnimatePresence>

                <AnimatePresence>
                    {selectedImage && (
                        <GalleryModal 
                            selectedImage={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            onNavigate={setSelectedImage}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {selectedPost && (
                        <BlogModal
                            post={selectedPost}
                            onClose={() => setSelectedPost(null)}
                        />
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {showExitPopup && <ExitIntentPopup onClose={() => setShowExitPopup(false)} />}
                </AnimatePresence>
                    <AnimatePresence>
                    {showPriceAuthModal && (
                        <PriceAuthModal
                            onClose={() => setShowPriceAuthModal(false)}
                            onSuccess={handlePriceAuthSuccess}
                        />
                    )}
                </AnimatePresence>
            </Suspense>
        </div>
    </AzkarModalContext.Provider>
    </LanguageContext.Provider>
  );
};

export default App;