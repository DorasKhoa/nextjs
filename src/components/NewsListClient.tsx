'use client';

import { useEffect, useState } from 'react';
import { fetchAllnews } from '@/services/staffService';
import { News } from '@/types/news';
import Image from 'next/image';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function NewsListClient() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNews = async () => {
        try {
            const data = await fetchAllnews();
            setNews(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load news');
            toast.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Latest News</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                            {item.image ? (
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <div className="text-sm text-gray-500">
                                <span>Posted: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 