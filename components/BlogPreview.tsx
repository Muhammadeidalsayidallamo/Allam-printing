import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';
import type { Page } from '../types';
import StaggeredText from './StaggeredText';

interface BlogPreviewProps {
    onNavigate: (page: Page, data?: any) => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ onNavigate }) => {
    const { t } = useContext(LanguageContext);
    const recentPosts = blogPosts.slice(0, 3);

    return (
        <section id="blog-preview" className="py-20 md:py-28 section-bg-alt">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    className="text-center mb-12"
                >
                    <StaggeredText text={t.blogPreviewTitle} as="h2" className="text-4xl md:text-5xl font-extrabold text-white" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <BlogCard post={post} onNavigate={onNavigate} />
                        </motion.div>
                    ))}
                </div>
                 <div className="text-center mt-16">
                    <button
                        onClick={() => onNavigate('blog')}
                        className="btn-primary"
                    >
                        {t.blogPreviewCta}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;