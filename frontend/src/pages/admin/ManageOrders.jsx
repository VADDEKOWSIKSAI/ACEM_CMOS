import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, null, { params: { status } });
            fetchOrders();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200/50 dark:border-amber-700/30';
            case 'PROCESSING': return 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-700/30';
            case 'READY': return 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200/50 dark:border-emerald-700/30';
            case 'COLLECTED': return 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 border-gray-200/50 dark:border-gray-700/30';
            case 'CANCELLED': return 'bg-red-100/50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200/50 dark:border-red-700/30';
            default: return 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200';
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Orders</h2>
                <p className="text-gray-500 dark:text-gray-400">Track and update student order statuses.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/20 dark:divide-white/10">
                        <thead className="bg-white/30 dark:bg-white/10 backdrop-blur-md">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Current Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Update Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 dark:divide-white/5">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-white/20 dark:hover:bg-white/5 transition-colors bg-white/5 dark:bg-white/0">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-xs font-bold text-white shadow-md mr-3">
                                                {order.student?.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-medium">{order.student?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                        ₹{order.totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border backdrop-blur-sm ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className="glass-input py-1.5 pl-3 pr-8 text-sm w-40"
                                        >
                                            <option value="PENDING">Pending</option>
                                            <option value="PROCESSING">Processing</option>
                                            <option value="READY">Ready to Pickup</option>
                                            <option value="COLLECTED">Collected</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
