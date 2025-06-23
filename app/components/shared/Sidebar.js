// app/components/shared/Sidebar.js
'use client';

import React, { useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../../lib/firebase';
import { ShieldCheck, Users, Car, FileText, ClipboardList, User, ChevronDown, ChevronRight, BarChart2, LogOut, UserCog, PlusCircle, Bell } from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, userProfile, onAdminClick, onCreationClick }) {
    const [isStaffOpen, setIsStaffOpen] = useState(false);
    const [isNewOpen, setIsNewOpen] = useState(false);

    const handleLogout = async () => await signOut(auth);

    const navItems = [
        { name: 'Dashboard', icon: <BarChart2 size={20} /> }, { name: 'Cases', icon: <FileText size={20} /> },
        { name: 'Tasks', icon: <ClipboardList size={20} /> }, { name: 'People', icon: <Users size={20} /> },
        { name: 'Vehicles', icon: <Car size={20} /> },
    ];
    
    const creationItems = [
        { name: 'Case', type: 'case', icon: <FileText size={18}/> },
        { name: 'Task', type: 'task', icon: <ClipboardList size={18}/> },
        { name: 'Person', type: 'person', icon: <User size={18}/> },
        { name: 'Vehicle', type: 'vehicle', icon: <Car size={18}/> },
    ];

    return (
        <nav className="bg-gray-800 w-64 p-4 flex flex-col flex-shrink-0">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <ShieldCheck className="text-blue-500" size={32} />
                        <h1 className="text-xl font-bold ml-2">CID Portal</h1>
                    </div>
                    <button className="relative text-gray-400 hover:text-white">
                        <Bell size={20} />
                        {/* Notification dot */}
                        {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span> */}
                    </button>
                </div>
                <div className="mb-4 relative">
                    <button onClick={() => setIsNewOpen(!isNewOpen)} className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                        <PlusCircle size={20} /> New...
                    </button>
                    {isNewOpen && (
                        <div className="mt-2 bg-gray-700 rounded-lg p-2 flex flex-col gap-1">
                            {creationItems.map(item => (
                                <a key={item.type} href="#" onClick={() => { onCreationClick(item.type); setIsNewOpen(false); }} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-600">
                                    {item.icon} {item.name}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <ul>
                    {navItems.map(item => (
                        <li key={item.name} className="mb-2"><a href="#" onClick={() => setActivePage(item.name)} className={`flex items-center p-2 rounded-lg transition-colors ${activePage === item.name ? 'bg-blue-500' : 'hover:bg-gray-700'}`}>{item.icon}<span className="ml-3">{item.name}</span></a></li>
                    ))}
                    <li className="mb-2">
                        <a href="#" onClick={() => setIsStaffOpen(!isStaffOpen)} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700"><div className="flex items-center"><User size={20} /><span className="ml-3">Staff</span></div>{isStaffOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</a>
                        {isStaffOpen && (
                            <ul className="ml-4 mt-2">
                                <li className="mb-2"><a href="#" onClick={() => setActivePage('Staff')} className={`block p-2 rounded-lg ${activePage === 'Staff' ? 'bg-blue-500' : 'hover:bg-gray-600'}`}>Roster</a></li>
                                <li className="mb-2"><a href="#" onClick={() => setActivePage('Staff')} className={`block p-2 rounded-lg ${activePage === 'Staff' ? 'bg-blue-500' : 'hover:bg-gray-600'}`}>SOPs</a></li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
            <div className="mt-auto">
                <div className="text-center mb-4 p-2 bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold truncate">{userProfile.firstName || userProfile.lastName ? `${userProfile.firstName} ${userProfile.lastName}` : userProfile.email}</p>
                    <p className="text-xs text-gray-400">{userProfile.rank}</p>
                    <p className="text-xs text-green-400">Online</p>
                </div>
                {userProfile.permissionLevel === 10 && (
                    <a href="#" onClick={onAdminClick} className="flex items-center p-2 rounded-lg text-amber-400 hover:bg-gray-700 mb-2"><UserCog size={20} /><span className="ml-3">Admin Panel</span></a>
                )}
                <a href="#" onClick={handleLogout} className="flex items-center p-2 rounded-lg text-red-400 hover:bg-gray-700"><LogOut size={20} /><span className="ml-3">Logout</span></a>
            </div>
        </nav>
    );
}