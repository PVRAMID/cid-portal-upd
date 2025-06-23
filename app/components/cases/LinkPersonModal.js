// app/components/cases/LinkPersonModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function LinkPersonModal({ onClose, onSave, currentPeople }) {
    const [people, setPeople] = useState([]);
    const [selectedPeople, setSelectedPeople] = useState(currentPeople || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPeople = async () => {
            const peopleSnapshot = await getDocs(collection(db, 'people'));
            setPeople(peopleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPeople();
    }, []);

    const handleSelectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedPeople(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(selectedPeople);
        setLoading(false);
        onClose();
    };

    return (
        <CreationModal title="Link People to Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select People</label>
                <select
                    multiple
                    value={selectedPeople}
                    onChange={handleSelectionChange}
                    className="w-full bg-gray-700 p-2 rounded-md h-48"
                >
                    {people.map(person => (
                        <option key={person.id} value={person.id}>
                            {person.firstName} {person.lastName} ({person.type})
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-2">Use Ctrl/Cmd to select multiple people.</p>
            </div>
        </CreationModal>
    );
}