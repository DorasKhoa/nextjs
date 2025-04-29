import { useState } from "react";
import { updateRequirement } from "@/services/requirementService";
import toast from "react-hot-toast";

interface EditRequirementModalProps {
  requirement: any;
  onClose: () => void;
  onUpdated: () => void;
}

const EditRequirementModal = ({ requirement, onClose, onUpdated }: EditRequirementModalProps) => {
  const [name, setName] = useState(requirement.name || "");
  const [instruction, setInstruction] = useState(requirement.instruction || "");
  const [quantity, setQuantity] = useState(requirement.quantity || 1);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateRequirement(requirement._id, { name, instruction, quantity });
      toast.success("Requirement updated!");
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update requirement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Requirement</h2>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Machine Name</label>
          <input
            type="text"
            className="border rounded px-3 py-1 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Instruction</label>
          <input
            type="text"
            className="border rounded px-3 py-1 w-full"
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            className="border rounded px-3 py-1 w-full"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRequirementModal;
