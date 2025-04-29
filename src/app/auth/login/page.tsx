'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { getToken, saveToken } from "@/lib/auth";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Token } from "@/types/token";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.push('/client');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      saveToken(data.access_token);
      toast.success('Login successfully!');

      const decode: Token = jwtDecode(data.access_token);
      const role = decode.role;

      if(role === 'ADMIN') {
        router.push('/admin/user');
      } else if (role === 'DOCTOR') {
        router.push('/doctor/profile');
      } else if (role === 'STAFF') {
        router.push('/staff/profile');
      } else {
        router.push('/client');
      }
    } catch (err) {
      setError("Email or Password is wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
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
            className="w-full py-3 rounded text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
