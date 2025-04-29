'use client';

import { useEffect, useState, useRef } from 'react';
import { doctorProfile, updateDoctor } from '@/services/doctorService';
import { Doctor } from '@/types/doctor';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

export default function StaffProfile() {
    const [staff, setStaff] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editStaff, setEditStaff] = useState<Doctor | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await doctorProfile();
                setStaff(data);
                setEditStaff(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
        setEditStaff(staff);
        setPreviewAvatar(null);
        setSelectedAvatar(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditStaff(staff);
        setPreviewAvatar(null);
        setSelectedAvatar(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editStaff) return;
        const { name, value } = e.target;
        setEditStaff({ ...editStaff, [name]: value });
    };

    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedAvatar(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewAvatar(previewUrl);
        }
    };

    const handleSave = async () => {
        if (!editStaff) return;
        setSaving(true);
        setSaveError(null);
        try {
            const form = new FormData();
            form.append('phone', editStaff.phone !== undefined && editStaff.phone !== null ? String(editStaff.phone) : '');
            form.append('address', editStaff.address !== undefined && editStaff.address !== null ? String(editStaff.address) : '');
            form.append('dob', editStaff.dob !== undefined && editStaff.dob !== null ? String(editStaff.dob) : '');
            if (selectedAvatar) {
                form.append('avatar', selectedAvatar);
            }
            await updateDoctor(form);
            toast.success('Update profile successfully')
            // Sau khi update thành công, reload lại profile
            const data = await doctorProfile();
            setStaff(data);
            setEditStaff(data);
            setIsEditing(false);
            setPreviewAvatar(null);
            setSelectedAvatar(null);
        } catch (err: any) {
            setSaveError(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!staff) return null;

    const displayStaff = isEditing && editStaff ? editStaff : staff;
    const avatarSrc = previewAvatar || displayStaff.avatar || '/defaultavatar.jpg';

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div 
                            className={`relative w-32 h-32 rounded-full overflow-hidden group ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={handleAvatarClick}
                        >
                            <Image
                                src={avatarSrc}
                                alt={displayStaff.name}
                                fill
                                className="object-cover"
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" size={24} />
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        {isEditing && (
                            <p className="text-sm text-gray-500 text-center mt-2">Click to change avatar</p>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">{displayStaff.name}</h1>
                            {!isEditing && (
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Email</h2>
                                <p className="text-lg">{displayStaff.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Phone</h2>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={editStaff?.phone || ''}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    <p className="text-lg">{displayStaff.phone || 'N/A'}</p>
                                )}
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Address</h2>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={editStaff?.address || ''}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    <p className="text-lg">{displayStaff.address || 'N/A'}</p>
                                )}
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Date of Birth</h2>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        value={editStaff?.dob || ''}
                                        onChange={handleChange}
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                ) : (
                                    <p className="text-lg">{displayStaff.dob || 'N/A'}</p>
                                )}
                            </div>
                            <div>
                                <h2 className="text-sm font-medium text-gray-500">Center</h2>
                                <p className="text-lg">{displayStaff.center?.local || 'N/A'}</p>
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex gap-2 mt-6">
                                <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                {saveError && <div className="text-red-500 ml-4 self-center">{saveError}</div>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 