'use client';
import Link from "next/link";
import Header from "@/components/Header";

export default function HeroPage() {
  return (
    <>
    <Header />
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-200 via-purple-100 to-blue-100 text-center px-4">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Client Homepage</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a type specimen
        book.
      </p>
      <div className="flex gap-4">
        <Link href='/client/doctors'>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
            Book now
          </button>
        </Link>
        <Link href='/client/medicines'>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
            Medicine
          </button>
        </Link>
      </div>
    </main>
    </>
  );
}
