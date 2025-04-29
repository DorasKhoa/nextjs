'use client'

import { useState } from "react";
import { createCenter } from "@/services/centerService";
import { NewCenter } from "@/types/center";

interface CreateCenterFormProps {
    onSuccess: () => void;
}

const CreateCenterForm = ({ onSuccess }: CreateCenterFormProps) => {
    const [local, setLocal] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const newCenter: NewCenter = {
                local,
                contact
            };
            await createCenter(newCenter);
            setSuccess(true);
            setLocal("");
            setContact("");
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border rounded-md p-6 shadow-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">➕ Create New Center</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Location"
                    className="w-full border p-2 rounded"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Contact"
                    className="w-full border p-2 rounded"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition-all disabled:bg-gray-400"
                >
                    {loading ? "Creating..." : "Create"}
                </button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">Center created successfully!</p>}
            </form>
        </div>
    );
};

export default CreateCenterForm;
