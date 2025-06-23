// app/components/staff/RosterSection.js
'use client';
import React from 'react';

export default function RosterSection() {
    return ( <div className="bg-gray-800 rounded-lg shadow p-6"><h3 className="text-2xl font-bold mb-4">CID Roster</h3><div className="overflow-x-auto"><table className="w-full text-left"><thead className="bg-gray-700"><tr><th className="p-3">Rank</th><th className="p-3">Name</th><th className="p-3">Status</th><th className="p-3">Last Action</th><th className="p-3">Assigned Cases</th><th className="p-3">Assigned Tasks</th></tr></thead><tbody><tr><td colSpan="6" className="text-center p-4 text-gray-400">Roster data will be loaded from Firebase.</td></tr></tbody></table></div></div> );
}