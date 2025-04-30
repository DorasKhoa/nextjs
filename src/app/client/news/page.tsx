'use client';

import React from 'react';
import Header from '@/components/Header';
import NewsListClient from '@/components/NewsListClient';

const ClientNewsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main>
                <NewsListClient />
            </main>
        </div>
    );
};

export default ClientNewsPage;
