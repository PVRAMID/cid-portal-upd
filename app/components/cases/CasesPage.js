// app/components/cases/CasesPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db, formatTimestamp, getStatusColor } from '../../lib/firebase';
import { FileText, User, ChevronsRight } from 'lucide-react';

export default function CasesPage({ navigateToDetail }) {
    const [cases, setCases] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.reduce((acc, doc) => ({...acc, [doc.id]: doc.data()}), {}));
        };
        fetchUsers();

        const q = query(collection(db, 'cases'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCases(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Case Files</h2>
            <div className="bg-gray-800 rounded-lg shadow">
                {loading ? <p className="p-6">Loading cases...</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="p-4">Case Title</th>
                                    <th className="p-4">Lead Detective</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date Opened</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cases.map(c => (
                                    <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="p-4 font-medium">{c.title}</td>
                                        <td className="p-4">{c.leadDetectiveName}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(c.status)}`}>{c.status}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{formatTimestamp(c.createdAt)}</td>
                                        <td className="p-4">
                                            <button onClick={() => navigateToDetail({type: 'case', item: c})} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                                Open File <ChevronsRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {cases.length === 0 && <p className="p-6 text-gray-400">No active cases found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}