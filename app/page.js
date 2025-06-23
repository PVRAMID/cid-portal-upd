// app/page.js
'use client'; // This is a Client Component

import React, { useState } from 'react';
import useAuth from './hooks/useAuth';

// Import Components
import LoginScreen from './components/auth/LoginScreen';
import Sidebar from './components/shared/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import CasesPage from './components/cases/CasesPage';
import TasksPage from './components/tasks/TasksPage';
import PeoplePage from './components/people/PeoplePage';
import VehiclesPage from './components/vehicles/VehiclesPage';
import StaffPage from './components/staff/StaffPage';
import CaseDetailPage from './components/cases/CaseDetailPage';
import TaskDetailPage from './components/tasks/TaskDetailPage';
import PersonDetailPage from './components/people/PersonDetailPage';
import VehicleDetailPage from './components/vehicles/VehicleDetailPage';
import AdminModal from './components/admin/AdminModal';

// Import Creation Modals
import CreateCaseModal from './components/cases/CreateCaseModal';
import CreateTaskModal from './components/tasks/CreateTaskModal';
import CreatePersonModal from './components/people/CreatePersonModal';
import CreateVehicleModal from './components/vehicles/CreateVehicleModal';


export default function Home() {
    const { userProfile, loading, authError, setAuthError } = useAuth();
    const [activePage, setActivePage] = useState('Dashboard');
    const [activeDetailPage, setActiveDetailPage] = useState(null);
    const [isAdminModalOpen, setAdminModalOpen] = useState(false);
    const [creationModal, setCreationModal] = useState(null);

    const navigateTo = (page) => {
        setActivePage(page);
        setActiveDetailPage(null);
    };

    const navigateToDetail = (detail) => {
      setActivePage(null);
      setActiveDetailPage(detail);
    };
    
    const renderCreationModal = () => {
        const closeModal = () => setCreationModal(null);
        switch (creationModal) {
            case 'case': return <CreateCaseModal onClose={closeModal} userProfile={userProfile} />;
            case 'task': return <CreateTaskModal onClose={closeModal} userProfile={userProfile} />;
            case 'person': return <CreatePersonModal onClose={closeModal} userProfile={userProfile} />;
            case 'vehicle': return <CreateVehicleModal onClose={closeModal} userProfile={userProfile} />;
            default: return null;
        }
    };

    const renderPage = () => {
        if (activeDetailPage) {
            const onBack = () => {
                const newActivePage = `${activeDetailPage.type.charAt(0).toUpperCase()}${activeDetailPage.type.slice(1)}s`;
                setActiveDetailPage(null);
                setActivePage(newActivePage);
            };
            switch (activeDetailPage.type) {
                case 'case': return <CaseDetailPage item={activeDetailPage.item} onBack={onBack} navigateToDetail={navigateToDetail} userProfile={userProfile} />;
                case 'task': return <TaskDetailPage item={activeDetailPage.item} onBack={onBack} />;
                case 'person': return <PersonDetailPage item={activeDetailPage.item} onBack={onBack} />;
                case 'vehicle': return <VehicleDetailPage item={activeDetailPage.item} onBack={onBack} />;
                default: return <Dashboard navigateToDetail={navigateToDetail} userProfile={userProfile} />;
            }
        }

        switch (activePage) {
            case 'Dashboard': return <Dashboard navigateToDetail={navigateToDetail} userProfile={userProfile}/>;
            case 'Cases': return <CasesPage navigateToDetail={navigateToDetail} />;
            case 'Tasks': return <TasksPage navigateToDetail={navigateToDetail} />;
            case 'People': return <PeoplePage navigateToDetail={navigateToDetail} />;
            case 'Vehicles': return <VehiclesPage navigateToDetail={navigateToDetail} />;
            case 'Staff': return <StaffPage />;
            default: return <Dashboard navigateToDetail={navigateToDetail} userProfile={userProfile}/>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white font-sans">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xl">Initializing Portal...</span>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return <LoginScreen authError={authError} setAuthError={setAuthError} />;
    }

    return (
        <div className="bg-gray-900 text-gray-100 font-sans flex min-h-screen">
            <Sidebar activePage={activePage} setActivePage={navigateTo} userProfile={userProfile} onAdminClick={() => setAdminModalOpen(true)} onCreationClick={(type) => setCreationModal(type)} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {renderPage()}
            </main>
            {isAdminModalOpen && <AdminModal onClose={() => setAdminModalOpen(false)} />}
            {renderCreationModal()}
        </div>
    );
}