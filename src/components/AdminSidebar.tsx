import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Users, CalendarClock, Pill, Home, Hospital } from "lucide-react"; // hoặc react-icons tùy bạn

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Users", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Schedules", href: "/admin/schedule", icon: <CalendarClock size={18} /> },
    { label: "Medicines", href: "/admin/medicines", icon: <Pill size={18} /> },
    { label: "Centers", href: "/admin/center", icon: <Hospital size={18} /> },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-700 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          <ul className="space-y-3">
            {navItems.map(({ label, href, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-600 transition ${
                    pathname === href ? "bg-blue-600 font-semibold" : ""
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Avatar Admin (placeholder) */}
        <div className="flex justify-center mt-10">
          <div className="w-10 h-10 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center">
            A
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
