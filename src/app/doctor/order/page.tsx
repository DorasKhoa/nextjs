'use client'
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import DoctorOrder from '@/components/doctor/DoctorOrder';

const UserPage: React.FC = () => {
    return (
        <DoctorSidebar>
            <DoctorOrder />
        </DoctorSidebar>
    );
};

export default UserPage;
