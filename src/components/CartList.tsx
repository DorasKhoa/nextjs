'use client';

import { useEffect, useState } from 'react';
import { fetchAllCart, removeMedfromCart, payWithCard, payWithCash } from '@/services/cartService';
import { Cart } from '@/types/cart';
import { ShoppingCart, Trash2, CreditCard, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartList() {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState<string | null>(null);

    const loadCarts = async () => {
        try {
            const data = await fetchAllCart('');  // clientId will be handled by the backend using token
            setCarts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cart items');
            toast.error('Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCarts();
    }, []);

    const handleRemove = async (cartId: string) => {
        if (processing) return;
        setProcessing(cartId);
        try {
            await removeMedfromCart(cartId);
            toast.success('Item removed from cart');
            loadCarts(); // Reload cart data
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to remove item');
        } finally {
            setProcessing(null);
        }
    };

    const handlePayWithCard = async (cartId: string) => {
        if (processing) return;
        setProcessing(cartId);
        try {
            await payWithCard(cartId);
            toast.success('Payment successful with card');
            loadCarts(); // Reload cart data
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to process card payment');
        } finally {
            setProcessing(null);
        }
    };

    const handlePayWithCash = async (cartId: string) => {
        if (processing) return;
        setProcessing(cartId);
        try {
            await payWithCash(cartId);
            toast.success('Cash payment registered');
            loadCarts(); // Reload cart data
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to process cash payment');
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (carts.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShoppingCart size={48} />
            <p className="mt-4">Your cart is empty</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
            <div className="grid gap-4">
                {carts.map((cart) => (
                    <div key={cart._id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold">{cart.name}</h3>
                                <p className="text-gray-600">Quantity: {cart.quantity}</p>
                                <p className="text-gray-600">Price: ${cart.price}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRemove(cart._id!)}
                                    disabled={processing === cart._id}
                                    className={`p-2 rounded ${
                                        processing === cart._id
                                            ? 'bg-gray-200'
                                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                                    }`}
                                    title="Remove from cart"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={() => handlePayWithCard(cart._id!)}
                                    disabled={processing === cart._id}
                                    className={`p-2 rounded ${
                                        processing === cart._id
                                            ? 'bg-gray-200'
                                            : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                                    }`}
                                    title="Pay with card"
                                >
                                    <CreditCard size={20} />
                                </button>
                                <button
                                    onClick={() => handlePayWithCash(cart._id!)}
                                    disabled={processing === cart._id}
                                    className={`p-2 rounded ${
                                        processing === cart._id
                                            ? 'bg-gray-200'
                                            : 'bg-green-100 hover:bg-green-200 text-green-600'
                                    }`}
                                    title="Pay with cash"
                                >
                                    <Banknote size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 