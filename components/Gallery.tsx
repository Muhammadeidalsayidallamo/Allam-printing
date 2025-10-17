import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { galleryImages as allImages } from '../data/galleryImages';
import type { GalleryCategory, GalleryImage } from '../types';
import GalleryItemSkeleton from './skeletons/GalleryItemSkeleton';
import StaggeredText from './StaggeredText';
import { FiSearch } from 'react-icons/fi';

const filters: { id: GalleryCategory; labelKey: string }[] = [
    { id: 'all', labelKey: 'galleryFilterAll' },
    { id: 't-shirts', labelKey: 'galleryFilterTshirts' },
    { id: 'hoodies', labelKey: 'galleryFilterHoodies' },
    { id: 'process', labelKey: 'galleryFilterProcess' },
    { id: 'bags', labelKey: 'galleryFilterBags' },
    { id: 'uniforms', labelKey: 'galleryFilterUniforms' },
];

const GalleryItem: React.FC<{ image: GalleryImage; onClick: () => void; className: string }> = ({ image, onClick, className }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`${className}`}
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden rounded-lg cursor-pointer h-full group"
      >
        <img src={image.src} alt={image.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width="400" height="400" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <FiSearch className="w-12 h-12 text-white transform scale-75 group-hover:scale-100 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};


interface GalleryProps {
    onImageClick: (image: GalleryImage) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onImageClick }) => {
    const { t } = useContext(LanguageContext);
    const [activeFilter, setActiveFilter] = useState<GalleryCategory>('all');
    const [visibleCount, setVisibleCount] = useState(12);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a short loading time for a better UX with skeletons
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const filteredImages = useMemo(() => {
        if (activeFilter === 'all') return allImages;
        return allImages.filter(image => image.category === activeFilter);
    }, [activeFilter]);
    
    const imagesToShow = filteredImages.slice(0, visibleCount);
    
    const loadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    return (
        <section id="gallery" className="py-20 md:py-28 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.galleryTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                    <p className="mt-4 text-lg text-zinc-400">{t.gallerySubtitle}</p>
                </div>

                <div className="flex justify-center flex-wrap gap-2 mb-12">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                                activeFilter === filter.id
                                    ? 'bg-sky-500 text-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                        >
                            {t[filter.labelKey as keyof typeof t]}
                        </button>
                    ))}
                </div>

                <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[256px]">
                    <AnimatePresence>
                        {isLoading ? (
                            [...Array(8)].map((_, i) => <GalleryItemSkeleton key={i} />)
                        ) : (
                            imagesToShow.map(image => {
                                const imageSpanClass = 
                                    image.span === 'row' ? 'md:row-span-2' :
                                    image.span === 'col' ? 'md:col-span-2' : '';
                                return (
                                  <GalleryItem 
                                    key={image.id}
                                    image={image}
                                    onClick={() => onImageClick(image)}
                                    className={imageSpanClass}
                                  />
                                );
                            })
                        )}
                    </AnimatePresence>
                </motion.div>

                {!isLoading && visibleCount < filteredImages.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            className="btn-primary"
                        >
                            {t.galleryLoadMore}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;