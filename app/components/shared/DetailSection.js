'use client';
import React from 'react';

export default function DetailSection({ title, icon, children }) {
    return (
        <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">{icon}{title}</h3>
            <div className="bg-gray-900/50 p-4 rounded-lg">
                {children}
            </div>
        </div>
    );
}
