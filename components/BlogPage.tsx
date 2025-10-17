import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';
import type { Page } from '../types';
import BlogCardSkeleton from './skeletons/BlogCardSkeleton';

interface BlogPageProps {
    onNavigate: (page: Page, data?: any) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
    const { t } = useContext(LanguageContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="py-20 md:py-28 pt-40 md:pt-48 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white">{t.blogPageTitle}</h1>
                    <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t.blogPageSubtitle}</p>
                </motion.div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        [...Array(3)].map((_, i) => <BlogCardSkeleton key={i} />)
                    ) : (
                        blogPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <BlogCard post={post} onNavigate={onNavigate} />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;