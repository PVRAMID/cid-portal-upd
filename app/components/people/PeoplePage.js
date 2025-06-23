// app/components/people/PeoplePage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function PeoplePage({ navigateToDetail }) {
    const [people, setPeople] = useState([]); 
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const q = query(collection(db, 'people'));
        const unsubscribe = onSnapshot(q, (snapshot) => { setPeople(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); setLoading(false); });
        return () => unsubscribe();
    }, []);
    return ( <div><h2 className="text-3xl font-bold mb-6">People Database</h2><div className="bg-gray-800 rounded-lg shadow p-6"> <div className="mb-4 flex flex-wrap gap-4 opacity-50"><input type="text" placeholder="Search by name..." className="bg-gray-700 p-2 rounded-md" /><select className="bg-gray-700 p-2 rounded-md"><option>Type (All)</option></select><button className="bg-blue-600 text-white p-2 rounded-md">Filter</button></div> {loading ? <p>Loading people...</p> : (people.length > 0 ? people.map(p => ( <div key={p.id} className="mb-2 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'person', item: p})}> <h3 className="font-bold text-lg">{p.firstName} {p.lastName}</h3> <p className="text-sm text-gray-400">Type: {p.type}</p> </div>)) : <p className="text-gray-400">No people found in database.</p> )}</div></div> );
}