// app/components/tasks/TasksPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function TasksPage({ navigateToDetail }) {
    const [tasks, setTasks] = useState([]); 
    const [users, setUsers] = useState({}); 
    const [cases, setCases] = useState({}); 
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchRelatedData = async () => {
             const usersSnapshot = await getDocs(collection(db, 'users'));
             setUsers(usersSnapshot.docs.reduce((acc, doc) => ({...acc, [doc.id]: doc.data()}), {}));
             const casesSnapshot = await getDocs(collection(db, 'cases'));
             setCases(casesSnapshot.docs.reduce((acc, doc) => ({...acc, [doc.id]: doc.data()}), {}));
        };
        fetchRelatedData();
        const q = query(collection(db, 'tasks'));
        const unsubscribe = onSnapshot(q, (snapshot) => { setTasks(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))); setLoading(false); });
        return () => unsubscribe();
    }, []);
    return ( <div><h2 className="text-3xl font-bold mb-6">Active Tasks</h2><div className="bg-gray-800 rounded-lg shadow p-6">{loading ? <p>Loading tasks...</p> : (tasks.length > 0 ? tasks.map(t => (<div key={t.id} className="mb-2 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'task', item: t})}> <h3 className="font-bold text-lg">{t.description}</h3> <p className="text-sm text-gray-400"> Status: {t.status} | Assigned: {users[t.assignedTo]?.username || 'N/A'} {t.linkedCase && ` | Case: ${cases[t.linkedCase]?.title || 'N/A'}`} </p> </div>)) : <p className="text-gray-400">No active tasks found.</p> )}</div></div> );
}