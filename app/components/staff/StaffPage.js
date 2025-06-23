// app/components/staff/StaffPage.js
'use client';
import React, { useState } from 'react';
import RosterSection from './RosterSection';
import SOPsSection from './SOPsSection';

export default function StaffPage() {
    const [activeTab, setActiveTab] = useState('Roster');
    return(<div><h2 className="text-3xl font-bold mb-6">Staff Management</h2><div className="flex border-b border-gray-700 mb-4"><button onClick={() => setActiveTab('Roster')} className={`py-2 px-4 ${activeTab === 'Roster' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}>Roster</button><button onClick={() => setActiveTab('SOPs')} className={`py-2 px-4 ${activeTab === 'SOPs' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400'}`}>SOPs</button></div>{activeTab === 'Roster' ? <RosterSection /> : <SOPsSection />}</div>);
};