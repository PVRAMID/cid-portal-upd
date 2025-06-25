// app/components/admin/RoleEditForm.js
'use client';
import React, { useState } from 'react';
import { permissionGroups } from '../../lib/permissions';

export default function RoleEditForm({ onSave, onCancel, role }) {
    // Use optional chaining (?.) to safely access properties, defaulting to an empty value if 'role' is null or undefined.
    const [roleName, setRoleName] = useState(role?.name || '');
    const [permissions, setPermissions] = useState(role?.permissions || []);

    const handlePermissionChange = (permId, isChecked) => {
        if (isChecked) {
            setPermissions(prev => [...prev, permId]);
        } else {
            setPermissions(prev => prev.filter(p => p !== permId));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the original role object back to preserve its ID if it exists
        onSave({ ...role, name: roleName, permissions });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    {/* Also use optional chaining here for the title */}
                    <h2 className="text-2xl font-bold">{role?.id ? 'Edit Role' : 'Create New Role'}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 flex-grow overflow-y-auto space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Role Name</label>
                            <input value={roleName} onChange={(e) => setRoleName(e.target.value)} required className="w-full bg-gray-700 p-2 rounded-md" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-blue-400 mb-3">Permissions</h3>
                            <div className="space-y-4">
                                {permissionGroups.map(group => (
                                    <div key={group.title} className="bg-gray-900/50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-200 mb-2">{group.title}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                            {group.permissions.map(perm => (
                                                <label key={perm.id} className="flex items-center space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={permissions.includes(perm.id)}
                                                        onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-300">{perm.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-900/50 flex justify-end gap-4">
                        <button type="button" onClick={onCancel} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Role</button>
                    </div>
                </form>
            </div>
        </div>
    );
}