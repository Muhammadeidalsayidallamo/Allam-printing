import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FaWhatsapp } from 'react-icons/fa';
import { FiSend, FiArrowDown } from 'react-icons/fi';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

const Hero: React.FC = () => {
    const { t } = useContext(LanguageContext);

    return (
        <section id="home" className="relative flex items-center justify-center h-screen text-white overflow-hidden bg-zinc-900">
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://wsrv.nl/?url=i.ibb.co/g6ZqL3g/video-poster.jpg&w=1920&q=80&output=webp"
                className="absolute z-0 w-auto min-w-full min-h-full max-w-none opacity-20"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-t-shirt-printing-machine-in-a-workshop-43956.webm" type="video/webm" />
                <source src="https://assets.mixkit.co/videos/preview/mixkit-t-shirt-printing-machine-in-a-workshop-43956-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent z-10"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
                <motion.h1
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-5xl md:text-7xl font-extrabold mb-4 text-white"
                    style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)'}}
                >
                   {t.heroTitle}
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-zinc-300"
                >
                    {t.heroSubtitle}
                </motion.p>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } }
                    }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <motion.a
                        href="https://www.facebook.com/Allam.Clothing.Printing/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto btn-primary"
                        variants={itemVariants}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <FiSend /> {t.heroCtaQuote}
                        </span>
                    </motion.a>
                    <motion.a
                        href="https://wa.me/201012379950"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto btn-secondary"
                         variants={itemVariants}
                    >
                         <span className="flex items-center justify-center gap-2">
                            <FaWhatsapp /> {t.heroCtaWhatsapp}
                        </span>
                    </motion.a>
                </motion.div>
            </div>
            <div className="absolute bottom-10 z-20 animate-bounce">
                <FiArrowDown className="w-8 h-8 text-sky-400"/>
            </div>
        </section>
    );
};

export default Hero;