'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 via-purple-100 to-blue-100 text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Hospital management</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a type specimen
        book.
      </p>
      <div className="flex gap-4">
        <Link href='/auth/login'>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium">
            Login
          </button>
        </Link>
        <Link href='/auth/register'>
          <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium">
            Register
          </button>
        </Link>
      </div>
    </main>
  );
}
