import { useState } from "react";

interface CreateScheduleCardProps {
  onCreate: (data: { date: string; start: string; end: string }) => void;
  loading?: boolean;
}

const CreateScheduleCard = ({ onCreate, loading }: CreateScheduleCardProps) => {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !start || !end) return;
    onCreate({ date, start, end });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Create Schedule</h2>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all font-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Schedule"}
        </button>
      </form>
    </div>
  );
};

export default CreateScheduleCard; 