'use client';

import { useEffect, useState } from 'react';
import { fetchAllMedicine, deleteMedicine } from '@/services/medicineService';
import { Medicine } from '@/types/medicine';
import { Pencil, Trash2 } from 'lucide-react';
import EditMedicineModal from './admin/EditMedicineModal';

export default function MedicineList() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadMedicines = async () => {
        try {
            const data = await fetchAllMedicine();
            setMedicines(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load medicines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);

    const handleEdit = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this medicine?')) return;
        
        try {
            await deleteMedicine(id);
            await loadMedicines(); // Fetch lại dữ liệu sau khi xóa
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete medicine');
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleMedicineUpdated = () => {
        loadMedicines();
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Medicine List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b text-left">Name</th>
                            <th className="py-3 px-4 border-b text-left">Description</th>
                            <th className="py-3 px-4 border-b text-left">Ingredient</th>
                            <th className="py-3 px-4 border-b text-left">Quantity</th>
                            <th className="py-3 px-4 border-b text-left">Price</th>
                            <th className="py-3 px-4 border-b text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicines.map((medicine) => (
                            <tr key={medicine._id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{medicine.name}</td>
                                <td className="py-3 px-4 border-b">{medicine.description}</td>
                                <td className="py-3 px-4 border-b">{medicine.ingredient}</td>
                                <td className="py-3 px-4 border-b">{medicine.quantity}</td>
                                <td className="py-3 px-4 border-b">{medicine.price}</td>
                                <td className="py-3 px-4 border-b">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(medicine)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(medicine._id!)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedMedicine && (
                <EditMedicineModal
                    medicine={selectedMedicine}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onMedicineUpdated={handleMedicineUpdated}
                />
            )}
        </div>
    );
} 