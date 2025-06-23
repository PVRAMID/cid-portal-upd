// app/components/cases/CreateCaseModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreateCaseModal({ onClose, userProfile }) {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [involvedDetectives, setInvolvedDetectives] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchUsers();
    }, []);

    const handleInvolvedChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setInvolvedDetectives(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await addDoc(collection(db, 'cases'), {
                title,
                details,
                status: 'Open',
                leadDetective: userProfile.uid,
                leadDetectiveName: `${userProfile.firstName} ${userProfile.lastName}`,
                involvedDetectives,
                createdAt: serverTimestamp(),
                lastActionAt: serverTimestamp(),
                tasks: [],
                people: [],
                evidence: []
            });
            onClose();
        } catch (error) { console.error("Error creating case:", error); }
        setLoading(false);
    };
    return (
        <CreationModal title="Create New Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Case Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required className="w-full bg-gray-700 p-2 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Case Details</label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows="5" required className="w-full bg-gray-700 p-2 rounded-md"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Involved Detectives</label>
                <select multiple value={involvedDetectives} onChange={handleInvolvedChange} className="w-full bg-gray-700 p-2 rounded-md h-32">
                    {users.filter(u => u.isActive).map(user => (
                        <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                    ))}
                </select>
            </div>
        </CreationModal>
    );
}