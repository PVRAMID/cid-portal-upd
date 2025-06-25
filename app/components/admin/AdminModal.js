// app/components/admin/AdminModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import UserEditForm from './UserEditForm';
import UserCreationForm from './UserCreationForm';
import RolePermissions from './RolePermissions';
import { X, UserPlus, Users, Shield } from 'lucide-react';

export default function AdminModal({ onClose }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('list');
    const [editingUser, setEditingUser] = useState(null);
    const [activeTab, setActiveTab] = useState('users');

    // Create a map of role IDs to role names for easy lookup
    const roleMap = roles.reduce((acc, role) => {
        acc[role.id] = role.name;
        return acc;
    }, {});

    useEffect(() => {
        if (activeTab === 'users') {
            // Fetch roles once for the user list display
            const fetchRoles = async () => {
                const rolesSnapshot = await getDocs(collection(db, "roles"));
                setRoles(rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            };
            fetchRoles();
            
            // Set up listener for users
            const unsubscribe = onSnapshot(collection(db, "users"), (userSnapshot) => {
                setUsers(userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [activeTab]);

    const handleUpdateUser = async (userData) => {
        const userRef = doc(db, "users", userData.id);
        const updatedProfile = { ...userData };
        delete updatedProfile.id;
        await updateDoc(userRef, updatedProfile);
        setEditingUser(null);
        setView('list'); // Go back to the list view after saving
    };
    
    const handleCreationSuccess = () => setView('list');

    const renderUserManagement = () => {
        if (view === 'create') { return <UserCreationForm onSuccess={handleCreationSuccess} onCancel={() => setView('list')} />; }
        if (editingUser) { return <UserEditForm user={editingUser} onSave={handleUpdateUser} onCancel={() => setEditingUser(null)} />; }
        
        return (
            <div>
                <div className="flex justify-end mb-4"><button onClick={() => setView('create')} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"><UserPlus size={20} /> Create New User</button></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="p-3">Username</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Rank</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (<tr><td colSpan="6" className="text-center p-4">Loading Users...</td></tr>) :
                            (users.map(user => (
                                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.rank}</td>
                                    {/* Display the role name using the roleMap */}
                                    <td className="p-3">{roleMap[user.roleId] || 'No Role'}</td>
                                    <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td className="p-3"><button onClick={() => setEditingUser(user)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">Edit</button></td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return renderUserManagement();
            case 'roles':
                return <RolePermissions />;
            default:
                return null;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex">
                <div className="w-56 bg-gray-900/50 p-4 border-r border-gray-700 flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                    <nav className="flex flex-col gap-2">
                        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-md text-left ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
                            <Users size={20} />
                            User Management
                        </button>
                        <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-3 p-3 rounded-md text-left ${activeTab === 'roles' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
                            <Shield size={20} />
                            Role Permissions
                        </button>
                    </nav>
                    <button onClick={onClose} className="mt-auto flex items-center gap-3 p-3 rounded-md text-left text-red-400 hover:bg-gray-700">
                        <X size={20} />
                        Close Panel
                    </button>
                </div>
                <div className="flex-1 flex flex-col">
                    <div className="p-6 flex-grow overflow-y-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}