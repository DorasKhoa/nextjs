import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { fetchAllSchedules } from "@/services/scheduleService"; // bạn tạo API này nha
import { Schedule } from "@/types/schedule";

const ScheduleList: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await fetchAllSchedules();
                setSchedules(data);
            } catch (err: any) {
                toast.error("Failed to load schedules");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    useEffect(() => {
        console.log("Fetched schedules:", schedules); // debug trực tiếp khi setState
    }, [schedules]);
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">📅 Schedule List</h2>

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
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                        ASSIGN DOCTOR
                                    </button>
                                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                                        EDIT
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                        DELETE
                                    </button>
                                </div>
                            )}
                            {schedule.status === 'PENDING' && (
                                <div className="mt-3 flex gap-2">
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                        DELETE
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                        REJECT BOOKING
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

export default ScheduleList;
