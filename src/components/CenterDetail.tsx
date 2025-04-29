'use client'

import { findCenterById, updateCenter } from "@/services/centerService";
import { Center } from "@/types/center";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AssignDoctorModal from "@/components/AssignDoctorModal";
import AddRequirementModal from "@/components/AddRequirementModal";
import AddDepartmentModal from "@/components/AddDepartmentModal";
import { assignDocToDepartment, removeDocFromDepartment } from "@/services/departmentService";
import SelectDoctorModal from "@/components/SelectDoctorModal";


const CenterDetail = ({ centerId }: { centerId: string }) => {
    const [center, setCenter] = useState<Center | null>(null);
    const [local, setLocal] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const router = useRouter();
    const [openAddReqModal, setOpenAddReqModal] = useState(false);
    const [openAddDeptModal, setOpenAddDeptModal] = useState(false);
    const [assignDeptId, setAssignDeptId] = useState<string | null>(null);

    const loadCenter = async () => {
        try {
            const data = await findCenterById(centerId);
            setCenter(data);
            setLocal(data.local);
            setContact(data.contact);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch center');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCenter();
    }, [centerId]);

    const handleSave = async () => {
        try {
            const res = await updateCenter(centerId, { local, contact });
            toast.success(res || 'Center updated successfully!');
            setEditing(false);
            // Reload center data after successful update
            await loadCenter();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Update failed');
        }
    };

    if (loading) return <div className="flex justify-center p-4">Loading center details...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!center) return <div className="text-gray-500 p-4">No center found</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Center Information</h2>
                {editing ? (
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setLocal(center?.local || "");
                                setContact(center?.contact || "");
                                setEditing(false);
                            }}
                            className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="border border-black text-black px-5 py-2 rounded hover:bg-black hover:text-white transition-all"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Location & Contact */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-gray-600">Location</p>
                    {editing ? (
                        <input
                            type="text"
                            className="border rounded px-3 py-1 w-full"
                            value={local}
                            onChange={(e) => setLocal(e.target.value)}
                        />
                    ) : (
                        <p className="font-semibold">{center.local}</p>
                    )}
                </div>
                <div>
                    <p className="text-gray-600">Contact</p>
                    {editing ? (
                        <input
                            type="text"
                            className="border rounded px-3 py-1 w-full"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    ) : (
                        <p className="font-semibold">{center.contact}</p>
                    )}
                </div>
            </div>

            {/* Doctors Section (Always show Assign button) */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Doctors</h3>

                {center.doctors && center.doctors.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {center.doctors.map((doctor) => (
                            <div key={doctor._id} className="border rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    {doctor.avatar && (
                                        <img src={doctor.avatar} alt={doctor.name} className="w-10 h-10 rounded-full" />
                                    )}
                                    <div>
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-sm text-gray-500">{doctor.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No doctors assigned to this center yet.</p>
                )}

                {/* ✅ Luôn hiển thị Assign Doctor button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setOpenAssignModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                    >
                        Assign Doctor
                    </button>
                </div>
            </div>

            {/* Requirements */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Requirements</h3>

                {center.requirements && center.requirements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {center.requirements.map((req) => (
                            <div key={req._id} className="border rounded-lg p-4">
                                <p className="font-semibold">Machine name: {req.name}</p>
                                <p className="font-semibold">Instruction: {req.instruction || 'N/A'}</p>
                                <p className="text-gray-600">Quantity: {req.quantity}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No requirements added yet.</p>
                )}

                {/* ✅ Always show Add Requirement button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setOpenAddReqModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                    >
                        Add Requirement
                    </button>
                </div>
            </div>

            {/* Departments */}
            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Departments</h3>

                {center.departments && center.departments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {center.departments.map((dept) => (
                            <div key={dept._id} className="border rounded-lg p-4 flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{dept.name}</p>
                                    {dept.doctor && (
                                        <div className="mt-2">
                                            <p className="text-gray-600">Doctor: {dept.doctor.name}</p>
                                            <p className="text-sm text-gray-500">{dept.doctor.email}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                    {!dept.doctor ? (
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all text-sm"
                                            onClick={() => setAssignDeptId(dept._id)}
                                        >
                                            Assign
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all text-sm"
                                            onClick={async () => {
                                                try {
                                                    await removeDocFromDepartment(dept._id);
                                                    toast.success('Doctor removed from department!');
                                                    await loadCenter();
                                                } catch (err: any) {
                                                    toast.error(err.message || 'Failed to remove doctor');
                                                }
                                            }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No departments added yet.</p>
                )}

                {/* ✅ Luôn hiện Add Department button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setOpenAddDeptModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                    >
                        Add Department
                    </button>
                </div>
            </div>

            {/* Back */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => router.push('/admin/center')}
                    className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-all"
                >
                    Return
                </button>
            </div>

            {/* AssignDoctorModal */}
            {openAssignModal && (
                <AssignDoctorModal
                    centerId={centerId}
                    onClose={() => setOpenAssignModal(false)}
                    onAssigned={loadCenter}
                />
            )}
            {openAddReqModal && (
                <AddRequirementModal
                    centerId={centerId}
                    onClose={() => setOpenAddReqModal(false)}
                    onAdded={loadCenter} // để fetch lại data
                />
            )}
            {openAddDeptModal && (
                <AddDepartmentModal
                    centerId={centerId}
                    onClose={() => setOpenAddDeptModal(false)}
                    onAdded={loadCenter} // reload lại dữ liệu sau khi thêm
                />
            )}
            {assignDeptId && (
                <SelectDoctorModal
                    doctors={(center.doctors || []).map(doc => ({
                        _id: doc._id,
                        name: doc.name,
                        email: doc.email || '',
                        avatar: doc.avatar
                    }))}
                    onClose={() => setAssignDeptId(null)}
                    onSelect={async (doctorId) => {
                        try {
                            await assignDocToDepartment(assignDeptId, doctorId);
                            toast.success('Doctor assigned to department!');
                            setAssignDeptId(null);
                            await loadCenter();
                        } catch (err: any) {
                            toast.error(err.message || 'Failed to assign doctor');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default CenterDetail;
