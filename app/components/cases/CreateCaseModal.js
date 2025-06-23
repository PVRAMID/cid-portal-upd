// app/components/cases/CreateCaseModal.js
'use client';
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreateCaseModal({ onClose, userProfile }) {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await addDoc(collection(db, 'cases'), { title, details, status: 'Open', leadDetective: userProfile.uid, leadDetectiveName: `${userProfile.firstName} ${userProfile.lastName}`, createdAt: serverTimestamp(), lastActionAt: serverTimestamp(), tasks: [], people: [], evidence: [] });
            onClose();
        } catch (error) { console.error("Error creating case:", error); }
        setLoading(false);
    };
    return ( <CreationModal title="Create New Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Case Title</label> <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 p-2 rounded-md" /> </div> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Case Details</label> <textarea value={details} onChange={e => setDetails(e.target.value)} rows="5" required className="w-full bg-gray-700 p-2 rounded-md"></textarea> </div> </CreationModal> );
}