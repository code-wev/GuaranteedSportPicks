import Article from '@/components/Blog/Article';
import BlogBanner from '@/components/Blog/BlogBanner';
import React from 'react';

const page = () => {
    return (
        <div>
            <BlogBanner/>
            <Article/>
        </div>
    );
};

export default page;