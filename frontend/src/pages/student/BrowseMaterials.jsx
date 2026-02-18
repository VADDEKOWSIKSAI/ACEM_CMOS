import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';

const BrowseMaterials = () => {
    const [step, setStep] = useState(1); // 1: Year, 2: Dept, 3: Semester, 4: Explorer (Subjects + Materials)
    const [years, setYears] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const { cart, addToCart, clearCart, totalPrice } = useCart();
    const [expandedMaterials, setExpandedMaterials] = useState({}); // Tracking expanded state per material

    const toggleExpand = (id) => {
        setExpandedMaterials(prev => ({ ...prev, [id]: !prev[id] }));
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const res = await api.get('/student/years');
            setYears(res.data);
        } catch (err) {
            console.error("Failed to fetch years", err);
        }
    };

    const handleYearSelect = async (year) => {
        setSelectedYear(year);
        setDepartments([]);
        setSubjects([]);
        setMaterials([]);
        setSelectedDept(null);
        setSelectedSemester(null);
        setSelectedSubject(null);
        try {
            const res = await api.get(`/student/departments/${year.id}`);
            setDepartments(res.data);
            setStep(2);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeptSelect = async (dept) => {
        setSelectedDept(dept);
        setSubjects([]);
        setMaterials([]);
        setSelectedSemester(null);
        setSelectedSubject(null);
        setStep(3);
    };

    const handleSemesterSelect = async (semester) => {
        setSelectedSemester(semester);
        setSubjects([]);
        setMaterials([]);
        setSelectedSubject(null);
        try {
            const res = await api.get(`/student/subjects/${selectedDept.id}?semester=${semester}`);
            console.log(`Fetched subjects for semester ${semester}:`, res.data);
            setSubjects(res.data);
            setStep(4);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubjectSelect = async (subject) => {
        if (selectedSubject?.id === subject.id) return;
        setSelectedSubject(subject);
        setMaterials([]);
        try {
            const res = await api.get(`/materials/subject/${subject.id}`);
            console.log("Fetched materials for subject:", subject.name, res.data);
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // addToCart is now from useCart hook

    const placeOrder = async () => {
        try {
            await api.post('/orders', {
                items: cart.map(i => ({ materialId: i.materialId, quantity: i.quantity })),
                paymentMethod: 'CASH_ON_DELIVERY'
            });
            alert("Order placed successfully! Please pay cash at the xerox shop.");
            clearCart();
        } catch (err) {
            alert("Failed to place order");
        }
    };

    // Helper for Breadcrumbs/Stepper
    const renderStepper = () => (
        <div className="glass flex items-center p-4 rounded-2xl mb-8 overflow-x-auto whitespace-nowrap">
            <button
                onClick={() => setStep(1)}
                className={`flex items-center hover:text-primary transition-all duration-300 ${step === 1 ? 'text-primary font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-medium'}`}
            >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 transition-all ${step === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                    {selectedYear ? selectedYear.name : '1'}
                </span>
                Year
            </button>

            {step > 1 && (
                <>
                    <span className="mx-4 text-slate-300">/</span>
                    <button
                        onClick={() => setStep(2)}
                        className={`flex items-center hover:text-primary transition-all duration-300 ${step === 2 ? 'text-primary font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-medium'}`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 transition-all ${step === 2 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                            {selectedDept ? selectedDept.name.charAt(0) : '2'}
                        </span>
                        Department
                    </button>
                </>
            )}

            {step > 2 && (
                <>
                    <span className="mx-4 text-slate-300">/</span>
                    <button
                        onClick={() => setStep(3)}
                        className={`flex items-center hover:text-primary transition-all duration-300 ${step === 3 ? 'text-primary font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-medium'}`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 transition-all ${step === 3 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                            {selectedSemester ? selectedSemester : '3'}
                        </span>
                        Semester
                    </button>
                </>
            )}

            {step > 3 && (
                <>
                    <span className="mx-4 text-slate-300">/</span>
                    <button
                        onClick={() => setStep(4)}
                        className={`flex items-center hover:text-primary transition-all duration-300 ${step === 4 ? 'text-primary font-black scale-105' : 'text-slate-500 dark:text-slate-400 font-medium'}`}
                    >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mr-2 transition-all ${step === 4 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>4</span>
                        Resources
                    </button>
                </>
            )}
        </div>
    );

    return (
        <div className="pt-24 max-w-7xl mx-auto pb-24 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Access Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Resources</span></h1>
                <p className="text-slate-500 dark:text-slate-300 font-medium">Select your timeline to explore curated study materials.</p>
            </div>

            {renderStepper()}

            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {years.map(year => (
                        <div
                            key={year.id}
                            onClick={() => handleYearSelect(year)}
                            className="glass-card group p-8 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl filter drop-shadow-md">📚</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{year.name}</h3>
                            <p className="text-slate-500 dark:text-slate-300 font-medium">Click to explore departments</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departments.map(dept => (
                        <div
                            key={dept.id}
                            onClick={() => handleDeptSelect(dept)}
                            className="glass-card group p-8 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-secondary/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-light to-secondary rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold">{dept.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{dept.name}</h3>
                            <p className="text-slate-500 dark:text-slate-300 font-medium">View subjects</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                    {[1, 2].map(sem => (
                        <div
                            key={sem}
                            onClick={() => handleSemesterSelect(sem)}
                            className="glass-card group p-8 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-2xl font-bold">{sem}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Semester {sem}</h3>
                            <p className="text-slate-500 dark:text-slate-300 font-medium">Click to view subjects</p>
                        </div>
                    ))}
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Subjects sidebar/list */}
                    <div className="w-full lg:w-1/3 xl:w-1/4">
                        <div className="glass p-6 rounded-2xl sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-800 dark:text-white">Subjects</h2>
                                <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-lg uppercase tracking-wider">Sem {selectedSemester}</span>
                            </div>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {subjects.length === 0 ? (
                                    <p className="text-slate-400 text-sm font-medium italic">No subjects found for this semester.</p>
                                ) : (
                                    subjects.map(sub => (
                                        <div
                                            key={sub.id}
                                            onClick={() => handleSubjectSelect(sub)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedSubject?.id === sub.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10' : 'bg-white/40 dark:bg-white/5 border-transparent hover:bg-white/60 dark:hover:bg-white/10'}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold text-sm ${selectedSubject?.id === sub.id ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{sub.name}</h3>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sub.code}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button
                                onClick={() => setStep(3)}
                                className="w-full mt-6 py-3 text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 group"
                            >
                                <span className="group-hover:-translate-x-1 transition-transform">←</span> Change Semester
                            </button>
                        </div>
                    </div>

                    {/* Materials section */}
                    <div className="flex-1">
                        {!selectedSubject ? (
                            <div className="h-full min-h-[400px] glass rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-50 space-y-4">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-5xl">👈</div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Select a Subject</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs">Click on any subject from the list to explore its study materials.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="mb-8 flex justify-between items-end">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-1">
                                            {selectedSubject.name} <span className="text-primary italic">Resources</span>
                                        </h2>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">{selectedSubject.code} • {materials.length} Materials available</p>
                                    </div>
                                    <div className="h-1 flex-1 mx-8 bg-gradient-to-r from-primary/20 to-transparent rounded-full mb-4 hidden xl:block"></div>
                                </div>

                                {materials.length === 0 ? (
                                    <div className="h-full min-h-[300px] glass rounded-3xl flex flex-col items-center justify-center text-center p-12 opacity-50 space-y-4">
                                        <div className="text-6xl">📭</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">No materials yet</h3>
                                            <p className="text-slate-500 dark:text-slate-400">We haven't uploaded any resources for this subject yet.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 max-w-4xl">
                                        {materials.map(mat => (
                                            <div key={mat.id} className="glass-card flex flex-col h-full overflow-hidden hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group border border-white/10 bg-white/50 dark:bg-night-card">
                                                {/* Image Section */}
                                                <div className="h-44 bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center relative group overflow-hidden">
                                                    {mat.imageUrl ? (
                                                        <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mat.imageUrl}`} alt={mat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-16 h-24 bg-white dark:bg-white/10 shadow-2xl rounded-lg flex items-center justify-center transform group-hover:-translate-y-2 transition-all duration-500 border border-white/20 backdrop-blur-md">
                                                            <span className="text-4xl filter drop-shadow-xl">📚</span>
                                                        </div>
                                                    )}

                                                    {/* Badge */}
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <span className={`px-3 py-1.5 rounded-full backdrop-blur-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20 ${mat.type === 'BOOK' ? 'bg-primary/30 text-primary-600 dark:text-primary-400' :
                                                            mat.type === 'LAB_MANUAL' ? 'bg-secondary/30 text-secondary-600 dark:text-secondary-400' :
                                                                'bg-accent/30 text-accent-600 dark:text-accent-400'
                                                            }`}>
                                                            {mat.type.replace('_', ' ')}
                                                        </span>
                                                    </div>

                                                    {/* Availability Overlay if hidden */}
                                                    {!mat.isAvailable && (
                                                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                                                            <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-white font-bold text-xs uppercase tracking-widest">Currently Unavailable</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content Section */}
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <div className="mb-2">
                                                        <div className="flex justify-between items-start gap-3">
                                                            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight flex-1">{mat.title}</h3>
                                                            <div className="flex-shrink-0">
                                                                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">₹{mat.price}</span>
                                                            </div>
                                                        </div>
                                                        <div className="h-0.5 w-10 bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
                                                    </div>

                                                    <div className="relative flex-1 mb-4">
                                                        <p className={`text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium transition-all duration-300 ${expandedMaterials[mat.id] ? '' : 'line-clamp-3'}`}>
                                                            {mat.description}
                                                        </p>
                                                        {mat.description.length > 150 && (
                                                            <button
                                                                onClick={() => toggleExpand(mat.id)}
                                                                className="mt-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-accent transition-colors flex items-center gap-1"
                                                            >
                                                                {expandedMaterials[mat.id] ? (
                                                                    <><span>View Summarized</span> <span className="text-xs">↑</span></>
                                                                ) : (
                                                                    <><span>Read Full Description</span> <span className="text-xs">↓</span></>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Footer Buttons */}
                                                    <div className="pt-4 border-t border-slate-100 dark:border-white/10">
                                                        <button
                                                            onClick={() => addToCart(mat)}
                                                            disabled={!mat.isAvailable}
                                                            className={`glass-btn w-full py-3 text-xs font-black flex items-center justify-center gap-2 group transition-all duration-300 ${!mat.isAvailable ? 'opacity-50 cursor-not-allowed grayscale' : 'shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95'}`}
                                                        >
                                                            <span className="text-lg group-hover:rotate-12 transition-transform">🛒</span>
                                                            {mat.isAvailable ? 'Secure Your Copy' : 'Out of Stock'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {cart.length > 0 && (
                <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
                    <div className="glass px-6 py-4 rounded-2xl border-t-2 border-primary/20 shadow-2xl flex items-center gap-6 group hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary dark:bg-primary/20 rounded-full flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
                                <span className="text-2xl">🛒</span>
                            </div>
                            <div>
                                <span className="block font-black text-slate-800 dark:text-white text-base">{cart.length} items</span>
                                <span className="text-xs font-bold text-primary dark:text-primary-400 tracking-wide">Total: ₹{totalPrice}</span>
                            </div>
                        </div>
                        <button
                            onClick={placeOrder}
                            className="glass-btn px-6 py-2.5 text-xs shadow-primary/30 active:scale-95"
                        >
                            Order Material
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrowseMaterials;
