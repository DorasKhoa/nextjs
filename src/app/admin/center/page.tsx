'use client'
import AdminSidebar from '@/components/AdminSidebar';
import CenterList from '@/components/CenterList';
import CreateCenterForm from '@/components/CreateCenterCard';
import { useState } from 'react';

export default function CentersPage() {
    const [shouldRefetch, setShouldRefetch] = useState(false);

    const handleCreateSuccess = () => {
        setShouldRefetch(prev => !prev); // Toggle để trigger fetch lại
    };

    return (
        <AdminSidebar>
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Medical Centers</h1>
                <CreateCenterForm onSuccess={handleCreateSuccess} />
                <CenterList key={String(shouldRefetch)} />
            </div>
        </AdminSidebar>
    );
}