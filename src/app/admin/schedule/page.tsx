'use client'
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import ScheduleList from '@/components/ScheduleList';

const UserPage: React.FC = () => {
    return (
        <AdminSidebar>
            <ScheduleList />
        </AdminSidebar>
    );
};

export default UserPage;
