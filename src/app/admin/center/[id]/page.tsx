'use client'

import AdminSidebar from "@/components/AdminSidebar";
import CenterDetail from "@/components/CenterDetail";
import { useParams } from "next/navigation";

export default function CenterDetailPage() {
    const params = useParams();
    const centerId = params.id as string;

    return (
        <AdminSidebar>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">Center Details</h1>
                <CenterDetail centerId={centerId} />
            </div>
        </AdminSidebar>
    );
}