// app/components/tasks/TaskDetailPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, formatTimestamp } from '../../lib/firebase';
import DetailPageWrapper from '../shared/DetailPageWrapper';
import DetailSection from '../shared/DetailSection';
import { Info, Calendar } from 'lucide-react';

export default function TaskDetailPage({ item, onBack }) {
    const [taskData, setTaskData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const taskRef = doc(db, 'tasks', item.id);
        const unsubscribe = onSnapshot(taskRef, async (taskSnapshot) => {
            if (taskSnapshot.exists()) {
                const data = { id: taskSnapshot.id, ...taskSnapshot.data() };
                if (data.assignedTo) {
                    const userSnap = await getDoc(doc(db, 'users', data.assignedTo));
                    data.assignedToName = userSnap.exists() ? userSnap.data().username : 'Unknown';
                }
                if (data.linkedCase) {
                    const caseSnap = await getDoc(doc(db, 'cases', data.linkedCase));
                    data.linkedCaseTitle = caseSnap.exists() ? caseSnap.data().title : 'Unknown';
                }
                setTaskData(data);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [item.id]);

    if (loading) return <div className="text-center p-10">Loading Task...</div>;
    if (!taskData) return <div className="text-center p-10 text-red-500">Task not found.</div>;

    return (
        <DetailPageWrapper title="Task Details" onBack={onBack}>
            <DetailSection title="Description" icon={<Info size={20}/>}><p className="text-gray-300 text-lg">{taskData.description}</p></DetailSection>
            <DetailSection title="Information" icon={<Calendar size={20}/>}>
                 <ul className="space-y-2">
                    <li><strong>Status:</strong> <span className={`px-2 py-1 text-xs rounded-full ${taskData.status === 'Pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>{taskData.status}</span></li>
                    <li><strong>Assigned To:</strong> {taskData.assignedToName}</li>
                    <li><strong>Created At:</strong> {formatTimestamp(taskData.createdAt)}</li>
                    {taskData.linkedCase && (<li><strong>Linked Case:</strong> {taskData.linkedCaseTitle}</li>)}
                </ul>
            </DetailSection>
        </DetailPageWrapper>
    );
};