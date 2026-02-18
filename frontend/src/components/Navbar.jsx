import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cart, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Theme Logic
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePlaceOrder = async () => {
        try {
            await api.post('/orders', {
                items: cart.map(i => ({ materialId: i.materialId, quantity: i.quantity })),
                paymentMethod: 'CASH_ON_DELIVERY'
            });
            alert("Order placed successfully! Please pay at the shop.");
            clearCart();
            setIsCartOpen(false);
        } catch (err) {
            alert("Failed to place order");
        }
    };

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 top-0 left-0 ${scrolled ? 'py-2 px-4' : 'py-4 px-0'}`}>
                <div className={`max-w-7xl mx-auto ${scrolled ? 'glass rounded-full px-6' : 'px-4'} transition-all duration-500 relative`}>
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <a href="https://acem.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center shrink-0">
                                <img
                                    src="https://acem.ac.in/wp-content/uploads/2024/09/acem_new_logo_lg_png-1.png"
                                    alt="ACEM Logo"
                                    className="h-10 md:h-12 w-auto object-contain brightness-110 dark:brightness-200 contrast-125"
                                />
                            </a>
                            <Link to="/" className="flex flex-col group">
                                <span className="text-[10px] md:text-sm lg:text-base font-black tracking-tight leading-none bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text group-hover:bg-gradient-to-l transition-all duration-500 filter drop-shadow-sm">
                                    Aditya College of Engineering Madanapalle
                                </span>
                                <span className="text-[8px] md:text-[10px] text-slate-700 dark:text-slate-300 font-bold tracking-widest uppercase">
                                    CMOS
                                </span>
                            </Link>
                        </div>

                        <div className="flex-1"></div>

                        <div className="hidden md:flex items-center space-x-6">
                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {theme === 'dark' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {!user ? (
                                <>
                                    <Link to="/login" className="text-slate-600 dark:text-slate-300 font-bold hover:text-primary dark:hover:text-primary-400 transition-colors">Login</Link>
                                    <Link to="/register" className="glass-btn py-2 px-6 text-sm">
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {user.roles.includes('ADMIN') ? (
                                        <>
                                            <Link to="/admin" className={`font-bold transition-colors ${isActive('/admin') && !isActive('/admin/materials') ? 'text-primary dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400'}`}>
                                                Orders
                                            </Link>
                                            <Link to="/admin/materials" className={`font-bold transition-colors ${isActive('/admin/materials') ? 'text-primary dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400'}`}>
                                                Materials
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/student" className={`font-bold transition-colors ${isActive('/student') && !isActive('/student/orders') ? 'text-primary dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400'}`}>
                                                Browse
                                            </Link>
                                            <Link to="/student/orders" className={`font-bold transition-colors ${isActive('/student/orders') ? 'text-primary dark:text-primary-400' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary-400'}`}>
                                                My Orders
                                            </Link>

                                            {/* Cart Icon */}
                                            <button
                                                onClick={() => setIsCartOpen(true)}
                                                className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {totalItems > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                                        {totalItems}
                                                    </span>
                                                )}
                                            </button>
                                        </>
                                    )}

                                    <div className="h-6 w-px bg-slate-300 dark:bg-white/20 mx-2"></div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 px-3 py-1.5 rounded-full border border-white/40 dark:border-white/10 shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                                {user.email.split('@')[0]}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold text-sm transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
                    <div className="relative w-full max-w-md bg-white dark:bg-night-bg shadow-2xl flex flex-col animate-slide-left h-full border-l border-gray-200 dark:border-white/10">
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-night-bg">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="text-primary text-3xl">🛒</span> Your Cart
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <span className="text-6xl">🛍️</span>
                                    <div>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">Your cart is empty</p>
                                        <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Add some materials to get started</p>
                                    </div>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.materialId} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 shadow-sm">
                                            {item.imageUrl ? (
                                                <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${item.imageUrl}`} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{item.title}</h4>
                                            <p className="text-primary font-black text-lg">₹{item.price}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 rounded-lg p-1">
                                                    <button onClick={() => updateQuantity(item.materialId, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-night-bg rounded-md transition-colors text-lg font-bold text-gray-700 dark:text-white">-</button>
                                                    <span className="w-6 text-center font-bold text-sm text-gray-900 dark:text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.materialId, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-night-bg rounded-md transition-colors text-lg font-bold text-gray-700 dark:text-white">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.materialId)} className="text-xs font-bold text-red-500 hover:text-red-400 p-2 transition-colors uppercase tracking-tighter">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-night-bg/50 backdrop-blur-md">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-500 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-white/10">
                                        <span className="text-xl font-black text-gray-900 dark:text-white">Total</span>
                                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">₹{totalPrice}</span>
                                    </div>
                                    <div className="pt-4 mt-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Payment Method</label>
                                        <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-primary/20 flex items-center gap-3">
                                            <span className="text-xl">💵</span>
                                            <div>
                                                <span className="block font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-tight">Cash on Delivery</span>
                                                <span className="text-[10px] text-slate-400 font-medium lowercase">Pay at the xerox shop</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="glass-btn w-full py-4 text-lg font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
                                >
                                    Complete Purchase <span>→</span>
                                </button>
                                <button onClick={clearCart} className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">Clear Entire Cart</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
