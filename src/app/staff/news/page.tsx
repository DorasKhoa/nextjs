'use client'
import React, { useState } from 'react';
import StaffSidebar from '@/components/StaffSidebar';
import CreateNewsForm from '@/components/staff/CreateNewsForm';
import NewsList from '@/components/staff/NewsList';

const StaffNewsPage: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleNewsCreated = () => {
        setRefreshKey(prev => prev + 1); // Increment to trigger useEffect in NewsList
    };

    return (
        <StaffSidebar>
            <CreateNewsForm onNewsCreated={handleNewsCreated} />
            <NewsList key={refreshKey} />
        </StaffSidebar>
    );
};

export default StaffNewsPage;
