'use client';

import { useEffect, useState } from 'react';
import { fetchAllCheck } from '@/services/checkService';
import { Check } from '@/types/check';
import { format } from 'date-fns';
import { CreditCard, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentHistory() {
    const [checks, setChecks] = useState<Check[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadChecks = async () => {
        try {
            const data = await fetchAllCheck();
            setChecks(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load payment history');
            toast.error('Failed to load payment history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChecks();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (checks.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="mt-4">No payment history found</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Payment History</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {checks.map((check) => (
                            <tr key={check._id} className="hover:bg-gray-50">
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {format(new Date(check.createdAt), 'MMM dd, yyyy HH:mm')}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    {check.quantity} items
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    ${check.price.toFixed(2)}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-900">
                                    <div className="flex items-center gap-2">
                                        {check.payment === 1 ? (
                                            <>
                                                <CreditCard className="text-blue-500" size={16} />
                                                <span>Card</span>
                                            </>
                                        ) : (
                                            <>
                                                <Banknote className="text-green-500" size={16} />
                                                <span>Cash</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan={2} className="py-4 px-6 text-sm font-medium text-gray-900">
                                Total
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                ${checks.reduce((sum, check) => sum + check.price, 0).toFixed(2)}
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
} 