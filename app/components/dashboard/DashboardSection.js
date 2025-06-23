'use client';
import React from 'react';

export default function DashboardSection({ title, children }) {
    return (
        <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {children}
        </div>
    );
}
