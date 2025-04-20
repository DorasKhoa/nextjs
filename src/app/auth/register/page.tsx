"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/authService";
import toast from "react-hot-toast";
import { getToken } from "@/lib/auth";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = getToken();
        if(token) router.push('/client')
    },[router])

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            toast.success("Register successfully! Please Login to continue");
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-8">Register</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 border-b border-gray-300 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full py-3 rounded text-white font-semibold bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                        Register
                    </button>
                </form>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        </div>
    );
}
