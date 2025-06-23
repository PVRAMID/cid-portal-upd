// app/components/cases/CasesPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CasesPage({ navigateToDetail }) {
    const [cases, setCases] = useState([]); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const q = query(collection(db, 'cases'));
        const unsubscribe = onSnapshot(q, (snapshot) => { 
            setCases(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); 
            setLoading(false); 
        });
        return () => unsubscribe();
    }, []);
    return ( <div><h2 className="text-3xl font-bold mb-6">Active Cases</h2><div className="bg-gray-800 rounded-lg shadow p-6">{loading ? <p>Loading cases...</p> : (cases.length > 0 ? cases.map(c => (<div key={c.id} className="mb-2 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'case', item: c})}> <h3 className="font-bold text-lg">{c.title}</h3> <p className="text-sm text-gray-400">Status: {c.status} | Assigned: {c.leadDetectiveName}</p> </div>)) : <p className="text-gray-400">No active cases found.</p> )}</div></div> );
}