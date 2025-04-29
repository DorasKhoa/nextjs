import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Newspaper } from "lucide-react";

export default function StaffSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const navItems = [
    { label: "Profile", href: "/staff/profile", icon: <User size={18} /> },
    { label: "News", href: "/staff/news", icon: <Newspaper size={18} /> },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-700 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-6">Staff Dashboard</h2>
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

        <div className="mt-auto pt-6">
          {/* Avatar Staff (placeholder) */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-white text-blue-700 font-bold flex items-center justify-center">
              S
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
} 