import React from "react";

interface SelectDoctorModalProps {
  doctors: { _id: string; name: string; email: string; avatar?: string }[];
  onSelect: (doctorId: string) => void;
  onClose: () => void;
}

const SelectDoctorModal = ({ doctors, onSelect, onClose }: SelectDoctorModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Select Doctor</h2>
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {doctors.length === 0 && <div className="text-gray-500 italic">No doctors in this center.</div>}
          {doctors.map((doc) => (
            <button
              key={doc._id}
              className="flex items-center w-full p-2 border rounded hover:bg-blue-50 transition-all"
              onClick={() => onSelect(doc._id)}
            >
              {doc.avatar && (
                <img src={doc.avatar} alt={doc.name} className="w-8 h-8 rounded-full mr-3" />
              )}
              <div className="text-left">
                <div className="font-semibold">{doc.name}</div>
                <div className="text-sm text-gray-500">{doc.email}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDoctorModal; 