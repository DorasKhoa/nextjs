'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDoctorById } from "@/services/doctorService";
import { Doctor } from "@/types/doctor";
import Header from "@/components/Header";
import toast from "react-hot-toast";
import { bookSchedule } from "@/services/orderService";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      fetchDoctorById(id)
        .then(setDoctor)
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleBook = async (scheduleId: string) => {
    try {
      const msg = await bookSchedule(scheduleId);
      toast.success(msg);
    } catch (error: any) {
      toast.error(error.message || 'Booking failed')
    }
  }

  if (!doctor) return <div className="p-6">Loading doctor info...</div>;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <img
            src={doctor.avatar || "/defaultavatar.jpg"}
            alt={doctor.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.name}</h1>
            <div className="text-gray-600 space-y-1">
              <p>💰 <span className="font-medium">Fees:</span> {doctor.fees.toLocaleString()} $</p>
              <p>🏥 <span className="font-medium">Center:</span> {doctor.center?.local || "N/A"}</p>
              <p>🏷️ <span className="font-medium">Category:</span> {doctor.category || "N/A"}</p>
              <p>📞 <span className="font-medium">Phone:</span> {doctor.phone || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
      {doctor.schedules && doctor.schedules.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">📅 Schedules</h2>
          <ul className="space-y-2">
            {doctor.schedules.map((s) => (
              <li key={s.id} className="p-3 bg-gray-100 rounded-md shadow-sm">
                <div>🗓️ {s.date} — 🕐 {s.start} — 🕐 {s.end} — {s.status}</div>
                <button onClick={() => handleBook(s.id)}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Book now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
