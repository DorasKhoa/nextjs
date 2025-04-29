import React, { useEffect, useState } from 'react';
import { fetchDoctorOrders, rejectOrder, approveOrder } from '@/services/orderService';
import { DocOrder } from '@/types/order';
import { toast } from 'react-toastify';

const DoctorOrder: React.FC = () => {
  const [orders, setOrders] = useState<DocOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorOrders = await fetchDoctorOrders();
      // Sort orders by createdAt in descending order (newest first)
      const sortedOrders = [...doctorOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReject = async (orderId: string) => {
    try {
      await rejectOrder(orderId);
      toast.success('Order rejected successfully');
      // Reload orders after rejection
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject order');
    }
  };

  const handleApprove = async (orderId: string) => {
    try {
      await approveOrder(orderId);
      toast.success('Order approved successfully');
      // Reload orders after approval
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve order');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No Order found!</p>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white shadow p-4 rounded">
              <p><strong>Date:</strong> {order.schedule?.date || 'N/A'}</p>
              <p><strong>Time:</strong> {order.schedule ? `${order.schedule.start} - ${order.schedule.end}` : 'N/A'}</p>
              <p><strong>Fees:</strong> {order.fees}$</p>
              <p><strong>Payment:</strong> {order.payment}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>User:</strong> {order.user ? (order.user.name || order.user.email) : 'No user info'}</p>
              {order.status === 'PENDING' && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(order._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Approve Order
                  </button>
                  <button
                    onClick={() => handleReject(order._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Reject Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorOrder; 