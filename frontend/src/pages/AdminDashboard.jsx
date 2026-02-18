import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ManageMaterials from './admin/ManageMaterials';
import ManageOrders from './admin/ManageOrders';

const AdminDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path === '/admin/materials' && location.pathname === '/admin/materials') return true;
        return false;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-night-bg flex">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/20 z-10 fixed h-full">
                <div className="h-16 flex items-center justify-center border-b border-white/20">
                    <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text filter drop-shadow-lg">ACEM</span>
                        <span className="text-gray-800 dark:text-gray-200">Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2 mt-4">
                    <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Management</p>

                    <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/admin') ? 'bg-white/40 dark:bg-white/10 text-primary-700 dark:text-primary-300 shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Orders
                    </Link>

                    <Link
                        to="/admin/materials"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive('/admin/materials') ? 'bg-white/40 dark:bg-white/10 text-primary-700 dark:text-primary-300 shadow-sm backdrop-blur-md border border-white/20 dark:border-white/10' : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Materials
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="w-full">
                    <Routes>
                        <Route path="/" element={<ManageOrders />} />
                        <Route path="/materials" element={<ManageMaterials />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
