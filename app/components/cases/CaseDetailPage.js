// app/components/cases/CaseDetailPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db, formatTimestamp } from '../../lib/firebase';
import DetailPageWrapper from '../shared/DetailPageWrapper';
import DetailSection from '../shared/DetailSection';
import { Info, Calendar, ClipboardList, Users, FileText } from 'lucide-react';

export default function CaseDetailPage({ item, onBack, navigateToDetail }) {
    const [caseData, setCaseData] = useState(null);
    const [linkedTasks, setLinkedTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const caseRef = doc(db, 'cases', item.id);
        const unsubscribe = onSnapshot(caseRef, (caseDoc) => {
            if (caseDoc.exists()) {
                const data = { id: caseDoc.id, ...caseDoc.data() };
                setCaseData(data);
                if (data.tasks && data.tasks.length > 0) {
                    const tasksQuery = query(collection(db, 'tasks'), where('__name__', 'in', data.tasks));
                    onSnapshot(tasksQuery, (taskSnapshot) => {
                        setLinkedTasks(taskSnapshot.docs.map(d => ({id: d.id, ...d.data()})));
                    });
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [item.id]);

    if (loading) return <div className="text-center p-10">Loading Case File...</div>;
    if (!caseData) return <div className="text-center p-10 text-red-500">Case not found.</div>;
    
    return (
        <DetailPageWrapper title={caseData.title} onBack={onBack}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <DetailSection title="Case Details" icon={<Info size={20}/>}><p className="text-gray-300 whitespace-pre-wrap">{caseData.details}</p></DetailSection>
                     <DetailSection title="Linked Tasks" icon={<ClipboardList size={20}/>}>
                        {linkedTasks.length > 0 ? (linkedTasks.map(task => (<div key={task.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'task', item: task})}>{task.description} - <span className="text-sm text-gray-400">{task.status}</span></div>))) : <p className="text-gray-400">No tasks linked to this case.</p>}
                    </DetailSection>
                    <DetailSection title="Linked People" icon={<Users size={20}/>}><p className="text-gray-400">Feature to link people coming soon.</p></DetailSection>
                    <DetailSection title="Evidence" icon={<FileText size={20}/>}><p className="text-gray-400">Feature to upload and manage evidence coming soon.</p></DetailSection>
                </div>
                <div>
                     <DetailSection title="Case Information" icon={<Calendar size={20}/>}>
                        <ul className="space-y-2">
                            <li><strong>Status:</strong> <span className={`px-2 py-1 text-xs rounded-full ${caseData.status === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}>{caseData.status}</span></li>
                            <li><strong>Lead Detective:</strong> {caseData.leadDetectiveName}</li>
                            <li><strong>Date Opened:</strong> {formatTimestamp(caseData.createdAt)}</li>
                            <li><strong>Last Action:</strong> {formatTimestamp(caseData.lastActionAt)}</li>
                        </ul>
                    </DetailSection>
                </div>
            </div>
        </DetailPageWrapper>
    );
}