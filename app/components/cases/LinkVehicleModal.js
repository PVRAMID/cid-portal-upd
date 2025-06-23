// app/components/cases/LinkVehicleModal.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import CreationModal from '../shared/CreationModal';

export default function LinkVehicleModal({ onClose, onSave, currentVehicles }) {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState(currentVehicles || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVehicles = async () => {
            const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
            setVehicles(vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchVehicles();
    }, []);

    const handleSelectionChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedVehicles(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(selectedVehicles);
        setLoading(false);
        onClose();
    };

    return (
        <CreationModal title="Link Vehicles to Case" onClose={onClose} onSubmit={handleSubmit} loading={loading}>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Select Vehicles</label>
                <select
                    multiple
                    value={selectedVehicles}
                    onChange={handleSelectionChange}
                    className="w-full bg-gray-700 p-2 rounded-md h-48"
                >
                    {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} ({vehicle.plate})
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-2">Use Ctrl/Cmd to select multiple vehicles.</p>
            </div>
        </CreationModal>
    );
}