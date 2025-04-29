'use client'

import { useState } from "react";
import { createDepartment } from "@/services/departmentService";
import toast from "react-hot-toast";

interface AddDepartmentModalProps {
  centerId: string;
  onClose: () => void;
  onAdded: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ centerId, onClose, onAdded }) => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }
  
    try {
      await createDepartment(centerId, { name });
      toast.success("Department created successfully!");
      onClose();
      onAdded(); // reload lại danh sách
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add department failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Department</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg font-bold">✖</button>
        </div>

        <input
          className="border px-3 py-2 rounded w-full mb-4"
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
          >
            Add Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentModal;
