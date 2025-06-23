// app/components/tasks/CreateTaskModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreateTaskModal({ onClose, userProfile }) {
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState(userProfile.uid);
    const [linkedCase, setLinkedCase] = useState('');
    const [users, setUsers] = useState([]);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchPrereqs = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            const casesSnapshot = await getDocs(collection(db, 'cases'));
            setCases(casesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPrereqs();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true);
        try {
            await addDoc(collection(db, 'tasks'), { description, assignedTo, linkedCase, status: 'Pending', createdBy: userProfile.uid, createdAt: serverTimestamp() });
            onClose();
        } catch (error) { console.error("Error creating task:", error); }
        setLoading(false);
    };
    return ( <CreationModal title="Create New Task" onClose={onClose} onSubmit={handleSubmit} loading={loading}> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Task Description</label> <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" required className="w-full bg-gray-700 p-2 rounded-md"></textarea> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label> <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md"> {users.filter(u => u.isActive).map(user => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)} </select> </div> <div> <label className="block text-sm font-medium text-gray-300 mb-1">Link to Case</label> <select value={linkedCase} onChange={e => setLinkedCase(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md"> <option value="">None</option> {cases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)} </select> </div> </div> </CreationModal> );
}
