// app/components/cases/RenameCaseModal.js
'use client';
import React, { useState } from 'react';
import CreationModal from '../shared/CreationModal';

export default function RenameCaseModal({ onClose, onSave, currentTitle }) {
    const [newTitle, setNewTitle] = useState(currentTitle);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(newTitle);
        setLoading(false);
        onClose();
    };

    return (
        <CreationModal title="Rename Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Case Title</label>
                <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-gray-700 p-2 rounded-md"
                />
            </div>
        </CreationModal>
    );
}