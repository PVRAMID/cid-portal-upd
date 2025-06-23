// app/components/cases/CaseDetailPage.js
'use client';
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, updateDoc, arrayUnion, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, formatTimestamp, getStatusColor } from '../../lib/firebase';
import DetailPageWrapper from '../shared/DetailPageWrapper';
import DetailSection from '../shared/DetailSection';
import AddInvolvedDetectiveModal from './AddInvolvedDetectiveModal';
import RenameCaseModal from './RenameCaseModal';
import ChangeLeadDetectiveModal from './ChangeLeadDetectiveModal';
import LinkPersonModal from './LinkPersonModal';
import LinkVehicleModal from './LinkVehicleModal';
import CreateTaskForCaseModal from '../tasks/CreateTaskForCaseModal';
import { Info, Calendar, ClipboardList, Users, Car, FileText, Paperclip, MessageSquare, Plus, Send, ChevronDown } from 'lucide-react';

export default function CaseDetailPage({ item, onBack, navigateToDetail, userProfile }) {
    const [caseData, setCaseData] = useState(null);
    const [linkedTasks, setLinkedTasks] = useState([]);
    const [linkedPeople, setLinkedPeople] = useState([]);
    const [linkedVehicles, setLinkedVehicles] = useState([]);
    const [involvedDetectives, setInvolvedDetectives] = useState([]);
    const [caseLog, setCaseLog] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [evidenceFile, setEvidenceFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modal and Dropdown states
    const [isAddDetectiveModalOpen, setAddDetectiveModalOpen] = useState(false);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [isChangeLeadModalOpen, setChangeLeadModalOpen] = useState(false);
    const [isLinkPersonModalOpen, setLinkPersonModalOpen] = useState(false);
    const [isLinkVehicleModalOpen, setLinkVehicleModalOpen] = useState(false);
    const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
    const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);

    useEffect(() => {
        const caseRef = doc(db, 'cases', item.id);
        const unsubscribe = onSnapshot(caseRef, async (caseDoc) => {
            if (caseDoc.exists()) {
                const data = { id: caseDoc.id, ...caseDoc.data() };
                setCaseData(data);

                if (data.tasks && data.tasks.length > 0) {
                    onSnapshot(query(collection(db, 'tasks'), where('__name__', 'in', data.tasks)), (snapshot) => setLinkedTasks(snapshot.docs.map(d => ({id: d.id, ...d.data()}))));
                } else { setLinkedTasks([]); }
                
                if (data.people && data.people.length > 0) {
                    onSnapshot(query(collection(db, 'people'), where('__name__', 'in', data.people)), (snapshot) => setLinkedPeople(snapshot.docs.map(d => ({id: d.id, ...d.data()}))));
                } else { setLinkedPeople([]); }

                if (data.vehicles && data.vehicles.length > 0) {
                    onSnapshot(query(collection(db, 'vehicles'), where('__name__', 'in', data.vehicles)), (snapshot) => setLinkedVehicles(snapshot.docs.map(d => ({id: d.id, ...d.data()}))));
                } else { setLinkedVehicles([]); }

                if (data.involvedDetectives && data.involvedDetectives.length > 0) {
                    const usersSnapshot = await getDocs(query(collection(db, 'users'), where('__name__', 'in', data.involvedDetectives)));
                    setInvolvedDetectives(usersSnapshot.docs.map(d => ({id: d.id, ...d.data()})));
                } else { setInvolvedDetectives([]); }
            }
            setLoading(false);
        });

        const logQuery = query(collection(db, 'cases', item.id, 'log'), { orderBy: 'timestamp', direction: 'desc' });
        const unsubscribeLog = onSnapshot(logQuery, (snapshot) => setCaseLog(snapshot.docs.map(d => ({id: d.id, ...d.data()}))));

        const commentsQuery = query(collection(db, 'cases', item.id, 'comments'), { orderBy: 'createdAt', direction: 'asc' });
        const unsubscribeComments = onSnapshot(commentsQuery, (snapshot) => setComments(snapshot.docs.map(d => ({id: d.id, ...d.data()}))));

        return () => { unsubscribe(); unsubscribeLog(); unsubscribeComments(); }
    }, [item.id]);

    const handleAddLog = async (change) => {
        await addDoc(collection(db, 'cases', item.id, 'log'), {
            change, user: `${userProfile.firstName} ${userProfile.lastName}`, timestamp: serverTimestamp()
        });
    };
    
    const handleEvidenceUpload = async () => {
        if (!evidenceFile) return;
        setUploading(true);
        const storageRef = ref(storage, `evidence/${item.id}/${evidenceFile.name}`);
        await uploadBytes(storageRef, evidenceFile);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(doc(db, 'cases', item.id), {
            evidence: arrayUnion({ name: evidenceFile.name, url: downloadURL, uploadedBy: userProfile.uid, uploadedAt: serverTimestamp() })
        });
        await handleAddLog(`Uploaded evidence: ${evidenceFile.name}`);
        setEvidenceFile(null);
        setUploading(false);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") return;
        await addDoc(collection(db, "cases", item.id, "comments"), { text: newComment, author: userProfile.uid, authorName: `${userProfile.firstName} ${userProfile.lastName}`, createdAt: serverTimestamp() });
        await handleAddLog(`Added comment: "${newComment.substring(0, 30)}..."`);
        setNewComment("");
    };
    
    const handleRenameCase = async (newTitle) => {
        await updateDoc(doc(db, 'cases', item.id), { title: newTitle });
        await handleAddLog(`Renamed case to "${newTitle}"`);
    };

    const handleChangeLeadDetective = async (newLeadId, newLeadName) => {
        await updateDoc(doc(db, 'cases', item.id), { leadDetective: newLeadId, leadDetectiveName: newLeadName });
        await handleAddLog(`Changed lead detective to ${newLeadName}`);
    };
    
    const handleSaveInvolvedDetectives = async (detectiveIds) => {
        await updateDoc(doc(db, 'cases', item.id), { involvedDetectives: detectiveIds });
        await handleAddLog(`Updated involved detectives.`);
    };

    const handleLinkPeople = async (peopleIds) => {
        await updateDoc(doc(db, 'cases', item.id), { people: peopleIds });
        await handleAddLog(`Updated linked people.`);
    };

    const handleLinkVehicles = async (vehicleIds) => {
        await updateDoc(doc(db, 'cases', item.id), { vehicles: vehicleIds });
        await handleAddLog(`Updated linked vehicles.`);
    };

    const handleAddTask = async (newTask) => {
        const taskRef = await addDoc(collection(db, 'tasks'), newTask);
        await updateDoc(doc(db, 'cases', item.id), { tasks: arrayUnion(taskRef.id) });
        await handleAddLog(`Added new task: ${newTask.description}`);
    };

    const handleStatusChange = async (newStatus) => {
        await updateDoc(doc(db, 'cases', item.id), { status: newStatus });
        await handleAddLog(`Changed status to ${newStatus}`);
        setStatusDropdownOpen(false);
    };

    if (loading) return <div className="text-center p-10">Loading Case File...</div>;
    if (!caseData) return <div className="text-center p-10 text-red-500">Case not found.</div>;
    
    return (
        <DetailPageWrapper title={caseData.title} onBack={onBack}>
            {isAddDetectiveModalOpen && <AddInvolvedDetectiveModal onClose={() => setAddDetectiveModalOpen(false)} onSave={handleSaveInvolvedDetectives} currentDetectives={caseData.involvedDetectives || []} />}
            {isRenameModalOpen && <RenameCaseModal onClose={() => setRenameModalOpen(false)} onSave={handleRenameCase} currentTitle={caseData.title} />}
            {isChangeLeadModalOpen && <ChangeLeadDetectiveModal onClose={() => setChangeLeadModalOpen(false)} onSave={handleChangeLeadDetective} currentLead={caseData.leadDetective} />}
            {isLinkPersonModalOpen && <LinkPersonModal onClose={() => setLinkPersonModalOpen(false)} onSave={handleLinkPeople} currentPeople={caseData.people || []} />}
            {isLinkVehicleModalOpen && <LinkVehicleModal onClose={() => setLinkVehicleModalOpen(false)} onSave={handleLinkVehicles} currentVehicles={caseData.vehicles || []} />}
            {isAddTaskModalOpen && <CreateTaskForCaseModal onClose={() => setAddTaskModalOpen(false)} onSave={handleAddTask} userProfile={userProfile} caseId={item.id} />}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <DetailSection title="Case Details" icon={<Info size={20}/>}><p className="text-gray-300 whitespace-pre-wrap">{caseData.details}</p></DetailSection>
                    
                    <DetailSection title="Linked Tasks" icon={<ClipboardList size={20}/>}>
                        {linkedTasks.length > 0 ? (linkedTasks.map(task => (<div key={task.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'task', item: task})}>{task.description} - <span className="text-sm text-gray-400">{task.status}</span></div>))) : <p className="text-gray-400">No tasks linked to this case.</p>}
                        <button onClick={() => setAddTaskModalOpen(true)} className="text-blue-400 mt-2 flex items-center gap-1"><Plus size={16}/> Add Task</button>
                    </DetailSection>

                    <DetailSection title="Linked People" icon={<Users size={20}/>}>
                        {linkedPeople.length > 0 ? (linkedPeople.map(person => (<div key={person.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'person', item: person})}>{person.firstName} {person.lastName} - <span className="text-sm text-gray-400">{person.type}</span></div>))) : <p className="text-gray-400">No people linked to this case.</p>}
                        <button onClick={() => setLinkPersonModalOpen(true)} className="text-blue-400 mt-2 flex items-center gap-1"><Plus size={16}/> Link Person</button>
                    </DetailSection>

                    <DetailSection title="Linked Vehicles" icon={<Car size={20}/>}>
                        {linkedVehicles.length > 0 ? (linkedVehicles.map(vehicle => (<div key={vehicle.id} className="p-2 bg-gray-700/50 rounded-md mb-2 cursor-pointer hover:bg-gray-600" onClick={() => navigateToDetail({type: 'vehicle', item: vehicle})}>{vehicle.make} {vehicle.model} - <span className="text-sm text-gray-400">{vehicle.plate}</span></div>))) : <p className="text-gray-400">No vehicles linked to this case.</p>}
                        <button onClick={() => setLinkVehicleModalOpen(true)} className="text-blue-400 mt-2 flex items-center gap-1"><Plus size={16}/> Link Vehicle</button>
                    </DetailSection>

                    <DetailSection title="Evidence" icon={<FileText size={20}/>}>
                        {caseData.evidence && caseData.evidence.map((e, index) => (
                            <div key={index} className="p-2 bg-gray-700/50 rounded-md mb-2 flex items-center gap-2">
                                <Paperclip size={16} />
                                <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{e.name}</a>
                            </div>
                        ))}
                        <div className="mt-4">
                            <input type="file" onChange={(e) => setEvidenceFile(e.target.files[0])} className="text-sm" />
                            <button onClick={handleEvidenceUpload} disabled={!evidenceFile || uploading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mt-2 disabled:bg-gray-500">
                                {uploading ? 'Uploading...' : 'Upload Evidence'}
                            </button>
                        </div>
                    </DetailSection>

                    <DetailSection title="Comments" icon={<MessageSquare size={20}/>}>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {comments.map(comment => (
                                <div key={comment.id}>
                                    <p className="font-semibold">{comment.authorName}</p>
                                    <p className="text-gray-300">{comment.text}</p>
                                    <p className="text-xs text-gray-500">{formatTimestamp(comment.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex gap-2">
                            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment... (@mention to notify)" className="w-full bg-gray-700 p-2 rounded-md" />
                            <button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md"><Send size={20} /></button>
                        </div>
                    </DetailSection>
                </div>
                <div>
                     <DetailSection title="Case Information" icon={<Calendar size={20}/>}>
                        <ul className="space-y-3">
                            <li className='flex items-center gap-2'>
                                <strong>Status:</strong>
                                <div className="relative">
                                    <button onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)} className={`flex items-center gap-2 px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(caseData.status)}`}>
                                        {caseData.status}
                                        <ChevronDown size={14} />
                                    </button>
                                    {isStatusDropdownOpen && (
                                        <div className="absolute top-full mt-1 w-48 bg-gray-600 rounded-md shadow-lg z-10">
                                            <a onClick={() => handleStatusChange('Open')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Open</a>
                                            <a onClick={() => handleStatusChange('Closed')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Closed</a>
                                            <a onClick={() => handleStatusChange('Pending Review')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Pending Review</a>
                                            <a onClick={() => handleStatusChange('Case Cold')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Case Cold</a>
                                            <a onClick={() => handleStatusChange('Suspended by Supervisors')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Suspended by Supervisors</a>
                                            <a onClick={() => handleStatusChange('Hold - LOA')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Hold - LOA</a>
                                            <a onClick={() => handleStatusChange('Hold - No Lead Detective')} className="block px-3 py-2 text-xs hover:bg-gray-500 cursor-pointer">Hold - No Lead Detective</a>
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li><strong>Lead Detective:</strong> {caseData.leadDetectiveName}</li>
                            <li className="flex flex-col"><strong>Involved Detectives:</strong> <span>{involvedDetectives.map(d => `${d.firstName} ${d.lastName}`).join(', ') || 'None'}</span></li>
                            <li><strong>Date Opened:</strong> {formatTimestamp(caseData.createdAt)}</li>
                            <li><strong>Last Action:</strong> {formatTimestamp(caseData.lastActionAt)}</li>
                        </ul>
                         <div className="mt-4 space-y-2">
                             <button onClick={() => setRenameModalOpen(true)} className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">Rename Case</button>
                             <button onClick={() => setChangeLeadModalOpen(true)} className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">Change Lead Detective</button>
                             <button onClick={() => setAddDetectiveModalOpen(true)} className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm">Add/Edit Involved Detectives</button>
                         </div>
                    </DetailSection>
                    <DetailSection title="Case Log" icon={<Info size={20} />}>
                        <ul className="space-y-2 text-xs text-gray-400 max-h-60 overflow-y-auto">
                           {caseLog.map(log => (
                               <li key={log.id} className="border-b border-gray-700/50 pb-1">
                                   <span className="font-semibold">{log.user}</span>: {log.change}
                                   <span className="block text-gray-500">{formatTimestamp(log.timestamp)}</span>
                               </li>
                           ))}
                        </ul>
                    </DetailSection>
                </div>
            </div>
        </DetailPageWrapper>
    );
}