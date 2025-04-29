'use client';

import { useState, useRef } from 'react';
import { createNews } from '@/services/staffService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import Image from 'next/image';

interface CreateNewsFormProps {
    onNewsCreated: () => void;
}

export default function CreateNewsForm({ onNewsCreated }: CreateNewsFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

            await createNews(formData);
            toast.success('News created successfully');
            onNewsCreated(); // Trigger refresh in parent component
            // Reset form
            setTitle('');
            setDescription('');
            setSelectedImage(null);
            setPreviewImage(null);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create news');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Create New News</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="relative w-64 h-64 rounded-lg overflow-hidden group cursor-pointer"
                            onClick={handleImageClick}
                        >
                            {previewImage ? (
                                <Image
                                    src={previewImage}
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
                        <p className="text-sm text-gray-500 mt-2">Click to upload image</p>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create News'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 