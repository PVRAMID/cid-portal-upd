// app/components/vehicles/VehiclesPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function VehiclesPage({ navigateToDetail }) {
    const [vehicles, setVehicles] = useState([]); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const q = query(collection(db, 'vehicles'));
        const unsubscribe = onSnapshot(q, (snapshot) => { setVehicles(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); setLoading(false); });
        return () => unsubscribe();
    }, []);
    return ( <div><h2 className="text-3xl font-bold mb-6">Vehicle Database</h2><div className="bg-gray-800 rounded-lg shadow p-6"> <div className="mb-4 flex flex-wrap gap-4 opacity-50"><input type="text" placeholder="Search by plate..." className="bg-gray-700 p-2 rounded-md" /><button className="bg-blue-600 text-white p-2 rounded-md">Filter</button></div> {loading ? <p>Loading vehicles...</p> : ( vehicles.length > 0 ? vehicles.map(v => ( <div key={v.id} className="mb-2 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'vehicle', item: v})}> <h3 className="font-bold text-lg">{v.make} {v.model}</h3> <p className="text-sm text-gray-400">Plate: {v.plate} | Status: {v.status}</p> </div>)) : <p className="text-gray-400">No vehicles found in database.</p> )}</div></div> );
}