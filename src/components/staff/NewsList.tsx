'use client';

import { useEffect, useState } from 'react';
import { fetchAllnews, deleteNews } from '@/services/staffService';
import { News } from '@/types/news';
import Image from 'next/image';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import EditNewsModal from './EditNewsModal';

export default function NewsList() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const router = useRouter();

    const loadNews = async () => {
        try {
            const data = await fetchAllnews();
            setNews(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this news?')) return;
        
        setDeleting(id);
        try {
            await deleteNews(id);
            toast.success('News deleted successfully');
            loadNews(); // Reload the list after deletion
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete news');
        } finally {
            setDeleting(null);
        }
    };

    const handleEdit = (news: News) => {
        setEditingNews(news);
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <>
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">News Management</h1>
                    <button
                        onClick={() => router.push('/staff/news/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Create New News
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                                <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Created: {format(new Date(item.createdAt), 'MMM dd, yyyy')}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            disabled={deleting === item._id}
                                            className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                            {deleting === item._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {editingNews && (
                <EditNewsModal
                    news={editingNews}
                    isOpen={true}
                    onClose={() => setEditingNews(null)}
                    onSuccess={loadNews}
                />
            )}
        </>
    );
} 