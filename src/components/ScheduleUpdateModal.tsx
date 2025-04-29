import { useState } from "react";
import { updateSchedule } from "@/services/scheduleService";
import toast from "react-hot-toast";

interface ScheduleUpdateModalProps {
  schedule: {
    _id: string;
    date: string;
    start: string;
    end: string;
  };
  onClose: () => void;
  onUpdated: () => void;
  loading?: boolean;
}

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

function toISODate(dateStr: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return dateStr;
  const [_, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

const ScheduleUpdateModal = ({ schedule, onClose, onUpdated, loading }: ScheduleUpdateModalProps) => {
  const [date, setDate] = useState(schedule.date);
  const [start, setStart] = useState(schedule.start);
  const [end, setEnd] = useState(schedule.end);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start24 = to24Hour(start);
    const end24 = to24Hour(end);
    const dateISO = toISODate(date);
    console.log('Update schedule:', { date: dateISO, start: start24, end: end24 });
    setUpdating(true);
    try {
      await updateSchedule(schedule._id, { date: dateISO, start: start24, end: end24 });
      toast.success("Schedule updated!");
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update schedule");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Update Schedule</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="border rounded px-3 py-2 w-full"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Start Time</label>
              <input
                type="time"
                className="border rounded px-3 py-2 w-full"
                value={start}
                onChange={e => setStart(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">End Time</label>
              <input
                type="time"
                className="border rounded px-3 py-2 w-full"
                value={end}
                onChange={e => setEnd(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
              disabled={updating || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={updating || loading}
            >
              {updating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleUpdateModal; 