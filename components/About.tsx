import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import StaggeredText from './StaggeredText';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};


const About: React.FC = () => {
    const { t } = useContext(LanguageContext);

    return (
        <section id="about" className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <StaggeredText text={t.aboutTitle} as="h2" className="text-center text-4xl md:text-5xl font-extrabold text-white mb-16" />
                    
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Image Column */}
                        <motion.div
                            className="relative"
                            variants={itemVariants}
                        >
                            <div className="aspect-[4/5] rounded-lg">
                                <img
                                    src="https://wsrv.nl/?url=i.ibb.co/1tK48zND/20251011-1956-image.png&w=800&q=85&output=webp"
                                    alt="Mohamed Allam, founder and printing expert at Allam Printing, in his workshop."
                                    className="rounded-lg w-full h-full object-cover object-top"
                                    loading="lazy"
                                    decoding="async"
                                    width="800"
                                    height="1000"
                                />
                            </div>
                        </motion.div>

                        {/* Text Column */}
                        <motion.div
                             variants={containerVariants}
                             initial="hidden"
                             whileInView="visible"
                             viewport={{ once: true, amount: 0.2 }}
                             className="space-y-5 text-lg text-zinc-300"
                        >
                           <motion.p variants={itemVariants}>{t.aboutStory1}</motion.p>
                           <motion.p variants={itemVariants}>{t.aboutStory2}</motion.p>
                           <motion.p variants={itemVariants}>{t.aboutStory3}</motion.p>
                           <motion.p variants={itemVariants} className="font-semibold text-sky-400">{t.aboutStory4}</motion.p>
                           <motion.blockquote 
                             variants={itemVariants} 
                             className="my-6 p-4 text-xl italic text-zinc-200 border-l-4 border-sky-500 bg-zinc-800/50 rounded-r-lg"
                           >
                            {t.aboutStory5}
                           </motion.blockquote>
                           <motion.p variants={itemVariants} className="font-bold text-gray-100 text-center text-xl">{t.aboutStory7}</motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;