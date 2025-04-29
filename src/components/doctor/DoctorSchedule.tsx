import React, { useEffect, useState } from 'react';
import { Schedule } from '@/types/schedule';
import { fetchAllSchedules } from '@/services/scheduleService';
import { doctorProfile } from '@/services/doctorService';

const DoctorSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const doctor = await doctorProfile();
        setDoctorId(doctor._id);
        const allSchedules = await fetchAllSchedules();
        const mySchedules = allSchedules.filter(sch => sch.doctor?._id === doctor._id);
        setSchedules(mySchedules);
      } catch (err: any) {
        setError(err.message || 'Failed to load schedules');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading schedules...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Schedule</h2>
      {schedules.length === 0 ? (
        <p>Your schedule is empty</p>
      ) : (
        <div className="grid gap-4">
          {schedules.map(sch => (
            <div key={sch._id} className="bg-white shadow p-4 rounded">
              <p><strong>Date:</strong> {sch.date}</p>
              <p><strong>Time:</strong> {sch.start} - {sch.end}</p>
              <p><strong>Status:</strong> {sch.status}</p>
              <p><strong>Client:</strong> {sch.user?.name || sch.user?.email || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule; 