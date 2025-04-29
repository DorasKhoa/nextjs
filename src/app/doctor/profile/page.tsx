'use client'
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import DoctorProfile from '@/components/doctor/DoctorProfile';

const UserPage: React.FC = () => {
    return (
        <DoctorSidebar>
            <DoctorProfile />
        </DoctorSidebar>
    );
};

export default UserPage;
