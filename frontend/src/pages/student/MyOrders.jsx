import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/my');
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-amber-200/50 dark:border-amber-700/30';
            case 'PROCESSING': return 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-700/30';
            case 'READY': return 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200/50 dark:border-emerald-700/30';
            case 'COLLECTED': return 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200 border-gray-200/50 dark:border-gray-700/30';
            default: return 'bg-gray-100/50 dark:bg-gray-800/30 text-gray-800 dark:text-gray-200';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Orders Yet</h2>
                <p className="text-gray-500 dark:text-gray-400">Materials you order will appear here.</p>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h2>
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="glass-card overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="p-6 border-b border-white/20 bg-white/30 dark:bg-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Order #{order.id}</div>
                                <div className="text-gray-900 dark:text-white font-medium">{new Date(order.orderDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border backdrop-blur-md ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="p-6 bg-white/10">
                            <div className="space-y-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/40 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-inner">{item.quantity}x</div>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{item.material?.title || 'Unknown Item'}</span>
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-bold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
                                <span className="text-2xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
