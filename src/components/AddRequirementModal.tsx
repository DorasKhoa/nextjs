'use client'

import { useEffect, useState } from "react";
import { addRequirement } from "@/services/requirementService"; // file này chứa hàm bạn gửi
import { Requirement } from "@/types/requirement";
import toast from "react-hot-toast";

interface AddRequirementModalProps {
    centerId: string;
    onClose: () => void;
    onAdded: () => void; // để reload lại center sau khi add
}

const AddRequirementModal: React.FC<AddRequirementModalProps> = ({ centerId, onClose, onAdded }) => {
    const [name, setName] = useState("");
    const [instruction, setInstruction] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleAdd = async () => {
        if (!name.trim()) {
            toast.error("Machine name is required!");
            return;
        }
    
        try {
            await addRequirement(centerId, {
                name,
                instruction,
                quantity,
            });
    
            toast.success("Requirement added successfully!");
            onClose();
            onAdded();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Add failed");
        }
    };
    


    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add Requirement</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-lg font-bold">✖</button>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Machine Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="border px-3 py-2 rounded"
                        placeholder="Instruction"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                    />
                    <input
                        type="number"
                        className="border px-3 py-2 rounded"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min={1}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                    >
                        Add Requirement
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddRequirementModal;
