"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/paints", label: "Paints" },
  { href: "/convert", label: "Converter" },
  { href: "/recipes", label: "Recipes" },
  { href: "/inventory", label: "My Collection" },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="bg-iron-900 border-b border-iron-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 text-bone-200 text-lg hover:text-bone-100 transition-colors" style={{fontFamily:'Georgia,serif'}}>
          <span className="text-blood-400">⬡</span>
          <span>Paint Hub</span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${active ? "bg-iron-700 text-bone-100" : "text-iron-200 hover:text-bone-200 hover:bg-iron-800"}`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
