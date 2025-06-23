'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import StatCard from './StatCard';
import DashboardSection from './DashboardSection';

export default function Dashboard({ navigateToDetail, userProfile }) {
    const [myCases, setMyCases] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [stats, setStats] = useState({ cases: 0, people: 0, vehicles: 0 });

    useEffect(() => {
        const casesQuery = query(collection(db, 'cases'), where('leadDetective', '==', userProfile.uid), where('status', '==', 'Open'));
        const unsubscribeCases = onSnapshot(casesQuery, (snapshot) => setMyCases(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))));

        const tasksQuery = query(collection(db, 'tasks'), where('assignedTo', '==', userProfile.uid), where('status', '==', 'Pending'));
        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => setMyTasks(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))));
        
        const unsubscribeStatsCases = onSnapshot(collection(db, 'cases'), snapshot => setStats(s => ({...s, cases: snapshot.size})));
        const unsubscribeStatsPeople = onSnapshot(collection(db, 'people'), snapshot => setStats(s => ({...s, people: snapshot.size})));
        const unsubscribeStatsVehicles = onSnapshot(collection(db, 'vehicles'), snapshot => setStats(s => ({...s, vehicles: snapshot.size})));

        return () => { 
            unsubscribeCases(); 
            unsubscribeTasks(); 
            unsubscribeStatsCases(); 
            unsubscribeStatsPeople(); 
            unsubscribeStatsVehicles(); 
        };
    }, [userProfile.uid]);

    const getWelcomeMessage = (profile) => {
        if (profile && profile.firstName && profile.lastName && profile.rank !== 'Unassigned') {
            const firstInitial = profile.firstName.charAt(0).toUpperCase();
            return `Welcome Back, ${profile.rank} ${firstInitial}. ${profile.lastName}.`;
        }
        return `Welcome Back, ${profile.firstName || profile.email}.`;
    };

    return(
        <div>
            <h2 className="text-3xl font-bold mb-2">User Dashboard</h2>
            <p className="text-gray-400 mb-6">{getWelcomeMessage(userProfile)}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Active Cases" value={stats.cases} />
                <StatCard title="People in Database" value={stats.people} />
                <StatCard title="Vehicles in Database" value={stats.vehicles} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <DashboardSection title="My Outstanding Cases">
                    {myCases.length > 0 ? (myCases.map(c => <div key={c.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'case', item: c})}>{c.title}</div>)) : (<p className="text-gray-400">No outstanding cases assigned to you.</p>)}
                </DashboardSection>
                <DashboardSection title="My Outstanding Tasks">
                    {myTasks.length > 0 ? (myTasks.map(t => <div key={t.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'task', item: t})}>{t.description}</div>)) : (<p className="text-gray-400">No outstanding tasks assigned to you.</p>)}
                </DashboardSection>
                <DashboardSection title="Documents Under Review">
                    <p className="text-gray-400">Functionality not yet implemented.</p>
                </DashboardSection>
                <DashboardSection title="CID Chat">
                    <div className="h-64 bg-gray-800 p-2 rounded-lg flex flex-col">
                        <div className="flex-grow overflow-y-auto">
                            <p className="text-gray-400 text-center p-4">Chat history will load here.</p>
                        </div>
                        <div className="mt-2 flex">
                            <input type="text" placeholder="Type a message..." className="w-full bg-gray-700 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md">Send</button>
                        </div>
                    </div>
                </DashboardSection>
            </div>
        </div>
    );
}
