import React, { useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { LanguageContext } from '../App';
import type { GalleryImage } from '../types';
import { galleryImages as allImages } from '../data/galleryImages';

interface GalleryModalProps {
  selectedImage: GalleryImage;
  onClose: () => void;
  onNavigate: (newImage: GalleryImage) => void;
}

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
};

const GalleryModal: React.FC<GalleryModalProps> = ({ selectedImage, onClose, onNavigate }) => {
    const { t, language } = useContext(LanguageContext);

    const currentIndex = allImages.findIndex(img => img.id === selectedImage.id);

    const navigate = useCallback((direction: 'next' | 'prev') => {
        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % allImages.length;
        } else {
            nextIndex = (currentIndex - 1 + allImages.length) % allImages.length;
        }
        onNavigate(allImages[nextIndex]);
    }, [currentIndex, onNavigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, onClose]);


    return (
        <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={onClose}
        >
            <motion.div
                variants={modal}
                className="relative"
                onClick={e => e.stopPropagation()}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedImage.id}
                        src={selectedImage.src}
                        alt={selectedImage.title}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                </AnimatePresence>
                 <div className="absolute -bottom-12 left-0 right-0 text-center text-white">
                    <p className="font-bold">{selectedImage.title}</p>
                    <p className="text-sm text-zinc-300">{selectedImage.type}</p>
                </div>
            </motion.div>

            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10">
                <FiX size={32} />
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all"
                aria-label={t.galleryPrev}
            >
                {language === 'ar' ? <FiChevronRight size={32} /> : <FiChevronLeft size={32} />}
            </button>

            <button 
                onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all"
                aria-label={t.galleryNext}
            >
                {language === 'ar' ? <FiChevronLeft size={32} /> : <FiChevronRight size={32} />}
            </button>
        </motion.div>
    );
};

export default GalleryModal;