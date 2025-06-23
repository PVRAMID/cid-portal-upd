// app/components/cases/AddInvolvedDetectiveModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function AddInvolvedDetectiveModal({ onClose, onSave, currentDetectives }) {
    const [users, setUsers] = useState([]);
    const [selectedDetectives, setSelectedDetectives] = useState(currentDetectives || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchUsers();
    }, []);

    const handleSelectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedDetectives(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(selectedDetectives);
        setLoading(false);
        onClose();
    };

    const availableUsers = users.filter(u => u.isActive && !currentDetectives.includes(u.id));

    return (
        <CreationModal title="Add Involved Detectives" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Detectives to Add</label>
                <select
                    multiple
                    value={selectedDetectives}
                    onChange={handleSelectionChange}
                    className="w-full bg-gray-700 p-2 rounded-md h-48"
                >
                    {users.filter(u => u.isActive).map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-2">Use Ctrl/Cmd to select multiple detectives.</p>
            </div>
        </CreationModal>
    );
}