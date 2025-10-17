import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import type { Page } from '../types';
import { FiChevronDown } from 'react-icons/fi';

interface NavDropdownProps {
    links: { href?: string; label: string; id: string; page: string; }[];
    onNavigate: (page: Page, anchor?: string) => void;
    activeSection: string;
    currentPage: Page;
}

const NavDropdown: React.FC<NavDropdownProps> = ({ links, onNavigate, activeSection, currentPage }) => {
    const { t } = useContext(LanguageContext);
    const [isOpen, setIsOpen] = useState(false);

    const isLinkActive = (link: typeof links[0]) => {
        return currentPage === 'home' && activeSection === link.id;
    }
    
    const isDropdownActive = links.some(isLinkActive);

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button
                className={`flex items-center gap-1 relative text-sm font-semibold transition-colors group ${ isDropdownActive ? 'text-sky-400' : 'text-zinc-300 hover:text-white'}`}
            >
                <span>المزيد</span>
                <FiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.ul
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full mt-2 right-0 ltr:right-0 rtl:left-0 z-20 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg overflow-hidden"
                >
                    {links.map(link => (
                        <li key={link.id}>
                            <button
                                onClick={() => {
                                    onNavigate(link.page as Page, link.href);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-right rtl:text-right px-4 py-2 text-sm ${isLinkActive(link) ? 'bg-sky-500 text-white' : 'text-zinc-200 hover:bg-zinc-700'}`}
                            >
                                {link.label}
                            </button>
                        </li>
                    ))}
                </motion.ul>
            )}
            </AnimatePresence>
        </div>
    );
};

export default NavDropdown;