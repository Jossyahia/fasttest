"use client";

import { useSession } from "next-auth/react";
import { Bell, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-4 py-4">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6 text-gray-600" />
          </button>
          <div className="relative">
            <button className="flex items-center space-x-3 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-gray-700">{session?.user?.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
