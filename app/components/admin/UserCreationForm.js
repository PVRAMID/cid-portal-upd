// app/components/admin/UserCreationForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// NOTE: Creating users via the client SDK like this is generally not recommended for production apps
// as it requires broader auth permissions. A backend function is a more secure approach.
// This is a temporary solution for the purpose of this tool.
const tempAuth = getAuth(db.app);

export default function UserCreationForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', rank: 'Probationary Detective', cellNumber: '', roleId: '', isActive: true });
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password.length < 6) { setError("Password must be at least 6 characters long."); return; }
        if (!formData.roleId) { setError("You must assign a role."); return; }
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(tempAuth, formData.email, formData.password);
            const newFirebaseUser = userCredential.user;
            const username = `${formData.firstName.toLowerCase().replace(/\s/g, '')}.${formData.lastName.toLowerCase().replace(/\s/g, '')}`;
            
            const newUserProfile = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                rank: formData.rank,
                cellNumber: formData.cellNumber,
                roleId: formData.roleId,
                isActive: formData.isActive,
                username: username,
            };
            
            await setDoc(doc(db, "users", newFirebaseUser.uid), newUserProfile);
            await signOut(tempAuth); // Sign out the temporary user
            onSuccess();
        } catch (err) {
            setError(err.message);
            console.error("Error creating user:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Create New User Account</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="bg-gray-700 p-2 rounded-md" />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="bg-gray-700 p-2 rounded-md" />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="bg-gray-700 p-2 rounded-md" />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Initial Password" required className="bg-gray-700 p-2 rounded-md" />
                    <input name="rank" value={formData.rank} onChange={handleChange} placeholder="Rank" className="bg-gray-700 p-2 rounded-md" />
                    <input name="cellNumber" value={formData.cellNumber} onChange={handleChange} placeholder="Cell #" className="bg-gray-700 p-2 rounded-md" />
                    <select name="roleId" value={formData.roleId} onChange={handleChange} required className="bg-gray-700 p-2 rounded-md">
                        <option value="">Select a Role...</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div className="flex items-center"><input type="checkbox" id="isActiveCreate" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="isActiveCreate" className="ml-2 block text-sm text-gray-300">Account Active</label></div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-wait">{loading ? 'Creating...' : 'Create User'}</button>
                </div>
            </form>
        </div>
    );
}