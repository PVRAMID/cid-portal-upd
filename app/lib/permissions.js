// app/lib/permissions.js

export const PERMISSIONS = {
    ADMIN_PANEL_ACCESS: 'admin:access',
    USERS_CREATE: 'users:create',
    USERS_EDIT: 'users:edit',
    USERS_MANAGE_ROLES: 'users:manage_roles',
    ROLES_MANAGE: 'roles:manage',
    CASES_CREATE: 'cases:create',
    CASES_EDIT: 'cases:edit',
    CASES_DELETE: 'cases:delete',
    CASES_MANAGE_ASSIGNMENTS: 'cases:manage_assignments',
    CASES_MANAGE_STATUS: 'cases:manage_status',
    EVIDENCE_UPLOAD: 'evidence:upload',
    EVIDENCE_DELETE: 'evidence:delete',
};

export const permissionGroups = [
    {
        title: 'General Administration',
        permissions: [
            { id: PERMISSIONS.ADMIN_PANEL_ACCESS, label: 'Access Admin Panel' },
        ]
    },
    {
        title: 'User Management',
        permissions: [
            { id: PERMISSIONS.USERS_CREATE, label: 'Create new users' },
            { id: PERMISSIONS.USERS_EDIT, label: 'Edit user details' },
            { id: PERMISSIONS.USERS_MANAGE_ROLES, label: 'Assign roles to users' },
        ]
    },
    {
        title: 'Role Management',
        permissions: [
            { id: PERMISSIONS.ROLES_MANAGE, label: 'Create, edit, and delete roles' },
        ]
    },
    {
        title: 'Case Management',
        permissions: [
            { id: PERMISSIONS.CASES_CREATE, label: 'Create new cases' },
            { id: PERMISSIONS.CASES_EDIT, label: 'Edit case details' },
            { id: PERMISSIONS.CASES_DELETE, label: 'Delete cases' },
            { id: PERMISSIONS.CASES_MANAGE_ASSIGNMENTS, label: 'Manage lead and involved detectives' },
            { id: PERMISSIONS.CASES_MANAGE_STATUS, label: 'Change case status' },
        ]
    },
    {
        title: 'Evidence Management',
        permissions: [
            { id: PERMISSIONS.EVIDENCE_UPLOAD, label: 'Upload evidence to cases' },
            { id: PERMISSIONS.EVIDENCE_DELETE, label: 'Delete evidence from cases' },
        ]
    }
];