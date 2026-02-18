import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const ManageMaterials = () => {
    const [years, setYears] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [materials, setMaterials] = useState([]);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [newMaterial, setNewMaterial] = useState({
        title: '',
        description: '',
        type: 'BOOK',
        price: '',
        isAvailable: true,
        imageUrl: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Editing material state
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMaterialData, setEditMaterialData] = useState({
        title: '',
        description: '',
        type: 'BOOK',
        price: '',
        isAvailable: true,
        imageUrl: ''
    });
    const [editFile, setEditFile] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // Modal state for adding Year/Dept/Sub
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'YEAR', 'DEPT', 'SUBJECT'
    const [modalData, setModalData] = useState({ name: '', code: '', semester: '1' });

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        const res = await api.get('/student/years');
        setYears(res.data);
    };

    const handleYearChange = async (e) => {
        const yearId = e.target.value;
        console.log("Selected Year ID:", yearId);
        setSelectedYear(yearId);
        if (yearId) {
            const res = await api.get(`/student/departments/${yearId}`);
            console.log("Fetched Departments:", res.data);
            setDepartments(res.data);
        } else {
            setDepartments([]);
        }
        setSubjects([]);
        setMaterials([]);
    };

    const handleDeptChange = async (e) => {
        const deptId = e.target.value;
        setSelectedDept(deptId);
        setSelectedSemester('');
        setSubjects([]);
        setMaterials([]);
    };

    const handleSemesterChange = async (e) => {
        const semester = e.target.value;
        setSelectedSemester(semester);
        if (selectedDept && semester) {
            const res = await api.get(`/student/subjects/${selectedDept}?semester=${semester}`);
            setSubjects(res.data);
        } else {
            setSubjects([]);
        }
        setMaterials([]);
    };

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        if (subjectId) {
            fetchMaterials(subjectId);
        } else {
            setMaterials([]);
        }
    };

    const fetchMaterials = async (subjectId) => {
        try {
            const res = await api.get(`/materials/subject/${subjectId}`);
            setMaterials(res.data);
            console.log("Fetched Materials:", res.data);
        } catch (err) {
            console.error("Failed to fetch materials:", err);
            // alert("Failed to fetch materials list");
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return null;
        const formData = new FormData();
        formData.append('file', selectedFile);
        setUploading(true);
        try {
            const res = await api.post('/admin/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data.url;
        } catch (err) {
            alert("File upload failed");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!selectedSubject) return alert("Select a subject first");

        try {
            let imageUrl = null;
            if (selectedFile) {
                imageUrl = await handleFileUpload();
                if (!imageUrl) return;
            }

            const materialData = { ...newMaterial, imageUrl };
            await api.post(`/materials/${selectedSubject}`, materialData);
            fetchMaterials(selectedSubject);
            setNewMaterial({ title: '', description: '', type: 'BOOK', price: '', isAvailable: true, imageUrl: '' });
            setSelectedFile(null);
            setShowAddModal(false);
            alert("Material added!");
        } catch (err) {
            alert("Failed to add material");
        }
    };

    const handleEditEntityClick = (type) => {
        let data = { name: '', code: '', semester: '1' };
        if (type === 'DEPT' && selectedDept) {
            const dept = departments.find(d => d.id === parseInt(selectedDept));
            if (dept) data = { ...data, name: dept.name };
        } else if (type === 'SUBJECT' && selectedSubject) {
            const sub = subjects.find(s => s.id === parseInt(selectedSubject));
            if (sub) data = { name: sub.name, code: sub.code, semester: sub.semester.toString() };
        }

        setModalType(type === 'DEPT' ? 'EDIT_DEPT' : 'EDIT_SUBJECT');
        setModalData(data);
        setShowModal(true);
    };

    const handleAddEntity = async (e) => {
        e.preventDefault();
        console.log("Submitting Entity:", modalType, modalData);
        try {
            if (modalType === 'YEAR') {
                await api.post('/admin/years', { name: modalData.name });
                fetchYears();
            } else if (modalType === 'DEPT') {
                await api.post(`/admin/departments/${selectedYear}`, { name: modalData.name });
                handleYearChange({ target: { value: selectedYear } });
            } else if (modalType === 'EDIT_DEPT') {
                await api.put(`/admin/departments/${selectedDept}`, { name: modalData.name });
                handleYearChange({ target: { value: selectedYear } });
            } else if (modalType === 'SUBJECT') {
                await api.post(`/admin/subjects/${selectedDept}`, {
                    name: modalData.name,
                    code: modalData.code,
                    semester: parseInt(modalData.semester)
                });
                handleSemesterChange({ target: { value: selectedSemester } });
            } else if (modalType === 'EDIT_SUBJECT') {
                await api.put(`/admin/subjects/${selectedSubject}`, {
                    name: modalData.name,
                    code: modalData.code,
                    semester: parseInt(modalData.semester)
                });
                handleSemesterChange({ target: { value: selectedSemester } });
            }
            setShowModal(false);
            setModalData({ name: '', code: '', semester: '1' });
            alert("Updated successfully!");
        } catch (err) {
            console.error("Failed to submit entity:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert(`Failed to save ${modalType.toLowerCase()}: ${errorMsg}`);
        }
    };

    const handleEditClick = (mat) => {
        setEditingMaterial(mat);
        setEditMaterialData({
            title: mat.title,
            description: mat.description,
            type: mat.type,
            price: mat.price,
            isAvailable: mat.isAvailable,
            imageUrl: mat.imageUrl
        });
        setEditFile(null);
        setShowEditModal(true);
    };

    const handleUpdateMaterial = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = editMaterialData.imageUrl;
            if (editFile) {
                const formData = new FormData();
                formData.append('file', editFile);
                const res = await api.post('/admin/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = res.data.url;
            }

            const updatedData = { ...editMaterialData, imageUrl };
            await api.put(`/materials/${editingMaterial.id}`, updatedData);
            fetchMaterials(selectedSubject);
            setShowEditModal(false);
            setEditingMaterial(null);
            alert("Material updated!");
        } catch (err) {
            alert("Failed to update material");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this material?")) {
            try {
                await api.delete(`/materials/${id}`);
                fetchMaterials(selectedSubject);
            } catch (err) {
                alert("Failed to delete");
            }
        }
    };

    return (
        <div className="pt-24 pb-24 px-4">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Materials</h2>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Add, update, or remove study materials.</p>
            </div>

            <div className="glass-card p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Select Context</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => handleEditEntityClick('DEPT')}
                                disabled={!selectedDept}
                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg disabled:opacity-30 transition-all"
                                title="Edit Selected Department"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleEditEntityClick('SUBJECT')}
                                disabled={!selectedSubject}
                                className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 rounded-lg disabled:opacity-30 transition-all"
                                title="Edit Selected Subject"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex gap-2 text-[10px] uppercase tracking-wider font-black">
                            <button onClick={() => { setModalType('YEAR'); setShowModal(true); }} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all border border-primary/20">+ Year</button>
                            <button onClick={() => { setModalType('DEPT'); setShowModal(true); }} disabled={!selectedYear} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all border border-primary/20 disabled:opacity-50">+ Dept</button>
                            <button onClick={() => { setModalType('SUBJECT'); setShowModal(true); }} disabled={!selectedDept} className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all border border-primary/20 disabled:opacity-50">+ Subject</button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <select value={selectedYear} onChange={handleYearChange} className="glass-input w-full">
                        <option value="">Select Year</option>
                        {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                    </select>
                    <select value={selectedDept} onChange={handleDeptChange} className="glass-input w-full" disabled={!selectedYear}>
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <select value={selectedSemester} onChange={handleSemesterChange} className="glass-input w-full" disabled={!selectedDept}>
                        <option value="">Select Sem</option>
                        <option value="1">Sem 1</option>
                        <option value="2">Sem 2</option>
                    </select>
                    <select value={selectedSubject} onChange={handleSubjectChange} className="glass-input w-full" disabled={!selectedSemester}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                    </select>
                </div>
            </div>

            {selectedSubject && (
                <>
                    {/* Edit Material Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="glass-card w-full max-w-lg p-6 animate-float">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white">Edit Material</h3>
                                    <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateMaterial} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-300 ml-1">Title</label>
                                                <input
                                                    required
                                                    className="glass-input w-full"
                                                    value={editMaterialData.title}
                                                    onChange={e => setEditMaterialData({ ...editMaterialData, title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-300 ml-1">Description</label>
                                                <textarea
                                                    required
                                                    className="glass-input w-full resize-none h-32"
                                                    value={editMaterialData.description}
                                                    onChange={e => setEditMaterialData({ ...editMaterialData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-300 ml-1">Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        className="glass-input w-full"
                                                        value={editMaterialData.price}
                                                        onChange={e => setEditMaterialData({ ...editMaterialData, price: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-gray-300 ml-1">Type</label>
                                                    <select
                                                        className="glass-input w-full"
                                                        value={editMaterialData.type}
                                                        onChange={e => setEditMaterialData({ ...editMaterialData, type: e.target.value })}
                                                    >
                                                        <option value="BOOK">Book</option>
                                                        <option value="LAB_MANUAL">Lab Manual</option>
                                                        <option value="PDF">PDF</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-300 ml-1 flex justify-between">
                                                    <span>Update Photo</span>
                                                    {editMaterialData.imageUrl && <span className="text-[10px] text-primary-400">Current photo exists</span>}
                                                </label>
                                                <div className="flex items-center gap-3">
                                                    {editMaterialData.imageUrl && !editFile && (
                                                        <div className="w-12 h-12 rounded-lg border border-white/20 overflow-hidden bg-white/5">
                                                            <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${editMaterialData.imageUrl}`} className="w-full h-full object-cover" alt="Current" />
                                                        </div>
                                                    )}
                                                    {editMaterialData.imageUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditMaterialData({ ...editMaterialData, imageUrl: '' })}
                                                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                            title="Remove Photo"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                    <input
                                                        type="file"
                                                        className="glass-input flex-1 text-xs min-w-0"
                                                        onChange={e => setEditFile(e.target.files[0])}
                                                        accept="image/*"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
                                                <input
                                                    type="checkbox"
                                                    id="isAvailableEdit"
                                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                                                    checked={editMaterialData.isAvailable}
                                                    onChange={e => setEditMaterialData({ ...editMaterialData, isAvailable: e.target.checked })}
                                                />
                                                <label htmlFor="isAvailableEdit" className="text-sm font-bold text-white">Available for Students</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-6">
                                        <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all">Cancel</button>
                                        <button type="submit" disabled={uploading} className="flex-1 glass-btn py-3">
                                            {uploading ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Add Material Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="glass-card w-full max-w-lg p-6 animate-float">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </span>
                                        Add New Material
                                    </h3>
                                    <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleAddMaterial} className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-300 ml-1">Title</label>
                                            <input
                                                required
                                                placeholder="Enter title"
                                                className="glass-input w-full"
                                                value={newMaterial.title}
                                                onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-300 ml-1">Description</label>
                                            <textarea
                                                required
                                                placeholder="Enter description"
                                                className="glass-input w-full resize-none h-24"
                                                value={newMaterial.description}
                                                onChange={e => setNewMaterial({ ...newMaterial, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-300 ml-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="glass-input w-full"
                                                    value={newMaterial.price}
                                                    onChange={e => setNewMaterial({ ...newMaterial, price: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-300 ml-1">Type</label>
                                                <select
                                                    className="glass-input w-full"
                                                    value={newMaterial.type}
                                                    onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}
                                                >
                                                    <option value="BOOK">Book</option>
                                                    <option value="LAB_MANUAL">Lab Manual</option>
                                                    <option value="PDF">PDF</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-300 ml-1">Material Photo Copy</label>
                                            <input
                                                type="file"
                                                className="glass-input w-full text-xs min-w-0"
                                                onChange={e => setSelectedFile(e.target.files[0])}
                                                accept="image/*"
                                            />
                                            {selectedFile && <p className="text-[10px] text-green-500 font-bold ml-1">Selected: {selectedFile.name}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-6">
                                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all">Cancel</button>
                                        <button type="submit" disabled={uploading} className="flex-1 glass-btn py-3">
                                            {uploading ? 'Processing Image...' : 'Add Material'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="glass-card p-6 mb-8 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Existing Materials ({materials.length})</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage and monitor all uploaded study materials.</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="glass-btn flex items-center gap-2 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Material
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-24">
                        {materials.length === 0 ? (
                            <div className="text-center py-10 glass-card border-dashed border-2 border-white/20 dark:border-white/10">
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No materials found for this subject.</p>
                            </div>
                        ) : (
                            materials.map(mat => (
                                <div key={mat.id} className="glass-card p-6 flex flex-col gap-4 hover:scale-[1.01] transition-transform">
                                    <div className="flex justify-between items-start gap-4">
                                        <h4 className="font-black text-xl text-gray-900 dark:text-white truncate flex-1">{mat.title}</h4>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider ${mat.type === 'BOOK' ? 'bg-indigo-500/20 text-indigo-400' :
                                                mat.type === 'LAB_MANUAL' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {mat.type}
                                            </span>
                                            {!mat.isAvailable && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-black rounded-md uppercase tracking-wider">Unavailable</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6">
                                        <div className="flex items-center gap-4 flex-1 w-full min-w-0">
                                            {mat.imageUrl ? (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg flex-shrink-0 bg-white/5">
                                                    <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}${mat.imageUrl}`} alt={mat.title} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-2xl bg-white/5 shadow-inner flex-shrink-0">
                                                    📚
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium line-clamp-2">{mat.description}</p>
                                                <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">₹{mat.price}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                            <button
                                                onClick={() => handleEditClick(mat)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all font-bold text-sm border border-indigo-500/20 shadow-lg shadow-indigo-500/5 group"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Modify
                                            </button>
                                            <button
                                                onClick={() => handleDelete(mat.id)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all font-bold text-sm border border-red-500/20 shadow-lg shadow-red-500/5"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* Entity management Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-sm p-6 animate-float">
                        <h3 className="text-xl font-black text-white mb-6">
                            {modalType.startsWith('EDIT_') ? 'Update' : 'Add New'} {
                                modalType.includes('DEPT') ? 'Department' :
                                    modalType.includes('SUBJECT') ? 'Subject' :
                                        modalType.charAt(0) + modalType.slice(1).toLowerCase()
                            }
                        </h3>
                        <form onSubmit={handleAddEntity} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-300 ml-1">Name</label>
                                <input
                                    required
                                    className="glass-input w-full"
                                    placeholder={modalType.includes('YEAR') ? 'e.g. 1st Year' : modalType.includes('DEPT') ? 'e.g. CSE' : 'e.g. Operating Systems'}
                                    value={modalData.name}
                                    onChange={e => setModalData({ ...modalData, name: e.target.value })}
                                />
                            </div>
                            {(modalType === 'SUBJECT' || modalType === 'EDIT_SUBJECT') && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-300 ml-1">Subject Code</label>
                                        <input
                                            required
                                            className="glass-input w-full"
                                            placeholder="e.g. CS101"
                                            value={modalData.code}
                                            onChange={e => setModalData({ ...modalData, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-300 ml-1">Semester</label>
                                        <select
                                            className="glass-input w-full"
                                            value={modalData.semester}
                                            onChange={e => setModalData({ ...modalData, semester: e.target.value })}
                                        >
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all">Cancel</button>
                                <button type="submit" className="flex-1 glass-btn py-2.5">
                                    {modalType.startsWith('EDIT_') ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMaterials;
