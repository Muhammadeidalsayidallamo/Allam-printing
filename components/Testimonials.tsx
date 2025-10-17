import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { testimonials as allTestimonials } from '../data/testimonials';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import StaggeredText from './StaggeredText';

const CARD_WIDTH = 600; // Width of the main card
const CARD_GAP = 20;

const Testimonials: React.FC = () => {
    const { t, language } = useContext(LanguageContext);
    const [[index, direction], setIndex] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        let newIndex = index + newDirection;
        if (newIndex < 0) {
            newIndex = allTestimonials.length - 1;
        } else if (newIndex >= allTestimonials.length) {
            newIndex = 0;
        }
        setIndex([newIndex, newDirection]);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP),
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP),
            opacity: 0,
            scale: 0.8,
        }),
    };

    return (
        <section className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.testimonialsTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                </div>

                <div className="relative max-w-xl mx-auto h-72 flex items-center justify-center">
                    <button onClick={() => paginate(-1)} className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-4 sm:-translate-x-12 z-20 p-2 rounded-full hover:bg-zinc-800 transition-colors">
                        <FiChevronLeft className="w-6 h-6 text-zinc-300" />
                    </button>
                    <button onClick={() => paginate(1)} className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-4 sm:translate-x-12 z-20 p-2 rounded-full hover:bg-zinc-800 transition-colors">
                        <FiChevronRight className="w-6 h-6 text-zinc-300" />
                    </button>
                    
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="absolute w-[90%] sm:w-full max-w-xl h-full flex flex-col items-center justify-center text-center p-8 bg-zinc-900 border border-zinc-800 rounded-lg"
                        >
                            <div className="flex text-sky-400 mb-4">
                                {[...Array(5)].map((_, i) => <FiStar key={i} fill="currentColor" />)}
                            </div>
                            <p className="text-md md:text-lg italic text-zinc-300 mb-6 line-clamp-3">
                                "{allTestimonials[index].quote[language]}"
                            </p>
                            <div>
                                <h4 className="font-bold text-white">{allTestimonials[index].author[language]}</h4>
                                <p className="text-sm text-zinc-400">{allTestimonials[index].role[language]}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;