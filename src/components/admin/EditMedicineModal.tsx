'use client';

import { useState, useEffect } from 'react';
import { editMedicine } from '@/services/medicineService';
import { Medicine } from '@/types/medicine';

interface EditMedicineModalProps {
    medicine: Medicine;
    isOpen: boolean;
    onClose: () => void;
    onMedicineUpdated: () => void;
}

export default function EditMedicineModal({ medicine, isOpen, onClose, onMedicineUpdated }: EditMedicineModalProps) {
    const [formData, setFormData] = useState<Medicine>(medicine);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        setFormData(medicine);
    }, [medicine]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!medicine._id) throw new Error('Medicine ID is required');
            await editMedicine(formData, medicine._id);
            setSuccess('Medicine updated successfully');
            onMedicineUpdated();
            setTimeout(() => {
                setSuccess(null);
                onClose();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update medicine');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Medicine</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {success && <div className="text-green-500 mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 