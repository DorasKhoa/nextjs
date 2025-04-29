'use client'
import React from 'react';
import StaffSidebar from '@/components/StaffSidebar';
import StaffProfile from '@/components/staff/StaffProfile';

const StaffProfilePage: React.FC = () => {
    return (
        <StaffSidebar>
            <StaffProfile />
        </StaffSidebar>
    );
};

export default StaffProfilePage;
