'use client'

import { fetchAllCenters } from "@/services/centerService";
import { Center } from "@/types/center";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteCenter } from "@/services/centerService";
import toast from "react-hot-toast";

const CenterList = () => {
    const router = useRouter();
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCenters = async () => {
        try {
            const data = await fetchAllCenters();
            setCenters(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch centers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCenters();
    }, []);

    const handleCenterClick = (centerId: string) => {
        router.push(`/admin/center/${centerId}`);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure to delete this center?")) return;

        try {
            await deleteCenter(id);
            toast.success('Center deleted successfully!');
            await loadCenters(); // Fetch lại dữ liệu sau khi xóa thành công
        } catch (err: any) {
            toast.error(err.message || "Failed to delete center");
        }
    };

    if (loading) return <div>Loading centers...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {centers.map((center) => (
                <div
                    key={center._id}
                    className="border rounded-xl p-5 shadow-sm hover:shadow-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    onClick={() => handleCenterClick(center._id)}
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Location: {center.local}
                    </h3>
                    <p className="text-gray-600">Contact: {center.contact}</p>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // để không click nhầm vào thẻ
                            handleDelete(center._id);
                        }}
                        className="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CenterList;