import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register(formData);
        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="glass-card w-full max-w-md p-8 animate-float">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-secondary-dark to-secondary bg-clip-text text-transparent tracking-tight mb-2">Join ACEM-CMOS</h1>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Create your student account</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm rounded-r-lg backdrop-blur-sm">
                        <p className="font-bold">Registration failed</p>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="John Doe"
                            className="glass-input w-full"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="student@acem.edu"
                            className="glass-input w-full"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-200 ml-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            className="glass-input w-full"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="glass-btn w-full mt-2 from-secondary to-teal-600 shadow-secondary/30 hover:shadow-secondary/50">
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-200/50 dark:border-white/10 pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-secondary-dark dark:text-secondary-light hover:text-secondary-light dark:hover:text-secondary transition-colors underline decoration-2 decoration-transparent hover:decoration-secondary">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
