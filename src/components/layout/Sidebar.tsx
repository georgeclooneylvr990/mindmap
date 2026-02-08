"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/entries", label: "All Entries", icon: "📋" },
  { href: "/entries/new", label: "Add Entry", icon: "➕" },
  { href: "/influential", label: "Most Influential", icon: "⭐" },
  { href: "/summaries", label: "Monthly Summaries", icon: "📊" },
  { href: "/themes", label: "Theme Map", icon: "🗺️" },
  { href: "/search", label: "Search", icon: "🔍" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
        aria-label="Toggle navigation"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-400 z-40 transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-white text-lg font-semibold">Intellectual Diary</h1>
          <p className="text-slate-500 text-sm mt-1">Your mind, mapped</p>
        </div>

        <nav className="mt-4 px-3">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors text-sm
                  ${
                    isActive
                      ? "bg-indigo-600/20 text-white font-medium"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
