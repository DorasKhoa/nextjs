import React, { useState } from 'react';
import { createUser, fetchAllUsers } from '@/services/userService';
import { toast } from 'react-hot-toast';

interface Props {
  onSuccess?: () => void;
}

const CreateUserCard: React.FC<Props> = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    category: '',
    fees: '',
    role: 'USER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async () => {
    const toastId = toast.loading('Creating user...');
    try {
      const msg = await createUser(form);
      toast.success(msg, { id: toastId });

      setForm({ name: '', email: '', password: '', category: '', fees: '', role: 'USER' });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Create failed', { id: toastId });
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md space-y-3 max-w-md mb-6">
      <h2 className="text-xl font-bold">➕ Create New Account</h2>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      />
      <input
        name="fees"
        placeholder="Fees"
        value={form.fees}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="w-full border px-3 py-1 rounded"
      >
        <option value="DOCTOR">Doctor</option>
        <option value="ADMIN">Admin</option>
        <option value="STAFF">Staff</option>
      </select>

      <button
        onClick={handleCreate}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Create
      </button>
    </div>
  );
};

export default CreateUserCard;
