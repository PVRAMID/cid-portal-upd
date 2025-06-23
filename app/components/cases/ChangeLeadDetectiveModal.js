// app/components/cases/ChangeLeadDetectiveModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function ChangeLeadDetectiveModal({ onClose, onSave, currentLead }) {
    const [users, setUsers] = useState([]);
    const [selectedLead, setSelectedLead] = useState(currentLead);
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
        const selectedUser = users.find(u => u.id === selectedLead);
        await onSave(selectedLead, `${selectedUser.firstName} ${selectedUser.lastName}`);
        setLoading(false);
        onClose();
    };

    return (
        <CreationModal title="Change Lead Detective" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select New Lead Detective</label>
                <select
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded-md"
                >
                    {users.filter(u => u.isActive).map(user => (
                        <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
            </div>
        </CreationModal>
    );
}