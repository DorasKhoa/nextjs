'use client'
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import UserManagement from '@/components/UserManagement';

const UserPage: React.FC = () => {
    return (
        <AdminSidebar>
            <UserManagement />
        </AdminSidebar>
    );
};

export default UserPage;
