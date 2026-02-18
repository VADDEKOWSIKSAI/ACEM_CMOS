import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import BrowseMaterials from './student/BrowseMaterials';
import MyOrders from './student/MyOrders';

const StudentDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/student' && location.pathname === '/student') return true;
        if (path === '/student/orders' && location.pathname === '/student/orders') return true;
        return false;
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-64 glass border-r border-white/20 fixed h-full z-10 pt-20">
                <div className="p-6">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Student Menu</h2>
                    <nav className="space-y-2">
                        <Link
                            to="/student"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/student') ? 'bg-white/40 dark:bg-white/10 text-primary-700 dark:text-primary-300 shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Browse Materials
                        </Link>
                        <Link
                            to="/student/orders"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/student/orders') ? 'bg-white/40 dark:bg-white/10 text-primary-700 dark:text-primary-300 shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            My Orders
                        </Link>
                    </nav>
                </div>
            </div>
            <div className="flex-1 p-8 ml-64">
                <Routes>
                    <Route path="/" element={<BrowseMaterials />} />
                    <Route path="/orders" element={<MyOrders />} />
                </Routes>
            </div>
        </div>
    );
};

export default StudentDashboard;
