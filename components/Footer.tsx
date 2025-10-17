import React, { useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';
import type { Page } from '../types';

const socialLinks = {
    whatsapp: 'https://wa.me/201012379950',
    facebookPage: 'https://www.facebook.com/Allam.Clothing.Printing/',
    facebookProfile: 'https://www.facebook.com/muhammad.abn.allam',
    instagram: 'https://www.instagram.com/mohamed.alam8945/',
    twitter: 'https://x.com/alsayid_eid',
    youtube: 'https://www.youtube.com/@BeyondLimits-l2w',
    tiktok: 'https://www.tiktok.com/@muhammadeidalsayi',
};

const Logo = memo(() => {
    const { t } = useContext(LanguageContext);
    return (
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="footerLogoTitle">
            <title id="footerLogoTitle">{t.appName} Logo</title>
            <defs>
                <linearGradient id="logo-grad-premium-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#38bdf8" /> 
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <g>
                <path d="M15 65 L85 65" stroke="url(#logo-grad-premium-footer)" strokeWidth="10" strokeLinecap="round"/>
                <path d="M30 65 L50 25 L70 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
        </svg>
    )
});

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const { t } = useContext(LanguageContext);

    const handleNavClick = (anchor: string) => {
        onNavigate('home');
        setTimeout(() => {
            document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const mainNavLinks = [
        { href: '#home', label: t.navHome },
        { href: '#services', label: t.navServices },
        { href: '#pricing', label: t.navPricing },
        { href: '#gallery', label: t.navGallery },
    ];
    
    const secondaryNavLinks = [
        { href: '#about', label: t.navAbout },
        { href: '#contact', label: t.navContact },
        { href: '#zakat', label: t.zakatNav },
        { href: '#salary-calculator', label: t.salaryNav },
        { label: t.navBlog, page: 'blog' },
    ];

    return (
        <footer className="bg-zinc-900 border-t border-zinc-800">
            <motion.div 
                className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <motion.div variants={itemVariants} className="lg:col-span-4 text-white">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                            <Logo />
                            <span className="text-xl font-bold">{t.appName}</span>
                        </div>
                        <p className="text-sm text-zinc-400 max-w-sm">{t.heroSubtitle}</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-sky-400 tracking-wider uppercase mb-4">{t.navHome}</h3>
                            <ul className="space-y-3">
                                {mainNavLinks.map(link => (
                                    <li key={link.href}>
                                        <button onClick={() => handleNavClick(link.href)} className="text-sm text-zinc-400 hover:text-sky-400 transition-colors">{link.label}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-sky-400 tracking-wider uppercase mb-4">{t.navAbout}</h3>
                            <ul className="space-y-3">
                                {secondaryNavLinks.map(link => (
                                    <li key={link.label}>
                                        <button onClick={() => link.page ? onNavigate(link.page as Page) : handleNavClick(link.href!)} className="text-sm text-zinc-400 hover:text-sky-400 transition-colors">{link.label}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-sky-400 tracking-wider uppercase mb-4">{t.navContact}</h3>
                            <div className="flex justify-start flex-wrap gap-x-5 gap-y-4 text-zinc-400">
                                <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors" aria-label={`Chat with ${t.appName} on WhatsApp`}><FaWhatsapp size={22} /></a>
                                <a href={socialLinks.facebookPage} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label={`Visit ${t.appName} on Facebook`}><FaFacebook size={22} /></a>
                                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors" aria-label={`Visit ${t.appName} on Instagram`}><FaInstagram size={22} /></a>
                                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-sky-500 transition-colors" aria-label={`Visit ${t.appName} on X (formerly Twitter)`}><FaTwitter size={22} /></a>
                                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors" aria-label={`Visit ${t.appName} on YouTube`}><FaYoutube size={22} /></a>
                                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label={`Visit ${t.appName} on TikTok`}><FaTiktok size={22} /></a>
                            </div>
                        </div>
                    </motion.div>
                </div>
                <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
                    <p>&copy; {new Date().getFullYear()} {t.footerCopyright}</p>
                    <p>{t.footerDevelopedBy} - {t.footerMadeWithPassion}</p>
                </motion.div>
            </motion.div>
        </footer>
    );
};

export default memo(Footer);