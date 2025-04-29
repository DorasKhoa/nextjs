'use client'
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import CreateMedicineCard from '@/components/admin/CreateMedicineCard';
import MedicineList from '@/components/MedicineList';

const MedicinePage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleMedicineCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <AdminSidebar>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Medicine Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CreateMedicineCard onMedicineCreated={handleMedicineCreated} />
                </div>
                <div className="mt-6">
                    <MedicineList key={refreshKey} />
                </div>
            </div>
        </AdminSidebar>
    );
};

export default MedicinePage;
