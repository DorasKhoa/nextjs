"use client";
import React, { useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation"; 
import toast from "react-hot-toast";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Log out success!')
    router.push("/");
  };

    return (
        <header className="bg-blue-400 text-white px-6 py-4 shadow-md">
            <div className="flex items-center justify-between">
                {/* Bên trái: Logo / Tên hệ thống */}
                <h1 className="text-xl font-bold text-white-400">Hospital Management</h1>

                {/* Bên phải: Navbar */}
                <div className="flex gap-6 items-center">
                    <Link href="/client" className="hover:underline text-yellow-400 font-medium">
                        Home
                    </Link>
                    <Link href="/client/doctors" className="hover:underline">
                        Doctor
                    </Link>
                    <Link href="/client/medicines" className="hover:underline">
                        Medicine
                    </Link>
                    <Link href="/client/news" className="hover:underline">
                        News
                    </Link>
                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-blue-600 border text-white px-3 py-1 rounded"
                        >
                            Menu
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-blue-800 rounded shadow-lg z-10">
                                <ul className="text-sm">
                                    <li>
                                        <Link
                                            href="/client/profile"
                                            className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/client/order"
                                            className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            Order
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/client/cart"
                                            className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/client/check"
                                            className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                        >
                                            Payment history
                                        </Link>
                                    </li>
                                    <hr className="border-gray-600 my-1" />
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white font-semibold cursor-pointer"
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
