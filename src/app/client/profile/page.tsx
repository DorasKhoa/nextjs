"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Client } from "@/types/client";
import { fetchProfile, updateClientProfile } from "@/services/clientService";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

const DEFAULT_AVATAR = "/defaultavatar.jpg";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const client = await fetchProfile();
        setFormData(client);
        setAvatarPreview(client.avatar || DEFAULT_AVATAR);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.phone !== undefined && isNaN(Number(formData.phone))) {
      toast.error("Phone must be a valid number!");
      return;
    }

    const shouldUploadAvatar = avatarFile !== null && avatarPreview !== DEFAULT_AVATAR;

    try {
      await updateClientProfile(formData, shouldUploadAvatar ? avatarFile : undefined);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-10 text-gray-900 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between mb-8 items-start">
            <h2 className="text-4xl font-bold text-blue-900">Update Profile</h2>
            <div className="text-center">
              <img
                src={avatarPreview}
                alt="Profile Picture"
                className="rounded-full w-32 h-32 mx-auto border-4 border-indigo-800 mb-4 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
              />
              <input type="file" id="upload_profile" hidden onChange={handleFileChange} />
              <label htmlFor="upload_profile" className="text-sm text-blue-700 cursor-pointer hover:underline">
                Change Profile Picture
              </label>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <InputField label="Name" name="name" value={formData.name || ""} onChange={handleChange} />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly
            />
            <InputField label="Password" name="password" type="password" value={formData.password || ""} onChange={handleChange} />
            <InputField label="Address" name="address" value={formData.address || ""} onChange={handleChange} />
            <InputField label="Phone" name="phone" type="tel" value={formData.phone?.toString() || ""} onChange={handleChange} />
            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob || ""} onChange={handleChange} />

            <div className="flex justify-between items-center pt-4">
              {/* Nút Back trái */}
              <button
                type="button"
                onClick={() => router.push("/client")}
                className="px-4 py-2 bg-white text-indigo-800 border border-indigo-800 rounded-lg hover:bg-indigo-50 transition"
              >
                ⬅ Back to Home Page
              </button>

              {/* Nhóm nút phải */}
              <div className="flex space-x-4">
                <button
                  type="reset"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  readOnly,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${readOnly ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
          }`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}
