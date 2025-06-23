// app/components/tasks/CreateTaskForCaseModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function CreateTaskForCaseModal({ onClose, onSave, userProfile, caseId }) {
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState(userProfile.uid);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newTask = {
                description,
                assignedTo,
                linkedCase: caseId,
                status: 'Pending',
                createdBy: userProfile.uid,
                createdAt: serverTimestamp()
            };
            await onSave(newTask);
            onClose();
        } catch (error) {
            console.error("Error creating task:", error);
        }
        setLoading(false);
    };

    return (
        <CreationModal title="Create New Task for Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Task Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="3" required className="w-full bg-gray-700 p-2 rounded-md"></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} className="w-full bg-gray-700 p-2 rounded-md">
                    {users.filter(u => u.isActive).map(user => (
                        <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
                    ))}
                </select>
            </div>
        </CreationModal>
    );
}