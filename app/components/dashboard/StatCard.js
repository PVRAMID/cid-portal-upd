'use client';
import React from 'react';

export default function StatCard({ title, value }) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h4 className="text-sm text-gray-400 font-medium">{title}</h4>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
