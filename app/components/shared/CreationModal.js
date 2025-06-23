'use client';
import React from 'react';
import { X } from 'lucide-react';

export default function CreationModal({ title, onClose, children, onSubmit, loading }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><X size={24} /></button>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="p-6 flex-grow overflow-y-auto space-y-4">
                        {children}
                    </div>
                    <div className="p-4 bg-gray-900/50 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-800 disabled:cursor-wait">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
