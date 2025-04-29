'use client';

import { useState, useRef, useEffect } from 'react';
import { editNews } from '@/services/staffService';
import { News } from '@/types/news';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface EditNewsModalProps {
    news: News;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditNewsModal({ news, isOpen, onClose, onSuccess }: EditNewsModalProps) {
    const [title, setTitle] = useState(news.title);
    const [description, setDescription] = useState(news.description);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitle(news.title);
            setDescription(news.description);
            setSelectedImage(null);
            setPreviewImage(null);
        }
    }, [isOpen, news]);

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            await editNews(news._id, formData);
            toast.success('News updated successfully');
            onSuccess();
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update news');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit News</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="relative w-64 h-64 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={handleImageClick}
                        >
                            {previewImage || news.image ? (
                                <Image
                                    src={previewImage || news.image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Camera className="text-gray-400" size={48} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Click to change image</p>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update News'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 