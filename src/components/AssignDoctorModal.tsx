'use client'

import { useEffect, useState } from "react";
import { assignDocToCenter } from "@/services/centerService";
import { fetchDoctors } from "@/services/doctorService";
import { DoctorSummary } from "@/types/doctor";
import toast from "react-hot-toast";

interface AssignDoctorModalProps {
    centerId: string;
    onClose: () => void;
    onAssigned: () => void;
}


const AssignDoctorModal: React.FC<AssignDoctorModalProps> = ({ centerId, onClose, onAssigned }) => {
    const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await fetchDoctors();
                setDoctors(data);
            } catch (err) {
                toast.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };

        loadDoctors();
    }, []);

    const handleAssign = async (doctorId: string) => {
        try {
            const res = await assignDocToCenter(centerId, doctorId);
            toast.success(res || "Assigned successfully!");
            onClose();
            onAssigned();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Assign failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Assign Doctor</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-lg font-bold">✖</button>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                        {doctors.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between border p-3 rounded-lg hover:shadow cursor-pointer"
                                onClick={() => handleAssign(doc.id)}
                            >
                                <div className="flex items-center gap-3">
                                    {doc.avatar ? (
                                        <img src={doc.avatar} className="w-10 h-10 rounded-full" alt={doc.name} />
                                    ) : (
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{doc.name}</p>
                                        <p className="text-sm text-gray-500">{doc.email}</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{doc.category}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignDoctorModal;
