// app/components/admin/RolePermissions.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import RoleEditForm from './RoleEditForm';
import { Edit, Trash2 } from 'lucide-react';

export default function RolePermissions() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'roles'), (snapshot) => {
            setRoles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleOpenCreate = () => {
        setSelectedRole(null);
        setEditModalOpen(true);
    };

    const handleOpenEdit = (role) => {
        setSelectedRole(role);
        setEditModalOpen(true);
    };

    const handleSaveRole = async (roleData) => {
        if (roleData.id) {
            // Update existing role
            const roleRef = doc(db, 'roles', roleData.id);
            await updateDoc(roleRef, { ...roleData, updatedAt: serverTimestamp() });
        } else {
            // Create new role
            await addDoc(collection(db, 'roles'), { ...roleData, createdAt: serverTimestamp() });
        }
        setEditModalOpen(false);
    };

    const handleDeleteRole = async (roleId) => {
        if (window.confirm("Are you sure you want to delete this role? This action cannot be undone.")) {
            await deleteDoc(doc(db, 'roles', roleId));
        }
    };

    return (
        <div>
            {isEditModalOpen && (
                <RoleEditForm
                    role={selectedRole}
                    onSave={handleSaveRole}
                    onCancel={() => setEditModalOpen(false)}
                />
            )}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Role Management</h3>
                <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Create New Role
                </button>
            </div>
            <div className="bg-gray-900/50 rounded-lg">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-3">Role Name</th>
                            <th className="p-3">Permissions</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center p-4">Loading Roles...</td></tr>
                        ) : (
                            roles.map(role => (
                                <tr key={role.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="p-3 font-semibold">{role.name}</td>
                                    <td className="p-3 text-sm text-gray-400">{role.permissions ? role.permissions.length : 0} permissions</td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEdit(role)} className="text-blue-400 hover:text-blue-300"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteRole(role.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}