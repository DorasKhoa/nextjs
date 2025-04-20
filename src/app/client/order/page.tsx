'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMyOrders, cancelOrder, payOrderWithCard } from '@/services/orderService';
import { Order } from '@/types/order';
import Header from '@/components/Header';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    try {
      const msg = await cancelOrder(orderId);
      toast.success(msg || 'Order cancelled!');
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  const handlePay = async (orderId: string) => {
    try {
      const msg = await payOrderWithCard(orderId);
      toast.success(msg || 'Payment successful!');
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    }
  };

  if (loading) return <div className="p-6">🔄 Loading your orders...</div>;

  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold mb-6">📦 My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={order.doctor.avatar || '/defaultavatar.jpg'}
                  alt={order.doctor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                />

                <div>
                  <p className="text-lg font-semibold text-gray-800">{order.doctor.name}</p>
                  {order.schedule.date === 'N/A' ? (
                    <p className="italic text-gray-500 text-sm">No schedule (snapshot only)</p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      🗓️ {order.schedule.date} — ⏰ {order.schedule.start} → {order.schedule.end}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">
                    💵 <b>Fees:</b> {order.fees} $ — 💳 <b>Payment:</b> {order.payment}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    📌 <b>Status:</b> {order.status}
                  </p>
                </div>
              </div>

              {order.status === 'PENDING' && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePay(order.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded"
                  >
                    💳 Pay with Card
                  </button>
                  <button
                    onClick={() => handleCancel(order.id)}
                    className="px-3 py-1 bg-red-400 hover:bg-red-600 text-white text-sm rounded"
                  >
                    ❌ Cancel Order
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}
