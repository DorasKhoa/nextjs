'use client';

import { useEffect, useState } from "react";
import { DoctorSummary } from "@/types/doctor";
import { fetchDoctors } from "@/services/doctorService";
import Header from "@/components/Header";
import Link from "next/link";

export default function DoctorListPage() {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Doctor List:</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <Link href={`/client/doctors/${doc.id}`} key={doc.id}>
              <div className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition-all flex items-center gap-4">
                <img
                  src={doc.avatar || "/defaultavatar.jpg"}
                  alt={doc.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{doc.name}</h2>
                  <p className="text-gray-600">💰 {doc.fees.toLocaleString()} $</p>
                  {doc.category && (
                    <p className="text-gray-500 text-sm">🏷️ Category: {doc.category}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
