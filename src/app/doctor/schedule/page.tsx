'use client'
import React from 'react';
import DoctorSidebar from '@/components/DoctorSidebar';
import DoctorSchedule from '@/components/doctor/DoctorSchedule';

const UserPage: React.FC = () => {
    return (
        <DoctorSidebar>
            <DoctorSchedule />
        </DoctorSidebar>
    );
};

export default UserPage;
