import React from 'react';

const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-zinc-900 rounded-xl shadow-sm overflow-hidden h-full flex flex-col border border-zinc-800">
      <div className="bg-zinc-800 h-56 animate-pulse"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-4 bg-zinc-700 rounded w-1/3 mb-3 animate-pulse"></div>
        <div className="h-6 bg-zinc-700 rounded w-full mb-3 animate-pulse"></div>
        <div className="h-6 bg-zinc-700 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="space-y-2 flex-grow">
            <div className="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="mt-auto h-5 bg-zinc-700 rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;