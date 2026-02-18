import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [loginType, setLoginType] = useState('STUDENT');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            const user = JSON.parse(localStorage.getItem('user'));
            if (loginType === 'ADMIN' && !user.roles.includes('ADMIN')) {
                logout();
                setError("Access Denied: You are not an Administrator.");
                return;
            }
            if (loginType === 'STUDENT' && !user.roles.includes('STUDENT')) {
                if (!user.roles.includes('STUDENT') && user.roles.includes('ADMIN')) {
                    logout();
                    setError("Access Denied: Please use Admin Login.");
                    return;
                }
            }
            if (user.roles.includes('ADMIN') && loginType === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-card w-full max-w-md p-8 animate-float">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Sign in to access your portal</p>
                </div>

                <div className="flex bg-white/30 dark:bg-white/5 p-1 rounded-xl mb-8 backdrop-blur-sm border border-white/20 dark:border-white/10">
                    <button
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${loginType === 'STUDENT' ? 'bg-white dark:bg-primary-600 text-primary dark:text-white shadow-md transform scale-105' : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300'}`}
                        onClick={() => setLoginType('STUDENT')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${loginType === 'ADMIN' ? 'bg-white dark:bg-primary-600 text-primary dark:text-white shadow-md transform scale-105' : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-300'}`}
                        onClick={() => setLoginType('ADMIN')}
                    >
                        Admin
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm rounded-r-lg backdrop-blur-sm">
                        <p className="font-bold">Authentication failed</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Email Address</label>
                        <input
                            type="text"
                            placeholder="name@acem.edu"
                            className="glass-input w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="glass-input w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button className="glass-btn w-full mt-4 group">
                        <span className="group-hover:tracking-wider transition-all duration-300">
                            {loginType === 'STUDENT' ? 'Enter Student Portal' : 'Access Admin Dashboard'}
                        </span>
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        New to ACEM-CMOS?{' '}
                        <a href="/register" className="font-bold text-primary dark:text-primary-400 hover:text-accent dark:hover:text-accent-300 transition-colors underline decoration-2 decoration-transparent hover:decoration-accent">
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
