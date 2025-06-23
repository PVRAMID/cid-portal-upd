// app/components/vehicles/CreateVehicleModal.js
'use client';
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreateVehicleModal({ onClose }) {
    const [formData, setFormData] = useState({ make: '', model: '', plate: '', status: 'None' });
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await addDoc(collection(db, 'vehicles'), { ...formData, createdAt: serverTimestamp() });
            onClose();
        } catch (error) { console.error("Error creating vehicle:", error); }
        setLoading(false);
    };
    return ( <CreationModal title="Create New Vehicle Entry" onClose={onClose} onSubmit={handleSubmit} loading={loading}> <div className="grid grid-cols-2 gap-4"> <input name="make" onChange={handleChange} placeholder="Make (e.g., Bravado)" required className="bg-gray-700 p-2 rounded-md"/> <input name="model" onChange={handleChange} placeholder="Model (e.g., Buffalo)" required className="bg-gray-700 p-2 rounded-md"/> </div> <input name="plate" onChange={handleChange} placeholder="License Plate" required className="bg-gray-700 p-2 rounded-md"/> <select name="status" onChange={handleChange} value={formData.status} className="w-full bg-gray-700 p-2 rounded-md"> <option>None</option><option>Stolen</option><option>Wanted</option><option>Impounded</option><option>Linked to Crime</option> </select> </CreationModal> );
}