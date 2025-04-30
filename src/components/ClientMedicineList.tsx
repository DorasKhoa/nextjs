'use client';

import { useEffect, useState } from 'react';
import { fetchAllMedicine } from '@/services/medicineService';
import { Medicine } from '@/types/medicine';
import { ShoppingCart, X } from 'lucide-react';
import { addToCart } from '@/services/cartService';
import toast from 'react-hot-toast';

interface ClientMedicineListProps {
    onSuccess?: () => void; // Callback to reload data
}

export default function ClientMedicineList({ onSuccess }: ClientMedicineListProps) {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

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

    const handleShowQuantityModal = (medicine: Medicine) => {
        setSelectedMedicine(medicine);
        setQuantity(1);
        setShowQuantityModal(true);
    };

    const handleCloseModal = () => {
        setShowQuantityModal(false);
        setSelectedMedicine(null);
        setQuantity(1);
    };

    const handleAddToCart = async () => {
        if (!selectedMedicine || addingToCart) return;
        
        const medicineId = selectedMedicine._id;
        if (!medicineId) return;

        setAddingToCart(medicineId);
        try {
            await addToCart(medicineId, quantity);
            toast.success('Added to cart successfully');
            handleCloseModal();
            loadMedicines(); // Reload medicines list
            if (onSuccess) {
                onSuccess(); // Call the callback if provided
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to add to cart');
        } finally {
            setAddingToCart(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Available Medicines</h1>
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
                                        <button
                                            onClick={() => handleShowQuantityModal(medicine)}
                                            disabled={addingToCart === medicine._id}
                                            className={`flex items-center gap-1 px-3 py-1 rounded ${
                                                addingToCart === medicine._id
                                                    ? 'bg-gray-200 text-gray-500'
                                                    : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            {addingToCart === medicine._id ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quantity Modal */}
            {showQuantityModal && selectedMedicine && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add to Cart</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-lg mb-2">{selectedMedicine.name}</p>
                            <p className="text-gray-600">Price: {selectedMedicine.price}</p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={Number(selectedMedicine.quantity)}
                                value={quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    setQuantity(Math.max(1, Math.min(value, Number(selectedMedicine.quantity))));
                                }}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart === selectedMedicine._id}
                                className={`px-4 py-2 rounded ${
                                    addingToCart === selectedMedicine._id
                                        ? 'bg-gray-200 text-gray-500'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                            >
                                {addingToCart === selectedMedicine._id ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 