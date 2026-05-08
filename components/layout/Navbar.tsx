"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Palette } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/paints", label: "Paints" },
  { href: "/convert", label: "Converter" },
  { href: "/recipes", label: "Recipes" },
  { href: "/inventory", label: "My Collection" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-iron-900 border-b border-iron-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link
          href="/"
          className="flex items-center gap-2 text-bone-200 hover:text-bone-100 transition-colors"
          style={{ fontFamily: "Georgia,serif" }}
        >
          <Palette className="w-5 h-5 text-blood-400" />
          <span className="text-lg font-semibold">Battle Palette</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  active ? "bg-iron-700 text-bone-100" : "text-iron-200 hover:text-bone-200 hover:bg-iron-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden p-2 text-iron-300 hover:text-bone-200 transition-colors rounded"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-iron-700 bg-iron-900 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  active ? "bg-iron-700 text-bone-100" : "text-iron-200 hover:text-bone-200 hover:bg-iron-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
