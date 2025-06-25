// app/components/admin/UserEditForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function UserEditForm({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState(user);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            const rolesSnapshot = await getDocs(collection(db, 'roles'));
            setRoles(rolesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = `${formData.firstName.toLowerCase().replace(/\s/g, '')}.${formData.lastName.toLowerCase().replace(/\s/g, '')}`;
        onSave({ ...formData, username: username });
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Editing User: {user.firstName} {user.lastName}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="bg-gray-700 p-2 rounded-md" />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="bg-gray-700 p-2 rounded-md" />
                    <input name="rank" value={formData.rank} onChange={handleChange} placeholder="Rank" className="bg-gray-700 p-2 rounded-md" />
                    <input name="cellNumber" value={formData.cellNumber} onChange={handleChange} placeholder="Cell #" className="bg-gray-700 p-2 rounded-md" />
                    <input name="email" value={formData.email} disabled placeholder="Email Address" className="bg-gray-900 p-2 rounded-md cursor-not-allowed" />
                    <select name="roleId" value={formData.roleId} onChange={handleChange} className="bg-gray-700 p-2 rounded-md">
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">Account Active</label>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">Save Changes</button>
                </div>
            </form>
        </div>
    );
}