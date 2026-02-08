"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: "\u25C7" },
  { href: "/entries", label: "All entries", icon: "\u2261" },
  { href: "/entries/new", label: "New entry", icon: "+" },
  { href: "/influential", label: "Most influential", icon: "\u2605" },
  { href: "/summaries", label: "Summaries", icon: "\u25A1" },
  { href: "/themes", label: "Themes", icon: "\u25CE" },
  { href: "/search", label: "Search", icon: "\u2315" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1714] text-[#a89f94] p-2.5 rounded-lg shadow-lg"
        aria-label="Toggle navigation"
      >
        <span className="text-lg font-light">{isOpen ? "\u00D7" : "\u2630"}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1714] z-40 transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6 border-b border-[#2d2822]">
          <h1 className="text-[#f5e6d0] text-lg font-semibold tracking-tight">
            Mindmap
          </h1>
          <p className="text-[#6b6157] text-xs mt-1 tracking-wide uppercase">
            Your intellectual diary
          </p>
        </div>

        <nav className="mt-6 px-4">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all text-sm
                  ${
                    isActive
                      ? "bg-[#c47a2b]/15 text-[#f5e6d0] font-medium"
                      : "text-[#a89f94] hover:bg-[#2d2822] hover:text-[#d4cbc0]"
                  }`}
              >
                <span className="w-5 text-center text-base opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2d2822]">
          <p className="text-[#6b6157] text-xs text-center">
            Track what shapes your thinking
          </p>
        </div>
      </aside>
    </>
  );
}
