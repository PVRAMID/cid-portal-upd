// app/components/people/CreatePersonModal.js
'use client';
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreatePersonModal({ onClose }) {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', type: 'Witness' });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await addDoc(collection(db, 'people'), { ...formData, createdAt: serverTimestamp() });
            onClose();
        } catch (error) { console.error("Error creating person:", error); }
        setLoading(false);
    };
    return ( <CreationModal title="Create New Person of Interest" onClose={onClose} onSubmit={handleSubmit} loading={loading}> <div className="grid grid-cols-2 gap-4"> <input name="firstName" onChange={handleChange} placeholder="First Name" required className="bg-gray-700 p-2 rounded-md"/> <input name="lastName" onChange={handleChange} placeholder="Last Name" required className="bg-gray-700 p-2 rounded-md"/> </div> <select name="type" onChange={handleChange} value={formData.type} className="w-full bg-gray-700 p-2 rounded-md"> <option>Witness</option><option>Victim</option><option>Suspect</option><option>Person of Interest</option> </select> <textarea name="notes" onChange={handleChange} placeholder="Initial Notes..." rows="4" className="w-full bg-gray-700 p-2 rounded-md"></textarea> </CreationModal> );
}