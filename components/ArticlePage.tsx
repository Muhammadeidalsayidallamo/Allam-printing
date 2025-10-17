import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '../App';
import type { BlogPost, Page } from '../types';
import { FiArrowLeft } from 'react-icons/fi';
import { blogPosts } from '../data/blogPosts';
import BlogCard from './BlogCard';

interface ArticlePageProps {
  post: BlogPost;
  onNavigate: (page: Page, data?: any) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ post, onNavigate }) => {
    const { language, t, dir } = useContext(LanguageContext);

    if (!post) {
        return <div>Post not found</div>; // Or a more graceful fallback
    }

    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

    return (
        <article className="py-20 md:py-28 pt-40 md:pt-48 section-bg-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <button onClick={() => onNavigate('blog')} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold mb-8">
                            <FiArrowLeft style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'scaleX(1)' }}/>
                            {t.articleBack}
                        </button>
                        <p className="text-base text-sky-400 font-semibold mb-2">{post.category[language]}</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{post.title[language]}</h1>
                        <div className="flex items-center text-sm text-zinc-400 mb-8">
                            <span>{t.articleAuthor} {post.author}</span>
                            <span className="mx-2">&bull;</span>
                            <span>{t.articleDate} {new Date(post.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <img 
                            src={post.image} 
                            alt={post.title[language]} 
                            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-12" 
                            loading="lazy"
                            width="1260"
                            height="750"
                        />
                        <div className="prose lg:prose-xl prose-invert max-w-none text-zinc-300 whitespace-pre-line leading-relaxed">
                            {post.content[language]}
                        </div>
                    </motion.div>

                    <div className="mt-20 pt-10 border-t border-zinc-700">
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Related Articles</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {relatedPosts.map(relatedPost => (
                                <BlogCard key={relatedPost.id} post={relatedPost} onNavigate={onNavigate} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default ArticlePage;