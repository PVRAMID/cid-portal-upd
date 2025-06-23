// app/components/admin/UserCreationForm.js
'use client';
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const firebaseConfig = { // This needs to be redefined here for the temporary app instance
  apiKey: "AIzaSyCq2jkYEqH35eDh6fEEsYNHPtWPppp-xvw",
  authDomain: "cid-portal.firebaseapp.com",
  projectId: "cid-portal",
  storageBucket: "cid-portal.appspot.com",
  messagingSenderId: "221164463425",
  appId: "1:221164463425:web:e41dbe250b4c466b23edc0",
  measurementId: "G-GX6XCDNS3X"
};

export default function UserCreationForm({ onSuccess, onCancel }) {
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', rank: 'Probationary Detective', cellNumber: '', permissionLevel: 1, isActive: true }); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false);
    
    const handleChange = (e) => { 
        const { name, value, type, checked } = e.target; 
        const newValue = type === 'checkbox' ? checked : (name === 'permissionLevel' ? Number(value) : value); 
        setFormData(prev => ({ ...prev, [name]: newValue })); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setError(''); 
        if (formData.password.length < 6) { setError("Password must be at least 6 characters long."); return; } 
        setLoading(true);
        const tempAppName = `temp-user-creation-${Date.now()}`; 
        const tempApp = initializeApp(firebaseConfig, tempAppName); 
        const tempAuth = getAuth(tempApp);
        try {
            const userCredential = await createUserWithEmailAndPassword(tempAuth, formData.email, formData.password); 
            const newFirebaseUser = userCredential.user;
            const username = `${formData.firstName.toLowerCase().replace(/\s/g, '')}.${formData.lastName.toLowerCase().replace(/\s/g, '')}`;
            const newUserProfile = { email: formData.email, firstName: formData.firstName, lastName: formData.lastName, rank: formData.rank, cellNumber: formData.cellNumber, permissionLevel: formData.permissionLevel, isActive: formData.isActive, username: username, };
            await setDoc(doc(db, "users", newFirebaseUser.uid), newUserProfile); 
            await signOut(tempAuth); 
            onSuccess();
        } catch (err) { 
            setError(err.message); 
            console.error("Error creating user:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    return ( <div><h3 className="text-xl font-bold mb-4">Create New User Account</h3><form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="bg-gray-700 p-2 rounded-md" /><input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="bg-gray-700 p-2 rounded-md" /><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="bg-gray-700 p-2 rounded-md" /><input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Initial Password" required className="bg-gray-700 p-2 rounded-md" /><input name="rank" value={formData.rank} onChange={handleChange} placeholder="Rank" className="bg-gray-700 p-2 rounded-md" /><input name="cellNumber" value={formData.cellNumber} onChange={handleChange} placeholder="Cell #" className="bg-gray-700 p-2 rounded-md" /><select name="permissionLevel" value={formData.permissionLevel} onChange={handleChange} className="bg-gray-700 p-2 rounded-md">{[...Array(11).keys()].map(i => <option key={i} value={i}>{i === 0 ? '0 (No Access)' : `Level ${i}`}</option>)}</select></div><div className="flex items-center"><input type="checkbox" id="isActiveCreate" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><label htmlFor="isActiveCreate" className="ml-2 block text-sm text-gray-300">Account Active</label></div>{error && <p className="text-red-500 text-sm text-center">{error}</p>}<div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button><button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-green-800 disabled:cursor-wait">{loading ? 'Creating...' : 'Create User'}</button></div></form></div> )
}