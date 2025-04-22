import React, { useEffect, useState } from 'react';
import { fetchAllUsers, updateUserById } from '@/services/userService';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';
import CreateUserCard from './CreateUserCard';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        address: '',
        category: ''
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchAllUsers();
                setUsers(fetchedUsers);
            } catch (err: any) {
                setError(err.message);
                toast.error(`Failed to load users: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormValues({
            name: user.name || '',
            phone: user.phone?.toString() || '',
            address: user.address || '',
            category: user.category || ''
        });
        setSelectedFile(null);
        setPreviewUrl(user.avatar || '/defaultavatar.jpg');
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!editingUser) return;

        const savingToast = toast.loading('Saving user...');
        try {
            const formData = new FormData();
            formData.append('name', formValues.name);
            formData.append('address', formValues.address);
            formData.append('category', formValues.category);

            if (formValues.phone) {
                formData.append('phone', String(Number(formValues.phone)));
            }

            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }

            const message = await updateUserById(editingUser._id, formData);
            toast.success(message || 'User updated successfully!', { id: savingToast });

            setEditingUser(null);
            setFormValues({ name: '', phone: '', address: '', category: '' });
            setSelectedFile(null);
            setPreviewUrl(null);

            const updatedUsers = await fetchAllUsers();
            setUsers(updatedUsers);
        } catch (err: any) {
            toast.error(err.message || 'Update failed', { id: savingToast });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };


    return (

        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <CreateUserCard onSuccess={async () => {
                const updated = await fetchAllUsers();
                setUsers(updated);
            }} />
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <div
                            key={user._id}
                            className="border border-gray-300 p-4 rounded-lg shadow hover:shadow-md transition flex flex-col items-center"
                        >
                            <img
                                src={user.avatar || '/defaultavatar.jpg'}
                                alt="avatar"
                                className="w-16 h-16 rounded-full object-cover mb-2"
                            />
                            <h2 className="text-lg font-semibold">Name: {user.name}</h2>
                            <h2 className="text-lg font-semibold">Role: {user.role}</h2>
                            <p className="text-sm text-gray-600">Email: {user.email}</p>
                            <p className="text-sm text-gray-600">Category: {user.category || 'N/A'}</p>
                            <button
                                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={() => openEditModal(user)}
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <div className="space-y-3">
                            <div className="flex flex-col items-center">
                                <img
                                    src={previewUrl || '/images/defaultavatar.jpg'}
                                    alt="avatar preview"
                                    className="w-24 h-24 rounded-full object-cover mb-2"
                                />
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone Number</label>
                                <input
                                    name="phone"
                                    type="number"
                                    value={formValues.phone}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <input
                                    name="address"
                                    value={formValues.address}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Category</label>
                                <input
                                    name="category"
                                    value={formValues.category}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded"
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end space-x-2">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setEditingUser(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
