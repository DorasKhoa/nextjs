'use client'
import ClientMedicineList from '@/components/ClientMedicineList';
import Header from '@/components/Header';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicinePage() {
    const router = useRouter();

    const handleSuccess = useCallback(() => {
        router.refresh(); // This will trigger a page refresh
    }, [router]);

    return (
        <div>
            <Header />
            <ClientMedicineList onSuccess={handleSuccess} />
        </div>
    );
}
