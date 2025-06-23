// app/components/admin/AdminModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import UserEditForm from './UserEditForm';
import UserCreationForm from './UserCreationForm';
import { X, UserPlus } from 'lucide-react';

export default function AdminModal({ onClose }) {
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [view, setView] = useState('list'); 
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => { 
        setLoading(true); 
        const userSnapshot = await getDocs(collection(db, "users")); 
        setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
        setLoading(false); 
    };

    useEffect(() => { if(view === 'list') { fetchUsers(); } }, [view]);
    
    const handleUpdateUser = async (userData) => { 
        const userRef = doc(db, "users", userData.id); 
        const updatedProfile = { ...userData }; 
        delete updatedProfile.id; 
        await updateDoc(userRef, updatedProfile); 
        setEditingUser(null); 
        fetchUsers(); 
    };
    
    const handleCreationSuccess = () => setView('list');

    const renderContent = () => { 
        if (view === 'create') { return <UserCreationForm onSuccess={handleCreationSuccess} onCancel={() => setView('list')} />; } 
        if (editingUser) { return <UserEditForm user={editingUser} onSave={handleUpdateUser} onCancel={() => setEditingUser(null)} />; } 
        return ( 
            <div className="overflow-x-auto"> 
                <div className="flex justify-end mb-4"><button onClick={() => setView('create')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"><UserPlus size={20} /> Create New User</button></div> 
                <table className="w-full text-left">
                    <thead className="bg-gray-700"><tr><th className="p-3">Username</th><th className="p-3">Email</th><th className="p-3">Rank</th><th className="p-3">Permissions</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="6" className="text-center p-4">Loading Users...</td></tr>) : 
                        (users.map(user => (<tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50"><td className="p-3">{user.username}</td><td className="p-3">{user.email}</td><td className="p-3">{user.rank}</td><td className="p-3">{user.permissionLevel}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td className="p-3"><button onClick={() => setEditingUser(user)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Edit</button></td></tr>)))}
                    </tbody>
                </table>
            </div> 
        ); 
    };
    
    return ( <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"><div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col"><div className="p-4 border-b border-gray-700 flex justify-between items-center"><h2 className="text-2xl font-bold">Admin Panel: User Management</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><X size={24} /></button></div><div className="p-6 flex-grow overflow-y-auto">{renderContent()}</div></div></div> );
}