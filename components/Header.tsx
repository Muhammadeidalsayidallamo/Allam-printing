import React, { useState, useEffect, useContext, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import type { Page } from '../types';
import { FiMenu, FiX } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';
import NavDropdown from './NavDropdown';

const Logo = memo(() => {
    const { t } = useContext(LanguageContext);
    return (
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-labelledby="logoTitle">
            <title id="logoTitle">{t.appName} Logo</title>
            <defs>
                <linearGradient id="logo-grad-premium" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" /> 
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <g>
                <path d="M15 65 L85 65" stroke="url(#logo-grad-premium)" strokeWidth="10" strokeLinecap="round"/>
                <path d="M30 65 L50 25 L70 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
        </svg>
    )
});

interface HeaderProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
    const { t } = useContext(LanguageContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        if (currentPage === 'home') {
            const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, { rootMargin: '-30% 0px -70% 0px' });
            
            sections.forEach(section => observer.observe(section));

            return () => {
                window.removeEventListener('scroll', handleScroll);
                sections.forEach(section => observer.unobserve(section));
            }
        } else {
             setActiveSection('');
        }
    }, [currentPage]);

    const handleNavClick = (page: Page, anchor?: string) => {
        onNavigate(page);
        if (anchor) {
            // Need a timeout to allow the page to render before scrolling
            setTimeout(() => {
                document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
        setIsMenuOpen(false);
    };
    
    const mainNavLinks = [
        { href: '#home', label: t.navHome, id: 'home', page: 'home' },
        { href: '#services', label: t.navServices, id: 'services', page: 'home' },
        { href: '#pricing', label: t.navPricing, id: 'pricing', page: 'home' },
        { href: '#gallery', label: t.navGallery, id: 'gallery', page: 'home' },
        { label: t.navBlog, id: 'blog', page: 'blog' },
    ];
    
    const dropdownNavLinks = [
        { href: '#visualizer', label: t.navVisualizer, id: 'visualizer', page: 'home' },
        { href: '#zakat', label: t.zakatNav, id: 'zakat', page: 'home' },
        { href: '#salary-calculator', label: t.salaryNav, id: 'salary-calculator', page: 'home' },
        { href: '#about', label: t.navAbout, id: 'about', page: 'home' },
        { href: '#contact', label: t.navContact, id: 'contact', page: 'home' },
    ];

    const mobileNavLinks = [...mainNavLinks, ...dropdownNavLinks];

    const NavLinksContent = ({ links }: { links: typeof mobileNavLinks }) => (
        <>
            {links.map(link => (
                <button key={link.id} onClick={() => handleNavClick(link.page as Page, link.href)} className={`relative text-sm font-semibold transition-colors group w-full text-center lg:w-auto py-2 lg:py-0 ${ (currentPage === 'home' && activeSection === link.id) || (currentPage === 'blog' && link.id === 'blog') ? 'text-sky-400' : 'text-zinc-300 hover:text-white'}`}>
                    <span>{link.label}</span>
                     <span className={`absolute bottom-0 left-0 h-0.5 bg-sky-400 transition-all duration-300 group-hover:w-full hidden lg:block ${ (currentPage === 'home' && activeSection === link.id) || (currentPage === 'blog' && link.id === 'blog') ? 'w-full' : 'w-0'}`}></span>
                </button>
            ))}
        </>
    );

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <button onClick={() => handleNavClick('home', '#home')} className="flex items-center space-x-2 rtl:space-x-reverse text-white">
                        <Logo />
                        <span className="text-xl font-bold">
                           {t.appName}
                        </span>
                    </button>
                    <nav className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
                        <NavLinksContent links={mainNavLinks} />
                        <NavDropdown 
                            links={dropdownNavLinks} 
                            onNavigate={handleNavClick}
                            activeSection={activeSection}
                            currentPage={currentPage}
                        />
                    </nav>
                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <LanguageSwitcher />
                        <div className="lg:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-200" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
                               {isMenuOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
                            </button>
                        </div>
                     </div>
                </div>
                <AnimatePresence>
                {isMenuOpen && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden pb-4"
                     >
                        <nav className="flex flex-col items-center space-y-2 pt-4 border-t border-zinc-800">
                           <NavLinksContent links={mobileNavLinks} />
                        </nav>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default memo(Header);