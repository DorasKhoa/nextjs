import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAllSchedules, createSchedule, assignDocToSchedule, deleteSchedule, removeDoctorFromSchedule } from "@/services/scheduleService";
import { fetchDoctors } from "@/services/doctorService";
import { Schedule } from "@/types/schedule";
import CreateScheduleCard from "./CreateScheduleCard";
import ScheduleUpdateModal from "./ScheduleUpdateModal";
import SelectDoctorModal from "./SelectDoctorModal";
import { rejectOrder } from "@/services/orderService";

const ScheduleList: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
    const [assigningSchedule, setAssigningSchedule] = useState<any | null>(null);
    const [doctorList, setDoctorList] = useState<any[]>([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);

    const loadSchedules = async () => {
        setLoading(true);
        try {
            const data = await fetchAllSchedules();
            setSchedules(data);
        } catch (err: any) {
            toast.error("Failed to load schedules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const to24Hour = (timeStr: string) => {
        if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr)) return timeStr;
        const match = timeStr.match(/(\d+):(\d+)\s*(SA|CH)/i);
        if (!match) return timeStr;
        let [_, h, m, ampm] = match;
        let hour = parseInt(h, 10);
        if (ampm.toUpperCase() === 'CH' && hour < 12) hour += 12;
        if (ampm.toUpperCase() === 'SA' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${m}`;
    };

    const handleCreateSchedule = async (data: { date: string; start: string; end: string }) => {
        const start = to24Hour(data.start);
        const end = to24Hour(data.end);
        setCreating(true);
        try {
            await createSchedule({ date: data.date, start, end });
            toast.success("Schedule created!");
            await loadSchedules();
        } catch (err: any) {
            toast.error(err.message || "Failed to create schedule");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId: string) => {
        if (!window.confirm('Are you sure you want to delete this schedule?')) return;
        try {
            await deleteSchedule(scheduleId);
            toast.success('Schedule deleted!');
            await loadSchedules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete schedule');
        }
    };

    const handleRemoveDoctor = async (scheduleId: string, doctorId: string) => {
        if (!window.confirm('Are you sure you want to remove the doctor from this schedule?')) return;
        try {
            await removeDoctorFromSchedule(scheduleId, doctorId);
            toast.success('Doctor removed from schedule!');
            await loadSchedules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to remove doctor');
        }
    };

    const openAssignDoctorModal = async (schedule: any) => {
        setAssigningSchedule(schedule);
        setLoadingDoctors(true);
        try {
            const docs = await fetchDoctors();
            setDoctorList(docs);
        } catch (err) {
            toast.error("Failed to load doctors");
        } finally {
            setLoadingDoctors(false);
        }
    };

    const handleAssignDoctor = async (doctorId: string) => {
        if (!assigningSchedule) return;
        try {
            await assignDocToSchedule(assigningSchedule._id, doctorId);
            toast.success('Doctor assigned to schedule!');
            setAssigningSchedule(null);
            await loadSchedules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to assign doctor');
        }
    };

    const handleRejectOrder = async (orderId: string) => {
        if (!window.confirm('Are you sure you want to reject this order?')) return;
        try {
            await rejectOrder(orderId);
            toast.success('Order rejected!');
            await loadSchedules();
        } catch (err: any) {
            toast.error(err.message || 'Failed to reject order');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📅 Schedule List</h2>

            <div className="mb-8">
                <CreateScheduleCard onCreate={handleCreateSchedule} loading={creating} />
            </div>

            {loading && <p>Loading schedules...</p>}

            {!loading && Array.isArray(schedules) && schedules.length === 0 && (
                <p>No schedules available.</p>
            )}

            {!loading && Array.isArray(schedules) && schedules.length > 0 && (
                <div className="grid gap-4">
                    {schedules.map((schedule) => (
                        <div
                            key={schedule._id}
                            className="bg-white shadow-md p-4 rounded border hover:shadow-lg transition"
                        >
                            <p>
                                🗓 <strong>Date:</strong> {schedule.date}
                            </p>
                            <p>
                                🕒 <strong>Time:</strong> {schedule.start} → {schedule.end}
                            </p>
                            <p>
                                👨‍⚕️ <strong>Doctor:</strong>{" "}
                                {schedule.doctor ? schedule.doctor.name : "Unassigned"}
                            </p>
                            <p>
                                🤵 <strong>User:</strong> {' '}
                                {schedule.user?.name || schedule.user?.email || 'N/A'}
                            </p>
                            <p>
                                📌 <strong>Status:</strong> {schedule.status}
                            </p>

                            {schedule.status === 'UNASSIGNED' && (
                                <div className="mt-3 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => openAssignDoctorModal(schedule)}
                                    >
                                        ASSIGN DOCTOR
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => setEditingSchedule(schedule)}
                                    >
                                        EDIT
                                    </button>
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDeleteSchedule(schedule._id)}
                                    >
                                        DELETE
                                    </button>
                                </div>
                            )}
                            {schedule.status === 'PENDING' && (
                                <div className="mt-3 flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => {
                                            if (schedule.doctor && schedule.doctor._id) {
                                                handleRemoveDoctor(schedule._id, schedule.doctor._id);
                                            } else {
                                                toast.error('No doctor assigned to this schedule!');
                                            }
                                        }}
                                    >
                                        REMOVE DOCTOR
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {editingSchedule && (
                <ScheduleUpdateModal
                    schedule={editingSchedule}
                    onClose={() => setEditingSchedule(null)}
                    onUpdated={loadSchedules}
                />
            )}

            {assigningSchedule && (
                <SelectDoctorModal
                    doctors={doctorList.map(doc => ({ _id: doc.id || doc._id, name: doc.name, email: doc.email || '', avatar: doc.avatar }))}
                    onClose={() => setAssigningSchedule(null)}
                    onSelect={handleAssignDoctor}
                />
            )}
        </div>
    );

};

export default ScheduleList;
