'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function DetailPageWrapper({ title, onBack, children }) {
    return (
        <div>
            <button onClick={onBack} className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
                <ChevronRight size={20} className="transform rotate-180" /> <span className="ml-1">Back to list</span>
            </button>
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                <h2 className="text-4xl font-bold mb-6 pb-4 border-b border-gray-700">{title}</h2>
                {children}
            </div>
        </div>
    );
}
