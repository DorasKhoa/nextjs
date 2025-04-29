'use client';

import { useState } from 'react';
import { createMedicine } from '@/services/medicineService';
import { Medicine } from '@/types/medicine';

interface CreateMedicineCardProps {
    onMedicineCreated: () => void;
}

export default function CreateMedicineCard({ onMedicineCreated }: CreateMedicineCardProps) {
    const [formData, setFormData] = useState<Omit<Medicine, '_id'>>({
        name: '',
        description: '',
        ingredient: '',
        quantity: '',
        price: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const message = await createMedicine(formData);
            setSuccess(message);
            setFormData({
                name: '',
                description: '',
                ingredient: '',
                quantity: '',
                price: ''
            });
            onMedicineCreated();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add new Medicine</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ingredient</label>
                    <input
                        type="text"
                        name="ingredient"
                        value={formData.ingredient}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add
                </button>
            </form>
        </div>
    );
} 